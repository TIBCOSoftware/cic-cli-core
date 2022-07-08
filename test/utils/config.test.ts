import { PluginConfig } from '../../src/utils/config';
import { expect } from 'chai';
import * as mocha from 'mocha';
import * as sinon from 'sinon';
import * as ini from 'ini';


describe('utils', () => {
  describe('PluginConfig', () => {
    describe('PluginConfig.get', () => {
      let cfg: PluginConfig;
      let localData: any;
      let globalData: any;
      let sandbox: sinon.SinonSandbox;
      beforeEach(() => {
        cfg = new PluginConfig('', '', []);
        sandbox = sinon.createSandbox();
        sandbox.stub(cfg, 'globalConfigFileExists').value(true);
        sandbox.stub(cfg, 'localConfigFileExists').value(true);
        globalData = {
          'no-warnings': false,
          'output-format': 'csv',
          profile: 'eu-user',
          arr: [1, 2, 3, 4],
          tci: {
            apim: {
              apiCount: 55,
              type: 'gql',
              'allow-mutation': true,
              limits: [50, 100, 150],
            },
          },
        };

        localData = {
          'no-warnings': true,
          'output-format': 'json',
          count: 34,
          arr: [7, 8, 9],
          tci: {
            apim: {
              'allow-mutation': false,
              limits: [200, 400, 800],
              apiCount: 34,
              apps: [
                {
                  name: 'app1',
                  memory: '16GB',
                },
                {
                  name: 'app2',
                  memory: '8GB',
                },
              ],
            },
          },
        };
        sandbox.stub(cfg, <any>'globalConfig').value(ini.parse(ini.stringify(globalData)));
        sandbox.stub(cfg, <any>'localConfig').value(ini.parse(ini.stringify(localData)));
      });

      afterEach(()=>{
        sandbox.restore();
      })

      it('should return boolean value with precendence as local -> global -> undefined', () => {
        expect(cfg.get('no-warnings')).to.be.true;
      })

      it('should return string value with precendence as local -> global -> undefined', () => {
        expect(cfg.get('profile')).to.be.equal('eu-user');
        expect(cfg.get('tci.apim.type')).to.be.equal('gql');
      })

      it('should return a number value as a string', () => { 
        expect(cfg.get('count')).to.be.equal('34'); // Note: Number is treated as a string when readed from a config file
      })

      it('should return undefined for unknown property', () => {
        expect(cfg.get('myprop')).to.be.undefined;
      })

      it('should return value for properties that are in kebab case format', () => { 
        expect(cfg.get('tci.apim.allow-mutation')).to.be.false;
      })

      it('should return value from mentioned source',() => {
        expect(cfg.get('output-format', { source: 'local' })).to.be.equal('json');
        expect(cfg.get('output-format', {source: 'global'})).to.be.equal('csv');
      })

      it('should return from array of object as a stringified object', () => {
        expect(cfg.get('tci.apim.apps[0]')).to.be.equal(JSON.stringify(localData.tci.apim.apps[0]));
        
      })

      it('should return array with stringified elements if element is a number', ()=>{
        expect(cfg.get('arr')).to.be.deep.equal(["7", "8", "9"]); //Note: all numbers from arrays are converted to strings
      })
      
      it('should add topics in a path when returning property value', () => {
        cfg.topics = ['tci', 'apim'];
        expect(cfg.get('allow-mutation')).to.be.false;
        
        expect(cfg.get('apiCount', { source: 'local' })).to.be.equal('34');
        expect(cfg.get('tci.apim.apiCount', { source: 'global', absolutePath: true })).to.be.equal('55');
      });

      it('should not add topics if absolutePath is true', ()=>{
        cfg.topics = ['tci', 'apim'];
        expect(cfg.get('tci.apim.type', { 'absolutePath': true })).to.be.equal('gql');
      })

      it('should add topics and return value from local config', ()=>{
        cfg.topics = ['tci', 'apim'];
        expect(cfg.get('apiCount', { source: 'local' })).to.be.equal('34');
      })

      it('should not add topics if absolutePath is true and return value from global config ', ()=>{
        expect(cfg.get('tci.apim.apiCount', { source: 'global', absolutePath: true })).to.be.equal('55');
      })
    });

    describe('PluginConfig.set', () => {
      let cfg: PluginConfig;
      let localData: any;
      let globalData: any;
      let sandbox: sinon.SinonSandbox
      beforeEach(() => {
        cfg = new PluginConfig('', '');
        sandbox = sinon.createSandbox();
        sandbox.stub(cfg, 'localConfigFileExists').value(true);
        sandbox.stub(cfg, 'globalConfigFileExists').value(true);

        globalData = {
          'no-warnings': false,
          'output-format': 'csv',
          profile: 'eu-user',
          arr: [1, 2, 3, 4],
          tci: {
            apim: {
              apiCount: 55,
              type: 'gql',
              'allow-mutation': false,
              limits: [50, 100, 150],
            },
          },
        };

        localData = {
          'no-warnings': true,
          'output-format': 'json',
          arr: [7, 8, 9],
          tci: {
            apim: {
              'allow-mutation': false,
              limits: [200, 400, 800],
              apiCount: 34,
              apps: [
                {
                  name: 'app1',
                  memory: '16GB',
                },
                {
                  name: 'app2',
                  memory: '8GB',
                },
              ],
            },
          },
        };
        sandbox.stub(cfg, <any>'globalConfig').value(ini.parse(ini.stringify(globalData)));
        sandbox.stub(cfg, <any>'localConfig').value(ini.parse(ini.stringify(localData)));
        sandbox.stub(cfg, <any> 'save');
        sandbox.stub(cfg, 'reload').callsFake(() => {
            cfg.localConfig = ini.parse(ini.stringify(cfg.localConfig));
            cfg.globalConfig = ini.parse(ini.stringify(cfg.globalConfig));
        })
      });

      afterEach(() => {
        sandbox.restore();

      });
      it('should add property to the local config', () => {
        cfg.set('myprop',1234, {source:'local'});
        expect(cfg.localConfig.myprop).to.be.equal('1234'); // Note: Number is changed to string after setting it. This behaviour should be changed
        expect(cfg.globalConfig.myprop).to.be.undefined;
      });

      it('should update property to the local config', () => {
        cfg.set('output-format', 'toml', {source:'local'})
        expect(cfg.localConfig['output-format']).to.be.equal('toml');
        expect(cfg.localConfig['output-format'], 'toml');
      })
     
      it("should add property to the global config", () => {
        cfg.set('arr[5]', '32GB', {source:'global'});
        expect(cfg.localConfig.arr.length).to.be.equal(3);
        expect(cfg.globalConfig.arr).to.have.same.members(['1', '2', '3', '4', 'undefined', '32GB']); // Note: numbers and undefined is also converted into string so it is 'undefined' & ['1','2','3']
      })

      it('should update property to the global config', () => {
        cfg.set('profile', 'au-user',{source: 'global'});
        expect(cfg.globalConfig.profile).to.equal('au-user');
      })

      it('should add property to the local config with sections and subsections', () => {
        cfg.set('a.b.c.myprop',1234, {source:'local'});
        expect(cfg.localConfig.a.b.c.myprop).to.be.equal('1234'); // Note: Number is changed to string after setting it. This behaviour should be changed
        expect(cfg.globalConfig.a?.b?.c?.myprop).to.be.undefined;

      })

      it("should add property to the global config with sections and subsections", () => {
        cfg.set('a.b.c.ram', '32GB', {source:'global'});
        expect(cfg.globalConfig.a.b.c.ram).to.be.equal('32GB'); // Note: Number is changed to string after setting it. This behaviour should be changed
        expect(cfg.localConfig.a?.b?.c?.ram).to.be.undefined;
      })

      it('should consider topics in the path when updating a property', () => {
        cfg.topics = ['tci','apim'];
        cfg.set('allow-mutation', true, { source:'global'});
        expect(cfg.globalConfig.tci.apim['allow-mutation']).to.be.true; // Note: boolean values are considered boolean itself

        cfg.set('apiCount', 100, {source: 'local'});
       expect(cfg.localConfig.tci.apim.apiCount).to.be.equal('100');
      });

      it('should not consider topics in the path when absolutePath is false', () => {
        cfg.topics = ['tci','apim'];
        cfg.set('tci.apim.type','graphQL', {source:'global', absolutePath: true});
        expect(cfg.globalConfig.tci.apim.type).to.be.equal('graphQL');
      })
    });

    describe('PluginConfig.remove', () => {
      let cfg: PluginConfig;
      let localData: any;
      let globalData: any;
      let sandbox: sinon.SinonSandbox;
      beforeEach(() => {
        cfg = new PluginConfig('', '');
        sandbox = sinon.createSandbox();
        sinon.stub(cfg, 'globalConfigFileExists').value(true);
        sinon.stub(cfg, 'localConfigFileExists').value(true);
        globalData = {
          'no-warnings': false,
          'output-format': 'csv',
          profile: 'eu-user',
          arr: [1, 2, 3, 4],
          tci: {
            apim: {
              apiCount: 55,
              type: 'gql',
              'allow-mutation': true,
              limits: [50, 100, 150],
            },
          },
        };

        localData = {
          'no-warnings': true,
          'output-format': 'json',
          arr: [7, 8, 9],
          tci: {
            apim: {
              'allow-mutation': false,
              limits: [200, 400, 800],
              apiCount: 34,
              apps: [
                {
                  name: 'app1',
                  memory: '16GB',
                },
                {
                  name: 'app2',
                  memory: '8GB',
                },
              ],
            },
          },
        };
        sandbox.stub(cfg, <any>'globalConfig').value(ini.parse(ini.stringify(globalData)));
        sandbox.stub(cfg, <any>'localConfig').value(ini.parse(ini.stringify(localData)));
        sandbox.stub(cfg, <any> 'save');
        sandbox.stub(cfg, 'reload').callsFake(() => {
            cfg.localConfig = ini.parse(ini.stringify(cfg.localConfig));
            cfg.globalConfig = ini.parse(ini.stringify(cfg.globalConfig));
        })
      });

      afterEach(()=>{
        sandbox.restore();
      })

      it('should remove property if found at local config', () => {
        cfg.delete('no-warnings', {source:'local'});
        expect(cfg.localConfig['no-warnings']).to.be.undefined;
      });

      it('should remove property if found at global config', () => {
        cfg.delete('output-format', {source:'global'});
        expect(cfg.globalConfig['output-format']).to.be.undefined;
      });


      it('do nothing if property not found', () => {
        let local = ini.parse(ini.stringify(localData));
        let global = ini.parse(ini.stringify(globalData));

        cfg.delete('no-such-prop', {source: 'global'});
        cfg.delete('no-such-prop', {source: 'local'});
        expect(cfg.localConfig).to.be.eql(local);
        expect(cfg.globalConfig).to.be.eql(global);
      });

      it('should consider topics as a path when removing a property ', () => {
        cfg.topics = ['tci','apim'];
        cfg.delete('allow-mutation', { source:'global'});
        expect(cfg.globalConfig.tci.apim['allow-mutation']).to.be.undefined; // Note: boolean values are considered boolean itself

        cfg.delete('apiCount', {source: 'local'});
        expect(cfg.localConfig.tci.apim.apiCount).to.be.undefined;
      });

      it('should not consider topics when absolutePath is true ', () => {
        cfg.topics = ['tci','apim'];
        cfg.delete('tci.apim.allow-mutation', { source:'global', absolutePath: true});
        expect(cfg.globalConfig.tci.apim['allow-mutation']).to.be.undefined; // Note: boolean values are considered boolean itself

      
      });
    });
  });
});
