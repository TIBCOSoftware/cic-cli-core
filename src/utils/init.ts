import { Config } from './config';
import { BaseCommand } from '..';
import { secureStore } from './secure-store';

const COMMAND_NAME = 'ConfigInitialize';

function addClientSecret(command: BaseCommand, clientSecret: string) {
  if (command.constructor.name != COMMAND_NAME) return;
  secureStore.saveClientSecret(clientSecret);
}

function getUserConfigObject(command: BaseCommand) {
  if (command.constructor.name != COMMAND_NAME) return;
  return new Config('', '', '', []);
}

export const init = { addClientSecret, getUserConfigObject };
