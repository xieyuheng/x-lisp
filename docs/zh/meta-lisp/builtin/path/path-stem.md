---
title: path-stem
---

# 类型

```meta-lisp
(-> text-t text-t)
```

# 描述

获取文件名的主干部分（不含扩展名）。

# 例子

```meta-lisp
(path-stem "/tmp/foo.txt")  ;; => "foo"
```
