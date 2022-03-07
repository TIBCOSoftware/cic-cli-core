/**
 * Copyright 2022. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

import { prompt, promptChoices, promptChoicesWithSearch, promptMultiSelectChoices } from './interactive';
import { open } from './open';
import { getProgressBar } from './progress';
import { spinner } from './spinner';
import { showTable } from './table';
/**
 * @type {Object}
 * UX object for the CLI
 */
export const ux = {
  /**
   * Promp a question on terminal
   * @param question Question to be prompted
   * @param type type of a input (input or password)
   * @param answer If choice already passed as command option
   * @returns answer of a prompt
   */
  prompt,

  /**
   * Prompt choices on terminal
   * @memberof ux
   * @method promptChoices
   * @param question Question to be displayed when choices are prompted
   * @param choices Choices for the selection
   * @param answer If choice already passed as command option
   * @returns Array of selected choices
   */
  promptChoices,

  /**
   * Prompt choices with search capability on ther terminal
   * @memberof ux
   * @method promptChoicesWithSearch
   * @param question Question to be displayed when choices are prompted
   * @param choices Choices for the selection
   * @param answer If choice already passed as command option
   * @returns Array of selected choices
   */
  promptChoicesWithSearch,

  /**
   * Prompt mulit select choices with search capability on ther terminal
   * @memberof ux
   * @method promptMultiSelectChoices
   * @param question Question to be displayed when choices are prompted
   * @param choices Choices for the selection
   * @param answer If choice already passed as command option
   * @returns Array of selected choices
   */
  promptMultiSelectChoices,

  /**
   * Open file or browser or any app.
   * @memberof ux
   * @method open
   * @param target The thing you want to open. Can be a URL, file, or executable. Opens in the default app for the file type. For example, URLs open in your default browser.
   * @param options Check [options](https://github.com/sindresorhus/open#options) here
   * @returns The spawned child process. You would normally not need to use this for anything, but it can be useful if you'd like to attach custom event listeners or perform other operations directly on the spawned process.
   */
  open,
  /**
   * Creates progress bar instance from ProgressBar class
   * @memberof ux
   * @method getProgressBar
   * @param format bar contains ootb tokens and custom tokens
   * @param total total no. of ticks to complete progress on the bar
   * @returns  progress bar instance
   */
  getProgressBar,

  /**
   * Creates a spinner instance from Spinner class
   * @memberof ux
   * @method spinner
   * @returns Returns a spinner instance
   */
  spinner,

  /**
   * Prints table for array of object (Takes care of terminal width as well)
   * @memberof ux
   * @method showTable
   * @param tObject Array of objects
   * @param title Title to the table
   */
  showTable,
};
