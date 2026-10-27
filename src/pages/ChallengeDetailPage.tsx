import { useEffect, useRef, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { analytics } from '../analytics'
import { ArtworkPlaceholder } from '../components/ArtworkPlaceholder'
import { LinkButton } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import type { AnswersByQuestionKey } from '../content/promptTemplate'
import { resolvePromptTemplate } from '../content/promptTemplate'
import type { ChallengeArtwork } from '../content/types'
import { useChallenge } from '../content/useChallenges'
import { ChallengeQuestionnaire } from '../features/challengeCreator/ChallengeQuestionnaire'
import { PromptResult } from '../features/challengeCreator/PromptResult'
import { t } from '../i18n'

type Phase = 'form' | 'result'

function featuredArtwork(artworks: ChallengeArtwork[]): ChallengeArtwork | undefined {
  return artworks.find((artwork) => artwork.isFeatured) ?? artworks[0]
}

/**
 * The challenge detail page — an "open picture book": large example
 * artwork, a short introduction, the dynamic questionnaire, and the
 * generated prompt result. Everything here is driven by `Challenge` data
 * loaded through `useChallenge`, so it works for any admin-published
 * challenge without a dedicated page per challenge (Phase 2 brief §6).
 *
 * An unknown slug and a *draft* slug behave identically on the public
 * site — both render the same "not found" state — because
 * `contentRepository` never resolves unpublished content here.
 */
export function ChallengeDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const location = useLocation()
  const { data: challenge, loading } = useChallenge(slug)

  const [phase, setPhase] = useState<Phase>('form')
  const [answers, setAnswers] = useState<AnswersByQuestionKey>({})
  const [prompt, setPrompt] = useState('')
  const hasFiredOpenedEvent = useRef(false)

  useEffect(() => {
    if (challenge && !hasFiredOpenedEvent.current) {
      hasFiredOpenedEvent.current = true
      const source = (location.state as { source?: string } | null)?.source ?? 'direct'
      analytics.track('challenge_opened', { challengeSlug: challenge.slug, source })
    }
  }, [challenge, location.state])

  if (loading) {
    return (
      <Container className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="motion-safe:animate-pulse text-sm text-ink-700/55">{t.home.galleryLoading}</p>
      </Container>
    )
  }

  if (!challenge) {
    return (
      <Container className="flex flex-col items-center gap-5 py-24 text-center">
        <h1 className="text-2xl font-medium sm:text-3xl">{t.challenge.notFoundTitle}</h1>
        <p className="max-w-md text-base text-ink-700/80">{t.challenge.notFoundBody}</p>
        <LinkButton to="/" variant="primary">
          {t.challenge.backToGallery}
        </LinkButton>
      </Container>
    )
  }

  // Extracted into stable locals (rather than referencing `challenge.*`
  // directly) so the closures below don't need redundant non-null
  // assertions — TypeScript's narrowing of `challenge` from the guard
  // above doesn't extend into nested function declarations.
  const { slug: challengeSlug, promptTemplate, questions } = challenge
  const artwork = featuredArtwork(challenge.artworks)

  function handleFirstInteraction() {
    analytics.track('prompt_started', { challengeSlug })
  }

  function handleSubmitAnswers(submittedAnswers: AnswersByQuestionKey) {
    setAnswers(submittedAnswers)
    const resolved = resolvePromptTemplate(promptTemplate, questions, submittedAnswers)
    setPrompt(resolved)
    setPhase('result')
    analytics.track('prompt_generated', { challengeSlug })
  }

  return (
    <Container className="flex flex-col gap-8 py-8 sm:py-10">
      <LinkButton to="/" variant="ghost" className="self-start">
        {t.challenge.backToGallery}
      </LinkButton>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-start">
        <ArtworkPlaceholder
          altText={artwork?.altText ?? challenge.teaser}
          aspect="square"
          size="hero"
          rotate="left"
        />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-700/45">
              {t.challenge.introLabel}
            </span>
            <h1 className="text-balance text-2xl font-medium sm:text-3xl">{challenge.title}</h1>
            <p className="text-balance text-base text-ink-700/80">{challenge.description}</p>
            {challenge.styleNotes && (
              <p className="text-sm italic text-ink-700/55">{challenge.styleNotes}</p>
            )}
          </div>

          <div className="rounded-3xl bg-cream-100 p-5 shadow-[var(--shadow-card)] sm:p-6">
            {phase === 'form' ? (
              <ChallengeQuestionnaire
                questions={challenge.questions}
                initialAnswers={answers}
                onSubmit={handleSubmitAnswers}
                onFirstInteraction={handleFirstInteraction}
              />
            ) : (
              <PromptResult
                challengeSlug={challenge.slug}
                prompt={prompt}
                onEditAnswers={() => setPhase('form')}
              />
            )}
          </div>
        </div>
      </div>
    </Container>
  )
}
