import { createUrl } from "../helpers/url/createUrl.ts"
import * as L from "../lang/index.ts"

export function buildModule(file: string) {
  const langMod = L.loadEntry(createUrl(file))
  const dependencyMods = Array.from(langMod.dependencies.values())
  const sourceFiles = dependencyMods.map((mod) => mod.url.pathname)

  console.log({
    who: "buildModule",
    rootFile: langMod.url.pathname,
    sourceFiles,
  })
}
