# arenaai.md - Flowonline2 Development, Maintenance and Change Log

This file acts as the primary operational instruction manual for AI models maintaining or extending **Flowonline2**, a pixel-perfect, fully-functional web clone of Flowgorithm developed by PiBOH under the MIT license.

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
5.  **Maintain PiBOH License Notice:** Always preserve the PiBOH and MIT license credits in the header/footer of the main viewport.

---

## 5. Architectural Milestone Logs & Change History (BETA 2.1.0)

This log tracks all major fixes and architectural adjustments made to Flowonline2 to guarantee a 1000% faithful replication of the Windows desktop Flowgorithm application:

### Milestone 1: Windows MDI (Multiple Document Interface) Desktop Frame (BETA 2.0.3)
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

### Milestone 4: Graphic Sfumature & Shape Outlines (BETA 2.0.5)
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

### Milestone 8: Hover Slide-To-Active Menus & Global Click Closures (BETA 2.0.9)
*   **Win32 Hover Dropdown Sliding:** Added `onMouseEnter` handlers across all dropdown menu headers, allowing dropdowns to activate automatically on hover when a dropdown is already open.
*   **Global Click closures:** Created a global document `mousedown` listener to close dropdowns when clicking outside, emulating standard desktop window menus.
*   **DPI-Aware 600% Zoom Toolbar:** Added Zoom In (`🔍+`), Zoom Out (`🔍-`), zoom percentage, and Reset Zoom (`🔄`) controls on the upper-right side of the toolbar.
*   **Win32 About Dialog Sizing:** Resized the Win32 About dialog to exactly `700px` width by `525px` height.

### Milestone 9: Unquoted Newlines and XML Auto-Translation (BETA 2.0.10)
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

### Milestone 13: Polish Release — Tutorial, Galleria Esempi, Export PNG & Bug Fixes (BETA 2.1.0)

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


