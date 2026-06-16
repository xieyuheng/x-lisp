import Path from "node:path"
import { test } from "node:test"
import { fileURLToPath } from "node:url"
import { snapshot } from "../snapshot/index.ts"
import { fileRead, openInputFile } from "./index.ts"

const currentDir = Path.dirname(fileURLToPath(import.meta.url))
const snapshotDir = Path.join(currentDir, "..", "..", "snapshot")

test("fileRead", () => {
  const file = openInputFile(Path.join(currentDir, "index.ts"))
  snapshot(snapshotDir, "fileRead.test.out", fileRead(file))
})
