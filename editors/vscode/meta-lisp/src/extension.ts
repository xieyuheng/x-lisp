import * as vscode from 'vscode'
import { computeIndentation } from './indent'

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
          if (ch !== '\n') {
            return []
          }

          const indent = computeIndentation(document, position)
          if (indent === null) {
            return []
          }

          const currentLineText = document.lineAt(position.line).text
          const leadingWhitespace = currentLineText.match(/^\s*/)?.[0] || ''
          if (leadingWhitespace.length === indent) {
            return []
          }

          const edit = new vscode.TextEdit(
            new vscode.Range(position.line, 0, position.line, leadingWhitespace.length),
            ' '.repeat(indent),
          )
          return [edit]
        },
      },
      '\n',
    ),
  )
}

export function deactivate(): void {
  // nothing to clean up
}
