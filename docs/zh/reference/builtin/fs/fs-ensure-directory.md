---
title: fs-ensure-directory
---

# 类型

```scheme
(-> string-t void-t)
```

# 描述

确保目录存在。如果目录不存在则创建（包括父目录）。

# 例子

```scheme
(fs-ensure-directory "/tmp/foo/bar")
```
