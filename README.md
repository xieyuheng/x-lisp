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

[`lambda.lisp`](examples/langs/lambda.lisp):

```lisp
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

[`lambda.snapshot.lisp`](examples/langs/lambda.snapshot.lisp):

```lisp
(import-all "lambda.lisp")

(assert
  (equal?
   (eval (parse-exp
          '(lambda (x) x))
         empty-env)
   (closure 'x (var-exp 'x) empty-env)))

(assert
  (equal?
   (eval (parse-exp
          '((lambda (x) x) (lambda (x) x)))
         empty-env)
   (closure 'x (var-exp 'x) empty-env)))

(begin
  (= file (path-join [(current-module-directory) "example.lambda"]))
  (= exp (parse-sexp (file-read file)))
  (eval (parse-exp exp) empty-env))
```

## Development

```sh
npm install
npm run build
npm run test
```

## License

[GPLv3](LICENSE)
