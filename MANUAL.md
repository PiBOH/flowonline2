# Flowonline2 Manual / Manuale / Handbuch / Manuel / Manual

Choose your language:
*   [English (US/UK)](#english)
*   [Italiano](#italiano)
*   [Deutsch](#deutsch)
*   [Français](#français)
*   [Español](#español)

---

<a name="english"></a>
## English Manual (US/UK)

Welcome to **Flowonline2**, a pixel-perfect, 1000% faithful web-based clone of the popular educational flowchart interpreter **Flowgorithm** (Windows version 2.0.3). 

Developed by PiBOH under the MIT License, this static, client-side application brings the full power of Flowgorithm to any web browser with zero configuration.

### 1. User Interface
*   **Title Bar (Windows Style):** Emulates a classic Windows desktop window, complete with the multi-colored Flowgorithm logo and decorative window controls (Minimize, Maximize, Close). Clicking these controls will open an authentic Win32 dialog box warning.
*   **Menu Bar:** Multi-lingual dropdowns (*File*, *Edit*, *Program*, *Chart Style & Color*, and *Disposal*).
*   **Toolbar:** Houses standard `32x32px` flat-button shortcuts for fast operations, a speed slider, and zoom controls.

### 2. Layouts (Disposal)
Flowonline2 supports 5 different layout docked screens (MDI), selectable from both the toolbar and the *Disposal* menu:
*   `🖥️` **Flowchart Only:** Full-screen visualization of your algorithm.
*   `📊` **Flowchart & Watch:** Side-by-side split screen showing variables in memory.
*   `💬` **Flowchart & Console:** Side-by-side split screen showing execution dialogue bubbles.
*   `🚀` **Triple Split:** The default, complete MDI stack with Flowchart on the left, Variable Watch on top-right, and Console on bottom-right.
*   `📝` **Flowchart & Code:** Sychronized split screen showing compiled source code in **Python, JavaScript, C++, Java, or C#**.

### 3. Creating & Running Flowcharts
*   **Inserting Blocks:** Click on any circular blue inserter dot (`+`) on the connection lines. The dot will expand and glow. Click on it to open the selection menu and insert shapes (Declare, Assign, Input, Output, If, While, For, Do, Call, Comment).
*   **Editing Blocks:** Double-click on any visual node to open its dedicated Win32 configuration modal.
*   **Execution Modes:**
    *   **Run (Play):** Executing continuously.
    *   **Step:** Paso-passo visual debugging. Highlights the executing block.
    *   **Speed Slider:** Left for slow-motion animation, right for maximum instant execution.
*   **Console I/O:** Output statements are printed in mint-green chat bubbles. When the interpreter hits an Input block, the console automatically opens, highlighting a input form to type values (validated against the variable type).

### 4. Expression Parsing Rules
*   Variables are **case-insensitive** (e.g. `MyVar` and `myvar` refer to the same memory slot).
*   Both `=` and `==` are parsed as the logical equality operator in conditions.
*   Strings are compared alphabetically, and numbers numerically.
*   Use `ToChar(13)` or the standard string escape `"\n"` to introduce newline carriage returns inside output blocks.

### 5. File Import & Export (.fprg)
*   **Open:** Click *File -> Open...* or the folder icon on the toolbar to import a native Flowgorithm `.fprg` XML file.
*   **Save:** Click *File -> Save* or the diskette icon to download a fully compliant `.fprg` XML file which can be opened directly on the Windows desktop application.

---

<a name="italiano"></a>
## Italiano (Italian Manual)

Benvenuto su **Flowonline2**, un clone web straordinariamente fedele al 1000% del celebre interprete educativo di diagrammi di flusso **Flowgorithm** (versione Windows 2.0.3).

Sviluppato da PiBOH sotto licenza MIT, questo applicativo statico porta tutta la potenza di Flowgorithm nel browser, senza bisogno di alcuna configurazione.

### 1. Interfaccia Utente
*   **Barra del Titolo (Stile Windows):** Emula una classica finestra desktop, completa del logo di Flowgorithm a 4 colori e tasti di controllo fittizi (Riduci a icona, Ingrandisci, Chiudi). Cliccando su di essi apparirà un autentico avviso di sistema Win32.
*   **Barra dei Menu:** Menu a tendina multilingua (*File*, *Modifica*, *Programma*, *Stile & Colori*, e *Disposizione*).
*   **Barra Strumenti:** Contiene scorciatoie con pulsanti `32x32px`, slider della velocità e i controlli dello zoom.

### 2. Disposizioni (Layout)
Flowonline2 supporta 5 diversi layout MDI delle finestre, selezionabili sia dalla barra rapida sia dal menu *Disposizione*:
*   `🖥️` **Solo Diagramma:** Ottimizza la visualizzazione del diagramma di flusso a tutto schermo.
*   `📊` **Diagramma e Watch:** Schermo diviso che mostra l'albero visivo e la tabella delle variabili attive.
*   `💬` **Diagramma e Console:** Visualizzazione affiancata del diagramma e della console di input/output.
*   `🚀` **Tutto Insieme (Triple Split):** Il layout predefinito con il diagramma a sinistra, il Watch Variabili in alto a destra e la Console in basso a destra.
*   `📝` **Diagramma e Codice:** Mostra la conversione in tempo reale dell'algoritmo in **Python, JavaScript, C++, Java, o C#**.

### 3. Creazione ed Esecuzione
*   **Inserire Blocchi:** Fai clic sui pallini blu `+` sulle linee di collegamento. Il pallino si ingrandirà emettendo un bagliore ambrato. Cliccandoci, aprirai il menu contestuale per posizionare le forme.
*   **Modifica:** Fai doppio clic su un blocco per aprire la finestra di modifica dei campi.
*   **Esecuzione:**
    *   **Esegui:** Avvio continuo dell'algoritmo.
    *   **Passo-Passo:** Debug visuale un blocco alla volta.
    *   **Regolazione Velocità:** Trascina lo slider a sinistra per rallentare o a destra per l'esecuzione istantanea.
*   **Console I/O:** L'output viene stampato in fumetti verde menta. In presenza di un blocco di Input, la console si apre automaticamente e si mette in attesa di un valore, validandolo in base al tipo della variabile.

### 4. Regole di Parsing ed Espressioni
*   I nomi delle variabili sono **case-insensitive** (es. `Somma` e `somma` indicano lo stesso slot).
*   Nelle condizioni, sia `=` sia `==` indicano l'uguaglianza logica.
*   Le stringhe vengono confrontate alfabeticamente, i numeri in modo matematico.
*   Per andare a capo all'interno di un blocco di output, inserisci `ToChar(13)` o la sequenza di escape standard `"\n"`.

### 5. Compatibilità .fprg (Import & Export)
*   **Apri:** Clicca su *File -> Apri...* o sulla cartellina sulla barra rapida per caricare un file `.fprg` generato da Flowgorithm desktop.
*   **Salva:** Clicca su *File -> Salva* o sul dischetto per scaricare un file XML `.fprg` perfettamente leggibile ed eseguibile sull'applicazione desktop per Windows.

---

<a name="deutsch"></a>
## Deutsch (German Manual)

Willkommen bei **Flowonline2**, einem pixelgenauen und zu 1000 % originalgetreuen Web-Klon des beliebten Flussdiagramm-Interpreters **Flowgorithm** (Windows-Version 2.0.3).

Entwickelt von PiBOH unter der MIT-Lizenz, bringt diese clientseitige Anwendung die volle Leistung von Flowgorithm in jeden Webbrowser – ganz ohne Konfiguration.

### 1. Benutzeroberfläche
*   **Titelleiste (Windows-Stil):** Emuliert ein klassisches Windows-Fenster mit dem farbigen Flowgorithm-Logo und dekorativen Fensterschaltflächen (Minimieren, Maximieren, Schließen).
*   **Menüleiste:** Mehrsprachige Dropdowns (*Datei*, *Bearbeiten*, *Programm*, *Diagrammstil & Farbe* und *Anordnung*).
*   **Symbolleiste:** Bietet Verknüpfungen mit flachen Tasten, einen Geschwindigkeitsregler und Zoom-Bedienelemente.

### 2. Fensteranordnungen (Layouts)
Flowonline2 unterstützt 5 verschiedene MDI-Fensterlayouts:
*   `🖥️` **Nur Diagramm:** Flussdiagramm-Ansicht auf dem ganzen Bildschirm.
*   `📊` **Diagramm & Variablen:** Geteilter Bildschirm mit Variablen-Überwachung im Speicher.
*   `💬` **Diagramm & Konsole:** Geteilte Ansicht mit Ein- und Ausgabeblasen.
*   `🚀` **Alles Zusammen (Triple Split):** Das Standard-Layout mit Flussdiagramm links, Variablen-Überwachung oben rechts und Konsole unten rechts.
*   `📝` **Diagramm & Code:** Echtzeit-Übersetzung des Diagramms in **Python, JavaScript, C++, Java oder C#**.

### 3. Flussdiagramm Erstellen & Ausführen
*   **Blöcke Einfügen:** Klicken Sie auf einen der blauen Plus-Kreise (`+`) auf den Verbindungslinien. Diese vergrößern sich und leuchten auf. Wählen Sie die gewünschte Form aus.
*   **Blöcke Bearbeiten:** Doppelklicken Sie auf ein Element, um das Win32-Bearbeitungsfenster zu öffnen.
*   **Ausführungsmodi:**
    *   **Ausführen:** Kontinuierliche Ausführung des Programms.
    *   **Einzelschritt:** Schritt-für-Schritt-Fehlersuche mit Hervorhebung des aktiven Blocks.
    *   **Geschwindigkeit:** Schieberegler nach links für Zeitlupe, nach rechts für sofortige Ausführung.

### 4. Ausdrucksauswertung
*   Variablennamen sind **unabhängig von Groß- und Kleinschreibung** (case-insensitive).
*   Sowohl `=` als auch `==` werden in Bedingungen als Gleichheitsoperatoren gewertet.
*   Nutzen Sie `ToChar(13)` oder `"\n"`, um Zeilenumbrüche in Ausgabeblöcken einzufügen.

### 5. .fprg Importieren & Exportieren
*   **Öffnen:** Wählen Sie *Datei -> Öffnen...* oder das Ordnersymbol, um eine `.fprg`-Datei aus Flowgorithm zu laden.
*   **Speichern:** Wählen Sie *Datei -> Speichern* oder das Diskettensymbol, um eine kompatible `.fprg`-Datei herunterzuladen.

---

<a name="français"></a>
## Français (French Manual)

Bienvenue sur **Flowonline2**, un clone web fidèle à 1000 % du célèbre interpréteur pédagogique de logigrammes **Flowgorithm** (version Windows 2.0.3).

Développé par PiBOH sous licence MIT, cet applicatif statique apporte toute la puissance de Flowgorithm dans votre navigateur, sans configuration requise.

### 1. Interface Utilisateur
*   **Barre de Titre (Style Windows):** Émule une fenêtre classique avec le logo multicolore de Flowgorithm et des boutons de contrôle décoratifs.
*   **Barre de Menu:** Menus déroulants multilingues (*Fichier*, *Édition*, *Programme*, *Style & Couleur*, et *Disposition*).
*   **Barre d'Outils:** Raccourcis avec des boutons plats `32x32px`, curseur de vitesse et boutons de zoom.

### 2. Dispositions (Layouts)
Flowonline2 propose 5 dispositions d'écran MDI :
*   `🖥️` **Logigramme Uniquement:** Visualisation du diagramme en plein écran.
*   `📊` **Logigramme & Variables:** Écran partagé affichant le suivi des variables.
*   `💬` **Logigramme & Console:** Écran partagé affichant la console d'exécution.
*   `🚀` **Triple Split:** La disposition par défaut avec le logigramme à gauche, le suivi des variables en haut à droite, et la console en bas à droite.
*   `📝` **Logigramme & Code:** Traduction instantanée de l'algorithme en **Python, JavaScript, C++, Java, ou C#**.

### 3. Création et Exécution
*   **Insérer des Blocs:** Cliquez sur les cercles bleus `+` sur les lignes de liaison pour ouvrir le menu contextuel de sélection.
*   **Modifier des Blocs:** Double-cliquez sur n'importe quel bloc pour configurer ses paramètres.
*   **Exécution:**
    *   **Exécuter:** Lancement continu de l'algorithme.
    *   **Pas-à-pas:** Débogage visuel un bloc à la fois.
    *   **Vitesse:** Curseur à gauche pour ralentir, à droite pour l'exécution instantanée.

### 4. Règles d'Évaluation
*   Les variables sont **insensibles à la casse** (case-insensitive).
*   Dans les conditions, `=` et `==` représentent l'égalité logique.
*   Utilisez `ToChar(13)` ou `"\n"` pour insérer des retours à la ligne dans vos sorties.

### 5. Fichiers .fprg (Import & Export)
*   **Ouvrir:** Cliquez sur *Fichier -> Ouvrir...* pour importer un fichier XML `.fprg` d'origine.
*   **Enregistrer:** Enregistrez votre diagramme pour exporter un fichier `.fprg` compatible avec la version Windows de Flowgorithm.

---

<a name="español"></a>
## Español (Spanish Manual)

Bienvenido a **Flowonline2**, un clon web extraordinariamente fiel al 1000% del popular intérprete educativo de diagramas de flujo **Flowgorithm** (versión de Windows 2.0.3).

Desarrollado por PiBOH bajo la Licencia MIT, esta aplicación estática del lado del cliente lleva todo el potencial de Flowgorithm a cualquier navegador web, sin necesidad de configuración.

### 1. Interfaz de Usuario
*   **Barra de Título (Estilo Windows):** Emula una ventana clásica con el logotipo de 4 colores de Flowgorithm y botones de control decorativos.
*   **Barra de Menú:** Menús desplegables multilingües (*Archivo*, *Editar*, *Programa*, *Estilo & Color*, y *Disposición*).
*   **Barra de Herramientas:** Accesos directos con botones de `32x32px`, regulador de velocidad y controles de zoom.

### 2. Disposiciones (Layouts)
Flowonline2 cuenta con 5 configuraciones de ventana MDI:
*   `🖥️` **Solo Diagrama:** Vista de pantalla completa para su diagrama de flujo.
*   `📊` **Diagrama y Variables:** Pantalla dividida que muestra el watch de variables activas.
*   `💬` **Diagrama y Consola:** Pantalla dividida con la consola de entrada y salida.
*   `🚀` **Todo Junto (Triple Split):** La disposición predeterminada con el diagrama a la izquierda, el watch de variables arriba a la derecha, y la consola abajo a la derecha.
*   `📝` **Diagrama y Código:** Muestra la traducción instantánea de su algoritmo en **Python, JavaScript, C++, Java, o C#**.

### 3. Creación y Ejecución
*   **Insertar Bloques:** Haga clic en los círculos azules `+` sobre las líneas de conexión para desplegar el menú de selección de formas.
*   **Editar Bloques:** Doble clic sobre un bloque para abrir su ventana de propiedades.
*   **Ejecución:**
    *   **Ejecutar:** Ejecución continua del algoritmo.
    *   **Paso a paso:** Depuración visual bloque por bloque.
    *   **Velocidad:** Deslice a la izquierda para ralentizar, y a la derecha para ejecución instantánea.

### 4. Reglas del Evaluador
*   Las variables son **insensibles a mayúsculas y minúsculas** (case-insensitive).
*   En las condiciones, tanto `=` como `==` representan la igualdad lógica.
*   Use `ToChar(13)` o `"\n"` para realizar saltos de línea dentro de los bloques de salida.

### 5. Compatibilidad .fprg
*   **Abrir:** Seleccione *Archivo -> Abrir...* para cargar un archivo `.fprg` generado en su computadora.
*   **Guardar:** Guarde su diagrama para descargar un archivo XML `.fprg` listo para ser abierto en la aplicación original de Windows.
