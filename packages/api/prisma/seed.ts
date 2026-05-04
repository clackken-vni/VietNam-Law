import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // ─── Lĩnh vực pháp luật ──────────────────────────
  const categories = [
    { name: "Dân sự", slug: "dan-su", description: "Pháp luật về dân sự, hôn nhân gia đình" },
    { name: "Hình sự", slug: "hinh-su", description: "Pháp luật về hình sự, tố tụng hình sự" },
    { name: "Hành chính", slug: "hanh-chinh", description: "Pháp luật về hành chính, khiếu nại tố cáo" },
    { name: "Lao động", slug: "lao-dong", description: "Pháp luật về lao động, việc làm, bảo hiểm xã hội" },
    { name: "Đất đai", slug: "dat-dai", description: "Pháp luật về đất đai, nhà ở, bất động sản" },
    { name: "Doanh nghiệp", slug: "doanh-nghiep", description: "Pháp luật về doanh nghiệp, đầu tư, thương mại" },
    { name: "Thuế", slug: "thue", description: "Pháp luật về thuế, phí, lệ phí" },
    { name: "Tài chính - Ngân hàng", slug: "tai-chinh-ngan-hang", description: "Pháp luật về tài chính, ngân hàng, chứng khoán" },
    { name: "Giao thông", slug: "giao-thong", description: "Pháp luật về giao thông vận tải" },
    { name: "Giáo dục", slug: "giao-duc", description: "Pháp luật về giáo dục, đào tạo" },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    })
  }

  // ─── Cơ quan ban hành ───────────────────────────
  const authorities = [
    { name: "Quốc hội", slug: "quoc-hoi", level: "TRUNG_UONG" },
    { name: "Ủy ban Thường vụ Quốc hội", slug: "uy-ban-thuong-vu-quoc-hoi", level: "TRUNG_UONG" },
    { name: "Chính phủ", slug: "chinh-phu", level: "TRUNG_UONG" },
    { name: "Thủ tướng Chính phủ", slug: "thu-tuong-chinh-phu", level: "TRUNG_UONG" },
    { name: "Bộ Tư pháp", slug: "bo-tu-phap", level: "BO_NGANH" },
    { name: "Bộ Tài chính", slug: "bo-tai-chinh", level: "BO_NGANH" },
    { name: "Bộ Công an", slug: "bo-cong-an", level: "BO_NGANH" },
    { name: "Bộ Lao động - Thương binh và Xã hội", slug: "bo-lao-dong-thuong-binh-va-xa-hoi", level: "BO_NGANH" },
    { name: "Tòa án Nhân dân Tối cao", slug: "toa-an-nhan-dan-toi-cao", level: "TRUNG_UONG" },
    { name: "Viện Kiểm sát Nhân dân Tối cao", slug: "vien-kiem-sat-nhan-dan-toi-cao", level: "TRUNG_UONG" },
  ]

  for (const auth of authorities) {
    await prisma.authority.upsert({
      where: { slug: auth.slug },
      update: auth,
      create: auth,
    })
  }

  // ─── Văn bản mẫu ────────────────────────────────
  const danSuCat = await prisma.category.findUnique({ where: { slug: "dan-su" } })
  const quocHoi = await prisma.authority.findUnique({ where: { slug: "quoc-hoi" } })

  if (danSuCat && quocHoi) {
    const doc = await prisma.legalDocument.upsert({
      where: { id: "seed-blds-2015" },
      update: {},
      create: {
        id: "seed-blds-2015",
        title: "Bộ luật Dân sự",
        alias: "BLDS 2015",
        number: "91/2015/QH13",
        type: "BO_LUAT",
        issuedDate: new Date("2015-11-24"),
        effectiveDate: new Date("2017-01-01"),
        status: "EFFECTIVE",
        categoryId: danSuCat.id,
        authorityId: quocHoi.id,
        articles: {
          create: [
            {
              articleNumber: 1,
              title: "Phạm vi điều chỉnh",
              content: "Bộ luật này quy định địa vị pháp lý, chuẩn mực pháp lý về cách ứng xử của cá nhân, pháp nhân; quyền, nghĩa vụ về nhân thân và tài sản của cá nhân, pháp nhân trong các quan hệ được hình thành trên cơ sở bình đẳng, tự do ý chí, độc lập về tài sản và tự chịu trách nhiệm.",
              sortOrder: 1,
              clauses: {
                create: [
                  { clauseNumber: 1, content: "Quan hệ dân sự được xác lập trên cơ sở bình đẳng, tự do ý chí, độc lập về tài sản và tự chịu trách nhiệm.", sortOrder: 1 },
                ],
              },
            },
            {
              articleNumber: 2,
              title: "Đối tượng áp dụng",
              content: "Bộ luật này áp dụng đối với cá nhân, pháp nhân và chủ thể khác trong quan hệ dân sự.",
              sortOrder: 2,
            },
            {
              articleNumber: 3,
              title: "Nguyên tắc cơ bản của pháp luật dân sự",
              content: "Cá nhân, pháp nhân được xác lập, thực hiện, chấm dứt quyền, nghĩa vụ dân sự của mình trên cơ sở tự do, tự nguyện cam kết, thỏa thuận.",
              sortOrder: 3,
              clauses: {
                create: [
                  { clauseNumber: 1, content: "Mọi cam kết, thỏa thuận không vi phạm điều cấm của luật, không trái đạo đức xã hội có hiệu lực thực hiện đối với các bên và phải được chủ thể khác tôn trọng.", sortOrder: 1 },
                  { clauseNumber: 2, content: "Cá nhân, pháp nhân phải xác lập, thực hiện, chấm dứt quyền, nghĩa vụ dân sự của mình một cách thiện chí, trung thực.", sortOrder: 2 },
                ],
              },
            },
          ],
        },
      },
    })

    console.log(`Created seed document: ${doc.title}`)
  }

  console.log("Seeding complete.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
