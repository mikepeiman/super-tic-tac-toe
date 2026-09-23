# Beads setup and command reference

The work protocol lives in [AGENTS.md](../AGENTS.md). This guide is for setup,
command lookup, and storage troubleshooting. Commands below were checked with
`bd version 1.2.2 (6c124203e)` on Windows; inspect installed help before applying
them to another version. Installation instructions and releases live in the
[upstream Beads repository](https://github.com/gastownhall/beads).

## Initialize once

Check `bd --version`, existing `.beads/`, and `git config --get core.hooksPath`.
If already initialized, inspect `bd info --json` and existing work rather than
reinitializing. Install the OS-appropriate release if `bd` is missing.

For a new store, choose its permanent prefix and run, replacing `app`:

```sh
bd init --prefix app --skip-agents --skip-hooks --non-interactive
bd config set dolt.auto-commit on
bd ready --json
bd dolt remote list
```

`bd init` can create a Git commit and infer a Dolt remote from the Git remote.
Inspect the result. Skipping generated agent instructions and hooks keeps the
project's existing protocol and hooks intact. Hooks are optional; explicit
delivery commands below work without them. Initialization is not evidence that
remote synchronization works.

## Track the work

```sh
bd ready --json
bd list --json
bd search "restore" --status all --json
bd show app-123 --json
bd create "Restore a saved session" --type feature --body-file feature.md --json
bd update app-123 --claim
bd update app-123 --append-notes "Implemented restore; restart check remains."
bd close app-123 --reason "Acceptance examples pass; evidence recorded."
```

`app-123` is illustrative; use the returned ID. `feature.md` is an existing or
temporary input file, not another maintained specification. Inline description
and acceptance flags are also available. Use installed command help for variants.

For capture, follow the policy in AGENTS. Search related terms, aliases, and
closed work before creating a record. In this version, `bd search` searches
titles/IDs and requires a query; broaden independently with
`bd list --all --limit 0 --desc-contains "term" --json` and
`bd list --all --limit 0 --notes-contains "term" --json`.
Inspect candidate Beads with `bd show`; a shared keyword alone is not a match.
Search results are limited by default: adjust `--limit` or narrow the search when
the result reaches that limit. Deferred work must be included too.

When a user revisits a match, append a note such as:

```sh
bd update app-123 --append-notes '2026-09-14 recurrence of interest; user: "Restore should retain my groups."'
```

Use the actual mention date and exact relevant quotation; add a conversation
reference when available. Then update description, acceptance, or design fields
with new details so a reader need not reconstruct current intent from notes.
Keep earlier provenance. For agent-discovered information, identify the agent
and evidence instead of inventing a user quotation. A repeated mention of closed
work is recorded without automatically reopening it; reopen when accepted new
work requires it, and ask if that changes or conflicts with accepted intent.
For conflicts, record both statements and the pending owner question, leaving
the disputed decision unresolved. Work authorized independently can continue.

Use `feature` for a user capability, `bug` for expected versus observed behavior,
and `task` for independently useful enabling work or an investigation. A deferred
idea can be a feature with `--defer`; it is captured without becoming current work.
Use `epic` and `--parent <id>` only when grouping adds value. Record a prerequisite
with `bd dep add <dependent-id> <blocking-id>`; discovery provenance can use
`--deps discovered-from:<source-id>` on creation. A parent groups work; a blocking
dependency orders it.

A sufficient feature description might be:

> A returning user restores a saved session from the session list. Selecting
> Restore reopens its pages and preserves their saved groups. Cancellation leaves
> the current session intact. An unavailable page is reported without losing the
> saved entry. Verify restore, cancellation, partial failure, and persistence after
> restart. Excludes cross-device synchronization.

For a bug, add reproduction steps, environment/build, expected and actual results,
and decisive evidence. Keep later implementation notes and next action on that
same Bead. A small fix needs a few sentences, not a mandatory form. Leave unmet
acceptance open; use the core's closure rule to distinguish technical completion
from required owner testing or approval.

## Deliver work state

Beads 1.2.2 uses Dolt. A Git push of source files does not itself sync that
database. For this repository, `bd dolt remote list` should show `origin` at
`git+https://github.com/mikepeiman/agentic-operations-improvement.git`.
Other projects use their own configured remote, never this one.

When resuming shared work, pull its Dolt state before mutating it:

```sh
bd dolt pull
```

After issue changes, and again after recording closure:

```sh
bd dolt commit -m "Record task progress and evidence"
bd dolt push
bd export -o .beads/issues.jsonl
```

Inspect and stage the export and changed non-secret configuration with the task's
files, then commit and push Git. Auto-commit may leave nothing for the explicit
Dolt commit to do. A failed Dolt push means tracker delivery is pending even if
Git succeeds; preserve local work, report the error, and reconcile without force.

The tracked export gives humans a reviewable issue snapshot. It is generated;
edit through `bd`. It does not back up Dolt history, branches, or all database
tables. Use the configured Dolt remote and supported `bd backup` facilities for
full storage recovery. On a fresh checkout, initialize using that remote through
the installed `bd init --remote` workflow, then retrieve a known issue with
`bd show <id> --json`. Avoid silently replacing shared state from an old export.

## Troubleshooting

If unavailable, keep one temporary work note in the project's existing work
location and reconcile it into Beads when restored. Do not initialize a second
store over an existing one. Inspect installed help for migrations and recovery.

On this Windows checkout the first Dolt push failed with `Filename too long`
inside its nested Git remote cache. Enabling `core.longpaths` on that specific
cache repository allowed a retry. This is a local workaround for that observed
error, not a required global Git setting. Use the exact cache path in the error.
