# New project setup

Use this procedure when initializing a project or adopting the protocol into an
existing one. The outcome is usable instructions, retrievable work state, and
verified delivery. Resume at the first unmet step when setup was interrupted.
This is an on-demand procedure, not another always-loaded rule file.

## Inspect and preserve

Work in the authorized project directory. Inspect existing agent instructions,
trackers, `.beads/`, Git status/branch/upstream, hooks, and build/test configuration.
For an existing Beads store, search for a setup Bead and claim it. If no store is
available yet, keep one temporary setup note and reconcile it after initialization.
Resolve competing tracker ownership with the owner before creating another store.

Reuse an existing Git repository. For a new project, initialize Git in the
authorized directory if needed. Obtain a missing remote or branch policy from
the owner; do not create a hosted repository or another checkout by inference.
Completion: the destination, existing records, and delivery path are identified;
unrelated work and hooks remain intact.

## Install or reuse Beads

Check `bd --version`. If missing, use the OS-appropriate installation instructions
and release from the [upstream project](https://github.com/gastownhall/beads),
then verify the executable in a new shell. Follow that release's dependencies;
do not install a separate Dolt server merely because Beads uses Dolt internally.
If installation is unavailable, retain the temporary note and report the exact
failure while continuing independent setup work.

Use [Beads commands and storage](beads.md) for initialization and synchronization.
Choose the permanent prefix from existing project identity. Reuse existing stores;
when shared remote history exists, initialize from it using installed
`bd init --remote` help instead of creating a competing empty history.
For a genuinely new store, use the guide's initialization sequence, preserving
existing hooks and agent instructions. Inspect any commit or remote inferred by
initialization. Pull shared state before mutation, then search for and claim the
setup Bead and reconcile the temporary note.
Completion: the intended database and remote are identified, and the setup Bead
can be read through `bd show`.

## Install the protocol and discover project commands

Copy [AGENTS.md](../AGENTS.md) for a new project; merge it into existing instructions
while preserving product constraints and removing superseded overlap. Copy the
optional [Claude pointer](../CLAUDE.md) only when needed; reconcile any existing
Claude-specific instructions rather than overwriting them blindly. Add project
purpose, governing-document pointers, unusual environment needs, and delivery
policy where agents already look for them.

Preserve the upstream repository URL and ongoing-improvement instructions in the
adopting AGENTS.md. Locate the project's glossary or create `LEXICON.md` in its
governing-docs location; seed accepted domain terms and aliases, and add a concise
pointer from AGENTS.md.

Use the project's package/runtime configuration to discover setup and verification
commands. Install required project dependencies through its established workflow;
add no generic hook, indexer, or framework without a demonstrated need.
Keep this procedure and the Beads guide together in the project's existing docs
location if ongoing setup reference is useful; adjust links to that project's core.

When the project builds a user interface, copy the
[UI design guidance](ui-design-guidance.md) beside those procedures and note the
project's component library in its instructions. It is SKILLS-type input for
interface tasks, not a rule agents carry every turn; skip it for a project with no
user interface.

Run the [adopted-project check](https://github.com/mikepeiman/agentic-operations-improvement/blob/master/checks/README.md) from this package when available.
It validates entry files and their direct links; inspect referenced project
instructions for conflicts separately. Completion: agents have a clear entry point
and relevant project commands are known or their concrete blockers recorded.

## Verify delivery and recovery

Record setup progress and remaining limits in the setup Bead. Follow the Beads
guide to sync Dolt, review/export issue state, and commit/push owned Git changes.
Confirm the remote Git revision and pull/read back the known Bead. Failed Git
and Dolt delivery remain separately visible; neither substitutes for the other.

Check installed `bd backup` help and the project's configured recovery mechanism.
Verify remote retrieval or an existing backup in an authorized disposable location
before claiming recovery. Never restore over the live store as a test. If a
separate recovery location needs authority, keep that check pending and identify
exactly what has been proved; a JSONL export is not a full database backup.

In a fresh agent session, retrieve the setup Bead and delivered revision using the
project entry point without the setup chat. Confirm intent, evidence, blockers,
and next action are understandable. Keep setup acceptance open until that check
and any required owner approval are recorded. A new CLI process tests persistence,
not a fresh agent's ability to resume.
