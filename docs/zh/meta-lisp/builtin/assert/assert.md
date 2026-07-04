---
title: assert
---

# 类型

```meta-lisp
(-> bool-t void-t)
```

# 描述

断言条件为真。如果条件为假，则报错。

# 例子

```meta-lisp
(assert (equal? 1 1))
(assert (int-greater? 2 1))
```
