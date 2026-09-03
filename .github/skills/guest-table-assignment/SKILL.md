---
name: guest-table-assignment
description: "Implement and maintain wedding guest table assignment. Use when adding table names to invitations, assigning one or two invited people to reception tables, enforcing table capacity such as 10 seats, closing full tables, moving guests to available tables, showing the table on the admin invitation record and digital invitation pass, or updating D1 migrations and CSV export for seating plans."
---

# Guest Table Assignment

Implement seating assignments as part of the invitation workflow. The feature must remain consistent across the admin panel, API, database, generated invitation pass, check-in flow, and CSV export.

## Domain rules

- A table has a stable identifier and a human-readable name/label.
- A table has a configurable capacity. The default capacity is 10 seats, but do not hard-code 10 where the event may need another capacity.
- Count seats by named invitees, not by invitation records. An invitation with two people consumes two seats.
- A table is full and cannot receive another invitee when assigned seats reach its capacity.
- A table may be explicitly closed by an administrator before it is full. Closed tables cannot receive new assignments.
- Do not split one invitation across tables. All people in the same invitation must stay at the same table.
- When editing an invitation, release its previous seats before checking the new assignment. The invitation itself must not make its own table appear full.
- Creating or updating an invitation without a table is allowed only if the product explicitly supports an unassigned state. Make that state visible in the admin list and never silently assign a random table.
- Reject an assignment that exceeds capacity or targets a closed table with a clear Portuguese error message. Do not partially save the invitation.
- Preserve existing nominal-invitation rules: one invitation contains at most two named people and is not transferable.

## Repository-specific starting points

- Database schema: `db/schema.ts`.
- Invitation domain types and input validation: `lib/invitation-types.ts`.
- Invitation persistence and RSVP rules: `lib/invitations.ts`.
- Admin invitation API: `app/api/admin/invitations/route.ts`.
- Admin form and invitation cards: `components/guest-admin.tsx`.
- Digital pass and downloadable PNG: `components/invitation-pass.tsx`.
- Admin check-in: `app/admin/check-in/page.tsx` and `components/check-in-dashboard.tsx`.
- Existing D1 migrations: `drizzle/`.
- D1 configuration and deploy: `wrangler.toml` and `package.json`.

## Implementation workflow

1. Inspect the current schema, invitation queries, admin API, and all `Invitation` consumers before editing.
2. Choose a relational model that keeps table data separate from invitations. Prefer a `tables` table plus a nullable `table_id` foreign key on `invitations`, unless an existing project convention requires another model.
3. Add a migration that is safe for existing invitations. Existing records must remain valid and unassigned until an administrator places them.
4. Add types for table metadata, capacity, occupancy, closed state, and the invitation's table summary. Keep API input and output types explicit.
5. Centralize assignment validation in the server-side domain/data layer. The validation must run inside the same database transaction as the invitation write, so two simultaneous admin requests cannot overbook a table.
6. Extend the admin API to list available tables with occupancy, create/update an invitation with a table selection, and manage tables (create, rename, capacity, close/reopen) if table management is part of the UI.
7. Update the admin form with a table selector showing `nome - ocupadas/capacidade` and a clear `Mesa por atribuir` option if supported. Mark full and closed tables as unavailable. When editing, preselect the invitation's current table.
8. Update invitation cards, search/filter behavior, and CSV export to include the table name and occupancy-relevant information.
9. Update the digital pass to show the assigned table prominently next to the invitee names and code. If the invitation has no table, show a clear pending-assignment state rather than omitting the field.
10. Update the downloadable pass image so the table name is included in the generated PNG as well as the HTML pass.
11. Ensure the admin check-in response and screen include the table name, so reception staff can direct guests correctly. Do not expose private administration controls to public guests.
12. Update README documentation with table assignment rules, the default capacity, migration/deploy steps, and the admin workflow.

## UI requirements

- Use the existing component and visual patterns in the repository.
- Display occupancy in Portuguese, for example `8 de 10 lugares`.
- Make full tables visibly unavailable and distinguish them from explicitly closed tables.
- Keep the table assignment visible in the admin invitation card and in the digital pass without hiding it in a tooltip.
- Keep controls keyboard accessible and provide labels for the table selector and close/reopen actions.

## Validation checklist

- Create an invitation for one person and assign a table.
- Create an invitation for two people and verify that it consumes two seats.
- Fill a 10-seat table and verify that it is unavailable for another invitation.
- Try assigning an invitation with two people to a table with one remaining seat and verify that the whole write is rejected.
- Close a partially occupied table and verify that it cannot receive guests until reopened.
- Move an existing invitation to another table and verify that both occupancy counts are correct.
- Delete an invitation and verify that its seats become available.
- Confirm that concurrent assignments cannot exceed capacity.
- Verify the table name in the admin card, CSV export, public digital pass, downloaded PNG, and check-in view.
- Run `npm run lint`, `npm run test`, and a production build. Apply D1 migrations in the target environment before testing against remote data.

## Completion criteria

The work is complete only when table assignment is persisted, capacity is enforced server-side, full/closed tables are handled explicitly, and the same assigned table is visible in every operational surface that identifies an invitation.
