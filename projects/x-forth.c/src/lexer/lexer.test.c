#include "index.h"

int
main(void) {
    test_start();

    {
        list_t *tokens = lex(NULL, "");
        assert(list_length(tokens) == 0);
        list_free(tokens);
    }

    {
        list_t *tokens = lex(NULL, " ");
        assert(list_length(tokens) == 0);
        list_free(tokens);
    }

    {
        list_t *tokens = lex(NULL, " \n \t \n ");
        assert(list_length(tokens) == 0);
        list_free(tokens);
    }

    {
        list_t *tokens = lex(NULL, "()");
        assert(list_length(tokens) == 2);

        token_t *t1 = list_shift(tokens);
        assert(t1->kind == BRACKET_START_TOKEN);
        assert(string_equal(t1->content, "("));

        token_t *t2 = list_shift(tokens);
        assert(t2->kind == BRACKET_END_TOKEN);
        assert(string_equal(t2->content, ")"));

        list_free(tokens);
        token_free(t1);
        token_free(t2);
    }

    {
        list_t *tokens = lex(NULL, "a b c");
        assert(list_length(tokens) == 3);

        token_t *t1 = list_shift(tokens);
        assert(t1->kind == SYMBOL_TOKEN);
        assert(string_equal(t1->content, "a"));

        token_t *t2 = list_shift(tokens);
        assert(t2->kind == SYMBOL_TOKEN);
        assert(string_equal(t2->content, "b"));

        token_t *t3 = list_shift(tokens);
        assert(t3->kind == SYMBOL_TOKEN);
        assert(string_equal(t3->content, "c"));

        list_free(tokens);
        token_free(t1);
        token_free(t2);
        token_free(t3);
    }

    {
        list_t *tokens = lex(NULL, "(a)");
        assert(list_length(tokens) == 3);

        token_t *t1 = list_shift(tokens);
        assert(t1->kind == BRACKET_START_TOKEN);
        assert(string_equal(t1->content, "("));

        token_t *t2 = list_shift(tokens);
        assert(t2->kind == SYMBOL_TOKEN);
        assert(string_equal(t2->content, "a"));

        token_t *t3 = list_shift(tokens);
        assert(t3->kind == BRACKET_END_TOKEN);
        assert(string_equal(t3->content, ")"));

        list_free(tokens);
        token_free(t1);
        token_free(t2);
        token_free(t3);
    }

    {
        list_t *tokens = lex(NULL, "a :b #c");
        assert(list_length(tokens) == 3);

        token_t *t1 = list_shift(tokens);
        assert(t1->kind == SYMBOL_TOKEN);
        assert(string_equal(t1->content, "a"));

        token_t *t2 = list_shift(tokens);
        assert(t2->kind == KEYWORD_TOKEN);
        assert(string_equal(t2->content, "b"));

        token_t *t3 = list_shift(tokens);
        assert(t3->kind == HASHTAG_TOKEN);
        assert(string_equal(t3->content, "c"));

        list_free(tokens);
        token_free(t1);
        token_free(t2);
        token_free(t3);
    }

    {
        list_t *tokens = lex(NULL, ": #");
        assert(list_length(tokens) == 2);

        token_t *t1 = list_shift(tokens);
        assert(t1->kind == SYMBOL_TOKEN);
        assert(string_equal(t1->content, ":"));

        token_t *t2 = list_shift(tokens);
        assert(t2->kind == SYMBOL_TOKEN);
        assert(string_equal(t2->content, "#"));

        list_free(tokens);
        token_free(t1);
        token_free(t2);
    }

    {
        list_t *tokens = lex(NULL, "1 0 -1");
        assert(list_length(tokens) == 3);

        token_t *t1 = list_shift(tokens);
        assert(t1->kind == INT_TOKEN);
        assert(string_equal(t1->content, "1"));

        token_t *t2 = list_shift(tokens);
        assert(t2->kind == INT_TOKEN);
        assert(string_equal(t2->content, "0"));

        token_t *t3 = list_shift(tokens);
        assert(t3->kind == INT_TOKEN);
        assert(string_equal(t3->content, "-1"));

        list_free(tokens);
        token_free(t1);
        token_free(t2);
        token_free(t3);
    }

    {
        list_t *tokens = lex(NULL, "1.0 0.0 -1.0");
        assert(list_length(tokens) == 3);

        token_t *t1 = list_shift(tokens);
        assert(t1->kind == FLOAT_TOKEN);
        assert(string_equal(t1->content, "1.0"));

        token_t *t2 = list_shift(tokens);
        assert(t2->kind == FLOAT_TOKEN);
        assert(string_equal(t2->content, "0.0"));

        token_t *t3 = list_shift(tokens);
        assert(t3->kind == FLOAT_TOKEN);
        assert(string_equal(t3->content, "-1.0"));

        list_free(tokens);
        token_free(t1);
        token_free(t2);
        token_free(t3);
    }

    {
        list_t *tokens = lex(NULL, "\"a\" \"b\" \"\\n\"");
        assert(list_length(tokens) == 3);

        token_t *t1 = list_shift(tokens);
        assert(t1->kind == STRING_TOKEN);
        assert(string_equal(t1->content, "a"));

        token_t *t2 = list_shift(tokens);
        assert(t2->kind == STRING_TOKEN);
        assert(string_equal(t2->content, "b"));

        token_t *t3 = list_shift(tokens);
        assert(t3->kind == STRING_TOKEN);
        assert(string_equal(t3->content, "\n"));

        list_free(tokens);
        token_free(t1);
        token_free(t2);
        token_free(t3);
    }

    // {
    //     lexer->line_comment = "//";
    //     lexer->content = "a b //x\n c";
    //     lexer_run(lexer);
    //     list_t *tokens = lexer->tokens;
    //     assert(list_length(tokens) == 3);

    //     token_t *a = list_shift(tokens);
    //     assert(string_equal(a->content, "a"));
    //     assert(a->lineno == 1);
    //     assert(a->column == 2);

    //     token_t *b = list_shift(tokens);
    //     assert(b->lineno == 1);
    //     assert(b->column == 4);

    //     token_t *c = list_shift(tokens);
    //     assert(string_equal(c->content, "c"));
    //     assert(c->lineno == 2);
    //     assert(c->column == 3);

    //     list_free(tokens);
    //     token_free(a);
    //     token_free(b);
    //     token_free(c);
    // }

    // {
    //     lexer->line_comment = "--";
    //     lexer->content = "a b --x\n c";
    //     lexer_run(lexer);
    //     list_t *tokens = lexer->tokens;
    //     assert(list_length(tokens) == 3);

    //     token_t *a = list_shift(tokens);
    //     assert(string_equal(a->content, "a"));

    //     token_t *b = list_shift(tokens);
    //     assert(string_equal(b->content, "b"));

    //     token_t *c = list_shift(tokens);
    //     assert(string_equal(c->content, "c"));

    //     list_free(tokens);
    //     token_free(a);
    //     token_free(b);
    //     token_free(c);
    // }

    test_end();
}
