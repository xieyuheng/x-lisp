---
title: fs-rename
---

# 类型

```scheme
(-> string-t string-t void-t)
```

# 描述

重命名文件或目录。

# 例子

```scheme
(fs-rename "/tmp/old.txt" "/tmp/new.txt")
```
