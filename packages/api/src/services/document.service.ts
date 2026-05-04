import { prisma } from "../lib/prisma"
import type { Prisma } from "@prisma/client"

const includeArticleTree = {
  articles: {
    orderBy: { sortOrder: "asc" as const },
    include: {
      clauses: {
        orderBy: { sortOrder: "asc" as const },
        include: {
          points: { orderBy: { sortOrder: "asc" as const } },
        },
      },
    },
  },
} satisfies Prisma.LegalDocumentInclude

const includeRelations = {
  category: true,
  authority: true,
} satisfies Prisma.LegalDocumentInclude

export async function getDocumentById(id: string) {
  return prisma.legalDocument.findUnique({
    where: { id },
    include: { ...includeRelations, ...includeArticleTree },
  })
}

export async function getDocumentsPaginated(params: {
  page: number
  pageSize: number
  categoryId?: string
  authorityId?: string
  type?: string
  status?: string
  year?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}) {
  const { page, pageSize, categoryId, authorityId, type, status, year } = params
  const where: Prisma.LegalDocumentWhereInput = {}

  if (categoryId) where.categoryId = categoryId
  if (authorityId) where.authorityId = authorityId
  if (type) where.type = type
  if (status) where.status = status
  if (year) {
    where.issuedDate = {
      gte: new Date(`${year}-01-01`),
      lt: new Date(`${year + 1}-01-01`),
    }
  }

  const orderBy: Prisma.LegalDocumentOrderByWithRelationInput = {}
  const sortField = params.sortBy || "issuedDate"
  const sortDir = params.sortOrder || "desc"
  orderBy[sortField as keyof Prisma.LegalDocumentOrderByWithRelationInput] = sortDir

  const [data, total] = await Promise.all([
    prisma.legalDocument.findMany({
      where,
      include: includeRelations,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.legalDocument.count({ where }),
  ])

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

export async function getDocumentArticles(documentId: string) {
  return prisma.article.findMany({
    where: { documentId },
    orderBy: { sortOrder: "asc" },
    include: {
      clauses: {
        orderBy: { sortOrder: "asc" },
        include: { points: { orderBy: { sortOrder: "asc" } } },
      },
    },
  })
}
