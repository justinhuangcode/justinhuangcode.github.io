---
title: 📝 Guida allo stile Markdown
date: 2026-01-02
category: Tutorial
description: Una guida completa a tutte le funzionalita Markdown supportate in Astro-Theme-Aither
tags: [Markdown, Guide]
pinned: true
---

Questo post dimostra ogni funzionalita Markdown supportata da Astro-Theme-Aither. Usalo come riferimento quando scrivi i tuoi post. Aggiungi questa pagina ai preferiti — copre l'intera gamma di opzioni di formattazione disponibili.

## Titoli

Usa `##` per i titoli di sezione, `###` per le sottosezioni e `####` per le sotto-sottosezioni. Evita `#` nel contenuto del post — il titolo del post e gia renderizzato come titolo di primo livello.

### Titolo di terzo livello

I titoli di terzo livello sono ideali per suddividere una sezione in argomenti distinti. Creano gerarchia visiva senza essere troppo prominenti.

#### Titolo di quarto livello

I titoli di quarto livello funzionano per sottosezioni dettagliate. Usali con parsimonia — se la tua struttura va oltre quattro livelli, considera di ristrutturare il contenuto.

### Best practice per i titoli

Alcune linee guida per un uso efficace dei titoli:

- **Non saltare livelli** — vai da `##` a `###`, mai da `##` direttamente a `####`. Saltare livelli rompe la struttura del documento e puo confondere gli screen reader.
- **Mantieni i titoli descrittivi** — "Configurazione" e meglio di "Roba di setup." I lettori scansionano i titoli prima di decidere se leggere una sezione.
- **Usa il sentence case** — maiuscola solo per la prima parola e i nomi propri.

## Paragrafi e interruzioni di riga

Il testo dei paragrafi regolari scorre naturalmente. Lascia una riga vuota tra i paragrafi per separarli.

Questo e un secondo paragrafo. Mantieni i paragrafi focalizzati su un'idea per la migliore esperienza di lettura.

Quando scrivi per il web, paragrafi piu brevi tendono a funzionare meglio di lunghi blocchi di testo. Un paragrafo di tre-cinque frasi e un'unita di lettura confortevole sugli schermi. Se un paragrafo supera le sei-sette frasi, considera di dividerlo.

Le interruzioni di riga singole all'interno di un paragrafo (senza riga vuota) saranno trattate come uno spazio, non come una nuova riga. Se hai bisogno di un'interruzione forzata senza iniziare un nuovo paragrafo, termina la riga con due spazi o usa un tag `<br>` — anche se nella pratica e raramente necessario.

## Enfasi

- **Testo in grassetto** con `**doppi asterischi**`
- *Testo in corsivo* con `*singoli asterischi*`
- ***Grassetto e corsivo*** con `***tripli asterischi***`
- ~~Barrato~~ con `~~doppie tilde~~`

### Quando usare ogni stile

Il **grassetto** funziona meglio per termini chiave, avvisi importanti o definizioni — qualsiasi cosa il lettore non dovrebbe perdere anche scansionando. Usalo per la frase piu importante di un paragrafo, non per intere frasi.

Il *corsivo* e per l'enfasi all'interno di una frase, titoli di libri e pubblicazioni, termini tecnici al primo utilizzo e frasi straniere. Fornisce un'enfasi piu leggera del grassetto.

Il ~~barrato~~ e utile per mostrare correzioni, informazioni deprecate o elementi completati in un changelog. Ha un set piu ristretto di casi d'uso ma e prezioso quando serve.

## Link

[Link inline](https://astro.build) con sintassi `[testo](url)`.

I link possono anche riferirsi ad altri post sul tuo sito usando percorsi relativi. Usa testo descrittivo per il link — "leggi la guida markdown" e meglio di "clicca qui." Un buon testo del link aiuta sia i lettori che i motori di ricerca a capire dove porta il link.

Puoi anche creare link che si leggono nel contesto scrivendo testo anchor descrittivo che si legge naturalmente nella frase. Per esempio: la [documentazione Astro](https://docs.astro.build) copre ogni funzionalita nel dettaglio.

## Liste

Lista non ordinata:

- Primo elemento
- Secondo elemento
  - Elemento annidato
  - Altro elemento annidato
- Terzo elemento

Lista ordinata:

1. Primo passo
2. Secondo passo
   1. Sotto-passo uno
   2. Sotto-passo due
3. Terzo passo

Lista di attivita:

- [x] Configurare il progetto
- [x] Scrivere il primo post
- [ ] Distribuire in produzione

### Suggerimenti per la formattazione delle liste

Le liste sono uno degli strumenti piu efficaci nella scrittura web. Spezzano il testo denso, rendono le informazioni scansionabili e comunicano chiaramente sequenze o collezioni di elementi.

**Usa le liste non ordinate** quando gli elementi non hanno una sequenza intrinseca — funzionalita, requisiti, opzioni o esempi.

**Usa le liste ordinate** quando la sequenza conta — passaggi di un processo, elementi classificati o istruzioni che devono essere seguite in ordine.

**Usa le liste di attivita** per monitorare i progressi, checklist di progetto o elementi da fare. Si renderizzano come checkbox interattive in molti visualizzatori Markdown, anche se in un blog statico appaiono come indicatori visivi.

Mantieni gli elementi della lista paralleli nella struttura. Se il primo elemento inizia con un verbo, tutti gli elementi dovrebbero iniziare con un verbo.

## Citazioni

> Lo scopo dell'astrazione non e essere vaghi, ma creare un nuovo livello semantico in cui si puo essere assolutamente precisi.
>
> — Edsger W. Dijkstra

Citazioni annidate:

> Primo livello
>
> > Secondo livello
> >
> > > Terzo livello

### Uso delle citazioni

Le citazioni servono diversi scopi oltre a citare persone famose:

- **Citare fonti** — quando si fa riferimento a un altro articolo, libro o documento
- **Richiami** — evidenziare informazioni importanti o avvisi
- **Citazioni stile email** — mostrare cosa ha detto qualcuno in una conversazione a cui stai rispondendo
- **Citazioni estratte** — attirare l'attenzione su un passaggio chiave del proprio articolo

Quando usi le citazioni per attribuzione, posiziona il nome dell'autore su una riga separata preceduta da un trattino lungo, come mostrato nell'esempio di Dijkstra sopra.

## Codice

Codice `inline` con backtick. Usa il codice inline per nomi di funzione come `getPublishedPosts()`, percorsi di file come `src/content/posts/`, istruzioni da riga di comando come `pnpm dev` e qualsiasi valore letterale nel testo.

Blocco di codice con evidenziazione della sintassi:

```typescript
interface Post {
  title: string;
  date: Date;
  description?: string;
  tags?: string[];
  draft?: boolean;
}

function getPublishedPosts(posts: Post[]): Post[] {
  return posts
    .filter((post) => !post.draft)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}
```

```css
@theme {
  --font-sans: 'system-ui', sans-serif;
  --font-serif: 'ui-serif', 'Georgia', serif;
}
```

### Suggerimenti per i blocchi di codice

Specifica sempre l'identificatore del linguaggio dopo i tripli backtick di apertura. Questo abilita l'evidenziazione della sintassi, che migliora drasticamente la leggibilita. Identificatori comuni includono `typescript`, `javascript`, `css`, `html`, `bash`, `json`, `python` e `markdown`.

Per i comandi shell, usa `bash` o `sh`:

```bash
# Installa le dipendenze
pnpm install

# Avvia il server di sviluppo
pnpm dev

# Costruisci per la produzione
pnpm build
```

Per i file di configurazione JSON:

```json
{
  "name": "my-blog",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build"
  }
}
```

Mantieni i blocchi di codice focalizzati. Mostra solo le righe rilevanti piuttosto che incollare un intero file. Se serve contesto, aggiungi un commento che indichi dove si trova il codice.

## Tabelle

| Funzionalita | Stato | Note |
|---|---|---|
| Modalita scura | Supportata | Chiaro / Scuro / Sistema |
| Feed RSS | Integrato | `/rss.xml` |
| Sitemap | Auto-generata | Tramite `@astrojs/sitemap` |
| SEO | Integrato | Open Graph + canonico |

Colonne allineate a destra e centrate:

| Sinistra | Centro | Destra |
|:---|:---:|---:|
| Testo | Testo | Testo |
| Testo piu lungo | Testo piu lungo | Testo piu lungo |

### Linee guida per le tabelle

Le tabelle funzionano meglio per dati strutturati con colonne e righe chiare. Sono ideali per confronti di funzionalita, opzioni di configurazione, parametri API e dati di riferimento.

Mantieni le tabelle semplici. Se una tabella ha piu di cinque o sei colonne, diventa difficile da leggere su dispositivi mobili. Considera di suddividere tabelle complesse in piu tabelle piu piccole, o usa un formato a lista.

L'allineamento delle colonne e controllato con i due punti nella riga separatrice:

- `:---` per allineamento a sinistra (predefinito)
- `:---:` per allineamento al centro
- `---:` per allineamento a destra

Usa l'allineamento a destra per i dati numerici in modo che i punti decimali si allineino visivamente.

## Riga orizzontale

Usa `---` per creare una riga orizzontale:

---

Contenuto dopo la riga.

Le righe orizzontali sono utili per separare sezioni principali di un post, indicare un cambio di argomento o spezzare visivamente articoli molto lunghi. Usale con giudizio — se hai bisogno di separatori frequenti, i titoli potrebbero essere una scelta strutturale migliore.

## Immagini

Le immagini sono supportate con la sintassi Markdown standard:

```markdown
![Testo alternativo](./image.jpg)
```

Questo tema e focalizzato sulla tipografia, ma le immagini funzionano quando ne hai bisogno.

### Best practice per le immagini

- **Includi sempre il testo alternativo** — e essenziale per l'accessibilita e appare anche quando le immagini non si caricano
- **Usa nomi di file descrittivi** — `dashboard-error-state.png` e meglio di `screenshot-2.png`
- **Ottimizza le dimensioni dei file** — comprimi le immagini prima di aggiungerle al repository; immagini grandi rallentano il caricamento delle pagine
- **Considera il flusso di lettura** — posiziona le immagini vicino al testo che le riferisce, non a paragrafi di distanza

## Mettere tutto insieme

Le funzionalita Markdown descritte in questa guida coprono la stragrande maggioranza di cio di cui avrai bisogno per la scrittura del blog. La chiave per un buon Markdown e usare l'elemento giusto per lo scopo giusto: titoli per la struttura, enfasi per l'importanza, liste per le collezioni, blocchi di codice per il contenuto tecnico e paragrafi per tutto il resto.

Scrivi con chiarezza, formatta con coerenza e lascia che la tipografia faccia il suo lavoro.
