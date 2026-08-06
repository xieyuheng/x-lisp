---
title: file-read
---

# 类型

```meta-lisp
(-> file-t text-t)
```

# 描述

从文件读取所有内容。

# 例子

```meta-lisp
(let ((file (open-input-file "data.txt")))
  (file-read file)
  (file-close file))
```
