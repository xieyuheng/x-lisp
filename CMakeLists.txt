cmake_minimum_required(VERSION 3.25)

project(x-lisp C)

if(MSVC)
  string(REPLACE "/DNDEBUG" "" CMAKE_C_FLAGS_RELEASE "${CMAKE_C_FLAGS_RELEASE}")
  string(REPLACE "/DNDEBUG" "" CMAKE_C_FLAGS_RELWITHDEBINFO "${CMAKE_C_FLAGS_RELWITHDEBINFO}")
endif()

set(CMAKE_C_STANDARD 17)
set(CMAKE_C_STANDARD_REQUIRED ON)
set(CMAKE_C_EXTENSIONS OFF)

if(MSVC)
  add_compile_options(
    /W4
    /WX-
    /wd4100 # unreferenced formal parameter
    /wd4189 # local variable initialized but not referenced
    /wd4200 # zero-sized array
    /wd4201 # nonstandard extension used: nameless struct/union
    /wd4204 # nonconstant aggregate initializer
    /wd4221 # nonstandard extension used: address of function
    /wd4996 # deprecated POSIX names
    /D_CRT_SECURE_NO_WARNINGS
    /D_CRT_NONSTDC_NO_DEPRECATE
    /utf-8
    /experimental:c11atomics
  )
endif()

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin")
foreach(config DEBUG RELEASE RELWITHDEBINFO MINSIZEREL)
  set(CMAKE_RUNTIME_OUTPUT_DIRECTORY_${config} "${CMAKE_BINARY_DIR}/bin")
endforeach()
enable_testing()

include(builders/cmake/c.cmake)

add_subdirectory(packages/std.c)
add_subdirectory(packages/cli.c)
add_subdirectory(packages/xvm.c)
