---
title: tag-bool
---

# 类型

```scheme
(-> bool-t value-t)
```

# 描述

将 bool 值包装为 `value-t`。

# 例子

```scheme
(= tagged value-t (tag-bool x))
```
