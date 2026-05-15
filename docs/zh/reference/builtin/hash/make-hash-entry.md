---
title: make-hash-entry
---

# 类型

```scheme
(polymorphic (K V) (-> K V (hash-entry-t K V)))
```

# 描述

`hash-entry-t` 的构造器，创建一个键值条目。

# 例子

```scheme
(= e (make-hash-entry "a" 1))
(hash-entry-key e)   ;; => "a"
(hash-entry-value e)  ;; => 1
```
