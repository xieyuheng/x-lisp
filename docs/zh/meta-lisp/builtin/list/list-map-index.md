---
title: list-map-index
---

# 类型

```scheme
(polymorphic (A B) (-> (-> int-t A B) (list-t A) (list-t B)))
```

# 描述

对列表中的每个元素应用带索引的函数，返回结果列表。

# 例子

```scheme
(list-map-index (lambda (i x) (iadd i x)) [10 20 30])  ;; => [10 21 32]
(list-map-index (lambda (i _) i) ['a 'b 'c])            ;; => [0 1 2]
```
