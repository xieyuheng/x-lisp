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
  (cond ((empty-env? env) none)
        ((cons-env? env)
         (if (equal? (cons-env-name env) name)
           (just (cons-env-value env))
           (lookup name (cons-env-rest env))))))

(claim eval (-> exp? env? value?))

(define (eval exp env)
  (cond ((var-exp? exp)
         (just-content (lookup (var-exp-name exp) env)))
        ((apply-exp? exp)
         (apply (eval (apply-exp-target exp) env)
           (eval (apply-exp-arg exp) env)))
        ((lambda-exp? exp)
         (closure (lambda-exp-parameter exp)
                  (lambda-exp-body exp)
                  env))))

(claim apply (-> value? value? value?))

(define (apply target arg)
  (cond ((closure? target)
         (eval (closure-body target)
               (cons-env (closure-parameter target) arg
                         (closure-env target))))))
