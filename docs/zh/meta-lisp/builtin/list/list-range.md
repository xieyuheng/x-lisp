---
title: list-range
---

# 类型

```meta-lisp
(-> int-t (list-t int-t))
```

# 描述

生成从 0 到 n - 1 的整数列表。

# 例子

```meta-lisp
(list-range 0)  ;; => []
(list-range 3)  ;; => [0 1 2]
(list-range 5)  ;; => [0 1 2 3 4]
```
