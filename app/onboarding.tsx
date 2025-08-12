import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Mountain, Camera, MessageCircle, MapPin } from 'lucide-react-native';
import { useAuth } from '@/components/AuthProvider';
import AuthScreen from '@/components/AuthScreen';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const { user, loading } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const iconAnim1 = useRef(new Animated.Value(0)).current;
  const iconAnim2 = useRef(new Animated.Value(0)).current;
  const iconAnim3 = useRef(new Animated.Value(0)).current;
  const iconAnim4 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateSequence = () => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();

      // Animate icons in sequence
      setTimeout(() => {
        Animated.timing(iconAnim1, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }, 300);

      setTimeout(() => {
        Animated.timing(iconAnim2, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }, 500);

      setTimeout(() => {
        Animated.timing(iconAnim3, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }, 700);

      setTimeout(() => {
        Animated.timing(iconAnim4, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }, 900);
    };

    animateSequence();
  }, []);

  const handleGetStarted = () => {
    router.replace('/(tabs)');
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Mountain size={64} color="#FFFFFF" strokeWidth={2} />
        <Text style={[styles.title, { marginTop: 16 }]}>SnowTracker</Text>
      </View>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.header}>
          <Mountain size={64} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.title}>SnowTracker</Text>
          <Text style={styles.subtitle}>Your Ultimate Snowboarding Companion</Text>
        </View>

        <View style={styles.featuresContainer}>
          <Animated.View 
            style={[
              styles.featureItem,
              { opacity: iconAnim1, transform: [{ scale: iconAnim1 }] }
            ]}
          >
            <MapPin size={32} color="#4A90E2" strokeWidth={2} />
            <Text style={styles.featureText}>Live GPS Tracking</Text>
          </Animated.View>

          <Animated.View 
            style={[
              styles.featureItem,
              { opacity: iconAnim2, transform: [{ scale: iconAnim2 }] }
            ]}
          >
            <MessageCircle size={32} color="#2ECC71" strokeWidth={2} />
            <Text style={styles.featureText}>Walkie-Talkie Chat</Text>
          </Animated.View>

          <Animated.View 
            style={[
              styles.featureItem,
              { opacity: iconAnim3, transform: [{ scale: iconAnim3 }] }
            ]}
          >
            <Camera size={32} color="#FF6B35" strokeWidth={2} />
            <Text style={styles.featureText}>Photo Logging</Text>
          </Animated.View>

          <Animated.View 
            style={[
              styles.featureItem,
              { opacity: iconAnim4, transform: [{ scale: iconAnim4 }] }
            ]}
          >
            <Mountain size={32} color="#9B59B6" strokeWidth={2} />
            <Text style={styles.featureText}>Weather Overlay</Text>
          </Animated.View>
        </View>

        <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
          <Text style={styles.getStartedText}>Hit the Slopes</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a237e',
    backgroundImage: 'linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #5c6bc0 100%)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 64,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 16,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: '#E8EAF6',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 24,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 64,
    gap: 24,
  },
  featureItem: {
    alignItems: 'center',
    width: (width - 64 - 24) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  featureText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  getStartedButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});