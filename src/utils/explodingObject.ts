export const explodingObject = <T>(message: string): T =>
  new Proxy(
    {},
    {
      get: () => {
        throw new Error(message)
      },
    },
  ) as T
