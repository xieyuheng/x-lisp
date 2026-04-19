#include "index.h"

db_t *
make_db(void) {
    db_t *self = new(db_t);
    self->root = db_make_node(NULL, NULL);
    return self;
}

void
db_free(db_t *self) {
    db_node_free(self->root);
    free(self);
}

db_node_t *
db_ensure_node(db_t *db, const char *key) {
    path_t *path = make_path(key);
    db_node_t *node = db->root;
    for (size_t i = 0; i < path_segment_length(path); i++) {
        const char *segment = path_get_segment(path, i);
        db_node_t *child = record_get(node->children, segment);
        if (child) {
            node = child;
        } else {
            child = db_make_node(string_copy(segment), node);
            record_put(node->children, segment, child);
            node = child;
        }
    }

    path_free(path);
    return node;
}

void
db_put(db_t *db, const char *key, value_t value) {
    db_node_t *node = db_ensure_node(db, key);
    node->value = value;
}

db_node_t *
db_get_node(db_t *db, const char *key) {
    path_t *path = make_path(key);
    db_node_t *node = db->root;
    for (size_t i = 0; i < path_segment_length(path); i++) {
        const char *segment = path_get_segment(path, i);
        db_node_t *child = record_get(node->children, segment);
        if (child) {
            node = child;
        } else {
            path_free(path);
            return NULL;
        }
    }

    path_free(path);
    return node;
}

value_t
db_get(db_t *db, const char *key) {
    db_node_t *node = db_get_node(db, key);
    assert(node);
    return node->value;
}

bool
db_has(db_t *db, const char *key) {
    return db_get_node(db, key);
}

// void
// db_delete_recursive(db_t *db, const char *key) {
//     db_node_t *node = db_get_node(db, key);
//     if (node) {
//         assert(node->parent);
//         record_delete(node->parent->children, )
//         {

//         }
//     }
// }
