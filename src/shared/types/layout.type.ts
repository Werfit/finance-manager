export type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export type PageProps<T extends Record<string, string>> = Readonly<{
  params: Promise<T>;
}>;
