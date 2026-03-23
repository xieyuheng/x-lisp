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
    const meta = keyword.meta
    return M.DefineFunction(
      S.symbolContent(name),
      S.listElements(parameters).map(S.symbolContent),
      parseBody(body),
      meta,
    )
  },

  "(cons* 'define name body)": ({ name, body }, { sexp }) => {
    const keyword = S.asList(sexp).elements[0]
    const meta = keyword.meta
    return M.DefineVariable(S.symbolContent(name), parseBody(body), meta)
  },

  "(cons* 'exempt names)": ({ names }, { meta }) => {
    return M.Exempt(S.listElements(names).map(S.symbolContent), meta)
  },

  "(cons* 'export names)": ({ names }, { meta }) => {
    return M.Export(S.listElements(names).map(S.symbolContent), meta)
  },

  "`(export-all)": ({}, { meta }) => {
    return M.ExportAll(meta)
  },

  "(cons* 'export-except names)": ({ names }, { meta }) => {
    return M.ExportExcept(S.listElements(names).map(S.symbolContent), meta)
  },

  "`(import-all ,path)": ({ path }, { meta }) => {
    return M.ImportAll(S.stringContent(path), meta)
  },

  "`(include-all ,path)": ({ path }, { meta }) => {
    return M.IncludeAll(S.stringContent(path), meta)
  },

  "(cons* 'import path entries)": ({ path, entries }, { meta }) => {
    return M.Import(
      S.stringContent(path),
      S.listElements(entries).map(S.symbolContent),
      meta,
    )
  },

  "(cons* 'include path names)": ({ path, names }, { meta }) => {
    return M.Include(
      S.stringContent(path),
      S.listElements(names).map(S.symbolContent),
      meta,
    )
  },

  "(cons* 'import-except path names)": ({ path, names }, { meta }) => {
    return M.ImportExcept(
      S.stringContent(path),
      S.listElements(names).map(S.symbolContent),
      meta,
    )
  },

  "(cons* 'include-except path names)": ({ path, names }, { meta }) => {
    return M.IncludeExcept(
      S.stringContent(path),
      S.listElements(names).map(S.symbolContent),
      meta,
    )
  },

  "`(import-as ,path ,prefix)": ({ path, prefix }, { meta }) => {
    return M.ImportAs(S.stringContent(path), S.symbolContent(prefix), meta)
  },

  "`(include-as ,path ,prefix)": ({ path, prefix }, { meta }) => {
    return M.IncludeAs(S.stringContent(path), S.symbolContent(prefix), meta)
  },

  "(cons* 'define-data head constructors)": (
    { head, constructors },
    { meta },
  ) => {
    return M.DefineData(
      parseDataTypeConstructor(head),
      S.listElements(constructors).map(parseDataConstructor),
      meta,
    )
  },

  "(cons* 'define-interface head body)": ({ head, body }, { meta }) => {
    const entries = S.listCollectKeywordEntries(body)
    M.assertNoDuplicatedKey(entries)
    return M.DefineInterface(
      parseInterfaceConstructor(head),
      recordMapValue(Object.fromEntries(entries), parseExp),
      meta,
    )
  },

  "`(claim ,name ,schema)": ({ name, schema }, { meta }) => {
    return M.Claim(S.symbolContent(name), parseExp(schema), meta)
  },
})

const parseDataTypeConstructor = S.createRouter<
  Omit<M.DataTypeConstructor, "definition">
>({
  "(cons* name parameters)": ({ name, parameters }, { meta }) => {
    return {
      definition: undefined,
      name: S.symbolContent(name),
      parameters: S.listElements(parameters).map(S.symbolContent),
    }
  },

  name: ({ name }, { meta }) => {
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
  "(cons* name parameters)": ({ name, parameters }, { meta }) => {
    return {
      definition: undefined,
      name: S.symbolContent(name),
      parameters: S.listElements(parameters).map(S.symbolContent),
    }
  },

  name: ({ name }, { meta }) => {
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
  "(cons* name fields)": ({ name, fields }, { meta }) => {
    return {
      name: S.symbolContent(name),
      fields: S.listElements(fields).map(parseDataField),
    }
  },

  name: ({ name }, { meta }) => {
    return {
      name: S.symbolContent(name),
      fields: [],
    }
  },
})

const parseDataField = S.createRouter<M.DataField>({
  "`(,name ,exp)": ({ name, exp }, { meta }) => {
    return {
      name: S.symbolContent(name),
      type: parseExp(exp),
    }
  },
})
