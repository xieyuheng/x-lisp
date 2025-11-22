import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"

export type AboutModule = AboutImport | Export

export type AboutImport =
  | Import
  | ImportAll
  | ImportExcept
  | ImportAs
  | Include
  | IncludeAll
  | IncludeExcept
  | IncludeAs

export type Import = {
  kind: "Import"
  path: string
  names: Array<string>
  meta?: Meta
}

export function Import(
  path: string,
  names: Array<string>,
  meta?: Meta,
): Import {
  return {
    kind: "Import",
    path,
    names,
    meta,
  }
}

export type ImportAll = {
  kind: "ImportAll"
  path: string
  meta?: Meta
}

export function ImportAll(path: string, meta?: Meta): ImportAll {
  return {
    kind: "ImportAll",
    path,
    meta,
  }
}

export function ImportExcept(
  path: string,
  names: Array<string>,
  meta?: Meta,
): ImportExcept {
  return {
    kind: "ImportExcept",
    path,
    names,
    meta,
  }
}

export type ImportExcept = {
  kind: "ImportExcept"
  path: string
  names: Array<string>
  meta?: Meta
}

export type ImportAs = {
  kind: "ImportAs"
  path: string
  prefix: string
  meta?: Meta
}

export function ImportAs(path: string, prefix: string, meta?: Meta): ImportAs {
  return {
    kind: "ImportAs",
    path,
    prefix,
    meta,
  }
}

export type Include = {
  kind: "Include"
  path: string
  names: Array<string>
  meta?: Meta
}

export function Include(
  path: string,
  names: Array<string>,
  meta?: Meta,
): Include {
  return {
    kind: "Include",
    path,
    names,
    meta,
  }
}

export type IncludeAll = {
  kind: "IncludeAll"
  path: string
  meta?: Meta
}

export function IncludeAll(path: string, meta?: Meta): IncludeAll {
  return {
    kind: "IncludeAll",
    path,
    meta,
  }
}

export function IncludeExcept(
  path: string,
  names: Array<string>,
  meta?: Meta,
): IncludeExcept {
  return {
    kind: "IncludeExcept",
    path,
    names,
    meta,
  }
}

export type IncludeExcept = {
  kind: "IncludeExcept"
  path: string
  names: Array<string>
  meta?: Meta
}

export type IncludeAs = {
  kind: "IncludeAs"
  path: string
  prefix: string
  meta?: Meta
}

export function IncludeAs(
  path: string,
  prefix: string,
  meta?: Meta,
): IncludeAs {
  return {
    kind: "IncludeAs",
    path,
    prefix,
    meta,
  }
}

export type Export = {
  kind: "Export"
  names: Array<string>
  meta?: Meta
}

export function Export(names: Array<string>, meta?: Meta): Export {
  return {
    kind: "Export",
    names,
    meta,
  }
}
