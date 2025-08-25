(import-all "list-getters.lisp")
(import-all "list-map.lisp")
(import-all "list-zip.lisp")

(define (list-map-zip f left right)
  (list-map
   (lambda (zipped)
     (f (list-first zipped)
        (list-second zipped)))
   (list-zip left right)))
