import { describe, it, expect } from "vitest";
import { friendlyError } from "../helpers/friendly-error.js";

describe("friendlyError", () => {
  // ---------------------------------------------------------------------------
  // Null / falsy input
  // ---------------------------------------------------------------------------
  it("returns null for null", () => {
    expect(friendlyError(null)).toBeNull();
  });

  it("returns null for undefined", () => {
    expect(friendlyError(undefined)).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(friendlyError("")).toBeNull();
  });

  it("returns null for 0", () => {
    expect(friendlyError(0)).toBeNull();
  });

  // ---------------------------------------------------------------------------
  // Rate limit
  // ---------------------------------------------------------------------------
  it("maps rate limit error to friendly message", () => {
    expect(friendlyError("rate limit exceeded")).toBe(
      "Muitas tentativas. Aguarde alguns minutos e tente novamente."
    );
    expect(friendlyError("Rate Limit")).toBe(
      "Muitas tentativas. Aguarde alguns minutos e tente novamente."
    );
  });

  it("maps rate limit error object to friendly message", () => {
    expect(friendlyError({ message: "rate limit exceeded" })).toBe(
      "Muitas tentativas. Aguarde alguns minutos e tente novamente."
    );
  });

  // ---------------------------------------------------------------------------
  // Invalid email
  // ---------------------------------------------------------------------------
  it("maps invalid email error to friendly message", () => {
    expect(friendlyError("invalid email address")).toBe(
      "Digite um endereço de e-mail válido."
    );
    expect(friendlyError("Invalid Email")).toBe(
      "Digite um endereço de e-mail válido."
    );
  });

  // ---------------------------------------------------------------------------
  // User not found / signups not allowed
  // ---------------------------------------------------------------------------
  it("maps 'signups not allowed' to invite message", () => {
    expect(friendlyError("signups not allowed")).toBe(
      "Este e-mail ainda não foi convidado para o FitPlan."
    );
    expect(friendlyError("signup not allowed")).toBe(
      "Este e-mail ainda não foi convidado para o FitPlan."
    );
  });

  it("maps 'user not found' to invite message", () => {
    expect(friendlyError("user not found")).toBe(
      "Este e-mail ainda não foi convidado para o FitPlan."
    );
    expect(friendlyError("User Not Found")).toBe(
      "Este e-mail ainda não foi convidado para o FitPlan."
    );
  });

  // ---------------------------------------------------------------------------
  // Expired / invalid token / OTP invalid
  // ---------------------------------------------------------------------------
  it("maps expired token to expired message", () => {
    expect(friendlyError("token has expired")).toBe(
      "Este link expirou ou já foi usado. Solicite um novo link de acesso."
    );
    expect(friendlyError("link expired")).toBe(
      "Este link expirou ou já foi usado. Solicite um novo link de acesso."
    );
  });

  it("maps invalid token to expired message", () => {
    expect(friendlyError("invalid token provided")).toBe(
      "Este link expirou ou já foi usado. Solicite um novo link de acesso."
    );
  });

  it("maps OTP invalid to expired message", () => {
    expect(friendlyError("otp invalid")).toBe(
      "Este link expirou ou já foi usado. Solicite um novo link de acesso."
    );
    expect(friendlyError("OTP is Invalid")).toBe(
      "Este link expirou ou já foi usado. Solicite um novo link de acesso."
    );
  });

  // ---------------------------------------------------------------------------
  // Network / fetch errors
  // ---------------------------------------------------------------------------
  it("maps fetch failure to connection message", () => {
    expect(friendlyError("failed to fetch")).toBe(
      "Não foi possível conectar. Confira sua internet e tente novamente."
    );
    expect(friendlyError("Failed to Fetch")).toBe(
      "Não foi possível conectar. Confira sua internet e tente novamente."
    );
  });

  it("maps network error to connection message", () => {
    expect(friendlyError("network error")).toBe(
      "Não foi possível conectar. Confira sua internet e tente novamente."
    );
  });

  it("maps offline to connection message", () => {
    expect(friendlyError("you are offline")).toBe(
      "Não foi possível conectar. Confira sua internet e tente novamente."
    );
  });

  // ---------------------------------------------------------------------------
  // + encoding in URL error messages
  // ---------------------------------------------------------------------------
  it("replaces + with space before matching", () => {
    expect(friendlyError("user+not+found")).toBe(
      "Este e-mail ainda não foi convidado para o FitPlan."
    );
    expect(friendlyError("rate+limit+exceeded")).toBe(
      "Muitas tentativas. Aguarde alguns minutos e tente novamente."
    );
  });

  // ---------------------------------------------------------------------------
  // Fallback — unknown errors returned as-is
  // ---------------------------------------------------------------------------
  it("returns message as-is for unknown errors", () => {
    expect(friendlyError("something unexpected happened")).toBe(
      "something unexpected happened"
    );
  });

  it("uses .message property from Error objects", () => {
    expect(friendlyError(new Error("rate limit exceeded"))).toBe(
      "Muitas tentativas. Aguarde alguns minutos e tente novamente."
    );
  });

  it("returns stringified value for objects without .message", () => {
    expect(friendlyError({ code: 500 })).toBe("[object Object]");
  });
});
