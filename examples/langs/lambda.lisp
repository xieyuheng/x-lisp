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

(claim lookup (-> symbol? env? value?))

(define (lookup name env)
  (cond ((empty-env? env) none)
        ((cons-env? env)
         (if (equal? (cons-env-name env) name)
           (just (cons-env-value env))
           (lookup name (cons-env-rest env))))))

(begin
  (= env empty-env)
  (assert (equal? (lookup 'x env) none))
  (= env (cons-env 'x 1 env))
  (assert (equal? (lookup 'x env) (just 1)))
  (= env (cons-env 'y 2 env))
  (assert (equal? (lookup 'x env) (just 1)))
  (assert (equal? (lookup 'y env) (just 2))))

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

;; (define (eval exp env)
;;   (match exp
;;     ((var-exp name)
;;      (just-content (lookup name env)))
;;     ((apply-exp target arg)
;;      (apply (eval target env) (eval arg env)))
;;     ((lambda-exp parameter body)
;;      (closure parameter body env))))

(claim apply (-> value? value? value?))

(define (apply target arg)
  (cond ((closure? target)
         (eval (closure-body target)
               (cons-env (closure-parameter target) arg
                         (closure-env target))))))

;; (define (apply target arg)
;;   (match target
;;     ((closure parameter body env)
;;      (eval body (cons-env parameter arg env)))))
