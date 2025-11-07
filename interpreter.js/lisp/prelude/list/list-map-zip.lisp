(import-all "list-getters")
(import-all "list-map")
(import-all "list-zip")

(export list-map-zip)

(claim list-map-zip
  (polymorphic (A B C)
    (-> (-> A B C) (list? A) (list? B)
        (list? C))))

(define (list-map-zip f left right)
  (list-map
   (lambda (zipped)
     (f (list-first zipped)
        (list-second zipped)))
   (list-zip left right)))
