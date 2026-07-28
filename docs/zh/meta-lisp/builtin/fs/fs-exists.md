---
title: fs-exists
---

# 类型

```meta-lisp
(-> string-t bool-t)
```

# 描述

检查文件或目录是否存在。

# 例子

```meta-lisp
(fs-exists "/tmp/foo")  ;; => true 或 false
```
