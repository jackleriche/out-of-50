/**
 * Mail transport.
 *
 * Local development gets a console transport that prints the message and
 * writes it to .mail/ as an .eml you can open — so the invite flow is fully
 * testable without an API key, a verified domain, or sending anything to a
 * real person by accident.
 */

export type Message = { to: string; subject: string; html: string };

export type Transport = {
  name: string;
  send: (message: Message) => Promise<void>;
};

export const consoleTransport: Transport = {
  name: "console",
  send: async (m) => {
    const line = "─".repeat(60);
    // eslint-disable-next-line no-console
    console.log(`\n${line}\n📧  ${m.subject}\n    to: ${m.to}\n${line}`);

    // Written to disk so you can open it in a mail client and check it renders.
    if (typeof window === "undefined") {
      const { mkdir, writeFile } = await import("node:fs/promises");
      await mkdir(".mail", { recursive: true });
      const file = `.mail/${Date.now()}-${m.to.replace(/[^a-z0-9]/gi, "_")}.eml`;
      await writeFile(
        file,
        `To: ${m.to}\nSubject: ${m.subject}\nContent-Type: text/html; charset=utf-8\n\n${m.html}`
      );
      // eslint-disable-next-line no-console
      console.log(`    saved: ${file}\n`);
    }
  },
};

/** Discards everything. Used in tests so nothing can escape. */
export const nullTransport: Transport = { name: "null", send: async () => {} };

const resendTransport = (apiKey: string, from: string): Transport => ({
  name: "resend",
  send: async (m) => {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: m.to, subject: m.subject, html: m.html }),
    });
    if (!res.ok) throw new Error(`Resend refused the message: ${res.status}`);
  },
});

/**
 * No key, no live sending. The default is deliberately the safe one — an
 * accidental blast to a real invite list is not a recoverable mistake.
 */
export const selectTransport = (): Transport => {
  if (process.env.NODE_ENV === "test") return nullTransport;

  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) return consoleTransport;

  return resendTransport(key, from);
};

export const createMailer = (transport: Transport = selectTransport()) => ({
  transport: transport.name,
  send: async (message: Message): Promise<void> => {
    if (!message.to) throw new Error("Cannot send: no recipient");
    await transport.send(message);
  },
});
