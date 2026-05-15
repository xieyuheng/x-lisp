---
title: hash-get-maybe
---

# 类型

```scheme
(polymorphic (K V) (-> K (hash-t K V) (maybe-t V)))
```

# 描述

按键查找，找到时返回 `(just V)`，未找到时返回 `nothing`。

# 例子

```scheme
(hash-get-maybe 2 (@hash 1 "a" 2 "b" 3 "c"))  ;; => (just "b")
(hash-get-maybe 4 (@hash 1 "a" 2 "b" 3 "c"))  ;; => nothing
```
