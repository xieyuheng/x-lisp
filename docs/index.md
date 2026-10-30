---
layout: home
hero:
  name: x-lisp
  text: 编程语言集合
  tagline: 基于 LISP 语法框架的编程语言
---

## 语言列表

- [元语](元语/) / [meta-lisp](meta-lisp/)
- [basic-lisp](basic-lisp/syntax)
- [xvm-lisp](xvm-lisp/syntax)

## 代码例子

[meta-lisp](meta-lisp/) 是极简的静态类型 lisp。

```meta-lisp
(module math)

(claim factorial (-> int-t int-t))

(define (factorial n)
    (if (int-less-or-equal n 1)
      1
      (imul (factorial (isub n 1)) n)))

(define-test factorial-test
  (assert-equal 1 (factorial 0))
  (assert-equal 1 (factorial 1))
  (assert-equal 2 (factorial 2))
  (assert-equal 6 (factorial 3))
  (assert-equal 24 (factorial 4))
  (assert-equal 120 (factorial 5))
  (assert-equal 720 (factorial 6)))
```

[元语](元语/) 是 meta-lisp 的中文版：

```meta-lisp
(模块 数学)

(声明 阶乘 (-> 整数型 整数型))

(定义 (阶乘 数)
  (若 (整数小于等于 数 1)
    1
    (整数乘 (阶乘 (整数减 数 1)) 数)))

(定义测试 阶乘测试
  (断言相等 1 (阶乘 0))
  (断言相等 1 (阶乘 1))
  (断言相等 2 (阶乘 2))
  (断言相等 6 (阶乘 3))
  (断言相等 24 (阶乘 4))
  (断言相等 120 (阶乘 5))
  (断言相等 720 (阶乘 6)))
```

[basic-lisp](basic-lisp/syntax) 是一种 SSA 中间表示：

```basic-lisp
(define-function (math/factorial n)
  (block body
    (= n (argument :index 0))
    (= int.3 (int :content 1))
    (= value.4 (int-less-or-equal n int.3))
    (branch value.4 :then-label then.1 :else-label else.2))
  (block then.1
    (= int.1 (int :content 1))
    (return int.1))
  (block else.2
    (= int.2 (int :content 1))
    (= value.3 (isub n int.2))
    (= value.2 (call value.3 :name math/factorial))
    (= value.1 (imul value.2 n))
    (return value.1)))
```

[xvm-lisp](xvm-lisp/syntax) 是 XVM 虚拟机的汇编语言：

```xvm-lisp
(define-function (math/factorial n)
  body
  (load-int int.3 1)
  (int-less-or-equal value.4 n int.3)
  (branch value.4 (label then.1) (label else.2))
  then.1
  (load-int int.1 1)
  (return int.1)
  else.2
  (load-int int.2 1)
  (isub value.3 n int.2)
  (call-1 (fn math/factorial) value.3)
  (load-result value.2)
  (imul value.1 value.2 n)
  (return value.1))
```

## 开发日志

记录设计决策的[开发日志](diary/)。

## 安装

x-lisp 采用基于源码的发布方式。克隆源码后，在仓库内构建并运行，不安装 npm package，也不会把可执行文件安装到系统目录。

当前文档覆盖 Linux；Windows 构建方式稍后补充。

### 环境要求

必要依赖：

- `git`
- `bash`
- `node`、`pnpm`
- `gcc`、`ld`、`make`
- `find`、`readlink`

可选依赖（测试与开发使用）：

- `parallel`
- `nasm`、`ndisasm`
- `xxd`、`objcopy`
- `realpath`

可选命令只用于运行完整测试 `./scripts/all.sh`。

### 构建

```sh
git clone https://github.com/xieyuheng/x-lisp.git
cd x-lisp

./scripts/prepare.sh
./scripts/build.sh
```

`prepare.sh` 会检查必需命令并运行：

```sh
pnpm install --frozen-lockfile
```

`build.sh` 会构建 C 运行时，
以及 `packages/meta-builtin.meta`。

### 使用

把仓库的 `bin/` 加入 `PATH`：

```sh
export PATH="$PWD/bin:$PATH"
```

然后可以直接运行：

```sh
./bin/meta-lisp.ts
./bin/xvm
./bin/xvm-lisp.ts
./bin/x86-lisp.ts
./bin/basic-lisp.ts
```

不带参数运行这些入口会打印命令帮助。

### 完整测试

构建完成后，可以运行完整测试：

```sh
./scripts/all.sh
```

运行前请确保可选命令已安装。

### 更新与卸载

更新源码后重新执行：

```sh
./scripts/prepare.sh
./scripts/build.sh
```

卸载时删除源码目录即可；
项目不会在源码目录之外留下安装产物。
