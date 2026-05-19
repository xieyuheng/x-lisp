# 计划

迁移 [meta-lisp.js] 的 060-LowerMatchPass.ts 到 [meta-lisp.meta] 的 060-lower-match-pass.meta

**我们首先让迁移变简单，然后做一个简单的迁移。**

分析我们可能会遇到什么麻烦，比如：

- 依赖缺失
- 行为不一致
- 等等问题

# 注意

- 你只需要关注这个 pass，别的 pass 交给我们团队的其他成员去完成了。

- 核心需求是保持 [meta-lisp.js] 和 [meta-lisp.meta] 这两个版本的行为一致。

- 如果一个 pass 依赖了某个函数，你就可以迁移这个函数。
  注意，迁移 [meta-lisp.js] 中的函数和文件时，
  要迁移到 [meta-lisp.meta] 中的对应路径下的文件。

- 在需要调用 builtin 函数时,**不要盲目猜测名称**,先查阅文档:
  - **语法参考**:`docs/zh/reference/syntax.md`
  - **内置函数索引**:`docs/zh/reference/builtin/index.md`

# 测试

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
