---
title: assert-equal
---

# 类型

```meta-lisp
(polymorphic (A B) (-> A B void-t))
```

# 描述

断言两个值相等（使用 `equal` 比较）。如果不相等，则报错。

# 例子

```meta-lisp
(assert-equal 1 1)
(assert-equal "hello" "hello")
```
