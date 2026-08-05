import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function desugarLocationZh(location: S.SourceLocation): M.Exp {
  return M.ApplyExp(
    M.QualifiedVarExp("meta-builtin", "内置", "作源码位置", location),
    [
      M.StringExp(location.path, location),
      expFromSpanZh(location.span, location),
    ],
    location,
  )
}

function expFromSpanZh(span: S.Span, location: S.SourceLocation): M.Exp {
  return M.ApplyExp(
    M.QualifiedVarExp("meta-builtin", "内置", "作源码区间", location),
    [
      expFromPositionZh(span.start, location),
      expFromPositionZh(span.end, location),
    ],
    location,
  )
}

function expFromPositionZh(
  position: S.Position,
  location: S.SourceLocation,
): M.Exp {
  return M.ApplyExp(
    M.QualifiedVarExp("meta-builtin", "内置", "作源码坐标", location),
    [
      M.IntExp(BigInt(position.index), location),
      M.IntExp(BigInt(position.row), location),
      M.IntExp(BigInt(position.column), location),
    ],
    location,
  )
}
