import { readFileSync } from 'fs';
import { IJSONResult } from './json-result';

export function readJSONFile(path: string): IJSONResult {
  try {
    const data = readFileSync(path, 'utf-8');
    const parsedData = JSON.parse(data);
    return { isError: false, data: parsedData };
  } catch (error) {
    console.error('Error: ', error.message);
    return { isError: true, message: error.message };
  }
}
