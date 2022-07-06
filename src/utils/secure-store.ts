/**
 * Copyright 2022. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

import * as keytar from 'keytar';
import { CLIBaseError } from '..';
import { ProfileSecrets } from '../models/models';
import { Logger } from './log';

const SERVICE = 'tibco-cli';
const ACCOUNT = 'client-secret';

const secureStore: any = {};

secureStore.getProfileSecrets = async function(profName: string, secretType?: keyof ProfileSecrets){
  let secrets = await keytar.getPassword(SERVICE, profName);

  if (!secrets) {
    throw new CLIBaseError('Profile secrets could not be found');
  }

  let secretsObj;

  try {
    secretsObj = JSON.parse(secrets);
  } catch (err) {
    throw new CLIBaseError('Profile secrets not stored in JSON format');
  }

  if (secretType && secrets != null) {
    return secretsObj[secretType as any];
  }
  return secretsObj;

}

secureStore.getClientSecret = async function() {
  return keytar.getPassword(SERVICE, ACCOUNT);
}

secureStore.saveClientSecret = async function(clientSecret: string) {
  return keytar.setPassword(SERVICE, ACCOUNT, clientSecret);
}

secureStore.saveProfileSecrets = async function(profName: string, secrets: ProfileSecrets) {
  let currSecrets;
  try {
    currSecrets = await this.getProfileSecrets(profName);
  } catch (err) {}

  let newSecrets;

  if (typeof currSecrets === 'object') {
    newSecrets = { ...currSecrets, ...secrets };
    Logger.warn('Profile secret already existed, new secrets will replace existing ones');
  } else {
    newSecrets = secrets;
  }

  await keytar.setPassword(SERVICE, profName, JSON.stringify(newSecrets));
}

secureStore.removeProfileSecrets = async function(profile: string) {
  return keytar.deletePassword(SERVICE, profile);
}


secureStore.removeClientSecret = async function() {
  return keytar.deletePassword(SERVICE, ACCOUNT);
}


export { secureStore };