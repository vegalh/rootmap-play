/**
 * Simplified Chinese copy — the primary and currently only shipped locale.
 * Keep this the single source of truth for the shape of the dictionary;
 * future locales (e.g. `en.ts`) must satisfy the same `Translations` type.
 */
export const zhCN = {
  brand: {
    name: 'RootMap',
  },
  nav: {
    home: '首页',
    privacy: '隐私说明',
  },
  home: {
    heroHeadline: '把宝宝喜欢的东西，\n变成一个小宇宙',
    heroSubtitle: '选 5 样小宝贝最喜欢的东西，生成一张独一无二的奇妙插画。',
    heroCta: '立即制作 →',
    previewCaption: '效果示例',
    moreLabel: '更多体验',
  },
  productCard: {
    comingSoonBadge: '即将开放',
  },
  products: {
    pocketUniverse: {
      id: 'pocket-universe',
      englishName: 'Pocket Universe',
      name: '宝宝的口袋宇宙',
      tagline: '挑选五件孩子喜欢的小事物，拼出一个专属的迷你宇宙',
      comingSoonNotice: '创作功能即将开放，敬请期待。',
    },
    littleHero: {
      id: 'little-hero',
      englishName: 'Little Hero Card',
      name: '宝宝的隐藏角色',
      tagline: '几个有趣的小问题，解锁孩子的专属收藏卡',
      comingSoonNotice: '角色卡创作功能即将开放，敬请期待。',
    },
    familyUniverse: {
      id: 'family-universe',
      englishName: 'Family Universe',
      name: '我们家的亲戚关系宇宙',
      tagline: '一张好看的插画地图，理清一大家子的亲戚关系',
      comingSoonNotice: '家庭关系地图功能即将开放，敬请期待。',
    },
  },
  pocketUniverseCreator: {
    selectStepHint: '选 5 样喜欢的东西',
    generateCta: '生成我的宇宙 →',
    previewTitle: '宝宝的专属口袋宇宙',
    previewCredit: '由 RootMap Play 制作',
    themeLabel: '选择色调',
    regenerateCta: '换一种排列',
    editSelectionCta: '← 重新选择',
    downloadCta: '下载高清图片 →',
    downloadingCta: '生成中…',
    downloadErrorMessage: '下载失败，请重试一次。',
    downloadSuccessMessage: '已保存到你的设备 🎉',
  },
  feedback: {
    question: '这次创作体验怎么样？',
    commentPlaceholder: '还想对我们说的话（选填）',
    submitCta: '提交反馈',
    thankYou: '感谢你的反馈 ♥',
  },
  common: {
    backHome: '返回首页',
  },
  footer: {
    privacyLink: '隐私说明',
    copyright: `© ${new Date().getFullYear()} RootMap. 保留所有权利。`,
  },
  privacyNotice: {
    body: '为了解家长喜欢哪些创作体验，我们会收集匿名使用数据，不含孩子姓名、照片或微信/小红书账号。',
    acceptCta: '好的，我知道了',
    declineCta: '暂不同意',
    learnMoreCta: '查看隐私说明',
  },
  privacyPage: {
    title: '隐私说明',
    intro: 'RootMap Play 重视每一个家庭的隐私。以下说明我们如何处理你在使用过程中产生的数据。',
    sections: [
      {
        title: '我们收集什么',
        body: '匿名的产品使用数据，例如页面访问、创作开始与完成、下载次数，用于了解家长喜欢哪些体验。',
      },
      {
        title: '我们不收集什么',
        body: '我们不会收集孩子的姓名、照片或其他可识别身份的信息，也不会自动获取你的微信或小红书账号。',
      },
      {
        title: '你的选择',
        body: '匿名数据的收集需要你的同意，你可以随时在浏览器设置中清除同意状态。若你选择加入社区或留下联系方式，我们会在明确征得同意后才会保存。',
      },
      {
        title: '联系信息如何保存',
        body: '如果你主动留下微信号、小红书用户名等联系方式，这些信息会与匿名分析数据分开保存，且不会对外公开。',
      },
    ],
  },
  admin: {
    title: 'RootMap Play 管理后台',
    setupRequiredTitle: '后台尚未配置',
    setupRequiredBody:
      '管理后台需要安全的管理员登录和 Supabase 后端数据才能显示真实数据。目前尚未配置，因此这里不会展示任何数据或登录入口。',
    requirement1: '配置 Supabase 项目地址与密钥（服务端安全存储，而非前端硬编码密码）。',
    requirement2: '为管理员账号启用真实的身份验证（例如 Supabase Auth）。',
    requirement3: '完成数据看板所需的数据表与查询权限配置。',
    note: '在完成以上步骤之前，这里不会出现可以访问真实用户数据的入口，以保护家庭的隐私信息。',
  },
  notFound: {
    title: '页面走丢了',
    body: '你访问的页面不存在，或许它正在另一片星空里探险。',
    cta: '回到首页',
  },
} as const

export type Translations = typeof zhCN
