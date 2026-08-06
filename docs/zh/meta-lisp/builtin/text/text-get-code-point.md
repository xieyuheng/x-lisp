---
title: text-get-code-point
---

# 类型

```meta-lisp
(-> int-t text-t int-t)
```

# 描述

获取字符串中第 `i` 个字符的 Unicode 码点值。

# 例子

```meta-lisp
(text-get-code-point 0 "abc")  ;; => 97
(text-get-code-point 1 "abc")  ;; => 98
(text-get-code-point 0 "你")   ;; => 20320
```
