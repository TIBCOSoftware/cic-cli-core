import axios, { AxiosRequestConfig } from 'axios';
import * as url from 'url';
import { ConfigManager } from '..';
import { HTTPResponse, Profile } from '../models/models';
import { Logger } from './log';
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

  /**
   * Make HTTP Request and get a response
   * @param url
   * @param options
   * @param data
   * @returns
   */
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
    const response = {} as HTTPResponse;
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
  private profile: Profile;
  private clientId: string;

  constructor(profile: Profile, clientId: string) {
    this.profile = profile;
    this.clientId = clientId;
  }

  private addRegionToURL(url: string) {
    let u = new URL(url);

    if (this.profile.region != 'us') {
      u.hostname = this.profile.region + '.' + u.hostname;
    }
    return u.href;
  }

  private async renewToken() {
    let rt = await secureStore.getProfileSecrets(this.profile.name, 'refreshToken');
    let cs = await secureStore.getClientSecret();
    if (!cs) {
      Logger.error('Could not find client secret');
    }

    let formURLEncodedData = `refresh_token=${rt}&grant_type=refresh_token`;

    let basicAuth = {
      username: this.clientId,
      password: cs as string,
    };

    let response = await HTTPRequest.doRequest(
      '/idm/v1/oauth2/token',
      { method: 'POST', baseURL: DEFAULT_BASE_URL, auth: basicAuth },
      formURLEncodedData
    );

    if (response.statusCode < 200 || response.statusCode > 299) {
      Logger.error('Failed to renew token\n' + response.body);
    }

    this.profile.OAuthTokenExpTime = new Date().getTime() + response.body.expires_in * 1000;

    // Make asynchronous
    new ConfigManager().save();

    secureStore.saveProfileSecrets(this.profile.name, {
      refreshToken: response.body.refresh_token,
      accessToken: response.body.accessToken,
    });

    return response.body.access_token;
  }

  // TODO: Error handling
  private async getToken() {
    if (this.profile.OAuthTokenExpTime < new Date().getTime()) {
      return await this.renewToken();
    }
    let tokens = await secureStore.getProfileSecrets(this.profile.name);
    if (tokens) return tokens.accessToken;
  }

  async getAxiosClient(baseURL?: string) {
    let client = HTTPRequest.getAxiosClient();
    client.defaults.baseURL = baseURL ? this.addRegionToURL(baseURL) : this.addRegionToURL(DEFAULT_BASE_URL);
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

  /**
   * Make HTTP Request to TIBCO Cloud and get a response
   * @param url
   * @param options
   * @param data
   * @returns
   */
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
