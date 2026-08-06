---
title: path-relative
---

# 类型

```meta-lisp
(-> text-t text-t text-t)
```

# 描述

返回 `to` 相对于 `from` 的相对路径。

注意：`from` 和 `to` 必须同为绝对路径或同为相对路径，不能混用。

# 例子

绝对路径：

```meta-lisp
(path-relative "/a/b/c" "/a/b/d/e")    ;; => "../d/e"
(path-relative "/a/b/c" "/a/b/c/d")    ;; => "d"
(path-relative "/app/config" "/app")   ;; => ".."
```

相对路径：

```meta-lisp
(path-relative "a/b/c" "a/b/d/e")      ;; => "../d/e"
(path-relative "a/b/c" "a/b/c/d")      ;; => "d"
(path-relative "." "src")              ;; => "src"
```
