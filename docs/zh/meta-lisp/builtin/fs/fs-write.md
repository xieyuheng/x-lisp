---
title: fs-write
---

# 类型

```meta-lisp
(-> string-t string-t void-t)
```

# 描述

将字符串写入文件。如果文件不存在则创建，存在则覆盖。

# 例子

```meta-lisp
(fs-write "/tmp/foo.txt" "hello world")
```
