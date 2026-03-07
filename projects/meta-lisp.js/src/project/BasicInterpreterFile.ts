import Path from "node:path"
import { fileURLToPath } from "node:url"

const currentDir = Path.dirname(fileURLToPath(import.meta.url))

export const BasicInterpreterFile = Path.join(
  currentDir,
  "../../../basic-lisp.c/src/basic-lisp",
)
