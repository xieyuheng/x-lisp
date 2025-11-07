# x-lisp / prototype interpreter

## Install

Install it by the following command:

```
$ npm install -g @xieyuheng/x-lisp.js
```

The command-line interface:

```
$ x-lisp.js
commands:
  help -- display help for a command
  repl -- Start x-lisp REPL
  interpret -- Interpret a x-lisp file
  interpret-basic -- Interpret a basic-lisp file
```

## Syntax

### Parser Level Syntax Sugar

```lisp
'<sexp> => (@quote <sexp>)
`<sexp> => (@quasiquote <sexp>)
,<sexp> => (@unquote <sexp>)
[<elements> <attributes>] => (@tael <elements> <attributes>)
{<elements>} => (@set <elements>)
```

### Top Level Statement Keywords

```lisp
(claim <name> <schema>)
(define <name> <exp>)
(define (<name> <parameters>) <body>)
(define-data <predicate> <constructors>)
(import <source> <entries>)
(import-all <source>)
(import-as <source> <name>)
(export <names>)
(include <source> <names>)
(include-all <source>)
(include-as <source> <name>)
(include-except <source> <names>)
```

### Expression Keywords

```lisp
(lambda (<parameters>) <body>)
(= <lhs> <rhs>)
(the <schema> <exp>)
(@tael <elements> <attributes>)
(@list <elements>)
(@record <attributes>)
(@set <elements>)
(@hash <key-value-pairs>)
(tau <elements>)
(begin <body>)
(cond <cond-lines>)
(match <target> <match-lines>)
(-> <arg-schemas> <ret-schema>)
(@quote <sexp>)
(@quasiquote <sexp>)
(@pattern <pattern>)
(polymorphic (<parameters>) <schema>)
(specific <target> <args>)
(if <condition> <consequent> <alternative>)
(when <condition> <consequent>)
(unless <condition> <consequent>)
(and <exps>)
(or <exps>)
(assert <exp>)
(assert-not <exp>)
(assert-equal <lhs> <rhs>)
(assert-not-equal <lhs> <rhs>)
(assert-the <schema> <exp>)
(<target> <args>)
```

## API

### Bool

```lisp
true
false
(bool? value)
(not bool)
```

### Int

```lisp
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
(int-greater-equal? x y)
(int-less-equal? x y)
(int-positive? x)
(int-non-negative? x)
(int-compare-ascending x y)
(int-compare-descending x y)
```

### Float

```lisp
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
(float-greater-equal? x y)
(float-less-equal? x y)
(float-positive? x)
(float-non-negative? x)
(float-compare-ascending x y)
(float-compare-descending x y)
```

### Symbol

```lisp
(symbol? value)
(symbol-length symbol)
(symbol-to-string symbol)
(symbol-append left right)
(symbol-concat list)
```

### String

```lisp
(string? value)
(string-length string)
(string-to-symbol string)
(string-append left right)
(string-concat list)
(string-join separator list)
(string-chars string)
(string-compare-lexical x y)
;; prelude
(string-repeat n string)
```

### Value

```lisp
(same? lhs rhs)
(equal? lhs rhs)
(atom? value)
(anything? value)
```

### Schema

```lisp
(valid? schema value)
```

### List

```lisp
(list? element-p target)
(car list)
(cdr list)
(cons head tail)
(list-head list)
(list-tail list)
(list-init list)
(list-last list)
(list-length list)
(list-empty? list)
(list-copy list)
(list-get index list)
(list-put index value list)
(list-put! index value list)
(list-push value list)
(list-push! value list)
(list-pop! list)
(list-unshift! value list)
(list-shift! list)
(list-reverse list)
(list-to-set list)
(list-sort! compare list)
(list-sort compare list)
;; prelude
(list-first list)
(list-second list)
(list-third list)
(list-map f list)
(list-each f list)
(list-select p list)
(list-reject p list)
(list-append list tail)
(list-concat lists)
(list-unit x)
(list-lift f list)
(list-bind list f)
(list-take n list)
(list-drop n list)
(list-fold-left op e list)
(list-fold-right op e list)
(list-zip left right)
(list-unzip pairs)
(list-map-zip f left right)
(list-all? p list)
(list-any? p list)
(list-member? x list)
(list-find p list)
(list-find-index p list)
(list-product lhs rhs)
(list-group f list)
(list-foremost compare list)
(list-rearmost compare list)
```

### Set

```lisp
(set? element-p value)
(set-size set)
(set-empty? set)
(set-copy set)
(set-member? value set)
(set-include? subset set)
(set-to-list set)
(set-add value set)
(set-add! value set)
(set-delete value set)
(set-delete! value set)
(set-clear! set)
(set-union left right)
(set-inter left right)
(set-difference left right)
(set-disjoint? left right)
(set-map f set)
(set-each f set)
;; prelude
(set-select p set)
(set-reject p set)
(set-all? p set)
(set-any? p set)
```

### Record

```lisp
(record? value-p target)
(record-length record)
(record-keys record)
(record-values record)
(record-entries record)
(record-append record rest)
(record-copy record)
(record-empty? record)
(record-get key record)
(record-has? key record)
(record-put key value record)
(record-put! key value record)
(record-delete key record)
(record-delete! key record)
;; prelude
(record-from-entries entries)
(record-put-entries entries record)
(record-put-entries! entries record)
(record-select p record)
(record-select-key p record)
(record-select-value p record)
(record-reject p record)
(record-reject-key p record)
(record-reject-value p record)
(record-update key f record)
(record-update! key f record)
(record-unit key value)
(record-map f record)
(record-map-value f record)
(record-map-key f record)
(record-each-value f record)
(record-each-key f record)
(record-each f record)
(record-find-key p record)
```

### Hash

```lisp
(hash? key-p value-p target)
(hash-empty? hash)
(hash-length hash)
(hash-get key hash)
(hash-has? key hash)
(hash-put key value hash)
(hash-put! key value hash)
(hash-delete! key hash)
(hash-copy hash)
(hash-entries hash)
(hash-keys hash)
(hash-values hash)
;; prelude
(hash-put-entries entries hash)
(hash-put-entries! entries hash)
(hash-update key f hash)
(hash-update! key f hash)
(hash-from-entries entries)
(hash-select p hash)
(hash-select-key p hash)
(hash-select-value p hash)
(hash-reject p hash)
(hash-reject-key p hash)
(hash-reject-value p hash)
(hash-append hash rest)
(hash-map f hash)
(hash-map-key f hash)
(hash-map-value f hash)
(hash-each-value f hash)
(hash-each-key f hash)
(hash-each f hash)
(hash-invert hash)
(hash-invert-group hash)
(hash-find-key p hash)
```

### Predicate

```lisp
;; prelude
(negate p x)
(union ...ps)
(inter ...ps)
```

### Sexp

```lisp
(sexp? value)
(parse-sexp string)
(parse-sexps string)
(format-sexp sexp)
```

### File

```lisp
(file-exists? path)
(file-size path)
(file-load path)
(file-save path string)
(file-delete path)
(directory-exists? path)
(directory-create path)
(directory-create-recursively path)
(directory-delete path)
(directory-delete-recursively path)
(directory-files path)
(directory-files-recursively path)
(directory-directories path)
(directory-directories-recursively path)
```

### Path

```lisp
(path-join list)
```

### Process

```lisp
(current-working-directory)
(current-command-line-args)
(exit info)
```

### Module

```lisp
(current-module-file)
(current-module-directory)
```

### Console

```lisp
(print value)
(write string)
(newline)
```

### Void

```lisp
void
(void? value)
```

### Null

```lisp
null
(null? value)
```

### Optional

```lisp
(optional? p x)
;; prelude
(optional-lift f x)
(optional-bind x f)
```

### Function

```lisp
(apply f args)
;; prelude
(identity x)
(identity-unless b f)
(constant x y)
(with-default-argument default f)
(swap f)
(drop f)
(dup f)
(compose ...fs)
(pipe x ...fs)
```

### Format

```lisp
(format value)
(format-subscript n)
(format-superscript n)
```

### Random

```lisp
(random-int start end)
(random-float start end)
```

### System

```lisp
(system-shell-run command args)
```

### Sort Order

```lisp
(ordering? value)
(ordering-before? value)
(ordering-same? value)
(ordering-after? value)
(ordering-negate order)
(ordering-reverse compare x y)
;; prelude
(chain-compare ...fs)
```

### Pretty

```lisp
(pretty-print max-width value)
(pretty max-width value)
```

## Standard Libraries

### Priority Queue

```lisp
(priority-queue? key-p priority-p value)
(make-priority-queue compare)
(priority-queue-empty? queue)
(priority-queue-length queue)
(priority-queue-get key queue)
(priority-queue-put! key priority queue)
(priority-queue-peek queue)
(priority-queue-poll! queue)
(priority-queue-delete! key queue)
```

### Graph

```lisp
(graph? vertex-p value)
(graph-edge? vertex-p edge)
(make-graph vertices edges)
(make-empty-graph)
(graph-copy graph)
(graph-vertices graph)
(graph-vertex-count graph)
(graph-empty? graph)
(graph-edges graph)
(graph-equal-edge? lhs rhs)
(graph-equal-edges? lhs rhs)
(graph-neighbors vertex graph)
(graph-add-vertex! vertex graph)
(graph-has-vertex? vertex graph)
(graph-delete-vertex! vertex graph)
(graph-add-vertices! vertices graph)
(graph-add-edge! edge graph)
(graph-has-edge? edge graph)
(graph-delete-edge! edge graph)
(graph-add-edges! edges graph)
(graph-adjacent? source target graph)
(graph-degree vertex graph)
(graph-max-degree graph)
(graph-coloring! coloring vertices graph)
(graph-coloring graph)
```

## Digraph

```scheme
(digraph? vertex-p value)
(digraph-edge? vertex-p value)
(make-empty-digraph)
(make-digraph vertices edges)
(digraph-copy digraph)
(digraph-vertices digraph)
(digraph-vertex-count digraph)
(digraph-empty? digraph)
(digraph-add-vertex! vertex digraph)
(digraph-has-vertex? vertex digraph)
(digraph-add-vertices! vertices digraph)
(digraph-direct-successors vertex digraph)
(digraph-direct-predecessors vertex digraph)
(digraph-out-degree vertex digraph)
(digraph-in-degree vertex digraph)
(digraph-add-edge! edge digraph)
(digraph-add-edges! edges digraph)
(digraph-has-edge? edge digraph)
(digraph-direct-predecessor? source target digraph)
(digraph-direct-successor? target source digraph)
(digraph-edges digraph)
(digraph-edge-count digraph)
(digraph-delete-edge! edge digraph)
(digraph-delete-vertex! vertex digraph)
(digraph-predecessor? source target digraph)
(digraph-successor? target source digraph)
(digraph-topological-order digraph)
(digraph-topological-ordered? vertices digraph)
(digraph-acyclic? digraph)
```
