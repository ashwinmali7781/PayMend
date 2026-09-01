# 💳 PayMend — AI Revenue Recovery Agent

**Built for the Razorpay Buildathon — Track 03: AI Revenue Recovery**

> *PayMend* — pay + mend. An agent that watches failed payments and
> abandoned checkouts, figures out why each one happened, and takes one
> bounded, explainable action to win the revenue back — with a full audit
> trail and a human always in the loop for anything it can't safely
> resolve on its own.

Everything here runs for free: no paid APIs required, no database, no real
money moved. Diagnosis and decisioning are rule-based by design — for a
finance-adjacent agent, an auditable rule table beats an opaque model call
every time.

---

## 🧩 The problem

> *"Build an agent that detects revenue at risk, determines the right
> intervention, and executes a bounded recovery workflow: from payment
> failures and checkout abandonment to overdue receivables."* — Track 03 brief

Revenue loss rarely happens in one clean step. A card expires, a bank
declines a charge, a customer abandons checkout before paying at all — and
without something watching, that revenue just quietly disappears. Most
teams handle this manually, inconsistently, or not at all.

## 🔁 The approach

Two independent recovery pipelines, same five-stage architecture:

```
failed payment / abandoned checkout  →  classify()  →  decideAction()  →  executeAction()  →  audit log
            (detect)                      (diagnose)      (decide)            (act)
```

- 🔍 **Detect** — synthetic events shaped exactly like Razorpay's real
  `payment.failed` webhook payload, plus a genuine integration with
  Razorpay's test-mode API for real data (see below).
- 🩺 **Diagnose** — a fixed, readable rule table maps each case to a
  category. No black box: every classification carries the rule that fired.
- ⚖️ **Decide** — picks exactly one bounded action. Payments get a hard cap
  of 2 automatic retries, ever. Checkouts get a "too soon to nudge" wait
  state and a one-time-only discount cap. Anything outside the known rules
  goes to a human — the agent never guesses past what it has a rule for.
- ⚙️ **Act** — simulates the recovery action and generates a ready-to-send
  **Hinglish reminder message** where a customer nudge makes sense.
- 📝 **Log** — every step is written to an audit trail with the reasoning
  attached, in plain language, exportable as CSV.

---

## 🏗️ Architecture

PayMend is a two-tier app: a React/Vite SPA talking to an Express REST API,
gated behind real authentication, which runs everything through two
parallel rule-based pipelines and persists results to append-only JSON
audit logs. No database, no queue — designed to run for free on a laptop.

```mermaid
graph TB
  subgraph Client["🖥️ Client — React + Vite · :5173"]
    UI["App.jsx<br/>dashboard shell + auth gate"]
    Ledger["AuditLedger.jsx"]
    Escal["EscalationQueue.jsx"]
    Metrics["MetricRow.jsx /<br/>RevenueProjection.jsx /<br/>CategoryChart.jsx"]
    RealPanel["RealPaymentPanel.jsx"]
    Checkout["CheckoutDropoffPanel.jsx"]
    SignIn["SignInScreen.jsx"]
    AuthB["AuthBridge.jsx<br/>attaches Clerk token"]
    Theme["ThemeContext.jsx /<br/>ThemeToggle.jsx"]
  end

  subgraph Server["🖧 Server — Node.js + Express · :4000"]
    ApiR["routes/api.js"]
    RzpR["routes/razorpay.js"]
    ChkR["routes/checkout.js"]
    Auth["middleware/requireAuth.js<br/>manual token verification"]

    subgraph Engine["⚙️ Payment recovery pipeline"]
      Pipe["pipeline.js"]
      Clf["classifier.js"]
      Dec["decisionEngine.js"]
      Exe["executor.js"]
      Msg["messageGenerator.js"]
    end

    subgraph ChkEngine["🛒 Checkout recovery pipeline"]
      ChkPipe["checkoutPipeline.js"]
      ChkClf["checkoutClassifier.js"]
      ChkDec["checkoutDecisionEngine.js"]
      ChkExe["checkoutExecutor.js"]
      ChkMsg["checkoutMessageGenerator.js"]
    end

    Store["store/auditLog.js"]
    ChkStore["store/checkoutLog.js"]
    RzpClient["razorpayClient.js"]
    Synth["data/syntheticPayments.js"]
    RealData["data/realPayments.js"]
    ChkSynth["data/syntheticCheckouts.js"]
  end

  subgraph External["🌐 External services"]
    RzpApi[("Razorpay<br/>test-mode API")]
    ClerkApi[("Clerk<br/>auth API")]
  end

  UI -->|"POST /api/run"| ApiR
  Ledger -->|"GET /api/audit-log"| ApiR
  Metrics -->|"GET /api/metrics"| ApiR
  Escal -->|"GET/POST /api/escalations"| ApiR
  RealPanel -->|"POST /api/razorpay/*"| RzpR
  Checkout -->|"POST/GET /api/checkout/*"| ChkR
  AuthB -.->|"getToken()"| ClerkApi
  SignIn -.->|"hosted sign-in UI"| ClerkApi
  Theme -.->|"drives dark mode,<br/>incl. Clerk's own modal"| SignIn

  ApiR --> Auth
  RzpR --> Auth
  ChkR --> Auth
  Auth -->|"verifyToken()"| ClerkApi

  ApiR --> Synth
  ApiR --> Pipe
  ApiR --> Store

  RzpR --> RzpClient --> RzpApi
  RzpR --> RealData --> Pipe

  ChkR --> ChkSynth
  ChkR --> ChkPipe
  ChkR --> ChkStore

  Pipe --> Clf --> Dec --> Exe --> Msg
  Pipe --> Store

  ChkPipe --> ChkClf --> ChkDec --> ChkExe --> ChkMsg
  ChkPipe --> ChkStore
```

### 🔄 Request flow — "Run agent on new batch"

```mermaid
sequenceDiagram
  participant U as 👤 User
  participant C as 🖥️ Client (React)
  participant A as 🔌 POST /api/run
  participant P as pipeline.js
  participant Cl as classifier.js
  participant D as decisionEngine.js
  participant E as executor.js
  participant M as messageGenerator.js
  participant L as 📝 auditLog.js (JSON)

  U->>C: Click "Run agent on new batch"
  C->>A: POST /api/run { count }
  A->>P: runRecoveryPipeline(failedPayments)
  loop for each failed payment
    P->>Cl: classifyFailure(payment)
    Cl-->>P: category + retryable + rationale
    P->>D: decideAction(payment, classification)
    D-->>P: bounded action + reasoning
    P->>E: executeAction(decision)
    E-->>P: recovered / still_failing / escalated
    P->>M: generateRecoveryMessage(...)
    M-->>P: Hinglish message
  end
  P->>L: appendAuditEntries(entries)
  L-->>P: persisted (newest first)
  P-->>A: entries[]
  A-->>C: { processed, entries }
  C-->>U: dashboard re-renders (metrics, ledger, escalations)
```

### 🛒 Checkout drop-off flow — a genuinely separate pipeline

```mermaid
flowchart LR
  In["📥 Abandoned checkout<br/>reason, minutes since abandonment"] --> Clf{"🩺 checkoutClassifier.js"}

  Clf -->|"matched rule"| Cat["category + nudge type<br/>+ rationale"]
  Clf -->|"no rule fired"| Fallback["unclassified"]

  Cat --> Dec{"⚖️ checkoutDecisionEngine.js"}
  Fallback --> Dec

  Dec -->|"< 30 min since abandonment"| Wait["⏳ wait<br/>too soon to nudge"]
  Dec -->|"cart value ≥ ₹10k"| Sales["🙋 notify_sales_human<br/>high-value, human touch"]
  Dec -->|"price hesitation /<br/>shipping cost shock"| Disc["🎟️ send_discount_nudge<br/>one-time, capped"]
  Dec -->|"no saved payment /<br/>timeout / comparison shopping"| Rem["✉️ send_reminder"]
  Dec -->|"unclassified"| Sales

  Wait --> Exec["⚙️ checkoutExecutor.js"]
  Disc --> Exec
  Rem --> Exec
  Sales --> Log["📝 checkoutLog.js"]
  Exec --> Log
```

No charge was ever attempted here, so this isn't a relabeled copy of the
payment pipeline — it has its own reasons, its own bounded actions (note
the wait state: the agent deliberately does *not* nudge someone who
abandoned a cart 5 minutes ago), and its own audit log.

### 💸 Real Razorpay test-mode flow

```mermaid
sequenceDiagram
  participant U as 👤 User
  participant RP as RealPaymentPanel.jsx
  participant RZ as 🔌 POST /api/razorpay/*
  participant SDK as razorpayClient.js
  participant API as 🌐 Razorpay test-mode API
  participant P as pipeline.js
  participant L as 📝 auditLog.js

  U->>RP: Open Razorpay Checkout
  RP->>RZ: POST /api/razorpay/create-order
  RZ->>SDK: orders.create()
  SDK->>API: real API call
  API-->>RZ: order
  RZ-->>RP: order (renders Checkout widget)
  U->>API: fails payment (bad UPI / test card)
  U->>RP: Click "Pull into agent"
  RP->>RZ: POST /api/razorpay/pull-real-failures
  RZ->>SDK: payments.all() (fetch + normalize failures)
  SDK->>API: real API call
  API-->>RZ: failed payments
  RZ->>P: runRecoveryPipeline(realPayments)
  P->>L: appendAuditEntries(entries)
  RZ-->>RP: { processed, entries }
  RP-->>U: entries appear in ledger, tagged LIVE
```

### 🔐 Auth flow — server-enforced, not just hidden client-side

```mermaid
sequenceDiagram
  participant C as 🖥️ Client
  participant AB as AuthBridge.jsx
  participant A as 🔌 any /api/* route
  participant RA as requireAuth.js
  participant CB as "@clerk/backend"
  participant Clerk as 🌐 Clerk API

  C->>AB: useAuth().getToken()
  AB-->>C: session JWT
  C->>A: fetch with Authorization: Bearer token
  A->>RA: requireAuth(req)
  RA->>CB: verifyToken(token, secretKey, clockSkewInMs)
  CB->>Clerk: fetch JWKS (cached)
  Clerk-->>CB: public keys
  CB-->>RA: payload with userId, or throws
  alt valid
    RA-->>A: req.auth set, next()
    A-->>C: 200 + data
  else invalid or missing
    RA-->>A: 401 with reason
    A-->>C: 401
  end
```

Token verification is done directly with `@clerk/backend`'s `verifyToken()`
rather than through `@clerk/express`'s `clerkMiddleware()` + `getAuth()`
pairing — that approach proved unreliable in testing (an ordering error
even when correctly registered first). Manual, per-request verification
has no ordering to get wrong. `clockSkewInMs` tolerance is set to 30s to
absorb normal system clock drift without weakening the check.

### 🎯 Payment pipeline internals — bounded decision logic

```mermaid
flowchart LR
  In["📥 Failed payment<br/>error_reason, attempt_number"] --> Clf{"🩺 classifier.js<br/>rule table match"}

  Clf -->|"matched rule"| Cat["category + retryable flag<br/>+ rationale"]
  Clf -->|"no rule fired"| Fallback["unclassified<br/>retryable = false"]

  Cat --> Dec{"⚖️ decisionEngine.js"}
  Fallback --> Dec

  Dec -->|"attempt_number > 2"| Esc1["🙋 escalate_to_human<br/>retry cap reached"]
  Dec -->|"not retryable"| Notify["✉️ notify_customer_update_method"]
  Dec -->|"network_transient"| Retry1["🔁 auto_retry<br/>within 15 min"]
  Dec -->|"insufficient_funds"| Retry2["🔁 schedule_retry<br/>in 3 days"]
  Dec -->|"bank_declined"| Retry3["🔁 auto_retry<br/>within 24 hrs"]
  Dec -->|"retryable, no playbook"| Esc2["🙋 escalate_to_human<br/>safety net"]

  Retry1 --> Exec["⚙️ executor.js<br/>simulated outcome"]
  Retry2 --> Exec
  Retry3 --> Exec
  Notify --> Exec
  Esc1 --> Log["📝 auditLog.js<br/>escalation queue"]
  Esc2 --> Log
  Exec --> Log
```

**Reading the diagrams:**

- 🧭 **Component diagram** — the client never talks to Razorpay, Clerk, or
  the file stores directly; every path goes through the Express layer, so
  the audit logs are the single source of truth for both synthetic and
  real data, and every route is auth-gated before it does anything.
- 🔂 **Run-agent sequence** — one HTTP request fans out into N pipeline
  runs, each passing through all five engine stages before a single
  batched write to the JSON store.
- 🛒 **Checkout flowchart** — a fully independent funnel with its own
  bounded rules, including a deliberate "don't nudge yet" state.
- 💳 **Real Razorpay sequence** — genuinely hits Razorpay's test-mode API
  (`orders.create`, `payments.all`); only the *outcome simulation* inside
  `executor.js` stays mocked, since retrying a real charge isn't in scope.
- 🔐 **Auth sequence** — shows exactly why token verification is manual
  rather than middleware-based, and why a 30s clock skew tolerance exists.
- 🛡️ **Payment decision flowchart** — the "bounded and gated" contract made
  literal: every branch terminates in a concrete action or a human
  escalation, never an indefinite retry or an unguessed classification.

### 🛠️ Tech stack by layer

| Layer | Tech | Responsibility |
|---|---|---|
| 🖥️ Client | React 18 + Vite 5, Recharts | Dashboard UI, metrics charts, ledger, escalation queue, CSV export |
| 🔌 API | Node.js + Express 4 | REST endpoints, request validation, CORS |
| ⚙️ Engine | Plain JS modules (no framework) | classify → decide → act → message, pure functions, unit-testable |
| 💾 Persistence | JSON files (`server/.data/*.json`) | Append-only audit trails; only mutation path is escalation resolution |
| 🌐 Payments | `razorpay` SDK (official) | Test-mode order creation + real failed-payment fetch |
| 🆔 Auth | `@clerk/backend`, `@clerk/react`, `@clerk/themes` | Server-side token verification, client sign-in UI, themed Clerk modal |
| 🆔 IDs | `nanoid` | Audit entry IDs |

---

## ✨ Features

- 📊 **Live dashboard** — recovery rate, revenue recovered, and a
  failure-cause breakdown, styled to match Razorpay's own product design.
- 📈 **Revenue impact projection** — turns one batch into a monthly/annual
  number, with the extrapolation assumption stated plainly rather than
  hidden.
- 🙋 **Escalation queue** — a human-in-the-loop panel for anything the
  agent bounded out on. Approve a manual retry, dismiss, or write it off —
  every resolution logs back into the audit trail.
- 🛒 **Checkout drop-off recovery** — a second, independently-built
  recovery funnel for customers who never attempted to pay at all.
- 💬 **Hinglish recovery messages** — a ready-to-send customer message
  generated per failure type, with a one-click copy button.
- 📤 **Exportable audit trail** — full ledger as CSV, including human
  resolutions and generated messages.
- 💳 **Real Razorpay test-mode integration** — trigger an actual payment
  failure through Razorpay's own Checkout widget, then pull it through the
  exact same pipeline as everything else.
- 🔐 **Real authentication (Clerk)** — the dashboard requires a signed-in
  user, enforced server-side on every route, not just hidden client-side.
- 🌙 **Dark mode, everywhere** — including the pre-sign-in screen and
  Clerk's own modal, not just the dashboard.

## 🏆 Why this holds up against the track's own bar

> *"Don't just identify the problem. Show measured money recovered across a
> batch, with compliant escalation, stopping rules, and an audit trail."*
> — Track 03 bar

- 📏 **Measured money recovered across a batch** — live recovery rate,
  revenue recovered, and a monthly/annual projection, computed from an
  actual run, not hardcoded.
- 🙋 **Compliant escalation** — the escalation queue is a real workflow: a
  human approves a manual retry, dismisses, or writes off, and that
  decision is permanently logged, not just a status label.
- 🔒 **Stopping rules** — a hard-coded retry cap (2 attempts, no
  exceptions), a "too soon to nudge" wait state, and a one-time discount
  cap that can't be re-triggered.
- 📝 **Audit trail** — every decision logged with its reasoning in plain
  language, exportable as CSV. Tested against a **real** unexpected
  Razorpay failure ("international cards not supported") and correctly
  fell through to the safety-net rule instead of misclassifying it.

## 🚀 Setup (free, ~5 minutes)

### 1️⃣ Backend

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Runs on `http://localhost:4000`. Leave `USE_SYNTHETIC_DATA=true` and no
`CLERK_SECRET_KEY` set to run entirely open, on generated data — no
Razorpay or Clerk account needed to demo.

### 2️⃣ Frontend

```bash
cd client
npm install
npm run dev
```

Runs on `http://localhost:5173` and proxies `/api` to the backend.

### 3️⃣ Demo it

Open `http://localhost:5173`, click **Run agent on new batch**. Watch the
metrics populate, open the **Escalation queue** to resolve a bounded-out
payment, expand a ledger row's **Hinglish reminder** message, and scroll
down to run **Checkout drop-off recovery** separately.

## 🎤 What to show judges

1. Run the agent, watch the recovery rate and revenue-recovered numbers
   populate live.
2. Open the escalation queue and resolve one entry — stopping rules and
   human-in-the-loop design made literal, not just claimed.
3. Expand a Hinglish reminder message on any ledger row.
4. Scroll to Checkout Drop-off Recovery — a second, independently-built
   funnel with its own rules, not a relabeled copy.
5. The rule tables in `classifier.js` / `checkoutClassifier.js` and
   `decisionEngine.js` / `checkoutDecisionEngine.js` — readable top to
   bottom in under a minute, which is the point.
6. The real Razorpay integration — trigger and pull in a genuine test-mode
   failure to prove this isn't only running on synthetic data.

## 💳 Using real Razorpay test-mode data (optional, still free)

The dashboard includes a **"Real Razorpay test-mode data"** panel that lets
you generate an actual failed payment through Razorpay's own Checkout, then
feed it through the exact same pipeline as synthetic data — no code changes
needed.

1. Create a free account at https://dashboard.razorpay.com/ and switch to
   **Test Mode** (toggle top-left). No KYC or payment info required.
2. Settings → API Keys → generate a **Test** key pair, drop into
   `server/.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_...
   RAZORPAY_KEY_SECRET=...
   ```
3. Restart the backend so it picks up the keys.
4. Click **Open Razorpay Checkout**. Fastest way to fail it: choose UPI,
   enter `failure@razorpay` as the UPI ID — instant decline, no card
   needed. Or use a [test card](https://razorpay.com/docs/payments/payments/test-card-details/)
   and either enter a sub-4-digit OTP or let Razorpay itself reject it.
5. Click **Pull into agent** — calls Razorpay's real Payments API,
   classifies the failure, runs it through the same pipeline as everything
   else. Shows up in the ledger tagged **LIVE**.

## 🔐 Real authentication (optional, free)

By default there's no sign-in gate. To require a real signed-in user, both
in the UI and enforced server-side on every route:

1. Create a free account at https://clerk.com and create an application.
2. From **API Keys**, copy both keys into `server/.env`:
   ```
   CLERK_SECRET_KEY=sk_test_...
   CLERK_PUBLISHABLE_KEY=pk_test_...
   ```
3. And the publishable key into `client/.env`:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
   ```
   **This must be the exact same key** as `CLERK_PUBLISHABLE_KEY` in
   `server/.env` — keys from two different Clerk apps will silently fail
   token verification.
4. Restart both. Every `/api` route now returns `401` without a valid
   session.

## 📁 Project structure

```
paymend/
├── server/
│   ├── src/
│   │   ├── data/
│   │   │   ├── syntheticPayments.js      # synthetic failed-payment generator
│   │   │   ├── realPayments.js           # fetches + normalizes real Razorpay failures
│   │   │   └── syntheticCheckouts.js     # synthetic abandoned-checkout generator
│   │   ├── engine/
│   │   │   ├── classifier.js             # payment diagnosis rules
│   │   │   ├── decisionEngine.js         # payment bounded decision rules
│   │   │   ├── executor.js               # payment simulated execution
│   │   │   ├── messageGenerator.js       # Hinglish payment recovery messages
│   │   │   ├── pipeline.js               # payment pipeline orchestrator
│   │   │   ├── checkoutClassifier.js     # checkout abandonment diagnosis rules
│   │   │   ├── checkoutDecisionEngine.js # checkout bounded decision rules
│   │   │   ├── checkoutExecutor.js       # checkout simulated execution
│   │   │   ├── checkoutMessageGenerator.js # Hinglish checkout nudge messages
│   │   │   └── checkoutPipeline.js       # checkout pipeline orchestrator
│   │   ├── store/
│   │   │   ├── auditLog.js               # payment audit log + escalation resolution
│   │   │   └── checkoutLog.js            # checkout audit log
│   │   ├── routes/
│   │   │   ├── api.js                    # payment REST endpoints
│   │   │   ├── razorpay.js               # real Razorpay test-mode endpoints
│   │   │   └── checkout.js               # checkout drop-off REST endpoints
│   │   ├── middleware/requireAuth.js     # manual Clerk token verification
│   │   ├── razorpayClient.js             # Razorpay SDK instantiation
│   │   ├── clerkConfig.js                # Clerk configured-or-not check
│   │   └── index.js                      # Express app
│   └── .env.example
└── client/
    └── src/
        ├── App.jsx                          # auth gate + main dashboard
        ├── main.jsx                         # ThemeProvider + conditional ClerkProvider
        ├── lib/
        │   ├── csvExport.js                 # audit log -> CSV
        │   ├── apiClient.js                 # fetch wrapper, attaches auth token
        │   ├── apiBase.js                   # API base URL (dev proxy vs deployed)
        │   ├── clerkConfig.js               # Clerk enabled/key check
        │   └── ThemeContext.jsx             # app-wide theme, incl. Clerk's own modal
        └── components/
            ├── MetricRow.jsx
            ├── RevenueProjection.jsx        # monthly/annual impact panel
            ├── CategoryChart.jsx
            ├── EscalationQueue.jsx          # human-in-the-loop resolution
            ├── RealPaymentPanel.jsx         # real Checkout trigger + pull-in
            ├── AuditLedger.jsx              # ledger UI, messages, CSV export
            ├── CheckoutDropoffPanel.jsx     # checkout drop-off dashboard + ledger
            ├── AuthBridge.jsx               # wires Clerk token into apiClient
            ├── SignInScreen.jsx             # sign-in gate UI
            └── ThemeToggle.jsx              # shared light/dark toggle
```
