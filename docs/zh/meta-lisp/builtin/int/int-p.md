---
title: int?
---

# 类型

```meta-lisp
(polymorphic (A) (-> A bool-t))
```

# 描述

判断一个值是否为整数。

# 例子

```meta-lisp
(int? 42)      ;; => true
(int? -1)      ;; => true
(int? 3.14)    ;; => false
(int? "foo")   ;; => false
```
