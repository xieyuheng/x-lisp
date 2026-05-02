import fs from "node:fs"
import Path from "node:path"
import * as M from "../index.ts"

export function projectLoadModFragments(
  project: M.Project,
  directory: string,
): void {
  for (const name of fs.readdirSync(directory, {
    encoding: "utf-8",
    recursive: true,
  })) {
    if (name.endsWith(".meta")) {
      const path = Path.join(directory, name)
      const fragment = M.loadModFragment(path)
      M.projectPutFragment(project, path, fragment)
    }
  }
}
