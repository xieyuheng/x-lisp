---
title: cdr
---

# Type

```meta-lisp
(all (E) (-> (list-t E) (list-t E)))
```

# Description

Rest of the list after removing the first element.

# Examples

```meta-lisp
(cdr [1 2 3])   ;; => [2 3]
(cdr [1])       ;; => []
```
