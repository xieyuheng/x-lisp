---
title: hash-map-key
---

# 类型

```scheme
(polymorphic (K1 K2 V) (-> (-> K1 K2) (hash-t K1 V) (hash-t K2 V)))
```

# 描述

对键应用函数，值保持不变。

# 例子

```scheme
(hash-map-key symbol->string (@hash 'a 1 'b 2))
;; => (@hash "a" 1 "b" 2)
```
