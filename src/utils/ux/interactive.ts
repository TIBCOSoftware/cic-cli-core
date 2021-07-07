// TODO: Prompts only if flags are not applied in commands

export async function prompt(question: string, type: 'input' | 'password' = 'input') {
  const { prompt } = require('enquirer');
  let re = await prompt({ type: type, name: 'result', message: question });
  return re.result;
}

export async function promptChoices(question: string, choices: any[]) {
  const { Select } = require('enquirer');

  const prompt = new Select({
    message: question,
    choices: choices,
    limit: 5,
  });

  return await prompt.run();
}

export async function promptChoicesWithSearch(question: string, choices: any[]) {
  const { AutoComplete } = require('enquirer');

  const prompt = new AutoComplete({
    message: question,
    choices: choices,
    limit: 5,
  });

  return await prompt.run();
}
