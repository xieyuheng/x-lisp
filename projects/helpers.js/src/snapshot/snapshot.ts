import fs from "node:fs"
import Path from "node:path"

export function snapshot(dir: string, name: string, text: string): void {
  fs.mkdirSync(dir, { recursive: true })
  const file = Path.join(dir, name)
  if (text === "") {
    if (fs.existsSync(file)) fs.unlinkSync(file)
  } else {
    fs.writeFileSync(file, text)
  }
}
