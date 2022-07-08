import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as keytar from 'keytar';
import * as sinon from 'sinon';
import { Logger } from '../../src';
import { secureStore } from '../../src/utils/secure-store';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('secureStore', () => {
  describe('secureStore.getProfileSecrets', () => {
    it('returns profile if exists', async () => {
      let expectedResult = {
        accessToken: 'CIC~bslDXuZuE5ssdTBxciONpqqq',
        refreshToken: 'rt.maPo0P20exampleG03muqweTd',
        accessTokenExp: 1647622893976,
        refreshTokenExp: 1648744609976,
      };

      let stub = sinon
        .stub(keytar, 'getPassword')
        .returns(new Promise((resolve) => resolve(JSON.stringify(expectedResult))));

      let res = await secureStore.getProfileSecrets('eu-user');
      expect(res).to.deep.equal(expectedResult);
      stub.restore();
    });
    it('throws error if no profile found', async () => {
      let stub = sinon.stub(keytar, 'getPassword').returns(new Promise((resolve) => resolve(null)));
      expect(secureStore.getProfileSecrets('eu-user')).to.be.eventually.rejectedWith(
        'Profile secrets could not be found'
      );
      stub.restore();
    });
    it('throws error if profile not in JSON format', async () => {
      let stub = sinon.stub(keytar, 'getPassword').returns(new Promise((resolve) => resolve('Hi')));
      expect(secureStore.getProfileSecrets('eu-user')).to.be.eventually.rejectedWith(
        'Profile secrets not stored in JSON format'
      );
      stub.restore();
    });
    it('returns only required property from profile secrets', async () => {
      let expectedResult = {
        accessToken: 'CIC~bexample5ssdTBxciONpqqq',
        refreshToken: 'rt.maPo0P20exampleG03muqweTd',
        accessTokenExp: 1647622893976,
        refreshTokenExp: 1648744609976,
      };

      let stub = sinon
        .stub(keytar, 'getPassword')
        .returns(new Promise((resolve) => resolve(JSON.stringify(expectedResult))));

      let res = await secureStore.getProfileSecrets('eu-user', 'accessTokenExp');
      expect(res).to.equal(1647622893976);
      stub.restore();
    });
  });

//   describe('secureStore.getClientSecret', () => {
//     it('returns client secret', async () => {
//       let stub = sinon.stub(keytar, 'getPassword');
//       stub.returns(new Promise((resolve) => resolve('clientsecret')));
//       expect(await secureStore.getClientSecret()).to.be.equal('clientsecret');
//       stub.restore();
//     });
//   });

  describe('secureStore.saveProfileSecrets', () => {
    it('add profile secrets', async () => {
      let profileSecrets = {
        accessToken: 'CIC~abcdefghijklmnop',
        refreshToken: 'rt.qwertyuiopasdfag',
        accessTokenExp: 1647611193976,
        refreshTokenExp: 16487323609976,
      };
      let sandbox = sinon.createSandbox();
      let getProfileStub = sandbox.stub(secureStore, 'getProfileSecrets').returns(new Promise((r, rj) => rj()));
      let loggerStub = sandbox.stub(Logger, 'warn');
      let keytarStub = sandbox.stub(keytar, 'setPassword');
      await secureStore.saveProfileSecrets('eu-user', profileSecrets);
      expect(keytarStub.getCall(0).args[1]).to.be.equal('eu-user');
      expect(keytarStub.getCall(0).args[2]).to.be.equal(JSON.stringify(profileSecrets));
      expect(loggerStub.calledOnce).to.be.false
      sandbox.restore();
    });
    it('replace existing profile secrets', async () => {
      let existingProfileSecrets = {
        accessToken: 'CIC~bslDXuZuE5ssdTBxciONpqqq',
        refreshToken: 'rt.maPo0P20exampleG03muqweTd',
        accessTokenExp: 1647622893976,
        refreshTokenExp: 1648744609976,
      };

      let sandbox = sinon.createSandbox();
      let getProfileStub = sandbox
        .stub(secureStore, 'getProfileSecrets')
        .returns(new Promise((r) => r(existingProfileSecrets)));

      let newProfileSecrets = {
        accessToken: 'CIC~abcdefghijklmnop',
        refreshToken: 'rt.qwertyuiopasdfgg',
        accessTokenExp: 1647611193976,
        refreshTokenExp: 16487323609976,
      };
      let loggerStub = sandbox.stub(Logger, 'warn');

      let keytarStub = sandbox.stub(keytar, 'setPassword');
      await secureStore.saveProfileSecrets('eu-user', newProfileSecrets);

      expect(keytarStub.getCall(0).args[1]).to.be.equal('eu-user');
      expect(keytarStub.getCall(0).args[2]).to.be.equal(JSON.stringify(newProfileSecrets));
      expect(loggerStub.calledOnce).to.be.true;
      expect(getProfileStub.calledOnce).to.be.true
      sandbox.restore();
    });
  });
});
