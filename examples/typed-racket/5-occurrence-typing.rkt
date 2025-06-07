#lang typed/racket

(: listof-string? (-> (Listof Any) Boolean : (Listof String)))
(define (listof-string? lst)
  (andmap string? lst))

(: main (-> (Listof Any) String))
(define (main lst)
  (cond
    [(listof-string? lst) (first lst)]
    [else "not a list of strings"]))
