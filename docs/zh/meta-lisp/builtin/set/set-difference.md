---
title: set-difference
---

# 类型

```meta-lisp
(polymorphic (E) (-> (set-t E) (set-t E) (set-t E)))
```

# 描述

求两个集合的差集（第一个集合中有但第二个中没有的元素）。

# 例子

```meta-lisp
(set-difference (@set 1 2 3) (@set 2 3))  ;; => (@set 1)
(set-difference (@set 1 2) (@set 1 2 3))  ;; => (@set)
```
