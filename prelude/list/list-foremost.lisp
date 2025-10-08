(import-all "../schema")

(export
  list-foremost
  list-rearmost)

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
      (0  (list-foremost/loop compare (cdr list) most))
      (1  (list-foremost/loop compare (cdr list) (car list))))))


(claim list-rearmost
  (polymorphic (A)
    (-> (-> A A sort-order?)
        (inter (list? A) (negate list-empty?))
        A)))

(define (list-rearmost compare list)
  (list-rearmost/loop compare (cdr list) (car list)))

(define (list-rearmost/loop compare list most)
  (if (list-empty? list)
    most
    (match (compare most (car list))
      (-1 (list-rearmost/loop compare (cdr list) (car list)))
      (0  (list-rearmost/loop compare (cdr list) (car list)))
      (1  (list-rearmost/loop compare (cdr list) most)))))
