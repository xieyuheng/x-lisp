(import-all "../function")
(import-all "../list")

(export set-all?)

(claim set-all?
  (polymorphic (A)
    (-> (-> A bool?) (set? A)
        bool?)))

(define (set-all? p set)
  (pipe set set-to-list (list-every? p)))
