# Changelog

All notable changes to Flowonline2 are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning.](https://semver.org/spec/v2.0.0.html).

---

## [2.6.16-beta] - 2026-08-02

### Changed
- **arenaai.md milestones reordered:** All 60 milestone entries are now listed chronologically (oldest → newest) by semantic version, all under a unified `### Milestone` heading level inside section 5, replacing the mixed `##`/`###` levels and the reversed ordering of recent milestones. No milestone content was removed or renamed; the section-5 heading version annotation was updated to 2.6.15-beta.
- Validation: TypeScript, Vitest, production build, and `git diff --check` all pass.

## [2.6.15-beta] - 2026-08-02

### Changed
- **Disclaimer icon → 📑 bookmark tabs SVG:** The Disclaimer entry in the Help menu (desktop + mobile) now uses the new `IconBookmarkTabs` SVG (stacked pages with colorful bookmark tabs, matching the emoji) instead of the balance-scale `IconScale`. `IconScale` was removed from `EmojiIcons.tsx` and all imports updated (`Header.tsx`, `MobileSidebar.tsx`, `MobileToolsView.tsx`).
- Validation: TypeScript, Vitest, production build, and `git diff --check` all pass.

## [2.6.14-beta] - 2026-08-02

### Changed
- **MANUAL.md:** All 14 `Flowgorithm` mentions now link to https://flowgorithm.org/ ; the Security/Privacy/Disclaimer links in all 5 language sections now point to the GitHub blob URLs (github.com/PiBOH/flowonline2/blob/main/docs/...) instead of relative paths.
- **Disclaimer in Help menu (desktop):** New `Disclaimer` entry (with a golden balance-scale SVG icon) added to the Help dropdown, opening a WinUI dialog that dynamically loads `docs/DISCLAIMER.md` from the official GitHub repository (with local + hardcoded fallback), mirroring the Security/Privacy pattern.
- **Disclaimer in Help (mobile):** `Disclaimer` item added to the Tools Help card and the navigation drawer in `MobileToolsView` / `MobileSidebar` / `MobileApp`.
- **New SVG icon:** `IconScale` added to `EmojiIcons.tsx`.
- **Translation keys:** `disclaimerPolicy` / `disclaimerRepoLoaded` / `disclaimerFallbackLoaded` added to the desktop header menu translations for all 23 languages.
- **Menu bar spacing reduced:** Desktop menu-bar buttons use `px-[6px]` (was `px-[10px]`) and wrappers use `ml-0.5` (was `ml-1`) so the menu bar fits on smaller monitors.
- Validation: TypeScript, Vitest, production build, and `git diff --check` all pass.

## [2.6.13-beta] - 2026-08-02

### Added
- **`docs/DISCLAIMER.md`:** New multilingual disclaimer (no warranty, no liability, educational purpose, third-party content) following the same structure and language index as `SECURITY.md` and `PRIVACY.md` (EN, IT, DE, FR, ES). Explicitly quotes and implements license sections **15 (Disclaimer of Warranty)** and **16 (Limitation of Liability)** of the AGPL-3.0 license.
- **README.md:** `Policies` section now also links to the Disclaimer.
- **MANUAL.md:** Each language section (EN, IT, DE, FR, ES) now also links to `docs/DISCLAIMER.md`.
- Validation: TypeScript, Vitest, production build, and `git diff --check` all pass.

## [2.6.12-beta] - 2026-08-02

### Changed
- **Security disclosure acknowledgment window:** `docs/SECURITY.md` now states that report acknowledgments are given within **2 weeks** instead of **72 hours**, updated consistently in all five language sections (EN, IT, DE, FR, ES).
- Validation: TypeScript, Vitest, production build, and `git diff --check` all pass.

## [2.6.11-beta] - 2026-08-02

### Added
- **Security Policy & Privacy Policy in the Help menu:** New desktop `Help` menu entries (with shield and lock SVG icons) and mobile `Help` sections opening WinUI/M2 dialogs that load `docs/SECURITY.md` and `docs/PRIVACY.md` dynamically from the official GitHub repository (with local fallback), matching the existing Manual/Changelog pattern.
- **New SVG icons:** `IconShield` and `IconLock` added to `EmojiIcons.tsx`.
- **Translation keys:** `securityPolicy` / `privacyPolicy` / `securityRepoLoaded` / `securityFallbackLoaded` / `privacyRepoLoaded` / `privacyFallbackLoaded` added to the desktop header menu translations for all 23 languages.
- **MANUAL.md:** Each language section (EN, IT, DE, FR, ES) now links to `docs/SECURITY.md` and `docs/PRIVACY.md`.
- Validation: TypeScript, Vitest, production build, and `git diff --check` all pass.

## [2.6.5-beta – 2.6.10-beta] - 2026-08-02

### Changed
- **License migration to AGPL-3.0:** Replaced every remaining pre-migration license reference with AGPL-3.0 across the whole project. Updated `package.json`/`package-lock.json`, `README.md`, `MANUAL.md` (incl. the stale Italian MIT mention), `arenaai.md`, `CHANGELOG.md`, `docs/aimode.md` (all 24 localized sections + JSON-LD license URLs), `Header.tsx` fallback text, `translations.ts` (`gplLicenseTextFallback` → `agplLicenseTextFallback` for all 23 languages), `codeGenerator.ts`, `codeGenerator.test.ts`, `fprgParser.ts` about-attribute, and `MobileApp.tsx`.
- **License wording simplified:** All long-form license references replaced with the plain text `AGPL-3.0` across source, translations, docs, and metadata. `package.json` / `package-lock.json` `license` field is now `AGPL-3.0`.
- **Language label kept in English:** The language selector label in the desktop header toolbar (`Header.tsx`), the language picker dialog title, the mobile menu language entry, and the source-code language label in `Sidebar.tsx` now always read `Language` / `Select Language` in English instead of being localized.
- **Attribution phrases end at "AGPL-3.0":** The developer attribution sentences in `README.md` and `MANUAL.md` (English + Italian) now stop at "under/sotto AGPL-3.0." instead of continuing with a trailing description.
- **License spelling unified to `AGPL-3.0`:** All references previously written as `AGPL 3.0` are now written `AGPL-3.0` (the standard SPDX-style spelling) across source, translations (23 languages), docs, and metadata.
- **Security & Privacy policies:** Added `docs/SECURITY.md` and `docs/PRIVACY.md`, both available in the same languages as the README (EN, IT, DE, FR, ES) with an initial index.

### Architecture invariants
- The `LICENSE` file (AGPL-3.0) is now the single source of truth referenced everywhere.
- Validation: TypeScript, 136 Vitest tests, production build, and `git diff --check` pass.

---

## [2.6.4-beta] - 2026-08-01

### Fixed
- **WinUI close buttons:** The title-bar `X` now stops its `pointerdown` event from reaching the draggable title bar. This prevents pointer capture and `preventDefault()` from suppressing the button click, so every resizable WinUI dialog closes normally.

### Added
- **WinUI close regression test:** Added jsdom coverage for pointer interaction and the `onClose` callback.

### Architecture invariants
- Dialog dragging, manual resizing, default-size reset, and `.fprg` file handling remain unchanged.
- Validation: TypeScript, 136 Vitest tests, production build, and `git diff --check` pass.

---

## [2.6.3-beta] - 2026-08-01

### Fixed
- **Mobile detection:** The rotated mobile surface no longer activates when a desktop browser window is merely resized to a phone-like CSS width.
- **Device classification:** Mobile mode now combines mobile User-Agent/platform signals, touch capability, screen dimensions, and CSS viewport dimensions. iPadOS desktop-mode Safari is supported through `MacIntel` plus touch detection, while ordinary desktop touchscreens remain desktop.
- **Orientation handling:** Portrait mobile devices use the rotated presentation; mobile devices already in landscape are not rotated a second time.

### Added
- **Viewport regression tests:** Added unit coverage for resized desktop windows, desktop touchscreens, Android, iPhone, iPadOS desktop mode, and mobile landscape.

### Architecture invariants
- Desktop behavior remains unchanged when a desktop browser is resized.
- `.fprg` parsing, opening, serialization, and saving logic is unchanged.
- Validation: TypeScript, 135 Vitest tests, production build, and `git diff --check` pass.

---

## [2.6.2-beta] - 2026-08-01

### Added
- **Language index in `docs/aimode.md`:** Added a compact Markdown table with direct links to all 24 localized GEO and JSON-LD sections, using explicit stable anchors for reliable navigation across accented, non-Latin, RTL, and symbol-based language headings.

### Changed
- **Version metadata:** Synchronized `version.txt`, `package.json`, `package-lock.json`, `CHANGELOG.md`, `arenaai.md`, and `docs/aimode.md` to `2.6.2-beta`.

### Architecture invariants
- Documentation-only change; application runtime and `.fprg` file handling are unchanged.
- All 24 language sections remain complete and in their original order.

---

## [2.6.1-beta] - 2026-08-01

### Changed
- **Mobile presentation:** Reuses the existing desktop layout as a portrait-oriented mobile surface without introducing a separate design-system dependency. Landscape touch devices are left unrotated because they are already horizontal.
- **Version metadata:** Synchronized `version.txt`, package metadata, release documentation, and localized AI-mode metadata to the canonical `2.6.1-beta` value.

### Fixed
- **Mobile viewport compatibility:** Added safe `matchMedia` fallback handling and orientation-aware touch detection for older browsers and embedded webviews.
- **localStorage clearing:** Both clear modes cancel pending debounced writes so removed saved work is not immediately recreated; the optional Flag still controls whether the active canvas is cleared.
- **WinUI interaction:** Dialog dragging and manual resizing now use Pointer Events, supporting mouse, pen, and touch while preserving rotated-surface coordinate mapping.
- **CSS build:** Removed the stray closing brace that prevented the production stylesheet from compiling.

### Architecture invariants
- Desktop behavior remains scoped and unchanged outside the mobile presentation wrapper.
- `.fprg` parsing, serialization, opening, and saving logic was not modified.
- Validation: TypeScript check, 126 Vitest tests, production build, and `git diff --check` pass.

---

## [2.6.0-beta] - 2026-08-01

### Added
- **Mobile interface rebuild:** Rebuilt the mobile bundle from scratch under `src/mobile/` with a touch-friendly top app bar, navigation drawer, bottom navigation, cards, dialogs, FAB controls, elevation tokens, and responsive spacing.
- **Dedicated mobile flowchart renderer:** Mobile now renders an isolated, accessible block tree with nested TRUE/FALSE and loop branches instead of mounting the desktop `FlowchartCanvas` or `BlockNode` components.
- **Optional storage Flag:** The mobile clear-localStorage dialog keeps current work by default and offers an explicit Flag to clear the active flowchart as well.

### Fixed
- **Mobile accessibility:** Closed navigation drawers are no longer mounted or keyboard-focusable.
- **Mobile actions:** Export, community links, language selection, execution controls, and storage operations remain wired to the existing FlowContext and export engines.
- **Mobile editing:** Added a block-type picker for every supported statement type, nested branch/body insertion, delete actions, and a mobile block editor with declaration, array, loop-direction, and output controls.
- **Mobile export continuity:** The dedicated mobile SVG export target remains mounted across view changes, so SVG, PNG, and PDF exports also work from Tools.
- **Metadata consistency:** Application metadata and documentation use the canonical release format without a lifecycle prefix.

### Architecture invariants
- Desktop components and desktop styles were not modified by the mobile redesign.
- Mobile selectors remain scoped to the mobile surface and do not alter the desktop layout.
- Source strings and project documentation for this release are written in English.

---

## [2.5.9-beta] - 2026-07-21

### Changed
- **CHANGELOG fixup:** added the missing 2.5.8-beta section that the prior commit (`e17ad28`) shipped without. Also bumps version one more step to 2.5.9-beta per ad-ogni-messaggio rule.

### Architecture invariants
- Pure documentation catch-up; no source-code change.
- 126/126 vitest still passing. tsc --noEmit clean.

---

## [2.5.8-beta] - 2026-07-21

### Changed
- **MobileTabBar.tsx deletion finally committed:** staging-state orphan from Phase 5 sidebar-drawer rework now resolved (file had been rm'd but never git rm'd + committed). Captured via `git rm` + commit so `git status --short` returns to a known-clean baseline.
- **LF/CRLF drift ghosts purged:** 7 src/ files showed ` M` due to line-ending noise from earlier `sed -i` ops; reset via `git checkout HEAD --` (no content change since `git diff` was empty on every file). Imported files: App.tsx, Console.tsx, FlowchartCanvas.tsx, WinUIDialog.tsx, FlowContext.tsx, codeGenerator.ts, translations.ts.

### Architecture invariants
- MobileTabBar.tsx deletion has zero downstream importers (verified by `grep -rn "MobileTabBar" src/` returning NONE).
- 126/126 vitest still passing. tsc --noEmit clean.

---

## [2.5.7-beta] - 2026-07-21

### Changed
- **Lifecycle-prefix strip pass (followup):** completed the remaining cleanup that the prior commit (e1bbbf1) only partially executed. Confirmed the 8 CHANGELOG.md inline refs and 5 src/components/{Header,BlockNode}.tsx comments are stripped (`**Version:** Bumped to 2.3.1.`, `(2.0.12 / 2.1.0 New feature!)`, etc.). Enhanced regex now covers bare `RC` form too.

### Architecture invariants
- No source-code behavioral changes; only docstring + prose references altered.
- 126/126 vitest still passing. tsc --noEmit clean.

---

## [2.5.5-beta] - 2026-07-21

### Fixed
- **Inserter menu count badges:** Both left-click and right-click paste rows now suppress the `(N)` clipboard count when `copiedBlocks.length === 0`, preventing visually misleading `Paste (0)` labels.
- **Dead import:** Removed unused `IconPlus` import from `FlowchartCanvas.tsx` (resolved TS6133 leftover from the Phase 5.2 inserter rewrite).

### Changed
- **v-prefix release prep:** Anchored the auto-release workflow on the fresh `2.5.6-beta` tag (previous v-prefix commit was on `v2.5.4-beta`). No code changes; this entry exists purely to record the schematic-version bump and trigger the next `[bot]` GitHub release.

---

## [2.5.4-beta] - 2026-07-21

### Fixed
- **Single-step "Add block" UX (Phase 5.2).** Clicking the inserter arrow on the canvas now opens ONE menu showing both **Paste** (the clipboard count, with Ctrl+V shortcut hint) and **New block** (the 10-type grid). The previous two-step prompt ("paste or new?" then a second picker) is gone. Same applies to the right-click context menu on the inserter: it now shows JUST "Paste Block" with the clipboard count and Ctrl+V hint, since left-click already provides the unified insert menu.

### Architecture invariants preserved
- Desktop and mobile bundles unchanged except for the targeted FlowchartCanvas.tsx edits.
- The Paste row is disabled (`disabled={copiedBlocks.length === 0}`) when no blocks have been copied, preserving the existing UX for that case.
- Viewport coordinates of the popup (`activeInserter.x / y`) are unchanged — no layout regression.

---

## [2.5.3-beta] - 2026-07-21

### Fixed
- **Re-release with all Phase-5 TypeScript errors resolved.** The previous `v2.5.2-beta` release commit (`f516b39`) shipped a broken tree (TS1184 + 4 follow-ups needed). This tag points at the corrected tree, ending up at `<new-commit>`. No user-facing functional change — identical Phase-5 mobile UX, just bug-fixed.
- **Auto-release workflow re-published a clean `2.5.3-beta_bot` tag** on `main` (the broken `2.5.2-beta_bot` tag remains in the GH registry until manually yank'd via the GH Releases UI; recommended followup for the user).

### Added (Phase 5 — recap)
- `src/mobile/MobileSidebar.tsx` slide-in drawer with backdrop dim, chevron-tap-to-expand submenu help footer, ESC-to-close a11y + focus-restore + body-scroll lock.
- `src/mobile/MobileTopBar.tsx` slim 52px one-row top bar with inline 3-line hamburger-left + Run/Step/Pause/Stop-right.
- `vite.config.ts` read `version.txt` at build time → `import.meta.env.VITE_APP_VERSION` (with `'0.0.0-UNKNOWN'` fallback per user spec).
- `src/mobile/MobileApp.tsx` Path-C full sidebar wiring: hidden file input ref, 3 WinUI overlays (About/Manual-from-GitHub/Changelog-from-GitHub), MobileLanguageSheet re-use, GitHub `window.open` for bug/feature/fork links.

### Removed
- `src/mobile/MobileTabBar.tsx` (and its 58-line CSS block); replaced by sidebar drawer.

---

## [2.5.2-beta] - 2026-07-21

### Changed
- **Mobile UX redesign (Phase 5):** Replaced the bottom 5-tab navigation rail with a single one-row top bar (☰ hamburger-left + Run/Step/Pause/Stop-right). A slide-in sidebar drawer now hosts every other option: view switching (Canvas/Edit/Run/Console/Tools), file ops (New/Open/Save/Backup JSON/Export SVG+PNG+PDF/Clear Local Storage), edit ops (Undo/Redo), console ops (Clear output), and a pinned Help footer (Manual/Changelog/About/Report Bug/Request Feature/Fork & Contribute/Language picker).
- **Top bar height: 60px → 52px.** Brand chip + subtitle removed; the execution controls (Run/Step/Pause/Stop) now have the entire visible top bar to themselves and stay reachable from any view.
- **Sidebar drawer width:** `min(320px, 88vw)` so it scales gracefully down to ≤360px phones, capped so it never overflows the screen.

### Added
- **`src/mobile/MobileSidebar.tsx`** (~250 lines): backdrop-dimmed slide-in drawer from the left. Body-scroll lock while open. Each main row supports `tap-the-row-to-navigate` (also closes drawer) **or** `tap-the-chevron-to-expand` (reveals a sub-list). Help section pinned at the footer with its own `aria-expanded` chevron. Full RTL-safe direction via `.m-root[dir='rtl']` flow.
- **Vite build-time `version.txt` injection (`vite.config.ts`):** synchronous `fs.readFileSync(path.resolve(process.cwd(), 'version.txt'), 'utf-8')` at Vite config-load time; trimmed string inlined into the React bundle as `import.meta.env.VITE_APP_VERSION` via `define: { … }`. Fallback `0.0.0-UNKNOWN` if the file is missing/unreadable so the UI is never lied to about which version is running.

### Removed
- **`src/mobile/MobileTabBar.tsx`** (and its CSS block): eliminated; the bottom 72px tab strip is gone. MobileApp no longer renders `<MobileTabBar>`. The `<main>` view now fills the full viewport below the topbar — zero dead space.

### Fixed
- **Header `appVersion` initial state** (`src/components/Header.tsx`): was hardcoded `'0.0.0-UNKNOWN'` and only ever overwritten by a GitHub raw fetch (which was unreliable). Now sourced from `import.meta.env.VITE_APP_VERSION` at first render. `version.txt` is the **single source-of-truth** for both the in-app About dialog and the `.fprg` filename prefix.

### Architecture invariants
- Desktop bundle byte-for-byte unchanged except for the one-line Header initial-state change (additive — `setAppVersion` still functions identically if used).
- Mobile bundle: 12 → 11 files (`MobileTabBar.tsx` removed). Every selector strictly scoped to `.m-root`.
- 126/126 vitest passing. `tsc --noEmit` clean.

---

## [2.5.1-beta] - 2026-07-21

### Fixed
- **`src/context/FlowContext.tsx` — localStorage clear bug.** `clearLocalStorage` no longer silently lets the 500ms debounced save resurrect the cleared state. The implementation is now structured in two phases split across the `try/catch` boundary so a failed storage operation (private-mode browser, quota exceeded) leaves the user's in-memory chart UNTOUCHED rather than half-cleared:
  - **Phase A** (inside try): `window.localStorage.removeItem(STORAGE_KEY)` plus, when opted in, cancel the pending `saveTimeoutRef.current`, synchronously overwrite `latestSaveRef.current` with the empty-state tuple, and remove `AUTHOR_KEY`, `'flowonline2_mobile_view'`, `'flowonline2_autosave'`. On error: `console.warn` + early `return`.
  - **Phase B** (outside try): if `opts.alsoClearCurrentWork === true`, run all 7 state setters (`setStatements([])`, `setProgramTitleState('Untitled Program')`, `setProgramAuthorState('')`, `setUndoStack([])`, `setRedoStack([])`, `setSelectedBlockIds([])`, `stopRun()`) — never partially.
- The default behavior (`clearLocalStorage()` no-arg) is preserved: only `STORAGE_KEY` is removed; the in-memory chart survives; the existing desktop call site at `Header.tsx:2123` is unchanged and still backward-compatible.

### Added
- **`'Flag' toggle in the mobile clear-localStorage dialog (src/mobile/MobileToolsView.tsx).`** Off by default. When the user activates it, `clearLocalStorage({ alsoClearCurrentWork: true })` is called: the dialog shows a red-bordered `FLAG` pill, the box border turns accent-red, and the toast confirms with `"localStorage fully cleared ✓ (including current work)"`. Default behavior unchanged: `"legacy saved program removed ✓ (current work kept)"`.
- An informational paragraph in the dialog body explains on-vs-off behavior so the user understands exactly what the Flag does before toggling.

### Architecture invariants (still held)
- `tsc --noEmit` clean, `npx vitest run` 126/126 passed.
- `clearLocalStorage` is the single source of truth for "clear storage". Future localStorage keys (layout, colorScheme, etc.) should be added there, not at every call site.
- Mobile `MobileToolsView.handleClearLocalStorage` no longer manually `localStorage.removeItem('flowonline2_autosave')` — that's centralized.
- The mobile bundle still lazy-loads; desktop bundle byte-for-byte unchanged.

---

## [2.5.0-beta] - 2026-07-21

### Added
- **`src/components/StatusDot.tsx`** — Shared desktop + mobile status component. Default state is a tiny colored dot (8px, optional glow on `glow` prop). On hover / focus / tap, smoothly expands to a pill containing the label (max 320px, ellipsis on overflow). Touch: tap to show pill, auto-collapses after 2.4s, outside-click also collapses. Five variants: `live` (green), `fallback` (amber), `done` (blue), `error` (red), `info` (slate). Accessible: `role="status"`, `aria-label` always present, focusable.
- **`src/mobile/mobile.css`** — Full design-token rewrite (Phase 3 mobile-from-scratch). New design tokens (spacing, type scale, motion easings, shadows, color palette) defined under `.m-root`. Tab bar with animated top accent indicator, card-based sections, sheets, FAB stack. Every selector strictly scoped under `.m-root` so the desktop bundle can never pick up mobile rules.
- **`src/mobile/MobileTopBar.tsx`** (rewrittten) — 60px sticky glassy top bar + brand + contextual title + autosave `StatusDot` + Save-JSON icon button. The persistence `StatusDot` reflects saved / saving / stale / idle state, all from a cheap O(1) comparison on `(statements.length, last-id, programTitle)` instead of full-tree JSON.stringify.
- **`src/mobile/MobileTabBar.tsx`** (rewritten) — 5-tab bottom navigation rail using colorful SVG icons from the shared `EmojiIcons.tsx` library (IconChart, IconPencil, IconPlay, IconChatBubble, IconTools). Smooth animated top accent indicator on tab change. 72px tall + safe-area bottom inset.
- **`src/mobile/MobileCanvasView.tsx`** (rewritten) — Wraps `<FlowchartCanvas>` with a top status overlay (statement count + zoom) and a bottom-right zoom FAB stack (zoom-out, reset, zoom-primary zoom-in).
- **`src/mobile/MobileEditView.tsx`** (rewritten) — Card-based sections (Selection / Clipboard / History / Canvas). Copy / Cut / Paste / Undo / Redo / Clear-canvas with proper enabled-state and a `WinUIDialog` confirm for clear (no `window.confirm`).
- **`src/mobile/MobileRunView.tsx`** (rewritten) — Top `StatusDot` for execution state (idle / running / paused / done) + 2×2 action grid (Run / Step / Pause / Stop) + speed slider (1–600%) + Notes section explaining Step / Pause semantics.
- **`src/mobile/MobileConsoleView.tsx`** (rewritten) — Minimal mobile-safe wrap of the existing `<Console>`.
- **`src/mobile/MobileToolsView.tsx`** (rewritten) — 5 card sections (Program title/author / Settings language+color+layout / Export SVG/PNG/PDF / Help about+manual+changelog+issue+fork / Storage clear-localStorage). Per-row `StatusDot` indicates LICENSE / MANUAL / CHANGELOG load state (live, fallback, or idle) without an invasive pill at rest.
- **`src/mobile/MobileLanguageSheet.tsx`** (rewritten) — 23-language picker as a bottom sheet with colorful SVG `FlagIcon`s + a translation-accuracy warning in the sheet header.
- **`src/mobile/MobileBottomSheet.tsx`** (rewritten) — Minor polish; functional behavior unchanged (snap points, drag-down dismiss, scroll lock, Escape-to-close, portaled to `document.body`).
- **`src/mobile/MobileApp.tsx`** (rewritten) — Hoisted `RTL_LANGS` Set to module scope. Persists the user's selected tab in localStorage (`flowonline2_mobile_view`). Sets `dir='rtl'|'ltr'` on the mobile root depending on whether the active language is Persian / Arabic / Hebrew.
- **`CONTRIBUTORS.md`** (rewritten) — Full credits listing [PiBOH](https://github.com/PiBOH) (creator / maintainer) + [AlexGiulioBerton](https://github.com/AlexGiulioBerton) (active lead collaborator) + lmarena (acknowledged model-tooling contributor) + `@arenaai` (upstream handle). Documents the `Co-authored-by:` trailer convention used in every commit.

### Changed
- **`src/components/Header.tsx`** — Replaced 4 colored source-status chips (line 2644 version, line 2664 license, line 2741 manual, line 2769 changelog) with `<StatusDot>` calls. The chips used to say things like "loaded from GitHub" or "fallback path" and were invasive; the new dots are silent at rest and surface their label only on hover / focus / tap.
- **Version fallback** in `Header.tsx` is now `'0.0.0-UNKNOWN'` (both the React `useState` initial value and the final fallback after both GitHub and local fetches fail). No more hardcoded `'2.1.0'` lies — the user is told exactly when the version could not be loaded.
- **`.ignore/.assetsai/README.md`** — Stale pre-migration license mentions cleaned up (the directory is `.gitignore`'d but keeping the dev's local notes consistent with the current AGPL-3.0 license reduces confusion).

### Fixed
- **`MobileToolsView` useEffect cleanup bug** — The 3 fetch effects (about / manual / changelog) used to return `() => { cancelled = true; }` from inside an async IIFE, which `useEffect` receives as a `Promise` and discards. The cleanup is now hoisted outside the IIFE so the `cancelled` flag flips correctly on unmount or language change. Stale state-update warnings are gone.
- **`mobile.css !important` override** — The rule `.status-dot[data-open='true']` was forcing a slate-100 background even when the `StatusDot` inline style set a per-variant tinted background. The `!important` is gone; the per-variant pill tint (e.g. amber for fallback) now survives on expansion.
- **`StatusDot` pill max-width** bumped 260 → 320 so longer German ("Lizenz dynamisch von GitHub geladen") + Asian license/manual labels don't truncate visibly with ellipsis.

### Architecture invariants (still held)
- **Desktop bundle stays put**: only `Header.tsx` was edited, and only at the 4 source-status locations plus the version fallback string. `MainLayout` (in `App.tsx`), `FlowchartCanvas`, `Sidebar`, `Console`, `Modals`, `WinUIDialog`, `BlockNode` are byte-for-byte identical.
- **Mobile CSS stays scoped under `.m-root`** (zero desktop bleed).
- **Tests pass**: `tsc --noEmit` clean, `npx vitest run` 126/126 passed, `npm run build` succeeds.
- **State reuse**: every mobile component still pulls from `useFlow()` — no duplication of state.

---

## [2.4.0-beta] - 2026-07-21

### Added
- **Mobile Bundle Phase 2.5 — About / User Manual / Changelog i18n.** Mobile dialogs in `src/mobile/MobileToolsView.tsx` no longer ship hardcoded English titles or load-failed bodies. They now resolve through `translations[language]` for all 23 supported languages (`en, en_GB, de, fr, es, it, zh, nl, pt, gl, ru, uk, cs, pl, hu, sl, ja, th, id, mn, ar, he, fa`).
- **6 new keys × 23 languages in shared `TranslationCatalog`** (`src/utils/translations.ts` + interface in `src/types/flow.ts`): `aboutTitle`, `manualTitle`, `changelogTitle`, `agplLicenseTextFallback`, `manualTextFallback`, `changelogTextFallback`. The 3 `*Fallback` fields render with `white-space: pre-wrap` and provide brief load-failed messaging pointing users to LICENSE / MANUAL.md / CHANGELOG.md in the repository.
- **RTL direction** in WinUIDialog bodies — Persian (`fa`), Arabic (`ar`), and Hebrew (`he`) dialogs now set `dir="rtl"` on the body container so script direction, punctuation, and bilingual filename references render correctly.

### Changed
- **`src/mobile/MobileToolsView.tsx`**: dropped 6 module-level hardcoded English dialog constants (`ABOUT_TITLE`, `MANUAL_TITLE`, `CHANGELOG_TITLE`, `LICENSE_FALLBACK`, `MANUAL_FALLBACK`, `CHANGELOG_FALLBACK`). Dialog titles and bodies now pull from `translations[language]`. A `useEffect([language])` resets the 3 dialog-body states to the new language's fallback when the user switches language mid-session; the 3 fetch effects depend on `[open, language]` so a dialog opened across a language change re-fetches live content in the new locale.
- **`src/types/flow.ts`**: `TranslationCatalog` interface extended with 6 new top-level string fields (placed after `errors` for proximity to related catalog-surface groups).
- **Recovery:** During the initial implementation pass, a Python state-machine script accidentally dropped the Persian (`fa`) entry from `src/utils/translations.ts`. The entry was recovered from `git show HEAD:src/utils/translations.ts` and re-inserted with the 6 new keys added before the closing braces. All 23 language entries are now verified present (key count = 23 each for the 6 new keys; brace balance = 0; `tsc --noEmit` clean; `vitest run` 126/126 passed).

### Architecture invariants (still held)
- Desktop bundle byte-for-byte unchanged: `Header.tsx`, `FlowchartCanvas.tsx`, `Sidebar.tsx`, `Console.tsx`, `Modals.tsx`, `WinUIDialog.tsx`, `BlockNode.tsx` — zero edits.
- Mobile continues to import `translations` from the shared `src/utils/translations.ts` (no per-component translation duplication introduced).
- The desktop `Header.tsx` per-language `langTranslations` map remains untouched and can be unified with the shared `TranslationCatalog` in a Phase 2.6+ followup.

---

## [2.3.35-beta] - 2026-07-21

### Added
- **Mobile Bundle Phase 2 + 3 — Views, Orchestrator, App Routing.** Completes the parallel mobile UI bundle scaffolding:
  - **Phase 2 views**: `MobileTopBar` (sticky 56px + status pill + Save-as-JSON button), `MobileCanvasView` (wraps the desktop `FlowchartCanvas` with a zoom/zoom-count overlay), `MobileEditView` (Clipboard + History rows reactive to `useFlow()`), `MobileRunView` (big Run/Step/Pause/Stop grid + speed slider + status pill), `MobileConsoleView` (wraps the existing `<Console>`), `MobileToolsView` (program title/author inputs, language sheet, color scheme + layout selects, export menu — SVG/PNG/PDF, About + License + Manual + Changelog dialogs, Bug/Fork links, Clear-localStorage with confirm).
  - **Phase 3 orchestrator (`MobileApp.tsx`)**: localStorage-backed view router (`flowonline2_mobile_view`), top-bar + active view + tab-bar layout, 500 ms long-press detection on the canvas container that opens the pre-existing `MobileActionMenu`.
  - **Phase 3 routing (`src/App.tsx`)**: pure-additive. New `AppShell` component + `React.lazy(() => import('./mobile/MobileApp'))` + `useViewport()` hook. Renders `<MobileApp>` on ≤767px with `<MainLayout />` as the Suspense fallback, otherwise renders the existing `<MainLayout />` unchanged.
- **Architecture invariants still hold**:
  - Desktop files byte-for-byte unchanged: `Header.tsx`, `FlowchartCanvas.tsx`, `Sidebar.tsx`, `Console.tsx`, `Modals.tsx`, `WinUIDialog.tsx`, `BlockNode.tsx` — zero edits.
  - State is reused from the existing `FlowContext` via `useFlow()` — no duplication.
  - CSS strictly scoped under `.mobile-app-root` / `.m-*` — zero desktop bleed.
- **Phase 2.5 followups**: long-press handler that *actually* selects a block + deletes it (current Phase 2 fires the menu but always reports `hasSelection={false}`).

## [2.3.33-beta] - 2026-07-21

### Added
- **Mobile Bundle Phase 1 — Foundation.** A new parallel mobile UI bundle is now scaffolded under `src/mobile/`, strictly scoped so the desktop layout is untouched. This commit ships the foundation only; future work will add view components and viewport-based routing.
  * **Viewport hook (`useViewport.ts`)** detects screens ≤767px via `matchMedia` and reacts to live resizes.
  * **`mobile.css`** carries all mobile-only styles, gated behind a `.mobile-app-root` namespace so no desktop rule is affected.
  * **Reusable mobile components**: `MobileBottomSheet` (snap points + swipe-down dismiss + backdrop close + scroll lock), `MobileActionMenu` (block-context sheet: Cut / Copy / Paste / Delete), `MobileLanguageSheet` (the 23-language picker as a sheet with flag SVGs), `MobileTabBar` (Material-3 / iOS 17 bottom navigation with 5 tabs).
  * **Architecture guarantees**: Desktop files (`Header.tsx`, `FlowchartCanvas.tsx`, `Sidebar.tsx`, `Console.tsx`, `Modals.tsx`, `WinUIDialog.tsx`, `MainLayout` inside `App.tsx`) are byte-for-byte untouched. State is reused from the existing `FlowContext` — no duplication. CSS selectors are prefixed with `.mobile-app-root` or `.m-` so desktop styling is never affected.
- **Upcoming (Phase 2–3, followup commits)**: `MobileApp` orchestrator + 5 view components (Canvas, Edit, Run, Console, Tools) + `MobileTopBar` + viewport-based conditional rendering in `App.tsx`.

## [2.3.32-beta] - 2026-07-21

### Changed
- **Mobile header restored to BETA-classic Windows-MDI layout.** On screens ≤767px the header now shows in two stacked rows matching the desktop Flowgorithm style:
  - **Row 1**: window title bar with “Flowonline2” brand + minimize / maximize / close controls.
  - **Row 2**: classic horizontal menu bar with **File, Edit, Style, Tools, Program, Help** + Globe language picker — all visible inline (no more hamburger-only gating on small screens).
  - **Row 3**: action toolbar (Run / Step / Pause / Stop + undo / redo + zoom + file operations) — unchanged.
- The previously-only-mobile hamburger button and slide-out panel are now hidden on mobile, since the desktop-style menu bar is reachable directly. Touch-friendly sizing (≥44px tall buttons, horizontal scroll if menus don’t fit).

## [2.3.31-stable] - 2026-07-21

### Changed
- **Auto-release pipeline:** Releases now produce a clean GitHub release tagged without the `BETA`/`ALPHA`/`RC`/`STABLE` lifecycle prefix (e.g. `2.3.31-stable_bot` instead of `BETA_2.3.31-stable_bot`).
- **Stable release channel:** Versions ending in `-stable` are now published as **Stable** releases on GitHub. Any other lifecycle suffix (`-beta`, `-alpha`, `-rc1`, or no suffix) lands as a **Pre-release**. So `2.3.31-stable` ships as a full stable release rather than a pre-release badge.

## [2.3.30-beta] - 2026-07-21

### Changed
- **Bump + auto-release workflow test:** verision bumped to `2.3.30-beta` to validate end-to-end auto-release behavior.
  - Tag derivative logic in `.github/workflows/auto-release.yml` now strips `BETA/ALPHA/RC/STABLE` prefix → expected tag `2.3.30-beta_bot` and name `2.3.30-beta [bot]`.
  - Prerelease regex `\-stable$` keeps this version marked as `prerelease=true` (pre-release channel), consistent with `2.3.29-beta`.

## [2.3.29-beta] - 2026-07-21

### Fixed
- **P0 Memory leaks** — Three critical leaks closed:
  - `Sidebar.tsx`: `setTimeout` in `handleCopy` now stored in `copyTimeoutRef`, cleared on next copy and on unmount via dedicated `useEffect` cleanup.
  - `FlowContext.tsx`: keyboard listener no longer re-registers on every selection change. Switched to ref pattern (`selectedBlockIdsRef`, `copiedBlocksRef`) with `[]` deps, so the listener registers once and reads latest state via refs.
  - `vite-env.d.ts` (new file) added `/// <reference types="vite/client" />` so `import.meta.env.DEV` is properly typed.

### Changed
- **Language selector on desktop:** The desktop-menu wrapper className is now `flex items-center flex-1` so the Globe pill (which already has `ml-auto`) is anchored to the right edge of the menu bar instead of the right edge of the wrapper.
- **TypeScript Safety:** 5 `catch (err: any)` clauses replaced with `catch (err: unknown)` + `err instanceof Error ? err.message : String(err)` extraction in FlowContext.tsx (×2), Header.tsx (×2), Modals.tsx.

## [2.3.28-beta] - 2026-07-21

### Fixed
- **Mobile UI** — Hamburger button + toolbar now visible on mobile (≤767px):
  - Menu bar height: `h-[24px]` → `h-[44px] md:h-[24px]` so the 40px hamburger button fits cleanly.
  - Removed `.desktop-toolbar { display: none }` on mobile; replaced with touch-friendly `height: 44px`, `overflow-x: auto`, `min-width/min-height: 44px` for buttons, and iOS momentum scrolling.

## [2.3.23-beta] - 2026-07-20

### Changed
- **Colorful SVG icons:** All 26 EmojiIcons.tsx components now use fixed hex colors matching emoji appearance instead of monochrome `currentColor`.
- **New media-control SVG icons:** `IconPlay` (green), `IconStep` (blue), `IconPause` (orange), `IconStop` (red), `IconMonitor` (dark+blue).
- **23 country flag SVGs:** Replaced all flag emojis (`FLAGS_EMOJI` constant) with `FlagIcon` component using simplified SVG flag representations (horizontal/vertical tricolors, bicolors, circles, stars). Fallback uses `IconGlobe` SVG (no emoji).
- **Remaining emoji cleanup:** Replaced ▶⏭⏸⏹ in toolbar/dropdown with media SVG icons. Replaced 🖥️ in layout buttons with `IconMonitor`. Czech flag differentiated from Poland with blue triangle.
## [2.3.22-beta] - 2026-07-20

### Fixed
- **Mobile hamburger menu:** Added slide-out panel with fully functional Run/Step/Pause/Stop, File/Edit/Tools/Help menus, wired to real handlers (`handleExportFprg`, `handleExportSvg`, `handleExportPng`, `undo`, `redo`).
- **Block touch handling:** Removed broken `onTouchEnd` that hijacked tap-to-select on mobile. Mobile long-press now uses native `contextmenu` event via `onContextMenu`.
- **Desktop menu hidden on mobile:** Added `desktop-menu` CSS class to menu bar div so it hides at mobile breakpoints.
- **Mobile overlay:** Locks body scroll when menu is open, closes on overlay click or any action.

## [2.3.21-beta] - 2026-07-20

### Added
- **GitHub Actions CI/CD Workflows:**
  - **code-review-and-test.yml:** CI pipeline running lint (ESLint), typecheck (tsc --noEmit), build (vite build), and test (Vitest 126 tests) on every push/PR to main. Failure artifacts uploaded.
  - **auto-release.yml:** CD pipeline triggered on version.txt changes or manual dispatch. Reads version, parses tag, extracts changelog section, and creates a GitHub Release via `softprops/action-gh-release@v2` with `[bot]` suffix and automated description.

---

## [2.3.20-beta] - 2026-07-20

### Changed
- **Emoji → SVG Conversion:** Created `EmojiIcons.tsx` with 26 SVG icon components replacing all platform-dependent emoji across the app. Emoji render inconsistently on different OS (Windows monochrome, macOS colorful, Linux none) — SVG icons guarantee identical appearance everywhere.
- **WinUIDialog.tsx:** Replaced string emojis with SVG React components; changed `icon` type from `string` to `React.ReactNode`.
- **Console.tsx:** Replaced 💬 emoji header with `<IconChatBubble>` SVG, ❌ error emoji with `<IconError>` SVG.
- **FlowchartCanvas.tsx:** Replaced all context menu emojis (📝✂️📋❌📥➕) with SVG components.
- **Header.tsx:** Replaced ALL 25+ emoji across menus, toolbar, layout buttons, dropdowns with SVG components. Fixed `layoutButtons` label type.
- **translations.ts:** Removed legacy 💬 emoji prefix from all 23 console.title translations.

---

## [2.3.19-beta] - 2026-07-20

### Added
- **Vitest Unit Test Suite (126 tests):** Installed `vitest` + `jsdom`. Comprehensive tests for `parser.ts` (79 tests: arithmetic, strings, booleans, logic, relational operators, variables, arrays, 22 built-in functions, edge cases), `codeGenerator.ts` (27 tests: all 5 languages, 10 block types, expression translation), and `fprgParser.ts` (20 tests: XML parsing, serialization, round-trip integrity). Added `npm test` and `npm run test:watch` scripts.
- **vitest.config.ts:** jsdom environment, globals enabled.

### Changed
- **tsconfig.json:** Added `exclude` for `node_modules` and `dist`.

---

## [2.3.18-beta] - 2026-07-20

### Fixed
- **pushHistory Stale Closure (Critical):** Undo entry now saves explicit params (`newStmts`, `newTitle`, `newAuthor`) instead of stale closure-captured state. Fixes undo corruption on title/author edits.
- **JSON.parse/JSON.stringify → structuredClone:** Replaced 5 deep-clone sites with native `structuredClone()` — faster, handles edge cases (undefined, Date).
- **Hardcoded IF Labels:** `VERO (True)`/`FALSO (False)` now use `t.canvas.trueBranch`/`t.canvas.falseBranch` with 23-language translations. Added keys to `TranslationCatalog` type in `flow.ts`.

---

## [2.3.17-beta] - 2026-07-20

### Fixed
- **Keyboard Listener Memory Leak:** Removed `statements` from `useEffect` dependency array in `FlowContext.tsx`. `statements` is a new array reference on every mutation, causing `addEventListener`/`removeEventListener` re-registration on every keystroke/edit. `handleKeyDown` only uses stable callbacks.

---

## [2.3.16-beta] - 2026-07-20

### Changed
- **logo.png Compression:** Compressed from 1,573,036 bytes (1.5 MB) to 18,069 bytes (18 KB) — 98.9% reduction. Settings: 550px, palette PNG 128 colors, compression level 9. Applied to both `public/logo.png` and root `logo.png`.

### Removed
- **Unused ESLint Plugins:** Removed `@typescript-eslint/eslint-plugin` and `@typescript-eslint/parser` (never used).
- **package-lock.json:** Reduced by additional 1,552 lines.

---

## [2.3.15-beta] - 2026-07-20

### Changed
- **README.md Version Badge:** Replaced static badge with dynamic shields.io GitHub Releases badge that auto-reads the latest release tag:
  ```html
  <img src="https://img.shields.io/github/v/release/PiBOH/flowonline2?include_prereleases&display_name=release&style=for-the-badge&label=VERSION">
  ```

### Added
- **GitHub Release 2.3.15-beta:** First automated release created via API with tag `2.3.15`.

---

## [2.3.14-beta] - 2026-07-20

### Removed
- **sharp devDependency:** Removed `sharp` (~25MB) from devDependencies now that `favicon.ico` is already generated.
- **Temporary files:** Cleaned up `/tmp/icon_*.png`, `/tmp/generate_ico.js`, `/tmp/refactor_persist.py`.

---

## [2.3.13-beta] - 2026-07-20

### Added
- **Multi-Resolution favicon.ico:** Generated `favicon.ico` (16×16, 32×32, 48×48 px, 5.6KB) from `icon.png` via `sharp` for maximum cross-browser favicon compatibility.
- **Sharp DevDependency:** Added `sharp` as devDependency for ICO generation.

### Changed
- **index.html:** `favicon.ico` now primary favicon (`image/x-icon`), with `icon.png` and `logo.svg` as fallbacks.

### Fixed
- Removed leftover `generate_ico.cjs` one-time script and duplicate root `logo.svg`.

---

## [2.3.12-beta] - 2026-07-20

### Fixed
- **Favicon Deploy:** Moved `icon.png`, `logo.svg`, `logo.png` to `public/` directory so Vite copies them to `dist/`. Before this, assets in project root were excluded from build output, breaking favicon on GitHub Pages.

---

## [2.3.11-beta] - 2026-07-20

### Changed
- **DRY Refactor:** Extracted duplicate localStorage save logic into `persistToStorage(s, t, a)` helper function. Debounce effect and unmount effect now single-line calls.
- **Unmount Logging:** localStorage errors during unmount save now logged via `console.warn` (previously silently ignored).

---

## [2.3.10-beta] - 2026-07-20

### Added
- **icon.png:** 500×500 transparent PNG favicon generated from `logo.svg` via `sharp-cli`.

### Changed
- **index.html:** `icon.png` now primary favicon, `logo.svg` as SVG fallback, `apple-touch-icon` uses `icon.png`.

---

## [2.3.9-beta] - 2026-07-20

### Fixed
- **IDLE Freeze:** localStorage.setItem now debounced at 500ms (was synchronous on every state change, blocking main thread).
- **Stale Closure:** Unmount save now uses `latestSaveRef` to prevent data loss on page close (was capturing initial values via empty dependency array).
- **Save Cleanup:** `saveTimeoutRef` cleared on dependency changes to prevent stale saves.

---

## [2.3.8-beta] - 2026-07-20

### Changed
- **Tab Title:** Now shows only `CPU X.X% | RAM XXXMB` (removed "Flowonline2" prefix).
- **Cross-Browser Favicon:** Added `icon.png` fallback and `apple-touch-icon` for universal browser support (Firefox, Safari, Chrome). Kept SVG favicon for modern Chromium browsers.

---

## [2.3.7-beta] - 2026-07-20

### Added
- **CPU/RAM Tab Title:** Tab title now shows estimated CPU usage (via `requestAnimationFrame` frame timing jitter) and JS heap RAM in MB (via Chrome `performance.memory` API). Format: `Flowonline2 | CPU 2.3% | RAM 234MB`.
- RAM hidden on non-Chrome browsers (Firefox/Safari lack `performance.memory` API).

### Fixed
- Title throttled to update once per second (not every frame).
- rAF loop properly stopped on unmount via `running` flag.
- Frame deltas clamped to 100ms max to prevent tab-switch CPU spikes.

---

## [2.3.6-beta] - 2026-07-19

### Added
- **Dynamic Tab Title:** Browser tab now shows JS heap memory usage (e.g., `Flowonline2 | Heap: 45/2048 MB`) via Chrome's `performance.memory` API, refreshed every 5 seconds.
- **Favicon from logo.svg:** Tab icon now uses the Flowgorithm 4-box logo SVG file instead of a generic green rectangle.

### Changed
- **Menu Clarity:** Removed the `(MANUAL.md)` suffix from all 22 language translations of the User Manual menu entry (e.g., "User Manual..." instead of "User Manual (MANUAL.md)...").

---

## [2.3.5-beta] - 2026-07-19

### Fixed
- **License Textarea Size:** Changed from `flex-1` to explicit `h-[300px]` and removed `overflow-hidden` from container to restore full visibility of the license text in the About modal.
- **Freeze/Memory Leaks:**
  - Minimum execution delay at max speed raised from 1ms to 16ms (60 FPS cap) to prevent UI lockup.
  - Added `clearInterval` cleanup before `setInterval` in both `startRun` and `submitInput` to prevent interval leaks.
  - `addConsoleMessage` capped at 1000 items to prevent memory exhaustion from infinite output loops.
  - `pushHistory` undo stack capped at 50 states to prevent unbounded memory growth.

### Changed
- **Hardcoded Logo SVG:** Replaced `logo_crop.png` references in title bar and About modal with the full inline SVG from `logo.svg` (Flowgorithm 4-box colored logo with gradients and glow effects).

---

## [2.3.3-beta] - 2026-07-19

### Added
- **Language Picker Flags:** Each language in the picker now shows its national flag emoji (🇺🇸 🇬🇧 🇮🇹 etc.) next to the name.
- **Translation Disclaimer:** A notice below the language picker warns that translations may not be 100% accurate.

### Changed
- **logo_crop.png:** Replaced inline SVG logo in title bar and About modal with `logo_crop.png` image file.

### Fixed
- **Manual Resize Only:** WinUIDialog now uses `height` instead of `minHeight` to prevent auto-growth; windows stay at fixed size with scrollbars and can only be resized by dragging the corner.

---

## [2.3.2-beta] - 2026-07-19

### Changed
- **About/Manual/Changelog Modals → WinUI:** All three information dialogs are now fully draggable and resizable WinUIDialog windows that reset to their default size when reopened (700×525, 800×600, and 750×550 respectively).
- **WinUIDialog Size Props:** Added optional `defaultWidth` and `defaultHeight` props for custom default dimensions and proper centering per dialog.

### Fixed
- **Language Picker Centering:** Increased default dimensions to 480×400 so the 22-language grid is properly centered on screen instead of appearing too low.

---

## [2.3.1-beta] - 2026-07-19

### Added
- **Language Picker WinUI:** Replaced the small HTML `<select>` dropdown with a full WinUI dialog showing all 22 supported languages in a grid with current-language highlighting.
- **Help Menu Links:** Added "Report a Bug", "Request a Feature", and "Fork & Contribute" entries to the Help dropdown (open GitHub issues/fork pages in new tab).
- **Selectable Modal Text:** All text in Warning, Manual, and Changelog modals is now user-selectable via the `select-text` CSS class.
- **WinUIDialog Children:** Extended `WinUIDialog` component with an optional `children` prop for custom dialog content.

### Changed
- **Language Selector:** Now a styled button opening a WinUI dialog instead of a cramped `<select>` element.
- **Menu Translations:** Added `bugReport`, `featureRequest`, `forkContribute`, and `selectLanguage` keys to all 22 languages.
- **Version:** Bumped to 2.3.1.

---

## [2.3.0-beta] - 2026-07-19

### Added
- **22 Language Menu Translations:** Header menu labels and messages are now fully localized for all 22 supported languages (EN, EN_GB, IT, DE, FR, ES, ZH, NL, PT, GL, RU, UK, CS, PL, HU, SL, JA, TH, ID, MN, AR, HE, FA).
- **Custom Export Icons:** PNG and PDF menu items now display inline SVG icons instead of generic emojis.
- **WinUI Export Feedback:** PNG/PDF export success and error messages are now shown in draggable, resizable WinUI dialogs instead of browser alerts.

### Changed
- **exportUtils.ts:** `exportToPNG` and `exportToPDF` now return `Promise<ExportResult>` so callers can display WinUI dialogs.
- **Header.tsx:** Export handlers updated to await export results and show WinUI dialogs.
- **Version:** Bumped to 2.3.0.

---

## [2.2.0-beta] - 2026-07-19

### Added
- **Tools Menu:** New dedicated "Tools" dropdown in the menu bar with Export SVG, Export PNG, and Export PDF.
- **Export PNG Engine:** High-resolution PNG export via offscreen Canvas rendering with HiDPI/Retina support and interactive element cleanup.
- **Export PDF Engine:** PDF export via jsPDF with automatic orientation detection (landscape/portrait) and print-quality 2x rendering.
- **Author Auto-Detection:** Author name is now persisted independently in localStorage and restored on next visit, even after clearing the flowchart.

### Changed
- **File Menu:** Added Export PNG and Export PDF entries alongside the existing Export SVG.
- **Version:** Bumped to 2.2.0 (minor release for export engines + Tools menu).

### Fixed
- **Issue Templates:** Fixed `validations` YAML key being incorrectly nested inside `attributes` in all 4 GitHub issue form templates (bug_report-en.yml, bug_report-it.yml, feature_request-en.yml, feature_request-it.yml).
- **Clear Local Storage:** Added confirmation dialog before clearing saved flowchart backup.

---

## [2.1.0-beta] - 2026-07-17

### Added
- **Interactive Tutorial Onboarding:** 8-step interactive walkthrough (`Tutorial.tsx`) that auto-shows on first visit and can be opened from the Help menu. Includes keyboard navigation, progress indicator, and "Don't show again" persistence.
- **Example Gallery:** Modal with 8 built-in example programs (Hello World, Area Circle, Even/Odd, Sum 1 to N, Max of 3, Factorial, Multiplication Table, Guess the Number). Features search, category filters, and multilingual descriptions.
- **Export PNG Image:** SVG-to-PNG conversion via Canvas with HiDPI/Retina support and interactive element cleanup.
- **Issue & PR Templates:** GitHub issue templates (bug report + feature request in EN/IT) and PR template following project conventions.
- **CHANGELOG.md:** New changelog file at repository root, auto-viewable from the app's Help menu.

### Changed
- **Empty Default Canvas:** Removed the pre-loaded sample program; new users start with a blank diagram.
- **GitHub Pages Configuration:** Set `base: './'` in `vite.config.ts` for relative asset paths.
- **`.gitignore` Sanitization:** Removed obsolete entries, added standard excludes for `node_modules/`, `dist/`, `.env`, `.ignore/`, IDE files.
- **Version:** Bumped to 2.1.0 (minor release for new features).

### Fixed
- **Version Overwrite:** Moved `setAppVersion` inside `.catch()` to prevent overriding the live GitHub version.
- **Undo Flooding:** `setProgramTitle`/`setProgramAuthor` no longer push history on every keystroke.
- **Undo/Redo Messages:** Added `safeStopRun()` that checks execution status before stopping.
- **Hardcoded IF Labels:** Replaced `'VERO (True)'`/`'FALSO (False)'` with language-specific translations.
- **Duplicate SVG Gradients:** Made gradient IDs unique per block (`processGrad-${id}-${scheme}`).
- **Step Mode After Input:** Added `stepModeRef` to preserve step-by-step mode after `submitInput`.
- **IF Diamond Height:** Corrected `IF_H` constant from 70 to 64.
- **Paste Button Logic:** Fixed disable condition using `copiedBlock`.
- **Hardcoded Console Strings:** Translated "Svuota" and "Pronto" to all supported languages.
- **Browser `process.stdout.write`:** Replaced with `console.log` in `codeGenerator.ts`.
- **Interval Leak:** Added cleanup of existing interval before creating a new one in `submitInput`.
- **SVG Export Cleanliness:** Removed inserter buttons, delete buttons, and interactive CSS classes from exported images.

---

## [2.0.13-beta] - 2026-06-XX

### Added
- Keyboard block selection with glowing blue dotted border.
- Win32 right-click context menu (Edit, Cut, Copy, Paste, Delete).
- Clipboard copy-paste buffering with recursive ID regeneration.
- Spacious 800×600 px User Manual viewer with custom Markdown-to-JSX compiler.

### Fixed
- Nested branch inserter context propagation (parentContext parameter).
- Inverted TRUE/FALSE branch labels on IF condition diamonds.

---

## [2.0.12-beta] - 2026-06-XX

### Added
- Auto-scrolling active executing block into viewport.
- Top alignment on load (scroll to Main block).
- JSON backup upload support.
- Inequality operator `<>` mapping to `!=`.
- Twilight global dark mode theme.
- Auto-open console on execution.
- Dynamic version badge from GitHub `version.txt`.

---

## [2.0.10-beta] - 2026-06-XX

### Added
- Unquoted newline constant (`\n`) in string expressions.
- FPRG import/export normalization (ToChar(13) ↔ `\n`).

---

## [2.0.9-beta] - 2026-06-XX

### Added
- Win32 hover dropdown sliding (onMouseEnter handlers).
- Global click closures for dropdown menus.
- DPI-aware zoom toolbar (600% max).
- Win32 About dialog sized to exactly 700×525 px.

---

## [2.0.8-beta] - 2026-06-XX

### Fixed
- Lexicographical string comparison (removed numeric forcing).
- ToChar(13) carriage return rendering in console.
- Toolbar Open button activation (moved file input outside dropdown).

---

## [2.0.7-beta] - 2026-06-XX

### Added
- Single `=` treated as equality comparison in conditions.

### Fixed
- Nested IF branch node stealing (direct child node selection fix).

---

## [2.0.6-beta] - 2026-05-XX

### Fixed
- Critical FPRG XML parsing: assignments now read `expression` attribute (not `value`).

---

## [2.0.5-beta] - 2026-05-XX

### Added
- Declare tab SVG outline (folder tab shape).
- Terminal and shape colors matching Flowgorithm stylesheet.
- Blue dot inserter buttons with 3D glow effect.

---

## [2.0.4-beta] - 2026-05-XX

### Added
- Character/string intrinsic functions: `Char()`, `ToCode()`, `ToChar()`.
- Type conversion functions: `ToInteger()`, `ToReal()`, `ToString()`.
- Math/trigonometric functions: `Int()`, `Sgn()`, `Arcsin()`, `Arccos()`, `Arctan()`.

---

## [2.0.3-beta] - 2026-05-XX

### Added
- Initial release of Flowonline2.
- Windows MDI desktop frame with Aero Glass gradient header.
- System menu and toolbar (File, Edit, Program menus).
- Workspace splitting with 5 layouts (flowchart_only, flow_variables, flow_console, triple_split, flow_code).
- Variable case-insensitivity support.
- .fprg file import/export.
- Code generation (Python, C++, Java, JavaScript, C#).
- Multilingual support (EN, EN_GB, IT, DE, FR, ES).
- 6 color schemes (Classic, Pastel, Vibrant, Retro, Twilight, Black & White).
