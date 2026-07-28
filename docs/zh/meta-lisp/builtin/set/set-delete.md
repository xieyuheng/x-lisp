---
title: set-delete
---

# 类型

```meta-lisp
(polymorphic (E) (-> E (set-t E) (set-t E)))
```

# 描述

从集合中删除元素，返回新集合。

# 例子

```meta-lisp
(set-delete 2 (@set 1 2 3))  ;; => (@set 1 3)
(set-delete 0 (@set 1 2 3))  ;; => (@set 1 2 3)
```
