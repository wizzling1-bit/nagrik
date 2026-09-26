# Nagrik Hyperlocal Feed Ranking Specification

## 1. Overview

The Nagrik feed ranking engine balances local proximity, temporal freshness, publisher authority, content quality, and diversity. The platform guarantees that rural and municipal updates are prioritized for citizens in their respective jurisdictions while preventing stale local content from permanently burying critical state and national breaking news.

---

## 2. LGD Location Hierarchy Integration

India's official Local Government Directory (LGD) hierarchy forms the spine of the hyperlocal routing engine:

$$\text{State (LGD Level 1)} \longrightarrow \text{District (LGD Level 2)} \longrightarrow \text{Sub-District / Taluk (LGD Level 3)} \longrightarrow \text{Village / Ward (LGD Level 4)}$$

When a user selects an area or permits GPS coordinates, PostGIS resolves the point to the lowest administrative polygon.

---

## 3. Mathematical Scoring Function

Each published content item $c$ is assigned a composite ranking score $S(c, u)$ for user $u$:

$$S(c, u) = W_{\text{geo}} \cdot G(c, u) + W_{\text{fresh}} \cdot F(c) + W_{\text{eng}} \cdot E(c) + W_{\text{qual}} \cdot Q(c) - P_{\text{rep}}(c, u)$$

Where:

### 3.1 Geographic Relevance Score $G(c, u)$
Geographic relevance is computed hierarchically with smooth PostGIS distance decay:

$$G(c, u) = \begin{cases}
1.00 & \text{if } c.\text{village\_code} = u.\text{village\_code} \\
0.85 & \text{if } c.\text{subdistrict\_code} = u.\text{subdistrict\_code} \\
0.65 & \text{if } c.\text{district\_code} = u.\text{district\_code} \\
0.35 & \text{if } c.\text{state\_code} = u.\text{state\_code} \\
0.10 & \text{National / General circulation}
\end{cases}$$

If coordinates are available for both user and story, a continuous PostGIS radial boost applies:
$$G_{\text{coords}}(c, u) = \exp\left(-\frac{\text{ST\_Distance}(c.\text{geom}, u.\text{geom})}{25,000\text{ meters}}\right)$$

### 3.2 Temporal Freshness Score $F(c)$
Freshness uses logarithmic gravity decay to balance breaking updates with evergreen journalism:

$$F(c) = \frac{1}{(1 + \Delta t / 4)^{1.25}}$$
where $\Delta t$ is elapsed hours since `published_at`.

### 3.3 Engagement Score $E(c)$
Normalized logarithmic engagement prevents viral runaway while rewarding high-interest reporting:

$$E(c) = \log_{10}(1 + \text{views} \cdot 0.1 + \text{likes} \cdot 1.0 + \text{shares} \cdot 3.0 + \text{saves} \cdot 2.0)$$

### 3.4 Quality & Author Authority $Q(c)$
- Verified Publisher status (`is_verified = true`): $+0.15$
- Editorial verification badge: $+0.10$
- High-definition video with 9:16 aspect ratio: $+0.05$

### 3.5 Penalty Functions $P_{\text{rep}}(c, u)$
- **Publisher Repetition Penalty**: If consecutive stories originate from the same publisher, each subsequent item is penalized by $0.25 \times n$.
- **Report Penalty**: If an item has $> 3$ pending reports, $P_{\text{rep}} += 0.50$. If $> 10$ reports, item is suppressed to review queue.

---

## 4. Default Production Weights

In stored procedure `get_personalized_feed`, weights are parameterized for dynamic tuning:

| Component | Parameter | Default Weight | Range | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| Geographic Proximity | `w_geo` | **0.45** | 0.30 – 0.60 | Hyperlocal platform core differentiator |
| Freshness | `w_fresh` | **0.30** | 0.20 – 0.40 | Ensures breaking local events bubble to top |
| Engagement | `w_eng` | **0.15** | 0.10 – 0.25 | Surfaces high-interest community stories |
| Quality / Authority | `w_qual` | **0.10** | 0.05 – 0.15 | Encourages verified publisher contributions |

---

## 5. Sliding Window Video Feed Strategy

For the vertical video feed (`VideosScreen` / Shorts):
- Content filtering: `content_type = 'VIDEO'` AND `aspect_ratio < 1.0` (vertical).
- Pagination: 10 items per batch.
- Memory lifecycle: Active video retains texture player; $n+1$ initializes controller; $n-1$ is cached; all others are disposed to enforce $< 85\text{ MB}$ video memory footprint.
