# 🧠 FAANG LeetCode Prep System

## ✅ 1. Pattern Recognition Tips (Think in Templates)

Use problem keywords and structure to **immediately identify the right approach**:

| Pattern               | When to Use                                                                 |
|-----------------------|------------------------------------------------------------------------------|
| **Sliding Window**     | Contiguous subarray/substring with longest/shortest/max/min conditions      |
| **Two Pointers**       | Sorted arrays, pair sum, reverse, in-place edits                            |
| **Binary Search**      | Sorted input or search in monotonic space                                   |
| **DFS / BFS**          | Graphs, trees, grids – BFS for shortest paths, DFS for exhaustive traversal |
| **Dynamic Programming**| Optimal result with overlapping subproblems                                 |
| **Hash Map / Set**     | Frequency counting, lookups, uniqueness tracking                            |
| **Heap (Priority Queue)**| Top-K, stream median, task scheduling                                      |
| **Greedy**             | Local optimal = global optimal – scheduling, coin change                    |
| **Backtracking**       | Generate all permutations/combinations                                      |
| **Union-Find (DSU)**   | Connected components, cycle detection in undirected graphs                  |


## ❓ 2. Clarifying Questions Framework (Per Topic)

### 🔤 **Strings**
- What characters are allowed? (Only lowercase? Full ASCII?)
- Case sensitive?
- Max input size?
- Can it be empty/null?

### 🧮 **Arrays**
- Sorted or unsorted?
- Negative numbers or duplicates?
- Max size? Any space/time constraints?
- Any edge cases (empty/single element)?

### 🌲 **Trees**
- Is it a Binary Tree or BST?
- Duplicates allowed?
- Balanced or skewed?
- Input format? (TreeNode? Level order?)

### 🌐 **Graphs**
- Directed or Undirected?
- Weighted? Negative weights?
- Max nodes/edges? Dense or sparse?
- Cycles allowed? Disconnected?
- Representation format?

### 📐 **Dynamic Programming**
- Input size? (Is brute force feasible?)
- Is it a counting/true-false/optimization question?
- Can subproblems be reused?

### ❗ **General**
- What should be returned on edge cases?
- Time/space constraints?
- Any ambiguous terms or examples?


## 📎 3. Cheat-Sheet: Optimal Approaches

| Approach             | Use When…                                                                    |
|----------------------|-------------------------------------------------------------------------------|
| **Sliding Window**     | Longest/shortest subarray/substring, contiguous, maintain condition         |
| **Two Pointers**       | Sorted data, reverse in-place, partitioning, pairs/triplets                 |
| **Hash Map / Set**     | Frequency, fast lookup, track seen elements                                 |
| **Binary Search**      | Sorted array, search space problems (min/max/boundary search)               |
| **Backtracking**       | All combinations/permutations, constraint solving                           |
| **DP (Memoization)**   | Optimal result + overlapping subproblems (min/max/count)                    |
| **Heap / PQ**          | Top K, merging K sorted lists, streaming median                             |
| **Greedy**             | Local choice leads to global optimum (activity selection, coins)            |
| **Union-Find**         | Grouping/connected components, cycle detection                              |
| **Stack**              | Valid parentheses, monotonic stack (next greater), tree traversals          |
| **Bitmasking**         | Subsets, flags, XOR tricks                                                   |



## 🧠 4. Example: LeetCode #3 – Longest Substring Without Repeating Characters

**Clarify:**
- Input: ASCII? ✅
- Empty string? Return 0 ✅
- Max length? Up to 10⁵ → needs O(n) ✅

**Pattern:**  
→ Keywords: “longest”, “substring”, “no repeat” → **Sliding Window**

**Plan:**  
- Use `left` and `right` pointers.
- Use a set or array to track chars in current window.
- If duplicate found, move `left` until window is valid again.
- Update max length at each step.

**Time Complexity:** O(n)  
**Space Complexity:** O(1) (fixed-size ASCII set)


## 🔁 5. Repeatable 4-Step System

1. **Clarify** → Understand problem + constraints + edge cases.
2. **Classify** → Identify the pattern (match to a known type).
3. **Recall** → Use the cheat-sheet to choose best approach.
4. **Code + Explain** → Clear logic, walk through examples, edge case test.


## 💡 Pro Tips

- Categorize every solved problem by pattern.
- Create flashcards for 14+ patterns.
- Practice with time limits.
- Analyze wrong submissions — identify the missed pattern.

---