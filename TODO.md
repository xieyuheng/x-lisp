[stack-lisp.c] `make_static_xfile`  用来创建不被 gc 追踪的 xfile.

- 和 static xstring 类似，但是这次所有 static xfile 要保存在一个 static array 里，而不是 record 中。
- `ensure_standard_files` 调用  `make_static_xfile`

[stack-lisp.c] 修复 `x_error_with_location`

"(error) " 和 info 的内容，应该作为 message 传递给 format_message_with_source_location。

注意；

- 先构造用一个 buffer ，用 "(error) " 和 info 构造 message string。

[stack-lisp.c] 修复 `x_assert_with_location` 等函数

下列函数也需要像 `x_error_with_location` 一样修复。

```c
x_fn_2_t x_assert_with_location;
x_fn_2_t x_assert_not_with_location;
x_fn_3_t x_assert_equal_with_location;
x_fn_3_t x_assert_not_equal_with_location;
```

[meta-lisp.js] 可否先实现一个 `expIsCore` 函数来明确哪些是 desugar 之后的核心语法？
[meta-lisp.js] 实现一个 `expNaiveSubst` 不处理 capture avoidance，只处理 bound variable shadowing

# setup feedback loop

[meta-lisp.meta] remove `env` `evaluate` and `value`
[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] fix error report -- maybe need `buffer-t`
