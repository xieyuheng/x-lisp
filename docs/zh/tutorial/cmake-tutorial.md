# CMake 简明教程

## 什么是 CMake

CMake 是一个跨平台的构建系统生成器。它不直接构建项目，而是生成其他构建工具所需的文件（如 Makefile、Visual Studio 项目、Ninja 文件等）。

**核心优势：**
- 跨平台：同一份配置可在 Linux、macOS、Windows 上工作
- 支持多种编译器：GCC、Clang、MSVC 等
- 自动依赖管理

## 快速开始

### 基本项目结构

```
项目根目录/
├── CMakeLists.txt          # 顶层配置文件
├── src/                    # 源代码
└── build/                  # 构建目录（通常 .gitignore）
```

### Hello World 示例

最简单的 `CMakeLists.txt`：

```cmake
cmake_minimum_required(VERSION 3.16)
project(my_project C)
add_executable(hello src/hello.c)
```

构建命令：

```bash
mkdir build && cd build
cmake ..
cmake --build .
```

## 核心概念

### 1. 命令（Command）

CMake 使用命令式语法，常用命令：

| 命令 | 作用 |
|------|------|
| `cmake_minimum_required` | 指定最低 CMake 版本 |
| `project` | 定义项目名称和支持的语言 |
| `add_executable` | 添加可执行文件目标 |
| `add_library` | 添加库目标（静态/动态） |
| `target_link_libraries` | 链接库到目标 |
| `target_include_directories` | 添加头文件搜索路径 |
| `file` | 文件操作（如收集源文件） |

### 2. 目标（Target）

现代 CMake 的核心是"目标"。每个可执行文件或库都是一个目标：

```cmake
add_library(mylib STATIC src/a.c src/b.c)
add_executable(myapp src/main.c)
target_link_libraries(myapp mylib)
```

### 3. 变量与作用域

```cmake
set(SOURCES src/a.c src/b.c)  # 设置变量
set(MY_VAR "value" PARENT_SCOPE)  # 传递到父作用域
```

## 写出简洁的 CMake

### 问题：重复代码

假设有多个库，每个都需要设置 C 标准、包含目录等：

```cmake
# 不简洁的写法
add_library(lib1 STATIC src1/a.c)
set_target_properties(lib1 PROPERTIES C_STANDARD 23)
target_include_directories(lib1 PUBLIC src1)

add_library(lib2 STATIC src2/b.c)
set_target_properties(lib2 PROPERTIES C_STANDARD 23)
target_include_directories(lib2 PUBLIC src2)
# ... 重复 N 次
```

### 解决方案：封装函数

创建 `c.cmake` 模块（类似 makefile 的 `c.mk`）：

```cmake
# c.cmake - 通用 C 项目构建模块
set(CMAKE_C_STANDARD 23)
set(CMAKE_C_STANDARD_REQUIRED ON)

# 收集源文件（排除测试文件）
function(collect_sources VAR)
  file(GLOB_RECURSE SOURCES "src/*.c")
  list(FILTER SOURCES EXCLUDE REGEX ".*\\.(test|snapshot|exe)\\.c$")
  set(${VAR} ${SOURCES} PARENT_SCOPE)
endfunction()

# 构建库（封装重复逻辑）
function(build_lib NAME)
  collect_sources(SOURCES)
  add_library(${NAME} STATIC ${SOURCES})
  target_include_directories(${NAME} PUBLIC src)
endfunction()
```

使用：

```cmake
# helpers.c/CMakeLists.txt
include(../c.make/c.cmake)
build_lib(helpers_c)

# cli.c/CMakeLists.txt
include(../c.make/c.cmake)
build_lib(cli_c)
target_link_libraries(cli_c helpers_c)
```

**简洁原则：**
1. 提取重复逻辑到函数/宏
2. 使用 `include()` 复用配置模块
3. 每个项目的 CMakeLists.txt 只写必要的 2-5 行

## 跨平台与 Windows 支持

### 平台检测

```cmake
if(UNIX)
  # Linux/macOS 特定配置
  target_compile_definitions(myapp PRIVATE _POSIX_C_SOURCE=200809L)
elseif(WIN32)
  # Windows 特定配置
  target_compile_definitions(myapp PRIVATE _WIN32_WINNT=0x0600)
endif()
```

### 编译器差异

不同编译器支持的标准和选项不同：

```cmake
if(MSVC)
  # Visual Studio
  target_compile_options(myapp PRIVATE /W4 /WX)
else()
  # GCC/Clang
  target_compile_options(myapp PRIVATE -Wall -Wextra -Werror)
endif()
```

### Windows 上的注意事项

#### 1. C 标准支持

MSVC 对 C23 支持有限。如果遇到问题：

```cmake
if(MSVC)
  # 降级到 C11 或 C17
  set(CMAKE_C_STANDARD 17)
endif()
```

#### 2. POSIX 函数

Windows 没有 POSIX 函数（如 `unistd.h`、 `pthread`）。解决方案：

- 使用条件编译：
  ```c
  #ifdef _WIN32
    // Windows 替代实现
  #else
    #include <unistd.h>
  #endif
  ```

- 或使用跨平台库（如 pthreads-w32）

#### 3. 静态 vs 动态库

```cmake
option(BUILD_SHARED_LIBS "Build shared libraries" OFF)
if(BUILD_SHARED_LIBS)
  add_library(mylib SHARED ${SOURCES})
else()
  add_library(mylib STATIC ${SOURCES})
endif()
```

### Windows 构建示例

**使用 Visual Studio：**

```cmd
mkdir build
cd build
cmake .. -G "Visual Studio 16 2019" -A x64
cmake --build . --config Release
```

**使用 MinGW：**

```bash
mkdir build
cd build
cmake .. -G "MinGW Makefiles"
make
```

**使用 Ninja（推荐）：**

```bash
mkdir build
cd build
cmake .. -G Ninja
ninja
```

## 实际项目示例

基于 x-lisp 项目的简洁 CMake 配置：

### 目录结构

```
x-lisp/
├── CMakeLists.txt                   # 顶层
├── projects/
│   ├── c.make/
│   │   └── c.cmake                  # 通用模块
│   ├── helpers.c/
│   │   └── CMakeLists.txt           # 2 行
│   ├── cli.c/
│   │   └── CMakeLists.txt           # 2 行
│   └── stack-lisp.c/
│       └── CMakeLists.txt           # 2 行
```

### 文件内容

**`CMakeLists.txt` (根目录):**
```cmake
cmake_minimum_required(VERSION 3.16)
project(meta_lisp)
add_subdirectory(projects/helpers.c)
add_subdirectory(projects/cli.c)
add_subdirectory(projects/stack-lisp.c)
```

**`projects/c.make/c.cmake` (通用模块):**
```cmake
set(CMAKE_C_STANDARD 23)
set(CMAKE_C_STANDARD_REQUIRED ON)

function(collect_sources VAR)
  file(GLOB_RECURSE SOURCES "src/*.c")
  list(FILTER SOURCES EXCLUDE REGEX ".*\\.(test|snapshot|exe)\\.c$")
  set(${VAR} ${SOURCES} PARENT_SCOPE)
endfunction()

function(build_lib NAME)
  collect_sources(SOURCES)
  add_library(${NAME} STATIC ${SOURCES})
  target_include_directories(${NAME} PUBLIC src)
  if(UNIX)
    target_compile_definitions(${NAME} PRIVATE
      _POSIX_C_SOURCE=200809L
      _TIME_BITS=64
      _FILE_OFFSET_BITS=64
    )
  endif()
endfunction()
```

**`projects/helpers.c/CMakeLists.txt`:**
```cmake
include(../c.make/c.cmake)
build_lib(helpers_c)
```

**`projects/cli.c/CMakeLists.txt`:**
```cmake
include(../c.make/c.cmake)
build_lib(cli_c)
target_link_libraries(cli_c helpers_c)
```

**`projects/stack-lisp.c/CMakeLists.txt`:**
```cmake
include(../c.make/c.cmake)
build_lib(stack_lisp_c)
target_link_libraries(stack_lisp_c helpers_c cli_c)
```

## 总结

**简洁 CMake 的要点：**
1. 使用函数封装重复逻辑（如 `build_lib`）
2. 创建通用模块文件（如 `c.cmake`）并用 `include()` 引入
3. 每个子项目的 CMakeLists.txt 保持 2-5 行
4. 利用现代 CMake 的目标系统（target_* 命令）

**跨平台要点：**
1. 使用 `if(UNIX)` / `if(WIN32)` 处理平台差异
2. 注意编译器差异（MSVC vs GCC/Clang）
3. Windows 上可能需要条件编译处理 POSIX 函数
4. 提供多种生成器选项（Visual Studio、MinGW、Ninja）

**与 Makefile 对比：**
- Makefile: 直接定义构建规则，更底层
- CMake: 生成构建文件，更抽象但跨平台

选择建议：如果只在 Unix 上构建，Makefile 更简洁；如果需要 Windows 支持，CMake 是更好的选择。
