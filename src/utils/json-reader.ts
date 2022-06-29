import { readFile } from 'fs';

export function readJSONFile(path: string, callback: CallableFunction) {
  readFile(path, (err, data) => {
    if (err) {
      return callback && callback(err);
    }

    try {
      const parsedData = JSON.parse(data.toString());
      return callback && callback(null, parsedData);
    } catch (error) {
      return callback && callback(error);
    }
  });
}
