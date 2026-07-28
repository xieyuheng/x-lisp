---
title: is-bool
---

# 类型

```meta-lisp
(polymorphic (A) (-> A bool-t))
```

# 描述

判断一个值是否为布尔值。

# 例子

```meta-lisp
(is-bool true)   ;; => true
(is-bool false)  ;; => true
(is-bool 42)     ;; => false
(is-bool "foo")  ;; => false
```
