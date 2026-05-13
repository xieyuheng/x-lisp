import fs from "node:fs"
import Path from "node:path"
import * as M from "../index.ts"

export function projectLoadModFragments(
  project: M.Project,
  directory: string,
): void {
  const modFragmentCounters = new Map<string, number>()

  for (const name of fs.readdirSync(directory, {
    encoding: "utf-8",
    recursive: true,
  })) {
    if (name.endsWith(".meta")) {
      const path = Path.join(directory, name)
      const fragment = M.loadModFragment(path)

      const count = modFragmentCounters.get(fragment.modName) ?? 0
      modFragmentCounters.set(fragment.modName, count + 1)
      fragment.serialNumber = count

      M.projectPutFragment(project, path, fragment)
    }
  }
}
