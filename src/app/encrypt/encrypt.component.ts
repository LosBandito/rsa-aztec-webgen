import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { CookieService } from 'ngx-cookie-service';
import bwipjs from 'bwip-js';


@Component({
  selector: 'app-encrypt',
  templateUrl: './encrypt.component.html',
  styleUrls: ['./encrypt.component.css']
})
export class EncryptComponent {
  publicKey: string ='';
  privateKey: string = '';
  barcodeImage: string= '';

  message: any = '';

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  keygen() {
    this.http.get<{publicKey: string, privateKey: string}>('http://localhost:5000/keygen')
      .subscribe(
        response => {
          this.privateKey=response.privateKey;
          this.publicKey=response.publicKey;

          // Set cookies with 1 day of expiry
          this.cookieService.set('publicKey', this.publicKey, 1);
          this.cookieService.set('privateKey', this.privateKey, 1);
        },
        error => {
          console.log(error);
        }
      );
  }

  encrypt() {
    const url = 'http://127.0.0.1:5000/encrypt';
    const publicKey = this.cookieService.get('publicKey');
    const data = {
      publicKey: publicKey,
      message: 'Hello World'
    };
    this.http.post(url, data).subscribe(response => {
      this.message = response;
      // Assuming that the response body has a `ciphertext` property.
      this.createBarcode(this.message?.ciphertext);
    }, error => {
      console.error('Error:', error);
    });
  }

  createBarcode(text: string) {
    const canvas = document.createElement('canvas');
    bwipjs.toCanvas(canvas, {
      bcid: 'azteccode',
      text: text,
      scale: 3,
    });

    this.barcodeImage = canvas.toDataURL();
  }



  deleteCookies() {
    this.cookieService.delete('publicKey');
    this.cookieService.delete('privateKey');
  }
}
