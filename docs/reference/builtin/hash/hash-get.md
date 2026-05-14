---
title: hash-get
---

# 类型

```scheme
(polymorphic (K V) (-> K (hash-t K V) V))
```

# 描述

根据键获取值。键不存在时报错。

# 例子

```scheme
(hash-get "a" (@hash "a" 1 "b" 2))  ;; => 1
```
