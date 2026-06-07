import * as M from "../index.ts"

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

export function qualifiedId(
  pkgName: string,
  modName: string,
  name: string,
): string {
  return `${pkgName}/${modName}/${name}`
}

export function AlgebraicAnalysisPass(pkg: M.Package): AlgebraicAnalysisReport {
  const dataConstructorInfos = new Map<string, DataConstructorInfo>()
  const algebraicTypeInfos = new Map<string, AlgebraicTypeInfo>()

  for (const orderedPkg of M.packageClosureInTopologicalOrder(pkg)) {
    for (const fragment of orderedPkg.fragments.values()) {
      for (const stmt of fragment.stmts) {
        if (stmt.kind === "DefineAlgebraicTypeStmt") {
          const typeName = stmt.typeConstructor.name
          const modName = fragment.modName
          const pkgName = orderedPkg.id
          const constructorNames: Array<string> = []

          for (const ctor of stmt.dataConstructors) {
            constructorNames.push(ctor.name)
            const key = qualifiedId(pkgName, modName, ctor.name)
            dataConstructorInfos.set(key, {
              name: ctor.name,
              pkgName,
              modName,
              typeName,
              accessorNames: ctor.fields.map((f) => f.accessorName),
              predicateName: ctor.predicate,
            })
          }

          const typeKey = qualifiedId(pkgName, modName, typeName)
          algebraicTypeInfos.set(typeKey, {
            name: typeName,
            pkgName,
            modName,
            constructorNames,
          })
        }
      }
    }
  }

  return { dataConstructorInfos, algebraicTypeInfos }
}
