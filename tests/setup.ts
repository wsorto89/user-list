import { vi, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import createFetchMock from 'vitest-fetch-mock';

// const fetchMocker = createFetchMock(vi);

// fetchMocker.enableMocks();

// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
})