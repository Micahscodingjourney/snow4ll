import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, Pause, Square, MapPin, Clock, TrendingUp } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function RidesScreen() {
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(0);
  const [currentRide, setCurrentRide] = useState({
    distance: 0,
    topSpeed: 0,
    elevation: 2453,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking && !isPaused) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
        // Simulate ride data updates
        setCurrentRide(prev => ({
          ...prev,
          distance: prev.distance + (Math.random() * 0.1),
          topSpeed: Math.max(prev.topSpeed, Math.random() * 60),
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, isPaused]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTracking = () => {
    setIsTracking(true);
    setIsPaused(false);
  };

  const pauseTracking = () => {
    setIsPaused(!isPaused);
  };

  const stopTracking = () => {
    setIsTracking(false);
    setIsPaused(false);
    setTimer(0);
    setCurrentRide({
      distance: 0,
      topSpeed: 0,
      elevation: 2453,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Today's Rides</Text>
          <View style={styles.locationContainer}>
            <MapPin size={16} color="#8E8E93" strokeWidth={2} />
            <Text style={styles.location}>Whistler Blackcomb</Text>
          </View>
        </View>

        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <MapPin size={48} color="#4A90E2" strokeWidth={2} />
            <Text style={styles.mapText}>GPS Map View</Text>
            <Text style={styles.mapSubtext}>Live tracking will appear here</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Clock size={24} color="#4A90E2" strokeWidth={2} />
            <Text style={styles.statValue}>{formatTime(timer)}</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
          <View style={styles.statCard}>
            <TrendingUp size={24} color="#2ECC71" strokeWidth={2} />
            <Text style={styles.statValue}>{currentRide.distance.toFixed(1)} km</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>
          <View style={styles.statCard}>
            <TrendingUp size={24} color="#FF6B35" strokeWidth={2} />
            <Text style={styles.statValue}>{currentRide.topSpeed.toFixed(0)} km/h</Text>
            <Text style={styles.statLabel}>Top Speed</Text>
          </View>
        </View>

        <View style={styles.controlsContainer}>
          {!isTracking ? (
            <TouchableOpacity style={styles.startButton} onPress={startTracking}>
              <Play size={24} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.startButtonText}>Start Ride</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.trackingControls}>
              <TouchableOpacity 
                style={[styles.controlButton, styles.pauseButton]} 
                onPress={pauseTracking}
              >
                {isPaused ? (
                  <Play size={20} color="#FFFFFF" strokeWidth={2} />
                ) : (
                  <Pause size={20} color="#FFFFFF" strokeWidth={2} />
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.controlButton, styles.stopButton]} 
                onPress={stopTracking}
              >
                <Square size={20} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.recentRides}>
          <Text style={styles.sectionTitle}>Recent Rides</Text>
          <View style={styles.rideItem}>
            <View style={styles.rideInfo}>
              <Text style={styles.rideName}>Morning Powder Run</Text>
              <Text style={styles.rideDetails}>2.3 km • 45 min • Max 52 km/h</Text>
            </View>
            <Text style={styles.rideDate}>Yesterday</Text>
          </View>
          <View style={styles.rideItem}>
            <View style={styles.rideInfo}>
              <Text style={styles.rideName}>Afternoon Freestyle</Text>
              <Text style={styles.rideDetails}>1.8 km • 32 min • Max 48 km/h</Text>
            </View>
            <Text style={styles.rideDate}>2 days ago</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  location: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
  mapContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mapPlaceholder: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  mapText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 8,
  },
  mapSubtext: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
    marginTop: 4,
  },
  controlsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  startButton: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 25,
    gap: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  trackingControls: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  controlButton: {
    padding: 16,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  pauseButton: {
    backgroundColor: '#FF9500',
  },
  stopButton: {
    backgroundColor: '#FF3B30',
  },
  recentRides: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  rideItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  rideInfo: {
    flex: 1,
  },
  rideName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  rideDetails: {
    fontSize: 14,
    color: '#8E8E93',
  },
  rideDate: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
});