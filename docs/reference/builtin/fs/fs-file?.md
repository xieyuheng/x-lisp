---
title: fs-file?
---

# 类型

```scheme
(-> string-t bool-t)
```

# 描述

检查路径是否为文件。

# 例子

```scheme
(fs-file? "/tmp/foo.txt")  ;; => true 或 false
```
