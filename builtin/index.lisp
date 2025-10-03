;; int

(claim int-positive? (-> int? bool?))
(claim int-non-negative? (-> int? bool?))
(claim int-non-zero? (-> int? bool?))
(claim ineg (-> int? int?))
(claim iadd (-> int? int? int?))
(claim isub (-> int? int? int?))
(claim imul (-> int? int? int?))
(claim idiv (-> int? int-non-zero? int?))
(claim imod (-> int? int-non-zero? int?))
(claim int-max (-> int? int? int?))
(claim int-min (-> int? int? int?))
(claim int-larger? (-> int? int? bool?))
(claim int-smaller? (-> int? int? bool?))
(claim int-larger-or-equal? (-> int? int? bool?))
(claim int-smaller-or-equal? (-> int? int? bool?))
(claim int-compare/ascending (-> int? int? sort-order?))
(claim int-compare/descending (-> int? int? sort-order?))

;; float

(claim fneg (-> float? float?))
(claim fadd (-> float? float? float?))
(claim fsub (-> float? float? float?))
(claim fmul (-> float? float? float?))
(claim fdiv (-> float? float-non-zero? float?))
(claim float-max (-> float? float? float?))
(claim float-min (-> float? float? float?))
(claim float-larger? (-> float? float? bool?))
(claim float-smaller? (-> float? float? bool?))
(claim float-larger-or-equal? (-> float? float? bool?))
(claim float-small-or-equal? (-> float? float? bool?))
(claim float-compare/ascending (-> float? float? sort-order?))
(claim float-compare/descending (-> float? float? sort-order?))

;; symbol

(claim symbol-length (-> symbol? int?))
(claim symbol-to-string (-> symbol? string?))
(claim symbol-append (-> symbol? symbol? symbol?))
(claim symbol-append-many (-> (list? symbol?) symbol?))

;; string

(claim string-length (-> string? int?))
(claim string-to-symbol (-> string? symbol?))
(claim string-append (-> string? string? string?))
(claim string-append-many (-> (list? string?) string?))
(claim string-join (-> string? (list? string?) string?))
(claim string-chars (-> string? (list? string?)))
(claim string-replace-first (-> string? string? string? string?))
(claim string-replace (-> string? string? string? string?))
(claim string-compare/lexical (-> string? string? int?))

;; sort-order

(claim sort-order-reverse
  (polymorphic (A)
    (-> (-> A A sort-order?) (-> A A sort-order?))))
(claim sort-order-negate (-> sort-order? sort-order?))

;; list

(claim car (polymorphic (E) (-> (list? E) E)))
(claim cdr (polymorphic (E) (-> (list? E) (list? E))))
(claim cons (polymorphic (E) (-> E (list? E) (list? E))))
(claim list-head (polymorphic (E) (-> (list? E) E)))
(claim list-tail (polymorphic (E) (-> (list? E) (list? E))))
(claim list-init (polymorphic (E) (-> (list? E) (list? E))))
(claim list-last (polymorphic (E) (-> (list? E) E)))
(claim list-length (polymorphic (E) (-> (list? E) int?)))
(claim list-copy (polymorphic (E) (-> (list? E) (list? E))))
(claim list-get (polymorphic (E) (-> int? (list? E) (optional? E))))
(claim list-put (polymorphic (E) (-> int? E (list? E) (list? E))))
(claim list-put! (polymorphic (E) (-> int? E (list? E) (list? E))))
(claim list-push (polymorphic (E) (-> E (list? E) (list? E))))
(claim list-push! (polymorphic (E) (-> E (list? E) (list? E))))
(claim list-pop! (polymorphic (E) (-> (list? E) E)))
(claim list-shift! (polymorphic (E) (-> (list? E) E)))
(claim list-unshift! (polymorphic (E) (-> E (list? E) (list? E))))
(claim list-reverse (polymorphic (E) (-> (list? E) (list? E))))
(claim list-to-set (polymorphic (E) (-> (list? E) (set? E))))
(claim list-sort! (polymorphic (E) (-> (-> E E sort-order?) (list? E) (list? E))))
(claim list-sort (polymorphic (E) (-> (-> E E sort-order?) (list? E) (list? E))))

;; record

(claim record-length (polymorphic (V) (-> (record? V) int?)))
(claim record-keys (polymorphic (V) (-> (record? V) (list? symbol?))))
(claim record-values (polymorphic (V) (-> (record? V) (list? V))))
(claim record-entries (polymorphic (V) (-> (record? V) (list? (tau symbol? V)))))
(claim record-append (polymorphic (V) (-> (record? V) (record? V) (record? V))))
(claim record-copy (polymorphic (V) (-> (record? V) (record? V))))
(claim record-empty? (polymorphic (V) (-> (record? V) bool?)))
(claim record-get (polymorphic (V) (-> symbol? (record? V) (optional? V))))
(claim record-has? (polymorphic (V) (-> symbol? (record? V) bool?)))
(claim record-put (polymorphic (V) (-> symbol? V (record? V) (record? V))))
(claim record-put! (polymorphic (V) (-> symbol? V (record? V) (record? V))))
(claim record-delete (polymorphic (V) (-> symbol? (record? V) (record? V))))
(claim record-delete! (polymorphic (V) (-> symbol? (record? V) (record? V))))

;; schema

(claim negate (polymorphic (A) (-> (-> A bool?) (-> A bool?))))
;; (claim union-fn (polymorphic (A) (-> (list-of (-> A bool?)) (-> A bool?))))
;; (claim inter-fn (polymorphic (A) (-> (list-of (-> A bool?)) (-> A bool?))))

;; sexp

(claim parse-sexp (-> string? sexp?))
(claim parse-sexps (-> string? (list? sexp?)))
(claim format-sexp (-> sexp? string?))
