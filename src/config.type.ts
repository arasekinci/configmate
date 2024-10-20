export type ConfigFileType = 'ini' | 'yaml' | 'json' | 'js' | 'ts'

export type ConfigFile = {
  type: ConfigFileType
  path: string
}
