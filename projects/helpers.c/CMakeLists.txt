cmake_minimum_required(VERSION 3.16)
project(helpers_c C)

set(CMAKE_C_STANDARD 23)
set(CMAKE_C_STANDARD_REQUIRED ON)

# Collect source files (exclude test, snapshot, and exe files)
file(GLOB_RECURSE SOURCES "src/*.c")
list(FILTER SOURCES EXCLUDE REGEX ".*\\.(test|snapshot|exe)\\.c$")

# Create library
if(BUILD_SHARED_LIBS)
  add_library(helpers_c SHARED ${SOURCES})
else()
  add_library(helpers_c STATIC ${SOURCES})
endif()

# Include directories
target_include_directories(helpers_c PUBLIC src)

# Platform-specific compile definitions
if(UNIX)
  target_compile_definitions(helpers_c PRIVATE
    _POSIX_C_SOURCE=200809L
    _TIME_BITS=64
    _FILE_OFFSET_BITS=64
  )
endif()

# Platform-specific compile options
if(MSVC)
  target_compile_options(helpers_c PRIVATE /W4 /WX)
  # Disable specific warnings if needed
  target_compile_options(helpers_c PRIVATE /wd4100 /wd4200)
else()
  target_compile_options(helpers_c PRIVATE
    -Wall -Wextra -Werror -Wpedantic -Wwrite-strings
    -falign-functions=8 -funsigned-char -fno-omit-frame-pointer
  )
  if(CMAKE_C_COMPILER_ID STREQUAL "GNU")
    target_compile_options(helpers_c PRIVATE -flto=auto)
  elseif(CMAKE_C_COMPILER_ID STREQUAL "Clang")
    target_compile_options(helpers_c PRIVATE -flto)
  endif()
endif()

# Debug info and optimization
target_compile_options(helpers_c PRIVATE -g -O3)

# Link libraries
if(UNIX)
  target_link_libraries(helpers_c PRIVATE m pthread)
  if(CMAKE_C_COMPILER_ID STREQUAL "GNU")
    target_link_options(helpers_c PRIVATE -flto=auto)
  elseif(CMAKE_C_COMPILER_ID STREQUAL "Clang")
    target_link_options(helpers_c PRIVATE -flto)
  endif()
elseif(WIN32)
  # Windows-specific libraries if needed
  # target_link_libraries(helpers_c PRIVATE ws2_32)
endif()
