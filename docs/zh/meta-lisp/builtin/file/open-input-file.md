---
title: open-input-file
---

# 类型

```scheme
(-> string-t file-t)
```

# 描述

以只读模式打开文件。接受文件路径，返回文件句柄。

# 例子

```scheme
(let ((file (open-input-file "data.txt")))
  (file-read file)
  (file-close file))
```
