---
title: text-length
---

# 类型

```meta-lisp
(-> text-t int-t)
```

# 描述

返回字符串中字符的数量（以 Unicode 标量值计）。

# 例子

```meta-lisp
(text-length "hello")  ;; => 5
(text-length "")       ;; => 0
(text-length "你好")   ;; => 2
```
