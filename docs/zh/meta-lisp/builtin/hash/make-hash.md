---
title: make-hash
---

# 类型

```meta-lisp
(polymorphic (K V) (-> (hash-t K V)))
```

# 描述

创建一个空哈希表。

# 例子

```meta-lisp
(let ((h (make-hash)))
  (hash-empty? h))  ;; => true
```
