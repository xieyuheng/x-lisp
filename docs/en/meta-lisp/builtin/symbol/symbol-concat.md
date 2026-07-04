---
title: symbol-concat
---

# Type

```scheme
(-> (list-t symbol-t) symbol-t)
```

# Description

Concatenate a list of symbols, creating a new symbol.

# Examples

```scheme
(symbol-concat ['foo 'bar 'baz])  ;; => 'foobarbaz
(symbol-concat [])                ;; => ''
(symbol-concat ['a 'b])           ;; => 'ab
```
