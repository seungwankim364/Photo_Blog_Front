## 📸 Serverless Photo Blog Project
이 프로젝트는 AWS의 서버리스 아키텍처를 활용하여 비용 효율성과 보안을 극대화한 개인 포토 블로그입니다.

## 🏗 Architecture Overview
사용자가 접속하여 사진을 감상하고, 관리자가 사진을 안전하게 업로드하는 전 과정을 Serverless로 구축하였습니다.

- Frontend: React (Vite) 기반의 SPA로 구축되었으며, S3와 CloudFront를 통해 전 세계에 배포됩니다.

- Backend: AWS Lambda와 Express를 사용하여 서버를 구현하였으며, API Gateway를 통해 REST API를 제공- 합니다.

- Database: MongoDB Atlas (NoSQL)를 사용하여 포스트 데이터를 관리합니다.

- Storage: Amazon S3를 사용하며, 보안을 위해 OAC(Origin Access Control) 설정을 적용하였습니다.

- CI/CD: GitHub Actions를 사용하여 코드 변경 시 자동으로 빌드 및 배포가 진행됩니다.

<img width="588" height="641" alt="photo-blog-ksw drawio" src="https://github.com/user-attachments/assets/0a8fe66e-8740-4d4f-b638-d60c02cec709" />

## 🌟 Key Technical Challenges & Solutions
1. 보안 강화 (S3 OAC 적용)
- Issue: S3 객체 URL로 직접 접근이 가능할 경우 보안 취약점이 발생하며, 예상치 못한 트래픽 비용이 발생할 위험이 있었습니다.

- Solution: S3의 퍼블릭 액세스를 완전히 차단하고 **CloudFront OAC(Origin Access Control)**를 설정했습니다. 이를 통해 오직 CloudFront라는 '정문'을 통해서만 데이터에 접근할 수 있도록 인프라를 격리하여 보안을 강화했습니다.

2. API Gateway 이진 데이터 처리 (Binary Media Support)
- Issue: Lambda를 통해 이미지를 업로드할 때 파일이 깨지거나 빈 파일로 저장되는 현상이 발생했습니다.

- Solution: API Gateway의 Binary Media Types 설정에 multipart/form-data 및 image/*를 추가했습니다. 이를 통해 이미지 바이너리 데이터가 인코딩 문제 없이 Lambda로 전달되도록 해결했습니다.

3. 고성능 콘텐츠 전송 및 캐싱 전략
- Issue: 배포 직후 사용자에게 이전 버전의 파일이 보이거나, 이미지 로딩 속도가 저하되는 문제가 있었습니다.

- Solution: CloudFront를 도입하여 전 세계 엣지 로케이션에서 콘텐츠를 캐싱하게 했습니다. 또한 배포 파이프라인에 Invalidation(무효화) 단계를 추가하여 새로운 배포 시 즉시 최신 상태를 유지하도록 구성했습니다.

## 🛠 Tech Stack
**[ Frontend ]**

- Library: React (Vite)

- Styling: Styled-components

**[ Backend ]**

- Runtime: Node.js, Express

- AWS SDK: v3

- Middleware: Multer-S3 (for file uploads)

**[ Infrastructure ]**

- Edge: Amazon CloudFront (OAC/Caching)

- API Layer: Amazon API Gateway (Binary support)

- Compute: AWS Lambda (Serverless)

- Storage: Amazon S3 (Frontend & Uploads)

**[ Database ]**

- DB: MongoDB Atlas

- ORM: Mongoose

**[ DevOps ]**

- CI/CD: GitHub Actions
