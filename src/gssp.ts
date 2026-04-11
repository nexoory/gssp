import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  PreviewData,
  Redirect,
} from 'next';
import { ParsedUrlQuery } from 'querystring';

export interface CreateGSSPOptions<
  Context extends { [key: string]: any },
  RootContext extends { [key: string]: any } = {},
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData,
> {
  createContext?: (
    ctx: GetServerSidePropsContext<Params, Preview> & RootContext,
  ) =>
    | (GetServerSidePropsContext<Params, Preview> & RootContext & Context)
    | Promise<GetServerSidePropsContext<Params, Preview> & RootContext & Context>;
  errorHandler?: (
    error: unknown,
    ctx: GetServerSidePropsContext<Params, Preview> & RootContext & Context,
  ) => { redirect: Redirect } | { notFound: true } | void;
}

export type GSSPStandaloneUnit<
  Props extends { [key: string]: any },
  Context extends { [key: string]: any } = { [key: string]: any },
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData,
> = (
  ctx: GetServerSidePropsContext<Params, Preview> & Context,
) => Promise<GetServerSidePropsResult<Props>>;

export type GSSPChainedUnit<
  PrevProps extends { [key: string]: any },
  Props extends { [key: string]: any },
  Context extends { [key: string]: any } = { [key: string]: any },
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData,
> = (
  ctx: GetServerSidePropsContext<Params, Preview> & Context & { prevProps: PrevProps },
) => Promise<GetServerSidePropsResult<Props>>;

const createGssp = <
  Context extends { [key: string]: any },
  RootContext extends { [key: string]: any } = {},
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData,
>(
  options: CreateGSSPOptions<
    Context,
    GetServerSidePropsContext<Params, Preview> & RootContext,
    Params,
    Preview
  > = {},
) => {
  const { createContext, errorHandler } = options || {};

  function gssp(): GSSPStandaloneUnit<{}, RootContext, Params, Preview>;

  function gssp<A extends { [key: string]: any }>(
    a: GSSPStandaloneUnit<A, Context & RootContext, Params, Preview>,
  ): GSSPStandaloneUnit<A, RootContext, Params, Preview>;

  function gssp<A extends { [key: string]: any }, B extends { [key: string]: any }>(
    a: GSSPStandaloneUnit<A, Context & RootContext, Params, Preview>,
    b: GSSPChainedUnit<A, B, Context & RootContext, Params, Preview>,
  ): GSSPStandaloneUnit<A & B, RootContext, Params, Preview>;

  function gssp<
    A extends { [key: string]: any },
    B extends { [key: string]: any },
    C extends { [key: string]: any },
  >(
    a: GSSPStandaloneUnit<A, Context & RootContext, Params, Preview>,
    b: GSSPChainedUnit<A, B, Context & RootContext, Params, Preview>,
    c: GSSPChainedUnit<A & B, C, Context & RootContext, Params, Preview>,
  ): GSSPStandaloneUnit<A & B & C, RootContext, Params, Preview>;

  function gssp<
    A extends { [key: string]: any },
    B extends { [key: string]: any },
    C extends { [key: string]: any },
    D extends { [key: string]: any },
  >(
    a: GSSPStandaloneUnit<A, Context & RootContext, Params, Preview>,
    b: GSSPChainedUnit<A, B, Context & RootContext, Params, Preview>,
    c: GSSPChainedUnit<A & B, C, Context & RootContext, Params, Preview>,
    d: GSSPChainedUnit<A & B & C, D, Context & RootContext, Params, Preview>,
  ): GSSPStandaloneUnit<A & B & C & D, RootContext, Params, Preview>;

  function gssp<
    A extends { [key: string]: any },
    B extends { [key: string]: any },
    C extends { [key: string]: any },
    D extends { [key: string]: any },
    E extends { [key: string]: any },
  >(
    a: GSSPStandaloneUnit<A, Context & RootContext, Params, Preview>,
    b: GSSPChainedUnit<A, B, Context & RootContext, Params, Preview>,
    c: GSSPChainedUnit<A & B, C, Context & RootContext, Params, Preview>,
    d: GSSPChainedUnit<A & B & C, D, Context & RootContext, Params, Preview>,
    e: GSSPChainedUnit<A & B & C & D, E, Context & RootContext, Params, Preview>,
  ): GSSPStandaloneUnit<A & B & C & D & E, RootContext, Params, Preview>;

  function gssp<
    A extends { [key: string]: any },
    B extends { [key: string]: any },
    C extends { [key: string]: any },
    D extends { [key: string]: any },
    E extends { [key: string]: any },
    F extends { [key: string]: any },
  >(
    a: GSSPStandaloneUnit<A, Context & RootContext, Params, Preview>,
    b: GSSPChainedUnit<A, B, Context & RootContext, Params, Preview>,
    c: GSSPChainedUnit<A & B, C, Context & RootContext, Params, Preview>,
    d: GSSPChainedUnit<A & B & C, D, Context & RootContext, Params, Preview>,
    e: GSSPChainedUnit<A & B & C & D, E, Context & RootContext, Params, Preview>,
    f: GSSPChainedUnit<A & B & C & D & E, F, Context & RootContext, Params, Preview>,
  ): GSSPStandaloneUnit<A & B & C & D & E & F, RootContext, Params, Preview>;

  function gssp<
    A extends { [key: string]: any },
    B extends { [key: string]: any },
    C extends { [key: string]: any },
    D extends { [key: string]: any },
    E extends { [key: string]: any },
    F extends { [key: string]: any },
    G extends { [key: string]: any },
  >(
    a: GSSPStandaloneUnit<A, Context & RootContext, Params, Preview>,
    b: GSSPChainedUnit<A, B, Context & RootContext, Params, Preview>,
    c: GSSPChainedUnit<A & B, C, Context & RootContext, Params, Preview>,
    d: GSSPChainedUnit<A & B & C, D, Context & RootContext, Params, Preview>,
    e: GSSPChainedUnit<A & B & C & D, E, Context & RootContext, Params, Preview>,
    f: GSSPChainedUnit<A & B & C & D & E, F, Context & RootContext, Params, Preview>,
    g: GSSPChainedUnit<A & B & C & D & E & F, G, Context & RootContext, Params, Preview>,
  ): GSSPStandaloneUnit<A & B & C & D & E & F & G, RootContext, Params, Preview>;

  function gssp<
    A extends { [key: string]: any },
    B extends { [key: string]: any },
    C extends { [key: string]: any },
    D extends { [key: string]: any },
    E extends { [key: string]: any },
    F extends { [key: string]: any },
    G extends { [key: string]: any },
    H extends { [key: string]: any },
  >(
    a: GSSPStandaloneUnit<A, Context & RootContext, Params, Preview>,
    b: GSSPChainedUnit<A, B, Context & RootContext, Params, Preview>,
    c: GSSPChainedUnit<A & B, C, Context & RootContext, Params, Preview>,
    d: GSSPChainedUnit<A & B & C, D, Context & RootContext, Params, Preview>,
    e: GSSPChainedUnit<A & B & C & D, E, Context & RootContext, Params, Preview>,
    f: GSSPChainedUnit<A & B & C & D & E, F, Context & RootContext, Params, Preview>,
    g: GSSPChainedUnit<A & B & C & D & E & F, G, Context & RootContext, Params, Preview>,
    h: GSSPChainedUnit<A & B & C & D & E & F & G, H, Context & RootContext, Params, Preview>,
  ): GSSPStandaloneUnit<A & B & C & D & E & F & G & H, RootContext, Params, Preview>;

  function gssp<
    A extends { [key: string]: any },
    B extends { [key: string]: any },
    C extends { [key: string]: any },
    D extends { [key: string]: any },
    E extends { [key: string]: any },
    F extends { [key: string]: any },
    G extends { [key: string]: any },
    H extends { [key: string]: any },
    I extends { [key: string]: any },
  >(
    a: GSSPStandaloneUnit<A, Context & RootContext, Params, Preview>,
    b: GSSPChainedUnit<A, B, Context & RootContext, Params, Preview>,
    c: GSSPChainedUnit<A & B, C, Context & RootContext, Params, Preview>,
    d: GSSPChainedUnit<A & B & C, D, Context & RootContext, Params, Preview>,
    e: GSSPChainedUnit<A & B & C & D, E, Context & RootContext, Params, Preview>,
    f: GSSPChainedUnit<A & B & C & D & E, F, Context & RootContext, Params, Preview>,
    g: GSSPChainedUnit<A & B & C & D & E & F, G, Context & RootContext, Params, Preview>,
    h: GSSPChainedUnit<A & B & C & D & E & F & G, H, Context & RootContext, Params, Preview>,
    i: GSSPChainedUnit<A & B & C & D & E & F & G & H, I, Context & RootContext, Params, Preview>,
  ): GSSPStandaloneUnit<A & B & C & D & E & F & G & H & I, RootContext, Params, Preview>;

  function gssp<
    A extends { [key: string]: any },
    B extends { [key: string]: any },
    C extends { [key: string]: any },
    D extends { [key: string]: any },
    E extends { [key: string]: any },
    F extends { [key: string]: any },
    G extends { [key: string]: any },
    H extends { [key: string]: any },
    I extends { [key: string]: any },
    J extends { [key: string]: any },
  >(
    a: GSSPStandaloneUnit<A, Context & RootContext, Params, Preview>,
    b: GSSPChainedUnit<A, B, Context & RootContext, Params, Preview>,
    c: GSSPChainedUnit<A & B, C, Context & RootContext, Params, Preview>,
    d: GSSPChainedUnit<A & B & C, D, Context & RootContext, Params, Preview>,
    e: GSSPChainedUnit<A & B & C & D, E, Context & RootContext, Params, Preview>,
    f: GSSPChainedUnit<A & B & C & D & E, F, Context & RootContext, Params, Preview>,
    g: GSSPChainedUnit<A & B & C & D & E & F, G, Context & RootContext, Params, Preview>,
    h: GSSPChainedUnit<A & B & C & D & E & F & G, H, Context & RootContext, Params, Preview>,
    i: GSSPChainedUnit<A & B & C & D & E & F & G & H, I, Context & RootContext, Params, Preview>,
    j: GSSPChainedUnit<
      A & B & C & D & E & F & G & H & I,
      J,
      Context & RootContext,
      Params,
      Preview
    >,
  ): GSSPStandaloneUnit<A & B & C & D & E & F & G & H & I & J, RootContext, Params, Preview>;

  function gssp(...fns: any[]): GSSPStandaloneUnit<any, Context & RootContext, Params, Preview> {
    return async ctx => {
      const gsspCtx = createContext ? await Promise.resolve(createContext(ctx)) : ctx;

      try {
        if (!fns.length) return { props: {} };

        let accumulated: Record<string, any> = {};

        for (const [i, fn] of fns.entries()) {
          const ctxWithPrev = i === 0 ? gsspCtx : { ...gsspCtx, prevProps: accumulated };

          const result = await fn(ctxWithPrev);

          if ('notFound' in result || 'redirect' in result) {
            return result;
          }

          if ('props' in result) {
            const props = await Promise.resolve(result.props);

            accumulated = { ...accumulated, ...(props ?? {}) };
          }
        }

        return { props: accumulated };
      } catch (error) {
        if (errorHandler) {
          const result = errorHandler(error, gsspCtx);

          if (result) return result;
        }

        throw error;
      }
    };
  }

  return gssp;
};

export default createGssp;
