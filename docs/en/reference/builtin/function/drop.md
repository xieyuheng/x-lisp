---
title: drop
---

# Type

```scheme
(polymorphic (A B C)
  (-> (-> A B)
      (-> C A B)))
```

# Description

Create a new function that ignores the first argument. Derived function.

# Examples

```scheme
(define (greet name) (println (string-append "Hello, " name)))
((drop greet) "ignored" "World")  ;; prints "Hello, World"
```
