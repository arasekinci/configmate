import fs from 'node:fs'
import chalk from 'chalk'
import ini from 'ini'
import yaml from 'yaml'

import type { ConfigFileType, ConfigFile } from './config.type'

export function config<T>(name: string, types: ConfigFileType[]): T | void {
  let files: ConfigFile[] = [
    { type: 'json', path: `${name}.config.json` },
    { type: 'js', path: `${name}.config.js` },
    { type: 'ts', path: `${name}.config.ts` },
    { type: 'ini', path: `.${name}rc` },
    { type: 'ini', path: `.${name}rc.ini` },
    { type: 'yaml', path: `.${name}rc.yml` },
    { type: 'yaml', path: `.${name}rc.yaml` },
    { type: 'json', path: `.${name}rc.json` },
  ]

  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    if (types && !types.includes(file.type)) {
      delete files[i]
    }
  }

  files = files.filter(Boolean)
  files = files.reduce((filelist, file) => {
    filelist.push({
      type: file.type,
      path: `config/${file.path}`,
    })

    return filelist
  }, files)

  for (const { type, path } of files) {
    if (fs.existsSync(path)) {
      const content = fs.readFileSync(path, 'utf8')

      if (type === 'json' || (type === 'ini' && /^\s*{/.test(content))) {
        try {
          return JSON.parse(content) as T
        } catch {
          console.log(chalk.red('error'), `${path} file format is not json.`)
        }
      }

      if (type === 'js') {
        try {
          return require(process.cwd() + '/' + path)
        } catch (err) {
          console.log(err)
          console.log(chalk.red('error'), `${path} file format is not js.`)
        }
      }

      if (type === 'ts') {
        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          return (require(process.cwd() + '/' + path) as { default: T }).default
        } catch {
          console.log(chalk.red('error'), `${path} file format is not ts.`)
        }
      }

      if (type === 'yaml' || (type === 'ini' && /:/.test(content))) {
        try {
          return yaml.parse(content) as T
        } catch {
          console.log(chalk.red('error'), `${path} file format is not yaml.`)
        }
      }

      if (type === 'ini') {
        try {
          return ini.parse(content) as T
        } catch {
          console.log(chalk.red('error'), `${path} file format is not ini.`)
        }
      }
    }
  }
}
