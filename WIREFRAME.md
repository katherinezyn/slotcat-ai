# TimeFold AI Main Screen Wireframe

## Goal

Create a first-screen product experience that feels visually distinctive while still making the recommended meeting times extremely clear.

## Screen Structure

```text
Header
  Product name
  Tagline
  Small product status / sample action

Hero Workspace
  Left: Prompt input
  Right: Atmospheric timefold visual

Parsed Setup
  Meeting cadence
  Duration
  Locations / time zones
  Fairness mode

Recommendations
  Three plan cards:
    Best Balance
    Rotate Burden
    Protect Work Hours

Selected Plan Detail
  Clear session table
  UTC anchor
  Local times by region
  Burden region
  Copy actions

TimeFold Ribbon
  Parallel local timelines
  Yellow marker for selected UTC anchor
  Explicit local time labels
  Comfort status badges
```

## Design Rule

Decorative visuals must never replace time data.

Every recommendation must appear in three forms:

1. Text: UTC anchor and local times.
2. Table: session-by-session schedule.
3. Visual: TimeFold Ribbon with yellow marker.

## Primary Static Prototype Scenario

User prompt:

```text
Plan 3 monthly meetings for teams in Beijing, US Eastern, UK, and US Pacific. Rotate off-hours fairly.
```

Parsed setup:

- 3 monthly meetings
- 60 minutes
- Beijing, US Eastern, UK, US Pacific
- Working hours: 9:00-18:00 local
- Fairness mode: rotate off-hour burden

Recommended plans:

1. Best Balance
2. Rotate Burden
3. Protect Work Hours

Default selected plan:

**Rotate Burden**

This best demonstrates the product's differentiation.

