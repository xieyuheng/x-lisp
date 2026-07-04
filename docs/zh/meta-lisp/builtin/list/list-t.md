---
title: list-t
---

# 类型

```meta-lisp
type-t
```

# 描述

列表类型构造器。`(list-t E)` 表示元素类型为 `E` 的列表。

# 例子

```meta-lisp
(claim numbers (list-t int-t))
(claim names (list-t string-t))
```
