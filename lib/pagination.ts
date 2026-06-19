export const PAGE_SIZE = 20

export function paginationParams(page?: number) {
  const safePage = Math.max(1, page ?? 1)
  return { skip: (safePage - 1) * PAGE_SIZE, take: PAGE_SIZE, page: safePage }
}

export function totalPages(total: number) {
  return Math.max(1, Math.ceil(total / PAGE_SIZE))
}
