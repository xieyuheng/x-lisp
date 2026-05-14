---
title: assert-not
---

# 类型

```scheme
(-> bool-t void-t)
```

# 描述

断言条件为假。如果条件为真，则报错。

# 例子

```scheme
(assert-not (= 1 2))
(assert-not (< 2 1))
```
