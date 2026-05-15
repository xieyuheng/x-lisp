---
title: hash-map-value
---

# 类型

```scheme
(polymorphic (K V1 V2) (-> (-> V1 V2) (hash-t K V1) (hash-t K V2)))
```

# 描述

对值应用函数，键保持不变。

# 例子

```scheme
(hash-map-value (iadd 1) (@hash 1 2 3 4))  ;; => (@hash 1 3 3 5)
```
