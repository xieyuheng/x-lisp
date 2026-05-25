import * as vscode from 'vscode'
import {
  findEnclosingSexpStart,
  readKeywordAtSexpHead,
  positionAfterSpecialArgs,
  computeBodyIndent,
  computeFunctionIndent,
  insideStringOrComment,
} from './utils'
import { getIndentSpec } from './config'

export function computeIndentation(
  document: vscode.TextDocument,
  position: vscode.Position,
): number | null {
  if (insideStringOrComment(document, position)) {
    return null
  }

  const enclosing = findEnclosingSexpStart(document, position)
  if (!enclosing) {
    return 0
  }

  const keyword = readKeywordAtSexpHead(document, enclosing.openPos)
  const spec = getIndentSpec(enclosing.openChar, keyword)

  if (spec === null) {
    return computeFunctionIndent(document, enclosing.openPos)
  }

  const afterSpecials = positionAfterSpecialArgs(document, enclosing.openPos, spec)
  if (!afterSpecials) {
    return enclosing.openPos.character + 2
  }

  if (position.compareTo(afterSpecials) >= 0) {
    return computeBodyIndent(document, enclosing.openPos, afterSpecials)
  }

  return computeFunctionIndent(document, enclosing.openPos)
}
