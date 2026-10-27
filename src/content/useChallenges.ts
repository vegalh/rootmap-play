/**
 * Thin React data-fetching hooks over `contentRepository`. Kept separate
 * from the repository itself (which is framework-agnostic) so the
 * repository stays trivially unit-testable without React.
 */
import { useEffect, useState } from 'react'
import { contentRepository } from './contentRepository'
import type { Challenge } from './types'

interface AsyncState<T> {
  data: T | undefined
  loading: boolean
  error: boolean
}

/** All published challenges, ordered for display. */
export function useChallenges(): AsyncState<Challenge[]> {
  const [state, setState] = useState<AsyncState<Challenge[]>>({
    data: undefined,
    loading: true,
    error: false,
  })

  useEffect(() => {
    let cancelled = false
    setState({ data: undefined, loading: true, error: false })

    contentRepository
      .listPublishedChallenges()
      .then((challenges) => {
        if (!cancelled) setState({ data: challenges, loading: false, error: false })
      })
      .catch(() => {
        if (!cancelled) setState({ data: undefined, loading: false, error: true })
      })

    return () => {
      cancelled = true
    }
  }, [])

  return state
}

/** A single published challenge by slug, or `data: undefined` once loaded if not found/published. */
export function useChallenge(slug: string | undefined): AsyncState<Challenge> {
  const [state, setState] = useState<AsyncState<Challenge>>({
    data: undefined,
    loading: true,
    error: false,
  })

  useEffect(() => {
    if (!slug) {
      setState({ data: undefined, loading: false, error: false })
      return
    }

    let cancelled = false
    setState({ data: undefined, loading: true, error: false })

    contentRepository
      .getChallengeBySlug(slug)
      .then((challenge) => {
        if (!cancelled) setState({ data: challenge, loading: false, error: false })
      })
      .catch(() => {
        if (!cancelled) setState({ data: undefined, loading: false, error: true })
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  return state
}
