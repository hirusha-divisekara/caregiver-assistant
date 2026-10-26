import { useState } from 'react';
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

type AuthScreenProps = {
  onVerified: () => void;
};

export default function AuthScreen({ onVerified }: AuthScreenProps) {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [step, setStep] = useState<'email' | 'verify'>('email');
  const [loading, setLoading] = useState(false);

  async function sendCode() {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
      });

      if (error) throw error;

      setEmail(cleanEmail);
      setStep('verify');

      Alert.alert(
        'Check your email',
        'If email delivery is configured, follow the instructions in the message.'
      );
    } catch (error) {
      Alert.alert(
        'Unable to continue',
        error instanceof Error ? error.message : 'Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode() {
    const cleanToken = token.trim();

    if (!/^\d{6}$/.test(cleanToken)) {
      Alert.alert('Invalid code', 'Enter the 6-digit verification code.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: cleanToken,
        type: 'email',
      });

      if (error) throw error;

      onVerified();
    } catch (error) {
      Alert.alert(
        'Verification failed',
        error instanceof Error ? error.message : 'Check the code and try again.'
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
          {step === 'email' ? 'Care starts here.' : 'Check your email.'}
        </Text>

        <Text style={styles.description}>
          {step === 'email'
            ? 'Enter your email to securely access your care dashboard.'
            : `Enter the verification code sent to ${email}.`}
        </Text>

        {step === 'email' ? (
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
        ) : (
          <TextInput
            style={styles.input}
            placeholder="6-digit verification code"
            placeholderTextColor="#82918A"
            keyboardType="number-pad"
            maxLength={6}
            value={token}
            onChangeText={(value) =>
              setToken(value.replace(/\D/g, '').slice(0, 6))
            }
            editable={!loading}
            accessibilityLabel="Verification code"
          />
        )}

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={step === 'email' ? sendCode : verifyCode}
          disabled={loading}
          accessibilityRole="button"
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>
              {step === 'email' ? 'Continue with email' : 'Verify and sign in'}
            </Text>
          )}
        </Pressable>

        {step === 'verify' && (
          <>
            <Pressable
              style={styles.secondaryButton}
              onPress={() => {
                setToken('');
                setStep('email');
              }}
              disabled={loading}
            >
              <Text style={styles.secondaryText}>Use another email</Text>
            </Pressable>

            <Pressable onPress={sendCode} disabled={loading}>
              <Text style={styles.secondaryText}>Send another email</Text>
            </Pressable>
          </>
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
    height: 54,
    backgroundColor: '#176B5B',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
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
  secondaryButton: {
    marginTop: 18,
    marginBottom: 14,
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