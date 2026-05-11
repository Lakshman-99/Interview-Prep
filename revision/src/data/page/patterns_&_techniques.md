# 🎯 Google L3/L4 Interview Patterns — Unified Reference

> A complete, recognition-driven study guide combining your original 21 topics with additional patterns essential for Google L3 (new grad) and L4 (mid-level) Software Engineer interviews.

**Legend:** ⭐ = Topic from your original list &nbsp;|&nbsp; ➕ = Addition for L3/L4 coverage &nbsp;|&nbsp; LC = LeetCode problem number

---

## 📑 Table of Contents

1. [Arrays & Sliding Window](#1-arrays--sliding-window)
2. [Strings](#2-strings)
3. [Stack & Queue Patterns](#3-stack--queue-patterns)
4. [Linked List / Pointer Techniques](#4-linked-list--pointer-techniques)
5. [Binary Search](#5-binary-search)
6. [Heap / Priority Queue](#6-heap--priority-queue)
7. [Intervals & Line Sweep](#7-intervals--line-sweep)
8. [Matrix / 2D Grid Patterns](#8-matrix--2d-grid-patterns)
9. [Hash Map Patterns](#9-hash-map-patterns)
10. [Greedy Algorithms](#10-greedy-algorithms)
11. [Trees & Advanced Tree Algorithms](#11-trees--advanced-tree-algorithms)
12. [Tries & Advanced Data Structures](#12-tries--advanced-data-structures)
13. [Graph Algorithms](#13-graph-algorithms)
14. [Backtracking & Recursion](#14-backtracking--recursion)
15. [Dynamic Programming](#15-dynamic-programming)
16. [Bit Manipulation](#16-bit-manipulation)
17. [Math & Number Theory](#17-math--number-theory)
18. [String Algorithms (Advanced)](#18-string-algorithms-advanced)
19. [Special / Niche Algorithms](#19-special--niche-algorithms)
20. [Design / OOD Coding Problems](#20-design--ood-coding-problems)
21. [Problem-Type Categories](#21-problem-type-categories-frequently-asked-at-google)
22. [Quick Recognition Cheat Sheet](#-quick-recognition-cheat-sheet)
23. [Study Strategy & Caveats](#-study-strategy--caveats)

---

## 1. Arrays & Sliding Window

### ⭐ Kadane's Algorithm

Track running sum; reset to current element whenever running sum goes negative.

**Examples**

- Maximum Subarray (LC 53)
- Maximum Sum Circular Subarray (LC 918)
- Maximum Product Subarray (LC 152)
- Best Time to Buy and Sell Stock (LC 121)

**When to use**

- "Maximum/minimum sum contiguous subarray"
- Single-pass optimization over arrays with running aggregates
- Variants involving products, circular arrays, or with one deletion allowed

---

### ⭐ Sliding Window (Fixed Size)

Window of size `k` slides one element at a time; add new, remove old.

**Examples**

- Maximum Average Subarray I (LC 643)
- Find All Anagrams in a String (LC 438)
- Permutation in String (LC 567)
- Contains Duplicate II (LC 219)

**When to use**

- Problem specifies an exact window size `k`
- "Find subarray/substring of length k satisfying X"

---

### ⭐ Sliding Window (Variable Size)

Two pointers; expand right to grow window, shrink from left when constraint violated.

**Examples**

- Longest Substring Without Repeating Characters (LC 3)
- Minimum Window Substring (LC 76)
- Longest Repeating Character Replacement (LC 424)
- Fruit Into Baskets (LC 904)

**When to use**

- "Longest/shortest subarray/substring with constraint"
- "At most K distinct characters", "sum at least S"

---

### ⭐ Two Pointers

Two indices moving toward each other (or in the same direction) on a sorted/structured input.

**Examples**

- Two Sum II – Input Array Is Sorted (LC 167)
- 3Sum (LC 15)
- Container With Most Water (LC 11)
- Trapping Rain Water (LC 42)
- Remove Duplicates from Sorted Array (LC 26)

**When to use**

- Sorted array + pair/triplet sum
- "Partition the array in place"
- Comparing characters/elements from both ends (palindromes)

---

### ⭐ Prefix Sums

Precompute `pre[i] = sum(arr[0..i-1])`; range sum becomes `pre[r+1] - pre[l]`.

**Examples**

- Range Sum Query – Immutable (LC 303)
- Subarray Sum Equals K (LC 560)
- Continuous Subarray Sum (LC 523)
- Product of Array Except Self (LC 238)

**When to use**

- Many range-sum queries on an immutable array
- "Number of subarrays with sum K" → combine with hash map
- Prefix-products or prefix-XOR variants

---

### ➕ Monotonic Deque (Sliding Window Min/Max)

Deque stores indices in monotonic order; pop front when out of window, pop back while invariant violated.

**Examples**

- Sliding Window Maximum (LC 239)
- Shortest Subarray with Sum at Least K (LC 862)
- Jump Game VI (LC 1696)
- Constrained Subsequence Sum (LC 1425)

**When to use**

- "Max/min in every window of size k"
- Anything that would naively be O(n·k)
- Longest subarray with constraint involving running max/min

---

### ➕ Difference Arrays / Range Updates

For many "+v on range [l,r]" updates followed by point queries: `diff[l] += v; diff[r+1] -= v;` then prefix-sum.

**Examples**

- Corporate Flight Bookings (LC 1109)
- Range Addition (LC 370)
- Car Pooling (LC 1094)

**When to use**

- Multiple range updates, then read the final array
- "Increment all elements in [l,r] by v" many times

---

### ➕ Cyclic Sort / Index-as-Hash

Place each element at its natural index in-place to detect missing/duplicate in O(n) time, O(1) space.

**Examples**

- Find All Numbers Disappeared in an Array (LC 448)
- Find the Duplicate Number (LC 287)
- First Missing Positive (LC 41)
- Find All Duplicates in an Array (LC 442)

**When to use**

- Array contains numbers in range [1..n] or [0..n-1]
- Find missing/duplicate with **O(1) extra space**

---

## 2. Strings

### ⭐ Palindromes

Expand around center (O(n²)) or DP table `dp[i][j]` for substring problems.

**Examples**

- Longest Palindromic Substring (LC 5)
- Palindromic Substrings (LC 647)
- Valid Palindrome (LC 125)
- Palindrome Partitioning (LC 131)

**When to use**

- Anything mentioning "palindrome"
- "Longest palindromic ___"
- Counting palindromic substrings/subsequences

---

### ➕ Rolling Hash / Rabin-Karp

Hash a window; update in O(1) on slide; compare hash before character check.

**Examples**

- Repeated DNA Sequences (LC 187)
- Longest Duplicate Substring (LC 1044)
- Implement strStr (LC 28)

**When to use**

- Substring search at scale
- "Find longest duplicated substring" + binary search on length

---

## 3. Stack & Queue Patterns

### ➕ Monotonic Stack

Stack maintains increasing/decreasing order; on push, pop until invariant holds. Each element pushed/popped at most once → O(n).

**Examples**

- Next Greater Element I/II (LC 496/503)
- Daily Temperatures (LC 739)
- Largest Rectangle in Histogram (LC 84)
- Trapping Rain Water (LC 42)
- Remove K Digits (LC 402)
- Sum of Subarray Minimums (LC 907)

**When to use**

- "Next/previous greater/smaller element"
- Need O(n) instead of O(n²)
- Lexicographically smallest/largest by removing/keeping elements
- Histogram area problems

---

### ➕ Stack-Based Parsing / Expression Evaluation

Use stack for nested structures, operator precedence, sign tracking, string decoding.

**Examples**

- Valid Parentheses (LC 20)
- Basic Calculator I/II/III (LC 224/227/772)
- Decode String (LC 394)
- Simplify Path (LC 71)
- Evaluate Reverse Polish Notation (LC 150)
- Asteroid Collision (LC 735)

**When to use**

- Nested brackets/parentheses
- Arithmetic strings, "k[encoded]" patterns
- File-path normalization
- Last-in-first-out interactions

---

### ➕ Two Stacks / Stack Tricks

Implement queue with two stacks; min-stack with O(1) min; max-frequency stack.

**Examples**

- Min Stack (LC 155)
- Max Stack (LC 716)
- Implement Queue using Stacks (LC 232)
- Maximum Frequency Stack (LC 895)

**When to use**

- "Design a stack/queue that supports getMin/getMax in O(1)"

---

## 4. Linked List / Pointer Techniques

### ⭐ Fast and Slow Pointers

Two pointers, one moving twice as fast; detect cycles, find middles, find kth-from-end.

**Examples**

- Linked List Cycle I/II (LC 141/142)
- Middle of the Linked List (LC 876)
- Happy Number (LC 202)
- Find the Duplicate Number (LC 287)
- Palindrome Linked List (LC 234)

**When to use**

- Cycle detection in linked list or functional graph
- Find middle node in one pass
- "In-place, O(1) extra space" constraints

---

### ➕ In-Place Reversal Patterns

Iterative pointer-flipping with `prev`, `curr`, `next`.

**Examples**

- Reverse Linked List (LC 206)
- Reverse Linked List II (LC 92)
- Reverse Nodes in k-Group (LC 25)
- Swap Nodes in Pairs (LC 24)

**When to use**

- "Reverse a sublist/group"
- "In place, no extra memory" linked list ops

---

### ➕ Linked List Manipulation

**Examples**

- Merge Two Sorted Lists (LC 21)
- Copy List with Random Pointer (LC 138)
- Reorder List (LC 143)
- LRU Cache (LC 146)

**When to use**

- Deep copy of complex linked structures
- Combine slow/fast with reversal for reorder-style problems

---

## 5. Binary Search

### ➕ Classic Binary Search (lower_bound / upper_bound)

Standard variants: first/last occurrence, insertion point.

**Examples**

- Search Insert Position (LC 35)
- Find First and Last Position (LC 34)
- Find Peak Element (LC 162)

**When to use**

- Sorted input + "find first index where condition X becomes true"

---

### ➕ Binary Search on Rotated/Modified Array

Decide which half is sorted using boundary comparisons.

**Examples**

- Search in Rotated Sorted Array I/II (LC 33/81)
- Find Minimum in Rotated Sorted Array (LC 153)
- Search a 2D Matrix I/II (LC 74/240)

**When to use**

- "Rotated sorted array"
- "Row- and column-sorted matrix"

---

### ➕ Binary Search on Answer (Parametric Search)

Binary-search the answer space with a monotonic feasibility predicate `can(x)`.

**Examples**

- Koko Eating Bananas (LC 875)
- Capacity to Ship Packages within D Days (LC 1011)
- Split Array Largest Sum (LC 410)
- Minimum Number of Days to Make m Bouquets (LC 1482)
- Aggressive Cows / Magnetic Force (LC 1552)
- Find K-th Smallest Pair Distance (LC 719)

**When to use**

- "Minimize the maximum…" / "Maximize the minimum…"
- "Can we do it within X?" with monotonic check
- You can write `can(x)` where `can(x) ⇒ can(x+1)` (or vice versa)

---

## 6. Heap / Priority Queue

### ⭐ Two Heaps

Max-heap for lower half + min-heap for upper half; rebalance after each insert.

**Examples**

- Find Median from Data Stream (LC 295)
- Sliding Window Median (LC 480)
- IPO (LC 502)
- Find Right Interval (LC 436)

**When to use**

- "Median of a stream"
- Need both smallest-of-large-half and largest-of-small-half in O(1)

---

### ➕ Top-K Pattern

Min-heap of size K for top-K largest; max-heap of size K for top-K smallest. O(n log k).

**Examples**

- Kth Largest Element in an Array (LC 215)
- Top K Frequent Elements (LC 347)
- K Closest Points to Origin (LC 973)
- Kth Largest Element in a Stream (LC 703)

**When to use**

- "Top K", "K largest/smallest", "K most frequent", "K nearest"

---

### ➕ K-Way Merge

Push the head of each list into a min-heap; pop and push the successor.

**Examples**

- Merge K Sorted Lists (LC 23)
- Smallest Range Covering Elements from K Lists (LC 632)
- Find K Pairs with Smallest Sums (LC 373)
- Kth Smallest Element in a Sorted Matrix (LC 378)

**When to use**

- Multiple sorted streams/arrays/lists
- "Merge K sorted ___"
- "Kth smallest in sorted matrix"

---

### ➕ Scheduling with Heaps

Heap always picks the next "best" job (max frequency, earliest deadline, cheapest cost).

**Examples**

- Task Scheduler (LC 621)
- Reorganize String (LC 767)
- Meeting Rooms II (LC 253)
- Single-Threaded CPU (LC 1834)
- Minimum Cost to Hire K Workers (LC 857)

**When to use**

- Cooldown/cooling problems
- Room-booking concurrency
- "Process jobs in priority order" with dynamic insert/remove

---

## 7. Intervals & Line Sweep

### ➕ Interval Merge / Insert / Overlap

Sort by start (or end), then linearly merge or insert.

**Examples**

- Merge Intervals (LC 56)
- Insert Interval (LC 57)
- Non-overlapping Intervals (LC 435)
- Minimum Number of Arrows to Burst Balloons (LC 452)
- Meeting Rooms I/II (LC 252/253)

**When to use**

- Pairs of (start, end)
- "Do they overlap?", "merge", "minimum rooms / arrows", "remove fewest"

---

### ➕ Line Sweep / Event-Based Processing

Convert each interval into +1 at start, –1 at end; sort events; sweep maintaining an active counter.

**Examples**

- Meeting Rooms II (LC 253)
- My Calendar I/II/III (LC 729/731/732)
- The Skyline Problem (LC 218)
- Employee Free Time (LC 759)
- Rectangle Area II (LC 850)
- Car Pooling (LC 1094)

**When to use**

- "Maximum number of concurrent ___"
- "Free time across multiple schedules"
- Skyline / 2D rectangle union problems

---

## 8. Matrix / 2D Grid Patterns

### ➕ Grid Traversal (DFS / BFS on Implicit Graph)

Treat each cell as a node with up-to-4 (or 8) neighbors.

**Examples**

- Number of Islands (LC 200)
- Surrounded Regions (LC 130)
- Pacific Atlantic Water Flow (LC 417)
- Word Search (LC 79)
- Flood Fill (LC 733)

**When to use**

- Grid of 0/1 or characters
- "Connected components", "regions", "islands"

---

### ➕ Multi-Source BFS

Seed BFS queue with all sources at distance 0; expand simultaneously.

**Examples**

- Rotting Oranges (LC 994)
- 01 Matrix (LC 542)
- Walls and Gates (LC 286)
- As Far from Land as Possible (LC 1162)

**When to use**

- "Distance to nearest X for every cell"
- "Starting from multiple sources at once"
- "Minutes for every cell to reach state Y"

---

### ➕ 0-1 BFS (Deque BFS)

Edges of weight 0 or 1 only; deque, push 0-weight neighbors to front, 1-weight to back. O(V+E).

**Examples**

- Minimum Cost to Make at Least One Valid Path in a Grid (LC 1368)
- Shortest Path in a Grid with Obstacles Elimination (LC 1293)

**When to use**

- Edge weights are exactly 0 or 1
- "Free to traverse some cells, costly for others"

---

### ➕ Matrix Manipulation In-Place

Rotate by 90° (transpose + reverse rows); spiral traversal; row/col header marker tricks.

**Examples**

- Rotate Image (LC 48)
- Spiral Matrix (LC 54)
- Set Matrix Zeroes (LC 73)
- Game of Life (LC 289)
- Diagonal Traverse (LC 498)

**When to use**

- "Rotate matrix in place"
- "Spiral order"
- "Modify matrix without extra space"

---

## 9. Hash Map Patterns

### ➕ Frequency Counting

Build counts in one pass; answer queries in another.

**Examples**

- Valid Anagram (LC 242)
- Group Anagrams (LC 49)
- First Unique Character (LC 387)
- Top K Frequent Elements (LC 347)

---

### ➕ Complement Lookup

For pair-sum problems, look up `target - x` in the map.

**Examples**

- Two Sum (LC 1)
- 4Sum II (LC 454)
- Pairs of Songs With Total Durations Divisible by 60 (LC 1010)
- Subarray Sums Divisible by K (LC 974)

---

### ➕ Prefix-Sum + HashMap

Use `count[prefix - k]` to count subarrays summing to k.

**Examples**

- Subarray Sum Equals K (LC 560)
- Continuous Subarray Sum (LC 523)
- Contiguous Array (LC 525)
- Path Sum III (LC 437)

**When to use**

- "Number of subarrays/paths whose sum equals K"
- "Longest subarray with sum K"
- "Subarray with equal 0s and 1s"

---

### ➕ Canonical-Form Hashing

Hash sets/keys as canonical forms (sorted tuple, frequency tuple, character signature).

**Examples**

- Group Shifted Strings (LC 249)
- Find Duplicate Subtrees (LC 652)
- Encode N-ary Tree (LC 428)

---

## 10. Greedy Algorithms

### ➕ Interval Scheduling (Earliest End First)

Sort intervals by end; pick greedily as long as start ≥ last_end.

**Examples**

- Non-overlapping Intervals (LC 435)
- Minimum Number of Arrows (LC 452)
- Maximum Length of Pair Chain (LC 646)

---

### ➕ Jump / Reachability Greedy

Track furthest reachable index; advance the boundary lazily.

**Examples**

- Jump Game I/II (LC 55/45)
- Gas Station (LC 134)
- Video Stitching (LC 1024)

---

### ➕ Huffman / Min-Cost Merging

Repeatedly merge two smallest items via min-heap.

**Examples**

- Minimum Cost to Connect Sticks (LC 1167)
- Last Stone Weight (LC 1046)

---

### ➕ Sort + Pick Greedy

Sort by some criterion, then pick locally optimal choice.

**Examples**

- Assign Cookies (LC 455)
- Two City Scheduling (LC 1029)
- Boats to Save People (LC 881)
- Queue Reconstruction by Height (LC 406)
- Candy (LC 135)

**When to use**

- "Maximize/minimize" with no obvious DP state
- Locally optimal choice is provably globally safe (exchange argument)

---

## 11. Trees & Advanced Tree Algorithms

### ➕ Tree Traversal Variants

Iterative in/pre/post-order with explicit stack; level-order BFS; zig-zag; vertical-order.

**Examples**

- Binary Tree Inorder/Preorder/Postorder (LC 94/144/145)
- Binary Tree Level Order Traversal (LC 102)
- Zigzag Level Order Traversal (LC 103)
- Vertical Order Traversal (LC 987)

---

### ➕ Tree DP (Postorder Aggregation)

Each node returns a value computed from its children; track a global answer.

**Examples**

- Diameter of Binary Tree (LC 543)
- Binary Tree Maximum Path Sum (LC 124)
- House Robber III (LC 337)
- Longest Univalue Path (LC 687)
- Distribute Coins in Binary Tree (LC 979)
- Binary Tree Cameras (LC 968)

**When to use**

- "Longest path…", "max sum path…"
- DP-on-tree with pick/skip choices at each node

---

### ➕ Lowest Common Ancestor (LCA)

For binary tree: recursive O(n). For BST: walk down comparing values. For many queries: **Binary Lifting** (preprocess `up[v][k]` ancestor 2^k above v in O(n log n)).

**Examples**

- LCA of Binary Tree (LC 236)
- LCA of BST (LC 235)
- Kth Ancestor of a Tree Node (LC 1483)

**When to use**

- Many queries on a static tree
- "Kth ancestor"
- "Distance between two tree nodes" = `d(u) + d(v) − 2·d(lca)`

---

### ➕ Euler Tour Technique

DFS records `in[v]` and `out[v]`; subtree of v ↔ array slice `[in[v], out[v]]`. Combine with BIT/segment tree for subtree updates.

**When to use**

- "Subtree update/query"
- Static tree + many queries

---

### ➕ Morris Traversal

O(1)-space in-order traversal via temporary threading of rightmost predecessor.

**Examples**

- Binary Tree Inorder Traversal (LC 94, follow-up)
- Recover Binary Search Tree (LC 99)

**When to use**

- "Can you do it without recursion or a stack?"
- Constant-space follow-up to a tree-traversal warm-up

---

### ➕ Serialize / Deserialize

Pre-order with sentinel for nulls; or BFS with delimiters.

**Examples**

- Serialize and Deserialize Binary Tree (LC 297)
- Encode N-ary Tree (LC 428)
- Verify Preorder Serialization (LC 331)

---

## 12. Tries & Advanced Data Structures

### ⭐ Trie

Tree where each edge is a character; supports O(L) prefix queries.

**Examples**

- Implement Trie (Prefix Tree) (LC 208)
- Word Search II (LC 212)
- Design Add and Search Words Data Structure (LC 211)
- Replace Words (LC 648)
- Longest Word in Dictionary (LC 720)

**When to use**

- Many prefix queries
- "Autocomplete", "dictionary lookups"
- Word search on a board with many target words

---

### ⭐ Union-Find (Disjoint Set Union)

`find` with path compression + `union` by rank → near O(1) amortized.

**Examples**

- Number of Connected Components (LC 323)
- Redundant Connection (LC 684)
- Accounts Merge (LC 721)
- Number of Islands II (LC 305)
- Most Stones Removed (LC 947)

**When to use**

- Dynamic connectivity
- "Group connected things"
- Detect cycles in undirected graphs incrementally
- Kruskal's MST

---

### ⭐ Segment Tree

Binary tree where each node stores an aggregate (sum/min/max) over a range; O(log n) update + query.

**Examples**

- Range Sum Query – Mutable (LC 307)
- Count of Smaller Numbers After Self (LC 315)
- The Skyline Problem (LC 218)
- Range Module (LC 715)

**When to use**

- Range queries WITH point/range updates
- Custom aggregates (min, max, gcd) not just sum

---

### ➕ Fenwick Tree / Binary Indexed Tree (BIT)

Compact O(n) array; point update + prefix sum in O(log n) using `i += i & -i`.

**Examples**

- Range Sum Query – Mutable (LC 307)
- Count of Smaller Numbers After Self (LC 315)
- Reverse Pairs (LC 493)
- Create Sorted Array Through Instructions (LC 1649)

**When to use**

- Point update + prefix/range sum
- Count inversions
- Many updates and queries

---

### ➕ Sparse Table

O(n log n) preprocessing for idempotent range queries (min/max/gcd/AND/OR) answered in O(1). No updates.

**When to use**

- Static array
- Many O(1) range-min/max queries
- No updates needed

---

### ➕ Square Root Decomposition

Split array into √n blocks; precompute per-block aggregate; updates and queries in O(√n).

**When to use**

- Range queries with custom merge function
- Modest n (up to ~10⁵)
- "Design something simpler than segment tree"

---

### ➕ Balanced BST / Order-Statistics

Java `TreeMap`, C++ `std::set`, Python `SortedList` — O(log n) insert/erase/floor/ceil.

**Examples**

- My Calendar I/II/III (LC 729/731/732)
- Contains Duplicate III (LC 220)
- Sliding Window Median (LC 480)
- Count of Range Sum (LC 327)

---

## 13. Graph Algorithms

### ⭐ Iterative DFS

Explicit stack to traverse without recursion.

**Examples**

- Number of Islands (LC 200)
- Clone Graph (LC 133)
- Pacific Atlantic Water Flow (LC 417)
- Course Schedule (LC 207)

**When to use**

- Avoid stack overflow on deep graphs
- "Without recursion" follow-up

---

### ⭐ Dijkstra's Algorithm

Min-heap-based shortest path on non-negative weighted graphs. O((V+E) log V).

**Examples**

- Network Delay Time (LC 743)
- Path With Minimum Effort (LC 1631)
- Cheapest Flights Within K Stops (LC 787)
- Swim in Rising Water (LC 778)

**When to use**

- Shortest path with non-negative weights
- Min-cost path in weighted grid

---

### ⭐ Prim's Algorithm

Grow MST from one vertex, always adding cheapest edge to tree.

**Examples**

- Min Cost to Connect All Points (LC 1584)
- Connecting Cities With Minimum Cost (LC 1135)

**When to use**

- Dense graphs (better than Kruskal when E ≈ V²)
- MST on adjacency matrix

---

### ⭐ Kruskal's Algorithm

Sort edges; greedily add the cheapest non-cycle edge using Union-Find.

**Examples**

- Min Cost to Connect All Points (LC 1584)
- Optimize Water Distribution in a Village (LC 1168)

**When to use**

- Sparse graphs (E ≪ V²)
- MST when edges are given in a list

---

### ⭐ Topological Sort

Kahn's algorithm (BFS on in-degrees) or DFS post-order on a DAG.

**Examples**

- Course Schedule I/II (LC 207/210)
- Alien Dictionary (LC 269)
- Minimum Height Trees (LC 310)
- Sequence Reconstruction (LC 444)

**When to use**

- Prerequisite ordering
- "Schedule tasks with dependencies"
- Detect cycle in directed graph

---

### ➕ Bellman-Ford

Single-source shortest path in O(V·E); handles negative edges, detects negative cycles.

**Examples**

- Cheapest Flights Within K Stops (LC 787)
- Network Delay Time (LC 743)

**When to use**

- Negative edge weights possible
- "At most k edges"
- Need to detect negative cycle

---

### ➕ Floyd-Warshall

All-pairs shortest path in O(V³). Triple loop: `dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`.

**Examples**

- Find the City With the Smallest Number of Neighbors at a Threshold Distance (LC 1334)
- Course Schedule IV (LC 1462)
- Number of Ways to Arrive at Destination (LC 1976)

**When to use**

- V ≤ 400 and many shortest-path queries
- Transitive closure
- Dense graph, all-pairs needed

---

### ➕ Tarjan / Kosaraju (Strongly Connected Components)

Tarjan: one DFS with `disc[v]`, `low[v]`, stack. Kosaraju: DFS, transpose, DFS again.

**Examples**

- Critical Connections in a Network (LC 1192)
- SCC tagging / DAG condensation

**When to use**

- "Strongly connected"
- "Condense to DAG"
- Find cycles in directed graph

---

### ➕ Bridges & Articulation Points

Same DFS framework as Tarjan; edge `(u,v)` is a bridge iff `low[v] > disc[u]`.

**Examples**

- Critical Connections in a Network (LC 1192)

**When to use**

- "Find edges/nodes whose removal disconnects the graph"
- "Critical infrastructure"

---

### ➕ A* Search

Best-first search with heuristic `f(n) = g(n) + h(n)`; admissible heuristic ⇒ optimal.

**Examples**

- Sliding Puzzle (LC 773)
- Shortest Path in Binary Matrix (LC 1091)

**When to use**

- Pathfinding with a natural distance heuristic
- "Make Dijkstra faster knowing geometry"

---

### ➕ Bipartite Check / 2-Coloring

BFS/DFS coloring; conflict ⇒ not bipartite.

**Examples**

- Is Graph Bipartite? (LC 785)
- Possible Bipartition (LC 886)

**When to use**

- "Split nodes into two groups so no edge is within a group"

---

### ➕ Eulerian Path/Circuit (Hierholzer's)

Use every edge exactly once; check degree conditions; stack-based DFS.

**Examples**

- Reconstruct Itinerary (LC 332)
- Cracking the Safe (LC 753)

**When to use**

- "Use every edge exactly once"
- "Lexicographically smallest itinerary"

---

## 14. Backtracking & Recursion

### ⭐ Subsets

Include/exclude each element; 2ⁿ subsets total.

**Examples**

- Subsets I/II (LC 78/90)
- Letter Combinations of a Phone Number (LC 17)
- Generate Parentheses (LC 22)

---

### ⭐ Combinations

Pick k of n; recursion with start index to avoid duplicates.

**Examples**

- Combinations (LC 77)
- Combination Sum I/II/III (LC 39/40/216)
- Factor Combinations (LC 254)

---

### ⭐ Permutations

All n! orderings; swap or used-set approach.

**Examples**

- Permutations I/II (LC 46/47)
- Next Permutation (LC 31)
- Permutation Sequence (LC 60)

---

### ➕ Constraint-Satisfaction Backtracking

Recurse with explicit constraints; backtrack on violation.

**Examples**

- N-Queens I/II (LC 51/52)
- Sudoku Solver (LC 37)
- Word Search II (LC 212, with Trie)
- Restore IP Addresses (LC 93)
- Expression Add Operators (LC 282)

**When to use**

- "Find all valid configurations"
- Small input space with combinatorial explosion (n ≤ ~12)

---

### ➕ Backtracking with Pruning

Sort + skip duplicates; bound-based pruning.

**Examples**

- Combination Sum II (LC 40)
- Permutations II (LC 47)
- Palindrome Partitioning (LC 131)

---

## 15. Dynamic Programming

### ⭐ 0/1 Knapsack

Each item taken at most once; `dp[i][w]` = max value using first i items with capacity w.

**Examples**

- Partition Equal Subset Sum (LC 416)
- Target Sum (LC 494)
- Ones and Zeroes (LC 474)
- Last Stone Weight II (LC 1049)

**When to use**

- Each item used at most once
- Subset-sum / target-sum
- "Can we partition into…"

---

### ⭐ Unbounded Knapsack

Each item can be reused any number of times.

**Examples**

- Coin Change I/II (LC 322/518)
- Combination Sum IV (LC 377)
- Perfect Squares (LC 279)

**When to use**

- "Unlimited supply"
- "Minimum coins / fewest items"
- "Number of ways to reach a target"

---

### ⭐ LCS (Longest Common Subsequence)

2D DP `dp[i][j]` over prefixes of two strings.

**Examples**

- Longest Common Subsequence (LC 1143)
- Edit Distance (LC 72)
- Distinct Subsequences (LC 115)
- Shortest Common Supersequence (LC 1092)
- Delete Operation for Two Strings (LC 583)

**When to use**

- Two-sequence comparison
- Edit/diff problems
- "Make two strings equal"

---

### ⭐ Palindromes (DP)

`dp[i][j]` = whether `s[i..j]` is palindromic; build by length.

**Examples**

- Longest Palindromic Substring (LC 5)
- Longest Palindromic Subsequence (LC 516)
- Palindromic Substrings (LC 647)
- Palindrome Partitioning II (LC 132)

---

### ➕ 1D Linear DP

`dp[i]` based on `dp[i-1]`, `dp[i-2]`, etc.

**Examples**

- Climbing Stairs (LC 70)
- House Robber I/II (LC 198/213)
- Decode Ways (LC 91)
- Word Break (LC 139)
- Longest Increasing Subsequence (LC 300)

---

### ➕ LIS with Patience Sorting (O(n log n))

Maintain `tails` array; replace first tail ≥ x via binary search.

**Examples**

- Longest Increasing Subsequence (LC 300)
- Russian Doll Envelopes (LC 354)
- Number of LIS (LC 673)

**When to use**

- "Longest increasing subsequence"
- n up to 10⁵

---

### ➕ Edit Distance / String DP

`dp[i][j]` over two-string prefixes.

**Examples**

- Edit Distance (LC 72)
- Interleaving String (LC 97)
- Wildcard Matching (LC 44)
- Regular Expression Matching (LC 10)
- Minimum Insertions to Make Palindrome (LC 1312)

**When to use**

- Two strings + transformation cost
- Pattern matching with `*` / `?`

---

### ➕ DP on Grids / 2D Path Counting

`dp[i][j]` from top-left to (i,j).

**Examples**

- Unique Paths I/II (LC 62/63)
- Minimum Path Sum (LC 64)
- Cherry Pickup I/II (LC 741/1463)
- Dungeon Game (LC 174)
- Maximal Square (LC 221)
- Maximal Rectangle (LC 85)

---

### ➕ Interval DP / Matrix Chain

`dp[l][r]` over subranges; iterate by length.

**Examples**

- Matrix Chain Multiplication (classic)
- Burst Balloons (LC 312)
- Minimum Cost to Cut a Stick (LC 1547)
- Strange Printer (LC 664)
- Stone Game I/II/V/VII
- Palindrome Partitioning II (LC 132)

**When to use**

- Choose split point in a range
- Cost depends on outer boundary
- "Merge stones / cut rope optimally"

---

### ➕ State Machine DP

Encode small finite state in DP dimension.

**Examples**

- Best Time to Buy and Sell Stock III/IV/Cooldown/Fee (LC 123/188/309/714)
- Paint House I/II/III (LC 256/265/1473)

**When to use**

- Multiple disjoint "modes" each with own transition

---

### ➕ DP on Trees

Postorder bottom-up; per-node return tuple (e.g., included/excluded).

**Examples**

- House Robber III (LC 337)
- Binary Tree Maximum Path Sum (LC 124)
- Sum of Distances in Tree (LC 834, rerooting)
- Binary Tree Cameras (LC 968)

---

### ➕ Bitmask DP

State includes a subset bitmask; n ≤ 20.

**Examples**

- Partition to K Equal Sum Subsets (LC 698)
- Shortest Path Visiting All Nodes (LC 847)
- Smallest Sufficient Team (LC 1125)
- Maximum Students Taking Exam (LC 1349)
- Find Minimum Time to Finish All Jobs (LC 1723)
- TSP variants

**When to use**

- n ≤ 20
- "Visit all nodes"
- "Assign tasks to workers"
- "Subset of skills covers all"

---

### ➕ Digit DP

Iterate digits of N; state `(pos, tight, …)`; count numbers in [1..N] satisfying digit-pattern.

**Examples**

- Numbers At Most N Given Digit Set (LC 902)
- Count Numbers with Unique Digits (LC 357)
- Non-negative Integers without Consecutive Ones (LC 600)
- Numbers With Repeated Digits (LC 1012)

**When to use**

- "Count numbers in [1..N] satisfying digit property"
- N as large as 10¹⁸

---

### ➕ Probability / Expected-Value DP

**Examples**

- Knight Probability in Chessboard (LC 688)
- Soup Servings (LC 808)
- New 21 Game (LC 837)
- Out of Boundary Paths (LC 576)

---

### ➕ Game Theory / Minimax DP

Two players, opposite objectives; memoize on (state, player).

**Examples**

- Predict the Winner (LC 486)
- Stone Game I/II/IV/VII (LC 877/1140/1510/1690)
- Can I Win (LC 464)

---

## 16. Bit Manipulation

**Core ops to memorize:**

- `n & (n-1)` — clears lowest set bit (Brian Kernighan)
- `n & -n` — isolates lowest set bit
- `1 << k` — set bit k
- `(n >> k) & 1` — read bit k

### ➕ XOR Pairing Trick

XOR cancels equal numbers (`x ^ x = 0`).

**Examples**

- Single Number I/II/III (LC 136/137/260)
- Missing Number (LC 268)
- Find the Difference (LC 389)

**When to use**

- "Every element appears twice except…"
- "Find missing number from 0..n in O(1) space"

---

### ➕ Power-of-Two / Set-Bit Tricks

**Examples**

- Number of 1 Bits (LC 191)
- Counting Bits (LC 338)
- Power of Two (LC 231)
- Reverse Bits (LC 190)
- Sum of Two Integers (LC 371)

---

### ➕ Subset Enumeration via Bitmask

Iterate `mask` from 0 to `(1 << n) - 1`; bit i = element i included.

**Examples**

- Subsets (LC 78)
- Maximum Product of Word Lengths (LC 318)
- Count Number of Maximum Bitwise-OR Subsets (LC 2044)

**When to use**

- n ≤ 20
- Need to consider all subsets / track which subset chosen

---

## 17. Math & Number Theory

### ➕ GCD / LCM

Euclidean algorithm.

**Examples**

- Water and Jug Problem (LC 365)
- Fraction simplification

---

### ➕ Modular Exponentiation

Binary exponentiation in O(log y).

**Examples**

- Pow(x, n) (LC 50)
- Super Pow (LC 372)

---

### ➕ Prime Sieves (Sieve of Eratosthenes)

O(n log log n) to find all primes ≤ n.

**Examples**

- Count Primes (LC 204)
- Closest Prime Numbers in Range (LC 2523)

---

### ➕ Random / Probability

**Examples**

- Random Pick with Weight (LC 528) — prefix-sum + binary search
- Shuffle an Array (LC 384) — Fisher-Yates
- Reservoir Sampling problems (see §19)

---

## 18. String Algorithms (Advanced)

### ➕ KMP / Z-Algorithm

KMP precomputes LPS array; matches in O(n+m), no backtracking on text.

**Examples**

- Find the Index of First Occurrence (LC 28)
- Repeated Substring Pattern (LC 459)
- Shortest Palindrome (LC 214)
- Longest Happy Prefix (LC 1392)

**When to use**

- Pattern-in-text matching
- "Find shortest prefix to add"
- "Is string a repeated copy of a smaller substring?"

---

### ➕ Manacher's Algorithm

Linear-time longest palindromic substring.

**Examples**

- Longest Palindromic Substring (LC 5, optimal version)

> Note: expand-around-center is usually sufficient in interviews.

---

### ➕ Suffix Array / Suffix Automaton

Rare at L3/L4. Solves "longest repeated substring", "distinct substrings". Often achievable with Z-algorithm or hashing.

---

## 19. Special / Niche Algorithms

### ➕ Reservoir Sampling

Choose k uniform samples from a stream of unknown length: keep first k; for i-th item (i ≥ k), replace a random index with probability k/i.

**Examples**

- Random Pick Index (LC 398)
- Linked List Random Node (LC 382)
- Random Pick with Blacklist (LC 710)

**When to use**

- "Stream of unknown size"
- "Uniform random sample"
- "Without storing all input"

---

### ➕ Quickselect

Quicksort-like partition; recurse only into side containing kth index. O(n) average.

**Examples**

- Kth Largest Element in an Array (LC 215)
- Top K Frequent Elements (LC 347)
- Wiggle Sort II (LC 324)

**When to use**

- "Kth smallest/largest" without full sort
- Follow-up: "Can you avoid O(n log n)?"

---

### ➕ Meet in the Middle

Split n into two halves of n/2; enumerate each side (2^(n/2)); combine via hash/sort+two-pointer.

**Examples**

- Closest Subsequence Sum (LC 1755)
- Partition Array Into Two Arrays to Minimize Sum Difference (LC 2035)
- Split Array With Same Average (LC 805)

**When to use**

- n up to ~40
- Brute-force 2^n infeasible but 2^20 is fine

---

### ➕ Cycle Detection (Floyd's, Brent's)

Tortoise-and-hare for sequence cycles or functional graphs.

**Examples**

- Linked List Cycle I/II (LC 141/142)
- Find the Duplicate Number (LC 287, Floyd on `nums[i]` as next)
- Happy Number (LC 202)

**When to use**

- Functional graph (each x → unique successor)
- Need cycle entry/length without extra space

---

### ➕ Mo's Algorithm

Offline range queries; sort queries by `(l/√n, r)`; maintain sliding answer in O((n+q)·√n).

**When to use**

- Many offline range queries on a static array
- No per-query updates
- (Rare at L3/L4; worth recognizing)

---

## 20. Design / OOD Coding Problems

Google interviewers frequently ask "design and implement" coding problems mid-loop. They test data-structure composition.

### ➕ Cache Designs

- **LRU Cache** (LC 146) — Hash map + doubly linked list, O(1) get/put
- **LFU Cache** (LC 460) — Two hash maps + frequency-bucket DLLs

### ➕ Hash & Random-Access

- **Design HashMap / HashSet** (LC 706/705) — buckets + rehashing
- **Insert Delete GetRandom O(1)** (LC 380/381) — array + hash map for index

### ➕ Stateful Game/UI

- **Design Tic-Tac-Toe** (LC 348) — row/col/diagonal counters
- **Design Hit Counter** (LC 362) — circular buffer or queue
- **Design Snake Game** (LC 353) — deque + set

### ➕ File System / Search

- **Design In-Memory File System** (LC 588) — Trie of nodes
- **Design Search Autocomplete** (LC 642) — Trie + heap

### ➕ Stack / Iterator Designs

- **Min Stack / Max Stack** (LC 155/716) — auxiliary stack
- **Implement Iterator / Peeking / Zigzag** (LC 251/284/281)

### ➕ Misc Design

- **Design Twitter** (LC 355)
- **Logger Rate Limiter** (LC 359)
- **Encode and Decode TinyURL** (LC 535)
- **Rate Limiter** (token bucket / sliding window — Google "system-y" coding)

**When to use**

- "Design a class that supports the following operations…"
- "All operations in O(1)"
- "Implement an iterator that…"

---

## 21. Problem-Type Categories Frequently Asked at Google

Recognizing the category during clarification often points you to the right pattern.

| Category | Typical Patterns |
|---|---|
| **Array & Subarray** | Sliding window, prefix sums, monotonic stack/deque, two pointers, binary search on answer |
| **String** | Sliding window + frequency map, hashing, KMP/Z, expand-around-center, DP on strings |
| **Linked List** | Slow/fast pointers, in-place reversal, k-group, hash-map cloning |
| **Tree** | Recursive traversal, BFS levels, tree DP, LCA, serialize/deserialize, BST validation |
| **Graph** ⭐ huge at Google | DFS/BFS, multi-source BFS, topological sort, Dijkstra/Bellman-Ford/Floyd-Warshall, Union-Find, SCC, A*, bipartite, Eulerian |
| **Grid / Matrix** | Flood fill, multi-source BFS, in-place rotation, 2D DP, binary search on sorted matrix |
| **Interval** | Merge/insert, line sweep, sort-by-end greedy, two heaps |
| **Top-K / Streaming** | Top K, K-way merge, two heaps, reservoir sampling |
| **Backtracking** | Subsets/perms/combinations, N-Queens, Sudoku, word search |
| **Dynamic Programming** | 1D linear, 2D grid, interval, state machine, tree, bitmask, digit, probability, knapsack |
| **Greedy** | Interval scheduling, jumps, Huffman, sort+pick |
| **Math / Bit / Number Theory** | XOR tricks, GCD, mod-pow, sieve, base conversions, overflow handling |
| **Stack-Based Parsing** | Parentheses, calculators, string decoding, path simplification, asteroid collisions |
| **Design / OOD** | LRU/LFU, iterators, hit counters, Tic-Tac-Toe, file system, autocomplete, rate limiter |
| **Range Query** | Segment tree, Fenwick/BIT, sparse table, sqrt decomposition, Mo's algorithm |
| **Geometric / Sweep** | Line sweep, "skyline", closest pair (rare) |
| **Random Sampling** | Reservoir sampling, weighted random, Fisher-Yates shuffle |

---

## 🎯 Quick Recognition Cheat Sheet

| Signal in the problem | Likely pattern |
|---|---|
| "Find next/previous greater/smaller" | **Monotonic Stack** |
| "Min/max in every window of size k" | **Monotonic Deque** |
| "Top K", "K most frequent", "K nearest" | **Heap (size K)** |
| "Merge K sorted ___" | **K-way merge with min-heap** |
| "Median of a stream" | **Two Heaps** |
| "Subarray sum equals K" | **Prefix sum + HashMap** |
| "Range update, point query" | **Difference array / BIT / Segment Tree** |
| "Range sum/min with updates" | **Fenwick Tree / Segment Tree** |
| "Many static range-min/max queries" | **Sparse Table** |
| Sorted array + search | **Binary search** |
| "Rotated sorted array" | **Modified binary search** |
| "Minimize the max" / "Maximize the min" | **Binary search on answer** |
| "Shortest path in unweighted graph/grid" | **BFS** |
| "Distance to nearest X for every cell" | **Multi-source BFS** |
| Edge weights only 0 or 1 | **0-1 BFS (deque)** |
| "Shortest path with non-negative weights" | **Dijkstra** |
| Negative weights / "at most k edges" | **Bellman-Ford** |
| "Shortest path between every pair" | **Floyd-Warshall** |
| "Strongly connected" / cycles in directed graph | **Tarjan SCC** |
| "Edges/nodes whose removal disconnects" | **Bridges / Articulation Points** |
| Prerequisites / dependency ordering | **Topological Sort** |
| Dynamic connectivity / grouping | **Union-Find** |
| "Find all subsets/permutations/combinations" | **Backtracking** |
| n ≤ 20, track subset chosen | **Bitmask DP** |
| Count numbers in [1..N] with digit property | **Digit DP** |
| "Optimize on a tree" with pick/skip | **Tree DP** |
| Two strings + transformation | **Edit Distance / LCS** |
| "Longest increasing subsequence" | **LIS (O(n log n) patience sort)** |
| "Maximum concurrent intervals" / skyline | **Line Sweep** |
| "Stream, uniform sample" | **Reservoir Sampling** |
| "Kth smallest, no full sort needed" | **Quickselect** |
| n ≤ 40, 2^n too slow | **Meet in the Middle** |
| "Every element twice except one" | **XOR pairing** |
| "Power of two" / "count set bits" | **Bit tricks** |
| "O(1) get/put + eviction" | **LRU/LFU (hash + DLL)** |
| Many LCA queries on static tree | **Binary Lifting / Euler Tour + Sparse Table** |
| "Substring search at scale" | **KMP / Rabin-Karp** |
| "Cycle in linked list in O(1) space" | **Floyd's Tortoise & Hare** |
| "Inorder traversal in O(1) space" | **Morris Traversal** |

---

## 📌 Study Strategy & Caveats

### L3 vs L4 differentiation

- **L3 (new grad):** Correct algorithm with hints, clean code, basic complexity analysis. Mastering your original 21 + monotonic stack/deque, basic binary search variants, BFS variants, heap patterns, intervals, greedy, and core DP variants (LIS, edit distance, state machine, tree DP) is sufficient for most loops.
- **L4 (mid-level):** Production-quality code, optimal trade-offs, edge cases, complexity volunteered *before* coding. Recognize advanced patterns even if you don't implement them flawlessly under pressure. Be ready for follow-ups that stress an existing pattern in a new dimension.

### Pattern frequency at Google L3/L4

- **Very common:** Arrays, strings, graphs, grids/matrices, intervals, BFS/DFS, DP, backtracking, heap.
- **Common:** Trie, Union-Find, monotonic stack, sliding window, binary search variants.
- **Occasional:** Segment tree, BIT, LCA, KMP, bitmask DP, Bellman-Ford, Floyd-Warshall.
- **Rare (recognize but don't over-invest):** Mo's algorithm, suffix arrays, network flow, heavy-light decomposition, persistent segment trees, Manacher's. More common at L5+.

### What interviewers actually evaluate

- **Communication and trade-off discussion** are weighted as heavily as code. Volunteer complexity analysis before coding. Lead with brute force, then optimize.
- **Pattern recognition speed** in the first 2–3 minutes is the explicit differentiator. Train recognition by category, not by problem name.
- Problem statements **are not always labeled**. A "design a parking lot" might really be backtracking + DFS; "schedule jobs across machines" might really be heap + greedy.

---

*Good luck with your prep! 🚀*
