---
title: keyword-append
---

# 类型

```scheme
(-> keyword-t keyword-t keyword-t)
```

# 描述

拼接两个关键字，生成一个新关键字。

# 例子

```scheme
(keyword-append :foo :bar)  ;; => :foobar
(keyword-append :a :b)      ;; => :ab
```
