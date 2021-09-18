import Command, { flags } from '@oclif/command';
import { UserConfig } from './models/models';
import { ConfigManager, setConfigDir } from './utils/config';
import { TCRequest, HTTPRequest } from '.';
import { setCommand } from './utils/log';

export abstract class BaseCommand extends Command {
  private warnings?: boolean;
  private profileName?: string;

  static flags = {
    profile: flags.string({
      description: 'Switch to different org or region using profile',
    }),
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
    setConfigDir(this.config.configDir);
    let { flags } = this.parse(this.constructor as typeof BaseCommand);
    this.profileName = flags.profile;
    //  this.warnings = !flags['no-warnings'];
  }

  getConfig() {
    return new ConfigManager().getConfig();
  }

  saveConfig(config: UserConfig) {
    return new ConfigManager().save(config);
  }

  reloadConfig() {
    return new ConfigManager().refresh();
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

    return new TCRequest(profile, this.getConfig().clientID);
  }

  // TODO: Need to rethink over debugging
  debug = (...args: any[]) => {
    super.debug(args);
  };

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
