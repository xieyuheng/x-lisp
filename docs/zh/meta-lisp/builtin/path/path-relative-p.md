---
title: path-relative?
---

# 类型

```meta-lisp
(-> string-t bool-t)
```

# 描述

判断路径是否为相对路径。

# 例子

```meta-lisp
(path-relative? "/tmp/foo")  ;; => false
(path-relative? "foo/bar")   ;; => true
```
