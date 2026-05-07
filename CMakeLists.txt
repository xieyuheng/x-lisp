cmake_minimum_required(VERSION 3.16)
project(x_lisp_c_projects C)

set(CMAKE_C_STANDARD 23)
set(CMAKE_C_STANDARD_REQUIRED ON)

# Option to build shared or static libraries
option(BUILD_SHARED_LIBS "Build shared libraries" OFF)

# Build all C projects
add_subdirectory(projects/helpers.c)
add_subdirectory(projects/cmd.c)
add_subdirectory(projects/stack-lisp.c)
