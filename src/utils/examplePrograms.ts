/** Build-time catalogue of bundled examples in any nested subfolder. */
export type ExampleFormat = 'fprg' | 'json';

export interface ExampleProgram {
  path: string;
  group: string;
  name: string;
  content: string;
  format: ExampleFormat;
  author: string;
  duplicate?: boolean;
}

const fprgFiles = import.meta.glob('/.fprg-files/**/*.fprg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const jsonFiles = import.meta.glob('/.fprg-files/**/*.json', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const allFiles = { ...fprgFiles, ...jsonFiles };

const fileName = (path: string) => path.split('/').pop() ?? path;
const titleFromPath = (path: string) => fileName(path).replace(/\.(fprg|json)$/i, '');
const formatFromPath = (path: string): ExampleFormat => path.toLowerCase().endsWith('.json') ? 'json' : 'fprg';
const authorFromContent = (content: string, format: ExampleFormat): string => {
  if (format === 'json') {
    try { return JSON.parse(content).author || JSON.parse(content).programAuthor || ''; } catch { return ''; }
  }
  return content.match(/<attribute\s+name=["']authors?["']\s+value=["']([^"']*)/i)?.[1] ?? '';
};

const rawExamples = Object.entries(allFiles).map(([path, content]) => {
  const parts = path.split('/');
  const format = formatFromPath(path);
  return {
    path,
    group: parts[parts.length - 2] ?? 'Examples',
    name: titleFromPath(path),
    content,
    format,
    author: authorFromContent(content, format)
  };
});

const duplicateNames = new Set<string>();
for (const example of rawExamples) {
  const key = `${example.group}/${example.name.toLowerCase()}`;
  if (rawExamples.filter((candidate) => `${candidate.group}/${candidate.name.toLowerCase()}` === key).length > 1) duplicateNames.add(key);
}

export const EXAMPLE_PROGRAMS: ExampleProgram[] = rawExamples
  .map((example) => ({ ...example, duplicate: duplicateNames.has(`${example.group}/${example.name.toLowerCase()}`) }))
  .sort((a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name) || a.format.localeCompare(b.format));
