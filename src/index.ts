import { config } from './config'
import { settings } from './settings'

export default {
  config,
  settings,
}

console.log(config('app', ['config']))
console.log(settings('.vscode'))
