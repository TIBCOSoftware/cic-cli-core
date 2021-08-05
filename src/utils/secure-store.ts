import * as keytar from 'keytar';
import { BaseCommand } from '..';
import { ProfileSecrets } from '../models/models';
import { Logger } from './log';

const SERVICE = 'tibco-cli';
const ACCOUNT = 'tibco-cli';

async function getProfileSecrets(profName: string, secretType?: keyof ProfileSecrets) {
  let secrets = await keytar.getPassword(SERVICE, profName);

  if (!secrets) {
    return;
  }

  let secretsObj = JSON.parse(secrets);

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
  let currSecrets = await getProfileSecrets(profName);
  let newSecrets;

  if (typeof currSecrets === 'object') {
    newSecrets = { ...currSecrets, ...secrets };
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
