---
title: is-list
---

# 类型

```meta-lisp
(polymorphic (A) (-> A bool-t))
```

# 描述

判断一个值是否为列表。

# 例子

```meta-lisp
(is-list [1 2 3])  ;; => true
(is-list "hello")  ;; => false
(is-list 42)       ;; => false
```
