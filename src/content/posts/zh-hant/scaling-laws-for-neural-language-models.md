---
title: 論文共讀：《Scaling Laws for Neural Language Models》
date: 2026-03-01
category: "Paper Reading"
description: 規模的數學：為什麼更大的模型可預測地更好，附 Rust 複現核心程式碼
tags: [paper-reading, scaling-laws, AI, LLM, rust]
pinned: false
---

2020 年 1 月 23 日，OpenAI 的十位研究者在 arXiv（一個學術論文預印本網站，論文不用等期刊審稿就能直接發布）上傳了一篇論文：<a href="/papers/2001.08361v1.pdf" target="_blank">《Scaling Laws for Neural Language Models》</a>（神經語言模型的縮放定律）。

十位作者是 Jared Kaplan、Sam McCandlish、Tom Henighan、Tom B. Brown、Benjamin Chess、Rewon Child、Scott Gray、Alec Radford、Jeffrey Wu 和 Dario Amodei。當時全部在 OpenAI。

這份作者名單回頭看很有意思。Jared Kaplan 和 Sam McCandlish 是理論物理出身：Kaplan 在加入 OpenAI 之前是 Johns Hopkins 大學的弦理論教授。Dario Amodei 是研究副總裁。Tom B. Brown 後來成為 GPT-3 論文的第一作者。Alec Radford 設計了 GPT-1 和 GPT-2。不到兩年，Kaplan、McCandlish 和 Amodei 就離開 OpenAI，共同創立了 Anthropic（Claude 背後的公司）。

弦理論學家有個習慣：在複雜現象裡尋找簡潔的普適定律。

這個習慣貫穿了整篇論文。

## 1. 要解決什麼問題

到 2020 年初，深度學習社群已經知道更大的模型通常表現更好。但「通常」不是科學。人們回答不了最基本的實際問題：如果我把算力預算翻倍，性能會提升多少？這筆預算該花在更大的模型、更多的資料、還是更長的訓練上？有沒有一個公式？

這篇論文回答了這些問題。不是靠直覺，不是靠經驗法則：靠方程式。

## 2. 冪律：核心發現

論文的核心發現是，語言模型的性能遵循**冪律（power laws）**。在論文測量到的區間內，只要性能主要受某一個因素限制、而不是被另外兩個因素卡住，測試損失（衡量模型預測下一個詞的能力：越低越好）和參數量、資料量、算力在雙對數座標上都近似呈直線關係。

三個方程式總結了整篇論文：

> L(N) ≈ (N_c / N)^α_N, where α_N ≈ 0.076
>
> L(D) ≈ (D_c / D)^α_D, where α_D ≈ 0.095
>
> L(C) ≈ (C_c / C)^α_C, where α_C ≈ 0.050

不用被符號嚇到，拆開來看：

- **L** 是測試損失：一個數字就能概括模型表現如何。越低越好
- **N** 是參數數量（模型大小）。參數越多，模型能儲存的模式就越多
- **D** 是訓練用的資料詞元數量。資料越多，可以學到的模式就越多
- **C** 是訓練用的總算力，以 PetaFLOP-days 為單位（1 PetaFLOP-day = 10^15 次浮點運算跑一整天）
- **N_c, D_c, C_c** 是常數（曲線上的參考點）
- **α**（alpha）是指數：它告訴你雙對數圖上直線的斜率。指數越大，代表隨著規模擴大，性能提升越快

關鍵洞察：這些是冪律，不是對數曲線。對數曲線很快就會趨平：輸入翻倍，輸出幾乎不動。冪律則大方得多：至少在論文測量到的區間內，性能沒有出現明顯「撞牆」，而是持續沿著冪律改善。論文也提醒了：這個趨勢不可能無限延伸到零損失，最終一定會變平：但在觀測範圍內，趨勢乾淨俐落。

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

指數本身就說明了問題。資料集大小（α = 0.095）每多一個量級帶來的提升最大。模型大小（α = 0.076）次之。算力（α = 0.050）最小：因為如果不合理分配算力到模型大小和訓練時長上，單純堆算力是浪費的。真正的槓桿在於擴大正確的東西。

## 3. 在論文測試過的範圍內，架構形狀的重要性低於總規模

這是論文最讓人意外的地方。

團隊測試了不同深度（層數）、寬度（隱藏維度）、注意力頭數和前饋維度的 Transformer。在論文測試過的 Transformer 形狀範圍內，只要非嵌入參數量接近，深度和寬度的具體分配對損失影響很小。

一個只有 2 層但隱藏維度巨大的 Transformer？和一個 40 層但隱藏維度很小的 Transformer 損失差不多：前提是非嵌入參數預算接近。

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

這有一個深遠的含義：你不需要花好幾個禮拜去搜尋「最優」架構。選一個合理的 Transformer 形狀，然後把精力集中在把它做大就好。論文之所以把 embedding 參數從 N 中排除，是因為他們發現 embedding 參數對性能的貢獻遠小於非 embedding 參數：模型的「思考」能力在 Transformer 層裡，不在詞表裡。

## 4. 模型何時過擬合：資料瓶頸

更大不一定更好：如果你的資料集太小的話。論文這裡真正漂亮的地方，是給出了一個統一的二維公式，把模型規模和資料規模如何共同決定性能寫進了一個式子：

> L(N, D) = [(N_c / N)^(α_N / α_D) + D_c / D]^α_D

這個公式說的是：損失不是單獨由模型大小或資料大小決定的：而是由兩者共同決定。當 N 大到第一項消失時，剩下的項表明損失被資料卡住了。當 D 大到第二項消失時，剩下的是模型規模的瓶頸。公式在兩種情況之間平滑過渡，過擬合就是兩項競爭的自然結果。

從這個關係出發，論文給出了一個粗略的經驗門檻：過擬合開始明顯影響性能的臨界點：

> D ≳ 5 × 10³ × N^0.74 詞元，可將過擬合控制在論文討論的閾值附近

白話翻譯：模型越大，需要的資料就越多：但增長是次線性的。大 10 倍的模型只需要約 10^0.74 ≈ 5.5 倍的資料。更大的模型樣本效率更高：它們能從每個訓練詞元中提取更多資訊。

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

按這條關係粗略推算，175B 級別模型要把過擬合壓在論文討論的閾值附近，資料量應接近兆級 token。反過來看，GPT-3 的 3000 億詞元其實並不充裕。這也說明「模型多大、資料餵多少」並不是拍腦袋，而是有可分析的權衡：後來業界重新審視這個配比（最典型的就是 Chinchilla 論文，Hoffmann 等人，2022 年），正是因為意識到了許多大模型的資料其實不夠。

## 5. 計算最優訓練：真正的重點

如果你有固定的算力預算，該怎麼花？這是論文中最有實際意義的問題，答案卻違反直覺。

論文發現最優分配遵循：

> N_opt ∝ C^0.73 (模型大小應該隨算力增長得最快)
>
> B_opt ∝ C^0.24 (批次大小增長較慢)
>
> S_opt ∝ C^0.03 (訓練步數幾乎不增加)

翻譯一下：如果算力預算增加 10 倍，你應該把模型做大約 5.4 倍，批次大小增加約 1.7 倍，訓練時長幾乎不變（約多 1.07 倍的步數）。

違反直覺的地方在於：**你應該訓練非常大的模型，然後在遠未收斂之前就停下來。** 大多數人的本能是把一個小模型徹底訓練到收斂。縮放定律說的恰好相反：在相同的算力預算下，一個部分訓練的大模型優於一個完全訓練的小模型。

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

這個結果塑造了整個產業。五個月後發表的 GPT-3 直接遵循了這個邏輯：訓練一個在當時規模空前的 1750 億參數模型，而不是把一個小模型徹底訓練完。後來的「Chinchilla」論文（Hoffmann et al., 2022）更新了這些指數，並指出大多數大型模型相對於最優資料分配其實是訓練不足的：但核心洞察，即存在一個可計算的最優權衡，源頭在這裡。

## 6. 臨界批次大小：何時該增加平行度

論文還發現批次大小存在一個「甜蜜點」，而且它取決於當前的損失值：

> B_crit ∝ L^(-4.8)

隨著訓練推進、損失降低，臨界批次大小會增長。訓練初期損失高，小批次就夠用：每個批次提供的梯度信號夠強。後期模型已經學完了簡單的模式，需要更大的批次來平均掉噪聲才能繼續進步。

低於臨界批次大小時，批次翻倍大致能讓訓練時間減半（完美的平行化）。高於臨界批次大小時，批次翻倍幾乎沒有幫助：只是在浪費算力。

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

這是很實用的工程智慧。很多團隊全程使用固定的批次大小。縮放定律告訴你應該隨著訓練推進逐步增大批次：開始用小批次，模型變好後再放大。

## 7. 我的思考

讀完這篇論文，有幾個感受。

第一，這篇論文最深層的貢獻不是任何一個具體的數字，而是證明了神經網路的性能受簡單、可預測的定律支配。在這篇論文之前，訓練大模型基本上是經驗主義：試各種東西，調超參數，然後祈禱效果好。這篇論文之後，你可以算。你可以在訓練之前就預測模型的性能。它至少把大模型訓練裡最貴、最關鍵的一部分：資源分配：從經驗試錯推進到了可估算、可規劃的工程問題。

第二，作者的背景很重要。Kaplan 和 McCandlish 帶來了理論物理的思維方式：精確測量，擬合冪律，尋找普適性。這不是大多數機器學習論文的寫法。大多數 ML 論文提出一個新架構，然後在基準測試上證明它比基線好。這篇論文沒有提出任何新架構。它提出了一種思考方式。工具不新：洞察是新的。

第三，「盡量把模型做大，但不用訓到頭就可以停」這個結論真的違反直覺，而且直接重塑了整個產業分配資源的方式。在這篇論文之前，常規做法是選一個模型大小然後訓練到完全收斂：把這筆算力預算花到底。有了這篇論文之後，問題變成了：同樣一筆算力預算，與其把一個小模型訓到極致，不如把模型做到盡可能大，訓到「夠用」就停：因為一個沒訓完的大模型，比一個訓透的小模型表現更好。這個思路直接催生了 GPT-3（1750 億參數，3000 億詞元），並影響了之後所有的大模型。

第四，從歷史脈絡來看，這篇論文可以被視為 [GPT-3 論文](/zh-hant/posts/language-models-are-few-shot-learners/)的理論基礎。GPT-3 直接引用了它，GPT-3 論文也明確展示了 few-shot 能力隨模型容量平滑提升。把 GPT-3 選擇 1750 億參數看作受縮放定律啟發，是合理的推斷：儘管 GPT-3 論文本身並沒有逐句寫明「我們按 Kaplan 公式設定了參數量」。但可以說，沒有縮放定律提供的信心，在那個規模上做決策的不確定性會大得多。

「更大的模型更強」，這句話在 2020 年之前只是一種感覺。這篇論文把它變成了一組方程式：告訴你強多少、花多少、怎麼花最划算。

AI 產業後來變成了一場算力競賽。讀完這篇論文你就明白了：這場競賽不是盲目的軍備競賽，而是有人先算清了帳。

---

**論文共讀系列**

- [《Sequence to Sequence Learning with Neural Networks》](/zh-hant/posts/sequence-to-sequence-learning-with-neural-networks/) — 編碼器-解碼器範式的確立
- [《Neural Machine Translation by Jointly Learning to Align and Translate》](/zh-hant/posts/neural-machine-translation-by-jointly-learning-to-align-and-translate/) — 注意力機制的起源
- [《Attention Is All You Need》](/zh-hant/posts/attention-is-all-you-need/) — 注意力成為主角，Transformer 的誕生
- [《BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding》](/zh-hant/posts/bert/) — 預訓練範式的確立
- [《Language Models are Few-Shot Learners》](/zh-hant/posts/language-models-are-few-shot-learners/) — 更大的模型，更善於從上下文中誘發能力
- [《Training Compute-Optimal Large Language Models》](/zh-hant/posts/training-compute-optimal-large-language-models/) — 如何最有效地分配算力
