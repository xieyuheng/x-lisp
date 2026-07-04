---
title: list-init
---

# 类型

```meta-lisp
(polymorphic (E) (-> (list-t E) (list-t E)))
```

# 描述

取列表中除最后一个元素外的所有元素。

# 例子

```meta-lisp
(list-init [1 2 3])  ;; => [1 2]
(list-init [1])      ;; => []
```
