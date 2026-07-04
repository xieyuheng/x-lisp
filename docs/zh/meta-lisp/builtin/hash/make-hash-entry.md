---
title: make-hash-entry
---

# 类型

```meta-lisp
(polymorphic (K V) (-> K V (hash-entry-t K V)))
```

# 描述

`hash-entry-t` 的构造器，创建一个键值条目。

# 例子

```meta-lisp
(let ((e (make-hash-entry "a" 1)))
  (hash-entry-key e))   ;; => "a"
```
