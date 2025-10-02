(import-all "list-getters")
(import-all "list-map")

(export list-unzip)

(claim list-unzip
  (polymorphic (A B)
    (-> (list? (tau A B))
        (tau (list? A) (list? B)))))

(define (list-unzip pairs)
  [(list-map list-first pairs)
   (list-map list-second pairs)])
