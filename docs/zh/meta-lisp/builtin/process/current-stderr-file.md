---
title: current-stderr-file
---

# 类型

```scheme
(-> file-t)
```

# 描述

获取当前标准错误文件句柄。

# 例子

```scheme
(file-writeln "error: something went wrong" (current-stderr-file))
```
