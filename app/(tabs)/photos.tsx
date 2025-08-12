import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { Database } from '@/types/database';

const { width } = Dimensions.get('window');

type Photo = Database['public']['Tables']['ride_photos']['Row'] & {
  profiles: {
    username: string;
    avatar_url: string | null;
  } | null;
};

export default function PhotosScreen() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPhotos();
    }
  }, [user]);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('ride_photos')
        .select(`
          *,
          profiles (
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = () => {
    setShowCamera(true);
  };

  const handlePhotoTaken = async (uri: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ride_photos')
        .insert({
          user_id: user.id,
          photo_url: uri,
          caption: 'New ride photo',
          location: 'Current Location',
          ride_data: {
            speed: Math.floor(Math.random() * 50),
            elevation: 2000 + Math.floor(Math.random() * 400)
          }
        })
        .select(`
          *,
          profiles (
            username,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;
      if (data) {
        setPhotos(prev => [data, ...prev]);
      }
    } catch (error) {
      console.error('Error saving photo:', error);
    }
  };

  const likePhoto = async (photoId: string) => {
    if (!user) return;

    try {
      // Check if user already liked this photo
      const { data: existingLike } = await supabase
        .from('photo_likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('photo_id', photoId)
        .single();

      if (existingLike) {
        // Unlike the photo
        await supabase
          .from('photo_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('photo_id', photoId);
      } else {
        // Like the photo
        await supabase
          .from('photo_likes')
          .insert({
            user_id: user.id,
            photo_id: photoId
          });
      }

      // Refresh photos to get updated like count
      fetchPhotos();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
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
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading photos...</Text>
            </View>
          ) : (
          photos.map(photo => (
            <View key={photo.id} style={styles.photoCard}>
              <Image source={{ uri: photo.photo_url }} style={styles.photo} />
              <View style={styles.photoOverlay}>
                <View style={styles.photoHeader}>
                  <View style={styles.locationInfo}>
                    <MapPin size={12} color="#FFFFFF" strokeWidth={2} />
                    <Text style={styles.photoLocation}>{photo.location}</Text>
                  </View>
                  <Text style={styles.photoTime}>{formatTimeAgo(new Date(photo.created_at || ''))}</Text>
                </View>
                
                {photo.ride_data && (
                  <View style={styles.rideDataContainer}>
                    <Text style={styles.rideDataText}>
                      {(photo.ride_data as any)?.speed} km/h • {(photo.ride_data as any)?.elevation}m
                    </Text>
                  </View>
                )}
                
                <View style={styles.photoActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => likePhoto(photo.id)}
                  >
                    <Heart size={16} color="#FFFFFF" strokeWidth={2} />
                    <Text style={styles.actionText}>{photo.likes_count || 0}</Text>
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
          ))
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 16,
    color: '#8E8E93',
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