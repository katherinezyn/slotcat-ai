# TimeFold AI MVP PRD

## 1. Product Summary

**Product name:** TimeFold AI

**One-line pitch:** TimeFold AI turns a messy natural-language meeting request into fair recurring meeting time recommendations across global time zones.

**Core idea:** Users describe their meeting needs in a prompt. TimeFold AI parses the request into structured meeting settings, then uses an explainable scheduling engine to recommend meeting times that balance local working hours and rotate off-hour burden.

**MVP goal:** Help a Chief of Staff, Ops lead, or PM find a fair cross-time-zone meeting plan in under one minute.

## 2. Target Users

### Primary User

**Chief of Staff / Business Operations**

Typical use case:
- Plans recurring leadership, board prep, or cross-functional sync meetings.
- Needs to coordinate across regions without repeatedly making one team join too early or too late.
- Wants a clear explanation before sending the schedule.

### Secondary Users

**PM / Program Manager / Operations Manager**

Typical use case:
- Coordinates recurring project meetings across distributed teams.
- Needs a fast way to compare tradeoffs across time zones.
- Wants copy-ready meeting notes or schedule recommendations.

## 3. Problem

Cross-time-zone scheduling is not only a time conversion problem. For recurring meetings, the real problem is fairness over time:

- No single meeting time works well for everyone.
- APAC, Europe, or Americas teams often repeatedly absorb the early/late burden.
- Existing tools usually require manual time zone entry and focus on one meeting at a time.
- Leaders need a way to explain the recommendation, not just see a converted time.

## 4. MVP Scope

### Must Have

1. **Prompt-based request input**
   - User describes the meeting in natural language.
   - Example: "Plan 3 monthly meetings for teams in Beijing, US Eastern, UK, and US Pacific. Rotate off-hours fairly."

2. **AI parsing into structured setup**
   - Extract:
     - meeting count
     - frequency
     - duration
     - regions/cities/time zones
     - fairness preference
     - working-hour constraints if provided
   - Show parsed setup for review before generating recommendations.

3. **Editable setup**
   - User can modify:
     - regions/time zones
     - meeting count
     - frequency
     - duration
     - working hours
     - fairness mode

4. **Recommendation engine**
   - Generate 3 recommended meeting plans.
   - For recurring meetings, show all sessions in each plan.
   - Include:
     - UTC anchor time
     - local time per region
     - burden region/person
     - work-hour fit
     - fairness score

5. **TimeFold Ribbon visualization**
   - Show each region as a parallel 24-hour timeline.
   - Display recommended meeting time as a vertical UTC anchor line.
   - Use color to show work, edge, late/early, and sleep zones.

6. **Copy-ready output**
   - Copy schedule.
   - Copy invite note.
   - Copy explanation of tradeoffs.

### Should Have

1. Sample prompt button.
2. Empty states that explain what to enter.
3. Clear warning when no perfect overlap exists.
4. Basic responsive layout for smaller screens.

### Not in MVP

- Google Calendar or Outlook integration.
- Automatic meeting invite sending.
- User login.
- Database-backed saved schedules.
- Excel, CSV, or screenshot upload.
- Teams transcript summary.
- Organization/team accounts.
- Payment or subscription.

## 5. Core User Flow

1. User opens TimeFold AI.
2. User enters prompt:
   - "我要开三个会，每个月一次，有10个参会人，分别在北京，美东，英国，美西时区，轮换大家非工作时间。"
3. System parses the prompt into structured setup.
4. User reviews or edits setup.
5. User clicks "Generate plan."
6. System generates 3 meeting plans.
7. User compares fairness score, local times, and burden rotation.
8. User copies a plan and sends it to the team.

## 6. Prompt Parsing Requirements

### Input Examples

```text
Plan 3 monthly meetings for teams in Beijing, US Eastern, UK, and US Pacific. Rotate off-hours fairly.
```

```text
我要开三个会，每个月一次，有10个参会人，分别在北京、美东、英国、美西时区，轮换大家非工作时间，给到一个会议时间区域的推荐。
```

```text
Schedule 6 biweekly leadership meetings for New York, London, Bangalore, and Tokyo. Avoid making APAC late every time.
```

### Parsed Output Shape

```json
{
  "meetingTitle": "Global Team Sync",
  "meetingCount": 3,
  "frequency": "monthly",
  "durationMinutes": 60,
  "startDate": null,
  "workingHours": {
    "start": "09:00",
    "end": "18:00"
  },
  "fairnessMode": "rotate_burden",
  "locations": [
    {
      "label": "Beijing",
      "timezone": "Asia/Shanghai",
      "weight": 1
    },
    {
      "label": "US Eastern",
      "timezone": "America/New_York",
      "weight": 1
    },
    {
      "label": "United Kingdom",
      "timezone": "Europe/London",
      "weight": 1
    },
    {
      "label": "US Pacific",
      "timezone": "America/Los_Angeles",
      "weight": 1
    }
  ],
  "constraints": {
    "avoidSleepHours": true,
    "rotateOffHours": true,
    "weekdaysOnly": true
  }
}
```

### Default Assumptions

If user omits details:

- Duration defaults to 60 minutes.
- Working hours default to 9:00 AM - 6:00 PM local time.
- Candidate days default to Monday-Friday.
- Start date defaults to the next available weekday.
- If participant count per region is missing, each region receives equal weight.
- If exact cities are not provided, use the most representative time zone:
  - 美东 / US Eastern -> America/New_York
  - 美西 / US Pacific -> America/Los_Angeles
  - 英国 / UK -> Europe/London
  - 北京 / China -> Asia/Shanghai

## 7. Recommendation Logic

### Candidate Generation

For each target meeting date:

- Generate candidate UTC times in 30-minute increments.
- Limit candidates to weekdays.
- For each candidate, convert UTC to each location's local time.
- Score the candidate based on local-time comfort and recurring fairness.

### Local Time Comfort Score

For each participant/location:

- 09:00-18:00: comfortable, score 0 burden
- 07:00-09:00 or 18:00-20:00: edge, score 1 burden
- 06:00-07:00 or 20:00-22:00: inconvenient, score 2 burden
- 22:00-06:00: sleep hours, score 4 burden

Lower burden is better.

### Fairness Rules

For recurring meetings:

- Avoid assigning the highest burden to the same region repeatedly.
- Prefer plans where total burden is spread across regions.
- If perfect overlap does not exist, state that explicitly.
- Show which region carries burden for each session.

### Three Recommended Plans

Generate three differentiated options:

1. **Best Balance**
   - Lowest total burden across all sessions.

2. **Rotate Burden**
   - Prioritizes fair distribution of early/late inconvenience.

3. **Protect Work Hours**
   - Minimizes sleep-hour meetings, even if some regions get edge times.

## 8. Output Requirements

### Plan Card

Each plan card should show:

- Plan name
- Fairness score
- Work-hour fit
- Main tradeoff
- Session table
- Copy button

### Session Table

Each session row should include:

- Session number/date
- UTC anchor time
- Local time per region
- Burden region
- Short note

### Example Output

```text
No perfect overlap exists across Beijing, UK, US Eastern, and US Pacific. TimeFold recommends rotating the inconvenience so the same region does not carry every early or late slot.
```

## 9. Success Metrics

### Product Metrics

- User can generate a recommendation in under 60 seconds.
- User can understand the main tradeoff within 10 seconds.
- User can copy a usable schedule without rewriting it.

### Feedback Metrics

First user test should answer:

- Do users understand what TimeFold AI does from the first screen?
- Do users trust the recommendation?
- Do users notice the fairness rotation?
- Would users use this before scheduling a real global meeting?
- What input format do they naturally try first?

## 10. First User Test Script

Ask 5-10 users:

1. What do you think this product does?
2. Try planning a meeting across at least three time zones.
3. Was the recommendation clear?
4. Did the fairness explanation make sense?
5. Would you copy this output into Slack/email/calendar?
6. What would you need before using this at work?

