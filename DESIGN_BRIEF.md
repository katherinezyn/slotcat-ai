# TimeFold AI Design Brief

## 1. Design Goal

TimeFold AI should feel like a focused, intelligent scheduling instrument, not a generic chatbot or calendar clone.

The UI should make one idea instantly visible:

**Many local timelines fold into one shared UTC meeting moment.**

The product should look:

- sleek
- technical
- calm
- premium but practical
- futuristic without feeling like a game
- monochrome, architectural, and slightly surreal

## 2. Brand Concept

### Product Name

**TimeFold AI**

### Tagline

**Fold global timelines into one fair meeting time.**

### Core Metaphor

Distributed teams live in parallel local timelines. TimeFold AI finds the UTC anchor where those timelines can meet, then shows who benefits and who carries the time burden.

### Key Product Terms

Use these selectively in the UI:

- **UTC Anchor:** the shared meeting moment.
- **Local Timeline:** each region's local 24-hour day.
- **Fold Point:** the selected meeting time across timelines.
- **Burden Rotation:** how early/late inconvenience is shared over recurring meetings.
- **Fairness Score:** how balanced a plan is.

Avoid overusing themed words. The product still needs to feel clear and usable.

## 3. Visual Direction

### Mood

Light, precise, quietly futuristic.

Think:

- pale gray workspace
- black translucent time geometry
- thin coordinate lines
- sharp information hierarchy
- soft shadows and subtle motion blur
- wireframe forms that feel like folded time

Avoid:

- cartoon sci-fi
- spaceships
- airplane imagery
- excessive gradients
- giant decorative globes
- busy world maps
- generic stock productivity imagery
- colorful pixel art as the primary language

## 4. Color System

### Core Palette

- Page background: `#F4F4F1`
- Main surface: `#FFFFFF`
- Elevated surface: `#ECEBE7`
- Dark surface: `#2E2E2C`
- Border: `#D8D6D0`
- Strong border: `#1F1F1D`
- Primary text: `#111111`
- Secondary text: `#55554F`
- Muted text: `#8A8982`

### Accent Palette

- Primary accent: `#111111`
- Secondary accent: `#6D6A63`
- Recommendation highlight: `#FFD84D`
- Recommendation highlight dark: `#B88700`
- Work hours: `#D7E6D3`
- Edge hours: `#EFE2B8`
- Inconvenient hours: `#E7C4C4`
- Sleep hours: `#C9C8C1`
- UTC anchor: `#111111`

### Use Rules

- Use black for UTC anchor/fold point.
- Use bright yellow only for the selected recommended time and primary confirmation moments.
- Use muted green/amber/rose only for local-time comfort status.
- Keep the interface mostly gray-white with black structural elements.
- Use translucent black geometry as the signature visual, not decorative color.
- Yellow should feel like a warm signal in an otherwise monochrome time-space interface.

## 5. Typography

Recommended font:

- **Geist Sans** or **Inter**

Type scale:

- Page title: 32-40px
- Section title: 18-22px
- Card title: 16-18px
- Body: 14-16px
- Labels: 12-13px

Rules:

- No negative letter spacing.
- Avoid oversized hero text inside the tool surface.
- Keep labels compact and scannable.

## 6. Layout

### Desktop First

The core workflow is a desktop web app. Mobile can be responsive, but the main experience should assume a laptop-sized screen.

### Main Screen Structure

```text
Header
  Logo / name
  Short tagline
  Optional: Try sample prompt

Main workspace
  Left panel: Prompt + parsed settings
  Center panel: Locations / time zones / constraints
  Right panel: Recommended plans

Lower section
  TimeFold Ribbon visualization
  Fairness ledger
  Copy/export actions
```

### Layout Principles

- The first screen should show the actual tool, not a marketing landing page.
- Prompt input should be prominent but not full-page.
- Recommendations should appear as decision cards.
- The TimeFold Ribbon should be the most memorable visual component.
- Avoid nested cards. Use panels and clear sections.

## 7. Core Component: TimeFold Ribbon

### Purpose

Make time-zone tradeoffs visible at a glance.

### Concept

Each region is shown as one horizontal 24-hour timeline. The recommended UTC anchor appears as a vertical glowing line that crosses all local timelines.

### Visual Structure

```text
UTC Anchor: 14:00

Beijing       00 03 06 09 12 15 18 21
                                  |
US Eastern    00 03 06 09 12 15 18 21
                         |
UK            00 03 06 09 12 15 18 21
                              |
US Pacific    00 03 06 09 12 15 18 21
                      |
```

Actual UI should use:

- segmented 24-hour bars
- status colors
- local-time marker in black
- region label
- small comfort badge
- a subtle fold curve or translucent mesh behind the selected UTC anchor

### Status Colors

- Comfortable: green
- Edge: amber
- Inconvenient: rose
- Sleep: dark gray

### Interaction

For MVP:

- User clicks a plan card.
- Ribbon updates to show that plan's selected session.
- User can select Session 1, 2, 3 for recurring plans.

Future:

- Drag UTC anchor to test alternate times.
- Real-time score changes.

## 8. Main UI States

### Empty State

Prompt area should include sample prompts:

```text
Plan 3 monthly meetings for Beijing, US Eastern, UK, and US Pacific. Rotate off-hours fairly.
```

```text
Schedule 6 biweekly leadership syncs across New York, London, Bangalore, and Tokyo. Avoid making APAC late every time.
```

### Parsed State

Show what TimeFold understood:

- meeting count
- frequency
- duration
- locations/time zones
- fairness mode
- working hours

Use editable fields, not a static summary.

### Recommendation State

Show three plans:

- Best Balance
- Rotate Burden
- Protect Work Hours

Each card should include:

- score
- best use case
- main tradeoff
- copy action

### No Perfect Overlap State

Show an honest message:

```text
No perfect work-hour overlap exists for these regions. TimeFold will rotate the inconvenience across sessions.
```

This builds trust.

## 9. Interaction Copy

### Prompt Placeholder

```text
Describe your meeting. Example: Plan 3 monthly meetings for Beijing, US Eastern, UK, and US Pacific. Rotate off-hours fairly.
```

### Parsed Setup Header

```text
TimeFold understood
```

### Recommendation Header

```text
Recommended folds
```

### Ribbon Header

```text
UTC anchor across local timelines
```

### Copy Button Labels

- Copy schedule
- Copy invite note
- Copy tradeoff summary

## 10. MVP Design Checklist

Before first user test, verify:

- First screen clearly communicates the product in under 5 seconds.
- Sample prompt works.
- Parsed setup is editable.
- Three recommendations look meaningfully different.
- Fairness score is visible but not overdominant.
- TimeFold Ribbon makes the tradeoff easier to understand than a table alone.
- Copy output is readable in Slack/email.
- No element depends on a full marketing page to explain the product.

## 11. Signature Visual System

### Style Name

**Dreamlike Time Coordinates**

### Visual Concept

The site uses abstract black wireframe forms on a gray-white interface to represent local timelines folding into one shared UTC anchor. These forms should feel like time tunnels, translucent ribbons, water ripples, or architectural coordinate traces.

### Emotional Accent

The selected recommendation can introduce a small warm, dreamlike visual accent: a bright yellow marker inspired by the feeling of a small bath-time toy floating on water. It acts like a time buoy, marking the shared UTC moment where timelines meet. This should create a subtle memory-like contrast against the technical monochrome interface.

Use this as a light mascot/detail, not the main brand identity.

Good placements:

- selected recommendation badge
- loading state while recommendations are being generated
- small animated marker on the TimeFold Ribbon
- success state after copying a schedule

Avoid:

- making the product feel childish
- using large cartoon illustrations in the main workspace
- letting the mascot compete with the meeting recommendations
- overusing yellow across unrelated controls

### Where It Appears

- Header visual: one abstract folded-time form.
- Empty state: light wireframe fold behind the sample prompt.
- Recommendation state: selected plan receives a subtle fold geometry accent.
- TimeFold Ribbon: UTC anchor line may create a slight curved distortion across local timelines.

### Motion Ideas

Use motion sparingly:

- Lines gently drift or shimmer on hover.
- UTC anchor line sweeps across the ribbon when switching recommendations.
- Fold geometry slowly rotates or breathes at very low opacity.
- Recommendation cards can reveal with a small vertical scan effect.
- The selected yellow time marker can gently bob or ripple, like a small object floating on water.

Avoid:

- fast sci-fi animations
- particle explosions
- neon glow-heavy effects
- anything that distracts from reading local times

## 12. Future Design Extensions

Not needed for MVP:

- Animated fold transition.
- Shareable schedule link.
- Calendar-style recurring view.
- Screenshot/CSV upload.
- Saved team profiles.
- Meeting recap style profile.
