---
title: is-void
---

# Type

```meta-lisp
(all (A) (-> A bool-t))
```

# Description

Check if a value is `void`.

# Examples

```meta-lisp
(is-void void)    ;; => true
(is-void 42)      ;; => false
```
