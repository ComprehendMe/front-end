type ApiOptions = Omit<RequestInit, "body" | "credentials"> & {
  body?: unknown;
};

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T | null> {
  const headers = new Headers(options.headers);
  const contentType = headers.get("Content-Type");
  const shouldSerializeJsonBody = contentType?.includes("application/json");

  const normalizedBody =
    shouldSerializeJsonBody && options.body && typeof options.body !== "string"
      ? JSON.stringify(options.body)
      : (options.body as BodyInit | null | undefined);

  const response = await fetch(`/api${path}`, {
    ...options,
    headers,
    credentials: "include",
    body: normalizedBody,
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  if (response.status === 201 || response.status === 204) {
    const text = await response.text();

    if (!text) {
      return null;
    }

    return JSON.parse(text) as T;
  }

  return (await response.json()) as T;
}
