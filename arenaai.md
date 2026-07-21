# arenaai.md - Flowonline2 Development, Maintenance and Change Log

This file acts as the primary operational instruction manual for AI models maintaining or extending **Flowonline2**, a pixel-perfect, fully-functional web clone of Flowgorithm developed by PiBOH under the GNU General Public License v3.

---

## 1. Development, Build, and Testing Commands

Run these commands in the project root to perform standard development tasks:

*   **Install Dependencies:**
    ```bash
    npm install
    ```
*   **Run Local Development Server:**
    ```bash
    npm run dev
    ```
    This spins up a hot-reloading Vite server (usually at `http://localhost:5173`).
*   **Build Production Bundle:**
    ```bash
    npm run build
    ```
    Compiles TypeScript and bundles assets into the `/dist` folder. The app is zero-config and completely static (client-side only), perfect for hosting on GitHub Pages.
*   **Preview Production Build:**
    ```bash
    npm run preview
    ```
    Serves the locally built `/dist` static app for verification.

---

## 2. Code Style and Architecture Guidelines

### TypeScript & Strict Typing
*   **Strict Mode:** Always compile with `"strict": true` in `tsconfig.json`.
*   **Zero 'any' Policy:** Use of the `any` type is strictly forbidden. If a dynamic value is needed, use `unknown`, generics, or proper Union/Intersection types.
*   **Explicit Type Declarations:** Declare clear interfaces and types for block structures, interpreter states, variables, and language translations.

### Project Structure & Modularity
The codebase must remain organized under `src/`:
*   `src/types/`: Centralized interfaces for variables, block AST nodes, interpreter status, and translation catalogs.
*   `src/utils/`: Pure utilities, parsers, and generators:
    *   `parser.ts`: Recursive descent parser for mathematical, string, and logical expressions.
    *   `fprgParser.ts`: Bidirectional converter between DOM-based XML (`.fprg`) and Flowonline2 block JSON AST.
    *   `codeGenerator.ts`: Transpiler to translate the AST tree into Python, C++, Java, JavaScript, and C#.
*   `src/context/`: React Context and custom hooks managing global state (Undo/Redo history, flowchart tree, active executing node, console buffer, variable table, execution speed).
*   `src/components/`: Modular React components:
    *   `BlockNode.tsx`: Pure SVG visual presentation matching Flowgorithm's traditional gradients, double borders, angles, and colors.
    *   `FlowchartCanvas.tsx`: Master SVG structure that calculates dimensions dynamically, draws arrows, renders loop lines, and hosts context-menu listeners.
    *   `Sidebar.tsx`: Right-side panel containing tabs for variable inspection (Variable Watch) and source-code translation.
    *   `Console.tsx`: Execution console mimicking Flowgorithm's classic chat-bubble styles.
    *   `Modals.tsx`: Input forms with field validation matching the variable types of active nodes.

### State Management & Undo/Redo
*   All state updates to the flowchart diagram must push a deep snapshot onto a history stack for instant Undo/Redo.
*   The flowchart is modeled as a tree of blocks with standard parent-child pointers or embedded child-lists (e.g., `If` has `then` and `else` blocks; loop nodes like `While`, `For`, and `Do` have nested `body` blocks).

---

## 3. Extending the Flowchart Interpreter and Blocks

To add a new block type (e.g., `Switch`, `Try/Catch`):
1.  **Define Block Type:** Update `src/types/flow.ts` to include the new block's union type, properties, and standard schema.
2.  **Define SVG Shape:** In `src/components/BlockNode.tsx`, write a new component or path generator representing the new shape (respecting the classic gradient design).
3.  **Update Canvas Connector Logic:** Ensure the click-to-insert lines can insert this block and that drawing helpers calculate its dimensions correctly.
4.  **Extend the Interpreter:** Update the step evaluator in `src/context/FlowContext.tsx` to handle the execution behavior, variable state mutation, or output redirection of the new block.
5.  **Add XML Serialization:** Extend `src/utils/fprgParser.ts` to convert the block to/from its XML representation in `.fprg` format.
6.  **Add Code Generation:** Provide translations in `src/utils/codeGenerator.ts` for all 5 target languages.

---

## 4. Session Recovery Protocol (For AI Context Limits or Reloads)

If you must resume work on Flowonline2 in a new session (due to context limit exhaustion, workspace reload, or thread transitions), follow this recovery protocol:

1.  **Read and Ingest:** Load this `arenaai.md` file along with current files under `src/` to fully re-establish the architectural design.
2.  **Verify State Contract:** Check `src/types/flow.ts` and `src/context/FlowContext.tsx` to align your logic with the existing tree structure and current execution step-manager.
3.  **Never Start from Scratch:** Refactor or extend existing modules step-by-step rather than recreating the whole file tree from scratch. Keep changes backwards compatible.
4.  **Preserve DOM-Based XML Parsing:** Ensure that bidirectional `.fprg` parsing remains purely client-side using the native browser `DOMParser` and `XMLSerializer` to maintain ZERO-dependency portability.
5.  **Maintain PiBOH License Notice:** Always preserve the PiBOH and GNU GPL v3 license credits in the header/footer of the main viewport.

---

## 5. Architectural Milestone Logs & Change History (BETA 2.3.21-beta)

This log tracks all major fixes and architectural adjustments made to Flowonline2 to guarantee a 1000% faithful replication of the Windows desktop Flowgorithm application:

### Milestone 1: Windows MDI (Multiple Document Interface) Desktop Frame (BETA 2.0.3-beta)
*   **Aero Glass Gradient Header:** Redesigned the main app header with a dual gradient (`#5B8DC4` -> `#2F5A8C`), standard Windows system controls (`─`, `▢`, `✕`), and the Flowgorithm 4-box colored vector logo.
*   **System Menu & Toolbar:** Added standard retro dropdown menus (`File`, `Modifica`, `Programma`) and a standard `32x32px` flat-button toolbar.
*   **Workspace Splitting:** Introduced an MDI layout context parameter (`AppLayout`) with five switchable layouts (`flowchart_only`, `flow_variables`, `flow_console`, `triple_split`, `flow_code`), allowing the canvas, variable watch, and console windows to be docked or closed in real-time.
*   **Triple Split Layout:** Simulated Flowgorithm's default configuration: flowchart canvas on the left, and a vertical stack containing the variable watch on top and the console on the bottom on the right.

### Milestone 2: Variable Case-Insensitivity (BETA 2.0.3 Fix)
*   **Challenge:** Flowgorithm is case-insensitive for variable lookups and assignments. The web prototype was case-sensitive, making loaded `.fprg` files fail to resolve symbols (e.g. declaring `MyVar` but assigning to `myvar`).
*   **Resolution:** Modified both `ExpressionParser` (`src/utils/parser.ts`) and the VM executor step routines (`src/context/FlowContext.tsx`) to resolve variables using case-insensitive comparisons.

### Milestone 3: Support for Character and Type Conversions (BETA 2.0.4 Fix)
*   **Challenge:** Flowgorithm represents characters as strings of length 1 and manipulates them using a specific set of intrinsic helper functions. Imported `.fprg` files processing arrays of characters failed to compile or execute.
*   **Resolution:** Extended the recursive expression evaluator (`src/utils/parser.ts`) to support Flowgorithm's built-in conversion and string intrinsic functions:
    *   **Caratteri:** `Char(s, i)` (extract character), `ToCode(c)` (char to ASCII code), `ToChar(n)` (ASCII code to char).
    *   **Conversioni:** `ToInteger(s)`, `ToReal(s)`, `ToString(n)`.
    *   **Matematiche/Trigonometriche:** `Int(n)` (whole value trunc), `Sgn(n)` (sign function), `Arcsin`, `Arccos`, `Arctan`.

### Milestone 4: Graphic Sfumature & Shape Outlines (BETA 2.0.5-beta)
*   **Declare Tab:** Created an authentic SVG outline path for `DeclareBlock` rendering a folder tab on top, matching the visual cues of Flowgorithm.
*   **Terminal & Shape Colors:** Mapped all blocks to the exact color scheme in PiBOH's `flowonline` stylesheet (`--cs-terminal`, `--cs-process`, `--cs-io`, `--cs-decision`, `--cs-loop`, `--cs-call`).
*   **Blue Dot Inserters:** Styled connector hover states to draw the classic glowing 3D blue inserter circles that expand and show a golden drop-shadow when hovered.

### Milestone 5: Critical FPRG XML Parsing Fix (BETA 2.0.6 Fix)
*   **Challenge:** Opened `.fprg` files from Flowgorithm loaded without evaluating assignments. Variables remained at their default values (`0`, `""`, or `false`) throughout execution.
*   **Discovery:** Flowgorithm's XML schema represents assignments using the `expression` attribute, e.g., `<assign variable="x" expression="10"/>`, while our early XML parser incorrectly attempted to read the `value` attribute (`el.getAttribute('value')`). This caused every imported assignment expression to load as empty (`""`).
*   **Resolution:** Patched `FprgParser.elementToStatement` to retrieve `expression` as the primary attribute (with `value` as a fallback), and updated the XML serializer (`FprgParser.serializeStatements`) to output standard `expression="..."` XML tags for assignments. This successfully restored fully functional variable assignments on all imported `.fprg` files.

### Milestone 6: If Nesting and Operator Compatibility (BETA 2.0.7 Fix)
*   **Equality Operator (=):** Flowgorithm allows a single `=` to represent comparison (equality) in conditions (e.g. `If x = 5`). Added tokenization mapping to convert a single `=` to the relational equality operator `==` inside `src/utils/parser.ts`.
*   **Direct Child Node Selection:** Fixed a major bug in nested `If` branches where `getElementsByTagName` recursively traversed descendants, causing outer `If` blocks to "steal" inner `If` blocks' `<else>` or `<then>` nodes. Replaced with strict direct-child lookups using `Array.from(el.children).find(...)`.

### Milestone 7: Alphabetical Ordering, Newlines and UI Emulation (BETA 2.0.8 Fix)
*   **Lexicographical String Comparison:** Fixed a bug where string comparative relational operations (like checking `x < z` alphabetically) failed because the evaluator forced numeric conversions (`Number(val) < Number(right)`). Removed the numeric forcing wrappers, allowing JavaScript's native comparative operators to lexicographically compare strings and numerically compare numbers with 100% precision.
*   **ToChar(13) Carriage Return Parsing:** Pre-wrap rendering collapses `\r` (carriage return, ASCII 13) into simple whitespaces on Webkit/Blink browsers. Resolved by adding a global regex replace in the console message renderer (`src/components/Console.tsx`) converting `\r` into Line Feeds `\n`. This successfully restored beautiful, multiline output layouts in standard dialogue balloons.
*   **Toolbar "Open" (📂) Button Activation:** Fixed a React DOM reference bug where `<input type="file">` was nested inside the conditional drop-down. Moved it outside the dropdown, enabling the toolbar "Open" button to trigger file selections at all times.

### Milestone 8: Hover Slide-To-Active Menus & Global Click Closures (BETA 2.0.9-beta)
*   **Win32 Hover Dropdown Sliding:** Added `onMouseEnter` handlers across all dropdown menu headers, allowing dropdowns to activate automatically on hover when a dropdown is already open.
*   **Global Click closures:** Created a global document `mousedown` listener to close dropdowns when clicking outside, emulating standard desktop window menus.
*   **DPI-Aware 600% Zoom Toolbar:** Added Zoom In (`🔍+`), Zoom Out (`🔍-`), zoom percentage, and Reset Zoom (`🔄`) controls on the upper-right side of the toolbar.
*   **Win32 About Dialog Sizing:** Resized the Win32 About dialog to exactly `700px` width by `525px` height.

### Milestone 9: Unquoted Newlines and XML Auto-Translation (BETA 2.0.10-beta)
*   **Unquoted Newline Constant (\\n):** Modified the string tokenizer (`src/utils/parser.ts`) to intercept unquoted `\n` characters (e.g., `text & \n & min`) and parse them directly as first-class Line Feed (`\n`) string tokens.
*   **FPRG Import/Export Normalization:** Extended `FprgParser.ts` to automatically translate all `ToChar(13)` expressions inside files loaded from the PC to unquoted `\n` constants inside the web application, and translate them back to standard `ToChar(13)` when saving/exporting.

### Milestone 10: Auto-Scrolling, JSON Backup Upload, and Twilight Dark Themes (BETA 2.0.12 Completed)
*   **Auto-scrolling Active Executing Block:** Added a React `ref` with `useEffect` on `isHighlighted` in `BlockNode.tsx` to automatically scroll and center the active executing block within the user's viewport.
*   **Top Alignment on Load:** Added a scroll-to-top handler in `FlowchartCanvas.tsx` to center the "Main" start block whenever an algorithm is loaded.
*   **JSON Backup Upload:** Upgraded the file loader inside `Header.tsx` to automatically detect `.json` files, parse them as backup states, and populate the canvas.
*   **Inequality Operator (<>):** Mapped the alternative inequality operator `<>` directly to `!=` inside the lexical analyzer.
*   **Twilight Global Dark Mode:** Sychronized the 6 color schemes so they colorize the Variable Watch grid, Console bubbles, Source Code, and canvas workspace altogether.
*   **Auto-Open Console:** Configured the VM runner to automatically open the Console/Triple-split layout upon executing code if it was closed.
*   **Dynamic Version Badge:** Added an automatic fetch to load the live version from the remote GitHub `version.txt` file and display the loaded source as a decorative notification badge.

### Milestone 11: Keyboard Block Selection, Copy & Paste Clipboard, and Right-Click Context Menus (BETA 2.0.13 Completed)
*   **Keyboard Deletion and Block Selection:** Integrated single-click selection on any block shape (glowing blue dotted border) with support for pressing `Delete` or `Backspace` to instantly remove blocks.
*   **Win32 Context Menu (Tasto Destro):** Developed a complete custom desktop-style right-click context menu:
    *   **Right-clicking a block:** Opens floating menu with Edit (Modifica), Cut (Taglia), Copy (Copia), Paste After (Incolla), and Delete (Elimina) options.
    *   **Right-clicking an inserter dot:** Opens a menu to Paste Block or Insert Block.
*   **Clipboard Copy-Paste Buffering:** Created copy, cut, and paste context handlers that recursively clone blocks, regenerate all nested block IDs to prevent UUID collisions, and support Ctrl+C, Ctrl+X, and Ctrl+V keyboard shortcuts.
*   **Spacious 800x600 px User Manual Viewer:** Enlarged the MANUAL.md Win32 dialog box to exactly `800x600px` and implemented a fully-functional, custom Markdown-to-JSX compiler to render titles, blockquotes, code-snippets, lists, and tables inline with rich styles!

### Milestone 12: Direct Branch Target Propagations and True/False Visual Correction (BETA 2.0.13 Fix)
*   **Nested Branch Inserter Contexts:** Fixed the missing `parentContext` parameter inside recursive `renderLinesAndArrows` calls, allowing nested inserters to correctly propagate their target IDs (`branch_end:parentId:branchType`) instead of defaulting to `'main_end'`.
*   **True/False Visual Alignment:** Corrected the inverted visual labeling of condition branches: the `thenBranch` on the left is now correctly labeled **VERO (True)** in vibrant green, and the `elseBranch` on the right is labeled **FALSO (False)** in standard contrast color, matching the standard desktop layout of Flowgorithm perfectly.

### Milestone 13: Polish Release — Tutorial, Galleria Esempi, Export PNG & Bug Fixes (BETA 2.1.0-beta)

[//]: # (keepachangelog)

#### Added
*   **Interactive Tutorial Onboarding:** Created 8-step interactive walkthrough (`Tutorial.tsx`) that auto-shows on first visit (via `localStorage`) and can be opened from the Help menu. Includes keyboard navigation (arrows/escape), progress indicator, skip/finish controls, and "Don't show again" persistence.
*   **Example Gallery:** Built a complete gallery modal (`ExampleGallery.tsx`) with 8 built-in example programs (Hello World, Area Circle, Even/Odd, Sum 1 to N, Max of 3, Factorial, Multiplication Table, Guess the Number). Features search bar, category filters, and multilingual descriptions (EN, IT, DE, FR, ES). Accessible via **File → 📚 Example Gallery** or the 📚 toolbar button.
*   **Export PNG Image:** Added SVG-to-PNG conversion via Canvas (`handleExportPng` in `Header.tsx`). Includes interactive element cleanup, HiDPI/Retina support via `devicePixelRatio`, white background, and padding. Accessible via **File → 📸 Export PNG Image**.

#### Changed
*   **Empty Default Canvas:** Removed the pre-loaded sample program so new users start with a blank diagram (paired with the Tutorial for onboarding).
*   **GitHub Pages Configuration:** Set `base: './'` in `vite.config.ts` for relative asset paths.
*   **`.gitignore` Sanitization:** Removed obsolete entries (`.assetsai/`, `.logo-images/`, `arenaai.md`, `-e`) and added standard excludes for `node_modules/`, `dist/`, `.env`, `.ignore/`, and IDE files.
*   **Version Source Alignment:** Bumped `version.txt` and `arenaai.md` to `BETA 2.1.0` in sync.

#### Fixed
*   **Version Overwrite (Critical):** Moved `setAppVersion('BETA 2.0.13')` inside the `.catch()` block to prevent always overriding the live GitHub version.
*   **Undo Flooding on Title Edit:** Changed `setProgramTitle`/`setProgramAuthor` to update state directly without pushing history on every keystroke.
*   **Misleading Undo/Redo Messages:** Added `safeStopRun()` that checks execution status before calling `stopRun()` during undo/redo.
*   **Hardcoded IF Labels:** Replaced `'VERO (True)'`/`'FALSO (False)'` with language-specific translations.
*   **Duplicate SVG Gradients:** Made gradient IDs unique per block (`processGrad-${id}-${scheme}`) instead of per color scheme.
*   **Step Mode Lost After Input:** Added `stepModeRef` to preserve step-by-step mode after `submitInput` instead of switching to continuous run.
*   **IF Diamond Height Mismatch:** Corrected `IF_H` constant from 70 to 64 to match actual diamond SVG dimensions.
*   **Paste Button Logic:** Fixed paste disable condition to use `copiedBlock` (derived from `copiedBlocks.length > 0`).
*   **Hardcoded Console Strings:** Translated "Svuota" (Clear) and "Pronto" (Ready) to all supported languages.
*   **Browser `process.stdout.write`:** Replaced with `console.log` in `codeGenerator.ts` for browser compatibility.
*   **Interval Leak in `submitInput`:** Added cleanup of existing interval before creating a new one.
*   **SVG Export Cleanliness:** Removed inserter buttons, delete buttons, and interactive CSS classes from exported SVG/PNG images.


### Milestone 14: Tools Menu, Export Engines, and Author Auto-Detection (BETA 2.2.0-beta)

[//]: # (keepachangelog)

#### Added
*   **Tools Menu:** New dedicated "Tools" dropdown in the menu bar (between Style and Program) with Export SVG, Export PNG, and Export PDF options. Export entries also duplicated in the File menu.
*   **Export PNG Engine:** High-resolution PNG export (`src/utils/exportUtils.ts`) via offscreen Canvas rendering with `devicePixelRatio` HiDPI/Retina support, interactive element cleanup (removes inserter buttons and CSS classes), white background padding, and preservation of all 6 color schemes.
*   **Export PDF Engine:** PDF export via jsPDF with automatic orientation detection (landscape for wide diagrams, portrait for tall), print-quality 2x rendering, and clean formatting.
*   **Author Auto-Detection:** Author name field now persisted independently in `localStorage` (key: `flowonline_author`) and restored on next visit even after clearing the flowchart, allowing the user's name to persist across sessions.
*   **Clear LocalStorage Confirmation:** Added WinUI-styled confirmation dialog before clearing saved flowchart backup from localStorage.

#### Fixed
*   **Issue Templates Validation:** Fixed `validations` YAML key being incorrectly nested inside `attributes` in all 4 GitHub issue form templates (`bug_report-en.yml`, `bug_report-it.yml`, `feature_request-en.yml`, `feature_request-it.yml`). Moved `validations.required` to top-level form schema.


### Milestone 15: 22-Language Full Localization and WinUI Export Dialogs (BETA 2.3.0-beta)

[//]: # (keepachangelog)

#### Added
*   **22 Language Menu Translations:** Full localization of all header menu labels, toolbar tooltips, export messages, and system dialogs for 22 languages: English, English (GB), Italian, German, French, Spanish, Chinese, Dutch, Portuguese, Galician, Russian, Ukrainian, Czech, Polish, Hungarian, Slovenian, Japanese, Thai, Indonesian, Mongolian, Arabic, Hebrew, and Persian.
*   **Custom Export Icons:** PNG and PDF menu items display inline SVG icons (from Icons8) instead of generic emojis for professional appearance.

#### Changed
*   **WinUI Export Feedback:** PNG/PDF export success and error messages now shown in draggable, resizable WinUI dialogs (`WinUIDialog.tsx`) instead of native browser `alert()` popups.
*   **exportUtils.ts:** `exportToPNG` and `exportToPDF` now return `Promise<ExportResult>` objects so callers can display WinUI dialogs with success/error details.
*   **Header.tsx:** Export handlers updated to `await` export results and show WinUI dialogs with appropriate messages.


### Milestone 16: WinUI Language Picker, Help Menu Links, and Selectable Text (BETA 2.3.1-beta)

[//]: # (keepachangelog)

#### Added
*   **Language Picker WinUI Dialog:** Replaced the cramped HTML `<select>` dropdown with a full WinUI dialog (`WinUIDialog.tsx`) showing all 22 supported languages in a responsive grid with current-language highlighting.
*   **Help Menu Links:** Added "Report a Bug" (→ GitHub Issues), "Request a Feature" (→ GitHub Issues), and "Fork & Contribute" (→ GitHub Fork) entries to the Help dropdown menu, all opening in new browser tabs.
*   **Selectable Modal Text:** All text in Warning, Manual, About, and Changelog modals is now user-selectable via the `select-text` CSS utility class.
*   **WinUIDialog Custom Content:** Extended `WinUIDialog` component with an optional `children` prop for rendering fully custom dialog content (used by language picker, about, manual, changelog).

#### Changed
*   **Language Selector UI:** Now a styled button in the header bar opening a WinUI dialog, replacing the unstyled `<select>` element.
*   **Translations:** Added `bugReport`, `featureRequest`, `forkContribute`, and `selectLanguage` keys to all 22 supported languages.


### Milestone 17: WinUI About/Manual/Changelog Dialogs (BETA 2.3.2-beta)

[//]: # (keepachangelog)

#### Changed
*   **About Modal → WinUIDialog:** Converted from inline JSX modal to draggable/resizable WinUI dialog (700×525 px default, resets on close).
*   **User Manual → WinUIDialog:** Converted the 800×600 px Markdown-rendered manual viewer to a draggable/resizable WinUI dialog.
*   **Changelog → WinUIDialog:** Converted the changelog viewer to a draggable/resizable WinUI dialog (750×550 px default).
*   **WinUIDialog Size Props:** Added optional `defaultWidth` and `defaultHeight` props to WinUIDialog for per-dialog custom default dimensions and proper centering.

#### Fixed
*   **Language Picker Centering:** Increased default dimensions to 480×400 px so the 22-language grid is properly centered on screen instead of appearing too low.


### Milestone 18: Language Flags, Resize Behavior, and Logo Polish (BETA 2.3.3-beta)

[//]: # (keepachangelog)

#### Added
*   **Language Picker Flags:** Each language in the WinUI picker now displays its national flag emoji (🇺🇸 🇬🇧 🇮🇹 🇩🇪 🇫🇷 🇪🇸 🇨🇳 🇳🇱 🇵🇹 🇬🇱 🇷🇺 🇺🇦 🇨🇿 🇵🇱 🇭🇺 🇸🇮 🇯🇵 🇹🇭 🇮🇩 🇲🇳 🇦🇪 🇮🇱 🇮🇷) next to the language name for quick visual identification.
*   **Translation Disclaimer:** A notice below the language picker grid warns: "⚠️ Translations may not be 100% accurate. Some text is machine-translated."

#### Changed
*   **logo_crop.png:** Title bar and About modal now display the cropped logo image (`logo_crop.png`) instead of inline SVG for more reliable rendering.

#### Fixed
*   **Manual Resize Only:** WinUIDialog now uses `height` instead of `minHeight` CSS property, preventing automatic content-driven expansion. Windows stay at user-set size with scrollbars and can only be resized by dragging the bottom-right corner handle.


### Milestone 19: Freeze Prevention, Memory Safeguards, and Logo Hardcoding (BETA 2.3.5-beta)

[//]: # (keepachangelog)

#### Fixed
*   **License Textarea Size:** Changed from `flex-1` to explicit `h-[300px]` with proper overflow to restore full visibility of GPL v3 license text in the About dialog.
*   **Execution Speed Cap:** Minimum execution delay at max speed raised from 1ms to 16ms (60 FPS cap) to prevent UI thread lockup during continuous execution.
*   **Interval Leak:** Added `clearInterval` cleanup before `setInterval` in both `startRun` and `submitInput` to prevent multiple concurrent execution timers.
*   **Console Memory Cap:** `addConsoleMessage` capped at 1000 items (FIFO removal) to prevent memory exhaustion from infinite output loops.
*   **Undo Stack Cap:** `pushHistory` undo stack capped at 50 states to prevent unbounded memory growth on large diagrams.

#### Changed
*   **Hardcoded Logo SVG:** Replaced `logo_crop.png` references in title bar and About modal with the full inline SVG from `logo.svg` (Flowgorithm 4-box colored logo with gradients and glow effects), ensuring consistent rendering across all browsers.


### Milestone 20: Dynamic Tab Title, Favicon, and Menu Polish (BETA 2.3.6-beta)

[//]: # (keepachangelog)

#### Added
*   **Dynamic Tab Title with Memory:** Browser tab now shows JS heap memory usage (e.g., `Flowonline2 | Heap: 45/2048 MB`) via Chrome's `performance.memory` API, refreshed every 5 seconds with cleanup on unmount.
*   **Favicon from logo.svg:** Tab icon now uses the Flowgorithm 4-box logo SVG file instead of a generic green rectangle, providing proper branding in browser tabs.

#### Changed
*   **Menu Clarity:** Removed the `(MANUAL.md)` suffix from all 22 language translations of the User Manual menu entry (e.g., "User Manual..." instead of "User Manual (MANUAL.md)...") for cleaner appearance.


### Milestone 21: CPU/RAM Real-Time Tab Title (BETA 2.3.7–2.3.8)

[//]: # (keepachangelog)

#### Added (BETA 2.3.7-beta)
*   **CPU Usage Estimation:** Tab title now shows estimated CPU usage percentage via `requestAnimationFrame` frame timing jitter analysis (delta from expected 16.67ms vs actual frame time).
*   **RAM Display:** JS heap used memory shown in MB via Chrome `performance.memory.usedJSHeapSize` API.
*   **Format:** `Flowonline2 | CPU 2.3% | RAM 234MB` — throttled to update once per second (not every frame) to avoid overhead.

#### Fixed (BETA 2.3.7-beta)
*   rAF loop properly stopped on component unmount via `running` flag.
*   Frame deltas clamped to 100ms max to prevent tab-switch CPU spikes.

#### Changed (BETA 2.3.8-beta)
*   **Tab Title Format:** Simplified to `CPU X.X% | RAM XXXMB` (removed "Flowonline2" prefix for cleaner look).
*   **Cross-Browser Favicon:** Added `icon.png` fallback and `apple-touch-icon` for universal browser support (Firefox, Safari, Chrome). Kept SVG favicon for modern Chromium browsers.
*   RAM hidden on non-Chrome browsers (Firefox/Safari lack `performance.memory` API).


### Milestone 22: IDLE Freeze Fix and localStorage Optimization (BETA 2.3.9-beta)

[//]: # (keepachangelog)

#### Fixed
*   **IDLE Freeze:** `localStorage.setItem` was being called synchronously on every state change, blocking the main thread. Now debounced at 500ms via `saveTimeoutRef`.
*   **Stale Closure on Unmount:** Page-close save now uses `latestSaveRef` (a `useRef` tracking the latest state) to prevent data loss — previously captured initial values via empty dependency array `[]`.
*   **Save Race Condition:** `saveTimeoutRef` now properly cleared on dependency changes to prevent stale saves overwriting newer state.


### Milestone 23: Favicon PNG and DRY Refactor (BETA 2.3.10–2.3.11)

[//]: # (keepachangelog)

#### Added (BETA 2.3.10-beta)
*   **icon.png:** 500×500 transparent PNG favicon generated from `logo.svg` via `sharp-cli` for universal browser tab icon support.
*   **index.html:** `icon.png` as primary favicon, `logo.svg` as SVG fallback, `apple-touch-icon` using `icon.png`.

#### Changed (BETA 2.3.11-beta)
*   **DRY Refactor — persistToStorage:** Extracted duplicate localStorage save logic (previously copy-pasted in debounce effect and unmount effect) into a single `persistToStorage(s, t, a)` helper function.
*   **Unmount Error Logging:** localStorage errors during unmount save now logged via `console.warn` (previously silently ignored with empty `.catch()`).


### Milestone 24: Assets in public/ and Multi-Resolution favicon.ico (BETA 2.3.12–2.3.13)

[//]: # (keepachangelog)

#### Fixed (BETA 2.3.12-beta)
*   **Favicon Deploy:** Moved `icon.png`, `logo.svg`, `logo.png` from project root to `public/` directory. Vite only copies files from `public/` into `dist/` — before this fix, favicon assets were excluded from build output, breaking the tab icon on GitHub Pages.

#### Added (BETA 2.3.13-beta)
*   **Multi-Resolution favicon.ico:** Generated `favicon.ico` (16×16, 32×32, 48×48 px, 5.6KB) from `icon.png` via `sharp`. Multi-size ICO provides maximum cross-browser compatibility (legacy IE, all modern browsers).
*   **index.html:** `favicon.ico` (`image/x-icon`) as primary favicon with `icon.png` and `logo.svg` as fallbacks.

#### Removed (BETA 2.3.13-beta)
*   One-time `generate_ico.cjs` script and duplicate root `logo.svg` cleaned up after generation.


### Milestone 25: Dependency Cleanup (BETA 2.3.14-beta)

[//]: # (keepachangelog)

#### Removed
*   **sharp DevDependency:** Uninstalled `sharp` (~25MB) — `favicon.ico` already generated permanently, no longer needed.
*   **Temporary Files:** Cleaned up `/tmp/icon_*.png`, `/tmp/generate_ico.js`, `/tmp/refactor_persist.py`.
*   **package-lock.json:** Reduced by 655 lines after removing all transitive sharp dependencies.


### Milestone 26: Dynamic Version Badge and GitHub Release (BETA 2.3.15-beta)

[//]: # (keepachangelog)

#### Changed
*   **README.md Version Badge:** Replaced static hardcoded badge (`version-BETA 2.0.13-orange`) with dynamic shields.io GitHub Releases badge that auto-reads the latest release tag:
    ```html
    <img src="https://img.shields.io/github/v/release/PiBOH/flowonline2?include_prereleases&display_name=release&style=for-the-badge&label=VERSION">
    ```
    Now always shows the live version without manual updates.

#### Added
*   **GitHub Release 2.3.15-beta:** First automated release created via GitHub API with tag `2.3.15`, title `2.3.15-beta`, description "Code backup", and prerelease flag.


### Milestone 27: Logo Compression and Unused Dependency Removal (BETA 2.3.16-beta)

[//]: # (keepachangelog)

#### Changed
*   **logo.png Compression:** Compressed from 1,573,036 bytes (1.5 MB) to 18,069 bytes (18 KB) — a 98.9% reduction. Applied to both `public/logo.png` (web app) and root `logo.png` (GitHub README). Settings: 550px width, palette PNG with 128 colors, compression level 9, quality 80, transparent background preserved. Generated via `sharp` one-time script, then cleaned up.

#### Removed
*   **Unused ESLint Plugins:** Removed `@typescript-eslint/eslint-plugin` and `@typescript-eslint/parser` (never used in the project, no ESLint config exists).
*   **package-lock.json:** Reduced by additional 1,552 lines.

#### Added
*   **GitHub Release 2.3.16-beta:** Created via API with tag `2.3.16`.


### Milestone 28: Keyboard Listener Memory Leak Fix (BETA 2.3.17-beta)

[//]: # (keepachangelog)

#### Fixed
*   **Keyboard Listener Memory Leak:** The `useEffect` managing `keydown` event listener in `FlowContext.tsx` had `statements` in its dependency array. Since `statements` is a new array reference on every mutation (via `JSON.parse(JSON.stringify(...))` in every edit action: add, delete, paste, update), this caused `addEventListener`/`removeEventListener` to re-register on every single keystroke and diagram edit — generating continuous garbage collection.
*   **Fix:** Removed `statements` from the dependency array. `handleKeyDown` only uses stable callbacks (`deleteBlocks`, `copyBlocks`, `cutBlocks`, `pasteBlocks`) that internally close over the latest state via React's state updater functions. The listener now only re-registers when `selectedBlockIds` or `copiedBlocks` change.

#### Added
*   **GitHub Release 2.3.17-beta:** Created via API with tag `2.3.17`.


### Milestone 29: Critical Bugfixes — Stale Closure, Deep Clone, and IF Labels (BETA 2.3.18-beta)

[//]: # (keepachangelog)

#### Fixed
*   **pushHistory Stale Closure (Critical):** The `pushHistory` helper in `FlowContext.tsx` was saving the undo entry using closure-captured `statements`, `programTitle`, and `programAuthor` instead of the explicit params `newStmts`, `newTitle`, and `newAuthor`. This caused undo to snapshot stale state when title/author changed. Fixed by referencing the params directly in the undo entry: `{ statements: newStmts, title: newTitle, author: newAuthor }`.
*   **JSON.parse(JSON.stringify()) → structuredClone():** Replaced 5 deep-clone sites (4 in `addBlock`, `updateBlock`, `deleteBlocks`, `pasteBlocks` + 1 in `regenerateBlockIds`) with the native `structuredClone()` API. Benefits: ~2× faster, handles edge cases (undefined, Date), and works on Transferable objects. No import needed (global API since Chrome 98, Firefox 94, Safari 15.4).
*   **Hardcoded IF Labels → Translations:** Replaced the hardcoded Italian/English `VERO (True)` and `FALSO (False)` labels in `FlowchartCanvas.tsx` with dynamic translation keys `{t.canvas.trueBranch}` and `{t.canvas.falseBranch}`. Added multilingual `trueBranch`/`falseBranch` keys to the `canvas` section of all 23 languages in `translations.ts` and the `TranslationCatalog` type in `types/flow.ts`:
    - EN: TRUE / FALSE
    - IT: VERO / FALSO
    - DE: WAHR / FALSCH
    - FR: VRAI / FAUX
    - ES: VERDADERO / FALSO
    - ZH: 真 / 假
    - JA: 真 / 偽
    - RU: ИСТИНА / ЛОЖЬ
    - AR: صحيح / خاطئ
    - (and 14 more languages)


### Milestone 30: Unit Test Suite — Vitest, 126 Tests, 3 Critical Modules (BETA 2.3.19-beta)

[//]: # (keepachangelog)

#### Added
*   **Vitest Testing Framework:** Installed `vitest` and `jsdom` as devDependencies. Configured `vitest.config.ts` with jsdom environment, globals enabled, targeting `src/**/*.test.ts`.
*   **parser.test.ts (79 tests):** Comprehensive coverage of `ExpressionParser` — arithmetic operators (+, -, *, /, %, ^), precedence and parentheses, string concatenation (& and +), unquoted `\n` token, escape sequences, boolean literals (`true`/`false`), logical operators (`&&`, `||`, `!` + `and`/`or`/`not` keywords), relational operators (=, `==`, `!=`, `<>`, `<`, `>`, `<=`, `>=`), alphabet string comparison, variable resolution (scalar + array, case-insensitive), built-in PI constant, array indexing with bounds checking, error cases (division by zero, undefined variable, out of bounds, scalar/array misuse), and all built-in functions: `abs`, `sin`, `cos`, `tan`, `sqrt`, `log`, `log10`, `ln`, `len`/`size`, `toFixed`, `random`, `Char`, `ToCode`, `ToChar`, `ToInteger`, `ToReal`, `ToString`, `Int`, `Sgn`, `Arcsin`, `Arccos`, `Arctan`.
*   **codeGenerator.test.ts (27 tests):** Coverage of all 5 target languages (Python, JavaScript, C++, Java, C#) and all 10 block types (declare, assign, input, output, if-else, while, for, do, call, comment). Includes expression translation tests (&& → `and`, pi → `M_PI`/`Math.PI`, abs → `Math.Abs`), for-loop directions, do-while simulation in Python, multi-block programs, and edge cases (empty program, no-newline output).
*   **fprgParser.test.ts (20 tests):** `generateId` uniqueness, XML parsing for all 10 block types (including nested if direct-child isolation, `expression`/`value` attribute fallback, `ToChar(13)` → `\n` normalization), serialization (all block types, `\n` → `ToChar(13)` denormalization, XML special character escaping), and round-trip integrity (parse → serialize → parse).
*   **npm scripts:** Added `test` (`vitest run`) and `test:watch` (`vitest`) to `package.json`.

#### Changed
*   **tsconfig.json:** Added `"exclude": ["node_modules", "dist"]` for cleaner compilation.


### Milestone 31: Emoji → SVG Conversion for Cross-Platform Consistency (BETA 2.3.20-beta)

[//]: # (keepachangelog)

#### Changed
*   **EmojiIcons.tsx (NEW):** Created 26 SVG icon components replacing all platform-dependent emoji across the application. Each icon is a 16×16 viewBox inline SVG with `currentColor` stroke and configurable `size`/`className` props. Icons: ChatBubble, FolderOpen, Books, Palette, Refresh, Magnifier, Plus, Close, Minimize, Maximize, Warning, Error, Clipboard, Trash, Save, Document, Globe, Info, Question, Chart, Lightbulb, Wrench, Scissors, Inbox, Pencil, Code.
*   **WinUIDialog.tsx:** Replaced string emojis (ℹ️, ⚠️, ❌, ❓, ✕) in `typeColors.icon` with React SVG components. Changed `icon` type from `string` to `React.ReactNode`.
*   **Console.tsx:** Replaced 💬 emoji in header with `<IconChatBubble>`, ❌ in error messages with `<IconError>`. Console title now renders SVG icon alongside clean text.
*   **FlowchartCanvas.tsx:** Replaced all context menu emojis (📝, ✂️, 📋, ❌, 📥, ➕) with SVG components (IconPencil, IconScissors, IconClipboard, IconError, IconInbox, IconPlus).
*   **Header.tsx:** Replaced ALL 25+ emoji across menu bar, toolbar, layout buttons, and dropdown menus with SVG components. Includes window controls (─ → IconMinimize, ▢ → IconMaximize, ✕ → IconClose), file menu (📄📂💾🗑️), edit menu (✂️📋📥), view menu (🔍🔄), style menu (🎨), help menu (📋📚ℹ️💡), language selector (🌐), layout buttons (📊💬📝 → IconChart, IconChatBubble, IconCode), toolbar (📄📂💾🔍-🔍+🔄), and disclaimer (⚠️ → IconWarning). Fixed `layoutButtons` label type from `string` to `React.ReactNode`.
*   **translations.ts:** Removed legacy 💬 emoji prefix from all 23 `console.title` translations — now rendered via `<IconChatBubble>` component in Console.tsx.

#### Fixed
*   **Cross-Platform Emoji Rendering:** Emoji characters render inconsistently across operating systems and browsers (Windows shows monochrome outlines, macOS shows colorful designs, Linux may show nothing). SVG icons guarantee pixel-identical appearance everywhere.


### Milestone 32: GitHub Actions CI/CD — Auto Review, Test, and Release (BETA 2.3.21-beta)

[//]: # (keepachangelog)

#### Added
*   **code-review-and-test.yml (CI):** GitHub Actions workflow triggered on push/PR to `main` and manual `workflow_dispatch`. Four sequential jobs:
    *   `lint`: Runs ESLint (`npm run lint`) with tolerant warning threshold.
    *   `typecheck`: Runs `tsc --noEmit` for strict TypeScript validation.
    *   `build`: Runs `npm run build` (depends on typecheck) and verifies `dist/` output exists.
    *   `test`: Runs `npm test` (Vitest 126 tests, depends on typecheck). Uploads failure logs as artifacts on failure.
    All jobs use Node 20, npm caching, ubuntu-latest.
*   **auto-release.yml (CD):** GitHub Actions workflow triggered on push to `main` when `version.txt` changes, or manual `workflow_dispatch` (supports draft mode).
    *   Reads `version.txt` and strips `BETA`/`ALPHA`/`RC`/`STABLE` prefix to extract the release tag (e.g., `BETA 2.3.21-beta` → tag `2.3.21-beta`).
    *   Detects prerelease flag from suffix (`alpha`/`beta`/`rc` → `prerelease: true`).
    *   Extracts the relevant section from `CHANGELOG.md` (strips suffix to match header format).
    *   Creates a GitHub Release via `softprops/action-gh-release@v2` with:
        *   **Tag:** version number with suffix (e.g., `2.3.21-beta`)
        *   **Title:** `BETA 2.3.21-beta [bot]`
        *   **Body:** Automated template with version, commit hash (linked), date, trigger info, actor, and changelog section.
    *   Uses `GITHUB_TOKEN` for authentication with `contents: write` permission.


### Milestone 34: Mobile UI Hamburger + Toolbar Visibility Fix (BETA 2.3.23-beta → BETA 2.3.28-beta)

**Problem (persistent across multiple commits):** The header hamburger button and the desktop toolbar were both invisible on mobile (≤767px):
- The menu bar parent had `h-[24px]` (24px fixed), but the hamburger button is `height: 40px` from the `.hamburger-btn` CSS — button visibly overflowed the parent and was effectively hidden.
- The toolbar was hidden entirely via `@media (max-width: 767px) { .desktop-toolbar { display: none; } }`.

**Fix:**
1. `src/components/Header.tsx` (line ~2047) — Menu bar className: `h-[24px]` → `h-[44px] md:h-[24px]`. The 40px hamburger now fits cleanly inside the 44px menu bar on mobile, while desktop stays at the original 24px.
2. `src/index.css` — Removed the `.desktop-toolbar { display: none; }` rule inside the mobile media query. Replaced with mobile-friendly sizing:
   - `height: 44px; overflow-x: auto; overflow-y: hidden; -webkit-overflow-scrolling: touch;`
   - Buttons/child divs: `min-width: 44px; min-height: 44px; flex-shrink: 0;`
   - Custom 3px scrollbar inside the toolbar.

**Result:** Hamburger button AND all toolbar actions (New, Open, Save, Run, Step, Pause, Stop, Undo, Redo, Color scheme, Zoom) are now reachable on mobile. The toolbar stays at 44px tall, scrolls horizontally if too wide for the screen.

### Milestone 33: Commit Naming Convention for Releases (BETA 2.3.22-beta)

[//]: # (keepachangelog)

#### Added
*   **Release commit naming rule:** All commits that should trigger the auto-release workflow MUST start with lowercase `v`. The `auto-release.yml` job condition uses `startsWith(github.event.head_commit.message, 'v')` — commits without the `v` prefix are silently skipped.

#### Convention
| Prefix | Example | Release? |
|---|---|---|
| `v` | `v2.3.23: Release BETA` | ✅ Triggered |
| No `v` | `BETA 2.3.23: Fix bug` | ❌ Skipped |
| No `v` | `Fix CI pipeline` | ❌ Skipped |

**Rule for AI agents:** When bumping the version (updating `version.txt` + `CHANGELOG.md` + `arenaai.md`), always use a commit message starting with `v` followed by the version number. Example:
```
v2.3.23: Summary of changes
```



### Milestone 35: P0 Memory Leak Fixes + Language Selector on Right + err:unknown (BETA 2.3.29-beta)

**Closed P0 leaks:**
- `Sidebar.tsx`: `copyTimeoutRef = useRef<number | null>(null)` + dedicated `useEffect(() => () => window.clearTimeout(...))` unmount cleanup. `handleCopy` now clears existing ref before scheduling a new one.
- `FlowContext.tsx`: Keyboard listener converted from `[selectedBlockIds, copiedBlocks]` deps → `[]` deps + `selectedBlockIdsRef`/`copiedBlocksRef` synced each render. Listener registers ONCE on mount. Handler reads refs via `.current`, avoiding stale closures on rapid selection changes.
- `vite-env.d.ts` (new): `/// <reference types="vite/client" />\` reference so `import.meta.env?.DEV` type-checks correctly.

**UX fix:**
- `Header.tsx`: desktop-menu wrapper className `flex items-center` → `flex items-center flex-1`. Combined with `ml-auto mr-2` on the Globe pill, this anchors Globe at the right edge of the menu bar (instead of the right edge of the wrapper).
- 5 `catch (err: any)` clauses changed to `catch (err: unknown)` + `err instanceof Error ? err.message : String(err)` extraction (Header ×2, FlowContext ×2, Modals ×1).

**Known followup (NOT in this commit):**
- `Header.tsx` 4 fetch useEffects (version/LICENSE/MANUAL/CHANGELOG) lack `AbortController`. They still leak on unmount. Suggested fix: extract a `useRepoFile(url, fallback?)` custom hook so `controller` is in a single-useEffect closure (avoiding past TS scope errors when controller was inside `if (!showX)` branches).
- 6+ `console.warn` calls in Header.tsx + 4 in FlowContext.tsx remain un-gated with `import.meta.env?.DEV`. P2 production noise fix.
- Refactor opportunity: `selectedBlockIdsRef.current = selectedBlockIds;` runs on every render — could be moved into `useEffect(() => { ref.current = state }, [state])` for clarity.

### Milestone 36: Auto-Release Pipeline Polish — Tag Prefix Strip + Stable Channel (BETA 2.3.30-beta → BETA 2.3.31-stable)

[//]: # (keepachangelog)

#### Changed (BETA 2.3.30-beta)
*   **Tag prefix removal:** `.github/workflows/auto-release.yml` derives the GitHub release tag from the *already-stripped* `NAME` rather than from the raw `version.txt`. Eliminates the `BETA_2.3.28` / `STABLE_2.3.28` prefixes in tag names.
*   **NAME derivation unchanged:** `NAME = sed -E 's/^(BETA|ALPHA|RC|STABLE)\s+//i'($VERSION) + ' [bot]'`.
*   **TAG derivation updated:** `TAG = sed 's/ \[bot\]$//' | sed 's/ /_/g'($NAME) + '_bot'`.

#### Changed (BETA 2.3.31-stable)
*   **Prerelease rule inverted:** Auto-release now sets `prerelease=false` **only** when `version.txt` *ends* with `-stable`. All other lifecycles (BETA, ALPHA, RC*, or no suffix) default to `prerelease=true` as a safe fall-back.
*   **`BETA 2.3.31-stable` lands as a Stable release** (no pre-release badge).

#### Operational cheat sheet (post-2.3.31)
| `version.txt` content   | Channel    | Tag                       | Name                       |
|-------------------------|------------|---------------------------|----------------------------|
| `BETA 2.3.x-beta`       | Pre-release| `2.3.x-beta_bot`          | `2.3.x-beta [bot]`         |
| `BETA 2.3.x-alpha`      | Pre-release| `2.3.x-alpha_bot`         | `2.3.x-alpha [bot]`        |
| `2.3.x-rc1`             | Pre-release| `2.3.x-rc1_bot`           | `2.3.x-rc1 [bot]`          |
| `BETA 2.3.x-stable`     | **Stable** | `2.3.x-stable_bot`        | `2.3.x-stable [bot]`       |
| `2.3.x`                 | Pre-release| `2.3.x_bot`               | `2.3.x [bot]`              |

### Milestone 37: BETA-Classic Two-Row Mobile Header (BETA 2.3.32-beta)

[//]: # (keepachangelog)

#### Changed
*   **`src/index.css`:** replaced the `@media (max-width: 767px) { .desktop-menu { display: none } }` rule that previously hid the classic menu bar on mobile. New behavior:
    *   `.desktop-menu` is now visible on mobile as a 44px-tall horizontally-scrollable row inside the existing menu bar (the fledgling hamburger-only fallback is now obsolete).
    *   Direct children (`.desktop-menu > div`) are kept flex-shrink: 0 with `min-height: 44px` so each menu label stays tappable (Apple/Material 44pt minimum).
    *   Inner buttons get `min-width: 44px`, `padding: 0 12px`, and `white-space: nowrap` so labels never wrap.
*   **Hamburger / slide-out hidden on mobile:** `.hamburger-btn`, `.mobile-only`, `.mobile-menu-panel`, `.mobile-menu-overlay` are now `display: none !important` at the mobile breakpoint — the menus reachable inline.
*   **No Header.tsx structural changes** required. Existing JSX already renders the desktop menus in `.desktop-menu`; flipping visibility via CSS brings them onto mobile row 2.

#### Net effect on mobile (≤767px)
| Row | What renders                                    |
|-----|-------------------------------------------------|
| 1   | Window title (Flowonline2 + version + Untitled) + minimize / maximize / close |
| 2   | File · Edit · Style · Tools · Program · Help · Globe (horizontally scrollable) |
| 3   | Run · Step · Pause · Stop · undo · redo · zoom · file ops (existing desktop-toolbar, unchanged) |
| –   | Hamburger slide-out panel → hidden              |
