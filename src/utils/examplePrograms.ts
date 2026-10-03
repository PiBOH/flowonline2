/**
 * Build-time live catalogue of the checked-in examples.
 *
 * Vite expands this glob from the .fprg-files directory, so adding or removing
 * an example changes the File > Examples menu without editing TypeScript.
 * The XML is bundled as text and loaded through the same parser as a user file.
 */
export interface ExampleProgram {
  path: string;
  group: string;
  name: string;
  content: string;
}

const files = import.meta.glob('/.fprg-files/**/*.fprg', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>;

const titleFromPath = (path: string): string => {
  const file = path.split('/').pop() ?? path;
  return file.replace(/\.fprg$/i, '');
};

export const EXAMPLE_PROGRAMS: ExampleProgram[] = Object.entries(files)
  .map(([path, content]) => {
    const parts = path.split('/');
    const group = parts[parts.length - 2] ?? 'Examples';
    return { path, group, name: titleFromPath(path), content };
  })
  .sort((a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name));
