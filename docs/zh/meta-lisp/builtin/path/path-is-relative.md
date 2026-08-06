---
title: path-is-relative
---

# 类型

```meta-lisp
(-> text-t bool-t)
```

# 描述

判断路径是否为相对路径。

# 例子

```meta-lisp
(path-is-relative "/tmp/foo")  ;; => false
(path-is-relative "foo/bar")   ;; => true
```
