cmake_minimum_required(VERSION 3.16)
project(cmd_c C)

set(CMAKE_C_STANDARD 23)
set(CMAKE_C_STANDARD_REQUIRED ON)

# Dependencies
if(NOT TARGET helpers_c)
  add_subdirectory(../helpers.c ${CMAKE_BINARY_DIR}/helpers_c)
endif()

# Collect source files for library
file(GLOB_RECURSE LIB_SOURCES "src/*.c")
list(FILTER LIB_SOURCES EXCLUDE REGEX ".*\\.(test|snapshot|exe)\\.c$")

# Create library
if(BUILD_SHARED_LIBS)
  add_library(cmd_c SHARED ${LIB_SOURCES})
else()
  add_library(cmd_c STATIC ${LIB_SOURCES})
endif()

# Include directories
target_include_directories(cmd_c PUBLIC src)

# Dependencies
target_link_libraries(cmd_c PRIVATE helpers_c)

# Platform-specific compile definitions
if(UNIX)
  target_compile_definitions(cmd_c PRIVATE
    _POSIX_C_SOURCE=200809L
    _TIME_BITS=64
    _FILE_OFFSET_BITS=64
  )
endif()

# Platform-specific compile options
if(MSVC)
  target_compile_options(cmd_c PRIVATE /W4 /WX)
  target_compile_options(cmd_c PRIVATE /wd4100 /wd4200)
else()
  target_compile_options(cmd_c PRIVATE
    -Wall -Wextra -Werror -Wpedantic -Wwrite-strings
    -falign-functions=8 -funsigned-char -fno-omit-frame-pointer
  )
  if(CMAKE_C_COMPILER_ID STREQUAL "GNU")
    target_compile_options(cmd_c PRIVATE -flto=auto)
  elseif(CMAKE_C_COMPILER_ID STREQUAL "Clang")
    target_compile_options(cmd_c PRIVATE -flto)
  endif()
endif()

target_compile_options(cmd_c PRIVATE -g -O3)

# Executables from .exe.c files
file(GLOB EXE_SOURCES "src/*.exe.c")
foreach(EXE_SRC ${EXE_SOURCES})
  get_filename_component(EXE_NAME ${EXE_SRC} NAME_WE)
  add_executable(${EXE_NAME} ${EXE_SRC})
  target_link_libraries(${EXE_NAME} PRIVATE cmd_c helpers_c)
  if(UNIX)
    target_link_libraries(${EXE_NAME} PRIVATE m pthread)
  endif()
endforeach()
