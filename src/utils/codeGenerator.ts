import { Statement } from '../types/flow';
import { PROFILES, generateWithProfile } from './languageProfiles';

/** Single entry point for all Flowonline2 code targets. */
export class CodeGenerator {
  public static generate(statements: Statement[], language: string): string {
    const profile = PROFILES[language];
    return profile
      ? generateWithProfile(statements, profile)
      : `// Unsupported target language: ${language}\n`;
  }
}
