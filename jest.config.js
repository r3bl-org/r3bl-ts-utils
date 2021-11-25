module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  projects: [
    {
      displayName: "node:🟡 env project",
      transform: {
        "^.+\\.(t|j)sx?$": "ts-jest",
      },
      testEnvironment: "node",
      testMatch: ["**/__tests__/**/*.test.ts?(x)"],
    },
    {
      displayName: "jsdom:🟢 browser env project",
      transform: {
        "^.+\\.(t|j)sx?$": "ts-jest",
      },
      testEnvironment: "jsdom",
      testMatch: ["**/__tests__/**/*.test.jsdom.ts?(x)"],
    },
  ],
}
