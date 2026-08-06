---
title: file-writeln
---

# 类型

```meta-lisp
(-> file-t text-t void-t)
```

# 描述

向文件写入字符串并追加换行符。

# 例子

```meta-lisp
(let ((file (open-output-file "output.txt")))
  (file-writeln file "hello")
  (file-writeln file "world")
  (file-close file))
```
