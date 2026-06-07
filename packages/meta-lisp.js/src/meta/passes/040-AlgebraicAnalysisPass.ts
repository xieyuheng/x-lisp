import * as M from "../index.ts"

export type DataConstructorInfo = {
  name: string
  pkgId: string
  modName: string
  typeName: string
  accessorNames: Array<string>
  predicateName: string
}

export type AlgebraicTypeInfo = {
  name: string
  pkgId: string
  modName: string
  constructorNames: Array<string>
}

export type AlgebraicAnalysisReport = {
  dataConstructorInfos: Map<string, DataConstructorInfo>
  algebraicTypeInfos: Map<string, AlgebraicTypeInfo>
}

export function algebraicKey(
  pkgId: string,
  modName: string,
  name: string,
): string {
  return `${pkgId}/${modName}/${name}`
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
          const pkgId = orderedPkg.id
          const constructorNames: Array<string> = []

          for (const ctor of stmt.dataConstructors) {
            constructorNames.push(ctor.name)
            const key = algebraicKey(pkgId, modName, ctor.name)
            dataConstructorInfos.set(key, {
              name: ctor.name,
              pkgId,
              modName,
              typeName,
              accessorNames: ctor.fields.map((f) => f.accessorName),
              predicateName: ctor.predicate,
            })
          }

          const typeKey = algebraicKey(pkgId, modName, typeName)
          algebraicTypeInfos.set(typeKey, {
            name: typeName,
            pkgId,
            modName,
            constructorNames,
          })
        }
      }
    }
  }

  return { dataConstructorInfos, algebraicTypeInfos }
}
