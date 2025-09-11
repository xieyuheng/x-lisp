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
(list? p target)
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
(list-set index value list)
(list-set! index value list)
(list-reverse list)
(list-member? x list)
```

in [`std`](std):

```scheme
(list-first list)
(list-second list)
(list-third list)
(list-map f list)
(list-filter p list)
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
(record? p target)
(record-length record)
(record-keys record)
(record-values record)
(record-entries record)
(record-append record rest)
(record-of record)
(record-empty? record)
(record-get key record)
(record-has? key record)
(record-set key value record)
(record-set! key value record)
(record-delete key record)
(record-delete! key record)
(record-map fn record)
```

in [`std`](std):

```scheme
(record-from-entries entries)
(record-set-many entries record)
(record-filter p record)
```

### Predicate

in [builtin](src/lang/builtin):

```scheme
(negate p x)
(union/fn ps x)
(inter/fn ps x)
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
(file-get path)
(file-set! path text)
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
(pipe/fn x fs)
(compose/fn fs x)
```

in [`std`](std):

```scheme
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
