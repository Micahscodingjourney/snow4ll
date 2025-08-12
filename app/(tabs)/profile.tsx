import React, { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  Dimensions,
  Modal 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Plus, Heart, Share, MapPin, Clock } from 'lucide-react-native';
import CameraView from '@/components/CameraView';

const { width } = Dimensions.get('window');

interface Photo {
  id: string;
  uri: string;
  timestamp: Date;
  location: string;
  likes: number;
  caption?: string;
  rideData?: {
    speed: number;
    elevation: number;
  };
}

export default function PhotosScreen() {
  const { user, profile, signOut } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([
    {
      id: '1',
      uri: 'https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg',
      timestamp: new Date(Date.now() - 3600000),
      location: 'Whistler Peak',
      likes: 24,
      caption: 'Epic powder day! 🏂',
      rideData: { speed: 45, elevation: 2182 }
    },
    {
      id: '2',
      uri: 'https://images.pexels.com/photos/848618/pexels-photo-848618.jpeg',
      timestamp: new Date(Date.now() - 7200000),
      location: 'Blackcomb Glacier',
      likes: 18,
      caption: 'Fresh tracks at sunrise',
      rideData: { speed: 38, elevation: 2284 }
    },
    {
      id: '3',
      uri: 'https://images.pexels.com/photos/1263349/pexels-photo-1263349.jpeg',
      timestamp: new Date(Date.now() - 86400000),
      location: 'Village Gondola',
      likes: 31,
      caption: 'Perfect visibility today',
      rideData: { speed: 42, elevation: 1850 }
    },
    {
      id: '4',
      uri: 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg',
      timestamp: new Date(Date.now() - 172800000),
      location: 'Symphony Bowl',
      likes: 27,
      caption: 'Backcountry adventure',
      rideData: { speed: 52, elevation: 2435 }
    },
    {
      id: '5',
      uri: 'https://images.pexels.com/photos/4983184/pexels-photo-4983184.jpeg',
      timestamp: new Date(Date.now() - 259200000),
      location: 'Harmony Express',
      likes: 15,
      caption: 'Group shot with the crew',
    },
    {
      id: '6',
      uri: 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg',
      timestamp: new Date(Date.now() - 345600000),
      location: 'Crystal Zone',
      likes: 22,
      caption: 'Catching air 🚁',
      rideData: { speed: 48, elevation: 2156 }
    },
  ]);

  const [showCamera, setShowCamera] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const takePhoto = () => {
    setShowCamera(true);
  };

  const handlePhotoTaken = (uri: string) => {
    const newPhoto: Photo = {
      id: Date.now().toString(),
      uri,
      timestamp: new Date(),
      location: 'Current Location',
      likes: 0,
      caption: 'New ride photo',
      rideData: { speed: Math.floor(Math.random() * 50), elevation: 2000 + Math.floor(Math.random() * 400) }
    };
    setPhotos(prev => [newPhoto, ...prev]);
  };

  const likePhoto = (photoId: string) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === photoId 
        ? { ...photo, likes: photo.likes + 1 }
        : photo
    ));
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Photo Log</Text>
        <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
          <Plus size={20} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.photosGrid}>
          {photos.map(photo => (
            <View key={photo.id} style={styles.photoCard}>
              <Image source={{ uri: photo.uri }} style={styles.photo} />
              <View style={styles.photoOverlay}>
                <View style={styles.photoHeader}>
                  <View style={styles.locationInfo}>
                    <MapPin size={12} color="#FFFFFF" strokeWidth={2} />
                    <Text style={styles.photoLocation}>{photo.location}</Text>
                  </View>
                  <Text style={styles.photoTime}>{formatTimeAgo(photo.timestamp)}</Text>
                </View>
                
                {photo.rideData && (
                  <View style={styles.rideDataContainer}>
                    <Text style={styles.rideDataText}>
                      {photo.rideData.speed} km/h • {photo.rideData.elevation}m
                    </Text>
                  </View>
                )}
                
                <View style={styles.photoActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => likePhoto(photo.id)}
                  >
                    <Heart size={16} color="#FFFFFF" strokeWidth={2} />
                    <Text style={styles.actionText}>{photo.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Share size={16} color="#FFFFFF" strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              </View>
              
              {photo.caption && (
                <View style={styles.captionContainer}>
                  <Text style={styles.caption}>{photo.caption}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={showCamera}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <CameraView 
          onClose={() => setShowCamera(false)}
          onPhotoTaken={handlePhotoTaken}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  cameraButton: {
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  photosGrid: {
    padding: 16,
    gap: 16,
  },
  photoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  photo: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 12,
    justifyContent: 'space-between',
  },
  photoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  photoLocation: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  photoTime: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  rideDataContainer: {
    backgroundColor: 'rgba(74, 144, 226, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  rideDataText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  photoActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  captionContainer: {
    padding: 12,
  },
  caption: {
    fontSize: 14,
    color: '#1A1A1A',
    lineHeight: 18,
  },
});