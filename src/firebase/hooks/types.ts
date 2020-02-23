import { QueryCondition, QueryOrderBy } from "../firestore"
import { StringMap } from "common/types"

export interface DocumentHookQuery {
  path: string
  conditions?: QueryCondition[]
  orderBy?: QueryOrderBy[]
}

export type PathOrQuery = string | DocumentHookQuery

export interface Paths extends StringMap<string> {}

export interface PathsOrQueries extends StringMap<PathOrQuery> {}
