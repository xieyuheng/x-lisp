---
title: pair-t
---

# Type

```scheme
(-> type-t type-t type-t)
```

# Description

Pair type constructor. `(pair-t A B)` represents a pair containing values of types `A` and `B`.

# Generated

## Constructor

```scheme
(claim make-pair (polymorphic (A B) (-> A B (pair-t A B))))
```

## Predicate

```scheme
(claim pair? (polymorphic (A) (-> A bool-t)))
```

## Accessor

```scheme
(claim pair-first  (polymorphic (A B) (-> (pair-t A B) A)))
(claim pair-second (polymorphic (A B) (-> (pair-t A B) B)))
```

## Modifier

```scheme
(claim pair-put-first!  (polymorphic (A B) (-> A (pair-t A B) (pair-t A B))))
(claim pair-put-second! (polymorphic (A B) (-> B (pair-t A B) (pair-t A B))))
```

# Examples

```scheme
(= p (make-pair 1 "hello"))
(pair-first p)   ;; => 1
(pair-second p)  ;; => "hello"
```
