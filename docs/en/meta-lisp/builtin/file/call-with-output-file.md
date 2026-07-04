---
title: call-with-output-file
---

# Type

```meta-lisp
(polymorphic (A)
  (-> string-t (-> file-t A) A))
```

# Description

Open file for writing, pass the file handle to a function, and automatically close the file when done.

# Examples

```meta-lisp
(call-with-output-file "output.txt"
  (lambda (file) (file-writeln file "hello")))
```
