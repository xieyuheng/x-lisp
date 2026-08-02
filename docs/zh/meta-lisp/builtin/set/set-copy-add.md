---
title: set-copy-add
---

# 类型

```meta-lisp
(polymorphic (E) (-> E (set-t E) (set-t E)))
```

# 描述

向集合中添加元素，返回新集合。

# 例子

```meta-lisp
(set-copy-add 4 (@set 1 2 3))  ;; => (@set 1 2 3 4)
(set-copy-add 1 (@set 1 2 3))  ;; => (@set 1 2 3)
```
