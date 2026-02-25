;; type

(define-type bool-t [#atom #bool])
(define-type int-t [#atom #int])
(define-type float-t [#atom #float])
(define-type string-t [#atom #string])
(define-type symbol-t [#atom #symbol])
(define-type hashtag-t [#atom #hashtag])
(define-type void-t [#atom #void])
(define-type null-t [#atom #null])
(define-type any-t [#any])
(define-type (list-t E) [#list E])
(define-type (set-t E) [#set E])
(define-type (record-t V) [#record V])
(define-type (hash-t K V) [#hash K V])

;; value

(claim any? (-> any-t bool-t))
(claim same? (-> any-t any-t bool-t))
(claim equal? (-> any-t any-t bool-t))
(claim hash-code (-> any-t int-t))
(claim total-compare (-> any-t any-t int-t))

;; assert

(claim assert (-> bool-t void-t))
(claim assert-not (-> bool-t void-t))
(claim assert-equal (-> any-t any-t void-t))
(claim assert-not-equal (-> any-t any-t void-t))

;; console

(claim print (-> any-t void-t))
(claim println (-> any-t void-t))
(claim write (-> string-t void-t))
(claim newline (-> void-t))

;; bool

(claim true bool-t)
(claim false bool-t)
(claim bool? (-> any-t bool-t))
(claim not (-> bool-t bool-t))

;; null

(claim null null-t)
(claim null? (-> any-t bool-t))

;; void

(claim void void-t)
(claim void? (-> any-t bool-t))

;; int

(claim int? (-> any-t bool-t))
(claim int-positive? (-> int-t bool-t))
(claim int-non-negative? (-> int-t bool-t))
(claim int-non-zero? (-> int-t bool-t))
(claim ineg (-> int-t int-t))
(claim iadd (-> int-t int-t int-t))
(claim isub (-> int-t int-t int-t))
(claim imul (-> int-t int-t int-t))
(claim idiv (-> int-t int-t int-t))
(claim imod (-> int-t int-t int-t))
(claim int-max (-> int-t int-t int-t))
(claim int-min (-> int-t int-t int-t))
(claim int-greater? (-> int-t int-t bool-t))
(claim int-less? (-> int-t int-t bool-t))
(claim int-greater-or-equal? (-> int-t int-t bool-t))
(claim int-less-or-equal? (-> int-t int-t bool-t))

;; float

(claim float? (-> any-t bool-t))
(claim fneg (-> float-t float-t))
(claim fadd (-> float-t float-t float-t))
(claim fsub (-> float-t float-t float-t))
(claim fmul (-> float-t float-t float-t))
(claim fdiv (-> float-t float-t float-t))
(claim fmod (-> float-t float-t float-t))
(claim float-max (-> float-t float-t float-t))
(claim float-min (-> float-t float-t float-t))
(claim float-greater? (-> float-t float-t bool-t))
(claim float-less? (-> float-t float-t bool-t))
(claim float-greater-or-equal? (-> float-t float-t bool-t))
(claim float-small-or-equal? (-> float-t float-t bool-t))

;; random

(claim random-int (-> int-t int-t int-t))
(claim random-float (-> float-t float-t float-t))
(claim random-dice (-> int-t))

;; hashtag

(claim hashtag? (-> any-t bool-t))
(claim hashtag-to-string (-> hashtag-t string-t))
(claim hashtag-append (-> hashtag-t hashtag-t hashtag-t))

;; symbol

(claim symbol? (-> any-t bool-t))
(claim symbol-length (-> symbol-t int-t))
(claim symbol-to-string (-> symbol-t string-t))
(claim symbol-append (-> symbol-t symbol-t symbol-t))
(claim symbol-concat (-> (list-t symbol-t) symbol-t))

;; string

(claim string? (-> any-t bool-t))
(claim string-length (-> string-t int-t))
(claim string-to-symbol (-> string-t symbol-t))
(claim string-append (-> string-t string-t string-t))
(claim string-concat (-> (list-t string-t) string-t))
(claim string-join (-> string-t (list-t string-t) string-t))
(claim string-split (-> string-t string-t (list-t string-t)))
(claim string-lines (-> string-t (list-t string-t)))
(claim string-chars (-> string-t (list-t string-t)))
(claim string-replace-first (-> string-t string-t string-t string-t))
(claim string-replace (-> string-t string-t string-t string-t))
(claim string-compare-lexical (-> string-t string-t int-t))

;; list

(claim make-list (polymorphic (E) (-> (list-t E))))
(claim car (polymorphic (E) (-> (list-t E) E)))
(claim cdr (polymorphic (E) (-> (list-t E) (list-t E))))
(claim cons (polymorphic (E) (-> E (list-t E) (list-t E))))
(claim list-head (polymorphic (E) (-> (list-t E) E)))
(claim list-tail (polymorphic (E) (-> (list-t E) (list-t E))))
(claim list-init (polymorphic (E) (-> (list-t E) (list-t E))))
(claim list-last (polymorphic (E) (-> (list-t E) E)))
(claim list-length (polymorphic (E) (-> (list-t E) int-t)))
(claim list-empty? (polymorphic (E) (-> (list-t E) bool-t)))
(claim list-copy (polymorphic (E) (-> (list-t E) (list-t E))))
;; (claim list-get (polymorphic (E) (-> int-t (list-t E) (optional-t E))))
(claim list-get (polymorphic (E) (-> int-t (list-t E) E)))
(claim list-put (polymorphic (E) (-> int-t E (list-t E) (list-t E))))
(claim list-put! (polymorphic (E) (-> int-t E (list-t E) (list-t E))))
(claim list-push (polymorphic (E) (-> E (list-t E) (list-t E))))
(claim list-push! (polymorphic (E) (-> E (list-t E) (list-t E))))
(claim list-pop! (polymorphic (E) (-> (list-t E) E)))
(claim list-shift! (polymorphic (E) (-> (list-t E) E)))
(claim list-unshift! (polymorphic (E) (-> E (list-t E) (list-t E))))
(claim list-reverse (polymorphic (E) (-> (list-t E) (list-t E))))
(claim list-to-set (polymorphic (E) (-> (list-t E) (set-t E))))

;; record

(claim make-record (polymorphic (V) (-> (record-t V))))
(claim record-length (polymorphic (V) (-> (record-t V) int-t)))
(claim record-keys (polymorphic (V) (-> (record-t V) (list-t symbol-t))))
(claim record-values (polymorphic (V) (-> (record-t V) (list-t V))))
;; (claim record-entries (polymorphic (V) (-> (record-t V) (list-t (tau symbol-t V)))))
(claim record-append (polymorphic (V) (-> (record-t V) (record-t V) (record-t V))))
(claim record-copy (polymorphic (V) (-> (record-t V) (record-t V))))
(claim record-empty? (polymorphic (V) (-> (record-t V) bool-t)))
;; (claim record-get (polymorphic (V) (-> symbol-t (record-t V) (optional-t V))))
(claim record-get (polymorphic (V) (-> symbol-t (record-t V) V)))
(claim record-has? (polymorphic (V) (-> symbol-t (record-t V) bool-t)))
(claim record-put (polymorphic (V) (-> symbol-t V (record-t V) (record-t V))))
(claim record-put! (polymorphic (V) (-> symbol-t V (record-t V) (record-t V))))
(claim record-delete (polymorphic (V) (-> symbol-t (record-t V) (record-t V))))
(claim record-delete! (polymorphic (V) (-> symbol-t (record-t V) (record-t V))))

;; set

(claim make-set (polymorphic (E) (-> (set-t E))))
(claim set-copy (polymorphic (E) (-> (set-t E) (set-t E))))
(claim set-size (polymorphic (E) (-> (set-t E) int-t)))
(claim set-empty? (polymorphic (E) (-> (set-t E) bool-t)))
(claim set-member? (polymorphic (E) (-> E (set-t E) bool-t)))
(claim set-subset? (polymorphic (E) (-> (set-t E) (set-t E) bool-t)))
(claim set-to-list (polymorphic (E) (-> (set-t E) (list-t E))))
(claim set-add (polymorphic (E) (-> E (set-t E) (set-t E))))
(claim set-add! (polymorphic (E) (-> E (set-t E) (set-t E))))
(claim set-delete (polymorphic (E) (-> E (set-t E) (set-t E))))
(claim set-delete! (polymorphic (E) (-> E (set-t E) (set-t E))))
(claim set-clear! (polymorphic (E) (-> (set-t E) (set-t E))))
(claim set-union (polymorphic (E) (-> (set-t E) (set-t E) (set-t E))))
(claim set-inter (polymorphic (E) (-> (set-t E) (set-t E) (set-t E))))
(claim set-difference (polymorphic (E) (-> (set-t E) (set-t E) (set-t E))))
(claim set-disjoint? (polymorphic (E) (-> (set-t E) (set-t E) bool-t)))
(claim set-map (polymorphic (E1 E2) (-> (-> E1 E2) (set-t E1) (set-t E2))))
(claim set-each (polymorphic (E) (-> (-> E any-t) (set-t E) void-t)))

;; hash

(claim make-hash (polymorphic (K V) (-> (hash-t K V))))
(claim hash-empty? (polymorphic (K V) (-> (hash-t K V) bool-t)))
(claim hash-length (polymorphic (K V) (-> (hash-t K V) int-t)))
(claim hash-get (polymorphic (K V) (-> K (hash-t K V) V)))
(claim hash-has? (polymorphic (K V) (-> K (hash-t K V) bool-t)))
(claim hash-put (polymorphic (K V) (-> K V (hash-t K V) (hash-t K V))))
(claim hash-put! (polymorphic (K V) (-> K V (hash-t K V) (hash-t K V))))
(claim hash-delete! (polymorphic (K V) (-> K (hash-t K V) (hash-t K V))))
(claim hash-copy (polymorphic (K V) (-> (hash-t K V) (hash-t K V))))
;; (claim hash-entries (polymorphic (K V) (-> (hash-t K V) (list-t (tau K V)))))
(claim hash-keys (polymorphic (K V) (-> (hash-t K V) (list-t K))))
(claim hash-values (polymorphic (K V) (-> (hash-t K V) (list-t V))))
