---
title: open-output-file
---

# 类型

```meta-lisp
(-> text-t file-t)
```

# 描述

以写入模式打开文件。接受文件路径，返回文件句柄。如果文件不存在则创建，存在则覆盖。

# 例子

```meta-lisp
(let ((file (open-output-file "output.txt")))
  (file-writeln "hello" file)
  (file-close file))
```
