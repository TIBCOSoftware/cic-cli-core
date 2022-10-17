/**
 * Copyright 2022. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

/**
 * @class Use this class to show progress bar on the terminal.
 * @memberof module:ux
 */
export class ProgressBar {
  private readonly bar: any;

  /**
   * @param Bar ProgressBar package. ('progress' package on npm)
   * @param format Format of the bar.
   * @param total Total no. of ticks to complete the progress bar.
   */
  constructor(Bar: any, format: string, total: number) {
    if (typeof total === 'string') {
      total = parseInt(total);
    }

    let options = {
      total: total,
      complete: '\u2588',
      incomplete: '\u2591',
      stream: process.stdout,
      width: Math.floor(process.stdout.columns / 2),
    };
    this.bar = new Bar(format, options);
  }

  /**
   * Progress the bar based on the no. of ticks passed in count.
   * @param count No. of ticks to be passed to complete the progress.
   * @param customTokens To update the token values in progress bar.
   */
  tick(count = 1, customTokens?: any) {
    this.bar.tick(count, customTokens);
  }

  /**
   * To print some message on the terminal when progress bar is running.
   * @param msg  Message to be printed.
   */
  log(msg: string) {
    this.bar.interrupt(msg);
  }
}

/**
 * Creates instance of ProgressBar class.
 * @memberof module:ux
 * @method getProgressBar
 * @param format Bar contains ootb tokens and custom tokens.
 * @param total Total no. of ticks to complete progress on the bar.
 * @returns  ProgressBar instance
 */
export async function getProgressBar(format: string, total: number) {
  return new ProgressBar(await import('progress'), format, total);
}
