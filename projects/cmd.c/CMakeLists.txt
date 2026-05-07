include(../c.make/c.cmake)
build_lib(cmd_c)
target_link_libraries(cmd_c helpers_c)
