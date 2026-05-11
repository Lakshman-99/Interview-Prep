# Sliding Window Cheat Sheet

## 🟦 1. When to Use Sliding Window

* You're dealing with **contiguous subarrays/substrings** and need an **optimal (O(n))** solution instead of brute-force O(n²) .
* Keywords to trigger it:

  * “subarray/substring of size k”
  * “longest/shortest/maximum/minimum subarray”
  * “at most K distinct”
  * “sum ≥ target”, “sum < K,” etc.

---

## 🟦 2. Core Types & Templates

### 🔹 A. Fixed‑Size Window (size = k)

**Pattern**: maintain a window of size `k`, slide one step at a time.
**Keywords**: “size k”, “every subarray of length k”, “max/min/sum of subarray size k”.

```java
int windowSum = 0;
for(int i=0; i<nums.length; i++){
    windowSum += nums[i];
    if(i >= k-1){
        // process window
        max = Math.max(max, windowSum);
        windowSum -= nums[i-k+1];
    }
}
```

**Use cases**: max sum subarray, max/min in window, averages .

---

### 🔹 B. Variable‑Size (Two Pointers)

**Pattern**: expand the window to meet a condition, then shrink.
**Keywords**: “smallest subarray ≥ target”, “longest substring without repeating”, “at most K distinct”…

```java
int left = 0, sum = 0, best = INF;
for(int right = 0; right < nums.length; right++){
    sum += nums[right];
    while(sum >= target){
        best = Math.min(best, right - left + 1);
        sum -= nums[left++];
    }
}
```

**Use cases**: min subarray length, longest unique substring, longest substring with ≤K distinct chars .

---

### 🔹 C. At‑Most(K) – With “At Most” Trick

**Pattern**: answer = atMost(K) – atMost(K – 1).
**Keywords**: “at most K distinct characters”, “exactly K distinct”.
Example: Number of substrings with exactly K distinct chars:

```java
return atMost(K) - atMost(K-1);
```

Where `atMost(K)` follows the variable-size template.

---

### 🔹 D. Deque‑Based (Monotonic Queue)

**Pattern**: optimize “max/min in window” with a deque holding candidate indices in monotonic order.
**Keywords**: “sliding window maximum/minimum”, “deque”.

```java
Deque<Integer> dq = new ArrayDeque<>();
for (int i = 0; i < nums.length; i++) {
    while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i])
        dq.removeLast();
    dq.addLast(i);
    if (dq.peekFirst() <= i - k)
        dq.removeFirst();
    if (i >= k-1)
        result.add(nums[dq.peekFirst()]);
}
```

**Use case**: *Sliding Window Maximum* (LeetCode 239)

---

## 🟦 3. Summary Table

| Type               | Recognize Keywords                                  | Data Structures                     | Example Problems                               |
| ------------------ | --------------------------------------------------- | ----------------------------------- | ---------------------------------------------- |
| Fixed‑Size         | “size k”, “window of size k”, “max/min sum/avg”     | Primitive vars                      | Max sum subarray, avg of subarrays             |
| Variable‑Size      | “sum ≥ S”, “longest without repeating”, “at most K” | Hash maps, counting, sliding window | Minimum subarray ≥ S, longest unique substring |
| At‑Most(K) Trick   | “exactly K distinct/odd/… substrings”               | Hash maps + sliding window          | # substrings with exactly K distinct           |
| Monotonic Deque    | “max/min in sliding window”, “deque”, “mono queue”  | Deque                               | Sliding Window Maximum (LeetCode 239)          |
| Deque + Prefix Sum | “shortest/longest subarray sum ≥ K (neg allowed)”   | Deque + prefix-sums                 | Shortest Subarray ≥ K (LeetCode 862)           |

---

## 🟦 4. Quick Decision Flowchart

1. **Is window size fixed?** → Yes → **Fixed‑Size**
2. **Dynamic size with conditions?** → Yes → **Variable‑Size**

   * Want *exactly* K distinct? → use **atMost(K) – atMost(K‑1)**
3. **Need max/min in window?** → use **Monotonic Deque**
4. **Negative numbers involved + subarray sum ≥ K?** → **Deque + Prefix Sum**

---

## 🟦 5. Java Code Snippets Ready for Reuse

### Fixed‑Size (Max Sum)

```java
int maxSum(int[] a, int k) {
    int sum = 0, res = 0;
    for (int i = 0; i < a.length; i++) {
        sum += a[i];
        if (i >= k - 1) {
            res = Math.max(res, sum);
            sum -= a[i - k + 1];
        }
    }
    return res;
}
```

### Variable‑Size (Min Subarray ≥ target)

```java
int minSubarrayLen(int target, int[] nums) {
    int left = 0, sum = 0, ans = Integer.MAX_VALUE;
    for (int right = 0; right < nums.length; right++) {
        sum += nums[right];
        while (sum >= target) {
            ans = Math.min(ans, right - left + 1);
            sum -= nums[left++];
        }
    }
    return (ans == Integer.MAX_VALUE) ? 0 : ans;
}
```

### AtMost(K)

```java
int atMostK(int[] a, int K) {
  int left = 0, count = 0;
  Map<Integer, Integer> freq = new HashMap<>();
  for (int right = 0; right < a.length; right++) {
    freq.put(a[right], freq.getOrDefault(a[right], 0) + 1);
    while (freq.size() > K) {
      freq.put(a[left], freq.get(a[left]) - 1);
      if (freq.get(a[left]) == 0) freq.remove(a[left]);
      left++;
    }
    count += right - left + 1;
  }
  return count;
}
```

### Deque‑Based (Max)

```java
int[] maxSlidingWindow(int[] a, int k) {
  Deque<Integer> dq = new ArrayDeque<>();
  int n = a.length, idx = 0;
  int[] ans = new int[n - k + 1];
  for (int i = 0; i < n; i++) {
    while (!dq.isEmpty() && a[dq.peekLast()] <= a[i]) dq.removeLast();
    dq.addLast(i);
    if (dq.peekFirst() == i - k) dq.removeFirst();
    if (i >= k - 1) ans[idx++] = a[dq.peekFirst()];
  }
  return ans;
}
```

### Prefix‑Sum + Deque (Shortest Subarray ≥ K)

```java
int shortestSubarray(int[] A, int K) {
  int n = A.length, res = n + 1;
  long[] pre = new long[n + 1];
  for (int i = 0; i < n; ++i) pre[i+1] = pre[i] + A[i];
  Deque<Integer> dq = new LinkedList<>();
  for (int i = 0; i <= n; i++) {
    while (!dq.isEmpty() && pre[i] - pre[dq.peekFirst()] >= K)
      res = Math.min(res, i - dq.pollFirst());
    while (!dq.isEmpty() && pre[i] <= pre[dq.peekLast()])
      dq.pollLast();
    dq.offerLast(i);
  }
  return res < n+1 ? res : -1;
}
```

---

## 🧠 Final Tips

* **Scan problem statement**: spot keywords like **size k**, **distinct**, **sum ≥**, **longest/shortest**, **max/min**.
* **Pick your pattern**: fixed, variable, atMost trick, or deque-based.
* **Choose a data structure**: counters (for distinct), hash maps, deque, prefix sums.
* **Write your skeleton**: pointers + window updates.
* **Test** with edge cases: empty, full, negatives.
