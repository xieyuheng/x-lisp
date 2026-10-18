import fs from "node:fs"
import Path from "node:path"
import * as M from "../index.ts"
import { type Package, packagePutFragment } from "./Package.ts"

export function packageLoadFragments(pkg: Package, directory: string): void {
  const names = fs
    .readdirSync(directory, {
      encoding: "utf-8",
      recursive: true,
    })
    .sort()

  for (const name of names) {
    if (name.endsWith(".meta") || name.endsWith(".md")) {
      const path = Path.join(directory, name)
      for (const fragment of M.loadFragments(path)) {
        packagePutFragment(pkg, fragment)
      }
    }
  }
}
