import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Tranche } from '../types/din';
import { MockAPI } from '../utils/dinUtils';
import { TrancheCard, RiskNotice } from '../components/DINComponents';
import { useBeginnerMode } from '../contexts/BeginnerContext';
import { getTerm } from '../utils/terminology';

interface CatalogScreenProps {
  onSelectTranche: (id: string) => void;
}

export default function CatalogScreen({ onSelectTranche }: CatalogScreenProps) {
  const [tranches, setTranches] = useState<Tranche[]>([]);
  const [loading, setLoading] = useState(true);
  const { beginner } = useBeginnerMode();

  useEffect(() => {
    loadTranches();
  }, []);

  const loadTranches = async () => {
    try {
      const data = await MockAPI.listTranches();
      setTranches(data);
    } catch (error) {
      console.error('Failed to load tranches:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{getTerm('sectionCatalog', beginner)}</Text>
      </View>

      <View style={styles.tranchesContainer}>
        {tranches.map(tranche => (
          <TrancheCard
            key={tranche.id}
            t={tranche}
            onSelect={onSelectTranche}
          />
        ))}
      </View>

      <View style={styles.riskSection}>
        <Text style={styles.sectionTitle}>{getTerm('sectionRiskNotice', beginner)}</Text>
        <RiskNotice />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingBottom: 100, // Add padding for floating navigation
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
  },
  tranchesContainer: {
    padding: 16,
  },
  riskSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6B7280',
    marginTop: 50,
  },
});
