---
title: 📝 Markdown Style Guide
date: 2026-01-02
category: Tutorial
description: A comprehensive guide to all supported Markdown features in Astro-Theme-Aither
tags: [Markdown, Guide]
pinned: true
---

This post demonstrates every Markdown feature supported by Astro-Theme-Aither. Use it as a reference when writing your own posts. Bookmark this page — it covers the full range of formatting options available to you.

## Headings

Use `##` for section headings, `###` for subsections, and `####` for sub-subsections. Avoid `#` in post content — the post title is already rendered as the top-level heading.

### Third-Level Heading

Third-level headings are ideal for breaking a section into distinct topics. They create visual hierarchy without being too prominent.

#### Fourth-Level Heading

Fourth-level headings work for fine-grained subsections. Use them sparingly — if your outline goes deeper than four levels, consider restructuring your content.

### Heading Best Practices

A few guidelines for effective heading use:

- **Do not skip levels** — go from `##` to `###`, never from `##` directly to `####`. Skipping levels breaks the document outline and can confuse screen readers.
- **Keep headings descriptive** — "Configuration" is better than "Setup Stuff." Readers scan headings before deciding whether to read a section.
- **Use sentence case** — capitalize the first word and proper nouns only. Title Case Feels Like Shouting In Long Documents.

## Paragraphs and Line Breaks

Regular paragraph text flows naturally. Leave a blank line between paragraphs to separate them.

This is a second paragraph. Keep paragraphs focused on one idea for the best reading experience.

When writing for the web, shorter paragraphs tend to work better than long blocks of text. A paragraph of three to five sentences is a comfortable reading unit on screens. If a paragraph runs beyond six or seven sentences, consider splitting it.

Single line breaks within a paragraph (without a blank line) will be treated as a space, not a new line. If you need a hard line break without starting a new paragraph, end the line with two spaces or use a `<br>` tag — though this is rarely needed in practice.

## Emphasis

- **Bold text** with `**double asterisks**`
- *Italic text* with `*single asterisks*`
- ***Bold and italic*** with `***triple asterisks***`
- ~~Strikethrough~~ with `~~double tildes~~`

### When to Use Each Style

**Bold** works best for key terms, important warnings, or definitions — anything the reader should not miss even when scanning. Use it for the most important phrase in a paragraph, not for entire sentences.

*Italics* are for emphasis within a sentence, book and publication titles, technical terms on first use, and foreign phrases. They provide a lighter emphasis than bold.

~~Strikethrough~~ is useful for showing corrections, deprecated information, or completed items in a changelog. It has a narrower set of use cases but is valuable when you need it.

## Links

[Inline link](https://astro.build) with `[text](url)` syntax.

Links can also reference other posts on your site using relative paths. Use descriptive link text — "read the markdown guide" is better than "click here." Good link text helps both readers and search engines understand where the link leads.

You can also create links that open in context by writing descriptive anchor text that reads naturally within the sentence. For example: the [Astro documentation](https://docs.astro.build) covers every feature in detail.

## Lists

Unordered list:

- First item
- Second item
  - Nested item
  - Another nested item
- Third item

Ordered list:

1. First step
2. Second step
   1. Sub-step one
   2. Sub-step two
3. Third step

Task list:

- [x] Set up the project
- [x] Write your first post
- [ ] Deploy to production

### List Formatting Tips

Lists are one of the most effective tools in web writing. They break up dense text, make information scannable, and clearly communicate sequences or collections of items.

**Use unordered lists** when the items have no inherent sequence — features, requirements, options, or examples.

**Use ordered lists** when sequence matters — steps in a process, ranked items, or instructions that must be followed in order.

**Use task lists** for tracking progress, project checklists, or to-do items. They render as interactive checkboxes in many Markdown viewers, though in a static blog they appear as visual indicators.

Keep list items parallel in structure. If the first item starts with a verb, all items should start with a verb. If the first item is a noun phrase, maintain that pattern throughout.

## Blockquotes

> The purpose of abstraction is not to be vague, but to create a new semantic level in which one can be absolutely precise.
>
> — Edsger W. Dijkstra

Nested blockquotes:

> First level
>
> > Second level
> >
> > > Third level

### Blockquote Usage

Blockquotes serve several purposes beyond quoting famous people:

- **Citing sources** — when referencing another article, book, or document
- **Callouts** — highlighting important information or warnings
- **Email-style quoting** — showing what someone said in a conversation you are responding to
- **Pull quotes** — drawing attention to a key passage from your own article

When using blockquotes for attribution, place the author name on a separate line preceded by an em dash, as shown in the Dijkstra example above.

## Code

Inline `code` with backticks. Use inline code for function names like `getPublishedPosts()`, file paths like `src/content/posts/`, command-line instructions like `pnpm dev`, and any literal values that appear in running text.

Code block with syntax highlighting:

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

### Code Block Tips

Always specify the language identifier after the opening triple backticks. This enables syntax highlighting, which dramatically improves readability. Common identifiers include `typescript`, `javascript`, `css`, `html`, `bash`, `json`, `python`, and `markdown`.

For shell commands, use `bash` or `sh`:

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev

# Build for production
pnpm build
```

For JSON configuration files:

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

Keep code blocks focused. Show only the relevant lines rather than pasting an entire file. If context is needed, add a comment indicating where the code lives.

## Tables

| Feature | Status | Notes |
|---|---|---|
| Dark mode | Supported | Light / Dark / System |
| RSS feed | Built-in | `/rss.xml` |
| Sitemap | Auto-generated | Via `@astrojs/sitemap` |
| SEO | Built-in | Open Graph + canonical |

Right-aligned and centered columns:

| Left | Center | Right |
|:---|:---:|---:|
| Text | Text | Text |
| Longer text | Longer text | Longer text |

### Table Guidelines

Tables work best for structured data with clear columns and rows. They are ideal for feature comparisons, configuration options, API parameters, and reference data.

Keep tables simple. If a table has more than five or six columns, it becomes difficult to read on mobile devices. Consider breaking complex tables into multiple smaller ones, or use a list format instead.

Column alignment is controlled with colons in the separator row:

- `:---` for left alignment (default)
- `:---:` for center alignment
- `---:` for right alignment

Use right alignment for numeric data so decimal points line up visually.

## Horizontal Rule

Use `---` to create a horizontal rule:

---

Content after the rule.

Horizontal rules are useful for separating major sections of a post, indicating a shift in topic, or visually breaking up very long articles. Use them judiciously — if you need frequent separators, headings might be a better structural choice.

## Images

Images are supported with standard Markdown syntax:

```markdown
![Alt text](./image.jpg)
```

This theme is typography-focused, but images work when you need them.

### Image Best Practices

- **Always include alt text** — it is essential for accessibility and also appears when images fail to load
- **Use descriptive file names** — `dashboard-error-state.png` is better than `screenshot-2.png`
- **Optimize file sizes** — compress images before adding them to your repository; large images slow down page loads
- **Consider the reading flow** — place images near the text that references them, not paragraphs away

## Putting It All Together

The Markdown features described in this guide cover the vast majority of what you will need for blog writing. The key to good Markdown is using the right element for the right purpose: headings for structure, emphasis for importance, lists for collections, code blocks for technical content, and paragraphs for everything else.

Write clearly, format consistently, and let the typography do its work.
