# x-lisp.js

Extensible list processing language.

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
  run -- Run a file
  repl -- Start the REPL
```

## Development

```
$ npm install
$ npm run build
$ npm run test
```

## Examples

See examples at:

- [`examples`](examples)
- [`prelude`](prelude)
- [`std`](std)

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
(thunk <body>)
(lazy <exp>)
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
(union <exps>)
(inter <exps>)
(compose <exps>)
(pipe <arg> <exps>)
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
(int-larger? x y)
(int-smaller? x y)
(int-larger-or-equal? x y)
(int-smaller-or-equal? x y)
(int-positive? x)
(int-non-negative? x)
(int-compare/ascending x y)
(int-compare/descending x y)
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
(float-larger? x y)
(float-smaller? x y)
(float-larger-or-equal? x y)
(float-smaller-or-equal? x y)
(float-positive? x)
(float-non-negative? x)
(float-compare/ascending x y)
(float-compare/descending x y)
```

### Symbol

```lisp
(symbol? value)
(symbol-length symbol)
(symbol-to-string symbol)
(symbol-append left right)
(symbol-append-many list)
```

### String

```lisp
(string? value)
(string-length string)
(string-to-symbol string)
(string-append left right)
(string-append-many list)
(string-join separator list)
(string-chars string)
(string-compare/lexical x y)
```

### Value

```lisp
(same? lhs rhs)
(equal? lhs rhs)
(atom? value)
(anything? value)
```

### List

```lisp
(list-empty? value)
(list? element-p target)
(car list)
(cdr list)
(cons head tail)
(list-head list)
(list-tail list)
(list-init list)
(list-last list)
(list-length list)
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
(list-append-many lists)
(list-append-map f list)
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
(list-dedup list)
(list-product lhs rhs)
(list-product/no-diagonal lhs rhs)
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
(record-map-value f record)
;; prelude
(record-from-entries entries)
(record-put-many entries record)
(record-put-many! entries record)
(record-select p record)
(record-reject p record)
(record-update fs record)
(record-update! fs record)
(record-upsert upserters record)
(record-upsert! upserters record)
(record-unit key value)
```

### Set

```lisp
(set? element-p value)
(set-empty? set)
(set-size set)
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
(hash-put-many entries hash)
(hash-put-many! entries hash)
(hash-from-entries entries)
(hash-append hash rest)
(hash-map-value f hash)
(hash-map-key f hash)
(hash-invert hash)
```

### Predicate

```lisp
(negate p x)
(union-fn ps x)
(inter-fn ps x)
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
(exit sexp)
```

### Module

```lisp
(current-module-file)
(current-module-directory)
```

### Console

```lisp
(print value)
(println value)
(write string)
(writeln string)
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

### Function

```lisp
(apply f args)
(pipe-fn x fs)
(compose-fn fs x)
;; prelude
(identity x)
(constant x y)
(swap f x y)
```

### Format

```lisp
(format-subscript n)
(format-superscript n)
```

### Optional

```lisp
;; prelude
(optional? p x)
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
;; prelude
(sort-order? value)
(sort-order-before? value)
(sort-order-same? value)
(sort-order-after? value)
(sort-order-negate order)
(sort-order-reverse compare x y)
```

## Standard Libraries

### Graph

```lisp
(graph? vertex-p value)
(make-graph edges)
(graph-vertices graph)
(graph-neighbors vertex graph)
(graph-add-vertex! vertex graph)
(graph-add-edge! edge graph)
(graph-add-edges! edges graph)
(graph-adjacent? source target graph)
(graph-vertex-degree vertex graph)
(graph-coloring! coloring vertices graph)
```

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

## License

[GPLv3](LICENSE)
