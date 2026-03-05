(claim main (-> void-t))

(define (main)
  (assert-equal #abcdef (hashtag-append #abc #def)))
