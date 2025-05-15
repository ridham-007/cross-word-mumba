// Simplified mock implementation of the toast hook
export function useToast() {
  return {
    toast: ({ title, description, variant }: { 
      title?: string; 
      description?: string; 
      variant?: 'default' | 'destructive' 
    }) => {
      console.log({ title, description, variant });
    }
  };
}