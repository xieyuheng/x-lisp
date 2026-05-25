---
title: list-t
---

# 类型

```scheme
type-t
```

# 描述

列表类型构造器。`(list-t E)` 表示元素类型为 `E` 的列表。

# 例子

```scheme
(claim numbers (list-t int-t))
(claim names (list-t string-t))
```
