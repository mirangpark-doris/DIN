# DIN

React Native와 Expo를 사용한 DIN 모바일 앱 프로젝트입니다.

## 설치 및 실행

### 필수 요구사항
- Node.js (v16 이상)
- npm 또는 yarn
- Expo CLI

### 설치
```bash
npm install
```

### 실행
```bash
# 개발 서버 시작
npm start

# iOS 시뮬레이터에서 실행
npm run ios

# Android 에뮬레이터에서 실행
npm run android

# 웹 브라우저에서 실행
npm run web
```

## 프로젝트 구조

```
src/
├── components/     # 재사용 가능한 컴포넌트
├── screens/        # 화면 컴포넌트
├── navigation/     # 네비게이션 설정
├── utils/          # 유틸리티 함수
├── hooks/          # 커스텀 훅
└── types/          # TypeScript 타입 정의
```

## 사용된 라이브러리

- React Native
- Expo
- React Navigation
- AsyncStorage
- Vector Icons

## 개발 가이드

1. 새로운 화면 추가: `src/screens/` 디렉토리에 생성
2. 컴포넌트 추가: `src/components/` 디렉토리에 생성
3. 네비게이션 수정: `src/navigation/Navigation.tsx` 파일 수정
4. 타입 정의: `src/types/` 디렉토리에 추가

## 빌드 및 배포

### Android APK 빌드
```bash
expo build:android
```

### iOS IPA 빌드
```bash
expo build:ios
```

## 문제 해결

문제가 발생하면 다음을 확인하세요:
1. Node.js 버전이 호환되는지 확인
2. Expo CLI가 최신 버전인지 확인
3. 의존성 패키지들이 올바르게 설치되었는지 확인

