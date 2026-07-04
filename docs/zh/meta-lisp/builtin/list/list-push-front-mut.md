---
title: list-push-front!
---

# 类型

```meta-lisp
(polymorphic (E) (-> E (list-t E) (list-t E)))
```

# 描述

在列表头部插入一个元素，同 `cons`。

# 例子

```meta-lisp
(list-push-front! 1 [2 3])  ;; => [1 2 3]
```
