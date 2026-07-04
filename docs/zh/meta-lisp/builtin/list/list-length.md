---
title: list-length
---

# 类型

```scheme
(polymorphic (E) (-> (list-t E) int-t))
```

# 描述

返回列表中元素的个数。

# 例子

```scheme
(list-length [1 2 3])  ;; => 3
(list-length [])       ;; => 0
```
