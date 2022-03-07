/**
 * Copyright 2022. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */
import Command, { flags } from '@oclif/command';
import { HTTPRequest } from '../utils/request';
import { setCommand } from '../utils/log';

/**
 * Extend this class while developing commands.
 * It contains some common command flags implemented and creates instances of some useful classes for you.
 */
export class BaseCommand extends Command {
  private warnings?: boolean;

  static flags = {
    'no-warnings': flags.boolean({
      description: 'Disable warnings from commands outputs',
      default: false,
    }),
  };

  constructor(argv: any, config: any) {
    super(argv, config);
  }
  async init() {
    setCommand(this);
    let { flags } = this.parse(this.constructor as typeof BaseCommand);
    this.warnings = !flags['no-warnings'];
  }

  async run() {
    super._run();
  }

  /**
   * Get instance of HTTPRequest class
   * @returns returns instance of HTTPRequest class
   */
  getHTTPRequest() {
    return new HTTPRequest(this.id, this.config.findCommand(this.id as string)?.pluginName);
  }

  warn(input: string | Error) {
    if (this.warnings) super.warn(input);
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
