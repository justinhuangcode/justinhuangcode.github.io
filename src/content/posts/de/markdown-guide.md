---
title: 📝 Markdown Stilrichtlinie
date: 2026-01-02
category: Tutorial
description: Ein umfassender Leitfaden zu allen unterstützten Markdown-Features in Astro-Theme-Aither
tags: [Markdown, Guide]
pinned: true
---

Dieser Beitrag zeigt alle Markdown-Features, die Astro-Theme-Aither unterstützt. Nutzen Sie ihn als Referenz beim Schreiben Ihrer eigenen Beiträge. Setzen Sie ein Lesezeichen — er deckt die gesamte Bandbreite der verfügbaren Formatierungsoptionen ab.

## Überschriften

Verwenden Sie `##` für Abschnittsüberschriften, `###` für Unterabschnitte und `####` für Unter-Unterabschnitte. Vermeiden Sie `#` im Beitragsinhalt — der Beitragstitel wird bereits als Top-Level-Überschrift gerendert.

### Überschrift dritter Ebene

Überschriften dritter Ebene eignen sich ideal, um einen Abschnitt in verschiedene Themen zu unterteilen. Sie schaffen visuelle Hierarchie, ohne zu dominant zu wirken.

#### Überschrift vierter Ebene

Überschriften vierter Ebene eignen sich für feingliedrige Unterabschnitte. Setzen Sie sie sparsam ein — wenn Ihre Gliederung tiefer als vier Ebenen geht, sollten Sie Ihren Inhalt umstrukturieren.

### Best Practices für Überschriften

Einige Richtlinien für effektive Überschriftennutzung:

- **Keine Ebenen überspringen** — gehen Sie von `##` zu `###`, nie direkt von `##` zu `####`. Das Überspringen von Ebenen bricht die Dokumentstruktur und kann Screenreader verwirren.
- **Überschriften beschreibend halten** — „Konfiguration" ist besser als „Setup-Kram". Leser scannen Überschriften, bevor sie entscheiden, ob sie einen Abschnitt lesen.
- **Sentence Case verwenden** — nur das erste Wort und Eigennamen großschreiben.

## Absätze und Zeilenumbrüche

Normaler Absatztext fließt natürlich. Lassen Sie eine Leerzeile zwischen Absätzen, um sie zu trennen.

Dies ist ein zweiter Absatz. Halten Sie Absätze auf eine Idee fokussiert für das beste Leseerlebnis.

Beim Schreiben für das Web funktionieren kürzere Absätze tendenziell besser als lange Textblöcke. Ein Absatz mit drei bis fünf Sätzen ist eine komfortable Leseeinheit auf Bildschirmen. Wenn ein Absatz über sechs oder sieben Sätze hinausgeht, erwägen Sie, ihn aufzuteilen.

Einzelne Zeilenumbrüche innerhalb eines Absatzes (ohne Leerzeile) werden als Leerzeichen behandelt, nicht als neue Zeile. Wenn Sie einen harten Zeilenumbruch ohne neuen Absatz benötigen, beenden Sie die Zeile mit zwei Leerzeichen oder verwenden Sie ein `<br>`-Tag — obwohl das in der Praxis selten nötig ist.

## Hervorhebungen

- **Fetter Text** mit `**doppelten Sternchen**`
- *Kursiver Text* mit `*einfachen Sternchen*`
- ***Fett und kursiv*** mit `***dreifachen Sternchen***`
- ~~Durchgestrichen~~ mit `~~doppelten Tilden~~`

### Wann welchen Stil verwenden

**Fett** eignet sich am besten für Schlüsselbegriffe, wichtige Warnungen oder Definitionen — alles, was der Leser auch beim Überfliegen nicht verpassen sollte. Verwenden Sie es für die wichtigste Phrase in einem Absatz, nicht für ganze Sätze.

*Kursiv* eignet sich für Betonungen innerhalb eines Satzes, Buch- und Publikationstitel, Fachbegriffe bei der ersten Verwendung und fremdsprachige Ausdrücke. Es bietet eine leichtere Betonung als Fett.

~~Durchgestrichen~~ ist nützlich, um Korrekturen, veraltete Informationen oder abgeschlossene Punkte in einem Changelog anzuzeigen. Es hat ein engeres Einsatzgebiet, ist aber wertvoll, wenn man es braucht.

## Links

[Inline-Link](https://astro.build) mit `[Text](URL)` Syntax.

Links können auch auf andere Beiträge auf Ihrer Website mit relativen Pfaden verweisen. Verwenden Sie beschreibenden Linktext — „lesen Sie die Markdown-Anleitung" ist besser als „hier klicken". Guter Linktext hilft sowohl Lesern als auch Suchmaschinen zu verstehen, wohin der Link führt.

Sie können auch Links erstellen, die sich im Kontext einfügen, indem Sie beschreibenden Ankertext schreiben, der sich natürlich in den Satz einfügt. Zum Beispiel: die [Astro-Dokumentation](https://docs.astro.build) behandelt jedes Feature im Detail.

## Listen

Ungeordnete Liste:

- Erster Punkt
- Zweiter Punkt
  - Verschachtelter Punkt
  - Weiterer verschachtelter Punkt
- Dritter Punkt

Geordnete Liste:

1. Erster Schritt
2. Zweiter Schritt
   1. Unter-Schritt eins
   2. Unter-Schritt zwei
3. Dritter Schritt

Aufgabenliste:

- [x] Projekt einrichten
- [x] Ersten Beitrag schreiben
- [ ] In Produktion deployen

### Tipps zur Listenformatierung

Listen sind eines der effektivsten Werkzeuge beim Schreiben für das Web. Sie lockern dichten Text auf, machen Informationen scanbar und kommunizieren klar Abfolgen oder Sammlungen von Elementen.

**Verwenden Sie ungeordnete Listen**, wenn die Elemente keine inhärente Reihenfolge haben — Features, Anforderungen, Optionen oder Beispiele.

**Verwenden Sie geordnete Listen**, wenn die Reihenfolge wichtig ist — Schritte in einem Prozess, rangierte Elemente oder Anweisungen, die in einer bestimmten Reihenfolge befolgt werden müssen.

**Verwenden Sie Aufgabenlisten** zum Nachverfolgen von Fortschritten, Projekt-Checklisten oder To-do-Elemente.

Halten Sie Listenelemente in ihrer Struktur parallel. Wenn das erste Element mit einem Verb beginnt, sollten alle Elemente mit einem Verb beginnen.

## Zitate

> Der Zweck der Abstraktion ist nicht, vage zu sein, sondern eine neue semantische Ebene zu schaffen, in der man absolut präzise sein kann.
>
> — Edsger W. Dijkstra

Verschachtelte Zitate:

> Erste Ebene
>
> > Zweite Ebene
> >
> > > Dritte Ebene

### Verwendung von Zitaten

Zitate dienen mehreren Zwecken über das Zitieren berühmter Personen hinaus:

- **Quellen zitieren** — beim Verweisen auf einen anderen Artikel, ein Buch oder ein Dokument
- **Hinweise** — Hervorheben wichtiger Informationen oder Warnungen
- **E-Mail-Stil-Zitate** — zeigen, was jemand in einer Konversation gesagt hat, auf die Sie antworten
- **Pull-Zitate** — Aufmerksamkeit auf eine Schlüsselstelle aus Ihrem eigenen Artikel lenken

Platzieren Sie bei Zitaten mit Zuschreibung den Autorennamen in einer separaten Zeile mit einem Gedankenstrich davor, wie im Dijkstra-Beispiel oben gezeigt.

## Code

Inline-`Code` mit Backticks. Verwenden Sie Inline-Code für Funktionsnamen wie `getPublishedPosts()`, Dateipfade wie `src/content/posts/`, Kommandozeilenanweisungen wie `pnpm dev` und alle literalen Werte, die im Fließtext erscheinen.

Code-Block mit Syntax-Highlighting:

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

### Tipps für Code-Blöcke

Geben Sie immer den Sprach-Identifier nach den öffnenden dreifachen Backticks an. Dies aktiviert Syntax-Highlighting, was die Lesbarkeit dramatisch verbessert. Gängige Identifier sind `typescript`, `javascript`, `css`, `html`, `bash`, `json`, `python` und `markdown`.

Für Shell-Befehle verwenden Sie `bash` oder `sh`:

```bash
# Abhängigkeiten installieren
pnpm install

# Entwicklungsserver starten
pnpm dev

# Für Produktion bauen
pnpm build
```

Für JSON-Konfigurationsdateien:

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

Halten Sie Code-Blöcke fokussiert. Zeigen Sie nur die relevanten Zeilen, anstatt eine ganze Datei einzufügen. Wenn Kontext benötigt wird, fügen Sie einen Kommentar hinzu, der angibt, wo der Code liegt.

## Tabellen

| Feature | Status | Hinweise |
|---|---|---|
| Dark Mode | Unterstützt | Hell / Dunkel / System |
| RSS-Feed | Integriert | `/rss.xml` |
| Sitemap | Auto-generiert | Via `@astrojs/sitemap` |
| SEO | Integriert | Open Graph + Canonical |

Rechts- und zentriert ausgerichtete Spalten:

| Links | Zentriert | Rechts |
|:---|:---:|---:|
| Text | Text | Text |
| Längerer Text | Längerer Text | Längerer Text |

### Richtlinien für Tabellen

Tabellen funktionieren am besten für strukturierte Daten mit klaren Spalten und Zeilen. Sie eignen sich ideal für Feature-Vergleiche, Konfigurationsoptionen, API-Parameter und Referenzdaten.

Halten Sie Tabellen einfach. Wenn eine Tabelle mehr als fünf oder sechs Spalten hat, wird sie auf Mobilgeräten schwer lesbar. Erwägen Sie, komplexe Tabellen in mehrere kleinere aufzuteilen, oder verwenden Sie stattdessen ein Listenformat.

Spaltenausrichtung wird mit Doppelpunkten in der Trennzeile gesteuert:

- `:---` für Linksausrichtung (Standard)
- `:---:` für Zentrierung
- `---:` für Rechtsausrichtung

Verwenden Sie Rechtsausrichtung für numerische Daten, damit Dezimalpunkte optisch ausgerichtet sind.

## Horizontale Linie

Verwenden Sie `---` um eine horizontale Linie zu erstellen:

---

Inhalt nach der Linie.

Horizontale Linien sind nützlich, um große Abschnitte eines Beitrags zu trennen, einen Themenwechsel anzuzeigen oder sehr lange Artikel visuell aufzulockern. Setzen Sie sie bedacht ein — wenn Sie häufig Trennlinien benötigen, sind Überschriften möglicherweise die bessere strukturelle Wahl.

## Bilder

Bilder werden mit Standard-Markdown-Syntax unterstützt:

```markdown
![Alt-Text](./image.jpg)
```

Dieses Theme ist typografiezentriert, aber Bilder funktionieren, wenn Sie sie brauchen.

### Best Practices für Bilder

- **Immer Alt-Text einfügen** — er ist essentiell für Barrierefreiheit und erscheint auch, wenn Bilder nicht geladen werden können
- **Beschreibende Dateinamen verwenden** — `dashboard-error-state.png` ist besser als `screenshot-2.png`
- **Dateigrößen optimieren** — komprimieren Sie Bilder, bevor Sie sie zu Ihrem Repository hinzufügen; große Bilder verlangsamen den Seitenaufbau
- **Lesefluss beachten** — platzieren Sie Bilder in der Nähe des Textes, der sie referenziert, nicht Absätze entfernt

## Zusammenfassung

Die in diesem Leitfaden beschriebenen Markdown-Features decken die überwiegende Mehrheit dessen ab, was Sie zum Blogschreiben benötigen. Der Schlüssel zu gutem Markdown liegt darin, das richtige Element für den richtigen Zweck zu verwenden: Überschriften für Struktur, Hervorhebungen für Wichtigkeit, Listen für Sammlungen, Code-Blöcke für technische Inhalte und Absätze für alles andere.

Schreiben Sie klar, formatieren Sie konsistent und lassen Sie die Typografie ihre Arbeit tun.
