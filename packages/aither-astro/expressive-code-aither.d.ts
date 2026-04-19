export declare function pluginAitherCodeLanguage(): {
  name: string;
  baseStyles: (context: { cssVar: (name: string) => string }) => string;
  hooks: {
    preprocessMetadata: (context: { codeBlock: any }) => void;
    postprocessRenderedBlock: (context: { codeBlock: any; renderData: any }) => void;
  };
};
