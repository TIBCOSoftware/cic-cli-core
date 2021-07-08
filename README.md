@tibco-cloud/cli-core
=====================

Core Library for TIBCO cloud cli

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@tibco-cloud/cli-core.svg)](https://npmjs.org/package/@tibco-cloud/cli-core)
[![Downloads/week](https://img.shields.io/npm/dw/@tibco-cloud/cli-core.svg)](https://npmjs.org/package/@tibco-cloud/cli-core)
[![License](https://img.shields.io/npm/l/@tibco-cloud/cli-core.svg)](https://github.com/hectorvp/cli-core/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @tibco-cloud/cli-core
$ cli-core COMMAND
running command...
$ cli-core (-v|--version|version)
@tibco-cloud/cli-core/0.1.0 darwin-x64 node-v14.15.5
$ cli-core --help [COMMAND]
USAGE
  $ cli-core COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`cli-core hello [FILE]`](#cli-core-hello-file)
* [`cli-core help [COMMAND]`](#cli-core-help-command)

## `cli-core hello [FILE]`

describe the command here

```
USAGE
  $ cli-core hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ cli-core hello
  hello world from ./src/OrderFor.ts!
```

_See code: [src/commands/OrderFor.ts](https://github.com/hectorvp/cli-core/blob/v0.1.0/src/commands/hello.ts)_

## `cli-core help [COMMAND]`

display help for cli-core

```
USAGE
  $ cli-core help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_
<!-- commandsstop -->
