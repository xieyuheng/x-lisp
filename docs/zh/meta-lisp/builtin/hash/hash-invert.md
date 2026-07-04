---
title: hash-invert
---

# 类型

```meta-lisp
(polymorphic (K V) (-> (hash-t K V) (hash-t V K)))
```

# 描述

交换键和值。多个键映射到同一个值时，最后一个键胜出。

# 例子

```meta-lisp
(hash-invert (@hash 1 2 3 4))        ;; => (@hash 2 1 4 3)
(hash-invert (@hash 'x 1 'y 1 'z 2)) ;; => (@hash 1 'y 2 'z)
```
