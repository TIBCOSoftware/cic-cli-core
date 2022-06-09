## Classes

<dl>
<dt><a href="#ProgressBar">ProgressBar</a></dt>
<dd><p>Use this class to show progress bar on the terminal.</p>
</dd>
<dt><a href="#Spinner">Spinner</a></dt>
<dd><p>Use this class to show spinner on the terminal.</p>
</dd>
<dt><a href="#BaseCommand">BaseCommand</a></dt>
<dd><p>Extend this class while developing commands.<br>
It contains common flags implemented and creates instances of some useful classes for you.</p>
</dd>
<dt><a href="#TCBaseCommand">TCBaseCommand</a></dt>
<dd><p>Extend this class while developing commands which interact with TIBCO Cloud.<br>
It contains common flags implemented and creates instances of some useful classes for you.</p>
</dd>
<dt><a href="#PluginConfig">PluginConfig</a></dt>
<dd><p>Use this class to manage your plugin&#39;s configurations.</p>
</dd>
<dt><a href="#CLIBaseError">CLIBaseError</a></dt>
<dd><p>Extend this class if you want to create custom errors.</p>
</dd>
<dt><a href="#HTTPError">HTTPError</a></dt>
<dd><p>Class to throw HTTP Errors.</p>
</dd>
<dt><a href="#ProfileConfig">ProfileConfig</a></dt>
<dd><p>Use this class to manage profile&#39;s configurations.</p>
</dd>
<dt><a href="#HTTPRequest">HTTPRequest</a></dt>
<dd><p>Use this class to make any HTTP requests.</p>
</dd>
<dt><a href="#TCRequest">TCRequest</a></dt>
<dd><p>Use this class to make requests to TIBCO cloud.<br>
It will add token to the authorisation header before making request.<br>
<a href="https://api.cloud.tibco.com">https://api.cloud.tibco.com</a> is considered as a base URL when you passes only path to the functions.<br>
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
<dd><p>UX object for the CLI.</p>
</dd>
<dt><a href="#Logger">Logger</a> : <code>Object</code></dt>
<dd><p>Logger object in case you need it outside Command class.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#getPluginConfig">getPluginConfig(globalPath, localPath, topics)</a> ⇒</dt>
<dd><p>Get instance of <a href="#PluginConfig">PluginConfig</a> to manage config file properties.</p>
</dd>
</dl>

<a name="ProgressBar"></a>

## ProgressBar
Use this class to show progress bar on the terminal.

**Kind**: global class  

* [ProgressBar](#ProgressBar)
    * [new ProgressBar(Bar, format, total)](#new_ProgressBar_new)
    * [.tick(count, customTokens)](#ProgressBar+tick)
    * [.log(msg)](#ProgressBar+log)

<a name="new_ProgressBar_new"></a>

### new ProgressBar(Bar, format, total)

| Param | Description |
| --- | --- |
| Bar | ProgressBar package. ('progress' package on npm) |
| format | Format of the bar. |
| total | Total no. of ticks to complete the progress bar. |

<a name="ProgressBar+tick"></a>

### progressBar.tick(count, customTokens)
Progress the bar based on the no. of ticks passed in count.

**Kind**: instance method of [<code>ProgressBar</code>](#ProgressBar)  

| Param | Default | Description |
| --- | --- | --- |
| count | <code>1</code> | No. of ticks to be passed to complete the progress. |
| customTokens |  | To update the token values in progress bar. |

<a name="ProgressBar+log"></a>

### progressBar.log(msg)
To print some message on the terminal when progress bar is running.

**Kind**: instance method of [<code>ProgressBar</code>](#ProgressBar)  

| Param | Description |
| --- | --- |
| msg | Message to be printed. |

<a name="Spinner"></a>

## Spinner
Use this class to show spinner on the terminal.

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
To start a spinner.

**Kind**: instance method of [<code>Spinner</code>](#Spinner)  

| Param | Description |
| --- | --- |
| text | Text while spinning. |

<a name="Spinner+succeed"></a>

### spinner.succeed(text)
Mark spinner's task as success.(✔)

**Kind**: instance method of [<code>Spinner</code>](#Spinner)  

| Param | Description |
| --- | --- |
| text | Text while marking spinner succeed. |

<a name="Spinner+fail"></a>

### spinner.fail(text)
Mark spinner's task as failed.(✖)

**Kind**: instance method of [<code>Spinner</code>](#Spinner)  

| Param | Description |
| --- | --- |
| text | Text while marking spinner failed. |

<a name="Spinner+info"></a>

### spinner.info(text)
Mark spinner's task with information.(ℹ)

**Kind**: instance method of [<code>Spinner</code>](#Spinner)  

| Param | Description |
| --- | --- |
| text | Text while marking spinner with information. |

<a name="Spinner+warn"></a>

### spinner.warn(text)
Mark spinner's task with warning.(⚠)

**Kind**: instance method of [<code>Spinner</code>](#Spinner)  

| Param | Description |
| --- | --- |
| text | Text while marking spinner with warning. |

<a name="Spinner+stop"></a>

### spinner.stop()
Stop the spinner without persisting text.

**Kind**: instance method of [<code>Spinner</code>](#Spinner)  
<a name="BaseCommand"></a>

## BaseCommand
Extend this class while developing commands.<br>
It contains common flags implemented and creates instances of some useful classes for you.

**Kind**: global class  

* [BaseCommand](#BaseCommand)
    * [.getHTTPRequest()](#BaseCommand+getHTTPRequest) ⇒
    * [.getPluginConfig()](#BaseCommand+getPluginConfig) ⇒

<a name="BaseCommand+getHTTPRequest"></a>

### baseCommand.getHTTPRequest() ⇒
Get instance of HTTPRequest class.

**Kind**: instance method of [<code>BaseCommand</code>](#BaseCommand)  
**Returns**: returns instance of HTTPRequest class.  
<a name="BaseCommand+getPluginConfig"></a>

### baseCommand.getPluginConfig() ⇒
Get instance of PluginConfig Class.

**Kind**: instance method of [<code>BaseCommand</code>](#BaseCommand)  
**Returns**: returns instance of PluginConfig class.  
<a name="TCBaseCommand"></a>

## TCBaseCommand
Extend this class while developing commands which interact with TIBCO Cloud.<br>
It contains common flags implemented and creates instances of some useful classes for you.

**Kind**: global class  

* [TCBaseCommand](#TCBaseCommand)
    * [.getProfileConfig()](#TCBaseCommand+getProfileConfig) ⇒
    * [.saveProfileConfig(config)](#TCBaseCommand+saveProfileConfig) ⇒
    * [.reloadProfileConfig()](#TCBaseCommand+reloadProfileConfig) ⇒
    * [.getTCRequest()](#TCBaseCommand+getTCRequest) ⇒

<a name="TCBaseCommand+getProfileConfig"></a>

### tcBaseCommand.getProfileConfig() ⇒
Gets the profile config.

**Kind**: instance method of [<code>TCBaseCommand</code>](#TCBaseCommand)  
**Returns**: ProfileConfig Instance.  
<a name="TCBaseCommand+saveProfileConfig"></a>

### tcBaseCommand.saveProfileConfig(config) ⇒
Saves profile object to the file.

**Kind**: instance method of [<code>TCBaseCommand</code>](#TCBaseCommand)  
**Returns**: void  

| Param | Description |
| --- | --- |
| config | Profile to be saved into the file |

<a name="TCBaseCommand+reloadProfileConfig"></a>

### tcBaseCommand.reloadProfileConfig() ⇒
Reloads profile from the file.

**Kind**: instance method of [<code>TCBaseCommand</code>](#TCBaseCommand)  
**Returns**: ProfileConfig Instance.  
<a name="TCBaseCommand+getTCRequest"></a>

### tcBaseCommand.getTCRequest() ⇒
Get instance of TCRequest class.

**Kind**: instance method of [<code>TCBaseCommand</code>](#TCBaseCommand)  
**Returns**: Instance of TCRequest class.  
<a name="PluginConfig"></a>

## PluginConfig
Use this class to manage your plugin's configurations.

**Kind**: global class  

* [PluginConfig](#PluginConfig)
    * [new PluginConfig(globalPath, localPath, topics)](#new_PluginConfig_new)
    * [.get(property, options)](#PluginConfig+get) ⇒
    * [.set(property, value, options)](#PluginConfig+set) ⇒
    * [.delete(property, options)](#PluginConfig+delete) ⇒
    * [.reload()](#PluginConfig+reload)

<a name="new_PluginConfig_new"></a>

### new PluginConfig(globalPath, localPath, topics)

| Param | Description |
| --- | --- |
| globalPath | Path to the global config file. That is -> path.join(cmdObj.config.configDir, "tibco-cli-config.ini") |
| localPath | Path to the local config file. |
| topics | Topics under which currently executing command resides. |

<a name="PluginConfig+get"></a>

### pluginConfig.get(property, options) ⇒
To get a property value from the configuration file.

**Kind**: instance method of [<code>PluginConfig</code>](#PluginConfig)  
**Returns**: Property value | undefined  

| Param | Description |
| --- | --- |
| property | Property name. |
| options | Options object. |
| options.absolutePath | If true, then property's path should be mention from the root section of the config file else just pass the property name. |
| options.source | To get a property from local config or global config. |

<a name="PluginConfig+set"></a>

### pluginConfig.set(property, value, options) ⇒
To update or insert property in the config file.

**Kind**: instance method of [<code>PluginConfig</code>](#PluginConfig)  
**Returns**: undefined  

| Param | Description |
| --- | --- |
| property | Property name. |
| value | Value of the property. |
| options | Options object. |
| options.absolutePath | If true, then property's path should be mention from the root section of the config file else just pass the property name. |
| options.source | Set a property to local config or global config. |

<a name="PluginConfig+delete"></a>

### pluginConfig.delete(property, options) ⇒
To delete a property in the config file.

**Kind**: instance method of [<code>PluginConfig</code>](#PluginConfig)  
**Returns**: undefined  

| Param | Description |
| --- | --- |
| property | Property Name. |
| options | Options object. |
| options.absolutePath | If true, then property's path should be mention from the root section of the config file else just pass the property name. |
| options.source | To delete a property from local config or global config. |

<a name="PluginConfig+reload"></a>

### pluginConfig.reload()
Reload local and global config file.

**Kind**: instance method of [<code>PluginConfig</code>](#PluginConfig)  
<a name="CLIBaseError"></a>

## CLIBaseError
Extend this class if you want to create custom errors.

**Kind**: global class  
<a name="HTTPError"></a>

## HTTPError
Class to throw HTTP Errors.

**Kind**: global class  
<a name="new_HTTPError_new"></a>

### new HTTPError(message, httpCode, httpResponse, httpHeaders)

| Param | Description |
| --- | --- |
| message | Error message. |
| httpCode | HTTP Code for error. |
| httpResponse | HTTP Response. |
| httpHeaders | HTTP Headers. |

<a name="ProfileConfig"></a>

## ProfileConfig
Use this class to manage profile's configurations.

**Kind**: global class  

* [ProfileConfig](#ProfileConfig)
    * [new ProfileConfig(clientID, version, defaultProfile, profiles)](#new_ProfileConfig_new)
    * [.addProfile(profile, secrets)](#ProfileConfig+addProfile) ⇒
    * [.getProfileByName(name)](#ProfileConfig+getProfileByName) ⇒
    * [.removeProfile(name)](#ProfileConfig+removeProfile) ⇒

<a name="new_ProfileConfig_new"></a>

### new ProfileConfig(clientID, version, defaultProfile, profiles)

| Param | Description |
| --- | --- |
| clientID | Id generated for the clients machine. |
| version | Configuration version. |
| defaultProfile | Default profile from the multiple profiles. |
| profiles | Array of profiles. |

<a name="ProfileConfig+addProfile"></a>

### profileConfig.addProfile(profile, secrets) ⇒
Add profile.

**Kind**: instance method of [<code>ProfileConfig</code>](#ProfileConfig)  
**Returns**: void  

| Param | Description |
| --- | --- |
| profile | Profile to be added. |
| secrets | Profile's secret data. |

<a name="ProfileConfig+getProfileByName"></a>

### profileConfig.getProfileByName(name) ⇒
Search for the profile.

**Kind**: instance method of [<code>ProfileConfig</code>](#ProfileConfig)  
**Returns**: Profile  

| Param | Description |
| --- | --- |
| name | Name of the profile. |

<a name="ProfileConfig+removeProfile"></a>

### profileConfig.removeProfile(name) ⇒
Remove profile.

**Kind**: instance method of [<code>ProfileConfig</code>](#ProfileConfig)  
**Returns**: Returns a promise, if it is resolved then profile was removed successfully.  

| Param | Description |
| --- | --- |
| name | Name of a profile to be removed. |

<a name="HTTPRequest"></a>

## HTTPRequest
Use this class to make any HTTP requests.

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
Instantiate HTTPRequest object, parameters are optional.


| Param | Description |
| --- | --- |
| commandName | Command which makes an HTTP request. |
| pluginName | Plugin to which command belongs. |

<a name="HTTPRequest+getAxiosClient"></a>

### httpRequest.getAxiosClient() ⇒
Creates Axios client with common options.

**Kind**: instance method of [<code>HTTPRequest</code>](#HTTPRequest)  
**Returns**: Axios client.  
<a name="HTTPRequest+addHttpOptions"></a>

### httpRequest.addHttpOptions(options) ⇒
Add common options to the AxiosRequestConfig.

**Kind**: instance method of [<code>HTTPRequest</code>](#HTTPRequest)  
**Returns**: Axios options object  

| Param | Description |
| --- | --- |
| options | Options object where common options can be added. |

<a name="HTTPRequest+doRequest"></a>

### httpRequest.doRequest(url, options, data) ⇒
Make HTTP Request and get a response.

**Kind**: instance method of [<code>HTTPRequest</code>](#HTTPRequest)  
**Returns**: response of HTTP Request.  

| Param | Description |
| --- | --- |
| url | Url where to make a request. |
| options | Options along with request. |
| data | Data to be sent with request. (Note: if data is passed to the function and method not specified then POST method is considered as default) |

<a name="HTTPRequest+download"></a>

### httpRequest.download(url, pathToStore, options, showProgressBar) ⇒
Downloads file from a url.

**Kind**: instance method of [<code>HTTPRequest</code>](#HTTPRequest)  
**Returns**: True if file downloaded succesfully else will throw some error.  

| Param | Default | Description |
| --- | --- | --- |
| url |  | Url from where file needs to be downloaded. |
| pathToStore |  | Location where file to be stored. |
| options |  | HTTP options. |
| showProgressBar | <code>false</code> | To show progress bar on terminal. |

<a name="HTTPRequest+upload"></a>

### httpRequest.upload(url, data, options, showProgressBar) ⇒
Uploads file to a url.

**Kind**: instance method of [<code>HTTPRequest</code>](#HTTPRequest)  
**Returns**: HTTP response.  

| Param | Default | Description |
| --- | --- | --- |
| url |  | Url where file to be uploaded. |
| data |  | Multipart form data in simple \{key: value\} format. |
| options |  | HTTP options. |
| showProgressBar | <code>false</code> | To show progress bar on the terminal. |

<a name="TCRequest"></a>

## TCRequest
Use this class to make requests to TIBCO cloud.<br>
It will add token to the authorisation header before making request.<br>
https://api.cloud.tibco.com is considered as a base URL when you passes only path to the functions.<br>
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
    * [.upload(url, data, options, showProgressBar)](#TCRequest+upload) ⇒

<a name="new_TCRequest_new"></a>

### new TCRequest(profile, clientId, commandName, pluginName)

| Param | Description |
| --- | --- |
| profile | Profile to be considered while making request. |
| clientId | ClientId of a CLI. |
| commandName | Command which needs to make HTTP request. |
| pluginName | Plugin to which command belongs. |

<a name="TCRequest+getValidToken"></a>

### tcRequest.getValidToken() ⇒
Validate existing token, will refresh if expired.

**Kind**: instance method of [<code>TCRequest</code>](#TCRequest)  
**Returns**: Valid Token.  
<a name="TCRequest+getAxiosClient"></a>

### tcRequest.getAxiosClient(baseURL) ⇒
Returns axios client with common options.

**Kind**: instance method of [<code>TCRequest</code>](#TCRequest)  
**Returns**: Axios client.  

| Param | Description |
| --- | --- |
| baseURL | Base URL to be considered for this client. It will add region to the endpoint based on user profile. |

<a name="TCRequest+doRequest"></a>

### tcRequest.doRequest(url, options, data) ⇒
Make HTTP Request to TIBCO Cloud and get a response.

**Kind**: instance method of [<code>TCRequest</code>](#TCRequest)  
**Returns**: Provides response for HTTP Request.  

| Param | Description |
| --- | --- |
| url | Url where to make request, region is added to th url as per profile.If only is passes then `https://api.cloud.tibco.com` is considered as a baseUrl. |
| options | HTTP options. |
| data | Data to be sent. If data is passed and no method specified then POST method id considered. |

<a name="TCRequest+download"></a>

### tcRequest.download(url, pathToStore, options, showProgressBar) ⇒
Downloads file from a url.

**Kind**: instance method of [<code>TCRequest</code>](#TCRequest)  
**Returns**: true if file downloaded succesfully else will throw some error.  

| Param | Default | Description |
| --- | --- | --- |
| url |  | Url from where file needs to be downloaded. |
| pathToStore |  | Location where file to be stored. |
| options |  | HTTP options. |
| showProgressBar | <code>true</code> | To show progress bar on the terminal. |

<a name="TCRequest+upload"></a>

### tcRequest.upload(url, data, options, showProgressBar) ⇒
Uploads file to a url.

**Kind**: instance method of [<code>TCRequest</code>](#TCRequest)  
**Returns**: HTTP response.  

| Param | Default | Description |
| --- | --- | --- |
| url |  | Url where file to be uploaded. |
| data |  | Multipart form data in simple \{key: value\} format. |
| options |  | HTTP options. |
| showProgressBar | <code>false</code> | To show progress bar on the terminal. |

<a name="ux"></a>

## ux : <code>Object</code>
UX object for the CLI.

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
Promp a question on terminal.

**Kind**: static property of [<code>ux</code>](#ux)  
**Returns**: Answer of a prompt.  

| Param | Description |
| --- | --- |
| question | Question to be prompted. |
| type | Type of a input (input or password). |
| answer | If choice already passed as command option. |

<a name="ux.promptChoices"></a>

### ux.promptChoices(question, choices, answer) ⇒
Prompt choices on terminal.

**Kind**: static method of [<code>ux</code>](#ux)  
**Returns**: Array of selected choices.  

| Param | Description |
| --- | --- |
| question | Question to be displayed when choices are prompted. |
| choices | Choices for the selection. |
| answer | If choice already passed as command option. |

<a name="ux.promptChoicesWithSearch"></a>

### ux.promptChoicesWithSearch(question, choices, answer) ⇒
Prompt choices with search capability on ther terminal.

**Kind**: static method of [<code>ux</code>](#ux)  
**Returns**: Array of selected choices.  

| Param | Description |
| --- | --- |
| question | Question to be displayed when choices are prompted. |
| choices | Choices for the selection. |
| answer | If choice already passed as command option. |

<a name="ux.promptMultiSelectChoices"></a>

### ux.promptMultiSelectChoices(question, choices, answer) ⇒
Prompt mulit select choices with search capability on ther terminal.

**Kind**: static method of [<code>ux</code>](#ux)  
**Returns**: Array of selected choices.  

| Param | Description |
| --- | --- |
| question | Question to be displayed when choices are prompted. |
| choices | Choices for the selection. |
| answer | If choice already passed as command option. |

<a name="ux.open"></a>

### ux.open(target, options) ⇒
Open file or browser or any app.

**Kind**: static method of [<code>ux</code>](#ux)  
**Returns**: The spawned child process. You would normally not need to use this for anything, but it can be useful if you'd like to attach custom event listeners or perform other operations directly on the spawned process.  

| Param | Description |
| --- | --- |
| target | The thing you want to open. Can be a URL, file, or executable. Opens in the default app for the file type. For example, URLs open in your default browser. |
| options | Check [options](https://github.com/sindresorhus/open#options) here. |

<a name="ux.getProgressBar"></a>

### ux.getProgressBar(format, total) ⇒
Creates instance of ProgressBar class.

**Kind**: static method of [<code>ux</code>](#ux)  
**Returns**: ProgressBar instance  

| Param | Description |
| --- | --- |
| format | Bar contains ootb tokens and custom tokens. |
| total | Total no. of ticks to complete progress on the bar. |

<a name="ux.spinner"></a>

### ux.spinner() ⇒
Creates a spinner instance from Spinner class.

**Kind**: static method of [<code>ux</code>](#ux)  
**Returns**: Spinner instance.  
<a name="ux.showTable"></a>

### ux.showTable(tObject, title)
Prints table for array of object. (Takes care of terminal width as well)

**Kind**: static method of [<code>ux</code>](#ux)  

| Param | Description |
| --- | --- |
| tObject | Array of objects. |
| title | Title of the table. |

<a name="Logger"></a>

## Logger : <code>Object</code>
Logger object in case you need it outside Command class.

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
| message | Message to be printed on terminal. |
| args |  |

<a name="Logger.debug"></a>

### Logger.debug(args) ⇒
Debugs on the terminal when DEBUG env variable set.

**Kind**: static method of [<code>Logger</code>](#Logger)  
**Returns**: void  

| Param | Description |
| --- | --- |
| args | Debugging info. |

<a name="Logger.warn"></a>

### Logger.warn(input) ⇒
Warns on the terminal.

**Kind**: static method of [<code>Logger</code>](#Logger)  
**Returns**: void  

| Param | Description |
| --- | --- |
| input | String used for warning or any error. |

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
**Returns**: Method that can be used for debugging.  

| Param | Description |
| --- | --- |
| namespace | Namespace to be added for debugging. |

<a name="getPluginConfig"></a>

## getPluginConfig(globalPath, localPath, topics) ⇒
Get instance of [PluginConfig](#PluginConfig) to manage config file properties.

**Kind**: global function  
**Returns**: PluginConfig  

| Param | Description |
| --- | --- |
| globalPath | Path where global config file is stored. |
| localPath | Path where local config file is stored. |
| topics | Topics under which the command resides. |

