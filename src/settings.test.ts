import filesystem from 'node:fs'
import path from 'node:path'

import { settings } from './settings'

const dirname = path.join(__dirname, '../', '.mysettings')
const output = {
  database: {
    host: 'localhost',
    port: 3306,
    user: 'myuser',
    password: 'mypassword',
  },
  logging: {
    level: 'info',
    path: '/var/log/myapp.log',
  },
}

type Settings = typeof output

beforeAll(() => {
  filesystem.mkdirSync(path.join(dirname))
})

afterAll(() => {
  filesystem.rmSync(path.join(dirname), { recursive: true })
})

test('Settings', async () => {
  filesystem.writeFileSync(
    path.join(dirname, 'database.json'),
    JSON.stringify(output.database)
  )
  filesystem.writeFileSync(
    path.join(dirname, 'logging.json'),
    JSON.stringify(output.logging)
  )

  expect(settings<Settings>(dirname)).toEqual(output)
})
