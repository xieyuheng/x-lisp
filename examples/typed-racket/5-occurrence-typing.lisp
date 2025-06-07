(claim listof-string?
  (-> (list-t any-t) boolean-t
      :narrow (list-t string-t)))
(define (listof-string? list)
  (andmap string? list))

(claim main (-> (list-t any-t) string-t))
(define (main list)
  (cond ((listof-string? list) (first list))
        (else "not a list of strings")))
