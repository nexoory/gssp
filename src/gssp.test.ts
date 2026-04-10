import { describe, expect, it, vi } from 'vitest';
import createGssp from './gssp';

/** Minimal shape passed through to units; real Next.js context is richer. */
function mockCtx(overrides: Record<string, unknown> = {}) {
  return {
    params: {},
    query: {},
    req: {} as unknown,
    res: {} as unknown,
    resolvedUrl: '/',
    ...overrides,
  };
}

describe('createGssp', () => {
  it('returns empty props when no units are passed', async () => {
    const gssp = createGssp({
      createContext: ctx => ctx,
    })();

    const result = await gssp(mockCtx() as never);
    expect(result).toEqual({ props: {} });
  });

  it('merges props from a single unit', async () => {
    const gssp = createGssp({
      createContext: ctx => ctx,
    })(async () => ({ props: { a: 1 } }));

    const result = await gssp(mockCtx() as never);
    expect(result).toEqual({ props: { a: 1 } });
  });

  it('merges props from multiple units and passes prevProps from the second onward', async () => {
    const second = vi.fn(async (ctx: { prevProps?: { a?: number } }) => {
      expect(ctx.prevProps).toEqual({ a: 1 });
      return { props: { b: 2 } };
    });

    const gssp = createGssp({
      createContext: ctx => ctx,
    })(async () => ({ props: { a: 1 } }), second);

    const result = await gssp(mockCtx() as never);
    expect(second).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ props: { a: 1, b: 2 } });
  });

  it('chains createContext fields and prevProps into later units without explicit ctx types', async () => {
    const gssp = createGssp({
      createContext: ctx => ({ ...ctx, chainTag: 'from-context' as const }),
    })(
      async () => ({ props: { step: 1 as const } }),
      async ctx => {
        expect(ctx.chainTag).toBe('from-context');
        expect(ctx.prevProps).toEqual({ step: 1 });
        return { props: { next: true as const } };
      },
    );

    const result = await gssp(mockCtx() as never);
    expect(result).toEqual({ props: { step: 1, next: true } });
  });

  it('returns redirect immediately and does not run later units', async () => {
    const later = vi.fn(async () => ({ props: { c: 3 } }));

    const gssp = createGssp({
      createContext: ctx => ctx,
    })(
      async () => ({
        redirect: { destination: '/x', permanent: false },
      }),
      later,
    );

    const result = await gssp(mockCtx() as never);
    expect(later).not.toHaveBeenCalled();
    expect(result).toEqual({
      redirect: { destination: '/x', permanent: false },
    });
  });

  it('returns notFound immediately and does not run later units', async () => {
    const later = vi.fn(async () => ({ props: {} }));

    const gssp = createGssp({
      createContext: ctx => ctx,
    })(async () => ({ notFound: true as const }), later);

    const result = await gssp(mockCtx() as never);
    expect(later).not.toHaveBeenCalled();
    expect(result).toEqual({ notFound: true });
  });

  it('returns notFound from a later unit without merging earlier props into the result', async () => {
    const third = vi.fn(async () => ({ props: { skipped: true } }));

    const gssp = createGssp({
      createContext: ctx => ctx,
    })(
      async () => ({ props: { firstFunctionResult: 'first' } }),
      async () => ({ notFound: true as const }),
      third,
    );

    const result = await gssp(mockCtx() as never);
    expect(third).not.toHaveBeenCalled();
    expect(result).toEqual({ notFound: true });
  });

  it('calls createContext with the original context', async () => {
    const createContext = vi.fn(ctx => ({ ...ctx, extra: true }));

    const gssp = createGssp({
      createContext,
    })(async ctx => {
      expect(ctx).toMatchObject({ extra: true });
      return { props: {} };
    });

    const ctx = mockCtx({ query: { q: '1' } });
    await gssp(ctx as never);
    expect(createContext).toHaveBeenCalledWith(ctx);
  });

  it('awaits async createContext before running units', async () => {
    let resolved = false;
    const gssp = createGssp({
      createContext: async ctx => {
        await Promise.resolve();
        resolved = true;
        return { ...ctx, asyncExtra: 42 as const };
      },
    })(async ctx => {
      expect(resolved).toBe(true);
      expect(ctx.asyncExtra).toBe(42);
      return { props: {} };
    });

    await gssp(mockCtx() as never);
  });

  it('calls errorHandler then rethrows on thrown errors', async () => {
    const errorHandler = vi.fn();
    const err = new Error('fail');

    const gssp = createGssp({
      createContext: ctx => ctx,
      errorHandler,
    })(async () => {
      throw err;
    });

    await expect(gssp(mockCtx() as never)).rejects.toThrow('fail');
    expect(errorHandler).toHaveBeenCalledWith(err);
  });

  it('resolves props when they are a Promise', async () => {
    const gssp = createGssp({
      createContext: ctx => ctx,
    })(async () => ({
      props: Promise.resolve({ a: 1 }),
    }));

    const result = await gssp(mockCtx() as never);
    expect(result).toEqual({ props: { a: 1 } });
  });
});
