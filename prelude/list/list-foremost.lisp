(import-all "../sort-order")

(export list-foremost)

(claim list-foremost
  (polymorphic (A)
    (-> (-> A A sort-order?)
        (inter (list? A) (negate list-empty?))
        A)))

(define (list-foremost compare list)
  (list-foremost/loop compare (cdr list) (car list)))

(define (list-foremost/loop compare list most)
  (if (list-empty? list)
    most
    (match (compare most (car list))
      (-1 (list-foremost/loop compare (cdr list) most))
      (0 (list-foremost/loop compare (cdr list) most))
      (1 (list-foremost/loop compare (cdr list) (car list))))))
