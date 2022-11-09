/**
 * Copyright 2022. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

import { Choice } from '../../models/models';
import { Logger } from '../log';

const debug = require('debug')('@tibco-software/cic-cli-core:ux:interactive');

/**
 * Prompt a question on the terminal.
 * @memberof module:ux
 * @method prompt
 * @param question Question to be prompted.
 * @param type Type of a input (input or password).
 * @param answer If choice already passed as command option.
 * @returns Answer of a prompt.
 */
export async function prompt(question: string, type: 'input' | 'password' = 'input', answer?: string) {
  if (!answer && answer !== '') {
    const { prompt } = require('enquirer');
    let re = await prompt({ type: type, name: 'result', message: question });
    return re.result;
  } else {
    debug('Using answer (' + answer + ') for question: ' + question);
    return answer;
  }
}

/**
 * Prompt choices on the terminal.
 * @memberof module:ux
 * @method promptChoices
 * @param question Question to be displayed when choices are prompted.
 * @param choices Choices for the selection.
 * @param answer If choice already passed as command option.
 * @returns Array of selected choices.
 */
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
    debug('Using answer (' + answer + ') for question: ' + question);
    return answer;
  }
}

/**
 * Prompt choices with search capability on ther terminal.
 * @memberof module:ux
 * @method promptChoicesWithSearch
 * @param question Question to be displayed when choices are prompted.
 * @param choices Choices for the selection.
 * @param answer If choice already passed as command option.
 * @returns Array of selected choices.
 */
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
    debug('Using answer (' + answer + ') for question: ' + question);
    return answer;
  }
}

/**
 * Prompt mulit select choices with search capability on ther terminal.
 * @memberof module:ux
 * @method promptMultiSelectChoices
 * @param question Question to be displayed when choices are prompted.
 * @param choices Choices for the selection.
 * @param answer If choice already passed as command option.
 * @returns Array of selected choices.
 */
export async function promptMultiSelectChoices(question: string, choices: Choice[], answer?: string[]) {
  if (answer) {
    debug('Using answer (' + answer + ') for question: ' + question);
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
