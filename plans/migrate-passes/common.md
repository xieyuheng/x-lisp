## 注意

- 在需要调用 builtin 函数时,**不要盲目猜测名称**,先查阅文档:
  - **语法参考**:`docs/zh/reference/syntax.md`
  - **内置函数索引**:`docs/zh/reference/builtin/index.md`

- 如果一个 pass 依赖了某个函数，你就可以迁移这个函数。
  注意，迁移 [meta-lisp.js] 中的函数和文件时，
  要迁移到 [meta-lisp.meta] 中的对应路径下的文件。

- 核心需求是保持 [meta-lisp.js] 和 [meta-lisp.meta] 这两个版本的行为一致。

## 验证命令

在根目录中：

```sh
sh scripts/build.sh       # 构建
sh scripts/test.sh        # 测试
```

在 [meta-lisp.meta] 中：

```sh
sh scripts/check.sh       # 类型检查
sh scripts/test.sh        # 测试
sh scripts/self-check.sh  # self-hosting 类型检查
```
