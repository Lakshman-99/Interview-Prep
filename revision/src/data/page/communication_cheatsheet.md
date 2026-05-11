# Google L3/L4 Coding Interview — Communication Cheatsheet

> 45-min coding round. Communication is **scored separately** from correctness. Silent solvers get downleveled. The goal: come across as a calm collaborator who thinks out loud.

---

## ⏱️ Time Budget (45-min round)

| Phase | Time | What you're doing |
|---|---|---|
| 1. Clarify | 2–4 min | Restate, ask questions, agree on examples |
| 2. Plan | 4–6 min | Brute force → optimized, confirm with interviewer |
| 3. Code | 20–25 min | Implement while narrating |
| 4. Test / Dry run | 5–8 min | Trace through, edge cases |
| 5. Complexity + Follow-ups | 3–5 min | Big-O, optimizations, "what if…" |

**Rule of thumb:** if you've been silently stuck >2 min, surface it. If you're 10 min in with no traction, ask for a nudge.

---

## 📋 The 5-Phase Interview Structure

### Phase 1 — CLARIFY (don't skip, even if "obvious")

**Open with:**
- "Before I jump in, let me restate the problem to make sure I've got it right…"
- "So if I understand correctly, we're given X and need to return Y, where…"
- "Let me make sure I have the input/output shape right."

**Then ask (pick 3–5):**
- "What's the size of the input? Are we talking 10s, 1000s, millions?"
- "Can the input be empty? Negative? Contain duplicates? Have null/None values?"
- "Are the values bounded? Any constraints on the range?"
- "Is the input sorted? Already deduplicated?"
- "Should I optimize for time, space, or readability?"
- "Are we expected to handle invalid input, or can I assume it's well-formed?"
- "Is the input static, or could it be a stream?"
- "Should the output preserve order? Be unique?"

**Confirm with examples:**
- "Let me work through a small example to confirm: if the input is `[…]`, the output would be `[…]` — is that right?"
- "Can I make up an edge case? What about `[]` or a single element — what should that return?"

### Phase 2 — PLAN (this is where L3/L4 candidates get scored heavily)

**Bridge from clarify to plan:**
- "Okay, I think I understand the problem. Let me think out loud about approaches."
- "Let me start with the obvious brute-force, then see if we can do better."

**Brute force first:**
- "The naive approach would be to [X]. That's `O(n²)` time and `O(1)` space. Let me see if we can improve."
- "I could solve this by checking every pair, but that's quadratic. There's probably structure here we can exploit."

**Move to optimized:**
- "I notice the input is sorted — that suggests two pointers or binary search."
- "Because we're looking up values, a hash map could give us O(1) lookups instead of O(n)."
- "This feels like a [sliding window / DFS / DP / BFS] problem because [reason]."
- "Let me think about what data structure has the properties I need…"

**Get buy-in BEFORE coding:**
- "Before I start coding, does this approach sound reasonable to you?"
- "I'm going to go with the hash map approach unless you'd prefer I explore something else."
- "Any thoughts on this direction before I commit to it?"

### Phase 3 — CODE (narrate, don't read)

**Open:**
- "I'll structure this with a helper for X, then the main loop."
- "Let me set up the data structures first, then handle the logic."

**While typing — narrate INTENT, not syntax:**
- ✅ "I'm initializing a hash map to track the count of each character."
- ❌ "For i in range len nums…" (reading code character-by-character)
- ✅ "Here I'm guarding against the empty case."
- ✅ "This loop walks left to right, expanding the window until we hit a duplicate."

**Useful narration phrases:**
- "I'll name this `seenChars` so it's clear what it holds."
- "I'm pulling this out into a helper for readability — we can inline later if needed."
- "I'll come back to handle edge cases after I get the core logic working."
- "I'm assuming for now that the input is non-empty — I'll add a guard at the end."

### Phase 4 — TEST / DRY RUN (do this BEFORE the interviewer asks)

- "Let me trace through with the example: `nums = [1, 2, 3]`…"
- "At step 1, `i=0`, `left=0`, the map looks like `{1: 1}`…"
- "Let me also check the empty case and a single-element case."
- "Edge cases I want to verify: empty input, single element, all duplicates, all distinct, negative numbers."

**If you find a bug:**
- "Wait — I see a problem. My loop condition is off by one. Let me fix that."
- "Hmm, this would break if X. Let me adjust."

### Phase 5 — COMPLEXITY + FOLLOW-UPS

**State proactively (don't wait to be asked):**
- "Time complexity is `O(n)` — single pass through the array. Space is `O(k)` where k is the number of unique characters."
- "Worst case the map holds all n elements, so space is `O(n)`."

**Discuss trade-offs:**
- "We could trade space for time here — if memory's tight, we could sort first and use two pointers in `O(n log n)` time but `O(1)` extra space."

---

## 🗣️ Vocabulary — Sound Like an Engineer

| Concept | Use this | Avoid |
|---|---|---|
| Performance | "O(n) time, O(1) space" | "fast" / "efficient" |
| Trade-offs | "trades space for time" | "better" |
| Approach | "leverage the sorted property" | "use the fact it's sorted" |
| Tricky inputs | "edge cases" / "corner cases" / "degenerate cases" | "weird inputs" |
| Bad cases | "worst case" / "pathological input" | "bad case" |
| Improvement | "optimize" / "amortize" | "make it better" |
| Memory | "in-place" / "auxiliary space" | "without extra stuff" |
| Lookups | "constant-time lookup" | "fast lookup" |
| Iteration | "single pass" / "two-pass" | "loop through" |
| State | "invariant" / "monotonic" | "stays the same" |
| Recursion | "base case" / "recursive step" | — |
| Decomposition | "subproblem" / "memoize" / "overlapping subproblems" | — |
| Graphs | "traversal" / "visited set" / "frontier" | — |
| Data shape | "monotonically increasing", "deduplicated", "bounded" | — |

**Bonus collaboration vocab:** "we" not "I" — *"if we use a heap here…"*, *"let's verify with…"*, *"could we assume…"*

---

## 🧠 Fillers — Replace "Um" With Signal

Silence isn't bad. **Filler-noise** is bad. Replace dead air with productive signaling phrases:

- "Let me think about this for a moment." → buys you 30 silent seconds, guilt-free
- "Let me re-read the problem to make sure I have this right."
- "I want to take a beat and consider trade-offs before I commit."
- "I'm going to pause and trace through this in my head."
- "Hmm, let me think about whether [approach A] or [approach B] is better here."
- "Let me jot down my thinking before I forget."
- "Give me a second — I want to make sure I'm not over-complicating this."
- "Bear with me, I'm thinking through the edge cases."

**Banned phrases (sound anxious, drop score):**
- ❌ "Sorry, this is taking me a while."
- ❌ "I'm so bad at these."
- ❌ "This is harder than I expected."
- ❌ "Um, OK, so… let me see… I think… maybe…"
- ❌ "This will definitely work" (before you've verified)

---

## 🆘 When You're Stuck — The Toolkit

**Step 1 — Make your stuck-state visible (don't suffer silently):**
- "Let me pause and say what I know and where I'm stuck."
- "I'm stuck on [specific aspect]. I know X and Y, but I'm not seeing how to get to Z."
- "I've been on this for a few minutes — let me back up and consider whether my approach is even right."

**Step 2 — Try unblock tactics out loud:**
- "Let me try a small example by hand and see if I can spot a pattern."
- "What if I sort the input first — does that simplify anything?"
- "Let me think about what data structure has the property I need… I need fast lookups, so hash map. I need ordering, so maybe a heap."
- "Let me think about the bounds — I have to look at every element at least once, so I can't do better than O(n)."
- "Is there a simpler version of this problem I know how to solve?"
- "Let me try working backwards from the output."

**Step 3 — Pivot gracefully if your approach is wrong:**
- "I went down the wrong path. Let me back up and try a different angle."
- "This isn't working — let me reset. I think the right framing is actually…"
- "I'm going to abandon the two-pointer idea — I don't think it handles the duplicate case cleanly."

---

## 🎣 Asking for Hints — How to Do It Right

⚠️ **Heavy hint-taking is a negative signal at Google.** Use sparingly (1–2 max). Always show your own thinking first.

**The 3-part hint request (always do all three):**
1. **State where you are:** "Here's what I have so far…"
2. **State the gap:** "What I can't figure out is how to handle X without re-scanning."
3. **Ask narrowly:** "Am I on the right track with the hash map, or should I be thinking about a different structure?"

**Good hint-asks:**
- "Am I in the right ballpark with this approach, or am I overcomplicating it?"
- "I'm torn between two directions — would you nudge me toward the one you'd prefer I explore?"
- "I think I'm missing a property of the input I should be using. Is there something about the constraints I should lean on harder?"
- "Could you give me a small nudge? I have the structure, but I'm stuck on the recurrence."

**Last resort (use once max):**
- "To be honest, I'm stuck. Could you give me a hint on where to go next?"

**When they give a hint — acknowledge and integrate:**
- "Thanks — so you're suggesting [hint in your own words]. Let me think about how that fits…"
- "Got it. If I use [hinted technique], then the next step would be…"
- ❌ Don't fish: "Should I use a binary tree?" (without explaining why)
- ❌ Don't ignore: if they steer you, follow them. Interviewers want you to succeed.

---

## 🔁 Handling Follow-ups (the L4 differentiator)

After your first solution works, expect 1–3 of these. **L3 candidates handle 1; L4 candidates handle 2–3 cleanly.**

**Common follow-up flavors + how to open:**

| Follow-up type | Their question | Your opener |
|---|---|---|
| Optimize | "Can we do better?" | "Let me think about what's expensive in the current approach…" |
| Scale | "What if the input doesn't fit in memory?" | "Then we'd need a streaming/external approach. We could chunk the input…" |
| Stream | "What if it arrives as a stream?" | "I'd switch to an online algorithm — maintain state incrementally rather than re-computing." |
| Concurrency | "What if multiple threads access this?" | "We'd need to think about thread-safety. A lock around the map would work but limit throughput; a concurrent map…" |
| Generalization | "What if k could be very large?" | "Then my O(k) space becomes a problem. Let me think about a heap-based approach…" |
| Test | "How would you test this?" | "Unit tests for: empty input, single element, all duplicates, max size, and a couple of typical cases." |
| Production | "What would you change for production?" | "Add input validation, logging, metrics on cache hit rate, and consider thread-safety." |

**Universal follow-up framing:**
- "Good question — let me think about what changes if [new constraint]."
- "That's an interesting variant. The bottleneck shifts from [X] to [Y]…"
- "I'd reach for [technique] here because the constraint changes the trade-off."

**If you don't know:**
- "I'm not certain, but I'd guess [X], because [reasoning]. In production I'd validate that with a benchmark."
- "I haven't worked with that exact problem, but the pattern reminds me of [related concept]…"

---

## 🚦 Signpost Phrases (transitions between phases)

Interviewers love candidates who **announce** what they're doing. Use these:

- "Okay, I think I understand the problem. Let me move on to approach."
- "Now that we've agreed on the approach, I'll start coding."
- "I've got a working solution — let me walk through a test case."
- "Tests pass. Let me state the complexity."
- "Before we wrap, let me mention a couple of things I'd improve in production."

---

## 🎯 L3 vs L4 — What Changes in Communication

| Dimension | L3 expectation | L4 expectation |
|---|---|---|
| Clarification | Ask the basics | Probe for ambiguity, anticipate edge cases |
| Approach | One working approach | Brute force → optimized, **trade-off discussion** |
| Code quality | Readable, correct | Production-grade: naming, modularity, error paths |
| Edge cases | Handle when prompted | **Proactively** enumerate before coding |
| Complexity | State when asked | State proactively + discuss trade-offs |
| Hints | 1–2 hints OK | Should mostly self-correct; 1 hint max |
| Follow-ups | Engage with one | Handle 2–3, including scale/concurrency |
| Tone | "I would do X" | "We could do X or Y; I'd choose X because…" |

**L4 also gets graded on "leadership without authority":** speak as a collaborator, not a student. Suggest alternatives, name trade-offs, ask thoughtful questions back.

---

## 💬 Copy-Paste Sentences (Pre-Loaded for Each Moment)

**Opening the interview:**
- "Thanks for the problem. Let me read it through once and then restate it back to you."

**After reading:**
- "So to confirm: we're given X, we need to return Y, and the key constraint is Z. Is that right?"

**Before coding:**
- "Quick recap of my plan: [one-sentence approach]. Time will be O(n), space O(n). Sound good?"

**Mid-code, hitting a snag:**
- "Hold on — I'm second-guessing this loop condition. Let me trace through to verify."

**After finishing:**
- "Okay, I think this is correct. Let me walk through a couple of test cases to verify, and then I'll cover complexity."

**Wrapping:**
- "If I had more time, I'd add [X] and refactor [Y]. Anything you'd like me to dig into?"

**Closing question to them (always have one):**
- "What's the most interesting technical problem your team has tackled in the last quarter?"
- "How does your team balance new feature work with technical debt?"

---

## ⚡ The 10 Highest-Leverage Habits

1. **Restate the problem in your own words before doing anything else.** Free signal.
2. **Ask 3–5 clarifying questions even if "obvious."** Silent assumptions kill scores.
3. **Discuss brute force out loud, even if you skip implementing it.** Shows you can reason about trade-offs.
4. **Get verbal buy-in before coding.** "Does this approach sound good?" → if they hesitate, that's a free hint.
5. **Narrate intent, not syntax.** "I'm tracking the running max" beats "I'm assigning max equals…"
6. **Use "we" not "I."** Make it collaborative.
7. **Announce silences.** "Let me think for a moment" → silence is now fine.
8. **State complexity without being asked.** L4 signal.
9. **Dry-run before they prompt you.** Catches bugs + shows discipline.
10. **End every solution with a follow-up offer.** "I'd love to discuss optimizations if you want."

---

## 🚫 Red Flags Interviewers Flag

- Jumping to code without clarifying
- Long silent stretches (>60s with no signal)
- Ignoring interviewer hints / not picking up steering
- Defending a wrong approach instead of pivoting
- Apologizing repeatedly ("sorry I'm slow…")
- Reading code character-by-character as narration
- Claiming certainty before verifying ("this definitely works")
- Forgetting to test / waiting to be told to test
- Skipping complexity analysis
- Treating it as a monologue instead of a conversation

---

*Print this. Pin it. Run through it before every mock. The phrases stop feeling scripted around mock #5.*
