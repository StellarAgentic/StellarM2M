# Product Requirements Document (PRD)
## StellarM2M

### 1. Executive Summary
**Product Name:** StellarM2M
**Tagline:** Giving autonomous robots their own bank accounts.
**Vision:** To provide seamless, agentic commerce infrastructure for the Stellar network, allowing AI agents to negotiate, pay, and settle machine-to-machine micro-transactions instantly without human intervention.

### 2. Problem Statement
The AI industry is rapidly moving from "chatbots" to "autonomous agents" that perform actions on the web. However, these agents hit a hard barrier when interacting with premium data or APIs: they cannot hold credit cards, they cannot pass KYC checks, and they cannot manage Stripe subscriptions.
Currently, if an AI agent hits a `402 Payment Required` HTTP error, it crashes.

### 3. Proposed Solution
A lightweight Python SDK built on top of the official `stellar-sdk` and `httpx`. The SDK acts as a financial middleware (interceptor) for AI agents. 
By providing the agent with a programmable Soroban wallet (via a Stellar Secret Key), the SDK can automatically intercept `402` paywalls, negotiate the fee, execute the micro-payment on the Stellar blockchain (in XLM or USDC), receive the cryptographic receipt, and retry the request—all transparently to the AI agent.

### 4. Target Audience
* **AI Developers:** Building autonomous swarms using frameworks like LangChain, AutoGen, or CrewAI.
* **Data Merchants:** Companies exposing premium APIs who want to monetize on a pay-per-call basis without dealing with traditional fiat payment processors.

### 5. Minimum Viable Product (MVP) Scope (Week 1)
The MVP will prove the core concept using Testnet XLM.

#### 5.1 Project Scaffolding & Setup
*   **Initialize the repository using `uv`:** Use `uv init` to create a lightweight, fast Python environment.
*   **Configure `pyproject.toml`:** Define `stellar-sdk` and `httpx` as core dependencies, along with project metadata.
*   **Setup ESLint and Prettier:** Add standard formatting and linting for any frontend tools and JSON/Markdown files.

#### 5.2 Core `AgentWallet` Class
*   **Keypair generation:** Use `stellar_sdk.Keypair.random()` to generate and securely store the agent's Secret Key in memory (never persisted).
*   **Balance querying:** Implement `get_balance()` using `stellar_sdk.Server` connected to the Testnet Horizon URL to fetch XLM/USDC balances.
*   **Transaction signing:** Use the agent's Secret Key to sign built transactions using the SDK's `TransactionBuilder`.

#### 5.3 `PaywallInterceptor` Middleware (402 Handling)
*   **Intercept requests:** Build a custom `httpx.Auth` or middleware class that wraps outgoing requests.
*   **Detect `402` headers:** Parse HTTP 402 responses and extract the required payment amount and destination Stellar address from custom headers (e.g., `x-stellar-payment-amount`).
*   **Execute payment:** Call `AgentWallet.pay()` asynchronously.
*   **Retry request:** Re-send the original request, attaching the successful transaction hash (receipt) in the headers.

#### 5.4 Automatic Testnet Funding
*   **Friendbot Integration:** Automatically call `https://friendbot.stellar.org/?addr={public_key}` for any new wallet generated in Testnet mode.
*   **0 balance detection:** Query Horizon before funding to ensure the wallet isn't already active.

#### 5.5 Developer CLI Tools
*   **`stellar-agent` CLI:** Use `click` or `argparse` to build a simple command-line interface.
*   **`stellar-agent fund`:** Command to trigger the Friendbot API for a given public key.
*   **`stellar-agent balance`:** Command to quickly check the balance of the agent's wallet.

#### 5.6 End-to-End Demo
*   **Mock Merchant Server:** Build a minimal FastAPI/Flask app that always returns `402 Payment Required` unless a valid transaction hash is provided in the headers.
*   **Agent Script:** Write a short script demonstrating the `AgentWallet` and `PaywallInterceptor` automatically bypassing the mock merchant's paywall.

#### 5.7 Unit Test Suite (`pytest`)
*   **Keypair tests:** Ensure generated keys are valid Stellar formats.
*   **Mock Horizon API:** Use `pytest-httpx` or `responses` to mock Horizon server responses so tests don't rely on network connectivity.
*   **Retry mechanics:** Mock a 402 error and ensure the interceptor successfully retries exactly once after a simulated payment.

### 6. Phase 2 Features (Weeks 2-3)

#### 6.1 USDC Trustline Auto-Establishment
*   **Missing trustline detection:** Query account balances to check for the official USDC asset issuer before sending/receiving USDC.
*   **`change_trust` operation:** Build and submit a `ChangeTrust` operation to the network if the trustline is missing.
*   **Reserve management:** Ensure the wallet has the minimum XLM balance required (0.5 XLM per trustline) before attempting to establish it.

#### 6.2 Soroban Smart Contract Integration
*   **Escrow contract:** Write a Rust contract using `soroban-sdk` that holds funds in escrow until the merchant provides the data.
*   **Deployment:** Deploy to Stellar Testnet and note the contract ID.
*   **Python bindings:** Use `stellar-sdk` Soroban RPC client to invoke the contract from the Python middleware.

#### 6.3 LangChain & OpenAI Agent Wrappers
*   **LangChain `BaseTool`:** Wrap the wallet functionality in a `@tool` so agents can explicitly call "pay_merchant".
*   **OpenAI JSON schemas:** Provide pre-defined JSON schemas describing the payment function for native OpenAI tool-calling.

#### 6.4 Webhook Notifications & Events
*   **Event listener:** Poll the Horizon API or use SSE (Server-Sent Events) to listen for transactions sent to a merchant's account.
*   **POST webhooks:** Send an HTTP POST request to the merchant's configured webhook URL when a payment finalizes on-chain.

#### 6.5 Transaction History & Spending Reports
*   **Horizon API fetching:** Use `server.payments().for_account()` to retrieve historical data.
*   **Formatting:** Parse the raw Stellar JSON into clean Python dataclasses or Pydantic models.
*   **Export:** Provide utility functions to export the parsed history to CSV or JSON for the user.

#### 6.6 Rate-Limiting & Safety Controls
*   **Storage interface:** Define an abstract base class for tracking spending (e.g., `MemoryStore`, `RedisStore`).
*   **Pre-flight checks:** Before building a transaction, verify that `current_spend + new_amount <= max_spend`.
*   **Enforcement:** Raise a custom `OverSpendLimitError` if the cap is exceeded, blocking the transaction.

#### 6.7 Robust Error Handling
*   **Error mapping:** Catch `stellar_sdk.exceptions` and map them to custom exceptions like `InsufficientFundsError` or `NetworkTimeoutError`.
*   **Exponential backoff:** Use the `tenacity` library to automatically retry Horizon network requests on 5xx errors.

### 7. Phase 3: Ecosystem Growth (Months 2-3)

#### 7.1 MCP (Model Context Protocol) Server
*   **Standard integration:** Implement the MCP server specification to expose the wallet tools locally.
*   **Claude support:** Ensure seamless integration with the Anthropic Claude desktop app via the MCP configuration.

#### 7.2 Pre-built Merchant SDKs
*   **Flask/FastAPI middleware:** Build Python packages that merchants can `pip install` to easily add the 402 logic to their own APIs.
*   **Transaction verification:** The merchant SDK must query the Horizon API to verify the TxHash provided by the agent is valid and intended for the merchant.

#### 7.3 Agent API Marketplace
*   **Decentralized registry:** Use a Soroban smart contract to map API endpoints to their expected prices and metadata.
*   **Frontend UI:** Build a Next.js/React frontend where merchants can register their APIs on the contract.
*   **Agent discovery:** Allow the Python SDK to query this registry contract to find API URLs based on topics or keywords.

#### 7.4 Multi-Chain Interoperability
*   **Ethereum L2 bridging:** Research integration with Circle's CCTP (Cross-Chain Transfer Protocol).
*   **Cross-chain swaps:** Allow the agent to specify payment in an Ethereum L2 token, which gets automatically swapped and bridged to Stellar for final settlement.

#### 7.5 Spending Analytics Dashboard
*   **React dashboard:** Build a web application using Vite/React.
*   **Real-time charting:** Integrate a library like Recharts or Chart.js to visualize the spending data exported by the SDK.
*   **Alerting:** Add simple SMTP email alerting when a specific budget threshold is crossed.

#### 7.6 Interactive Developer Documentation
*   **Docusaurus site:** Set up a static documentation site outlining the SDK's features and tutorials.
*   **API playground:** Integrate an interactive code block (like PyScript or a backend sandbox) where users can try the SDK in the browser.

#### 7.7 Community Bounty Program
*   **GrantFox/Drips:** Set up official pages for bounties.
*   **Developer DAO:** Explore establishing a basic governance token or voting system on Stellar to prioritize future feature requests.

### 8. Success Metrics
* **Developer Onboarding:** Time-to-first-payment for a new developer should be under 2 minutes.
* **Reliability:** 99.9% success rate in automatically resolving `402` errors when the wallet is funded.
* **Grant Funding:** Secure initial funding from the Stellar Community Fund (SCF) or Drips Wave.
