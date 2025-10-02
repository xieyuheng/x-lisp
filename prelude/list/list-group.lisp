(import-all "../hash")
(import-all "list-each")

(export list-group)

(claim list-group
  (polymorphic (K V)
    (-> (-> V K) (list? V)
        (hash? K (list? V)))))

(define (list-group f list)
  (= new-hash (@hash))
  (pipe list
    (list-each
     (lambda (value)
       (= key (f value))
       (= group (hash-get key new-hash))
       (if (null? group)
         (hash-put! key [value] new-hash)
         (list-push! value group)))))
  new-hash)
