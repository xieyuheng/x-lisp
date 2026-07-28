---
title: hash-is-empty
---

# 类型

```meta-lisp
(polymorphic (K V) (-> (hash-t K V) bool-t))
```

# 描述

判断哈希表是否为空。

# 例子

```meta-lisp
(hash-is-empty (make-hash))     ;; => true
(hash-is-empty (@hash 'a 1))    ;; => false
```
