## Classes

<dl>
<dt><a href="#ProgressBar">ProgressBar</a></dt>
<dd><p>Progress bar class</p>
</dd>
<dt><a href="#Spinner">Spinner</a></dt>
<dd><p>Spinner class</p>
</dd>
<dt><a href="#BaseCommand">BaseCommand</a></dt>
<dd><p>Extend this class while developing commands.
It contains some common command flags implemented and creates instances of some useful classes for you.</p>
</dd>
<dt><a href="#TCBaseCommand">TCBaseCommand</a></dt>
<dd><p>Extend this class while developing commands which interact with TIBCO Cloud.
It contains some common command flags implemented and creates instances of some useful classes for you.</p>
</dd>
<dt><a href="#CLIBaseError">CLIBaseError</a></dt>
<dd><p>Extend this class if you want create custom errors</p>
</dd>
<dt><a href="#HTTPError">HTTPError</a></dt>
<dd><p>In case you want to throw an HTTP Error</p>
</dd>
<dt><a href="#ProfileConfig">ProfileConfig</a></dt>
<dd><p>Class representing CLI configuration</p>
</dd>
<dt><a href="#HTTPRequest">HTTPRequest</a></dt>
<dd><p>Use this class to make any HTTP requests</p>
</dd>
<dt><a href="#TCRequest">TCRequest</a></dt>
<dd><p>Use this class to make requests to TIBCO cloud.
It will add token to the authorisation header before  making request.
<a href="https://api.cloud.tibco.com">https://api.cloud.tibco.com</a> is considered as a base URL when someone passes only path to the functions.
For E.g:</p>
<pre><code class="language-ts">req.doRequest(&#39;cic/v1/apps/&#39;,{},&#39;mydata&#39;) // URL would be https://api.cloud.tibco.com/cic/vi/apps.
req.doRequest(&#39;http://mydomain.com/cic/v1/apps/&#39;,{},&#39;mydata&#39;) // URL would be http://mydomain.com/cic/v1/apps/.
// It will add region to the url if as per region in a profile
req.doRequest(&#39;/cic/v1/apps/&#39;,{},&#39;mydata&#39;); //if prof has eu region then URL would be https://eu.api.cloud.tibco.com/cic/v1/apps
</code></pre>
</dd>
</dl>

## Members

<dl>
<dt><a href="#ux">ux</a> : <code>Object</code></dt>
<dd><p>UX object for the CLI</p>
</dd>
<dt><a href="#Logger">Logger</a> : <code>Object</code></dt>
<dd><p>Logger object in case you need it oustide Command class</p>
</dd>
</dl>

<a name="ProgressBar"></a>

## ProgressBar
Progress bar class

**Kind**: global class  

* [ProgressBar](#ProgressBar)
    * [new ProgressBar(Bar, format, total)](#new_ProgressBar_new)
    * [.tick(count, customTokens)](#ProgressBar+tick)
    * [.log(msg)](#ProgressBar+log)

<a name="new_ProgressBar_new"></a>

### new ProgressBar(Bar, format, total)

| Param | Description |
| --- | --- |
| Bar | Progressbar package. ('progress' package on npm) |
| format | format in to which bar has to be represented |
| total | total no. of ticks to complete progress on the bar |

<a name="ProgressBar+tick"></a>

### progressBar.tick(count, customTokens)
Progresses the bar based on no. of ticks passed in count

**Kind**: instance method of [<code>ProgressBar</code>](#ProgressBar)  

| Param | Default | Description |
| --- | --- | --- |
| count | <code>1</code> | No. of ticks to be passed to complete progress |
| customTokens |  | to update token values in progress bar |

<a name="ProgressBar+log"></a>

### progressBar.log(msg)
To print some messgae on terminal while progress bar is running

**Kind**: instance method of [<code>ProgressBar</code>](#ProgressBar)  

| Param | Description |
| --- | --- |
| msg | message to be printed |

<a name="Spinner"></a>

## Spinner
Spinner class

**Kind**: global class  

* [Spinner](#Spinner)
    * [.start(text)](#Spinner+start)
    * [.succeed(text)](#Spinner+succeed)
    * [.fail(text)](#Spinner+fail)
    * [.info(text)](#Spinner+info)
    * [.warn(text)](#Spinner+warn)
    * [.stop()](#Spinner+stop)

<a name="Spinner+start"></a>

### spinner.start(text)
To start a spinner

**Kind**: instance method of [<code>Spinner</code>](#Spinner)  

| Param | Description |
| --- | --- |
| text | Text while spinning |

<a name="Spinner+succeed"></a>

### spinner.succeed(text)
Mark(✔) spinner's task as success

**Kind**: instance method of [<code>Spinner</code>](#Spinner)  

| Param | Description |
| --- | --- |
| text | Text while marking spinner succeed |

<a name="Spinner+fail"></a>

### spinner.fail(text)
Mark(✖) spinner's task as failed

**Kind**: instance method of [<code>Spinner</code>](#Spinner)  

| Param | Description |
| --- | --- |
| text | Text while marking spinner failed |

<a name="Spinner+info"></a>

### spinner.info(text)
Mark(ℹ) spinner's task with information

**Kind**: instance method of [<code>Spinner</code>](#Spinner)  

| Param | Description |
| --- | --- |
| text | Text while marking spinner with information |

<a name="Spinner+warn"></a>

### spinner.warn(text)
Mark(⚠) spinner's task with warning

**Kind**: instance method of [<code>Spinner</code>](#Spinner)  

| Param | Description |
| --- | --- |
| text | Text while marking spinner with warning |

<a name="Spinner+stop"></a>

### spinner.stop()
Stop the spinner without persisting text

**Kind**: instance method of [<code>Spinner</code>](#Spinner)  
<a name="BaseCommand"></a>

## BaseCommand
Extend this class while developing commands.
It contains some common command flags implemented and creates instances of some useful classes for you.

**Kind**: global class  
<a name="BaseCommand+getHTTPRequest"></a>

### baseCommand.getHTTPRequest() ⇒
Get instance of HTTPRequest class

**Kind**: instance method of [<code>BaseCommand</code>](#BaseCommand)  
**Returns**: returns instance of HTTPRequest class  
<a name="TCBaseCommand"></a>

## TCBaseCommand
Extend this class while developing commands which interact with TIBCO Cloud.
It contains some common command flags implemented and creates instances of some useful classes for you.

**Kind**: global class  

* [TCBaseCommand](#TCBaseCommand)
    * [.getProfileConfig()](#TCBaseCommand+getProfileConfig) ⇒
    * [.saveProfileConfig(config)](#TCBaseCommand+saveProfileConfig) ⇒
    * [.reloadProfileConfig()](#TCBaseCommand+reloadProfileConfig) ⇒
    * [.getTCRequest()](#TCBaseCommand+getTCRequest) ⇒

<a name="TCBaseCommand+getProfileConfig"></a>

### tcBaseCommand.getProfileConfig() ⇒
Gets the config from a config file

**Kind**: instance method of [<code>TCBaseCommand</code>](#TCBaseCommand)  
**Returns**: Returns configuration object  
<a name="TCBaseCommand+saveProfileConfig"></a>

### tcBaseCommand.saveProfileConfig(config) ⇒
Saves config to the file

**Kind**: instance method of [<code>TCBaseCommand</code>](#TCBaseCommand)  
**Returns**: void  

| Param | Description |
| --- | --- |
| config | Config to be saved into the file |

<a name="TCBaseCommand+reloadProfileConfig"></a>

### tcBaseCommand.reloadProfileConfig() ⇒
Reloads config from config file

**Kind**: instance method of [<code>TCBaseCommand</code>](#TCBaseCommand)  
**Returns**: Config  
<a name="TCBaseCommand+getTCRequest"></a>

### tcBaseCommand.getTCRequest() ⇒
Get instance of TCRequest class

**Kind**: instance method of [<code>TCBaseCommand</code>](#TCBaseCommand)  
**Returns**: returns instance of TCRequest class  
<a name="CLIBaseError"></a>

## CLIBaseError
Extend this class if you want create custom errors

**Kind**: global class  
<a name="HTTPError"></a>

## HTTPError
In case you want to throw an HTTP Error

**Kind**: global class  
<a name="new_HTTPError_new"></a>

### new HTTPError(message, httpCode, httpResponse, httpHeaders)

| Param | Description |
| --- | --- |
| message | Error message |
| httpCode | HTTP Code for error |
| httpResponse | HTTP Response |
| httpHeaders | HTTP Headers |

<a name="ProfileConfig"></a>

## ProfileConfig
Class representing CLI configuration

**Kind**: global class  

* [ProfileConfig](#ProfileConfig)
    * [new ProfileConfig(clientID, version, defaultProfile, profiles)](#new_ProfileConfig_new)
    * [.addProfile(profile, secrets)](#ProfileConfig+addProfile)
    * [.getProfileByName(name)](#ProfileConfig+getProfileByName) ⇒
    * [.removeProfile(name)](#ProfileConfig+removeProfile)

<a name="new_ProfileConfig_new"></a>

### new ProfileConfig(clientID, version, defaultProfile, profiles)

| Param | Description |
| --- | --- |
| clientID | used ot identify TIBCO client for a CLI |
| version | version of a configuration |
| defaultProfile | default profile from the multiple profiles |
| profiles | Array of profiles |

<a name="ProfileConfig+addProfile"></a>

### profileConfig.addProfile(profile, secrets)
Adds profile to the configuration

**Kind**: instance method of [<code>ProfileConfig</code>](#ProfileConfig)  

| Param | Description |
| --- | --- |
| profile | profile to be added |
| secrets | profile secret data |

<a name="ProfileConfig+getProfileByName"></a>

### profileConfig.getProfileByName(name) ⇒
Searches for the profile in a config

**Kind**: instance method of [<code>ProfileConfig</code>](#ProfileConfig)  
**Returns**: returns profile  

| Param | Description |
| --- | --- |
| name | Name of profile |

<a name="ProfileConfig+removeProfile"></a>

### profileConfig.removeProfile(name)
Removes profile from a config

**Kind**: instance method of [<code>ProfileConfig</code>](#ProfileConfig)  

| Param | Description |
| --- | --- |
| name | name of a profile ot be removed |

<a name="HTTPRequest"></a>

## HTTPRequest
Use this class to make any HTTP requests

**Kind**: global class  

* [HTTPRequest](#HTTPRequest)
    * [new HTTPRequest(commandName, pluginName)](#new_HTTPRequest_new)
    * [.getAxiosClient()](#HTTPRequest+getAxiosClient) ⇒
    * [.addHttpOptions(options)](#HTTPRequest+addHttpOptions) ⇒
    * [.doRequest(url, options, data)](#HTTPRequest+doRequest) ⇒
    * [.download(url, pathToStore, options, showProgressBar)](#HTTPRequest+download) ⇒
    * [.upload(url, data, options, showProgressBar)](#HTTPRequest+upload) ⇒

<a name="new_HTTPRequest_new"></a>

### new HTTPRequest(commandName, pluginName)
instantiate HTTPRequest object, parameters are optional


| Param | Description |
| --- | --- |
| commandName | command which needs to make HTTP request |
| pluginName | plugin to which command belongs |

<a name="HTTPRequest+getAxiosClient"></a>

### httpRequest.getAxiosClient() ⇒
Creates Axios client with adding common options

**Kind**: instance method of [<code>HTTPRequest</code>](#HTTPRequest)  
**Returns**: returns Axios client  
<a name="HTTPRequest+addHttpOptions"></a>

### httpRequest.addHttpOptions(options) ⇒
Add common options to the AxiosRequestConfig

**Kind**: instance method of [<code>HTTPRequest</code>](#HTTPRequest)  
**Returns**: returns options object  

| Param | Description |
| --- | --- |
| options | options object where common options can be added |

<a name="HTTPRequest+doRequest"></a>

### httpRequest.doRequest(url, options, data) ⇒
Make HTTP Request and get a response

**Kind**: instance method of [<code>HTTPRequest</code>](#HTTPRequest)  
**Returns**: response of HTTP Request  

| Param | Description |
| --- | --- |
| url | Url where to make a request |
| options | Options along with request |
| data | Data to be sent with request. (Note: if data is passed to the function and method not specified then POST method is considered as default) |

<a name="HTTPRequest+download"></a>

### httpRequest.download(url, pathToStore, options, showProgressBar) ⇒
Downloads file from a url

**Kind**: instance method of [<code>HTTPRequest</code>](#HTTPRequest)  
**Returns**: true if file downloaded succesfully else will throw some error  

| Param | Default | Description |
| --- | --- | --- |
| url |  | Url from where file needs to be downloaded |
| pathToStore |  | Location where file to be stored |
| options |  | HTTP options |
| showProgressBar | <code>false</code> | To show progress bar on terminal |

<a name="HTTPRequest+upload"></a>

### httpRequest.upload(url, data, options, showProgressBar) ⇒
Uploads file to a url

**Kind**: instance method of [<code>HTTPRequest</code>](#HTTPRequest)  
**Returns**: HTTP response  

| Param | Default | Description |
| --- | --- | --- |
| url |  | Url where file to be uploaded |
| data |  | Multipart form data in simple \{key: value\} format |
| options |  | HTTP options |
| showProgressBar | <code>false</code> | To show progress bar on terminal |

<a name="TCRequest"></a>

## TCRequest
Use this class to make requests to TIBCO cloud.
It will add token to the authorisation header before  making request.
https://api.cloud.tibco.com is considered as a base URL when someone passes only path to the functions.
For E.g:
```ts
req.doRequest('cic/v1/apps/',{},'mydata') // URL would be https://api.cloud.tibco.com/cic/vi/apps.
req.doRequest('http://mydomain.com/cic/v1/apps/',{},'mydata') // URL would be http://mydomain.com/cic/v1/apps/.
// It will add region to the url if as per region in a profile
req.doRequest('/cic/v1/apps/',{},'mydata'); //if prof has eu region then URL would be https://eu.api.cloud.tibco.com/cic/v1/apps
```

**Kind**: global class  

* [TCRequest](#TCRequest)
    * [new TCRequest(profile, clientId, commandName, pluginName)](#new_TCRequest_new)
    * [.getValidToken()](#TCRequest+getValidToken) ⇒
    * [.getAxiosClient(baseURL)](#TCRequest+getAxiosClient) ⇒
    * [.doRequest(url, options, data)](#TCRequest+doRequest) ⇒
    * [.download(url, pathToStore, options, showProgressBar)](#TCRequest+download) ⇒

<a name="new_TCRequest_new"></a>

### new TCRequest(profile, clientId, commandName, pluginName)

| Param | Description |
| --- | --- |
| profile | Profile to be considered while making request |
| clientId | ClientId of a CLI |
| commandName | Command which needs to make HTTP request |
| pluginName | Plugin to which command belongs |

<a name="TCRequest+getValidToken"></a>

### tcRequest.getValidToken() ⇒
Validate existing token, will refresh if expired

**Kind**: instance method of [<code>TCRequest</code>](#TCRequest)  
**Returns**: Returns valid Token  
<a name="TCRequest+getAxiosClient"></a>

### tcRequest.getAxiosClient(baseURL) ⇒
returns axios client with common options

**Kind**: instance method of [<code>TCRequest</code>](#TCRequest)  
**Returns**: Axios client  

| Param | Description |
| --- | --- |
| baseURL | baseURL to be considered for this client. It will add region to the endpoint based on user profile |

<a name="TCRequest+doRequest"></a>

### tcRequest.doRequest(url, options, data) ⇒
Make HTTP Request to TIBCO Cloud and get a response

**Kind**: instance method of [<code>TCRequest</code>](#TCRequest)  
**Returns**: Provides response for HTTP Request  

| Param | Description |
| --- | --- |
| url | Url where to make request, region is added to th url as per profile.If only is passes then `https://api.cloud.tibco.com` is considered as a baseUrl. |
| options | HTTP options |
| data | Data to be sent. If data is passed and no method specified then POST method id considered. |

<a name="TCRequest+download"></a>

### tcRequest.download(url, pathToStore, options, showProgressBar) ⇒
Downloads file from a url

**Kind**: instance method of [<code>TCRequest</code>](#TCRequest)  
**Returns**: true if file downloaded succesfully else will throw some error  

| Param | Default | Description |
| --- | --- | --- |
| url |  | Url from where file needs to be downloaded |
| pathToStore |  | Location where file to be stored |
| options |  | HTTP options |
| showProgressBar | <code>true</code> | To show progress bar on terminal |

<a name="ux"></a>

## ux : <code>Object</code>
UX object for the CLI

**Kind**: global variable  

* [ux](#ux) : <code>Object</code>
    * [.prompt](#ux.prompt) ⇒
    * [.promptChoices(question, choices, answer)](#ux.promptChoices) ⇒
    * [.promptChoicesWithSearch(question, choices, answer)](#ux.promptChoicesWithSearch) ⇒
    * [.promptMultiSelectChoices(question, choices, answer)](#ux.promptMultiSelectChoices) ⇒
    * [.open(target, options)](#ux.open) ⇒
    * [.getProgressBar(format, total)](#ux.getProgressBar) ⇒
    * [.spinner()](#ux.spinner) ⇒
    * [.showTable(tObject, title)](#ux.showTable)

<a name="ux.prompt"></a>

### ux.prompt ⇒
Promp a question on terminal

**Kind**: static property of [<code>ux</code>](#ux)  
**Returns**: answer of a prompt  

| Param | Description |
| --- | --- |
| question | Question to be prompted |
| type | type of a input (input or password) |
| answer | If choice already passed as command option |

<a name="ux.promptChoices"></a>

### ux.promptChoices(question, choices, answer) ⇒
Prompt choices on terminal

**Kind**: static method of [<code>ux</code>](#ux)  
**Returns**: Array of selected choices  

| Param | Description |
| --- | --- |
| question | Question to be displayed when choices are prompted |
| choices | Choices for the selection |
| answer | If choice already passed as command option |

<a name="ux.promptChoicesWithSearch"></a>

### ux.promptChoicesWithSearch(question, choices, answer) ⇒
Prompt choices with search capability on ther terminal

**Kind**: static method of [<code>ux</code>](#ux)  
**Returns**: Array of selected choices  

| Param | Description |
| --- | --- |
| question | Question to be displayed when choices are prompted |
| choices | Choices for the selection |
| answer | If choice already passed as command option |

<a name="ux.promptMultiSelectChoices"></a>

### ux.promptMultiSelectChoices(question, choices, answer) ⇒
Prompt mulit select choices with search capability on ther terminal

**Kind**: static method of [<code>ux</code>](#ux)  
**Returns**: Array of selected choices  

| Param | Description |
| --- | --- |
| question | Question to be displayed when choices are prompted |
| choices | Choices for the selection |
| answer | If choice already passed as command option |

<a name="ux.open"></a>

### ux.open(target, options) ⇒
Open file or browser or any app.

**Kind**: static method of [<code>ux</code>](#ux)  
**Returns**: The spawned child process. You would normally not need to use this for anything, but it can be useful if you'd like to attach custom event listeners or perform other operations directly on the spawned process.  

| Param | Description |
| --- | --- |
| target | The thing you want to open. Can be a URL, file, or executable. Opens in the default app for the file type. For example, URLs open in your default browser. |
| options | Check [options](https://github.com/sindresorhus/open#options) here |

<a name="ux.getProgressBar"></a>

### ux.getProgressBar(format, total) ⇒
Creates progress bar instance from ProgressBar class

**Kind**: static method of [<code>ux</code>](#ux)  
**Returns**: progress bar instance  

| Param | Description |
| --- | --- |
| format | bar contains ootb tokens and custom tokens |
| total | total no. of ticks to complete progress on the bar |

<a name="ux.spinner"></a>

### ux.spinner() ⇒
Creates a spinner instance from Spinner class

**Kind**: static method of [<code>ux</code>](#ux)  
**Returns**: Returns a spinner instance  
<a name="ux.showTable"></a>

### ux.showTable(tObject, title)
Prints table for array of object (Takes care of terminal width as well)

**Kind**: static method of [<code>ux</code>](#ux)  

| Param | Description |
| --- | --- |
| tObject | Array of objects |
| title | Title to the table |

<a name="Logger"></a>

## Logger : <code>Object</code>
Logger object in case you need it oustide Command class

**Kind**: global variable  

* [Logger](#Logger) : <code>Object</code>
    * [.log(message, args)](#Logger.log) ⇒
    * [.debug(args)](#Logger.debug) ⇒
    * [.warn(input)](#Logger.warn) ⇒
    * [.extendDebugger(namespace)](#Logger.extendDebugger) ⇒

<a name="Logger.log"></a>

### Logger.log(message, args) ⇒
Logs to the terminal.

**Kind**: static method of [<code>Logger</code>](#Logger)  
**Returns**: void  

| Param | Description |
| --- | --- |
| message | Message to be printed on terminal |
| args |  |

<a name="Logger.debug"></a>

### Logger.debug(args) ⇒
Debugs on the terminal when DEBUG env variable set

**Kind**: static method of [<code>Logger</code>](#Logger)  
**Returns**: void  

| Param | Description |
| --- | --- |
| args | debugging info |

<a name="Logger.warn"></a>

### Logger.warn(input) ⇒
Warns on the terminal.

**Kind**: static method of [<code>Logger</code>](#Logger)  
**Returns**: void  

| Param | Description |
| --- | --- |
| input | String used for warning or any error |

<a name="Logger.extendDebugger"></a>

### Logger.extendDebugger(namespace) ⇒
Extends namespace of the debugger.<br>
Prints debugging message with prefix in this format "<your_package_name>:<specified_namespace>"  <br>
For e.g.:
```ts
let _debug = Logger.extendDebugger('myspace');
_debug("Debugging info");  // For e.g: @tibco-software/cic-cli-software:myspace Debugging info +3ms
```

**Kind**: static method of [<code>Logger</code>](#Logger)  
**Returns**: method that can be used for debugging.  

| Param | Description |
| --- | --- |
| namespace | namespace to be added for debugging. |

