import Command, {flags} from '@oclif/command';

import {setCommand} from './utils/log';

export abstract class BaseCommand extends Command {
  private warnings?: boolean;

  static flags = {
    'no-warnings': flags.boolean({description: 'Disable warnings from commands outputs', default: false}),
    //   'debug': flags.boolean({ description: "Disable warnings from commands outputs", default: false })
  };

  constructor(argv: any, config: any) {
    super(argv, config);
  }

  async init() {
    let {flags} = this.parse(this.constructor as typeof BaseCommand);
    this.warnings = !flags['no-warnings'];
    setCommand(this);
  }

  warn(input: string | Error) {
    if (this.warnings) super.warn(input);
  }

  // TODO: Need to rethink over debugging
  debug = (...args: any[]) => {
    super.debug(args);
  };

  repeatCommand(command: string, args: { [name: string]: any; }, flags: any) {
    let argsT = ' '
    for (const arg of Object.keys(args)) {
      argsT += args[arg] + ' '
    }
    let flagT = ' '
    for (const flag of Object.keys(flags)) {
      if (flags[flag]) {
        flagT += '--' + flag + '="' + flags[flag] + '" '
      }
    }
    this.log('Command to repeat: run ' + command + argsT + flagT)
  }
}
