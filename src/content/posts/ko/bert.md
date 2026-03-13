---
title: "논문 읽기: BERT — Pre-training of Deep Bidirectional Transformers for Language Understanding"
date: 2026-01-31
category: "Paper Reading"
description: 사전학습 패러다임의 확립, 핵심 코드를 Rust로 재구현
tags: [paper-reading, bert, AI, LLM, rust]
pinned: false
---

2018년 10월 11일, Google AI Language 팀은 arXiv(연구자들이 학술지 동료 심사를 거치지 않고 논문을 게시할 수 있는 프리프린트 서버)에 한 편의 논문을 업로드했다: <a href="/papers/BERT%20Pre-training%20of%20Deep%20Bidirectional%20Transformers%20for%20Language%20Understanding.pdf" target="_blank"><i>BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding</i></a>.

저자는 Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova로, 모두 Google 소속이다. Devlin은 Google에 합류하기 전 Microsoft Research에서 근무했으며, Google에서 BERT의 설계와 구현을 주도했다.

BERT는 Bidirectional Encoder Representations from Transformers의 약자다. 당시로서는 상당히 대담한 시도를 했다: 먼저 대량의 레이블이 없는 텍스트로 범용 pre-training을 수행한 뒤, 출력 레이어 하나만 추가하고 특정 태스크에 fine-tuning하여 최첨단 성능을 달성한 것이다.

이 "pre-train 후 fine-tune" 패러다임은 이후 NLP 전체의 표준 접근 방식이 되었다. GPT 시리즈도 비슷한 아이디어를 따랐지만 다른 길을 택했다 — 단방향 생성이다. BERT는 양방향 이해를 선택했다. 두 갈래의 길은 각각 방대한 모델 계보를 탄생시켰다.

## 1. 문제

2018년, NLP는 어색한 현실에 놓여 있었다: 모든 태스크마다 전용 모델 구조를 따로 설계해야 했다. 질의응답에는 하나의 모델이 필요하고, 감성 분석에는 또 다른 모델이, 개체명 인식에는 또 다른 모델이 필요했다. 각 태스크의 레이블 데이터는 부족했고, 하나의 태스크에서 학습한 모델을 다른 태스크로 전이하기도 어려웠다.

이미 pre-training 시도는 있었다. ELMo는 양방향 LSTM을 사용해 문맥 표현을 학습했지만, pre-training된 피처를 태스크별 아키텍처에 "덧붙이는" 방식이었을 뿐 — 아키텍처 자체는 여전히 태스크 전용이었다. OpenAI GPT는 Transformer를 사용해 pre-training과 fine-tuning을 수행했지만, 왼쪽에서 오른쪽으로만 볼 수 있었다(단방향) — 각 토큰은 자신보다 앞에 있는 토큰만 참조할 수 있었고, 뒤에 있는 토큰은 볼 수 없었다.

논문은 단방향 언어 모델이 깊은 양방향 문맥을 필요로 하는 언어 이해 태스크에서 상당한 한계가 있다고 주장했다. 예를 들어:

> "He picked up the _____ and started playing."

왼쪽 문맥("He picked up the")만 보면 답은 무엇이든 될 수 있다. 하지만 오른쪽 문맥("and started playing")을 보면, 어떤 악기라는 것을 바로 알 수 있다. 많은 언어 이해 태스크에서 양방향 문맥은 본질적으로 더 유리하다.

## 2. 핵심 아이디어: 단어 일부를 가리고 모델이 맞추게 하기

BERT의 해법은 직관적이다: 양방향 언어 모델을 전통적인 방식으로 학습시킬 수 없으므로(각 단어가 간접적으로 "자기 자신을 볼" 수 있게 되므로), 학습 목표를 바꾼다.

**Masked Language Model (MLM)**: 입력 토큰의 15%를 무작위로 마스킹한다 — 구체적으로는 특수 \[MASK\] 토큰으로 대체한다 — 그런 다음 모델이 문맥으로부터 마스킹된 단어를 예측하게 한다. 이 아이디어는 심리학의 Cloze 테스트(1953년 Taylor가 제안)에서 유래한 것으로, 위의 빈칸 채우기 문제와 같은 원리다.

마스킹 후 모델은 왼쪽과 오른쪽 문맥을 모두 사용해야 예측할 수 있으므로, 양방향 이해가 자연스럽게 나타난다.

그러나 선택된 모든 토큰을 \[MASK\]로 대체하면 문제가 생긴다: \[MASK\]는 fine-tuning 중에는 나타나지 않으므로, pre-training과 fine-tuning 사이에 불일치가 발생한다. 논문의 해법: 선택된 15%의 토큰 중, 80%는 \[MASK\]로 대체하고, 10%는 임의의 토큰으로 대체하며, 10%는 그대로 둔다. 이렇게 하면 모델은 단순히 "\[MASK\]가 보이니 예측해야 한다"에 의존할 수 없고, 모든 위치에서 이해를 유지해야 한다.

```rust
// Rust

fn mask_tokens(tokens: &[Token], mask_prob: f64) -> (Vec<Token>, Vec<usize>, Vec<Token>) {
    let mut masked = tokens.to_vec();
    let mut positions = Vec::new();
    let mut labels = Vec::new();

    for i in 0..tokens.len() {
        if random::<f64>() < mask_prob {  // 15% chance of being selected
            positions.push(i);
            labels.push(tokens[i].clone()); // remember original token for training
            let r = random::<f64>();
            if r < 0.8 {
                masked[i] = Token::MASK;       // 80%: replace with [MASK]
            } else if r < 0.9 {
                masked[i] = random_token();     // 10%: replace with random token
            }
            // remaining 10%: keep original token unchanged
        }
    }
    (masked, positions, labels)  // return masked input, positions, and original labels
}
```

## 3. 두 번째 Pre-training 태스크: Next Sentence Prediction

많은 NLP 태스크(질의응답, 자연어 추론 등)는 두 문장 간의 관계를 이해해야 하지만, 언어 모델은 그런 관계를 직접 모델링하지 않는다.

논문은 두 번째 pre-training 태스크를 추가했다: **Next Sentence Prediction (NSP)**. 모델에 두 문장 A와 B가 주어지고 — 50%의 확률로 B는 A 다음에 실제로 오는 문장이며, 50%의 확률로 B는 코퍼스에서 무작위로 추출된 문장이다. 모델은 B가 실제로 A 다음에 오는 문장인지 판단해야 한다.

태스크 설계 자체는 단순하지만, 논문의 ablation 실험(구성 요소를 하나씩 제거하며 영향을 관찰하는 방법)에서 NSP를 제거하면 질의응답과 자연어 추론 태스크의 성능이 눈에 띄게 하락하는 것으로 나타났다. 다만, 이후 연구(RoBERTa 등)에서는 NSP의 필요성에 대해 다른 결론에 도달했다.

```rust
// Rust

struct PretrainingExample {
    tokens: Vec<Token>,      // [CLS] sentence_A [SEP] sentence_B [SEP]
    segment_ids: Vec<usize>, // 0 for sentence A, 1 for sentence B
    masked_positions: Vec<usize>,  // positions that were masked
    masked_labels: Vec<Token>,     // original tokens at masked positions
    is_next: bool,                 // whether B is the actual next sentence
}
```

## 4. 모델 아키텍처

BERT의 아키텍처는 새로운 발명이 아니다. 단순히 [Transformer](/ko/posts/attention-is-all-you-need/)의 인코더 부분을 레이어별로 쌓은 것이다.

논문은 두 가지 크기를 명시한다:

- **BERT_BASE**: 12 레이어, hidden size 768, 12 attention head, 110M 파라미터
- **BERT_LARGE**: 24 레이어, hidden size 1024, 16 attention head, 340M 파라미터

BERT_BASE는 OpenAI GPT와 대략 같은 파라미터 수를 가지므로 직접 비교가 가능하다. 둘 사이의 가장 핵심적인 차이는 딱 하나다: GPT는 단방향 attention을 사용하고(각 토큰은 왼쪽 토큰만 볼 수 있음), BERT는 양방향 attention을 사용한다(각 토큰이 모든 위치를 볼 수 있음).

입력 표현은 세 가지 구성 요소의 합이다:

- **Token Embedding**: WordPiece 토크나이제이션, 30,000 어휘
- **Segment Embedding**: 토큰이 문장 A에 속하는지 문장 B에 속하는지 표시
- **Position Embedding**: 모델에 각 토큰의 위치를 알려줌 (BERT는 사인파가 아닌 학습된 position embedding을 사용)

모든 입력 시퀀스는 특수 \[CLS\] 토큰으로 시작하며, 이 토큰의 최종 레이어 hidden state가 문장 수준 분류(예: NSP, 감성 분석)에 사용된다. 두 문장은 \[SEP\]로 구분한다.

```rust
// Rust

struct BertInput {
    token_ids: Vec<usize>,    // [CLS] tok1 tok2 [SEP] tok3 tok4 [SEP]
    segment_ids: Vec<usize>,  // [0,    0,   0,   0,    1,   1,   1  ]
    position_ids: Vec<usize>, // [0,    1,   2,   3,    4,   5,   6  ]
}

struct BertModel {
    token_embedding: Embedding,     // token embedding
    segment_embedding: Embedding,   // segment embedding
    position_embedding: Embedding,  // position embedding
    layers: Vec<TransformerLayer>,  // 12 or 24 Transformer encoder layers
}

impl BertModel {
    fn forward(&self, input: &BertInput) -> Vec<Tensor> {
        // sum the three embeddings
        let mut hidden = self.token_embedding.lookup(&input.token_ids)
            + self.segment_embedding.lookup(&input.segment_ids)
            + self.position_embedding.lookup(&input.position_ids);

        // pass through each Transformer encoder layer
        for layer in &self.layers {
            hidden = layer.forward(&hidden);  // bidirectional self-attention + feed-forward
        }
        hidden
    }
}
```

## 5. Fine-tuning: 하나의 모델로 모든 태스크를

BERT의 가장 우아한 점은 fine-tuning의 단순함이다. Pre-training이 완료되면, 다운스트림 태스크가 무엇이든 절차는 거의 동일하다: BERT 위에 태스크별 출력 레이어 하나를 추가한 뒤, 소량의 레이블 데이터로 전체 파라미터를 fine-tuning한다.

- **텍스트 분류** (감성 분석, 자연어 추론): \[CLS\] 위치의 출력 벡터를 선형 분류기에 입력
- **질의응답** (주어진 문단에서 답의 범위 찾기): 각 토큰의 출력 벡터에 두 개의 선형 변환을 적용하여 답의 시작과 끝 위치를 예측
- **시퀀스 레이블링** (개체명 인식): 각 토큰의 출력 벡터에 분류기를 부착하여 토큰별로 레이블을 예측

Pre-training에는 며칠이 걸릴 수 있지만, fine-tuning은 보통 수 분에서 수 시간이면 된다(대부분의 태스크가 TPU 한 대에서 1시간 이내). 이 효율성 차이가 "pre-train + fine-tune" 패러다임의 핵심 매력이다.

## 6. 실험 결과

논문은 11개의 NLP 태스크에서 실험을 수행했으며, 모든 태스크에서 새로운 기록을 세웠다.

**GLUE 벤치마크** (General Language Understanding Evaluation, 8개 하위 태스크):
- BERT_LARGE 평균 80.5%, 이전 최고(OpenAI GPT) 대비 7.7 퍼센트 포인트 향상
- 가장 큰 하위 태스크인 MNLI에서 4.6% 향상

**SQuAD v1.1** (독해 질의응답, Test F1):
- BERT_LARGE 단일 모델 + TriviaQA 데이터: F1 91.8, 인간 성능(91.2) 초과
- BERT_LARGE 앙상블 + TriviaQA 데이터: F1 93.2

**SQuAD v2.0** (답할 수 없는 질문 포함):
- F1 83.1, 이전 최고 시스템 대비 5.1 포인트 향상

**SWAG** (상식 추론):
- 정확도 86.3%, OpenAI GPT 대비 8.3 포인트 향상

논문은 또한 모델 크기에 대한 ablation 실험을 수행했으며, 중요한 결론을 도출했다: 더 큰 모델이 모든 태스크에서 더 좋은 성능을 보였으며, 레이블 데이터가 매우 적은 태스크(최소 3,600개)에서도 마찬가지였다. 이는 작은 데이터셋에서 큰 모델이 과적합(학습 데이터를 암기하여 새로운 데이터에서 성능이 저하되는 현상)할 것이라는 당시의 직관에 반하는 결과로, pre-training된 지식이 이 위험을 효과적으로 완화한다는 것을 시사했다.

## 7. 학습 상세

**Pre-training 데이터**: BooksCorpus (8억 단어) + 영어 Wikipedia (25억 단어), 텍스트 본문만 사용하고 목록, 표, 헤더는 제외. 논문은 장거리 문맥 관계를 포착하기 위해 문장 수준으로 셔플된 코퍼스가 아닌 문서 수준 코퍼스를 사용하는 것의 중요성을 강조했다.

**토크나이제이션**: WordPiece, 어휘 크기 30,000. WordPiece는 흔하지 않은 단어를 더 작은 서브워드 단위로 분할한다 — 예를 들어, "playing"은 "play" + "##ing"으로 분할될 수 있다.

**옵티마이저**: Adam, 학습률 1e-4, 처음 10,000 스텝에 걸쳐 선형 warmup 후 선형 감쇠. 배치 크기 256 시퀀스, 최대 시퀀스 길이 512.

**하드웨어**: BERT_BASE는 Cloud TPU 4대(TPU 칩 16개)에서 4일간 학습. BERT_LARGE는 Cloud TPU 16대(TPU 칩 64개)에서 4일간 학습.

**Dropout**: 모든 레이어에서 0.1. 활성화 함수는 원래 Transformer의 ReLU 대신 GELU (Gaussian Error Linear Unit)를 사용.

## 8. 나의 소감

이 논문을 읽고 나서 몇 가지 인상적인 점이 있다.

첫째, BERT의 진정한 기여는 모델 아키텍처(단순히 Transformer 인코더에 불과하다)가 아니라 학습 방법에 있다. Masked language model 아이디어는 단순해 보이지만, 모델이 "치팅"하지 않으면서 양방향 문맥을 활용하는 근본적인 모순을 우아하게 해결한다. 80/10/10 마스킹 전략은 더욱 정교하게 설계되어 pre-training과 fine-tuning 사이의 불일치를 해소한다.

둘째, BERT와 GPT의 갈림길은 이 논문에서 이미 명확하다. GPT의 autoregressive 목표는 생성에 더 자연스럽게 적합하고, BERT의 양방향 인코딩은 판별적 언어 이해 태스크에 더 적합하다. GPT는 이후 더 강력한 생성 능력 쪽으로 스케일업했고, BERT는 RoBERTa, ALBERT, DeBERTa를 포함한 이해 중심 모델 계보를 탄생시켰다. 두 계열 모두 각자의 영역에서 계속 활약하고 있다.

셋째, "pre-train + fine-tune" 패러다임의 영향은 NLP를 훨씬 넘어선다. 컴퓨터 비전도 이후 같은 접근 방식으로 전면 전환했고(ViT, MAE), 멀티모달 모델(CLIP, GPT-4V)까지도 대규모 pre-training에 fine-tuning이나 프롬프팅을 결합하는 방식을 기반으로 한다. BERT가 pre-training을 최초로 시도한 것은 아니지만, 이렇게 간결한 방식으로 pre-training을 유용한 기법에서 NLP의 주류 작업 패러다임으로 끌어올린 것은 BERT가 처음이었다.

넷째, Rust로 BERT의 입력 처리를 재구현하면 설계가 얼마나 깔끔한지 체감할 수 있다. \[CLS\] + 문장 A + \[SEP\] + 문장 B + \[SEP\], 세 가지 임베딩을 합산 — 이 하나의 파이프라인으로 분류, 질의응답, 시퀀스 레이블링을 통합된 코드베이스 하나로 처리할 수 있다. 이 "하나의 모델로 모든 태스크를" 이라는 단순함이야말로 진정한 강점이다.

이 논문의 제목에서 가장 중요한 단어가 하나 있다: Pre-training. BERT 이전에는 모든 NLP 태스크가 처음부터 학습하고 있었다. BERT는 한 가지를 증명했다: 언어에 대한 범용 지식을 먼저 학습한 뒤, 거의 모든 태스크로 전이할 수 있다는 것이다.

그 아이디어가 한 분야 전체의 작동 방식을 바꿨다.

---

**논문 읽기 시리즈**

- [<i>Sequence to Sequence Learning with Neural Networks</i>](/ko/posts/sequence-to-sequence-learning-with-neural-networks/) — 인코더-디코더 패러다임의 확립
- [<i>Neural Machine Translation by Jointly Learning to Align and Translate</i>](/ko/posts/neural-machine-translation-by-jointly-learning-to-align-and-translate/) — Attention의 기원
- [<i>Attention Is All You Need</i>](/ko/posts/attention-is-all-you-need/) — Attention이 주역이 되다: Transformer의 탄생
- [<i>Scaling Laws for Neural Language Models</i>](/ko/posts/scaling-laws-for-neural-language-models/) — 스케일의 수학: 왜 더 큰 모델이 예측 가능하게 더 좋은가
- [<i>Language Models are Few-Shot Learners</i>](/ko/posts/language-models-are-few-shot-learners/) — 더 큰 모델, 문맥에서 더 잘 이끌어내는 능력
- [<i>Training Compute-Optimal Large Language Models</i>](/ko/posts/training-compute-optimal-large-language-models/) — 컴퓨팅 예산을 현명하게 쓰는 법
