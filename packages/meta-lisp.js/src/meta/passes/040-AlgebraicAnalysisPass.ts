import * as M from "../index.ts"

export type DataConstructorInfo = {
  name: string
  pkgName: string
  modName: string
  typeName: string
  fieldNames: Array<string>
  predicateName: string
  accessorNames: Array<string>
}

export type AlgebraicTypeInfo = {
  name: string
  pkgName: string
  modName: string
  constructorNames: Array<string>
}

export type AlgebraicInfo = {
  dataConstructorInfos: Map<string, DataConstructorInfo>
  algebraicTypeInfos: Map<string, AlgebraicTypeInfo>
}

export function AlgebraicAnalysisPass(pkg: M.Package): AlgebraicInfo {
  const dataConstructorInfos = new Map<string, DataConstructorInfo>()
  const algebraicTypeInfos = new Map<string, AlgebraicTypeInfo>()

  for (const fragment of pkg.fragments.values()) {
    for (const stmt of fragment.stmts) {
      if (stmt.kind === "DefineAlgebraicTypeStmt") {
        const typeName = stmt.typeConstructor.name
        const modName = fragment.modName
        const pkgName = pkg.mods.get(modName)?.pkg.id ?? pkg.id
        const constructorNames: Array<string> = []

        for (const ctor of stmt.dataConstructors) {
          constructorNames.push(ctor.name)
          const fieldNames = ctor.fields.map((f) => f.name)
          const accessorNames = ctor.fields.map((f) => f.accessorName)
          const key = `${pkgName}/${modName}/${ctor.name}`
          dataConstructorInfos.set(key, {
            name: ctor.name,
            pkgName,
            modName,
            typeName,
            fieldNames,
            predicateName: ctor.predicate,
            accessorNames,
          })
        }

        const typeKey = `${pkgName}/${modName}/${typeName}`
        algebraicTypeInfos.set(typeKey, {
          name: typeName,
          pkgName,
          modName,
          constructorNames,
        })
      }
    }
  }

  return { dataConstructorInfos, algebraicTypeInfos }
}
