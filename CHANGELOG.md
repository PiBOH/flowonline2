# Changelog

All notable changes to Flowonline2 are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning.](https://semver.org/spec/v2.0.0.html).

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
