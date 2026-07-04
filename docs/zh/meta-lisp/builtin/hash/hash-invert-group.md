---
title: hash-invert-group
---

# 类型

```meta-lisp
(polymorphic (K V) (-> (hash-t K V) (hash-t V (set-t K))))
```

# 描述

交换键和值，重复值归组为键的集合。

# 例子

```meta-lisp
(hash-invert-group (@hash 1 2 3 4 2 2 4 4))
;; => (@hash 2 (@set 1 2) 4 (@set 3 4))
```
