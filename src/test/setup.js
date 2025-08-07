// src/test/setup.js
import '@testing-library/jest-dom'
// import { server } from '../mocks/server'

// Establish API mocking before all tests.
// beforeAll(() => server.listen())
// // Reset any request handlers after each test
// afterEach(() => server.resetHandlers())
// // Clean up after the tests are finished.
// afterAll(() => server.close())
Object.defineProperty(globalThis, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
})
