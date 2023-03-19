import fs from 'node:fs'

export function settings<T>(directory: string): T | undefined {
  const settings: Record<string, unknown> = {}

  if (fs.existsSync(directory)) {
    const files = fs.readdirSync(directory)

    for (const file of files) {
      const path = `${process.cwd()}/${directory}/${file}`

      if (fs.statSync(path).isFile()) {
        try {
          settings[file.replace('.json', '')] = require(path)
        } catch (err) {
          console.log(err)
        }
      }
    }

    return settings as T
  }
}
