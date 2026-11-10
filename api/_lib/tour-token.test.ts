import { createHash, createPrivateKey, createPublicKey, sign } from "node:crypto";
import { describe, expect, it } from "vitest";
import { MAX_TOKEN_LENGTH, parseRevokedIds, verifyTourToken } from "./tour-token";

// The shared test vector (tour-link spec, M7 ZEN-737/783). The public key and
// token are copied from the spec; the zensus repo signs with the matching
// private key. No private key is stored anywhere: the tests that need to sign
// a variant derive it from the spec's seed phrase, exactly as the zensus side
// does at test time.
const PUBLIC_KEY = "MCowBQYDK2VwAyEAqd7nwhCM01XmeUI6vTJQahbUnyAv+sCPmI4xQ9RCtyY=";
const TOKEN =
  "v1.eyJpIjoiMDEyMzQ1Njc4OWFiY2RlZiIsIm4iOiJBY21lIFJvYm90aWNzIiwiZSI6NDEwMjQ0NDgwMH0." +
  "u87t-h-ZNzk4wY7xFZ9DIWPtzeLE3YU0CJv9A-ncFnBjNxpFNhanktfmyqAqv4vd5PGmPly-p9K_2aeiunN3CA";
const EXPIRY = 4102444800; // 2100-01-01T00:00:00Z
const NOW = 1794268800; // 2026-11-10T00:00:00Z

const seed = createHash("sha256").update("zensus-tour-link-test-vector-v1").digest();
const privateKey = createPrivateKey({
  key: Buffer.concat([Buffer.from("302e020100300506032b657004220420", "hex"), seed]),
  format: "der",
  type: "pkcs8",
});

const b64url = (b: Buffer | string) => Buffer.from(b).toString("base64url");

/** Signs any payload text with the test-vector key, as the zensus side would. */
function mint(payload: string | Record<string, unknown>): string {
  const json = typeof payload === "string" ? payload : JSON.stringify(payload);
  const head = `v1.${b64url(json)}`;
  return `${head}.${b64url(sign(null, Buffer.from(head, "ascii"), privateKey))}`;
}

const opts = (over: Partial<Parameters<typeof verifyTourToken>[1]> = {}) => ({
  publicKey: PUBLIC_KEY,
  revokedIds: "",
  nowSeconds: NOW,
  ...over,
});

const good = { i: "0123456789abcdef", n: "Acme Robotics", e: EXPIRY };

describe("tour link token (spec test vector)", () => {
  it("derives the spec's public key from the seed, so minted variants are real signatures", () => {
    const spki = createPublicKey(privateKey).export({ format: "der", type: "spki" });
    expect(spki.toString("base64")).toBe(PUBLIC_KEY);
    expect(mint(good)).toBe(TOKEN);
  });

  it("accepts the test vector", () => {
    expect(verifyTourToken(TOKEN, opts())).toEqual({
      ok: true,
      data: { id: "0123456789abcdef", name: "Acme Robotics", expiresAt: EXPIRY },
    });
  });

  it("rejects a tampered payload (signature no longer matches)", () => {
    const [, , sig] = TOKEN.split(".");
    const forged = `v1.${b64url(JSON.stringify({ ...good, n: "Evil Corp" }))}.${sig}`;
    expect(verifyTourToken(forged, opts())).toMatchObject({ ok: false, error: "signature" });
  });

  it("rejects a tampered signature", () => {
    const [p, payload, sig] = TOKEN.split(".");
    const bytes = Buffer.from(sig, "base64url");
    bytes[0] ^= 0x01;
    expect(verifyTourToken(`${p}.${payload}.${b64url(bytes)}`, opts())).toMatchObject({ ok: false, error: "signature" });
  });

  it("rejects an expired link by the clock, at and after the expiry second", () => {
    expect(verifyTourToken(TOKEN, opts({ nowSeconds: EXPIRY - 1 })).ok).toBe(true);
    expect(verifyTourToken(TOKEN, opts({ nowSeconds: EXPIRY }))).toMatchObject({ ok: false, error: "expired" });
    expect(verifyTourToken(TOKEN, opts({ nowSeconds: EXPIRY + 3600 }))).toMatchObject({ ok: false, error: "expired" });
  });

  it("rejects a revoked id, ignoring whitespace in the list", () => {
    expect(verifyTourToken(TOKEN, opts({ revokedIds: " aaaaaaaaaaaaaaaa , 0123456789abcdef\n" }))).toMatchObject({
      ok: false,
      error: "revoked",
    });
    expect(verifyTourToken(TOKEN, opts({ revokedIds: "aaaaaaaaaaaaaaaa" })).ok).toBe(true);
  });

  it("rejects a wrong prefix, even when the signature covers it", () => {
    expect(verifyTourToken(TOKEN.replace(/^v1\./, "v2."), opts())).toMatchObject({ ok: false, error: "prefix" });
    const head = `v2.${b64url(JSON.stringify(good))}`;
    const signedV2 = `${head}.${b64url(sign(null, Buffer.from(head), privateKey))}`;
    expect(verifyTourToken(signedV2, opts())).toMatchObject({ ok: false, error: "prefix" });
  });

  it("rejects extra or missing payload keys even when correctly signed", () => {
    expect(verifyTourToken(mint({ ...good, admin: true }), opts())).toMatchObject({ ok: false, error: "payload_keys" });
    const { e: _e, ...noExpiry } = good;
    expect(verifyTourToken(mint(noExpiry), opts())).toMatchObject({ ok: false, error: "payload_keys" });
  });

  it("rejects wrong payload types and values even when correctly signed", () => {
    const bad = (over: Record<string, unknown>) => verifyTourToken(mint({ ...good, ...over }), opts()).ok;
    expect(bad({ i: "0123456789ABCDEF" })).toBe(false);
    expect(bad({ i: "0123" })).toBe(false);
    expect(bad({ n: "" })).toBe(false);
    expect(bad({ n: "x".repeat(61) })).toBe(false);
    expect(bad({ n: "Line\nbreak" })).toBe(false);
    expect(bad({ n: 42 })).toBe(false);
    expect(bad({ e: "4102444800" })).toBe(false);
    expect(bad({ e: 4102444800.5 })).toBe(false);
    expect(verifyTourToken(mint("[1,2,3]"), opts()).ok).toBe(false);
    expect(verifyTourToken(mint("not json"), opts()).ok).toBe(false);
    // The inverse: the limits themselves are accepted.
    expect(bad({ n: "x".repeat(60) })).toBe(true);
    expect(bad({ n: "Zoë & Søn GmbH" })).toBe(true);
  });

  it("rejects an over-long token before doing any crypto", () => {
    const long = `${TOKEN}${"A".repeat(MAX_TOKEN_LENGTH)}`;
    expect(verifyTourToken(long, opts())).toMatchObject({ ok: false, error: "too_long" });
  });

  it("rejects malformed shapes and encodings", () => {
    for (const t of [undefined, null, 42, "", "v1", "v1.abc", `${TOKEN}.extra`, TOKEN.replace(/\.([^.]+)$/, ".$1=="), TOKEN.replace("eyJ", "ey+")]) {
      expect(verifyTourToken(t, opts()).ok).toBe(false);
    }
  });

  it("refuses everything when the public key is missing or not Ed25519", () => {
    expect(verifyTourToken(TOKEN, opts({ publicKey: undefined }))).toMatchObject({ ok: false, error: "no_public_key" });
    expect(verifyTourToken(TOKEN, opts({ publicKey: "bm90IGEga2V5" }))).toMatchObject({ ok: false, error: "bad_public_key" });
  });

  it("parses the revocation list", () => {
    expect([...parseRevokedIds(" a , b,,c ")]).toEqual(["a", "b", "c"]);
    expect(parseRevokedIds(undefined).size).toBe(0);
  });
});
