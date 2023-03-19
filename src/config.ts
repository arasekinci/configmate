import fs from 'node:fs'
import chalk from 'chalk'
import ini from 'ini'
import yaml from 'yaml'

const filelist: {
  type: 'detect' | 'ini' | 'yaml' | 'json' | 'js' | 'ts'
  path: string
}[] = [
  { type: 'detect', path: `.[name]rc` },
  { type: 'ini', path: `.[name]rc.ini` },
  { type: 'yaml', path: `.[name]rc.yml` },
  { type: 'yaml', path: `.[name]rc.yaml` },
  { type: 'json', path: `.[name]rc.json` },
  { type: 'json', path: `config.[name].json` },
  { type: 'js', path: `config.[name].js` },
  { type: 'ts', path: `config.[name].ts` },
]

function parse<T>(content: string): T {
  if (/^\s*{/.test(content)) {
    return JSON.parse(content)
  }

  if (/:/.test(content)) {
    return yaml.parse(content)
  }

  return ini.parse(content) as T
}

export function config<T>(name: string, paths?: string[]): T | undefined {
  if (paths) {
    const files = [...filelist]

    for (const path of paths) {
      for (const file of files) {
        filelist.push({
          type: file.type,
          path: `${path}/${file.path}`,
        })
      }
    }
  }

  for (const file of filelist) {
    const path = file.path.replace('[name]', name)

    if (fs.existsSync(path)) {
      const content = fs.readFileSync(path, 'utf8')

      if (file.type === 'json') {
        try {
          return JSON.parse(content) as T
        } catch {
          console.log(chalk.red('error'), `${path} file format is not json.`)
        }
      }

      if (file.type === 'js') {
        try {
          return require(path)
        } catch {
          console.log(chalk.red('error'), `${path} file format is not js.`)
        }
      }

      if (file.type === 'ts') {
        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          return (require(path) as { default: T }).default
        } catch {
          console.log(chalk.red('error'), `${path} file format is not ts.`)
        }
      }

      if (file.type === 'yaml') {
        try {
          return yaml.parse(content) as T
        } catch {
          console.log(chalk.red('error'), `${path} file format is not yaml.`)
        }
      }

      if (file.type === 'ini') {
        try {
          return ini.parse(content) as T
        } catch {
          console.log(chalk.red('error'), `${path} file format is not ini.`)
        }
      }

      if (file.type === 'detect') {
        try {
          return parse(content) as T
        } catch {
          console.log(
            chalk.red('error'),
            `${path} file format is corrupt or corrupt, please check.`
          )
        }
      }
    }
  }
}
