import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Este protótipo usa os arrays de src/data/mock/* como "banco de dados" em
    // memória: várias interações (Resolve with AI, resolver/escalar ticket, editar
    // documento de knowledge) gravam de volta nesses objetos de propósito, para que
    // o efeito sobreviva à navegação dentro da sessão sem precisar de um store real.
    // As regras de pureza do React Compiler (react-hooks/immutability, .../purity)
    // assumem memoização automática, que não está habilitada aqui — desligamos essas
    // duas regras em vez de espalhar disables pontuais que o plugin não reconhece
    // de forma consistente.
    rules: {
      "react-hooks/immutability": "off",
      "react-hooks/purity": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
