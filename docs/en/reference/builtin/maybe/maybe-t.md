---
title: maybe-t
---

# Type

```scheme
(-> type-t type-t)
```

# Description

Maybe type constructor. `(maybe-t A)` represents a value of type `A` that may or may not exist. Use `(just value)` to construct a present value and `nothing` to represent absence.

# Generated

## Constructor

```scheme
(claim just  (polymorphic (A) (-> A (maybe-t A))))
(claim nothing (polymorphic (A) (-> (maybe-t A))))
```

## Predicate

```scheme
(claim just?    (polymorphic (A) (-> (maybe-t A) bool-t)))
(claim nothing? (polymorphic (A) (-> (maybe-t A) bool-t)))
```

## Accessor

```scheme
(claim just-value (polymorphic (A) (-> (maybe-t A) A)))
```

## Modifier

```scheme
(claim just-put-value! (polymorphic (A) (-> A (maybe-t A) (maybe-t A))))
```

# Examples

```scheme
(define x (just 42))
(just? x)          ;; => true
(nothing? x)       ;; => false
(just-value x)     ;; => 42
```
