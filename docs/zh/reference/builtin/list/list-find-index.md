---
title: list-find-index
---

# 类型

```scheme
(polymorphic (A) (-> (-> A bool-t) (list-t A) int-t))
```

# 描述

查找列表中第一个满足条件的元素的索引。不存在时返回 `-1`。

# 例子

```scheme
(list-find-index int? ['a 'b 3 'd])  ;; => 2
(list-find-index int? ['a 'b 'c])    ;; => -1
```
