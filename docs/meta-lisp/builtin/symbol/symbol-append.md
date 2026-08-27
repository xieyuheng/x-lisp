---
title: symbol-append
---

# Type

```meta-lisp
(-> symbol-t symbol-t symbol-t)
```

# Description

Concatenate two symbols, creating a new symbol.

# Examples

```meta-lisp
(symbol-append 'foo 'bar)  ;; => 'foobar
(symbol-append 'a 'b)      ;; => 'ab
```
