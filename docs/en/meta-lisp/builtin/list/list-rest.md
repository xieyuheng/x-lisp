---
title: list-rest
---

# Type

```meta-lisp
(all (E) (-> (list-t E) (list-t E)))
```

# Description

Rest of the list after removing the first element, same as `cdr`.

# Examples

```meta-lisp
(list-rest [1 2 3])  ;; => [2 3]
```
