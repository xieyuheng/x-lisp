---
title: load
---

# 类型

```scheme
(-> pointer-t T)
```

# 描述

从 opaque 指针加载值。指针不含元素类型，结果类型 `T` 由指令的 `<type>` 字段确定。

# 例子

```scheme
(= value int64-t (load ptr))
```
