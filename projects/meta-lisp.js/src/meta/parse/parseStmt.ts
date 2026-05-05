import { recordMapValue } from "@xieyuheng/helpers.js/record"
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
      S.symbolContent(name),
      S.listElements(parameters).map(S.symbolContent),
      parseBody(body),
      keyword.location,
    )
  },

  "(cons* 'define name body)": ({ name, body }, { sexp }) => {
    const keyword = S.asList(sexp).elements[0]
    return M.DefineVariable(
      S.symbolContent(name),
      parseBody(body),
      keyword.location,
    )
  },

  "(cons* 'define-test name body)": ({ name, body }, { sexp }) => {
    const keyword = S.asList(sexp).elements[0]
    return M.DefineTest(
      S.symbolContent(name),
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
      S.symbolContent(name),
      S.listElements(parameters).map(S.symbolContent),
      parseBody(body),
      keyword.location,
    )
  },

  "(cons* 'define-type name body)": ({ name, body }, { sexp }) => {
    const keyword = S.asList(sexp).elements[0]
    return M.DefineType(
      S.symbolContent(name),
      [],
      parseBody(body),
      keyword.location,
    )
  },

  "(cons* 'exempt names)": ({ names }, { location }) => {
    return M.Exempt(S.listElements(names).map(S.symbolContent), location)
  },

  "(cons* 'private names)": ({ names }, { location }) => {
    return M.Private(S.listElements(names).map(S.symbolContent), location)
  },

  "`(module ,name)": ({ name }, { location }) => {
    return M.DeclareModule(S.symbolContent(name), location)
  },

  "`(type-error-module ,name)": ({ name }, { location }) => {
    return M.DeclareTypeErrorModule(S.symbolContent(name), location)
  },

  "(cons* 'import modName entries)": ({ modName, entries }, { location }) => {
    return M.Import(
      S.symbolContent(modName),
      S.listElements(entries).map(S.symbolContent),
      location,
    )
  },

  "`(import-as ,modName ,prefix)": ({ modName, prefix }, { location }) => {
    return M.ImportAs(
      S.symbolContent(modName),
      S.symbolContent(prefix),
      location,
    )
  },

  "`(import-all ,modName)": ({ modName, prefix }, { location }) => {
    return M.ImportAll(S.symbolContent(modName), location)
  },

  "(cons* 'define-data head constructors)": (
    { head, constructors },
    { location },
  ) => {
    return M.DefineData(
      parseDataTypeConstructor(head),
      S.listElements(constructors).map(parseDataConstructor),
      location,
    )
  },

  "(cons* 'define-interface head body)": ({ head, body }, { location }) => {
    const entries = S.listCollectKeyValuePairs(body)
    M.assertNoDuplicatedKey(entries)
    return M.DefineInterface(
      parseInterfaceConstructor(head),
      recordMapValue(Object.fromEntries(entries), parseExp),
      location,
    )
  },

  "`(claim ,name ,type)": ({ name, type }, { location }) => {
    return M.Claim(S.symbolContent(name), parseExp(type), location)
  },

  "`(admit ,name ,type)": ({ name, type }, { location }) => {
    return M.Admit(S.symbolContent(name), parseExp(type), location)
  },

  "`(declare-primitive-function ,name ,arity)": (
    { name, arity },
    { location },
  ) => {
    return M.DeclarePrimitiveFunction(
      S.symbolContent(name),
      Number(S.intContent(arity)),
      location,
    )
  },

  "`(declare-primitive-variable ,name)": ({ name }, { location }) => {
    return M.DeclarePrimitiveVariable(S.symbolContent(name), location)
  },
})

const parseDataTypeConstructor = S.createRouter<
  Omit<M.DataTypeConstructor, "definition">
>({
  "(cons* name parameters)": ({ name, parameters }, { location }) => {
    return {
      definition: undefined,
      name: S.symbolContent(name),
      parameters: S.listElements(parameters).map(S.symbolContent),
    }
  },

  name: ({ name }, { location }) => {
    return {
      definition: undefined,
      name: S.symbolContent(name),
      parameters: [],
    }
  },
})

const parseInterfaceConstructor = S.createRouter<
  Omit<M.InterfaceConstructor, "definition">
>({
  "(cons* name parameters)": ({ name, parameters }, { location }) => {
    return {
      definition: undefined,
      name: S.symbolContent(name),
      parameters: S.listElements(parameters).map(S.symbolContent),
      location,
    }
  },

  name: ({ name }, { location }) => {
    return {
      definition: undefined,
      name: S.symbolContent(name),
      parameters: [],
      location,
    }
  },
})

const parseDataConstructor = S.createRouter<
  Omit<M.DataConstructor, "definition">
>({
  "(cons* name fields)": ({ name, fields }, { location }) => {
    return {
      name: S.symbolContent(name),
      fields: S.listElements(fields).map(parseDataField),
      location,
    }
  },
})

const parseDataField = S.createRouter<M.DataField>({
  "`(,name ,exp)": ({ name, exp }, { location }) => {
    return {
      name: S.symbolContent(name),
      type: parseExp(exp),
      location,
    }
  },
})
