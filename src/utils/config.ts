import { UserConfig, Profile, ProfileSecrets } from '../models/models';
import { secureStore } from './secure-store';
import * as path from 'path';
import * as fs from 'fs-extra';
import { Logger } from './log';

const CONFIG_FILE_NAME = 'config.json';

let userConfig: Config;

export class Config implements UserConfig {
  constructor(
    public clientID: string,
    public version: string,
    public defaultProfile: string,
    public profiles: Profile[]
  ) {}

  // TODO: profile data validation
  // Question: Should we replace profile if found duplicate or throw error?
  addProfile(profile: Profile, secrets: ProfileSecrets) {
    this.profiles.push(profile);
    secureStore.insertOrUpdateSecrets(profile.name, secrets);
  }

  getProfile(name?: string) {
    name = name || this.defaultProfile;
    return this.profiles.find((p: Profile) => p.name === name);
  }

  // TODO: Revoke OAuth token? Yes
  removeProfile(name: string) {
    if (name == this.defaultProfile) {
      Logger.error('Cannot remove default profile');
    }
    this.profiles = this.profiles.filter((p: Profile) => p.name != name);
    secureStore.removeSecrets(name);
  }
}

export class ConfigManager {
  filePath: string;

  constructor(configDir: string) {
    this.filePath = path.join(configDir, CONFIG_FILE_NAME);
  }

  save(config?: UserConfig) {
    if (!config && !userConfig) {
      return;
    }
    fs.outputJSONSync(this.filePath, config || userConfig, {
      spaces: '\t',
    });
  }

  private load() {
    let dataObj = fs.readJSONSync(this.filePath);
    return new Config(
      dataObj.clientID || '',
      dataObj.version || '',
      dataObj.defaultProfile || '',
      dataObj.profiles || []
    );
  }

  // async destroy() {}

  getConfig() {
    if (!userConfig) {
      userConfig = this.load();
    }
    return userConfig;
  }

  refresh() {
    userConfig = this.load();
    return userConfig;
  }
}
