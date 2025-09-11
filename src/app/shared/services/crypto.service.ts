import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private static encrText = 'rNZSYvtgfyUPx75Okf6ArEx2SiktAW9j';
  public static encr(data) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), this.encrText).toString();
    } catch (e) {
      console.log(e);
    }
  }
  public static decr(data) {
    try {
      const bytes = CryptoJS.AES.decrypt(data, this.encrText);
      if (bytes) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
      console.log(e);
    }
  }

  /* Map với thuật toán trong file AES.java của hieutv26 */
  public static encrAesEcb(data) {
    try {
      return CryptoJS.AES.encrypt(data, CryptoJS.enc.Base64.parse("8Js+s2i50melS4h42kbJdg=="), {
        mode: CryptoJS.mode.ECB
      }).toString().replace('+', '-').replace('/', '_').replace("%", "%25").replace("\n", "%0A");
    } catch (e) {
      console.log(e);
    }
  }
}
