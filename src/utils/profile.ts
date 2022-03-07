/**
 * Copyright 2022. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

import { Profile, ProfileSecrets } from '../models/models';
import { secureStore } from './secure-store';
import * as path from 'path';
import * as fs from 'fs-extra';
import { Logger } from './log';

import { CLIBaseError } from '..';

const CONFIG_FILE_NAME = 'profile.json';

let userConfig: ProfileConfig;
/**
 * Class representing CLI configuration
 */
export class ProfileConfig {
  /**
   *
   * @param clientID used ot identify TIBCO client for a CLI
   * @param version version of a configuration
   * @param defaultProfile default profile from the multiple profiles
   * @param profiles Array of profiles
   */
  constructor(
    public clientID: string,
    public version: string,
    public defaultProfile: string,
    public profiles: Profile[]
  ) {}

  /**
   * Adds profile to the configuration
   * @param profile profile to be added
   * @param secrets profile secret data
   */
  addProfile(profile: Profile, secrets: ProfileSecrets) {
    if (this.validateProfile(profile, secrets) == false) {
      throw new CLIBaseError('Could not add profile. Either properties are missing or empty');
    }

    let existing;
    try {
      existing = this.getProfileByName(profile.name);
    } catch (err) {}
    if (existing) {
      existing.org = profile.org;
      existing.region = profile.region;
      Logger.warn(`Replacing profile ${profile.name} details`);
    } else {
      this.profiles.push(profile);
    }

    secureStore.saveProfileSecrets(profile.name, secrets);
  }

  /**
   * Searches for the profile in a config
   * @param name Name of profile
   * @returns returns profile
   */
  getProfileByName(name?: string) {
    name = name || this.defaultProfile;
    let profile = this.profiles.find((p: Profile) => p.name === name);
    if (!profile) {
      throw new CLIBaseError(`Profile ${name} could not be found`);
    }
    return profile;
  }

  // TODO: Revoke OAuth token? No
  /**
   * Removes profile from a config
   * @param name name of a profile ot be removed
   */
  removeProfile(name: string) {
    if (name == this.defaultProfile) {
      throw new CLIBaseError('Cannot remove default profile');
    }
    this.profiles = this.profiles.filter((p: Profile) => p.name != name);
    secureStore.removeProfileSecrets(name);
  }

  private validateProfile(profile: Profile, secrets: ProfileSecrets) {
    if (!profile.name || !profile.org || !profile.region) return false;
    if (!secrets.accessToken || !secrets.accessTokenExp || !secrets.refreshToken || !secrets.refreshTokenExp)
      return false;

    return true;
  }
}

export class ProfileConfigManager {
  filePath: string;

  constructor(configDir: string) {
    this.filePath = path.join(configDir, CONFIG_FILE_NAME);
  }

  save(config?: ProfileConfig) {
    if (!config && !userConfig) {
      throw new CLIBaseError('Configuration was not loaded to save');
    }
    fs.outputJSONSync(this.filePath, config || userConfig, {
      spaces: '\t',
    });
  }

  private load() {
    let dataObj;
    try {
      dataObj = fs.readJSONSync(this.filePath);
    } catch (err) {
      // Logger.debug(err);
      throw new CLIBaseError('Could not find config file, try initializing CLI');
    }

    return new ProfileConfig(
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
