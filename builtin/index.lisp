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

(claim car (polymorphic (A) (-> (list? A) A)))
(claim cdr (polymorphic (A) (-> (list? A) (list? A))))
(claim cons (polymorphic (A) (-> A (list? A) (list? A))))
(claim list-head (polymorphic (A) (-> (list? A) A)))
(claim list-tail (polymorphic (A) (-> (list? A) (list? A))))
(claim list-init (polymorphic (A) (-> (list? A) (list? A))))
(claim list-last (polymorphic (A) (-> (list? A) A)))
(claim list-length (polymorphic (A) (-> (list? A) int?)))
(claim list-copy (polymorphic (A) (-> (list? A) (list? A))))
(claim list-get (polymorphic (A) (-> int? (list? A) (optional? A))))
(claim list-put (polymorphic (A) (-> int? A (list? A) (list? A))))
(claim list-put! (polymorphic (A) (-> int? A (list? A) (list? A))))
(claim list-push (polymorphic (A) (-> A (list? A) (list? A))))
(claim list-push! (polymorphic (A) (-> A (list? A) (list? A))))
(claim list-pop! (polymorphic (A) (-> (list? A) A)))
(claim list-shift! (polymorphic (A) (-> (list? A) A)))
(claim list-unshift! (polymorphic (A) (-> A (list? A) (list? A))))
(claim list-reverse (polymorphic (A) (-> (list? A) (list? A))))
(claim list-to-set (polymorphic (A) (-> (list? A) (set? A))))
(claim list-sort! (polymorphic (A) (-> (-> A A sort-order?) (list? A) (list? A))))
(claim list-sort (polymorphic (A) (-> (-> A A sort-order?) (list? A) (list? A))))
