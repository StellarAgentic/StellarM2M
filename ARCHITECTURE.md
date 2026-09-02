# 🏗️ StellarM2M: Architecture Deep Dive

This document provides a comprehensive overview of the technical architecture of the **StellarM2M**. It is designed for contributors, maintainers, and integrators who want to understand how the SDK operates under the hood.

---

## 1. System Overview

The StellarM2M acts as a bridge between **Autonomous AI Agents** (like LangChain or CrewAI) and the **Stellar Network**. It intercepts HTTP traffic to data providers (merchants), detects paywalls, and automatically negotiates micro-transactions on-chain so the agent can access paid APIs seamlessly.

### High-Level Architecture Diagram

```mermaid
graph TB
    subgraph "AI Frameworks"
        LC[LangChain Agent]
        CW[CrewAI Agent]
        AG[AutoGen Agent]
        MCP[MCP Server]
    end

    subgraph "StellarM2M"
        INT[PaywallInterceptor<br/>httpx middleware]
        WL[AgentWallet<br/>Keypair + Balance + Trustlines]
        TH[Transaction History<br/>Spending Reports]
        RL[Rate Limiter<br/>Per-Merchant Caps]
        WH[Webhook Notifier<br/>Payment Events]
    end

    subgraph "Stellar Network"
        HZ[Horizon API<br/>Testnet / Mainnet]
        SB[Soroban Smart Contracts<br/>Escrow + Settlement]
        FB[Friendbot<br/>Testnet Funding]
    end

    subgraph "External"
        MA[Merchant API<br/>Data Provider]
        MS[Merchant SDK<br/>Flask / FastAPI]
        AD[Analytics Dashboard<br/>Budget Monitoring]
    end

    LC --> INT
    CW --> INT
    AG --> INT
    MCP --> INT

    INT --> WL
    INT --> RL
    INT --> MA
    INT --> WH

    WL --> HZ
    WL --> SB
    WL --> FB
    WH --> TH
    TH --> AD

    MA --> MS
    MS --> HZ
```

---

## 2. Core Components

### 2.1 `AgentWallet` (Wallet Management)
The `AgentWallet` is the foundational class that holds the agent's identity and funds.
- **Keypair Management**: Uses `stellar_sdk.Keypair` to securely sign transactions in memory.
- **Non-Custodial**: The SDK never transmits or persists the Secret Key.
- **Balance & Trustlines**: Interfaces with the Stellar Horizon API to fetch native XLM balances and establish Trustlines for assets like USDC.
- **Friendbot Integration**: Automatically funds new testnet accounts for frictionless local development.

### 2.2 `PaywallInterceptor` (HTTP Middleware)
The core engine of the SDK. It wraps an `httpx.AsyncClient` or `httpx.Client`.
- **402 Detection**: Intercepts `HTTP 402 Payment Required` responses from merchant APIs.
- **Payment Negotiation**: Reads the required payment amount and asset (e.g., `0.05 USDC`) from the 402 response headers or body.
- **Auto-Retry**: Once the `AgentWallet` completes the payment, the interceptor re-sends the original HTTP request, injecting a cryptographic receipt (`x-Stellar-TxHash`) into the header.

### 2.3 `RateLimiter` (Security & Guardrails)
Since agents operate autonomously, strict guardrails are necessary.
- **Hard Caps**: Developers set a `max_spend_usdc` parameter (e.g., $10). If an agent attempts to spend beyond this, the SDK raises an exception and blocks the transaction.
- **Velocity Limits**: Prevents runaway loops where an agent rapidly drains funds by accidentally calling a paid API hundreds of times per second.

---

## 3. The 402 Protocol & Payment Flow

The SDK relies on standard HTTP status codes to facilitate machine-to-machine commerce.

### Standardized 402 Response (Merchant Side)
When an agent hits a paid endpoint without a valid receipt, the merchant returns a 402 status code with structured payload:
```json
{
  "error": "Payment Required",
  "amount": "0.05",
  "asset": "USDC",
  "destination": "G_MERCHANT_STELLAR_ADDRESS"
}
```

### Auto-Payment Sequence

```mermaid
sequenceDiagram
    participant A as AI Agent
    participant INT as PaywallInterceptor
    participant RL as Rate Limiter
    participant W as AgentWallet
    participant S as Stellar Network
    participant M as Merchant API

    A->>INT: GET "https://api.merchant.com/data"
    INT->>M: HTTP GET
    M-->>INT: 402 Payment Required (0.05 USDC)
    
    Note over INT,RL: Safety Checks
    INT->>RL: Check max_spend limit
    RL-->>INT: Approved

    Note over INT,W: Auto-Payment
    INT->>W: pay(merchant, 0.05 USDC)
    W->>S: Sign & Submit Transaction
    S-->>W: Return Transaction Hash
    
    Note over INT,M: Retry Request
    INT->>M: HTTP GET + Header: {x-Stellar-TxHash}
    M-->>INT: 200 OK (JSON Data)
    INT-->>A: Return JSON Data (Agent unaware of payment)
```

---

## 4. Security Model

Security is the primary launch gate for mainnet enablement.

1. **Local Signing**: The SDK is strictly a local middleware. Transactions are constructed and cryptographically signed inside the local Python process. Private keys are never exposed to merchants or external servers.
2. **Synchronous Settlement Validation**: Merchants verify the `TxHash` directly against the Stellar ledger via the Horizon API to ensure the payment is final before serving data.
3. **Escrow (Phase 2)**: Future versions will utilize Soroban Smart Contracts to hold funds in escrow until the merchant successfully delivers the data, ensuring the agent doesn't pay for failed API requests.

---

## 5. Technology Choices

- **Language**: Python 3.10+ (The dominant language of AI/ML).
- **HTTP Client**: `httpx` (Chosen over `requests` because it supports both sync and async architectures natively, which is critical for high-throughput agents).
- **Blockchain Interface**: `stellar-sdk` (The official Stellar Python SDK).
- **Package Management**: `uv` (Chosen for ultra-fast dependency resolution and virtual environment management).

---

## 6. Future Architecture (Phase 3)

As the ecosystem scales, the architecture will expand to include:
- **Soroban Smart Contracts**: For conditional payments and subscriptions (streaming payments).
- **Model Context Protocol (MCP)**: Exposing the wallet capabilities as an MCP Server so agents like Claude can dynamically discover and use the wallet as a tool.
- **Cross-Chain**: Leveraging Circle CCTP to allow agents holding Stellar USDC to pay merchants requiring Ethereum/Solana USDC seamlessly.
