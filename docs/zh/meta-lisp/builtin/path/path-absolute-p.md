---
title: path-absolute?
---

# 类型

```meta-lisp
(-> string-t bool-t)
```

# 描述

判断路径是否为绝对路径。

# 例子

```meta-lisp
(path-absolute? "/tmp/foo")  ;; => true
(path-absolute? "foo/bar")   ;; => false
```
