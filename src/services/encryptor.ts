import globalIgnore from '../constants/global-ignore';

export default class Encryptor {
  private encryptascii(str: any) {
    const key = process.env.ENCKEY;

    const dataKey: any = {};
    for (let i = 0; i < key.length; i++) {
      dataKey[i] = key.substr(i, 1);
    }

    let strEnc = '';
    let nkey = 0;
    const jml = str.length;

    for (let i = 0; i < parseInt(jml); i++) {
      strEnc = strEnc + this.hexEncode(str[i].charCodeAt(0) + dataKey[nkey].charCodeAt(0));

      if (nkey === Object.keys(dataKey).length - 1) {
        nkey = 0;
      }
      nkey = nkey + 1;
    }
    return strEnc.toUpperCase();
  }

  private decryptascii(str: any) {
    if (str) {
      const key = process.env.ENCKEY;
      const dataKey: any = {};
      for (let i = 0; i < key.length; i++) {
        dataKey[i] = key.substr(i, 1);
      }

      let strDec = '';
      let nkey = 0;
      const jml = str.length;
      let i = 0;
      while (i < parseInt(jml)) {
        strDec = strDec + this.chr(this.hexdec(str.substr(i, 2)) - dataKey[nkey].charCodeAt(0));
        if (nkey === Object.keys(dataKey).length - 1) {
          nkey = 0;
        }
        nkey = nkey + 1;
        i = i + 2;
      }
      return strDec;
    }
  }

  private hexEncode(str: any) {
    let result = '';
    result = str.toString(16);
    return result;
  }

  private hexdec(hex: any) {
    let str: any = '';
    str = parseInt(hex, 16);
    return str;
  }

  private chr(asci: any) {
    let str = '';
    str = String.fromCharCode(asci);
    return str;
  }

  doEncrypt(dataBeforeCopy: any, ignore: any = globalIgnore) {
    if (!dataBeforeCopy) {
      return dataBeforeCopy;
    }
    if (typeof dataBeforeCopy === 'object' && !(dataBeforeCopy instanceof Date)) {
      const data = Array.isArray(dataBeforeCopy) ? [...dataBeforeCopy] : { ...dataBeforeCopy };
      Object.keys(data).map((x: any) => {
        const result = ignore.find((find: any) => find === x);
        if (!result) {
          if (Array.isArray(data[x])) {
            data[x] = data[x].map((y: any) => {
              if (typeof y === 'string') {
                return this.encryptascii(y);
              } else if (typeof data[x] === 'object' && data[x] && !(data[x] instanceof Date)) {
                return this.doEncrypt(y, ignore);
              }
              return false;
            });
          } else {
            if (typeof data[x] === 'string' && data[x]) {
              data[x] = this.encryptascii(data[x]);
            } else if (typeof data[x] === 'number' && data[x]) {
              // Call Masking Number
            } else if (typeof data[x] === 'object' && data[x] && !(dataBeforeCopy instanceof Date)) {
              data[x] = this.doEncrypt(data[x], ignore);
            }
          }
        }
        return false;
      });
      return data;
    } else if (typeof dataBeforeCopy === 'string') {
      const data = this.encryptascii(dataBeforeCopy);
      return data;
    }
  }

  doDecrypt(dataBeforeCopy: any, ignore: any = globalIgnore) {
    if (!dataBeforeCopy) {
      return dataBeforeCopy;
    }

    if (typeof dataBeforeCopy === 'object' && !(dataBeforeCopy instanceof Date)) {
      const data = Array.isArray(dataBeforeCopy) ? [...dataBeforeCopy] : { ...dataBeforeCopy };
      Object.keys(data).map((x: any) => {
        const result = ignore.find((find: any) => find === x);
        if (!result) {
          if (Array.isArray(data[x])) {
            data[x] = data[x].map((y: any) => {
              if (typeof y === 'string') {
                return this.decryptascii(y);
              } else if (typeof data[x] === 'object' && data[x] && !(data[x] instanceof Date)) {
                return this.doDecrypt(y, ignore);
              }
              return false;
            });
          } else {
            // Real Encrypt
            if (typeof data[x] === 'string' && data[x]) {
              data[x] = this.decryptascii(data[x]);
            } else if (typeof data[x] === 'number' && data[x]) {
              // Call Unmasking Number()
            } else if (typeof data[x] === 'object' && data[x] && !(dataBeforeCopy instanceof Date)) {
              data[x] = this.doDecrypt(data[x], ignore);
            }
          }
        }
        return false;
      });
      return data;
    } else if (typeof dataBeforeCopy === 'string') {
      const data = this.decryptascii(dataBeforeCopy);
      return data;
    }
  }

  private maskingNumber(number: any) {
    const numberString = String(number);
    const list = numberString.split('');
    return Number(
      list
        .map((data) => {
          if (data === '.') {
            return '.';
          } else {
            return String(Number(data) + 22);
          }
        })
        .join(''),
    );
  }

  private unmaskingNumber(number: any) {
    const numberString = String(number);
    const list = numberString.split('.');
    return Number(
      list
        .map((data) => {
          const segment = data.split('').reduce((s, c) => {
            const l = s.length - 1;
            s[l] && s[l].length < 2 ? (s[l] += c) : s.push(c);
            return s;
          }, []);
          return segment
            .map((x) => {
              return x - 22;
            })
            .join('');
        })
        .join('.'),
    );
  }
}
