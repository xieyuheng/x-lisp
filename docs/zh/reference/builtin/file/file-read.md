---
title: file-read
---

# 类型

```scheme
(-> file-t string-t)
```

# 描述

从文件读取所有内容。

# 例子

```scheme
(let ((file (open-input-file "data.txt")))
  (file-read file)
  (file-close file))
```
