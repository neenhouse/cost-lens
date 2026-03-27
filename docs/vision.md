# CostLens -- Vision

## North Star

**Make cloud spending visible, actionable, and predictable for every engineering team.**

CostLens is a cloud cost intelligence platform that transforms raw billing data into clear recommendations with dollar-denominated savings. It serves engineering leaders, platform teams, and finance stakeholders who need to understand where cloud money goes, what is wasted, and what will be spent next month.

## Core Beliefs

1. **Visibility drives behavior.** Teams that can see their costs will naturally optimize them. Attribution by team removes the "tragedy of the commons."
2. **Dollars beat percentages.** Every recommendation must show the projected dollar impact. "Save $4,200/mo by right-sizing these 12 instances" is more compelling than "reduce compute by 18%."
3. **Upload-first, agent-free.** No IAM roles, no cross-account access, no agents. Users upload a billing CSV/JSON and get value in under 60 seconds.
4. **Forecast prevents surprises.** A simple, accurate monthly forecast model with budget alerts keeps teams ahead of overruns instead of reacting to month-end bills.
5. **Reserved instance math should be easy.** Break-even analysis, coverage recommendations, and amortization views that any engineer can understand.

## Design Principles

- **Fast to value**: Upload a file, see insights immediately. No onboarding wizard, no config.
- **Clarity over cleverness**: Plain tables, clear charts, explicit dollar amounts. No vanity metrics.
- **Progressive depth**: Dashboard summary first, drill-down for details. Never overwhelm.
- **Privacy-conscious**: Billing data stays in the user's browser/worker. No third-party analytics on cost data.
- **Opinionated defaults, flexible overrides**: Smart defaults for waste thresholds, team mapping, and forecasting -- all user-configurable.

## Target Users

| Persona | Goal |
|---------|------|
| Engineering Manager | Understand team spend, justify optimization work |
| Platform / DevOps Engineer | Find waste, right-size resources, plan RIs |
| VP Engineering / CTO | Monthly forecast, budget compliance, team comparisons |
| Finance / FP&A | Cost attribution, chargeback data, trend analysis |

## Success Metrics

- Time-to-first-insight < 60 seconds from file upload
- At least 3 actionable recommendations per upload
- Forecast accuracy within 10% of actual for 80% of users
- User returns within 30 days to upload next month's data
