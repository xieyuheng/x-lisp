---
title: store
---

# 类型

```scheme
(-> pointer-t T void-t)
```

# 描述

将值写入指针。`T` 由写入值 cell 的类型确定。

# 例子

```scheme
(store ptr value)
```
