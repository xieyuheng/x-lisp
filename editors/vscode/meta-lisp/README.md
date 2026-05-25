# meta-lisp vscode extension

meta-lisp 语言的 VSCode 编辑器支持。

## 功能

- **语法高亮**：特殊形式、@-形式、内置类型、关键字符号、限定名等
- **智能缩进**：根据 meta-lisp 的关键字 indent spec 自动缩进，`[]` 采用 Clojure 风格
- **括号匹配**：`()` `[]` `{}` 自动配对与高亮
- **注释支持**：`;` 行注释

## 安装

### 开发模式

```bash
cd editors/vscode/meta-lisp
pnpm install
pnpm run compile
```

然后将 `editors/vscode/meta-lisp/` 目录链接到 VSCode 扩展目录：

```bash
ln -s $(pwd) ~/.vscode-oss/extensions/meta-lisp
ln -s $(pwd) ~/.vscode/extensions/meta-lisp
ln -s $(pwd) ~/.cursor/extensions/meta-lisp
```

### 打包发布

```bash
pnpm add -g @vscode/vsce
vsce package
# 生成 meta-lisp-0.1.0.vsix
code --install-extension meta-lisp-0.1.0.vsix
```

## 缩进规则

### `()` 圆括号 — 关键字感知

根据 meta-lisp 的 `sexpConfig.ts` 定义的关键字 indent spec：

| Spec | 行为 | 示例 |
|------|------|------|
| `1` | 第一个参数与关键字同行，body 缩进 2 格 | `define`, `lambda`, `let`, `if`, `match` 等 |
| `0` | 所有元素均为 body，缩进 2 格 | `begin`, `cond`, `@list`, `assert` 等 |

```meta
(define (square x)
  (imul x x))

(begin
  (println "hello")
  (println "world"))

(if (int-less? x 0)
  (ineg x)
  x)
```

非关键字 sexp 采用函数调用对齐：

```meta
(iadd 1
      2
      3)
```

### `[]` 方括号 — 字面量列表 (Clojure 风格)

`[]` 始终按 body 缩进 2 格处理，不查关键字表：

```meta
[1 2 3
 4 5 6]
```

### `{}` 花括号 — 字面量

与 `[]` 相同，始终 body 缩进：

```meta
{:a 1
 :b 2}
```

## 语法高亮作用域

| 作用域 | 匹配内容 |
|--------|---------|
| `keyword.control.meta` | `define`, `lambda`, `if`, `cond`, `let`, `match` 等特殊形式 |
| `keyword.control.at.meta` | `@list`, `@set`, `@hash`, `@quote`, `@record` |
| `support.type.meta` | `int-t`, `float-t`, `string-t`, `list-t` 等内置类型 |
| `constant.language.meta` | `true`, `false`, `void` |
| `constant.numeric.meta` | 整数与浮点数 |
| `constant.keyword.meta` | `:key` 关键字符号 |
| `string.quoted.double.meta` | `"..."` 双引号字符串 |
| `comment.line.semicolon.meta` | `;` 行注释 |
| `keyword.operator.meta` | `'` `,` `` ` `` quote/unquote/quasiquote |
| `entity.name.qualified.meta` | `module/name` 限定名 |

## 项目结构

```
editors/vscode/meta-lisp/
├── src/
│   ├── extension.ts     # 扩展入口
│   ├── indent.ts        # 缩进计算引擎
│   ├── utils.ts         # 工具函数（sexp 遍历/读取）
│   └── config.ts        # 关键字 indent spec 表
├── syntaxes/
│   └── meta-lisp.tmLanguage.json   # TextMate 语法
├── test/
│   └── example.meta     # 语法与缩进测试用例
├── language-configuration.json
├── package.json
└── tsconfig.json
```
