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

  "(cons* 'exempt names)": ({ names }, { location }) => {
    return M.Exempt(S.listElements(names).map(S.symbolContent), location)
  },

  "(cons* 'export names)": ({ names }, { location }) => {
    return M.Export(S.listElements(names).map(S.symbolContent), location)
  },

  "`(export-all)": ({}, { location }) => {
    return M.ExportAll(location)
  },

  "(cons* 'export-except names)": ({ names }, { location }) => {
    return M.ExportExcept(S.listElements(names).map(S.symbolContent), location)
  },

  "`(import-all ,path)": ({ path }, { location }) => {
    return M.ImportAll(S.stringContent(path), location)
  },

  "`(include-all ,path)": ({ path }, { location }) => {
    return M.IncludeAll(S.stringContent(path), location)
  },

  "(cons* 'import path entries)": ({ path, entries }, { location }) => {
    return M.Import(
      S.stringContent(path),
      S.listElements(entries).map(S.symbolContent),
      location,
    )
  },

  "(cons* 'include path names)": ({ path, names }, { location }) => {
    return M.Include(
      S.stringContent(path),
      S.listElements(names).map(S.symbolContent),
      location,
    )
  },

  "(cons* 'import-except path names)": ({ path, names }, { location }) => {
    return M.ImportExcept(
      S.stringContent(path),
      S.listElements(names).map(S.symbolContent),
      location,
    )
  },

  "(cons* 'include-except path names)": ({ path, names }, { location }) => {
    return M.IncludeExcept(
      S.stringContent(path),
      S.listElements(names).map(S.symbolContent),
      location,
    )
  },

  "`(import-as ,path ,prefix)": ({ path, prefix }, { location }) => {
    return M.ImportAs(S.stringContent(path), S.symbolContent(prefix), location)
  },

  "`(include-as ,path ,prefix)": ({ path, prefix }, { location }) => {
    return M.IncludeAs(S.stringContent(path), S.symbolContent(prefix), location)
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
    const entries = S.listCollectKeywordEntries(body)
    M.assertNoDuplicatedKey(entries)
    return M.DefineInterface(
      parseInterfaceConstructor(head),
      recordMapValue(Object.fromEntries(entries), parseExp),
      location,
    )
  },

  "`(claim ,name ,schema)": ({ name, schema }, { location }) => {
    return M.Claim(S.symbolContent(name), parseExp(schema), location)
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

const parseDataConstructor = S.createRouter<
  Omit<M.DataConstructor, "definition">
>({
  "(cons* name fields)": ({ name, fields }, { location }) => {
    return {
      name: S.symbolContent(name),
      fields: S.listElements(fields).map(parseDataField),
    }
  },

  name: ({ name }, { location }) => {
    return {
      name: S.symbolContent(name),
      fields: [],
    }
  },
})

const parseDataField = S.createRouter<M.DataField>({
  "`(,name ,exp)": ({ name, exp }, { location }) => {
    return {
      name: S.symbolContent(name),
      type: parseExp(exp),
    }
  },
})
