import * as keytar from 'keytar';
import { ProfileSecrets } from '../models/models';

const SERVICE = 'tibco-cli';

async function getSecrets(profName: string, secretType?: keyof ProfileSecrets) {
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

async function insertOrUpdateSecrets(profName: string, secrets: ProfileSecrets) {
  let currSecrets = await getSecrets(profName);
  let newSecrets;

  if (typeof currSecrets === 'object') {
    newSecrets = { ...currSecrets, ...secrets };
  } else {
    newSecrets = secrets;
  }

  await keytar.setPassword(SERVICE, profName, JSON.stringify(newSecrets));
}

async function removeSecrets(profName: string) {
  return await keytar.deletePassword(SERVICE, profName);
}

export const secureStore = { getSecrets, insertOrUpdateSecrets, removeSecrets };
