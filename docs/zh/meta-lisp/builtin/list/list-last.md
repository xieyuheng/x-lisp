---
title: list-last
---

# 类型

```scheme
(polymorphic (E) (-> (list-t E) E))
```

# 描述

取列表的最后一个元素。

# 例子

```scheme
(list-last [1 2 3])  ;; => 3
(list-last [1])      ;; => 1
```
