import axios, { AxiosRequestConfig } from 'axios';
import * as url from 'url';
import { ConfigManager } from '..';
import { HTTPResponse, Profile } from '../models/models';
import { HTTPError } from './error';
import { Logger } from './log';
import { secureStore } from './secure-store';
import * as fs from 'fs-extra';
import { Transform } from 'stream';
import path = require('path');
import { getProgressBar } from './ux/progress';
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
    let options = HTTPRequest.addHttpOptions();
    return axios.create(options);
  }

  static addHttpOptions(options: AxiosRequestConfig = {}) {
    let proxy = HTTPRequest.getProxy();

    if (proxy) {
      options.proxy = proxy;
    }

    options.headers = options.headers || {};
    options.headers['User-Agent'] = pkg.name + '/' + pkg.version;
    options.headers.Connection = options.headers.Connection || 'close';

    options.timeout = 30000;

    options.validateStatus = () => {
      return true;
    };

    return options;
  }

  /**
   * Make HTTP Request and get a response
   * @param url
   * @param options
   * @param data
   * @returns
   */
  static async doRequest(url: string, options: AxiosRequestConfig = {}, data?: any) {
    options = HTTPRequest.addHttpOptions(options);

    if (data) {
      options.data = data;
    }

    const responseAxios = await axios(url, options);
    if (responseAxios.status < 200 || responseAxios.status > 299) {
      throw new HTTPError(`Failed to call ${url}`, responseAxios.status, responseAxios.data, responseAxios.headers);
    }

    const response = {} as HTTPResponse;
    response.body = '';
    response.statusCode = responseAxios.status;
    response.headers = responseAxios.headers;
    response.body = responseAxios.data;

    return response;
  }

  static async download(
    url: string,
    pathToStore: string,
    showProgressBar: boolean = true,
    options: AxiosRequestConfig = {}
  ) {
    return new Promise(async (resolve, reject) => {
      let stream = fs.createWriteStream(pathToStore);
      let len = 0;
      let bar: any;

      options.responseType = 'stream';
      options.maxContentLength = options.maxContentLength || Infinity;
      let response = await HTTPRequest.doRequest(url, options);
      let totalLen = response.headers['content-length'];

      if (showProgressBar) {
        let getProgressBar = (await import('./ux/index')).ux.getProgressBar;
        bar = await getProgressBar(`:bar :percent | :currLen/${HTTPRequest.readableSize(totalLen)}`, totalLen);
      }

      response.body.pipe(stream);

      if (showProgressBar) {
        response.body.on('data', (chunk: any) => {
          len = len + chunk.length;
          bar.tick(chunk.length, { currLen: HTTPRequest.readableSize(len).split(' ')[0] });
        });
      }

      stream.on('error', (err: any) => {
        stream.close();
        reject(err);
      });

      stream.on('finish', () => {
        resolve(true);
      });
    });
  }

  static async upload(
    url: string,
    data: { [key: string]: string },
    options: AxiosRequestConfig = {},
    showProgressBar: boolean = true
  ) {
    const FD = await import('form-data');
    let formData = new FD();
    let bar: any;

    let totalBytes = 0;
    let totalUploadedBytes = 0;

    for (let i in data) {
      if ((await fs.pathExists(data[i])) === true) {
        totalBytes += fs.statSync(data[i]).size;
        let fName = path.basename(data[i]);
        let readStream = fs.createReadStream(data[i]);

        // Intermediate stream
        let uploadStream = new Transform({
          transform: (chunk, encoding, callback) => {
            totalUploadedBytes += chunk.length;
            bar.tick(chunk.length, { uploadedBytes: HTTPRequest.readableSize(totalUploadedBytes).split(' ')[0] });
            callback(undefined, chunk);
          },
        });

        readStream.pipe(uploadStream);

        formData.append(i, uploadStream, { knownLength: fs.statSync(data[i]).size, filename: fName });
      } else {
        formData.append(i, data[i]);
      }
    }

    if (showProgressBar) {
      bar = await getProgressBar(`:bar :percent | :uploadedBytes/${HTTPRequest.readableSize(totalBytes)} `, totalBytes);
    }

    options.method = options.method || 'POST';
    options.headers = { ...options.headers, ...formData.getHeaders() };
    options.maxBodyLength = options.maxBodyLength || Infinity;
    return HTTPRequest.doRequest(url, options, formData);
  }

  private static readableSize(sizeBytes: number) {
    if (sizeBytes < 1024) {
      return sizeBytes + ' Bytes';
    } else {
      const fsKb = Math.round((sizeBytes / 1024) * 100) / 100;
      if (fsKb < 1024) {
        return fsKb + ' KB';
      } else {
        const fsMb = Math.round((fsKb / 1024) * 100) / 100;
        if (fsMb < 1024) {
          return fsMb + ' MB';
        } else {
          const fsGb = Math.round((fsMb / 1024) * 100) / 100;
          return fsGb + ' GB';
        }
      }
    }
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

    if (!rt) {
      Logger.error(`Could not find refresh token for profile ${this.profile.name}`);
    }

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

    this.profile.OAuthTokenExpTime = new Date().getTime() + response.body.expires_in * 1000;

    // Make asynchronous
    new ConfigManager().save();

    secureStore.saveProfileSecrets(this.profile.name, {
      refreshToken: response.body.refresh_token,
      accessToken: response.body.accessToken,
    });

    return response.body.access_token;
  }

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
    return HTTPRequest.doRequest(url, options);
  }

  async download(url: string, pathToStore: string, showProgressBar: boolean = true, options: AxiosRequestConfig = {}) {
    options.headers = options.headers || {};
    options.headers['Authorization'] = 'Bearer ' + (await this.getToken());

    if (this.isCompleteURL(url)) {
      url = this.addRegionToURL(url);
    } else {
      options.baseURL = this.addRegionToURL(options.baseURL || DEFAULT_BASE_URL);
    }

    return HTTPRequest.download(url, pathToStore, showProgressBar, options);
  }
}

export { HTTPRequest, TCRequest };
