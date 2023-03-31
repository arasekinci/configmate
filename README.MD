# Configmate

## Installation

To use this module, you need to have Node.js installed on your system. You can then install the module using npm or yarn:

```
npm install --save configmate
```
or
```
yarn add configmate
```

## Config Function

This module provides a function for loading configuration files in different formats (json, js, ts, ini, and yaml).

### Usage

To load a configuration file, simply call the config function with the name of the configuration file (without the file extension):

```js
import configmate from 'configmate'

const config = configmate.config('myconfig')
```

By default, the config function looks for configuration files in the following locations:

- .myconfigrc
- .myconfigrc.ini
- .myconfigrc.yml
- .myconfigrc.yaml
- .myconfigrc.json
- config.myconfig.json
- config.myconfig.js
- config.myconfig.ts

### File Examples

.apprc, .apprc.ini

```ini
name = .apprc.ini
description = You can write the configuration in INI format.
version = 1
plugins[] = x
plugins[] = y
plugins[] = z
```

.apprc, .apprc.json, config.app.json (Recommended for standard applications)

```json
{
  "name": ".apprc.json",
  "description": "You can write the configuration in JSON format.",
  "version": 1,
  "plugins": [
    "x",
    "y",
    "z"
  ]
}
```

.apprc, .apprc.yml, .apprc.yaml

```yaml
name: .apprc.yml
description: You can write the configuration in YAML format.
version: 1
plugins:
  - x
  - y
  - z
```

config.app.js

```js
const config = {
  name: 'config.app.js',
  description: 'You can write the configuration as JavaScript.',
  version: 1,
  plugins: ['x', 'y', 'z'],
}

module.exports = config
```

config.app.ts (Recommended for TypeScript applications)

```ts
type Config = {
  name: string
  description: string
  version: number
  plugins: string[]
}

const config: Config = {
  name: 'config.app.ts',
  description: 'You can write the configuration as TypeScript.',
  version: 1,
  plugins: ['x', 'y', 'z'],
}

export default config
```
If a configuration file is found, its contents are parsed based on its file extension. If the file extension is not recognized, the function will try to auto-detect the format of the file based on its contents.

If a configuration file is found but its contents cannot be parsed, an error message is printed to the console and the next file in the search path is checked. If no configuration file is found or all files are found but their contents cannot be parsed, the function returns undefined.


## Settings Function

This function reads JSON files from a specified directory and returns them as a settings object.

### Usage

Import the function and call it with the directory path:

```js
import configmate from 'configmate'

const settings = configmate.setting('.mysettings')
```

Use the returned settings object as needed.

### Example

Assume we have the following JSON files in a directory named .mysettings/:

.mysettings/database.json

```json
{
  "host": "localhost",
  "port": 3306,
  "user": "myuser",
  "password": "mypassword"
}
```

.mysettings/logging.json

```json
{
  "level": "info",
  "path": "/var/log/myapp.log"
}
```

Calling the settings function with the directory path .mysettings/ will return the following object:

```json
{
  "database": {
    "host": "localhost",
    "port": 3306,
    "user": "myuser",
    "password": "mypassword"
  },
  "logging": {
    "level": "info",
    "path": "/var/log/myapp.log"
  }
}
```

### Notes

The function only reads JSON files in the specified directory. Other file types will be ignored.

If an error occurs while reading a JSON file, the error will be logged to the console and that file will be ignored in the returned settings object.

## License

This module is released under the MIT License. See LICENSE for details.
