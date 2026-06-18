# Sliding Window Cheat Sheet

## 🟦 1. When to Use Sliding Window

* You're dealing with **contiguous subarrays/substrings** and need an **optimal (O(n))** solution instead of brute-force O(n²) .
* Keywords to trigger it:

  * “subarray/substring of size k”
  * “longest/shortest/maximum/minimum subarray”
  * “at most K distinct”
  * “sum ≥ target”, “sum < K,” etc.

> ⚠️ **Negatives break the basic window.** Plain sliding window relies on a monotonic invariant: expanding the window only *grows* the running sum, so once a condition is met you can safely shrink. With negative numbers, expanding can *decrease* the sum, so that invariant fails and ordinary sliding window is invalid → fall back to **prefix sum + deque** (see Type E).

---

## 🟦 2. Core Types & Templates

### 🔹 A. Fixed‑Size Window (size = k)

**Pattern**: maintain a window of size `k`, slide one step at a time.
**Keywords**: “size k”, “every subarray of length k”, “max/min/sum of subarray size k”.
**Complexity**: O(n) time, O(1) extra space.

```python
window_sum = 0
for i in range(len(nums)):
    window_sum += nums[i]
    if i >= k - 1:
        # process window
        max_val = max(max_val, window_sum)
        window_sum -= nums[i - k + 1]
```

**Use cases**: max sum subarray, max/min in window, averages .

---

### 🔹 B. Variable‑Size — Minimize (shrink while *valid*)

**Pattern**: expand the window; while the window **still satisfies** the condition, record the answer and shrink.
**Rule of thumb**: record the answer **inside** the `while`.
**Keywords**: “smallest/shortest subarray ≥ target”.
**Complexity**: O(n) time — each index enters and leaves the window once (amortized).

```python
left, total, best = 0, 0, float('inf')
for right in range(len(nums)):
    total += nums[right]
    while total >= target:          # window is valid → try to make it smaller
        best = min(best, right - left + 1)
        total -= nums[left]
        left += 1
```

**Use cases**: minimum subarray length ≥ S, smallest window containing all chars.

---

### 🔹 C. Variable‑Size — Maximize (shrink while *invalid*)

**Pattern**: expand the window; while the window is **broken**, shrink until it's valid again, then record.
**Rule of thumb**: record the answer **after** the `while` (window is guaranteed valid there).
**Keywords**: “longest without repeating”, “longest with ≤ K distinct”, “longest with at most K of something”.
**Complexity**: O(n) time, O(k) space for the counter.

```python
left = 0
best = 0
freq = {}
for right in range(len(nums)):
    freq[nums[right]] = freq.get(nums[right], 0) + 1
    while len(freq) > K:            # window is invalid → shrink until valid
        freq[nums[left]] -= 1
        if freq[nums[left]] == 0:
            del freq[nums[left]]
        left += 1
    best = max(best, right - left + 1)   # valid here → record
```

**Use cases**: longest substring without repeating chars, longest substring with ≤ K distinct, longest repeating character replacement.

> 🔑 **B vs C is the most common slip.** Minimize → shrink while valid, record *inside*. Maximize → shrink while invalid, record *after*. Both are the same two pointers; only the loop condition and the recording point flip.

---

### 🔹 D. At‑Most(K) – Counting Trick

**Pattern**: `answer = atMost(K) − atMost(K − 1)`.
**Keywords**: “**number of** substrings/subarrays with **exactly** K distinct/odd/…”.
**Scope**: this trick **only counts subarrays** (LC 992, 930). It does **not** apply to “longest/shortest with exactly K” — use Type C for those.
**Complexity**: O(n) (two passes of the at-most template).

```python
return at_most(K) - at_most(K - 1)
```

Where `at_most(K)` follows the variable-size template (each valid window of right end contributes `right - left + 1` subarrays).

---

### 🔹 E. Deque‑Based (Monotonic Queue)

**Pattern**: optimize “max/min in window” with a deque holding candidate indices in monotonic order.
**Keywords**: “sliding window maximum/minimum”, “deque”.
**Complexity**: O(n) time — **amortized**: every index is pushed once and popped at most once, so the inner `while` does O(1) work per element overall, not O(k). O(k) space.

```python
from collections import deque

dq = deque()
for i in range(len(nums)):
    while dq and nums[dq[-1]] <= nums[i]:
        dq.pop()
    dq.append(i)
    if dq[0] <= i - k:
        dq.popleft()
    if i >= k - 1:
        result.append(nums[dq[0]])
```

**Use case**: *Sliding Window Maximum* (LeetCode 239)

---

### 🔹 F. Frequency Matching (anagrams / permutations)

**Pattern**: fixed-size window where you compare **character counts**, not a running sum. Slide a window of size `len(pattern)` and check if its count map matches the pattern's.
**Keywords**: “find all anagrams”, “permutation in string”, “contains a rearrangement of”.
**Complexity**: O(n) time, O(1) space (alphabet is bounded, ≤ 26/128).

```python
from collections import Counter

def find_anagrams(s, p):
    need = Counter(p)
    window = Counter()
    res = []
    k = len(p)
    for i in range(len(s)):
        window[s[i]] += 1
        if i >= k:                       # drop the element leaving the window
            left_char = s[i - k]
            window[left_char] -= 1
            if window[left_char] == 0:
                del window[left_char]
        if window == need:               # counts match → anagram found
            res.append(i - k + 1)
    return res
```

**Use cases**: find all anagrams (LC 438), permutation in string (LC 567).

---

### 🔹 G. Window That Never Shrinks (longest with ≤ K replacements)

**Pattern**: a maximize window where `left` only advances (never resets), tracking `window_len - max_freq`. If that exceeds the budget `k`, slide `left` forward by one — the window length is monotonic non-decreasing.
**Keywords**: “longest substring with at most K replacements/flips”.
**Complexity**: O(n) time, O(1) space.

```python
from collections import defaultdict

def character_replacement(s, k):
    count = defaultdict(int)
    left = 0
    max_freq = 0
    res = 0
    for right in range(len(s)):
        count[s[right]] += 1
        max_freq = max(max_freq, count[s[right]])
        # chars to replace = window size - most common char count
        if (right - left + 1) - max_freq > k:
            count[s[left]] -= 1
            left += 1
        res = max(res, right - left + 1)
    return res
```

**Use case**: longest repeating character replacement (LC 424).

---

## 🟦 3. Summary Table

| Type                  | Recognize Keywords                                  | Data Structures                     | Example Problems                               |
| --------------------- | --------------------------------------------------- | ----------------------------------- | ---------------------------------------------- |
| Fixed‑Size            | “size k”, “window of size k”, “max/min sum/avg”     | Primitive vars                      | Max sum subarray, avg of subarrays             |
| Variable — Minimize   | “shortest/smallest subarray ≥ S”                    | Running sum, counters               | Minimum subarray ≥ S, min window substring     |
| Variable — Maximize   | “longest without repeating”, “longest ≤ K distinct” | Hash maps, counting, sliding window | Longest unique substring, longest ≤ K distinct |
| At‑Most(K) Trick      | “**number of** subarrays with **exactly** K …”      | Hash maps + sliding window          | # substrings with exactly K distinct (LC 992)  |
| Monotonic Deque       | “max/min in sliding window”, “deque”, “mono queue”  | Deque                               | Sliding Window Maximum (LeetCode 239)          |
| Frequency Matching    | “anagrams”, “permutation in string”                 | Counter / fixed array               | Find all anagrams (438), permutation (567)     |
| Non‑shrinking Window  | “longest with ≤ K replacements/flips”               | Hash map + max_freq                 | Longest repeating char replacement (424)       |
| Deque + Prefix Sum    | “shortest/longest subarray sum ≥ K (neg allowed)”   | Deque + prefix-sums                 | Shortest Subarray ≥ K (LeetCode 862)           |

---

## 🟦 4. Quick Decision Flowchart

1. **Is window size fixed?** → Yes
   * Comparing **sum/avg**? → **Fixed‑Size (A)**
   * Comparing **char counts**? → **Frequency Matching (F)**
2. **Dynamic size with conditions?** → Yes
   * Want the **shortest** valid window? → **Minimize (B)** — record *inside* the shrink loop.
   * Want the **longest** valid window? → **Maximize (C)** — record *after* the shrink loop.
   * Want the **count** of subarrays with *exactly* K? → **atMost(K) − atMost(K−1) (D)**.
   * Longest with **≤ K replacements**? → **Non‑shrinking Window (G)**.
3. **Need max/min in window?** → use **Monotonic Deque (E)**.
4. **Negative numbers involved + subarray sum ≥ K?** → **Deque + Prefix Sum** (basic window invalid here).

---

## 🟦 5. Python Code Snippets Ready for Reuse

### Fixed‑Size (Max Sum) — O(n) time, O(1) space

```python
def max_sum(a, k):
    total, res = 0, 0
    for i in range(len(a)):
        total += a[i]
        if i >= k - 1:
            res = max(res, total)
            total -= a[i - k + 1]
    return res
```

### Variable — Minimize (Min Subarray ≥ target) — O(n) time, O(1) space

```python
def min_subarray_len(target, nums):
    left, total, ans = 0, 0, float('inf')
    for right in range(len(nums)):
        total += nums[right]
        while total >= target:          # valid → shrink, record inside
            ans = min(ans, right - left + 1)
            total -= nums[left]
            left += 1
    return 0 if ans == float('inf') else ans
```

### Variable — Maximize (Longest substring with ≤ K distinct) — O(n) time, O(k) space

```python
def longest_at_most_k_distinct(s, k):
    left, best = 0, 0
    freq = {}
    for right in range(len(s)):
        freq[s[right]] = freq.get(s[right], 0) + 1
        while len(freq) > k:            # invalid → shrink until valid
            freq[s[left]] -= 1
            if freq[s[left]] == 0:
                del freq[s[left]]
            left += 1
        best = max(best, right - left + 1)  # valid → record after
    return best
```

### AtMost(K) — O(n) time, O(k) space (counts subarrays)

```python
def at_most_k(a, K):
    left, count = 0, 0
    freq = {}
    for right in range(len(a)):
        freq[a[right]] = freq.get(a[right], 0) + 1
        while len(freq) > K:
            freq[a[left]] -= 1
            if freq[a[left]] == 0:
                del freq[a[left]]
            left += 1
        count += right - left + 1
    return count
```

### Deque‑Based (Max) — O(n) time amortized, O(k) space

```python
from collections import deque

def max_sliding_window(a, k):
    dq = deque()
    n = len(a)
    ans = []
    for i in range(n):
        while dq and a[dq[-1]] <= a[i]:   # pop smaller candidates
            dq.pop()
        dq.append(i)
        if dq[0] <= i - k:                # expire out-of-window index
            dq.popleft()
        if i >= k - 1:
            ans.append(a[dq[0]])
    return ans
```

### Frequency Matching (Find All Anagrams) — O(n) time, O(1) space

```python
from collections import Counter

def find_anagrams(s, p):
    need = Counter(p)
    window = Counter()
    res = []
    k = len(p)
    for i in range(len(s)):
        window[s[i]] += 1
        if i >= k:
            left_char = s[i - k]
            window[left_char] -= 1
            if window[left_char] == 0:
                del window[left_char]
        if window == need:
            res.append(i - k + 1)
    return res
```

### Non‑shrinking Window (Char Replacement) — O(n) time, O(1) space

```python
from collections import defaultdict

def character_replacement(s, k):
    count = defaultdict(int)
    left = 0
    max_freq = 0
    res = 0
    for right in range(len(s)):
        count[s[right]] += 1
        max_freq = max(max_freq, count[s[right]])
        if (right - left + 1) - max_freq > k:
            count[s[left]] -= 1
            left += 1
        res = max(res, right - left + 1)
    return res
```

### Prefix‑Sum + Deque (Shortest Subarray ≥ K, negatives allowed) — O(n) time, O(n) space

```python
from collections import deque

def shortest_subarray(A, K):
    n = len(A)
    res = n + 1
    pre = [0] * (n + 1)
    for i in range(n):
        pre[i + 1] = pre[i] + A[i]
    dq = deque()
    for i in range(n + 1):
        while dq and pre[i] - pre[dq[0]] >= K:   # found a valid window
            res = min(res, i - dq.popleft())
        while dq and pre[i] <= pre[dq[-1]]:      # keep prefix sums increasing
            dq.pop()
        dq.append(i)
    return res if res < n + 1 else -1
```

---

## ⚠️ Common Pitfalls

* **Recording at the wrong point.** Minimize records *inside* the shrink loop; maximize records *after* it. Swapping these silently produces wrong answers on valid-looking code.
* **Off-by-one on window length.** It's always `right - left + 1`. Forgetting the `+ 1` is the classic bug.
* **Forgetting to shrink.** A maximize loop with no `while`/`if` to advance `left` degrades to O(n²) or just returns the whole array.
* **Using sum logic when you need counts.** Anagram/permutation problems compare frequency maps, not a running sum — don't force the sum template (Type F, not A).
* **Reaching for atMost on longest/shortest.** `atMost(K) − atMost(K−1)` *counts* subarrays only. For “longest with exactly K” use the maximize template.
* **Applying basic window to arrays with negatives.** The shrink invariant breaks — use prefix sum + deque instead.
* **Deque holding values instead of indices.** Store **indices** so you can expire elements that fall out of the window.

---

## 🧠 Final Tips

* **Scan problem statement**: spot keywords like **size k**, **distinct**, **sum ≥**, **longest/shortest**, **max/min**, **anagram**, **replacements**.
* **Pick your pattern**: fixed, minimize, maximize, atMost trick, deque, freq-match, or non-shrinking.
* **Choose a data structure**: counters (for distinct), hash maps, deque, prefix sums.
* **Write your skeleton**: pointers + window updates + correct recording point.
* **State the complexity**: most of these are O(n); be ready to justify the deque's *amortized* O(n).
* **Test** with edge cases: empty, full, negatives, all-same, k larger than the array.
