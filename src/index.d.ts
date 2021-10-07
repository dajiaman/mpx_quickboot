
// declaration for mpx mode
// eslint-disable-next-line @typescript-eslint/camelcase
declare let __mpx_mode__: 'wx' | 'ali' | 'swan' | 'qq' | 'tt' | 'web'
// Wildcard module declarations for ?resolve case
declare module '*?resolve' {
  const resourcePath: string
  export default resourcePath
}

declare namespace NodeJS {
  interface ProcessEnv {
    MODE: string;
  }
}
