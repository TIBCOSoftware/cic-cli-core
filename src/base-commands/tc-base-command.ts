/**
 * Copyright 2022. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

import { flags } from '@oclif/command';
import { ProfileConfig, ProfileConfigManager } from '../utils/profile';
import { TCRequest } from '../utils/request';
import { BaseCommand } from './base-command';
const CONFIG = require('../configs-for-core/config.json');

/**
 * Extend this class while developing commands which interact with TIBCO Cloud.<br>
 * It contains common flags implemented and creates instances of some useful classes for you.
 */
export class TCBaseCommand extends BaseCommand {
  private profileName?: string;
  private token?: string;
  private region?: string;

  static flags = {
    ...BaseCommand.flags,
    profile: flags.string({
      description: 'Switch to a different organization or region using profile',
    }),
    token: flags.string({
      description: 'OAuth token to interact with the TIBCO cloud.(Should pass region flag with the token flag)',
      env: 'TIBCO_CLI_OAUTH_TOKEN',
      dependsOn: ['region'],
    }),
    region: flags.string({
      description: 'Region of the TIBCO Cloud.',
      env: 'TIBCO_REGION',
      dependsOn: ['token'],
      options: [...CONFIG.CONSTANTS.REGIONS.map((e: any) => e.value)],
    }),
  };

  constructor(argv: any, config: any) {
    super(argv, config);
  }
  async init() {
    await super.init();
    let { flags } = this.parse(this.constructor as typeof TCBaseCommand);
    this.profileName = flags.profile;
    this.token = flags.token;
    this.region = flags.region;
  }

  async run() {
    super._run();
  }

  /**
   * Gets the profile config.
   * @returns ProfileConfig Instance.
   */
  getProfileConfig() {
    return new ProfileConfigManager(this.config.configDir).getConfig();
  }

  /**
   * Saves profile object to the file.
   * @param config Profile to be saved into the file
   * @returns void
   */
  saveProfileConfig(config: ProfileConfig) {
    return new ProfileConfigManager(this.config.configDir).save(config);
  }

  /**
   * Reloads profile from the file.
   * @returns ProfileConfig Instance.
   */
  reloadProfileConfig() {
    return new ProfileConfigManager(this.config.configDir).refresh();
  }

  /**
   * Get instance of TCRequest class.
   * @returns Instance of TCRequest class.
   */
  getTCRequest() {
    if (this.token && this.region) {
      return new TCRequest(
        this.token,
        this.region as 'us' | 'eu' | 'au',
        this.id,
        this.config.findCommand(this.id as string)?.pluginName
      );
    }
    let profile = this.getProfileConfig().getProfileByName(this.profileName);

    if (!profile) {
      let name = this.profileName || this.getProfileConfig().defaultProfile;
      this.error(`Profile ${name} configuration not found`);
    }

    return new TCRequest(
      profile,
      this.getProfileConfig().clientID,
      this.id,
      this.config.findCommand(this.id as string)?.pluginName
    );
  }
}
