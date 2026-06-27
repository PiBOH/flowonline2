# Flowonline2 Manual / Manuale / Handbuch / Manuel / Manual

Choose your language / Scegli la lingua:
*   [English (US/UK)](#english)
*   [Italiano](#italiano)
*   [Deutsch](#deutsch)
*   [Français](#français)
*   [Español](#español)

---

<a name="english"></a>
## English Manual (US/UK)

> **⚠️ ATTENTION / NOTICE:**
> The translations of Flowonline2, MANUAL.md, and all other local project files might not be 100% accurate.

Welcome to **Flowonline2**, a pixel-perfect, 1000% faithful web-based clone of the popular educational flowchart interpreter **Flowgorithm** (Windows version 4.5). 

Developed by PiBOH under the MIT License, this static, client-side application brings the full power of Flowgorithm to any web browser with zero configuration.

### 1. User Interface & Emulation
*   **Title Bar (Windows Style):** Emulates a classic Windows desktop window, complete with the multi-colored Flowgorithm logo and decorative window controls (Minimize, Maximize, Close). Clicking these controls will open an authentic Win32 dialog box warning stating they are decorative.
*   **Menu Bar:** Multi-lingual dropdowns (*File*, *Edit*, *Program*, *Chart Style & Color*, *Disposal*, and *Help*). Hovering over other menus while one is active will slide open the adjacent menus automatically.
*   **Toolbar:** Houses standard `32x32px` flat-button shortcuts, speed slider, and zoom controls.

### 2. Operators & Syntax Rules
Flowonline2 evaluates standard Flowgorithm operators. Below is a detailed reference:

| Operator | Type | Description | Example |
| :---: | :---: | :--- | :--- |
| `+` | Math / String | Addition or String Concatenation | `x + 5` or `"Result: " + x` |
| `-` | Math | Subtraction or Unary Negation | `x - 10` or `-y` |
| `*` | Math | Multiplication | `a * b` |
| `/` | Math | Division (returns floating point) | `a / b` |
| `%` | Math | Modulo (remainder of division) | `10 % 3` |
| `^` | Math | Exponentiation (power) | `2 ^ 3` (evaluates to 8) |
| `&` | String | Explicit String Concatenation | `name & " Surname"` |
| `==` / `=` | Relational | Equality (single `=` is mapped to `==` in conditions) | `x = 5` or `x == 5` |
| `!=` / `<>` | Relational | Inequality (both `!=` and `<>` are fully supported) | `x <> 0` or `x != 0` |
| `<` | Relational | Less than (alphabetical for strings, numeric for numbers) | `a < b` |
| `>` | Relational | Greater than (alphabetical for strings, numeric for numbers) | `a > b` |
| `<=` | Relational | Less than or equal to | `a <= b` |
| `>=` | Relational | Greater than or equal to | `a >= b` |
| `and` / `&&` | Logical | Logical AND (case-insensitive) | `x > 0 and y < 10` |
| `or` | Logical | Logical OR (case-insensitive) | `x == 0 or y == 0` |
| `not` / `!` | Logical | Logical NOT (case-insensitive) | `not isAdult` |

### 3. Save & Load Operations (.fprg vs .json)
*   **FPRG Files (.fprg):** This is the native Flowgorithm XML format. 
    *   **Loading:** The XML is parsed recursively. Strict child element matching is used for `<if>` tags (preventing nested branching errors).
    *   **Saving:** Writes standard XML matching Flowgorithm's strict layout. Regular variables are written with `array="False"` and `size=""` to prevent them from becoming arrays in the desktop application (Issue #1 Fix).
*   **JSON Backup Files (.json):** Saves the exact internal state of Flowonline2 blocks. These can be saved and reloaded directly using *File -> Open* or the toolbar.
*   **ToChar(13) and Newline (\n) Auto-Translation:**
    *   **In Flowgorithm (Windows):** Newlines must be entered using the `ToChar(13)` function.
    *   **In Flowonline2 (Web):** You can use the unquoted newline constant `\n` directly (e.g., `text & \n & "more text"`). 
    *   **Auto-Translation:** When opening a `.fprg` file, all occurrences of `ToChar(13)` are converted to `\n`. When saving, all `\n` are converted back to `ToChar(13)` to maintain perfect desktop compatibility.

---

<a name="italiano"></a>
## Italiano (Italian Manual)

> **⚠️ ATTENZIONE / NOTA:**
> Le traduzioni di Flowonline2, di MANUAL.md e di tutti gli altri file di progetto potrebbero non essere accurate al 100%.

Benvenuto su **Flowonline2**, un clone web straordinariamente fedele al 1000% del celebre interprete educativo di diagrammi di flusso **Flowgorithm** (versione Windows 4.5).

Sviluppato da PiBOH sotto licenza MIT, questo applicativo statico porta tutta la potenza di Flowgorithm nel browser, senza bisogno di alcuna configurazione.

### 1. Interfaccia Utente ed Emulazione
*   **Barra del Titolo (Stile Windows):** Emula una classica finestra desktop, completa del logo di Flowgorithm a 4 colori e tasti di controllo fittizi (Riduci a icona, Ingrandisci, Chiudi). Cliccando su di essi apparirà un avviso di sistema Win32.
*   **Barra dei Menu:** Menu a tendina multilingua (*File*, *Modifica*, *Programma*, *Stile & Colori*, *Disposizione*, e *?*). Al passaggio del mouse, i menu a discesa adiacenti si aprono automaticamente.
*   **Barra Strumenti:** Contiene scorciatoie con pulsanti `32x32px`, slider della velocità e i controlli dello zoom.

### 2. Regole di Sintassi e Operatori
Flowonline2 supporta tutti gli operatori formali di Flowgorithm. Di seguito la tabella di riferimento dettagliata:

| Operatore | Tipo | Descrizione | Esempio |
| :---: | :---: | :--- | :--- |
| `+` | Matematico / Stringhe | Addizione o Concatenazione | `x + 5` o `"Risultato: " + x` |
| `-` | Matematico | Sottrazione o Negazione Unaria | `x - 10` o `-y` |
| `*` | Matematico | Moltiplicazione | `a * b` |
| `/` | Matematico | Divisione (restituisce un numero reale) | `a / b` |
| `%` | Matematico | Modulo (resto della divisione) | `10 % 3` |
| `^` | Matematico | Elevamento a potenza | `2 ^ 3` (restituisce 8) |
| `&` | Stringhe | Concatenazione esplicita | `nome & " Cognome"` |
| `==` / `=` | Relazionale | Uguaglianza logica (il singolo `=` viene interpretato come `==` nelle condizioni) | `x = 5` o `x == 5` |
| `!=` / `<>` | Relazionale | Diversità logica (sia `!=` sia `<>` sono pienamente supportati) | `x <> 0` o `x != 0` |
| `<` | Relazionale | Minore (alfabetico per le stringhe, numerico per i numeri) | `a < b` |
| `>` | Relazionale | Maggiore (alfabetico per le stringhe, numerico per i numeri) | `a > b` |
| `<=` | Relazionale | Minore o uguale | `a <= b` |
| `>=` | Relazionale | Maggiore o uguale | `a >= b` |
| `and` / `&&` | Logico | AND Logico (case-insensitive) | `x > 0 and y < 10` |
| `or` | Logico | OR Logico (case-insensitive) | `x == 0 or y == 0` |
| `not` / `!` | Logico | NOT Logico (case-insensitive) | `not maggiorenne` |

### 3. Operazioni di Salvataggio e Caricamento (.fprg vs .json)
*   **File FPRG (.fprg):** È il formato XML originale di Flowgorithm.
    *   **Caricamento:** L'XML viene decodificato ricorsivamente. La lettura dei rami `then` ed `else` è rigidamente limitata ai figli diretti del tag `<if>`, evitando conflitti di nidificazione.
    *   **Salvataggio:** Genera codice XML standard. Per prevenire il bug di conversione automatica delle variabili in array (risoluzione Issue #1), le variabili scalari vengono salvate rigorosamente con `array="False"` e `size=""`.
*   **File di Backup JSON (.json):** Salva lo stato interno puro di Flowonline2. Può essere esportato e riaperto direttamente dal menu *File -> Apri*.
*   **Traduzione Automatica ToChar(13) e Newline (\n):**
    *   **In Flowgorithm (Windows):** I ritorni a capo richiedono l'uso della funzione `ToChar(13)`.
    *   **In Flowonline2 (Web):** Puoi inserire direttamente la costante non virgolettata `\n` (es. `testo & \n & "altro"`).
    *   **Conversione automatica:** All'apertura del file `.fprg`, l'app converte tutti i `ToChar(13)` in `\n`. Al salvataggio, converte tutti i `\n` in `ToChar(13)` per garantire compatibilità assoluta!

---

<a name="deutsch"></a>
## Deutsch (German Manual)

> **⚠️ ACHTUNG / HINWEIS:**
> Die Übersetzungen von Flowonline2, MANUAL.md und allen anderen Projektdateien sind möglicherweise nicht zu 100 % korrekt.

Willkommen bei **Flowonline2**, einem Klon des Flussdiagramm-Interpreters **Flowgorithm** (Windows-Version 4.5).

### 1. Operatoren & Auswertung
*   Unterstützt standardmäßige mathematische Operatoren (`+`, `-`, `*`, `/`, `%`, `^`).
*   Unterstützt Vergleichsoperatoren (`==`, `=`, `!=`, `<>`, `<`, `>`, `<=`, `>=`). Das Symbol `<>` wird als Ungleichheitsoperator (`!=`) interpretiert. Der einzelne `=` wird in Bedingungen als `==` gewertet.
*   Unterstützt logische Operatoren (`and`, `or`, `not`, `&&`, `||`, `!`).

### 2. ToChar(13) und Zeilenumbruch (\\n)
*   In Flowonline2 können Sie `\n` ohne Anführungszeichen als Konstante eingeben (z. B. `text & \n & "text"`). Beim Speichern im `.fprg`-Format wird diese automatisch in die Windows-Funktion `ToChar(13)` umgewandelt.

---

<a name="français"></a>
## Français (French Manual)

> **⚠️ ATTENTION / AVIS:**
> Les traductions de Flowonline2, de MANUAL.md et de tous les autres fichiers du projet peuvent ne pas être exactes à 100 %.

Bienvenue sur **Flowonline2**, un clone web fidèle à 1000 % de l'interpréteur pédagogique de logigrammes **Flowgorithm** (Windows version 4.5).

### 1. Opérateurs et Syntaxe
*   Prend en charge tous les opérateurs mathématiques standard (`+`, `-`, `*`, `/`, `%`, `^`).
*   Prend en charge les opérateurs de comparaison (`==`, `=`, `!=`, `<>`, `<`, `>`, `<=`, `>=`). Le symbole `<>` est interprété comme différent de (`!=`). Un seul `=` est traité comme une comparaison d'égalité (`==`).

### 2. Conversion automatique ToChar(13) et Newline (\\n)
*   Dans Flowonline2, vous pouvez utiliser directement `\n` sans guillemets. Lors de l'exportation vers un fichier `.fprg`, l'application le reconvertit en `ToChar(13)` pour une compatibilité parfaite avec Windows.

---

<a name="español"></a>
## Español (Spanish Manual)

> **⚠️ ATENCIÓN / AVISO:**
> Las traducciones de Flowonline2, MANUAL.md y todos los demás archivos del proyecto pueden no ser exactas al 100%.

Bienvenido a **Flowonline2**, un clon web extraordinariamente fiel al 1000% del popular intérprete de diagramas de flujo **Flowgorithm** (versión de Windows 4.5).

### 1. Operadores y Sintaxis
*   Admite todos los operadores matemáticos estándar (`+`, `-`, `*`, `/`, `%`, `^`).
*   Admite los operadores de comparación (`==`, `=`, `!=`, `<>`, `<`, `>`, `<=`, `>=`). El símbolo `<>` se interpreta como distinto de (`!=`). Un solo `=` se trata como una comparación de igualdad (`==`).

### 2. Conversión ToChar(13) y salto de línea (\\n)
*   En Flowonline2, puede utilizar directamente la constante `\n` sin comillas. Al guardar en formato `.fprg`, la aplicación la vuelve a convertir en `ToChar(13)` de forma totalmente automática.
