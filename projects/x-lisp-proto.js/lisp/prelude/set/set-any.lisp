(import-all "../function")
(import-all "../list")

(export set-any?)

(claim set-any?
  (polymorphic (A)
    (-> (-> A bool?) (set? A)
        bool?)))

(define (set-any? p set)
  (pipe set set-to-list (list-some? p)))
