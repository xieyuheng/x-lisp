---
title: symbol-concat
---

# Type

```meta-lisp
(-> (list-t symbol-t) symbol-t)
```

# Description

Concatenate a list of symbols, creating a new symbol.

# Examples

```meta-lisp
(symbol-concat ['foo 'bar 'baz])  ;; => 'foobarbaz
(symbol-concat [])                ;; => ''
(symbol-concat ['a 'b])           ;; => 'ab
```
