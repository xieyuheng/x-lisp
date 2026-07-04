---
title: current-stderr-file
---

# 类型

```meta-lisp
(-> file-t)
```

# 描述

获取当前标准错误文件句柄。

# 例子

```meta-lisp
(file-writeln "error: something went wrong" (current-stderr-file))
```
