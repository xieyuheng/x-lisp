---
title: file-close
---

# 类型

```meta-lisp
(-> file-t void-t)
```

# 描述

关闭文件句柄。

# 例子

```meta-lisp
(let ((file (open-input-file "data.txt")))
  (file-close file))
```
