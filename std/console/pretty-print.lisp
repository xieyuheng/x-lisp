(export pretty-print)

(claim pretty-print (-> string? anything? void?))

(define (pretty-print left-margin value)
  ;; TODO
  (write left-margin) (print value))
