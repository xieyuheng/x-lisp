(export parse-exp empty-env eval)

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
     (invoke (eval target env) (eval arg env)))
    ((lambda-exp parameter body)
     (closure parameter body env))))

(claim invoke (-> value? value? value?))

(define (invoke target arg)
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
