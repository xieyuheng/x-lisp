(export string-repeat)

(claim string-repeat
  (-> int-non-negative? string?
      string?))

(define (string-repeat n string)
  (if (equal? n 0)
    ""
    (string-append string (string-repeat (isub n 1) string))))
