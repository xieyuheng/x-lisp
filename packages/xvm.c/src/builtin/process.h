#pragma once

x_fn_1_t x_exit;
x_fn_0_t x_current_directory;
x_fn_0_t x_current_command_line;
x_fn_0_t x_current_full_command_line;
x_fn_0_t x_current_stdout_file;
x_fn_0_t x_current_stderr_file;

void setup_full_command_line(size_t argc, char **argv);
void setup_current_command_line(array_t *passthrough);
