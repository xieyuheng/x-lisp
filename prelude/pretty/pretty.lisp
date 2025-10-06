(export
  pretty-format
  pretty-print)

(define options? (tau :left-margin string?))

(claim pretty-print
  (-> options? anything?
      void?))

(define (pretty-print options value)
  (writeln (pretty-format options value)))

(claim pretty-format
  (-> options? anything?
      string?))

(define (pretty-format options value)
  (= [:left-margin left-margin] options)
  (cond ((atom? value)
         (string-append left-margin (format value)))
        ((list? anything? value)
         (string-append left-margin (format value)))
        (else
         (string-append left-margin (format value)))))
