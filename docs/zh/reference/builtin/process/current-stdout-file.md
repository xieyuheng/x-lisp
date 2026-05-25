---
title: current-stdout-file
---

# 类型

```scheme
(-> file-t)
```

# 描述

获取当前标准输出文件句柄。

# 例子

```scheme
(file-write "hello" (current-stdout-file))
(file-writeln "done" (current-stdout-file))
```
