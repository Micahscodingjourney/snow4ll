import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Alert,
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mic, Send, Users, Radio, MicOff, MapPin } from 'lucide-react-native';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { Database } from '@/types/database';

const { width } = Dimensions.get('window');

type ChatMessage = Database['public']['Tables']['chat_messages']['Row'] & {
  profiles: {
    username: string;
    avatar_url: string | null;
  } | null;
};

interface GroupMember {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'riding';
  location?: string;
}

export default function ChatScreen() {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const [groupMembers] = useState<GroupMember[]>([
    { id: '1', name: 'Alex', status: 'riding', location: 'Whistler Village' },
    { id: '2', name: 'Sarah', status: 'online', location: 'Peak Chair' },
    { id: '3', name: 'Mike', status: 'riding', location: 'Blackcomb Base' },
    { id: '4', name: 'Emma', status: 'offline' },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState('Group Chat');
  const scrollViewRef = useRef<ScrollView>(null);

  const channels = ['Group Chat', 'Safety Channel', 'Powder Alerts'];

  useEffect(() => {
    if (user) {
      fetchMessages();
      subscribeToMessages();
    }
  }, [user, selectedChannel]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          profiles (
            username,
            avatar_url
          )
        `)
        .eq('channel', selectedChannel.toLowerCase().replace(' ', '_'))
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `channel=eq.${selectedChannel.toLowerCase().replace(' ', '_')}`,
        },
        async (payload) => {
          // Fetch the complete message with profile data
          const { data } = await supabase
            .from('chat_messages')
            .select(`
              *,
              profiles (
                username,
                avatar_url
              )
            `)
            .eq('id', payload.new.id)
            .single();

          if (data) {
            setMessages(prev => [...prev, data]);
            setTimeout(() => {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          channel: selectedChannel.toLowerCase().replace(' ', '_'),
          message: newMessage.trim(),
          message_type: 'text',
        });

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    // Voice recording functionality would be implemented here
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    // Voice message functionality would be implemented here
    // For now, send a text placeholder
    if (user) {
      supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          channel: selectedChannel.toLowerCase().replace(' ', '_'),
          message: 'Voice message (3s)',
          message_type: 'voice',
        });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#4CAF50';
      case 'riding': return '#FF9800';
      case 'offline': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Team Chat</Text>
        <TouchableOpacity style={styles.membersButton}>
          <Users size={20} color="#4A90E2" strokeWidth={2} />
          <Text style={styles.membersCount}>{groupMembers.length}</Text>
        </TouchableOpacity>
      </View>

      {/* Channel Selector */}
      <View style={styles.channelSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {channels.map(channel => (
            <TouchableOpacity
              key={channel}
              style={[
                styles.channelButton,
                selectedChannel === channel && styles.selectedChannelButton
              ]}
              onPress={() => setSelectedChannel(channel)}
            >
              <Text style={[
                styles.channelButtonText,
                selectedChannel === channel && styles.selectedChannelButtonText
              ]}>
                {channel}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Group Members Status */}
      <View style={styles.membersStatus}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {groupMembers.map(member => (
            <View key={member.id} style={styles.memberItem}>
              <View style={styles.memberAvatar}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(member.status) }]} />
                <Text style={styles.memberInitial}>{member.name[0]}</Text>
              </View>
              <Text style={styles.memberName}>{member.name}</Text>
              {member.location && (
                <View style={styles.locationContainer}>
                  <MapPin size={10} color="#8E8E93" strokeWidth={2} />
                  <Text style={styles.locationText}>{member.location}</Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer} 
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading messages...</Text>
          </View>
        ) : (
        messages.map(message => (
          <View 
            key={message.id} 
            style={[
              styles.messageItem,
              message.user_id === user?.id ? styles.myMessage : styles.otherMessage
            ]}
          >
            <View style={styles.messageHeader}>
              <Text style={styles.messageUser}>
                {message.user_id === user?.id ? 'You' : message.profiles?.username || 'Unknown'}
              </Text>
              <Text style={styles.messageTime}>
                {formatTime(new Date(message.created_at || ''))}
              </Text>
            </View>
            <View style={styles.messageContent}>
              {message.message_type === 'voice' && (
                <Radio size={16} color={message.user_id === user?.id ? '#FFFFFF' : '#4A90E2'} strokeWidth={2} />
              )}
              <Text style={[
                styles.messageText,
                message.user_id === user?.id ? styles.myMessageText : styles.otherMessageText
              ]}>
                {message.message}
              </Text>
            </View>
          </View>
        ))
        )}
      </ScrollView>

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor="#8E8E93"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.voiceButton, isRecording && styles.recordingButton]}
            onPressIn={startVoiceRecording}
            onPressOut={stopVoiceRecording}
          >
            {isRecording ? (
              <MicOff size={20} color="#FFFFFF" strokeWidth={2} />
            ) : (
              <Mic size={20} color="#4A90E2" strokeWidth={2} />
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!newMessage.trim()}
          >
            <Send size={20} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>
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
  membersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  membersCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
  },
  channelSelector: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  channelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
  },
  selectedChannelButton: {
    backgroundColor: '#4A90E2',
  },
  channelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  selectedChannelButtonText: {
    color: '#FFFFFF',
  },
  membersStatus: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  memberItem: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 60,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  statusDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  memberInitial: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  memberName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 4,
    textAlign: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  locationText: {
    fontSize: 10,
    color: '#8E8E93',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageItem: {
    marginVertical: 4,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageUser: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  messageTime: {
    fontSize: 11,
    color: '#8E8E93',
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    gap: 8,
    backgroundColor: '#4A90E2',
  },
  otherMessage: {
    backgroundColor: '#FFFFFF',
  },
  myMessageText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 20,
    flex: 1,
  },
  otherMessageText: {
    color: '#1A1A1A',
    fontSize: 16,
    lineHeight: 20,
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    flex: 1,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E1E1E1',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1A1A1A',
    maxHeight: 100,
    backgroundColor: '#F8F9FA',
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingButton: {
    backgroundColor: '#FF3B30',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
});