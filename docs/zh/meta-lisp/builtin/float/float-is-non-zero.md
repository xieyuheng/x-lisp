---
title: float-is-non-zero
---

# 类型

```meta-lisp
(-> float-t bool-t)
```

# 描述

判断浮点数是否非零。

# 例子

```meta-lisp
(float-is-non-zero 1.0)    ;; => true
(float-is-non-zero -1.0)   ;; => true
(float-is-non-zero 0.0)    ;; => false
```
