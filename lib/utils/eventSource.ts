export const createEventSource = (
  url: string,
  onMessage: (data: string) => void,
  onError: (error: unknown) => void
) => {
  const eventSource = new EventSource(url);

  eventSource.onmessage = (event: MessageEvent) => {
    onMessage(event.data);
  };

  eventSource.onerror = (error) => {
    onError(error);
    eventSource.close();
  };

  return eventSource;
};
