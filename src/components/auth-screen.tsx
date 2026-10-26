import { useEffect, useRef, useState } from 'react';
import * as Linking from 'expo-linking';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { supabase } from '@/lib/supabase';

const redirectTo = Linking.createURL('auth/callback');

type AuthScreenProps = {
  onVerified: () => void;
};

export default function AuthScreen({ onVerified }: AuthScreenProps) {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
    const handledUrl = useRef<string | null>(null);
  const incomingUrl = Linking.useLinkingURL();

  useEffect(() => {
    if (!incomingUrl || handledUrl.current === incomingUrl) {
      return;
    }

    let cancelled = false;

    async function handleAuthCallback(url: string) {
      try {
        const callbackUrl = new URL(url);
        const errorDescription = callbackUrl.searchParams.get(
          'error_description'
        );
        const errorCode = callbackUrl.searchParams.get('error');

        if (errorCode || errorDescription) {
          throw new Error(
            errorDescription || errorCode || 'Authentication failed.'
          );
        }

        const code = callbackUrl.searchParams.get('code');

        if (!code) {
          return;
        }

        handledUrl.current = url;

        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          throw error;
        }

        if (!cancelled) {
          setEmailSent(false);
          onVerified();
        }
      } catch (error) {
        handledUrl.current = null;

        if (!cancelled) {
          Alert.alert(
            'Sign-in failed',
            error instanceof Error
              ? error.message
              : 'Please request a new sign-in link and try again.'
          );
        }
      }
    }

    void handleAuthCallback(incomingUrl);

    return () => {
      cancelled = true;
    };
  }, [incomingUrl, onVerified]);

  async function sendMagicLink() {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (error) throw error;

      setEmail(cleanEmail);
      setEmailSent(true);
    } catch (error) {
      Alert.alert(
        'Unable to send email',
        error instanceof Error ? error.message : 'Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>+</Text>
        </View>

        <Text style={styles.brand}>CareCircle</Text>
        <Text style={styles.caption}>CAREGIVER ASSISTANT</Text>

        <Text style={styles.heading}>
          {emailSent ? 'Check your email.' : 'Care starts here.'}
        </Text>

        <Text style={styles.description}>
          {emailSent
            ? `We've sent a sign-in link to ${email}. Open the email on this device and tap the link to continue.`
            : 'Enter your email to receive a secure sign-in link for your care dashboard.'}
        </Text>

        {!emailSent && (
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor="#82918A"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            accessibilityLabel="Email address"
          />
        )}

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={emailSent ? () => setEmailSent(false) : sendMagicLink}
          disabled={loading}
          accessibilityRole="button"
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>
              {emailSent ? 'Use another email' : 'Email me a sign-in link'}
            </Text>
          )}
        </Pressable>

        {emailSent && (
          <Pressable
            style={styles.resendButton}
            onPress={sendMagicLink}
            disabled={loading}
            accessibilityRole="button"
          >
            <Text style={styles.secondaryText}>Send another link</Text>
          </Pressable>
        )}

        <Text style={styles.footer}>
          Your care information deserves a safe place.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F8F6',
    justifyContent: 'center',
  },
  container: {
    paddingHorizontal: 28,
    alignItems: 'stretch',
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#176B5B',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '300',
  },
  brand: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '700',
    color: '#18332D',
  },
  caption: {
    textAlign: 'center',
    fontSize: 10,
    letterSpacing: 3,
    color: '#73827D',
    marginTop: 5,
    marginBottom: 44,
  },
  heading: {
    fontSize: 30,
    fontWeight: '700',
    color: '#18332D',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
    color: '#73827D',
    marginBottom: 24,
  },
  input: {
    height: 54,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5ECE8',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#18332D',
    marginBottom: 14,
  },
  button: {
    minHeight: 54,
    backgroundColor: '#176B5B',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resendButton: {
    marginTop: 14,
  },
  secondaryText: {
    color: '#176B5B',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 8,
  },
  footer: {
    marginTop: 38,
    textAlign: 'center',
    color: '#82918A',
    fontSize: 12,
  },
});