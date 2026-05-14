---
title: located-sexp-t
---

# Type

Algebraic data type. Represents a located S-expression with source location.

# Variants

```scheme
(symbol-sexp  (content symbol-t)   (location source-location-t))
(keyword-sexp (content keyword-t)  (location source-location-t))
(string-sexp  (content string-t)   (location source-location-t))
(int-sexp     (content int-t)      (location source-location-t))
(float-sexp   (content float-t)    (location source-location-t))
(list-sexp    (elements (list-t located-sexp-t))
               (location source-location-t))
```

# Generated

Each variant generates a constructor, predicate, accessor and modifier. For example `symbol-sexp`:

```scheme
(claim symbol-sexp  (-> symbol-t source-location-t located-sexp-t))
(claim symbol-sexp? (-> located-sexp-t bool-t))
(claim symbol-sexp-content  (-> located-sexp-t symbol-t))
(claim symbol-sexp-location (-> located-sexp-t source-location-t))
(claim symbol-sexp-put-content!  (-> symbol-t located-sexp-t located-sexp-t))
(claim symbol-sexp-put-location! (-> source-location-t located-sexp-t located-sexp-t))
```

Other variants are similar.

# Examples

```scheme
(symbol-sexp 'foo (make-source-location "test" ...))
(int-sexp 42 (make-source-location "test" ...))
```
