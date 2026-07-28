---
title: is-int
---

# 类型

```meta-lisp
(polymorphic (A) (-> A bool-t))
```

# 描述

判断一个值是否为整数。

# 例子

```meta-lisp
(is-int 42)      ;; => true
(is-int -1)      ;; => true
(is-int 3.14)    ;; => false
(is-int "foo")   ;; => false
```
