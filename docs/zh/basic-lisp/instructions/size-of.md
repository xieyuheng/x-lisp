---
title: size-of
---

# 类型

```scheme
(-> int64-t :target-type <type>)
```

# 描述

计算目标类型的字节大小，编译时常量。无 input。

# 例子

```scheme
(= size (size-of :target-type point-t))
```
