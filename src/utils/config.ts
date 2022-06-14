/**
 * Copyright 2022. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

import * as path from 'path';
import * as fs from 'fs-extra';
import * as ini from 'ini';
import * as _ from 'lodash';

const debug = require('debug')('@tibco-software/cic-cli-core:config');

const CORE_CONFIG = require('./../configs-for-core/config.json');
const CONFIG_FILE_NAME = CORE_CONFIG.CONSTANTS.PLUGIN_CONFIG_FILE_NAME;

/**
 * @class Use this class to manage your plugin's configurations.
 */
export class PluginConfig {
  localConfig: any;
  globalConfig: any;
  localConfigPath: string;
  globalConfigPath: string;
  topics?: string[];
  localConfigFileExists!: boolean;
  globalConfigFileExists!: boolean;

  /**
   *
   * @param globalPath Path to the global config file. That is -> path.join(cmdObj.config.configDir, "tibco-cli-config.ini")
   * @param localPath Path to the local config file.
   * @param topics Topics under which currently executing command resides.
   */
  constructor(globalPath: string, localPath: string, topics?: string[]) {
    this.topics = topics || [];
    this.globalConfigPath = this.genConfigPath(globalPath);
    this.globalConfig = this.readConfigData(this.globalConfigPath, 'global');
    this.localConfigPath = this.genConfigPath(localPath);
    this.localConfig = this.readConfigData(this.localConfigPath, 'local');
    this.topics = topics;
  }

  private readConfigData(path: string, source: 'local' | 'global') {
    let data: any = {};
    try {
      data = fs.readFileSync(path, 'utf-8');

      if (typeof data == 'string' && data.trim().length == 0) {
        data = {};
      }

      if (source === 'local') {
        this.localConfigFileExists = true;
      } else {
        this.globalConfigFileExists = true;
      }
      //@ts-ignore
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        if (source === 'local') {
          this.localConfigFileExists = false;
        } else {
          this.globalConfigFileExists = false;
        }
      }
    }

    if (!_.isEmpty(data)) {
      try {
        data = ini.parse(data);
      } catch (e) {}
    }
    return data;
  }

  /**
   * To get a property value from the configuration file.
   * @param property Property name.
   * @param options Options object.
   * @param options.absolutePath  If true, then property's path should be mention from the root section of the config file else just pass the property name.
   * @param options.source To get a property from local config or global config.
   * @returns Property value | undefined
   */
  get(
    property: string,
    options?: {
      absolutePath?: boolean;
      source?: 'local' | 'global';
    }
  ) {
    let query: string;
    options?.absolutePath == options?.absolutePath || false;

    if (options?.absolutePath) {
      query = this.buildQuery(property);
    } else {
      query = this.buildQuery(property, this.topics);
    }

    if (options?.source == 'local') {
      return _.get(this.localConfig, query);
    } else if (options?.source === 'global') {
      return _.get(this.globalConfig, query);
    } else {
      let data = _.get(this.localConfig, query);
      if (data === undefined) {
        data = _.get(this.globalConfig, query);
      }

      return data;
    }
  }

  /**
   * To update or insert property in the config file.
   * @param property Property name.
   * @param value Value of the property.
   * @param options Options object.
   * @param options.absolutePath  If true, then property's path should be mention from the root section of the config file else just pass the property name.
   * @param options.source Set a property to local config or global config.
   * @returns undefined
   */
  set(property: string, value: any, options: { absolutePath?: boolean; source: 'local' | 'global' }) {
    let jsonPath: string;

    if (options?.absolutePath) {
      jsonPath = this.buildQuery(property);
    } else {
      jsonPath = this.buildQuery(property, this.topics);
    }

    let data = options.source === 'local' ? this.localConfig : this.globalConfig;
    _.set(data, jsonPath, value);
    debug(`Added or updated property ${property} with value ${value} at ${options.source} config`);
    this.save(options.source);
    this.reload();
  }

  /**
   * To delete a property in the config file.
   * @param property Property Name.
   * @param options Options object.
   * @param options.absolutePath  If true, then property's path should be mention from the root section of the config file else just pass the property name.
   * @param options.source To delete a property from local config or global config.
   * @returns undefined
   */
  delete(property: string, options: { absolutePath?: boolean; source: 'local' | 'global' }) {
    let jsonPath: string;

    if (options?.absolutePath) {
      jsonPath = this.buildQuery(property);
    } else {
      jsonPath = this.buildQuery(property, this.topics);
    }

    let data = options.source === 'local' ? this.localConfig : this.globalConfig;
    _.unset(data, jsonPath);
    debug(`Removed property ${property} from ${options.source} config`);
    this.save(options.source);
    this.reload();
  }

  private buildQuery(property: string, topics?: string[]) {
    property = this.getSquareNotation(property);

    if (!topics || topics.length == 0) {
      return property;
    }
    let prefix = `['${topics.join("']['")}']`;
    let query = prefix + property;
    debug(`Query built for the property ${property} and topic ${topics} is ${query}`);
    return query;
  }

  /**
   * Reload local and global config file.
   */
  reload() {
    this.globalConfig = this.readConfigData(this.globalConfigPath, 'global');
    this.localConfig = this.readConfigData(this.localConfigPath, 'local');
  }

  private save(source: 'local' | 'global') {
    if (source == 'local') {
      fs.outputFileSync(this.localConfigPath, ini.stringify(this.localConfig));
    }

    if (source == 'global') {
      fs.outputFileSync(this.globalConfigPath, ini.stringify(this.globalConfig));
    }
  }

  private genConfigPath(filePath: string) {
    let isDir: boolean;
    try {
      isDir = fs.lstatSync(filePath).isDirectory();
    } catch (e) {
      isDir = false;
    }

    // if path is a folder then consider  <folder_path>/tibco-cli-config.ini
    if (isDir) {
      return path.join(filePath, CONFIG_FILE_NAME);
    }

    // if path is to a .ini file then consider .ini file path
    if (path.extname(filePath) == '.ini') {
      return filePath;
    } else {
      // if path is to invalid file then pick its folder and search for tibco-cli-config.ini file
      return path.join(path.dirname(filePath), CONFIG_FILE_NAME);
    }
  }

  private getSquareNotation(q: string) {
    let elements = q
      .split('.')
      .filter((e) => e.trim() != '')
      .map((e) => {
        if (e.indexOf('[') != -1 && e.indexOf(']') != -1 && e.indexOf('[') < e.indexOf(']')) {
          e = `['${e.substring(0, e.indexOf('['))}']` + e.substring(e.indexOf('['));
          return e;
        }
        return `['${e}']`;
      });

    return elements.join('');
  }

  // below function not in use anywhere,it was built for pushing flags from file feature
  getFlagsValue(commandId?: string) {
    if (commandId) {
      let q = `flags.${commandId.split(':').join('.')}`;
      return this.get(q, { absolutePath: true, source: 'local' });
    }

    let topics = ['flags', ...(this.topics || []), ''];
    let q = this.buildQuery('', topics);
    return this.get(q, { absolutePath: true, source: 'local' });
  }
}

let cfg: PluginConfig;

/**
 * Get instance of {@link PluginConfig} to manage config file properties.
 * @param globalPath Path where global config file is stored.
 * @param localPath Path where local config file is stored.
 * @param topics Topics under which the command resides.
 * @returns PluginConfig
 */
export function getPluginConfig(globalPath: string, localPath: string, topics?: string[]) {
  if (_.isEmpty(cfg)) {
    cfg = new PluginConfig(globalPath, localPath, topics);
  }

  return cfg;
}
