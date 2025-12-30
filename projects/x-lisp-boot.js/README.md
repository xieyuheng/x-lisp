# x-lisp / bootstrap compiler

## syntax

```lisp
;;; parser level syntax sugar

;; '<sexp> => (@quote <sexp>)
;; `<sexp> => (@quasiquote <sexp>)
;; ,<sexp> => (@unquote <sexp>)
;; [<elements> <attributes>] => (@tael <elements> <attributes>)
;; {<elements>} => (@set <elements>)

;;; top level statement

;; (claim <name> <schema>)
(define <name> <body>)
(define (<name> <parameters>) <body>)
;; (define-data <predicate> <constructors>)

;; module syntax statement

(import <source> <name> ...)
(import-all <source>)
(import-except <source> <name> ...)
(import-as <source> <prefix>)
(export <name> ...)
(include <source> <name> ...)
(include-all <source>)
(include-except <source> <name> ...)
(include-as <source> <prefix>)

;;; expression

(lambda (<parameters>) <body>)
;; (= <lhs> <rhs>)
;; (the <schema> <exp>)
;; (@tael <elements> <attributes>)
;; (@list <elements>)
;; (@record <attributes>)
;; (@set <elements>)
;; (@hash <key-value-pairs>)
;; (tau <elements>)
(begin <body>)
;; (cond <cond-lines>)
;; (match <target> <match-lines>)
;; (-> <arg-schemas> <ret-schema>)
;; (@quote <sexp>)
;; (@quasiquote <sexp>)
;; (@pattern <pattern>)
;; (polymorphic (<parameters>) <schema>)
;; (specific <target> <args>)
(if <condition> <consequent> <alternative>)
(when <condition> <consequent>)
(unless <condition> <consequent>)
(and <exp> ...)
(or <exp> ...)
;; (assert <exp>)
;; (assert-not <exp>)
;; (assert-equal <lhs> <rhs>)
;; (assert-not-equal <lhs> <rhs>)
;; (assert-the <schema> <exp>)
(<target> <args>)
```

## builtin and prelude

```lisp
;;; bool

;; true
;; false
(bool? value)
(not bool)

;;; int

(int? value)
(ineg x)
(iadd x y)
(isub x y)
(imul x y)
(idiv x y)
(imod x y)
(int-max x y)
(int-min x y)
(int-greater? x y)
(int-less? x y)
(int-greater-or-equal? x y)
(int-less-or-equal? x y)
(int-positive? x)
(int-non-negative? x)
(int-compare-ascending x y)
(int-compare-descending x y)

;;; float

(float? value)
(fneg x)
(fadd x y)
(fsub x y)
(fmul x y)
(fdiv x y)
(float-max x y)
(float-min x y)
(float-greater? x y)
(float-less? x y)
(float-greater-or-equal? x y)
(float-less-or-equal? x y)
(float-positive? x)
(float-non-negative? x)
(float-compare-ascending x y)
(float-compare-descending x y)

;;; hashtag

;; (hashtag? value)
;; (hashtag-to-string hashtag)

;;; symbol

;; (symbol? value)
;; (symbol-length symbol)
;; (symbol-to-string symbol)
;; (symbol-append left right)
;; (symbol-concat list)

;;; string

;; (string? value)
;; (string-length string)
;; (string-to-symbol string)
;; (string-append left right)
;; (string-concat list)
;; (string-join separator list)
;; (string-chars string)
;; (string-compare-lexical x y)
;; ;; prelude
;; (string-repeat n string)

;;; value

(same? lhs rhs)
(equal? lhs rhs)
;; (atom? value)
(any? value)

;;; schema

;; (valid? schema value)

;;; list

;; (list? element-p target)
;; (car list)
;; (cdr list)
;; (cons head tail)
;; (list-head list)
;; (list-tail list)
;; (list-init list)
;; (list-last list)
;; (list-length list)
;; (list-empty? list)
;; (list-copy list)
;; (list-get index list)
;; (list-put index value list)
;; (list-put! index value list)
;; (list-push value list)
;; (list-push! value list)
;; (list-pop! list)
;; (list-unshift! value list)
;; (list-shift! list)
;; (list-reverse list)
;; (list-to-set list)
;; (list-sort! compare list)
;; (list-sort compare list)
;; ;; prelude
;; (list-first list)
;; (list-second list)
;; (list-third list)
;; (list-map f list)
;; (list-each f list)
;; (list-select p list)
;; (list-reject p list)
;; (list-append list tail)
;; (list-concat lists)
;; (list-unit x)
;; (list-lift f list)
;; (list-bind list f)
;; (list-take n list)
;; (list-drop n list)
;; (list-fold-left op e list)
;; (list-fold-right op e list)
;; (list-zip left right)
;; (list-unzip pairs)
;; (list-map-zip f left right)
;; (list-every? p list)
;; (list-some? p list)
;; (list-member? x list)
;; (list-find p list)
;; (list-find-index p list)
;; (list-product lhs rhs)
;; (list-group f list)
;; (list-foremost compare list)
;; (list-rearmost compare list)

;;; set

;; (set? element-p value)
;; (set-size set)
;; (set-empty? set)
;; (set-copy set)
;; (set-member? value set)
;; (set-subset? subset set)
;; (set-to-list set)
;; (set-add value set)
;; (set-add! value set)
;; (set-delete value set)
;; (set-delete! value set)
;; (set-clear! set)
;; (set-union left right)
;; (set-inter left right)
;; (set-difference left right)
;; (set-disjoint? left right)
;; (set-map f set)
;; (set-each f set)
;; ;; prelude
;; (set-select p set)
;; (set-reject p set)
;; (set-all? p set)
;; (set-any? p set)

;;; record

;; (record? value-p target)
;; (record-length record)
;; (record-keys record)
;; (record-values record)
;; (record-entries record)
;; (record-append record rest)
;; (record-copy record)
;; (record-empty? record)
;; (record-get key record)
;; (record-has? key record)
;; (record-put key value record)
;; (record-put! key value record)
;; (record-delete key record)
;; (record-delete! key record)
;; ;; prelude
;; (record-from-entries entries)
;; (record-put-entries entries record)
;; (record-put-entries! entries record)
;; (record-select p record)
;; (record-select-key p record)
;; (record-select-value p record)
;; (record-reject p record)
;; (record-reject-key p record)
;; (record-reject-value p record)
;; (record-update key f record)
;; (record-update! key f record)
;; (record-unit key value)
;; (record-map f record)
;; (record-map-value f record)
;; (record-map-key f record)
;; (record-each-value f record)
;; (record-each-key f record)
;; (record-each f record)
;; (record-find-key p record)

;;; hash

;; (hash? key-p value-p target)
;; (hash-empty? hash)
;; (hash-length hash)
;; (hash-get key hash)
;; (hash-has? key hash)
;; (hash-put key value hash)
;; (hash-put! key value hash)
;; (hash-delete! key hash)
;; (hash-copy hash)
;; (hash-entries hash)
;; (hash-keys hash)
;; (hash-values hash)
;; ;; prelude
;; (hash-put-entries entries hash)
;; (hash-put-entries! entries hash)
;; (hash-update key f hash)
;; (hash-update! key f hash)
;; (hash-from-entries entries)
;; (hash-select p hash)
;; (hash-select-key p hash)
;; (hash-select-value p hash)
;; (hash-reject p hash)
;; (hash-reject-key p hash)
;; (hash-reject-value p hash)
;; (hash-append hash rest)
;; (hash-map f hash)
;; (hash-map-key f hash)
;; (hash-map-value f hash)
;; (hash-each-value f hash)
;; (hash-each-key f hash)
;; (hash-each f hash)
;; (hash-invert hash)
;; (hash-invert-group hash)
;; (hash-find-key p hash)

;;; predicate

;; ;; prelude
;; (negate p x)
;; (union ...ps)
;; (inter ...ps)

;;; sexp

;; (sexp? value)
;; (parse-sexp string)
;; (parse-sexps string)
;; (format-sexp sexp)

;;; file

;; (file-exists? path)
;; (file-size path)
;; (file-load path)
;; (file-save path string)
;; (file-delete path)
;; (directory-exists? path)
;; (directory-create path)
;; (directory-create-recursively path)
;; (directory-delete path)
;; (directory-delete-recursively path)
;; (directory-files path)
;; (directory-files-recursively path)
;; (directory-directories path)
;; (directory-directories-recursively path)

;;; path

;; (path-join list)

;;; process

;; (current-working-directory)
;; (current-command-line-args)
;; (exit info)

;;; module

;; (current-module-file)
;; (current-module-directory)

;;; console

(print value)
(println-non-void value)
;; (write string)
(newline)

;;; void

;; void
;; (void? value)

;;; null

;; null
;; (null? value)

;;; optional

;; (optional? p x)
;; ;; prelude
;; (optional-lift f x)
;; (optional-bind x f)

;;; function

;; (apply f args)
;; ;; prelude
;; (identity x)
;; (identity-unless b f)
;; (constant x y)
;; (with-default-argument default f)
;; (swap f)
;; (drop f)
;; (dup f)
;; (compose ...fs)
;; (pipe x ...fs)

;;; format

;; (format value)
;; (format-subscript n)
;; (format-superscript n)

;;; random

;; (random-int start end)
;; (random-float start end)

;;; system

;; (system-shell-run command args)

;;; sort order

;; (ordering? value)
;; (ordering-before? value)
;; (ordering-same? value)
;; (ordering-after? value)
;; (ordering-negate order)
;; (ordering-reverse compare x y)
;; ;; prelude
;; (chain-compare ...fs)

;;; pretty

;; (pretty-print max-width value)
;; (pretty max-width value)
```

## standard libraries

```lisp
;;; priority queue

;; (priority-queue? key-p priority-p value)
;; (make-priority-queue compare)
;; (priority-queue-empty? queue)
;; (priority-queue-length queue)
;; (priority-queue-get key queue)
;; (priority-queue-put! key priority queue)
;; (priority-queue-peek queue)
;; (priority-queue-poll! queue)
;; (priority-queue-delete! key queue)

;;; graph

;; (graph? vertex-p value)
;; (graph-edge? vertex-p edge)
;; (make-graph vertices edges)
;; (make-empty-graph)
;; (graph-copy graph)
;; (graph-vertices graph)
;; (graph-vertex-count graph)
;; (graph-empty? graph)
;; (graph-edges graph)
;; (graph-equal-edge? lhs rhs)
;; (graph-equal-edges? lhs rhs)
;; (graph-neighbors vertex graph)
;; (graph-add-vertex! vertex graph)
;; (graph-has-vertex? vertex graph)
;; (graph-delete-vertex! vertex graph)
;; (graph-add-vertices! vertices graph)
;; (graph-add-edge! edge graph)
;; (graph-has-edge? edge graph)
;; (graph-delete-edge! edge graph)
;; (graph-add-edges! edges graph)
;; (graph-adjacent? source target graph)
;; (graph-degree vertex graph)
;; (graph-max-degree graph)
;; (graph-coloring! coloring vertices graph)
;; (graph-coloring graph)

;;; digraph

;; (digraph? vertex-p value)
;; (digraph-edge? vertex-p value)
;; (make-empty-digraph)
;; (make-digraph vertices edges)
;; (digraph-copy digraph)
;; (digraph-vertices digraph)
;; (digraph-vertex-count digraph)
;; (digraph-empty? digraph)
;; (digraph-add-vertex! vertex digraph)
;; (digraph-has-vertex? vertex digraph)
;; (digraph-add-vertices! vertices digraph)
;; (digraph-direct-successors vertex digraph)
;; (digraph-direct-predecessors vertex digraph)
;; (digraph-out-degree vertex digraph)
;; (digraph-in-degree vertex digraph)
;; (digraph-add-edge! edge digraph)
;; (digraph-add-edges! edges digraph)
;; (digraph-has-edge? edge digraph)
;; (digraph-direct-predecessor? source target digraph)
;; (digraph-direct-successor? target source digraph)
;; (digraph-edges digraph)
;; (digraph-edge-count digraph)
;; (digraph-delete-edge! edge digraph)
;; (digraph-delete-vertex! vertex digraph)
;; (digraph-predecessor? source target digraph)
;; (digraph-successor? target source digraph)
;; (digraph-topological-order digraph)
;; (digraph-topological-ordered? vertices digraph)
;; (digraph-acyclic? digraph)
```

## basic-lisp / syntax

```lisp
;;; top level statement

(define-function <name> <block> ...)
(define-variable <name>)
(define-variable <name> <value>)
(define-setup <name> <block> ...)
(define-metadata <name> <key> <metadata> ...)
(define-placeholder <name>)

;; module syntax statement

(import <source> <name> ...)
(import-all <source>)
(import-except <source> <name> ...)
(import-as <source> <prefix>)
(export <name> ...)
(include <source> <name> ...)
(include-all <source>)
(include-except <source> <name> ...)
(include-as <source> <prefix>)

;;; block

(block <name> <instr> ...)

;;; instruction

(= <dest> (argument <index>))
(= <dest> (literal <value>))
(assert <condition>)
(return <var>)
(goto <label>)
(branch <var> <label> <label>)
(= <dest> (call <function> <var> ...))
(= <dest> (apply-nullary <var>))
(= <dest> (apply <var> <var>))

;;; value

<symbol>
<hashtag>
<string>
<int>
<float>
(@function <name> <arity>)
(@primitive-function <name> <arity>)
(@curry <value> <arity> <arg> ...)
(@address <name>)
```

## machine-lisp / syntax

```lisp
;;; top level statement

(define-code <name> <block> ...)
(define-data <name> <directive> ...)
(define-space <name> <size>)

;;; block

(block <name> <instr> ...)

;;; instruction

(<op> <operand> ...)

;;; operand

(imm <int>)
(label-imm <label>)
(var <name>)
(reg <name>)
(reg-deref <reg> <offset>)
(label-deref <label>)
(label <name>)
(external-label <name>)
(cc <condition-code>)
(arity <int>)

;;; directive

(db <byte> ...)
(dw <word> ...)
(dd <double-word> ...)
(dq <quadruple-word> ...)
(string <string>)
(int <int>)
(float <float>)
(pointer <name>)
```
