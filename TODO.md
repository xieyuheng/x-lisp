# format

[helpers.c] `buffer_append_bytes`

```c
void buffer_append_bytes(buffer_t *self, const uint8_t *bytes, size_t count);

// 将整个文件的内容追加到 buffer 末尾
void buffer_append_file(buffer_t *buf, file_t *file);

// 将整个文件的内容读入 buffer，覆盖原有内容（等价于 clear + append_from_file）
void buffer_read_file(buffer_t *buf, file_t *file);
// 将 buffer 的全部内容写入文件（从文件开头覆盖）
void buffer_write_file(const buffer_t *buf, file_t *file);
```

[stack-lisp.c] gc -- `object_format_fn_t` instead of `object_print_fn_t`

[stack-lisp.c] sexp -- `sexp_format` -- take `buffer_t` as first argument
[stack-lisp.c] sexp -- `sexp_print`
[stack-lisp.c] sexp -- `sexp.snapshot` -- call `sexp_print`
[stack-lisp.c] builtin -- `format-sexp`

# feedback

[stack-lisp.c] `error` & `assert` & `assert-equal` -- print error to stderr -- instead of stdout
[stack-lisp.c] builtin -- `error-with-location` & `assert-with-location` -- print in context

# self-hosting

[meta-lisp.meta] `definition-t`
[meta-lisp.meta] `mod-t`
[meta-lisp.meta] `eval`
[meta-lisp.meta] `parse`
