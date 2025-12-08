import * as Cmd from "@xieyuheng/cmd.js"
import { errorReport } from "@xieyuheng/helpers.js/error"
import { bufferToArrayBuffer, getPackageJson } from "@xieyuheng/helpers.js/node"
import fs from "node:fs"
import { fileURLToPath } from "node:url"
import { decodeElf } from "./elf/index.ts"

const { version } = getPackageJson(fileURLToPath(import.meta.url))

const router = Cmd.createRouter("x-lisp-boot", version)

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
