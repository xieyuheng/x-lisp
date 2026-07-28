---
title: int-less-or-equal
---

# 类型

```meta-lisp
(-> int-t int-t bool-t)
```

# 描述

判断第一个整数是否小于或等于第二个。

# 例子

```meta-lisp
(int-less-or-equal 1 2)    ;; => true
(int-less-or-equal 1 1)    ;; => true
(int-less-or-equal 2 1)    ;; => false
```
