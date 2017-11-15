import {Injectable} from '@angular/core';
import {Http, Headers} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {NgmessageService} from "./ngmessage.service";
import {getAngularEmitterTransformFactory} from "@angular/compiler-cli/src/transformers/node_emitter_transform";
import {Router} from "@angular/router";

@Injectable()
export class RequestService {
  private localhostUrl = 'http://192.168.160.241:8015';
  // options: {'Content-Type': 'application/json'}
  getheaders(options: Headers) {
    const head = new Headers();
    for (const key in options) {
      head.append(key, options[key]);
    }
    return head;
  }

  constructor(private http: Http, private mess: NgmessageService, private router: Router) {
  }

  private handleError(error: any): Promise<any> {
    console.log('请求error:', error);
    // this.mess.remove();
    if (error.status === 404 && error.url === 'http://localhost:4200/login.jsp') {
      this.router.navigate(['/login']);
    }
    return error;
  }

  private requestUrl(prox: string): string {
    return prox;
    // return this.localhostUrl + prox;
  }

  private getQueUrl(prox: string, args?: any): string {
    // return prox;
    // const geturl = 'http://192.168.160.241:8015';
    let nedUrl = this.localhostUrl + prox; // geturl + prox
    if (args) {
      nedUrl += '?' + JSON.stringify(args).replace(/[\" | \{ | \}]/g, '')
        .replace(/\,/g, '&')
        .replace(/\:/g, '=');
    }
    return nedUrl;
  }

  postBodys(args: any) {
    const arr = [];
    let proxstr = '';
    for (const key in args) {
      if (key) {
        arr.push({key: key, value: args[key]});
      }
    }
    for (let i = 0; i < arr.length; i++) {
      if (i === arr.length - 1) {
        proxstr += arr[i].key + '=' + arr[i].value;
      } else {
        proxstr += arr[i].key + '=' + arr[i].value + '&';
      }
    }
    return proxstr;
  }

  // post application/x-www-form-urlencoded;charset=utf-8方法
  postData(prox: string, body?: any, header?: any): Promise<any> {
    return this.http.post(this.requestUrl(prox), this.postBodys(body), {headers: this.getheaders(header)})
      .toPromise()
      .then(response => {
        this.mess.remove();
        return response.json();
      })
      .catch((error) => {
        this.mess.remove();
        if (error.status === 404 && error.url === 'http://localhost:4200/login.jsp') {
          this.mess.create('error', '页面过期，请重新登录！');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2500);
        }
        return error;
      });
  }

  // get方法
  getData(prox: string, body?: any): Promise<any> {
    return this.http.get(this.getQueUrl(prox, body)).toPromise()
      .then(response => {
        this.mess.remove();
        return response.json();
      })
      .catch(this.handleError);
  }
}
