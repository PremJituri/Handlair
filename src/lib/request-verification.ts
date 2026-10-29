// Weak keys isolate verification to one request and cannot retain expired requests.
export function requestVerification<T>(verify: () => Promise<T>) {
  const pending = new WeakMap<Request, Promise<T>>();
  return (request: Request) => {
    const existing = pending.get(request);
    if (existing) return existing;
    const result = verify();
    pending.set(request, result);
    return result;
  };
}