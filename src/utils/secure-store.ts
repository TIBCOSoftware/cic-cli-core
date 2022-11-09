/**
 * Copyright 2022. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

import * as keytar from 'keytar';
import { CLIBaseError } from '..';
import { ProfileSecrets } from '../models/models';
const debug = require('debug')('@tibco-software/cic-cli-core:secure-store');

const SERVICE = 'tibco-cli';
const ACCOUNT = 'client-secret';

const secureStore: any = {};

secureStore.getProfileSecrets = async function (
  profName: string,
  secretType?: keyof ProfileSecrets
): Promise<ProfileSecrets | string> {
  let secrets = await keytar.getPassword(SERVICE, profName);

  if (!secrets) {
    throw new CLIBaseError(`Profile secrets couldn't be found`);
  }

  let secretsObj;

  try {
    secretsObj = JSON.parse(secrets);
  } catch (err) {
    throw new CLIBaseError('Profile secrets not stored in JSON format');
  }

  if (secretType && secrets != null) {
    return secretsObj[secretType as any] as string;
  }
  return secretsObj as ProfileSecrets;
};

secureStore.getClientSecret = async function () {
  return keytar.getPassword(SERVICE, ACCOUNT);
};

secureStore.saveClientSecret = async function (clientSecret: string) {
  return keytar.setPassword(SERVICE, ACCOUNT, clientSecret);
};

secureStore.saveProfileSecrets = async function (profName: string, secrets: ProfileSecrets) {
  let currSecrets;
  try {
    currSecrets = await this.getProfileSecrets(profName);
  } catch (err) {}

  let newSecrets;

  if (typeof currSecrets === 'object') {
    newSecrets = { ...currSecrets, ...secrets };
    debug('Profile secrets already existed, new secrets will replace existing ones');
  } else {
    newSecrets = secrets;
  }

  await keytar.setPassword(SERVICE, profName, JSON.stringify(newSecrets));
};

secureStore.removeProfileSecrets = async function (profile: string) {
  return keytar.deletePassword(SERVICE, profile);
};

secureStore.removeClientSecret = async function () {
  return keytar.deletePassword(SERVICE, ACCOUNT);
};

export { secureStore };
