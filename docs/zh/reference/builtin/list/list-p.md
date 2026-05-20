---
title: list?
---

# 类型

```scheme
(polymorphic (A) (-> A bool-t))
```

# 描述

判断一个值是否为列表。

# 例子

```scheme
(list? [1 2 3])  ;; => true
(list? "hello")  ;; => false
(list? 42)       ;; => false
```
