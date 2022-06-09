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

let profConfig: ProfileConfig;
/**
 * @class Use this class to manage profile's configurations.
 */
export class ProfileConfig {
  /**
   *
   * @param clientID Id generated for the clients machine.
   * @param version Configuration version.
   * @param defaultProfile Default profile from the multiple profiles.
   * @param profiles Array of profiles.
   */
  constructor(
    public clientID: string,
    public version: string,
    public defaultProfile: string,
    public profiles: Profile[]
  ) {}

  /**
   * Add profile.
   * @param profile Profile to be added.
   * @param secrets Profile's secret data.
   * @returns void
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
   * Search for the profile.
   * @param name Name of the profile.
   * @returns Profile
   */
  getProfileByName(name?: string) {
    name = name || this.defaultProfile;
    let profile = this.profiles.find((p: Profile) => p.name === name);
    if (!profile) {
      throw new CLIBaseError(`Profile ${name} could not be found`);
    }
    return profile;
  }

  /**
   * Remove profile.
   * @param name Name of a profile to be removed.
   * @returns Returns a promise, if it is resolved then profile was removed successfully.
   */
  async removeProfile(name: string) {
    if (name == this.defaultProfile) {
      throw new CLIBaseError('Cannot remove default profile');
    }
    this.getProfileByName(name);
    let token = await secureStore.getProfileSecrets(name, 'accessToken');
    await this.revokeToken(token);
    this.profiles = this.profiles.filter((p: Profile) => p.name != name);
    secureStore.removeProfileSecrets(name);
  }

  private validateProfile(profile: Profile, secrets: ProfileSecrets) {
    if (!profile.name || !profile.org || !profile.region) return false;
    if (!secrets.accessToken || !secrets.accessTokenExp || !secrets.refreshToken || !secrets.refreshTokenExp)
      return false;

    return true;
  }

  private async revokeToken(token: string) {
    const CORE_CONFIG = require('./../configs-for-core/config.json');
    const REVOKE_TOKEN_URL = CORE_CONFIG.HOSTS.TIBCO_ACC;
    const REVOKE_TOKEN_PATH = CORE_CONFIG.PATHS.REVOKE_TOKEN;
    const { HTTPRequest } = await import('./request');
    let req = new HTTPRequest();
    await req.doRequest(
      `${REVOKE_TOKEN_URL}${REVOKE_TOKEN_PATH}`,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      `token=${token}`
    );
  }
}

export class ProfileConfigManager {
  filePath: string;

  constructor(configDir: string) {
    this.filePath = path.join(configDir, CONFIG_FILE_NAME);
  }

  /**
   * Save profile config in a file.
   * @param config Instance of {@link ProfileConfig}.
   */
  save(config?: ProfileConfig) {
    if (!config && !profConfig) {
      throw new CLIBaseError('Configuration was not loaded to save');
    }
    fs.outputJSONSync(this.filePath, config || profConfig, {
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

  /**
   * Get {@link ProfileConfig} instance.
   * @returns {@link ProfileConfig} instance.
   */
  getConfig() {
    if (!profConfig) {
      profConfig = this.load();
    }
    return profConfig;
  }

  /**
   * Reload {@link ProfileConfig} instance.
   * @returns {@link ProfileConfig} instance.
   */
  refresh() {
    profConfig = this.load();
    return profConfig;
  }
}
