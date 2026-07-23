// hooks/useUser.js
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, clearCsrfToken } from '@/services/api';

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
    try {
      // Do not let an unavailable API trap the user in the authenticated UI.
      await api.post('/auth/logout', undefined, { timeout: 5000 });
    } catch (error) {
      console.warn('Server logout failed; clearing the local session.', error);
    } finally {
      clearCsrfToken();
      queryClient.setQueryData(['user'], null);
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== 'user',
      });
    }
  };

  return { user, isLoading, isAuthenticated: !!user, logout };
}
