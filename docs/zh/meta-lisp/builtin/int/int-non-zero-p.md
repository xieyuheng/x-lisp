---
title: int-non-zero?
---

# 类型

```meta-lisp
(-> int-t bool-t)
```

# 描述

判断整数是否非零。

# 例子

```meta-lisp
(int-non-zero? 1)   ;; => true
(int-non-zero? -1)  ;; => true
(int-non-zero? 0)   ;; => false
```
