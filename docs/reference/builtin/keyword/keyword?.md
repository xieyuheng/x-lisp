---
title: keyword?
---

# 类型

```scheme
(polymorphic (A) (-> A bool-t))
```

# 描述

判断一个值是否为关键字。

# 例子

```scheme
(keyword? :key)    ;; => true
(keyword? 'key)    ;; => false
(keyword? "key")   ;; => false
```
