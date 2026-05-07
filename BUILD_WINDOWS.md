# Windows 构建指南

## 前置要求

1. 安装 [CMake](https://cmake.org/download/) (3.16 或更高版本)
2. 安装 C 编译器：
   - [MSVC](https://visualstudio.microsoft.com/) (Visual Studio 2019 或更高版本)
   - 或 [MinGW-w64](https://www.mingw-w64.org/) (GCC for Windows)
   - 或 [Clang](https://releases.llvm.org/)

## 使用 CMake 构建

### 方法一：使用 Visual Studio

```cmd
mkdir build && cd build
cmake .. -G "Visual Studio 16 2019" -A x64
cmake --build . --config Release
```

### 方法二：使用 MinGW (MSYS2)

```bash
mkdir build && cd build
cmake .. -G "MinGW Makefiles"
cmake --build .
```

### 方法三：使用 Ninja (推荐)

```bash
mkdir build && cd build
cmake .. -G Ninja
ninja
```

## 构建选项

```bash
# 构建共享库而非静态库
cmake .. -DBUILD_SHARED_LIBS=ON

# 指定安装目录
cmake .. -DCMAKE_INSTALL_PREFIX=C:/x-lisp

# 安装
cmake --install .
```

## 注意事项

1. **C23 标准支持**：Windows 上的 MSVC 可能不完全支持 C23 标准。如果遇到问题，可能需要：
   - 使用较新的 MSVC 版本
   - 或切换到 GCC/Clang 编译器

2. **POSIX 函数**：原始代码使用了 `_POSIX_C_SOURCE` 等定义，这些在 Windows 上不可用。代码中如果有 POSIX 特定的函数调用，可能需要：
   - 使用条件编译：`#ifdef _WIN32`
   - 或使用跨平台库

3. **静态链接**：Windows 上默认不使用 `-static` 标志，如果需要静态链接，请使用 MinGW 版本。

## 测试

构建完成后，测试可执行文件会在 `build` 目录下：

```bash
# 运行测试（如果定义了测试）
ctest
```
