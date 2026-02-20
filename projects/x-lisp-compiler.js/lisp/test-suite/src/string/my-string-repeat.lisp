(export my-string-repeat)

(claim my-string-repeat
  [#-> [#int #string]
       #string])

(define (my-string-repeat n string)
  (if (equal? n 0)
    ""
    (string-append string (my-string-repeat (isub n 1) string))))
