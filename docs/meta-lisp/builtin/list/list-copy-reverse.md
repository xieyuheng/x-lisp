---
title: list-copy-reverse
---

# Type

```meta-lisp
(all (E) (-> (list-t E) (list-t E)))
```

# Description

Reverse the list.

# Examples

```meta-lisp
(list-copy-reverse (@list 1 2 3))  ;; => (@list 3 2 1)
(list-copy-reverse (@list))       ;; => (@list)
```
