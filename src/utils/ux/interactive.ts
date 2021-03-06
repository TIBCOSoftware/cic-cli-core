/**
 * Copyright 2022. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

import { Choice } from '../../models/models';
import { Logger } from '../log';

export async function prompt(question: string, type: 'input' | 'password' = 'input', answer?: string) {
  if (!answer && answer !== '') {
    const { prompt } = require('enquirer');
    let re = await prompt({ type: type, name: 'result', message: question });
    return re.result;
  } else {
    Logger.log('Using answer (' + answer + ') for question: ' + question);
    return answer;
  }
}

export async function promptChoices(question: string, choices: Choice[], answer?: string) {
  if (!answer && answer !== '') {
    if (choices.length === 0) return [];
    const { Select } = require('enquirer');
    const prompt = new Select({
      message: question,
      choices: choices,
      limit: 7,
      result() {
        return this.focused.value;
      },
    });
    return prompt.run();
  } else {
    Logger.log('Using answer (' + answer + ') for question: ' + question);
    return answer;
  }
}

export async function promptChoicesWithSearch(question: string, choices: Choice[], answer?: string) {
  if (!answer && answer !== '') {
    if (choices.length === 0) return [];
    const { AutoComplete } = require('enquirer');
    const prompt = new AutoComplete({
      message: question,
      choices: choices,
      limit: 7,
      result() {
        return this.focused.value;
      },
    });
    return await prompt.run();
  } else {
    Logger.log('Using answer (' + answer + ') for question: ' + question);
    return answer;
  }
}

export async function promptMultiSelectChoices(question: string, choices: Choice[], answer?: string[]) {
  if (answer) {
    Logger.log('Using answer (' + answer + ') for question: ' + question);
    return answer;
  }

  const { MultiSelect } = require('enquirer');
  const prompt = new MultiSelect({
    message: question,
    choices: choices,
    limit: 7,
    initials: getPreSelected(choices),
    result(names: any) {
      let values: string[] = [];
      names.forEach((name: string) => values.push(this.find(name, 'value')));
      return values;
    },
  });
  return await prompt.run();
}

function getPreSelected(choices: any) {
  return choices.filter((choice: any) => {
    if (choice.checked) {
      return choice.name;
    }
  });
}
