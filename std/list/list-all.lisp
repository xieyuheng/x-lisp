(export list-all?)

(claim list-all?
  (-> (-> anything? bool?) (list? anything?)
      bool?))

(define (list-all? p list)
  (cond ((list-empty? list) true)
        ((not (p (car list))) false)
        (else (list-all? p (cdr list)))))
