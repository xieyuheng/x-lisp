# x-lisp.js

My list processing language.

## Install

Install it by the following command:

```sh
npm install -g @xieyuheng/x-lisp.js
```

The command-line program is called `x-lisp.js`.

## Examples

See more examples at [`examples`](examples) directory.

## Prelude

### Bool

in [builtin](src/lang/builtin):

```scheme
true
false
(bool? value)
(not bool)
```

### Int

in [builtin](src/lang/builtin):

```scheme
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
```

### Float

in [builtin](src/lang/builtin):

```scheme
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
```

### Symbol

in [builtin](src/lang/builtin):

```scheme
(symbol? value)
(symbol-length symbol)
(symbol-to-string symbol)
(symbol-append left right)
(symbol-append-many list)
```

### String

in [builtin](src/lang/builtin):

```scheme
(string? value)
(string-length string)
(string-to-symbol string)
(string-append left right)
(string-append-many list)
(string-join separator list)
(string-chars string)
```

### Value

in [builtin](src/lang/builtin):

```scheme
(same? lhs rhs)
(equal? lhs rhs)
(atom? value)
(anything? value)
```

### List

in [builtin](src/lang/builtin):

```scheme
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
(list-of list)
(list-get index list)
(list-put index value list)
(list-put! index value list)
(list-push value list)
(list-push! value list)
(list-reverse list)
(list-member? x list)
(list-to-set list)
(list-dedup list)
(list-product lhs rhs)
(list-product/no-diagonal lhs rhs)
```

in [`std`](std):

```scheme
(list-first list)
(list-second list)
(list-third list)
(list-map f list)
(list-each f list)
(list-select p list)
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
```

### Record

in [builtin](src/lang/builtin):

```scheme
(record? value-p target)
(record-length record)
(record-keys record)
(record-values record)
(record-entries record)
(record-append record rest)
(record-of record)
(record-empty? record)
(record-get key record)
(record-has? key record)
(record-put key value record)
(record-put! key value record)
(record-delete key record)
(record-delete! key record)
(record-map fn record)
```

in [`std`](std):

```scheme
(record-from-entries entries)
(record-put-many entries record)
(record-put-many! entries record)
(record-select p record)
(record-update fs record)
(record-update! fs record)
(record-upsert upserters record)
(record-upsert! upserters record)
(record-unit key value)
```

## Set

in [builtin](src/lang/builtin):

```scheme
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
(set-select p set)
```

### Hash

in [builtin](src/lang/builtin):

```scheme
(hash? key-p value-p target)
(hash-empty? hash)
(hash-length hash)
(hash-get key hash)
(hash-put key value hash)
(hash-put! key value hash)
(hash-copy hash)
(hash-entries hash)
(hash-keys hash)
(hash-values hash)
```

in [`std`](std):

```scheme
(hash-put-many entries hash)
(hash-put-many! entries hash)
(hash-from-entries entries)
(hash-append hash rest)
(hash-map f hash)
```

### Predicate

in [builtin](src/lang/builtin):

```scheme
(negate p x)
(union-fn ps x)
(inter-fn ps x)
```

### Sexp

in [builtin](src/lang/builtin):

```scheme
(sexp? value)
(parse-sexp string)
(parse-sexps string)
(format-sexp sexp)
```

### File

in [builtin](src/lang/builtin):

```scheme
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

in [builtin](src/lang/builtin):

```scheme
(path-join list)
```

### Process

in [builtin](src/lang/builtin):

```scheme
(current-working-directory)
(exit sexp)
```

### Module

in [builtin](src/lang/builtin):

```scheme
(current-module-file)
(current-module-directory)
```

### Console

in [builtin](src/lang/builtin):

```scheme
(print value)
(println value)
(write string)
(writeln string)
```

### Void

in [builtin](src/lang/builtin):

```scheme
void
(void? value)
```

### Null

in [builtin](src/lang/builtin):

```scheme
null
(null? value)
```

### Function

in [builtin](src/lang/builtin):

```scheme
(apply f args)
(pipe-fn x fs)
(compose-fn fs x)
```

in [`std`](std):

```scheme
(identity x)
(constant x y)
(swap f x y)
```

### Format

in [builtin](src/lang/builtin):

```scheme
(format-subscript n)
(format-superscript n)
```

### Conditional

in [`std`](std):

```scheme
(when p t)
(unless p f)
```

### Optional

in [`std`](std):

```scheme
(optional? p x)
```

### Random

in [builtin](src/lang/builtin):

```scheme
(random-int start end)
(random-float start end)
```

### System

in [builtin](src/lang/builtin):

```scheme
(system-shell-run command args)
```

## Development

```sh
npm install
npm run build
npm run test
```

## License

[GPLv3](LICENSE)
