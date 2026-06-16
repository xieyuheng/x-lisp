import * as Cli from "@xieyuheng/cli.js"
import { errorReport } from "@xieyuheng/std.js/error"
import { bufferToArrayBuffer, getPackageJson } from "@xieyuheng/std.js/node"
import fs from "node:fs"
import { fileURLToPath } from "node:url"
import { decodeElf } from "./elf/index.ts"

const { version } = getPackageJson(fileURLToPath(import.meta.url))

const router = Cli.createRouter("x-lisp-boot", version)

router.defineRoutes(["readelf file -- read elf file"])

router.defineHandlers({
  readelf: async ({ args: [file] }) => {
    const buffer = bufferToArrayBuffer(fs.readFileSync(file))
    const elf = decodeElf(buffer)
    console.log(elf)
  },
})

try {
  await router.run(process.argv.slice(2))
} catch (error) {
  console.log(errorReport(error))
  process.exit(1)
}
