# Flowonline2

<p align="center">
  <img src="logo.png" alt="Flowonline2 Logo" width="550" />
</p>

<p align="center">
  <a href="https://piboh.github.io/flowonline2/">
    <img src="https://hitscounter.dev/api/hit?url=https%3A%2F%2Fpiboh.github.io%2Fflowonline2%2F&label=Visitors&icon=stars&color=%23198754&style=for-the-badge&tz=UTC" alt="Visitor Badge" />
  </a>
  <img src="https://img.shields.io/github/license/PiBOH/flowonline2?style=for-the-badge&color=blue" alt="License Badge" />
  <img alt="GitHub Release" src="https://img.shields.io/github/v/release/PiBOH/flowonline2?include_prereleases&display_name=release&style=for-the-badge&label=VERSION">
</p>

---

**Flowonline2** is a pixel-perfect, 1000% faithful web-based clone of the popular educational flowchart editor and interpreter **Flowgorithm (Windows version 4.5)**. Developed by **PiBOH** under the GNU General Public License v3, it compiles entirely to static client-side files, offering a zero-config, highly-responsive programming playground directly in your web browser.

> 🔗 **Launch the App:** [piboh.github.io/flowonline2](https://piboh.github.io/flowonline2/)  
> 📦 **Legacy Repository:** [github.com/PiBOH/flowonline](https://github.com/PiBOH/flowonline)

---

## 📚 Multilingual Documentation (MANUAL.md)

For detailed information on variables, mathematical expressions, conversion intrinsics, and file architectures, please read the complete [**MANUAL.md**](https://github.com/PiBOH/flowonline2/blob/main/MANUAL.md) file:

*   🌐 [**English Manual (US/UK)**](https://github.com/PiBOH/flowonline2/blob/main/MANUAL.md#english)
*   🇮🇹 [**Manuale Italiano**](https://github.com/PiBOH/flowonline2/blob/main/MANUAL.md#italiano)
*   🇩🇪 [**Deutsches Handbuch**](https://github.com/PiBOH/flowonline2/blob/main/MANUAL.md#deutsch)
*   🇫🇷 [**Manuel Français**](https://github.com/PiBOH/flowonline2/blob/main/MANUAL.md#français)
*   🇪🇸 [**Manual Español**](https://github.com/PiBOH/flowonline2/blob/main/MANUAL.md#español)

---

## 🌟 Key Features & Emulation Highlights

### 1. Faithful Win32 & MDI Visuals
*   **Aero Glass Title Bar:** Emulates the classic Windows title bar, featuring the 4-box colored Flowgorithm logo and decorative system controls.
*   **Docked Multiple Document Interface (MDI):** Real-time workspace split layouts including *Flowchart Only* (🖥️), *Flowchart & Watch* (📊), *Flowchart & Console* (💬), *Triple Split View* (🚀, default), and *Flowchart & Source Code* (📝).
*   **6 Official Color Themes:** Cycle between *Classic*, *Pastel*, *Vibrant*, *Retro*, *Twilight (Dark Theme)*, and *Black & White* to dynamically recolor the canvas nodes, Watch spreadsheet, and Console messages simultaneously.

### 2. Premium Editing & Interaction (v2.0.13)
*   **Multiple Block Selection:** Select blocks with a single click, or hold down `Ctrl` / `Shift` / `Cmd` to select multiple blocks together! Selected shapes get a beautiful, glowing blue dotted outline.
*   **Win32 Context Menu (Tasto Destro):** Right-click on any block or circular blue inserter pin (`+`) to open a classic Windows contextual popup menu. Options include:
    *   `📝 Modifica... (Edit...)`
    *   `✂️ Taglia (Cut)`
    *   `📋 Copia (Copy)`
    *   `📥 Incolla dopo / Incolla Blocco (Paste After / Paste Block)`
    *   `❌ Elimina (Delete)`
*   **Keyboard Deletion and Clipboard:** Fully supports keyboard actions: press `Delete` or `Backspace` to delete all selected blocks at once, or use `Ctrl+C`, `Ctrl+X`, and `Ctrl+V` to copy, cut, and paste blocks with anti-collision ID regeneration.
*   **In-App MANUAL.md Viewer:** Includes a spacious `800x600px` manual window that dynamically fetches and renders this markdown formatted file with beautiful titles, styled operator tables, and clickable language anchors.

### 3. High-Fidelity Interpreter & VM
*   **Step-by-Step Debugger:** Compiles AST statements into flat VM instructions, smoothly auto-centering active nodes inside the viewport during execution.
*   **Case-Insensitive Variable Names:** Case-insensitive variable lookup and expression handling.
*   **String & Character Conversion Intrinsics:** Full support for `Char`, `ToCode`, `ToChar`, `ToInteger`, `ToReal`, `ToString`, `Int`, `Sgn`, standard trig functions, and comparative string comparisons.
*   **Unquoted Newline Constant (`\n`):** Parse unquoted `\n` inside string concatenations (e.g., `text & \n & "more text"`).

### 4. Seamless File Bidirectionality
*   **FPRG XML (.fprg):** On load, parses the XML tree, preserving comments and converting `ToChar(13)` to unquoted `\n`. On save, writes standardized XML, translating `\n` back to `ToChar(13)` and preserving strict scalar types (preventing variables from becoming arrays in desktop Flowgorithm - Issue #1).
*   **JSON Backups (.json):** Export and reload raw backup JSON states directly using the Open button or the toolbar.

---

## 🛠️ Developer Setup & Compilation

Flowonline2 is built using **React 18**, **TypeScript**, and **Tailwind CSS**. To run or build the repository locally, execute the following commands in your terminal:

```bash
# 1. Clone the repository
git clone https://github.com/PiBOH/flowonline2.git
cd flowonline2

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Compile and build production static files
npm run build
```

---

## 📄 License & Credits

Flowonline2 is developed by **PiBOH** and is licensed under the **GNU General Public License v3**. For complete license terms, please read the [**LICENSE**](LICENSE) file.

*Flowgorithm is a registered trademark of its respective authors. Flowonline2 is an independent open-source educational clone.*
