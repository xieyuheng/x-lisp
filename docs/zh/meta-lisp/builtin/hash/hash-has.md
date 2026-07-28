---
title: hash-has
---

# 类型

```meta-lisp
(polymorphic (K V) (-> K (hash-t K V) bool-t))
```

# 描述

判断哈希表中是否包含指定键。

# 例子

```meta-lisp
(hash-has "a" (@hash "a" 1 "b" 2))  ;; => true
(hash-has "c" (@hash "a" 1 "b" 2))  ;; => false
```
