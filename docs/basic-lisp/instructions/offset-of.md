---
title: offset-of
---

# 类型

```scheme
(-> int64-t :struct-type <type> :path (<symbol> ...))
```

# 描述

沿 struct 字段路径逐级计算累积字节偏移，编译时常量。无 input。

# 例子

```scheme
(= y-offset (offset-of :struct-type point-t :path (y)))
```
