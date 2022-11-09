/**
 * Copyright 2022. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

import Command, { flags } from '@oclif/command';
import { HTTPRequest } from '../utils/request';
import { setCommand } from '../utils/log';
import * as configManager from '../utils/config';
import * as path from 'path';
const debug = require('debug')('@tibco-software/cic-cli-core:base-command');
import * as chalk from 'chalk';
const CORE_CONFIG = require('./../configs-for-core/config.json');
const CONFIG_FILE_NAME = CORE_CONFIG.CONSTANTS.PLUGIN_CONFIG_FILE_NAME;

/**
 * Extend this class while developing commands.<br>
 * It contains common flags implemented and creates instances of some useful classes for you.
 */
export class BaseCommand extends Command {
  private warnings?: boolean;
  private localConfigPath?: string;

  static flags = {
    'no-warnings': flags.boolean({
      description: `Disable warnings from command output`,
      default: false,
    }),
    config: flags.string({
      description: `Path to the local config file`,
      required: false,
    }),
  };

  constructor(argv: any, config: any) {
    super(argv, config);
  }
  async init() {
    setCommand(this);
    //  this.pushFlagsFromFile(this.id || this.ctor.id, this.ctor.flags as flags.Input<any>);  Feature disabled
    let { flags } = this.parse(this.constructor as typeof BaseCommand);
    this.localConfigPath = flags.config;
    this.warnings = !flags['no-warnings'];
  }

  async run() {
    super._run();
  }

  /**
   * Get instance of HTTPRequest class.
   * @returns returns instance of HTTPRequest class.
   */
  getHTTPRequest() {
    return new HTTPRequest(this.id, this.config.findCommand(this.id as string)?.pluginName);
  }

  warn(input: string | Error) {
    if (this.warnings) super.warn(input);
  }

  /**
   * Get instance of PluginConfig Class.
   * @returns returns instance of PluginConfig class.
   */
  getPluginConfig() {
    let localPath = this.localConfigPath || path.join(process.cwd(), CONFIG_FILE_NAME);
    let cmd = this.ctor.id.split(':'); // e.g: cmdId =  tci:flogo:activity:add-kafka
    let topics = cmd.slice(0, cmd.length - 1); // topics = tci:flogo:activity
    return configManager.getPluginConfig(path.join(this.config.configDir, CONFIG_FILE_NAME), localPath, topics);
  }

  // Feature disabled and function not in use anywhere
  private pushFlagsFromFile(cmdId: string, flagsDefn: flags.Input<any>) {
    if (!flagsDefn) {
      return;
    }

    let argv = this.filterFlagsFromArgv('config', 'option', [...this.argv]);
    let { flags } = this.parse({ flags: { config: flagsDefn.config } }, argv);
    this.localConfigPath = flags.config;
    let cfg = this.getPluginConfig();
    let flagsValue = cfg.getFlagsValue(cmdId);
    if (!flagsValue) {
      return;
    }

    for (let flagName in flagsDefn) {
      if (this.filterFlagsFromArgv(flagName, flagsDefn[flagName].type, [...this.argv]).length != 0) {
        debug(`Flag ${chalk.green(flagName)} is getting read from the ${chalk.green('command prompt')}`);
        continue;
      }

      let envName = flagsDefn[flagName].env;
      if (envName && process.env[envName]) {
        debug(`Flag ${chalk.green(flagName)} is getting read from the environment variable ${envName}`);
        continue;
      }

      if (flagsValue[flagName]) {
        if (flagsDefn[flagName].type === 'boolean') {
          this.argv.unshift(`--${flagName}`);
        } else {
          this.argv.unshift(`--${flagName}=${flagsValue[flagName]}`);
        }
        debug(
          `Flag ${chalk.green(flagName)} getting read from the config file located at ${chalk.green(
            cfg.localConfigPath
          )}`
        );
      }
    }
  }

  // Used for pushing flags from a file, this feature is disabled and function is not in use anywhere
  private filterFlagsFromArgv(flag: string, type: 'boolean' | 'option', argv: string[]) {
    let op: string[] = [];
    if (!argv) {
      return op;
    }
    while (argv.length > 0) {
      let element = argv.shift() as string;
      if (element === `--${flag}`) {
        op.push(`--${flag}`);

        if (argv[0] && type != 'boolean') {
          op.push(argv[0]);
        }
      } else if (element.startsWith(`--${flag}=`)) {
        op.push(element);
      }
    }

    return op;
  }

  repeatCommand(command: string, args: { [name: string]: any }, flags: any) {
    let argsT = ' ';
    for (const arg of Object.keys(args)) {
      argsT += args[arg] + ' ';
    }
    let flagT = ' ';
    for (const flag of Object.keys(flags)) {
      if (flags[flag]) {
        flagT += '--' + flag + '="' + flags[flag] + '" ';
      }
    }
    this.log('Command to repeat: run ' + command + argsT + flagT);
  }
}
