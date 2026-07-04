---
title: bool?
---

# 类型

```meta-lisp
(polymorphic (A) (-> A bool-t))
```

# 描述

判断一个值是否为布尔值。

# 例子

```meta-lisp
(bool? true)   ;; => true
(bool? false)  ;; => true
(bool? 42)     ;; => false
(bool? "foo")  ;; => false
```
