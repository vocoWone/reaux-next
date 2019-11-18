import { StateView } from "./type";

declare const process: any;
declare const window: any;

type ActionHandler = (...args: any[]) => any;

type HandlerDecorator = (
  target: object,
  name: string | symbol,
  descriptor: TypedPropertyDescriptor<ActionHandler>
) => TypedPropertyDescriptor<ActionHandler>;

type HandlerInterceptor<S> = (
  handler: ActionHandler,
  state: Readonly<S>
) => any;

export function handlerDecorator<S extends StateView>(
  interceptor: HandlerInterceptor<S>
): HandlerDecorator {
  return (target, name, descriptor) => {
    const handler = descriptor.value!;
    descriptor.value = async function(...args: any[]) {
      const rootState: S = (target as any).rootState;
      (await interceptor(handler.bind(this, ...args), rootState)) as any;
    };
    return descriptor;
  };
}

export const isServer = () =>
  process && typeof process === "object" && typeof window === "undefined";

export const SET_STATE_ACTION = "@@framework/setState";

export const SET_HELPER_LOADING = "@@framework/setHelper/setLoading";

export const SET_HELPER_LANG = "@@framework/setHelper/setLang";

export const SET_HELPER_EXCEPTION = "@@framework/setHelper/exception";