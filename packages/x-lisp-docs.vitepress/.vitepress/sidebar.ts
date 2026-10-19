import { readdirSync, readFileSync } from "node:fs"
import { basename, join } from "node:path"

import matter from "gray-matter"
import type { DefaultTheme } from "vitepress"

export type SidebarOptions = {
  indexFiles: string[]
  depth?: number
}

function titleOf(file: string): string {
  const { data, content } = matter(readFileSync(file, "utf8"))

  if (typeof data.title === "string") {
    return data.title
  }

  const heading = content.match(/^#\s+(.+?)\s*$/m)

  return heading?.[1] ?? basename(file, ".md")
}

function isDirectory(entry: { isDirectory(): boolean }): boolean {
  return entry.isDirectory()
}

export function sidebarFor(
  dir: string,
  base: string,
  options: SidebarOptions,
): DefaultTheme.SidebarItem[] {
  const { indexFiles, depth = 1 } = options

  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() || entry.name.endsWith(".md"))
    .sort((a, b) => {
      if (indexFiles.includes(a.name)) return -1
      if (indexFiles.includes(b.name)) return 1

      if (isDirectory(a) !== isDirectory(b)) {
        return isDirectory(a) ? 1 : -1
      }

      return a.name.localeCompare(b.name)
    })
    .map((entry) => {
      if (entry.isDirectory()) {
        return {
          text: entry.name,
          ...(depth > 1 ? { collapsed: true } : {}),
          items: sidebarFor(join(dir, entry.name), `${base}${entry.name}/`, {
            indexFiles,
            depth: depth + 1,
          }),
        }
      }

      const name = basename(entry.name, ".md")

      return {
        text: titleOf(join(dir, entry.name)),
        link: indexFiles.includes(entry.name) ? base : `${base}${name}`,
      }
    })
}
