/**
 * Simplified Chinese copy — the primary and currently only shipped locale.
 * Keep this the single source of truth for the shape of the dictionary;
 * future locales (e.g. `en.ts`) must satisfy the same `Translations` type.
 */
export const zhCN = {
  brand: {
    name: 'RootMap',
    subBrand: 'RootMap Play',
    tagline: '来自 RootMap 的童趣创作乐园',
  },
  nav: {
    home: '首页',
    pocketUniverse: '口袋宇宙',
    littleHero: '隐藏角色',
    familyUniverse: '亲戚宇宙',
    menu: '菜单',
    close: '关闭',
  },
  home: {
    heroEyebrow: 'RootMap 出品 · 陪伴孩子成长的新方式',
    heroTitle: '为孩子创造一段\n值得珍藏的奇妙世界',
    heroSubtitle:
      'RootMap Play 是 RootMap 旗下的趣味创作乐园。几步互动，为你的孩子生成专属插画、角色卡片与家庭关系图，温暖又好看，适合分享给家人朋友。',
    heroPrimaryCta: '开始创作',
    heroSecondaryCta: '了解 RootMap',
    introTitle: '属于 RootMap 家族的新成员',
    introBody:
      'RootMap 一直致力于帮助父母通过真实世界的体验，陪伴孩子成长。RootMap Play 延续同样的理念——用轻松有趣的方式，记录孩子当下的喜好与性格，创造可以下载、保存、分享的数字珍藏品。',
    productsTitle: '三个充满想象力的创作体验',
    productsSubtitle: '选一个开始，为孩子留下独一无二的作品',
    trustTitle: '安心使用，无需注册',
    trustItems: [
      { title: '无需注册账号', body: '打开即可创作，不收集孩子的姓名或照片。' },
      { title: '免费体验', body: '三个创作体验完全免费，随时可以重新开始。' },
      { title: '适合分享', body: '生成的作品可直接下载，分享到小红书或微信都很好看。' },
    ],
  },
  productCard: {
    comingSoonBadge: '创作功能开发中',
    cta: '查看详情',
  },
  products: {
    pocketUniverse: {
      id: 'pocket-universe',
      eyebrow: '产品 A',
      name: '宝宝的口袋宇宙',
      englishName: 'Pocket Universe',
      tagline: '挑选五件孩子喜欢的小事物，拼出一个专属的迷你宇宙',
      description:
        '恐龙、火车、小猫、草莓、星星……每个孩子心中都有一份独特的喜爱清单。选出其中五件，RootMap Play 会把它们编织成一幅温暖细腻的插画小宇宙，记录下孩子此刻的童真喜好。',
      steps: [
        '从卡片库中选择五件孩子喜欢的事物',
        '实时预览专属插画小宇宙的构成',
        '下载保存，分享给家人朋友',
      ],
      comingSoonNotice: '创作体验正在精心打磨中，上线后可在这里实时预览并下载专属插画。',
    },
    littleHero: {
      id: 'little-hero',
      eyebrow: '产品 B',
      name: '宝宝的隐藏角色',
      englishName: 'Little Hero Card',
      tagline: '几个有趣的小问题，解锁孩子的专属收藏卡',
      description:
        '回答几个关于孩子日常喜好与习惯的趣味问题，RootMap Play 会为孩子生成一张独一无二的收藏角色卡——专属称号、可爱超能力、个性化描述，一应俱全。这是一场轻松的娱乐游戏，并非性格测评。',
      steps: ['回答几个轻松的小问题', '生成专属角色称号与超能力', '下载精美收藏卡片'],
      comingSoonNotice: '角色卡创作体验即将上线，敬请期待。',
    },
    familyUniverse: {
      id: 'family-universe',
      eyebrow: '产品 C',
      name: '我们家的亲戚关系宇宙',
      englishName: 'Family Universe',
      tagline: '一张好看的插画地图，理清一大家子的亲戚关系',
      description:
        '爷爷奶奶、姑姑舅舅、表哥表姐……中国家庭的亲戚关系常常让孩子感到困惑。创建一张专属的家庭关系宇宙图，自定义每位家人的称呼，生成一幅温馨好看、可以下载保存的家庭地图。',
      steps: ['选择要加入地图的家庭成员', '自定义姓名与称呼', '生成并下载家庭关系地图'],
      comingSoonNotice: '家庭关系地图创作体验正在开发中，敬请期待。',
    },
  },
  common: {
    backHome: '返回首页',
    learnMore: '了解更多',
    developingBadge: '开发中',
  },
  footer: {
    aboutBody: 'RootMap Play 是 RootMap 旗下的趣味创作产品，专为 0-6 岁孩子的家庭设计。',
    privacyLink: '隐私说明',
    copyright: `© ${new Date().getFullYear()} RootMap. 保留所有权利。`,
  },
  privacyNotice: {
    body: 'RootMap Play 会收集匿名的产品使用数据（例如访问与点击次数），帮助我们了解家长喜欢哪些创作体验。我们不会收集孩子的姓名、照片等信息，也不会关联你的微信或小红书账号。',
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
