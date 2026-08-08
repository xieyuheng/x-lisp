---
title: drop
---

# Type

```meta-lisp
(all (A B C)
  (-> (-> A B)
      (-> C A B)))
```

# Description

Create a new function that ignores the first argument.

# Examples

```meta-lisp
(define (greet name) (println (text-append "Hello, " name)))
((drop greet) "ignored" "World")  ;; prints "Hello, World"
```
