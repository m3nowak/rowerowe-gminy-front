import { map, Observable, reduce } from 'rxjs';

function readableStreamToObservable(stream: ReadableStream<string>): Observable<string> {
  return new Observable<string>((observer) => {
    const reader = stream.getReader();
    function read() {
      reader
        .read()
        .then(({ done, value }) => {
          if (done) {
            observer.complete();
            return;
          }
          if (value) {
            observer.next(value);
          }
          read();
        })
        .catch((err) => {
          observer.error(err);
        });
    }
    read();
    return () => reader.releaseLock();
  });
}

export function gunzip<T>(input: Blob): Observable<T | undefined> {
  console.log('Input blob size:', input.size);
  console.log('Input blob type:', input.type);
  let result$;
  if (input.type === 'application/json') {
    // const reader = new FileReader();
    // reader.readAsText(input);
    const result = input.stream().pipeThrough(new TextDecoderStream());
    result$ = readableStreamToObservable(result);
  } else {
    const ds = new DecompressionStream('gzip');
    const result = input.stream().pipeThrough(ds).pipeThrough(new TextDecoderStream()); //.getReader();
    result$ = readableStreamToObservable(result);
  }
  return result$.pipe(
    reduce((acc, v) => acc + v, ''),
    map((v) => {
      if (v === undefined) {
        return undefined;
      } else {
        return JSON.parse(v) as T;
      }
    }),
  );
}
