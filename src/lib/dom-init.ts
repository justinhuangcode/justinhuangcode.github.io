type RootInitializer = (root: HTMLElement, signal: AbortSignal) => void;

declare global {
  interface Window {
    __aitherDomInitBootstrapped?: Set<string>;
    __aitherDomInitRegistries?: Map<string, Map<HTMLElement, AbortController>>;
    __aitherSystemThemeListenerBound?: boolean;
  }
}

const getBootstrappedKeys = () => (window.__aitherDomInitBootstrapped ??= new Set());

const getRegistry = (key: string) => {
  const registries = (window.__aitherDomInitRegistries ??= new Map());
  let registry = registries.get(key);

  if (!registry) {
    registry = new Map();
    registries.set(key, registry);
  }

  return registry;
};

const cleanupRegistry = (registry: Map<HTMLElement, AbortController>) => {
  for (const [root, controller] of Array.from(registry.entries())) {
    if (!root.isConnected) {
      controller.abort();
    }
  }
};

export function bootstrapRootInit(
  key: string,
  selector: string,
  init: RootInitializer,
) {
  const run = () => {
    const registry = getRegistry(key);
    cleanupRegistry(registry);

    document.querySelectorAll<HTMLElement>(selector).forEach((root) => {
      if (registry.has(root)) return;

      const controller = new AbortController();
      registry.set(root, controller);
      controller.signal.addEventListener(
        'abort',
        () => {
          registry.delete(root);
        },
        { once: true },
      );

      init(root, controller.signal);
    });
  };

  const bootstrappedKeys = getBootstrappedKeys();
  if (!bootstrappedKeys.has(key)) {
    bootstrappedKeys.add(key);
    document.addEventListener('astro:page-load', run);
    document.addEventListener('astro:after-swap', run);
  }

  run();
}
