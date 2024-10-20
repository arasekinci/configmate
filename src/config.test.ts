import filesystem from 'node:fs'
import path from 'node:path'

import { config } from './config'

type Config = {
  version: number
  plugins: string[]
}

const ini = `version = 1
plugins[] = x
plugins[] = y
plugins[] = z`

const yaml = `version: 1
plugins:
  - x
  - y
  - z`

const json = `{
  "version": 1,
  "plugins": ["x", "y", "z"]
}`

const js = `const config = {
  version: 1,
  plugins: ['x', 'y', 'z'],
}

module.exports = config`

const ts = `type Config = {
  version: number
  plugins: string[]
}

const config: Config = {
version: 1,
plugins: ['x', 'y', 'z'],
}

export default config`

const rootDir = path.join(__dirname, '../', 'config')
const output = {
  version: 1,
  plugins: ['x', 'y', 'z'],
}

function create(name: string, content: string) {
  try {
    const filepath = path.join(rootDir, name)

    filesystem.writeFileSync(filepath, content)
  } catch (err) {
    console.error(`There was a problem creating the ${name} file`, err)
  }
}

beforeAll(() => {
  filesystem.mkdirSync(path.join(rootDir))
})

afterAll(() => {
  filesystem.rmSync(path.join(rootDir), { recursive: true })
})

test('INI', async () => {
  create('.apprc.ini', ini)
  const data = config<Config>('app', ['ini'])

  if (data) {
    data.version = parseInt(output.version as unknown as string)
  }

  expect(data).toEqual(output)
})

test('YAML', async () => {
  create('.apprc.yaml', yaml)
  expect(config('app', ['yaml'])).toEqual(output)

  create('.apprc.yml', yaml)
  expect(config('app', ['yaml'])).toEqual(output)
})

test('JSON', async () => {
  create('.apprc.json', json)
  expect(config('app', ['json'])).toEqual(output)

  create('app.config.json', json)
  expect(config('app', ['json'])).toEqual(output)
})

test('JavaScript', async () => {
  create('app.config.js', js)
  expect(config('app', ['js'])).toEqual(output)
})

test('TypeScript', async () => {
  create('app.config.ts', ts)
  expect(config('app', ['ts'])).toEqual(output)
})
