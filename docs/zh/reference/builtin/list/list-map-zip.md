---
title: list-map-zip
---

# 类型

```scheme
(polymorphic (A B C) (-> (-> A B C) (list-t A) (list-t B) (list-t C)))
```

# 描述

将两个列表按对应位置元素合并。

# 例子

```scheme
(list-map-zip iadd [1 2 3] [10 20 30])  ;; => [11 22 33]
```
