# 通用 C 项目构建模块
set(CMAKE_C_STANDARD 23)
set(CMAKE_C_STANDARD_REQUIRED ON)

# 收集源文件（排除 test/snapshot/exe）
function(collect_sources VAR)
  file(GLOB_RECURSE SOURCES "src/*.c")
  list(FILTER SOURCES EXCLUDE REGEX ".*\\.(test|snapshot|exe)\\.c$")
  set(${VAR} ${SOURCES} PARENT_SCOPE)
endfunction()

# 构建库
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
