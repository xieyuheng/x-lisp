---
title: path-is-absolute
---

# 类型

```meta-lisp
(-> text-t bool-t)
```

# 描述

判断路径是否为绝对路径。

# 例子

```meta-lisp
(path-is-absolute "/tmp/foo")  ;; => true
(path-is-absolute "foo/bar")   ;; => false
```
