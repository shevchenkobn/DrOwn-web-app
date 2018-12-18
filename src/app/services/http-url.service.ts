import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpUrlService {
  public readonly baseUrl: string;

  constructor() {
    if (environment.host.endsWith('/') || environment.apiRoot.endsWith('/')) {
      throw new TypeError('Path parts mustn\'t end with slashes');
    }
    this.baseUrl = `${environment.host}${environment.apiRoot}`;
  }

  getUrl(url: string) {
    if (url.startsWith('/')) {
      throw new TypeError('Path parts mustn\'t start with slash');
    }
    return this.baseUrl + url;
  }
}
