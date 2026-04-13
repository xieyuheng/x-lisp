import * as B from "../index.ts"

export type DbOperation =
  | DbAdd
  | DbDelete
  | DbDeleteAttribute
  | DbDeleteEntity
  | DbPut
  | DbPutUnique

export type DbAdd = {
  kind: "DbAdd"
  e: B.DbExp
  a: B.DbExp
  v: B.DbExp
}

export type DbDelete = {
  kind: "DbDelete"
  e: B.DbExp
  a: B.DbExp
  v: B.DbExp
}

export type DbDeleteAttribute = {
  kind: "DbDeleteAttribute"
  e: B.DbExp
  a: B.DbExp
}

export type DbDeleteEntity = {
  kind: "DbDeleteEntity"
  e: B.DbExp
}

export type DbPut = {
  kind: "DbPut"
  e: B.DbExp
  a: B.DbExp
  v: B.DbExp
}

export type DbPutUnique = {
  kind: "DbPutUnique"
  e: B.DbExp
  a: B.DbExp
  v: B.DbExp
}
