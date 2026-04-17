import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import { defineEcConfig } from 'astro-expressive-code';

export default defineEcConfig({
  plugins: [pluginLineNumbers()],
  defaultProps: {
    showLineNumbers: true,
    overridesByLang: {
      plaintext: { showLineNumbers: false },
      text: { showLineNumbers: false },
      txt: { showLineNumbers: false },
      bash: { showLineNumbers: false },
      sh: { showLineNumbers: false },
      shell: { showLineNumbers: false },
      shellscript: { showLineNumbers: false },
      mermaid: { showLineNumbers: false },
      markmap: { showLineNumbers: false },
    },
  },
});
