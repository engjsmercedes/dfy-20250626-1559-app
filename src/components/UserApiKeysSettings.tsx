import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff, Key, Save } from 'lucide-react';

interface ApiKeys {
  openai_api_key?: string;
  stripe_secret_key?: string;
  resend_api_key?: string;
}

export const UserApiKeysSettings = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_api_keys')
        .select('key_name, encrypted_value')
        .eq('user_id', user.id);

      if (error) throw error;

      const keysObj: ApiKeys = {};
      data?.forEach(item => {
        keysObj[item.key_name as keyof ApiKeys] = '••••••••••••••••';
      });
      setApiKeys(keysObj);
    } catch (error) {
      console.error('Error fetching API keys:', error);
    }
  };

  const saveApiKey = async (keyName: string, value: string) => {
    if (!value.trim()) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase.functions.invoke('manage-user-api-keys', {
        body: {
          action: 'save',
          key_name: keyName,
          key_value: value
        }
      });

      if (error) throw error;

      toast({
        title: 'API Key Saved',
        description: `${keyName.replace('_', ' ').toUpperCase()} key has been securely saved.`
      });

      await fetchApiKeys();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleShowKey = (keyName: string) => {
    setShowKeys(prev => ({ ...prev, [keyName]: !prev[keyName] }));
  };

  const apiKeyConfigs = [
    {
      name: 'openai_api_key',
      label: 'OpenAI API Key',
      description: 'Required for AI features like chat and content generation',
      placeholder: 'sk-...'
    },
    {
      name: 'stripe_secret_key',
      label: 'Stripe Secret Key',
      description: 'Required for payment processing features',
      placeholder: 'sk_...'
    },
    {
      name: 'resend_api_key',
      label: 'Resend API Key',
      description: 'Required for email notifications and communication',
      placeholder: 're_...'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Key className="w-5 h-5" />
        <h2 className="text-2xl font-bold">API Keys</h2>
      </div>
      
      <p className="text-gray-600">
        Securely manage your API keys for third-party services. These keys are encrypted and only accessible to you.
      </p>

      {apiKeyConfigs.map((config) => (
        <Card key={config.name}>
          <CardHeader>
            <CardTitle className="text-lg">{config.label}</CardTitle>
            <p className="text-sm text-gray-600">{config.description}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor={config.name}>API Key</Label>
                <div className="relative">
                  <Input
                    id={config.name}
                    type={showKeys[config.name] ? 'text' : 'password'}
                    placeholder={config.placeholder}
                    value={apiKeys[config.name as keyof ApiKeys] || ''}
                    onChange={(e) => setApiKeys(prev => ({
                      ...prev,
                      [config.name]: e.target.value
                    }))}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => toggleShowKey(config.name)}
                  >
                    {showKeys[config.name] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => saveApiKey(config.name, apiKeys[config.name as keyof ApiKeys] || '')}
                  disabled={loading}
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};