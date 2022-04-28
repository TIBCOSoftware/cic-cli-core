/**
 * Copyright 2022. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */
import { expect } from '@oclif/test';
import * as chai from 'chai';
import * as sinon from 'sinon';
const MD5String = require('../helper/MD5String');
import * as multipart from 'parse-multipart-data';
import * as chaiAsPromised from 'chai-as-promised';
import { HTTPError } from '../../src/index';
import * as nock from 'nock';
import { HTTPRequest, TCRequest } from '../../src/utils/request';
import * as tmp from 'tmp';
import * as md5 from 'md5-file';
import * as os from 'os';

import * as path from 'path';
chai.use(chaiAsPromised);
let testUrl = 'http://www.myapi.com';
describe('utils', () => {
  describe('HTTP Requests', () => {
    describe('doRequest', () => {
      it('send GET request and receive data', async () => {
        nock(testUrl).get('/tci/v1/apps').reply(200, 'Success');
        let req = new HTTPRequest();
        let resp = await req.doRequest('/tci/v1/apps', { baseURL: testUrl });
        expect(resp.body).to.be.equal('Success');
        expect(resp.statusCode).to.be.equal(200);
      });
      it('override baseURl when complete URL is passed in function parameters', async () => {
        nock('https://www.abc.com').get('/tci/v1/apps').reply(200);
        let req = new HTTPRequest();
        let resp = await req.doRequest('https://www.abc.com/tci/v1/apps', { baseURL: testUrl });
        expect(resp.statusCode).to.be.equal(200);
      });

      it('override options body when it is passed explicitly in function parameters', async () => {
        nock(testUrl)
          .post('/tci/v1/apps')
          .reply(201, function (uri, body) {
            return body;
          });
        let req = new HTTPRequest();
        let resp = await req.doRequest('/tci/v1/apps', { baseURL: testUrl, data: 'node-app' }, 'flogo-app');
        expect(resp.statusCode).to.be.equal(201);
        expect(resp.body).to.be.equal('flogo-app');
      });

      it('throw HTTP Error if client side or server side error', () => {
        nock(testUrl).get('/tci/v1/apps').reply(401, 'Failed');
        let req = new HTTPRequest();
        expect(req.doRequest('/tci/v1/apps', { baseURL: testUrl }))
          .to.be.eventually.rejectedWith(HTTPError)
          .and.has.property('httpCode', 401)
          .and.property('data', 'Failed');
      });
      it('throw Error for a request timeout', async () => {
        nock(testUrl).get('/tci/v1/apps').delay(31000).reply(200, 'Success');
        let req = new HTTPRequest();
        expect(req.doRequest('/tci/v1/apps', { baseURL: testUrl }))
          .to.be.eventually.rejectedWith(Error)
          .and.has.property('message', 'timeout of 30000ms exceeded');
      });
      it('receive appropriate User Agent', async () => {
        let s = nock(testUrl)
          .get('/tci/v1/apps')
          .reply(200, function (uri, body) {
            return this.req.headers['User-Agent'] || this.req.headers['user-agent'];
          })
          .persist(true);

        const pkg = require('../../package.json');
        let req = new HTTPRequest();
        let resp = await req.doRequest('/tci/v1/apps', { baseURL: testUrl });
        expect(resp.body).to.be.equal(` @tibco-software/cic-cli-core/${pkg.version} ${os.platform()} ${os.arch()} `);

        let req2 = new HTTPRequest('show-apps', 'tsc');
        let resp2 = await req2.doRequest('/tci/v1/apps', { baseURL: testUrl });
        expect(resp2.body).to.be.equal(
          `tsc @tibco-software/cic-cli-core/${pkg.version} ${os.platform()} ${os.arch()} show-apps`
        );
        s.persist(false);
      });
    });

    describe('download files', () => {
      it('download json file from a given endpoint', async () => {
        let filePath = path.join(__dirname, '/sample-data.json');
        nock(testUrl).get('/v1/data').replyWithFile(200, filePath);
        const tmpObj = tmp.fileSync();
        let resp = await new HTTPRequest().download('/v1/data', tmpObj.name, { baseURL: testUrl }, false);
        expect(resp).to.be.true;

        expect(cmpFile(__dirname + '/sample-data.json', tmpObj.name)).to.be.true;
      });
      it('throw error when storage location in invalid', async () => {
        let filePath = path.join(__dirname, '/sample-data.json');
        nock(testUrl).get('/v1/data').replyWithFile(200, filePath);

        let req = new HTTPRequest();
        let resp = req.download('/v1/data', path.join('a', 'b', 'c'), { baseURL: testUrl }, false);
        expect(resp).to.be.rejectedWith(Error);
      });
    });

    describe('upload files', () => {
      it('upload json file', async () => {
        nock(testUrl)
          .post('/v1/file')
          .reply(function (u, body) {
            let boundary = this.req.headers['content-type'].split('boundary=')[1];

            let parts = multipart.parse(Buffer.from(body as string, 'utf-8'), boundary);

            if (parts[0].name === 'file' && parts[0].data.toString() === 'ok') {
              return [201];
            }

            if (
              MD5String(parts[1].data.toString()) === md5.sync(path.join(__dirname, './sample-data.json')) &&
              parts[1].name === 'path'
            ) {
              return [201];
            }
            return [400];
          });
        let req = new HTTPRequest();
        let resp = await req.upload(
          '/v1/file',
          { file: 'ok', path: 'file://' + path.join(__dirname, './sample-data.json') },
          { baseURL: testUrl },
          false
        );
        expect(resp.statusCode).to.be.equal(201);
      });
    });

    describe('addHTTPOptions', () => {
      it('get default HTTP Options', () => {
        let req = new HTTPRequest();
        let options = req.addHttpOptions();
        expect(options).to.have.all.keys('timeout', 'headers', 'validateStatus');
        expect(options).to.have.nested.property('headers.Connection', 'close');
        expect(options).to.have.nested.property('headers.User-Agent');
      });
    });
  });

  describe('TIBCO Cloud HTTP Requests', () => {
    describe('getUrlAndOptions', () => {
      it('Add region to the url and token to the header', async () => {
        let req = new TCRequest({ name: 'test', org: 'acme', region: 'eu' }, '');
        sinon.stub(req, 'getValidToken').returns(Promise.resolve('rt.asdf'));

        let { newURL, newOptions } = await req.getUrlAndOptions('https://api.cloud.tibco.com', {});
        expect(newURL).to.be.equal('https://eu.api.cloud.tibco.com/');
        expect(newOptions.headers.Authorization).to.be.equal('Bearer rt.asdf');
      });
      it('Add region to the baseUrl and token to the header', async () => {
        let req = new TCRequest({ name: 'test', org: 'acme', region: 'eu' }, '');
        sinon.stub(req, 'getValidToken').returns(Promise.resolve('rt.asdf'));

        let { newURL, newOptions } = await req.getUrlAndOptions('/v1/tci/apps', {
          baseURL: 'https://api.cloud.tibco.com/',
        });
        expect(newURL).to.be.equal('/v1/tci/apps');
        expect(newOptions.headers.Authorization).to.be.equal('Bearer rt.asdf');
        expect(newOptions.baseURL).to.be.equal('https://eu.api.cloud.tibco.com/');
      });
      it('should not add region to the baseUrl if the region is "us"', async () => {
        let req = new TCRequest({ name: 'test', org: 'acme', region: 'us' }, '');
        sinon.stub(req, 'getValidToken').returns(Promise.resolve('rt.asdf'));

        let { newURL, newOptions } = await req.getUrlAndOptions('/v1/tci/apps', {
          baseURL: 'https://api.cloud.tibco.com/',
        });
        expect(newURL).to.be.equal('/v1/tci/apps');
        expect(newOptions.headers.Authorization).to.be.equal('Bearer rt.asdf');
        expect(newOptions.baseURL).to.be.equal('https://api.cloud.tibco.com/');
      });
      it('should not add region to the url if the region is "us"', async () => {
        let req = new TCRequest({ name: 'test', org: 'acme', region: 'us' }, '');
        sinon.stub(req, 'getValidToken').returns(Promise.resolve('rt.asdf'));

        let { newURL, newOptions } = await req.getUrlAndOptions('https://api.cloud.tibco.com/', {});
        expect(newURL).to.be.equal('https://api.cloud.tibco.com/');
        expect(newOptions.headers.Authorization).to.be.equal('Bearer rt.asdf');
      });
      it('should add baseUrl if only path is passed as parameters', async () => {
        let req = new TCRequest({ name: 'test', org: 'acme', region: 'eu' }, '');
        sinon.stub(req, 'getValidToken').returns(Promise.resolve('rt.asdf'));

        let { newURL, newOptions } = await req.getUrlAndOptions('/v1/tci/apps', {});
        expect(newOptions.baseURL).to.be.equal('https://eu.api.cloud.tibco.com/');
        expect(newOptions.headers.Authorization).to.be.equal('Bearer rt.asdf');
      });
    });
  });
});

function cmpFile(pathA: string, pathB: string) {
  return md5.sync(pathA) === md5.sync(pathB);
}
