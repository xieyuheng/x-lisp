(import-all "my-list")

(claim main (-> void-t))

(define (main)
  (println nil)
  (println (li 1 (li 2 (li 3 nil)))))
