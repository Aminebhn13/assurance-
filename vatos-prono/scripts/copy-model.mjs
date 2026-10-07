// Copie le modèle de prédiction du front vers les Edge Functions (Deno)
// pour que site et serveur calculent exactement la même chose.
import { readFileSync, writeFileSync } from 'node:fs';

const banner = '// Fichier généré par scripts/copy-model.mjs — modifier src/lib/ à la place.\n';
writeFileSync('supabase/functions/_shared/types.ts', banner + readFileSync('src/lib/types.ts', 'utf8'));
writeFileSync('supabase/functions/_shared/model.ts', banner + readFileSync('src/lib/model.ts', 'utf8').replace("from './types'", "from './types.ts'"));
console.log('Modèle copié dans supabase/functions/_shared/');
