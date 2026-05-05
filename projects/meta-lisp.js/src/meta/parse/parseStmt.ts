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

  "`(type-error-module ,name)": ({ name }, { location }) => {
    return M.DeclareTypeErrorModule(S.asSymbol(name).content, location)
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

  "(cons* 'define-data head constructors)": (
    { head, constructors },
    { location },
  ) => {
    return M.DefineData(
      parseDataTypeConstructor(head),
      S.asList(constructors).elements.map(parseDataConstructor),
      location,
    )
  },

  "(cons* 'define-interface head body)": ({ head, body }, { location }) => {
    const entries = S.collectKeyValuePairs(S.asList(body).elements)
    M.assertNoDuplicatedKey(entries)
    return M.DefineInterface(
      parseInterfaceConstructor(head),
      recordMapValue(Object.fromEntries(entries), parseExp),
      location,
    )
  },

  "`(claim ,name ,type)": ({ name, type }, { location }) => {
    return M.Claim(S.asSymbol(name).content, parseExp(type), location)
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

const parseDataTypeConstructor = S.createRouter<
  Omit<M.DataTypeConstructor, "definition">
>({
  "(cons* name parameters)": ({ name, parameters }, { location }) => {
    return {
      definition: undefined,
      name: S.asSymbol(name).content,
      parameters: S.asList(parameters).elements.map(
        (x) => S.asSymbol(x).content,
      ),
    }
  },

  name: ({ name }, { location }) => {
    return {
      definition: undefined,
      name: S.asSymbol(name).content,
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
  Omit<M.DataConstructor, "definition">
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
