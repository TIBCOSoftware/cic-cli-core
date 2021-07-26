import axios, { AxiosRequestConfig } from 'axios';
import * as url from 'url';
import { Profile } from '../models/models';
import { secureStore } from './secure-store';
const pkg = require('../../package.json');

const DEFAULT_BASE_URL = 'https://api.cloud.tibco.com';

class HTTPRequest {
  private static getProxy() {
    if (!process.env.HTTPS_PROXY) {
      return;
    }

    let proxy: any;
    let proxyInfo = new url.URL(process.env.HTTPS_PROXY);

    proxy = {
      host: proxyInfo.host,
      port: proxyInfo.port,
    };

    if (proxyInfo.protocol) {
      proxy.protocol = proxyInfo.protocol;
    }

    if (proxyInfo.username && proxyInfo.password) {
      proxy.auth = {} as any;
      proxy.auth.username = proxyInfo.username;
      proxy.auth.password = proxyInfo.password;
    }
    return proxy;
  }

  static getAxiosClient() {
    let options: AxiosRequestConfig = {};

    let proxy = HTTPRequest.getProxy();
    if (proxy) {
      options.proxy = proxy;
    }

    options.headers = {
      'User-Agent': pkg.name + '/' + pkg.version,
      Connection: 'close',
    };

    options.timeout = 30000;

    options.validateStatus = (status: any) => {
      return true;
    };

    return axios.create(options);
  }

  static async doRequest(url: string, options: AxiosRequestConfig = {}, data?: any) {
    let proxy = HTTPRequest.getProxy();

    if (proxy) {
      options.proxy = proxy;
    }

    options.headers = options.headers || {};
    options.headers['User-Agent'] = pkg.name + '/' + pkg.version;
    options.headers.Connection = options.headers.Connection || 'close';

    if (data) {
      options.data = data;
    }

    options.validateStatus = () => {
      return true;
    };

    const responseAxios = await axios(url, options);
    const response = {} as any;
    response.body = '';
    response.statusCode = responseAxios.status;
    response.headers = responseAxios.headers;
    try {
      response.body = JSON.parse(responseAxios.data);
    } catch (e) {
      response.body = responseAxios.data;
    }
    return response;
  }
}

class TCRequest {
  profile: Profile;

  constructor(profile: Profile) {
    this.profile = profile;
  }

  private getBaseURL() {
    let prefix = '';

    if (this.profile.region != 'us') {
      prefix = this.profile.region + '.';
    }

    return 'https://' + prefix + 'api.cloud.tibco.com';
  }

  private addRegionToURL(url: string) {
    let u = new URL(url);

    if (this.profile.region != 'us') {
      u.hostname = this.profile.region + '.' + u.hostname;
    }
    return u.href;
  }

  // TODO: Error handling
  // TODO: Check token expiry & refresh token
  private async getToken() {
    let tokens = await secureStore.getSecrets(this.profile.name);
    if (tokens) return tokens.accessToken;
  }

  async getAxiosClient(baseURL?: string) {
    let client = HTTPRequest.getAxiosClient();
    client.defaults.baseURL = baseURL ? this.addRegionToURL(baseURL) : this.getBaseURL();
    client.defaults.headers['Authorization'] = 'Bearer ' + (await this.getToken());
    return client;
  }

  private isCompleteURL(url: string) {
    try {
      new URL(url);
    } catch (err) {
      return false;
    }
    return true;
  }

  async doRequest(url: string, options: AxiosRequestConfig = {}, data?: any) {
    options.headers = options.headers || {};
    options.headers['Authorization'] = 'Bearer ' + (await this.getToken());

    if (this.isCompleteURL(url)) {
      url = this.addRegionToURL(url);
    } else {
      options.baseURL = this.addRegionToURL(options.baseURL || DEFAULT_BASE_URL);
    }

    if (data) {
      options.data = data;
    }
    return await HTTPRequest.doRequest(url, options);
  }
}

export { HTTPRequest, TCRequest };
