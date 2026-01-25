# Arrays & Hashing Cheatsheet for Google Interviews

## Pattern Recognition Signals

### Use HashMap/HashSet When You See:
| Signal | Pattern | Example Problems |
|--------|---------|------------------|
| "Find pair/triplet that sums to X" | Two Sum variant | Two Sum, 3Sum, 4Sum |
| "Find duplicates" or "first unique" | Frequency counting | Contains Duplicate, First Unique Char |
| "Group items by property" | Grouping/bucketing | Group Anagrams, Top K Frequent |
| "O(1) lookup needed" | Direct addressing | Valid Anagram, Ransom Note |
| "Subarray with sum = K" | Prefix sum + HashMap | Subarray Sum Equals K |
| "Longest substring with constraint" | Sliding window + HashMap | Longest Substring Without Repeating |
| "Check if permutation/anagram" | Character frequency map | Valid Anagram, Permutation in String |

### Use Sorting When You See:
| Signal | Why Sort? |
|--------|-----------|
| "Find closest" or "minimize difference" | Brings similar values together |
| "Merge intervals" or "overlapping" | Process in order |
| "K-th largest/smallest" | Partial sort or heap alternative |
| Answer doesn't depend on original order | Sorting is "free" optimization |

### Use Prefix Sum When You See:
| Signal | Pattern |
|--------|---------|
| "Sum of subarray" repeated queries | Precompute cumulative sums |
| "Count subarrays with sum = K" | Prefix sum + HashMap |
| "Range sum query" | prefix[right] - prefix[left-1] |

---

## Brilliant Clarifying Questions

### Questions That Change Algorithm Choice

**1. "What's the range of input values?"**
- Small range (e.g., 0-1000) → **Counting sort O(n)** or **array as hashmap**
- Large range → Standard hashmap
- *Google loves when you optimize for constraints*

**2. "Can there be duplicates in the input?"**
- Yes → Need frequency map, not just set
- No → HashSet sufficient, simpler code

**3. "Is the array sorted or nearly sorted?"**
- Sorted → **Binary search** or **two pointers** (skip hashmap)
- Nearly sorted → Consider if sorting is worth it

**4. "What should I return if multiple valid answers exist?"**
- Any one → Simpler implementation
- All of them → Need to continue searching after finding one
- Lexicographically smallest → May need sorting

**5. "How frequent are the operations?"**
- Many queries, static data → **Precompute** (prefix sum, sort once)
- Single query → On-the-fly computation fine

**6. "Can I modify the input array?"**
- Yes → In-place algorithms, use array as hashmap
- No → Need extra space anyway

**7. "What are the space constraints?"**
- O(n) okay → HashMap freely
- O(1) required → Sorting, two pointers, or bit manipulation

**8. "Are there negative numbers?"**
- No negatives → Array indexing tricks possible
- Negatives → Need hashmap for indices

---

## Time-Space Tradeoff Decisions

```
Problem Type          | Brute Force | Optimized     | Tradeoff
----------------------|-------------|---------------|------------------
Two Sum               | O(n²), O(1) | O(n), O(n)    | Space for time
Contains Duplicate    | O(n²), O(1) | O(n), O(n)    | HashSet
Top K Frequent        | O(n log n)  | O(n)          | Bucket sort
Group Anagrams        | O(n·k log k)| O(n·k)        | Sorted key vs char count
Product Except Self   | O(n), O(n)  | O(n), O(1)*   | Output array trick
```

---

## Common Techniques to Master

### 1. Frequency Map Template
```python
from collections import Counter
freq = Counter(nums)  # or defaultdict(int)
# Use freq[x] for count of x
```

### 2. Two Sum HashMap Pattern
```python
seen = {}
for i, num in enumerate(nums):
    complement = target - num
    if complement in seen:
        return [seen[complement], i]
    seen[num] = i
```

### 3. Prefix Sum Pattern
```python
prefix = [0]
for num in nums:
    prefix.append(prefix[-1] + num)
# Sum of nums[i:j] = prefix[j] - prefix[i]
```

### 4. Subarray Sum = K (Prefix + HashMap)
```python
count, curr_sum = 0, 0
prefix_count = {0: 1}
for num in nums:
    curr_sum += num
    count += prefix_count.get(curr_sum - k, 0)
    prefix_count[curr_sum] = prefix_count.get(curr_sum, 0) + 1
```

### 5. Encode Key for Grouping
```python
# For anagrams: tuple(sorted(s)) or tuple(char_count)
# For points on same line: (dx//g, dy//g) where g = gcd
```

---

## Google-Specific Tips

1. **Always state complexity before coding** — "This will be O(n) time, O(n) space"

2. **Mention tradeoffs unprompted** — "We could sort for O(1) space but O(n log n) time"

3. **Edge cases to always mention:**
   - Empty array
   - Single element
   - All duplicates
   - Negative numbers (if applicable)
   - Integer overflow (for sum/product)

4. **Google values:** Clean code > clever code. Name variables well.

5. **If stuck:** "Let me think about what data structure gives me the lookup I need"

---

## Quick Pattern Matching Flowchart

```
Need O(1) lookup? ──Yes──→ HashMap/HashSet
       │
       No
       │
       ▼
Need elements in order? ──Yes──→ Sort first
       │
       No
       │
       ▼
Range/subarray sums? ──Yes──→ Prefix Sum
       │
       No
       │
       ▼
Find pairs with property? ──Yes──→ Two Pointers (if sorted) or HashMap
       │
       No
       │
       ▼
Counting occurrences? ──Yes──→ Frequency Map
```

---

## Red Flags → Pattern Hints

| If you're about to write... | Stop and consider... |
|-----------------------------|----------------------|
| Nested loops O(n²) | HashMap to eliminate inner loop |
| Repeated sum calculations | Prefix sum array |
| Sorting just to find one element | HashMap or QuickSelect |
| Multiple passes over data | Can you combine into one pass? |
