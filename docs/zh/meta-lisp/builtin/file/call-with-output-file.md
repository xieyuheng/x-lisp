---
title: call-with-output-file
---

# 类型

```meta-lisp
(polymorphic (A)
  (-> string-t (-> file-t A) A))
```

# 描述

打开文件用于写入，将文件句柄传给函数，完成后自动关闭文件。

# 例子

```meta-lisp
(call-with-output-file "output.txt"
  (lambda (file) (file-writeln file "hello")))
```
