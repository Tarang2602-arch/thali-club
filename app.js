import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_KEY, GROUP_NAME, GROUP_SIZE, DEFAULT_TIME, WHATSAPP_GROUP_LINK } from "./config.js";
import { RESTAURANTS, CUISINES, AREAS, mapsSearchUrl, mapsDirectionsUrl, mapsEmbedUrl, menuUrl } from "./restaurants.js";

const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

/* ---------- helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pad = (n) => String(n).padStart(2, "0");
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseDay = (iso) => { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d); };
const todayIso = () => ymd(new Date());
const fmtDay = (iso, opts = { weekday: "short", day: "numeric", month: "short" }) => parseDay(iso).toLocaleDateString("en-IN", opts);
const fmtDayLong = (iso) => fmtDay(iso, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const fmtTime = (t) => {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${pad(m)} ${h >= 12 ? "PM" : "AM"}`;
};
const monthName = (pid) => { const [y, m] = pid.split("-").map(Number); return new Date(y, m - 1, 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" }); };
const monthShort = (pid) => { const [y, m] = pid.split("-").map(Number); return new Date(y, m - 1, 1).toLocaleDateString("en-IN", { month: "long" }); };
const shiftMonth = (pid, delta) => { const [y, m] = pid.split("-").map(Number); const d = new Date(y, m - 1 + delta, 1); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`; };
const byId = (id) => RESTAURANTS.find((r) => r.id === id);
const COLORS = ["#E8833A", "#2F6B4F", "#C2410C", "#7C3AED", "#0E7490", "#B45309", "#BE185D", "#4D7C0F"];
const colorFor = (name) => { let h = 0; for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0; return COLORS[h % COLORS.length]; };
const initials = (name) => name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
const avatar = (name, cls = "") => `<span class="av ${cls}" style="--c:${colorFor(name)}" title="${esc(name)}">${esc(initials(name))}</span>`;
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
};

/* ---------- state ---------- */
const params = new URLSearchParams(location.search);
const initialPlan = /^\d{4}-\d{2}$/.test(params.get("m") || "") ? params.get("m") : todayIso().slice(0, 7);

const state = {
  me: store.get("thaliclub.me"),
  planId: initialPlan,
  members: [],
  dateVotes: [],
  restVotes: [],
  messages: [],
  plan: null,
  step: null,
  cuisine: "All",
  area: "All areas",
  sort: "votes",
  jainOnly: false,
  shown: 24,
  search: "",
  unread: 0,
  channel: null,
  loaded: false,
};

/* ---------- data ---------- */
async function fetchTable(table) {
  const pid = state.planId;
  if (table === "members") {
    const { data, error } = await sb.from("members").select("*").order("joined_at");
    if (!error) state.members = data;
    return error;
  }
  if (table === "date_votes") {
    const { data, error } = await sb.from("date_votes").select("*").eq("plan_id", pid);
    if (!error && pid === state.planId) state.dateVotes = data;
    return error;
  }
  if (table === "restaurant_votes") {
    const { data, error } = await sb.from("restaurant_votes").select("*").eq("plan_id", pid);
    if (!error && pid === state.planId) state.restVotes = data;
    return error;
  }
  if (table === "messages") {
    const { data, error } = await sb.from("messages").select("*").eq("plan_id", pid).order("created_at").limit(500);
    if (!error && pid === state.planId) state.messages = data;
    return error;
  }
  if (table === "plans") {
    const { data, error } = await sb.from("plans").select("*").eq("plan_id", pid).maybeSingle();
    if (!error && pid === state.planId) handlePlanChange(data);
    return error;
  }
}

async function loadAll() {
  const errors = await Promise.all(["members", "date_votes", "restaurant_votes", "messages", "plans"].map(fetchTable));
  const err = errors.find(Boolean);
  $("#chatSub").textContent = err ? "Offline — retrying…" : "Live with everyone";
  if (err) console.error(err);
  state.loaded = true;
}

function subscribe() {
  if (state.channel) sb.removeChannel(state.channel);
  const pid = state.planId;
  const refetch = (t) => fetchTable(t).then(renderAll);
  state.channel = sb
    .channel(`plan-${pid}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "members" }, () => refetch("members"))
    .on("postgres_changes", { event: "*", schema: "public", table: "date_votes" }, () => refetch("date_votes"))
    .on("postgres_changes", { event: "*", schema: "public", table: "restaurant_votes" }, () => refetch("restaurant_votes"))
    .on("postgres_changes", { event: "*", schema: "public", table: "plans", filter: `plan_id=eq.${pid}` }, () => refetch("plans"))
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `plan_id=eq.${pid}` }, ({ new: m }) => {
      if (addMessage(m) && m.member !== state.me) onIncomingMessage(m);
      renderChat();
    })
    .subscribe((status) => {
      $("#chatSub").textContent = status === "SUBSCRIBED" ? "Live with everyone" : "Connecting…";
    });
}

function addMessage(m) {
  if (state.messages.some((x) => x.id === m.id)) return false;
  state.messages.push(m);
  state.messages.sort((a, b) => a.created_at.localeCompare(b.created_at));
  return true;
}

function handlePlanChange(plan) {
  const wasFinal = state.plan?.finalized_at;
  const isFinal = plan?.finalized_at;
  state.plan = plan;
  if (!state.loaded) return;
  if (isFinal && isFinal !== wasFinal) {
    const r = byId(plan.restaurant_id);
    if (plan.finalized_by !== state.me) {
      toast(`🎉 ${plan.finalized_by} locked it in: ${r?.name} · ${fmtDay(plan.day)} · ${fmtTime(plan.time)}`, "good", 7000);
      notify(`${GROUP_NAME}: plan locked!`, `${r?.name} · ${fmtDay(plan.day)} at ${fmtTime(plan.time)}`);
      if (navigator.vibrate) navigator.vibrate([80, 60, 80]);
    }
    confetti();
    setStep(3);
  } else if (wasFinal && !isFinal && plan?.finalized_by !== state.me) {
    toast("🔓 The plan was re-opened — vote again!");
  }
}

/* ---------- actions ---------- */
async function toggleDate(day) {
  if (!requireMe()) return;
  const pid = state.planId;
  const mine = state.dateVotes.find((v) => v.member === state.me && v.day === day);
  if (mine) {
    state.dateVotes = state.dateVotes.filter((v) => v !== mine);
    renderAll();
    await sb.from("date_votes").delete().match({ plan_id: pid, member: state.me, day });
  } else {
    state.dateVotes.push({ plan_id: pid, member: state.me, day });
    renderAll();
    await sb.from("date_votes").insert({ plan_id: pid, member: state.me, day });
  }
  await fetchTable("date_votes");
  renderAll();
}

async function voteRestaurant(rid) {
  if (!requireMe()) return;
  const pid = state.planId;
  const mine = state.restVotes.find((v) => v.member === state.me);
  const same = mine?.restaurant_id === rid;
  state.restVotes = state.restVotes.filter((v) => v.member !== state.me);
  if (!same) state.restVotes.push({ plan_id: pid, member: state.me, restaurant_id: rid });
  renderAll();
  await sb.from("restaurant_votes").delete().match({ plan_id: pid, member: state.me });
  if (!same) {
    await sb.from("restaurant_votes").insert({ plan_id: pid, member: state.me, restaurant_id: rid });
    toast(`🗳️ You voted for ${byId(rid).name}`);
  }
  await fetchTable("restaurant_votes");
  renderAll();
}

async function sendMessage(body, kind = "chat") {
  const { data, error } = await sb.from("messages").insert({ plan_id: state.planId, member: state.me, body, kind }).select().single();
  if (error) { toast("Couldn't send — check your connection"); return; }
  addMessage(data);
  renderChat();
}

async function finalize({ day, time, restaurant_id, note }) {
  const row = { plan_id: state.planId, day, time, restaurant_id, note: note || null, finalized_by: state.me, finalized_at: new Date().toISOString() };
  const { error } = await sb.from("plans").upsert(row);
  if (error) { toast("Couldn't save the plan — try again"); console.error(error); return; }
  const r = byId(restaurant_id);
  await sendMessage(`🔒 ${state.me} locked it in: ${r.name} · ${fmtDay(day)} · ${fmtTime(time)}`, "system");
  handlePlanChange(row);
  toast("🔒 Locked in! Now send it to the WhatsApp group 👇", "good", 6000);
  renderAll();
  $("#waSend")?.scrollIntoView({ behavior: "smooth", block: "center" });
}

async function reopen() {
  if (!confirm("Re-open this month's plan so everyone can change votes?")) return;
  const { error } = await sb.from("plans").update({ finalized_at: null, finalized_by: state.me }).eq("plan_id", state.planId);
  if (error) { toast("Couldn't re-open — try again"); return; }
  await sendMessage(`🔓 ${state.me} re-opened the plan`, "system");
  await fetchTable("plans");
  renderAll();
}

async function join(name) {
  name = name.trim().replace(/\s+/g, " ").slice(0, 30);
  if (!name) return;
  const { error } = await sb.from("members").upsert({ name }, { onConflict: "name", ignoreDuplicates: true });
  if (error) { toast("Couldn't join — check your connection"); return; }
  state.me = name;
  store.set("thaliclub.me", name);
  $("#joinDialog").close();
  await fetchTable("members");
  renderAll();
  toast(`Welcome, ${name}! 👋`);
}

function requireMe() {
  if (state.me) return true;
  openJoin();
  return false;
}

/* ---------- derived ---------- */
function dateStats() {
  const map = new Map();
  for (const v of state.dateVotes) {
    if (!map.has(v.day)) map.set(v.day, []);
    map.get(v.day).push(v.member);
  }
  return map;
}
function bestDates(limit = 3) {
  const t = todayIso();
  return [...dateStats().entries()]
    .filter(([d]) => d >= t)
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
    .slice(0, limit);
}
function restStats() {
  const map = new Map();
  for (const v of state.restVotes) {
    if (!map.has(v.restaurant_id)) map.set(v.restaurant_id, []);
    map.get(v.restaurant_id).push(v.member);
  }
  return map;
}
function leaders() {
  const stats = restStats();
  const max = Math.max(0, ...[...stats.values()].map((a) => a.length));
  return max ? [...stats.entries()].filter(([, a]) => a.length === max).map(([id]) => id) : [];
}
const groupCount = () => Math.max(GROUP_SIZE, state.members.length);
const isFinal = () => Boolean(state.plan?.finalized_at);

/* ---------- rendering ---------- */
function renderAll() {
  renderHeader();
  renderMembers();
  renderStepper();
  renderCalendar();
  renderBest();
  renderCards();
  renderFinalize();
  renderBanner();
  renderChat();
}

function renderHeader() {
  $("#monthLabel").textContent = monthName(state.planId);
  const chip = $("#meChip");
  chip.hidden = !state.me;
  if (state.me) chip.innerHTML = `${avatar(state.me)}<span class="name">${esc(state.me)}</span>`;
  $("#notifyBtn").classList.toggle("on", "Notification" in window && Notification.permission === "granted");
  const m = monthShort(state.planId);
  $("#heroTitle").textContent = isFinal() ? `${m} is sorted 🎉` : `Where are we eating in ${m}?`;
  $("#heroSub").textContent = isFinal()
    ? "The plan is locked. Navigation, time and address are below — see you there!"
    : "Mark the days you're free, vote for a place, chat it out — then lock it in and tell the WhatsApp group.";
}

function renderMembers() {
  const row = $("#membersRow");
  const pills = state.members.map((m) => `<span class="member-pill">${avatar(m.name, "av-sm")}${esc(m.name)}${m.name === state.me ? " (you)" : ""}</span>`);
  const missing = Math.max(0, GROUP_SIZE - state.members.length);
  if (missing) pills.push(`<span class="member-pill ghost">+${missing} yet to join</span>`);
  row.innerHTML = pills.join("");
}

function setStep(n) {
  state.step = n;
  renderStepper();
}
function renderStepper() {
  if (state.step == null) {
    state.step = isFinal() ? 3 : state.dateVotes.some((v) => v.member === state.me) ? 2 : 1;
  }
  const doneDates = state.dateVotes.some((v) => v.member === state.me);
  const doneRest = state.restVotes.some((v) => v.member === state.me);
  $$(".step").forEach((b) => {
    const n = Number(b.dataset.step);
    b.classList.toggle("active", n === state.step);
    b.classList.toggle("done", n !== state.step && ((n === 1 && doneDates) || (n === 2 && doneRest) || (n === 3 && isFinal())));
    b.querySelector(".step-n").textContent = n !== state.step && ((n === 1 && doneDates) || (n === 2 && doneRest) || (n === 3 && isFinal())) ? "✓" : n;
  });
  $$(".panel").forEach((p) => (p.hidden = Number(p.dataset.panel) !== state.step));
}

function renderCalendar() {
  const [y, m] = state.planId.split("-").map(Number);
  const first = new Date(y, m - 1, 1);
  const days = new Date(y, m, 0).getDate();
  const offset = (first.getDay() + 6) % 7;
  const stats = dateStats();
  const t = todayIso();
  const total = groupCount();
  const memberCount = state.members.length;
  const locked = isFinal();
  let html = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => `<div class="cal-dow">${d}</div>`).join("");
  for (let i = 0; i < offset; i++) html += `<div class="day empty"></div>`;
  for (let d = 1; d <= days; d++) {
    const iso = `${y}-${pad(m)}-${pad(d)}`;
    const voters = stats.get(iso) || [];
    const mine = voters.includes(state.me);
    const dow = (offset + d - 1) % 7;
    const everyone = memberCount >= 2 && voters.length >= memberCount;
    const past = iso < t;
    const chosen = locked && state.plan.day === iso;
    const cls = ["day", dow >= 5 && "weekend", mine && "mine", everyone && "everyone", iso === t && "today", chosen && "mine everyone"].filter(Boolean).join(" ");
    const faces = voters.slice(0, 4).map((n) => avatar(n, "av-sm")).join("");
    html += `<button class="${cls}" data-day="${iso}" ${past || locked ? "disabled" : ""} aria-pressed="${mine}" aria-label="${fmtDay(iso)}: ${voters.length} free">
      <span class="day-num">${d}</span>
      ${voters.length ? `<span class="av-stack">${faces}</span><span class="day-count">${voters.length}/${total}</span>` : ""}
      <span class="heat" style="--h:${voters.length / total}"></span>
    </button>`;
  }
  $("#calendar").innerHTML = html;
}

function renderBest() {
  const best = bestDates();
  const el = $("#bestDates");
  if (!best.length) {
    el.innerHTML = `<div class="empty-state">No dates picked yet — be the first! 👆</div>`;
    return;
  }
  const total = groupCount();
  el.innerHTML = `<div class="best-title">Best dates so far</div>` + best.map(([d, who], i) => `
    <div class="best-row ${i === 0 ? "top" : ""}">
      <div><b>${fmtDay(d, { weekday: "long", day: "numeric", month: "short" })}</b></div>
      <div class="meta"><span class="av-stack">${who.map((n) => avatar(n, "av-sm")).join("")}</span>${who.length}/${total} free</div>
    </div>`).join("");
}

function galleryHtml(r) {
  const imgs = r.photos.slice(0, 4);
  return `<div class="gallery">
    <div class="gallery-track">${imgs.map((src, i) => `<img src="${src}" alt="${esc(r.name)} photo ${i + 1}" loading="lazy" referrerpolicy="no-referrer" />`).join("")}</div>
    ${imgs.length > 1 ? `<button class="gallery-btn prev" aria-label="Previous photo">‹</button><button class="gallery-btn next" aria-label="Next photo">›</button>
    <div class="gallery-dots">${imgs.map((_, i) => `<i class="${i ? "" : "on"}"></i>`).join("")}</div>` : ""}
    <span class="jain-badge ${r.jain}">${{ sattvic: "100% NO ONION/GARLIC", jain: "JAIN ✓", ask: "ASK FOR JAIN" }[r.jain]}</span>
    ${r.pureVeg ? "" : `<span class="veg-badge">VEG + NON-VEG</span>`}
  </div>`;
}

function renderCards() {
  $("#cuisineChips").innerHTML = CUISINES.map((c) => `<button class="chip ${c === state.cuisine ? "active" : ""}" data-cuisine="${esc(c)}">${esc(c)}</button>`).join("");
  const norm = (t) => t.toLowerCase().replace(/[^a-z0-9 ]/g, "");
  const q = norm(state.search.trim());
  const stats = restStats();
  const lead = leaders();
  const myVote = state.restVotes.find((v) => v.member === state.me)?.restaurant_id;
  const all = RESTAURANTS.filter((r) =>
    (state.cuisine === "All" || r.cuisine.includes(state.cuisine)) &&
    (state.area === "All areas" || r.area === state.area) &&
    (!state.jainOnly || r.jain !== "ask") &&
    (!q || norm(`${r.name} ${r.area} ${r.cuisine.join(" ")} ${r.tagline} ${r.picks.join(" ")}`).includes(q)));
  const votes = (r) => stats.get(r.id)?.length || 0;
  const sorters = {
    votes: (a, b) => votes(b) - votes(a),
    priceAsc: (a, b) => a.price - b.price,
    priceDesc: (a, b) => b.price - a.price,
    name: (a, b) => a.name.localeCompare(b.name),
  };
  all.sort(sorters[state.sort] || sorters.votes);
  const list = all.slice(0, state.shown);
  $("#resultCount").textContent = `Showing ${list.length} of ${all.length} restaurant${all.length === 1 ? "" : "s"}`;
  $("#showMore").hidden = all.length <= state.shown;
  $("#showMore").textContent = `Show more (${all.length - list.length} left)`;
  if (!list.length) {
    $("#cards").innerHTML = `<div class="empty-state">No matches. Try another filter.</div>`;
    return;
  }
  // Keep cards in place (no reshuffle) but preserve gallery scroll positions.
  const scrolls = {};
  $$("#cards .card").forEach((c) => (scrolls[c.dataset.id] = c.querySelector(".gallery-track")?.scrollLeft || 0));
  $("#cards").innerHTML = list.map((r) => {
    const voters = stats.get(r.id) || [];
    const mine = myVote === r.id;
    return `<article class="card ${mine ? "voted" : ""} ${lead.includes(r.id) ? "leader" : ""}" data-id="${r.id}">
      ${galleryHtml(r)}
      <div class="card-body">
        <div class="card-top"><h3>${esc(r.name)}</h3><span class="price">₹${r.price.toLocaleString("en-IN")} for 2</span></div>
        <div class="muted" style="font-size:14px">${esc(r.tagline)}</div>
        <div class="card-meta">📍 ${esc(r.area)} ${r.cuisine.map((c) => `<span class="tag">${esc(c)}</span>`).join("")}</div>
        <div class="link-row">
          <button class="link-btn" data-detail="${r.id}">Details & menu</button>
          <a class="link-btn" href="${mapsDirectionsUrl(r)}" target="_blank" rel="noopener">🧭 Navigate</a>
          <a class="link-btn" href="${mapsSearchUrl(r)}" target="_blank" rel="noopener">📸 Real photos</a>
        </div>
        <div class="card-actions">
          <div class="voters">${voters.length ? `<span class="av-stack">${voters.map((n) => avatar(n, "av-sm")).join("")}</span>${voters.length} vote${voters.length > 1 ? "s" : ""}` : "No votes yet"}</div>
          <button class="btn btn-sm vote-btn ${mine ? "on" : ""}" data-vote="${r.id}" ${isFinal() ? "disabled" : ""}>${mine ? "✓ Your pick" : "Vote"}</button>
        </div>
      </div>
    </article>`;
  }).join("");
  $$("#cards .card").forEach((c) => { const t = c.querySelector(".gallery-track"); if (t && scrolls[c.dataset.id]) t.scrollLeft = scrolls[c.dataset.id]; });
}

function openDetail(id) {
  const r = byId(id);
  const voters = restStats().get(id) || [];
  const mine = state.restVotes.find((v) => v.member === state.me)?.restaurant_id === id;
  $("#detailBody").className = "detail";
  $("#detailBody").innerHTML = `
    <button class="icon-btn close-x" data-close aria-label="Close">✕</button>
    ${galleryHtml(r)}
    <div class="detail-inner">
      <div>
        <h2>${esc(r.name)}</h2>
        <div class="muted">${esc(r.tagline)} · ₹${r.price.toLocaleString("en-IN")} for 2 (approx.)</div>
        <div class="card-meta" style="margin-top:8px">${r.cuisine.map((c) => `<span class="tag">${esc(c)}</span>`).join("")}${r.vibe ? `<span class="tag">✨ ${esc(r.vibe)}</span>` : ""}${r.pureVeg ? "" : `<span class="tag">⚠️ Also serves non-veg</span>`}</div>
      </div>
      <div class="info-box">🥗 <b>No onion / no garlic:</b> ${esc(r.jainNote)}</div>
      <div class="detail-grid">
        <div>
          ${r.picks.length ? `<h3>Jain-friendly picks</h3><ul>${r.picks.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
          <div class="link-row" style="margin-top:10px"><a class="link-btn" href="${menuUrl(r)}" target="_blank" rel="noopener">📖 Full menu & prices</a></div>
          <h3 style="margin-top:16px">Address</h3>
          <p style="margin:0">${esc(r.address)}</p>
        </div>
        <iframe class="map-frame" src="${mapsEmbedUrl(r)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Map of ${esc(r.name)}"></iframe>
      </div>
      <div class="ticket-actions">
        <a class="btn btn-dark" href="${mapsDirectionsUrl(r)}" target="_blank" rel="noopener">🧭 Navigate</a>
        <a class="btn" href="${mapsSearchUrl(r)}" target="_blank" rel="noopener">📸 Photos & reviews</a>
        <button class="btn ${mine ? "btn-primary" : ""}" data-vote="${r.id}" ${isFinal() ? "disabled" : ""}>${mine ? "✓ Your pick" : "🗳️ Vote for this"} ${voters.length ? `(${voters.length})` : ""}</button>
      </div>
    </div>`;
  const dlg = $("#detailDialog");
  if (!dlg.open) dlg.showModal();
}

function buildWhatsAppText() {
  const p = state.plan;
  const r = byId(p.restaurant_id);
  const free = (dateStats().get(p.day) || []);
  const link = `${location.origin}${location.pathname}?m=${state.planId}`;
  return [
    `🍛 *${GROUP_NAME} — ${monthShort(state.planId)} plan is LOCKED!* 🔒`,
    ``,
    `📅 *${fmtDayLong(p.day)}*`,
    `⏰ *${fmtTime(p.time)}*`,
    `🍽️ *${r.name}* — ${r.tagline}`,
    `📍 ${r.address}`,
    `🧭 Navigate: ${mapsDirectionsUrl(r)}`,
    `🥗 Jain / no onion-garlic: ${r.jainNote}`,
    p.note ? `📝 ${p.note}` : null,
    free.length ? `✅ Free that day: ${free.join(", ")}` : null,
    ``,
    `Plan & chat: ${link}`,
  ].filter((l) => l !== null).join("\n");
}

function calendarUrl() {
  const p = state.plan;
  const r = byId(p.restaurant_id);
  const [h, mi] = (p.time || DEFAULT_TIME).split(":").map(Number);
  const start = parseDay(p.day); start.setHours(h, mi);
  const end = new Date(start.getTime() + 2 * 3600 * 1000);
  const f = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  const q = new URLSearchParams({
    action: "TEMPLATE", text: `${GROUP_NAME} @ ${r.name}`, dates: `${f(start)}/${f(end)}`, ctz: "Asia/Kolkata",
    location: r.address, details: `Navigate: ${mapsDirectionsUrl(r)}\nAsk for Jain (no onion, no garlic).`,
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}

function renderFinalize() {
  const el = $("#finalizeArea");
  if (isFinal()) {
    const p = state.plan;
    const r = byId(p.restaurant_id);
    const free = dateStats().get(p.day) || [];
    const text = buildWhatsAppText();
    el.innerHTML = `
      <div class="ticket">
        <img class="ticket-img" src="${r.photos[0]}" alt="${esc(r.name)}" referrerpolicy="no-referrer" />
        <div class="ticket-body">
          <div class="kicker">🔒 Locked in by ${esc(p.finalized_by)}</div>
          <h2>${esc(r.name)}</h2>
          <div style="opacity:.85">${esc(r.address)}</div>
          <div class="ticket-facts">
            <div><small>Date</small><b>${fmtDay(p.day, { weekday: "short", day: "numeric", month: "short" })}</b></div>
            <div><small>Time</small><b>${fmtTime(p.time)}</b></div>
            <div><small>Coming</small><b>${free.length ? esc(free.join(", ")) : "Everyone 🤞"}</b></div>
          </div>
          ${p.note ? `<div>📝 ${esc(p.note)}</div>` : ""}
          <hr class="ticket-sep" />
          <div class="ticket-actions">
            <a class="btn btn-wa" id="waSend" href="https://wa.me/?text=${encodeURIComponent(text)}" target="_blank" rel="noopener">🟢 Send to WhatsApp group</a>
            <a class="btn" href="${mapsDirectionsUrl(r)}" target="_blank" rel="noopener">🧭 Navigate</a>
            <a class="btn" href="${calendarUrl()}" target="_blank" rel="noopener">📅 Add to calendar</a>
          </div>
          <div class="ticket-actions">
            <button class="btn btn-ghost btn-sm" id="copyMsg">📋 Copy message</button>
            ${WHATSAPP_GROUP_LINK ? `<a class="btn btn-ghost btn-sm" href="${esc(WHATSAPP_GROUP_LINK)}" target="_blank" rel="noopener">Open group</a>` : ""}
            <button class="btn btn-ghost btn-sm" id="reopenBtn">🔓 Re-open plan</button>
          </div>
        </div>
      </div>
      <h3 style="margin:22px 0 8px">WhatsApp message preview</h3>
      <p class="muted" style="margin:0 0 10px;font-size:14px">Tap <b>Send to WhatsApp group</b> → pick your group → send. Everyone gets the date, time, address and a navigation link.</p>
      <div class="wa-preview">${esc(text)}</div>`;
    return;
  }

  const t = todayIso();
  const [y, m] = state.planId.split("-").map(Number);
  const days = new Date(y, m, 0).getDate();
  const stats = dateStats();
  const total = groupCount();
  const allDays = [];
  for (let d = 1; d <= days; d++) {
    const iso = `${y}-${pad(m)}-${pad(d)}`;
    if (iso >= t) allDays.push([iso, (stats.get(iso) || []).length]);
  }
  allDays.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const rs = restStats();
  const rests = [...RESTAURANTS].sort((a, b) => (rs.get(b.id)?.length || 0) - (rs.get(a.id)?.length || 0) || a.name.localeCompare(b.name));
  const best = bestDates(1)[0];
  const lead = leaders();
  const myVote = state.restVotes.find((v) => v.member === state.me)?.restaurant_id;
  const pre = lead.length === 1 ? lead[0] : (myVote || rests[0].id);

  if (!allDays.length) {
    el.innerHTML = `<div class="empty-state">This month is over — switch to next month at the top ›</div>`;
    return;
  }
  el.innerHTML = `
    <div class="panel-head"><div><h2>Lock it in</h2><p class="muted">Anyone can finalize. Everyone with the page open gets an instant alert, then you send it to the WhatsApp group.</p></div></div>
    <div class="summary-tiles">
      <div class="tile"><div class="k">Top date</div><div class="v">${best ? `${fmtDay(best[0])} · ${best[1].length}/${total}` : "—"}</div></div>
      <div class="tile"><div class="k">Leading place</div><div class="v">${lead.length ? esc(lead.map((id) => byId(id).name).join(" / ")) : "—"}</div></div>
      <div class="tile"><div class="k">Joined</div><div class="v">${state.members.length}/${GROUP_SIZE}</div></div>
    </div>
    <form class="final-form" id="finalForm">
      <label class="field"><span>Date</span>
        <select name="day" required>${allDays.map(([d, n]) => `<option value="${d}">${fmtDay(d, { weekday: "short", day: "numeric", month: "short" })} — ${n}/${total} free</option>`).join("")}</select>
      </label>
      <label class="field"><span>Time</span><input type="time" name="time" value="${DEFAULT_TIME}" required /></label>
      <label class="field full"><span>Restaurant</span>
        <select name="restaurant_id" required>${rests.map((r) => `<option value="${r.id}" ${r.id === pre ? "selected" : ""}>${esc(r.name)} — ${rs.get(r.id)?.length || 0} vote(s) · ${esc(r.area)}</option>`).join("")}</select>
      </label>
      <label class="field full"><span>Note for the group (optional)</span><input name="note" maxlength="300" placeholder="e.g. Table booked under Tarang · dress code: ethnic" /></label>
      <div class="full"><button class="btn btn-primary btn-block" id="finalBtn">🔒 Lock it in & notify everyone</button></div>
    </form>`;
}

function renderBanner() {
  const b = $("#finalBanner");
  if (!isFinal()) { b.hidden = true; return; }
  const p = state.plan;
  const r = byId(p.restaurant_id);
  b.hidden = false;
  b.innerHTML = `<span>🎉 ${esc(monthShort(state.planId))}: <b>${esc(r.name)}</b> · ${fmtDay(p.day)} · ${fmtTime(p.time)}</span>
    <a class="btn btn-sm" href="${mapsDirectionsUrl(r)}" target="_blank" rel="noopener">🧭 Navigate</a>`;
}

function renderChat() {
  const list = $("#chatList");
  const nearBottom = list.scrollHeight - list.scrollTop - list.clientHeight < 80;
  if (!state.messages.length) {
    list.innerHTML = `<div class="chat-empty">💬<br/>No messages yet.<br/>Start the debate: thali or dosa?</div>`;
  } else {
    list.innerHTML = state.messages.map((m) => {
      if (m.kind === "system") return `<div class="msg-system">${esc(m.body)}</div>`;
      const mine = m.member === state.me;
      const time = new Date(m.created_at).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
      return `<div class="msg ${mine ? "me" : ""}">${avatar(m.member, "av-sm")}<div class="bubble"><div class="who">${esc(m.member)}</div><div class="txt">${esc(m.body)}</div><div class="time">${time}</div></div></div>`;
    }).join("");
  }
  if (nearBottom || !renderChat.didScroll) { list.scrollTop = list.scrollHeight; renderChat.didScroll = state.messages.length > 0; }
  const badge = $("#chatBadge");
  badge.hidden = !state.unread;
  badge.textContent = state.unread;
}

/* ---------- notifications & effects ---------- */
function chatVisible() {
  return !document.hidden && (window.innerWidth > 1020 || $("#chat").classList.contains("open"));
}
function onIncomingMessage(m) {
  if (m.kind === "system") return;
  if (!chatVisible()) {
    state.unread++;
    notify(`${m.member} in ${GROUP_NAME}`, m.body);
  }
}
function notify(title, body) {
  if (!("Notification" in window) || Notification.permission !== "granted" || !document.hidden) return;
  try { new Notification(title, { body, icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍛</text></svg>" }); } catch {}
}
function toast(text, kind = "", ms = 3500) {
  const t = document.createElement("div");
  t.className = `toast ${kind}`;
  t.textContent = text;
  $("#toasts").append(t);
  setTimeout(() => t.remove(), ms);
}
function confetti() {
  const c = $("#confetti");
  const ctx = c.getContext("2d");
  c.width = innerWidth; c.height = innerHeight;
  const colors = ["#E8833A", "#F2B632", "#2F6B4F", "#C2410C", "#ffffff"];
  const parts = Array.from({ length: 150 }, () => ({
    x: Math.random() * c.width, y: -20 - Math.random() * c.height * 0.4,
    vx: (Math.random() - 0.5) * 3, vy: 2 + Math.random() * 4, r: 4 + Math.random() * 5,
    a: Math.random() * Math.PI, va: (Math.random() - 0.5) * 0.2, col: colors[(Math.random() * colors.length) | 0],
  }));
  const start = performance.now();
  (function frame(now) {
    ctx.clearRect(0, 0, c.width, c.height);
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.a += p.va;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.col; ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6); ctx.restore();
    }
    if (now - start < 3200) requestAnimationFrame(frame); else ctx.clearRect(0, 0, c.width, c.height);
  })(start);
}

/* ---------- join dialog ---------- */
function openJoin() {
  const dlg = $("#joinDialog");
  $("#joinMembers").innerHTML = state.members.map((m) => `<button type="button" class="member-pill" data-pick="${esc(m.name)}">${avatar(m.name, "av-sm")}${esc(m.name)}</button>`).join("");
  $("#joinName").value = state.me || "";
  if (!dlg.open) dlg.showModal();
}

/* ---------- events ---------- */
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-day],[data-vote],[data-detail],[data-goto],[data-cuisine],[data-pick],[data-close],.gallery-btn,.step,#copyMsg,#reopenBtn");
  if (!t) return;
  if (t.matches(".gallery-btn")) {
    const track = t.parentElement.querySelector(".gallery-track");
    track.scrollBy({ left: (t.classList.contains("next") ? 1 : -1) * track.clientWidth, behavior: "smooth" });
  } else if (t.dataset.day) toggleDate(t.dataset.day);
  else if (t.dataset.vote) { voteRestaurant(t.dataset.vote).then(() => { if ($("#detailDialog").open) openDetail(t.dataset.vote); }); }
  else if (t.dataset.detail) openDetail(t.dataset.detail);
  else if (t.dataset.goto) { setStep(Number(t.dataset.goto)); $(".stepper").scrollIntoView({ behavior: "smooth", block: "start" }); }
  else if (t.matches(".step")) setStep(Number(t.dataset.step));
  else if (t.dataset.cuisine) { state.cuisine = t.dataset.cuisine; state.shown = 24; renderCards(); }
  else if (t.dataset.pick) join(t.dataset.pick);
  else if (t.hasAttribute("data-close")) $("#detailDialog").close();
  else if (t.id === "copyMsg") {
    navigator.clipboard.writeText(buildWhatsAppText()).then(() => {
      toast("📋 Copied — paste it in the group");
      if (WHATSAPP_GROUP_LINK) window.open(WHATSAPP_GROUP_LINK, "_blank", "noopener");
    }, () => toast("Couldn't copy — long-press the preview instead"));
  } else if (t.id === "reopenBtn") reopen();
});

// Gallery dots follow horizontal scroll.
document.addEventListener("scroll", (e) => {
  const track = e.target;
  if (!(track instanceof Element) || !track.classList.contains("gallery-track")) return;
  const i = Math.round(track.scrollLeft / track.clientWidth);
  track.parentElement.querySelectorAll(".gallery-dots i").forEach((d, j) => d.classList.toggle("on", i === j));
}, true);

$("#detailDialog").addEventListener("click", (e) => { if (e.target === e.currentTarget) e.currentTarget.close(); });
$("#searchInput").addEventListener("input", (e) => { state.search = e.target.value; state.shown = 24; renderCards(); });
$("#areaSelect").innerHTML = AREAS.map((a) => `<option>${esc(a)}</option>`).join("");
$("#areaSelect").addEventListener("change", (e) => { state.area = e.target.value; state.shown = 24; renderCards(); });
$("#sortSelect").addEventListener("change", (e) => { state.sort = e.target.value; renderCards(); });
$("#jainOnly").addEventListener("change", (e) => { state.jainOnly = e.target.checked; state.shown = 24; renderCards(); });
$("#showMore").addEventListener("click", () => { state.shown += 24; renderCards(); });

$("#joinForm").addEventListener("submit", (e) => { e.preventDefault(); join($("#joinName").value); });
$("#joinDialog").addEventListener("cancel", (e) => { if (!state.me) e.preventDefault(); });
$("#meChip").addEventListener("click", openJoin);

$("#chatForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!requireMe()) return;
  const input = $("#chatInput");
  const body = input.value.trim();
  if (!body) return;
  input.value = "";
  sendMessage(body);
});
$("#chatFab").addEventListener("click", () => { $("#chat").classList.add("open"); state.unread = 0; renderChat(); $("#chatList").scrollTop = 1e9; });
$("#chatClose").addEventListener("click", () => $("#chat").classList.remove("open"));

document.addEventListener("submit", (e) => {
  if (e.target.id !== "finalForm") return;
  e.preventDefault();
  if (!requireMe()) return;
  const f = new FormData(e.target);
  $("#finalBtn").disabled = true;
  finalize({ day: f.get("day"), time: f.get("time"), restaurant_id: f.get("restaurant_id"), note: String(f.get("note") || "").trim() });
});

$("#notifyBtn").addEventListener("click", async () => {
  if (!("Notification" in window)) { toast("This browser doesn't support alerts — keep the tab open for live updates"); return; }
  const p = await Notification.requestPermission();
  toast(p === "granted" ? "🔔 Alerts on — you'll be pinged when the plan is locked" : "Alerts are blocked in browser settings");
  renderHeader();
});

async function changeMonth(delta) {
  state.planId = shiftMonth(state.planId, delta);
  history.replaceState(null, "", `?m=${state.planId}`);
  state.dateVotes = []; state.restVotes = []; state.messages = []; state.plan = null; state.step = null; state.loaded = false;
  renderChat.didScroll = false;
  renderAll();
  await loadAll();
  subscribe();
  renderAll();
}
$("#prevMonth").addEventListener("click", () => changeMonth(-1));
$("#nextMonth").addEventListener("click", () => changeMonth(1));

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) { loadAll().then(renderAll); if (chatVisible()) { state.unread = 0; renderChat(); } }
});
setInterval(() => { if (!document.hidden) loadAll().then(renderAll); }, 30000);

/* ---------- boot ---------- */
(async function boot() {
  renderAll();
  await loadAll();
  if (state.me && !state.members.some((m) => m.name === state.me)) {
    await sb.from("members").upsert({ name: state.me }, { onConflict: "name", ignoreDuplicates: true });
    await fetchTable("members");
  }
  subscribe();
  renderAll();
  if (!state.me) openJoin();
})();
