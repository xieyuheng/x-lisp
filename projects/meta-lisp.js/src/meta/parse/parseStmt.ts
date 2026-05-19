import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"
import { parseBody, parseExp } from "./parseExp.ts"

export const parseStmt = S.createRouter<M.Stmt>({
  "(cons* 'define (cons* name parameters) body)": (
    { name, parameters, body },
    { sexp },
  ) => {
    const keyword = S.asList(sexp).elements[0]
    return M.DefineFunction(
      S.asSymbol(name).content,
      S.asList(parameters).elements.map((x) => S.asSymbol(x).content),
      parseBody(body),
      keyword.location,
    )
  },

  "(cons* 'define name body)": ({ name, body }, { sexp }) => {
    const keyword = S.asList(sexp).elements[0]
    return M.DefineVariable(
      S.asSymbol(name).content,
      parseBody(body),
      keyword.location,
    )
  },

  "(cons* 'define-test name body)": ({ name, body }, { sexp }) => {
    const keyword = S.asList(sexp).elements[0]
    return M.DefineTest(
      S.asSymbol(name).content,
      parseBody(body),
      keyword.location,
    )
  },

  "(cons* 'define-type (cons* name parameters) body)": (
    { name, parameters, body },
    { sexp },
  ) => {
    const keyword = S.asList(sexp).elements[0]
    return M.DefineType(
      S.asSymbol(name).content,
      S.asList(parameters).elements.map((x) => S.asSymbol(x).content),
      parseBody(body),
      keyword.location,
    )
  },

  "(cons* 'define-type name body)": ({ name, body }, { sexp }) => {
    const keyword = S.asList(sexp).elements[0]
    return M.DefineType(
      S.asSymbol(name).content,
      [],
      parseBody(body),
      keyword.location,
    )
  },

  "(cons* 'exempt names)": ({ names }, { location }) => {
    return M.Exempt(
      S.asList(names).elements.map((x) => S.asSymbol(x).content),
      location,
    )
  },

  "(cons* 'private names)": ({ names }, { location }) => {
    return M.Private(
      S.asList(names).elements.map((x) => S.asSymbol(x).content),
      location,
    )
  },

  "`(module ,name)": ({ name }, { location }) => {
    return M.DeclareModule(S.asSymbol(name).content, location)
  },

  "`(error-module ,name)": ({ name }, { location }) => {
    return M.DeclareErrorModule(S.asSymbol(name).content, location)
  },

  "(cons* 'import modName entries)": ({ modName, entries }, { location }) => {
    return M.Import(
      S.asSymbol(modName).content,
      S.asList(entries).elements.map((x) => S.asSymbol(x).content),
      location,
    )
  },

  "`(import-as ,modName ,prefix)": ({ modName, prefix }, { location }) => {
    return M.ImportAs(
      S.asSymbol(modName).content,
      S.asSymbol(prefix).content,
      location,
    )
  },

  "`(import-all ,modName)": ({ modName, prefix }, { location }) => {
    return M.ImportAll(S.asSymbol(modName).content, location)
  },

  "(cons* 'define-enum head constructors)": (
    { head, constructors },
    { location },
  ) => {
    return M.DefineEnum(
      parseTypeConstructor(head),
      S.asList(constructors).elements.map(parseDataConstructor),
      location,
    )
  },

  "(cons* 'define-opaque-type head representation ifaces)": (
    { head, representation, ifaces },
    { location },
  ) => {
    const typeConstructor = parseTypeConstructor(head)
    const interfaceFunctions = S.asList(ifaces).elements.map((iface) => {
      const parts = S.asList(iface).elements
      return {
        name: S.asSymbol(parts[0]).content,
        type: parseExp(parts[1]),
        location: parts[0].location,
      }
    })
    return M.DefineOpaqueType(
      typeConstructor.name,
      typeConstructor.parameters,
      parseExp(representation),
      interfaceFunctions,
      location,
    )
  },

  "(cons* 'define-algebraic-type head constructors)": (
    { head, constructors },
    { location },
  ) => {
    return M.DefineAlgebraicType(
      parseTypeConstructor(head),
      S.asList(constructors).elements.map(parseAlgebraicTypeConstructor),
      location,
    )
  },

  "(cons* 'define-struct* head ctor)": ({ head, ctor }, { location }) => {
    return M.DefineStructStar(
      parseTypeConstructor(head),
      parseDataConstructor(S.asList(ctor).elements[0]),
      location,
    )
  },

  "(cons* 'define-struct head fields)": ({ head, fields }, { location }) => {
    return M.DefineStruct(
      parseTypeConstructor(head),
      S.asList(fields).elements.map(parseDataField),
      location,
    )
  },

  "(cons* 'define-record-type head ctor predicate accessors)": (
    { head, ctor, predicate, accessors },
    { location },
  ) => {
    const ctorList = S.asList(ctor).elements
    const constructorName = S.asSymbol(ctorList[0]).content
    const fields = ctorList.slice(1).map((field) => {
      const fieldList = S.asList(field).elements
      return {
        name: S.asSymbol(fieldList[0]).content,
        type: parseExp(fieldList[1]),
        location,
      }
    })

    const accessorList = S.asList(accessors).elements
    const accessorMap = new Map<
      string,
      { accessorName: string; modifierName?: string }
    >()
    for (const accessor of accessorList) {
      const entry = S.asList(accessor).elements
      const fieldEntry: {
        accessorName: string
        modifierName?: string
      } = {
        accessorName: S.asSymbol(entry[1]).content,
      }
      if (entry.length >= 3) {
        fieldEntry.modifierName = S.asSymbol(entry[2]).content
      }
      accessorMap.set(S.asSymbol(entry[0]).content, fieldEntry)
    }

    return M.DefineRecordType(
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
        predicate: S.asSymbol(predicate).content,
        location,
      },
      location,
    )
  },

  "`(claim ,name ,type)": ({ name, type }, { location }) => {
    return M.Claim(S.asSymbol(name).content, parseExp(type), location)
  },

  "`(claim-type ,name)": ({ name }, { location }) => {
    return M.ClaimType(S.asSymbol(name).content, location)
  },

  "`(admit ,name ,type)": ({ name, type }, { location }) => {
    return M.Admit(S.asSymbol(name).content, parseExp(type), location)
  },

  "`(declare-primitive-function ,name ,arity)": (
    { name, arity },
    { location },
  ) => {
    return M.DeclarePrimitiveFunction(
      S.asSymbol(name).content,
      Number(S.asInt(arity).content),
      location,
    )
  },

  "`(declare-primitive-variable ,name)": ({ name }, { location }) => {
    return M.DeclarePrimitiveVariable(S.asSymbol(name).content, location)
  },
})

const parseTypeConstructor = S.createRouter<M.TypeConstructor>({
  "(cons* name parameters)": ({ name, parameters }, { location }) => {
    return {
      definition: undefined,
      name: S.asSymbol(name).content,
      parameters: S.asList(parameters).elements.map(
        (x) => S.asSymbol(x).content,
      ),
      location,
    }
  },

  name: ({ name }, { location }) => {
    return {
      definition: undefined,
      name: S.asSymbol(name).content,
      parameters: [],
      location,
    }
  },
})

const parseDataConstructor = S.createRouter<
  Omit<M.DataConstructor, "mod" | "typeName">
>({
  "(cons* name fields)": ({ name, fields }, { location }) => {
    return {
      name: S.asSymbol(name).content,
      fields: S.asList(fields).elements.map(parseDataField),
      location,
    }
  },
})

const parseDataField = S.createRouter<M.DataField>({
  "`(,name ,exp)": ({ name, exp }, { location }) => {
    return {
      name: S.asSymbol(name).content,
      type: parseExp(exp),
      location,
    }
  },
})

const parseAlgebraicTypeConstructor =
  S.createRouter<M.AlgebraicTypeConstructor>({
    "(cons* group predicate accessors)": (
      { group, predicate, accessors },
      { location },
    ) => {
      const groupList = S.asList(group).elements
      const name = S.asSymbol(groupList[0]).content
      const fields = groupList.slice(1).map((field) => {
        const fieldList = S.asList(field).elements
        return {
          name: S.asSymbol(fieldList[0]).content,
          type: parseExp(fieldList[1]),
          location,
        }
      })

      const accessorList = S.asList(accessors).elements
      const accessorMap = new Map<
        string,
        { accessorName: string; modifierName?: string }
      >()
      for (const accessor of accessorList) {
        const entry = S.asList(accessor).elements
        const fieldEntry: {
          accessorName: string
          modifierName?: string
        } = {
          accessorName: S.asSymbol(entry[1]).content,
        }
        if (entry.length >= 3) {
          fieldEntry.modifierName = S.asSymbol(entry[2]).content
        }
        accessorMap.set(S.asSymbol(entry[0]).content, fieldEntry)
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
        predicate: S.asSymbol(predicate).content,
        location,
      }
    },
  })
