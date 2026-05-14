---
title: float-non-zero?
---

# 类型

```scheme
(-> float-t bool-t)
```

# 描述

判断浮点数是否非零。

# 例子

```scheme
(float-non-zero? 1.0)    ;; => true
(float-non-zero? -1.0)   ;; => true
(float-non-zero? 0.0)    ;; => false
```
