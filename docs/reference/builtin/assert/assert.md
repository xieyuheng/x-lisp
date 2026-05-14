---
title: assert
---

# 类型

```scheme
(-> bool-t void-t)
```

# 描述

断言条件为真。如果条件为假，则报错。

# 例子

```scheme
(assert (= 1 1))
(assert (> 2 1))
```
