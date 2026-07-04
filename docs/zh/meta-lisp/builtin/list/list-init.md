---
title: list-init
---

# 类型

```scheme
(polymorphic (E) (-> (list-t E) (list-t E)))
```

# 描述

取列表中除最后一个元素外的所有元素。

# 例子

```scheme
(list-init [1 2 3])  ;; => [1 2]
(list-init [1])      ;; => []
```
