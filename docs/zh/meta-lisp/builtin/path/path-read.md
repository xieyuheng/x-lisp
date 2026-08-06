---
title: path-read
---

# 类型

```meta-lisp
(-> text-t text-t)
```

# 描述

读取文件内容为字符串。

# 例子

```meta-lisp
(path-read "/tmp/foo.txt")  ;; => 文件内容
```
