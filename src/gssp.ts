import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  PreviewData,
} from 'next';
import { ParsedUrlQuery } from 'querystring';

export interface CreateGSSPOptions<
  Context extends { [key: string]: any },
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData,
> {
  createContext?: (
    ctx: GetServerSidePropsContext<Params, Preview>,
  ) =>
    | (GetServerSidePropsContext<Params, Preview> & Context)
    | Promise<GetServerSidePropsContext<Params, Preview> & Context>;
  errorHandler?: (error: unknown) => void;
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

export type GSSPUnit<
  PrevProps extends { [key: string]: any },
  Props extends { [key: string]: any },
  Context extends { [key: string]: any } = { [key: string]: any },
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData,
> =
  | GSSPStandaloneUnit<Props, Context, Params, Preview>
  | GSSPChainedUnit<PrevProps, Props, Context, Params, Preview>;

const createGssp = <
  Context extends { [key: string]: any },
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData,
>(
  options: CreateGSSPOptions<Context, Params, Preview> = {},
) => {
  const { createContext, errorHandler } = options || {};

  function gssp(): GetServerSideProps<{}, Params, Preview>;

  function gssp<A extends { [key: string]: any }>(
    a: GSSPStandaloneUnit<A, Context, Params, Preview>,
  ): GetServerSideProps<A, Params, Preview>;

  function gssp<A extends { [key: string]: any }, B extends { [key: string]: any }>(
    a: GSSPStandaloneUnit<A, Context, Params, Preview>,
    b: GSSPChainedUnit<A, B, Context, Params, Preview>,
  ): GetServerSideProps<A & B, Params, Preview>;

  function gssp<
    A extends { [key: string]: any },
    B extends { [key: string]: any },
    C extends { [key: string]: any },
  >(
    a: GSSPStandaloneUnit<A, Context, Params, Preview>,
    b: GSSPChainedUnit<A, B, Context, Params, Preview>,
    c: GSSPChainedUnit<A & B, C, Context, Params, Preview>,
  ): GetServerSideProps<A & B & C, Params, Preview>;

  function gssp<
    A extends { [key: string]: any },
    B extends { [key: string]: any },
    C extends { [key: string]: any },
    D extends { [key: string]: any },
  >(
    a: GSSPStandaloneUnit<A, Context, Params, Preview>,
    b: GSSPChainedUnit<A, B, Context, Params, Preview>,
    c: GSSPChainedUnit<A & B, C, Context, Params, Preview>,
    d: GSSPChainedUnit<A & B & C, D, Context, Params, Preview>,
  ): GetServerSideProps<A & B & C & D, Params, Preview>;

  function gssp<
    A extends { [key: string]: any },
    B extends { [key: string]: any },
    C extends { [key: string]: any },
    D extends { [key: string]: any },
    E extends { [key: string]: any },
  >(
    a: GSSPStandaloneUnit<A, Context, Params, Preview>,
    b: GSSPChainedUnit<A, B, Context, Params, Preview>,
    c: GSSPChainedUnit<A & B, C, Context, Params, Preview>,
    d: GSSPChainedUnit<A & B & C, D, Context, Params, Preview>,
    e: GSSPChainedUnit<A & B & C & D, E, Context, Params, Preview>,
  ): GetServerSideProps<A & B & C & D & E, Params, Preview>;

  function gssp<
    A extends { [key: string]: any },
    B extends { [key: string]: any },
    C extends { [key: string]: any },
    D extends { [key: string]: any },
    E extends { [key: string]: any },
    F extends { [key: string]: any },
  >(
    a: GSSPStandaloneUnit<A, Context, Params, Preview>,
    b: GSSPChainedUnit<A, B, Context, Params, Preview>,
    c: GSSPChainedUnit<A & B, C, Context, Params, Preview>,
    d: GSSPChainedUnit<A & B & C, D, Context, Params, Preview>,
    e: GSSPChainedUnit<A & B & C & D, E, Context, Params, Preview>,
    f: GSSPChainedUnit<A & B & C & D & E, F, Context, Params, Preview>,
  ): GetServerSideProps<A & B & C & D & E & F, Params, Preview>;

  function gssp<
    A extends { [key: string]: any },
    B extends { [key: string]: any },
    C extends { [key: string]: any },
    D extends { [key: string]: any },
    E extends { [key: string]: any },
    F extends { [key: string]: any },
    G extends { [key: string]: any },
  >(
    a: GSSPStandaloneUnit<A, Context, Params, Preview>,
    b: GSSPChainedUnit<A, B, Context, Params, Preview>,
    c: GSSPChainedUnit<A & B, C, Context, Params, Preview>,
    d: GSSPChainedUnit<A & B & C, D, Context, Params, Preview>,
    e: GSSPChainedUnit<A & B & C & D, E, Context, Params, Preview>,
    f: GSSPChainedUnit<A & B & C & D & E, F, Context, Params, Preview>,
    g: GSSPChainedUnit<A & B & C & D & E & F, G, Context, Params, Preview>,
  ): GetServerSideProps<A & B & C & D & E & F & G, Params, Preview>;

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
    a: GSSPStandaloneUnit<A, Context, Params, Preview>,
    b: GSSPChainedUnit<A, B, Context, Params, Preview>,
    c: GSSPChainedUnit<A & B, C, Context, Params, Preview>,
    d: GSSPChainedUnit<A & B & C, D, Context, Params, Preview>,
    e: GSSPChainedUnit<A & B & C & D, E, Context, Params, Preview>,
    f: GSSPChainedUnit<A & B & C & D & E, F, Context, Params, Preview>,
    g: GSSPChainedUnit<A & B & C & D & E & F, G, Context, Params, Preview>,
    h: GSSPChainedUnit<A & B & C & D & E & F & G, H, Context, Params, Preview>,
  ): GetServerSideProps<A & B & C & D & E & F & G & H, Params, Preview>;

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
    a: GSSPStandaloneUnit<A, Context, Params, Preview>,
    b: GSSPChainedUnit<A, B, Context, Params, Preview>,
    c: GSSPChainedUnit<A & B, C, Context, Params, Preview>,
    d: GSSPChainedUnit<A & B & C, D, Context, Params, Preview>,
    e: GSSPChainedUnit<A & B & C & D, E, Context, Params, Preview>,
    f: GSSPChainedUnit<A & B & C & D & E, F, Context, Params, Preview>,
    g: GSSPChainedUnit<A & B & C & D & E & F, G, Context, Params, Preview>,
    h: GSSPChainedUnit<A & B & C & D & E & F & G, H, Context, Params, Preview>,
    i: GSSPChainedUnit<A & B & C & D & E & F & G & H, I, Context, Params, Preview>,
  ): GetServerSideProps<A & B & C & D & E & F & G & H & I, Params, Preview>;

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
    a: GSSPStandaloneUnit<A, Context, Params, Preview>,
    b: GSSPChainedUnit<A, B, Context, Params, Preview>,
    c: GSSPChainedUnit<A & B, C, Context, Params, Preview>,
    d: GSSPChainedUnit<A & B & C, D, Context, Params, Preview>,
    e: GSSPChainedUnit<A & B & C & D, E, Context, Params, Preview>,
    f: GSSPChainedUnit<A & B & C & D & E, F, Context, Params, Preview>,
    g: GSSPChainedUnit<A & B & C & D & E & F, G, Context, Params, Preview>,
    h: GSSPChainedUnit<A & B & C & D & E & F & G, H, Context, Params, Preview>,
    i: GSSPChainedUnit<A & B & C & D & E & F & G & H, I, Context, Params, Preview>,
    j: GSSPChainedUnit<A & B & C & D & E & F & G & H & I, J, Context, Params, Preview>,
  ): GetServerSideProps<A & B & C & D & E & F & G & H & I & J, Params, Preview>;

  function gssp(...fns: any[]): GetServerSideProps<any, Params, Preview> {
    return async ctx => {
      try {
        if (!fns.length) return { props: {} };

        const gsspCtx = createContext ? await Promise.resolve(createContext(ctx)) : ctx;

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
        errorHandler && errorHandler(error);

        throw error;
      }
    };
  }

  return gssp;
};

export default createGssp;
