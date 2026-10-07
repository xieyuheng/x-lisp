# builders/cmake

共享的 CMake 构建系统，用于 Windows 原生 C 构建。

## 使用

在仓库根目录配置并构建：

```powershell
cmake -S . -B build/windows -A x64
cmake --build build/windows --config Release --parallel
ctest --test-dir build/windows -C Release --output-on-failure
```

也可以直接运行：

```powershell
./scripts/stage0.ps1
```

## 目录结构

- 根 `CMakeLists.txt` — 添加 [std.c]、[cli.c]、[xvm.c]
- `packages/*/CMakeLists.txt` — 声明包名与依赖
- `builders/cmake/c.cmake` — `x_add_c_package` 实现
- `builders/cmake/run_snapshot.cmake` — 运行 `*.snapshot.c` 并写入 `*.snapshot.out`

## 包声明

```cmake
include(${CMAKE_CURRENT_LIST_DIR}/../../builders/cmake/c.cmake)
x_add_c_package(std.c)
```

```cmake
include(${CMAKE_CURRENT_LIST_DIR}/../../builders/cmake/c.cmake)
x_add_c_package(cli.c DEPS std.c)
```

`x_add_c_package` 会自动：

- 收集 `src/**/*.c`，排除 `*.test.c`、`*.snapshot.c`、`*.exe.c`
- 为包建立 static library
- 链接 `DEPS` 中声明的其它包
- 发现 `*.test.c` 并注册到 `ctest`
- 发现 `*.snapshot.c`，注册 ctest 并生成对应 `.out`
- 发现 `*.exe.c`，建立可执行文件但不自动注册测试

## Windows / MSVC 约定

- 使用 CMake 自动选择的 Visual Studio generator，不使用 Ninja
- 使用 MSVC `cl.exe`
- 源码按 UTF-8 读取（`/utf-8`）
- 开启 C11 atomics（`/experimental:c11atomics`）
- Release 配置不定义 `NDEBUG`，因为仓库测试大量使用 `assert` 执行副作用

## 与 builders/make 的关系

`builders/make/c.mk` 继续服务 Unix/GCC 构建。  
`builders/cmake` 是 Windows 原生构建的对应实现，不替代 Unix 构建。
