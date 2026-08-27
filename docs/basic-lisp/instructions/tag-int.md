---
title: tag-int
---

# 类型

```scheme
(-> int64-t value-t)
```

# 描述

将 int64 值包装为 `value-t`。

# 例子

```scheme
(= tagged (tag-int x))
```
