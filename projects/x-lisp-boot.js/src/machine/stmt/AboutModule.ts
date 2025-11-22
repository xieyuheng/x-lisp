import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"

export type AboutModule = Export

export type Export = {
  kind: "Export"
  names: Array<string>
  meta: Meta
}

export function Export(names: Array<string>, meta: Meta): Export {
  return {
    kind: "Export",
    names,
    meta,
  }
}
