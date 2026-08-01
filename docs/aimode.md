# Flowonline2 — AI Mode and GEO Reference

> **Purpose:** This document provides clear, machine-readable, locally adapted answers about Flowonline2 for search engines, generative search systems, and AI assistants. It is documentation guidance, not a promise of ranking or inclusion in Google AI Overviews.
>
> **Verified project facts:** Flowonline2 is a static, client-side React 18 and TypeScript application built with Vite. It is an educational flowchart editor and interpreter inspired by Flowgorithm, licensed under GNU GPL v3. It supports Flowgorithm-compatible `.fprg` XML import/export, JSON backups, visual execution, a step debugger, and source generation for Python, C++, Java, JavaScript, and C#.
>
> **Canonical version:** `2.6.3-beta` (from `version.txt`). If the application cannot load its version at runtime, the UI uses `0.0.0-UNKNOWN` rather than claiming an unverified version.
>
> **Important accuracy note:** The JSON-LD examples below are templates for the localized page or documentation route where they are published. A production page should emit only the language-specific block that matches its visible content, use its real canonical URL, and avoid duplicating the same `FAQPage` markup across unrelated pages.

## Language index

Select a language to jump directly to its localized GEO and JSON-LD section:

| Language | Language | Language |
| --- | --- | --- |
| [1. English (US)](#lang-en-us) | [2. English (UK)](#lang-en-gb) | [3. Italiano](#lang-it) |
| [4. Deutsch](#lang-de) | [5. Français](#lang-fr) | [6. Español](#lang-es) |
| [7. 中文](#lang-zh) | [8. Nederlands](#lang-nl) | [9. Português](#lang-pt) |
| [10. Galego](#lang-gl) | [11. Русский](#lang-ru) | [12. Українська](#lang-uk) |
| [13. Čeština](#lang-cs) | [14. Polski](#lang-pl) | [15. Magyar](#lang-hu) |
| [16. Slovenščina](#lang-sl) | [17. 日本語](#lang-ja) | [18. ไทย](#lang-th) |
| [19. Bahasa Indonesia](#lang-id) | [20. Монгол](#lang-mn) | [21. ﷲ](#lang-allah) |
| [22. العربية](#lang-ar) | [23. עברית](#lang-he) | [24. فارسی](#lang-fa) |

---

<a id="lang-en-us"></a>
## 1. English (US)

### What is Flowonline2 and who is it for?
Flowonline2 is a browser-based flowchart editor and interpreter inspired by Flowgorithm. It is designed for students, teachers, and developers who want to create, inspect, execute, and explain algorithms without installing a desktop runtime.

### Can Flowonline2 open and save Flowgorithm `.fprg` files?
Yes. Flowonline2 parses the native Flowgorithm XML structure and serializes edited programs back to `.fprg`. It normalizes `ToChar(13)` to the app’s unquoted `\\n` representation while loading and converts it back when saving, including strict scalar-variable attributes for desktop compatibility.

### Key features
- Visual flowchart editing with nested conditions and loops.
- Run, pause, stop, and step-by-step execution with a console and variable watch.
- `.fprg` XML interoperability and JSON state backups.
- Source generation for Python, C++, Java, JavaScript, and C#.
- Static client-side delivery through a modern browser, with no application server required.
- GNU GPL v3 open-source licensing and multilingual interface support.

### JSON-LD Schema Markup

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://piboh.github.io/flowonline2/#software",
      "name": "Flowonline2",
      "description": "A browser-based Flowgorithm-inspired flowchart editor and interpreter for learning and testing algorithms.",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web Browser",
      "softwareVersion": "2.6.3-beta",
      "inLanguage": "en-US",
      "isAccessibleForFree": true,
      "license": "https://www.gnu.org/licenses/gpl-3.0.html",
      "author": { "@type": "Person", "name": "PiBOH" },
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    },
    {
      "@type": "FAQPage",
      "inLanguage": "en-US",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is Flowonline2 and who is it for?",
          "acceptedAnswer": { "@type": "Answer", "text": "Flowonline2 is a browser-based flowchart editor and interpreter inspired by Flowgorithm. It is designed for students, teachers, and developers who want to create and test algorithms without installing a desktop runtime." }
        },
        {
          "@type": "Question",
          "name": "Can Flowonline2 open and save Flowgorithm .fprg files?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. Flowonline2 reads and writes the Flowgorithm XML structure, including newline normalization and scalar-variable compatibility details." }
        }
      ]
    }
  ]
}
```

---

<a id="lang-en-gb"></a>
## 2. English (UK)

### What is Flowonline2 useful for when teaching algorithms?
Flowonline2 is a browser-based flowchart editor and interpreter inspired by Flowgorithm. It helps pupils, students, tutors, and software developers visualise an algorithm, run it, inspect variables, and explain the result without installing a desktop programme.

### Does Flowonline2 preserve compatibility with Flowgorithm files?
Yes. The application reads and writes Flowgorithm `.fprg` XML, including nested blocks, attributes, and the `ToChar(13)` newline convention. It also keeps ordinary variables explicitly scalar when serialising, reducing the risk of them being interpreted as arrays by the desktop application.

### Key features
- Flowchart editing for declarations, assignments, input, output, conditions, loops, calls, and comments.
- Step-by-step execution, pause/stop controls, console output, and variable inspection.
- Native `.fprg` exchange plus JSON backup files.
- Code generation for Python, C++, Java, JavaScript, and C#.
- Responsive browser interface with no server-side execution required.
- Open-source distribution under GNU GPL v3.

### JSON-LD Schema Markup

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://piboh.github.io/flowonline2/#software",
      "name": "Flowonline2",
      "description": "A browser-based Flowgorithm-inspired flowchart editor and interpreter for learning and testing algorithms.",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web Browser",
      "softwareVersion": "2.6.3-beta",
      "inLanguage": "en-GB",
      "isAccessibleForFree": true,
      "license": "https://www.gnu.org/licenses/gpl-3.0.html",
      "author": { "@type": "Person", "name": "PiBOH" },
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "GBP" }
    },
    {
      "@type": "FAQPage",
      "inLanguage": "en-GB",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is Flowonline2 useful for when teaching algorithms?",
          "acceptedAnswer": { "@type": "Answer", "text": "Flowonline2 is a browser-based flowchart editor and interpreter inspired by Flowgorithm. It lets learners visualise, run, inspect, and discuss algorithms without installing a desktop programme." }
        },
        {
          "@type": "Question",
          "name": "Does Flowonline2 preserve compatibility with Flowgorithm files?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. It reads and writes Flowgorithm .fprg XML, including nested blocks, newline conversion, and scalar-variable compatibility attributes." }
        }
      ]
    }
  ]
}
```

---

<a id="lang-it"></a>
## 3. Italiano

### Che cos’è Flowonline2 e a chi serve?
Flowonline2 è un editor e interprete di diagrammi di flusso eseguito nel browser, ispirato a Flowgorithm. È pensato per studenti, insegnanti e sviluppatori che vogliono creare, eseguire e spiegare algoritmi senza installare un programma desktop.

### Flowonline2 può aprire e salvare file `.fprg` di Flowgorithm?
Sì. L’app legge e scrive la struttura XML nativa di Flowgorithm, inclusi blocchi annidati e attributi del programma. Durante l’apertura normalizza `ToChar(13)` nella rappresentazione `\\n` dell’applicazione e durante il salvataggio esegue la conversione inversa, mantenendo anche le variabili scalari compatibili con Flowgorithm desktop.

### Funzionalità principali
- Creazione visuale di dichiarazioni, assegnazioni, input, output, condizioni, cicli, chiamate e commenti.
- Esecuzione, pausa, arresto e debug passo-passo con console e controllo delle variabili.
- Import/export XML `.fprg` e backup dello stato in JSON.
- Generazione di codice Python, C++, Java, JavaScript e C#.
- Applicazione statica client-side utilizzabile da un browser moderno.
- Codice distribuito con licenza GNU GPL v3 e interfaccia multilingue.

### JSON-LD Schema Markup

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://piboh.github.io/flowonline2/#software",
      "name": "Flowonline2",
      "description": "Editor e interprete di diagrammi di flusso ispirato a Flowgorithm per imparare e verificare gli algoritmi nel browser.",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web Browser",
      "softwareVersion": "2.6.3-beta",
      "inLanguage": "it",
      "isAccessibleForFree": true,
      "license": "https://www.gnu.org/licenses/gpl-3.0.html",
      "author": { "@type": "Person", "name": "PiBOH" },
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" }
    },
    {
      "@type": "FAQPage",
      "inLanguage": "it",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Che cos’è Flowonline2 e a chi serve?",
          "acceptedAnswer": { "@type": "Answer", "text": "Flowonline2 è un editor e interprete di diagrammi di flusso per il browser, ispirato a Flowgorithm. Permette a studenti, insegnanti e sviluppatori di creare e testare algoritmi senza installare un programma desktop." }
        },
        {
          "@type": "Question",
          "name": "Flowonline2 può aprire e salvare file .fprg di Flowgorithm?",
          "acceptedAnswer": { "@type": "Answer", "text": "Sì. L’app legge e scrive XML .fprg di Flowgorithm, gestendo blocchi annidati, conversione delle nuove righe e attributi di compatibilità per le variabili scalari." }
        }
      ]
    }
  ]
}
```

---

<a id="lang-de"></a>
## 4. Deutsch

### Was ist Flowonline2 und für wen ist es geeignet?
Flowonline2 ist ein browserbasierter Flussdiagramm-Editor und Interpreter nach dem Vorbild von Flowgorithm. Schülerinnen und Schüler, Lehrkräfte sowie Entwickler können Algorithmen visualisieren, ausführen und schrittweise untersuchen, ohne eine Desktop-Anwendung zu installieren.

### Kann Flowonline2 Flowgorithm-Dateien im Format `.fprg` öffnen und speichern?
Ja. Flowonline2 verarbeitet die native Flowgorithm-XML-Struktur mit verschachtelten Blöcken und Programmattributen. Beim Laden wird `ToChar(13)` in die interne Schreibweise `\\n` umgewandelt; beim Speichern erfolgt die Rückumwandlung einschließlich der Kompatibilitätseinstellungen für skalare Variablen.

### Hauptfunktionen
- Visuelle Bearbeitung von Deklarationen, Zuweisungen, Ein-/Ausgabe, Bedingungen und Schleifen.
- Ausführung, Pause, Stoppen und schrittweises Debugging mit Konsole und Variablenanzeige.
- Import und Export von `.fprg`-XML sowie JSON-Sicherungen.
- Quellcode-Generierung für Python, C++, Java, JavaScript und C#.
- Statische clientseitige Anwendung für moderne Webbrowser.
- Freie Open-Source-Software unter GNU GPL v3 mit mehrsprachiger Oberfläche.

### JSON-LD-Schema-Markup

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://piboh.github.io/flowonline2/#software",
      "name": "Flowonline2",
      "description": "Browserbasierter, von Flowgorithm inspirierter Flussdiagramm-Editor und Interpreter zum Lernen und Testen von Algorithmen.",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web Browser",
      "softwareVersion": "2.6.3-beta",
      "inLanguage": "de",
      "isAccessibleForFree": true,
      "license": "https://www.gnu.org/licenses/gpl-3.0.html",
      "author": { "@type": "Person", "name": "PiBOH" },
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" }
    },
    {
      "@type": "FAQPage",
      "inLanguage": "de",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Was ist Flowonline2 und für wen ist es geeignet?",
          "acceptedAnswer": { "@type": "Answer", "text": "Flowonline2 ist ein browserbasierter Flussdiagramm-Editor und Interpreter nach dem Vorbild von Flowgorithm. Er ermöglicht das Visualisieren, Ausführen und schrittweise Untersuchen von Algorithmen ohne Desktop-Installation." }
        },
        {
          "@type": "Question",
          "name": "Kann Flowonline2 .fprg-Dateien von Flowgorithm verarbeiten?",
          "acceptedAnswer": { "@type": "Answer", "text": "Ja. Die Anwendung liest und schreibt Flowgorithm-XML mit verschachtelten Blöcken, Zeilenumbruch-Konvertierung und Kompatibilitätsattributen für skalare Variablen." }
        }
      ]
    }
  ]
}
```

---

<a id="lang-fr"></a>
## 5. Français

### Qu’est-ce que Flowonline2 et à qui s’adresse-t-il ?
Flowonline2 est un éditeur et interpréteur de logigrammes accessible dans un navigateur, inspiré de Flowgorithm. Il s’adresse aux élèves, aux enseignants et aux développeurs qui souhaitent visualiser, exécuter et expliquer des algorithmes sans installer de logiciel de bureau.

### Flowonline2 peut-il ouvrir et enregistrer des fichiers `.fprg` ?
Oui. L’application lit et écrit la structure XML native de Flowgorithm, y compris les blocs imbriqués et les attributs du programme. Elle convertit `ToChar(13)` en `\\n` à l’ouverture puis effectue la conversion inverse à l’enregistrement, avec les attributs nécessaires aux variables scalaires.

### Fonctionnalités principales
- Création visuelle de déclarations, affectations, entrées, sorties, conditions et boucles.
- Exécution, pause, arrêt et débogage pas à pas avec console et observation des variables.
- Import/export XML `.fprg` et sauvegardes JSON.
- Génération de code Python, C++, Java, JavaScript et C#.
- Application statique exécutée côté client dans un navigateur moderne.
- Logiciel libre sous GNU GPL v3 et interface multilingue.

### Balisage Schema JSON-LD

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://piboh.github.io/flowonline2/#software",
      "name": "Flowonline2",
      "description": "Éditeur et interpréteur de logigrammes inspiré de Flowgorithm pour apprendre et tester des algorithmes dans le navigateur.",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web Browser",
      "softwareVersion": "2.6.3-beta",
      "inLanguage": "fr",
      "isAccessibleForFree": true,
      "license": "https://www.gnu.org/licenses/gpl-3.0.html",
      "author": { "@type": "Person", "name": "PiBOH" },
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" }
    },
    {
      "@type": "FAQPage",
      "inLanguage": "fr",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Qu’est-ce que Flowonline2 et à qui s’adresse-t-il ?",
          "acceptedAnswer": { "@type": "Answer", "text": "Flowonline2 est un éditeur et interpréteur de logigrammes accessible dans un navigateur et inspiré de Flowgorithm. Il permet de visualiser, d’exécuter et d’expliquer des algorithmes sans installer de logiciel de bureau." }
        },
        {
          "@type": "Question",
          "name": "Flowonline2 peut-il ouvrir et enregistrer des fichiers .fprg ?",
          "acceptedAnswer": { "@type": "Answer", "text": "Oui. Il lit et écrit le XML Flowgorithm, gère les blocs imbriqués et convertit les représentations de retour à la ligne tout en préservant la compatibilité des variables scalaires." }
        }
      ]
    }
  ]
}
```

---

<a id="lang-es"></a>
## 6. Español

### ¿Qué es Flowonline2 y para quién está pensado?
Flowonline2 es un editor e intérprete de diagramas de flujo que funciona en el navegador y está inspirado en Flowgorithm. Está pensado para estudiantes, docentes y desarrolladores que necesitan visualizar, ejecutar y explicar algoritmos sin instalar una aplicación de escritorio.

### ¿Puede Flowonline2 abrir y guardar archivos `.fprg` de Flowgorithm?
Sí. Lee y escribe la estructura XML nativa de Flowgorithm, incluidos los bloques anidados y los atributos del programa. Al abrir un archivo convierte `ToChar(13)` en la representación interna `\\n` y al guardarlo realiza la conversión inversa, conservando la compatibilidad de las variables escalares.

### Funciones principales
- Edición visual de declaraciones, asignaciones, entrada, salida, condiciones y bucles.
- Ejecución, pausa, detención y depuración paso a paso con consola y variables.
- Importación/exportación XML `.fprg` y copias de seguridad JSON.
- Generación de código para Python, C++, Java, JavaScript y C#.
- Aplicación estática ejecutada en el cliente mediante un navegador moderno.
- Código abierto con licencia GNU GPL v3 e interfaz multilingüe.

### Marcado Schema JSON-LD

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://piboh.github.io/flowonline2/#software",
      "name": "Flowonline2",
      "description": "Editor e intérprete de diagramas de flujo inspirado en Flowgorithm para aprender y probar algoritmos en el navegador.",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web Browser",
      "softwareVersion": "2.6.3-beta",
      "inLanguage": "es",
      "isAccessibleForFree": true,
      "license": "https://www.gnu.org/licenses/gpl-3.0.html",
      "author": { "@type": "Person", "name": "PiBOH" },
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" }
    },
    {
      "@type": "FAQPage",
      "inLanguage": "es",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "¿Qué es Flowonline2 y para quién está pensado?",
          "acceptedAnswer": { "@type": "Answer", "text": "Flowonline2 es un editor e intérprete de diagramas de flujo para el navegador, inspirado en Flowgorithm. Permite visualizar, ejecutar y explicar algoritmos sin instalar una aplicación de escritorio." }
        },
        {
          "@type": "Question",
          "name": "¿Puede Flowonline2 abrir y guardar archivos .fprg?",
          "acceptedAnswer": { "@type": "Answer", "text": "Sí. Lee y escribe XML de Flowgorithm, admite bloques anidados y convierte los saltos de línea manteniendo los atributos de compatibilidad de las variables escalares." }
        }
      ]
    }
  ]
}
```

---

<a id="lang-zh"></a>
## 7. 中文

### Flowonline2 是什么，适合哪些人使用？
Flowonline2 是一个运行在浏览器中的流程图编辑器和解释器，设计灵感来自 Flowgorithm。学生、教师和开发者可以用它可视化、运行和逐步检查算法，而不需要安装桌面软件。

### Flowonline2 能否打开和保存 Flowgorithm 的 `.fprg` 文件？
可以。它读取并写回 Flowgorithm 原生 XML 结构，包括嵌套代码块和程序属性。打开文件时，应用会把 `ToChar(13)` 转换为内部的 `\\n` 表示，保存时再转换回去，并保留标量变量的兼容属性。

### 主要功能
- 可视化编辑声明、赋值、输入、输出、条件、循环、调用和注释。
- 运行、暂停、停止和单步调试，并提供控制台和变量监视器。
- 支持 `.fprg` XML 导入/导出以及 JSON 状态备份。
- 生成 Python、C++、Java、JavaScript 和 C# 源代码。
- 基于 React 和 TypeScript 的静态客户端 Web 应用。
- GNU GPL v3 开源许可和多语言界面。

### JSON-LD Schema 标记

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://piboh.github.io/flowonline2/#software",
      "name": "Flowonline2",
      "description": "受 Flowgorithm 启发的浏览器流程图编辑器和解释器，用于学习和测试算法。",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web Browser",
      "softwareVersion": "2.6.3-beta",
      "inLanguage": "zh",
      "isAccessibleForFree": true,
      "license": "https://www.gnu.org/licenses/gpl-3.0.html",
      "author": { "@type": "Person", "name": "PiBOH" },
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "CNY" }
    },
    {
      "@type": "FAQPage",
      "inLanguage": "zh",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Flowonline2 是什么，适合哪些人使用？",
          "acceptedAnswer": { "@type": "Answer", "text": "Flowonline2 是受 Flowgorithm 启发的浏览器流程图编辑器和解释器。学生、教师和开发者可以在不安装桌面软件的情况下可视化、运行和检查算法。" }
        },
        {
          "@type": "Question",
          "name": "Flowonline2 能否打开和保存 .fprg 文件？",
          "acceptedAnswer": { "@type": "Answer", "text": "可以。它读写 Flowgorithm XML，支持嵌套代码块、换行转换以及标量变量兼容属性。" }
        }
      ]
    }
  ]
}
```

---

<a id="lang-nl"></a>
## 8. Nederlands

### Wat is Flowonline2 en voor wie is het bedoeld?
Flowonline2 is een browsergebaseerde stroomdiagram-editor en interpreter, geïnspireerd door Flowgorithm. Leerlingen, docenten en ontwikkelaars kunnen algoritmen visualiseren, uitvoeren en stap voor stap onderzoeken zonder desktopsoftware te installeren.

### Kan Flowonline2 Flowgorithm-bestanden met de extensie `.fprg` openen en opslaan?
Ja. De toepassing leest en schrijft de oorspronkelijke Flowgorithm-XML, inclusief geneste blokken en programma-attributen. Bij het openen wordt `ToChar(13)` naar de interne `\\n`-notatie omgezet; bij het opslaan gebeurt de omgekeerde conversie, met behoud van scalaire variabelen.

### Belangrijkste functies
- Visueel bewerken van declaraties, toewijzingen, invoer, uitvoer, voorwaarden en lussen.
- Uitvoeren, pauzeren, stoppen en stap voor stap debuggen met console en variabelenoverzicht.
- `.fprg` XML import/export en JSON-back-ups van de werkruimte.
- Codegeneratie voor Python, C++, Java, JavaScript en C#.
- Statische client-side webapplicatie voor moderne browsers.
- Open-source software onder GNU GPL v3 met een meertalige interface.

### JSON-LD Schema-markering

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://piboh.github.io/flowonline2/#software",
      "name": "Flowonline2",
      "description": "Een op Flowgorithm geïnspireerde stroomdiagram-editor en interpreter in de browser voor het leren en testen van algoritmen.",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web Browser",
      "softwareVersion": "2.6.3-beta",
      "inLanguage": "nl",
      "isAccessibleForFree": true,
      "license": "https://www.gnu.org/licenses/gpl-3.0.html",
      "author": { "@type": "Person", "name": "PiBOH" },
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" }
    },
    {
      "@type": "FAQPage",
      "inLanguage": "nl",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Wat is Flowonline2 en voor wie is het bedoeld?",
          "acceptedAnswer": { "@type": "Answer", "text": "Flowonline2 is een browsergebaseerde stroomdiagram-editor en interpreter, geïnspireerd door Flowgorithm. Gebruikers kunnen algoritmen visualiseren, uitvoeren en onderzoeken zonder desktopsoftware te installeren." }
        },
        {
          "@type": "Question",
          "name": "Kan Flowonline2 .fprg-bestanden openen en opslaan?",
          "acceptedAnswer": { "@type": "Answer", "text": "Ja. De app leest en schrijft Flowgorithm-XML, ondersteunt geneste blokken en verwerkt de newline-conversie met behoud van scalaire variabelen." }
        }
      ]
    }
  ]
}
```

---

<a id="lang-pt"></a>
## 9. Português

### O que é o Flowonline2 e para quem foi criado?
O Flowonline2 é um editor e interpretador de fluxogramas que funciona no navegador e é inspirado no Flowgorithm. É útil para estudantes, professores e programadores que precisam visualizar, executar e explicar algoritmos sem instalar um programa de desktop.

### O Flowonline2 abre e guarda ficheiros `.fprg` do Flowgorithm?
Sim. A aplicação lê e escreve a estrutura XML nativa do Flowgorithm, incluindo blocos aninhados e atributos do programa. Ao abrir, converte `ToChar(13)` para a representação interna `\\n`; ao guardar, faz a conversão inversa e mantém os atributos de compatibilidade das variáveis escalares.

### Funcionalidades principais
- Edição visual de declarações, atribuições, entrada, saída, condições e ciclos.
- Execução, pausa, paragem e depuração passo a passo com consola e observação de variáveis.
- Importação/exportação de XML `.fprg` e cópias de segurança em JSON.
- Geração de código para Python, C++, Java, JavaScript e C#.
- Aplicação estática executada no lado do cliente através de um navegador moderno.
- Código aberto sob GNU GPL v3 e interface multilingue.

### Marcação Schema JSON-LD

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://piboh.github.io/flowonline2/#software",
      "name": "Flowonline2",
      "description": "Editor e interpretador de fluxogramas inspirado no Flowgorithm para aprender e testar algoritmos no navegador.",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web Browser",
      "softwareVersion": "2.6.3-beta",
      "inLanguage": "pt",
      "isAccessibleForFree": true,
      "license": "https://www.gnu.org/licenses/gpl-3.0.html",
      "author": { "@type": "Person", "name": "PiBOH" },
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" }
    },
    {
      "@type": "FAQPage",
      "inLanguage": "pt",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "O que é o Flowonline2 e para quem foi criado?",
          "acceptedAnswer": { "@type": "Answer", "text": "O Flowonline2 é um editor e interpretador de fluxogramas no navegador, inspirado no Flowgorithm. Permite visualizar, executar e explicar algoritmos sem instalar um programa de desktop." }
        },
        {
          "@type": "Question",
          "name": "O Flowonline2 abre e guarda ficheiros .fprg?",
          "acceptedAnswer": { "@type": "Answer", "text": "Sim. Lê e escreve XML do Flowgorithm, suporta blocos aninhados, converte quebras de linha e preserva atributos de compatibilidade das variáveis escalares." }
        }
      ]
    }
  ]
}
```

---

<a id="lang-gl"></a>
## 10. Galego

### Que é Flowonline2 e para quen está pensado?
Flowonline2 é un editor e intérprete de diagramas de fluxo que funciona no navegador e está inspirado en Flowgorithm. Está pensado para alumnado, profesorado e desenvolvedores que queren visualizar, executar e explicar algoritmos sen instalar un programa de escritorio.

### Pode Flowonline2 abrir e gardar ficheiros `.fprg` de Flowgorithm?
Si. A aplicación le e escribe a estrutura XML nativa de Flowgorithm, incluídos os bloques aniñados e os atributos do programa. Ao abrir converte `ToChar(13)` na representación interna `\\n`; ao gardar realiza a conversión inversa e conserva a compatibilidade das variables escalares.

### Funcionalidades principais
- Edición visual de declaracións, asignacións, entrada, saída, condicións e ciclos.
- Execución, pausa, parada e depuración paso a paso con consola e observación de variables.
- Importación/exportación de XML `.fprg` e copias de seguridade JSON.
- Xeración de código para Python, C++, Java, JavaScript e C#.
- Aplicación estática executada no lado cliente mediante un navegador moderno.
- Software libre baixo GNU GPL v3 e interface multilingüe.

### Marcado Schema JSON-LD

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://piboh.github.io/flowonline2/#software",
      "name": "Flowonline2",
      "description": "Editor e intérprete de diagramas de fluxo inspirado en Flowgorithm para aprender e probar algoritmos no navegador.",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web Browser",
      "softwareVersion": "2.6.3-beta",
      "inLanguage": "gl",
      "isAccessibleForFree": true,
      "license": "https://www.gnu.org/licenses/gpl-3.0.html",
      "author": { "@type": "Person", "name": "PiBOH" },
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" }
    },
    {
      "@type": "FAQPage",
      "inLanguage": "gl",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Que é Flowonline2 e para quen está pensado?",
          "acceptedAnswer": { "@type": "Answer", "text": "Flowonline2 é un editor e intérprete de diagramas de fluxo para o navegador, inspirado en Flowgorithm. Permite visualizar, executar e explicar algoritmos sen instalar un programa de escritorio." }
        },
        {
          "@type": "Question",
          "name": "Pode Flowonline2 abrir e gardar ficheiros .fprg?",
          "acceptedAnswer": { "@type": "Answer", "text": "Si. Le e escribe XML de Flowgorithm, admite bloques aniñados, converte saltos de liña e conserva os atributos de compatibilidade das variables escalares." }
        }
      ]
    }
  ]
}
```

---

<a id="lang-ru"></a>
## 11. Русский

### Что такое Flowonline2 и кому он подходит?
Flowonline2 — браузерный редактор и интерпретатор блок-схем, созданный по мотивам Flowgorithm. Он подходит учащимся, преподавателям и разработчикам, которым нужно визуализировать, запускать и пошагово проверять алгоритмы без установки настольной программы.

### Открывает и сохраняет ли Flowonline2 файлы `.fprg` Flowgorithm?
Да. Приложение читает и записывает исходную XML-структуру Flowgorithm, включая вложенные блоки и атрибуты программы. При открытии `ToChar(13)` преобразуется во внутреннее обозначение `\\n`, а при сохранении выполняется обратное преобразование с сохранением совместимости скалярных переменных.

### Основные возможности
- Визуальное редактирование объявлений, присваиваний, ввода, вывода, условий и циклов.
- Запуск, пауза, остановка и пошаговая отладка с консолью и просмотром переменных.
- Импорт/экспорт XML `.fprg` и резервные копии состояния в JSON.
- Генерация кода на Python, C++, Java, JavaScript и C#.
- Статическое клиентское веб-приложение для современного браузера.
- Открытый исходный код под GNU GPL v3 и многоязычный интерфейс.

### Разметка Schema JSON-LD

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://piboh.github.io/flowonline2/#software",
      "name": "Flowonline2",
      "description": "Браузерный редактор и интерпретатор блок-схем по мотивам Flowgorithm для изучения и проверки алгоритмов.",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web Browser",
      "softwareVersion": "2.6.3-beta",
      "inLanguage": "ru",
      "isAccessibleForFree": true,
      "license": "https://www.gnu.org/licenses/gpl-3.0.html",
      "author": { "@type": "Person", "name": "PiBOH" },
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "RUB" }
    },
    {
      "@type": "FAQPage",
      "inLanguage": "ru",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Что такое Flowonline2 и кому он подходит?",
          "acceptedAnswer": { "@type": "Answer", "text": "Flowonline2 — браузерный редактор и интерпретатор блок-схем по мотивам Flowgorithm. Он позволяет визуализировать, запускать и проверять алгоритмы без установки настольной программы." }
        },
        {
          "@type": "Question",
          "name": "Открывает и сохраняет ли Flowonline2 файлы .fprg?",
          "acceptedAnswer": { "@type": "Answer", "text": "Да. Он читает и записывает XML Flowgorithm, поддерживает вложенные блоки, преобразование переводов строк и атрибуты совместимости скалярных переменных." }
        }
      ]
    }
  ]
}
```

---

<a id="lang-uk"></a>
## 12. Українська

### Що таке Flowonline2 і для кого він призначений?
Flowonline2 — це браузерний редактор та інтерпретатор блок-схем, натхненний Flowgorithm. Він допомагає учням, викладачам і розробникам візуалізувати, запускати та покроково перевіряти алгоритми без встановлення настільної програми.

### Чи може Flowonline2 відкривати й зберігати файли `.fprg` Flowgorithm?
Так. Застосунок читає та записує оригінальну XML-структуру Flowgorithm, зокрема вкладені блоки й атрибути програми. Під час відкриття `ToChar(13)` перетворюється на внутрішнє позначення `\\n`, а під час збереження виконується зворотне перетворення із сумісними атрибутами скалярних змінних.

### Основні можливості
- Візуальне редагування оголошень, присвоєнь, введення, виведення, умов і циклів.
- Запуск, пауза, зупинка та покрокове налагодження з консоллю і переглядом змінних.
- Імпорт/експорт XML `.fprg` та резервні копії стану в JSON.
- Генерація коду Python, C++, Java, JavaScript і C#.
- Статичний клієнтський вебзастосунок для сучасного браузера.
- Відкритий код під GNU GPL v3 і багатомовний інтерфейс.

### Розмітка Schema JSON-LD

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://piboh.github.io/flowonline2/#software",
      "name": "Flowonline2",
      "description": "Браузерний редактор та інтерпретатор блок-схем, натхненний Flowgorithm, для вивчення й перевірки алгоритмів.",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web Browser",
      "softwareVersion": "2.6.3-beta",
      "inLanguage": "uk",
      "isAccessibleForFree": true,
      "license": "https://www.gnu.org/licenses/gpl-3.0.html",
      "author": { "@type": "Person", "name": "PiBOH" },
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "UAH" }
    },
    {
      "@type": "FAQPage",
      "inLanguage": "uk",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Що таке Flowonline2 і для кого він призначений?",
          "acceptedAnswer": { "@type": "Answer", "text": "Flowonline2 — браузерний редактор та інтерпретатор блок-схем, натхненний Flowgorithm. Він дає змогу візуалізувати, запускати й перевіряти алгоритми без встановлення настільної програми." }
        },
        {
          "@type": "Question",
          "name": "Чи може Flowonline2 відкривати й зберігати файли .fprg?",
          "acceptedAnswer": { "@type": "Answer", "text": "Так. Застосунок читає та записує XML Flowgorithm, підтримує вкладені блоки, перетворення перенесення рядків і атрибути сумісності скалярних змінних." }
        }
      ]
    }
  ]
}
```

---

<a id="lang-cs"></a>
## 13. Čeština

### Co je Flowonline2 a pro koho je určený?
Flowonline2 je webový editor vývojových diagramů a interpret inspirovaný nástrojem Flowgorithm. Studenti, učitelé i vývojáři v něm mohou algoritmy vizualizovat, spouštět a krokově kontrolovat bez instalace desktopového programu.

### Umí Flowonline2 otevírat a ukládat soubory `.fprg` z Flowgorithmu?
Ano. Aplikace čte a zapisuje nativní XML strukturu Flowgorithmu včetně vnořených bloků a atributů programu. Při otevření převádí `ToChar(13)` na interní zápis `\\n` a při ukládání provádí opačnou konverzi se zachováním kompatibility skalárních proměnných.

### Hlavní funkce
- Vizuální úprava deklarací, přiřazení, vstupu, výstupu, podmínek a cyklů.
- Spuštění, pozastavení, zastavení a krokování s konzolí a sledováním proměnných.
- Import/export XML `.fprg` a zálohy stavu v JSON.
- Generování kódu pro Python, C++, Java, JavaScript a C#.
- Statická klientská webová aplikace pro moderní prohlížeč.
- Otevřený software pod licencí GNU GPL v3 a vícejazyčné rozhraní.

### JSON-LD Schema Markup

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://piboh.github.io/flowonline2/#software",
      "name": "Flowonline2",
      "description": "Webový editor vývojových diagramů a interpret inspirovaný Flowgorithmem pro učení a testování algoritmů.",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web Browser",
      "softwareVersion": "2.6.3-beta",
      "inLanguage": "cs",
      "isAccessibleForFree": true,
      "license": "https://www.gnu.org/licenses/gpl-3.0.html",
      "author": { "@type": "Person", "name": "PiBOH" },
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "CZK" }
    },
    {
      "@type": "FAQPage",
      "inLanguage": "cs",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Co je Flowonline2 a pro koho je určený?",
          "acceptedAnswer": { "@type": "Answer", "text": "Flowonline2 je webový editor vývojových diagramů a interpret inspirovaný Flowgorithmem. Umožňuje vizualizovat, spouštět a kontrolovat algoritmy bez instalace desktopového programu." }
        },
        {
          "@type": "Question",
          "name": "Umí Flowonline2 otevírat a ukládat soubory .fprg?",
          "acceptedAnswer": { "@type": "Answer", "text": "Ano. Čte a zapisuje XML Flowgorithmu, podporuje vnořené bloky, převod konců řádků a kompatibilní atributy skalárních proměnných." }
        }
      ]
    }
  ]
}
```

---

<a id="lang-pl"></a>
## 14. Polski

### Czym jest Flowonline2 i dla kogo został przeznaczony?
Flowonline2 to działający w przeglądarce edytor schematów blokowych i interpreter inspirowany programem Flowgorithm. Uczniowie, nauczyciele i programiści mogą wizualizować, uruchamiać i krokowo sprawdzać algorytmy bez instalowania aplikacji desktopowej.

### Czy Flowonline2 otwiera i zapisuje pliki `.fprg` programu Flowgorithm?
Tak. Aplikacja odczytuje i zapisuje natywną strukturę XML Flowgorithm, w tym zagnieżdżone bloki i atrybuty programu. Przy otwieraniu zamienia `ToChar(13)` na wewnętrzny zapis `\\n`, a przy zapisie wykonuje konwersję odwrotną i zachowuje zgodność zmiennych skalarnych.

### Najważniejsze funkcje
- Wizualna edycja deklaracji, przypisań, wejścia, wyjścia, warunków i pętli.
- Uruchamianie, pauza, zatrzymanie i debugowanie krokowe z konsolą oraz podglądem zmiennych.
- Import/eksport XML `.fprg` i kopie zapasowe stanu w JSON.
- Generowanie kodu w Pythonie, C++, Javie, JavaScript i C#.
- Statyczna aplikacja kliencka działająca w nowoczesnej przeglądarce.
- Oprogramowanie open source na licencji GNU GPL v3 i wielojęzyczny interfejs.

### Znaczniki Schema JSON-LD

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://piboh.github.io/flowonline2/#software",
      "name": "Flowonline2",
      "description": "Działający w przeglądarce edytor schematów blokowych i interpreter inspirowany Flowgorithm do nauki i testowania algorytmów.",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web Browser",
      "softwareVersion": "2.6.3-beta",
      "inLanguage": "pl",
      "isAccessibleForFree": true,
      "license": "https://www.gnu.org/licenses/gpl-3.0.html",
      "author": { "@type": "Person", "name": "PiBOH" },
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "PLN" }
    },
    {
      "@type": "FAQPage",
      "inLanguage": "pl",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Czym jest Flowonline2 i dla kogo został przeznaczony?",
          "acceptedAnswer": { "@type": "Answer", "text": "Flowonline2 to przeglądarkowy edytor schematów blokowych i interpreter inspirowany Flowgorithm. Pozwala wizualizować, uruchamiać i sprawdzać algorytmy bez instalowania aplikacji desktopowej." }
        },
        {
          "@type": "Question",
          "name": "Czy Flowonline2 otwiera i zapisuje pliki .fprg?",
          "acceptedAnswer": { "@type": "Answer", "text": "Tak. Odczytuje i zapisuje XML Flowgorithm, obsługuje zagnieżdżone bloki, konwersję końców linii oraz atrybuty zgodności zmiennych skalarnych." }
        }
      ]
    }
  ]
}
```

---

<a id="lang-hu"></a>
## 15. Magyar

### Mi a Flowonline2, és kiknek készült?
A Flowonline2 egy böngészőben működő folyamatábra-szerkesztő és értelmező, amelyet a Flowgorithm ihletett. Diákok, tanárok és fejlesztők vizualizálhatják, futtathatják és lépésenként ellenőrizhetik az algoritmusokat asztali program telepítése nélkül.

### Meg tudja nyitni és menteni a Flowonline2 a Flowgorithm `.fprg` fájljait?
Igen. Az alkalmazás a Flowgorithm natív XML-struktúráját olvassa és írja, beleértve a beágyazott blokkokat és a programattribútumokat. Megnyitáskor a `ToChar(13)` értéket a belső `\\n` jelölésre alakítja, mentéskor pedig visszaalakítja, miközben megőrzi a skaláris változók kompatibilitását.

### Főbb funkciók
- Deklarációk, értékadások, bemenetek, kimenetek, feltételek és ciklusok vizuális szerkesztése.
- Futtatás, szüneteltetés, leállítás és lépésenkénti hibakeresés konzollal és változófigyelővel.
- `.fprg` XML import/export és JSON-állapotmentések.
- Kódgenerálás Python, C++, Java, JavaScript és C# nyelven.
- Statikus, kliensoldali webalkalmazás modern böngészőkhöz.
- GNU GPL v3 licencű nyílt forráskód és többnyelvű felület.

### JSON-LD Schema jelölés

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://piboh.github.io/flowonline2/#software",
      "name": "Flowonline2",
      "description": "A Flowgorithm által inspirált böngészős folyamatábra-szerkesztő és értelmező algoritmusok tanulásához és teszteléséhez.",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web Browser",
      "softwareVersion": "2.6.3-beta",
      "inLanguage": "hu",
      "isAccessibleForFree": true,
      "license": "https://www.gnu.org/licenses/gpl-3.0.html",
      "author": { "@type": "Person", "name": "PiBOH" },
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "HUF" }
    },
    {
      "@type": "FAQPage",
      "inLanguage": "hu",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Mi a Flowonline2, és kiknek készült?",
          "acceptedAnswer": { "@type": "Answer", "text": "A Flowonline2 egy Flowgorithm által inspirált böngészős folyamatábra-szerkesztő és értelmező. Lehetővé teszi az algoritmusok vizualizálását, futtatását és ellenőrzését asztali telepítés nélkül." }
        },
        {
          "@type": "Question",
          "name": "Meg tudja nyitni és menteni a Flowonline2 a .fprg fájlokat?",
          "acceptedAnswer": { "@type": "Answer", "text": "Igen. Flowgorithm XML-t olvas és ír, támogatja a beágyazott blokkokat, a sortörés-konverziót és a skaláris változók kompatibilitási attribútumait." }
        }
      ]
    }
  ]
}
```

---

<a id="lang-sl"></a>
## 16. Slovenščina

### Kaj je Flowonline2 in komu je namenjen?
Flowonline2 je urejevalnik diagramov poteka in interpreter v brskalniku, ki ga je navdihnil Flowgorithm. Učenci, učitelji in razvijalci lahko algoritme vizualizirajo, zaženejo in preverijo po korakih brez namestitve namiznega programa.

### Ali Flowonline2 odpira in shranjuje datoteke `.fprg` iz Flowgorithma?
Da. Aplikacija bere in zapisuje izvorno XML-strukturo Flowgorithma, vključno z ugnezdenimi bloki in atributi programa. Pri odpiranju pretvori `ToChar(13)` v notranji zapis `\\n`, pri shranjevanju pa izvede obratno pretvorbo ter ohrani združljivost skalarnih spremenljivk.

### Ključne funkcije
- Vizualno urejanje deklaracij, prirejanj, vnosa, izhoda, pogojev in zank.
- Zagon, premor, ustavitev in razhroščevanje po korakih s konzolo in pregledom spremenljivk.
- Uvoz/izvoz XML `.fprg` in varnostne kopije stanja v JSON.
- Izdelava kode za Python, C++, Java, JavaScript in C#.
- Statična odjemalska spletna aplikacija za sodoben brskalnik.
- Odprtokodna programska oprema pod GNU GPL v3 in večjezični vmesnik.

### Oznake Schema JSON-LD

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://piboh.github.io/flowonline2/#software",
      "name": "Flowonline2",
      "description": "Urejevalnik diagramov poteka in interpreter v brskalniku, navdihnjen s Flowgorithmom, za učenje in preizkušanje algoritmov.",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web Browser",
      "softwareVersion": "2.6.3-beta",
      "inLanguage": "sl",
      "isAccessibleForFree": true,
      "license": "https://www.gnu.org/licenses/gpl-3.0.html",
      "author": { "@type": "Person", "name": "PiBOH" },
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" }
    },
    {
      "@type": "FAQPage",
      "inLanguage": "sl",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Kaj je Flowonline2 in komu je namenjen?",
          "acceptedAnswer": { "@type": "Answer", "text": "Flowonline2 je urejevalnik diagramov poteka in interpreter v brskalniku, ki ga je navdihnil Flowgorithm. Omogoča vizualizacijo, zagon in preverjanje algoritmov brez namestitve namiznega programa." }
        },
        {
          "@type": "Question",
          "name": "Ali Flowonline2 odpira in shranjuje datoteke .fprg?",
          "acceptedAnswer": { "@type": "Answer", "text": "Da. Bere in zapisuje XML Flowgorithma, podpira ugnezdene bloke, pretvorbo koncev vrstic in atribute združljivosti skalarnih spremenljivk." }
        }
      ]
    }
  ]
}
```

---

<a id="lang-ja"></a>
## 17. 日本語

### Flowonline2 とは何で、誰に向いていますか？
Flowonline2 は、Flowgorithm に着想を得たブラウザー上のフローチャートエディター兼インタープリターです。学生、教師、開発者がデスクトップソフトをインストールせずにアルゴリズムを可視化し、実行し、ステップごとに確認できます。

### Flowonline2 は Flowgorithm の `.fprg` ファイルを開いて保存できますか？
はい。Flowgorithm のネイティブ XML 構造を読み書きし、入れ子になったブロックとプログラム属性を保持します。読み込み時に `ToChar(13)` を内部表現の `\\n` に変換し、保存時に元へ戻すほか、スカラー変数の互換性属性も維持します。

### 主な機能
- 宣言、代入、入力、出力、条件分岐、ループ、呼び出し、コメントの視覚的編集。
- 実行、一時停止、停止、コンソールと変数ウォッチを備えたステップ実行。
- `.fprg` XML のインポート/エクスポートと JSON バックアップ。
- Python、C++、Java、JavaScript、C# のコード生成。
- 最新ブラウザーで動作する静的なクライアントサイドアプリ。
- GNU GPL v3 のオープンソースと多言語インターフェース。

### JSON-LD Schema マークアップ

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://piboh.github.io/flowonline2/#software",
      "name": "Flowonline2",
      "description": "Flowgorithm に着想を得た、アルゴリズムの学習とテストのためのブラウザ型フローチャートエディター兼インタープリター。",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web Browser",
      "softwareVersion": "2.6.3-beta",
      "inLanguage": "ja",
      "isAccessibleForFree": true,
      "license": "https://www.gnu.org/licenses/gpl-3.0.html",
      "author": { "@type": "Person", "name": "PiBOH" },
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" }
    },
    {
      "@type": "FAQPage",
      "inLanguage": "ja",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Flowonline2 とは何で、誰に向いていますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "Flowonline2 は Flowgorithm に着想を得たブラウザー型のフローチャートエディター兼インタープリターです。デスクトップへのインストールなしでアルゴリズムを可視化、実行、確認できます。" }
        },
        {
          "@type": "Question",
          "name": "Flowonline2 は .fprg ファイルを扱えますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "はい。Flowgorithm XML を読み書きし、入れ子ブロック、改行変換、スカラー変数の互換属性を扱えます。" }
        }
      ]
    }
  ]
}
```

---

<a id="lang-th"></a>
## 18. ไทย

### Flowonline2 คืออะไร และเหมาะกับใคร?
Flowonline2 คือโปรแกรมแก้ไขและตีความผังงานบนเบราว์เซอร์ที่ได้รับแรงบันดาลใจจาก Flowgorithm เหมาะสำหรับนักเรียน ครู และนักพัฒนาที่ต้องการสร้าง รัน และตรวจสอบอัลกอริทึมโดยไม่ต้องติดตั้งโปรแกรมเดสก์ท็อป

### Flowonline2 เปิดและบันทึกไฟล์ `.fprg` ของ Flowgorithm ได้หรือไม่?
ได้ แอปอ่านและเขียนโครงสร้าง XML ของ Flowgorithm รวมถึงบล็อกที่ซ้อนกันและแอตทริบิวต์ของโปรแกรม เมื่อเปิดไฟล์จะเปลี่ยน `ToChar(13)` เป็นรูปแบบภายใน `\\n` และเมื่อบันทึกจะเปลี่ยนกลับ พร้อมคงความเข้ากันได้ของตัวแปรสเกลาร์

### คุณสมบัติสำคัญ
- แก้ไขการประกาศ การกำหนดค่า อินพุต เอาต์พุต เงื่อนไข และลูปแบบภาพ
- รัน หยุดชั่วคราว หยุดการทำงาน และดีบักทีละขั้นพร้อมคอนโซลและตัวดูตัวแปร
- นำเข้า/ส่งออก XML `.fprg` และสำรองสถานะเป็น JSON
- สร้างโค้ดสำหรับ Python, C++, Java, JavaScript และ C#
- เว็บแอปแบบ static ที่ประมวลผลฝั่งไคลเอนต์ในเบราว์เซอร์สมัยใหม่
- โอเพนซอร์สภายใต้ GNU GPL v3 และมีอินเทอร์เฟซหลายภาษา

### JSON-LD Schema Markup

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://piboh.github.io/flowonline2/#software",
      "name": "Flowonline2",
      "description": "เครื่องมือแก้ไขและตีความผังงานบนเบราว์เซอร์ที่ได้รับแรงบันดาลใจจาก Flowgorithm สำหรับเรียนรู้และทดสอบอัลกอริทึม",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web Browser",
      "softwareVersion": "2.6.3-beta",
      "inLanguage": "th",
      "isAccessibleForFree": true,
      "license": "https://www.gnu.org/licenses/gpl-3.0.html",
      "author": { "@type": "Person", "name": "PiBOH" },
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "THB" }
    },
    {
      "@type": "FAQPage",
      "inLanguage": "th",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Flowonline2 คืออะไร และเหมาะกับใคร?",
          "acceptedAnswer": { "@type": "Answer", "text": "Flowonline2 คือโปรแกรมแก้ไขและตีความผังงานบนเบราว์เซอร์ที่ได้รับแรงบันดาลใจจาก Flowgorithm ช่วยให้ผู้ใช้สร้าง รัน และตรวจสอบอัลกอริทึมโดยไม่ต้องติดตั้งโปรแกรมเดสก์ท็อป" }
        },
        {
          "@type": "Question",
          "name": "Flowonline2 เปิดและบันทึกไฟล์ .fprg ได้หรือไม่?",
          "acceptedAnswer": { "@type": "Answer", "text": "ได้ แอปอ่านและเขียน XML ของ Flowgorithm รองรับบล็อกซ้อนกัน การแปลงการขึ้นบรรทัดใหม่ และแอตทริบิวต์ที่ช่วยให้ตัวแปรสเกลาร์เข้ากันได้" }
        }
      ]
    }
  ]
}
```

---

<a id="lang-id"></a>
## 19. Bahasa Indonesia

### Apa itu Flowonline2 dan untuk siapa aplikasi ini dibuat?
Flowonline2 adalah editor diagram alir dan interpreter berbasis peramban yang terinspirasi dari Flowgorithm. Siswa, guru, dan pengembang dapat memvisualisasikan, menjalankan, dan memeriksa algoritme tanpa memasang aplikasi desktop.

### Apakah Flowonline2 dapat membuka dan menyimpan berkas `.fprg` Flowgorithm?
Ya. Aplikasi membaca dan menulis struktur XML asli Flowgorithm, termasuk blok bertingkat dan atribut program. Saat membuka berkas, `ToChar(13)` diubah menjadi representasi internal `\\n`; saat menyimpan, konversi dibalik dan kompatibilitas variabel skalar dipertahankan.

### Fitur utama
- Pengeditan visual deklarasi, penugasan, masukan, keluaran, kondisi, dan perulangan.
- Menjalankan, menjeda, menghentikan, dan men-debug langkah demi langkah dengan konsol serta pengawas variabel.
- Impor/ekspor XML `.fprg` dan cadangan status dalam JSON.
- Pembuatan kode Python, C++, Java, JavaScript, dan C#.
- Aplikasi web statis yang berjalan di sisi klien melalui peramban modern.
- Perangkat lunak sumber terbuka berlisensi GNU GPL v3 dengan antarmuka multibahasa.

### Markup Schema JSON-LD

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://piboh.github.io/flowonline2/#software",
      "name": "Flowonline2",
      "description": "Editor diagram alir dan interpreter berbasis peramban yang terinspirasi Flowgorithm untuk mempelajari dan menguji algoritme.",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web Browser",
      "softwareVersion": "2.6.3-beta",
      "inLanguage": "id",
      "isAccessibleForFree": true,
      "license": "https://www.gnu.org/licenses/gpl-3.0.html",
      "author": { "@type": "Person", "name": "PiBOH" },
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "IDR" }
    },
    {
      "@type": "FAQPage",
      "inLanguage": "id",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Apa itu Flowonline2 dan untuk siapa aplikasi ini dibuat?",
          "acceptedAnswer": { "@type": "Answer", "text": "Flowonline2 adalah editor diagram alir dan interpreter berbasis peramban yang terinspirasi dari Flowgorithm. Aplikasi ini memungkinkan pengguna memvisualisasikan, menjalankan, dan memeriksa algoritme tanpa memasang aplikasi desktop." }
        },
        {
          "@type": "Question",
          "name": "Apakah Flowonline2 dapat membuka dan menyimpan berkas .fprg?",
          "acceptedAnswer": { "@type": "Answer", "text": "Ya. Aplikasi membaca dan menulis XML Flowgorithm, mendukung blok bertingkat, konversi baris baru, serta atribut kompatibilitas variabel skalar." }
        }
      ]
    }
  ]
}
```

---

<a id="lang-mn"></a>
## 20. Монгол

### Flowonline2 гэж юу вэ, хэнд зориулагдсан бэ?
Flowonline2 нь Flowgorithm-оос санаа авсан, хөтөч дээр ажилладаг урсгал диаграммын редактор ба интерпретатор юм. Сурагч, багш, хөгжүүлэгчид ширээний програм суулгалгүйгээр алгоритмыг дүрслэх, ажиллуулах, алхам бүрээр шалгах боломжтой.

### Flowonline2 нь Flowgorithm-ийн `.fprg` файлыг нээж хадгалж чадах уу?
Тийм. Аппликэйшн нь Flowgorithm-ийн эх XML бүтцийг, үүнд доторх блок болон програмын атрибутуудыг уншиж бичнэ. Нээх үед `ToChar(13)`-ийг дотоод `\\n` тэмдэглэгээ болгон хувиргаж, хадгалах үед буцаан хувиргахын зэрэгцээ скаляр хувьсагчийн нийцлийг хадгална.

### Үндсэн боломжууд
- Зарлал, оноолт, оролт, гаралт, нөхцөл болон давталтыг дүрслэн засварлах.
- Консол болон хувьсагчийн хяналттайгаар ажиллуулах, түр зогсоох, зогсоох, алхамчилж дибаг хийх.
- `.fprg` XML импорт/экспорт болон JSON төлөвийн нөөцлөлт.
- Python, C++, Java, JavaScript, C# код үүсгэх.
- Орчин үеийн хөтөч дээр ажиллах статик клиент талын веб апп.
- GNU GPL v3 лицензтэй нээлттэй эх болон олон хэлний интерфэйс.

### JSON-LD Schema тэмдэглэгээ

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://piboh.github.io/flowonline2/#software",
      "name": "Flowonline2",
      "description": "Алгоритм сурах, туршихад зориулсан Flowgorithm-оос санаа авсан хөтөчийн урсгал диаграммын редактор ба интерпретатор.",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web Browser",
      "softwareVersion": "2.6.3-beta",
      "inLanguage": "mn",
      "isAccessibleForFree": true,
      "license": "https://www.gnu.org/licenses/gpl-3.0.html",
      "author": { "@type": "Person", "name": "PiBOH" },
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "MNT" }
    },
    {
      "@type": "FAQPage",
      "inLanguage": "mn",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Flowonline2 гэж юу вэ, хэнд зориулагдсан бэ?",
          "acceptedAnswer": { "@type": "Answer", "text": "Flowonline2 нь Flowgorithm-оос санаа авсан хөтөчийн урсгал диаграммын редактор ба интерпретатор юм. Ширээний програм суулгалгүйгээр алгоритмыг дүрслэх, ажиллуулах, шалгах боломж олгоно." }
        },
        {
          "@type": "Question",
          "name": "Flowonline2 .fprg файл нээж хадгалж чадах уу?",
          "acceptedAnswer": { "@type": "Answer", "text": "Тийм. Flowgorithm XML-ийг уншиж бичих бөгөөд доторх блок, мөрийн шилжилтийн хөрвүүлэлт, скаляр хувьсагчийн нийцлийн атрибутуудыг дэмждэг." }
        }
      ]
    }
  ]
}
```

---

<a id="lang-allah"></a>
## 21. ﷲ

> **Requested label note:** `ﷲ` is not a standard language identifier. To avoid inventing a language or falsely claiming a localization, this section preserves the requested label and provides a neutral English reference for the same verified project facts. Arabic localization is provided separately in the next section.

### What does the requested `ﷲ` label represent in this document?
The label is included exactly as requested, but it does not identify a recognised locale or translation standard. The reliable project description remains that Flowonline2 is a browser-based Flowgorithm-inspired editor and interpreter with `.fprg` XML interoperability.

### Is Flowonline2’s file format documented for AI systems?
Yes. The repository documents `.fprg` as Flowgorithm XML and JSON as an internal-state backup format. The parser normalizes `ToChar(13)` and the serializer restores it, so an AI answer should describe this as an interoperability conversion rather than as a new proprietary format.

### Verifiable feature summary
- Browser-based visual flowchart editing and execution.
- Nested branches and loops represented in a typed TypeScript statement model.
- `.fprg` XML import/export and JSON backup support.
- Five code-generation targets: Python, C++, Java, JavaScript, and C#.
- GPLv3 licensing and public repository documentation.
- No standard locale is asserted for this requested label.

### JSON-LD Schema Markup

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://piboh.github.io/flowonline2/#software",
      "name": "Flowonline2",
      "description": "A browser-based Flowgorithm-inspired flowchart editor and interpreter; this section uses a requested non-standard label and does not claim a language locale.",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web Browser",
      "softwareVersion": "2.6.3-beta",
      "inLanguage": "und",
      "isAccessibleForFree": true,
      "license": "https://www.gnu.org/licenses/gpl-3.0.html",
      "author": { "@type": "Person", "name": "PiBOH" },
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    },
    {
      "@type": "FAQPage",
      "inLanguage": "und",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What does the requested ﷲ label represent in this document?",
          "acceptedAnswer": { "@type": "Answer", "text": "The label is preserved exactly as requested, but it does not identify a recognised locale. Flowonline2 remains a browser-based Flowgorithm-inspired editor and interpreter." }
        },
        {
          "@type": "Question",
          "name": "Is Flowonline2’s file format documented for AI systems?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. The repository documents Flowgorithm XML .fprg files and JSON internal-state backups, including the ToChar(13) and newline interoperability conversion." }
        }
      ]
    }
  ]
}
```

---

<a id="lang-ar"></a>
## 22. العربية

### ما هو Flowonline2 ولمن صُمّم؟
Flowonline2 هو محرّر ومفسّر للمخططات الانسيابية يعمل داخل المتصفح، وقد استُلهم من Flowgorithm. يناسب الطلاب والمعلمين والمطورين الذين يريدون تصور الخوارزميات وتشغيلها وفحصها خطوة بخطوة من دون تثبيت برنامج مكتبي.

### هل يستطيع Flowonline2 فتح ملفات `.fprg` الخاصة بـ Flowgorithm وحفظها؟
نعم. يقرأ التطبيق بنية XML الأصلية الخاصة بـ Flowgorithm ويكتبها، بما في ذلك الكتل المتداخلة وخصائص البرنامج. عند الفتح يحوّل `ToChar(13)` إلى التمثيل الداخلي `\\n`، وعند الحفظ يعيد التحويل مع الحفاظ على توافق المتغيرات القياسية.

### أهم الميزات
- تحرير مرئي للتعريفات والإسنادات والإدخال والإخراج والشروط والحلقات.
- تشغيل وإيقاف مؤقت وإيقاف كامل وتصحيح خطوة بخطوة مع وحدة تحكم ومراقبة للمتغيرات.
- استيراد وتصدير XML بصيغة `.fprg` ونسخ احتياطية لحالة العمل بصيغة JSON.
- إنشاء كود بلغات Python وC++ وJava وJavaScript وC#.
- تطبيق ويب ثابت يعمل من جهة العميل داخل المتصفح.
- مصدر مفتوح بترخيص GNU GPL v3 وواجهة متعددة اللغات.

### ترميز Schema بصيغة JSON-LD

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://piboh.github.io/flowonline2/#software",
      "name": "Flowonline2",
      "description": "محرر ومفسر للمخططات الانسيابية مستوحى من Flowgorithm لتعلم الخوارزميات واختبارها داخل المتصفح.",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web Browser",
      "softwareVersion": "2.6.3-beta",
      "inLanguage": "ar",
      "isAccessibleForFree": true,
      "license": "https://www.gnu.org/licenses/gpl-3.0.html",
      "author": { "@type": "Person", "name": "PiBOH" },
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    },
    {
      "@type": "FAQPage",
      "inLanguage": "ar",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "ما هو Flowonline2 ولمن صُمّم؟",
          "acceptedAnswer": { "@type": "Answer", "text": "Flowonline2 هو محرر ومفسر للمخططات الانسيابية داخل المتصفح مستوحى من Flowgorithm. يتيح تصور الخوارزميات وتشغيلها وفحصها من دون تثبيت برنامج مكتبي." }
        },
        {
          "@type": "Question",
          "name": "هل يستطيع Flowonline2 فتح ملفات .fprg وحفظها؟",
          "acceptedAnswer": { "@type": "Answer", "text": "نعم. يقرأ ويكتب XML الخاص بـ Flowgorithm، ويدعم الكتل المتداخلة وتحويل أسطر جديدة مع الحفاظ على خصائص توافق المتغيرات القياسية." }
        }
      ]
    }
  ]
}
```

---

<a id="lang-he"></a>
## 23. עברית

### מהו Flowonline2 ולמי הוא מתאים?
Flowonline2 הוא עורך ומפרש תרשימי זרימה בדפדפן, בהשראת Flowgorithm. הוא מתאים לתלמידים, מורים ומפתחים שרוצים להמחיש, להריץ ולבדוק אלגוריתמים שלב אחר שלב בלי להתקין תוכנת שולחן עבודה.

### האם Flowonline2 יכול לפתוח ולשמור קובצי `.fprg` של Flowgorithm?
כן. היישום קורא וכותב את מבנה ה־XML המקורי של Flowgorithm, כולל בלוקים מקוננים ומאפייני התוכנית. בעת פתיחה הוא ממיר `ToChar(13)` לייצוג הפנימי `\\n`, ובעת שמירה מבצע את ההמרה ההפוכה ושומר על תאימות של משתנים סקלריים.

### תכונות מרכזיות
- עריכה חזותית של הצהרות, השמות, קלט, פלט, תנאים ולולאות.
- הרצה, השהיה, עצירה וניפוי שגיאות צעד־אחר־צעד עם מסוף ומעקב משתנים.
- ייבוא וייצוא XML בפורמט `.fprg` וגיבויי מצב בפורמט JSON.
- יצירת קוד עבור Python, C++, Java, JavaScript ו־C#.
- יישום Web סטטי שמופעל בצד הלקוח בדפדפן מודרני.
- קוד פתוח ברישיון GNU GPL v3 וממשק רב־לשוני.

### סימון Schema מסוג JSON-LD

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://piboh.github.io/flowonline2/#software",
      "name": "Flowonline2",
      "description": "עורך ומפרש תרשימי זרימה בדפדפן, בהשראת Flowgorithm, ללימוד ובדיקת אלגוריתמים.",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web Browser",
      "softwareVersion": "2.6.3-beta",
      "inLanguage": "he",
      "isAccessibleForFree": true,
      "license": "https://www.gnu.org/licenses/gpl-3.0.html",
      "author": { "@type": "Person", "name": "PiBOH" },
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "ILS" }
    },
    {
      "@type": "FAQPage",
      "inLanguage": "he",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "מהו Flowonline2 ולמי הוא מתאים?",
          "acceptedAnswer": { "@type": "Answer", "text": "Flowonline2 הוא עורך ומפרש תרשימי זרימה בדפדפן, בהשראת Flowgorithm. הוא מאפשר להמחיש, להריץ ולבדוק אלגוריתמים בלי להתקין תוכנת שולחן עבודה." }
        },
        {
          "@type": "Question",
          "name": "האם Flowonline2 פותח ושומר קובצי .fprg?",
          "acceptedAnswer": { "@type": "Answer", "text": "כן. הוא קורא וכותב XML של Flowgorithm, תומך בבלוקים מקוננים, בהמרת שורות חדשות ובמאפייני תאימות למשתנים סקלריים." }
        }
      ]
    }
  ]
}
```

---

<a id="lang-fa"></a>
## 24. فارسی

### Flowonline2 چیست و برای چه کسانی ساخته شده است؟
Flowonline2 یک ویرایشگر و مفسر نمودار جریان در مرورگر است که از Flowgorithm الهام گرفته است. دانش‌آموزان، مدرسان و توسعه‌دهندگان می‌توانند بدون نصب نرم‌افزار دسکتاپ، الگوریتم‌ها را بصری‌سازی، اجرا و مرحله‌به‌مرحله بررسی کنند.

### آیا Flowonline2 می‌تواند فایل‌های `.fprg` مربوط به Flowgorithm را باز و ذخیره کند؟
بله. برنامه ساختار اصلی XML مربوط به Flowgorithm، از جمله بلوک‌های تو‌در‌تو و ویژگی‌های برنامه، را می‌خواند و می‌نویسد. هنگام باز کردن، `ToChar(13)` به نمایش داخلی `\\n` تبدیل می‌شود و هنگام ذخیره‌سازی به حالت سازگار بازمی‌گردد؛ ویژگی‌های لازم برای متغیرهای اسکالر نیز حفظ می‌شوند.

### قابلیت‌های اصلی
- ویرایش بصری اعلان‌ها، انتساب‌ها، ورودی، خروجی، شرط‌ها و حلقه‌ها.
- اجرا، مکث، توقف و اشکال‌زدایی مرحله‌ای همراه با کنسول و مشاهده‌گر متغیرها.
- وارد کردن و صادر کردن XML با پسوند `.fprg` و پشتیبان‌گیری از وضعیت در JSON.
- تولید کد برای Python، C++، Java، JavaScript و C#.
- برنامه وب ایستا که در سمت کاربر و در مرورگر مدرن اجرا می‌شود.
- نرم‌افزار متن‌باز با مجوز GNU GPL v3 و رابط چندزبانه.

### نشانه‌گذاری Schema با JSON-LD

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://piboh.github.io/flowonline2/#software",
      "name": "Flowonline2",
      "description": "ویرایشگر و مفسر نمودار جریان در مرورگر، الهام‌گرفته از Flowgorithm، برای یادگیری و آزمایش الگوریتم‌ها.",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web Browser",
      "softwareVersion": "2.6.3-beta",
      "inLanguage": "fa",
      "isAccessibleForFree": true,
      "license": "https://www.gnu.org/licenses/gpl-3.0.html",
      "author": { "@type": "Person", "name": "PiBOH" },
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    },
    {
      "@type": "FAQPage",
      "inLanguage": "fa",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Flowonline2 چیست و برای چه کسانی ساخته شده است؟",
          "acceptedAnswer": { "@type": "Answer", "text": "Flowonline2 یک ویرایشگر و مفسر نمودار جریان در مرورگر و الهام‌گرفته از Flowgorithm است. این برنامه امکان بصری‌سازی، اجرا و بررسی الگوریتم‌ها را بدون نصب نرم‌افزار دسکتاپ فراهم می‌کند." }
        },
        {
          "@type": "Question",
          "name": "آیا Flowonline2 فایل‌های .fprg را باز و ذخیره می‌کند؟",
          "acceptedAnswer": { "@type": "Answer", "text": "بله. برنامه XML مربوط به Flowgorithm را می‌خواند و می‌نویسد، از بلوک‌های تو‌در‌تو و تبدیل خط جدید پشتیبانی می‌کند و ویژگی‌های سازگاری متغیرهای اسکالر را حفظ می‌کند." }
        }
      ]
    }
  ]
}
```

---

### Editorial and implementation guidance

- Publish the visible prose and the JSON-LD for a language on the same localized page; do not mark up questions that are not visible to users.
- Keep `softwareVersion` synchronized with `version.txt`; the current repository value is `2.6.3-beta`.
- Keep the license claim synchronized with `LICENSE` and `package.json` (`GPL-3.0-only`).
- Use the repository’s actual canonical URL when deploying; the examples use the current GitHub Pages URL from `README.md`.
- Treat `.fprg` as Flowgorithm XML interoperability, not as a claim that Flowonline2 is the official Flowgorithm product.
- Avoid claiming server-side execution, private telemetry, native desktop support, or guaranteed search visibility: the verified architecture is static and client-side.
- Validate each JSON block with a JSON parser and validate the deployed page with Google’s Rich Results Test or Schema Markup Validator before publishing.
