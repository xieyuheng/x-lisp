---
title: size-of
---

# 类型

```scheme
(-> int64-t :target-type <type>)
```

# 描述

计算目标类型的字节大小，编译时常量。无 operand。

# 例子

```scheme
(= size int64-t (size-of :target-type point-t))
```
