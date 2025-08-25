(import-all "list-getters.lisp")
(import-all "list-map.lisp")

(define (list-unzip pairs)
  [(list-map pairs list-first)
   (list-map pairs list-second)])
