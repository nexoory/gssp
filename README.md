# Pipline system for getServerSideProps

Helper for working with `getServerSideProps` in Next.js. It lets you extend the standard execution context and compose several `getServerSideProps`-compatible functions into a single chain.

## Usage

### Extended context

You can extend the execution context with any fields you need. If you omit `createContext`, the standard Next.js context is used as-is.

```ts
import createGssp from '@nexoory/gssp';

// Build a gssp instance with your own context shape
const myGssp = createGssp({
  createContext: ctx => {
    const extendedContext = {
      ...ctx,
      customField: 'My custom field',
      customMethod: () => {
        console.log('My custom method');
      },
    };

    return extendedContext;
  },
});

// Use it on pages — the extended context is typed end-to-end
export const getServerSideProps = myGssp(async ctx => {
  ctx.customField;
  ctx.customMethod();

  return {
    props: {},
  };
});
```

### Chaining functions

You can chain up to 10 functions. Their `props` are merged into one object (later keys override earlier ones).

```tsx
// All units’ props are merged into a single `props` object for the page
export const getServerSideProps = myGssp(
  async () => ({
    props: {
      productName: 'Toaster',
    },
  }),
  async () => ({
    props: {
      productPrice: 999.99,
    },
  }),
  async () => ({
    props: {
      sale: true,
      productPrice: 777.77, // overrides the previous productPrice
    },
  }),
);

type PageProps = {
  productName: string;
  productPrice: number;
  sale: boolean;
};

const Page = (props: PageProps) => (
  <div>
    <h1>{props.productName}</h1>
    <span>{props.productPrice}</span>
    {props.sale && <span>Sale!</span>}
  </div>
);

export default Page;
```

### Accessing previous units’ results

Each function after the first receives `prevProps`: the merged `props` from all earlier functions in the chain.

```ts
export const getServerSideProps = myGssp(
  async () => ({
    props: {
      firstFunctionResult: 'first',
    },
  }),
  async ctx => {
    const { prevProps } = ctx;

    console.log(prevProps.firstFunctionResult);

    return {
      props: {
        secondFunctionResult: 'second',
      },
    };
  },
  async ctx => {
    const { prevProps } = ctx;

    console.log(prevProps.firstFunctionResult);
    console.log(prevProps.secondFunctionResult);

    return {
      props: {},
    };
  },
);
```

### Short-circuit: `notFound` and `redirect`

If any unit returns `notFound` or `redirect`, that result is returned immediately and the rest of the chain does not run.

```ts
export const getServerSideProps = myGssp(
  async () => ({
    // These props are not part of the final page props when a later unit returns `notFound`
    props: {
      firstFunctionResult: 'first',
    },
  }),
  async () => ({
    // Only this unit’s outcome is returned — execution stops here
    notFound: true,
  }),
  async () => ({
    // This unit never runs
    props: {},
  }),
);
```

### Typing

Use the exported types to type standalone units, chained units, and your custom context.

```ts
import type { GetServerSideProps } from 'next';
import createGssp, {
  type GSSPChainedUnit,
  type GSSPStandaloneUnit,
} from '@nexoory/gssp';

// Shape of your extended context
interface MyCustomExtendedContext {
  someCustomData: boolean;
}

const customGssp = createGssp<MyCustomExtendedContext>({
  createContext: ctx => ({ ...ctx, someCustomData: true }),
});

// --- Classic `GetServerSideProps` (shown for compatibility with plain handlers)

const someClassicGetServerSidePropsFunction: GetServerSideProps<{
  classicData: string;
}> = async () => ({
  props: {
    classicData: 'classic',
  },
});

// --- Standalone unit: depends only on context (`GSSPStandaloneUnit`)

interface ProductPriceProps {
  price: number;
  sale: boolean;
}

const getProductPrice: GSSPStandaloneUnit<
  ProductPriceProps,
  MyCustomExtendedContext
> = async ctx => ({
  props: {
    price: 999,
    sale: ctx.someCustomData,
  },
});

// --- Chained unit: depends on previous props (`GSSPChainedUnit`)

interface ProductFinalPriceProps {
  actualPrice: number;
}

const getFinalProductPrice: GSSPChainedUnit<
  ProductPriceProps,
  ProductFinalPriceProps,
  MyCustomExtendedContext
> = async ctx => {
  const { prevProps } = ctx;

  return {
    props: {
      actualPrice: prevProps.sale ? prevProps.price - 100 : prevProps.price,
    },
  };
};

// --- Compose classic + custom units in one chain

export const getServerSideProps = customGssp(
  someClassicGetServerSidePropsFunction,
  getProductPrice,
  getFinalProductPrice,
);

// Wrong order: TypeScript error — `getFinalProductPrice` needs `getProductPrice`’s props first
// export const getServerSideProps = customGssp(
//   someClassicGetServerSidePropsFunction,
//   getFinalProductPrice,
//   getProductPrice,
// );
```

### Other options

- **`errorHandler`** — optional callback invoked when a unit throws. By default the error is rethrown after the handler runs. If you prefer to finish the request without propagating the error, the handler may **return** a standard Next.js `getServerSideProps` result, for example `{ notFound: true }` or `{ redirect: { destination: '...', permanent: false } }`. In that case **gssp returns that value** and does **not** rethrow. If the handler returns nothing (`undefined` / void), behavior is unchanged: the exception is rethrown as before.

See tests in `src/gssp.test.ts` for behavior details.
