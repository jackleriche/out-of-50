import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMailer, type Transport } from "./mailer";

/**
 * Mail goes through a transport so local development never needs an API key
 * and tests never send anything.
 */

const capture = (): Transport & { sent: unknown[] } => {
  const sent: unknown[] = [];
  return { name: "capture", send: async (m) => void sent.push(m), sent };
};

describe("createMailer", () => {
  it("hands the message to whichever transport it was given", async () => {
    const t = capture();
    await createMailer(t).send({ to: "a@b.com", subject: "Hi", html: "<p>Hi</p>" });
    expect(t.sent).toHaveLength(1);
  });

  it("refuses to send without a recipient rather than failing silently", async () => {
    const t = capture();
    await expect(
      createMailer(t).send({ to: "", subject: "Hi", html: "<p>Hi</p>" })
    ).rejects.toThrow(/recipient/i);
  });

  it("reports which transport is in use, so nobody thinks console mail was delivered", () => {
    expect(createMailer(capture()).transport).toBe("capture");
  });
});

describe("transport selection", () => {
  beforeEach(() => vi.unstubAllEnvs());

  it("falls back to console when no API key is configured", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("RESEND_API_KEY", "");
    const { selectTransport } = await import("./mailer");
    expect(selectTransport().name).toBe("console");
  });

  it("uses Resend once a key is present", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("EMAIL_FROM", "scores@example.com");
    const { selectTransport } = await import("./mailer");
    expect(selectTransport().name).toBe("resend");
  });

  it("never picks a live transport during tests", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("NODE_ENV", "test");
    const { selectTransport } = await import("./mailer");
    expect(selectTransport().name).not.toBe("resend");
  });
});
