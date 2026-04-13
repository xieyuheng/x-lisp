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

export function DbAdd(e: B.DbExp, a: B.DbExp, v: B.DbExp): DbAdd {
  return {
    kind: "DbAdd",
    e,
    a,
    v,
  }
}

export type DbDelete = {
  kind: "DbDelete"
  e: B.DbExp
  a: B.DbExp
  v: B.DbExp
}

export function DbDelete(e: B.DbExp, a: B.DbExp, v: B.DbExp): DbDelete {
  return {
    kind: "DbDelete",
    e,
    a,
    v,
  }
}

export type DbDeleteAttribute = {
  kind: "DbDeleteAttribute"
  e: B.DbExp
  a: B.DbExp
}

export function DbDeleteAttribute(e: B.DbExp, a: B.DbExp): DbDeleteAttribute {
  return {
    kind: "DbDeleteAttribute",
    e,
    a,
  }
}

export type DbDeleteEntity = {
  kind: "DbDeleteEntity"
  e: B.DbExp
}

export function DbDeleteEntity(e: B.DbExp): DbDeleteEntity {
  return {
    kind: "DbDeleteEntity",
    e,
  }
}

export type DbPut = {
  kind: "DbPut"
  e: B.DbExp
  a: B.DbExp
  v: B.DbExp
}

export function DbPut(e: B.DbExp, a: B.DbExp, v: B.DbExp): DbPut {
  return {
    kind: "DbPut",
    e,
    a,
    v,
  }
}

export type DbPutUnique = {
  kind: "DbPutUnique"
  e: B.DbExp
  a: B.DbExp
  v: B.DbExp
}

export function DbPutUnique(e: B.DbExp, a: B.DbExp, v: B.DbExp): DbPutUnique {
  return {
    kind: "DbPutUnique",
    e,
    a,
    v,
  }
}
