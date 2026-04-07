# NeetCode 250 — Complete Algorithm & Data Structure Cheatsheet

> Every algorithm • Code templates (Python) • Time & Space complexity • Use-case patterns • Multiple approaches • Solid practice problems

---

## 📑 Table of Contents

1. [🔢 Arrays & Hashing](#arrays--hashing) — *HashMap / HashSet, Prefix Sum, Kadane's Algorithm, Boyer-Moore Voting Algorithm, Dutch National Flag / 3-Way Partition, Bucket Sort / Counting Sort*
2. [👆 Two Pointers](#two-pointers) — *Opposite-Direction Two Pointers, Three Sum / K-Sum Pattern, Same-Direction*
3. [🪟 Sliding Window](#sliding-window) — *Fixed-Size Sliding Window, Variable-Size Sliding Window, Sliding Window + Monotonic Deque*
4. [📚 Stack](#stack) — *Matching Parentheses / Bracket Validation, Monotonic Stack, Min Stack / Max Stack, Expression Evaluation / RPN*
5. [🔍 Binary Search](#binary-search) — *Standard Binary Search, Binary Search on Rotated Array, Binary Search on Answer*
6. [🔗 Linked List](#linked-list) — *Reverse Linked List, Fast & Slow Pointers, Dummy Head + Merge Pattern*
7. [🌳 Trees](#trees) — *DFS Traversals, BFS / Level Order Traversal, BST Operations & Validation, Lowest Common Ancestor, Tree Construction from Traversals*
8. [⛰️ Heap / Priority Queue](#heap--priority-queue) — *Min-Heap / Max-Heap, Two Heaps, Merge K Sorted*
9. [🔙 Backtracking](#backtracking) — *Subsets / Combinations / Permutations Template, Constraint-Based Backtracking*
10. [🔤 Tries](#tries) — *Trie*
11. [🕸️ Graphs](#graphs) — *BFS, DFS, Topological Sort, Union-Find / Disjoint Set Union*
12. [🗺️ Advanced Graphs](#advanced-graphs) — *Dijkstra's Algorithm, Bellman-Ford Algorithm, SPFA, Kruskal's Algorithm, Prim's Algorithm, Floyd-Warshall*
13. [📈 1-D Dynamic Programming](#1-d-dynamic-programming) — *Fibonacci / Climbing Stairs Pattern, House Robber Pattern, Longest Increasing Subsequence, Coin Change / Unbounded Knapsack, Word Break*
14. [🧮 2-D Dynamic Programming](#2-d-dynamic-programming) — *Grid Paths, Longest Common Subsequence, Edit Distance, 0/1 Knapsack, Longest Palindromic Subsequence / Substring*
15. [💰 Greedy](#greedy) — *Jump Game / Reachability Greedy, Activity Selection / Interval Scheduling Maximization, Gas Station, Task Scheduler / Greedy Frequency*
16. [📐 Intervals](#intervals) — *Merge Intervals, Insert Interval, Meeting Rooms*
17. [📏 Math & Geometry](#math--geometry) — *GCD / LCM, Sieve of Eratosthenes, Fast Exponentiation, Matrix Rotation / Spiral Order, Reservoir Sampling & Fisher-Yates Shuffle*
18. [🔧 Bit Manipulation](#bit-manipulation) — *XOR Properties & Single Number, Brian Kernighan's, Bit Masking*

---

## 🔢 1. Arrays & Hashing

### HashMap / HashSet — Frequency Count & Lookup

**When to use:** Need O(1) lookup, counting occurrences, checking duplicates, grouping elements.

```python
# Frequency counter
from collections import Counter
freq = Counter(nums)          # or defaultdict(int)

# HashSet for O(1) membership
seen = set()
for x in nums:
    if target - x in seen:
        return True
    seen.add(x)

# Group by key (e.g., anagram grouping)
from collections import defaultdict
groups = defaultdict(list)
for s in strs:
    key = tuple(sorted(s))    # or letter-count tuple
    groups[key].append(s)
```

**TC:** `O(n)` **SC:** `O(n)`

**Practice:** `Two Sum` • `Group Anagrams` • `Contains Duplicate` • `Valid Anagram` • `Top K Frequent Elements` • `Longest Consecutive Sequence`

---

### Prefix Sum

**When to use:** Range sum queries, subarray sum equals k, count subarrays with given sum.

```python
# Build prefix sum
prefix = [0] * (len(nums) + 1)
for i, x in enumerate(nums):
    prefix[i+1] = prefix[i] + x
# sum(nums[l..r]) = prefix[r+1] - prefix[l]

# Subarray sum equals k (using hashmap)
count, cur = 0, 0
seen = {0: 1}
for x in nums:
    cur += x
    count += seen.get(cur - k, 0)
    seen[cur] = seen.get(cur, 0) + 1
```

**TC:** `O(n) build, O(1) query` **SC:** `O(n)`

**Practice:** `Subarray Sum Equals K` • `Range Sum Query` • `Product of Array Except Self` • `Contiguous Array (prefix + hashmap)`

---

### Kadane's Algorithm — Maximum Subarray

**When to use:** Find contiguous subarray with maximum (or minimum) sum.

```python
def max_subarray(nums):
    best = cur = nums[0]
    for x in nums[1:]:
        cur = max(x, cur + x)
        best = max(best, cur)
    return best

# Variant: max product subarray
def max_product(nums):
    best = mx = mn = nums[0]
    for x in nums[1:]:
        if x < 0: mx, mn = mn, mx
        mx = max(x, mx * x)
        mn = min(x, mn * x)
        best = max(best, mx)
    return best
```

**TC:** `O(n)` **SC:** `O(1)`

**Practice:** `Maximum Subarray` • `Maximum Product Subarray` • `Max Sum Circular Subarray` • `Best Time to Buy and Sell Stock`

---

### Boyer-Moore Voting Algorithm

**When to use:** Find majority element (appears > n/2 times) in O(1) space.

```python
def majority_element(nums):
    cand, count = None, 0
    for x in nums:
        if count == 0:
            cand = x
        count += 1 if x == cand else -1
    return cand  # verify if needed
```

**TC:** `O(n)` **SC:** `O(1)`

**Practice:** `Majority Element` • `Majority Element II (top-2)`

---

### Dutch National Flag / 3-Way Partition

**When to use:** Sort array of 0s, 1s, 2s in-place in one pass.

```python
def sort_colors(nums):
    lo, mid, hi = 0, 0, len(nums) - 1
    while mid <= hi:
        if nums[mid] == 0:
            nums[lo], nums[mid] = nums[mid], nums[lo]
            lo += 1; mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[hi] = nums[hi], nums[mid]
            hi -= 1
```

**TC:** `O(n)` **SC:** `O(1)`

**Practice:** `Sort Colors` • `Move Zeroes` • `Sort Array By Parity`

---

### Bucket Sort / Counting Sort

**When to use:** Top-K frequency, sorting when value range is bounded.

```python
# Bucket sort for Top K frequent
from collections import Counter
def top_k_frequent(nums, k):
    freq = Counter(nums)
    buckets = [[] for _ in range(len(nums) + 1)]
    for val, cnt in freq.items():
        buckets[cnt].append(val)
    res = []
    for i in range(len(buckets)-1, -1, -1):
        for v in buckets[i]:
            res.append(v)
            if len(res) == k:
                return res
```

**TC:** `O(n)` **SC:** `O(n)`

**Practice:** `Top K Frequent Elements` • `Sort Characters By Frequency` • `Sort an Array (counting sort variant)`

---


## 👆 2. Two Pointers

### Opposite-Direction Two Pointers

**When to use:** Sorted array pair sum, palindrome check, container with most water.

```python
def two_sum_sorted(nums, target):
    l, r = 0, len(nums) - 1
    while l < r:
        s = nums[l] + nums[r]
        if s == target: return [l, r]
        elif s < target: l += 1
        else: r -= 1

def is_palindrome(s):
    l, r = 0, len(s) - 1
    while l < r:
        if s[l] != s[r]: return False
        l += 1; r -= 1
    return True
```

**TC:** `O(n)` **SC:** `O(1)`

**Practice:** `Two Sum II (sorted)` • `Valid Palindrome` • `Container With Most Water` • `Trapping Rain Water`

---

### Three Sum / K-Sum Pattern

**When to use:** Find triplets (or k-tuples) summing to target; sort + fix one + 2ptr.

```python
def three_sum(nums):
    nums.sort()
    res = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i-1]: continue
        l, r = i+1, len(nums)-1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s == 0:
                res.append([nums[i], nums[l], nums[r]])
                while l < r and nums[l]==nums[l+1]: l+=1
                while l < r and nums[r]==nums[r-1]: r-=1
                l += 1; r -= 1
            elif s < 0: l += 1
            else: r -= 1
    return res
```

**TC:** `O(n^2)  [O(n^(k-1)) for k-sum]` **SC:** `O(1) excl. output`

**Practice:** `3Sum` • `3Sum Closest` • `4Sum` • `Two Sum II`

---

### Same-Direction (Fast-Slow / Read-Write)

**When to use:** Remove duplicates in-place, remove element, partition.

```python
# Remove duplicates from sorted array
def remove_dups(nums):
    if not nums: return 0
    w = 1                       # write pointer
    for r in range(1, len(nums)):
        if nums[r] != nums[r-1]:
            nums[w] = nums[r]
            w += 1
    return w
```

**TC:** `O(n)` **SC:** `O(1)`

**Practice:** `Remove Duplicates from Sorted Array` • `Remove Element` • `Move Zeroes` • `Remove Duplicates II (allow 2)`

---


## 🪟 3. Sliding Window

### Fixed-Size Sliding Window

**When to use:** Max/min/sum of every window of size k.

```python
def max_sum_window(nums, k):
    cur = sum(nums[:k])
    best = cur
    for i in range(k, len(nums)):
        cur += nums[i] - nums[i - k]
        best = max(best, cur)
    return best
```

**TC:** `O(n)` **SC:** `O(1)`

**Practice:** `Max Sum of Subarray of Size K` • `Sliding Window Maximum (needs deque for O(n))` • `Find All Anagrams in a String`

---

### Variable-Size Sliding Window (Expand / Shrink)

**When to use:** Longest/shortest substring with condition, at most K distinct chars.

```python
def longest_k_distinct(s, k):
    from collections import defaultdict
    freq = defaultdict(int)
    l = best = 0
    for r in range(len(s)):
        freq[s[r]] += 1
        while len(freq) > k:       # shrink
            freq[s[l]] -= 1
            if freq[s[l]] == 0:
                del freq[s[l]]
            l += 1
        best = max(best, r - l + 1)
    return best

# Shortest subarray with sum >= target
def min_subarray_len(target, nums):
    l = cur = 0
    best = float('inf')
    for r in range(len(nums)):
        cur += nums[r]
        while cur >= target:
            best = min(best, r - l + 1)
            cur -= nums[l]; l += 1
    return best if best != float('inf') else 0
```

**TC:** `O(n) amortized (each elem enters/leaves once)` **SC:** `O(k) for freq map`

**Practice:** `Longest Substring Without Repeating Characters` • `Longest Repeating Character Replacement` • `Minimum Window Substring` • `Permutation in String` • `Minimum Size Subarray Sum`

---

### Sliding Window + Monotonic Deque

**When to use:** Sliding window maximum / minimum in O(n).

```python
from collections import deque
def max_sliding_window(nums, k):
    dq = deque()  # stores indices, front = max
    res = []
    for i, x in enumerate(nums):
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        while dq and nums[dq[-1]] <= x:
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            res.append(nums[dq[0]])
    return res
```

**TC:** `O(n)` **SC:** `O(k)`

**Practice:** `Sliding Window Maximum` • `Shortest Subarray with Sum at Least K (with prefix)`

---


## 📚 4. Stack

### Matching Parentheses / Bracket Validation

**When to use:** Validate or decode nested brackets, HTML tags, expression parsing.

```python
def is_valid(s):
    stack = []
    match = {')':'(', ']':'[', '}':'{'}
    for c in s:
        if c in match:
            if not stack or stack[-1] != match[c]:
                return False
            stack.pop()
        else:
            stack.append(c)
    return not stack
```

**TC:** `O(n)` **SC:** `O(n)`

**Practice:** `Valid Parentheses` • `Generate Parentheses` • `Decode String` • `Basic Calculator`

---

### Monotonic Stack (Next Greater / Smaller)

**When to use:** Next greater element, daily temperatures, stock span, largest rectangle.

```python
# Next Greater Element (decreasing stack)
def next_greater(nums):
    n = len(nums)
    res = [-1] * n
    stack = []                 # indices
    for i in range(n):
        while stack and nums[i] > nums[stack[-1]]:
            res[stack.pop()] = nums[i]
        stack.append(i)
    return res

# Largest Rectangle in Histogram
def largest_rect(heights):
    stack = []  # (index, height)
    best = 0
    for i, h in enumerate(heights):
        start = i
        while stack and stack[-1][1] > h:
            si, sh = stack.pop()
            best = max(best, sh * (i - si))
            start = si
        stack.append((start, h))
    for si, sh in stack:
        best = max(best, sh*(len(heights)-si))
    return best
```

**TC:** `O(n) — each element pushed/popped once` **SC:** `O(n)`

**Practice:** `Daily Temperatures` • `Next Greater Element I/II` • `Largest Rectangle in Histogram` • `Maximal Rectangle` • `Stock Span Problem` • `Trapping Rain Water (stack approach)`

---

### Min Stack / Max Stack

**When to use:** Stack with O(1) getMin / getMax alongside push/pop.

```python
class MinStack:
    def __init__(self):
        self.stack = []   # (val, current_min)
    def push(self, val):
        mn = min(val, self.stack[-1][1]) if self.stack else val
        self.stack.append((val, mn))
    def pop(self):
        self.stack.pop()
    def top(self):
        return self.stack[-1][0]
    def getMin(self):
        return self.stack[-1][1]
```

**TC:** `O(1) all ops` **SC:** `O(n)`

**Practice:** `Min Stack` • `Max Stack` • `Online Stock Span`

---

### Expression Evaluation / RPN

**When to use:** Evaluate postfix, infix expressions; Shunting-Yard algorithm.

```python
def eval_rpn(tokens):
    stack = []
    ops = {'+': lambda a,b: a+b, '-': lambda a,b: a-b,
           '*': lambda a,b: a*b, '/': lambda a,b: int(a/b)}
    for t in tokens:
        if t in ops:
            b, a = stack.pop(), stack.pop()
            stack.append(ops[t](a, b))
        else:
            stack.append(int(t))
    return stack[0]
```

**TC:** `O(n)` **SC:** `O(n)`

**Practice:** `Evaluate Reverse Polish Notation` • `Basic Calculator II` • `Basic Calculator`

---


## 🔍 5. Binary Search

### Standard Binary Search

**When to use:** Find target in sorted array, or find insertion point.

```python
def binary_search(nums, target):
    l, r = 0, len(nums) - 1
    while l <= r:
        m = (l + r) // 2
        if nums[m] == target: return m
        elif nums[m] < target: l = m + 1
        else: r = m - 1
    return -1  # or l for insertion point

# Lower bound (first >= target)
def lower_bound(nums, target):
    l, r = 0, len(nums)
    while l < r:
        m = (l + r) // 2
        if nums[m] < target: l = m + 1
        else: r = m
    return l

# Upper bound (first > target)
def upper_bound(nums, target):
    l, r = 0, len(nums)
    while l < r:
        m = (l + r) // 2
        if nums[m] <= target: l = m + 1
        else: r = m
    return l
```

**TC:** `O(log n)` **SC:** `O(1)`

**Practice:** `Binary Search` • `Search Insert Position` • `Find First and Last Position` • `Search a 2D Matrix`

---

### Binary Search on Rotated Array

**When to use:** Sorted-then-rotated array; identify which half is sorted.

```python
def search_rotated(nums, target):
    l, r = 0, len(nums) - 1
    while l <= r:
        m = (l + r) // 2
        if nums[m] == target: return m
        if nums[l] <= nums[m]:        # left half sorted
            if nums[l] <= target < nums[m]:
                r = m - 1
            else: l = m + 1
        else:                         # right half sorted
            if nums[m] < target <= nums[r]:
                l = m + 1
            else: r = m - 1
    return -1

# Find minimum in rotated sorted array
def find_min(nums):
    l, r = 0, len(nums) - 1
    while l < r:
        m = (l + r) // 2
        if nums[m] > nums[r]: l = m + 1
        else: r = m
    return nums[l]
```

**TC:** `O(log n)` **SC:** `O(1)`

**Practice:** `Search in Rotated Sorted Array` • `Find Minimum in Rotated Sorted Array` • `Search in Rotated Sorted Array II (dups)`

---

### Binary Search on Answer (Parametric Search)

**When to use:** Minimize/maximize a value where feasibility is monotonic. 'Min capacity to ship in D days', etc.

```python
def min_capacity(weights, days):
    def feasible(cap):
        d, cur = 1, 0
        for w in weights:
            if cur + w > cap:
                d += 1; cur = 0
            cur += w
        return d <= days

    lo, hi = max(weights), sum(weights)
    while lo < hi:
        mid = (lo + hi) // 2
        if feasible(mid): hi = mid
        else: lo = mid + 1
    return lo
```

**TC:** `O(n log S)  S = search space` **SC:** `O(1)`

**Practice:** `Capacity to Ship Packages Within D Days` • `Koko Eating Bananas` • `Split Array Largest Sum` • `Minimum Number of Days to Make m Bouquets` • `Median of Two Sorted Arrays`

---


## 🔗 6. Linked List

### Reverse Linked List (Iterative & Recursive)

**When to use:** Reverse entire list, reverse between positions, reverse in k-groups.

```python
def reverse_list(head):
    prev, cur = None, head
    while cur:
        nxt = cur.next
        cur.next = prev
        prev = cur
        cur = nxt
    return prev

# Reverse between positions l and r
def reverse_between(head, l, r):
    dummy = ListNode(0, head)
    pre = dummy
    for _ in range(l - 1): pre = pre.next
    cur = pre.next
    for _ in range(r - l):
        nxt = cur.next
        cur.next = nxt.next
        nxt.next = pre.next
        pre.next = nxt
    return dummy.next
```

**TC:** `O(n)` **SC:** `O(1)`

**Practice:** `Reverse Linked List` • `Reverse Linked List II` • `Reverse Nodes in k-Group` • `Palindrome Linked List`

---

### Fast & Slow Pointers (Floyd's Tortoise & Hare)

**When to use:** Detect cycle, find cycle start, find middle, linked list intersection.

```python
# Detect cycle
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast: return True
    return False

# Find cycle start
def detect_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow == fast:
            slow = head
            while slow != fast:
                slow, fast = slow.next, fast.next
            return slow
    return None

# Find middle
def middle(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
    return slow
```

**TC:** `O(n)` **SC:** `O(1)`

**Practice:** `Linked List Cycle` • `Linked List Cycle II` • `Middle of the Linked List` • `Happy Number (Floyd's on numbers)` • `Find the Duplicate Number`

---

### Dummy Head + Merge Pattern

**When to use:** Merge sorted lists, remove nth node, reorder list.

```python
# Merge two sorted lists
def merge(l1, l2):
    dummy = cur = ListNode(0)
    while l1 and l2:
        if l1.val <= l2.val:
            cur.next = l1; l1 = l1.next
        else:
            cur.next = l2; l2 = l2.next
        cur = cur.next
    cur.next = l1 or l2
    return dummy.next

# Remove nth node from end
def remove_nth(head, n):
    dummy = ListNode(0, head)
    fast = slow = dummy
    for _ in range(n + 1): fast = fast.next
    while fast:
        fast, slow = fast.next, slow.next
    slow.next = slow.next.next
    return dummy.next
```

**TC:** `O(n) or O(n+m)` **SC:** `O(1)`

**Practice:** `Merge Two Sorted Lists` • `Merge K Sorted Lists` • `Remove Nth Node From End` • `Reorder List` • `Add Two Numbers`

---


## 🌳 7. Trees

### DFS Traversals (Pre / In / Post Order)

**When to use:** Path problems, tree construction, serialization, validate BST.

```python
# Recursive DFS
def preorder(root):
    if not root: return []
    return [root.val]+preorder(root.left)+preorder(root.right)

# Iterative DFS (pre-order)
def preorder_iter(root):
    res, stack = [], [root]
    while stack:
        node = stack.pop()
        if node:
            res.append(node.val)
            stack.append(node.right)
            stack.append(node.left)
    return res

# Common DFS pattern: pass state down
def max_depth(root):
    if not root: return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))
```

**TC:** `O(n)` **SC:** `O(h) — h = height`

**Practice:** `Maximum Depth of Binary Tree` • `Same Tree` • `Invert Binary Tree` • `Subtree of Another Tree` • `Diameter of Binary Tree` • `Balanced Binary Tree`

---

### BFS / Level Order Traversal

**When to use:** Level-by-level processing, right side view, zigzag order.

```python
from collections import deque
def level_order(root):
    if not root: return []
    res, q = [], deque([root])
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            if node.left:  q.append(node.left)
            if node.right: q.append(node.right)
        res.append(level)
    return res
```

**TC:** `O(n)` **SC:** `O(w) — w = max width`

**Practice:** `Binary Tree Level Order Traversal` • `Binary Tree Right Side View` • `Binary Tree Zigzag Level Order`

---

### BST Operations & Validation

**When to use:** Search, insert, delete in BST; validate BST; kth smallest.

```python
# Validate BST
def is_valid_bst(root, lo=float('-inf'), hi=float('inf')):
    if not root: return True
    if not (lo < root.val < hi): return False
    return (is_valid_bst(root.left, lo, root.val) and
            is_valid_bst(root.right, root.val, hi))

# Kth smallest (in-order)
def kth_smallest(root, k):
    stack = []
    while True:
        while root:
            stack.append(root); root = root.left
        root = stack.pop()
        k -= 1
        if k == 0: return root.val
        root = root.right
```

**TC:** `O(h) search/insert, O(n) validate/kth` **SC:** `O(h)`

**Practice:** `Validate Binary Search Tree` • `Kth Smallest Element in BST` • `Lowest Common Ancestor of BST` • `Insert into BST` • `Delete Node in BST`

---

### Lowest Common Ancestor (LCA)

**When to use:** Find common ancestor of two nodes in binary tree.

```python
def lca(root, p, q):
    if not root or root == p or root == q:
        return root
    left  = lca(root.left, p, q)
    right = lca(root.right, p, q)
    if left and right: return root
    return left or right
```

**TC:** `O(n)` **SC:** `O(h)`

**Practice:** `LCA of Binary Tree` • `LCA of BST (use BST property for O(h))` • `Distance Between Two Nodes`

---

### Tree Construction from Traversals

**When to use:** Build tree from preorder+inorder, or postorder+inorder.

```python
def build(preorder, inorder):
    if not inorder: return None
    root_val = preorder.pop(0)   # or use index
    mid = inorder.index(root_val)
    root = TreeNode(root_val)
    root.left  = build(preorder, inorder[:mid])
    root.right = build(preorder, inorder[mid+1:])
    return root
# Optimise with hashmap for inorder index lookup
```

**TC:** `O(n) with hashmap` **SC:** `O(n)`

**Practice:** `Construct Binary Tree from Preorder and Inorder` • `Construct Binary Tree from Inorder and Postorder` • `Serialize and Deserialize Binary Tree`

---


## ⛰️ 8. Heap / Priority Queue

### Min-Heap / Max-Heap — Top-K Pattern

**When to use:** Kth largest/smallest, top-K frequent, sort nearly sorted array.

```python
import heapq
# Kth largest — maintain min-heap of size k
def kth_largest(nums, k):
    heap = nums[:k]
    heapq.heapify(heap)
    for x in nums[k:]:
        if x > heap[0]:
            heapq.heapreplace(heap, x)
    return heap[0]

# Max-heap in Python: negate values
heapq.heappush(heap, -val)
max_val = -heapq.heappop(heap)
```

**TC:** `O(n log k) for top-K` **SC:** `O(k)`

**Practice:** `Kth Largest Element in an Array` • `Top K Frequent Elements (heap approach)` • `K Closest Points to Origin` • `Last Stone Weight`

---

### Two Heaps — Median Maintenance

**When to use:** Find median from data stream, sliding window median.

```python
import heapq
class MedianFinder:
    def __init__(self):
        self.lo = []  # max-heap (negated)
        self.hi = []  # min-heap
    def addNum(self, num):
        heapq.heappush(self.lo, -num)
        heapq.heappush(self.hi, -heapq.heappop(self.lo))
        if len(self.hi) > len(self.lo):
            heapq.heappush(self.lo, -heapq.heappop(self.hi))
    def findMedian(self):
        if len(self.lo) > len(self.hi):
            return -self.lo[0]
        return (-self.lo[0] + self.hi[0]) / 2
```

**TC:** `O(log n) add, O(1) find` **SC:** `O(n)`

**Practice:** `Find Median from Data Stream` • `Sliding Window Median` • `IPO (max profit selection)`

---

### Merge K Sorted (Heap)

**When to use:** Merge K sorted lists/arrays, smallest range covering K lists.

```python
import heapq
def merge_k_lists(lists):
    heap = []
    for i, l in enumerate(lists):
        if l:
            heapq.heappush(heap, (l.val, i, l))
    dummy = cur = ListNode(0)
    while heap:
        val, i, node = heapq.heappop(heap)
        cur.next = node; cur = cur.next
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    return dummy.next
```

**TC:** `O(N log K) — N total elements, K lists` **SC:** `O(K)`

**Practice:** `Merge K Sorted Lists` • `Smallest Range Covering Elements from K Lists` • `Kth Smallest Element in Sorted Matrix`

---


## 🔙 9. Backtracking

### Subsets / Combinations / Permutations Template

**When to use:** Generate all subsets, combinations, permutations; power set.

```python
# Subsets
def subsets(nums):
    res = []
    def bt(start, path):
        res.append(path[:])
        for i in range(start, len(nums)):
            path.append(nums[i])
            bt(i + 1, path)
            path.pop()
    bt(0, [])
    return res

# Permutations
def permutations(nums):
    res = []
    def bt(path, used):
        if len(path) == len(nums):
            res.append(path[:])
            return
        for i in range(len(nums)):
            if used[i]: continue
            used[i] = True
            path.append(nums[i])
            bt(path, used)
            path.pop()
            used[i] = False
    bt([], [False]*len(nums))
    return res

# Combinations (n choose k)
def combine(n, k):
    res = []
    def bt(start, path):
        if len(path) == k:
            res.append(path[:])
            return
        for i in range(start, n+1):
            path.append(i)
            bt(i + 1, path)
            path.pop()
    bt(1, [])
    return res
```

**TC:** `O(2^n) subsets, O(n!) perms, O(C(n,k)) combos` **SC:** `O(n) recursion depth`

**Practice:** `Subsets` • `Subsets II (skip dups)` • `Permutations` • `Permutations II` • `Combinations` • `Combination Sum` • `Combination Sum II`

---

### Constraint-Based Backtracking (N-Queens, Sudoku)

**When to use:** Place items under constraints; prune invalid branches early.

```python
def solve_n_queens(n):
    cols, diag1, diag2 = set(), set(), set()
    board = [['.']*n for _ in range(n)]
    res = []
    def bt(row):
        if row == n:
            res.append([''.join(r) for r in board])
            return
        for col in range(n):
            if col in cols or (row-col) in diag1 \
               or (row+col) in diag2:
                continue
            cols.add(col); diag1.add(row-col)
            diag2.add(row+col)
            board[row][col] = 'Q'
            bt(row + 1)
            board[row][col] = '.'
            cols.discard(col); diag1.discard(row-col)
            diag2.discard(row+col)
    bt(0)
    return res
```

**TC:** `O(n!) with pruning` **SC:** `O(n^2)`

**Practice:** `N-Queens` • `Sudoku Solver` • `Word Search` • `Palindrome Partitioning`

---


## 🔤 10. Tries

### Trie (Prefix Tree) — Insert, Search, StartsWith

**When to use:** Prefix matching, autocomplete, word dictionary, word search II.

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for c in word:
            if c not in node.children:
                node.children[c] = TrieNode()
            node = node.children[c]
        node.is_end = True

    def search(self, word):
        node = self._find(word)
        return node is not None and node.is_end

    def starts_with(self, prefix):
        return self._find(prefix) is not None

    def _find(self, s):
        node = self.root
        for c in s:
            if c not in node.children:
                return None
            node = node.children[c]
        return node
```

**TC:** `O(L) per operation, L = word length` **SC:** `O(total chars)`

**Practice:** `Implement Trie` • `Design Add and Search Words DS` • `Word Search II (Trie + DFS on board)` • `Replace Words` • `Longest Word in Dictionary`

---


## 🕸️ 11. Graphs

### BFS (Breadth-First Search)

**When to use:** Shortest path in unweighted graph, level-by-level exploration, multi-source BFS.

```python
from collections import deque
def bfs(graph, start):
    visited = {start}
    q = deque([start])
    dist = {start: 0}
    while q:
        node = q.popleft()
        for nei in graph[node]:
            if nei not in visited:
                visited.add(nei)
                dist[nei] = dist[node] + 1
                q.append(nei)
    return dist

# Multi-source BFS (e.g., rotten oranges)
q = deque()
for r in range(R):
    for c in range(C):
        if grid[r][c] == 2:
            q.append((r, c, 0))
```

**TC:** `O(V + E)` **SC:** `O(V)`

**Practice:** `Number of Islands (BFS)` • `Rotting Oranges` • `Shortest Path in Binary Matrix` • `Word Ladder` • `01 Matrix (multi-source BFS)`

---

### DFS (Depth-First Search) on Graphs

**When to use:** Connected components, cycle detection, path existence, flood fill.

```python
# Iterative DFS
def dfs(graph, start):
    visited = set()
    stack = [start]
    while stack:
        node = stack.pop()
        if node in visited: continue
        visited.add(node)
        for nei in graph[node]:
            if nei not in visited:
                stack.append(nei)

# DFS on grid
def flood_fill(grid, r, c, color):
    orig = grid[r][c]
    def dfs(r, c):
        if (r<0 or r>=len(grid) or c<0 or
            c>=len(grid[0]) or grid[r][c]!=orig):
            return
        grid[r][c] = color
        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
            dfs(r+dr, c+dc)
    dfs(r, c)
```

**TC:** `O(V + E)` **SC:** `O(V)`

**Practice:** `Number of Islands` • `Clone Graph` • `Pacific Atlantic Water Flow` • `Surrounded Regions` • `Course Schedule (cycle detection)`

---

### Topological Sort (Kahn's BFS + DFS)

**When to use:** Task scheduling with dependencies, course prerequisites, build order.

```python
# Kahn's algorithm (BFS)
from collections import deque, defaultdict
def topo_sort_bfs(n, edges):
    graph = defaultdict(list)
    indeg = [0] * n
    for u, v in edges:
        graph[u].append(v)
        indeg[v] += 1
    q = deque(i for i in range(n) if indeg[i]==0)
    order = []
    while q:
        node = q.popleft()
        order.append(node)
        for nei in graph[node]:
            indeg[nei] -= 1
            if indeg[nei] == 0:
                q.append(nei)
    return order if len(order)==n else []  # [] = cycle

# DFS-based topological sort
def topo_sort_dfs(n, edges):
    graph = defaultdict(list)
    for u, v in edges: graph[u].append(v)
    WHITE, GRAY, BLACK = 0, 1, 2
    color = [WHITE] * n
    order = []
    def dfs(u):
        color[u] = GRAY
        for v in graph[u]:
            if color[v]==GRAY: return False  # cycle
            if color[v]==WHITE and not dfs(v): return False
        color[u] = BLACK
        order.append(u)
        return True
    for i in range(n):
        if color[i]==WHITE and not dfs(i): return []
    return order[::-1]
```

**TC:** `O(V + E)` **SC:** `O(V + E)`

**Practice:** `Course Schedule` • `Course Schedule II` • `Alien Dictionary` • `Parallel Courses` • `Longest Path in DAG`

---

### Union-Find / Disjoint Set Union (DSU)

**When to use:** Dynamic connectivity, connected components, cycle detection in undirected, MST (Kruskal).

```python
class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.components = n
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py: return False
        if self.rank[px] < self.rank[py]: px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        self.components -= 1
        return True
```

**TC:** `O(alpha(n)) per op ~ O(1) amortized` **SC:** `O(n)`

**Practice:** `Number of Connected Components` • `Redundant Connection` • `Accounts Merge` • `Number of Islands (DSU approach)` • `Longest Consecutive Sequence (DSU)`

---


## 🗺️ 12. Advanced Graphs

### Dijkstra's Algorithm

**When to use:** Shortest path in weighted graph with NON-NEGATIVE edges.

```python
import heapq
from collections import defaultdict
def dijkstra(graph, src, n):
    dist = [float('inf')] * n
    dist[src] = 0
    heap = [(0, src)]
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]: continue
        for v, w in graph[u]:
            nd = d + w
            if nd < dist[v]:
                dist[v] = nd
                heapq.heappush(heap, (nd, v))
    return dist
```

**TC:** `O((V + E) log V) with min-heap` **SC:** `O(V + E)`  
**Note:** Cannot handle negative edges. Use Bellman-Ford instead.

**Practice:** `Network Delay Time` • `Cheapest Flights Within K Stops (modified Dijkstra)` • `Path with Maximum Probability` • `Swim in Rising Water` • `Shortest Path in Grid with Obstacles`

---

### Bellman-Ford Algorithm

**When to use:** Shortest path with negative edges; detect negative cycles; at most K edges.

```python
def bellman_ford(n, edges, src):
    dist = [float('inf')] * n
    dist[src] = 0
    for _ in range(n - 1):        # relax n-1 times
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u]+w < dist[v]:
                dist[v] = dist[u] + w
    # Check negative cycle
    for u, v, w in edges:
        if dist[u] != float('inf') and dist[u]+w < dist[v]:
            return None  # negative cycle
    return dist

# Cheapest Flights Within K Stops
def cheapest_k_stops(n, flights, src, dst, k):
    dist = [float('inf')] * n
    dist[src] = 0
    for _ in range(k + 1):
        tmp = dist[:]
        for u, v, w in flights:
            if dist[u]+w < tmp[v]:
                tmp[v] = dist[u]+w
        dist = tmp
    return dist[dst] if dist[dst]!=float('inf') else -1
```

**TC:** `O(V * E)` **SC:** `O(V)`  
**Note:** K-stops variant: relax exactly K+1 times using copy of dist[].

**Practice:** `Cheapest Flights Within K Stops` • `Network Delay Time (alt approach)` • `Negative Weight Cycle Detection`

---

### SPFA (Shortest Path Faster Algorithm)

**When to use:** Optimized Bellman-Ford using queue; works with negative edges.

```python
from collections import deque, defaultdict
def spfa(graph, src, n):
    dist = [float('inf')] * n
    dist[src] = 0
    in_queue = [False] * n
    q = deque([src])
    in_queue[src] = True
    count = [0] * n  # negative cycle detection
    while q:
        u = q.popleft()
        in_queue[u] = False
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                count[v] = count[u] + 1
                if count[v] >= n:
                    return None  # negative cycle
                if not in_queue[v]:
                    q.append(v)
                    in_queue[v] = True
    return dist
```

**TC:** `O(V * E) worst case, O(E) average` **SC:** `O(V + E)`  
**Note:** Average case much faster than Bellman-Ford, but worst case same.

**Practice:** `Cheapest Flights Within K Stops (SPFA variant)` • `Network Delay Time`

---

### Kruskal's Algorithm (MST)

**When to use:** Minimum spanning tree; uses DSU + sorted edges.

```python
def kruskal(n, edges):
    # edges = [(w, u, v), ...]
    edges.sort()
    dsu = DSU(n)  # use DSU class from above
    mst_cost = 0
    mst_edges = []
    for w, u, v in edges:
        if dsu.union(u, v):
            mst_cost += w
            mst_edges.append((u, v, w))
            if len(mst_edges) == n - 1:
                break
    return mst_cost
```

**TC:** `O(E log E)` **SC:** `O(V + E)`

**Practice:** `Min Cost to Connect All Points` • `Connecting Cities With Minimum Cost`

---

### Prim's Algorithm (MST)

**When to use:** MST from adjacency list; good for dense graphs.

```python
import heapq
def prim(graph, n):
    visited = [False] * n
    heap = [(0, 0)]  # (cost, node)
    mst_cost = 0
    while heap:
        cost, u = heapq.heappop(heap)
        if visited[u]: continue
        visited[u] = True
        mst_cost += cost
        for v, w in graph[u]:
            if not visited[v]:
                heapq.heappush(heap, (w, v))
    return mst_cost
```

**TC:** `O((V + E) log V)` **SC:** `O(V + E)`

**Practice:** `Min Cost to Connect All Points (Prim's approach)` • `Minimum Spanning Tree problems`

---

### Floyd-Warshall (All-Pairs Shortest Path)

**When to use:** All pairs shortest path; small V; detect negative cycles.

```python
def floyd_warshall(n, edges):
    INF = float('inf')
    dist = [[INF]*n for _ in range(n)]
    for i in range(n): dist[i][i] = 0
    for u, v, w in edges:
        dist[u][v] = w
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k]+dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k]+dist[k][j]
    return dist
```

**TC:** `O(V^3)` **SC:** `O(V^2)`

**Practice:** `Shortest Path Visiting All Nodes` • `Find the City With Smallest Number of Neighbors` • `Course Schedule IV (reachability)`

---


## 📈 13. 1-D Dynamic Programming

### Fibonacci / Climbing Stairs Pattern

**When to use:** Current state depends on 1-2 previous states; ways to reach step n.

```python
# Space-optimised Fibonacci pattern
def climb_stairs(n):
    a, b = 1, 1
    for _ in range(n - 1):
        a, b = b, a + b
    return b
```

**TC:** `O(n)` **SC:** `O(1)`

**Practice:** `Climbing Stairs` • `House Robber` • `Min Cost Climbing Stairs` • `Decode Ways` • `Tribonacci Number`

---

### House Robber Pattern (Non-Adjacent Selection)

**When to use:** Max sum of non-adjacent elements; circular variant.

```python
def rob(nums):
    prev2, prev1 = 0, 0
    for x in nums:
        prev2, prev1 = prev1, max(prev1, prev2 + x)
    return prev1

# Circular: rob(nums[1:]) vs rob(nums[:-1])
def rob_circular(nums):
    if len(nums) == 1: return nums[0]
    return max(rob(nums[1:]), rob(nums[:-1]))
```

**TC:** `O(n)` **SC:** `O(1)`

**Practice:** `House Robber` • `House Robber II (circular)` • `Delete and Earn` • `Paint House`

---

### Longest Increasing Subsequence (LIS)

**When to use:** LIS, longest chain, patience sorting, Russian doll envelopes.

```python
# O(n^2) DP
def lis_dp(nums):
    dp = [1] * len(nums)
    for i in range(1, len(nums)):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j]+1)
    return max(dp)

# O(n log n) with binary search (patience sort)
import bisect
def lis_fast(nums):
    tails = []
    for x in nums:
        pos = bisect.bisect_left(tails, x)
        if pos == len(tails):
            tails.append(x)
        else:
            tails[pos] = x
    return len(tails)
```

**TC:** `O(n log n) optimal, O(n^2) basic` **SC:** `O(n)`

**Practice:** `Longest Increasing Subsequence` • `Russian Doll Envelopes` • `Maximum Length of Pair Chain` • `Number of LIS`

---

### Coin Change / Unbounded Knapsack

**When to use:** Min coins to make amount, number of ways, items can be reused.

```python
def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a-c] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1

# Count ways (order matters = permutation)
def combo_sum_ways(nums, target):
    dp = [0] * (target + 1)
    dp[0] = 1
    for a in range(1, target+1):
        for n in nums:
            if n <= a: dp[a] += dp[a-n]
    return dp[target]
```

**TC:** `O(amount * len(coins))` **SC:** `O(amount)`

**Practice:** `Coin Change` • `Coin Change II (ways)` • `Combination Sum IV` • `Perfect Squares` • `Minimum Cost For Tickets`

---

### Word Break

**When to use:** Can string be segmented into dictionary words.

```python
def word_break(s, word_dict):
    words = set(word_dict)
    dp = [False] * (len(s) + 1)
    dp[0] = True
    for i in range(1, len(s)+1):
        for j in range(i):
            if dp[j] and s[j:i] in words:
                dp[i] = True
                break
    return dp[-1]
```

**TC:** `O(n^2 * m)  n=len(s), m=avg word len` **SC:** `O(n)`

**Practice:** `Word Break` • `Word Break II (backtrack+memo)` • `Palindrome Partitioning II`

---


## 🧮 14. 2-D Dynamic Programming

### Grid Paths (Unique Paths, Min Path Sum)

**When to use:** Count paths or min cost in grid; move right/down only.

```python
def unique_paths(m, n):
    dp = [1] * n
    for _ in range(1, m):
        for j in range(1, n):
            dp[j] += dp[j-1]
    return dp[-1]

def min_path_sum(grid):
    m, n = len(grid), len(grid[0])
    for i in range(m):
        for j in range(n):
            if i==0 and j==0: continue
            elif i==0: grid[i][j] += grid[i][j-1]
            elif j==0: grid[i][j] += grid[i-1][j]
            else: grid[i][j] += min(grid[i-1][j],grid[i][j-1])
    return grid[-1][-1]
```

**TC:** `O(m * n)` **SC:** `O(n) optimised`

**Practice:** `Unique Paths` • `Unique Paths II (obstacles)` • `Minimum Path Sum` • `Triangle` • `Dungeon Game`

---

### Longest Common Subsequence (LCS)

**When to use:** LCS, edit distance, string interleaving.

```python
def lcs(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(1, m+1):
        for j in range(1, n+1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]
```

**TC:** `O(m * n)` **SC:** `O(m * n), O(n) with rolling`

**Practice:** `Longest Common Subsequence` • `Edit Distance` • `Distinct Subsequences` • `Shortest Common Supersequence` • `Interleaving String`

---

### Edit Distance (Levenshtein)

**When to use:** Min operations (insert, delete, replace) to convert one string to another.

```python
def edit_distance(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(m+1): dp[i][0] = i
    for j in range(n+1): dp[0][j] = j
    for i in range(1, m+1):
        for j in range(1, n+1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j],   # delete
                                   dp[i][j-1],   # insert
                                   dp[i-1][j-1]) # replace
    return dp[m][n]
```

**TC:** `O(m * n)` **SC:** `O(m * n)`

**Practice:** `Edit Distance` • `One Edit Distance` • `Delete Operation for Two Strings`

---

### 0/1 Knapsack

**When to use:** Select items (each used once) to max value within capacity.

```python
def knapsack_01(weights, values, W):
    n = len(weights)
    dp = [0] * (W + 1)
    for i in range(n):
        for w in range(W, weights[i]-1, -1):  # reverse!
            dp[w] = max(dp[w], dp[w-weights[i]] + values[i])
    return dp[W]
```

**TC:** `O(n * W)` **SC:** `O(W)`

**Practice:** `Partition Equal Subset Sum (target=sum/2)` • `Target Sum` • `Last Stone Weight II` • `Ones and Zeroes`

---

### Longest Palindromic Subsequence / Substring

**When to use:** Palindrome-related DP on strings.

```python
# Longest palindromic substring (expand around center)
def longest_palindrome(s):
    def expand(l, r):
        while l>=0 and r<len(s) and s[l]==s[r]:
            l -= 1; r += 1
        return s[l+1:r]
    best = ""
    for i in range(len(s)):
        odd  = expand(i, i)
        even = expand(i, i+1)
        best = max(best, odd, even, key=len)
    return best

# Longest palindromic subsequence (DP)
def lps(s):
    n = len(s)
    dp = [[0]*n for _ in range(n)]
    for i in range(n): dp[i][i] = 1
    for l in range(2, n+1):
        for i in range(n-l+1):
            j = i + l - 1
            if s[i] == s[j]:
                dp[i][j] = dp[i+1][j-1] + 2
            else:
                dp[i][j] = max(dp[i+1][j], dp[i][j-1])
    return dp[0][n-1]
```

**TC:** `O(n^2)` **SC:** `O(n^2) or O(n) for substring`

**Practice:** `Longest Palindromic Substring` • `Longest Palindromic Subsequence` • `Palindromic Substrings (count)` • `Minimum Insertions to Make Palindrome`

---


## 💰 15. Greedy

### Jump Game / Reachability Greedy

**When to use:** Can you reach end? Min jumps to reach end? Furthest reachable.

```python
# Jump Game I: can reach end?
def can_jump(nums):
    reach = 0
    for i, x in enumerate(nums):
        if i > reach: return False
        reach = max(reach, i + x)
    return True

# Jump Game II: min jumps
def min_jumps(nums):
    jumps = cur_end = farthest = 0
    for i in range(len(nums) - 1):
        farthest = max(farthest, i + nums[i])
        if i == cur_end:
            jumps += 1
            cur_end = farthest
    return jumps
```

**TC:** `O(n)` **SC:** `O(1)`

**Practice:** `Jump Game` • `Jump Game II` • `Video Stitching`

---

### Activity Selection / Interval Scheduling Maximization

**When to use:** Max non-overlapping intervals; sort by end time.

```python
def max_non_overlapping(intervals):
    intervals.sort(key=lambda x: x[1])  # sort by end
    count, end = 0, float('-inf')
    for s, e in intervals:
        if s >= end:
            count += 1
            end = e
    return count
```

**TC:** `O(n log n)` **SC:** `O(1)`

**Practice:** `Non-overlapping Intervals (min removals = n - max_non_overlap)` • `Minimum Number of Arrows to Burst Balloons` • `Meeting Rooms`

---

### Gas Station (Circular Greedy)

**When to use:** Can complete circular route? Find unique starting station.

```python
def can_complete_circuit(gas, cost):
    if sum(gas) < sum(cost): return -1
    tank = start = 0
    for i in range(len(gas)):
        tank += gas[i] - cost[i]
        if tank < 0:
            tank = 0
            start = i + 1
    return start
```

**TC:** `O(n)` **SC:** `O(1)`

**Practice:** `Gas Station` • `Candy (two-pass greedy)` • `Task Scheduler`

---

### Task Scheduler / Greedy Frequency

**When to use:** Schedule tasks with cooldown; max-frequency determines idle slots.

```python
from collections import Counter
def least_interval(tasks, n):
    freq = Counter(tasks)
    max_f = max(freq.values())
    max_count = sum(1 for f in freq.values() if f == max_f)
    return max(len(tasks), (max_f-1)*(n+1) + max_count)
```

**TC:** `O(n)` **SC:** `O(1) (26 letters)`

**Practice:** `Task Scheduler` • `Reorganize String` • `Rearrange String k Distance Apart`

---


## 📐 16. Intervals

### Merge Intervals

**When to use:** Merge all overlapping intervals.

```python
def merge(intervals):
    intervals.sort()
    res = [intervals[0]]
    for s, e in intervals[1:]:
        if s <= res[-1][1]:
            res[-1][1] = max(res[-1][1], e)
        else:
            res.append([s, e])
    return res
```

**TC:** `O(n log n)` **SC:** `O(n)`

**Practice:** `Merge Intervals` • `Meeting Rooms II` • `Employee Free Time`

---

### Insert Interval

**When to use:** Insert a new interval into sorted non-overlapping list and merge.

```python
def insert(intervals, new):
    res = []
    for i, (s, e) in enumerate(intervals):
        if e < new[0]:
            res.append([s, e])
        elif s > new[1]:
            res.append(new)
            return res + intervals[i:]
        else:
            new = [min(s,new[0]), max(e,new[1])]
    res.append(new)
    return res
```

**TC:** `O(n)` **SC:** `O(n)`

**Practice:** `Insert Interval`

---

### Meeting Rooms (Sweep Line / Min-Heap)

**When to use:** Min rooms needed, max overlapping intervals, event scheduling.

```python
# Sweep line approach
def min_meeting_rooms(intervals):
    events = []
    for s, e in intervals:
        events.append((s, 1))   # start
        events.append((e, -1))  # end
    events.sort()
    rooms = max_rooms = 0
    for _, delta in events:
        rooms += delta
        max_rooms = max(max_rooms, rooms)
    return max_rooms

# Min-heap approach
import heapq
def min_rooms_heap(intervals):
    intervals.sort()
    heap = []  # end times
    for s, e in intervals:
        if heap and heap[0] <= s:
            heapq.heapreplace(heap, e)
        else:
            heapq.heappush(heap, e)
    return len(heap)
```

**TC:** `O(n log n)` **SC:** `O(n)`

**Practice:** `Meeting Rooms` • `Meeting Rooms II` • `My Calendar I/II/III` • `Car Pooling`

---


## 📏 17. Math & Geometry

### GCD / LCM (Euclidean Algorithm)

**When to use:** Greatest common divisor, least common multiple, fraction simplification.

```python
import math
# math.gcd(a, b) built-in
def gcd(a, b):
    while b: a, b = b, a % b
    return a
def lcm(a, b):
    return a * b // gcd(a, b)
```

**TC:** `O(log(min(a,b)))` **SC:** `O(1)`

**Practice:** `Greatest Common Divisor of Strings` • `Water and Jug Problem`

---

### Sieve of Eratosthenes

**When to use:** Find all primes up to n.

```python
def sieve(n):
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    for i in range(2, int(n**0.5) + 1):
        if is_prime[i]:
            for j in range(i*i, n+1, i):
                is_prime[j] = False
    return [i for i in range(n+1) if is_prime[i]]
```

**TC:** `O(n log log n)` **SC:** `O(n)`

**Practice:** `Count Primes` • `Ugly Number II`

---

### Fast Exponentiation (Binary Exponentiation)

**When to use:** Compute a^b mod m efficiently.

```python
def power(a, b, mod):
    result = 1
    a %= mod
    while b > 0:
        if b & 1: result = result * a % mod
        a = a * a % mod
        b >>= 1
    return result
# Python built-in: pow(a, b, mod)
```

**TC:** `O(log b)` **SC:** `O(1)`

**Practice:** `Pow(x, n)` • `Super Pow`

---

### Matrix Rotation / Spiral Order

**When to use:** Rotate image 90 degrees, spiral traversal of matrix.

```python
# Rotate 90 clockwise: transpose + reverse rows
def rotate(matrix):
    n = len(matrix)
    for i in range(n):
        for j in range(i+1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    for row in matrix:
        row.reverse()

# Spiral order
def spiral(matrix):
    res = []
    while matrix:
        res += matrix.pop(0)             # top row
        if matrix and matrix[0]:
            for row in matrix: res.append(row.pop())  # right col
        if matrix: res += matrix.pop()[::-1]          # bottom row
        if matrix and matrix[0]:
            for row in matrix[::-1]: res.append(row.pop(0))  # left col
    return res
```

**TC:** `O(m * n)` **SC:** `O(1) rotation, O(m*n) spiral output`

**Practice:** `Rotate Image` • `Spiral Matrix` • `Spiral Matrix II` • `Set Matrix Zeroes`

---

### Reservoir Sampling & Fisher-Yates Shuffle

**When to use:** Random sampling from stream; uniform random shuffle of array.

```python
import random
# Reservoir sampling: pick 1 from stream of unknown size
def reservoir_sample(stream):
    result = None
    for i, item in enumerate(stream):
        if random.randint(0, i) == 0:
            result = item
    return result

# Fisher-Yates shuffle
def shuffle(nums):
    for i in range(len(nums)-1, 0, -1):
        j = random.randint(0, i)
        nums[i], nums[j] = nums[j], nums[i]
```

**TC:** `O(n)` **SC:** `O(1)`

**Practice:** `Shuffle an Array` • `Linked List Random Node` • `Random Pick Index`

---


## 🔧 18. Bit Manipulation

### XOR Properties & Single Number

**When to use:** Find unique element, missing number, XOR tricks.

```python
# a ^ a = 0,  a ^ 0 = a
def single_number(nums):
    res = 0
    for x in nums:
        res ^= x
    return res

# Missing number: XOR [0..n] with all nums
def missing(nums):
    res = len(nums)
    for i, x in enumerate(nums):
        res ^= i ^ x
    return res
```

**TC:** `O(n)` **SC:** `O(1)`

**Practice:** `Single Number` • `Single Number II (bit counting)` • `Single Number III (XOR + partition)` • `Missing Number`

---

### Brian Kernighan's — Count Set Bits

**When to use:** Count number of 1-bits; check power of 2.

```python
def count_bits(n):
    count = 0
    while n:
        n &= n - 1  # clears lowest set bit
        count += 1
    return count

def is_power_of_two(n):
    return n > 0 and (n & (n-1)) == 0

# Counting bits for 0..n
def count_bits_range(n):
    dp = [0] * (n + 1)
    for i in range(1, n+1):
        dp[i] = dp[i & (i-1)] + 1
    return dp
```

**TC:** `O(k) k = set bits, O(n) for range` **SC:** `O(1) or O(n)`

**Practice:** `Number of 1 Bits` • `Counting Bits` • `Power of Two` • `Reverse Bits`

---

### Bit Masking (Subset Enumeration / State DP)

**When to use:** Enumerate subsets, state compression DP (TSP, assignment).

```python
# Enumerate all subsets of a set of size n
n = len(items)
for mask in range(1 << n):
    subset = [items[i] for i in range(n) if mask & (1<<i)]

# Enumerate submasks of a given mask
sub = mask
while sub:
    # process sub
    sub = (sub - 1) & mask

# TSP-like DP with bitmask
# dp[mask][i] = min cost to visit set 'mask' ending at i
INF = float('inf')
dp = [[INF]*(n) for _ in range(1<<n)]
dp[1][0] = 0
for mask in range(1<<n):
    for u in range(n):
        if not (mask & (1<<u)): continue
        for v in range(n):
            if mask & (1<<v): continue
            new_mask = mask | (1<<v)
            dp[new_mask][v] = min(dp[new_mask][v],
                                  dp[mask][u] + dist[u][v])
```

**TC:** `O(2^n * n) for subset enum / bitmask DP` **SC:** `O(2^n * n)`

**Practice:** `Subsets (bit approach)` • `Partition to K Equal Subsets` • `Shortest Path Visiting All Nodes` • `Stickers to Spell Word`

---


## 📊 Quick Reference — Complexity At a Glance

| Algorithm / Technique | Time | Space |
|---|---|---|
| HashMap / HashSet | `O(n)` | `O(n)` |
| Prefix Sum | `O(n) build, O(1) query` | `O(n)` |
| Kadane's Algorithm | `O(n)` | `O(1)` |
| Boyer-Moore Voting Algorithm | `O(n)` | `O(1)` |
| Dutch National Flag / 3-Way Partition | `O(n)` | `O(1)` |
| Bucket Sort / Counting Sort | `O(n)` | `O(n)` |
| Opposite-Direction Two Pointers | `O(n)` | `O(1)` |
| Three Sum / K-Sum Pattern | `O(n^2)  [O(n^(k-1)) for k-sum]` | `O(1) excl. output` |
| Same-Direction (Fast-Slow / Read-Write) | `O(n)` | `O(1)` |
| Fixed-Size Sliding Window | `O(n)` | `O(1)` |
| Variable-Size Sliding Window (Expand / Shrink) | `O(n) amortized (each elem enters/leaves once)` | `O(k) for freq map` |
| Sliding Window + Monotonic Deque | `O(n)` | `O(k)` |
| Matching Parentheses / Bracket Validation | `O(n)` | `O(n)` |
| Monotonic Stack (Next Greater / Smaller) | `O(n) — each element pushed/popped once` | `O(n)` |
| Min Stack / Max Stack | `O(1) all ops` | `O(n)` |
| Expression Evaluation / RPN | `O(n)` | `O(n)` |
| Standard Binary Search | `O(log n)` | `O(1)` |
| Binary Search on Rotated Array | `O(log n)` | `O(1)` |
| Binary Search on Answer (Parametric Search) | `O(n log S)  S = search space` | `O(1)` |
| Reverse Linked List (Iterative & Recursive) | `O(n)` | `O(1)` |
| Fast & Slow Pointers (Floyd's Tortoise & Hare) | `O(n)` | `O(1)` |
| Dummy Head + Merge Pattern | `O(n) or O(n+m)` | `O(1)` |
| DFS Traversals (Pre / In / Post Order) | `O(n)` | `O(h) — h = height` |
| BFS / Level Order Traversal | `O(n)` | `O(w) — w = max width` |
| BST Operations & Validation | `O(h) search/insert, O(n) validate/kth` | `O(h)` |
| Lowest Common Ancestor (LCA) | `O(n)` | `O(h)` |
| Tree Construction from Traversals | `O(n) with hashmap` | `O(n)` |
| Min-Heap / Max-Heap | `O(n log k) for top-K` | `O(k)` |
| Two Heaps | `O(log n) add, O(1) find` | `O(n)` |
| Merge K Sorted (Heap) | `O(N log K) — N total elements, K lists` | `O(K)` |
| Subsets / Combinations / Permutations Template | `O(2^n) subsets, O(n!) perms, O(C(n,k)) combos` | `O(n) recursion depth` |
| Constraint-Based Backtracking (N-Queens, Sudoku) | `O(n!) with pruning` | `O(n^2)` |
| Trie (Prefix Tree) | `O(L) per operation, L = word length` | `O(total chars)` |
| BFS (Breadth-First Search) | `O(V + E)` | `O(V)` |
| DFS (Depth-First Search) on Graphs | `O(V + E)` | `O(V)` |
| Topological Sort (Kahn's BFS + DFS) | `O(V + E)` | `O(V + E)` |
| Union-Find / Disjoint Set Union (DSU) | `O(alpha(n)) per op ~ O(1) amortized` | `O(n)` |
| Dijkstra's Algorithm | `O((V + E) log V) with min-heap` | `O(V + E)` |
| Bellman-Ford Algorithm | `O(V * E)` | `O(V)` |
| SPFA (Shortest Path Faster Algorithm) | `O(V * E) worst case, O(E) average` | `O(V + E)` |
| Kruskal's Algorithm (MST) | `O(E log E)` | `O(V + E)` |
| Prim's Algorithm (MST) | `O((V + E) log V)` | `O(V + E)` |
| Floyd-Warshall (All-Pairs Shortest Path) | `O(V^3)` | `O(V^2)` |
| Fibonacci / Climbing Stairs Pattern | `O(n)` | `O(1)` |
| House Robber Pattern (Non-Adjacent Selection) | `O(n)` | `O(1)` |
| Longest Increasing Subsequence (LIS) | `O(n log n) optimal, O(n^2) basic` | `O(n)` |
| Coin Change / Unbounded Knapsack | `O(amount * len(coins))` | `O(amount)` |
| Word Break | `O(n^2 * m)  n=len(s), m=avg word len` | `O(n)` |
| Grid Paths (Unique Paths, Min Path Sum) | `O(m * n)` | `O(n) optimised` |
| Longest Common Subsequence (LCS) | `O(m * n)` | `O(m * n), O(n) with rolling` |
| Edit Distance (Levenshtein) | `O(m * n)` | `O(m * n)` |
| 0/1 Knapsack | `O(n * W)` | `O(W)` |
| Longest Palindromic Subsequence / Substring | `O(n^2)` | `O(n^2) or O(n) for substring` |
| Jump Game / Reachability Greedy | `O(n)` | `O(1)` |
| Activity Selection / Interval Scheduling Maximizat | `O(n log n)` | `O(1)` |
| Gas Station (Circular Greedy) | `O(n)` | `O(1)` |
| Task Scheduler / Greedy Frequency | `O(n)` | `O(1) (26 letters)` |
| Merge Intervals | `O(n log n)` | `O(n)` |
| Insert Interval | `O(n)` | `O(n)` |
| Meeting Rooms (Sweep Line / Min-Heap) | `O(n log n)` | `O(n)` |
| GCD / LCM (Euclidean Algorithm) | `O(log(min(a,b)))` | `O(1)` |
| Sieve of Eratosthenes | `O(n log log n)` | `O(n)` |
| Fast Exponentiation (Binary Exponentiation) | `O(log b)` | `O(1)` |
| Matrix Rotation / Spiral Order | `O(m * n)` | `O(1) rotation, O(m*n) spiral output` |
| Reservoir Sampling & Fisher-Yates Shuffle | `O(n)` | `O(1)` |
| XOR Properties & Single Number | `O(n)` | `O(1)` |
| Brian Kernighan's | `O(k) k = set bits, O(n) for range` | `O(1) or O(n)` |
| Bit Masking (Subset Enumeration / State DP) | `O(2^n * n) for subset enum / bitmask DP` | `O(2^n * n)` |
