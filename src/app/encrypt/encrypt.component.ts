import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { CookieService } from 'ngx-cookie-service';




@Component({
  selector: 'app-encrypt',
  templateUrl: './encrypt.component.html',
  styleUrls: ['./encrypt.component.css']
})



export class EncryptComponent {



  publicKey: string ='';
  privateKey: string='';
  barcodeImage: string | ArrayBuffer | null= '';

  message: any = '';

  constructor(private http: HttpClient, private cookieService: CookieService) { }


  ngOnInit(): void {
    if (this.cookieService.check('publicKey')&& this.cookieService.check('privateKey')) {
      this.publicKey = this.cookieService.get('publicKey');
      this.privateKey = this.cookieService.get('privateKey');
    }
  }
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



    if (!this.message && this.message.length === 0) {
      alert('Please enter a message')
      return;
    }
    if (!this.cookieService.check('publicKey')&& !this.cookieService.check('privateKey')) {
      alert('Please generate a key pair first')
      return;
    }



    const url = 'http://127.0.0.1:5000/encrypt';
    const publicKey = this.cookieService.get('publicKey');
    const data = {
      publicKey: publicKey,
      message: this.message
    };
    this.http.post(url, data).subscribe(response => {
      this.message = response;
      // Assuming that the response body has a `ciphertext` property.
      this.generateBarcode(this.message?.ciphertext);
    }, error => {
      console.error('Error:', error);
    });
  }

  generateBarcode(text: string) {
    const url = 'http://127.0.0.1:5000/generate_aztec';
    const data = { text: text };
    this.http.post(url, data, { responseType: 'blob' }).subscribe(response => {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.barcodeImage = reader.result;
      };
      if (response) {
        reader.readAsDataURL(response);
      }
    }, error => {
      console.error('Error:', error);
    });
  }


  deleteCookies() {
    this.cookieService.delete('publicKey');
    this.cookieService.delete('privateKey');
  }
}
