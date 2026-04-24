#include "index.h"

void li_execute_put(mod_t *mod, line_t *line) {
  const path_t *path = line_path(line);
  value_t value = line_get_arg(line, 0);
  db_put(mod->db, path_raw_string(path), value);
}
