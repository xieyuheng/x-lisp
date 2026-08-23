import * as S from "../index.ts"
import { BracketEndConsumer } from "./BracketEndConsumer.ts"
import { BracketStartConsumer } from "./BracketStartConsumer.ts"
import { CommentConsumer } from "./CommentConsumer.ts"
import { NumberConsumer } from "./NumberConsumer.ts"
import { QuoteConsumer } from "./QuoteConsumer.ts"
import { SpaceConsumer } from "./SpaceConsumer.ts"
import { StringConsumer } from "./StringConsumer.ts"
import { SymbolConsumer } from "./SymbolConsumer.ts"

// Created once -- the order matters.
const CONSUMERS: Array<S.Consumer> = [
  new SpaceConsumer(),
  new QuoteConsumer(),
  new BracketStartConsumer(),
  new BracketEndConsumer(),
  new CommentConsumer(),
  new StringConsumer(),
  new NumberConsumer(),
  new SymbolConsumer(),
]

export function useConsumers(): Array<S.Consumer> {
  return CONSUMERS
}
