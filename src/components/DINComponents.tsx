import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { OracleSource, Tranche, Position } from '../types/din';
import { formatUSD, formatPct, timeLeft } from '../utils/dinUtils';
import { useBeginnerMode } from '../contexts/BeginnerContext';
import { getTerm, getDescription } from '../utils/terminology';

// --------------- Reusable UI Components -----------------
export const Badge: React.FC<{ children: React.ReactNode; tone?: "zinc" | "emerald" | "amber" | "red" }>
  = ({ children, tone = "zinc" }) => {
  const getBadgeStyle = () => {
    switch (tone) {
      case "emerald": return styles.badgeEmerald;
      case "amber": return styles.badgeAmber;
      case "red": return styles.badgeRed;
      default: return styles.badgeZinc;
    }
  };

  return (
    <View style={[styles.badge, getBadgeStyle()]}>
      <Text style={[styles.badgeText, tone === "emerald" && styles.badgeTextEmerald]}>
        {children}
      </Text>
    </View>
  );
};

export const Button: React.FC<{
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  style?: any;
}> = ({ title, onPress, disabled = false, variant = "primary", style }) => (
  <TouchableOpacity
    style={[
      styles.button,
      variant === "primary" ? styles.buttonPrimary : styles.buttonSecondary,
      disabled && styles.buttonDisabled,
      style
    ]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={[
      styles.buttonText,
      variant === "primary" ? styles.buttonTextPrimary : styles.buttonTextSecondary,
      disabled && styles.buttonTextDisabled
    ]}>
      {title}
    </Text>
  </TouchableOpacity>
);

export const Input: React.FC<{
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric";
  style?: any;
}> = ({ value, onChangeText, placeholder, keyboardType = "default", style }) => (
  <TextInput
    style={[styles.input, style]}
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    keyboardType={keyboardType}
    placeholderTextColor="#8E8E93"
  />
);

// --------------- Specialized Components -----------------
export const OracleBadgeGroup: React.FC<{ primary: OracleSource; fallbacks: OracleSource[]; rule: string }>
  = ({ primary, fallbacks, rule }) => {
  const { beginner } = useBeginnerMode();
  
  return (
    <View style={styles.oracleGroup}>
      <Badge tone="emerald">{getTerm('oraclePrimary', beginner)}: {primary}</Badge>
      {fallbacks.map(f => <Badge key={f}>{getTerm('oracleFallback', beginner)}: {f}</Badge>)}
      <Badge tone="amber">{getTerm('oracleRule', beginner)}: {rule}</Badge>
    </View>
  );
};

export const Countdown: React.FC<{ to: string }> = ({ to }) => {
  const [time, setTime] = useState(timeLeft(to));
  
  useEffect(() => {
    const id = setInterval(() => setTime(timeLeft(to)), 1000);
    return () => clearInterval(id);
  }, [to]);
  
  return (
    <Text style={styles.countdown}>
      {time.days}d {time.hours}h {time.minutes}m {time.seconds}s
    </Text>
  );
};

export const TXReceipt: React.FC<{ txHash?: string }> = ({ txHash }) => {
  const { beginner } = useBeginnerMode();
  
  if (!txHash) return null;
  return (
    <Text style={styles.txReceipt}>
      <Text style={styles.txLabel}>{getTerm('txHash', beginner)}:</Text> {txHash}
    </Text>
  );
};

export const RiskNotice: React.FC = () => {
  const { beginner } = useBeginnerMode();
  
  return (
    <View style={styles.riskNotice}>
      <Text style={styles.riskText}>
        {getDescription('descriptionTranche', beginner)}. {getDescription('descriptionSettlement', beginner)}.
      </Text>
      <Text style={styles.riskText}>
        {getDescription('descriptionOracle', beginner)}.
      </Text>
      <Text style={styles.riskText}>
        {getDescription('descriptionWarning', beginner)}.
      </Text>
    </View>
  );
};

export const NAVWidget: React.FC<{ nav: number }> = ({ nav }) => (
  <View style={styles.navContainer}>
    <View style={styles.navBar}>
      <View style={[styles.navFill, { width: `${Math.min(100, nav * 100)}%` }]} />
    </View>
  </View>
);

export const TrancheCard: React.FC<{ t: Tranche; onSelect: (id: string) => void }>
  = ({ t, onSelect }) => {
  const { beginner } = useBeginnerMode();
  
  const getStatusText = (status: string) => {
    switch (status) {
      case "on_sale": return getTerm('statusOnSale', beginner);
      case "upcoming": return getTerm('statusUpcoming', beginner);
      case "sale_ended": return getTerm('statusSaleEnded', beginner);
      case "settled": return getTerm('statusSettled', beginner);
      default: return status;
    }
  };
  
  return (
    <TouchableOpacity style={styles.trancheCard} onPress={() => onSelect(t.id)}>
      <View style={styles.trancheHeader}>
        <View>
          <Text style={styles.trancheTitle}>{t.asset} {t.trigger.value}%</Text>
          <Text style={styles.trancheMaturity}>
            {getTerm('maturity', beginner)} <Countdown to={t.maturity} />
          </Text>
        </View>
        <Badge tone={t.status === "on_sale" ? "emerald" : t.status === "upcoming" ? "amber" : "zinc"}>
          {getStatusText(t.status)}
        </Badge>
      </View>
      
      <View style={styles.trancheStats}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>{getTerm('premium', beginner)}</Text>
          <Text style={styles.statValue}>{formatPct(t.premium)}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>{getTerm('remainingCapacity', beginner)}</Text>
          <Text style={styles.statValue}>{formatUSD(t.pool.remainingCapacity)}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>{getTerm('poolTvl', beginner)}</Text>
          <Text style={styles.statValue}>{formatUSD(t.pool.tvl)}</Text>
        </View>
      </View>
      
      <OracleBadgeGroup primary={t.oracle.primary} fallbacks={t.oracle.fallbacks} rule={t.oracle.rule} />
    </TouchableOpacity>
  );
};

// --------------- Styles -----------------
const styles = StyleSheet.create({
  // Badge styles
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 4,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  badgeZinc: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E5E5E5',
  },
  badgeEmerald: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  badgeAmber: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FCD34D',
  },
  badgeRed: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  badgeTextEmerald: {
    color: '#065F46',
  },

  // Button styles
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  buttonPrimary: {
    backgroundColor: '#1F2937',
  },
  buttonSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  buttonTextPrimary: {
    color: '#FFFFFF',
  },
  buttonTextSecondary: {
    color: '#1F2937',
  },
  buttonTextDisabled: {
    color: '#9CA3AF',
  },

  // Input styles
  input: {
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },

  // Oracle group
  oracleGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    alignItems: 'flex-start',
  },

  // Countdown
  countdown: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'monospace',
  },

  // TX Receipt
  txReceipt: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  txLabel: {
    fontWeight: '600',
  },

  // Risk Notice
  riskNotice: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  riskText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 4,
  },
  bold: {
    fontWeight: '600',
  },

  // NAV Widget
  navContainer: {
    marginTop: 12,
  },
  navBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  navFill: {
    height: '100%',
    backgroundColor: '#1F2937',
  },

  // Tranche Card
  trancheCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  trancheHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  trancheTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  trancheMaturity: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  trancheStats: {
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
});
