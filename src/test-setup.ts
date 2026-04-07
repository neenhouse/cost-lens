import "@testing-library/jest-dom/vitest";

// jsdom does not implement ResizeObserver — mock it so recharts ResponsiveContainer works
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
