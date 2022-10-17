/**
 * Copyright 2022. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

/**
 * @class Use this class to show spinner on the terminal.
 * @memberof module:ux
 */
export class Spinner {
  private readonly ora: any;

  constructor(ora: any) {
    this.ora = ora();
  }

  get isSpinning() {
    return this.ora.isSpinning as boolean;
  }

  get text() {
    return this.ora.text as string;
  }

  set text(text: string) {
    this.ora.text = text;
  }

  /**
   * To start a spinner.
   * @param text Text while spinning.
   */
  start(text: string) {
    this.ora.start(text);
  }

  /**
   * Mark spinner's task as success.(✔)
   * @param text Text while marking spinner succeed.
   */
  succeed(text: string) {
    this.ora.succeed(text);
  }

  /**
   * Mark spinner's task as failed.(✖)
   * @param text Text while marking spinner failed.
   */
  fail(text: string) {
    this.ora.fail(text);
  }

  /**
   * Mark spinner's task with information.(ℹ)
   * @param text Text while marking spinner with information.
   */
  info(text: string) {
    this.ora.info(text);
  }

  /**
   * Mark spinner's task with warning.(⚠)
   * @param text Text while marking spinner with warning.
   */
  warn(text: string) {
    this.ora.warn(text);
  }

  /**
   * Stop the spinner without persisting text.
   */
  stop() {
    this.ora.stop();
  }
}

/**
 * Returns the instance of Spinner class.
 * @memberof module:ux
 * @method spinner
 * @returns Spinner instance.
 */
export async function spinner() {
  return new Spinner(await import('ora'));
}
