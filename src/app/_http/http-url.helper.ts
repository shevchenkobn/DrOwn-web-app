import { environment } from '../../environments/environment';

export abstract class HttpUrlHelper {
  private static _baseUrl: string;

  public get baseUrl () {
    return HttpUrlHelper._baseUrl;
  }

  static initialize() {
    if (environment.host.endsWith('/') || environment.apiRoot.endsWith('/')) {
      throw new TypeError('Path parts mustn\'t end with slashes');
    }
    if (!environment.apiRoot.startsWith('/')) {
      throw new TypeError('API root must start with a slash');
    }
    this._baseUrl = `${environment.host}${environment.apiRoot}`;
  }

  static getUrl(url: string) {
    if (!url.startsWith('/')) {
      return this._baseUrl + '/' + url;
    }
    return this._baseUrl + url;
  }
}
HttpUrlHelper.initialize();
