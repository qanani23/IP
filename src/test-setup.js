// Test Setup - Global mocks for browser APIs
import '@testing-library/jest-dom/vitest';

global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};
