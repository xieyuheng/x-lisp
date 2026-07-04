---
title: list-pop!
---

# Type

```meta-lisp
(polymorphic (E) (-> (list-t E) E))
```

# Description

Pop the last element from the list.

# Examples

```meta-lisp
(list-pop! [1 2 3])  ;; => 3
(list-pop! [1])      ;; => 1
```
