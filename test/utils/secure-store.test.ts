import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as keytar from 'keytar';
import * as sinon from 'sinon';
import { Logger, Profile, ProfileSecrets } from '../../src';
import { secureStore } from '../../src/utils/secure-store';
import * as mocha from 'mocha';

chai.use(chaiAsPromised);
const expect = chai.expect;
describe('secureStore', () => {
  describe('secureStore.getProfileSecrets', () => {
    let sbox: sinon.SinonSandbox;
    let stub: sinon.SinonStub;

    beforeEach(() => {
      sbox = sinon.createSandbox();
      stub = sbox.stub(keytar, 'getPassword');
    });

    afterEach(() => {
      sbox.restore();
    });
    it('returns profile if exists', async () => {
      let expectedResult = {
        accessToken: 'CIC~bslDXuZuE5ssdTBxciONpqqq',
        refreshToken: 'rt.maPo0P20exampleG03muqweTd',
        accessTokenExp: 1647622893976,
        refreshTokenExp: 1648744609976,
      };

      stub.returns(new Promise((resolve) => resolve(JSON.stringify(expectedResult))));

      let res = await secureStore.getProfileSecrets('eu-user');
      expect(res).to.deep.equal(expectedResult);
    });
    it('throws error if no profile found', async () => {
      stub.returns(new Promise((resolve) => resolve(null)));
      expect(secureStore.getProfileSecrets('eu-user')).to.be.eventually.rejectedWith(
        'Profile secrets could not be found'
      );
    });
    it('throws error if profile not in JSON format', async () => {
      stub.returns(new Promise((resolve) => resolve('Hi')));
      expect(secureStore.getProfileSecrets('eu-user')).to.be.eventually.rejectedWith(
        'Profile secrets not stored in JSON format'
      );
    });
    it('returns only required property from profile secrets', async () => {
      let expectedResult = {
        accessToken: 'CIC~bexample5ssdTBxciONpqqq',
        refreshToken: 'rt.maPo0P20exampleG03muqweTd',
        accessTokenExp: 1647622893976,
        refreshTokenExp: 1648744609976,
      };

      stub.returns(new Promise((resolve) => resolve(JSON.stringify(expectedResult))));

      let res = await secureStore.getProfileSecrets('eu-user', 'accessTokenExp');
      expect(res).to.equal(1647622893976);
    });
  });

  describe('secureStore.saveProfileSecrets', () => {
    let sandbox: sinon.SinonSandbox;
    let loggerStub: sinon.SinonStub;
    let getProfileStub: sinon.SinonStub;
    let keytarStub: sinon.SinonStub;
    beforeEach(() => {
      sandbox = sinon.createSandbox();
      getProfileStub = sandbox.stub(secureStore, 'getProfileSecrets');
      loggerStub = sandbox.stub(Logger, 'debug');
      keytarStub = sandbox.stub(keytar, 'setPassword');
    });

    afterEach(() => {
      sandbox.restore();
    });
    it('add profile secrets', async () => {
      let profileSecrets = {
        accessToken: 'CIC~abcdefghijklmnop',
        refreshToken: 'rt.qwertyuiopasdfag',
        accessTokenExp: 1647611193976,
        refreshTokenExp: 16487323609976,
      };

      getProfileStub.returns(new Promise((r, rj) => rj()));
      await secureStore.saveProfileSecrets('eu-user', profileSecrets);
      expect(keytarStub.getCall(0).args[1]).to.be.equal('eu-user');
      expect(keytarStub.getCall(0).args[2]).to.be.equal(JSON.stringify(profileSecrets));
      expect(loggerStub.calledOnce).to.be.false;
    });
    it('replace existing profile secrets', async () => {
      let existingProfileSecrets = {
        accessToken: 'CIC~bslDXuZuE5ssdTBxciONpqqq',
        refreshToken: 'rt.maPo0P20exampleG03muqweTd',
        accessTokenExp: 1647622893976,
        refreshTokenExp: 1648744609976,
      };

      getProfileStub.returns(new Promise((r) => r(existingProfileSecrets)));

      let newProfileSecrets = {
        accessToken: 'CIC~abcdefghijklmnop',
        refreshToken: 'rt.qwertyuiopasdfgg',
        accessTokenExp: 1647611193976,
        refreshTokenExp: 16487323609976,
      };

      await secureStore.saveProfileSecrets('eu-user', newProfileSecrets);

      expect(keytarStub.getCall(0).args[1]).to.be.equal('eu-user');
      expect(keytarStub.getCall(0).args[2]).to.be.equal(JSON.stringify(newProfileSecrets));
      expect(loggerStub.calledOnce).to.be.true;
      expect(getProfileStub.calledOnce).to.be.true;
    });
  });
});
