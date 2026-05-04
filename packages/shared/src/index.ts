// ─── Văn bản pháp luật ───────────────────────────────

/** Loại văn bản */
export type DocumentType =
  | "HIEN_PHAP"        // Hiến pháp
  | "BO_LUAT"          // Bộ luật
  | "LUAT"             // Luật
  | "NGHI_QUYET"       // Nghị quyết
  | "NGHI_DINH"        // Nghị định
  | "THONG_TU"         // Thông tư
  | "QUYET_DINH"       // Quyết định
  | "CHI_THI"          // Chỉ thị
  | "THONG_TU_LIEN_TICH" // Thông tư liên tịch
  | "VAN_BAN_HOP_NHAT" // Văn bản hợp nhất
  | "OTHER"

/** Trạng thái hiệu lực của văn bản */
export type EffectivenessStatus =
  | "EFFECTIVE"        // Còn hiệu lực
  | "PARTIALLY_EFFECTIVE" // Còn hiệu lực một phần
  | "EXPIRED"          // Hết hiệu lực
  | "NOT_YET_EFFECTIVE" // Chưa có hiệu lực
  | "SUSPENDED"        // Tạm đình chỉ

/** Loại liên kết giữa các văn bản */
export type ReferenceType =
  | "CITES"            // Dẫn chiếu
  | "REPLACES"         // Thay thế
  | "AMENDS"           // Sửa đổi, bổ sung
  | "GUIDES"           // Hướng dẫn, quy định chi tiết
  | "BASED_ON"         // Căn cứ ban hành

/** Lĩnh vực pháp luật */
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string
  children?: Category[]
}

/** Cơ quan ban hành */
export interface Authority {
  id: string
  name: string
  slug: string
  level: "TRUNG_UONG" | "BO_NGANH" | "DIA_PHUONG"
}

/** Văn bản pháp luật */
export interface LegalDocument {
  id: string
  title: string
  alias: string
  number: string          // Số hiệu văn bản, VD: "45/2019/QH14"
  type: DocumentType
  issuedDate: string
  effectiveDate: string
  expirationDate?: string
  status: EffectivenessStatus
  categoryId: string
  authorityId: string
  sourceUrl?: string       // URL nguồn gốc
  viewCount: number
  createdAt: string
  updatedAt: string

  // Relations (populated)
  category?: Category
  authority?: Authority
  articles?: Article[]
  outgoingReferences?: DocumentReference[]
  incomingReferences?: DocumentReference[]
}

/** Điều khoản */
export interface Article {
  id: string
  documentId: string
  chapterTitle?: string    // Tên chương (nếu có)
  sectionTitle?: string    // Tên mục (nếu có)
  articleNumber: number
  title?: string           // Tiêu đề điều
  content: string          // Nội dung chính của điều
  sortOrder: number

  clauses?: Clause[]
}

/** Khoản */
export interface Clause {
  id: string
  articleId: string
  clauseNumber: number
  content: string
  sortOrder: number

  points?: Point[]
}

/** Điểm */
export interface Point {
  id: string
  clauseId: string
  pointLetter: string      // a, b, c...
  content: string
  sortOrder: number
}

/** Liên kết giữa các văn bản */
export interface DocumentReference {
  id: string
  sourceDocumentId: string
  targetDocumentId: string
  referenceType: ReferenceType
  detail?: string          // Mô tả chi tiết (VD: "Thay thế Điều 15")
  sourceArticleId?: string // Điều khoản nguồn (nếu liên kết ở cấp điều)
  targetArticleId?: string // Điều khoản đích

  sourceDocument?: LegalDocument
  targetDocument?: LegalDocument
}

// ─── API Types ────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface SearchParams {
  query?: string
  categoryId?: string
  authorityId?: string
  type?: DocumentType
  status?: EffectivenessStatus
  year?: number
  page?: number
  pageSize?: number
  sortBy?: "relevance" | "issuedDate" | "effectiveDate" | "viewCount"
  sortOrder?: "asc" | "desc"
}

export interface ApiError {
  code: string
  message: string
  details?: unknown
}
