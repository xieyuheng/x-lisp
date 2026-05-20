---
title: fs-directory?
---

# 类型

```scheme
(-> string-t bool-t)
```

# 描述

检查路径是否为目录。

# 例子

```scheme
(fs-directory? "/tmp")  ;; => true 或 false
```
