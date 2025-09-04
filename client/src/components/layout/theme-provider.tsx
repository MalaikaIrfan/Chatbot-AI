import { ThemeProvider } from "@/hooks/use-theme";

interface ThemeProviderWrapperProps {
  children: React.ReactNode;
}

export function ThemeProviderWrapper({ children }: ThemeProviderWrapperProps) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ai-dashboard-theme">
      {children}
    </ThemeProvider>
  );
}
