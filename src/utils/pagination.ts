import { Request } from 'express'

export type PaginationQuery = {
  page?: unknown
  limit?: unknown
}

export type PaginationOptions = {
  defaultPage?: number
  defaultLimit?: number
  maxLimit?: number
}

export type PaginationResult = {
  page: number
  limit: number
  skip: number
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

const toPositiveInteger = (value: unknown): number | null => {
  const parsedValue = Number(value)

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return null
  }

  return parsedValue
}

export const getPagination = (query: Request['query'] | PaginationQuery, options: PaginationOptions = {}): PaginationResult => {
  const defaultPage = options.defaultPage ?? 1
  const defaultLimit = options.defaultLimit ?? 20
  const maxLimit = options.maxLimit ?? 100

  const page = toPositiveInteger(query.page) ?? defaultPage
  const rawLimit = toPositiveInteger(query.limit) ?? defaultLimit
  const limit = Math.min(rawLimit, maxLimit)

  return {
    page,
    limit,
    skip: (page - 1) * limit
  }
}

export const buildPaginationMeta = (params: { page: number; limit: number; total: number }): PaginationMeta => {
  const { page, limit, total } = params
  const totalPages = Math.ceil(total / limit)

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  }
}
