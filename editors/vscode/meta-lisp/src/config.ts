export const keywordSpecTable: Record<string, number> = {
  module: 1,
  import: 1,
  'import-as': 0,
  'import-all': 0,
  exempt: 0,
  private: 0,
  claim: 1,
  'claim-type': 1,
  admit: 1,
  define: 1,
  interface: 0,
  'extend-interface': 1,
  'define-interface': 1,
  'define-enum': 1,
  'define-algebraic-type': 1,
  'define-struct': 1,
  'define-struct*': 1,
  'define-record-type': 1,
  'define-test': 1,
  'define-type': 1,
  let: 1,
  'let*': 1,
  the: 1,
  assert: 0,
  'assert-not': 0,
  'assert-the': 0,
  'assert-equal': 0,
  'assert-not-equal': 0,
  begin: 0,
  lambda: 1,
  match: 1,
  'match-many': 1,
  pipe: 1,
  chain: 0,
  compose: 0,
  if: 1,
  when: 1,
  unless: 1,
  cond: 0,
  '@list': 0,
  '@record': 0,
  '@set': 0,
  '@hash': 0,
  polymorphic: 1,
}

export const OPEN_BRACKETS = new Set(['(', '[', '{'])

export const CLOSE_BRACKETS = new Set([')', ']', '}'])

export const BRACKET_PAIRS: Record<string, string> = {
  '(': ')',
  '[': ']',
  '{': '}',
}

export const REVERSE_BRACKET_PAIRS: Record<string, string> = {
  ')': '(',
  ']': '[',
  '}': '{',
}

export const SYMBOL_CHAR_PATTERN = /^[a-zA-Z@][-a-zA-Z0-9?!+*/=<>_@]*$/

export function getIndentSpec(openChar: string, keyword: string | null): number | null {
  if (openChar === '[' || openChar === '{') {
    return 0
  }
  if (keyword === null) {
    return null
  }
  const spec = keywordSpecTable[keyword]
  return spec !== undefined ? spec : null
}
