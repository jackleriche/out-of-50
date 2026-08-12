import { theme } from "@/lib/theme";

/**
 * The invite email. This is the whole product's front door — if it lands in
 * spam or reads like marketing, nobody scores anything.
 *
 * Deliberately short, one link, no images, and it says how long it takes.
 */

type Props = {
  brewerName: string;
  beerName: string | null;
  url: string;
  blind: boolean;
  anonymous: boolean;
};

export function InviteEmail({ brewerName, beerName, url, blind, anonymous }: Props) {
  const subject = blind
    ? `${brewerName} wants you to guess a beer`
    : `${brewerName} would like your notes on ${beerName}`;

  return (
    <html>
      <body
        style={{
          fontFamily: theme.type.family.sans,
          color: theme.colour.ink,
          backgroundColor: theme.colour.ground,
          padding: "24px",
        }}
      >
        <table width="100%" cellPadding={0} cellSpacing={0}>
          <tbody>
            <tr>
              <td align="center">
                <table
                  width="100%"
                  style={{ maxWidth: theme.layout.reviewer, backgroundColor: theme.colour.sheet }}
                  cellPadding={0}
                  cellSpacing={0}
                >
                  <tbody>
                    <tr>
                      <td style={{ padding: "32px" }}>
                        <p style={{ fontSize: theme.type.size.body, margin: 0 }}>
                          {brewerName} has {blind ? "a beer for you to try blind" : `poured ${beerName}`} and
                          would like it scored properly.
                        </p>

                        <p style={{ fontSize: theme.type.size.body }}>
                          It walks you through aroma, appearance, flavour, mouthfeel and
                          overall impression — the same sheet a competition judge uses.
                          Takes about five minutes with the glass in front of you.
                        </p>

                        {anonymous && (
                          <p style={{ fontSize: theme.type.size.small, color: theme.colour.muted }}>
                            Your scoresheet goes in anonymously. {brewerName} sees the scores,
                            not who gave them.
                          </p>
                        )}

                        <p style={{ margin: "24px 0" }}>
                          <a
                            href={url}
                            style={{
                              backgroundColor: theme.colour.biro,
                              color: theme.colour.sheet,
                              padding: "12px 24px",
                              textDecoration: "none",
                              fontSize: theme.type.size.body,
                              borderRadius: theme.radius.sharp,
                            }}
                          >
                            Score the beer
                          </a>
                        </p>

                        <p style={{ fontSize: theme.type.size.small, color: theme.colour.muted }}>
                          Not a beer person? Ignore this — it only goes out twice more.
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}

export const inviteSubject = ({ brewerName, beerName, blind }: Props): string =>
  blind
    ? `${brewerName} wants you to guess a beer`
    : `${brewerName} would like your notes on ${beerName}`;
