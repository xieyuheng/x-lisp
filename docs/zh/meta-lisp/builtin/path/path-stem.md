---
title: path-stem
---

# 类型

```meta-lisp
(-> string-t string-t)
```

# 描述

获取文件名的主干部分（不含扩展名）。

# 例子

```meta-lisp
(path-stem "/tmp/foo.txt")  ;; => "foo"
```
