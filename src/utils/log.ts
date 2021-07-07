//TODO: Need to set logging structure.Format could be ->  [INFO]: <msg>,  [WARN]: <msg>, [DEBUG]: <msg>
import Command from '@oclif/command';
import { BaseCommand } from '../base-command';

let command: BaseCommand;

export function setCommand(c: BaseCommand) {
  command = c;
}

function log(...params: Parameters<typeof command.log>) {
  command.log(...params);
}

function debug(msg: string) {
  command.debug(msg);
}

function error(...params: Parameters<typeof command.error>) {
  command.error(...params);
}

function warn(...params: Parameters<typeof command.warn>) {
  command.warn(...params);
}

export const Logger = { log, debug, error, warn };
