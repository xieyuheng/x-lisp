if(NOT DEFINED EXE OR NOT DEFINED OUT)
  message(FATAL_ERROR "run_snapshot.cmake requires -DEXE=<path> and -DOUT=<path>")
endif()

get_filename_component(out_dir "${OUT}" DIRECTORY)
file(MAKE_DIRECTORY "${out_dir}")

execute_process(
  COMMAND "${EXE}"
  OUTPUT_FILE "${OUT}"
  RESULT_VARIABLE result)

if(NOT result EQUAL 0)
  message(FATAL_ERROR "snapshot executable failed: ${EXE} (${result})")
endif()
