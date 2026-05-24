include(../c.make/c.cmake)
build_lib(cli_c)
target_link_libraries(cli_c helpers_c)
