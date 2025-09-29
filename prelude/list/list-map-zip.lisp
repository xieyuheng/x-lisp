(import-all "list-getters")
(import-all "list-map")
(import-all "list-zip")

(export list-map-zip)

(define (list-map-zip f left right)
  (list-map
   (lambda (zipped)
     (f (list-first zipped)
        (list-second zipped)))
   (list-zip left right)))
