# LeetCode Coding Patterns Cheat Sheet (Java)

## Sliding Window

**When to Use It:**
- Use for problems involving contiguous subarrays or substrings, especially to find an optimal (longest, shortest, or target-sum) sub-sequence in an array or string.
- Applicable when the problem asks for a subarray/substring meeting a certain condition (e.g., sum, average, or containing certain elements) and brute force involves checking overlapping subarrays.

**Why to Use It:**
- Reduces time complexity by avoiding re-processing of the array for each subwindow.
- Maintains a "window" and slides it through the data, updating state (e.g., sum or counts) in O(1) time.
- Turns nested-loop problems into single-loop solutions by expanding or shrinking the window based on conditions, often achieving O(n) for array/string traversal.

**Example Code (Java):**
Using a dynamic sliding window to find the smallest subarray with sum ≥ S:
```java
int windowSum = 0, windowStart = 0;
int minLength = Integer.MAX_VALUE;
for (int windowEnd = 0; windowEnd < arr.length; windowEnd++) {
    windowSum += arr[windowEnd]; // expand the window by adding the next element
    while (windowSum >= S) { // shrink window as long as the condition is met
        minLength = Math.min(minLength, windowEnd - windowStart + 1);
        windowSum -= arr[windowStart]; // remove the element going out of the window
        windowStart++;
    }
}
```

**Sample LeetCode Problems:**
- Longest Substring Without Repeating Characters
- Minimum Window Substring
- Sliding Window Maximum
- Longest Substring with At Most K Distinct Characters
- Fruit Into Baskets (Longest Subarray with 2 Distinct Characters)
- Find All Anagrams in a String
- Permutation in String
- Minimum Size Subarray Sum
- Max Consecutive Ones III
- Longest Repeating Character Replacement

## Two Pointers

**When to Use It:**
- Use for array or string problems requiring comparison or finding pairs of elements.
- Common in sorted arrays (e.g., find two numbers adding to a target) or partitioning tasks (e.g., moving elements, skipping values).
- Effective when one pointer starts at the beginning and another at the end, or one slow and one fast pointer.

**Why to Use It:**
- Eliminates nested loops by leveraging sorted order or linear structure, achieving O(n) time.
- Useful for in-place transformations (e.g., removing duplicates or moving zeros) by building results while scanning.

**Example Code (Java):**
Finding two numbers in a sorted array that add up to a target:
```java
int left = 0, right = arr.length - 1;
while (left < right) {
    int sum = arr[left] + arr[right];
    if (sum == target) {
        // found the pair (left, right)
        break;
    } else if (sum < target) {
        left++; // need a larger sum
    } else {
        right--; // need a smaller sum
    }
}
```

**Sample LeetCode Problems:**
- Two Sum II - Input Array Is Sorted
- 3Sum
- 4Sum
- Container With Most Water
- Trapping Rain Water
- Remove Duplicates from Sorted Array
- Remove Element (in-place removal)
- Move Zeroes (in-place move)
- Valid Palindrome (check from both ends)
- Squares of a Sorted Array

## Fast & Slow Pointers (Tortoise and Hare)

**When to Use It:**
- Use for linked lists or cyclic sequences to detect cycles or find specific nodes (e.g., cycle detection, finding the middle).
- Applicable to numeric problems forming sequences (e.g., Happy Number) or circular array detection.

**Why to Use It:**
- Fast pointer (2x speed) and slow pointer (1x speed) meet if there’s a cycle, providing O(n) cycle detection without extra space.
- Useful for finding mid-points or intersection points efficiently.

**Example Code (Java):**
Detecting a cycle in a linked list and finding the start:
```java
ListNode slow = head, fast = head;
// Phase 1: Detect cycle
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow == fast) { // cycle detected
        break;
    }
}
if (fast != null && fast.next != null) {
    slow = head;
    while (slow != fast) { // Phase 2: find cycle start
        slow = slow.next;
        fast = fast.next;
    }
    // slow (or fast) now points to the start of the cycle
}
```

**Sample LeetCode Problems:**
- Linked List Cycle
- Linked List Cycle II (Start of cycle)
- Happy Number (cycle detection in number sequence)
- Find the Duplicate Number (cycle detection in array mapping)
- Middle of the Linked List
- Palindrome Linked List (find middle, then reverse second half)
- Reorder List (find middle, then rearrange using reversed second half)
- Circular Array Loop (cycle detection in an array by index hopping)
- Intersection of Two Linked Lists
- Remove Nth Node From End of List

## Merge Intervals (Overlapping Intervals)

**When to Use It:**
- Use for problems involving intervals (ranges with start and end), such as merging overlaps, inserting intervals, or finding gaps/overlaps in schedules.

**Why to Use It:**
- Sorting intervals by start time and merging overlaps is efficient (O(n log n) for sorting, O(n) for scanning).
- Simplifies complex overlap logic into a single-pass merge.

**Example Code (Java):**
Merging overlapping intervals:
```java
Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
List<int[]> merged = new ArrayList<>();
for (int[] interval : intervals) {
    if (merged.isEmpty() || merged.get(merged.size()-1)[1] < interval[0]) {
        merged.add(interval); // no overlap
    } else {
        // overlap detected, merge with the last interval
        merged.get(merged.size()-1)[1] = Math.max(merged.get(merged.size()-1)[1], interval[1]);
    }
}
// merged list contains the merged intervals
```

**Sample LeetCode Problems:**
- Merge Intervals
- Insert Interval
- Non-overlapping Intervals
- Meeting Rooms
- Meeting Rooms II
- Interval List Intersections
- Minimum Number of Arrows to Burst Balloons
- Car Pooling
- Employee Free Time
- Find Right Interval

## Cyclic Sort (In-place Sorting for [1..N] Range)

**When to Use It:**
- Use for arrays of length n containing numbers from 1 to n (or 0 to n), especially to find missing or duplicate numbers.
- Ideal for O(n) time, O(1) space solutions by placing each number in its correct index.

**Why to Use It:**
- Efficiently sorts without comparisons by swapping misplaced elements to their correct positions.
- Reveals missing or duplicate numbers by checking indices after sorting.

**Example Code (Java):**
Sorting an array containing numbers 1 through N in-place:
```java
int i = 0;
while (i < arr.length) {
    int correctIdx = arr[i] - 1;
    if (arr[i] >= 1 && arr[i] <= arr.length && arr[i] != arr[correctIdx]) {
        // swap arr[i] with arr[correctIdx]
        int temp = arr[i];
        arr[i] = arr[correctIdx];
        arr[correctIdx] = temp;
    } else {
        i++;
    }
}
// After this, any index i where arr[i] != i+1 is a mis-match
```

**Sample LeetCode Problems:**
- Missing Number
- First Missing Positive
- Find All Duplicates in an Array
- Find All Numbers Disappeared in an Array
- Set Mismatch
- Find the Duplicate Number
- Kth Missing Positive Number

## In-Place Reversal of a Linked List

**When to Use It:**
- Use for reversing a linked list (entirely or partially) without extra space.
- Common in reversing sub-sections, checking palindromes, or reordering lists.

**Why to Use It:**
- Memory efficient (O(1) extra space) using pointer reassignments.
- Simplifies linked list problems with clean, in-place solutions.

**Example Code (Java):**
Reversing a linked list in-place (iterative):
```java
ListNode prev = null;
ListNode curr = head;
while (curr != null) {
    ListNode nextNode = curr.next;
    curr.next = prev; // reverse the link
    prev = curr;
    curr = nextNode;
}
// prev now points to the new head of the reversed list
```

**Sample LeetCode Problems:**
- Reverse Linked List
- Reverse Linked List II
- Reverse Nodes in k-Group
- Swap Nodes in Pairs
- Palindrome Linked List
- Reorder List
- Rotate List
- Swapping Nodes in a Linked List

## Breadth-First Search (BFS)

**When to Use It:**
- Use for tree or graph problems requiring level-by-level traversal or shortest path in unweighted graphs/grids.
- Ideal for minimum moves/steps or layer-based exploration (e.g., word ladder, rotten oranges).

**Why to Use It:**
- Guarantees shortest path in unweighted graphs by exploring level by level.
- Uses a queue for systematic breadth-wise expansion.

**Example Code (Java):**
Level-order traversal of a binary tree using BFS:
```java
Queue<TreeNode> queue = new LinkedList<>();
queue.offer(root);
while (!queue.isEmpty()) {
    TreeNode current = queue.poll();
    // process current node (e.g., add current.val to result list)
    if (current.left != null) queue.offer(current.left);
    if (current.right != null) queue.offer(current.right);
}
```

**Sample LeetCode Problems:**
- Binary Tree Level Order Traversal
- Binary Tree Zigzag Level Order Traversal
- Minimum Depth of Binary Tree
- Binary Tree Right Side View
- Rotting Oranges
- Word Ladder
- Open the Lock
- Shortest Path in Binary Matrix
- Bus Routes
- Course Schedule

## Depth-First Search (DFS)

**When to Use It:**
- Use for tree/graph traversal requiring deep exploration before backtracking.
- Ideal for finding all paths, connected components, or backtracking problems (e.g., maze, Sudoku).

**Why to Use It:**
- Uses stack (recursive or explicit) for deep exploration.
- Simplifies recursive problems and cycle detection, with memory efficiency for trees.

**Example Code (Java):**
Recursive DFS traversal on a graph:
```java
void dfs(Node node, Set<Node> visited) {
    if (visited.contains(node)) return;
    visited.add(node);
    // process node (e.g., add to result)
    for (Node neighbor : node.neighbors) {
        dfs(neighbor, visited);
    }
}
```

**Sample LeetCode Problems:**
- Binary Tree Paths
- Path Sum / Path Sum II
- Number of Islands
- Max Area of Island
- Clone Graph
- Pacific Atlantic Water Flow
- Surrounded Regions
- All Paths From Source to Target
- Course Schedule II
- Word Search

## Topological Sort (Graph Ordering)

**When to Use It:**
- Use for ordering tasks with dependencies in a Directed Acyclic Graph (DAG).
- Common in course/task scheduling or determining valid order.

**Why to Use It:**
- Provides a linear ordering respecting dependencies in O(V + E) time.
- Two methods: Kahn’s algorithm (BFS-based) or DFS-based post-order.

**Example Code (Java):**
Kahn’s algorithm for topological sort:
```java
int n = numVertices;
int[] indegree = new int[n];
List<List<Integer>> graph = new ArrayList<>();
// ... (build graph and fill indegree for each node) ...
Queue<Integer> q = new LinkedList<>();
for (int i = 0; i < n; i++) {
    if (indegree[i] == 0) q.offer(i);
}
List<Integer> topoOrder = new ArrayList<>();
while (!q.isEmpty()) {
    int u = q.poll();
    topoOrder.add(u);
    for (int v : graph.get(u)) {
        indegree[v]--;
        if (indegree[v] == 0) {
            q.offer(v);
        }
    }
}
// if topoOrder.size() < n, there was a cycle
```

**Sample LeetCode Problems:**
- Course Schedule
- Course Schedule II
- Alien Dictionary
- Sequence Reconstruction
- Minimum Height Trees
- Parallel Courses

## Backtracking (DFS with State)

**When to Use It:**
- Use for exploring all possible combinations/permutations, making decisions and undoing them (e.g., subsets, permutations, N-Queens).
- Ideal for exhaustive search with pruning of invalid paths.

**Why to Use It:**
- Systematically tries all paths, cutting off invalid ones to reduce search space.
- Straightforward for combinatorial problems, with pruning for efficiency.

**Example Code (Java):**
Backtracking to generate all subsets:
```java
void backtrack(List<Integer> templist, int start, int[] nums, List<List<Integer>> result) {
    result.add(new ArrayList<>(templist)); // record current subset
    for (int i = start; i < nums.length; i++) {
        templist.add(nums[i]); // choose element
        backtrack(templist, i + 1, nums, result); // explore
        templist.remove(templist.size() - 1); // backtrack
    }
}
```

**Sample LeetCode Problems:**
- Subsets
- Permutations
- Permutations II
- Combinations
- Combination Sum
- Combination Sum II
- N-Queens
- Sudoku Solver
- Generate Parentheses
- Palindrome Partitioning

## Dynamic Programming (DP)

**When to Use It:**
- Use for problems with overlapping subproblems and optimal substructure (e.g., Fibonacci, knapsack, edit distance).
- Common in path-finding, sequence alignment, or optimization problems.

**Why to Use It:**
- Saves computation by storing subproblem results (memoization or tabulation), turning exponential time into polynomial.
- Defines states and recurrence relations for efficient solution building.

**Example Code (Java):**
Bottom-up DP for Fibonacci (or Climbing Stairs):
```java
int fib(int n) {
    if (n < 2) return n;
    int[] dp = new int[n + 1];
    dp[0] = 0;
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}
```

**Sample LeetCode Problems:**
- Climbing Stairs
- House Robber
- Coin Change
- Longest Increasing Subsequence
- Longest Common Subsequence
- Edit Distance
- Partition Equal Subset Sum
- Unique Paths
- Longest Palindromic Substring
- Word Break

## Greedy

**When to Use It:**
- Use when local optimal choices lead to a global optimal solution (e.g., interval scheduling, coin change).
- Common in problems requiring sorting by a criterion and iterating.

**Why to Use It:**
- Simple and efficient (often O(n log n) or O(n)).
- Commits to choices without exploring all possibilities, reducing complexity.

**Example Code (Java):**
Selecting maximum non-overlapping intervals:
```java
Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
int count = 0;
int lastEnd = Integer.MIN_VALUE;
for (int[] interval : intervals) {
    if (interval[0] >= lastEnd) {
        count++;
        lastEnd = interval[1];
    }
}
```

**Sample LeetCode Problems:**
- Jump Game
- Jump Game II
- Gas Station
- Candy
- Partition Labels
- Assign Cookies
- Minimum Number of Arrows to Burst Balloons
- Non-overlapping Intervals
- Queue Reconstruction by Height
- Lemonade Change

## Binary Search

**When to Use It:**
- Use for sorted arrays or monotonic search spaces to find elements or boundaries efficiently.
- Applicable to implicit ranges or answer spaces (e.g., minimum feasible value).

**Why to Use It:**
- Reduces search space by half each step, achieving O(log n) time.
- Fundamental for divide-and-conquer and boundary-finding problems.

**Example Code (Java):**
Classic binary search on a sorted array:
```java
int binarySearch(int[] arr, int target) {
    int low = 0, high = arr.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) {
            return mid; // target found
        } else if (arr[mid] < target) {
            low = mid + 1; // target in right half
        } else {
            high = mid - 1; // target in left half
        }
    }
    return -1; // not found
}
```

**Sample LeetCode Problems:**
- Binary Search
- Search Insert Position
- First Bad Version
- Search in Rotated Sorted Array
- Find Minimum in Rotated Sorted Array
- Find Peak Element
- Find First and Last Position of Element in Sorted Array
- Find Smallest Letter Greater Than Target
- Koko Eating Bananas
- Capacity To Ship Packages Within D Days

## Trie-Based (Prefix Tree)

**When to Use It:**
- Use for string collections requiring prefix queries (e.g., autocomplete, dictionary searches, word games).
- Ideal for prefix/suffix constraints or quick lookups.

**Why to Use It:**
- Provides O(m) time for inserting/searching words (m is word length).
- Memory-efficient for shared prefixes, supports advanced operations like wildcard matching.

**Example Code (Java):**
Basic Trie implementation:
```java
class TrieNode {
    TrieNode[] children = new TrieNode[26];
    boolean isWord = false;
}
class Trie {
    TrieNode root = new TrieNode();
    void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            int idx = c - 'a';
            if (node.children[idx] == null) {
                node.children[idx] = new TrieNode();
            }
            node = node.children[idx];
        }
        node.isWord = true;
    }
    boolean search(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            int idx = c - 'a';
            if (node.children[idx] == null) return false;
            node = node.children[idx];
        }
        return node.isWord;
    }
    boolean startsWith(String prefix) {
        TrieNode node = root;
        for (char c : prefix.toCharArray()) {
            int idx = c - 'a';
            if (node.children[idx] == null) return false;
            node = node.children[idx];
        }
        return true;
    }
}
```

**Sample LeetCode Problems:**
- Implement Trie (Prefix Tree)
- Add and Search Word
- Word Search II
- Design Search Autocomplete System
- Replace Words
- Word Break II
- Word Squares
- Longest Word in Dictionary
- Map Sum Pairs
- Prefix and Suffix Search

## Union-Find (Disjoint Set Union)

**When to Use It:**
- Use for graph connectivity problems (e.g., connected components, cycle detection, grouping elements).
- Common in network connectivity, Kruskal’s MST, or social network grouping.

**Why to Use It:**
- Near O(1) (amortized) time for union/find with path compression and rank.
- Simplifies connectivity logic without repeated DFS/BFS.

**Example Code (Java):**
Union-Find with path compression:
```java
class UnionFind {
    int[] parent;
    int[] rank;
    UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            rank[i] = 0;
        }
    }
    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]); // path compression
        }
        return parent[x];
    }
    boolean union(int x, int y) {
        int rootX = find(x), rootY = find(y);
        if (rootX == rootY) return false;
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
        return true;
    }
}
```

**Sample LeetCode Problems:**
- Number of Connected Components in an Undirected Graph
- Graph Valid Tree
- Number of Provinces (Friend Circles)
- Accounts Merge
- Redundant Connection
- Satisfiability of Equality Equations
- Most Stones Removed with Same Row or Column
- Regions Cut By Slashes
- Making a Large Island
- Min Cost to Connect All Points

## Heap / Priority Queue

**When to Use It:**
- Use for retrieving/removing smallest/largest elements repeatedly (e.g., Top K, scheduling, merging sorted sequences).
- Common in streaming algorithms or Dijkstra’s shortest paths.

**Why to Use It:**
- O(log n) for insertion/removal of extreme elements.
- Simplifies “keep K largest/smallest” logic by discarding out-of-range elements.

**Example Code (Java):**
Using a min-heap to find the Kth largest element:
```java
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
for (int num : nums) {
    minHeap.offer(num);
    if (minHeap.size() > k) {
        minHeap.poll(); // remove smallest element
    }
}
// The root of the minHeap is the k-th largest element
```

**Sample LeetCode Problems:**
- Kth Largest Element in an Array
- Top K Frequent Elements
- Merge k Sorted Lists
- K Closest Points to Origin
- Kth Smallest Element in a Sorted Matrix
- Find Median from Data Stream
- Sliding Window Median
- Task Scheduler
- Smallest Range Covering Elements from K Lists
- Last Stone Weight

## Monotonic Stack / Monotonic Queue

**When to Use It:**
- Use for finding next greater/smaller elements or maintaining min/max in a sliding window.
- Common in Next Greater Element, Daily Temperatures, histogram spans.

**Why to Use It:**
- Ensures O(n) solutions by pushing/popping each element at most once.
- Maintains ordered stack/queue to avoid redundant comparisons.

**Example Code (Java):**
Next Greater Element using a decreasing stack:
```java
int n = arr.length;
int[] result = new int[n];
Stack<Integer> stack = new Stack<>();
for (int i = n - 1; i >= 0; i--) {
    while (!stack.isEmpty() && stack.peek() <= arr[i]) {
        stack.pop(); // pop smaller or equal elements
    }
    result[i] = stack.isEmpty() ? -1 : stack.peek();
    stack.push(arr[i]);
}
```

**Sample LeetCode Problems:**
- Next Greater Element I
- Next Greater Element II
- Daily Temperatures
- Asteroid Collision
- Largest Rectangle in Histogram
- Trapping Rain Water
- Sliding Window Maximum
- Min Stack
- Online Stock Span
- Sum of Subarray Minimums

## Bit Manipulation

**When to Use It:**
- Use for problems involving binary representations, bitwise operations, or set operations (e.g., toggling bits, subsets via bit masks).
- Common in checking powers of two, finding unique numbers, or optimizing space.

**Why to Use It:**
- Fast constant-time operations, packing information into integers.
- Simplifies arithmetic or set operations with bit tricks.

**Example Code (Java):**
Using a bit mask to generate all subsets:
```java
int n = nums.length;
List<List<Integer>> allSubsets = new ArrayList<>();
for (int mask = 0; mask < (1 << n); mask++) {
    List<Integer> subset = new ArrayList<>();
    for (int j = 0; j < n; j++) {
        if ((mask & (1 << j)) != 0) { // check if j-th bit is 1
            subset.add(nums[j]);
        }
    }
    allSubsets.add(subset);
}
```

**Sample LeetCode Problems:**
- Single Number
- Single Number II
- Counting Bits
- Power of Two
- Reverse Bits
- Sum of Two Integers
- Subsets
- Missing Number
- Hamming Distance
- Maximum XOR of Two Numbers in an Array

## Graph - Shortest Path (Dijkstra & Bellman-Ford)

**When to Use It:**
- Use for weighted graph problems finding minimum cost/distance.
- Dijkstra’s for non-negative weights, Bellman-Ford for negative weights or cycle detection.

**Why to Use It:**
- Dijkstra’s: O(E log V) for efficient shortest paths in non-negative weight graphs.
- Bellman-Ford: O(V * E), handles negative weights and detects negative cycles.

**Example Code (Java):**
Dijkstra’s algorithm for shortest paths:
```java
int n = graph.length;
int[] dist = new int[n];
Arrays.fill(dist, Integer.MAX_VALUE);
dist[start] = 0;
PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
pq.offer(new int[] {0, start}); // {distance, node}
while (!pq.isEmpty()) {
    int[] top = pq.poll();
    int d = top[0], u = top[1];
    if (d != dist[u]) continue; // ignore outdated pair
    for (int[] edge : graph[u]) { // for each neighbor (v, weight)
        int v = edge[0], w = edge[1];
        if (dist[u] + w < dist[v]) {
            dist[v] = dist[u] + w;
            pq.offer(new int[] {dist[v], v});
        }
    }
}
```

**Sample LeetCode Problems:**
- Network Delay Time
- Cheapest Flights Within K Stops
- Path with Maximum Probability
- The Maze II
- Swim in Rising Water
- Minimum Cost to Reach Destination in Time

## Tree Traversals (Inorder, Preorder, Postorder, Level Order)

**When to Use It:**
- Use for visiting all nodes in a specific order:
  - Preorder (root-left-right): copying, serialization.
  - Inorder (left-root-right): sorted order in BSTs.
  - Postorder (left-right-root): bottom-up processing.
  - Level Order (BFS): level-by-level processing.

**Why to Use It:**
- Ensures systematic node visitation.
- Chosen traversal simplifies problem-specific needs (e.g., inorder for BST sorting, level order for breadth-wise).

**Example Code (Java):**
Recursive DFS traversals:
```java
// Preorder traversal
void preorder(TreeNode node, List<Integer> result) {
    if (node == null) return;
    result.add(node.val);
    preorder(node.left, result);
    preorder(node.right, result);
}
// Inorder traversal
void inorder(TreeNode node, List<Integer> result) {
    if (node == null) return;
    inorder(node.left, result);
    result.add(node.val);
    inorder(node.right, result);
}
// Postorder traversal
void postorder(TreeNode node, List<Integer> result) {
    if (node == null) return;
    postorder(node.left, result);
    postorder(node.right, result);
    result.add(node.val);
}
```

**Sample LeetCode Problems:**
- Binary Tree Preorder Traversal
- Binary Tree Inorder Traversal
- Binary Tree Postorder Traversal
- Binary Tree Level Order Traversal
- Binary Tree Zigzag Level Order Traversal
- Binary Tree Level Order Traversal II
- Binary Tree Right Side View
- Binary Tree Paths
- Kth Smallest Element in a BST
- Balanced Binary Tree

## Prefix Sum (Cumulative Sum)

**When to Use It:**
- Use for quick subarray sum calculations or transforming problems into cumulative frequencies.
- Common in range sum queries, finding target-sum subarrays, or equal splits.

**Why to Use It:**
- Enables O(1) subarray sum queries with O(n) preprocessing.
- Combines with hashing for detecting equal sum segments.

**Example Code (Java):**
Building a prefix sum and answering range sum queries:
```java
int n = arr.length;
int[] prefix = new int[n + 1];
prefix[0] = 0;
for (int i = 1; i <= n; i++) {
    prefix[i] = prefix[i - 1] + arr[i - 1];
}
// Sum of subarray arr[i...j]
int subarraySum(int i, int j) {
    return prefix[j + 1] - prefix[i];
}
```

**Sample LeetCode Problems:**
- Range Sum Query - Immutable
- Range Sum Query 2D - Immutable
- Subarray Sum Equals K
- Contiguous Array
- Find Pivot Index
- Maximum Subarray
- Product of Array Except Self
- Subarray Sums Divisible by K
- Continuous Subarray Sum
- Pivot Index