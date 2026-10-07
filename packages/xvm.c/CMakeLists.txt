include(${CMAKE_CURRENT_LIST_DIR}/../../builders/cmake/c.cmake)
x_add_c_package(xvm.c DEPS std.c cli.c)
