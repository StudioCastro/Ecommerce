import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Projeto hospedado em https://studiocastro.github.io/Ecommerce/ (Pages de projeto, não
  // de usuário/organização) — sem isso, os assets buildados apontam para "/assets/..." em vez
  // de "/Ecommerce/assets/...", resultando em 404 e tela branca.
  base: process.env.GITHUB_ACTIONS ? "/Ecommerce/" : "/",
  plugins: [react()],
});
