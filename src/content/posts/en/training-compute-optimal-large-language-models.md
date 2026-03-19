---
title: "Paper Reading: Training Compute-Optimal Large Language Models"
date: "2026-03-11T16:58:04+08:00"
category: "Paper Reading"
description: The Chinchilla paper — why most large models were undertrained, and how to spend your compute budget wisely, with core code reimplemented in Rust
tags: [paper-reading, chinchilla, scaling-laws, AI, LLM, rust]
pinned: false
---

On March 29, 2022, a team of researchers from DeepMind uploaded a paper to arXiv (a preprint server where researchers can publish papers without waiting for journal peer review): [*Training Compute-Optimal Large Language Models*](/papers/2203.15556v1.pdf).

The first author is Jordan Hoffmann, with co-authors including Sebastian Borgeaud, Arthur Mensch, Elena Buchatskaya, Trevor Cai, Eliza Rutherford, and many others — all at DeepMind at the time. Arthur Mensch would later co-found Mistral AI, one of Europe's most prominent AI companies.

The paper is often called the "Chinchilla paper," after the 70-billion-parameter model the team trained to validate their findings. That name stuck — not the paper's title, but the animal. In AI circles, "Chinchilla scaling" became shorthand for the paper's central claim.

And that claim was simple, bold, and uncomfortable for most of the industry: **many of the biggest language models of 2022 were not "too small" — they were significantly undertrained given their compute budgets.**

## 1. The Question

By early 2022, the AI community had internalized a clear lesson from [Kaplan et al. (2020)](/posts/scaling-laws-for-neural-language-models/): bigger models are predictably better. The scaling laws paper had shown that performance follows power laws, and that for a given compute budget, you should make the model as large as possible.

The industry took that advice to heart. By spring 2022, GPT-3 had 175 billion parameters trained on 300 billion tokens. DeepMind's own Gopher had 280 billion parameters trained on 300 billion tokens. Google would soon release PaLM with 540 billion parameters. The trend was clear: crank up the parameter count.

But there was a problem hiding in plain sight. Kaplan et al. had concluded that when you scale compute, most of the budget should go to model size (N ∝ C^0.73) and relatively little to training data (D ∝ C^0.27). This meant: make the model huge, train it on a moderate amount of data.

Hoffmann's team asked a simple question: is that actually right?

## 2. Three Independent Approaches, One Answer

What makes this paper unusually convincing is its methodology. The team did not rely on a single experiment. They approached the same question from three completely independent angles, and all three converged on the same answer.

**Approach 1: Fix the compute, vary the split.** They trained over 400 models ranging from 70 million to over 16 billion parameters, each with a different allocation between model size and training data, but with the same total compute. For each compute level, they found which model size minimized loss.

**Approach 2: IsoFLOP profiles.** They trained models of 9 different sizes (from 70M to 10B parameters) on varying amounts of data, specifically designed so each group of runs used approximately the same total compute. Then they fit curves to find the optimal model size for each compute level.

**Approach 3: Fit a parametric loss function.** They fit the following equation to all their training runs:

> L̂(N, D) = E + A / N^α + B / D^β

Where E is the irreducible loss (the entropy of natural language — no model can do better), A/N^α captures the model-size bottleneck, and B/D^β captures the data bottleneck. From the fitted parameters, they derived optimal N and D as functions of compute.

All three approaches agreed:

> N_opt ∝ C^a, D_opt ∝ C^b, where a ≈ 0.50, b ≈ 0.50

```rust
// Rust

/// The Chinchilla paper's central finding:
/// model size and training tokens should scale EQUALLY with compute.
///
/// Kaplan et al. (2020) said: N ∝ C^0.73, D ∝ C^0.27 (favor model size)
/// Chinchilla (2022) says: N ∝ C^0.50, D ∝ C^0.50 (scale both equally)
fn optimal_scaling(compute: f64) -> (f64, f64) {
    // Approach 1: a = 0.50, b = 0.50
    // Approach 2: a = 0.49, b = 0.51
    // Approach 3: a = 0.46, b = 0.54
    let a = 0.50;
    let b = 0.50;
    let n_opt = compute.powf(a);  // optimal model parameters
    let d_opt = compute.powf(b);  // optimal training tokens
    (n_opt, d_opt)
}

/// What this means in practice:
/// If your compute budget grows 10x, you should make the model ~3.2x bigger
/// AND train on ~3.2x more data.
///
/// Kaplan would have said: make it ~5.4x bigger, barely increase data.
/// The difference is enormous at scale.
```

The exponents a ≈ b ≈ 0.5 mean that as compute grows, model size and training data should scale at approximately the same rate. When compute grows 10x, both should increase by roughly 3.2x; when compute doubles, both increase by roughly 1.4x. In other words, for every doubling of model size, the number of training tokens should also double. This directly contradicts Kaplan et al., who said compute should be spent primarily on model size.

## 3. Why Kaplan Got It Wrong

This is not a matter of one team getting it wrong. Both teams did rigorous work. The difference lies in experimental setup, which ultimately led to different optimal-allocation conclusions.

Kaplan et al. used a fixed learning rate schedule that did not adjust for training duration. When you train a model for more steps without adjusting the learning rate schedule, performance suffers — not because the model is inherently worse, but because the optimization is suboptimal. This made long training runs look less effective than they actually are, biasing the results toward larger models trained for fewer steps.

Hoffmann's team adjusted the learning rate schedule for each training run, ensuring each configuration got a fair shot. When you do this, training longer on more data turns out to be much more valuable than Kaplan's numbers suggested.

```rust
// Rust

/// The methodological difference that changed the answer:
///
/// Kaplan: fixed learning rate schedule for all runs
///   → longer training looks worse than it is
///   → conclusion: spend compute on model size, not training duration
///
/// Chinchilla: adjusted learning rate schedule per run
///   → each run is fairly optimized
///   → conclusion: spend compute equally on model size and data
///
/// This is a reminder that scaling laws are empirical —
/// they describe behavior under specific experimental conditions.
/// Change the conditions, change the law.

struct TrainingConfig {
    n_params: f64,
    n_tokens: f64,
    learning_rate_schedule: LRSchedule,
}

enum LRSchedule {
    Fixed,               // Kaplan's approach
    CosineWithWarmup {   // Chinchilla's approach
        warmup_steps: usize,
        total_steps: usize,  // adjusted per run
    },
}
```

## 4. The Parametric Loss Function

The paper's Approach 3 deserves a closer look because it gives a complete mathematical model of performance:

> L̂(N, D) = E + A / N^α + B / D^β

Where the fitted constants are:

- E = 1.69 — the irreducible loss (entropy of natural language)
- A = 406.4, α = 0.34 — the model-size term
- B = 410.7, β = 0.28 — the data term

The structure of this equation is worth studying. Loss has three components: a floor you can never get below (E), a penalty for having too few parameters (A/N^α), and a penalty for having too little data (B/D^β). The model-size penalty and data penalty are additive — they compete for your attention and your compute budget.

```rust
// Rust

/// Chinchilla's parametric loss function (Approach 3)
/// L̂(N, D) = E + A / N^α + B / D^β
fn estimated_loss(n_params: f64, n_tokens: f64) -> f64 {
    let e = 1.69;       // irreducible loss (entropy of natural language)
    let a = 406.4;      // model-size coefficient
    let alpha = 0.34;   // model-size exponent
    let b = 410.7;      // data coefficient
    let beta = 0.28;    // data exponent

    e + a / n_params.powf(alpha) + b / n_tokens.powf(beta)
}

/// To find compute-optimal allocation, we minimize L̂(N, D)
/// subject to the constraint C ≈ 6 * N * D (total compute in FLOPs).
///
/// Taking derivatives and solving, the optimal allocation is:
/// N_opt = G * (C / 6)^a        where a = β / (α + β)
/// D_opt = (1/G) * (C / 6)^b    where b = α / (α + β)
///
/// With α = 0.34 and β = 0.28:
///   a = 0.28 / (0.34 + 0.28) = 0.45
///   b = 0.34 / (0.34 + 0.28) = 0.55
///
/// Close to 0.5 / 0.5 — consistent with Approaches 1 and 2.
fn optimal_params_and_tokens(compute_flops: f64) -> (f64, f64) {
    let alpha = 0.34;
    let beta = 0.28;
    let a = beta / (alpha + beta);       // ≈ 0.45
    let b = alpha / (alpha + beta);      // ≈ 0.55
    let g: f64 = 2.0; // approximate scaling constant G from the paper

    let base = compute_flops / 6.0;
    let n_opt = g * base.powf(a);
    let d_opt = (1.0 / g) * base.powf(b);
    (n_opt, d_opt)
}
```

## 5. The Damning Table

The paper's Table 1 lists the actual parameter counts and training tokens for several well-known models. Table 3 gives the compute-optimal token estimates for different model sizes. Put the two tables side by side, and you get something that reads like an audit of the entire industry:

| Model | Parameters | Tokens Used | Chinchilla-Optimal Tokens |
|-------|-----------|-------------|---------------------------|
| GPT-3 | 175B | 300B | 3.7T |
| Gopher | 280B | 300B | 5.9T |
| Jurassic-1 | 178B | 300B | 3.7T |
| MT-NLG | 530B | 270B | 11.0T |

Every single model was trained on roughly 300 billion tokens. But according to Chinchilla's analysis, GPT-3 should have been trained on 3.7 trillion tokens — more than 12 times what it actually saw. Gopher should have seen nearly 6 trillion. MT-NLG, the largest of the bunch at 530 billion parameters, should have been trained on 11 trillion tokens — 40 times its actual training data.

```rust
// Rust

/// Combining Table 1 (actual) and Table 3 (compute-optimal) from the paper
struct ModelComparison {
    name: &'static str,
    params_billions: f64,
    tokens_used_billions: f64,
    optimal_tokens_billions: f64,
}

fn industry_models() -> Vec<ModelComparison> {
    vec![
        ModelComparison {
            name: "GPT-3",
            params_billions: 175.0,
            tokens_used_billions: 300.0,
            optimal_tokens_billions: 3700.0,  // 12x undertrained
        },
        ModelComparison {
            name: "Gopher",
            params_billions: 280.0,
            tokens_used_billions: 300.0,
            optimal_tokens_billions: 5900.0,  // 20x undertrained
        },
        ModelComparison {
            name: "Jurassic-1",
            params_billions: 178.0,
            tokens_used_billions: 300.0,
            optimal_tokens_billions: 3700.0,  // 12x undertrained
        },
        ModelComparison {
            name: "MT-NLG",
            params_billions: 530.0,
            tokens_used_billions: 270.0,
            optimal_tokens_billions: 11000.0, // 40x undertrained
        },
    ]
}

/// The pattern is unmistakable: the industry converged on ~300B tokens
/// regardless of model size. Chinchilla says this was wildly insufficient.
```

The pattern is striking. The entire industry had settled on roughly the same amount of training data — around 300 billion tokens — regardless of model size. It was as if everyone had decided that 300B tokens was "enough" and poured all additional compute into making models bigger. Chinchilla says this was exactly backwards.

## 6. The Proof: Chinchilla vs. Gopher

To validate their theory, the team trained Chinchilla: a 70-billion-parameter model on 1.4 trillion tokens. Chinchilla used the same compute budget as Gopher (280 billion parameters, 300 billion tokens) — the same total training cost, just allocated differently.

The result was decisive. Chinchilla outperformed Gopher on nearly every benchmark, despite being 4 times smaller:

- **MMLU** (Massive Multitask Language Understanding): Chinchilla 67.6% vs. Gopher 60.0% vs. GPT-3 43.9%
- **Reading comprehension** (RACE-h): Chinchilla 73.3% vs. Gopher 71.6%
- **Common sense** (HellaSwag): Chinchilla 80.8% vs. Gopher 79.2%
- **BIG-bench**: Chinchilla outperformed Gopher on the majority of tasks

```rust
// Rust

/// Chinchilla vs. Gopher: same compute, different allocation
struct ModelConfig {
    name: &'static str,
    params_billions: f64,
    tokens_billions: f64,
    mmlu_accuracy: f64,
}

fn chinchilla_vs_gopher() {
    let gopher = ModelConfig {
        name: "Gopher",
        params_billions: 280.0,
        tokens_billions: 300.0,
        mmlu_accuracy: 60.0,
    };

    let chinchilla = ModelConfig {
        name: "Chinchilla",
        params_billions: 70.0,
        tokens_billions: 1400.0,
        mmlu_accuracy: 67.6,
    };

    // Same compute: C ≈ 6 * N * D
    let gopher_flops = 6.0 * gopher.params_billions * 1e9
                         * gopher.tokens_billions * 1e9;
    let chinchilla_flops = 6.0 * chinchilla.params_billions * 1e9
                             * chinchilla.tokens_billions * 1e9;
    // gopher_flops ≈ chinchilla_flops ≈ 5.0 × 10^23

    // But Chinchilla is 4x smaller, trained on 4.7x more data
    // Result: better on nearly every benchmark
}
```

A model that is 4 times smaller beating the larger model on nearly every benchmark — using the same compute — is a powerful demonstration. The compute was not wasted; it was simply redirected from parameters to data.

## 7. The Practical Consequences

The Chinchilla paper had immediate, concrete consequences for the industry.

**Smaller models are cheaper to use.** Training cost is a one-time expense, but inference cost — the cost of actually running the model to generate text — scales with model size, every single time a user sends a query. A 70B model is 4x cheaper to serve than a 280B model. If the smaller model performs better, the win is double: better quality at lower cost.

**Data became the bottleneck.** Before Chinchilla, the limiting factor was compute: how many GPUs can you get? After Chinchilla, the limiting factor shifted to data: where do you find trillions of high-quality tokens? This sparked an industry-wide scramble for training data — web scraping at massive scale, dataset curation efforts, and eventually the synthetic data movement.

**The LLaMA moment.** Meta's LLaMA (February 2023) was arguably the most direct application of Chinchilla scaling. LLaMA-13B, trained on 1 trillion tokens, outperformed GPT-3 (175B) on most benchmarks. LLaMA-65B, trained on 1.4 trillion tokens, was competitive with Chinchilla and PaLM-540B. Meta explicitly cited the Chinchilla paper and deliberately trained smaller models on far more data than earlier conventions would have suggested.

```rust
// Rust

/// Why smaller compute-optimal models win at deployment
fn inference_cost_comparison() {
    // Rough comparison: cost per token scales approximately linearly with params
    let gopher_cost_per_token = 280.0;   // arbitrary units
    let chinchilla_cost_per_token = 70.0; // 4x cheaper

    // Over millions of user queries, the savings compound
    let queries_per_day: f64 = 1_000_000.0;
    let tokens_per_query: f64 = 500.0;

    let daily_cost_gopher = queries_per_day * tokens_per_query * gopher_cost_per_token;
    let daily_cost_chinchilla = queries_per_day * tokens_per_query * chinchilla_cost_per_token;

    // Chinchilla: better performance AND 75% lower serving cost
    // This is why the paper changed industry behavior so quickly
}
```

## 8. My Takeaways

First, this paper is a correction — and a graceful one. It takes Kaplan et al.'s framework, identifies a methodological flaw (fixed learning rate schedules), fixes it, and arrives at a different answer. It does not dismiss the earlier work; it builds on it. The parametric loss function L̂(N, D) = E + A/N^α + B/D^β is a refinement of Kaplan's formulation, not a replacement. Science at its best is exactly this: someone does careful work, someone else does more careful work, and the field moves forward.

Second, the paper's most surprising finding is not the math — it is the gap between theory and practice. Everyone in the industry could see that 300 billion tokens was becoming a default. Nobody questioned it seriously until this team ran the numbers. The models were not small; they were starved. The solution was not to build bigger — it was to feed more.

Third, the equal-scaling result (a ≈ b ≈ 0.5) is beautiful in its simplicity. There is no asymmetry between model size and data. If you have more compute, scale both equally. No complicated allocation strategy needed. "Where should I spend my next dollar of compute?" Chinchilla's answer is not to keep betting on parameter count alone, but to let model size and training data grow at approximately the same rate.

Fourth, the practical legacy is enormous. Before Chinchilla, the path to better AI was "make it bigger." After Chinchilla, the path became "train it better." This one shift made powerful models accessible to organizations that could not afford the largest parameter counts but could curate large datasets. LLaMA, Mistral, and the entire open-source LLM ecosystem owe a direct debt to this insight.

The Kaplan paper said: bigger models are predictably better. The Chinchilla paper said: yes, but you have been making them big in the wrong way. Stop hoarding parameters. Start feeding data.

One paper gave the industry permission to scale. The other taught it how.

---

**Paper Reading Series**

- [*Sequence to Sequence Learning with Neural Networks*](/posts/sequence-to-sequence-learning-with-neural-networks/) — Establishing the encoder-decoder paradigm
- [*Neural Machine Translation by Jointly Learning to Align and Translate*](/posts/neural-machine-translation-by-jointly-learning-to-align-and-translate/) — The origin of attention
- [*Attention Is All You Need*](/posts/attention-is-all-you-need/) — Attention takes center stage: the birth of the Transformer
- [*BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding*](/posts/bert/) — Establishing the pre-training paradigm
- [*Scaling Laws for Neural Language Models*](/posts/scaling-laws-for-neural-language-models/) — The mathematics of scale
- [*Language Models are Few-Shot Learners*](/posts/language-models-are-few-shot-learners/) — Larger models, better at eliciting abilities from context
