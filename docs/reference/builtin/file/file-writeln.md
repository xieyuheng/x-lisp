---
title: file-writeln
---

# 类型

```scheme
(-> file-t string-t void-t)
```

# 描述

向文件写入字符串并追加换行符。

# 例子

```scheme
(= file (open-output-file "output.txt"))
(file-writeln file "hello")
(file-writeln file "world")
(file-close file)
```
