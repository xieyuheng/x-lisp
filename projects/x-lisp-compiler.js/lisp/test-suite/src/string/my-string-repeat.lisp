(export my-string-repeat)

(claim my-string-repeat (-> int-t string-t string-t))

(define (my-string-repeat n string)
  (if (equal? n 0)
    ""
    (string-append string (my-string-repeat (isub n 1) string))))
