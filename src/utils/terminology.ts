export const terminology = {
  tranche: { expert: "트랜치", beginner: "상품" },
  premium: { expert: "프리미엄", beginner: "보험료" },
  collateral: { expert: "담보", beginner: "준비금" },
  oracle: { expert: "오라클", beginner: "외부 데이터 제공자" },
  maturity: { expert: "만기", beginner: "보장 기간 종료일" },
  settlement: { expert: "정산", beginner: "보험금 지급" },
  nav: { expert: "NAV", beginner: "준비금 가치" },
  position: { expert: "포지션", beginner: "내 보장 내역" },
  buy: { expert: "구매", beginner: "보장 가입" },
  sell: { expert: "판매", beginner: "보장 인수" },
  trigger: { expert: "트리거", beginner: "지급 조건" },
  filled: { expert: "체결률", beginner: "가입 확정률" },
  refund: { expert: "환급", beginner: "돌려받기" },
  txHash: { expert: "트랜잭션 해시", beginner: "거래 영수증 번호" },
  reinvest: { expert: "재예치", beginner: "수익 재투자" },
  admin: { expert: "관리자", beginner: "운영자 메뉴" },
  beginnerMode: { expert: "전문 모드", beginner: "초심자 모드" },
  
  // Action terms
  actionBuy: { expert: "구매", beginner: "보장 가입" },
  actionSell: { expert: "판매", beginner: "보장 인수" },
  actionDetail: { expert: "상세보기", beginner: "자세히 보기" },
  actionSign: { expert: "서명 및 전송", beginner: "확인 및 전송" },
  actionProcessing: { expert: "처리 중...", beginner: "처리 중..." },
  
  // Section titles
  sectionCatalog: { expert: "카탈로그", beginner: "상품 목록" },
  sectionPortfolio: { expert: "포트폴리오", beginner: "내 보장 내역" },
  sectionAdmin: { expert: "관리자", beginner: "운영자 메뉴" },
  sectionRiskNotice: { expert: "위험 고지", beginner: "주의사항" },
  
  // Status terms
  statusOnSale: { expert: "판매 중", beginner: "가입 가능" },
  statusUpcoming: { expert: "예정", beginner: "준비 중" },
  statusSaleEnded: { expert: "판매 종료", beginner: "가입 마감" },
  statusSettled: { expert: "정산 완료", beginner: "지급 완료" },
  
  // Oracle terms
  oraclePrimary: { expert: "Primary", beginner: "주요" },
  oracleFallback: { expert: "Fallback", beginner: "백업" },
  oracleRule: { expert: "Rule", beginner: "규칙" },
  
  // Pool terms
  poolTvl: { expert: "TVL", beginner: "총 준비금" },
  remainingCapacity: { expert: "잔여 한도", beginner: "남은 한도" },
  
  // Descriptions
  descriptionTranche: { 
    expert: "이 상품은 파라메트릭 트리거 기반으로 자동 정산됩니다. 트리거 미충족 시 지급이 이뤄지지 않을 수 있습니다", 
    beginner: "이 상품은 보험처럼 일정 조건이 충족되면 보상이 지급되는 구조입니다. 조건이 충족되지 않으면 보상이 지급되지 않을 수 있습니다" 
  },
  descriptionSettlement: { 
    expert: "오라클 페일오버 및 합성 규칙이 적용되며, 필요한 경우 경량 분쟁(OO-lite) 절차가 진행될 수 있습니다", 
    beginner: "외부 데이터 제공자를 통해 조건을 확인하고, 필요한 경우 분쟁 절차가 진행될 수 있습니다" 
  },
  descriptionOracle: { 
    expert: "투자 전 반드시 만기, 트리거 정의, 수수료, 환급 규칙을 확인하세요", 
    beginner: "투자 전 만기일, 조건, 수수료, 환급 규칙을 꼭 확인하세요" 
  },
  descriptionWarning: { 
    expert: "모든 거래는 블록체인에서 실행되며 되돌릴 수 없습니다", 
    beginner: "모든 거래는 블록체인에서 실행되며 되돌릴 수 없습니다" 
  }
};

export function getTerm(termKey: keyof typeof terminology, isBeginner: boolean): string {
  const term = terminology[termKey];
  return isBeginner ? term.beginner : term.expert;
}

export function getDescription(descKey: keyof typeof terminology, isBeginner: boolean): string {
  const desc = terminology[descKey];
  return isBeginner ? desc.beginner : desc.expert;
}
