---
title: path-relative?
---

# 类型

```scheme
(-> string-t bool-t)
```

# 描述

判断路径是否为相对路径。

# 例子

```scheme
(path-relative? "/tmp/foo")  ;; => false
(path-relative? "foo/bar")   ;; => true
```
