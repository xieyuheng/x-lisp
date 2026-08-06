---
title: text-slice
---

# 类型

```meta-lisp
(-> int-t int-t text-t text-t)
```

# 描述

取字符串的子串，从 `start`（含）到 `end`（不含）。索引以 Unicode 标量值计。

# 例子

```meta-lisp
(text-slice 0 3 "hello")  ;; => "hel"
(text-slice 1 4 "hello")  ;; => "ell"
(text-slice 0 0 "hello")  ;; => ""
```
