import { readFileSync } from 'fs';

export function readJSONFile(path: string): IJSONResult {
  try {
    const data = readFileSync(path, 'utf-8');
    const parsedData = JSON.parse(data);
    return { isError: false, data: parsedData };
  } catch (error) {
    console.log('Error: ', error);
    return { isError: true, message: error.message };
  }
}

interface IJSONResult {
  isError: boolean;
  data?: any;
  message?: string;
}
