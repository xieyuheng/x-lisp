---
title: list-append
---

# 类型

```meta-lisp
(polymorphic (A) (-> (list-t A) (list-t A) (list-t A)))
```

# 描述

追加一个列表，接在末尾。

# 例子

```meta-lisp
(list-append [1 2 3] [4 5 6])  ;; => [1 2 3 4 5 6]
```
