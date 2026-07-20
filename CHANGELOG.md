# Changelog

All notable changes to Flowonline2 are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning.](https://semver.org/spec/v2.0.0.html).

---

## [BETA 2.3.20] - 2026-07-20

### Changed
- **Emoji → SVG Conversion:** Created `EmojiIcons.tsx` with 26 SVG icon components replacing all platform-dependent emoji across the app. Emoji render inconsistently on different OS (Windows monochrome, macOS colorful, Linux none) — SVG icons guarantee identical appearance everywhere.
- **WinUIDialog.tsx:** Replaced string emojis with SVG React components; changed `icon` type from `string` to `React.ReactNode`.
- **Console.tsx:** Replaced 💬 emoji header with `<IconChatBubble>` SVG, ❌ error emoji with `<IconError>` SVG.
- **FlowchartCanvas.tsx:** Replaced all context menu emojis (📝✂️📋❌📥➕) with SVG components.
- **Header.tsx:** Replaced ALL 25+ emoji across menus, toolbar, layout buttons, dropdowns with SVG components. Fixed `layoutButtons` label type.
- **translations.ts:** Removed legacy 💬 emoji prefix from all 23 console.title translations.

---

## [BETA 2.3.19] - 2026-07-20

### Added
- **Vitest Unit Test Suite (126 tests):** Installed `vitest` + `jsdom`. Comprehensive tests for `parser.ts` (79 tests: arithmetic, strings, booleans, logic, relational operators, variables, arrays, 22 built-in functions, edge cases), `codeGenerator.ts` (27 tests: all 5 languages, 10 block types, expression translation), and `fprgParser.ts` (20 tests: XML parsing, serialization, round-trip integrity). Added `npm test` and `npm run test:watch` scripts.
- **vitest.config.ts:** jsdom environment, globals enabled.

### Changed
- **tsconfig.json:** Added `exclude` for `node_modules` and `dist`.

---

## [BETA 2.3.18] - 2026-07-20

### Fixed
- **pushHistory Stale Closure (Critical):** Undo entry now saves explicit params (`newStmts`, `newTitle`, `newAuthor`) instead of stale closure-captured state. Fixes undo corruption on title/author edits.
- **JSON.parse/JSON.stringify → structuredClone:** Replaced 5 deep-clone sites with native `structuredClone()` — faster, handles edge cases (undefined, Date).
- **Hardcoded IF Labels:** `VERO (True)`/`FALSO (False)` now use `t.canvas.trueBranch`/`t.canvas.falseBranch` with 23-language translations. Added keys to `TranslationCatalog` type in `flow.ts`.

---

## [BETA 2.3.17] - 2026-07-20

### Fixed
- **Keyboard Listener Memory Leak:** Removed `statements` from `useEffect` dependency array in `FlowContext.tsx`. `statements` is a new array reference on every mutation, causing `addEventListener`/`removeEventListener` re-registration on every keystroke/edit. `handleKeyDown` only uses stable callbacks.

---

## [BETA 2.3.16] - 2026-07-20

### Changed
- **logo.png Compression:** Compressed from 1,573,036 bytes (1.5 MB) to 18,069 bytes (18 KB) — 98.9% reduction. Settings: 550px, palette PNG 128 colors, compression level 9. Applied to both `public/logo.png` and root `logo.png`.

### Removed
- **Unused ESLint Plugins:** Removed `@typescript-eslint/eslint-plugin` and `@typescript-eslint/parser` (never used).
- **package-lock.json:** Reduced by additional 1,552 lines.

---

## [BETA 2.3.15] - 2026-07-20

### Changed
- **README.md Version Badge:** Replaced static badge with dynamic shields.io GitHub Releases badge that auto-reads the latest release tag:
  ```html
  <img src="https://img.shields.io/github/v/release/PiBOH/flowonline2?include_prereleases&display_name=release&style=for-the-badge&label=VERSION">
  ```

### Added
- **GitHub Release 2.3.15-beta:** First automated release created via API with tag `2.3.15`.

---

## [BETA 2.3.14] - 2026-07-20

### Removed
- **sharp devDependency:** Removed `sharp` (~25MB) from devDependencies now that `favicon.ico` is already generated.
- **Temporary files:** Cleaned up `/tmp/icon_*.png`, `/tmp/generate_ico.js`, `/tmp/refactor_persist.py`.

---

## [BETA 2.3.13] - 2026-07-20

### Added
- **Multi-Resolution favicon.ico:** Generated `favicon.ico` (16×16, 32×32, 48×48 px, 5.6KB) from `icon.png` via `sharp` for maximum cross-browser favicon compatibility.
- **Sharp DevDependency:** Added `sharp` as devDependency for ICO generation.

### Changed
- **index.html:** `favicon.ico` now primary favicon (`image/x-icon`), with `icon.png` and `logo.svg` as fallbacks.

### Fixed
- Removed leftover `generate_ico.cjs` one-time script and duplicate root `logo.svg`.

---

## [BETA 2.3.12] - 2026-07-20

### Fixed
- **Favicon Deploy:** Moved `icon.png`, `logo.svg`, `logo.png` to `public/` directory so Vite copies them to `dist/`. Before this, assets in project root were excluded from build output, breaking favicon on GitHub Pages.

---

## [BETA 2.3.11] - 2026-07-20

### Changed
- **DRY Refactor:** Extracted duplicate localStorage save logic into `persistToStorage(s, t, a)` helper function. Debounce effect and unmount effect now single-line calls.
- **Unmount Logging:** localStorage errors during unmount save now logged via `console.warn` (previously silently ignored).

---

## [BETA 2.3.10] - 2026-07-20

### Added
- **icon.png:** 500×500 transparent PNG favicon generated from `logo.svg` via `sharp-cli`.

### Changed
- **index.html:** `icon.png` now primary favicon, `logo.svg` as SVG fallback, `apple-touch-icon` uses `icon.png`.

---

## [BETA 2.3.9] - 2026-07-20

### Fixed
- **IDLE Freeze:** localStorage.setItem now debounced at 500ms (was synchronous on every state change, blocking main thread).
- **Stale Closure:** Unmount save now uses `latestSaveRef` to prevent data loss on page close (was capturing initial values via empty dependency array).
- **Save Cleanup:** `saveTimeoutRef` cleared on dependency changes to prevent stale saves.

---

## [BETA 2.3.8] - 2026-07-20

### Changed
- **Tab Title:** Now shows only `CPU X.X% | RAM XXXMB` (removed "Flowonline2" prefix).
- **Cross-Browser Favicon:** Added `icon.png` fallback and `apple-touch-icon` for universal browser support (Firefox, Safari, Chrome). Kept SVG favicon for modern Chromium browsers.

---

## [BETA 2.3.7] - 2026-07-20

### Added
- **CPU/RAM Tab Title:** Tab title now shows estimated CPU usage (via `requestAnimationFrame` frame timing jitter) and JS heap RAM in MB (via Chrome `performance.memory` API). Format: `Flowonline2 | CPU 2.3% | RAM 234MB`.
- RAM hidden on non-Chrome browsers (Firefox/Safari lack `performance.memory` API).

### Fixed
- Title throttled to update once per second (not every frame).
- rAF loop properly stopped on unmount via `running` flag.
- Frame deltas clamped to 100ms max to prevent tab-switch CPU spikes.

---

## [BETA 2.3.6] - 2026-07-19

### Added
- **Dynamic Tab Title:** Browser tab now shows JS heap memory usage (e.g., `Flowonline2 | Heap: 45/2048 MB`) via Chrome's `performance.memory` API, refreshed every 5 seconds.
- **Favicon from logo.svg:** Tab icon now uses the Flowgorithm 4-box logo SVG file instead of a generic green rectangle.

### Changed
- **Menu Clarity:** Removed the `(MANUAL.md)` suffix from all 22 language translations of the User Manual menu entry (e.g., "User Manual..." instead of "User Manual (MANUAL.md)...").

---

## [BETA 2.3.5] - 2026-07-19

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

## [BETA 2.3.3] - 2026-07-19

### Added
- **Language Picker Flags:** Each language in the picker now shows its national flag emoji (🇺🇸 🇬🇧 🇮🇹 etc.) next to the name.
- **Translation Disclaimer:** A notice below the language picker warns that translations may not be 100% accurate.

### Changed
- **logo_crop.png:** Replaced inline SVG logo in title bar and About modal with `logo_crop.png` image file.

### Fixed
- **Manual Resize Only:** WinUIDialog now uses `height` instead of `minHeight` to prevent auto-growth; windows stay at fixed size with scrollbars and can only be resized by dragging the corner.

---

## [BETA 2.3.2] - 2026-07-19

### Changed
- **About/Manual/Changelog Modals → WinUI:** All three information dialogs are now fully draggable and resizable WinUIDialog windows that reset to their default size when reopened (700×525, 800×600, and 750×550 respectively).
- **WinUIDialog Size Props:** Added optional `defaultWidth` and `defaultHeight` props for custom default dimensions and proper centering per dialog.

### Fixed
- **Language Picker Centering:** Increased default dimensions to 480×400 so the 22-language grid is properly centered on screen instead of appearing too low.

---

## [BETA 2.3.1] - 2026-07-19

### Added
- **Language Picker WinUI:** Replaced the small HTML `<select>` dropdown with a full WinUI dialog showing all 22 supported languages in a grid with current-language highlighting.
- **Help Menu Links:** Added "Report a Bug", "Request a Feature", and "Fork & Contribute" entries to the Help dropdown (open GitHub issues/fork pages in new tab).
- **Selectable Modal Text:** All text in Warning, Manual, and Changelog modals is now user-selectable via the `select-text` CSS class.
- **WinUIDialog Children:** Extended `WinUIDialog` component with an optional `children` prop for custom dialog content.

### Changed
- **Language Selector:** Now a styled button opening a WinUI dialog instead of a cramped `<select>` element.
- **Menu Translations:** Added `bugReport`, `featureRequest`, `forkContribute`, and `selectLanguage` keys to all 22 languages.
- **Version:** Bumped to BETA 2.3.1.

---

## [BETA 2.3.0] - 2026-07-19

### Added
- **22 Language Menu Translations:** Header menu labels and messages are now fully localized for all 22 supported languages (EN, EN_GB, IT, DE, FR, ES, ZH, NL, PT, GL, RU, UK, CS, PL, HU, SL, JA, TH, ID, MN, AR, HE, FA).
- **Custom Export Icons:** PNG and PDF menu items now display inline SVG icons instead of generic emojis.
- **WinUI Export Feedback:** PNG/PDF export success and error messages are now shown in draggable, resizable WinUI dialogs instead of browser alerts.

### Changed
- **exportUtils.ts:** `exportToPNG` and `exportToPDF` now return `Promise<ExportResult>` so callers can display WinUI dialogs.
- **Header.tsx:** Export handlers updated to await export results and show WinUI dialogs.
- **Version:** Bumped to BETA 2.3.0.

---

## [BETA 2.2.0] - 2026-07-19

### Added
- **Tools Menu:** New dedicated "Tools" dropdown in the menu bar with Export SVG, Export PNG, and Export PDF.
- **Export PNG Engine:** High-resolution PNG export via offscreen Canvas rendering with HiDPI/Retina support and interactive element cleanup.
- **Export PDF Engine:** PDF export via jsPDF with automatic orientation detection (landscape/portrait) and print-quality 2x rendering.
- **Author Auto-Detection:** Author name is now persisted independently in localStorage and restored on next visit, even after clearing the flowchart.

### Changed
- **File Menu:** Added Export PNG and Export PDF entries alongside the existing Export SVG.
- **Version:** Bumped to BETA 2.2.0 (minor release for export engines + Tools menu).

### Fixed
- **Issue Templates:** Fixed `validations` YAML key being incorrectly nested inside `attributes` in all 4 GitHub issue form templates (bug_report-en.yml, bug_report-it.yml, feature_request-en.yml, feature_request-it.yml).
- **Clear Local Storage:** Added confirmation dialog before clearing saved flowchart backup.

---

## [BETA 2.1.0] - 2026-07-17

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
- **Version:** Bumped to BETA 2.1.0 (minor release for new features).

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

## [BETA 2.0.13] - 2026-06-XX

### Added
- Keyboard block selection with glowing blue dotted border.
- Win32 right-click context menu (Edit, Cut, Copy, Paste, Delete).
- Clipboard copy-paste buffering with recursive ID regeneration.
- Spacious 800×600 px User Manual viewer with custom Markdown-to-JSX compiler.

### Fixed
- Nested branch inserter context propagation (parentContext parameter).
- Inverted TRUE/FALSE branch labels on IF condition diamonds.

---

## [BETA 2.0.12] - 2026-06-XX

### Added
- Auto-scrolling active executing block into viewport.
- Top alignment on load (scroll to Main block).
- JSON backup upload support.
- Inequality operator `<>` mapping to `!=`.
- Twilight global dark mode theme.
- Auto-open console on execution.
- Dynamic version badge from GitHub `version.txt`.

---

## [BETA 2.0.10] - 2026-06-XX

### Added
- Unquoted newline constant (`\n`) in string expressions.
- FPRG import/export normalization (ToChar(13) ↔ `\n`).

---

## [BETA 2.0.9] - 2026-06-XX

### Added
- Win32 hover dropdown sliding (onMouseEnter handlers).
- Global click closures for dropdown menus.
- DPI-aware zoom toolbar (600% max).
- Win32 About dialog sized to exactly 700×525 px.

---

## [BETA 2.0.8] - 2026-06-XX

### Fixed
- Lexicographical string comparison (removed numeric forcing).
- ToChar(13) carriage return rendering in console.
- Toolbar Open button activation (moved file input outside dropdown).

---

## [BETA 2.0.7] - 2026-06-XX

### Added
- Single `=` treated as equality comparison in conditions.

### Fixed
- Nested IF branch node stealing (direct child node selection fix).

---

## [BETA 2.0.6] - 2026-05-XX

### Fixed
- Critical FPRG XML parsing: assignments now read `expression` attribute (not `value`).

---

## [BETA 2.0.5] - 2026-05-XX

### Added
- Declare tab SVG outline (folder tab shape).
- Terminal and shape colors matching Flowgorithm stylesheet.
- Blue dot inserter buttons with 3D glow effect.

---

## [BETA 2.0.4] - 2026-05-XX

### Added
- Character/string intrinsic functions: `Char()`, `ToCode()`, `ToChar()`.
- Type conversion functions: `ToInteger()`, `ToReal()`, `ToString()`.
- Math/trigonometric functions: `Int()`, `Sgn()`, `Arcsin()`, `Arccos()`, `Arctan()`.

---

## [BETA 2.0.3] - 2026-05-XX

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
