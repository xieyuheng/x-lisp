---
title: store
---

# 类型

```scheme
(-> pointer-t T void-t :content-type <type>)
```

# 描述

将值写入指针。`T` 与 `:content-type` 引用同一类型。

# 例子

```scheme
(store ptr value :content-type int64-t)
```
