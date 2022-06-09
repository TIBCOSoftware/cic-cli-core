/**
 * Copyright 2022. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

import { BaseCommand } from '../base-commands/base-command';
let command: BaseCommand;
let _debug: any;

export function setCommand(c: BaseCommand) {
  command = c;
}

function log(message: string | undefined, ...args: any[]) {
  if (command) {
    command.log(message, ...args);
  } else {
    let util = require('util');
    message = typeof message === 'string' ? message : util.inspect(message);
    process.stdout.write(util.format(message, '') + '\n');
  }
}

function debug(...args: any[]) {
  let pkgName = command?.config.pjson?.name || '';

  if (!_debug) {
    _debug = require('debug')(pkgName);
  }
  _debug(...args);
}

function warn(...params: Parameters<typeof command.warn>) {
  if (command) {
    command.warn(...params);
  } else {
    let Errors = require('@oclif/errors');
    Errors.warn(...params);
  }
}

function extendDebugger(namespace: string) {
  let pkgName = command?.config.pjson?.name || '';

  if (!_debug) {
    _debug = require('debug')(pkgName);
  }

  return _debug.extend(namespace);
}

/**
 * @type {Object}
 * Logger object in case you need it outside Command class.
 */
export const Logger = {
  /**
   * Logs to the terminal.
   * @memberof Logger
   * @method log
   * @param message Message to be printed on terminal.
   * @param args
   * @returns void
   */
  log,

  /**
   * Debugs on the terminal when DEBUG env variable set.
   * @memberof Logger
   * @method debug
   * @param args Debugging info.
   * @returns void
   */
  debug,

  /**
   * Warns on the terminal.
   * @memberof Logger
   * @method warn
   * @param input String used for warning or any error.
   * @returns void
   */
  warn,

  /**
   * Extends namespace of the debugger.<br>
   * Prints debugging message with prefix in this format "<your_package_name>:<specified_namespace>"  <br>
   * For e.g.:
   * ```ts
   * let _debug = Logger.extendDebugger('myspace');
   * _debug("Debugging info");  // For e.g: @tibco-software/cic-cli-software:myspace Debugging info +3ms
   * ```
   * @memberof Logger
   * @method extendDebugger
   * @param namespace Namespace to be added for debugging.
   * @returns Method that can be used for debugging.
   *
   */
  extendDebugger,
};
