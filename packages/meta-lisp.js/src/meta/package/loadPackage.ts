import Path from "node:path"
import * as M from "../index.ts"

export function loadPackage(configPath: string): M.Package {
  const config = M.loadPackageConfig(configPath)
  const rootDirectory = Path.resolve(Path.dirname(configPath))
  const pkg = M.createPackage(rootDirectory, config)
  M.loadBuiltinMod(pkg)
  for (const [alias, depPath] of Object.entries(config.dependencies)) {
    const resolvedPath = Path.resolve(rootDirectory, depPath, "meta-package.json")
    const depPkg = loadPackage(resolvedPath)
    pkg.dependencies.set(alias, depPkg)
  }
  const sourceDirectory = M.packageSourceDirectory(pkg)
  M.packageLoadFragments(pkg, sourceDirectory)
  return pkg
}

export function resolvePackageLock(pkg: M.Package): M.PackageLock {
  const lock = M.readLockFile(pkg.rootDirectory) ?? M.createEmptyLock(pkg.config.name)
  const hashOf = new Map<string, string>()
  const entries: Array<{ hash: string; name: string; path: string }> = []

  function collect(p: M.Package): string {
    const cached = hashOf.get(p.rootDirectory)
    if (cached) return cached

    for (const [alias, depPkg] of p.dependencies) {
      collect(depPkg)
    }

    const hash = p === pkg ? "self" : M.computePackageHash(p)
    hashOf.set(p.rootDirectory, hash)
    if (p !== pkg) {
      entries.push({
        hash,
        name: p.config.name,
        path: p.config.dependencies?.[p.config.name] ?? "",
      })
    }
    return hash
  }

  collect(pkg)

  for (const entry of entries) {
    const existing = lock.dependencies[entry.hash]
    if (existing && existing.name !== entry.name) {
      throw new Error(
        `[resolvePackageLock] hash collision for "${entry.name}" ` +
          `and "${existing.name}" with hash "${entry.hash}"`,
      )
    }
    const p = findPackageByRootDir(pkg, entry.name)
    const depHashes: Array<string> = []
    if (p) {
      for (const [, depPkg] of p.dependencies) {
        const h = hashOf.get(depPkg.rootDirectory)
        if (h) depHashes.push(h)
      }
    }
    lock.dependencies[entry.hash] = {
      name: entry.name,
      path: entry.path,
      hash: entry.hash,
      dependencies: depHashes,
    }
  }

  M.writeLockFile(pkg.rootDirectory, lock)
  return lock
}

function findPackageByRootDir(
  pkg: M.Package,
  name: string,
): M.Package | undefined {
  if (pkg.config.name === name) return pkg
  for (const depPkg of pkg.dependencies.values()) {
    const found = findPackageByRootDir(depPkg, name)
    if (found) return found
  }
  return undefined
}
