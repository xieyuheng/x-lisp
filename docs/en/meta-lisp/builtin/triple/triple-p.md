---
title: triple?
---

# Type

```scheme
(polymorphic (A) (-> A bool-t))
```

# Description

Check if a value is a triple.

# Examples

```scheme
(triple? (make-triple 1 2 3))  ;; => true
(triple? 42)                   ;; => false
```
