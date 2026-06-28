import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@notekeeper_notes';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState('');

  async function simpanKeStorage(data) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.log(e);
    }
  }

  async function loadStorage() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);

      if (data != null) {
        setNotes(JSON.parse(data));
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    loadStorage();
  }, []);

  function tambahCatatan() {
    if (input.trim() === '') {
      Alert.alert('Peringatan', 'Catatan tidak boleh kosong');
      return;
    }

    const catatanBaru = {
      id: Date.now().toString(),
      teks: input,
      selesai: false,
    };

    const dataBaru = [catatanBaru, ...notes];

    setNotes(dataBaru);
    simpanKeStorage(dataBaru);
    setInput('');
  }

  function toggleSelesai(id) {
    const dataBaru = notes.map((item) =>
      item.id === id
        ? { ...item, selesai: !item.selesai }
        : item
    );

    setNotes(dataBaru);
    simpanKeStorage(dataBaru);
  }

  function hapusCatatan(id) {
    Alert.alert(
      'Hapus Catatan',
      'Yakin ingin menghapus catatan ini?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            const dataBaru = notes.filter(
              (item) => item.id !== id
            );

            setNotes(dataBaru);
            simpanKeStorage(dataBaru);
          },
        },
      ]
    );
  }

  const total = notes.length;
  const selesai = notes.filter(
    (item) => item.selesai
  ).length;
  const pending = total - selesai;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F4F7FC"
      />

      <Text style={styles.logo}>📝</Text>

      <Text style={styles.title}>
        NoteKeeper+
      </Text>

      <Text style={styles.subtitle}>
        Capture your ideas. Anytime, anywhere.
      </Text>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {total}
          </Text>

          <Text style={styles.statLabel}>
            📄 Total
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text
            style={[
              styles.statNumber,
              { color: '#22C55E' },
            ]}>
            {selesai}
          </Text>

          <Text style={styles.statLabel}>
            ✅ Done
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text
            style={[
              styles.statNumber,
              { color: '#F59E0B' },
            ]}>
            {pending}
          </Text>

          <Text style={styles.statLabel}>
            ⏳ Pending
          </Text>
        </View>
      </View>

            <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Tambah catatan..."
          value={input}
          onChangeText={setInput}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={tambahCatatan}
        >
          <Text style={styles.addButtonText}>
            + Tambah
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📝</Text>

            <Text style={styles.emptyTitle}>
              Belum ada catatan
            </Text>

            <Text style={styles.emptySubtitle}>
              Yuk buat catatan pertamamu!
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.noteCard}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => toggleSelesai(item.id)}
            >
              <Text
                style={[
                  styles.noteText,
                  item.selesai && styles.noteDone,
                ]}
              >
                {item.selesai ? '✅ ' : '⬜ '}
                {item.teks}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => hapusCatatan(item.id)}
            >
              <Text style={styles.deleteButton}>
                🗑️
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
    paddingHorizontal: 20,
    paddingTop: 40,
  },

  logo: {
    fontSize: 55,
    textAlign: 'center',
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1E293B',
    marginTop: 5,
  },

  subtitle: {
    textAlign: 'center',
    color: '#64748B',
    marginBottom: 25,
    marginTop: 5,
  },

  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  statItem: {
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4F8EF7',
  },

  statLabel: {
    marginTop: 5,
    color: '#64748B',
    fontSize: 13,
  },

  inputRow: {
    flexDirection: 'row',
    marginBottom: 18,
  },

  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    elevation: 2,
  },

  addButton: {
    backgroundColor: '#4F8EF7',
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginLeft: 10,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },

    emptyContainer: {
    marginTop: 80,
    alignItems: 'center',
  },

  emptyIcon: {
    fontSize: 70,
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#334155',
  },

  emptySubtitle: {
    marginTop: 8,
    color: '#94A3B8',
    textAlign: 'center',
    fontSize: 15,
  },

  noteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  noteText: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
  },

  noteDone: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },

  deleteButton: {
    fontSize: 22,
    marginLeft: 12,
  },
});