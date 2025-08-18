# DIN Interface - React Native Implementation

This is a React Native implementation of the DIN (Decentralized Insurance Network) interface, adapted from the original web-based React scaffold.

## Features

### Core Functionality
- **Catalog**: Browse available parametric insurance tranches
- **Product Details**: View detailed information about specific tranches
- **Buy/Sell**: Purchase protection or provide liquidity (sell)
- **Portfolio**: Track your positions and their status
- **Admin**: Manage tranches and oracle settings (MVP)
- **Beginner Mode**: Toggle between simplified and advanced explanations

### Key Components

#### Reusable UI Components
- `Badge`: Status indicators with different color tones
- `Button`: Primary and secondary button variants
- `Input`: Form input with validation support
- `Countdown`: Real-time countdown timer
- `OracleBadgeGroup`: Display oracle sources and rules
- `NAVWidget`: NAV (Net Asset Value) progress bar
- `RiskNotice`: Risk disclosure component
- `TrancheCard`: Card component for displaying tranche information

#### Screens
- `CatalogScreen`: Main catalog with search functionality
- `PortfolioScreen`: Position tracking and management
- `AdminScreen`: Administrative functions
- `DINApp`: Main app container with navigation

### Data Types

```typescript
type OracleSource = "pyth" | "orakl" | "witnet" | "oo-lite";
type RoundStatus = "upcoming" | "on_sale" | "sale_ended" | "settled";

type Tranche = {
  id: string;
  productId: string;
  asset: string;
  trigger: { type: "percent_drop"; value: number };
  maturity: string;
  premium: number;
  caps: { total: number; minPerUser: number; maxPerUser: number };
  pool: { tvl: number; remainingCapacity: number; nav: number };
  oracle: { primary: OracleSource; fallbacks: OracleSource[]; rule: "median" | "weighted" };
  status: RoundStatus;
};

type Position = {
  id: string;
  type: "buy" | "sell";
  trancheId: string;
  amount: number;
  filled: number;
  avgPremium: number;
  txHash?: string;
  state: "active" | "matured_paid" | "expired" | "refunded";
};
```

## Architecture

### File Structure
```
src/
├── components/
│   └── DINComponents.tsx    # Reusable UI components
├── contexts/
│   └── BeginnerContext.tsx  # Beginner mode context
├── screens/
│   ├── CatalogScreen.tsx    # Catalog view
│   ├── PortfolioScreen.tsx  # Portfolio management
│   ├── AdminScreen.tsx      # Admin functions
│   └── DINApp.tsx          # Main app container
├── types/
│   └── din.ts              # TypeScript type definitions
└── utils/
    ├── dinUtils.ts         # Utilities and mock API
    └── terminology.ts      # Terminology mapping system
```

### State Management
The app uses React's built-in state management with `useState` and `useEffect` hooks. The main state is managed in `DINApp.tsx` and includes:

- Active tab navigation
- Selected tranche
- User positions
- Buy/sell form data
- Quote calculations
- Processing states
- Beginner mode toggle state (via Context)

### Terminology System
The app includes a comprehensive terminology mapping system that provides user-friendly terms based on expertise level:

- **Expert Mode**: Technical terms (트랜치, 프리미엄, 담보, 오라클, etc.)
- **Beginner Mode**: User-friendly terms (상품, 보험료, 준비금, 외부 데이터 제공자, etc.)
- Dynamic text changes throughout the interface
- Context-aware explanations and descriptions

### Mock API
The `MockAPI` in `dinUtils.ts` simulates backend operations:
- `listTranches()`: Fetch available tranches
- `getTranche(id)`: Get specific tranche details
- `quoteBuy(trancheId, amount)`: Calculate buy quote
- `quoteSell(trancheId, collateral)`: Calculate sell quote
- `buy(trancheId, amount)`: Execute buy transaction
- `sell(trancheId, collateral)`: Execute sell transaction

## Usage

### Running the App
```bash
npm start
```

### Navigation Flow
1. **Catalog**: Browse available tranches
2. **Product Detail**: Click on a tranche to view details
3. **Buy/Sell**: Choose to buy protection or sell (provide liquidity)
4. **Portfolio**: View your positions after transactions
5. **Admin**: Manage system settings (MVP)

### Key Features

#### Parametric Insurance
- Trigger-based payouts (e.g., BTC drops 10%)
- Oracle integration with fallback mechanisms
- Automatic settlement at maturity

#### Risk Management
- Clear risk disclosures (beginner/advanced modes)
- Premium calculations
- Position tracking
- Transaction receipts

#### Beginner Mode
- Toggle between simplified and technical explanations
- Context-aware risk notices
- User-friendly terminology mapping system
- Dynamic text changes based on user expertise level

#### User Experience
- Korean language interface
- Real-time countdown timers
- Responsive design
- Loading states and error handling
- Beginner mode toggle for different user levels

## Development Notes

### React Native Adaptations
- Converted web CSS to React Native StyleSheet
- Replaced HTML elements with React Native components
- Adapted layout for mobile screens
- Implemented touch interactions

### Styling
- Uses a consistent color palette
- Responsive design patterns
- Accessibility considerations
- Dark mode ready (structure in place)

### Future Enhancements
- Real blockchain integration
- Wallet connectivity
- Push notifications
- Advanced filtering and sorting
- Charts and analytics
- Multi-language support

## Dependencies

The app uses the existing React Native dependencies from the original project:
- React Navigation for routing
- Expo for development tools
- TypeScript for type safety
- React Native Vector Icons (available but not used in current implementation)

## License

This is an MVP implementation for development and testing purposes. All numbers and transactions are mock data.
