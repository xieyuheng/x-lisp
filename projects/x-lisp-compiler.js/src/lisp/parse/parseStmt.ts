import * as S from "@xieyuheng/sexp.js"
import * as L from "../index.ts"
import { parseExp } from "./parseExp.ts"

export const parseStmt = S.createRouter<L.Stmt>({
  "(cons* 'define (cons* name parameters) body)": (
    { name, parameters, body },
    { sexp },
  ) => {
    const keyword = S.asTael(sexp).elements[1]
    const meta = S.tokenMetaFromSexpMeta(keyword.meta)
    return L.DefineFunction(
      S.symbolContent(name),
      S.listElements(parameters).map(S.symbolContent),
      L.BeginSugar(S.listElements(body).map(parseExp), meta),
      meta,
    )
  },

  "(cons* 'define name body)": ({ name, body }, { sexp }) => {
    const keyword = S.asTael(sexp).elements[1]
    const meta = S.tokenMetaFromSexpMeta(keyword.meta)
    return L.DefineVariable(
      S.symbolContent(name),
      L.BeginSugar(S.listElements(body).map(parseExp), meta),
      meta,
    )
  },

  "(cons* 'define-type (cons* name parameters) body)": (
    { name, parameters, body },
    { sexp },
  ) => {
    const keyword = S.asTael(sexp).elements[1]
    const meta = S.tokenMetaFromSexpMeta(keyword.meta)
    return L.DefineType(
      S.symbolContent(name),
      L.Lambda(
        S.listElements(parameters).map(S.symbolContent),
        L.BeginSugar(S.listElements(body).map(parseExp), meta),
        meta,
      ),
      meta,
    )
  },

  "(cons* 'define-type name body)": ({ name, body }, { sexp }) => {
    const keyword = S.asTael(sexp).elements[1]
    const meta = S.tokenMetaFromSexpMeta(keyword.meta)
    return L.DefineType(
      S.symbolContent(name),
      L.BeginSugar(S.listElements(body).map(parseExp), meta),
      meta,
    )
  },

  "(cons* 'export names)": ({ names }, { meta }) => {
    return L.Export(S.listElements(names).map(S.symbolContent), meta)
  },

  "`(export-all)": ({}, { meta }) => {
    return L.ExportAll(meta)
  },

  "(cons* 'export-except names)": ({ names }, { meta }) => {
    return L.ExportExcept(S.listElements(names).map(S.symbolContent), meta)
  },

  "`(import-all ,source)": ({ source }, { meta }) => {
    return L.ImportAll(S.stringContent(source), meta)
  },

  "`(include-all ,source)": ({ source }, { meta }) => {
    return L.IncludeAll(S.stringContent(source), meta)
  },

  "(cons* 'import source entries)": ({ source, entries }, { meta }) => {
    return L.Import(
      S.stringContent(source),
      S.listElements(entries).map(S.symbolContent),
      meta,
    )
  },

  "(cons* 'include source names)": ({ source, names }, { meta }) => {
    return L.Include(
      S.stringContent(source),
      S.listElements(names).map(S.symbolContent),
      meta,
    )
  },

  "(cons* 'import-except source names)": ({ source, names }, { meta }) => {
    return L.ImportExcept(
      S.stringContent(source),
      S.listElements(names).map(S.symbolContent),
      meta,
    )
  },

  "(cons* 'include-except source names)": ({ source, names }, { meta }) => {
    return L.IncludeExcept(
      S.stringContent(source),
      S.listElements(names).map(S.symbolContent),
      meta,
    )
  },

  "`(import-as ,source ,prefix)": ({ source, prefix }, { meta }) => {
    return L.ImportAs(S.stringContent(source), S.symbolContent(prefix), meta)
  },

  "`(include-as ,source ,prefix)": ({ source, prefix }, { meta }) => {
    return L.IncludeAs(S.stringContent(source), S.symbolContent(prefix), meta)
  },

  "(cons* 'define-datatype predicate constructors)": (
    { predicate, constructors },
    { meta },
  ) => {
    return L.DefineDatatype(
      parseDataPredicate(predicate),
      S.listElements(constructors).map(parseDataConstructor),
      meta,
    )
  },

  "`(claim ,name ,schema)": ({ name, schema }, { meta }) => {
    return L.Claim(S.symbolContent(name), parseExp(schema), meta)
  },
})

const parseDataPredicate = S.createRouter<L.DatatypeConstructorSpec>({
  "(cons* name parameters)": ({ name, parameters }, { meta }) => {
    return {
      name: S.symbolContent(name),
      parameters: S.listElements(parameters).map(S.symbolContent),
    }
  },

  name: ({ name }, { meta }) => {
    return {
      name: S.symbolContent(name),
      parameters: [],
    }
  },
})

const parseDataConstructor = S.createRouter<L.DataConstructorSpec>({
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

const parseDataField = S.createRouter<L.DataField>({
  "`(,name ,exp)": ({ name, exp }, { meta }) => {
    return {
      name: S.symbolContent(name),
      type: parseExp(exp),
    }
  },
})
