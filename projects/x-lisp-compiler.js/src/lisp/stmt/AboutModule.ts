import { type TokenMeta } from "@xieyuheng/sexp-tael.js"

export type AboutModule = AboutExport | AboutImport

export type AboutExport = Export | ExportAll | ExportExcept

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
  meta?: TokenMeta
}

export function Import(
  path: string,
  names: Array<string>,
  meta?: TokenMeta,
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
  meta?: TokenMeta
}

export function ImportAll(path: string, meta?: TokenMeta): ImportAll {
  return {
    kind: "ImportAll",
    path,
    meta,
  }
}

export type ImportExcept = {
  kind: "ImportExcept"
  path: string
  names: Array<string>
  meta?: TokenMeta
}

export function ImportExcept(
  path: string,
  names: Array<string>,
  meta?: TokenMeta,
): ImportExcept {
  return {
    kind: "ImportExcept",
    path,
    names,
    meta,
  }
}

export type ImportAs = {
  kind: "ImportAs"
  path: string
  prefix: string
  meta?: TokenMeta
}

export function ImportAs(
  path: string,
  prefix: string,
  meta?: TokenMeta,
): ImportAs {
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
  meta?: TokenMeta
}

export function Include(
  path: string,
  names: Array<string>,
  meta?: TokenMeta,
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
  meta?: TokenMeta
}

export function IncludeAll(path: string, meta?: TokenMeta): IncludeAll {
  return {
    kind: "IncludeAll",
    path,
    meta,
  }
}

export type IncludeExcept = {
  kind: "IncludeExcept"
  path: string
  names: Array<string>
  meta?: TokenMeta
}

export function IncludeExcept(
  path: string,
  names: Array<string>,
  meta?: TokenMeta,
): IncludeExcept {
  return {
    kind: "IncludeExcept",
    path,
    names,
    meta,
  }
}

export type IncludeAs = {
  kind: "IncludeAs"
  path: string
  prefix: string
  meta?: TokenMeta
}

export function IncludeAs(
  path: string,
  prefix: string,
  meta?: TokenMeta,
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
  meta?: TokenMeta
}

export function Export(names: Array<string>, meta?: TokenMeta): Export {
  return {
    kind: "Export",
    names,
    meta,
  }
}

export type ExportAll = {
  kind: "ExportAll"
  meta?: TokenMeta
}

export function ExportAll(meta?: TokenMeta): ExportAll {
  return {
    kind: "ExportAll",
    meta,
  }
}

export function ExportExcept(
  names: Array<string>,
  meta?: TokenMeta,
): ExportExcept {
  return {
    kind: "ExportExcept",
    names,
    meta,
  }
}

export type ExportExcept = {
  kind: "ExportExcept"
  names: Array<string>
  meta?: TokenMeta
}
