---
title: triple?
---

# Type

```meta-lisp
(polymorphic (A) (-> A bool-t))
```

# Description

Check if a value is a triple.

# Examples

```meta-lisp
(triple? (make-triple 1 2 3))  ;; => true
(triple? 42)                   ;; => false
```
