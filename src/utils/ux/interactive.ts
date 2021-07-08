// Prompts only if flags are not applied in commands

export async function prompt(question: string, type: 'input' | 'password' = 'input', answer?: string) {
  if (!answer && answer !== '') {
    const {prompt} = require('enquirer');
    let re = await prompt({type: type, name: 'result', message: question});
    return re.result;
  } else {
    console.log('Using answer (' + answer + ') for question: ' + question)
    return answer;
  }
}

export async function promptChoices(question: string, choices: any[], answer?: string) {
  if (!answer && answer !== '') {
    const {Select} = require('enquirer');
    const prompt = new Select({
      message: question,
      choices: choices,
      limit: 5,
    });
    return await prompt.run();
  } else {
    console.log('Using answer (' + answer + ') for question: ' + question)
    return answer;
  }
}

export async function promptChoicesWithSearch(question: string, choices: any[], answer?: string) {
  if (!answer && answer !== '') {
    const {AutoComplete} = require('enquirer');
    const prompt = new AutoComplete({
      message: question,
      choices: choices,
      limit: 5,
    });
    return await prompt.run();
  } else {
    console.log('Using answer (' + answer + ') for question: ' + question)
    return answer;
  }
}
