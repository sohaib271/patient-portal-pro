// hooks/useUser.js
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

const fetchMe = async () => {
  const { data } = await api.get('/auth/me');
  return data; 
};

export function useUser() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: fetchMe,
    retry: false,             // Don't retry endlessly if the cookie is expired
    staleTime: Infinity,      // Profile data doesn't change often, keep it fresh
    gcTime: 1000 * 60 * 60,   // Keep in memory cache for 1 hour
  });

  const logout = async () => {
    await api.get('/auth/logout'); // Backend clears the cookie
    queryClient.setQueryData(['user'], null); // Instantly clears client cache
  };

  return { user, isLoading, isAuthenticated: !!user, logout };
}
