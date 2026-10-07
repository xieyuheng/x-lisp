# A simple CMake counterpart to builders/make/c.mk.
#
# Each C package declares its non-test sources in src/, and its package-level
# dependencies through DEPS.  Tests are discovered by suffix:
#   *.test.c     -> built and registered with ctest
#   *.snapshot.c -> built and its stdout written to the matching *.out file
#   *.exe.c      -> built but not registered with ctest

set(X_LISP_CMAKE_DIR "${CMAKE_CURRENT_LIST_DIR}" CACHE INTERNAL "Path to builders/cmake")

function(x_filter_platform_sources sources_var)
  if(WIN32)
    set(exclude_regex "\\.posix\\.c$")
  else()
    set(exclude_regex "\\.windows\\.c$")
  endif()

  set(filtered "${${sources_var}}")
  list(FILTER filtered EXCLUDE REGEX "${exclude_regex}")
  set(${sources_var} "${filtered}" PARENT_SCOPE)
endfunction()

function(x_add_c_package name)
  cmake_parse_arguments(ARG "" "" "DEPS" ${ARGN})

  string(REPLACE "." "_" target "x_${name}")

  file(GLOB_RECURSE sources CONFIGURE_DEPENDS
    "${CMAKE_CURRENT_SOURCE_DIR}/src/*.c")
  list(FILTER sources EXCLUDE REGEX "\\.test\\.c$")
  list(FILTER sources EXCLUDE REGEX "\\.snapshot\\.c$")
  list(FILTER sources EXCLUDE REGEX "\\.exe\\.c$")
  x_filter_platform_sources(sources)

  add_library(${target} STATIC ${sources})
  target_include_directories(${target} PUBLIC "${CMAKE_CURRENT_SOURCE_DIR}/src")

  foreach(dep IN LISTS ARG_DEPS)
    string(REPLACE "." "_" dep_target "x_${dep}")
    target_link_libraries(${target} PUBLIC ${dep_target})
  endforeach()

  file(GLOB_RECURSE test_sources CONFIGURE_DEPENDS
    "${CMAKE_CURRENT_SOURCE_DIR}/src/*.test.c")
  x_filter_platform_sources(test_sources)
  foreach(test_source IN LISTS test_sources)
    get_filename_component(test_file "${test_source}" NAME)
    string(REPLACE ".test.c" "" test_name "${test_file}")
    set(test_target "${target}.test.${test_name}")
    add_executable(${test_target} "${test_source}")
    target_link_libraries(${test_target} PRIVATE ${target})
    add_test(NAME "${test_target}" COMMAND ${test_target})
  endforeach()

  file(GLOB_RECURSE snapshot_sources CONFIGURE_DEPENDS
    "${CMAKE_CURRENT_SOURCE_DIR}/src/*.snapshot.c")
  x_filter_platform_sources(snapshot_sources)
  foreach(snapshot_source IN LISTS snapshot_sources)
    get_filename_component(snapshot_file "${snapshot_source}" NAME)
    string(REPLACE ".snapshot.c" "" snapshot_name "${snapshot_file}")
    get_filename_component(snapshot_dir "${snapshot_source}" DIRECTORY)
    set(snapshot_target "${target}.snapshot.${snapshot_name}")
    set(snapshot_out "${snapshot_dir}/${snapshot_name}.snapshot.out")
    add_executable(${snapshot_target} "${snapshot_source}")
    target_link_libraries(${snapshot_target} PRIVATE ${target})
    add_test(
      NAME "${snapshot_target}"
      COMMAND ${CMAKE_COMMAND}
        "-DEXE=$<TARGET_FILE:${snapshot_target}>"
        "-DOUT=${snapshot_out}"
        -P "${X_LISP_CMAKE_DIR}/run_snapshot.cmake")
  endforeach()

  file(GLOB_RECURSE exe_sources CONFIGURE_DEPENDS
    "${CMAKE_CURRENT_SOURCE_DIR}/src/*.exe.c")
  x_filter_platform_sources(exe_sources)
  foreach(exe_source IN LISTS exe_sources)
    get_filename_component(exe_file "${exe_source}" NAME)
    string(REPLACE ".exe.c" "" exe_name "${exe_file}")
    set(exe_target "${target}.exe.${exe_name}")
    add_executable(${exe_target} "${exe_source}")
    target_link_libraries(${exe_target} PRIVATE ${target})
    set_target_properties(${exe_target} PROPERTIES OUTPUT_NAME "${exe_name}")
  endforeach()
endfunction()
