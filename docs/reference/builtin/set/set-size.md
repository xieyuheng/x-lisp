---
title: set-size
---

# 类型

```scheme
(polymorphic (E) (-> (set-t E) int-t))
```

# 描述

返回集合中元素的个数。

# 例子

```scheme
(set-size #{1 2 3})  ;; => 3
(set-size #{})       ;; => 0
```
