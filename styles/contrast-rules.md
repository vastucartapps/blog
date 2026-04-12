# Contrast Rules — Never Break These

This file is law. Every component in `components/` must follow it.
Before you write or edit a component, re-read this file.

## On dark backgrounds (`dark`, `dark-2`, `dark-3`, `diamond-bg`, `diamond-bg-2`)

- Headings:     `text-on-dark`          = `#ffffff`
- Body text:    `text-on-dark-body`     = `rgba(255,255,255,0.75)`
- Captions:     `text-on-dark-muted`    = `rgba(255,255,255,0.50)`
- Eyebrow/meta: `text-on-dark-faint`    = `rgba(255,255,255,0.35)`
- Accent text:  `text-saffron-light`    = `#f5a623`

**Never** use `text-dark`, `text-dark-2`, `text-teal`, `text-text-primary` or
`text-text-mid` as the text colour on a dark background.

## On light backgrounds (`cream`, `cream-2`, `cream-3`, `white`, tone pales)

- Headings:     `text-ink`        = `#012d33`
- Body text:    `text-ink-body`   = `#2d5a63`
- Captions:     `text-ink-muted`  = `#4a7c87`
- Eyebrow/meta: `text-ink-muted`  or a brand accent
- Accent text:  `text-saffron`    = `#e8840a`
- Teal accent:  `text-teal`       = `#338a95`

**Never** use rgba-white text on a light background. **Never** use any
`text-on-dark-*` token on a light background.

## Buttons

- Primary (saffron bg):  white text, weight 600.
- Secondary (dark bg):   white text, weight 600.
- Outline on dark bg:    white border + white text.
- Outline on light bg:   `border-dark` border + `text-ink` text.
- Ghost on light bg:     `text-ink` text, `hover:bg-cream-2` background.
- Ghost on dark bg:      `text-on-dark` text, `hover:bg-white/10` background.
- Never ship a button whose text colour is unset.

## Badges and pills

- On dark bg: `bg-saffron-pale text-saffron` OR `bg-white/10 text-on-dark`.
- On light bg: `bg-cream-3 text-ink` OR `bg-teal-pale text-ink`.
- Count numbers in pills: weight 600, background darker than the pill,
  padded for visual separation.

## Breadcrumbs

- On dark bg: separators `text-on-dark-faint`, parent links
  `text-on-dark-muted`, current `text-on-dark`.
- On light bg: separators `text-border-mid`, parent links `text-ink-muted`,
  current `text-ink`.

## Empty states

- Background: `bg-cream-2` with `border border-dashed border-border-mid`.
- Text: `text-ink-muted`, centred.
- Subtle icon above the text.
- Must look intentionally designed, not broken.

## Cards on cream/light backgrounds

- Background: `bg-white` (pure white, not cream).
- Border: `border border-border-soft`.
- Heading: `text-ink`.
- Body: `text-ink-body`.
- Meta: `text-ink-muted`.
- Hover: `hover:border-teal` plus a subtle `-translate-y-0.5` transform.

## Sanskrit, Hindi, verse text

- Same contrast rules as the surrounding English text.
- Never lower the opacity relative to the English equivalent.

## Category icon chip on dark background

- Background: `bg-white/10`.
- Border: `border border-white/20`.
- Icon colour: `text-saffron-light` or `text-on-dark`.

## Subcategory filter chips on cream

- Background: `bg-white`.
- Border: `border border-border-mid`.
- Text: `text-ink`, weight 500.
- Count badge inside: `bg-dark text-on-dark`, weight 600,
  `px-1.5 py-[1px] rounded-full`.
