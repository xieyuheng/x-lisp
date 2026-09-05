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
(symbol-concat (@list 'foo 'bar 'baz))  ;; => 'foobarbaz
(symbol-concat (@list))                ;; => ''
(symbol-concat (@list 'a 'b))           ;; => 'ab
```
