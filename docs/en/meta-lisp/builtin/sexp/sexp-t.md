---
title: sexp-t
---

# Type

```meta-lisp
type-t
```

# Description

Located S-expression type. Represents a parsed S-expression with source location.

# Definition

```meta-lisp
(define-enum sexp-t
  (symbol-sexp  (content symbol-t)            (location source-location-t))
  (keyword-sexp (content keyword-t)           (location source-location-t))
  (text-sexp  (content text-t)            (location source-location-t))
  (int-sexp     (content int-t)               (location source-location-t))
  (float-sexp   (content float-t)             (location source-location-t))
  (list-sexp    (elements (list-t sexp-t))
                (location source-location-t)))
```

# Generated

```meta-lisp
(claim symbol-sexp  (-> symbol-t source-location-t sexp-t))
(claim is-symbol-sexp (-> sexp-t bool-t))
(claim symbol-sexp-content  (-> sexp-t symbol-t))
(claim symbol-sexp-location (-> sexp-t source-location-t))
(claim symbol-sexp-put-content  (-> symbol-t sexp-t sexp-t))
(claim symbol-sexp-put-location (-> source-location-t sexp-t sexp-t))

(claim keyword-sexp  (-> keyword-t source-location-t sexp-t))
(claim is-keyword-sexp (-> sexp-t bool-t))
(claim keyword-sexp-content  (-> sexp-t keyword-t))
(claim keyword-sexp-location (-> sexp-t source-location-t))
(claim keyword-sexp-put-content  (-> keyword-t sexp-t sexp-t))
(claim keyword-sexp-put-location (-> source-location-t sexp-t sexp-t))

(claim text-sexp  (-> text-t source-location-t sexp-t))
(claim is-text-sexp (-> sexp-t bool-t))
(claim text-sexp-content  (-> sexp-t text-t))
(claim text-sexp-location (-> sexp-t source-location-t))
(claim text-sexp-put-content  (-> text-t sexp-t sexp-t))
(claim text-sexp-put-location (-> source-location-t sexp-t sexp-t))

(claim int-sexp  (-> int-t source-location-t sexp-t))
(claim is-int-sexp (-> sexp-t bool-t))
(claim int-sexp-content  (-> sexp-t int-t))
(claim int-sexp-location (-> sexp-t source-location-t))
(claim int-sexp-put-content  (-> int-t sexp-t sexp-t))
(claim int-sexp-put-location (-> source-location-t sexp-t sexp-t))

(claim float-sexp  (-> float-t source-location-t sexp-t))
(claim is-float-sexp (-> sexp-t bool-t))
(claim float-sexp-content  (-> sexp-t float-t))
(claim float-sexp-location (-> sexp-t source-location-t))
(claim float-sexp-put-content  (-> float-t sexp-t sexp-t))
(claim float-sexp-put-location (-> source-location-t sexp-t sexp-t))

(claim list-sexp  (-> (list-t sexp-t) source-location-t sexp-t))
(claim is-list-sexp (-> sexp-t bool-t))
(claim list-sexp-elements  (-> sexp-t (list-t sexp-t)))
(claim list-sexp-location (-> sexp-t source-location-t))
(claim list-sexp-put-elements  (-> (list-t sexp-t) sexp-t sexp-t))
(claim list-sexp-put-location (-> source-location-t sexp-t sexp-t))
```

# Examples

```meta-lisp
(symbol-sexp 'foo (make-source-location "test" ...))
(int-sexp 42 (make-source-location "test" ...))
```
