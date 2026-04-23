---
title: stack-lisp
date: 2026-04-24
---

之前说可以在 c 中实现 basic-lisp，
但是在 li 和 放弃 li 之后，
还是需要实现 stack-lisp。

li 中的 db 可以在未来作为 library 加入到 meta-lisp 中：

- 一个类似文件系统的 kv db，以结构化的 path 为 key。
- 每个文件可以保存 value 的同时，还能作为 directory 保存 metadata。
