globalThis.ngJest = {skipNgcc:false, tsconfig:"tsconfig.spec.json"}

module.exports = {
    preset: "jest-preset-angular",
    testEnvironment: "jsdom",
    moduleFileExtensions: ["ts", "js", "html"],
    coverageReporters: ["html", "text-summary"],
    transformIgnorePatterns: ["node_modules/(?!.*\\.mjs$)"],
    setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
    collectCoverage: true,
    collectCoverageFrom: ["src/**/*.ts", "!src/main.ts", "!src/environments/**"],
    coveragePathIgnorePatterns: [
        "<rootDir>/src/index\\.ts$",      // Ignora el index.ts en src/
        "<rootDir>/src/.*/index\\.ts$",   // Ignora cualquier index.ts en subcarpetas
        "<rootDir>/src/main\\.ts$",
        "<rootDir>/src/app/lib/modal/services/modal.service.ts" ,      // Ignora main.ts
        "<rootDir>/src/environments/",    // Ignora carpetas de entorno
        "<rootDir>/src/app/app.config\\.ts$",  // Ignora app.config.ts
        "<rootDir>/src/app/app.routes\\.ts$",  // Ignora app.routes.ts
        
      ],
      
      
  };
  