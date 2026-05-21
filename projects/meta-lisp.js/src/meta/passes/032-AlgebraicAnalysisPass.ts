import * as M from "../index.ts"

export type DataConstructorInfo = {
  name: string
  modName: string
  typeName: string
  fieldNames: Array<string>
  predicateName: string
  accessorNames: Array<string>
}

export type AlgebraicTypeInfo = {
  name: string
  modName: string
  constructorNames: Array<string>
}

export type AlgebraicInfo = {
  dataConstructorInfos: Map<string, DataConstructorInfo>
  algebraicTypeInfos: Map<string, AlgebraicTypeInfo>
}

export function AlgebraicAnalysisPass(project: M.Project): AlgebraicInfo {
  const dataConstructorInfos = new Map<string, DataConstructorInfo>()
  const algebraicTypeInfos = new Map<string, AlgebraicTypeInfo>()

  for (const fragment of project.fragments.values()) {
    for (const stmt of fragment.stmts) {
      if (stmt.kind === "DefineAlgebraicTypeStmt") {
        const typeName = stmt.typeConstructor.name
        const modName = fragment.modName
        const constructorNames: Array<string> = []

        for (const ctor of stmt.dataConstructors) {
          constructorNames.push(ctor.name)
          const fieldNames = ctor.fields.map((f) => f.name)
          const accessorNames = ctor.fields.map((f) => f.accessorName)
          const key = `${modName}/${ctor.name}`
          dataConstructorInfos.set(key, {
            name: ctor.name,
            modName,
            typeName,
            fieldNames,
            predicateName: ctor.predicate,
            accessorNames,
          })
        }

        const typeKey = `${modName}/${typeName}`
        algebraicTypeInfos.set(typeKey, {
          name: typeName,
          modName,
          constructorNames,
        })
      }
    }
  }

  return { dataConstructorInfos, algebraicTypeInfos }
}
