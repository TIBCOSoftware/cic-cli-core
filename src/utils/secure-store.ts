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

async function getProfileSecrets(profName: string, secretType?: keyof ProfileSecrets) {
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

async function getClientSecret() {
  return await keytar.getPassword(SERVICE, ACCOUNT);
}

async function saveClientSecret(clientSecret: string) {
  return await keytar.setPassword(SERVICE, ACCOUNT, clientSecret);
}

async function saveProfileSecrets(profName: string, secrets: ProfileSecrets) {
  let currSecrets;
  try {
    currSecrets = await getProfileSecrets(profName);
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

async function removeProfileSecrets(profile: string) {
  return await keytar.deletePassword(SERVICE, profile);
}

async function removeClientSecret() {
  return await keytar.deletePassword(SERVICE, ACCOUNT);
}

export const secureStore = {
  getProfileSecrets,
  saveProfileSecrets,
  getClientSecret,
  removeProfileSecrets,
  saveClientSecret,
  removeClientSecret,
};
