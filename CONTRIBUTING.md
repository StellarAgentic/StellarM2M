# Contributing to StellarM2M 🚀

First off, thank you for considering contributing to StellarM2M! It's people like you that make the open-source community such an amazing place to learn, inspire, and create. 

We welcome contributions of all kinds: bug fixes, new features, documentation improvements, and more.

## 🌟 How Can I Contribute?

### 1. Reporting Bugs
If you find a bug, please create a new Issue on GitHub. Include:
- A clear and descriptive title
- Steps to reproduce the issue
- The expected behavior vs. the actual behavior
- Your OS and Python version

### 2. Suggesting Enhancements
Have an idea for a new feature? We'd love to hear it! Open an Issue and tag it as an `enhancement`. Describe how it works and why it would be beneficial for the Stellar AI ecosystem.

### 3. Your First Code Contribution
Unsure where to begin contributing? You can start by looking through `good first issue` and `help wanted` issues on our GitHub:
- **`good first issue`**: Issues that should only require a few lines of code and are great for getting familiar with the codebase.
- **`help wanted`**: Issues that we are actively looking for the community to pick up.

## 🛠️ Development Setup

We use `uv` for lightning-fast Python package management. 

1. **Fork the repository** to your own GitHub account.
2. **Clone your fork locally:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/stellar-m2m.git
   cd stellar-m2m
   ```
3. **Sync dependencies:**
   *(This automatically creates a virtual environment and installs everything you need)*
   ```bash
   uv sync
   ```
4. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🧪 Testing

We use `pytest` for our unit testing suite. Before submitting a pull request, ensure all tests pass:

```bash
uv run pytest
```

If you are adding new features, please write tests for them! 

## 📝 Pull Request Process

1. Ensure your code follows the existing style and conventions.
2. Update the README.md or PRD.md with details of changes if applicable.
3. Push your branch to your fork on GitHub.
4. Open a Pull Request against our `main` branch.
5. In the PR description, explain what you did, why you did it, and link to any relevant Issues.
6. A maintainer will review your code. We may request some changes before merging. 

## 💰 Bounties (GrantFox & Drips)

By contributing to this repository, you may be eligible for community bounties or recurring funding through the **Stellar Wave Program** on Drips! 

Make sure to link your GitHub account to your Drips profile. High-quality PRs, documentation, and active community participation are exactly what we look for when distributing rewards.

---
*Happy Building! Together we are making Stellar the undisputed settlement layer for AI agent commerce.*
