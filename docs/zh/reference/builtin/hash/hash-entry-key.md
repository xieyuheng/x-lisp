---
title: hash-entry-key
---

# 类型

```scheme
(polymorphic (K V) (-> (hash-entry-t K V) K))
```

# 描述

获取 entry 的键。

# 例子

```scheme
(hash-entry-key (make-hash-entry "a" 1))  ;; => "a"
```
