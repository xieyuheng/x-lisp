---
title: set-t
---

# 类型

```scheme
(-> type-t type-t)
```

# 描述

集合类型构造器。`(set-t E)` 表示元素类型为 `E` 的集合。

# 例子

```scheme
(claim numbers (set-t int-t))
```
