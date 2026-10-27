import '@testing-library/jest-dom/vitest'

// jsdom doesn't implement IntersectionObserver. ProductCard uses it purely
// to fire an analytics impression event, so a minimal no-op stub (not a
// full implementation of the DOM interface) is enough for every test that
// renders it.
class IntersectionObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): [] {
    return []
  }
}

if (typeof globalThis.IntersectionObserver === 'undefined') {
  globalThis.IntersectionObserver = IntersectionObserverStub as unknown as typeof IntersectionObserver
}
