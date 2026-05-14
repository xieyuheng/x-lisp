---
title: file-close
---

# 类型

```scheme
(-> file-t void-t)
```

# 描述

关闭文件句柄。

# 例子

```scheme
(= file (open-input-file "data.txt"))
(file-close file)
```
