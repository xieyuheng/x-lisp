---
title: hash-empty?
---

# 类型

```scheme
(polymorphic (K V) (-> (hash-t K V) bool-t))
```

# 描述

判断哈希表是否为空。

# 例子

```scheme
(hash-empty? (make-hash))     ;; => true
(hash-empty? (@hash 'a 1))    ;; => false
```
