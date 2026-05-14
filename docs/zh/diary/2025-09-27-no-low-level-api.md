---
title: no low-level API
date: 2025-09-27
---

暴露平台的的 low-level API 会导致语言难以移植。

因此实现了：

```scheme
(file-load path)
(file-save path string)
```

而不是：

```scheme
(file-open path)
(file-read file)
(file-write file string)
(file-close file)
```

有倾向想要把 linux 的能力都暴露出来，
但是应该等语言稳定之后以 library 的形式实现。
