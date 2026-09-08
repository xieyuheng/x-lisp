// - prims that may allocate gc-heap objects.
// - short names, matched against the last segment of a qualified prim name.
// - audited against [xrt.c] builtin implementations (2026-09).

export const allocatingPrimitivesEn: Set<string> = new Set([
  // value
  "format",

  // file
  "open-input-file",
  "open-output-file",
  "file-read",

  // symbol
  "symbol-to-text",

  // text
  "text-slice",
  "text-append",
  "text-concat",
  "text-chars",
  "text-lines",
  "text-split",
  "text-join",
  "text-replace",
  "text-to-upper-case",
  "text-to-lower-case",
  "text-trim-left",
  "text-trim-right",
  "text-trim-start",
  "text-trim-end",
  "text-trim",

  // list
  "cons",

  // array
  "make-array",
  "array-copy",
  "array-to-list",
  "list-to-array",

  // pair
  "make-pair",

  // hash
  "make-hash",
  "hash-copy",
  "hash-copy-put",
  "hash-keys",
  "hash-values",
  "hash-entries",

  // set
  "make-set",
  "set-copy",
  "set-copy-add",
  "set-copy-delete",
  "set-union",
  "set-inter",
  "set-difference",
  "set-to-list",

  // sexp
  "parse-sexps",
  "format-as-sexp",
  "format-message-with-location",

  // json
  "parse-json",
  "format-json",

  // path
  "path-file-name",
  "path-directory-name",
  "path-extension",
  "path-stem",
  "path-join",
  "path-normalize",
  "path-relative",
  "path-relative-to-cwd",
  "path-resolve",
  "path-read",
  "path-list",
  "path-list-recursive",

  // process
  "current-directory",
  "current-command-line",
  "current-full-command-line",

  // type (constructing functions)
  "list-t",
  "array-t",
  "set-t",
  "hash-t",
  "pair-t",
])
