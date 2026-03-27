import { type SourceLocation } from "@xieyuheng/sexp.js"

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
  meta?: SourceLocation
}

export function Import(
  path: string,
  names: Array<string>,
  meta?: SourceLocation,
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
  meta?: SourceLocation
}

export function ImportAll(path: string, meta?: SourceLocation): ImportAll {
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
  meta?: SourceLocation
}

export function ImportExcept(
  path: string,
  names: Array<string>,
  meta?: SourceLocation,
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
  meta?: SourceLocation
}

export function ImportAs(
  path: string,
  prefix: string,
  meta?: SourceLocation,
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
  meta?: SourceLocation
}

export function Include(
  path: string,
  names: Array<string>,
  meta?: SourceLocation,
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
  meta?: SourceLocation
}

export function IncludeAll(path: string, meta?: SourceLocation): IncludeAll {
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
  meta?: SourceLocation
}

export function IncludeExcept(
  path: string,
  names: Array<string>,
  meta?: SourceLocation,
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
  meta?: SourceLocation
}

export function IncludeAs(
  path: string,
  prefix: string,
  meta?: SourceLocation,
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
  meta?: SourceLocation
}

export function Export(names: Array<string>, meta?: SourceLocation): Export {
  return {
    kind: "Export",
    names,
    meta,
  }
}

export type ExportAll = {
  kind: "ExportAll"
  meta?: SourceLocation
}

export function ExportAll(meta?: SourceLocation): ExportAll {
  return {
    kind: "ExportAll",
    meta,
  }
}

export function ExportExcept(
  names: Array<string>,
  meta?: SourceLocation,
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
  meta?: SourceLocation
}
