---
title: array-each-index
---

# Type

```meta-lisp
(all (A Any) (-> (array-t A) (-> int-t A Any) void-t))
```

# Description

Iterate over the elements with index.

# Examples

```meta-lisp
(array-each-index
  (@array 'a 'b)
  (lambda (i x) (println (make-pair i x))))
```
