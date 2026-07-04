---
title: assert-not-equal
---

# 类型

```meta-lisp
(polymorphic (A B) (-> A B void-t))
```

# 描述

断言两个值不相等。如果相等，则报错。

# 例子

```meta-lisp
(assert-not-equal 1 2)
(assert-not-equal "a" "b")
```
