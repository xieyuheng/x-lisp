(import-all "my-list")

(export-all)

(claim my-list-map
  (polymorphic (A B)
    (-> (-> A B) (my-list-t A)
        (my-list-t B))))

(define (my-list-map f list)
  (match list
    (nil nil)
    ((li head tail) (li (f head) (my-list-map f tail)))))
