import * as vscode from 'vscode'
import { computeIndentation } from './indent'

function indentLine(
  document: vscode.TextDocument,
  line: number,
): vscode.TextEdit[] {
  const pos = new vscode.Position(line, 0)
  const indent = computeIndentation(document, pos)
  if (indent === null) {
    return []
  }

  const currentLineText = document.lineAt(line).text
  const leadingWhitespace = currentLineText.match(/^\s*/)?.[0] || ''
  if (leadingWhitespace.length === indent) {
    return []
  }

  const edit = new vscode.TextEdit(
    new vscode.Range(line, 0, line, leadingWhitespace.length),
    ' '.repeat(indent),
  )
  return [edit]
}

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.languages.registerOnTypeFormattingEditProvider(
      { language: 'meta-lisp' },
      {
        provideOnTypeFormattingEdits(
          document: vscode.TextDocument,
          position: vscode.Position,
          ch: string,
          _options: vscode.FormattingOptions,
        ): vscode.TextEdit[] {
          if (ch === '\n') {
            return indentLine(document, position.line)
          }
          if (ch === '\t') {
            return indentLine(document, position.line)
          }
          return []
        },
      },
      '\n',
      '\t',
    ),
  )
}

export function deactivate(): void {
  // nothing to clean up
}
