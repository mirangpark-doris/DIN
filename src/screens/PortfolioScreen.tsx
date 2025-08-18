import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Position } from '../types/din';
import { formatUSD, formatPct } from '../utils/dinUtils';
import { Badge } from '../components/DINComponents';
import { useBeginnerMode } from '../contexts/BeginnerContext';
import { getTerm } from '../utils/terminology';

interface PortfolioScreenProps {
  positions: Position[];
}

export default function PortfolioScreen({ positions }: PortfolioScreenProps) {
  const { beginner } = useBeginnerMode();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{getTerm('sectionPortfolio', beginner)}</Text>
      </View>

      <View style={styles.tableContainer}>
        {positions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{getTerm('position', beginner)}이 없습니다</Text>
            <Text style={styles.emptySubtext}>{getTerm('sectionCatalog', beginner)}에서 {getTerm('tranche', beginner)}을 {getTerm('buy', beginner)}하거나 {getTerm('sell', beginner)}해보세요</Text>
          </View>
        ) : (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>ID</Text>
              <Text style={styles.headerCell}>유형</Text>
              <Text style={styles.headerCell}>{getTerm('tranche', beginner)}</Text>
              <Text style={[styles.headerCell, styles.textRight]}>금액</Text>
              <Text style={[styles.headerCell, styles.textRight]}>{getTerm('filled', beginner)}</Text>
              <Text style={[styles.headerCell, styles.textRight]}>평균 {getTerm('premium', beginner)}</Text>
              <Text style={styles.headerCell}>상태</Text>
            </View>

            {positions.map(position => (
              <View key={position.id} style={styles.tableRow}>
                <Text style={styles.cell}>{position.id}</Text>
                <Text style={styles.cell}>{getTerm(position.type, beginner)}</Text>
                <Text style={styles.cell}>{position.trancheId}</Text>
                <Text style={[styles.cell, styles.textRight]}>{formatUSD(position.amount)}</Text>
                <Text style={[styles.cell, styles.textRight]}>{(position.filled * 100).toFixed(0)}%</Text>
                <Text style={[styles.cell, styles.textRight]}>{formatPct(position.avgPremium)}</Text>
                <View style={styles.cell}>
                  <Badge>{position.state}</Badge>
                </View>
              </View>
            ))}
          </View>
        )}
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
  tableContainer: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  table: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cell: {
    flex: 1,
    fontSize: 12,
    color: '#1F2937',
  },
  textRight: {
    textAlign: 'right',
  },
});
