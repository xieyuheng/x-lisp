import { writeln } from "@xieyuheng/helpers.js/file"
import { pathRelativeToCwd } from "@xieyuheng/helpers.js/path"

export function logPath(tag: string, path: string): void {
  writeln(`[${tag}] ${pathRelativeToCwd(path)}`)
}
