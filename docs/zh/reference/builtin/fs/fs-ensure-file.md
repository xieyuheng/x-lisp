---
title: fs-ensure-file
---

# 类型

```scheme
(-> string-t void-t)
```

# 描述

确保文件存在。如果文件不存在则创建空文件。

# 例子

```scheme
(fs-ensure-file "/tmp/foo.txt")
```
