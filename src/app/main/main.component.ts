import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent  implements  OnInit{

  constructor(private http: HttpClient) { }

  publicKey: string ='';
  privateKey: string = '';
  ngOnInit() {
  }

  keygen() {
    this.http.get<{publicKey: string, privateKey: string}>('http://localhost:5000/keygen')
      .subscribe(
        response => {
          this.privateKey=response.privateKey;
          this.publicKey=response.publicKey;
        },
        error => {
          console.log(error);
        }
      );
  }


  encrypt() {
    const url = 'http://127.0.0.1:5000/decrypt';
    const data = {
        publicKey:'',
        message: 'Hello World'
    };
    this.http.post(url, data).subscribe(response => {
      console.log(response);
    }, error => {
      console.error('Error:', error);
    });

  }
  decrypt() {
    const url = 'http://127.0.0.1:5000/decrypt';
    const data = {
      privateKey: '-----BEGIN RSA PRIVATE KEY-----\nMIIEqAIBAAKCAQEAslWbVTLR4xrsOtMvwZNSVFKAVWEvVA1UuuLj+9h5/67NV5ZM\nVdkqthSSNViSd2VcnMd+rfaDAg632g5VbuNROUcXI7VRtJY9hlGxs4Cp/IKwXbMu\nzbQV/kd3uru4X6Mau9x2RUt7G9RYv5kaHo8Y2EJF8+3KacLT4yonplQtPYFbxnJC\n8l0EnM1LHdSkawCYzuBA1mURGanhT5JZ2EMh7x0HJfDx8wMF2RuPx2jVR3Pcqr/Z\nj0sPmVMLygH49QQ5U8e1aflqbVaWCxthruL34V72Y0+Ni2ukkMMgCllVi+iOOMTa\nDgn4UA6ck7coKdyjFxu5BX44cVjS29cQwevWxQIDAQABAoIBADF8g/AufAOzUt44\nAEaNJQl1I1uN7l46nMqHb5BRT/ldfmnRsTkZXDrOlovrGim7nOl8inCnuU722pnN\n5HMy7TUhvxAPnq6oCkadoNwY1hLWCS7XLCO0122KU3Uj5lPTpPWAhelQusbMNBxm\n1dKpDtHkAhlgYQzcHT9KX4jIfqXalEdAgCaKvs1kzH9n1GaiJ+fuQjFTFMTJLcFG\ns0Lkg8jSHNCLvwbPK9HosDkbWS639xFkfAVM34x+xoFo7LypYaY8ORlLJRWAnN9J\niodHHgUka40T9gV/Ft7G5yz8FaQiF3qL6fXhKjfYx9A5bfWFgr8h/jj1EbfBdfL0\nLnLZxQECgYkA+DNgrCf7028HWFrnCfi3Wr6k0akRDj2rLyku1PeOGYgzHD2cM9qs\nWZs4VlVPxTg76mMKR1ix+eknQtGSHj1psFlYpSOaaFBiUlIA6qrZNWrt2u+30k0e\nFv2BSQLMFu54UIBs/vMJsahNqIIQo+kfR5x6wmTy2b2QQjzuChv/OMJ7V2/vsyjf\nJQJ5ALfwMpoqV9rZ4xWNRH/sPYHJ+0yRlnJxvIBK7jsoS2DzamReZduvDlli+0O0\ngusQSHB+WoJVWWe1VuhT0yw+KAvUyOXKAF+b2WFc+3NPf0jGI9tZNU1tjJt5nymj\nd23YpxrjnMTnM6MxvCtSwMcsLKIy2wBSJJPXIQKBiBH5VoThGGGFZtjFLHoSYuTV\nbYYpYizP1nfB2bxeeRHsRRdEdu1iZpzOmtPVtcMogV5F8dac27anZcp29sft1puI\nvNyoqWPoflZLzfkwii5OIg960KsQHp+3mAc7hqAagOgDhOEppIgTEhyj3qSgGz3K\nXTF6sgOGsM27L9nXkTIBE4GPf6JP0WkCeEeceWbx81BeIf3jCPcw12VvaKoPyF34\nD+Z2xbc8YdR2EEbRRaC4z8JXOfHLFmlD5p/9YWl6pxssS5CaCg4giODKUAi+k1Sl\nzYUNeUwUeD6x/YXJfmoNq39gY2oHnVijz7M1SHSUetMfat4HEsy4Uww29nJyiJES\nYQKBiA5NgYkp+B5ndlEmOai0kJRuj/6B44SSEzqZvDEiwMGYDE5Nr9NiKjDjImZS\nazULLl6RuUUthhapHQbHNi39MeeP8M5KGFiopbxjSR7JgFQKookk7NbDVJcq/6tk\nNaN5EEY81OzN6RKDjJQIJ8ldvcawnz2mUdHC1bwaL2dvdBI58TdxYUmV5T4=\n-----END RSA PRIVATE KEY-----\n',
      ciphertext: 'a05874e012d9c0d12cd77fa5ab764d75402a5e9c1487ef2d40dcc760b786d6c046a17064b98866080273fee6f862d1c75a4dac6e1198d621383f30dfc522194d1f318ea29fd521538f289b1b232282da881f13c89f0dc24eae1e6f27947f04d7bb70aad1c74a47e00ec900bf6b3e268cc1d73c78d1ddcbf76c535c823984fb1b8c26736d68043070fb657b30522c51457bb50c980ee39e8429effcb6cd7dbfc8ba7299b6769ed865b9d396776b2fbd1f72ee6ded56d2aacf1146341db2753c5067669a696f6cfc18a8486df842f5b0666f89ec014f310941f80f85994a1066f5ee29baa33d1ddd912db6e2e33409c4e29622520d17347439a98744648c8fb29c'
    };
    this.http.post(url, data).subscribe(response => {
      console.log(response);
    }, error => {
      console.error('Error:', error);
    });
  }

}
