import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Cloud, 
  CloudSnow, 
  Wind, 
  Eye, 
  Thermometer, 
  Droplets,
  Mountain,
  Sun,
  CloudRain,
  MapPin
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface WeatherData {
  temperature: number;
  condition: string;
  windSpeed: number;
  windDirection: string;
  humidity: number;
  visibility: number;
  snowfall: number;
  uvIndex: number;
}

interface HourlyForecast {
  time: string;
  temperature: number;
  condition: string;
  precipitationChance: number;
}

interface MountainCondition {
  elevation: string;
  temperature: number;
  windSpeed: number;
  snowDepth: number;
  condition: string;
}

export default function WeatherScreen() {
  const [currentWeather] = useState<WeatherData>({
    temperature: -8,
    condition: 'Light Snow',
    windSpeed: 15,
    windDirection: 'NW',
    humidity: 78,
    visibility: 8,
    snowfall: 5,
    uvIndex: 3,
  });

  const [hourlyForecast] = useState<HourlyForecast[]>([
    { time: '9 AM', temperature: -10, condition: 'Snow', precipitationChance: 85 },
    { time: '10 AM', temperature: -9, condition: 'Snow', precipitationChance: 80 },
    { time: '11 AM', temperature: -8, condition: 'Cloudy', precipitationChance: 45 },
    { time: '12 PM', temperature: -6, condition: 'Partly Cloudy', precipitationChance: 20 },
    { time: '1 PM', temperature: -5, condition: 'Sunny', precipitationChance: 10 },
    { time: '2 PM', temperature: -4, condition: 'Sunny', precipitationChance: 10 },
  ]);

  const [mountainConditions] = useState<MountainCondition[]>([
    { elevation: 'Village (675m)', temperature: -2, windSpeed: 8, snowDepth: 45, condition: 'Light Snow' },
    { elevation: 'Mid-Mountain (1200m)', temperature: -6, windSpeed: 12, snowDepth: 78, condition: 'Snow' },
    { elevation: 'Alpine (2100m)', temperature: -12, windSpeed: 25, snowDepth: 125, condition: 'Heavy Snow' },
  ]);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun size={24} color="#FFD700" strokeWidth={2} />;
      case 'partly cloudy':
        return <Cloud size={24} color="#8E8E93" strokeWidth={2} />;
      case 'cloudy':
        return <Cloud size={24} color="#6B7280" strokeWidth={2} />;
      case 'light snow':
      case 'snow':
        return <CloudSnow size={24} color="#3B82F6" strokeWidth={2} />;
      case 'heavy snow':
        return <CloudSnow size={24} color="#1E40AF" strokeWidth={2} />;
      case 'rain':
        return <CloudRain size={24} color="#3B82F6" strokeWidth={2} />;
      default:
        return <Cloud size={24} color="#8E8E93" strokeWidth={2} />;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return '#FFD700';
      case 'partly cloudy':
        return '#8E8E93';
      case 'light snow':
      case 'snow':
        return '#3B82F6';
      case 'heavy snow':
        return '#1E40AF';
      default:
        return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Weather Conditions</Text>
          <View style={styles.locationContainer}>
            <MapPin size={16} color="#8E8E93" strokeWidth={2} />
            <Text style={styles.location}>Whistler Blackcomb</Text>
          </View>
        </View>

        <View style={styles.currentWeatherCard}>
          <View style={styles.currentWeatherHeader}>
            {getWeatherIcon(currentWeather.condition)}
            <View style={styles.temperatureContainer}>
              <Text style={styles.temperature}>{currentWeather.temperature}°C</Text>
              <Text style={styles.condition}>{currentWeather.condition}</Text>
            </View>
          </View>
          
          <View style={styles.weatherDetails}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Wind size={20} color="#4A90E2" strokeWidth={2} />
                <Text style={styles.detailLabel}>Wind</Text>
                <Text style={styles.detailValue}>{currentWeather.windSpeed} km/h {currentWeather.windDirection}</Text>
              </View>
              <View style={styles.detailItem}>
                <Droplets size={20} color="#3B82F6" strokeWidth={2} />
                <Text style={styles.detailLabel}>Humidity</Text>
                <Text style={styles.detailValue}>{currentWeather.humidity}%</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Eye size={20} color="#6B7280" strokeWidth={2} />
                <Text style={styles.detailLabel}>Visibility</Text>
                <Text style={styles.detailValue}>{currentWeather.visibility} km</Text>
              </View>
              <View style={styles.detailItem}>
                <CloudSnow size={20} color="#1E40AF" strokeWidth={2} />
                <Text style={styles.detailLabel}>Fresh Snow</Text>
                <Text style={styles.detailValue}>{currentWeather.snowfall} cm</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hourly Forecast</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hourlyScroll}>
            {hourlyForecast.map((hour, index) => (
              <View key={index} style={styles.hourlyItem}>
                <Text style={styles.hourlyTime}>{hour.time}</Text>
                {getWeatherIcon(hour.condition)}
                <Text style={styles.hourlyTemp}>{hour.temperature}°</Text>
                <Text style={styles.hourlyPrecip}>{hour.precipitationChance}%</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mountain Conditions</Text>
          {mountainConditions.map((condition, index) => (
            <View key={index} style={styles.mountainCard}>
              <View style={styles.mountainHeader}>
                <Mountain size={20} color="#4A90E2" strokeWidth={2} />
                <Text style={styles.elevationText}>{condition.elevation}</Text>
                <View style={[styles.conditionDot, { backgroundColor: getConditionColor(condition.condition) }]} />
              </View>
              <View style={styles.mountainStats}>
                <View style={styles.mountainStat}>
                  <Thermometer size={16} color="#8E8E93" strokeWidth={2} />
                  <Text style={styles.mountainStatText}>{condition.temperature}°C</Text>
                </View>
                <View style={styles.mountainStat}>
                  <Wind size={16} color="#8E8E93" strokeWidth={2} />
                  <Text style={styles.mountainStatText}>{condition.windSpeed} km/h</Text>
                </View>
                <View style={styles.mountainStat}>
                  <CloudSnow size={16} color="#8E8E93" strokeWidth={2} />
                  <Text style={styles.mountainStatText}>{condition.snowDepth} cm</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.alertsSection}>
          <Text style={styles.sectionTitle}>Weather Alerts</Text>
          <View style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <CloudSnow size={20} color="#3B82F6" strokeWidth={2} />
              <Text style={styles.alertTitle}>Fresh Snow Alert</Text>
            </View>
            <Text style={styles.alertText}>
              10-15 cm of fresh powder expected overnight. Perfect conditions for early morning runs!
            </Text>
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
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
  currentWeatherCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginVertical: 16,
    borderRadius: 20,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  currentWeatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  temperatureContainer: {
    flex: 1,
  },
  temperature: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  condition: {
    fontSize: 18,
    color: '#8E8E93',
    fontWeight: '500',
  },
  weatherDetails: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  section: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  hourlyScroll: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
  },
  hourlyItem: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 6,
  },
  hourlyTime: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
  },
  hourlyTemp: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '700',
  },
  hourlyPrecip: {
    fontSize: 11,
    color: '#3B82F6',
    fontWeight: '500',
  },
  mountainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mountainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  elevationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
  },
  conditionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  mountainStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  mountainStat: {
    alignItems: 'center',
    gap: 4,
  },
  mountainStatText: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  alertsSection: {
    marginHorizontal: 24,
    marginBottom: 32,
  },
  alertCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  alertText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});