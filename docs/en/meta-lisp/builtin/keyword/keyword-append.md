---
title: keyword-append
---

# Type

```meta-lisp
(-> keyword-t keyword-t keyword-t)
```

# Description

Concatenate two keywords, creating a new keyword.

# Examples

```meta-lisp
(keyword-append :foo :bar)  ;; => :foobar
(keyword-append :a :b)      ;; => :ab
```
