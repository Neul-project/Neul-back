# 🙋‍♂️ 장애인 & 가족을 위한 기록 관리 서비스 Neul

![표지](https://github.com/user-attachments/assets/7496762e-5829-4a70-a1aa-40a6ca09c163)

## 📄 프로젝트 소개

- 기록 관리 서비스 'Neul'은 장애인 보호자와 장애인 돌봄 기관 간의 원활한 연결 및 기록 관리 시스템을 구축하여 장애인 복지의 효율성과 신뢰성을 높이기 위해 기획된 **장애인 기록관리 통합 서비스**입니다.<br/>
- 배포: [Neul](http://3.38.125.252)
  <br/>

- 'Neul' 프로젝트를 시작하게 된 이유는 장애인 보호자들이 도우미와의 소통과 피보호자의 상태 관리를 수기로 진행하거나 비체계적으로 관리하고 있다는 문제를 발견했기 때문입니다. 이로 인해 돌봄 서비스의 신뢰성과 효율성이 낮아지는 상황이 자주 발생하였고 이를 디지털화된 시스템으로 개선할 필요가 있다고 판단했습니다.
  <br />

- 주요 사용자<br />
  **1. 보호자**: 피보호자 등록, 도우미 신청, 상태 확인 및 활동 기록 열람, 담당 도우미와 채팅, 프로그램 신청<br />
  **2. 도우미**: 경력 입력, 보호자가 신청한 매칭 수락/거절, 수락된 보호자의 피보호자 상태 기록 및 활동 기록, 담당 보호자와 채팅<br />
  **3. 시스템 관리자**: 도우미 승인 관리, 전체 사용자 관리, 프로그램 등록, 광고 등록<br />
  <br />
- 'Neul'의 주요 기능<br />
  보호자는 피보호자 정보를 입력하여 회원가입을 할 수 있으며 **원하는 날짜를 선택해 도우미를 신청**할 수 있습니다.<br />
  도우미는 본인의 경력을 입력 후 **총관리자의 승인**을 받아야 활동이 가능하며 **보호자의 신청**을 **수락 또는 거절**할 수 있습니다.<br />
  도우미가 신청을 수락하면 **보호자는 결제를 통해 매칭을 확정**할 수 있고 매칭이 완료되면 해당 기간 동안 **도우미는 피보호자의 상태 및 활동을 기록**할 수 있습니다.<br />
  보호자는 도우미가 작성한 기록을 **언제든 열람**할 수 있으며 **매칭된 보호자-도우미 간에는 실시간 1:1 채팅**이 가능합니다.<br />
  보호자가 신청한 매칭일이 경과하면 해당 매칭은 **자동으로 종료**됩니다. <br />
  매칭 여부와 관계없이 신청할 수 있는 다양한 **프로그램**도 함께 제공합니다.<br />

<br />

# 📰 기능정의서 (요약본)

<div align="center">
   <img width="600" alt="devs" src="https://github.com/user-attachments/assets/76c34910-0f28-4280-ad6e-6d081a67351f" />
</div>

<br/>

## :busts_in_silhouette: Developers

| FE. 권태연                            | FE. 이정민                        | FE. 최승연                                  | BE. 김예지                          |
| ------------------------------------- | --------------------------------- | ------------------------------------------- | ----------------------------------- |
| [Taetea1](https://github.com/Taetea1) | [ihoek](https://github.com/ihoek) | [werther901](https://github.com/werther901) | [Yzoraa](https://github.com/Yzoraa) |

<br />

## 기술 스택

- **🛠️ Frontend**: Next.js, TypeScript, Zustand, Socket.io-client, styled-components
- **🛠️ Backend**: Nest.js, TypeORM, MySQL, JWT, Socket.io
- **🛠️ DevOps**: AWS EC2, Nginx, PM2
- **🛠️ Others**: OAuth (Kakao, Naver), Formik, Yup, Notion

<br />

# 🗺 ERD

<div align="center">

 ![Image](https://github.com/user-attachments/assets/549bb36f-8a32-41f4-9468-a3d93c263909)

</div>

<br/>

# 🚘 Module

####  - Auth Module : 사용자 인증 및 권한, 로그인/회원가입 관리
####  - Users Module : 사용자 정보 관리
####  - Patient Module : 피보호자 정보 관리
####  - Status Module : 상태기록 관리
####  - Activity Module : 활동기록, 피드백 관리
####  - Helper Module : 도우미 관리
####  - Matching Module : 매칭 관리
####  - Chat Module : 실시간 채팅 관리
####  - Program Module : 프로그램 신청/결제/환불
####  - Alert Module : 알림
####  - Mail Module : 이메일 인증
####  - Banner Module : 배너 관리 

<br/>

# 📝 swagger API
<table>
  <tr>
    <th>Auth</th>
    <th>Users</th>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/7885fa1a-bce5-4e4e-abb7-f0b907f45c0b" width=100%>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/6d921b26-6b3d-481d-a8fa-accc209cf2c0" width=100%>
    </td>
  </tr>
</table>

<table>
  <tr>
    <th>Patient</th>
    <th>Status</th>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/98097ef8-9c2f-4bd4-80d2-e11b05227070" width=100%>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/abe59953-319e-4ebf-bf52-45d9f730815d" width=100%>
    </td>
  </tr>
</table>

<table>
  <th colspan="2">Activity</th>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/bfebc0b1-6530-4bde-b549-23c3ca00ac09" width=100%>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/a70a57d0-5273-4b44-8319-e5ca69d19858" width=100%>
    </td>
  </tr>
</table>

<table>
  <th colspan="2">Helper</th>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/202e6225-d957-4723-8482-1eeab6fdb174" width=100%>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/202d36a3-34d5-4bed-b53c-e0acd1b00d21" width=100%>
    </td>
  </tr>
</table>

<table>
  <th colspan="4">Matching</th>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/ed59d644-7fff-41f4-aec5-96c4eadb5bf4" width=100%>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/c8a3fb0e-5cbd-4cb2-86ce-beb1f01732de" width=100%>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/8a476e87-98fe-4237-ae49-a11a0666dd72" width=100%>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/6f031876-0c30-4edc-89e4-352d6c4264e3" width=100%>
    </td>
  </tr>
</table>

<table>
  <th colspan="2">Chat</th>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/036f5ede-339d-498c-9b39-504f919bc5be" width=100%>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/1c62967d-1ebf-4995-b479-143f0a783a72" width=100%>
    </td>
  </tr>
</table>

<table>
  <th colspan="3">Program</th>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/5e2b40f6-4652-4de1-97c2-54ad52c910a9" width=100%>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/90060adc-a772-417d-af49-447c6dc103a1" width=100%>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/e4303d6c-6dcb-488e-8bb5-2495fd8f19d1" width=100%>
    </td>
  </tr>
</table>

<table>
  <tr>
    <th>Alert</th>
    <th>Mail</th>
    <th>Banner</th>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/80e963a5-0819-4f14-8894-ddfa55af30a7" width=100%>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/059c0261-7d1c-4098-b01b-923b5c9585e4" width=100%>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/ec25f12c-17b2-4359-9c9f-f032e1af52a8" width=100%>
    </td>
  </tr>
</table>

<br />

👉 **프론트 레포지토리**: [neul_front](https://github.com/Neul-project/Neul-front) <br />
👉 **도우미 레포지토리**: [neul_admin](https://github.com/Neul-project/Neul-admin) <br />
👉 **관리자 레포지토리**: [neul_manager](https://github.com/Neul-project/Neul-manager) <br />
