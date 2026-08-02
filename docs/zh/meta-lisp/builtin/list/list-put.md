---
title: list-put
---

# 类型

```meta-lisp
(polymorphic (E) (-> int-t E (list-t E) (list-t E)))
```

# 描述

按索引设置元素，与 `list-copy-put` 行为相同。

# 例子

```meta-lisp
(list-put 0 10 [1 2 3])  ;; => [10 2 3]
```
