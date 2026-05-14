---
title: atom?
---

# 类型

```scheme
(polymorphic (A) (-> A bool-t))
```

# 描述

判断一个值是否为原子（非列表值）。

# 例子

```scheme
(atom? 42)       ;; => true
(atom? "hello")  ;; => true
(atom? [1 2 3])  ;; => false
```
