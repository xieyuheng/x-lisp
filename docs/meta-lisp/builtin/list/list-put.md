---
title: list-put
---

# Type

```meta-lisp
(all (E) (-> int-t E (list-t E) (list-t E)))
```

# Description

Set element by index, same behavior as `list-copy-put`.

# Examples

```meta-lisp
(list-put 0 10 [1 2 3])  ;; => [10 2 3]
```
