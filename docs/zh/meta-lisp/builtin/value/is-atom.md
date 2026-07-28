---
title: is-atom
---

# 类型

```meta-lisp
(polymorphic (A) (-> A bool-t))
```

# 描述

判断一个值是否为原子（非列表值）。

# 例子

```meta-lisp
(is-atom 42)       ;; => true
(is-atom "hello")  ;; => true
(is-atom [1 2 3])  ;; => false
```
