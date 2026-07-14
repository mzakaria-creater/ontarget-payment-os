# OnTarget Design System v1

## The brief, in one sentence
A 24/7 command center where a small team watches real EGP move
through mobile wallets and Instapay, matches it to SMS proof, and
approves or declines it — often within seconds.

## Why this direction (not the generic three)
- Not cream/serif/terracotta — this isn't a marketing page, it's a
  night-shift ops screen.
- Not near-black + one neon accent — money has **four real states**
  (paid, declined, pending, informational), so the palette carries
  four semantic accents on purpose, not one decorative one.
- Not broadsheet/hairline-newspaper — the content is live tabular
  data at high density, not long-form reading.

Instead: a **bank vault at night** — deep navy-black surfaces, a
gold "ledger" accent for the thing being tracked (value), and
semantic mint/coral/amber for the three things that can happen to
a transaction.

## Signature: the pulse
The one element this system is remembered by is the **pulse** — a
slow glowing heartbeat (`.ot-pulse-dot`) that marks anything live
right now: the sidebar rail when Maven is actively syncing, a
status dot on a device that's still sending SMS, a row that just
matched. Color tells you *what* is happening; the pulse tells you
it's happening *right now*, not a static snapshot. This is the
thread that should run through every new page — a page with no
pulse is a page showing stale data.

## Tokens
See `tokens.css` for the full set. Summary:

| Role | Token | Hex |
|---|---|---|
| Background | `--void` | `#05070c` |
| Card surface | `--panel` / `--panel2` / `--panel3` | `#0b1020` / `#111830` / `#161f3d` |
| Ledger accent | `--gold` / `--gold-bright` | `#d9b26a` / `#f0cd8a` |
| Paid / live | `--mint` | `#2dd4a7` |
| Declined / risk | `--coral` | `#f4685f` |
| Pending / needs a human | `--amber` | `#f0b43a` |
| Informational | `--sky` | `#5b9ee8` |
| Body text | `--ink` / `--mute` | `#eef1f8` / `#7a86a8` |

## Type
- **Cairo** — display + body. Arabic-first (this is an Arabic-primary
  RTL interface), and it's the face already carrying the ops
  console's personality — keep it, don't swap to a Latin-default face.
- **JetBrains Mono** — every ID, amount, phone number, and timestamp.
  Data should look like data, not prose.

## Layout
Dense sidebar (grouped nav, collapsible) + content area, already
proven in the ops console. Tables use the `.ot-mobile-cards` pattern
to collapse into cards under 760px — no separate mobile layout to
maintain.

## Applying this to the two surfaces
1. **Ops console** (control-panel-v2.html) — already speaks this
   language natively; this file formalizes what's there so new pages
   don't drift from it.
2. **API / merchant console** (OnTarget_Dashboard.html, React) —
   import `tokens.css`, map its Tailwind config's colors to the same
   hex values, and swap its component classes to `.ot-btn` / `.ot-pill`
   / `.ot-panel` so both surfaces feel like one product even though
   they're built differently under the hood.

## What NOT to do
- Don't invent a second accent color "for variety." Gold is the only
  decorative accent — everything else is semantic and load-bearing.
- Don't remove the pulse to "reduce motion" wholesale — respect
  `prefers-reduced-motion` by dropping to a static dot, but keep the
  color semantics.
- Don't switch fonts per-page. Two faces, every page, no exceptions.
