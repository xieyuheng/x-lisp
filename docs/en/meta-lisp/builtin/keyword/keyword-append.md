---
title: keyword-append
---

# Type

```scheme
(-> keyword-t keyword-t keyword-t)
```

# Description

Concatenate two keywords, creating a new keyword.

# Examples

```scheme
(keyword-append :foo :bar)  ;; => :foobar
(keyword-append :a :b)      ;; => :ab
```
