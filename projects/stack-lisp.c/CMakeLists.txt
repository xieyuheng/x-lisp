cmake_minimum_required(VERSION 3.16)
project(stack_lisp_c C)

set(CMAKE_C_STANDARD 23)
set(CMAKE_C_STANDARD_REQUIRED ON)

# Dependencies
if(NOT TARGET helpers_c)
  add_subdirectory(../helpers.c ${CMAKE_BINARY_DIR}/helpers_c)
endif()

if(NOT TARGET cmd_c)
  add_subdirectory(../cmd.c ${CMAKE_BINARY_DIR}/cmd_c)
endif()

# Collect source files for library
file(GLOB_RECURSE LIB_SOURCES "src/*.c")
list(FILTER LIB_SOURCES EXCLUDE REGEX ".*\\.(test|snapshot|exe)\\.c$")

# Create library
if(BUILD_SHARED_LIBS)
  add_library(stack_lisp_c SHARED ${LIB_SOURCES})
else()
  add_library(stack_lisp_c STATIC ${LIB_SOURCES})
endif()

# Include directories
target_include_directories(stack_lisp_c PUBLIC src)

# Dependencies
target_link_libraries(stack_lisp_c PRIVATE helpers_c cmd_c)

# Platform-specific compile definitions
if(UNIX)
  target_compile_definitions(stack_lisp_c PRIVATE
    _POSIX_C_SOURCE=200809L
    _TIME_BITS=64
    _FILE_OFFSET_BITS=64
  )
endif()

# Platform-specific compile options
if(MSVC)
  target_compile_options(stack_lisp_c PRIVATE /W4 /WX)
  target_compile_options(stack_lisp_c PRIVATE /wd4100 /wd4200)
else()
  target_compile_options(stack_lisp_c PRIVATE
    -Wall -Wextra -Werror -Wpedantic -Wwrite-strings
    -falign-functions=8 -funsigned-char -fno-omit-frame-pointer
  )
  if(CMAKE_C_COMPILER_ID STREQUAL "GNU")
    target_compile_options(stack_lisp_c PRIVATE -flto=auto)
  elseif(CMAKE_C_COMPILER_ID STREQUAL "Clang")
    target_compile_options(stack_lisp_c PRIVATE -flto)
  endif()
endif()

target_compile_options(stack_lisp_c PRIVATE -g -O3)

# Executables from .exe.c files
file(GLOB EXE_SOURCES "src/*.exe.c")
foreach(EXE_SRC ${EXE_SOURCES})
  get_filename_component(EXE_NAME ${EXE_SRC} NAME_WE)
  add_executable(${EXE_NAME} ${EXE_SRC})
  target_link_libraries(${EXE_NAME} PRIVATE stack_lisp_c helpers_c cmd_c)
  if(UNIX)
    target_link_libraries(${EXE_NAME} PRIVATE m pthread)
  endif()
endforeach()

# Test target
enable_testing()
file(GLOB TEST_SOURCES "src/*.test.c")
foreach(TEST_SRC ${TEST_SOURCES})
  get_filename_component(TEST_NAME ${TEST_SRC} NAME_WE)
  add_executable(${TEST_NAME} ${TEST_SRC})
  target_link_libraries(${TEST_NAME} PRIVATE stack_lisp_c helpers_c cmd_c)
  if(UNIX)
    target_link_libraries(${TEST_NAME} PRIVATE m pthread)
  endif()
  add_test(NAME ${TEST_NAME} COMMAND ${TEST_NAME})
endforeach()
