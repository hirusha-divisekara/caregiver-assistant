import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';

const COLORS = {
  background: '#F5F8F6',
  white: '#FFFFFF',
  primary: '#176B5B',
  primaryLight: '#E2F2EC',
  text: '#18332D',
  secondary: '#73827D',
  border: '#E5ECE8',
  orange: '#D58A38',
  orangeLight: '#FFF1DF',
  lavender: '#ECE9FA',
};

function SectionHeading({
  title,
  action,
}: {
  title: string;
  action?: string;
}) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? <Text style={styles.actionText}>{action}</Text> : null}
    </View>
  );
}

export default function HomeScreen() {
 useEffect(() => {
  async function testConnection() {
    const { data, error } = await supabase
      .from('connection_test')
      .select('*');

    if (error) {
      console.log('Supabase response:', error.message);
    } else {
      console.log('Supabase connected!', data);
    }
  }

  testConnection();
}, []);
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" backgroundColor={COLORS.background} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>+</Text>
            </View>

            <View>
              <Text style={styles.brandName}>CareCircle</Text>
              <Text style={styles.brandCaption}>CAREGIVER ASSISTANT</Text>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            style={styles.notificationButton}
          >
            <Text style={styles.notificationIcon}>♧</Text>
            <View style={styles.notificationDot} />
          </Pressable>
        </View>

        {/* Welcome */}
        <View style={styles.welcome}>
          <Text style={styles.greeting}>MONDAY, YOUR CARE OVERVIEW</Text>
          <Text style={styles.welcomeTitle}>Good evening 👋</Text>
          <Text style={styles.welcomeDescription}>
            A little care goes a long way. Here’s what’s happening today.
          </Text>
        </View>

        {/* Care recipient card */}
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👵</Text>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileLabel}>CURRENTLY CARING FOR</Text>
              <Text style={styles.profileName}>Your loved one</Text>
              <Text style={styles.profileSubtext}>Care profile</Text>
            </View>

            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Active</Text>
            </View>
          </View>

          <View style={styles.profileDivider} />

          <Pressable
            accessibilityRole="button"
            style={styles.profileAction}
            onPress={() => {}}
          >
            <Text style={styles.profileActionText}>Set up care profile</Text>
            <Text style={styles.arrow}>→</Text>
          </Pressable>
        </View>

        {/* Daily overview */}
        <SectionHeading title="Today's overview" />

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: COLORS.primaryLight }]}>
              <Text style={styles.statEmoji}>💊</Text>
            </View>
            <Text style={styles.statNumber}>0 of 0</Text>
            <Text style={styles.statLabel}>Medications</Text>
            <Text style={styles.statHint}>None scheduled yet</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: COLORS.orangeLight }]}>
              <Text style={styles.statEmoji}>📅</Text>
            </View>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Appointments</Text>
            <Text style={styles.statHint}>Nothing planned yet</Text>
          </View>
        </View>

        {/* Medication section */}
        <SectionHeading title="Medication schedule" action="View all →" />

        <View style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <Text style={styles.emptyEmoji}>💚</Text>
          </View>
          <View style={styles.emptyTextContainer}>
            <Text style={styles.emptyTitle}>Your medication planner</Text>
            <Text style={styles.emptyDescription}>
              Add prescribed medications and create reminders to help keep
              your care routine organized.
            </Text>
            <Pressable
              accessibilityRole="button"
              style={styles.primaryButton}
              onPress={() => {}}
            >
              <Text style={styles.primaryButtonText}>+ Add medication</Text>
            </Pressable>
          </View>
        </View>

        {/* Appointments */}
        <SectionHeading title="Upcoming appointments" action="View all →" />

        <View style={styles.appointmentCard}>
          <View style={styles.appointmentIcon}>
            <Text style={styles.statEmoji}>🩺</Text>
          </View>
          <View style={styles.appointmentInfo}>
            <Text style={styles.emptyTitle}>Stay on top of care</Text>
            <Text style={styles.emptyDescription}>
              Keep doctor visits and follow-ups in one place.
            </Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </View>

        {/* Journal */}
        <SectionHeading title="Care journal" />

        <Pressable
          accessibilityRole="button"
          style={styles.journalCard}
          onPress={() => {}}
        >
          <View style={styles.journalIcon}>
            <Text style={styles.statEmoji}>📝</Text>
          </View>
          <View style={styles.journalInfo}>
            <Text style={styles.emptyTitle}>A little note can help</Text>
            <Text style={styles.emptyDescription}>
              Record daily observations, important updates, and care notes.
            </Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </Pressable>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerHeart}>♥</Text>
          <Text style={styles.footerText}>Care for them. Care for yourself.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 34,
    fontWeight: '500',
    color: COLORS.white,
    lineHeight: 38,
  },
  brandName: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  brandCaption: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.secondary,
    letterSpacing: 1.5,
    marginTop: 3,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIcon: {
    fontSize: 25,
    color: COLORS.text,
  },
  notificationDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.orange,
    right: 10,
    top: 9,
  },
  welcome: {
    marginBottom: 23,
  },
  greeting: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: COLORS.primary,
    marginBottom: 10,
  },
  welcomeTitle: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '800',
    letterSpacing: -1,
    color: COLORS.text,
  },
  welcomeDescription: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.secondary,
  },
  profileCard: {
    padding: 17,
    backgroundColor: COLORS.white,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 29,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 19,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 29,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  profileLabel: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.1,
    color: COLORS.secondary,
    marginBottom: 5,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  profileSubtext: {
    marginTop: 3,
    fontSize: 12,
    color: COLORS.secondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
  },
  profileDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginTop: 17,
  },
  profileAction: {
    paddingTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  arrow: {
    fontSize: 21,
    color: COLORS.primary,
  },
  sectionHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 13,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 29,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 15,
  },
  statIcon: {
    width: 39,
    height: 39,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  statEmoji: {
    fontSize: 21,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 5,
  },
  statHint: {
    fontSize: 10,
    color: COLORS.secondary,
    marginTop: 5,
    lineHeight: 15,
  },
  emptyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 13,
    padding: 16,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    marginBottom: 29,
  },
  emptyIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyEmoji: {
    fontSize: 21,
  },
  emptyTextContainer: {
    flex: 1,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 20,
  },
  emptyDescription: {
    fontSize: 12,
    color: COLORS.secondary,
    lineHeight: 19,
    marginTop: 5,
  },
  primaryButton: {
    alignSelf: 'flex-start',
    marginTop: 13,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  primaryButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    padding: 15,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 19,
    marginBottom: 28,
  },
  appointmentIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: COLORS.orangeLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appointmentInfo: {
    flex: 1,
  },
  journalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 15,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 19,
  },
  journalIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: COLORS.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  journalInfo: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
    marginTop: 30,
  },
  footerHeart: {
    color: COLORS.primary,
    fontSize: 13,
  },
  footerText: {
    color: COLORS.secondary,
    fontSize: 11,
  },
});