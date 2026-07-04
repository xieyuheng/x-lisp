---
title: keyword-concat
---

# Type

```scheme
(-> (list-t keyword-t) keyword-t)
```

# Description

Concatenate a list of keywords, creating a new keyword.

# Examples

```scheme
(keyword-concat [:foo :bar :baz])  ;; => ':foobarbaz
(keyword-concat [:a :b])           ;; => ':ab
```
