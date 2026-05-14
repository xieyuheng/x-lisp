---
title: imod
---

# 类型

```scheme
(-> int-t int-t int-t)
```

# 描述

整数取模，结果的符号与被除数一致。

# 例子

```scheme
(imod 7 3)    ;; => 1
(imod 6 3)    ;; => 0
(imod -7 3)   ;; => -1
```
