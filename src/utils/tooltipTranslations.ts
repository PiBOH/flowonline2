import type { Language } from '../types/flow';

type TooltipKey = 'new' | 'open' | 'save' | 'copy' | 'favorite' | 'unfavorite' | 'searchExamples' | 'exportExamples' | 'format' | 'examplePath' | 'language';

const common: Record<TooltipKey, string> = {
  new: 'New (Ctrl+N)', open: 'Open (Ctrl+O)', save: 'Save (Ctrl+S)', copy: 'Copy', favorite: 'Add to favorites', unfavorite: 'Remove from favorites', searchExamples: 'Search examples by name, content, or author', exportExamples: 'Export examples list as JSON', format: 'File format', examplePath: 'Example file path', language: 'Select language'
};

const translations: Partial<Record<Language, Partial<Record<TooltipKey, string>>>> = {
  it: { new: 'Nuovo (Ctrl+N)', open: 'Apri (Ctrl+O)', save: 'Salva (Ctrl+S)', copy: 'Copia', favorite: 'Aggiungi ai preferiti', unfavorite: 'Rimuovi dai preferiti', searchExamples: 'Cerca esempi per nome, contenuto o autore', exportExamples: 'Esporta elenco esempi in JSON', format: 'Formato del file', examplePath: 'Percorso del file esempio', language: 'Seleziona lingua' },
  en_GB: { new: 'New (Ctrl+N)', open: 'Open (Ctrl+O)', save: 'Save (Ctrl+S)' },
  de: { new: 'Neu (Ctrl+N)', open: 'Öffnen (Ctrl+O)', save: 'Speichern (Ctrl+S)', copy: 'Kopieren', favorite: 'Zu Favoriten hinzufügen', unfavorite: 'Aus Favoriten entfernen', searchExamples: 'Beispiele nach Name, Inhalt oder Autor suchen', exportExamples: 'Beispielliste als JSON exportieren', format: 'Dateiformat', examplePath: 'Pfad der Beispieldatei', language: 'Sprache auswählen' },
  fr: { new: 'Nouveau (Ctrl+N)', open: 'Ouvrir (Ctrl+O)', save: 'Enregistrer (Ctrl+S)', copy: 'Copier', favorite: 'Ajouter aux favoris', unfavorite: 'Retirer des favoris', searchExamples: 'Rechercher des exemples par nom, contenu ou auteur', exportExamples: 'Exporter la liste des exemples en JSON', format: 'Format du fichier', examplePath: 'Chemin du fichier exemple', language: 'Choisir la langue' },
  es: { new: 'Nuevo (Ctrl+N)', open: 'Abrir (Ctrl+O)', save: 'Guardar (Ctrl+S)', copy: 'Copiar', favorite: 'Añadir a favoritos', unfavorite: 'Quitar de favoritos', searchExamples: 'Buscar ejemplos por nombre, contenido o autor', exportExamples: 'Exportar lista de ejemplos como JSON', format: 'Formato del archivo', examplePath: 'Ruta del archivo de ejemplo', language: 'Seleccionar idioma' },
  pt: { new: 'Novo (Ctrl+N)', open: 'Abrir (Ctrl+O)', save: 'Guardar (Ctrl+S)', copy: 'Copiar', favorite: 'Adicionar aos favoritos', unfavorite: 'Remover dos favoritos', searchExamples: 'Pesquisar exemplos por nome, conteúdo ou autor', exportExamples: 'Exportar lista de exemplos como JSON', format: 'Formato do ficheiro', examplePath: 'Caminho do ficheiro de exemplo', language: 'Selecionar idioma' },
  nl: { new: 'Nieuw (Ctrl+N)', open: 'Openen (Ctrl+O)', save: 'Opslaan (Ctrl+S)', copy: 'Kopiëren', favorite: 'Aan favorieten toevoegen', unfavorite: 'Uit favorieten verwijderen', searchExamples: 'Voorbeelden zoeken op naam, inhoud of auteur', exportExamples: 'Voorbeeldenlijst als JSON exporteren', format: 'Bestandsformaat', examplePath: 'Pad van voorbeeldbestand', language: 'Taal selecteren' },
  ru: { new: 'Новый (Ctrl+N)', open: 'Открыть (Ctrl+O)', save: 'Сохранить (Ctrl+S)', copy: 'Копировать', favorite: 'Добавить в избранное', unfavorite: 'Удалить из избранного', searchExamples: 'Поиск примеров по имени, содержимому или автору', exportExamples: 'Экспорт списка примеров в JSON', format: 'Формат файла', examplePath: 'Путь к файлу примера', language: 'Выбрать язык' },
  zh: { new: '新建 (Ctrl+N)', open: '打开 (Ctrl+O)', save: '保存 (Ctrl+S)', copy: '复制', favorite: '加入收藏', unfavorite: '移出收藏', searchExamples: '按名称、内容或作者搜索示例', exportExamples: '将示例列表导出为 JSON', format: '文件格式', examplePath: '示例文件路径', language: '选择语言' },
  ja: { new: '新規 (Ctrl+N)', open: '開く (Ctrl+O)', save: '保存 (Ctrl+S)', copy: 'コピー', favorite: 'お気に入りに追加', unfavorite: 'お気に入りから削除', searchExamples: '名前、内容、作者でサンプルを検索', exportExamples: 'サンプル一覧をJSONで書き出す', format: 'ファイル形式', examplePath: 'サンプルファイルのパス', language: '言語を選択' },
};

export const tooltip = (language: Language, key: TooltipKey): string => translations[language]?.[key] ?? common[key];
