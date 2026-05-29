import fs from "node:fs"
import Path from "node:path"

export type PackageLockEntry = {
  name: string
  path: string
  hash: string
  dependencies: Array<string>
}

export type PackageLock = {
  self: { name: string }
  dependencies: Record<string, PackageLockEntry>
}

export function readLockFile(
  rootDirectory: string,
): PackageLock | undefined {
  const lockPath = Path.join(rootDirectory, "meta-package-lock.json")
  if (!fs.existsSync(lockPath)) return undefined
  const raw = fs.readFileSync(lockPath, "utf-8")
  return JSON.parse(raw) as PackageLock
}

export function writeLockFile(
  rootDirectory: string,
  lock: PackageLock,
): void {
  const lockPath = Path.join(rootDirectory, "meta-package-lock.json")
  const content = JSON.stringify(lock, null, 2) + "\n"
  fs.writeFileSync(lockPath, content)
}

export function createEmptyLock(name: string): PackageLock {
  return {
    self: { name },
    dependencies: {},
  }
}
