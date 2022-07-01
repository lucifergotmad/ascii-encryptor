import { writeFileSync } from 'fs';
import { IJSONResult } from './json-result';

export function writeJSONFile(path: string, data: unknown): IJSONResult {
  try {
    const stringifyData = JSON.stringify(data);
    writeFileSync(path, stringifyData);
    return { isError: false, data: stringifyData, message: 'Success!!' };
  } catch (error) {
    console.error('Error: ', error.message);
    return { isError: true, message: error.message };
  }
}
