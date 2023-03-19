/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

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
