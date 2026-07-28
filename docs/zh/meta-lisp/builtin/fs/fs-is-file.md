---
title: fs-is-file
---

# 类型

```meta-lisp
(-> string-t bool-t)
```

# 描述

检查路径是否为文件。

# 例子

```meta-lisp
(fs-is-file "/tmp/foo.txt")  ;; => true 或 false
```
