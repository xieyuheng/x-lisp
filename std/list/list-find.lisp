(export list-find)

(claim list-find
  (-> (-> anything? bool?) (list? anything?)
      (union anything? null?)))

(define (list-find p list)
  (cond ((list-empty? list) null)
        ((p (car list)) (car list))
        (else (list-find p (cdr list)))))
