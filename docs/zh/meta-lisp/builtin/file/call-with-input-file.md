---
title: call-with-input-file
---

# 类型

```scheme
(polymorphic (A)
  (-> string-t (-> file-t A) A))
```

# 描述

打开文件用于读取，将文件句柄传给函数，完成后自动关闭文件。

# 例子

```scheme
(call-with-input-file "data.txt"
  (lambda (file) (file-read file)))
```
