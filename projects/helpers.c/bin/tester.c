#include "../src/index.h"
#include "../src/commands/index.h"

int
main(int argc, char *argv[]) {
    file_disable_buffer(stdout);
    file_disable_buffer(stderr);

    commander_t *commander = make_commander("tester", HELPERS_VERSION, argc, argv);

    commander_use(commander, cmd_test_self);
    commander_use(commander, cmd_default_version);
    commander_use(commander, cmd_default_help);

    return commander_run(commander);
}
