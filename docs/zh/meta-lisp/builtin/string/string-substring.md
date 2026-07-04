---
title: string-substring
---

# 类型

```meta-lisp
(-> int-t int-t string-t string-t)
```

# 描述

取字符串的子串，从 `start`（含）到 `end`（不含）。索引以 Unicode 标量值计。

# 例子

```meta-lisp
(string-substring 0 3 "hello")  ;; => "hel"
(string-substring 1 4 "hello")  ;; => "ell"
(string-substring 0 0 "hello")  ;; => ""
```
