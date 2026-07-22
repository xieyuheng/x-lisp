import fs from "node:fs"
import Path from "node:path"
import * as M from "../meta/index.ts"
import * as Pkg from "../package/index.ts"

export type DataConstructorInfo = {
  name: string
  pkgName: string
  modName: string
  typeName: string
  accessorNames: Array<string>
  predicateName: string
}

export type AlgebraicTypeInfo = {
  name: string
  pkgName: string
  modName: string
  constructorNames: Array<string>
}

export type AlgebraicAnalysisReport = {
  dataConstructorInfos: Map<string, DataConstructorInfo>
  algebraicTypeInfos: Map<string, AlgebraicTypeInfo>
}

export function algebraicKey(
  pkgName: string,
  modName: string,
  name: string,
): string {
  return `${pkgName}/${modName}/${name}`
}

export function AlgebraicAnalysisPass(
  pkg: Pkg.Package,
): AlgebraicAnalysisReport {
  const dataConstructorInfos = new Map<string, DataConstructorInfo>()
  const algebraicTypeInfos = new Map<string, AlgebraicTypeInfo>()

  for (const fragment of pkg.fragments.values()) {
    for (const stmt of fragment.stmts) {
      if (stmt.kind === "DefineAlgebraicTypeStmt") {
        collectAlgebraicType(
          dataConstructorInfos,
          algebraicTypeInfos,
          fragment.modName,
          stmt,
          pkg.id,
        )
      }
    }
  }

  for (const [alias, dep] of pkg.dependencies) {
    for (const fragment of dep.fragments.values()) {
      for (const stmt of fragment.stmts) {
        if (stmt.kind === "DefineAlgebraicTypeStmt") {
          collectAlgebraicType(
            dataConstructorInfos,
            algebraicTypeInfos,
            fragment.modName,
            stmt,
            alias,
          )
        }
      }
    }
  }

  const report: AlgebraicAnalysisReport = {
    dataConstructorInfos,
    algebraicTypeInfos,
  }

  if (pkg.config.compiler.dump) {
    dumpAlgebraicAnalysisReport(report, pkg)
  }

  return report
}

function collectAlgebraicType(
  dataConstructorInfos: Map<string, DataConstructorInfo>,
  algebraicTypeInfos: Map<string, AlgebraicTypeInfo>,
  modName: string,
  stmt: M.DefineAlgebraicTypeStmt<M.Exp>,
  pkgName: string,
): void {
  const typeName = stmt.typeConstructor.name
  const constructorNames: Array<string> = []

  for (const ctor of stmt.dataConstructors) {
    constructorNames.push(ctor.name)
    const key = algebraicKey(pkgName, modName, ctor.name)
    dataConstructorInfos.set(key, {
      name: ctor.name,
      pkgName,
      modName,
      typeName,
      accessorNames: ctor.fields.map((f) => f.accessorName),
      predicateName: ctor.predicate,
    })
  }

  const typeKey = algebraicKey(pkgName, modName, typeName)
  algebraicTypeInfos.set(typeKey, {
    name: typeName,
    pkgName,
    modName,
    constructorNames,
  })
}

function dumpAlgebraicAnalysisReport(
  report: AlgebraicAnalysisReport,
  pkg: Pkg.Package,
): void {
  const dir = Path.join(Pkg.packageOutputDirectory(pkg), "dump")
  fs.mkdirSync(dir, { recursive: true })
  const file = Path.join(dir, "040-algebraic-analysis-report.dump")
  const content = formatAlgebraicAnalysisReport(report)
  fs.writeFileSync(file, content + "\n", "utf-8")
}

function formatAlgebraicAnalysisReport(
  report: AlgebraicAnalysisReport,
): string {
  const lines: Array<string> = []
  lines.push("(algebraic-analysis-report")

  lines.push("  (data-constructor-infos")
  for (const [key, info] of [...report.dataConstructorInfos].sort((a, b) =>
    cmp(a[0], b[0]),
  )) {
    lines.push(`    ("${key}"`)
    lines.push(`      (pkg-name ${info.pkgName})`)
    lines.push(`      (mod-name ${info.modName})`)
    lines.push(`      (type-name ${info.typeName})`)
    lines.push(`      (name ${info.name})`)
    lines.push(`      (accessor-names ${info.accessorNames.join(" ")})`)
    lines.push(`      (predicate-name ${info.predicateName})`)
    closeTop(lines)
  }
  closeTop(lines)

  lines.push("  (algebraic-type-infos")
  for (const [key, info] of [...report.algebraicTypeInfos].sort((a, b) =>
    cmp(a[0], b[0]),
  )) {
    lines.push(`    ("${key}"`)
    lines.push(`      (pkg-name ${info.pkgName})`)
    lines.push(`      (mod-name ${info.modName})`)
    lines.push(`      (name ${info.name})`)
    lines.push(`      (constructor-names ${info.constructorNames.join(" ")})`)
    closeTop(lines)
  }
  closeTop(lines)

  closeTop(lines)
  return lines.join("\n")
}

function closeTop(lines: Array<string>): void {
  const i = lines.length - 1
  lines[i] = lines[i] + ")"
}

function cmp(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0
}
