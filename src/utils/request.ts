/**
 * Copyright 2022. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

import axios, { AxiosRequestConfig } from 'axios';
import * as url from 'url';
import { HTTPResponse, Profile, ProfileSecrets } from '../models/models';
import { HTTPError } from './error';
import { Logger } from './log';
import { secureStore } from './secure-store';
import * as fs from 'fs-extra';
import * as os from 'os';
import path = require('path');
import { CLIBaseError } from '..';
const pkg = require('../../package.json');

const CORE_CONFIG = require('./../configs-for-core/config.json');
const DEFAULT_BASE_URL = CORE_CONFIG.HOSTS.REQUEST_APIS;
const REFRESH_TOKEN_BASE_URL = CORE_CONFIG.HOSTS.TIBCO_ACC;
const REQ_TIMEOUT = 30000;

/**
 * Use this class to make any HTTP requests.
 */
class HTTPRequest {
  /**
   * Instantiate HTTPRequest object, parameters are optional.
   * @param commandName Command which makes an HTTP request.
   * @param pluginName Plugin to which command belongs.
   */
  constructor(public commandName?: string, public pluginName?: string) {}

  // Not in use, proxies are handled ootb by axios
  private getAxiosProxy() {
    let proxy = process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy;
    if (!proxy) {
      return;
    }

    let axiosProxy: any;
    let proxyInfo = new url.URL(proxy);

    axiosProxy = {
      host: proxyInfo.host,
      port: proxyInfo.port,
    };

    // proxyInfo.protocol contains "http:"
    if (proxyInfo.protocol) {
      axiosProxy.protocol = proxyInfo.protocol.split(':')[0];
    }

    if (proxyInfo.username && proxyInfo.password) {
      axiosProxy.auth = {} as any;
      axiosProxy.auth.username = proxyInfo.username;
      axiosProxy.auth.password = proxyInfo.password;
    }
    return axiosProxy;
  }
  /**
   * Creates Axios client with common options.
   * @returns Axios client.
   */
  getAxiosClient() {
    let options = this.addHttpOptions();
    return axios.create(options);
  }

  /**
   * Add common options to the AxiosRequestConfig.
   * @param options Options object where common options can be added.
   * @returns  Axios options object
   */
  addHttpOptions(options: AxiosRequestConfig = {}) {
    options.headers = options.headers || {};
    options.headers['User-Agent'] = `${this.pluginName || ''} ${pkg.name}/${
      pkg.version
    } ${os.platform()} ${os.arch()} ${this.commandName || ''}`;
    options.headers.Connection = options.headers.Connection || 'close';

    options.timeout = options.timeout || REQ_TIMEOUT;

    options.validateStatus = () => {
      return true;
    };

    return options;
  }

  /**
   * Make HTTP Request and get a response.
   * @param url Url where to make a request.
   * @param options Options along with request.
   * @param data Data to be sent with request. (Note: if data is passed to the function and method not specified then POST method is considered as default)
   * @returns response of HTTP Request.
   */
  async doRequest(url: string, options: AxiosRequestConfig = {}, data?: any) {
    options = this.addHttpOptions(options);

    if (data) {
      options.data = data;
    }

    if (options.data && !options.method) {
      options.method = 'POST';
    }

    const responseAxios = await axios(url, options);
    if (responseAxios.status < 200 || responseAxios.status > 399) {
      throw new HTTPError(
        `Failed to call path ${url} with \n Status ${responseAxios.status} \n Response \n ${responseAxios.data}`,
        responseAxios.status,
        responseAxios.data,
        responseAxios.headers
      );
    }

    const response = {} as HTTPResponse;
    response.body = '';
    response.statusCode = responseAxios.status;
    response.headers = responseAxios.headers;
    response.body = responseAxios.data;

    return response;
  }

  /**
   * Downloads file from a url.
   * @param url Url from where file needs to be downloaded.
   * @param pathToStore Location where file to be stored.
   * @param options HTTP options.
   * @param showProgressBar To show progress bar on terminal.
   * @returns True if file downloaded succesfully else will throw some error.
   */
  async download(url: string, pathToStore: string, options: AxiosRequestConfig = {}, showProgressBar = false) {
    options.responseType = 'stream';
    options.maxContentLength = options.maxContentLength || Infinity;

    let response = await this.doRequest(url, options);

    let totalLen = response.headers['content-length'];
    if (!totalLen) {
      if (showProgressBar === true) {
        Logger.warn('Could not show progress bar since no content length provided');
      }
      showProgressBar = false;
    }
    let writer = fs.createWriteStream(pathToStore);

    if (showProgressBar) {
      let getProgressBar = (await import('./ux/index')).getProgressBar;
      let bar = await getProgressBar(`:bar :percent | :currLen/${this.readableSize(totalLen)}`, totalLen);
      let len = 0;
      response.body.on('data', (chunk: any) => {
        len = len + chunk.length;
        bar.tick(chunk.length, { currLen: this.readableSize(len).split(' ')[0] });
      });
    }

    response.body.pipe(writer);

    return new Promise<boolean>((resolve, reject) => {
      writer.on('finish', () => {
        resolve(true);
      });
      writer.on('error', (err) => {
        reject(err);
      });
    });
  }

  /**
   * Uploads file to a url.
   * @param url Url where file to be uploaded.
   * @param data Multipart form data in simple \{key: value\} format.
   * @param options HTTP options.
   * @param showProgressBar To show progress bar on the terminal.
   * @returns HTTP response.
   */
  async upload(
    url: string,
    data?: { [key: string]: string },
    options: AxiosRequestConfig = {},
    showProgressBar = false
  ) {
    data = data || options.data;
    const FD = await import('form-data');
    let formData = new FD();

    for (let i in data) {
      if (data[i].trim().startsWith('file://')) {
        let fPath = data[i].trim().split('file://')[1];

        if (!fs.pathExistsSync(fPath)) {
          throw new Error(`Invalid file path`);
        }

        if (fs.statSync(fPath).isDirectory()) {
          throw new Error('Should specify filename in a path');
        }
        let fName = path.basename(fPath);
        let readStream = fs.createReadStream(fPath);
        formData.append(i, readStream, { knownLength: fs.statSync(fPath).size, filename: fName });
      } else {
        formData.append(i, data[i]);
      }
    }

    if (showProgressBar) {
      let totalUploadedBytes = 0;
      let totalBytes = formData.getLengthSync();
      let getProgressBar = (await import('./ux/index')).getProgressBar;
      let bar = await getProgressBar(`:bar :percent | :uploadedBytes/${this.readableSize(totalBytes)} `, totalBytes);
      formData.on('data', (chunk) => {
        totalUploadedBytes += chunk.length;
        bar.tick(chunk.length, { uploadedBytes: this.readableSize(totalUploadedBytes).split(' ')[0] });
      });
    }

    options.method = options.method || 'POST';
    options.headers = { ...options.headers, ...formData.getHeaders() };
    options.maxBodyLength = options.maxBodyLength || Infinity;
    return this.doRequest(url, options, formData);
  }

  private readableSize(sizeBytes: number) {
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

/**
 * Use this class to make requests to TIBCO cloud.<br>
 * It will add token to the authorisation header before making request.<br>
 * https://api.cloud.tibco.com is considered as a base URL when you passes only path to the functions.<br>
 * For E.g:
 * ```ts
 * req.doRequest('cic/v1/apps/',{},'mydata') // URL would be https://api.cloud.tibco.com/cic/vi/apps.
 * req.doRequest('http://mydomain.com/cic/v1/apps/',{},'mydata') // URL would be http://mydomain.com/cic/v1/apps/.
 *
 * // It will add region to the url if as per region in a profile
 * req.doRequest('/cic/v1/apps/',{},'mydata'); //if prof has eu region then URL would be https://eu.api.cloud.tibco.com/cic/v1/apps
 * ```
 */
class TCRequest {
  private profile: Profile;
  private clientId: string;
  private httpRequest: HTTPRequest;
  /**
   *
   * @param profile Profile to be considered while making request.
   * @param clientId ClientId of a CLI.
   * @param commandName Command which needs to make HTTP request.
   * @param pluginName Plugin to which command belongs.
   */
  constructor(profile: Profile, clientId: string, commandName?: string, pluginName?: string) {
    this.profile = profile;
    this.clientId = clientId;
    this.httpRequest = new HTTPRequest(commandName, pluginName);
  }

  private addRegionToURL(url: string) {
    let u = new URL(url);

    if (this.profile.region != 'us') {
      u.hostname = this.profile.region + '.' + u.hostname;
    }
    return u.href;
  }

  private async renewToken(secret: ProfileSecrets) {
    let { refreshToken: rt, refreshTokenExp: rtExp } = secret;
    let cs = await secureStore.getClientSecret();

    if (rtExp < new Date().getTime()) {
      throw new CLIBaseError(`Refresh token expired for profile ${this.profile}, try creating new profile`);
    }

    if (!rt) {
      throw new CLIBaseError(`Could not find refresh token for profile ${this.profile.name}`);
    }

    if (!cs) {
      throw new CLIBaseError('Could not find client secret');
    }

    let formURLEncodedData = `refresh_token=${rt}&grant_type=refresh_token`;

    let basicAuth = {
      username: this.clientId,
      password: cs as string,
    };

    let response = await this.httpRequest.doRequest(
      '/idm/v1/oauth2/token',
      { method: 'POST', baseURL: REFRESH_TOKEN_BASE_URL, auth: basicAuth },
      formURLEncodedData
    );

    let atExp = new Date().getTime() + response.body.expires_in * 1000;
    rtExp = new Date().getTime() + response.body.refresh_token_expires_in * 1000;

    secureStore.saveProfileSecrets(this.profile.name, {
      refreshToken: response.body.refresh_token,
      accessToken: response.body.access_token,
      accessTokenExp: atExp,
      refreshTokenExp: rtExp,
    });

    return response.body.access_token;
  }

  /**
   * Validate existing token, will refresh if expired.
   * @returns Valid Token.
   */
  async getValidToken() {
    let secret = await secureStore.getProfileSecrets(this.profile.name);
    if (secret.accessTokenExp < new Date().getTime()) {
      Logger.warn('Refreshing token');
      return await this.renewToken(secret);
    }
    return secret.accessToken;
  }
  /**
   * Returns axios client with common options.
   * @param baseURL Base URL to be considered for this client. It will add region to the endpoint based on user profile.
   * @returns Axios client.
   */
  async getAxiosClient(baseURL?: string) {
    let client = this.httpRequest.getAxiosClient();
    client.defaults.baseURL = baseURL ? this.addRegionToURL(baseURL) : this.addRegionToURL(DEFAULT_BASE_URL);
    client.defaults.headers.common['Authorization'] = 'Bearer ' + (await this.getValidToken());
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
   * Make HTTP Request to TIBCO Cloud and get a response.
   * @param url Url where to make request, region is added to th url as per profile.If only is passes then `https://api.cloud.tibco.com` is considered as a baseUrl.
   * @param options HTTP options.
   * @param data Data to be sent. If data is passed and no method specified then POST method id considered.
   * @returns Provides response for HTTP Request.
   */
  async doRequest(url: string, options: AxiosRequestConfig = {}, data?: any) {
    let { newURL, newOptions } = await this.getUrlAndOptions(url, options);
    return this.httpRequest.doRequest(newURL, newOptions, data);
  }

  /**
   * Downloads file from a url.
   * @param url Url from where file needs to be downloaded.
   * @param pathToStore Location where file to be stored.
   * @param options HTTP options.
   * @param showProgressBar To show progress bar on the terminal.
   * @returns true if file downloaded succesfully else will throw some error.
   */
  async download(url: string, pathToStore: string, options: AxiosRequestConfig = {}, showProgressBar = true) {
    let { newURL, newOptions } = await this.getUrlAndOptions(url, options);
    return this.httpRequest.download(newURL, pathToStore, newOptions, showProgressBar);
  }

  /**
   * Uploads file to a url.
   * @param url Url where file to be uploaded.
   * @param data Multipart form data in simple \{key: value\} format.
   * @param options HTTP options.
   * @param showProgressBar To show progress bar on the terminal.
   * @returns HTTP response.
   */
  async upload(
    url: string,
    data?: { [key: string]: string },
    options: AxiosRequestConfig = {},
    showProgressBar = false
  ) {
    let { newURL, newOptions } = await this.getUrlAndOptions(url, options);
    return this.httpRequest.upload(newURL, data, newOptions, showProgressBar);
  }

  async getUrlAndOptions(url: string, options: AxiosRequestConfig) {
    options.headers = options.headers || {};

    if (!options.headers['Authorization']) {
      options.headers['Authorization'] = 'Bearer ' + (await this.getValidToken());
    }

    if (this.isCompleteURL(url)) {
      url = this.addRegionToURL(url);
    } else {
      options.baseURL = this.addRegionToURL(options.baseURL || DEFAULT_BASE_URL);
    }

    return { newURL: url, newOptions: options };
  }
}

export { HTTPRequest, TCRequest };
