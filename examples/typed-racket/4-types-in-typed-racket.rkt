#lang typed/racket

(: sum-list (-> (Listof Number) Number))
(define (sum-list l)
  (cond [(null? l) 0]
        [else (+ (car l) (sum-list (cdr l)))]))

(struct Nothing ())
(struct (A) Just ([v : A]))

(define-type (Maybe A) (U Nothing (Just A)))

(: find (-> Number (Listof Number) (Maybe Number)))
(define (find v l)
  (cond [(null? l) (Nothing)]
        [(= v (car l)) (Just v)]
        [else (find v (cdr l))]))

(: list-length (All (A) (-> (Listof A) Integer)))
(define (list-length l)
  (if (null? l)
      0
      (add1 (list-length (cdr l)))))

(: sum (-> Number * Number))
(define (sum . xs)
  (if (null? xs)
      0
      (+ (car xs) (apply sum (cdr xs)))))
