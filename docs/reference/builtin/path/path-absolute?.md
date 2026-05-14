---
title: path-absolute?
---

# 类型

```scheme
(-> string-t bool-t)
```

# 描述

判断路径是否为绝对路径。

# 例子

```scheme
(path-absolute? "/tmp/foo")  ;; => true
(path-absolute? "foo/bar")   ;; => false
```
