import fs from 'node:fs'
import path from 'node:path'

export function settings<T>(dirname: string): T | void {
  if (fs.existsSync(dirname)) {
    const result: Record<string, unknown> = {}
    const dirents = fs.readdirSync(dirname)

    for (const dirent of dirents) {
      const filepath = path.join(dirname, dirent)
      const file = path.parse(filepath)

      if (fs.statSync(filepath).isFile() && file.ext === '.json') {
        try {
          result[file.name] = require(filepath)
        } catch (err) {
          console.log(err)
        }
      }
    }

    return result as T
  }
}
