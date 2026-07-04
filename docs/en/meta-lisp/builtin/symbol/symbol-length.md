---
title: symbol-length
---

# Type

```scheme
(-> symbol-t int-t)
```

# Description

Return the length of the symbol name (in characters).

# Examples

```scheme
(symbol-length 'foo)      ;; => 3
(symbol-length 'hello)    ;; => 5
(symbol-length '+)        ;; => 1
```
