/**
 * Copyright 2022. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

import { flags } from '@oclif/command';
import { ProfileConfig, ProfileConfigManager } from '../utils/profile';
import { TCRequest } from '../utils/request';
import { BaseCommand } from './base-command';

/**
 * Extend this class while developing commands which interact with TIBCO Cloud.<br>
 * It contains common flags implemented and creates instances of some useful classes for you.
 */
export class TCBaseCommand extends BaseCommand {
  private profileName?: string;

  static flags = {
    ...BaseCommand.flags,
    profile: flags.string({
      description: 'Switch to different org or region using profile',
    }),
  };

  constructor(argv: any, config: any) {
    super(argv, config);
  }
  async init() {
    await super.init();
    let { flags } = this.parse(this.constructor as typeof TCBaseCommand);
    this.profileName = flags.profile;
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
