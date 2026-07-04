---
title: keyword-concat
---

# Type

```meta-lisp
(-> (list-t keyword-t) keyword-t)
```

# Description

Concatenate a list of keywords, creating a new keyword.

# Examples

```meta-lisp
(keyword-concat [:foo :bar :baz])  ;; => ':foobarbaz
(keyword-concat [:a :b])           ;; => ':ab
```
