import fs from "node:fs"
import Path from "node:path"

export function snapshot(dir: string, name: string, text: string): void {
  const file = Path.join(dir, name)
  const fileDir = Path.dirname(file)
  fs.mkdirSync(fileDir, { recursive: true })
  if (text === "") {
    if (fs.existsSync(file)) fs.unlinkSync(file)
  } else {
    fs.writeFileSync(file, text)
  }
}
