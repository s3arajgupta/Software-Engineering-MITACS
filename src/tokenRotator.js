/**
 * Multi-Token Pooling and Dynamic Rate-Limit Rotation for GitHub GraphQL API.
 * Rotates between developer personal access tokens to bypass quota ceilings.
 */

class TokenRotator {
  /**
   * @param {string[]} [tokens] - Array of GitHub PAT strings. If omitted, loaded from env.
   */
  constructor(tokens = []) {
    this.tokens = this._initTokens(tokens);
    this.currentIndex = 0;
    this.tokenStats = this.tokens.map((token) => ({
      token,
      remaining: -1,
      resetAt: 0,
      callsCount: 0
    }));
  }

  _initTokens(tokens) {
    if (Array.isArray(tokens) && tokens.length > 0) {
      return tokens.map((t) => t.trim()).filter(Boolean);
    }

    try {
      require("dotenv").config();
    } catch (e) {
      // dotenv optional
    }

    const envTokens = process.env.GITHUB_TOKENS
      ? process.env.GITHUB_TOKENS.split(",").map((t) => t.trim()).filter(Boolean)
      : (process.env.GITHUB_TOKEN ? [process.env.GITHUB_TOKEN.trim()] : []);

    if (envTokens.length > 0) {
      return envTokens;
    }

    return [
      "ghp_SAMPLE_DEVELOPER_TOKEN_01",
      "ghp_SAMPLE_DEVELOPER_TOKEN_02"
    ];
  }

  /**
   * Get the current active token.
   * @returns {string}
   */
  getCurrentToken() {
    if (this.tokens.length === 0) return "";
    return this.tokens[this.currentIndex];
  }

  /**
   * Rotate to the next token in round-robin sequence.
   * @returns {string}
   */
  getNextToken() {
    if (this.tokens.length === 0) return "";
    const token = this.tokens[this.currentIndex];
    this.tokenStats[this.currentIndex].callsCount++;
    this.currentIndex = (this.currentIndex + 1) % this.tokens.length;
    return token;
  }

  /**
   * Update rate-limit statistics for the current token.
   * @param {number} remaining
   * @param {string|number|Date} resetAt
   */
  updateRateLimit(remaining, resetAt) {
    const stat = this.tokenStats[this.currentIndex];
    if (stat) {
      stat.remaining = remaining;
      stat.resetAt = new Date(resetAt).getTime();
    }
  }

  /**
   * Check if all tokens are placeholder sample tokens.
   * @returns {boolean}
   */
  isUsingPlaceholders() {
    return this.tokens.every((t) =>
      t.startsWith("PERSONAL_ACCESS_TOKEN") || t.startsWith("ghp_SAMPLE") || t.startsWith("ghp_EXAMPLE")
    );
  }

  get tokenCount() {
    return this.tokens.length;
  }
}

module.exports = TokenRotator;
