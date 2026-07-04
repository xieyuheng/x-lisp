---
title: list-group
---

# 类型

```meta-lisp
(polymorphic (K V) (-> (-> V K) (list-t V) (hash-t K (list-t V))))
```

# 描述

按 key 函数对列表进行分组，返回哈希表。

# 例子

```meta-lisp
;; (swap imod 3) 翻转参数：(swap imod 3) => (lambda (x) (imod x 3))
(list-group (swap imod 3) [0 1 2 3 4 5])
;; => (@hash 0 [0 3] 1 [1 4] 2 [2 5])
```
