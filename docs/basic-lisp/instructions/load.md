---
title: load
---

# 类型

```scheme
(-> pointer-t T :type <type>)
```

# 描述

从 opaque 指针加载值。指针不含元素类型，`:type` 属性指定加载结果类型 `T`。

# 例子

```scheme
(= value (load ptr :type int64-t))
```
