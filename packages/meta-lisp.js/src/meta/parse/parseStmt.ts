import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"
import { parseBody, parseExp } from "./parseExp.ts"

export const parseStmt = S.createRouter<M.Stmt<M.Exp>>({
  "(cons* 'define (cons* name parameters) body)": (
    { name, parameters, body },
    { sexp },
  ) => {
    const keyword = S.asListSexp(sexp).elements[0]
    return M.DefineFunctionStmt(
      S.asSymbolSexp(name).content,
      S.asListSexp(parameters).elements.map((x) => S.asSymbolSexp(x).content),
      parseBody(body),
      keyword.location,
    )
  },

  "(cons* 'define name body)": ({ name, body }, { sexp }) => {
    const keyword = S.asListSexp(sexp).elements[0]
    return M.DefineVariableStmt(
      S.asSymbolSexp(name).content,
      parseBody(body),
      keyword.location,
    )
  },

  "(cons* 'define-test name body)": ({ name, body }, { sexp }) => {
    const keyword = S.asListSexp(sexp).elements[0]
    return M.DefineTestStmt(
      S.asSymbolSexp(name).content,
      parseBody(body),
      keyword.location,
    )
  },

  "(cons* 'define-type (cons* name parameters) body)": (
    { name, parameters, body },
    { sexp },
  ) => {
    const keyword = S.asListSexp(sexp).elements[0]
    return M.DefineTypeStmt(
      S.asSymbolSexp(name).content,
      S.asListSexp(parameters).elements.map((x) => S.asSymbolSexp(x).content),
      parseBody(body),
      keyword.location,
    )
  },

  "(cons* 'define-type name body)": ({ name, body }, { sexp }) => {
    const keyword = S.asListSexp(sexp).elements[0]
    return M.DefineTypeStmt(
      S.asSymbolSexp(name).content,
      [],
      parseBody(body),
      keyword.location,
    )
  },

  "(cons* 'exempt names)": ({ names }, { location }) => {
    return M.ExemptStmt(
      S.asListSexp(names).elements.map((x) => S.asSymbolSexp(x).content),
      location,
    )
  },

  "(cons* 'private names)": ({ names }, { location }) => {
    return M.PrivateStmt(
      S.asListSexp(names).elements.map((x) => S.asSymbolSexp(x).content),
      location,
    )
  },

  "`(module ,name)": ({ name }, { location }) => {
    return M.DeclareModuleStmt(S.asSymbolSexp(name).content, location)
  },

  "(cons* 'import modName entries)": ({ modName, entries }, { location }) => {
    const { pkgName, modName: moduleName } = parseImportModName(
      S.asSymbolSexp(modName).content,
    )
    return M.ImportStmt(
      pkgName,
      moduleName,
      S.asListSexp(entries).elements.map((x) => S.asSymbolSexp(x).content),
      location,
    )
  },

  "`(import-as ,modName ,prefix)": ({ modName, prefix }, { location }) => {
    const { pkgName, modName: moduleName } = parseImportModName(
      S.asSymbolSexp(modName).content,
    )
    return M.ImportAsStmt(
      pkgName,
      moduleName,
      S.asSymbolSexp(prefix).content,
      location,
    )
  },

  "`(import-all ,modName)": ({ modName, prefix }, { location }) => {
    const { pkgName, modName: moduleName } = parseImportModName(
      S.asSymbolSexp(modName).content,
    )
    return M.ImportAllStmt(pkgName, moduleName, location)
  },

  "(cons* 'define-enum head constructors)": (
    { head, constructors },
    { location },
  ) => {
    return M.DefineEnumStmt(
      parseTypeConstructor(head),
      S.asListSexp(constructors).elements.map(parseDataConstructor),
      location,
    )
  },

  "(cons* 'define-opaque-type head representation ifaces)": (
    { head, representation, ifaces },
    { location },
  ) => {
    const typeConstructor = parseTypeConstructor(head)
    const interfaceEntries = S.asListSexp(ifaces).elements.map((iface) => {
      const parts = S.asListSexp(iface).elements
      return {
        name: S.asSymbolSexp(parts[0]).content,
        type: parseExp(parts[1]),
        location: parts[0].location,
      }
    })
    return M.DefineOpaqueTypeStmt(
      typeConstructor.name,
      typeConstructor.parameters,
      parseExp(representation),
      interfaceEntries,
      location,
    )
  },

  "(cons* 'define-algebraic-type head constructors)": (
    { head, constructors },
    { location },
  ) => {
    return M.DefineAlgebraicTypeStmt(
      parseTypeConstructor(head),
      S.asListSexp(constructors).elements.map(parseAlgebraicTypeConstructor),
      location,
    )
  },

  "(cons* 'define-struct* head ctor)": ({ head, ctor }, { location }) => {
    return M.DefineStructStarStmt(
      parseTypeConstructor(head),
      parseDataConstructor(S.asListSexp(ctor).elements[0]),
      location,
    )
  },

  "(cons* 'define-struct head fields)": ({ head, fields }, { location }) => {
    return M.DefineStructStmt(
      parseTypeConstructor(head),
      S.asListSexp(fields).elements.map(parseDataField),
      location,
    )
  },

  "(cons* 'define-record-type head ctor predicate accessors)": (
    { head, ctor, predicate, accessors },
    { location },
  ) => {
    const ctorList = S.asListSexp(ctor).elements
    const constructorName = S.asSymbolSexp(ctorList[0]).content
    const fields = ctorList.slice(1).map((field) => {
      const fieldList = S.asListSexp(field).elements
      return {
        name: S.asSymbolSexp(fieldList[0]).content,
        type: parseExp(fieldList[1]),
        location,
      }
    })

    const accessorList = S.asListSexp(accessors).elements
    const accessorMap = new Map<
      string,
      { accessorName: string; modifierName?: string }
    >()
    for (const accessor of accessorList) {
      const entry = S.asListSexp(accessor).elements
      const fieldEntry: {
        accessorName: string
        modifierName?: string
      } = {
        accessorName: S.asSymbolSexp(entry[1]).content,
      }
      if (entry.length >= 3) {
        fieldEntry.modifierName = S.asSymbolSexp(entry[2]).content
      }
      accessorMap.set(S.asSymbolSexp(entry[0]).content, fieldEntry)
    }

    return M.DefineRecordTypeStmt(
      parseTypeConstructor(head),
      {
        name: constructorName,
        fields: fields.map((field) => {
          const names = accessorMap.get(field.name)
          return {
            ...field,
            accessorName: names
              ? names.accessorName
              : `${constructorName}-${field.name}`,
            modifierName: names ? names.modifierName : undefined,
          }
        }),
        predicate: S.asSymbolSexp(predicate).content,
        location,
      },
      location,
    )
  },

  "`(claim ,name ,type)": ({ name, type }, { location }) => {
    return M.ClaimStmt(S.asSymbolSexp(name).content, parseExp(type), location)
  },

  "`(claim-type ,name)": ({ name }, { location }) => {
    return M.ClaimTypeStmt(S.asSymbolSexp(name).content, location)
  },

  "`(admit ,name ,type)": ({ name, type }, { location }) => {
    return M.AdmitStmt(S.asSymbolSexp(name).content, parseExp(type), location)
  },

  "`(declare-primitive-function ,name ,arity)": (
    { name, arity },
    { location },
  ) => {
    return M.DeclarePrimitiveFunctionStmt(
      S.asSymbolSexp(name).content,
      Number(S.asIntSexp(arity).content),
      location,
    )
  },

  "`(declare-primitive-variable ,name)": ({ name }, { location }) => {
    return M.DeclarePrimitiveVariableStmt(
      S.asSymbolSexp(name).content,
      location,
    )
  },

  "(cons* '@comment sexps)": ({ sexps }, { location }) => {
    return M.CommentStmt(S.asListSexp(sexps).elements, location)
  },
})

function parseImportModName(rawModName: string): {
  pkgName: string
  modName: string
} {
  const slashIndex = rawModName.indexOf("/")
  if (slashIndex === -1) {
    return { pkgName: "self", modName: rawModName }
  }
  return {
    pkgName: rawModName.slice(0, slashIndex),
    modName: rawModName.slice(slashIndex + 1),
  }
}

const parseTypeConstructor = S.createRouter<M.PreTypeConstructor>({
  "(cons* name parameters)": ({ name, parameters }, { location }) => {
    return {
      name: S.asSymbolSexp(name).content,
      parameters: S.asListSexp(parameters).elements.map(
        (x) => S.asSymbolSexp(x).content,
      ),
      location,
    }
  },

  name: ({ name }, { location }) => {
    return {
      name: S.asSymbolSexp(name).content,
      parameters: [],
      location,
    }
  },
})

const parseDataConstructor = S.createRouter<M.PreDataConstructor>({
  "(cons* name fields)": ({ name, fields }, { location }) => {
    return {
      name: S.asSymbolSexp(name).content,
      fields: S.asListSexp(fields).elements.map(parseDataField),
      location,
    }
  },
})

const parseDataField = S.createRouter<M.PreDataField>({
  "`(,name ,exp)": ({ name, exp }, { location }) => {
    return {
      name: S.asSymbolSexp(name).content,
      type: parseExp(exp),
      location,
    }
  },
})

const parseAlgebraicTypeConstructor = S.createRouter<
  M.AlgebraicTypeConstructor<M.Exp>
>({
  "(cons* group predicate accessors)": (
    { group, predicate, accessors },
    { location },
  ) => {
    const groupList = S.asListSexp(group).elements
    const name = S.asSymbolSexp(groupList[0]).content
    const fields = groupList.slice(1).map((field) => {
      const fieldList = S.asListSexp(field).elements
      return {
        name: S.asSymbolSexp(fieldList[0]).content,
        type: parseExp(fieldList[1]),
        location,
      }
    })

    const accessorList = S.asListSexp(accessors).elements
    const accessorMap = new Map<
      string,
      { accessorName: string; modifierName?: string }
    >()
    for (const accessor of accessorList) {
      const entry = S.asListSexp(accessor).elements
      const fieldEntry: {
        accessorName: string
        modifierName?: string
      } = {
        accessorName: S.asSymbolSexp(entry[1]).content,
      }
      if (entry.length >= 3) {
        fieldEntry.modifierName = S.asSymbolSexp(entry[2]).content
      }
      accessorMap.set(S.asSymbolSexp(entry[0]).content, fieldEntry)
    }

    return {
      name,
      fields: fields.map((field) => {
        const names = accessorMap.get(field.name)
        return {
          ...field,
          accessorName: names ? names.accessorName : `${name}-${field.name}`,
          modifierName: names ? names.modifierName : undefined,
        }
      }),
      predicate: S.asSymbolSexp(predicate).content,
      location,
    }
  },
})
