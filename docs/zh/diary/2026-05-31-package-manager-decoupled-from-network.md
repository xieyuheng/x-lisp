---
title: package manager 与网络解耦
authors: [xieyuheng, opencode/big-pickle]
date: 2026-05-31
---

# package manager 与网络解耦

## 背景

当前的 package manager 设计雏形：

- `meta-package.json` 中的 `dependencies` 声明本地路径依赖，如 `"foo": "../foo"`
- 编译时动态计算包源码的 content hash（SHA-256 前 8 字符），作为 pkgId
- 无中心化 store，无 lock file
- 所有依赖在编译期静态链接到单一 bundle 产物（bundler 模型）

这套设计契合自举编译器的 monorepo 阶段。但我们希望设计也能平滑扩展到网络包管理，同时保持核心架构的简洁。

## 设计原则：`meta-package.json` 与网络解耦

`meta-package.json` 只回答一个问题：**这个包依赖哪些本地路径？**

网络不是它的职责。网络是"如何把源码放到那些本地路径"的操作问题，属于 CLI 工具和约定目录的范畴。

## 四层合约

### 第1层：`meta-package.json` — 纯声明

```json
{
  "dependencies": {
    "foo": "deps/foo",
    "bar": "deps/bar"
  }
}
```

- 只声明 `name → 本地路径`
- 无 URL、无版本范围、无 registry 引用
- 即使从网络安装的包，也只以本地路径的形式出现在这里

### 第2层：`deps/` — symlink 目录

```
deps/
  foo          # symlink → ../.meta-lisp/packages/abc12345/
  bar          # symlink → ../.meta-lisp/packages/def56789/
```

- 每个条目是到 `.meta-lisp/packages/<hash>/` 的 symlink
- 提交到 VCS（symlink 体积小，记录了预期依赖）
- 名字 `deps/` 简洁明确，与代码中 `pkg.dependencies` 的用语一致

### 第3层：`.meta-lisp/packages/<hash>/` — 内容寻址存储

```
.meta-lisp/                          # gitignored
  packages/
    abc12345/                        # content hash 目录名
      meta-package.json
      src/
        ...
    def56789/
      meta-package.json
      src/
        ...
```

- 实际源码按 content hash 存放
- 路径名本身就是哈希，自验证（无需额外校验步骤）
- 允许多个 dep 共享同一个底层 package（相同 hash 复用）

### 第4层：`deps/manifest.json` — 声明式源信息

```json
{
  "foo": {
    "url": "https://example.com/packages/foo-1.0.0.zip",
    "hash": "abc12345"
  },
  "bar": {
    "url": "https://example.com/packages/bar-2.0.0.tar.gz",
    "hash": "def56789"
  }
}
```

- 用户主动维护，提交 VCS
- 记录"从哪里下载"和"期望的 hash"
- 不是自动生成的 lock 文件，而是项目的**声明式输入**

## 工作流

### 安装

```bash
meta-lisp install
```

无参数。读取 `deps/manifest.json`，对每条依赖：
1. 检查 `deps/<name>` symlink 是否存在且有效
2. 若缺失：下载 → 校验 hash → 解压到 `.meta-lisp/packages/<hash>/` → 建 symlink

### 构建

```bash
meta-lisp build
```

读 `meta-package.json` → `"deps/foo"` → symlink 解析到 `.meta-lisp/packages/abc12345/` → 编译。

与安装完全正交。构建不关心包是从网络来的还是本地的，只从本地路径加载。

### 新增依赖

用户手动编辑：
1. `deps/manifest.json` — 添加 `name → { url, hash }`
2. `meta-package.json` — 添加 `"name": "deps/<name>"`
3. 运行 `meta-lisp install` — 下载并建 symlink

## 为什么不需要 lock 文件

lock 文件的典型作用是锁定"最终解析到的具体版本"。我们的设计不需要它，因为：

- content hash 本身就是内容标识，不需要额外锁定
- symlink 提交到 VCS 后，hash 路径已在版本控制中
- manifest 是用户主动维护的输入，不是工具自动生成的可变状态

install 与 build 的正交性保证了构建的可复现性。

## 项目布局示例

```
my-project/
  meta-package.json      # "foo": "deps/foo"
  deps/
    foo                  # symlink → ../.meta-lisp/packages/abc12345/
    bar                  # symlink → ../.meta-lisp/packages/def56789/
    manifest.json        # source URL + expected hash
  src/                   # 项目自身源码
    ...
  .meta-lisp/            # gitignored
    packages/
      abc12345/          # foo 的实际源码
        meta-package.json
        src/
          ...
      def56789/          # bar 的实际源码
        meta-package.json
        src/
          ...
```
