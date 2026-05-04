import { chromium } from "playwright"
import * as cheerio from "cheerio"

/**
 * Crawler service for ingesting Vietnamese legal documents.
 * This is a scaffold — each source needs a dedicated crawler module.
 *
 * Planned sources:
 *   - csdl.chinhphu.vn (CSDL Quốc gia về văn bản pháp luật)
 *   - vbpl.vn (Văn bản pháp luật)
 *   - thuvienphapluat.vn (Thư viện pháp luật)
 */

export interface CrawlResult {
  title: string
  number: string
  type: string
  issuedDate: string
  effectiveDate: string
  authorityName: string
  sourceUrl: string
  articles: Array<{
    articleNumber: number
    title?: string
    content: string
    clauses: Array<{
      clauseNumber: number
      content: string
    }>
  }>
}

export abstract class BaseCrawler {
  abstract name: string
  abstract baseUrl: string

  abstract crawlDocumentList(page: number): Promise<string[]>
  abstract crawlDocumentDetail(url: string): Promise<CrawlResult>

  protected async fetchPage(url: string): Promise<string> {
    const browser = await chromium.launch({ headless: true })
    try {
      const page = await browser.newPage()
      await page.goto(url, { waitUntil: "networkidle" })
      return page.content()
    } finally {
      await browser.close()
    }
  }

  protected parseHTML(html: string) {
    return cheerio.load(html)
  }
}

/**
 * Stub: CSDL Chính phủ crawler.
 * Real implementation will handle pagination, rate limiting, error recovery.
 */
export class CSDLChinhPhuCrawler extends BaseCrawler {
  name = "csdl_chinh_phu"
  baseUrl = "https://csdl.chinhphu.vn"

  async crawlDocumentList(_page: number): Promise<string[]> {
    // TODO: Implement
    return []
  }

  async crawlDocumentDetail(_url: string): Promise<CrawlResult> {
    // TODO: Implement
    throw new Error("Not implemented")
  }
}

// ─── Entry point ─────────────────────────────────────

async function main() {
  console.log("[crawler] VietLex — Law Document Crawler")
  console.log("[crawler] This is a scaffold. Implement source-specific crawlers per data source.")
}

main().catch(console.error)
