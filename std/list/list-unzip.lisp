(import-all "list-getters.lisp")
(import-all "list-map.lisp")

(define (list-unzip pairs)
  [(list-map list-first pairs)
   (list-map list-second pairs)])
