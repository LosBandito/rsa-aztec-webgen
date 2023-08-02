import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { CookieService } from 'ngx-cookie-service';
import {Clipboard} from '@angular/cdk/clipboard';
import { LoadingService } from './../loading.service/loading.service';



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

  constructor(private http: HttpClient, private cookieService: CookieService,private clipboard: Clipboard,private loadingService: LoadingService) { }


  ngOnInit(): void {
    if (this.cookieService.check('publicKey')&& this.cookieService.check('privateKey')) {
      this.publicKey = this.cookieService.get('publicKey');
      this.privateKey = this.cookieService.get('privateKey');
    }
  }
  keygen() {
    this.loadingService.show();
    this.http.get<{publicKey: string, privateKey: string}>('http://localhost:5000/keygen')
      .subscribe(
        response => {
          this.privateKey=response.privateKey;
          this.publicKey=response.publicKey;

          // Set cookies with 1 day of expiry
          this.cookieService.set('publicKey', this.publicKey, 1);
          this.cookieService.set('privateKey', this.privateKey, 1);
          this.loadingService.hide()
        },
        error => {
          this.loadingService.hide()
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


    this.loadingService.show()
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
      this.loadingService.hide()
    }, error => {
      console.error('Error:', error);
      this.loadingService.hide()
    });

    this.message = '';
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


  copyPrivate() {
    const pending = this.clipboard.beginCopy(this.privateKey);
    let remainingAttempts = 3;
    const attempt = () => {
      const result = pending.copy();
      if (!result && --remainingAttempts) {
        setTimeout(attempt);
      } else {
        // Remember to destroy when you're done!
        pending.destroy();
      }
    };
    attempt();
  }

  copyPublic() {
    const pending = this.clipboard.beginCopy(this.privateKey);
    let remainingAttempts = 3;
    const attempt = () => {
      const result = pending.copy();
      if (!result && --remainingAttempts) {
        setTimeout(attempt);
      } else {
        // Remember to destroy when you're done!
        pending.destroy();
      }
    };
    attempt();
  }
  deleteCookies() {
    this.loadingService.show()
    this.cookieService.delete('publicKey');
    this.cookieService.delete('privateKey');
    this.publicKey = '';
    this.privateKey = '';
    this.loadingService.hide()
  }
}
