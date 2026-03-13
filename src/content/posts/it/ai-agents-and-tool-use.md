---
title: Agenti AI e utilizzo degli strumenti (Esempio)
date: 2026-01-09
category: AI
description: Come i modelli AI vanno oltre la chat eseguendo azioni nel mondo reale
tags: [AI, Agents]
pinned: false
---

Un agente AI e un modello linguistico capace di compiere azioni, non solo di generare testo. Puo cercare nel web, eseguire codice, chiamare API, leggere file e prendere decisioni su cosa fare dopo. Questo passaggio dalla generazione passiva di testo alla risoluzione attiva dei problemi rappresenta uno degli sviluppi piu significativi nell'AI applicata.

## Dalla chat all'azione

Un chatbot risponde alle domande. Un agente risolve problemi. La differenza sta nell'autonomia: gli agenti decidono quali strumenti usare, in quale ordine e come gestire gli errori.

Consideriamo la differenza nella pratica. Chiedi a un chatbot: "Che tempo fa a Tokyo?" Potrebbe rispondere basandosi sui dati di addestramento, vecchi di mesi o anni e quasi certamente errati. Fai la stessa domanda a un agente, e questo chiama un'API meteo, recupera i dati attuali e restituisce una risposta accurata e aggiornata.

Il chatbot genera testo plausibile. L'agente interagisce con il mondo.

### Lo spettro dell'autonomia

Non tutti gli agenti sono ugualmente autonomi. Esiste uno spettro:

1. **Chat assistita da strumenti** — il modello puo chiamare strumenti, ma solo in risposta diretta alle richieste dell'utente. Una chiamata per turno.
2. **Agenti multi-step** — il modello puo concatenare piu chiamate di strumenti per portare a termine un compito, decidendo la sequenza autonomamente.
3. **Agenti completamente autonomi** — il modello opera in modo indipendente per periodi prolungati, prendendo decisioni, gestendo errori e perseguendo obiettivi con supervisione umana minima.

La maggior parte dei sistemi in produzione oggi si colloca ai livelli 1-2. Gli agenti completamente autonomi sono un'area di ricerca attiva con sfide significative di sicurezza ancora da risolvere.

## Utilizzo degli strumenti

L'utilizzo degli strumenti permette a un modello AI di chiamare funzioni esterne. Il modello decide quando uno strumento e necessario, genera i parametri corretti e incorpora il risultato nella sua risposta. Questo trasforma un generatore di testo in un assistente capace.

### Come funziona l'utilizzo degli strumenti

La meccanica e semplice:

1. **Definizione dello strumento** — si descrivono gli strumenti disponibili al modello, includendo nomi, parametri e funzionalita. Tipicamente fornito come JSON strutturato nel prompt di sistema o tramite un campo API dedicato.
2. **Decisione** — durante l'elaborazione di una richiesta utente, il modello decide se uno strumento sarebbe utile. In caso affermativo, genera una chiamata con i parametri appropriati.
3. **Esecuzione** — l'applicazione esegue la chiamata (il modello non la esegue direttamente) e restituisce il risultato.
4. **Integrazione** — il modello incorpora il risultato nella risposta all'utente.

### Esempio di definizione dello strumento

```json
{
  "name": "search_documentation",
  "description": "Search the product documentation for relevant articles",
  "parameters": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "The search query"
      },
      "max_results": {
        "type": "integer",
        "description": "Maximum number of results to return",
        "default": 5
      }
    },
    "required": ["query"]
  }
}
```

Il modello vede questa definizione e sa di poter cercare nella documentazione. Quando un utente pone una domanda sul prodotto, il modello genera una chiamata come `search_documentation(query="come reimpostare la password")`, il sistema esegue la ricerca e il modello usa i risultati per comporre una risposta accurata.

### Categorie comuni di strumenti

I sistemi agentici in produzione offrono tipicamente strumenti in diverse categorie:

- **Recupero informazioni** — ricerca web, query al database, lettura file, chiamate API
- **Esecuzione di codice** — esecuzione di Python, JavaScript o comandi shell in un ambiente sandbox
- **Comunicazione** — invio email, pubblicazione messaggi, creazione ticket
- **Manipolazione file** — creazione, modifica e organizzazione di file
- **Operazioni di sistema** — deploy del codice, gestione dell'infrastruttura, esecuzione di pipeline CI

Gli strumenti che fornisci definiscono i confini di cio che l'agente puo fare. Un set di strumenti ben progettato offre all'agente capacita sufficienti per essere utile senza abbastanza potere per essere pericoloso.

## Loop agentici

Il pattern piu potente e il loop agentico: il modello pianifica un passo, lo esegue, osserva il risultato e decide il passo successivo. Questo ciclo continua fino al completamento del compito o finche il modello determina di non poter procedere.

### Il loop nella pratica

Consideriamo un agente incaricato di fare il debug di un test che fallisce:

1. **Pianifica** — "Dovrei prima leggere il file di test per capire cosa sta testando"
2. **Esegue** — chiama `read_file("tests/auth.test.ts")`
3. **Osserva** — vede che il test si aspetta un codice 200 ma riceve 401
4. **Pianifica** — "Dovrei controllare il middleware di autenticazione per vedere cosa restituisce 401"
5. **Esegue** — chiama `read_file("src/middleware/auth.ts")`
6. **Osserva** — trova che la logica di validazione del token ha un bug nel controllo della scadenza
7. **Pianifica** — "Dovrei correggere il confronto della scadenza"
8. **Esegue** — chiama `edit_file(...)` con la correzione
9. **Osserva** — conferma che la modifica e stata effettuata
10. **Pianifica** — "Dovrei eseguire il test per verificare la correzione"
11. **Esegue** — chiama `run_command("pnpm test tests/auth.test.ts")`
12. **Osserva** — il test passa
13. **Completa** — riferisce la correzione all'utente

Ogni passo implica che il modello ragioni sullo stato attuale, decida cosa fare dopo e si adatti in base a cio che scopre. Questo e fondamentalmente diverso da uno script lineare: l'agente gestisce scoperte inaspettate e cambia rotta quando necessario.

### Gestione degli errori nel loop

Gli agenti robusti devono gestire i fallimenti con grazia. Uno strumento potrebbe restituire un errore, un file potrebbe non esistere o un'API potrebbe essere soggetta a rate limiting. Un buon design degli agenti include:

- **Logica di retry** — riprovare i fallimenti transitori con backoff
- **Strategie alternative** — se un approccio fallisce, provarne un altro
- **Degradazione graduale** — se il compito non puo essere completato interamente, completare il piu possibile e spiegare cosa resta
- **Limiti del loop** — impostare un numero massimo di iterazioni per prevenire loop infiniti quando l'agente si blocca

## Progettare strumenti efficaci

La qualita di un sistema agentico dipende fortemente dalla qualita dei suoi strumenti. Strumenti mal progettati portano ad agenti confusi e risultati errati.

### Principi di progettazione degli strumenti

- **Nomi chiari** — `search_users` e meglio di `query_db_1`. Il modello usa il nome per decidere quando chiamare lo strumento.
- **Parametri descrittivi** — includere descrizioni per ogni parametro. Il modello legge queste descrizioni per determinare quali valori passare.
- **Ambito focalizzato** — ogni strumento dovrebbe fare una cosa bene. Uno strumento `read_file` e uno `write_file` sono meglio di uno strumento `file_operations` con un parametro di modalita.
- **Errori utili** — restituire messaggi di errore chiari che aiutino il modello a capire cosa e andato storto e cosa provare invece.
- **Idempotenti quando possibile** — strumenti che possono essere riprovati in sicurezza semplificano la gestione degli errori.

## Rischi

Gli agenti che possono compiere azioni possono compiere azioni sbagliate. Sandboxing, passaggi di conferma e revisioni human-in-the-loop sono misure di sicurezza essenziali per qualsiasi sistema agentico in produzione.

### Categorie di rischio

- **Azioni distruttive** — un agente con accesso al file system potrebbe eliminare file importanti. Un agente con accesso al database potrebbe cancellare tabelle. Ambienti sandbox e limiti di permessi sono essenziali.
- **Esfiltrazione di dati** — un agente che puo sia leggere dati sensibili che fare richieste di rete potrebbe inavvertitamente (o tramite prompt injection) far trapelare informazioni.
- **Costi fuori controllo** — un agente in un loop che chiama API costose puo accumulare costi significativi rapidamente. Limiti di budget e rate limiting sono necessita pratiche.
- **Azioni errate compiute con sicurezza** — l'agente potrebbe fraintendere una richiesta e compiere un'azione irreversibile. Per operazioni ad alto rischio, richiedere sempre la conferma umana.

### Pattern di sicurezza

I sistemi agentici in produzione dovrebbero implementare diversi pattern di sicurezza:

1. **Privilegio minimo** — dare all'agente solo gli strumenti necessari per il suo compito specifico, niente di piu
2. **Sandboxing** — eseguire codice e operazioni sui file in ambienti isolati
3. **Gate di conferma** — richiedere approvazione umana per azioni distruttive o irreversibili
4. **Logging di audit** — registrare ogni chiamata di strumento e il suo risultato per la revisione
5. **Interruttori di emergenza** — fornire meccanismi per fermare immediatamente un agente in esecuzione
6. **Limiti di budget** — impostare tetti rigidi su chiamate API, utilizzo di token e tempo di calcolo

L'obiettivo non e impedire agli agenti di essere utili, ma assicurare che siano utili entro confini ben definiti.
