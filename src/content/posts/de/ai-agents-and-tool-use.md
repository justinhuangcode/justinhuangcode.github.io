---
title: KI-Agenten und Tool-Nutzung (Beispiel)
date: 2026-01-09
category: AI
description: Wie KI-Modelle über Chat hinausgehen und Aktionen in der realen Welt ausführen
tags: [AI, Agents]
pinned: false
---

Ein KI-Agent ist ein Sprachmodell, das handeln kann — nicht nur Text generieren. Es kann das Web durchsuchen, Code ausführen, APIs aufrufen, Dateien lesen und entscheiden, was als Nächstes zu tun ist. Dieser Wandel von passiver Textgenerierung zu aktivem Problemlösen ist eine der bedeutendsten Entwicklungen in der angewandten KI.

## Vom Chat zur Aktion

Ein Chatbot beantwortet Fragen. Ein Agent löst Probleme. Der Unterschied ist Autonomie: Agenten entscheiden, welche Tools sie verwenden, in welcher Reihenfolge und wie sie mit Fehlern umgehen.

Betrachten Sie den praktischen Unterschied. Sie fragen einen Chatbot: „Wie ist das Wetter in Tokyo?" Er antwortet möglicherweise basierend auf seinen Trainingsdaten — die Monate oder Jahre alt und fast sicher falsch sind. Sie fragen einen Agenten dieselbe Frage, und er ruft eine Wetter-API auf, holt die aktuellen Daten und liefert eine genaue, aktuelle Antwort.

Der Chatbot generiert plausiblen Text. Der Agent interagiert mit der Welt.

### Das Spektrum der Autonomie

Nicht alle Agenten sind gleich autonom. Es gibt ein Spektrum:

1. **Tool-unterstützter Chat** — das Modell kann Tools aufrufen, aber nur als direkte Antwort auf Benutzeranfragen. Ein Tool-Aufruf pro Runde.
2. **Mehrstufige Agenten** — das Modell kann mehrere Tool-Aufrufe verketten, um eine Aufgabe zu erledigen, und entscheidet die Reihenfolge selbst.
3. **Vollautonome Agenten** — das Modell arbeitet über längere Zeiträume selbstständig, trifft Entscheidungen, behandelt Fehler und verfolgt Ziele mit minimaler menschlicher Aufsicht.

Die meisten Produktionssysteme befinden sich heute auf Stufe 1-2. Vollautonome Agenten sind ein aktives Forschungsgebiet mit noch zu lösenden Sicherheitsherausforderungen.

## Tool-Nutzung

Tool-Nutzung ermöglicht einem KI-Modell, externe Funktionen aufzurufen. Das Modell entscheidet, wann ein Tool benötigt wird, generiert die richtigen Parameter und integriert das Ergebnis in seine Antwort. Dies verwandelt einen Textgenerator in einen leistungsfähigen Assistenten.

### Wie Tool-Nutzung funktioniert

Die Mechanik ist geradlinig:

1. **Tool-Definition** — Sie beschreiben dem Modell die verfügbaren Tools, einschließlich ihrer Namen, Parameter und Funktionen. Dies wird typischerweise als strukturiertes JSON im System-Prompt oder über ein dediziertes API-Feld bereitgestellt.
2. **Entscheidung** — bei der Verarbeitung einer Benutzeranfrage entscheidet das Modell, ob ein Tool hilfreich wäre. Falls ja, generiert es einen Tool-Aufruf mit den entsprechenden Parametern.
3. **Ausführung** — Ihre Anwendung führt den Tool-Aufruf aus (das Modell führt ihn nicht direkt aus) und gibt das Ergebnis zurück.
4. **Integration** — das Modell integriert das Tool-Ergebnis in seine Antwort an den Benutzer.

### Beispiel einer Tool-Definition

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

Das Modell sieht diese Definition und weiß, dass es Dokumentation durchsuchen kann. Wenn ein Benutzer eine Produktfrage stellt, generiert das Modell einen Aufruf wie `search_documentation(query="how to reset password")`, Ihr System führt die Suche aus, und das Modell verwendet die Ergebnisse, um eine genaue Antwort zu formulieren.

### Häufige Tool-Kategorien

Produktive Agentensysteme bieten typischerweise Tools in mehreren Kategorien:

- **Informationsabruf** — Websuche, Datenbankabfragen, Dateilesen, API-Aufrufe
- **Code-Ausführung** — Ausführen von Python, JavaScript oder Shell-Befehlen in einer Sandbox-Umgebung
- **Kommunikation** — E-Mails senden, Nachrichten posten, Tickets erstellen
- **Dateimanipulation** — Dateien erstellen, bearbeiten und organisieren
- **Systemoperationen** — Code deployen, Infrastruktur verwalten, CI-Pipelines ausführen

Die bereitgestellten Tools definieren die Grenzen dessen, was der Agent tun kann. Ein gut gestaltetes Tool-Set gibt dem Agenten genug Fähigkeiten, um nützlich zu sein, ohne genug Macht, um gefährlich zu sein.

## Agentische Schleifen

Das mächtigste Pattern ist die agentische Schleife: Das Modell plant einen Schritt, führt ihn aus, beobachtet das Ergebnis und entscheidet den nächsten Schritt. Diese Schleife setzt sich fort, bis die Aufgabe abgeschlossen ist oder das Modell feststellt, dass es nicht weitermachen kann.

### Die Schleife in der Praxis

Betrachten Sie einen Agenten, der einen fehlschlagenden Test debuggen soll:

1. **Planen** — „Ich sollte zuerst die Testdatei lesen, um zu verstehen, was sie testet"
2. **Ausführen** — ruft `read_file("tests/auth.test.ts")` auf
3. **Beobachten** — sieht, dass der Test einen 200-Status erwartet, aber 401 bekommt
4. **Planen** — „Ich sollte die Auth-Middleware prüfen, um zu sehen, was 401 zurückgibt"
5. **Ausführen** — ruft `read_file("src/middleware/auth.ts")` auf
6. **Beobachten** — findet einen Bug in der Token-Ablaufprüfung
7. **Planen** — „Ich sollte den Ablaufvergleich korrigieren"
8. **Ausführen** — ruft `edit_file(...)` mit der Korrektur auf
9. **Beobachten** — bestätigt, dass die Änderung vorgenommen wurde
10. **Planen** — „Ich sollte den Test ausführen, um die Korrektur zu verifizieren"
11. **Ausführen** — ruft `run_command("pnpm test tests/auth.test.ts")` auf
12. **Beobachten** — Test besteht
13. **Abgeschlossen** — meldet die Korrektur an den Benutzer

Jeder Schritt beinhaltet, dass das Modell über den aktuellen Zustand nachdenkt, entscheidet, was als Nächstes zu tun ist, und sich basierend auf seinen Entdeckungen anpasst. Dies unterscheidet sich grundlegend von einem linearen Skript — der Agent behandelt unerwartete Erkenntnisse und ändert den Kurs bei Bedarf.

### Fehlerbehandlung in der Schleife

Robuste Agenten müssen Fehler elegant behandeln. Ein Tool könnte einen Fehler zurückgeben, eine Datei existiert möglicherweise nicht, oder eine API könnte ratenlimitiert sein. Gutes Agentendesign umfasst:

- **Wiederholungslogik** — transiente Fehler mit Backoff wiederholen
- **Alternative Strategien** — wenn ein Ansatz fehlschlägt, einen anderen versuchen
- **Graceful Degradation** — wenn die Aufgabe nicht vollständig erledigt werden kann, so viel wie möglich abschließen und erklären, was übrig bleibt
- **Schleifenlimits** — eine maximale Anzahl von Iterationen festlegen, um Endlosschleifen zu verhindern

## Effektive Tools entwerfen

Die Qualität eines Agentensystems hängt stark von der Qualität seiner Tools ab. Schlecht gestaltete Tools führen zu verwirrten Agenten und falschen Ergebnissen.

### Prinzipien für Tool-Design

- **Klare Namen** — `search_users` ist besser als `query_db_1`. Das Modell verwendet den Namen, um zu entscheiden, wann es das Tool aufruft.
- **Beschreibende Parameter** — fügen Sie Beschreibungen für jeden Parameter hinzu. Das Modell liest diese Beschreibungen, um zu bestimmen, welche Werte es übergeben soll.
- **Fokussierter Umfang** — jedes Tool sollte eine Sache gut machen. Ein `read_file`-Tool und ein `write_file`-Tool sind besser als ein `file_operations`-Tool mit einem Mode-Parameter.
- **Nützliche Fehler** — geben Sie klare Fehlermeldungen zurück, die dem Modell helfen zu verstehen, was schiefgegangen ist und was es stattdessen versuchen sollte.
- **Idempotent wenn möglich** — Tools, die sicher wiederholt werden können, vereinfachen die Fehlerbehandlung.

## Risiken

Agenten, die handeln können, können falsch handeln. Sandboxing, Bestätigungsschritte und menschliche Überprüfung sind essentielle Sicherheitsmaßnahmen für jedes produktive Agentensystem.

### Risikokategorien

- **Destruktive Aktionen** — ein Agent mit Dateisystemzugriff könnte wichtige Dateien löschen. Ein Agent mit Datenbankzugriff könnte Tabellen löschen. Sandbox-Umgebungen und Berechtigungsgrenzen sind essentiell.
- **Datenexfiltration** — ein Agent, der sowohl sensible Daten lesen als auch Netzwerkanfragen stellen kann, könnte versehentlich (oder durch Prompt-Injection) Informationen leaken.
- **Unkontrollierte Kosten** — ein Agent in einer Schleife, der teure APIs aufruft, kann schnell erhebliche Kosten verursachen. Budgetlimits und Rate-Limiting sind praktische Notwendigkeiten.
- **Falsche Aktionen mit Überzeugung ausgeführt** — der Agent könnte eine Anfrage missverstehen und eine irreversible Aktion ausführen. Bei Hochrisiko-Operationen immer menschliche Bestätigung einfordern.

### Sicherheitsmuster

Produktive Agentensysteme sollten mehrere Sicherheitsmuster implementieren:

1. **Minimale Rechte** — geben Sie dem Agenten nur die Tools, die er für seine spezifische Aufgabe benötigt, nicht mehr
2. **Sandboxing** — führen Sie Code und Dateioperationen in isolierten Umgebungen aus
3. **Bestätigungsgates** — fordern Sie menschliche Genehmigung für destruktive oder irreversible Aktionen
4. **Audit-Logging** — protokollieren Sie jeden Tool-Aufruf und sein Ergebnis zur Überprüfung
5. **Kill-Switches** — stellen Sie Mechanismen bereit, um einen laufenden Agenten sofort zu stoppen
6. **Budgetlimits** — setzen Sie harte Obergrenzen für API-Aufrufe, Token-Nutzung und Rechenzeit

Das Ziel ist nicht, Agenten daran zu hindern, nützlich zu sein — es ist sicherzustellen, dass sie innerhalb wohldefinierter Grenzen nützlich sind.
