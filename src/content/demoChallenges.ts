/**
 * MOCK / DEMO CONTENT — NOT connected to any backend.
 *
 * These fixtures exist only to exercise src/content/types.ts and
 * src/content/promptTemplate.ts against realistic content (see
 * demoChallenges.test.ts) ahead of the public gallery UI (Phase 2) and the
 * admin editor (Phase 3). Nothing imports this module into any route or
 * page today. Do not render this data as if it were live/published
 * content — it is illustrative only, and the backend equivalent used for
 * local Supabase CLI testing (supabase/seed.sql) is a separate,
 * independently hand-written fixture (see docs/PRODUCT_PIVOT.md).
 */
import type { Challenge } from './types'

export const DEMO_CHALLENGES: Challenge[] = [
  {
    id: 'demo-pocket-universe',
    slug: 'pocket-universe',
    title: '宝宝的口袋宇宙',
    teaser: '把宝宝喜欢的东西，变成一个独一无二的幻想世界。',
    description:
      '回答几个关于宝宝的小问题，生成一段专属的幻想世界插画 Prompt，复制给 ChatGPT 或其他图像生成工具，创作属于你家宝宝的口袋宇宙。',
    promptTemplate:
      '请根据以下信息创作一张精美的幻想世界插画：{{favorite_things}}。宝宝的特别习惯是：{{special_habit}}。整体氛围：{{mood}}。画面需要有连贯的场景构图、柔和温暖的光线，以及富有想象力的插画风格，避免卡通贴纸式的拼贴感，画面中不要出现文字。',
    ctaLabel: '我也想试试',
    status: 'published',
    displayOrder: 1,
    artworks: [],
    questions: [
      {
        id: 'demo-pu-q1',
        challengeId: 'demo-pocket-universe',
        questionKey: 'favorite_things',
        promptLabel: '宝宝最近最喜欢什么？',
        questionType: 'short_text',
        isRequired: true,
        maxLength: 200,
        displayOrder: 1,
      },
      {
        id: 'demo-pu-q2',
        challengeId: 'demo-pocket-universe',
        questionKey: 'special_habit',
        promptLabel: '宝宝有什么特别的小习惯？',
        questionType: 'short_text',
        isRequired: false,
        maxLength: 200,
        displayOrder: 2,
      },
      {
        id: 'demo-pu-q3',
        challengeId: 'demo-pocket-universe',
        questionKey: 'mood',
        promptLabel: '你希望这个世界是什么感觉？',
        questionType: 'single_choice',
        isRequired: true,
        maxLength: 200,
        displayOrder: 3,
        options: [
          { value: 'warm_dreamy', label: '温暖、梦幻' },
          { value: 'adventurous', label: '有一点冒险感' },
          { value: 'calm', label: '安静、治愈' },
          { value: 'playful', label: '活泼、有趣' },
        ],
      },
    ],
  },
  {
    id: 'demo-secret-room',
    slug: 'secret-room',
    title: '宝宝的秘密房间',
    teaser: '如果宝宝拥有一间完全属于自己的奇妙房间……',
    description: '描述宝宝的喜好和性格，生成一段专属的"秘密房间"插画 Prompt。',
    promptTemplate:
      '请创作一幅温馨奇幻的儿童房间插画，房间主人喜欢：{{favorite_things}}。房间里藏着一个小秘密：{{secret_detail}}。整体氛围：{{mood}}。使用柔和的室内光线与细腻的插画质感，不要出现文字。',
    ctaLabel: '我也想试试',
    status: 'published',
    displayOrder: 2,
    artworks: [],
    questions: [
      {
        id: 'demo-sr-q1',
        challengeId: 'demo-secret-room',
        questionKey: 'favorite_things',
        promptLabel: '宝宝最近最喜欢什么？',
        questionType: 'short_text',
        isRequired: true,
        maxLength: 200,
        displayOrder: 1,
      },
      {
        id: 'demo-sr-q2',
        challengeId: 'demo-secret-room',
        questionKey: 'secret_detail',
        promptLabel: '这个房间里藏着什么小秘密？',
        questionType: 'long_text',
        isRequired: false,
        maxLength: 500,
        displayOrder: 2,
      },
      {
        id: 'demo-sr-q3',
        challengeId: 'demo-secret-room',
        questionKey: 'mood',
        promptLabel: '你希望这个房间是什么感觉？',
        questionType: 'single_choice',
        isRequired: true,
        maxLength: 200,
        displayOrder: 3,
        options: [
          { value: 'cozy', label: '温馨' },
          { value: 'magical', label: '奇幻' },
          { value: 'adventurous', label: '冒险' },
        ],
      },
    ],
  },
  {
    id: 'demo-life-movie-poster',
    slug: 'life-movie-poster',
    title: '宝宝的人生电影',
    teaser: '把宝宝日常生活中的小故事，变成一张电影海报。',
    description: '这个挑战仍在筹备中，尚未对外发布 —— 用于演示草稿（draft）状态的内容模型。',
    promptTemplate: '请将以下小故事设计成一张电影海报：{{daily_story}}。整体氛围：{{mood}}。',
    ctaLabel: '我也想试试',
    status: 'draft',
    displayOrder: 3,
    artworks: [],
    questions: [
      {
        id: 'demo-lmp-q1',
        challengeId: 'demo-life-movie-poster',
        questionKey: 'daily_story',
        promptLabel: '宝宝最近发生了什么好玩的小故事？',
        questionType: 'long_text',
        isRequired: true,
        maxLength: 500,
        displayOrder: 1,
      },
      {
        id: 'demo-lmp-q2',
        challengeId: 'demo-life-movie-poster',
        questionKey: 'mood',
        promptLabel: '这张海报整体氛围是？',
        questionType: 'single_choice',
        isRequired: true,
        maxLength: 200,
        displayOrder: 2,
        options: [
          { value: 'heartwarming', label: '温馨' },
          { value: 'epic', label: '史诗感' },
          { value: 'comedic', label: '搞笑' },
        ],
      },
    ],
  },
]
