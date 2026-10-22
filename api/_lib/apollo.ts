const APOLLO_CONTACTS_URL = "https://api.apollo.io/api/v1/contacts";

// The Apollo list every hero signup lands in. Follow-up sequences in Apollo
// enrol from this label, so renaming it here means renaming it there too.
export const SIGNUP_LABEL = "Website signup";

export type SignupSource = "hero";

/**
 * Creates (or, through run_dedupe, updates) an Apollo contact for a visitor
 * who started signup on the marketing site. The key needs the
 * api/v1/contacts/create permission. Returns whether Apollo accepted it;
 * never throws, because a failed lead push must not stop the signup.
 */
export async function createApolloContact(
  email: string,
  source: SignupSource,
  apiKey: string,
  timeoutMs = 4000,
): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(APOLLO_CONTACTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        email,
        label_names: [SIGNUP_LABEL, `${SIGNUP_LABEL}: ${source}`],
        run_dedupe: true,
      }),
      signal: controller.signal,
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}
