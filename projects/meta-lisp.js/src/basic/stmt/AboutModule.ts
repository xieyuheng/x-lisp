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
  location?: SourceLocation
}

export function Import(
  path: string,
  names: Array<string>,
  location?: SourceLocation,
): Import {
  return {
    kind: "Import",
    path,
    names,
    location,
  }
}

export type ImportAll = {
  kind: "ImportAll"
  path: string
  location?: SourceLocation
}

export function ImportAll(path: string, location?: SourceLocation): ImportAll {
  return {
    kind: "ImportAll",
    path,
    location,
  }
}

export type ImportExcept = {
  kind: "ImportExcept"
  path: string
  names: Array<string>
  location?: SourceLocation
}

export function ImportExcept(
  path: string,
  names: Array<string>,
  location?: SourceLocation,
): ImportExcept {
  return {
    kind: "ImportExcept",
    path,
    names,
    location,
  }
}

export type ImportAs = {
  kind: "ImportAs"
  path: string
  prefix: string
  location?: SourceLocation
}

export function ImportAs(
  path: string,
  prefix: string,
  location?: SourceLocation,
): ImportAs {
  return {
    kind: "ImportAs",
    path,
    prefix,
    location,
  }
}

export type Include = {
  kind: "Include"
  path: string
  names: Array<string>
  location?: SourceLocation
}

export function Include(
  path: string,
  names: Array<string>,
  location?: SourceLocation,
): Include {
  return {
    kind: "Include",
    path,
    names,
    location,
  }
}

export type IncludeAll = {
  kind: "IncludeAll"
  path: string
  location?: SourceLocation
}

export function IncludeAll(
  path: string,
  location?: SourceLocation,
): IncludeAll {
  return {
    kind: "IncludeAll",
    path,
    location,
  }
}

export type IncludeExcept = {
  kind: "IncludeExcept"
  path: string
  names: Array<string>
  location?: SourceLocation
}

export function IncludeExcept(
  path: string,
  names: Array<string>,
  location?: SourceLocation,
): IncludeExcept {
  return {
    kind: "IncludeExcept",
    path,
    names,
    location,
  }
}

export type IncludeAs = {
  kind: "IncludeAs"
  path: string
  prefix: string
  location?: SourceLocation
}

export function IncludeAs(
  path: string,
  prefix: string,
  location?: SourceLocation,
): IncludeAs {
  return {
    kind: "IncludeAs",
    path,
    prefix,
    location,
  }
}

export type Export = {
  kind: "Export"
  names: Array<string>
  location?: SourceLocation
}

export function Export(
  names: Array<string>,
  location?: SourceLocation,
): Export {
  return {
    kind: "Export",
    names,
    location,
  }
}

export type ExportAll = {
  kind: "ExportAll"
  location?: SourceLocation
}

export function ExportAll(location?: SourceLocation): ExportAll {
  return {
    kind: "ExportAll",
    location,
  }
}

export function ExportExcept(
  names: Array<string>,
  location?: SourceLocation,
): ExportExcept {
  return {
    kind: "ExportExcept",
    names,
    location,
  }
}

export type ExportExcept = {
  kind: "ExportExcept"
  names: Array<string>
  location?: SourceLocation
}
