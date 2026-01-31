# Stack Cheatsheet for Google Interviews

## Core Insight: When to Use a Stack

> **Stack = "I need to remember something for later, and I'll need the most recent one first"**

The key mental trigger: **LIFO (Last-In-First-Out) access pattern**

---

## Pattern Recognition Signals

### 1. Monotonic Stack (Most Common in Interviews!)

| Signal | Pattern | Example Problems |
|--------|---------|------------------|
| "Next greater/smaller element" | Monotonic decreasing/increasing | Next Greater Element, Daily Temperatures |
| "Previous greater/smaller element" | Same, but look backward | Stock Span, Largest Rectangle |
| "Remove to make smallest/largest" | Greedy + monotonic | Remove K Digits, Remove Duplicate Letters |
| "Find width × height maximum" | Monotonic stack for boundaries | Largest Rectangle in Histogram, Maximal Rectangle |
| "Sliding window maximum" | Monotonic deque variant | Sliding Window Maximum |

**Monotonic Stack Decision Table:**
```
Looking for...          | Stack maintains...     | Pop when...
------------------------|------------------------|------------------
Next GREATER element    | Decreasing (top=small) | curr > stack top
Next SMALLER element    | Increasing (top=large) | curr < stack top
Previous GREATER        | Decreasing             | curr >= stack top
Previous SMALLER        | Increasing             | curr <= stack top
```

### 2. Matching/Balancing Problems

| Signal | Pattern | Example Problems |
|--------|---------|------------------|
| "Valid parentheses/brackets" | Push open, pop on close | Valid Parentheses |
| "Minimum removes to make valid" | Track unmatched | Min Remove to Make Valid |
| "Decode nested structure" | Stack for nesting levels | Decode String, Nested List |
| "HTML/XML tag matching" | Push open tags | Tag Validator |

### 3. Expression Evaluation

| Signal | Pattern | Example Problems |
|--------|---------|------------------|
| "Evaluate expression" | Operand stack + operator handling | Basic Calculator I/II/III |
| "Reverse Polish Notation" | Pure operand stack | Evaluate RPN |
| "Infix to Postfix" | Operator stack with precedence | Shunting Yard |

### 4. Design Problems

| Signal | Pattern | Example Problems |
|--------|---------|------------------|
| "Get min/max in O(1)" | Auxiliary stack or tuple storage | Min Stack, Max Stack |
| "Browser back/forward" | Two stacks | Design Browser History |
| "Undo/Redo functionality" | Two stacks | Text Editor |

---

## Brilliant Clarifying Questions

### Questions That Change Algorithm Choice

**1. "Are there only parentheses, or multiple bracket types?"**
- Single type → Counter might suffice (no stack needed!)
- Multiple types → Stack required for matching
- *Shows you know when stack is overkill*

**2. "Do I need the actual elements, or just count/validity?"**
- Just validity → Might simplify to counter
- Need elements → Stack stores indices or values

**3. "Is there a constraint on what can be adjacent?"**
- "Remove adjacent duplicates" → Stack natural fit
- This often reveals hidden stack problems

**4. "What's the range of nesting depth?"**
- Small bounded depth → Recursion might be cleaner
- Unbounded → Iterative stack prevents stack overflow

**5. "Should I handle operator precedence?"**
- No (just +/-) → Single pass simpler
- Yes (×/÷ vs +/-) → Two stacks or different strategy
- With parentheses → Full expression stack needed

**6. "Do I need to look back at ALL previous elements or just SOME?"**
- All elements in LIFO order → Stack
- Only certain elements (e.g., next greater) → Monotonic stack
- Random access needed → Array, not stack

**7. "What should happen with equal elements?"**
- Strictly greater/less → Use `>` or `<`
- Greater-or-equal → Use `>=` or `<=`
- *Critical for monotonic stack correctness*

**8. "Is the string/array immutable, or can I modify in-place?"**
- Can modify → Sometimes two-pointer beats stack
- Cannot modify → Stack natural for building result

---

## Essential Code Templates

### 1. Basic Valid Parentheses
```python
def isValid(s):
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    for c in s:
        if c in pairs:  # closing bracket
            if not stack or stack[-1] != pairs[c]:
                return False
            stack.pop()
        else:  # opening bracket
            stack.append(c)
    return len(stack) == 0
```

### 2. Next Greater Element (Monotonic Stack)
```python
def nextGreater(nums):
    n = len(nums)
    result = [-1] * n
    stack = []  # stores indices, maintains decreasing values
    
    for i in range(n):
        while stack and nums[i] > nums[stack[-1]]:
            idx = stack.pop()
            result[idx] = nums[i]  # nums[i] is next greater for idx
        stack.append(i)
    return result
```

### 3. Previous Smaller Element
```python
def prevSmaller(nums):
    n = len(nums)
    result = [-1] * n
    stack = []  # stores indices, maintains increasing values
    
    for i in range(n):
        while stack and nums[stack[-1]] >= nums[i]:
            stack.pop()
        if stack:
            result[i] = nums[stack[-1]]
        stack.append(i)
    return result
```

### 4. Largest Rectangle in Histogram
```python
def largestRectangle(heights):
    stack = []  # (index, height)
    max_area = 0
    
    for i, h in enumerate(heights):
        start = i
        while stack and stack[-1][1] > h:
            idx, height = stack.pop()
            max_area = max(max_area, height * (i - idx))
            start = idx  # can extend back
        stack.append((start, h))
    
    # Process remaining in stack
    for idx, height in stack:
        max_area = max(max_area, height * (len(heights) - idx))
    return max_area
```

### 5. Basic Calculator (handles +, -, parentheses)
```python
def calculate(s):
    stack = []
    num, sign, result = 0, 1, 0
    
    for c in s:
        if c.isdigit():
            num = num * 10 + int(c)
        elif c in '+-':
            result += sign * num
            num = 0
            sign = 1 if c == '+' else -1
        elif c == '(':
            stack.append(result)
            stack.append(sign)
            result, sign = 0, 1
        elif c == ')':
            result += sign * num
            num = 0
            result *= stack.pop()  # sign before (
            result += stack.pop()  # result before (
    
    return result + sign * num
```

### 6. Decode String (Nested Structure)
```python
def decodeString(s):
    stack = []
    curr_str, curr_num = "", 0
    
    for c in s:
        if c.isdigit():
            curr_num = curr_num * 10 + int(c)
        elif c == '[':
            stack.append((curr_str, curr_num))
            curr_str, curr_num = "", 0
        elif c == ']':
            prev_str, repeat = stack.pop()
            curr_str = prev_str + curr_str * repeat
        else:
            curr_str += c
    
    return curr_str
```

### 7. Min Stack
```python
class MinStack:
    def __init__(self):
        self.stack = []  # (value, current_min)
    
    def push(self, val):
        curr_min = min(val, self.stack[-1][1] if self.stack else val)
        self.stack.append((val, curr_min))
    
    def pop(self):
        self.stack.pop()
    
    def top(self):
        return self.stack[-1][0]
    
    def getMin(self):
        return self.stack[-1][1]
```

---

## Time-Space Complexity Summary

| Problem Type | Time | Space | Notes |
|--------------|------|-------|-------|
| Valid Parentheses | O(n) | O(n) | Worst case all opening |
| Next Greater Element | O(n) | O(n) | Each element pushed/popped once |
| Largest Rectangle | O(n) | O(n) | Monotonic stack |
| Basic Calculator | O(n) | O(n) | Depth of parentheses |
| Min Stack operations | O(1) | O(n) | Trade space for time |
| Decode String | O(output) | O(n) | Output can be large |

---

## Google-Specific Tips

### 1. Monotonic Stack Mastery
- Google LOVES these — know them cold
- Always clarify: strictly greater or greater-or-equal?
- Practice explaining WHY each element is pushed/popped once (O(n) proof)

### 2. Edge Cases to Mention
- Empty string/array
- All same elements (monotonic stack processes nothing or everything)
- Single element
- Unbalanced parentheses
- Negative numbers in calculator problems
- Leading zeros in decode problems

### 3. Common Follow-ups
- "Can you do it in one pass?" (Often yes with monotonic stack)
- "What if it's circular?" (Process array twice, or modulo indexing)
- "What if there are multiple types?" (May need multiple stacks)

### 4. Clean Code Signals
```python
# Good: descriptive stack contents
stack = []  # stores (index, value) pairs

# Good: clear monotonic property
while stack and nums[stack[-1]] < curr:  # maintain decreasing
```

---

## Quick Pattern Matching Flowchart

```
Matching/balancing brackets? ──Yes──→ Standard Stack
       │
       No
       │
       ▼
"Next/Previous greater/smaller"? ──Yes──→ Monotonic Stack
       │
       No
       │
       ▼
Nested structure (decode, evaluate)? ──Yes──→ Stack for levels
       │
       No
       │
       ▼
Need O(1) min/max retrieval? ──Yes──→ Auxiliary Stack
       │
       No
       │
       ▼
Removing elements to optimize something? ──Yes──→ Monotonic Stack
       │
       No
       │
       ▼
Undo/back functionality? ──Yes──→ Stack (or two stacks)
```

---

## Red Flags → Stack Hints

| If you see... | Think stack because... |
|---------------|------------------------|
| "Next greater" or "daily temperatures" | Classic monotonic stack |
| "Valid" + "parentheses/brackets" | Matching problem |
| Nested `[]` or `{}` in examples | Stack tracks nesting depth |
| "Remove K to make smallest" | Greedy + monotonic stack |
| "Largest rectangle" or "water trapping" | Boundaries via monotonic stack |
| "Evaluate expression" | Operator/operand stacks |
| O(n) required but seems to need O(n²) | Monotonic stack removes nested loop |

---

## Monotonic Stack Intuition

**Why does it work?**
- Elements "waiting" for their answer stay in stack
- When we find an answer, we "resolve" by popping
- Each element enters once, exits once → O(n)

**Mental Model:**
> "I'm walking through the array. Each element is looking backward for something. The stack holds candidates that are still hoping someone will come along and answer their question."

**Example: Next Greater**
```
Array: [2, 1, 2, 4, 3]
Stack evolution (stores indices):
i=0: push 0        stack=[0]         (2 waiting)
i=1: push 1        stack=[0,1]       (2,1 waiting)
i=2: 2>1, pop 1    result[1]=2       (1's answer is 2)
     2≯2, push 2   stack=[0,2]
i=3: 4>2, pop 2    result[2]=4
     4>2, pop 0    result[0]=4
     push 3        stack=[3]
i=4: 3≯4, push 4   stack=[3,4]
End: result[3]=result[4]=-1 (no next greater)

Result: [4, 2, 4, -1, -1]
```
