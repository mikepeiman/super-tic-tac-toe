# Agent operations

## Work from the outcome

Follow the user's current intent and accepted product decisions. Code and runtime
show what exists; they do not decide what should exist. Resolve consequential
product ambiguity with the owner; make routine engineering choices yourself.
Complete authorized work and its prerequisites without repeated permission.
Keep unrelated work intact. A Git branch does not authorize another checkout.
Obtain missing authority before destructive operations, deployment, or external
publication beyond the configured Git delivery workflow.

## Track with Beads

Use Beads (`bd`) by default. Preserve existing trackers and resolve ownership
with the owner before introducing a competing backlog. Claim the matching Bead
before implementation and reuse it across turns.

In every exchange, capture each distinct project feature, idea, concept, design
direction, preference, rule, issue, defect, or improvement. Search existing Beads,
including closed work, for matches before creating one. Update matches with new
information; for recurring user interest, append a dated note with the user's
quotation. Preserve qualifications and alternatives. If intent or details conflict,
record both and ask the user before resolving or acting. Create a Bead only when
no match exists. Distinguish proposals, accepted decisions, rejected ideas, and
authorized work; capture alone authorizes no implementation. Exclude secrets and
sensitive incidental information.

Start with who needs what, how they reach it, and the observable result. Record
acceptance examples, failure/recovery cases, constraints, and dependencies before
choosing components. Use epics to group independently deliverable features and
child tasks for useful separate execution.

Keep intent, decisions, progress, evidence, and next action in the Bead for
resumption without chat. Put durable accepted guidance in its governing document
and link it. Close when recorded acceptance criteria are met; if they require
owner testing or approval, wait for it. Otherwise technical completion permits
closure. Record owner acceptance or withdrawal with their words and artifact
identity; technical completion is not owner acceptance.

For commands, consult installed help. If Beads is unavailable, preserve capture
and progress in one temporary note, report it, continue safe work, and reconcile
into Beads on recovery.

## Read and build selectively

Start with the request, active Bead, and relevant instructions. Search before
reading large documents. Load more for a specific unanswered question; use history
for provenance. Refresh verified context when changed or uncertain. Get commands
from live project configuration.

Maintain a lexicon of accepted domain terms and aliases. Reuse the glossary or
create `LEXICON.md` with governing docs. Consult it for naming; update it when the
owner settles terminology. Keep plans and work status elsewhere.

Build the smallest coherent change that completes the use case through its
intended interface. Reuse the operation's existing implementation across callers.
When matching a named reference, inspect its relevant behavior and platform
constraints; obtain owner agreement for meaningful deviations. For data changes,
identify authoritative inputs and preserve recoverability. Surface rejected input
and conflicts that change meaning. Keep secrets out of tracked files and
diagnostics.

## Verify the promised behavior

Choose checks from acceptance examples. Run focused checks while iterating and
the relevant project gates before delivery. Exercise the boundary being claimed:
the actual interface, persistence after reopen, or migration from older data.
Mocks prove their modeled behavior; validate platform restrictions they bypass.

For bugs, obtain decisive evidence, fix the cause, and add a regression check
when practical. If a check is wrong, correct it with the reason. Repeated failed
fixes call for a new observation. For asynchronous or owner-tested behavior,
provide enough diagnostics to identify the build, action, decision, and result.
State material unverified boundaries.

Drive browsers headless. Prefer the project's test runner to a raw browser binary:
it pins the version and controls the page, where a system browser updates outside
the lockfile and makes results machine-dependent. Where a check depends on GPU
rendering, use the runner's full browser, not its headless-only build, which may
fall back to software.

## Commit and deliver every changing turn

Inspect Git status, branch, upstream, and staged changes before editing and before
committing. Coordinate overlapping work; stage only the task's changes and inspect
the staged diff. Commit each coherent task, issue, or feature outcome and each
turn that changes repository or tracked work state. Checkpoint unfinished work
with its remaining state in the Bead. Read-only turns need no empty commit.

Use a short imperative subject with the Bead ID; explain why when useful. Push to
the configured upstream before reporting delivery, following the project's branch
policy or, absent one, its existing working branch. Inspect upstream changes before
integrating; preserve others' work and history. A rejected push requires
reconciliation, not force. Report failed delivery explicitly. Persist and sync
Beads through its configured storage workflow as well as Git.

## Communicate clearly

Answer directly in plain language. Say each point once; omit rhetorical padding,
repeated context, and empty queues. Scale detail to the request. Distinguish
observed fact, inference, and unverified boundaries.

Every message is a result or a request. A result gives what changed, the evidence,
checks, remaining limits, and where the commit or artifact is; a request gives the
decision needed and numbered options with their costs. When work is blocked, the
block is the first line. Name the file, function or number behind a material claim.
Do not label your own statements true, restate the user's authority to instruct
you, or promise compliance. Where a mechanic, a defect or a measurement is the
subject, write it rather than an image of it. Correct an error; do not narrate or
justify it. Say plainly when something is unknown or unknowable to you; do not
supply a cause you could have controlled for a fact you could not observe.

When the user questions how you are working rather than what you built, that is
the entire reply: no work report, and no task list or rules document, which read
as responsive and cost another round to find out they are not. Name the pattern,
say what you considered and rejected, and propose a mechanism.

## Keep the protocol small

Every adopting project's AGENTS.md must retain this upstream reference:
https://github.com/mikepeiman/agentic-operations-improvement.
Contribute reusable operations, communication, and design improvements there as
Beads and updates to the shared core or routed practice document. Then refresh
the originating project's adoption, recording the upstream revision and local
adaptations. A local-only edit is incomplete. Read `docs/communication-inquiry.md`
there before proposing a communication rule, and record the observed instance.

Correct affected documentation in the change that makes it untrue. Keep one owner
per meaning. Record incidents in the relevant Bead; prefer a regression test or
tool fix to a new rule. Add instructions only for a recurring failure they can
prevent, replacing overlap. Keep project-specific facts and optional tool setup
outside this shared protocol; load them when needed.

Read `docs/ui-design-guidance.md` before designing or changing a view, component,
or interaction.

## Project: Super Tic-Tac-Toe

Adopted from upstream revision `9f6591d` on 2026-09-23. Local adaptations: the
setup procedure links the upstream package check instead of a local copy.

Super Tic-Tac-Toe is a tic-tac-toe strategy game for 2–8 players, played on
large boards with several marks per turn and scored on runs and full lines.
Online multiplayer is the core mode; local pass-and-play and bots are supporting.

- Governing design: [docs/GDD.md](docs/GDD.md). The owner reviews and comments on
  the living copy at https://claude.ai/code/artifact/d72fe939-63a3-4f00-91dd-cd0cb7417f1a;
  re-export it to `docs/GDD.md` in the change that adopts a doc edit. The repo
  file is what agents build from.
- Terminology: [docs/LEXICON.md](docs/LEXICON.md), including legacy code names.
- Setup and tracker reference: [docs/new-project-setup.md](docs/new-project-setup.md),
  [docs/beads.md](docs/beads.md). Interface work: [docs/ui-design-guidance.md](docs/ui-design-guidance.md).
- Current code is the legacy Sapper 0.27 app in `src/`. It does not build on
  Node 24 (node-sass 4, Rollup 1). Phase 1 replaces it with SvelteKit 2 and
  Svelte 5; scoring must match the legacy `score()` in
  `src/components/CountPoints.svelte` exactly (GDD section 3).
- Delivery: work on `master`, push to `origin/master`
  (https://github.com/mikepeiman/super-tic-tac-toe). Beads prefix `sttt`.
