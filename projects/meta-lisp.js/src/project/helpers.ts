import { pathRelativeToCwd } from "@xieyuheng/helpers.js/path"

export function logPath(tag: string, path: string): void {
  console.log(`[${tag}] ${pathRelativeToCwd(path)}`)
}
