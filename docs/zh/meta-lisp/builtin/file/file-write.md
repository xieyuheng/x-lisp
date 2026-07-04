---
title: file-write
---

# 类型

```meta-lisp
(-> file-t string-t void-t)
```

# 描述

向文件写入字符串。

# 例子

```meta-lisp
(let ((file (open-output-file "output.txt")))
  (file-write file "hello world")
  (file-close file))
```
