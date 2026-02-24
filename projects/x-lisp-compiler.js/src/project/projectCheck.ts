import { createUrl } from "@xieyuheng/helpers.js/url"
import * as L from "../lisp/index.ts"
import {
  projectForEachSource,
  projectGetSourceFile,
  type Project,
} from "./index.ts"

export function projectCheck(project: Project): void {
  projectForEachSource(project, (project, id) => {
    const inputFile = projectGetSourceFile(project, id)
    const mod = L.loadEntry(createUrl(inputFile))
  })
}
