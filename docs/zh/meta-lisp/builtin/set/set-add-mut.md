---
title: set-add!
---

# 类型

```meta-lisp
(polymorphic (E) (-> E (set-t E) (set-t E)))
```

# 描述

向集合中添加元素，同 `set-add`。

# 例子

```meta-lisp
(set-add! 4 (@set 1 2 3))  ;; => (@set 1 2 3 4)
```
