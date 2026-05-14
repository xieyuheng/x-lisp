---
title: string-length
---

# 类型

```scheme
(-> string-t int-t)
```

# 描述

返回字符串中字符的数量（以 Unicode 标量值计）。

# 例子

```scheme
(string-length "hello")  ;; => 5
(string-length "")       ;; => 0
(string-length "你好")   ;; => 2
```
