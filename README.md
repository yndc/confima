# Confima

A full-featured Node.js configuration loader and validator.

Features:
- Load and merge configuration variables from files (JSON, YAML, TOML, and JS), environment variables, and command arguments
- Validate configurations with JSON schema
- Automatic configuration reload at runtime with automatic fallback

## Installation

`yarn add confima`

## Usage

### Basic Usage

#### Loading from files

```
const confima = require('confima')
const config = confima().fromFile('path/to/file.yaml').get()
```

#### Loading from environent variables

```
const confima = require('confima')
const config = confima().fromEnvironment("APP_VAR_").get()
```

#### Loading from command arguments

```
const confima = require('confima')
const config = confima().fromArgument("config.").get()
```

#### Combine configurations from multiple sources

```
const confima = require('confima')
const defaultConfig = {}
confima().fromObject(defaultConfig)
  .fromFile('config.json')
  .fromEnvironment("APP_CONFIG_")
  .fromArgument("config.")
  .get()
```

#### Using JSON schema as config validation

```
const confima = require('confima')
const defaultConfig = {}
const configSchema = {}
const config = confima().setSchema(schema)
  .fromObject(defaultConfig)
  .fromFile('config.json')
  .fromEnvironment("APP_CONFIG_")
  .fromArgument("config.")
  .get()
```

### Advanced Usage

#### Using configuration file hot-reloading

```
const confima = require('confima')
const config = confima().fromFile('config.json', true)

// Whenever you need to retrieve value from config
const configValues = config.get()
```