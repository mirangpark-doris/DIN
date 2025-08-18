import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Button, Input } from '../components/DINComponents';
import { useBeginnerMode } from '../contexts/BeginnerContext';
import { getTerm } from '../utils/terminology';

export default function AdminScreen() {
  const [asset, setAsset] = useState('');
  const [trigger, setTrigger] = useState('');
  const [maturity, setMaturity] = useState('');
  const { beginner } = useBeginnerMode();

  const handlePreview = () => {
    // Preview logic would go here
    console.log('Preview:', { asset, trigger, maturity });
  };

  const handleCreate = () => {
    // Create logic would go here
    console.log('Create:', { asset, trigger, maturity });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{getTerm('sectionAdmin', beginner)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{getTerm('tranche', beginner)}/{getTerm('tranche', beginner)} 생성</Text>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>자산</Text>
            <Input
              value={asset}
              onChangeText={setAsset}
              placeholder="BTC"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{getTerm('trigger', beginner)}(%)</Text>
            <Input
              value={trigger}
              onChangeText={setTrigger}
              placeholder="-10"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{getTerm('maturity', beginner)}(일)</Text>
            <Input
              value={maturity}
              onChangeText={setMaturity}
              placeholder="14"
              keyboardType="numeric"
            />
          </View>
        </View>
        
        <View style={styles.buttonGroup}>
          <Button title="미리보기" onPress={handlePreview} style={styles.button} />
          <Button 
            title="생성" 
            onPress={handleCreate} 
            variant="secondary"
            style={styles.button} 
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{getTerm('oracle', beginner)} 라우팅</Text>
        <View style={styles.oracleInfo}>
          <Text style={styles.oracleText}>
            {getTerm('oraclePrimary', beginner)} / {getTerm('oracleFallback', beginner)} / {getTerm('oracleRule', beginner)} 설정 (UI 연결 예정)
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  form: {
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  oracleInfo: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  oracleText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
