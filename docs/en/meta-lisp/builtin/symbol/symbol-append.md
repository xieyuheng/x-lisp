---
title: symbol-append
---

# Type

```scheme
(-> symbol-t symbol-t symbol-t)
```

# Description

Concatenate two symbols, creating a new symbol.

# Examples

```scheme
(symbol-append 'foo 'bar)  ;; => 'foobar
(symbol-append 'a 'b)      ;; => 'ab
```
