# Contributors

Flowonline2 is a pixel-perfect, faithful web clone of Flowgorithm for Windows.
This file recognizes the humans (and the AI tooling they use) whose work ships
in the project. Credits are recorded here, in this file, and are **not**
expressed through commit trailers.

## Creator & maintainer

* **[PiBOH](https://github.com/PiBOH)** — original author and ongoing
  maintainer. Designs the architecture, drives release criteria, and signs off
  on every release.

## Active lead collaborator

* **[AlexGiulioBerton](https://github.com/AlexGiulioBerton)** — active lead
  collaborator, contributing to i18n QA, iconography, and review feedback.

## Acknowledged contributions

* **[lmarena](https://github.com/lmarena)** — provides the open model weights
  and reference tooling that Flowonline2's AI-assisted code-generation features
  build on top of. See <https://github.com/lmarena>.
* **@arenaai** — credited as the upstream mirror owner in the lmarena org.
  Flowonline2 does not redistribute their model weights; we only link to the
  public upstream.

## Contributor convention

Commits are kept plain and machine-readable: the subject line carries the
version (`v<version>: <summary>`) plus a short body, and **no participation
trailers are used** — no `Co-authored-by:`, no `Signed-off-by:` added by
tooling, and no "generated with" footer. Credit lives in this file and in the
milestone log of `AGENTS.md`, so that no contributor is ever silently credited
out of proportion.

To enumerate the people who committed to `main`:

```
git log --pretty=format:'%h %an <%ae>'
```

## AI-assisted development — provenance policy

The maintainer pair uses AI coding assistance (Codebuff, lmarena models, and
similar tools) for code review, refactoring, and accelerated iteration.
Provenance of AI-assisted work is documented in `CHANGELOG.md`, in the
`AGENTS.md` milestone log and in the version history — not through commit
trailers.
**All diffs are validated by the human maintainers and shipped only after they
sign off** — no commit is auto-merged.

## Pull requests are welcome

Fork the repo, branch off `main`, and open a PR at
<https://github.com/PiBOH/flowonline2/pulls>. If your PR lands, you'll be
added here on the next milestone roll-up.
