---
title: box-t
---

# Type

```scheme
(polymorphic (E) (-> type-t type-t))
```

# Description

Type constructor for the opaque type `(box-t E)`. Internally represented as `(list-t E)`.

# Interface functions

## Constructor

```scheme
(claim make-box (polymorphic (E) (-> (box-t E))))
```

## Predicate

```scheme
(claim box-empty? (polymorphic (E) (-> (box-t E) bool-t)))
```

## Modifier

```scheme
(claim box-put! (polymorphic (E) (-> E (box-t E) (box-t E))))
```

## Accessors

```scheme
(claim box-get-maybe (polymorphic (E) (-> (box-t E) (maybe-t E))))
(claim box-get      (polymorphic (E) (-> (box-t E) E)))
```

# Examples

```scheme
(define box (make-box))
(box-empty? box)    ;; => true
(box-put! 42 box)
(box-empty? box)    ;; => false
(box-get-maybe box) ;; => (just 42)
(box-get box)       ;; => 42
```
