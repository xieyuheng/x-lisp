---
title: list-to-set
---

# 类型

```scheme
(polymorphic (E) (-> (list-t E) (set-t E)))
```

# 描述

将列表转为集合，重复元素会被去重。

# 例子

```scheme
(list-to-set [1 2 2 3])  ;; => #{1 2 3}
(list-to-set [])         ;; => #{}
```
