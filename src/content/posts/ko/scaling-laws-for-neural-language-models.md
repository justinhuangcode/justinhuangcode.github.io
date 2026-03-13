---
title: "논문 읽기: Scaling Laws for Neural Language Models"
date: 2026-03-01
category: "Paper Reading"
description: 규모의 수학 — 더 큰 모델이 예측 가능하게 더 나은 이유, 핵심 코드를 Rust로 재구현
tags: [paper-reading, scaling-laws, AI, LLM, rust]
pinned: false
---

2020년 1월 23일, OpenAI의 연구자 10명이 arXiv(연구자들이 학술지 심사를 거치지 않고 논문을 공개할 수 있는 프리프린트 서버)에 논문을 업로드했다: <a href="/papers/Scaling%20Laws%20for%20Neural%20Language%20Models.pdf" target="_blank"><i>Scaling Laws for Neural Language Models</i></a>.

10명은 Jared Kaplan, Sam McCandlish, Tom Henighan, Tom B. Brown, Benjamin Chess, Rewon Child, Scott Gray, Alec Radford, Jeffrey Wu, Dario Amodei였다. 당시 전원 OpenAI 소속이었다.

그 저자 목록은 돌이켜 보면 인상적이다. Jared Kaplan과 Sam McCandlish는 이론 물리학자 출신이다 — Kaplan은 OpenAI에 합류하기 전 Johns Hopkins에서 끈 이론(string theory) 교수였다. Dario Amodei는 연구 부사장이었다. Tom B. Brown은 이후 GPT-3 논문의 제1저자가 된다. Alec Radford는 GPT-1과 GPT-2를 설계했다. 2년 안에 Kaplan, McCandlish, Amodei는 OpenAI를 떠나 Anthropic(Claude를 만든 회사)을 공동 창립하게 된다.

끈 이론가들에게는 습관이 있다: 복잡한 현상 속에서 간결한 보편 법칙을 찾는 것이다.

그 습관이 이 논문 전체에 배어 있다.

## 1. 질문

2020년 초, 딥러닝 커뮤니티는 이미 더 큰 모델이 더 나은 성능을 "내는 경향이 있다"는 것을 알고 있었다. 하지만 "경향이 있다"는 과학이 아니다. 기본적인 실용적 질문에 답할 수 없었다: 컴퓨팅 예산을 두 배로 늘리면 성능이 얼마나 향상될까? 그 예산을 더 큰 모델, 더 많은 데이터, 더 긴 학습 중 어디에 써야 할까? 공식이 있을까?

이 논문은 그 질문들에 답했다. 직감도 아니고, 경험 법칙도 아니고 — 방정식으로.

## 2. Power Laws: 핵심 발견

이 논문의 핵심 발견은 언어 모델의 성능이 **power law(멱법칙)**를 따른다는 것이다. 논문이 측정한 범위 내에서, 성능이 주로 하나의 요인에 의해 제한되고 나머지 두 요인에 의해 병목되지 않을 때, 테스트 손실(모델이 다음 단어를 얼마나 잘 예측하는지를 나타내는 지표 — 낮을수록 좋다)을 파라미터 수, 데이터셋 크기, 컴퓨팅에 대해 log-log 그래프에 그리면 대략 직선 관계를 보인다.

세 개의 방정식이 논문 전체를 요약한다:

> L(N) ≈ (N_c / N)^α_N, where α_N ≈ 0.076
>
> L(D) ≈ (D_c / D)^α_D, where α_D ≈ 0.095
>
> L(C) ≈ (C_c / C)^α_C, where α_C ≈ 0.050

표기법에 겁먹을 필요 없다. 하나씩 풀어보자:

- **L**은 테스트 손실이다 — 모델 성능을 하나의 숫자로 요약한 것이다. 낮을수록 좋다
- **N**은 파라미터 수(모델 크기)이다. 파라미터가 많을수록 모델이 더 많은 패턴을 저장할 수 있다
- **D**는 모델이 학습한 데이터 토큰 수이다. 데이터가 많을수록 학습할 패턴이 많다
- **C**는 학습에 사용된 총 컴퓨팅이다. PetaFLOP-day 단위로 측정된다(1 PetaFLOP-day = 10^15 부동소수점 연산을 하루 종일 수행한 것)
- **N_c, D_c, C_c**는 상수(곡선 위의 기준점)이다
- **α**(알파)는 지수이다 — log-log 그래프에서 직선의 기울기를 알려준다. 지수가 클수록 규모를 키울 때 성능이 더 빠르게 향상된다

핵심 통찰: 이것들은 멱법칙이지, 대수(logarithmic) 곡선이 아니다. 대수 곡선은 빠르게 평탄해진다 — 입력을 두 배로 늘려도 출력은 거의 움직이지 않는다. 멱법칙은 훨씬 관대하다: 적어도 논문이 측정한 범위 내에서, 성능은 뚜렷한 벽에 부딪히는 징후 없이 멱법칙 추세를 따라 꾸준히 개선되었다. 논문도 이 추세가 영원히 0까지 내려갈 수는 없으며 결국은 평탄해질 것이라고 명시했지만, 관측된 범위 내에서는 추세가 깔끔하게 유지되었다.

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

지수들이 이야기를 들려준다. 데이터셋 크기(α = 0.095)가 스케일링 배수당 가장 큰 향상을 가져온다. 모델 크기(α = 0.076)가 그 다음이다. 컴퓨팅(α = 0.050)은 가장 적은 향상을 보인다 — 모델 크기와 학습 시간 사이에 적절히 배분하지 않고 컴퓨팅만 늘리는 것은 낭비이기 때문이다. 진짜 레버리지는 올바른 것을 스케일링하는 데서 나온다.

## 3. 논문이 테스트한 범위 내에서, 아키텍처 형태보다 전체 규모가 더 중요하다

여기서 논문은 모두를 놀라게 했다.

팀은 서로 다른 깊이(레이어 수), 너비(히든 차원), 어텐션 헤드 수, 피드포워드 차원을 가진 Transformer들을 테스트했다. 논문이 테스트한 Transformer 형태 범위 내에서, 비임베딩 파라미터 수가 비슷한 한, 깊이와 너비의 구체적인 배분은 손실에 미치는 영향이 작았다.

레이어 2개에 거대한 히든 차원을 가진 Transformer? 비슷한 비임베딩 파라미터 예산 하에서 레이어 40개에 작은 히든 차원을 가진 것과 대략 같은 손실을 보인다.

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

이것은 심오한 함의를 갖는다: "최적의" 아키텍처를 찾는 데 몇 주를 소비할 필요가 없다. 합리적인 Transformer 구조를 하나 골라서, 그것을 키우는 데 에너지를 집중하면 된다. 논문은 임베딩 파라미터가 비임베딩 파라미터보다 성능에 기여하는 바가 훨씬 적다는 것을 발견했기 때문에 N에서 임베딩 파라미터를 명시적으로 제외했다 — 모델의 "사고" 능력은 어휘 테이블이 아니라 Transformer 레이어에 있다.

## 4. 모델이 과적합할 때: 데이터 병목

더 크다고 항상 더 나은 건 아니다 — 데이터셋이 너무 작으면 그렇다. 논문에서 진짜 아름다운 부분은, 모델 규모와 데이터 규모가 어떻게 함께 성능을 결정하는지를 하나의 통합된 이변수 공식으로 포착한 것이다:

> L(N, D) = [(N_c / N)^(α_N / α_D) + D_c / D]^α_D

이 공식이 말하는 것은: 손실은 모델 크기나 데이터 크기 하나만의 함수가 아니라, 둘 다의 함수라는 것이다. N이 충분히 커서 첫 번째 항이 사라지면, 남은 항은 손실이 데이터에 의해 병목되었음을 보여준다. D가 충분히 커서 두 번째 항이 사라지면, 남은 것은 모델 규모 병목이다. 공식은 두 체제 사이를 부드럽게 보간하며, 과적합은 두 항이 경쟁하는 자연스러운 결과로 포착된다.

이 관계에서 논문은 과적합이 본격적으로 영향을 미치기 시작하는 대략적인 경험적 임계점을 도출했다:

> D ≳ 5 × 10³ × N^0.74 토큰이면 과적합을 논문이 논의한 임계값 근처로 억제할 수 있다

쉽게 말하면: 모델을 크게 만들수록 필요한 데이터의 양이 늘어난다 — 하지만 선형 이하로. 10배 큰 모델은 10^0.74 ≈ 5.5배의 데이터만 더 필요하다. 더 큰 모델은 더 샘플 효율적이다: 학습 데이터의 각 토큰에서 더 많은 정보를 추출한다.

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

이 관계를 대략적으로 추산하면, 175B 규모 모델이 과적합을 논문이 논의한 임계값 근처로 억제하려면 거의 1조 토큰에 가까운 데이터가 필요하다. 반대로 보면, GPT-3의 3,000억 토큰은 사실 넉넉하지 않았다. 이것은 「모델을 얼마나 크게 만들고, 데이터를 얼마나 먹일 것인가」가 감이 아니라 분석 가능한 트레이드오프라는 것을 보여준다 — 이후 업계가 이 비율을 재검토한 것(가장 대표적으로 Chinchilla 논문, Hoffmann et al., 2022)도 많은 대형 모델의 데이터가 실제로 부족했다는 인식 때문이었다.

## 5. 컴퓨팅 효율적 학습: 진짜 핵심

고정된 컴퓨팅 예산이 있다면, 어떻게 써야 할까? 이것이 논문에서 가장 실용적으로 중요한 질문이고, 답은 직관에 반한다.

논문은 최적 배분이 다음을 따른다는 것을 발견했다:

> N_opt ∝ C^0.73 (모델 크기가 컴퓨팅에 비례해 가장 빠르게 커져야 한다)
>
> B_opt ∝ C^0.24 (배치 크기는 느리게 커진다)
>
> S_opt ∝ C^0.03 (학습 스텝은 거의 증가하지 않는다)

해석: 컴퓨팅 예산이 10배 늘면, 모델을 ~5.4배 키우고, 배치 크기를 ~1.7배 늘리고, 학습 시간은 거의 늘리지 않아야 한다(~1.07배 더 많은 스텝).

직관에 반하는 부분: **아주 큰 모델을 학습시키고 수렴 훨씬 전에 멈춰야 한다.** 대부분의 사람들의 직감은 작은 모델을 완전히 학습시키는 것이다. 스케일링 법칙은 그 반대를 말한다 — 같은 컴퓨팅 예산에서, 부분적으로 학습된 큰 모델이 완전히 학습된 작은 모델을 이긴다.

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

이 결과는 업계 전체를 형성했다. 이 논문 5개월 후에 나온 GPT-3는 이 논리를 직접적으로 따랐다: 작은 모델을 완전히 학습시키는 대신, 당시 기준으로 거대한 1,750억 파라미터 모델을 학습시켰다. 이후의 "Chinchilla" 논문(Hoffmann et al., 2022)은 이 지수들을 업데이트하고 대부분의 대형 모델이 최적 데이터 배분 대비 실제로 과소 학습되었다고 주장했지만 — 계산 가능한 최적 트레이드오프가 존재한다는 핵심 통찰은 여기서 시작되었다.

## 6. 임계 배치 크기: 병렬화 시점 알기

논문은 배치 크기에 "최적 지점"이 있다는 것도 발견했으며, 그것은 현재 손실에 의존한다:

> B_crit ∝ L^(-4.8)

학습이 진행되고 손실이 줄어들수록, 임계 배치 크기는 커진다. 학습 초기에는 손실이 높아서 작은 배치도 충분하다 — 각 배치가 충분히 강한 그래디언트 신호를 제공한다. 나중에는 모델이 이미 쉬운 패턴을 학습했기 때문에, 노이즈를 평균화하고 진전을 이루려면 더 큰 배치가 필요하다.

임계 배치 크기 이하에서는, 배치를 두 배로 늘리면 학습 시간이 대략 절반으로 줄어든다(완벽한 병렬화). 그 이상에서는, 배치를 두 배로 늘려도 거의 도움이 되지 않는다 — 컴퓨팅을 낭비할 뿐이다.

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

이것은 실용적인 엔지니어링 지혜이다. 많은 팀이 학습 내내 고정된 배치 크기를 사용한다. 스케일링 법칙은 학습이 진행됨에 따라 배치 크기를 늘려야 한다고 말한다 — 작게 시작해서, 모델이 나아짐에 따라 키워라.

## 7. 내 생각

이 논문을 읽고 나서, 몇 가지가 눈에 띈다.

첫째, 이 논문의 가장 깊은 기여는 특정 숫자가 아니다. 신경망 성능이 단순하고 예측 가능한 법칙에 의해 지배된다는 것을 보여준 것이다. 이 논문 이전에는 대형 모델 학습이 대체로 경험적이었다 — 이것저것 시도하고, 하이퍼파라미터를 조정하고, 최선을 바랐다. 이 논문 이후에는 수학을 할 수 있었다. 학습시키기 전에 모델이 얼마나 잘 수행할지 예측할 수 있었다. 적어도 대형 모델 학습에서 가장 비싸고 가장 중요한 부분 — 자원 배분 — 을 경험적 시행착오에서 추정 가능하고 계획 가능한 엔지니어링 문제로 끌어올렸다.

둘째, 저자들의 배경이 중요하다. Kaplan과 McCandlish는 이론 물리학의 사고방식을 가져왔다: 정밀하게 측정하고, 멱법칙을 피팅하고, 보편성을 찾는다. 이것은 대부분의 머신러닝 논문이 쓰여지는 방식이 아니다. 대부분의 ML 논문은 새로운 아키텍처를 제안하고 벤치마크에서 베이스라인을 이겼다는 것을 보여준다. 이 논문은 새로운 아키텍처를 제안하지 않았다. 사고방식을 제안했다. 도구가 새로운 것이 아니라 — 통찰이 새로운 것이다.

셋째, 「모델을 최대한 크게 만들되, 끝까지 학습시키지 않아도 된다」는 결론은 진정으로 직관에 반하며, 업계의 자원 배분 방식을 바꿔놓았다. 이 논문 이전에는 모델 크기를 정하고 완전히 수렴할 때까지 학습시키는 것이 기본이었다 — 컴퓨팅 예산을 남김없이 쓰는 것이다. 이 논문 이후에는 질문이 뒤집혔다: 같은 컴퓨팅 예산이라면, 작은 모델을 극한까지 학습시키는 것보다 모델을 감당할 수 있는 한 최대한 크게 만들고 「충분히 좋아지면」 멈추는 것이 낫다 — 학습을 끝내지 못한 큰 모델이 학습을 완료한 작은 모델보다 더 나은 성능을 보이기 때문이다. 이 사고방식이 직접적으로 GPT-3(1,750억 파라미터, 3,000억 토큰)로 이어졌고, 이후의 모든 대형 모델에 영향을 미쳤다.

넷째, 역사적 관점에서, 이 논문은 [GPT-3 논문](/ko/posts/language-models-are-few-shot-learners/)의 이론적 기반으로 볼 수 있다. GPT-3는 이 논문을 직접 인용했고, GPT-3 논문은 few-shot 능력이 모델 용량에 따라 부드럽게 향상됨을 명확히 보여줬다. GPT-3가 1,750억 파라미터를 선택한 것이 스케일링 법칙에서 영감을 받았다고 보는 것은 합리적인 추론이다 — 비록 GPT-3 논문 자체가 "Kaplan 공식에 대입해서 파라미터 수를 정했다"고 한 줄 한 줄 명시하지는 않았지만. 그래도 스케일링 법칙이 제공한 확신 없이는, 그 규모에서의 의사결정이 훨씬 더 불확실했을 것이다.

「더 큰 모델이 더 강하다」는 말은 2020년 이전까지는 그저 느낌이었다. 이 논문은 그것을 방정식으로 바꿨다 — 얼마나 더 강한지, 얼마나 드는지, 어떻게 쓰는 게 가장 효율적인지를 알려준다.

AI 업계는 이후 컴퓨팅 경쟁이 되었다. 이 논문을 읽고 나면 이해하게 된다: 그것은 맹목적인 군비 경쟁이 아니었다. 누군가가 먼저 계산을 끝낸 것이다.

---

**논문 읽기 시리즈**

- [<i>Sequence to Sequence Learning with Neural Networks</i>](/ko/posts/sequence-to-sequence-learning-with-neural-networks/) — 인코더-디코더 패러다임의 확립
- [<i>Neural Machine Translation by Jointly Learning to Align and Translate</i>](/ko/posts/neural-machine-translation-by-jointly-learning-to-align-and-translate/) — 어텐션의 기원
- [<i>Attention Is All You Need</i>](/ko/posts/attention-is-all-you-need/) — 어텐션이 주역이 되다: Transformer의 탄생
- [<i>BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding</i>](/ko/posts/bert/) — 사전 학습 패러다임의 확립
- [<i>Language Models are Few-Shot Learners</i>](/ko/posts/language-models-are-few-shot-learners/) — 더 큰 모델, 컨텍스트에서 더 잘 능력을 이끌어내다
- [<i>Training Compute-Optimal Large Language Models</i>](/ko/posts/training-compute-optimal-large-language-models/) — 컴퓨팅 예산을 현명하게 쓰는 법
