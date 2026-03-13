---
title: 論文共讀：《Training Compute-Optimal Large Language Models》
date: 2026-03-11
category: "Paper Reading"
description: Chinchilla 論文：為什麼大多數大模型其實訓練不足，以及如何聰明地分配算力預算，附 Rust 複現核心程式碼
tags: [paper-reading, chinchilla, scaling-laws, AI, LLM, rust]
pinned: false
---

2022 年 3 月 29 日，DeepMind 的一組研究者在 arXiv（一個學術論文預印本網站，論文不用等期刊審稿就能直接發布）上傳了一篇論文：<a href="/papers/Training%20Compute-Optimal%20Large%20Language%20Models.pdf" target="_blank">《Training Compute-Optimal Large Language Models》</a>（訓練算力最優的大型語言模型）。

第一作者是 Jordan Hoffmann，共同作者包括 Sebastian Borgeaud、Arthur Mensch、Elena Buchatskaya、Trevor Cai、Eliza Rutherford 等人：當時全部在 DeepMind。其中 Arthur Mensch 後來共同創立了 Mistral AI，歐洲最重要的 AI 公司之一。

這篇論文通常被稱為「Chinchilla 論文」，名字來自團隊為驗證發現而訓練的 700 億參數模型。這個名字流傳了下來：不是論文標題，而是那隻動物。在 AI 圈子裡，「Chinchilla scaling」成了這篇論文核心主張的代名詞。

而那個主張很簡單、很大膽，也讓整個業界很不舒服：**2022 年最大的那些語言模型，很多並不是「模型不夠大」，而是在各自的算力預算下被顯著欠訓練了。**

## 1. 要解決什麼問題

到 2022 年初，AI 社群已經內化了 [Kaplan 等人（2020）](/zh-hant/posts/scaling-laws-for-neural-language-models/)的一個明確教訓：更大的模型可預測地更好。縮放定律論文已經表明性能遵循冪律，而且在固定算力預算下，你應該把模型做到盡可能大。

業界照做了。到 2022 年春天，GPT-3 有 1750 億參數，訓練了 3000 億詞元。DeepMind 自己的 Gopher 有 2800 億參數，訓練了 3000 億詞元。隨後 Google 又發布了 5400 億參數的 PaLM。趨勢很明顯：往上堆參數。

但一個問題藏在眼皮底下。Kaplan 等人的結論是，當你擴大算力時，大部分預算應該花在模型大小上（N ∝ C^0.73），而相對少地花在訓練資料上（D ∝ C^0.27）。這意味著：把模型做得巨大，用適量的資料訓練就好。

Hoffmann 的團隊問了一個簡單的問題：這真的對嗎？

## 2. 三種獨立方法，同一個答案

這篇論文格外有說服力的地方在於方法論。團隊沒有依賴單一實驗，而是從三個完全獨立的角度切入同一個問題，三者最終收斂到同一個答案。

**方法一：固定算力，改變分配。** 他們訓練了超過 400 個模型，參數量從 7000 萬到 160 億以上，每個模型在模型大小和訓練資料之間有不同的分配比例，但總算力相同。對每個算力水平，他們找出哪個模型大小能讓損失最低。

**方法二：IsoFLOP 曲線。** 他們訓練了 9 種不同大小的模型（從 7000 萬到 100 億參數），使用不同量的資料，特別設計為每組實驗使用大致相同的總算力。然後擬合曲線，找出每個算力水平對應的最優模型大小。

**方法三：擬合參數化損失函數。** 他們把以下方程式擬合到所有訓練結果：

> L̂(N, D) = E + A / N^α + B / D^β

其中 E 是不可約損失（自然語言的熵：任何模型都無法做得更好），A/N^α 反映模型大小的瓶頸，B/D^β 反映資料量的瓶頸。從擬合出的參數，他們推導出最優的 N 和 D 作為算力的函數。

三種方法一致同意：

> N_opt ∝ C^a, D_opt ∝ C^b，其中 a ≈ 0.50，b ≈ 0.50

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

指數 a ≈ b ≈ 0.5 的真正含義是：隨著算力增長，模型大小和訓練資料應當按近似相同的比例一起擴張。算力增長 10 倍時，兩者都大約增到 3.2 倍；算力翻倍時，兩者都大約增到 1.4 倍。換句話說，模型大小每翻一倍，訓練資料也應該翻一倍。這直接推翻了 Kaplan 等人的結論：他們認為算力主要應該花在模型大小上。

## 3. 為什麼 Kaplan 會錯

這不是誰「做錯了」，而是實驗設定不同，最終導致了不同的最優分配結論。兩個團隊都做了嚴謹的工作。

Kaplan 等人使用了固定的學習率調度，沒有根據訓練長度進行調整。當你讓模型訓練更多步而不調整學習率調度時，性能會下降：不是因為模型本身更差，而是因為優化過程不理想。這讓長時間訓練看起來沒那麼有效，從而偏向了更大的模型配更少的訓練步數。

Hoffmann 的團隊為每次訓練調整了學習率調度，確保每種配置都有公平的機會。這樣做之後，在更多資料上訓練更久，其實比 Kaplan 的數字所暗示的有價值得多。

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

## 4. 參數化損失函數

論文的方法三值得細看，因為它給出了一個完整的性能數學模型：

> L̂(N, D) = E + A / N^α + B / D^β

其中擬合出的常數是：

- E = 1.69 — 不可約損失（自然語言的熵）
- A = 406.4, α = 0.34 — 模型大小項
- B = 410.7, β = 0.28 — 資料量項

這個方程式的結構值得細品。損失有三個組成部分：一個你永遠無法突破的下限（E），參數太少的懲罰（A/N^α），以及資料太少的懲罰（B/D^β）。模型大小的懲罰和資料量的懲罰是相加的：它們爭奪你的注意力和算力預算。

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

## 5. 觸目驚心的表格

論文的 Table 1 列出了當時幾個大模型的實際參數量和訓練詞元數，Table 3 則給出了不同模型大小下 compute-optimal 的詞元估計。把兩張表對照著看，就像一份對整個業界的審計報告：

| 模型 | 參數量 | 實際訓練詞元 | Chinchilla 最優詞元 |
|------|--------|-------------|---------------------|
| GPT-3 | 1750 億 | 3000 億 | 3.7 兆 |
| Gopher | 2800 億 | 3000 億 | 5.9 兆 |
| Jurassic-1 | 1780 億 | 3000 億 | 3.7 兆 |
| MT-NLG | 5300 億 | 2700 億 | 11.0 兆 |

每個模型都只用了大約 3000 億詞元。但按照 Chinchilla 的分析，GPT-3 應該用 3.7 兆詞元訓練：是實際的 12 倍以上。Gopher 應該接近 6 兆。最大的 MT-NLG（5300 億參數）應該用 11 兆詞元訓練：是實際訓練資料的 40 倍。

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

規律非常明顯。整個業界不約而同地使用了差不多的訓練資料量：大約 3000 億詞元：不管模型有多大。彷彿所有人都認定 3000 億詞元「夠了」，然後把所有多出來的算力都堆到更大的模型上。Chinchilla 說這恰恰做反了。

## 6. 實證：Chinchilla 對決 Gopher

為了驗證理論，團隊訓練了 Chinchilla：一個 700 億參數的模型，用 1.4 兆詞元訓練。Chinchilla 使用的算力預算和 Gopher（2800 億參數，3000 億詞元）相同：同樣的總訓練成本，只是分配方式不同。

結果很決定性。Chinchilla 在幾乎所有基準測試上都優於 Gopher，儘管小了 4 倍：

- **MMLU**（大規模多任務語言理解）：Chinchilla 67.6% vs. Gopher 60.0% vs. GPT-3 43.9%
- **閱讀理解**（RACE-h）：Chinchilla 73.3% vs. Gopher 71.6%
- **常識推理**（HellaSwag）：Chinchilla 80.8% vs. Gopher 79.2%
- **BIG-bench**：Chinchilla 在大多數任務上優於 Gopher

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

一個小 4 倍的模型在幾乎所有基準上打敗更大的模型：用同樣的算力：這是非常有力的實證。算力沒有浪費，只是從參數重新導向了資料。

## 7. 實際影響

Chinchilla 論文對業界產生了立即而具體的影響。

**更小的模型部署成本更低。** 訓練成本是一次性的，但推理成本：實際執行模型來生成文字的成本：與模型大小成正比，每一次使用者發送請求都要付出。一個 700 億參數的模型，部署成本是 2800 億參數模型的四分之一。如果更小的模型性能還更好，那是雙贏：更好的品質加上更低的成本。

**資料成了瓶頸。** Chinchilla 之前，限制因素是算力：你能搞到多少 GPU？Chinchilla 之後，限制因素變成了資料：你去哪裡找幾兆高品質的詞元？這引發了全業界對訓練資料的爭奪：大規模網路爬取、資料集篩選，最終催生了合成資料運動。

**LLaMA 時刻。** Meta 的 LLaMA（2023 年 2 月）可以說是 Chinchilla 縮放定律最直接的應用。LLaMA-13B 用 1 兆詞元訓練，在大多數基準上超過了 GPT-3（1750 億參數）。LLaMA-65B 用 1.4 兆詞元訓練，與 Chinchilla 和 PaLM-540B 處於同一水平。Meta 明確引用了 Chinchilla 論文，刻意訓練更小的模型、使用遠超過去慣例的資料量。

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

## 8. 我的思考

第一，這篇論文是一次修正：而且是優雅的修正。它沿用了 Kaplan 等人的框架，找出了方法論上的缺陷（固定學習率調度），修正了它，得出了不同的答案。它沒有否定前人的工作，而是在其基礎上推進。參數化損失函數 L̂(N, D) = E + A/N^α + B/D^β 是 Kaplan 公式的精煉，而非替代。科學最好的樣子正是如此：有人做了仔細的工作，另一群人做了更仔細的工作，整個領域因此進步。

第二，這篇論文最驚人的發現不是數學：而是理論與實踐之間的巨大鴻溝。業界所有人都看得到 3000 億詞元正在成為一個預設值。但直到這個團隊跑了數字，沒有人認真質疑過它。那些模型不是太小，而是被餓著了。解法不是做更大：而是餵更多。

第三，等比縮放的結果（a ≈ b ≈ 0.5）因其簡潔而優美。模型大小和資料之間沒有不對稱。如果你有更多算力，兩邊等量擴大。不需要複雜的分配策略。「我下一塊錢的算力該花在哪裡？」Chinchilla 給出的答案不是繼續單押參數量，而是讓模型大小和訓練資料近似等比例地一起增長。

第四，實際遺產是巨大的。Chinchilla 之前，通往更好 AI 的路徑是「把它做大」。Chinchilla 之後，路徑變成了「把它訓好」。這一個轉變讓強大的模型變得可及：那些負擔不起最大參數量的組織，只要能整理出大量資料集，就能訓練出有競爭力的模型。LLaMA、Mistral、以及整個開源 LLM 生態系，都直接受惠於這個洞察。

Kaplan 的論文說：更大的模型可預測地更好。Chinchilla 的論文說：沒錯，但你們一直在用錯誤的方式把它做大。別再囤參數了，開始餵資料。

一篇論文給了業界擴大規模的信心。另一篇教會了業界怎麼擴。

---

**論文共讀系列**

- [《Sequence to Sequence Learning with Neural Networks》](/zh-hant/posts/sequence-to-sequence-learning-with-neural-networks/) — 編碼器-解碼器範式的確立
- [《Neural Machine Translation by Jointly Learning to Align and Translate》](/zh-hant/posts/neural-machine-translation-by-jointly-learning-to-align-and-translate/) — 注意力機制的起源
- [《Attention Is All You Need》](/zh-hant/posts/attention-is-all-you-need/) — 注意力成為主角，Transformer 的誕生
- [《BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding》](/zh-hant/posts/bert/) — 預訓練範式的確立
- [《Scaling Laws for Neural Language Models》](/zh-hant/posts/scaling-laws-for-neural-language-models/) — 規模的數學
- [《Language Models are Few-Shot Learners》](/zh-hant/posts/language-models-are-few-shot-learners/) — 更大的模型，更善於從上下文中誘發能力
