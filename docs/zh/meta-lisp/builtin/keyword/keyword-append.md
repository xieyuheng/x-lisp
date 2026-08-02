---
title: keyword-append
---

# 类型

```meta-lisp
(-> keyword-t keyword-t keyword-t)
```

# 描述

追加一个关键字，生成一个新关键字。

# 例子

```meta-lisp
(keyword-append :foo :bar)  ;; => :foobar
(keyword-append :a :b)      ;; => :ab
```
