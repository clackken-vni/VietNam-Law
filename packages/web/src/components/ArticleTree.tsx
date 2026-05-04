interface Article {
  id: string
  articleNumber: number
  chapterTitle?: string
  sectionTitle?: string
  title?: string
  content: string
  clauses?: Clause[]
}

interface Clause {
  id: string
  clauseNumber: number
  content: string
  points?: Point[]
}

interface Point {
  id: string
  pointLetter: string
  content: string
}

export function ArticleTree({ articles }: { articles: Article[] }) {
  let lastChapter = ""
  let lastSection = ""

  return (
    <div className="space-y-6">
      {articles.map((article) => {
        const showChapter = article.chapterTitle && article.chapterTitle !== lastChapter
        const showSection = article.sectionTitle && article.sectionTitle !== lastSection

        if (showChapter) lastChapter = article.chapterTitle!
        if (showSection) lastSection = article.sectionTitle!

        return (
          <div key={article.id}>
            {showChapter && (
              <h3 className="text-lg font-bold text-primary-800 mt-8 mb-4 pb-2 border-b border-primary-200">
                {article.chapterTitle}
              </h3>
            )}
            {showSection && (
              <h4 className="text-md font-semibold text-primary-700 mt-6 mb-3">
                {article.sectionTitle}
              </h4>
            )}

            <article
              id={`article-${article.articleNumber}`}
              className="bg-white rounded-xl border border-gray-200 p-5 scroll-mt-20"
            >
              <h5 className="font-bold text-primary-700 mb-3">
                Điều {article.articleNumber}
                {article.title && `: ${article.title}`}
              </h5>

              <p className="text-gray-700 leading-relaxed mb-3">{article.content}</p>

              {article.clauses?.map((clause) => (
                <div key={clause.id} className="ml-4 mb-2">
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-medium">{clause.clauseNumber}.</span>{" "}
                    {clause.content}
                  </p>
                  {clause.points?.map((point) => (
                    <p key={point.id} className="text-gray-600 leading-relaxed ml-6">
                      <span className="font-medium">{point.pointLetter})</span>{" "}
                      {point.content}
                    </p>
                  ))}
                </div>
              ))}

              {article.clauses && article.clauses.length === 0 && article.content && (
                <p className="text-gray-500 text-sm italic">(Không có khoản)</p>
              )}
            </article>
          </div>
        )
      })}

      {articles.length === 0 && (
        <p className="text-gray-500 text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
          Chưa có dữ liệu điều khoản cho văn bản này.
        </p>
      )}
    </div>
  )
}
