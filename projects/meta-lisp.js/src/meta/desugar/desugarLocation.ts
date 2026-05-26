import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function desugarLocation(location: S.SourceLocation): M.Exp {
  return M.desugarList(
    [
      M.SymbolExp("make-source-location", location),
      M.StringExp(location.path, location),
      expFromSpan(location.span, location),
    ],
    location,
  )
}

function expFromSpan(span: S.Span, location: S.SourceLocation): M.Exp {
  return M.desugarList(
    [
      M.SymbolExp("make-source-span", location),
      expFromPosition(span.start, location),
      expFromPosition(span.end, location),
    ],
    location,
  )
}

function expFromPosition(
  position: S.Position,
  location: S.SourceLocation,
): M.Exp {
  return M.desugarList(
    [
      M.SymbolExp("make-source-position", location),
      M.IntExp(BigInt(position.index), location),
      M.IntExp(BigInt(position.row), location),
      M.IntExp(BigInt(position.column), location),
    ],
    location,
  )
}
