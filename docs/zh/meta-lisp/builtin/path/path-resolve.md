---
title: path-resolve
---

# 类型

```scheme
(-> string-t string-t)
```

# 描述

将路径解析为绝对路径。如果 `path` 已经是绝对路径（以 `/` 开头），则直接返回；否则使用当前工作目录拼接并规范化。

# 例子

```scheme
(path-resolve "/etc")   ;; => "/etc"
(path-resolve "foo")    ;; => "/home/user/foo"
(path-resolve "./bar")  ;; => "/home/user/bar"
```
