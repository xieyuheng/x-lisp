# occam-lisp.js

A lisp without unnecessary entities.

## Install

Install it by the following command:

```sh
npm install -g @xieyuheng/occam-lisp.js
```

The command-line program is called `occam-lisp.js`.

## Examples

See more examples at [`examples`](examples) directory.

### Lambda Interpreter

[`lambda.lisp`](examples/langs/lambda/lambda.lisp):

```scheme
(define-data exp?
  (var-exp (name symbol?))
  (apply-exp (target exp?) (arg exp?))
  (lambda-exp (parameter symbol?) (body exp?)))

(define-data value?
  (closure (parameter symbol?) (body exp?) (env env?)))

(define-data env?
  empty-env
  (cons-env (name symbol?) (value value?) (rest env?)))

(define-data (maybe? A)
  none
  (just (content A)))

(claim lookup (-> symbol? env? (maybe? value?)))

(define (lookup name env)
  (match env
    (empty-env none)
    ((cons-env key value rest)
     (if (equal? key name)
       (just value)
       (lookup name rest)))))

(claim eval (-> exp? env? value?))

(define (eval exp env)
  (match exp
    ((var-exp name)
     (just-content (lookup name env)))
    ((apply-exp target arg)
     (apply (eval target env) (eval arg env)))
    ((lambda-exp parameter body)
     (closure parameter body env))))

(claim apply (-> value? value? value?))

(define (apply target arg)
  (match target
    ((closure parameter body env)
     (eval body (cons-env parameter arg env)))))

(claim parse-exp (-> sexp? exp?))

(define (parse-exp sexp)
  (match sexp
    (`(lambda (,parameter) ,body)
     (lambda-exp parameter (parse-exp body)))
    (`(,target ,arg)
     (apply-exp (parse-exp target) (parse-exp arg)))
    (x
     (assert (symbol? sexp))
     (var-exp x))))
```

[`lambda.snapshot.lisp`](examples/langs/lambda/lambda.snapshot.lisp):

```scheme
(import-all "lambda.lisp")

(eval (parse-exp '(lambda (x) x)) empty-env)
(eval (parse-exp '((lambda (x) x) (lambda (x) x))) empty-env)
```

## Prelude

### Bool

```scheme
true
false
(bool? value)
(not bool)
```

### Int

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

```scheme
(symbol? value)
(symbol-length symbol)
(symbol-to-string symbol)
```

### String

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

```scheme
(same? lhs rhs)
(equal? lhs rhs)
(atom? value)
(anything? value)
```

### List

```scheme
(list-empty? value)
(list? p target)
(car list)
(cdr list)
(cons (head tail))
(list-head list)
(list-tail list)
(list-init list)
(list-last list)
(list-length list)
(list-of list)
(list-get index list)
(list-set index value list)
(list-reverse list)
```

### Record

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
(record-delete key record)
(record-map fn record)
```

### Predicate

```scheme
(negate p x)
(union/fn ps x)
(inter/fn ps x)
```

### Sexp

```scheme
(sexp? value)
(parse-sexp string)
(parse-sexps string)
(format-sexp sexp)
```

### File

```scheme
(file-read path)
(file-write text path)
```

### Path

```scheme
(path-join list)
```

### Process

```scheme
(current-working-directory)
(exit sexp)
```

### Console

```scheme
(print value)
(println value)
(write string)
(writeln string)
```

### Void

```scheme
void
(void? value)
```

### Null

```scheme
null
(null? value)
```

### Function

```scheme
(pipe/fn x fs)
(compose/fn fs x)
```

## Development

```sh
npm install
npm run build
npm run test
```

## License

[GPLv3](LICENSE)
