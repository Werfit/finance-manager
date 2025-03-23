export type LayoutProps<
  P extends Record<string, string> = Record<string, string>,
> = Readonly<{
  children: React.ReactNode;
  params: Promise<P>;
}>;

export type PageProps<T extends Record<string, string>> = Readonly<{
  params: Promise<T>;
}>;
