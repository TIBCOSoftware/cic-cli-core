/**
 * Copyright 2022. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

/**
 * @class Progress bar class
 */
class ProgressBar {
  private readonly bar: any;

  /**
   * @param Bar Progressbar package. ('progress' package on npm)
   * @param format format in to which bar has to be represented
   * @param total total no. of ticks to complete progress on the bar
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
   * Progresses the bar based on no. of ticks passed in count
   * @param count No. of ticks to be passed to complete progress
   * @param customTokens to update token values in progress bar
   */
  tick(count = 1, customTokens?: any) {
    this.bar.tick(count, customTokens);
  }

  /**
   * To print some messgae on terminal while progress bar is running
   * @param msg  message to be printed
   */
  log(msg: string) {
    this.bar.interrupt(msg);
  }
}

export async function getProgressBar(format: string, total: number) {
  return new ProgressBar(await import('progress'), format, total);
}
