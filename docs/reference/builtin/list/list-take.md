---
title: list-take
---

# 类型

```scheme
(polymorphic (A) (-> int-t (list-t A) (list-t A)))
```

# 描述

取列表的前 `n` 个元素。`n` 大于列表长度时返回整个列表。派生函数。

# 例子

```scheme
(list-take 2 [1 2 3 4])  ;; => [1 2]
(list-take 0 [1 2 3])    ;; => []
(list-take 5 [1 2 3])    ;; => [1 2 3]
```
