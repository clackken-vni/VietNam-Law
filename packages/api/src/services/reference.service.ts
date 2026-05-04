import { prisma } from "../lib/prisma"

/** Get the reference graph for a document (both outgoing and incoming) */
export async function getDocumentReferences(documentId: string) {
  const [outgoing, incoming] = await Promise.all([
    prisma.documentReference.findMany({
      where: { sourceDocumentId: documentId },
      include: {
        targetDocument: { include: { category: true } },
        sourceArticle: true,
        targetArticle: true,
      },
    }),
    prisma.documentReference.findMany({
      where: { targetDocumentId: documentId },
      include: {
        sourceDocument: { include: { category: true } },
        sourceArticle: true,
        targetArticle: true,
      },
    }),
  ])

  return { outgoing, incoming }
}
