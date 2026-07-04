---
title: symbol-length
---

# 类型

```scheme
(-> symbol-t int-t)
```

# 描述

返回符号名的长度（字符数）。

# 例子

```scheme
(symbol-length 'foo)      ;; => 3
(symbol-length 'hello)    ;; => 5
(symbol-length '+)        ;; => 1
```
