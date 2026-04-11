import { writeln } from "@xieyuheng/helpers.js/file"

export function log(tag: string, message: string): void {
  writeln(`[${tag}] ${message}`)
}
