;; bool

(claim not (-> bool? bool?))

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
(claim int-compare-ascending (-> int? int? sort-order?))
(claim int-compare-descending (-> int? int? sort-order?))

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
(claim float-compare-ascending (-> float? float? sort-order?))
(claim float-compare-descending (-> float? float? sort-order?))

;; symbol

(claim symbol-length (-> symbol? int?))
(claim symbol-to-string (-> symbol? string?))
(claim symbol-append (-> symbol? symbol? symbol?))
(claim symbol-concat (-> (list? symbol?) symbol?))

;; string

(claim string-length (-> string? int?))
(claim string-to-symbol (-> string? symbol?))
(claim string-append (-> string? string? string?))
(claim string-concat (-> (list? string?) string?))
(claim string-join (-> string? (list? string?) string?))
(claim string-chars (-> string? (list? string?)))
(claim string-replace-first (-> string? string? string? string?))
(claim string-replace (-> string? string? string? string?))
(claim string-compare-lexical (-> string? string? int?))

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

;; sexp

(claim parse-sexp (-> string? sexp?))
(claim parse-sexps (-> string? (list? sexp?)))
(claim format-sexp (-> sexp? string?))

;; file

(claim file-exists? (-> string? bool?))
(claim file-size (-> string? int?))
(claim file-load (-> string? string?))
(claim file-save (-> string? string? void?))
(claim file-delete (-> string? void?))
(claim file-directory (-> string? string?))
(claim directory-exists? (-> string? bool?))
(claim directory-create (-> string? void?))
(claim directory-create-recursively (-> string? void?))
(claim directory-delete (-> string? void?))
(claim directory-delete-recursively (-> string? void?))
(claim directory-files (-> string? (list? string?)))
(claim directory-files-recursively (-> string? (list? string?)))
(claim directory-directories (-> string? (list? string?)))
(claim directory-directories-recursively (-> string? (list? string?)))

;; path

(claim path-join (-> (list? string?) string?))

;; process

(claim current-working-directory (-> string?))
(claim current-command-line-args (-> sexp?))

;; console

(claim print (-> anything? void?))
(claim println (-> anything? void?))
(claim write (-> string? void?))
(claim writeln (-> string? void?))

;; format

(claim format (-> anything? string?))
(claim format-subscript (-> int-non-negative? string?))
(claim format-superscript (-> int-non-negative? string?))
(claim format-left-margin (-> string? string? string?))

;; random

(claim random-int (-> int? int? int?))
(claim random-float (-> float? float? float?))

;; system

(claim system-shell-run
  (-> string? (list? string?)
      (tau :exit-code int-non-negative?
           :stdout string?
           :stderr string?)))

;; set

(claim set-empty? (polymorphic (E) (-> (set? E) bool?)))
(claim set-size (polymorphic (E) (-> (set? E) int?)))
(claim set-member? (polymorphic (E) (-> E (set? E) bool?)))
(claim set-include? (polymorphic (E) (-> (set? E) (set? E) bool?)))
(claim set-to-list (polymorphic (E) (-> (set? E) (list? E))))
(claim set-add (polymorphic (E) (-> E (set? E) (set? E))))
(claim set-add! (polymorphic (E) (-> E (set? E) (set? E))))
(claim set-delete (polymorphic (E) (-> E (set? E) (set? E))))
(claim set-delete! (polymorphic (E) (-> E (set? E) (set? E))))
(claim set-clear! (polymorphic (E) (-> (set? E) (set? E))))
(claim set-union (polymorphic (E) (-> (set? E) (set? E) (set? E))))
(claim set-inter (polymorphic (E) (-> (set? E) (set? E) (set? E))))
(claim set-difference (polymorphic (E) (-> (set? E) (set? E) (set? E))))
(claim set-disjoint? (polymorphic (E) (-> (set? E) (set? E) bool?)))
(claim set-map (polymorphic (E1 E2) (-> (-> E1 E2) (set? E1) (set? E2))))
(claim set-each (polymorphic (E) (-> (-> E anything?) (set? E) void?)))

;; hashtag

(claim hashtag-string (-> hashtag? string?))

;; hash

(claim hash-empty? (polymorphic (K V) (-> (hash? K V) bool?)))
(claim hash-length (polymorphic (K V) (-> (hash? K V) int?)))
(claim hash-get (polymorphic (K V) (-> K (hash? K V) V)))
(claim hash-has? (polymorphic (K V) (-> K (hash? K V) bool?)))
(claim hash-put (polymorphic (K V) (-> K V (hash? K V) (hash? K V))))
(claim hash-put! (polymorphic (K V) (-> K V (hash? K V) (hash? K V))))
(claim hash-delete! (polymorphic (K V) (-> K (hash? K V) (hash? K V))))
(claim hash-copy (polymorphic (K V) (-> (hash? K V) (hash? K V))))
(claim hash-entries (polymorphic (K V) (-> (hash? K V) (list? (tau K V)))))
(claim hash-keys (polymorphic (K V) (-> (hash? K V) (list? K))))
(claim hash-values (polymorphic (K V) (-> (hash? K V) (list? V))))
