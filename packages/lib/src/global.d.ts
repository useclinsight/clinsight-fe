declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
  }
}

declare const process: {
  env: NodeJS.ProcessEnv;
};

declare const Buffer: {
  from(
    str: string,
    encoding?: string,
  ): {
    toString(encoding?: string): string;
  };
};
