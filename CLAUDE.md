# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static landing page for **ebook.tex**, an ebook editorial production studio. No build system, no package manager, no dependencies. Open `index.html` directly in a browser to preview.

## Development

To view the page: open `index.html` in any browser. No server, compilation, or install step required.

## Architecture

Single-page site (`index.html`) with sections in this order: `#hero → #sobre → #entregaveis → #processo → #portfolio → #depoimentos → #faq → #contato → footer`.

**CSS** (`css/style.css`): All design tokens are CSS custom properties in `:root` at the top of the file. Naming follows a BEM-inspired pattern (`block__element--modifier`). Responsive breakpoints: `≤1024px` (tablet), `≤768px` (mobile), `≤480px` (small mobile).

**JS** (`js/script.js`): Five discrete behaviors, each clearly demarcated by numbered comments:
1. Header adds `.header--scrolled` class after 40px scroll
2. Mobile nav toggle (hamburger) — manages `aria-expanded` and `overflow:hidden` on body
3. Scroll reveal via `IntersectionObserver` — adds `.reveal` then `.reveal--visible` to cards, deliverables, timeline items, portfolio items, testimonials, and section headers
4. FAQ accordion — single-open pattern using `aria-expanded`
5. Hero image tilt on mousemove (only fires if `#heroImage` element exists — currently not present in HTML)

**Fonts** (self-hosted in `fonts/`):
- `Oswald` (`--font-display`) — section titles, card titles, UI labels
- `Manrope` (`--font-body`) — body text, buttons, nav
- `Fraunces` — hero `h1` only (`hero__title`)
- `Shadows Into Light` (`--font-sign`) — testimonial author names

## Brand Identity

- **Primary** `#A05D42` — terracotta/rust, used for CTAs, accents, odd elements
- **Secondary** `#596451` — forest green, used for even elements and supporting accents
- **Background** `#F7F3EE` — warm off-white
- Tone: editorial, premium, minimalist. All section titles use `text-transform: uppercase`.

## Known Placeholder

The WhatsApp CTA button in `#contato` section ([index.html:404](index.html#L404)) points to `href="#"` — the real WhatsApp link (`https://wa.me/5511...`) should be substituted there. The footer and portfolio section already have placeholder links too.
