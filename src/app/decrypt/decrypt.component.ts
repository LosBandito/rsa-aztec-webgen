import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { CookieService } from 'ngx-cookie-service';
import bwipjs from 'bwip-js';

@Component({
  selector: 'app-decrypt',
  templateUrl: './decrypt.component.html',
  styleUrls: ['./decrypt.component.css']
})
export class DecryptComponent {
  constructor(private http: HttpClient, private cookieService: CookieService) { }

  privateKey: string = '';
  decodedText: string = '';
  decryptedText: string = '';
    onFileSelected(event: Event) {
      const target = event.target as HTMLInputElement;
      const files = target.files;

      if (files && files.length > 0) {
        const file: File = files[0];

        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Image = (e.target as FileReader).result;

          this.http.post<{result: string}>('http://localhost:5000/decodeAztec', {image: base64Image}).subscribe(response => {
            this.decodedText = response.result;  // here we use `result` as it's returned by the endpoint
            this.decrypt(this.decodedText);
          }, error => {
            console.error('Error:', error);
          });


        };

        reader.readAsDataURL(file);
      }
    }



    decrypt(ciphertext: string) {
      this.privateKey = this.cookieService.get('privateKey'); // Retrieve privateKey from cookies
      const data = {
        privateKey: this.cookieService.get('privateKey'),
        ciphertext: ciphertext
      };

      console.log(data);

      this.http.post<{message: string}>('http://localhost:5000/decrypt', data).subscribe(response => {
        this.decryptedText = response.message;
      }, error => {
        console.error('Decryption error:', error);
      });
    }
}
