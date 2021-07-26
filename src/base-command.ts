import Command, { flags } from '@oclif/command';
import { UserConfig } from './models/models';
import { ConfigManager } from './utils/config';
import { TCRequest, HTTPRequest } from '.';
import { setCommand } from './utils/log';

export abstract class BaseCommand extends Command {
  private warnings?: boolean;
  private profileName?: string;

  static flags = {
    'no-warnings': flags.boolean({
      description: 'Disable warnings from commands outputs',
      default: false,
    }),

    profile: flags.string({
      description: 'Switch to different org or region using profile',
    }),
  };

  constructor(argv: any, config: any) {
    super(argv, config);
  }

  async init() {
    setCommand(this);
    let { flags } = this.parse(this.constructor as typeof BaseCommand);
    this.profileName = flags.profile;
    //setSelectedProfName(profName);
    this.warnings = !flags['no-warnings'];
  }

  getConfig() {
    return new ConfigManager(this.config.configDir).getConfig();
  }

  saveConfig(config: UserConfig) {
    return new ConfigManager(this.config.configDir).save(config);
  }

  reloadConfig() {
    return new ConfigManager(this.config.configDir).refresh();
  }

  warn(input: string | Error) {
    if (this.warnings) super.warn(input);
  }

  getHTTPRequest() {
    return HTTPRequest;
  }

  getTCRequest() {
    let profile = this.getConfig().getProfile(this.profileName);

    if (!profile) {
      let name = this.profileName || this.getConfig().defaultProfile;
      this.error(`Profile ${name} configuration not found`);
    }

    return new TCRequest(profile);
  }

  // TODO: Need to rethink over debugging
  debug = (...args: any[]) => {
    super.debug(args);
  };

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
