import { readFileSync } from 'fs';

export const read = relativePath => readFileSync(relativePath, 'utf8');
