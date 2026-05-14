# docs

[docs] [guide] 删除 testing.md，测试相关介绍都在 syntax.md 中介绍。

- 以 syntax.md 的风格和体例为主。
- 在 syntax.md 的 (define-test) 章节中，介绍所有的断言。

[docs] [reference] syntax.md 中「字面量」章节，同时介绍了类型是不是不太好？

有没有其他方案？

[docs] [reference] 设立 builtin/ 文件夹，在其中模仿 [meta-builtin.meta] 分主题设立子文件夹。

- 删除现有的 reference/builtins.md
- 为每个 builtin 函数设立一个同名 .md 文件（带有 ? 和 ! 后缀的，文件名省略后缀）。
- 在每个 builtin 函数文件中写这个 builtin 函数的文档。
  体例是：

  ```markdown
  ---
  title: 函数名
  ---

  # 类型

  ```scheme
  ...
  ```

  # 描述

  简洁清晰的描述

  # 例子

  ```scheme
  简介清晰的例子
  ```

  ```

要求：

- 逐个函数地，精心编写。禁止用脚本批量生成。

# local (define)

[meta-lisp.js] support using `define` in function body -- use lambda lift

- support recursive and mutual recursive function

# setup feedback loop

[meta-lisp.meta] remove `env` `evaluate` and `value`
[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] fix error report -- maybe need `buffer-t`
