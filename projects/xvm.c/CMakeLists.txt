include(../c.make/c.cmake)
build_lib(stack_lisp_c)
target_link_libraries(stack_lisp_c helpers_c cli_c)
