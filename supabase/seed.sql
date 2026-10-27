-- Local development seed data ONLY.
--
-- `supabase db reset` (and `supabase start` on a fresh volume) applies this
-- file automatically. It exists so a developer running the Supabase CLI
-- locally has something to look at and to exercise the published/draft RLS
-- behavior end-to-end, NOT as real production content.
--
-- Deliberately NOT included here: challenge_artworks rows. This project's
-- instructions are explicit that placeholder/fabricated artwork must never
-- be presented as finished exhibition pieces, and no real curated artwork
-- has been provided yet. Artwork upload is an admin feature (Phase 3); add
-- real images through the admin dashboard once it exists, or directly via
-- `supabase storage` for local testing.
--
-- Fixed UUIDs below are intentional (not gen_random_uuid()) so this file is
-- idempotent under `supabase db reset` and easy to reference while testing.

insert into public.challenges
  (id, slug, title, teaser, description, prompt_template, status, display_order)
values
  (
    '00000000-0000-0000-0000-000000000001',
    'pocket-universe',
    '宝宝的口袋宇宙',
    '把宝宝喜欢的东西，变成一个独一无二的幻想世界。',
    '回答几个关于宝宝的小问题，生成一段专属的幻想世界插画 Prompt，复制给 ChatGPT 或其他图像生成工具，创作属于你家宝宝的口袋宇宙。',
    '请根据以下信息创作一张精美的幻想世界插画：{{favorite_things}}。宝宝的特别习惯是：{{special_habit}}。整体氛围：{{mood}}。画面需要有连贯的场景构图、柔和温暖的光线，以及富有想象力的插画风格，避免卡通贴纸式的拼贴感，画面中不要出现文字。',
    'published',
    1
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'secret-room',
    '宝宝的秘密房间',
    '如果宝宝拥有一间完全属于自己的奇妙房间……',
    '描述宝宝的喜好和性格，生成一段专属的"秘密房间"插画 Prompt。',
    '请创作一幅温馨奇幻的儿童房间插画，房间主人喜欢：{{favorite_things}}。房间里藏着一个小秘密：{{secret_detail}}。整体氛围：{{mood}}。使用柔和的室内光线与细腻的插画质感，不要出现文字。',
    'published',
    2
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'life-movie-poster',
    '宝宝的人生电影',
    '把宝宝日常生活中的小故事，变成一张电影海报。',
    '这个挑战仍在筹备中，尚未对外发布——用于本地验证草稿（draft）状态不会出现在公开列表中。',
    '请将以下小故事设计成一张电影海报：{{daily_story}}。整体氛围：{{mood}}。',
    'draft',
    3
  )
on conflict (id) do nothing;

insert into public.challenge_questions
  (challenge_id, question_key, prompt_label, question_type, is_required, options, display_order, max_length)
values
  ('00000000-0000-0000-0000-000000000001', 'favorite_things', '宝宝最近最喜欢什么？', 'short_text', true, null, 1, 200),
  ('00000000-0000-0000-0000-000000000001', 'special_habit', '宝宝有什么特别的小习惯？', 'short_text', false, null, 2, 200),
  (
    '00000000-0000-0000-0000-000000000001',
    'mood',
    '你希望这个世界是什么感觉？',
    'single_choice',
    true,
    '[{"value":"warm_dreamy","label":"温暖、梦幻"},{"value":"adventurous","label":"有一点冒险感"},{"value":"calm","label":"安静、治愈"},{"value":"playful","label":"活泼、有趣"}]'::jsonb,
    3,
    200
  ),
  ('00000000-0000-0000-0000-000000000002', 'favorite_things', '宝宝最近最喜欢什么？', 'short_text', true, null, 1, 200),
  ('00000000-0000-0000-0000-000000000002', 'secret_detail', '这个房间里藏着什么小秘密？', 'long_text', false, null, 2, 500),
  (
    '00000000-0000-0000-0000-000000000002',
    'mood',
    '你希望这个房间是什么感觉？',
    'single_choice',
    true,
    '[{"value":"cozy","label":"温馨"},{"value":"magical","label":"奇幻"},{"value":"adventurous","label":"冒险"}]'::jsonb,
    3,
    200
  ),
  ('00000000-0000-0000-0000-000000000003', 'daily_story', '宝宝最近发生了什么好玩的小故事？', 'long_text', true, null, 1, 500),
  (
    '00000000-0000-0000-0000-000000000003',
    'mood',
    '这张海报整体氛围是？',
    'single_choice',
    true,
    '[{"value":"heartwarming","label":"温馨"},{"value":"epic","label":"史诗感"},{"value":"comedic","label":"搞笑"}]'::jsonb,
    2,
    200
  )
on conflict (challenge_id, question_key) do nothing;
