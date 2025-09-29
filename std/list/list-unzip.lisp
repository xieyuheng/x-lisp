(import-all "list-getters")
(import-all "list-map")

(export list-unzip)

(define (list-unzip pairs)
  [(list-map list-first pairs)
   (list-map list-second pairs)])
