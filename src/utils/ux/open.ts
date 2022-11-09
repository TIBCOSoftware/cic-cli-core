/**
 * Copyright 2022. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

/**
 * Open file or browser or any app.
 * @memberof module:ux
 * @method open
 * @param target The thing you want to open. Can be a URL, file, or executable. Opens in the default app for the file type. For example, URLs open in your default browser.
 * @param options Check [options](https://github.com/sindresorhus/open#options) here.
 * @returns The spawned child process. You would normally not need to use this for anything, but it can be useful if you'd like to attach custom event listeners or perform other operations directly on the spawned process.
 */
export async function open(target: string, options?: any) {
  const open = await import('open');
  return open(target, options);
}
