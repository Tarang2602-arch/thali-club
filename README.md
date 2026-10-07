# 🍛 Thali Club

A monthly dinner planner for our group of 5. Each month:

1. **Pick dates.** Everyone taps the days they're free. The best dates show up live.
2. **Choose a restaurant.** Vote from 94 vegetarian places across Ahmedabad with Jain food (no onion, no garlic). Filter by cuisine or area, sort by votes or price, or search by dish. Each one has photos, a map, the address, Jain picks, a menu link and navigation.
3. **Chat** in the built-in group chat.
4. **Finalize.** Anyone can lock in the plan. Everyone who has the page open gets an instant alert and confetti. Then tap **Send to WhatsApp group**, which pre-fills the date, time, address and Google Maps link.

## Hosting (GitHub Pages)
Push this folder to a GitHub repo, then go to **Settings → Pages → Deploy from branch → `main` / root**.
Share the link: `https://<user>.github.io/<repo>/`. Use `?m=2026-11` for a specific month.

## Config
- `config.js` holds the Supabase URL and key (the publishable key is safe to expose), the group size, the default time and an optional WhatsApp group invite link.
- `restaurants.js` holds the restaurant list. You can edit it, add places or swap photos (max 4 each).
- `supabase/schema.sql` is the database schema (already applied).

## Notes
- WhatsApp doesn't allow websites to post into a group automatically. The button opens WhatsApp with the message ready, so you just pick the group and tap send.
- Browser alerts work while the page is open (or in a background tab) after tapping 🔔.
- Anyone with the link can take part, so share it only with the group.
