import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export const useApiKeys = () => {
  const getApiKey = useCallback(async (keyName: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-user-api-keys', {
        body: {
          action: 'get',
          key_name: keyName
        }
      });

      if (error) throw error;
      return data?.value || null;
    } catch (error) {
      console.error(`Error fetching ${keyName}:`, error);
      return null;
    }
  }, []);

  return { getApiKey };
};