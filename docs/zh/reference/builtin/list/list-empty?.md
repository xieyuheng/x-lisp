---
title: list-empty?
---

# 类型

```scheme
(polymorphic (E) (-> (list-t E) bool-t))
```

# 描述

判断列表是否为空。

# 例子

```scheme
(list-empty? [])       ;; => true
(list-empty? [1 2 3])  ;; => false
```
