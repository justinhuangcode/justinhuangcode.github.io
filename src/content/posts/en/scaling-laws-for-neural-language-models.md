---
title: "Paper Reading: Scaling Laws for Neural Language Models"
date: "2026-03-01T16:45:39+08:00"
category: "Paper Reading"
description: The mathematics of scale — why bigger models are predictably better, with core code reimplemented in Rust
tags: [paper-reading, scaling-laws, AI, LLM, rust]
pinned: false
---

On January 23, 2020, a team of ten researchers from OpenAI uploaded a paper to arXiv (a preprint server where researchers can publish papers without waiting for journal peer review): [*Scaling Laws for Neural Language Models*](/papers/2001.08361v1.pdf).

The ten were Jared Kaplan, Sam McCandlish, Tom Henighan, Tom B. Brown, Benjamin Chess, Rewon Child, Scott Gray, Alec Radford, Jeffrey Wu, and Dario Amodei. All at OpenAI at the time.

That author list is striking in retrospect. Jared Kaplan and Sam McCandlish are theoretical physicists by training — Kaplan was a string theory professor at Johns Hopkins before joining OpenAI. Dario Amodei was VP of Research. Tom B. Brown would later be the first author of the GPT-3 paper. Alec Radford designed GPT-1 and GPT-2. Within two years, Kaplan, McCandlish, and Amodei would leave OpenAI to co-found Anthropic (the company behind Claude).

String theorists have a habit: they look for universal laws.

That habit is all over this paper.

## 1. The Question

By early 2020, the deep learning community already knew that bigger models tended to perform better. But "tended to" is not science. People could not answer basic practical questions: if I double my compute budget, how much will performance improve? Should I spend that budget on a bigger model, more data, or longer training? Is there a formula?

This paper answered those questions. Not with intuition, not with rules of thumb — with equations.

## 2. Power Laws: The Core Discovery

The paper's central finding is that language model performance follows **power laws**. Within the range the paper measured, when performance is primarily bottlenecked by one factor and not constrained by the other two, test loss (a measure of how well the model predicts the next word — lower is better) plotted against model size, dataset size, or compute forms an approximately straight line on a log-log plot.

Three equations summarize the entire paper:

> L(N) ≈ (N_c / N)^α_N, where α_N ≈ 0.076
>
> L(D) ≈ (D_c / D)^α_D, where α_D ≈ 0.095
>
> L(C) ≈ (C_c / C)^α_C, where α_C ≈ 0.050

Do not panic at the notation. Let's break it down:

- **L** is the test loss — a single number that captures how well the model performs. Lower is better
- **N** is the number of parameters (model size). More parameters means the model can store more patterns
- **D** is the number of data tokens the model is trained on. More data means more patterns to learn from
- **C** is the total compute used for training, measured in PetaFLOP-days (one PetaFLOP-day = 10^15 floating-point operations running for a full day)
- **N_c, D_c, C_c** are constants (reference points on the curve)
- **α** (alpha) is the exponent — it tells you the slope of the line on a log-log plot. A bigger exponent means performance improves faster as you scale up

The key insight: these are power laws, not logarithmic curves. A logarithmic curve flattens out quickly — doubling the input barely moves the output. A power law is far more generous: at least within the range the paper measured, performance showed no sign of hitting a wall, improving steadily along the power-law trend. The paper is careful to note that this cannot continue forever — loss will eventually flatten — but within the observed range, the trend held cleanly.

```rust
// Rust

/// Power-law scaling: loss as a function of a single variable
/// L(x) = (x_c / x)^alpha
/// On a log-log plot, this is a straight line with slope -alpha
fn power_law_loss(x: f64, x_c: f64, alpha: f64) -> f64 {
    (x_c / x).powf(alpha)
}

/// The three scaling laws from the paper
fn scaling_laws() {
    let alpha_n = 0.076;  // exponent for model size
    let alpha_d = 0.095;  // exponent for dataset size
    let alpha_c = 0.050;  // exponent for compute

    // Example: if you 10x the number of parameters
    let improvement_n = (10.0_f64).powf(alpha_n);
    // loss decreases by a factor of ~1.19 (about 19% better)

    // Example: if you 10x the dataset
    let improvement_d = (10.0_f64).powf(alpha_d);
    // loss decreases by a factor of ~1.24 (about 24% better)

    // Example: if you 10x the compute
    let improvement_c = (10.0_f64).powf(alpha_c);
    // loss decreases by a factor of ~1.12 (about 12% better)
}
```

The exponents tell a story. Dataset size (α = 0.095) yields the most improvement per factor of scaling. Model size (α = 0.076) is next. Compute (α = 0.050) yields the least — because scaling compute without properly allocating it between model size and training time is wasteful. The real leverage comes from scaling the right thing.

## 3. Within the Tested Range, Architecture Shape Matters Less Than Scale

Here is where the paper surprised everyone.

The team tested Transformers with different depths (number of layers), widths (hidden dimension), attention heads, and feed-forward dimensions. Within the range of Transformer shapes they tested, as long as the total non-embedding parameter count was similar, performance differences were remarkably small.

A Transformer with 2 layers and a massive hidden dimension? Roughly the same loss as one with 40 layers and a small hidden dimension — given a comparable non-embedding parameter budget.

```rust
// Rust

/// The paper's finding: architecture shape has minimal effect on performance
/// What matters is the total number of non-embedding parameters
struct ArchitectureExperiment {
    n_layers: usize,
    d_model: usize,
    n_heads: usize,
    d_ff: usize,
}

fn non_embedding_params(config: &ArchitectureExperiment) -> u64 {
    let n = config.n_layers as u64;
    let d = config.d_model as u64;
    let ff = config.d_ff as u64;
    // Each Transformer layer has:
    // - attention: 4 * d_model^2 parameters (Q, K, V projections + output projection)
    // - feed-forward: 2 * d_model * d_ff parameters (two linear layers)
    // - layer norms: 4 * d_model parameters
    n * (4 * d * d + 2 * d * ff + 4 * d)
}

// The point: two configs with different shapes but same non_embedding_params()
// will have approximately the same test loss.
// Architecture is not destiny. Scale is.
```

This has a profound implication: you do not need to spend weeks searching for the "optimal" architecture. Just pick a reasonable Transformer shape, then focus your energy on scaling it up. The paper explicitly excluded embedding parameters from N because they found embedding parameters contributed far less to performance than non-embedding parameters — the model's "thinking" capacity lives in the Transformer layers, not the vocabulary table.

## 4. When Models Overfit: The Data Bottleneck

Bigger is not always better — not if your dataset is too small. The paper's real elegance here is a unified two-variable formula that captures how model size and dataset size jointly determine performance:

> L(N, D) = [(N_c / N)^(α_N / α_D) + D_c / D]^α_D

This formula says: loss is not just a function of model size or data size alone — it is a function of both at once. When N is large enough that the first term vanishes, the remaining term shows loss bottlenecked by data. When D is large enough, what remains is the model-size bottleneck. The formula smoothly interpolates between these two regimes and captures overfitting as a natural consequence of the two terms competing.

From this relationship, the paper derives a rough rule of thumb for when overfitting begins to bite:

> D ≳ 5 × 10³ × N^0.74 tokens to keep overfitting within the paper's threshold

In plain language: as you make the model bigger, the amount of data you need grows — but sublinearly. A model that is 10 times larger needs only about 10^0.74 ≈ 5.5 times more data. Bigger models are more sample-efficient: they extract more information from each token of training data.

```rust
// Rust

/// The paper's unified two-variable loss formula
/// L(N, D) = [(N_c / N)^(alpha_N / alpha_D) + D_c / D]^alpha_D
fn loss_nd(n_params: f64, n_tokens: f64) -> f64 {
    let n_c = 8.8e13;       // reference constant for model size
    let d_c = 5.4e13;       // reference constant for dataset size
    let alpha_n = 0.076;
    let alpha_d = 0.095;
    let ratio = alpha_n / alpha_d;
    ((n_c / n_params).powf(ratio) + d_c / n_tokens).powf(alpha_d)
}

/// Rough overfitting threshold from the paper
/// D_min ≈ 5000 * N^0.74
fn min_dataset_tokens(n_params: f64) -> f64 {
    5000.0 * n_params.powf(0.74)
}

/// Example: for a 1B parameter model
/// min_dataset_tokens(1e9) ≈ 5000 * (1e9)^0.74 ≈ 2.3 × 10^10 tokens (~23B tokens)
///
/// For a 175B parameter model (GPT-3 scale)
/// min_dataset_tokens(175e9) ≈ 5000 * (175e9)^0.74 ≈ ~1.0 × 10^12 tokens (~1T tokens)
```

By this rough estimate, a 175-billion-parameter model would need close to a trillion tokens to keep overfitting within the paper's discussed threshold. GPT-3 was trained on approximately 300 billion tokens — well below that figure. In hindsight, GPT-3's data budget was not generous; it was arguably tight. This is one reason the industry later revisited the model-size-to-data ratio, most notably in the Chinchilla paper (Hoffmann et al., 2022), which argued that many large models had been undertrained relative to their optimal data allocation.

## 5. Compute-Efficient Training: The Real Punchline

If you have a fixed compute budget, how should you spend it? This is the most practically important question in the paper, and the answer is counterintuitive.

The paper found that optimal allocation follows:

> N_opt ∝ C^0.73 (model size should scale fastest with compute)
>
> B_opt ∝ C^0.24 (batch size scales slowly)
>
> S_opt ∝ C^0.03 (training steps barely increase)

Translation: if your compute budget grows 10x, you should make the model ~5.4x bigger, increase the batch size ~1.7x, and barely train longer (~1.07x more steps).

The counterintuitive part: **you should train very large models and stop significantly before convergence.** Most people's instinct is to fully train a smaller model. The scaling laws say the opposite — a partially trained large model outperforms a fully trained small model, given the same compute budget.

```rust
// Rust

/// Compute-optimal allocation: given a compute budget C,
/// how to distribute it across model size, batch size, and training steps
struct ComputeAllocation {
    n_params: f64,        // model parameters
    batch_size: f64,      // tokens per batch
    training_steps: f64,  // number of optimization steps
}

fn optimal_allocation(compute: f64) -> ComputeAllocation {
    // These exponents are from the paper's empirical fits
    ComputeAllocation {
        n_params: compute.powf(0.73),       // most of the budget goes to model size
        batch_size: compute.powf(0.24),      // batch size scales slowly
        training_steps: compute.powf(0.03),  // training steps barely change
    }
}

/// The implication: compute-efficient frontier
/// For each compute budget, there is ONE optimal model size.
/// Larger models trained for fewer steps beat smaller models trained to convergence.
fn is_compute_efficient(n_params: f64, compute: f64) -> bool {
    let optimal_n = compute.powf(0.73);
    // If your model is much smaller than optimal, you're wasting compute
    // on training steps that yield diminishing returns
    (n_params / optimal_n - 1.0).abs() < 0.5  // within ~50% of optimal
}
```

This result shaped the entire industry. GPT-3, which came five months after this paper, directly followed this logic: train a 175-billion-parameter model that was enormous for its time, rather than fully training a smaller model. The later "Chinchilla" paper (Hoffmann et al., 2022) updated these exponents and argued that most large models were actually undertrained relative to optimal data allocation — but the core insight, that there is a computable optimal trade-off, originated here.

## 6. Critical Batch Size: Knowing When to Parallelize

The paper also discovered that there is a "sweet spot" for batch size, and it depends on the current loss:

> B_crit ∝ L^(-4.8)

As training progresses and loss decreases, the critical batch size grows. Early in training, when loss is high, small batches are fine — each batch provides a strong enough gradient signal. Later, when the model has already learned the easy patterns, you need larger batches to average out noise and make progress.

Below the critical batch size, doubling the batch roughly halves training time (perfect parallelism). Above it, doubling the batch barely helps — you are just burning compute.

```rust
// Rust

/// Critical batch size: the threshold between compute-efficient and time-efficient training
/// B_crit(L) ∝ L^(-4.8)
fn critical_batch_size(loss: f64, b_star: f64, l_star: f64) -> f64 {
    // b_star and l_star are reference constants from empirical fitting
    b_star * (l_star / loss).powf(4.8)
}

/// Below B_crit: each step gives a strong gradient signal.
///   Doubling batch size ≈ halving training time. Compute stays roughly constant.
/// Above B_crit: gradient signal per additional sample diminishes.
///   Doubling batch size barely speeds up training. You're wasting compute.
///
/// Practical implication: as training progresses and loss drops,
/// you can (and should) increase the batch size to maintain efficiency.
```

This is practical engineering wisdom. Many teams train with a fixed batch size throughout. The scaling laws say you should increase it as training progresses — start small, scale up as the model gets better.

## 7. My Takeaways

After reading this paper, a few things stand out.

First, the paper's deepest contribution is not any specific number. It is the demonstration that neural network performance is governed by simple, predictable laws. Before this paper, training large models was largely empirical — you tried things, you tweaked hyperparameters, you hoped for the best. After this paper, you could do math. You could predict how well a model would perform before training it. It at least pushed the most expensive, most consequential part of large model training — resource allocation — from empirical trial-and-error toward something estimable and plannable.

Second, the backgrounds of the authors matter. Kaplan and McCandlish brought the mindset of theoretical physics: measure precisely, fit power laws, look for universality. This is not how most machine learning papers are written. Most ML papers propose a new architecture and show it beats baselines on benchmarks. This paper proposed no new architecture. It proposed a way of thinking. The tool is not new — the insight is.

Third, the conclusion that "you should make the model as large as possible, and you do not need to train it to completion" is genuinely counterintuitive, and it reshaped how the industry allocates resources. Before this paper, the default was to pick a model size and train it until full convergence — spending the entire compute budget to squeeze every last drop of performance out of that model. After this paper, the question flipped: given the same compute budget, rather than training a small model to exhaustion, make the model as large as you can afford and stop when it is "good enough" — because a large model that has not finished training outperforms a small model that has been trained to the limit. That reasoning directly led to GPT-3 (175B parameters, 300B tokens) and influenced every large model that followed.

Fourth, from a historical perspective, this paper can be read as the theoretical foundation for the [GPT-3 paper](/posts/language-models-are-few-shot-learners/). GPT-3 cites it directly, and the GPT-3 paper explicitly shows that few-shot performance scales smoothly with model capacity. It is reasonable to see GPT-3's 175-billion-parameter bet as informed by the scaling laws — though the GPT-3 paper itself does not say "we set the parameter count by plugging into Kaplan's formula." Still, without the confidence that scaling laws provided, the decision to train at that scale would have carried far more uncertainty.

"Bigger models are better" was just a feeling before 2020. This paper turned it into a set of equations — telling you how much better, how much it costs, and how to spend most efficiently.

The AI industry later became a compute race. After reading this paper, you understand why: it was not a blind arms race. Someone did the math first.

---

**Paper Reading Series**

- [*Sequence to Sequence Learning with Neural Networks*](/posts/sequence-to-sequence-learning-with-neural-networks/) — Establishing the encoder-decoder paradigm
- [*Neural Machine Translation by Jointly Learning to Align and Translate*](/posts/neural-machine-translation-by-jointly-learning-to-align-and-translate/) — The origin of attention
- [*Attention Is All You Need*](/posts/attention-is-all-you-need/) — Attention takes center stage: the birth of the Transformer
- [*BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding*](/posts/bert/) — Establishing the pre-training paradigm
- [*Language Models are Few-Shot Learners*](/posts/language-models-are-few-shot-learners/) — Larger models, better at eliciting abilities from context
- [*Training Compute-Optimal Large Language Models*](/posts/training-compute-optimal-large-language-models/) — How to spend your compute budget wisely
