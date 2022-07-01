import * as dotenv from 'dotenv';
import * as yargs from 'yargs';
import * as path from 'path';
import { readJSONFile } from './utils/json-reader';
import { writeJSONFile } from './utils/json-writer';
import { hideBin } from 'yargs/helpers';
import { IJSONResult } from 'utils/json-result';
import Encryptor from './services/encryptor';

interface Iargv {
  [x: string]: unknown;
  _: (string | number)[];
  $0: string;
}

const main = async () => {
  const argv: Iargv = await yargs(hideBin(process.argv)).argv;
  const encryptor = new Encryptor();

  try {
    let result: IJSONResult;

    const { isError, data, message } = readJSONFile(path.join(__dirname, argv.path.toString()));
    if (isError) throw new Error(message);

    switch (argv.action) {
      case 'encrypt':
        const encryptedData = encryptor.doEncrypt(data);
        result = writeJSONFile(path.join(__dirname, argv.path.toString()), encryptedData);
        if (isError) throw new Error(result.message);
        break;
      case 'decrypt':
        const decryptedData = encryptor.doDecrypt(data);
        result = writeJSONFile(path.join(__dirname, argv.path.toString()), decryptedData);
        if (isError) throw new Error(result.message);
        break;
      default:
        throw new Error('Invalid action type!');
    }

    console.log('Success!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

dotenv.config();

main();
