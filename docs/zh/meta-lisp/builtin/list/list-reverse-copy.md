---
title: list-reverse-copy
---

# 类型

```meta-lisp
(polymorphic (E) (-> (list-t E) (list-t E)))
```

# 描述

反转列表。

# 例子

```meta-lisp
(list-reverse-copy [1 2 3])  ;; => [3 2 1]
(list-reverse-copy [])       ;; => []
```
