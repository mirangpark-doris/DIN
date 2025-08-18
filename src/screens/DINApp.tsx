import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
} from 'react-native';
import { Tab, Position, Tranche } from '../types/din';
import { MockAPI } from '../utils/dinUtils';
import { Badge, Button, Input, Countdown, OracleBadgeGroup, NAVWidget, RiskNotice } from '../components/DINComponents';
import { BeginnerProvider, useBeginnerMode } from '../contexts/BeginnerContext';
import { getTerm } from '../utils/terminology';
import CatalogScreen from './CatalogScreen';
import PortfolioScreen from './PortfolioScreen';

const TABS: Tab[] = ["catalog", "portfolio"];

// SVG Icons as React components
const CatalogIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 3h18v2H3V3zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"
      fill={active ? "#1F2937" : "#6B7280"}
    />
  </svg>
);

const PortfolioIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      fill={active ? "#1F2937" : "#6B7280"}
    />
  </svg>
);

function DINAppContent() {
  const [activeTab, setActiveTab] = useState<Tab>("catalog");
  const [selectedTranche, setSelectedTranche] = useState<Tranche | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [buyAmount, setBuyAmount] = useState('1000');
  const [sellCollateral, setSellCollateral] = useState('2000');
  const [buyQuote, setBuyQuote] = useState<{ premium: number; total: number } | null>(null);
  const [sellQuote, setSellQuote] = useState<{ premiumEarn: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { beginner, toggle } = useBeginnerMode();

  // Debug logging
  console.log('Beginner mode state:', beginner);

  const handleSelectTranche = async (trancheId: string) => {
    try {
      const tranche = await MockAPI.getTranche(trancheId);
      setSelectedTranche(tranche);
      setActiveTab("product");
    } catch (error) {
      console.error('Failed to load tranche:', error);
    }
  };

  const handleBuy = async () => {
    if (!selectedTranche) return;
    
    setIsProcessing(true);
    try {
      const amount = parseFloat(buyAmount);
      const { txHash, positionId } = await MockAPI.buy(selectedTranche.id, amount);
      
      const newPosition: Position = {
        id: positionId,
        type: "buy",
        trancheId: selectedTranche.id,
        amount,
        filled: 1,
        avgPremium: selectedTranche.premium,
        txHash,
        state: "active",
      };
      
      setPositions(prev => [newPosition, ...prev]);
      setActiveTab("portfolio");
    } catch (error) {
      console.error('Buy failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSell = async () => {
    if (!selectedTranche) return;
    
    setIsProcessing(true);
    try {
      const collateral = parseFloat(sellCollateral);
      const { txHash, positionId } = await MockAPI.sell(selectedTranche.id, collateral);
      
      const newPosition: Position = {
        id: positionId,
        type: "sell",
        trancheId: selectedTranche.id,
        amount: collateral,
        filled: 1,
        avgPremium: selectedTranche.premium,
        txHash,
        state: "active",
      };
      
      setPositions(prev => [newPosition, ...prev]);
      setActiveTab("portfolio");
    } catch (error) {
      console.error('Sell failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const updateBuyQuote = async () => {
    if (!selectedTranche) return;
    const amount = parseFloat(buyAmount);
    if (amount > 0) {
      const quote = await MockAPI.quoteBuy(selectedTranche.id, amount);
      setBuyQuote(quote);
    }
  };

  const updateSellQuote = async () => {
    if (!selectedTranche) return;
    const collateral = parseFloat(sellCollateral);
    if (collateral > 0) {
      const quote = await MockAPI.quoteSell(selectedTranche.id, collateral);
      setSellQuote(quote);
    }
  };

  React.useEffect(() => {
    if (activeTab === "buy") {
      updateBuyQuote();
    } else if (activeTab === "sell") {
      updateSellQuote();
    }
  }, [activeTab, buyAmount, sellCollateral, selectedTranche?.id]);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.logo} />
        <Text style={styles.logoText}>DIN</Text>
        <Badge tone="amber">MVP</Badge>
      </View>
      <View style={styles.headerRight}>
        <View style={styles.beginnerToggle}>
          <Text style={styles.beginnerLabel}>{getTerm('beginnerMode', beginner)}</Text>
          <Switch
            value={beginner}
            onValueChange={(value) => {
              console.log('Switch toggled to:', value);
              toggle();
            }}
            trackColor={{ false: '#D1D5DB', true: '#1F2937' }}
            thumbColor={beginner ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "catalog":
        return <CatalogScreen onSelectTranche={handleSelectTranche} />;
      
      case "product":
        if (!selectedTranche) return null;
        return (
          <ScrollView style={styles.container}>
            <View style={styles.productHeader}>
              <Text style={styles.productTitle}>
                {selectedTranche.asset} {selectedTranche.trigger.value}%
              </Text>
              <Countdown to={selectedTranche.maturity} />
            </View>
            
            <View style={styles.productDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{getTerm('maturity', beginner)}</Text>
                <Text style={styles.detailValue}>
                  {new Date(selectedTranche.maturity).toLocaleString()}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{getTerm('premium', beginner)}</Text>
                <Text style={styles.detailValue}>{selectedTranche.premium.toFixed(2)}%</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{getTerm('remainingCapacity', beginner)}</Text>
                <Text style={styles.detailValue}>
                  ${selectedTranche.pool.remainingCapacity.toLocaleString()}
                </Text>
              </View>
            </View>
            
            <NAVWidget nav={selectedTranche.pool.nav} />
            <OracleBadgeGroup 
              primary={selectedTranche.oracle.primary} 
              fallbacks={selectedTranche.oracle.fallbacks} 
              rule={selectedTranche.oracle.rule} 
            />
            
            <View style={styles.actionButtons}>
              <Button 
                title={getTerm('actionBuy', beginner)} 
                onPress={() => setActiveTab("buy")} 
                style={styles.actionButton}
              />
              <Button 
                title={getTerm('actionSell', beginner)} 
                onPress={() => setActiveTab("sell")} 
                variant="secondary"
                style={styles.actionButton}
              />
            </View>
          </ScrollView>
        );
      
      case "buy":
        if (!selectedTranche) return null;
        return (
          <ScrollView style={styles.container}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{getTerm('actionBuy', beginner)}</Text>
              <View style={styles.form}>
                <Text style={styles.label}>{getTerm('actionBuy', beginner)} 금액(USDT)</Text>
                <Input
                  value={buyAmount}
                  onChangeText={setBuyAmount}
                  keyboardType="numeric"
                  placeholder="1000"
                />
                
                {buyQuote && (
                  <View style={styles.quoteInfo}>
                    <View style={styles.quoteRow}>
                      <Text style={styles.quoteLabel}>예상 {getTerm('premium', beginner)}</Text>
                      <Text style={styles.quoteValue}>${buyQuote.premium.toFixed(2)}</Text>
                    </View>
                    <View style={styles.quoteRow}>
                      <Text style={styles.quoteLabel}>총 비용</Text>
                      <Text style={styles.quoteValue}>${buyQuote.total.toFixed(2)}</Text>
                    </View>
                  </View>
                )}
                
                <Button
                  title={isProcessing ? getTerm('actionProcessing', beginner) : getTerm('actionSign', beginner)}
                  onPress={handleBuy}
                  disabled={isProcessing}
                  style={styles.submitButton}
                />
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{getTerm('sectionRiskNotice', beginner)}</Text>
              <RiskNotice />
            </View>
          </ScrollView>
        );
      
      case "sell":
        if (!selectedTranche) return null;
        return (
          <ScrollView style={styles.container}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{getTerm('actionSell', beginner)}</Text>
              <View style={styles.form}>
                <Text style={styles.label}>예치 {getTerm('collateral', beginner)}(USDT)</Text>
                <Input
                  value={sellCollateral}
                  onChangeText={setSellCollateral}
                  keyboardType="numeric"
                  placeholder="2000"
                />
                
                {sellQuote && (
                  <View style={styles.quoteInfo}>
                    <View style={styles.quoteRow}>
                      <Text style={styles.quoteLabel}>예상 {getTerm('premium', beginner)} 수취</Text>
                      <Text style={styles.quoteValue}>${sellQuote.premiumEarn.toFixed(2)}</Text>
                    </View>
                  </View>
                )}
                
                <Button
                  title={isProcessing ? getTerm('actionProcessing', beginner) : getTerm('actionSign', beginner)}
                  onPress={handleSell}
                  disabled={isProcessing}
                  style={styles.submitButton}
                />
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{getTerm('sectionRiskNotice', beginner)}</Text>
              <RiskNotice />
            </View>
          </ScrollView>
        );
      
      case "portfolio":
        return <PortfolioScreen positions={positions} />;
      
      default:
        return null;
    }
  };

  const renderBottomNavigation = () => (
    <View style={[
      styles.bottomNavContainerBase,
      Platform.OS === 'web' ? styles.bottomNavContainerWeb : styles.bottomNavContainerNative,
    ]}>
      <View style={styles.bottomNav}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.bottomNavItem, activeTab === tab && styles.bottomNavItemActive]}
            onPress={() => setActiveTab(tab)}
          >
            {tab === "catalog" ? (
              <CatalogIcon active={activeTab === tab} />
            ) : (
              <PortfolioIcon active={activeTab === tab} />
            )}
            <Text style={[styles.bottomNavText, activeTab === tab && styles.bottomNavTextActive]}>
              {getTabLabel(tab)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.app}>
      {renderHeader()}
      <View style={styles.content}>
        {renderContent()}
      </View>
      {renderBottomNavigation()}
    </View>
  );
}

export default function DINApp() {
  return (
    <BeginnerProvider>
      <DINAppContent />
    </BeginnerProvider>
  );
}

function getTabLabel(tab: Tab): string {
  const { beginner } = useBeginnerMode();
  
  switch (tab) {
    case "catalog": return getTerm('sectionCatalog', beginner);
    case "portfolio": return getTerm('sectionPortfolio', beginner);
    default: return tab;
  }
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  logo: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#1F2937',
    marginRight: 8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 8,
  },
  beginnerToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  beginnerLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 8,
  },
  content: {
    flex: 1,
    paddingBottom: 68,
  },
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 80,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
  },
  productDetails: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  form: {
    // gap: 12, // Not supported in all React Native versions
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  quoteInfo: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  quoteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  quoteLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  quoteValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  submitButton: {
    marginTop: 8,
  },
  bottomNavContainerBase: {
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  bottomNavContainerNative: {
    position: 'absolute',
    bottom: 0,
  },
  // @ts-ignore - position: 'fixed' is supported on web via react-native-web
  bottomNavContainerWeb: {
    position: 'fixed',
    bottom: 0,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  bottomNavItemActive: {
    backgroundColor: 'transparent',
  },
  bottomNavText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 2,
  },
  bottomNavTextActive: {
    color: '#1F2937',
    fontWeight: '600',
  },
});
