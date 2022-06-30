import * as dotenv from 'dotenv';
import { readJSONFile } from './utils/json-reader';
import * as yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import Encryptor from './services/encryptor';
import * as path from 'path';
import { readFileSync } from 'fs';

const main = () => {
  const { argv } = yargs(hideBin(process.argv));
  const encryptor = new Encryptor();

  const { isError, data, message } = readJSONFile(path.join(__dirname, '../data/tm_customer_monica.json'));
  if (isError) {
    console.log(message);
  } else {
    console.log(data.map((cuss: any) => encryptor.doEncrypt(cuss)));
  }
};

dotenv.config();

main();
