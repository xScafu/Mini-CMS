import { defineConfig, searchForWorkspaceRoot } from "vite";

export default defineConfig({
  server: {
    fs: {
      allow: [
        searchForWorkspaceRoot(process.cwd()), // permette la root del workspace
        "E:/", // percorso del tuo progetto su disco E
        // aggiungi 'H:/' se ti serve per file su quel disco
      ],
    },
  },
});
