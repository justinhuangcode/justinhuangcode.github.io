---
title: "논문 읽기: Training Compute-Optimal Large Language Models"
date: 2026-03-11
category: "Paper Reading"
description: Chinchilla 논문 — 왜 대부분의 대형 모델이 과소 학습되었는지, 그리고 컴퓨팅 예산을 현명하게 쓰는 법, 핵심 코드를 Rust로 재구현
tags: [paper-reading, chinchilla, scaling-laws, AI, LLM, rust]
pinned: false
---

2022년 3월 29일, DeepMind의 연구팀이 arXiv(연구자들이 학술지 심사를 거치지 않고 논문을 공개할 수 있는 프리프린트 서버)에 논문을 업로드했다: <a href="/papers/2203.15556v1.pdf" target="_blank"><i>Training Compute-Optimal Large Language Models</i></a>.

제1저자는 Jordan Hoffmann이고, 공저자로 Sebastian Borgeaud, Arthur Mensch, Elena Buchatskaya, Trevor Cai, Eliza Rutherford 등 다수가 참여했다 — 당시 전원 DeepMind 소속이었다. Arthur Mensch는 이후 유럽에서 가장 주목받는 AI 기업 중 하나인 Mistral AI를 공동 창립하게 된다.

이 논문은 흔히 "Chinchilla 논문"이라 불린다 — 팀이 자신들의 발견을 검증하기 위해 학습시킨 700억 파라미터 모델의 이름에서 따온 것이다. 논문 제목이 아니라 동물 이름이 붙었다. AI 업계에서 "Chinchilla 스케일링"은 이 논문의 핵심 주장을 가리키는 관용어가 되었다.

그 주장은 단순하고, 대담하며, 업계 대부분에게 불편한 것이었다: **2022년의 가장 큰 언어 모델들 중 다수는 "모델이 충분히 크지 않은" 것이 아니라, 각자의 컴퓨팅 예산 대비 현저하게 과소 학습된 것이었다.**

## 1. 질문

2022년 초, AI 커뮤니티는 [Kaplan et al. (2020)](/ko/posts/scaling-laws-for-neural-language-models/)에서 분명한 교훈을 내면화한 상태였다: 더 큰 모델은 예측 가능하게 더 낫다. 스케일링 법칙 논문은 성능이 멱법칙을 따르며, 주어진 컴퓨팅 예산에서 모델을 가능한 한 크게 만들어야 한다고 보여주었다.

업계는 그 조언을 충실히 따랐다. 2022년 봄까지 GPT-3는 1,750억 파라미터를 3,000억 토큰으로 학습시켰다. DeepMind 자체의 Gopher는 2,800억 파라미터를 3,000억 토큰으로 학습시켰다. 곧이어 Google도 5,400억 파라미터의 PaLM을 발표했다. 추세는 명확했다: 파라미터 수를 올려라.

하지만 눈앞에 문제가 숨어 있었다. Kaplan et al.은 컴퓨팅을 스케일링할 때 대부분의 예산이 모델 크기에 가야 하고(N ∝ C^0.73), 학습 데이터에는 상대적으로 적게 가야 한다고(D ∝ C^0.27) 결론지었다. 이는 곧: 모델을 거대하게 만들되, 적당한 양의 데이터만 학습시켜라는 뜻이었다.

Hoffmann 팀은 단순한 질문을 던졌다: 그것이 정말 맞는가?

## 2. 세 가지 독립적 접근법, 하나의 답

이 논문이 유난히 설득력 있는 이유는 방법론에 있다. 팀은 단일 실험에 의존하지 않았다. 같은 질문에 세 가지 완전히 독립적인 각도에서 접근했고, 세 가지 모두 같은 답으로 수렴했다.

**접근법 1: 컴퓨팅을 고정하고 배분을 변화시킨다.** 7,000만에서 160억 파라미터에 이르는 400개 이상의 모델을 학습시켰다. 각 모델은 모델 크기와 학습 데이터 사이에 서로 다른 배분을 가졌지만, 총 컴퓨팅은 동일했다. 각 컴퓨팅 수준에서 어떤 모델 크기가 손실을 최소화하는지 찾았다.

**접근법 2: IsoFLOP 프로필.** 9가지 크기(7,000만에서 100억 파라미터)의 모델을 다양한 양의 데이터로 학습시켰는데, 각 그룹의 실행이 대략 같은 총 컴퓨팅을 사용하도록 설계했다. 그런 다음 곡선을 피팅하여 각 컴퓨팅 수준에 대한 최적 모델 크기를 찾았다.

**접근법 3: 파라메트릭 손실 함수 피팅.** 모든 학습 실행에 다음 방정식을 피팅했다:

> L̂(N, D) = E + A / N^α + B / D^β

여기서 E는 비가역적 손실(자연 언어의 엔트로피 — 어떤 모델도 이보다 더 나을 수 없다), A/N^α는 모델 크기 병목, B/D^β는 데이터 병목을 포착한다. 피팅된 파라미터에서 최적의 N과 D를 컴퓨팅의 함수로 도출했다.

세 가지 접근법 모두 일치했다:

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

지수 a ≈ b ≈ 0.5의 진정한 의미는: 컴퓨팅이 증가함에 따라 모델 크기와 학습 데이터가 거의 같은 비율로 함께 확장되어야 한다는 것이다. 컴퓨팅이 10배 증가하면 둘 다 약 3.2배, 2배 증가하면 둘 다 약 1.4배 늘려야 한다. 다시 말해, 모델 크기가 두 배가 될 때마다 학습 토큰 수도 두 배가 되어야 한다. 이는 컴퓨팅을 주로 모델 크기에 써야 한다던 Kaplan et al.의 결론과 정면으로 모순된다.

## 3. Kaplan이 틀린 이유

이것은 한쪽이 "틀렸다"는 문제가 아니다. 실험 설정이 달랐고, 그것이 다른 최적 배분 결론으로 이어진 것이다. 두 팀 모두 엄밀한 작업을 했다.

Kaplan et al.은 학습 기간에 맞게 조정되지 않는 고정 학습률 스케줄을 사용했다. 학습률 스케줄을 조정하지 않고 더 많은 스텝을 학습시키면 성능이 떨어진다 — 모델이 본질적으로 더 나빠서가 아니라 최적화가 최적이 아니기 때문이다. 이로 인해 긴 학습 실행이 실제보다 덜 효과적으로 보여, 결과가 더 적은 스텝으로 학습된 더 큰 모델 쪽으로 편향되었다.

Hoffmann 팀은 각 학습 실행에 대해 학습률 스케줄을 조정하여, 각 구성이 공정한 기회를 얻도록 했다. 이렇게 하면, 더 많은 데이터로 더 오래 학습시키는 것이 Kaplan의 수치가 시사하는 것보다 훨씬 더 가치 있다는 것이 드러난다.

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

## 4. 파라메트릭 손실 함수

논문의 접근법 3은 성능에 대한 완전한 수학적 모델을 제공하기 때문에 더 자세히 살펴볼 가치가 있다:

> L̂(N, D) = E + A / N^α + B / D^β

피팅된 상수는 다음과 같다:

- E = 1.69 — 비가역적 손실 (자연 언어의 엔트로피)
- A = 406.4, α = 0.34 — 모델 크기 항
- B = 410.7, β = 0.28 — 데이터 항

이 방정식의 구조는 연구할 가치가 있다. 손실은 세 가지 성분으로 이루어진다: 절대로 밑으로 내려갈 수 없는 하한(E), 파라미터가 너무 적을 때의 페널티(A/N^α), 데이터가 너무 적을 때의 페널티(B/D^β). 모델 크기 페널티와 데이터 페널티는 가산적이다 — 컴퓨팅 예산을 놓고 경쟁한다.

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

## 5. 충격적인 표

논문의 Table 1은 당시 여러 대형 모델의 실제 파라미터 수와 학습 토큰 수를 나열하고, Table 3은 다양한 모델 크기에 대한 compute-optimal 토큰 추정치를 제시한다. 두 표를 나란히 놓으면, 업계 전체에 대한 감사 보고서처럼 읽힌다:

| 모델 | 파라미터 | 사용된 토큰 | Chinchilla 최적 토큰 |
|-------|-----------|-------------|---------------------------|
| GPT-3 | 175B | 300B | 3.7T |
| Gopher | 280B | 300B | 5.9T |
| Jurassic-1 | 178B | 300B | 3.7T |
| MT-NLG | 530B | 270B | 11.0T |

모든 모델이 대략 3,000억 토큰으로 학습되었다. 그러나 Chinchilla의 분석에 따르면, GPT-3는 3.7조 토큰으로 학습되었어야 했다 — 실제 본 것의 12배 이상이다. Gopher는 거의 6조를 봤어야 했다. 가장 큰 모델인 MT-NLG(5,300억 파라미터)는 11조 토큰으로 학습되었어야 했다 — 실제 학습 데이터의 40배다.

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

패턴이 뚜렷하다. 업계 전체가 모델 크기에 관계없이 대략 같은 양의 학습 데이터 — 약 3,000억 토큰 — 에 수렴해 있었다. 마치 모두가 3,000억 토큰이면 "충분하다"고 결정하고 추가 컴퓨팅을 전부 모델을 키우는 데 쏟아부은 것 같았다. Chinchilla는 이것이 정확히 거꾸로였다고 말한다.

## 6. 증명: Chinchilla vs. Gopher

이론을 검증하기 위해, 팀은 Chinchilla를 학습시켰다: 700억 파라미터 모델을 1.4조 토큰으로. Chinchilla는 Gopher(2,800억 파라미터, 3,000억 토큰)와 같은 컴퓨팅 예산을 사용했다 — 같은 총 학습 비용이되, 배분만 다르게 했다.

결과는 결정적이었다. Chinchilla는 4배 작음에도 거의 모든 벤치마크에서 Gopher를 능가했다:

- **MMLU** (Massive Multitask Language Understanding): Chinchilla 67.6% vs. Gopher 60.0% vs. GPT-3 43.9%
- **독해력** (RACE-h): Chinchilla 73.3% vs. Gopher 71.6%
- **상식 추론** (HellaSwag): Chinchilla 80.8% vs. Gopher 79.2%
- **BIG-bench**: Chinchilla가 대다수 태스크에서 Gopher를 능가

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

4배 작은 모델이 같은 컴퓨팅으로 거의 모든 벤치마크에서 더 큰 모델을 이기는 것 — 이것은 강력한 증명이다. 컴퓨팅이 낭비된 게 아니라, 파라미터에서 데이터로 방향만 바꾼 것이다.

## 7. 실질적 결과

Chinchilla 논문은 업계에 즉각적이고 구체적인 결과를 가져왔다.

**더 작은 모델은 운영 비용이 낮다.** 학습 비용은 일회성이지만, 추론 비용 — 실제로 모델을 실행하여 텍스트를 생성하는 비용 — 은 모델 크기에 비례하며, 사용자가 쿼리를 보낼 때마다 발생한다. 700억 모델은 2,800억 모델보다 서빙 비용이 4배 저렴하다. 더 작은 모델이 성능까지 더 좋다면, 이중 승리다: 더 나은 품질에 더 낮은 비용.

**데이터가 병목이 되었다.** Chinchilla 이전에는 제한 요인이 컴퓨팅이었다: GPU를 얼마나 확보할 수 있는가? Chinchilla 이후에는 제한 요인이 데이터로 바뀌었다: 수조 개의 고품질 토큰을 어디서 찾을 것인가? 이것이 업계 전체의 학습 데이터 쟁탈전을 촉발했다 — 대규모 웹 스크래핑, 데이터셋 큐레이션 노력, 그리고 결국 합성 데이터 운동으로 이어졌다.

**LLaMA의 순간.** Meta의 LLaMA(2023년 2월)는 아마도 Chinchilla 스케일링의 가장 직접적인 적용이었을 것이다. LLaMA-13B는 1조 토큰으로 학습되어 대부분의 벤치마크에서 GPT-3(175B)를 능가했다. LLaMA-65B는 1.4조 토큰으로 학습되어 Chinchilla 및 PaLM-540B와 대등한 성능을 보였다. Meta는 Chinchilla 논문을 명시적으로 인용하며, 이전 관례가 제안하는 것보다 훨씬 더 많은 데이터로 의도적으로 더 작은 모델을 학습시켰다.

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

## 8. 내 생각

첫째, 이 논문은 교정이다 — 그것도 우아한 교정. Kaplan et al.의 프레임워크를 가져와서, 방법론적 결함(고정 학습률 스케줄)을 식별하고, 고치고, 다른 답에 도달한다. 선행 연구를 부정하지 않는다 — 그 위에 쌓는다. 파라메트릭 손실 함수 L̂(N, D) = E + A/N^α + B/D^β는 Kaplan의 정식화를 대체한 것이 아니라 정제한 것이다. 최고의 과학은 정확히 이렇다: 누군가 신중한 연구를 하고, 다른 누군가가 더 신중한 연구를 하고, 분야가 앞으로 나아간다.

둘째, 이 논문의 가장 놀라운 발견은 수학이 아니라 이론과 실제 사이의 간극이다. 업계의 모든 사람이 3,000억 토큰이 기본값이 되어가고 있다는 것을 볼 수 있었다. 이 팀이 계산을 돌릴 때까지 아무도 그것을 진지하게 의문시하지 않았다. 모델이 작은 게 아니었다. 굶주리고 있었다. 해결책은 더 크게 만드는 것이 아니었다 — 더 먹이는 것이었다.

셋째, 균등 스케일링 결과(a ≈ b ≈ 0.5)는 단순함 속에 아름다움이 있다. 모델 크기와 데이터 사이에 비대칭이 없다. 컴퓨팅이 더 있으면, 둘 다 균등하게 키워라. 복잡한 배분 전략이 필요 없다. "다음 1달러의 컴퓨팅을 어디에 써야 하는가?" Chinchilla의 답은 파라미터 수에만 계속 베팅하는 것이 아니라, 모델 크기와 학습 데이터를 거의 같은 비율로 함께 키우는 것이다.

넷째, 실질적 유산은 거대하다. Chinchilla 이전에는 더 나은 AI로 가는 길이 "더 크게 만들어라"였다. Chinchilla 이후에는 "더 잘 학습시켜라"가 되었다. 이 하나의 전환이, 가장 큰 파라미터 수를 감당할 수 없지만 대규모 데이터셋을 큐레이션할 수 있는 조직들에게 강력한 모델을 접근 가능하게 만들었다. LLaMA, Mistral, 그리고 오픈소스 LLM 생태계 전체가 이 통찰에 직접적인 빚을 지고 있다.

Kaplan 논문은 말했다: 더 큰 모델이 예측 가능하게 더 낫다. Chinchilla 논문은 말했다: 맞다, 하지만 당신들은 잘못된 방식으로 크게 만들고 있었다. 파라미터를 쌓아두지 마라. 데이터를 먹여라.

한 논문이 업계에 스케일링할 허가를 주었다. 다른 논문이 그 방법을 가르쳤다.

---

**논문 읽기 시리즈**

- [<i>Sequence to Sequence Learning with Neural Networks</i>](/ko/posts/sequence-to-sequence-learning-with-neural-networks/) — 인코더-디코더 패러다임의 확립
- [<i>Neural Machine Translation by Jointly Learning to Align and Translate</i>](/ko/posts/neural-machine-translation-by-jointly-learning-to-align-and-translate/) — 어텐션의 기원
- [<i>Attention Is All You Need</i>](/ko/posts/attention-is-all-you-need/) — 어텐션이 주역이 되다: Transformer의 탄생
- [<i>BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding</i>](/ko/posts/bert/) — 사전 학습 패러다임의 확립
- [<i>Scaling Laws for Neural Language Models</i>](/ko/posts/scaling-laws-for-neural-language-models/) — 규모의 수학
- [<i>Language Models are Few-Shot Learners</i>](/ko/posts/language-models-are-few-shot-learners/) — 더 큰 모델, 컨텍스트에서 더 잘 능력을 이끌어내다
