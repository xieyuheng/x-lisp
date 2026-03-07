;; type

(define bool-t ['atom 'bool])
(define int-t ['atom 'int])
(define float-t ['atom 'float])
(define string-t ['atom 'string])
(define symbol-t ['atom 'symbol])
(define keyword-t ['atom 'keyword])
(define void-t ['atom 'void])
(define any-t ['any])
(define (list-t E) ['list E])
(define (set-t E) ['set E])
(define (hash-t K V) ['hash K V])

(exempt
  bool-t
  int-t
  float-t
  string-t
  symbol-t
  keyword-t
  void-t
  any-t
  list-t
  set-t
  hash-t)

;; value

(claim any? (polymorphic (X) (-> X bool-t)))
(claim same? (polymorphic (X) (-> X X bool-t)))
(claim equal? (polymorphic (X) (-> X X bool-t)))

;; assert

(claim assert (-> bool-t void-t))
(claim assert-not (-> bool-t void-t))
(claim assert-equal (polymorphic (X) (-> X X void-t)))
(claim assert-not-equal (polymorphic (X) (-> X X void-t)))

;; console

(claim print (polymorphic (X) (-> X void-t)))
(claim println (polymorphic (X) (-> X void-t)))
(claim write (-> string-t void-t))
(claim newline (-> void-t))

;; bool

(claim true bool-t)
(claim false bool-t)
(claim bool? (polymorphic (X) (-> X bool-t)))
(claim not (-> bool-t bool-t))

;; void

(claim void void-t)
(claim void? (polymorphic (X) (-> X bool-t)))

;; int

(claim int? (polymorphic (X) (-> X bool-t)))
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
(claim int-compare-ascending (-> int-t int-t int-t))
(claim int-compare-descending (-> int-t int-t int-t))

;; float

(claim float? (polymorphic (X) (-> X bool-t)))
(claim float-positive? (-> float-t bool-t))
(claim float-non-negative? (-> float-t bool-t))
(claim float-non-zero? (-> float-t bool-t))
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
(claim float-less-or-equal? (-> float-t float-t bool-t))
(claim float-compare-ascending (-> float-t float-t int-t))
(claim float-compare-descending (-> float-t float-t int-t))

;; random

(claim random-int (-> int-t int-t int-t))
(claim random-float (-> float-t float-t float-t))
(claim random-dice (-> int-t))

;; keyword

(claim keyword? (polymorphic (X) (-> X bool-t)))
(claim keyword-to-string (-> keyword-t string-t))
(claim keyword-append (-> keyword-t keyword-t keyword-t))

;; symbol

(claim symbol? (polymorphic (X) (-> X bool-t)))
(claim symbol-length (-> symbol-t int-t))
(claim symbol-to-string (-> symbol-t string-t))
(claim symbol-append (-> symbol-t symbol-t symbol-t))
(claim symbol-concat (-> (list-t symbol-t) symbol-t))

;; string

(claim string? (polymorphic (X) (-> X bool-t)))
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
(claim hash-entries (polymorphic (K V) (-> (hash-t K V) (list-t (tau K V)))))
(claim hash-keys (polymorphic (K V) (-> (hash-t K V) (list-t K))))
(claim hash-values (polymorphic (K V) (-> (hash-t K V) (list-t V))))
