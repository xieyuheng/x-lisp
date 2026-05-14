---
title: fs-read
---

# 类型

```scheme
(-> string-t string-t)
```

# 描述

读取文件内容为字符串。

# 例子

```scheme
(fs-read "/tmp/foo.txt")  ;; => 文件内容
```
