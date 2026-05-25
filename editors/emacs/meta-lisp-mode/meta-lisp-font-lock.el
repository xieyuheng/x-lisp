;;; meta-lisp-font-lock.el --- Font-lock for meta-lisp -*- lexical-binding: t; -*-

(require 'cl-lib)

(defconst meta-lisp--special-forms
  '("define" "lambda" "let" "let*" "letrec" "letrec*"
    "if" "cond" "when" "unless" "and" "or"
    "begin" "match" "match-many"
    "pipe" "chain" "compose"
    "="
    "module" "import" "import-as" "import-all" "private"
    "claim" "claim-type" "admit" "the" "polymorphic"
    "interface" "extend-interface" "define-interface"
    "define-algebraic-type" "define-record-type"
    "define-struct" "define-struct*" "define-enum"
    "define-type" "define-opaque-type"
    "define-test"
    "assert" "assert-not" "assert-the"
    "assert-equal" "assert-not-equal")
  "Special forms in meta-lisp.

These are keywords that appear as the first element of a list
and have special evaluation semantics.")

(defconst meta-lisp--at-forms
  '("@list" "@set" "@hash" "@quote" "@record")
  "@-prefixed forms that are built-in syntax sugar.

For example: (@list 1 2 3) is sugar for [1 2 3].")

(defconst meta-lisp--builtin-constants
  '("true" "false" "void")
  "Builtin constant names in meta-lisp.")

(defconst meta-lisp--builtin-types
  '("int-t" "float-t" "string-t" "symbol-t" "keyword-t"
    "bool-t" "void-t" "file-t" "list-t" "set-t" "hash-t"
    "maybe-t" "box-t")
  "Builtin type names in meta-lisp.")

;;; Helpers

(defun meta-lisp--re-special-forms ()
  "Return a regexp matching any special form at the head of a list."
  (let ((syms meta-lisp--special-forms))
    (concat "(\\(" (regexp-opt syms) "\\)")))

(defun meta-lisp--re-at-forms ()
  "Return a regexp matching any @-prefixed form at the head of a list."
  (let ((syms meta-lisp--at-forms))
    (concat "(\\(" (regexp-opt syms) "\\)")))

(defun meta-lisp--re-builtin-types ()
  "Return a regexp matching builtin type names."
  (regexp-opt meta-lisp--builtin-types))

(defun meta-lisp--re-builtin-constants ()
  "Return a regexp matching builtin constant names."
  (regexp-opt meta-lisp--builtin-constants))

;;; Non-symbolic faces that are not provided by font-lock

(defface meta-lisp-qualified-name-face
  '((t :inherit font-lock-type-face))
  "Face for qualified names like `module/name' in meta-lisp."
  :group 'meta-lisp)

(defface meta-lisp-at-form-face
  '((t :inherit font-lock-preprocessor-face))
  "Face for @-prefixed forms like `@list' in meta-lisp."
  :group 'meta-lisp)

;;; Font-lock keywords

(defvar meta-lisp-font-lock-keywords
  `(
   ;; Special forms at head position: (define ...)  (lambda ...)  etc.
   (,(meta-lisp--re-special-forms)
    1 font-lock-keyword-face)

   ;; @-prefixed forms at head position: (@list ...)  (@set ...)  etc.
   (,(meta-lisp--re-at-forms)
    1 'meta-lisp-at-form-face)

   ;; Builtin constants as standalone symbols: true  false  void
   (,(concat "\\_<" (meta-lisp--re-builtin-constants) "\\_>")
    0 font-lock-builtin-face)

   ;; Builtin type names: int-t  float-t  string-t  etc.
   (,(concat "\\_<" (meta-lisp--re-builtin-types) "\\_>")
    0 font-lock-type-face)

   ;; Keywords: :key :name :etc
   (,(concat "\\_<:[-a-zA-Z0-9?!+*/=<>_]+\\_>")
    0 font-lock-constant-face)

   ;; Qualified names: module-name/symbol
   (,(concat "\\_<[a-zA-Z][-a-zA-Z0-9?!+*/=<>_]*/[a-zA-Z][-a-zA-Z0-9?!+*/=<>_]*\\_>")
    0 'meta-lisp-qualified-name-face)

   ;; Numbers: integers and floats
   (,(concat "\\_<-?[0-9]+\\(\\.[0-9]+\\)?\\_>")
    0 font-lock-constant-face)
   )
  "Default font-lock keywords for `meta-lisp-mode'.")

(provide 'meta-lisp-font-lock)
;;; meta-lisp-font-lock.el ends here
