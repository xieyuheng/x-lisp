---
title: fs-read
---

# 类型

```meta-lisp
(-> string-t string-t)
```

# 描述

读取文件内容为字符串。

# 例子

```meta-lisp
(fs-read "/tmp/foo.txt")  ;; => 文件内容
```
