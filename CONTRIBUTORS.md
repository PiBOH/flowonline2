# Contributors

Flowonline2 is a pixel-perfect, faithful web clone of Flowgorithm for Windows.
This file recognizes the humans (and the AI tooling they use) whose work ships
in the project. Where a *role* name is followed by a `[GitHub]` link, the
person actively participates in the commit history and is named in every commit
via the standard `Co-authored-by:` trailer convention.

## Creator & maintainer

* **[PiBOH](https://github.com/PiBOH)** — original author and ongoing
  maintainer. Designs the architecture, drives release criteria, and signs off
  on every release. Every release commit is co-authored by PiBOH (search
  `git log --grep="Co-authored-by: PiBOH"`).

## Active lead collaborator

* **[AlexGiulioBerton](https://github.com/AlexGiulioBerton)** — active lead
  collaborator. Co-authors every release commit, contributes to i18n QA,
  iconography, and review feedback.

## Acknowledged contributions

* **[lmarena](https://github.com/lmarena)** — provides the open model weights
  and reference tooling that Flowonline2's AI-assisted code-generation features
  build on top of. See <https://github.com/lmarena>.
* **@arenaai** — credited as the upstream mirror owner in the lmarena org.
  Flowonline2 does not redistribute their model weights; we only link to the
  public upstream.

## Contributor convention

Every commit that lands on `main` carries a `Co-authored-by:` trailer naming
each contributor who materially participated in the diff. Run

```
git log --pretty=format:'%h %s' --grep='Co-authored-by:'
git log --pretty=format:'%h %an <%ae>'
```

to enumerate contributors across the history. This convention guarantees that
no contributor is ever silently credited out of proportion.

## AI-assisted development — provenance policy

The maintainer pair uses AI coding assistance (Codebuff, lmarena models, and
similar tools) for code review, refactoring, and accelerated iteration.
Every AI-assisted diff is marked with a `Co-Authored-By:` trailer naming the AI
tooling used for that diff so the provenance is transparent in `git log`.
**All diffs are validated by the human maintainers and shipped only after they
sign off** — no commit is auto-merged.

## Pull requests are welcome

Fork the repo, branch off `main`, and open a PR at
<https://github.com/PiBOH/flowonline2/pulls>. If your PR lands, you'll be
added here on the next milestone roll-up.
