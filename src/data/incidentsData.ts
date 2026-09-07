import { DisasterIncident, MultiTierKPIs } from '../types';

export const INITIAL_INCIDENTS: DisasterIncident[] = [
  {
    id: 'INC-SL-0825-LS',
    incidentCode: 'SL-0825-LS',
    name: 'Sạt lở đá lăn làm sập nhà dân & ngập lụt diện rộng tại Lạng Sơn',
    type: 'landslide',
    level: 5,
    riskScorePercent: 96,
    confidencePercent: 97,
    riskTrend: 'RISING_FAST',
    zoneId: 'commune_chi_lang_ls',
    zoneName: 'Xã Chi Lăng & TT Na Sầm',
    districtName: 'Huyện Chi Lăng & Huyện Văn Lãng',
    provinceName: 'Tỉnh Lạng Sơn',
    specificLocation: 'Thôn Hợp Tiến (Xã Chi Lăng), Thôn An Hùng (Xã Na Sầm QL4A) & Xã Thái Bình',
    coordinates: [21.658, 106.592],
    status: 'RESPONDING',
    detectedAt: '2026-08-23 22:30:00',
    timeToCriticalThresholdMinutes: 30,
    leadTimeStatus: 'KHẨN CẤP: Đã ghi nhận đá tảng sập sườn núi, 2.400 nhà ngập nước',
    impact: {
      exposedPopulation: 850,
      exposedHouseholds: 215,
      elderlyAndChildrenCount: 180,
      schoolsCount: 2,
      medicalClinicsCount: 1,
      vulnerableRoadsCount: 5,
      blockedRoadNames: [
        'Quốc lộ 4A (Đoạn qua TT Na Sầm sạt lở hàng nghìn m3 đất đá)',
        'Quốc lộ 1B, Quốc lộ 4B, Quốc lộ 3B, Quốc lộ 31 bị ngập sâu và chia cắt',
        'Đường liên thôn Hợp Tiến - Chi Lăng'
      ],
      bridgesAtRiskCount: 3,
      criticalFacilities: [
        'Trường Tiểu học & THCS Chi Lăng',
        'Trạm Y tế xã Chi Lăng',
        'Tuyến lưới điện 35kV cung cấp thị trấn Na Sầm'
      ],
      affectedAreaKm2: 12.5,
      estimatedEconomicExposureBillionVND: 35.8
    },
    explainableFactors: [
      {
        key: 'rain_24h',
        name: 'Mưa tích lũy dồn dập sau bão',
        value: 215,
        unit: 'mm',
        scorePercent: 96,
        weight: 0.35,
        contribution: 'VERY_HIGH',
        explanation: 'Lượng mưa cực đoan vượt 200mm gây bão hòa toàn bộ địa hình karst đá vôi và sườn taluy.'
      },
      {
        key: 'rockfall_karst',
        name: 'Hiện tượng Karst & Vách đá nứt lở',
        value: 'Đá tảng >15 tấn',
        scorePercent: 98,
        weight: 0.30,
        contribution: 'VERY_HIGH',
        explanation: 'Vách núi đá vôi dốc >60° bị phong hóa ngấm nước gây trượt lở dạng toppling, lăn thẳng xuống khu dân cư thôn Hợp Tiến.'
      },
      {
        key: 'soil_saturation',
        name: 'Bão hòa ẩm tầng phong hóa',
        value: 95,
        unit: '%',
        scorePercent: 92,
        weight: 0.20,
        contribution: 'VERY_HIGH',
        explanation: 'Đất đá sườn dốc ngậm no nước, sụt lún mái taluy trên diện rộng Quốc lộ 4A.'
      },
      {
        key: 'flood_inundation',
        name: 'Ngập lụt vùng trũng hạ lưu sông Kỳ Cùng',
        value: '2.400 nhà ngập',
        scorePercent: 88,
        weight: 0.15,
        contribution: 'HIGH',
        explanation: 'Mực nước dâng nhanh cô lập các xã trũng thấp và làm tê liệt giao thông liên tỉnh.'
      }
    ],
    aiRecommendation:
      'KHUYẾN NGHỊ AI: Di dời khẩn cấp trong đêm toàn bộ các hộ dân nằm dưới chân vách đá sườn núi Thôn Hợp Tiến; Phong tỏa nghiêm ngặt đoạn taluy sạt lở QL4A tại Na Sầm; Bố trí lực lượng cứu hộ 2.400 hộ ngập nước di chuyển lên vùng cao.',
    decisionRequired:
      'LÃNH ĐẠO CẦN QUYẾT ĐỊNH: (1) Ban bố tình huống khẩn cấp về thiên tai tại Huyện Chi Lăng và Huyện Văn Lãng; (2) Điều động lực lượng Quân đội, Công an hỗ trợ di dời dân và phân luồng xe tránh QL4A.',
    tasks: [
      {
        id: 'TASK-LS-01',
        incidentId: 'INC-SL-0825-LS',
        title: 'Sơ tán khẩn cấp các hộ dân Thôn Hợp Tiến ra khỏi vùng đá lăn',
        description: 'Tổ chức sơ tán ngay trong đêm các hộ dân bị đá sập thủng tường nhà đến Nhà văn hóa và trường học an toàn.',
        assignedUnit: 'UBND Xã Chi Lăng & Ban Chỉ huy Quân sự Huyện Chi Lăng',
        assigneeName: 'Hoàng Văn Minh (Chủ tịch UBND Xã)',
        assigneePhone: '0982.114.789',
        priority: 'URGENT',
        deadline: '2026-08-23 23:59',
        status: 'COMPLETED',
        evidencePhotos: ['https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'],
        fieldNotes: 'Đã hoàn tất sơ tán an toàn 45 hộ dân dưới chân vách đá sang Trường Tiểu học Chi Lăng trong đêm.',
        gpsLocation: [21.658, 106.592],
        createdAt: '2026-08-23 22:45',
        acceptedAt: '2026-08-23 22:50',
        completedAt: '2026-08-23 23:45',
        verifiedBy: 'Ban Chỉ huy PCTT Tỉnh Lạng Sơn'
      },
      {
        id: 'TASK-LS-02',
        incidentId: 'INC-SL-0825-LS',
        title: 'Lập chốt cấm đường và dọn dẹp hàng nghìn m3 đất đá sạt lở trên Quốc lộ 4A Na Sầm',
        description: 'Phối hợp Đội CSGT Công an Tỉnh Lạng Sơn và Công ty Quản lý đường bộ cấm xe, huy động máy xúc giải phóng lòng đường.',
        assignedUnit: 'Sở GTVT Lạng Sơn & Đội CSGT QL4A',
        assigneeName: 'Trung tá Nông Văn Hùng',
        assigneePhone: '0979.663.211',
        priority: 'URGENT',
        deadline: '2026-08-24 06:00',
        status: 'IN_PROGRESS',
        evidencePhotos: [],
        fieldNotes: 'Đất đá từ taluy thôn An Hùng vẫn tiếp tục tràn xuống lòng đường. Đã điều 3 máy xúc gạt tạm một làn xe cứu hộ khẩn cấp.',
        gpsLocation: [21.921, 106.634],
        createdAt: '2026-08-23 23:00',
        acceptedAt: '2026-08-23 23:10'
      },
      {
        id: 'TASK-LS-03',
        incidentId: 'INC-SL-0825-LS',
        title: 'Cứu hộ, tiếp tế lương thực cho 2.400 hộ dân vùng ngập úng ven sông',
        description: 'Điều động xuồng cứu sinh, áo phao, nước uống và lương thực khô hỗ trợ người dân bị cô lập do ngập sâu.',
        assignedUnit: 'Lực lượng Phòng cháy Chữa cháy & Cứu nạn Cứu hộ Tỉnh Lạng Sơn',
        assigneeName: 'Thượng tá Lương Tuấn Anh',
        assigneePhone: '0912.889.332',
        priority: 'URGENT',
        deadline: '2026-08-24 08:00',
        status: 'IN_PROGRESS',
        evidencePhotos: [],
        fieldNotes: 'Đã triển khai 8 xuồng máy tiếp cận các hộ dân xã Thái Bình và các điểm trũng thấp, không để người dân bị thiếu đói rét.',
        createdAt: '2026-08-23 23:15',
        acceptedAt: '2026-08-23 23:25'
      }
    ],
    tacticalOrders: [
      {
        id: 'ORD-LS-01',
        orderNumber: 'CÔNG ĐIỆN-08/CĐ-PCTT-LS',
        type: 'EVACUATION',
        title: 'Công điện khẩn: Di dời người dân khỏi vùng sạt lở núi đá và ngập úng sâu',
        targetArea: 'Huyện Chi Lăng, Văn Lãng, Cao Lộc và TP. Lạng Sơn',
        issuedBy: 'Hồ Tiến Thiệu',
        issuedByRole: 'Chủ tịch UBND Tỉnh Lạng Sơn',
        issuedAt: '2026-08-23 22:50',
        effectiveUntil: '2026-08-25 18:00',
        status: 'APPROVED',
        content:
          'Yêu cầu Chủ tịch UBND các huyện, thành phố khẩn cấp sơ tán người dân vùng chân núi có nguy cơ sập đá, vùng ngập sâu; cấm người và phương tiện qua lại các đoạn đường sạt lở ngập tràn.',
        affectedPopulation: 4500,
        assignedUnits: ['Công an Tỉnh Lạng Sơn', 'Bộ Chỉ huy Quân sự Tỉnh', 'UBND các huyện']
      }
    ],
    shelters: [
      {
        id: 'SHELTER-LS-01',
        name: 'Trường THCS Xã Chi Lăng',
        zoneId: 'commune_chi_lang_ls',
        communeName: 'Xã Chi Lăng',
        districtName: 'Huyện Chi Lăng',
        provinceName: 'Tỉnh Lạng Sơn',
        coordinates: [21.662, 106.598],
        capacityPeople: 400,
        currentOccupants: 165,
        elevationMeters: 380,
        distanceKmFromHazard: 1.5,
        contactPerson: 'Thầy Lăng Văn Tuấn (Hiệu trưởng)',
        contactPhone: '0984.772.339',
        facilities: {
          powerGenerator: true,
          cleanWaterSupply: true,
          medicalFirstAid: true,
          telecomSignal: true,
          foodRationsDays: 5
        },
        status: 'SAFE_OPEN'
      }
    ],
    safeRoutes: [
      {
        id: 'ROUTE-LS-01',
        fromArea: 'Thôn Hợp Tiến',
        toShelterId: 'SHELTER-LS-01',
        toShelterName: 'Trường THCS Xã Chi Lăng',
        distanceKm: 1.5,
        estimatedTravelMinutes: 20,
        status: 'SAFE',
        chokePoints: [],
        safeForVehicles: true,
        alternativeRouteNotes: 'Đi theo đường liên xã phía Nam tránh chân vách đá.'
      }
    ],
    timeline: [
      {
        time: '22:30',
        stage: 'DETECTED',
        actor: 'Cảm biến viễn thám & Báo cáo khẩn cấp từ người dân',
        description: 'Ghi nhận sạt lở đá tảng lớn từ vách núi Thôn Hợp Tiến, Chi Lăng làm hư hại nhà 2 tầng.'
      },
      {
        time: '22:40',
        stage: 'AI_ANALYZED',
        actor: 'Hệ thống HAEWS AI Engine',
        description: 'Mô hình địa chất xác định nguy cơ Toppling & Rockfall cấp độ 5 do mưa dồn dập 215mm.'
      },
      {
        time: '22:50',
        stage: 'ALERT_ISSUED',
        actor: 'UBND Tỉnh Lạng Sơn',
        description: 'Phát Công điện khẩn cấp và còi báo động di dời dân cư trong đêm.'
      },
      {
        time: '23:00',
        stage: 'TASK_DISPATCHED',
        actor: 'Trung tâm Chỉ huy Tác chiến HAEWS',
        description: 'Điều phối lực lượng Quân sự, Công an và Giao thông cứu hộ hiện trường.'
      },
      {
        time: '23:45',
        stage: 'RESPONDING',
        actor: 'Lực lượng Cơ sở Hiện trường',
        description: 'Hoàn thành di dời khẩn cấp 45 hộ dân Thôn Hợp Tiến an toàn về điểm tránh trú.'
      }
    ]
  },
  {
    id: 'INC-SL-0821',
    incidentCode: 'SL-0821',
    name: 'Nguy cơ Sạt lở đất đặc biệt nguy hiểm tại Thôn Trống Páo Sang',
    type: 'landslide',
    level: 5,
    riskScorePercent: 86,
    confidencePercent: 92,
    riskTrend: 'RISING_FAST',
    zoneId: 'commune_la_pan_tan',
    zoneName: 'Xã La Pán Tẩn',
    districtName: 'Huyện Mù Cang Chải',
    provinceName: 'Tỉnh Yên Bái',
    specificLocation: 'Thôn Trống Páo Sang & Km 285 Quốc lộ 32',
    coordinates: [21.82, 104.05],
    status: 'RESPONDING',
    detectedAt: '2026-08-21 06:15:00',
    timeToCriticalThresholdMinutes: 85, // 01h 25m
    leadTimeStatus: 'Nguy cơ sụp đổ khối trượt trong 01h25',
    impact: {
      exposedPopulation: 327,
      exposedHouseholds: 87,
      elderlyAndChildrenCount: 94,
      schoolsCount: 1, // Trường Tiểu học & THCS Bán trú La Pán Tẩn
      medicalClinicsCount: 1, // Trạm Y tế xã
      vulnerableRoadsCount: 3,
      blockedRoadNames: ['Quốc lộ 32 (Km 285+200 nứt toác 18cm)', 'Đường liên thôn Trống Páo Sang - Hấu Đề'],
      bridgesAtRiskCount: 1,
      criticalFacilities: ['Trường Phổ thông DTBT Tiểu học La Pán Tẩn', 'Trạm Y tế xã', 'Trạm biến áp 35kV'],
      affectedAreaKm2: 4.8,
      estimatedEconomicExposureBillionVND: 18.5
    },
    explainableFactors: [
      {
        key: 'rain_24h',
        name: 'Mưa tích lũy 24h qua',
        value: 178,
        unit: 'mm',
        scorePercent: 94,
        weight: 0.35,
        contribution: 'VERY_HIGH',
        explanation: 'Mưa tích lũy vượt 150% ngưỡng kích hoạt trượt lở lịch sử (120mm/24h).'
      },
      {
        key: 'soil_moisture',
        name: 'Độ bão hòa ẩm tầng đất mặt',
        value: 91,
        unit: '%',
        scorePercent: 89,
        weight: 0.30,
        contribution: 'VERY_HIGH',
        explanation: 'Đất đã đạt trạng thái hóa lỏng dẻo, mất hoàn toàn lực dính kết ma sát trong.'
      },
      {
        key: 'slope_angle',
        name: 'Độ dốc sườn núi taluy',
        value: '42.5°',
        scorePercent: 78,
        weight: 0.20,
        contribution: 'HIGH',
        explanation: 'Địa hình dốc đứng dạng vách xâm thực, nguy cơ tạo lũ bùn đá trượt quét.'
      },
      {
        key: 'landslide_history',
        name: 'Lịch sử trượt trượt địa chất',
        value: 'Trọng điểm 2018',
        scorePercent: 71,
        weight: 0.15,
        contribution: 'MEDIUM',
        explanation: 'Khu vực từng có cung trượt ngầm tái hoạt động trong mùa mưa bão trước.'
      }
    ],
    aiRecommendation:
      'KHUYẾN NGHỊ AI: Kích hoạt ngay Phương án sơ tán khẩn cấp cấp độ 2; Cắm biển cảnh báo và cấm toàn bộ phương tiện lưu thông qua Km 285 QL32; Điều 02 tổ xung kích hướng dẫn 87 hộ dân di dời đến Trường THCS La Pán Tẩn trước 10:00.',
    decisionRequired:
      'LÃNH ĐẠO CẦN QUYẾT ĐỊNH: (1) Phê duyệt Lệnh sơ tán 87 hộ (327 nhân khẩu); (2) Ra quyết định cấm đường Quốc lộ 32 đoạn qua đèo Khau Phạ.',
    tasks: [
      {
        id: 'TASK-0821-01',
        incidentId: 'INC-SL-0821',
        title: 'Quan trắc hiện trường & Đo dịch chuyển vết nứt sườn đồi Trống Páo Sang',
        description: 'Tổ kỹ thuật cắm mốc tiêu đo độ mở rộng vết nứt tại vách taluy dương phía trên khu dân cư.',
        assignedUnit: 'Tổ Xung kích PCTT Thôn Trống Páo Sang',
        assigneeName: 'Giàng A Lử (Tổ trưởng)',
        assigneePhone: '0988.234.112',
        priority: 'URGENT',
        deadline: '2026-08-21 08:30',
        status: 'COMPLETED',
        evidencePhotos: ['https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'],
        fieldNotes: 'Vết nứt đã mở rộng thêm 4cm so với 05:00 sáng. Xuất hiện dòng nước đục chảy ra từ chân taluy.',
        gpsLocation: [21.8215, 104.052],
        createdAt: '2026-08-21 06:30',
        acceptedAt: '2026-08-21 06:35',
        completedAt: '2026-08-21 07:45',
        verifiedBy: 'Ban Chỉ huy PCTT Huyện Mù Cang Chải'
      },
      {
        id: 'TASK-0821-02',
        incidentId: 'INC-SL-0821',
        title: 'Chốt chặn 2 đầu, cấm xe qua Km 285 QL32 & Cắm biển cảnh báo sạt lở',
        description: 'Phối hợp Đội CSGT Công an huyện thiết lập chốt phân luồng từ ngã ba Kim Nọi.',
        assignedUnit: 'Công an Xã La Pán Tẩn & Thanh tra Giao thông',
        assigneeName: 'Đ/c Thiếu tá Vừ A Tủa',
        assigneePhone: '0973.551.889',
        priority: 'URGENT',
        deadline: '2026-08-21 08:00',
        status: 'IN_PROGRESS',
        evidencePhotos: [],
        fieldNotes: 'Đã lập rào chắn tại Km 284+500 và Km 286+200. Đang hướng dẫn xe tải quay đầu về thị trấn.',
        gpsLocation: [21.823, 104.048],
        createdAt: '2026-08-21 06:45',
        acceptedAt: '2026-08-21 06:50'
      },
      {
        id: 'TASK-0821-03',
        incidentId: 'INC-SL-0821',
        title: 'Hỗ trợ di dời 87 hộ dân (327 nhân khẩu) đến điểm sơ tán Trường THCS',
        description: 'Ưu tiên 94 người già, trẻ nhỏ và phụ nữ mang thai di chuyển trước bằng xe chuyên dụng.',
        assignedUnit: 'Ban Chỉ huy Quân sự xã & Đội Xung kích Thanh niên',
        assigneeName: 'Lý A Sáng (Chỉ huy trưởng BCH QS Xã)',
        assigneePhone: '0912.445.678',
        priority: 'URGENT',
        deadline: '2026-08-21 09:30',
        status: 'IN_PROGRESS',
        evidencePhotos: [],
        fieldNotes: 'Đã hoàn thành sơ tán 62/87 hộ. Còn 25 hộ đang thu dọn tài sản và gia súc, có lực lượng hỗ trợ.',
        createdAt: '2026-08-21 07:00',
        acceptedAt: '2026-08-21 07:10'
      },
      {
        id: 'TASK-0821-04',
        incidentId: 'INC-SL-0821',
        title: 'Kích hoạt máy phát điện dự phòng & Chuẩn bị bếp ăn dã chiến tại Trường THCS',
        description: 'Kiểm tra nguồn nước sạch, thuốc men cấp cứu sơ bộ và lương thực khô đủ cho 400 người.',
        assignedUnit: 'Trạm Y tế xã & Trường PTDTBT THCS La Pán Tẩn',
        assigneeName: 'Bác sĩ Thào Thị Mai',
        assigneePhone: '0945.890.334',
        priority: 'HIGH',
        deadline: '2026-08-21 09:00',
        status: 'COMPLETED',
        evidencePhotos: [],
        fieldNotes: 'Đã khởi động máy phát 15kVA, bể nước sạch 30m3 đầy, tiếp nhận 1.5 tấn gạo và 100 thùng mì tôm dự trữ.',
        createdAt: '2026-08-21 07:15',
        acceptedAt: '2026-08-21 07:20',
        completedAt: '2026-08-21 08:15'
      }
    ],
    tacticalOrders: [
      {
        id: 'ORD-0821-01',
        orderNumber: 'LỆNH-01/LĐ-UBND',
        type: 'EVACUATION',
        title: 'Lệnh Sơ tán khẩn cấp toàn bộ Nhân dân Thôn Trống Páo Sang',
        targetArea: 'Thôn Trống Páo Sang, Xã La Pán Tẩn',
        issuedBy: 'Trần Huy Tuấn',
        issuedByRole: 'Chủ tịch UBND Tỉnh - Trưởng Ban Chỉ huy PCTT Tỉnh',
        issuedAt: '2026-08-21 06:40',
        effectiveUntil: '2026-08-22 18:00',
        status: 'APPROVED',
        content:
          'Yêu cầu Chủ tịch UBND Huyện Mù Cang Chải và Ban Chỉ huy PCTT Xã La Pán Tẩn huy động tối đa lực lượng Quân sự, Công an, Dân quân tự vệ khẩn cấp di dời 87 hộ dân ra khỏi vùng sạt lở nguy hiểm trước 09:30 sáng nay. Đảm bảo tuyệt đối an toàn tính mạng người dân.',
        affectedPopulation: 327,
        assignedUnits: ['UBND Huyện Mù Cang Chải', 'BCH Quân sự Huyện', 'Công an Huyện', 'UBND Xã La Pán Tẩn']
      },
      {
        id: 'ORD-0821-02',
        orderNumber: 'LỆNH-02/LĐ-GTVT',
        type: 'ROAD_BLOCKADE',
        title: 'Lệnh Cấm đường & Phân luồng giao thông Quốc lộ 32 đoạn Đèo Khau Phạ',
        targetArea: 'Km 280+00 đến Km 295+00 QL32',
        issuedBy: 'Nguyễn Văn Hùng',
        issuedByRole: 'Giám đốc Sở GTVT - Phó Ban Chỉ huy PCTT Tỉnh',
        issuedAt: '2026-08-21 06:50',
        effectiveUntil: 'Khi có thông báo an toàn',
        status: 'APPROVED',
        content:
          'Cấm toàn bộ các phương tiện xe khách, xe tải và xe con lưu thông qua đoạn đèo Khau Phạ (QL32). Phân luồng xe đi từ Yên Bái sang Lai Châu qua Quốc lộ 37 và Quốc lộ 279.',
        affectedPopulation: 1200,
        assignedUnits: ['Sở GTVT Yên Bái', 'Phòng CSGT Công an Tỉnh', 'Đội Quản lý đường bộ II.3']
      }
    ],
    shelters: [
      {
        id: 'SHELTER-LPT-01',
        name: 'Trường PTDT Bán trú THCS La Pán Tẩn',
        zoneId: 'commune_la_pan_tan',
        communeName: 'Xã La Pán Tẩn',
        districtName: 'Huyện Mù Cang Chải',
        provinceName: 'Tỉnh Yên Bái',
        coordinates: [21.815, 104.056],
        capacityPeople: 450,
        currentOccupants: 240,
        elevationMeters: 1450,
        distanceKmFromHazard: 1.8,
        contactPerson: 'Thầy Hiệu trưởng Lò Văn Chinh',
        contactPhone: '0983.112.998',
        facilities: {
          powerGenerator: true,
          cleanWaterSupply: true,
          medicalFirstAid: true,
          telecomSignal: true,
          foodRationsDays: 7
        },
        status: 'SAFE_OPEN'
      },
      {
        id: 'SHELTER-LPT-02',
        name: 'Nhà Văn hóa Trung tâm Xã La Pán Tẩn',
        zoneId: 'commune_la_pan_tan',
        communeName: 'Xã La Pán Tẩn',
        districtName: 'Huyện Mù Cang Chải',
        provinceName: 'Tỉnh Yên Bái',
        coordinates: [21.812, 104.053],
        capacityPeople: 180,
        currentOccupants: 85,
        elevationMeters: 1420,
        distanceKmFromHazard: 2.2,
        contactPerson: 'Hảng A Dơ (Bí thư Đoàn xã)',
        contactPhone: '0977.654.321',
        facilities: {
          powerGenerator: true,
          cleanWaterSupply: true,
          medicalFirstAid: false,
          telecomSignal: true,
          foodRationsDays: 3
        },
        status: 'SAFE_OPEN'
      }
    ],
    safeRoutes: [
      {
        id: 'ROUTE-LPT-01',
        fromArea: 'Thôn Trống Páo Sang',
        toShelterId: 'SHELTER-LPT-01',
        toShelterName: 'Trường THCS La Pán Tẩn',
        distanceKm: 1.8,
        estimatedTravelMinutes: 20,
        status: 'SAFE',
        chokePoints: ['Cầu ngầm Trống Tông (Nước ngập nhẹ 15cm, xe gầm cao qua an toàn)'],
        safeForVehicles: true,
        alternativeRouteNotes: 'Đi men theo đường bê tông liên thôn nhánh Tây đỉnh đồi.'
      },
      {
        id: 'ROUTE-LPT-02',
        fromArea: 'Cụm dân cư Km 285 QL32',
        toShelterId: 'SHELTER-LPT-02',
        toShelterName: 'Nhà Văn hóa Trung tâm Xã',
        distanceKm: 2.2,
        estimatedTravelMinutes: 35,
        status: 'WARNING_WATERLOGGED',
        chokePoints: ['Đoạn taluy Km 284+800 đất đá tràn mặt đường 20cm'],
        safeForVehicles: false,
        alternativeRouteNotes: 'Chỉ di chuyển bộ theo lối mòn có chốt trực dân quân dẫn đường.'
      }
    ],
    timeline: [
      {
        time: '06:15',
        stage: 'DETECTED',
        actor: 'Hệ thống HAEWS AI Engine',
        description: 'Trạm Mù Cang Chải đo mưa đạt 178mm/24h. Mô hình XGBoost kích hoạt cảnh báo Cấp 5.'
      },
      {
        time: '06:22',
        stage: 'AI_ANALYZED',
        actor: 'Bộ phân tích Explainable AI',
        description: 'Xác định 4 nguyên nhân chính: Mưa 24h (94%), Ẩm đất (89%), Độ dốc (78%), Vết nứt địa chất cũ.'
      },
      {
        time: '06:30',
        stage: 'VERIFIED',
        actor: 'Trực ban PCTT Huyện Mù Cang Chải',
        description: 'Cán bộ kỹ thuật gọi điện xác minh với Trưởng thôn Trống Páo Sang xác nhận xuất hiện bùn đục.'
      },
      {
        time: '06:40',
        stage: 'ALERT_ISSUED',
        actor: 'Ban Chỉ huy PCTT Tỉnh Yên Bái',
        description: 'Chủ tịch UBND Tỉnh phê duyệt phát Lệnh Sơ tán khẩn cấp và còi hú báo động cấp xã.'
      },
      {
        time: '06:50',
        stage: 'TASK_DISPATCHED',
        actor: 'Trung tâm Điều hành Tác chiến',
        description: 'Giao 4 nhiệm vụ tác chiến cho Công an, Quân sự, Y tế và Đội xung kích cơ sở.'
      },
      {
        time: '07:15',
        stage: 'RESPONDING',
        actor: 'Lực lượng Cơ sở Hiện trường',
        description: 'Đã hoàn thành sơ tán 62/87 hộ dân; Rào chắn cấm xe Km 285 QL32 đang được duy trì.'
      }
    ]
  },
  {
    id: 'INC-FF-0822',
    incidentCode: 'FF-0822',
    name: 'Cảnh báo Lũ quét & Sạt lở ven bờ suối Nậm Păm',
    type: 'flash_flood',
    level: 4,
    riskScorePercent: 78,
    confidencePercent: 89,
    riskTrend: 'RISING',
    zoneId: 'commune_muong_la',
    zoneName: 'Xã Nậm Păm',
    districtName: 'Huyện Mường La',
    provinceName: 'Tỉnh Sơn La',
    specificLocation: 'Lưu vực Suối Nậm Păm & Bản Piềng 1, Bản Huổi Liềng',
    coordinates: [21.58, 103.98],
    status: 'TASK_DISPATCHED',
    detectedAt: '2026-08-21 06:45:00',
    timeToCriticalThresholdMinutes: 130, // 02h 10m
    leadTimeStatus: 'Đỉnh lũ dự kiến đổ về hạ du trong 02h10',
    impact: {
      exposedPopulation: 412,
      exposedHouseholds: 104,
      elderlyAndChildrenCount: 118,
      schoolsCount: 2,
      medicalClinicsCount: 1,
      vulnerableRoadsCount: 2,
      blockedRoadNames: ['Đường tỉnh ĐT.109 đoạn qua Suối Nậm Păm'],
      bridgesAtRiskCount: 2,
      criticalFacilities: ['Cầu treo Bản Piềng', 'Trạm Thủy văn Nậm Păm', 'Hệ thống đập thủy lợi Nậm Păm 2'],
      affectedAreaKm2: 7.2,
      estimatedEconomicExposureBillionVND: 24.0
    },
    explainableFactors: [
      {
        key: 'rain_3h',
        name: 'Cường độ mưa cực đoan 3h',
        value: 112,
        unit: 'mm',
        scorePercent: 92,
        weight: 0.40,
        contribution: 'VERY_HIGH',
        explanation: 'Mây đối lưu bão tố gây mưa dồn dập vượt năng lực thoát lũ lòng suối.'
      },
      {
        key: 'hydro_surge',
        name: 'Mực nước dâng thượng nguồn',
        value: '+2.85m',
        scorePercent: 88,
        weight: 0.30,
        contribution: 'VERY_HIGH',
        explanation: 'Nước sông Nậm Păm dâng nhanh 0.8m/h kèm theo nhiều cây gỗ mục trôi dạt.'
      },
      {
        key: 'catchment_slope',
        name: 'Độ dốc lòng suối lưu vực',
        value: '36%',
        scorePercent: 75,
        weight: 0.20,
        contribution: 'HIGH',
        explanation: 'Thời gian tập trung nước lũ ngắn (dưới 45 phút) từ sườn núi về thung lũng.'
      }
    ],
    aiRecommendation:
      'KHUYẾN NGHỊ AI: Bật loa phát thanh báo động toàn xã; Nghiêm cấm người dân vớt củi, bắt cá ven suối; Di dời 35 hộ sống sát bờ suối trong vòng 50m lên Trường Tiểu học Nậm Păm.',
    decisionRequired:
      'LÃNH ĐẠO CẦN QUYẾT ĐỊNH: Phê duyệt phương án điều động 30 chiến sĩ Trung đoàn 754 hỗ trợ đắp kè rọ đá chống xói lở mố cầu Bản Piềng.',
    tasks: [
      {
        id: 'TASK-0822-01',
        incidentId: 'INC-FF-0822',
        title: 'Phát thanh liên tục trên hệ thống loa truyền thanh 7 thôn/bản',
        description: 'Thông báo đỉnh lũ dự kiến lúc 09:00, nghiêm cấm người dân lại gần suối Nậm Păm.',
        assignedUnit: 'Đài Truyền thanh Xã Nậm Păm',
        assigneeName: 'Cà Văn Định',
        assigneePhone: '0978.334.901',
        priority: 'URGENT',
        deadline: '2026-08-21 07:30',
        status: 'IN_PROGRESS',
        evidencePhotos: [],
        fieldNotes: 'Đang phát sóng bản tin khẩn cấp định kỳ 5 phút/lần bằng tiếng phổ thông và tiếng Thái.',
        createdAt: '2026-08-21 07:00',
        acceptedAt: '2026-08-21 07:05'
      }
    ],
    tacticalOrders: [],
    shelters: [
      {
        id: 'SHELTER-NP-01',
        name: 'Trường Tiểu học Nậm Păm (Khu trung tâm)',
        zoneId: 'commune_muong_la',
        communeName: 'Xã Nậm Păm',
        districtName: 'Huyện Mường La',
        provinceName: 'Tỉnh Sơn La',
        coordinates: [21.585, 103.985],
        capacityPeople: 500,
        currentOccupants: 110,
        elevationMeters: 450,
        distanceKmFromHazard: 1.2,
        contactPerson: 'Đ/c Quàng Văn Biên (Chủ tịch UBND Xã)',
        contactPhone: '0913.667.889',
        facilities: {
          powerGenerator: true,
          cleanWaterSupply: true,
          medicalFirstAid: true,
          telecomSignal: true,
          foodRationsDays: 5
        },
        status: 'SAFE_OPEN'
      }
    ],
    safeRoutes: [
      {
        id: 'ROUTE-NP-01',
        fromArea: 'Bản Piềng 1',
        toShelterId: 'SHELTER-NP-01',
        toShelterName: 'Trường Tiểu học Nậm Păm',
        distanceKm: 1.2,
        estimatedTravelMinutes: 15,
        status: 'SAFE',
        chokePoints: [],
        safeForVehicles: true
      }
    ],
    timeline: [
      {
        time: '06:45',
        stage: 'DETECTED',
        actor: 'Trạm Rada Thời tiết Pha Đin & IoT Thủy văn',
        description: 'Phát hiện đám mây phản hồi vô tuyến 54 dBZ di chuyển vào lưu vực Mường La.'
      },
      {
        time: '07:00',
        stage: 'TASK_DISPATCHED',
        actor: 'Chỉ huy Trực ban Phòng PCTT Huyện',
        description: 'Giao lệnh cảnh báo và triển khai phương án 4 tại chỗ cho xã Nậm Păm.'
      }
    ]
  },
  {
    id: 'INC-SL-0823',
    incidentCode: 'SL-0823',
    name: 'Nguy cơ sạt trượt đất taluy dương tại Xã Tân Phượng',
    type: 'landslide',
    level: 4,
    riskScorePercent: 74,
    confidencePercent: 85,
    riskTrend: 'RISING',
    zoneId: 'commune_tan_phuong',
    zoneName: 'Xã Tân Phượng',
    districtName: 'Huyện Lục Yên',
    provinceName: 'Tỉnh Yên Bái',
    specificLocation: 'Thôn Khe May & Tuyến đường liên xã Tân Phượng - Lâm Thượng',
    coordinates: [22.18, 104.72],
    status: 'VERIFIED',
    detectedAt: '2026-08-21 07:05:00',
    timeToCriticalThresholdMinutes: 225, // 03h 45m
    leadTimeStatus: 'Thời gian an toàn còn khoảng 03h45',
    impact: {
      exposedPopulation: 185,
      exposedHouseholds: 48,
      elderlyAndChildrenCount: 52,
      schoolsCount: 1,
      medicalClinicsCount: 0,
      vulnerableRoadsCount: 1,
      blockedRoadNames: ['Đường liên xã Tân Phượng đi Lâm Thượng'],
      bridgesAtRiskCount: 0,
      criticalFacilities: ['Nhà sinh hoạt cộng đồng Thôn Khe May'],
      affectedAreaKm2: 3.1,
      estimatedEconomicExposureBillionVND: 8.2
    },
    explainableFactors: [
      {
        key: 'rain_24h',
        name: 'Mưa tích lũy 24h',
        value: 145,
        unit: 'mm',
        scorePercent: 82,
        weight: 0.35,
        contribution: 'HIGH',
        explanation: 'Mưa ngấm sâu làm mềm tầng phong hóa đá biến chất.'
      },
      {
        key: 'soil_moisture',
        name: 'Độ ẩm đất',
        value: 86,
        unit: '%',
        scorePercent: 80,
        weight: 0.35,
        contribution: 'HIGH',
        explanation: 'Mức ẩm đạt 86%, chuẩn bị vượt ngưỡng nguy hiểm (90%).'
      }
    ],
    aiRecommendation:
      'KHUYẾN NGHỊ AI: Cử lực lượng tuần tra vách ta-luy phía sau trường Mầm non; Sẵn sàng di tản 48 hộ dân khi lượng mưa vượt 160mm.',
    decisionRequired:
      'LÃNH ĐẠO CẦN QUYẾT ĐỊNH: Cho phép học sinh điểm trường Mầm non Khe May nghỉ học hôm nay để đảm bảo an toàn.',
    tasks: [],
    tacticalOrders: [],
    shelters: [],
    safeRoutes: [],
    timeline: [
      {
        time: '07:05',
        stage: 'DETECTED',
        actor: 'AI Risk Engine HAEWS',
        description: 'Kích hoạt cảnh báo cấp 4 do mưa dồn dập tại Lục Yên.'
      },
      {
        time: '07:20',
        stage: 'VERIFIED',
        actor: 'Cán bộ Địa chính Xã Tân Phượng',
        description: 'Xác nhận sườn núi có vết rạn chân chim dài khoảng 25m.'
      }
    ]
  },
  {
    id: 'INC-FF-0824',
    incidentCode: 'FF-0824',
    name: 'Lũ ống & Lũ bùn đá quét qua Thị trấn Mường Xén',
    type: 'flash_flood',
    level: 5,
    riskScorePercent: 91,
    confidencePercent: 94,
    riskTrend: 'RISING_FAST',
    zoneId: 'commune_ta_ca',
    zoneName: 'Xã Tà Cạ & TT Mường Xén',
    districtName: 'Huyện Kỳ Sơn',
    provinceName: 'Tỉnh Nghệ An',
    specificLocation: 'Khe Huồi Giảng, Bản Cầu Tám, Khối 1 TT Mường Xén',
    coordinates: [19.41, 104.14],
    status: 'RESPONDING',
    detectedAt: '2026-08-21 05:30:00',
    timeToCriticalThresholdMinutes: 45, // 45m
    leadTimeStatus: 'KHẨN CẤP: Dòng lũ cuốn trôi đất đá đổ về trong 45 phút',
    impact: {
      exposedPopulation: 520,
      exposedHouseholds: 130,
      elderlyAndChildrenCount: 160,
      schoolsCount: 2,
      medicalClinicsCount: 1,
      vulnerableRoadsCount: 4,
      blockedRoadNames: ['Quốc lộ 7A đoạn qua trung tâm Thị trấn Mường Xén'],
      bridgesAtRiskCount: 3,
      criticalFacilities: ['Trụ sở Huyện ủy - UBND Huyện Kỳ Sơn', 'Trung tâm Y tế Huyện Kỳ Sơn'],
      affectedAreaKm2: 8.5,
      estimatedEconomicExposureBillionVND: 42.0
    },
    explainableFactors: [
      {
        key: 'flash_peak',
        name: 'Mưa cực đoan thượng nguồn',
        value: 195,
        unit: 'mm',
        scorePercent: 98,
        weight: 0.45,
        contribution: 'VERY_HIGH',
        explanation: 'Mưa như trút nước tại đỉnh dãy Pù Hoạt tạo dòng bùn đá tốc độ cao.'
      }
    ],
    aiRecommendation:
      'KHUYẾN NGHỊ AI: Di chuyển toàn bộ người và tài sản lên tầng 2 hoặc khu đồi cao; Di dời khẩn cấp bệnh nhân Trung tâm Y tế.',
    decisionRequired:
      'LÃNH ĐẠO CẦN QUYẾT ĐỊNH: Đề nghị Quân khu 4 điều động xe lội nước và máy bay trực thăng cứu hộ ứng trực.',
    tasks: [],
    tacticalOrders: [],
    shelters: [],
    safeRoutes: [],
    timeline: [
      {
        time: '05:30',
        stage: 'DETECTED',
        actor: 'Cảm biến viễn thám',
        description: 'Phát hiện lưu lượng đột biến suối Huồi Giảng.'
      }
    ]
  },
  {
    id: 'INC-SL-0826-LC',
    incidentCode: 'SL-0826-LC',
    name: 'Sạt lở đất & Lũ bùn đá sườn núi đặc biệt nguy hiểm tại Lào Cai',
    type: 'landslide',
    level: 5,
    riskScorePercent: 98,
    confidencePercent: 96,
    riskTrend: 'RISING_FAST',
    zoneId: 'commune_nam_luc_lc',
    zoneName: 'Xã Nậm Lúc & Xã Phúc Khánh',
    districtName: 'Huyện Bắc Hà & Huyện Bảo Yên',
    provinceName: 'Tỉnh Lào Cai',
    specificLocation: 'Khu vực Thôn Nậm Tông (Nậm Lúc) & Thôn Làng Nủ (Phúc Khánh)',
    coordinates: [22.384, 104.286],
    status: 'RESPONDING',
    detectedAt: '2026-08-23 06:15:00',
    timeToCriticalThresholdMinutes: 20,
    leadTimeStatus: 'KHẨN CẤP: Dòng lũ bùn đá sạt trượt từ đỉnh núi cao 800m',
    impact: {
      exposedPopulation: 1250,
      exposedHouseholds: 310,
      elderlyAndChildrenCount: 290,
      schoolsCount: 3,
      medicalClinicsCount: 2,
      vulnerableRoadsCount: 6,
      blockedRoadNames: [
        'Tỉnh lộ 160 đoạn qua Nậm Lúc bị đứt gãy hoàn toàn',
        'Quốc lộ 70 tuyến Bảo Thắng - Bảo Yên ngập sâu và sạt trượt',
        'Đường liên thôn Bản Vàng - Nậm Tông'
      ],
      bridgesAtRiskCount: 4,
      criticalFacilities: [
        'Trạm Y tế Xã Nậm Lúc',
        'Trường Phổ thông Dân tộc Bán trú Tiểu học Nậm Lúc',
        'Hệ thống trạm tiếp sóng Viettel/VNPT Bản Nậm Tông'
      ],
      affectedAreaKm2: 18.5,
      estimatedEconomicExposureBillionVND: 58.6
    },
    explainableFactors: [
      {
        key: 'accumulated_rain',
        name: 'Mưa tích lũy 48h kỷ lục',
        value: 285,
        unit: 'mm',
        scorePercent: 99,
        weight: 0.40,
        contribution: 'VERY_HIGH',
        explanation: 'Mưa bão lớn kéo dài làm bão hòa hoàn toàn tầng đất phong hóa feralit trên nền đá phiến biến chất.'
      },
      {
        key: 'steep_slope_gravity',
        name: 'Địa hình sườn dốc >55° kết hợp tụ thủy',
        value: '58 độ dốc',
        scorePercent: 96,
        weight: 0.35,
        contribution: 'VERY_HIGH',
        explanation: 'Khối đất đá từ đỉnh Con Voi trượt xuống lòng khe suối hẹp tạo hiệu ứng pít-tông bùn đá di chuyển vận tốc cực lớn.'
      }
    ],
    aiRecommendation:
      'KHUYẾN NGHỊ AI: Di dời toàn bộ người dân 2 bên bờ khe suối và chân núi Con Voi lên điểm cao Trường Tiểu học Nậm Lúc; Thiết lập hệ thống flycam/drone trinh sát phát hiện các hồ nước nghẽn trên đỉnh núi.',
    decisionRequired:
      'LÃNH ĐẠO CẦN QUYẾT ĐỊNH: Đề nghị Quân khu 2 và Bộ Chỉ huy Quân sự tỉnh Lạng Sơn/Lào Cai cử chó nghiệp vụ, flycam trinh sát tầm nhiệt và xe đặc chủng lội suối.',
    tasks: [
      {
        id: 'TASK-LC-01',
        incidentId: 'INC-SL-0826-LC',
        title: 'Sơ tán khẩn cấp 95 hộ dân ven sườn dốc Nậm Tông',
        description: 'Tổ chức lực lượng công an, dân quân cơ động tiếp cận từng hộ gia đình hỗ trợ sơ tán đến nơi cao ráo an toàn.',
        assignedUnit: 'UBND Huyện Bắc Hà & Lực lượng Dân quân Xã',
        assigneeName: 'Nguyễn Duy Hòa',
        assigneePhone: '0983.456.789',
        priority: 'URGENT',
        deadline: '2026-08-23 09:00',
        status: 'IN_PROGRESS',
        evidencePhotos: [],
        fieldNotes: 'Đang di chuyển đợt 2, thời tiết mưa vẫn to.',
        createdAt: '2026-08-23 06:30',
        acceptedAt: '2026-08-23 06:40'
      }
    ],
    tacticalOrders: [],
    shelters: [
      {
        id: 'SHELTER-LC-01',
        name: 'Trường PTDT Bán trú THCS Nậm Lúc',
        zoneId: 'commune_nam_luc_lc',
        communeName: 'Xã Nậm Lúc',
        districtName: 'Huyện Bắc Hà',
        provinceName: 'Tỉnh Lào Cai',
        coordinates: [22.389, 104.289],
        capacityPeople: 500,
        currentOccupants: 220,
        elevationMeters: 450,
        distanceKmFromHazard: 2.1,
        contactPerson: 'Đ/c Lò Văn Pao',
        contactPhone: '0978.112.233',
        facilities: {
          powerGenerator: true,
          cleanWaterSupply: true,
          medicalFirstAid: true,
          telecomSignal: true,
          foodRationsDays: 7
        },
        status: 'SAFE_OPEN'
      }
    ],
    safeRoutes: [],
    timeline: [
      {
        time: '06:15',
        stage: 'DETECTED',
        actor: 'Cảm biến viễn thám Sentinel & Trạm mưa tự động Bắc Hà',
        description: 'Cảnh báo mức độ đặc biệt nguy hiểm lũ bùn đá Nậm Lúc.'
      }
    ]
  },
  {
    id: 'INC-SL-0827-CB',
    incidentCode: 'SL-0827-CB',
    name: 'Sạt lở vùi lấp Quốc lộ 34 & sập taluy dương Đèo Cao Bắc',
    type: 'landslide',
    level: 5,
    riskScorePercent: 94,
    confidencePercent: 95,
    riskTrend: 'RISING_FAST',
    zoneId: 'commune_vu_nong_cb',
    zoneName: 'Xã Vũ Nông & Xã Ca Thành',
    districtName: 'Huyện Nguyên Bình',
    provinceName: 'Tỉnh Cao Bằng',
    specificLocation: 'Km 180+200 Quốc lộ 34 & Đèo Cao Bắc',
    coordinates: [22.625, 105.882],
    status: 'RESPONDING',
    detectedAt: '2026-08-23 05:45:00',
    timeToCriticalThresholdMinutes: 30,
    leadTimeStatus: 'KHẨN CẤP: Đất đá khối lượng lớn tràn xuống QL34',
    impact: {
      exposedPopulation: 480,
      exposedHouseholds: 115,
      elderlyAndChildrenCount: 95,
      schoolsCount: 1,
      medicalClinicsCount: 1,
      vulnerableRoadsCount: 3,
      blockedRoadNames: ['Quốc lộ 34 nối Cao Bằng - Hà Giang bị tê liệt hoàn toàn', 'Đường Đèo Cao Bắc'],
      bridgesAtRiskCount: 2,
      criticalFacilities: ['Trạm kiểm lâm Nguyên Bình', 'Cột truyền dẫn điện 110kV'],
      affectedAreaKm2: 10.2,
      estimatedEconomicExposureBillionVND: 31.5
    },
    explainableFactors: [
      {
        key: 'slope_saturation',
        name: 'Đất đá ngậm nước bão hòa',
        value: 98,
        unit: '%',
        scorePercent: 95,
        weight: 0.4,
        contribution: 'VERY_HIGH',
        explanation: 'Địa tầng đá vôi nứt nẻ xen kẹp đá sét mềm bão hòa nước gây trượt phẳng dạng nêm.'
      }
    ],
    aiRecommendation:
      'KHUYẾN NGHỊ AI: Cấm tất cả phương tiện qua QL34 Đèo Cao Bắc; Tổ chức tìm kiếm cứu nạn và dọn bùn đất bằng cơ giới.',
    decisionRequired:
      'LÃNH ĐẠO CẦN QUYẾT ĐỊNH: Lệnh cấm đường và lập hàng rào cảnh báo 2 đầu đèo.',
    tasks: [],
    tacticalOrders: [],
    shelters: [],
    safeRoutes: [],
    timeline: [
      {
        time: '05:45',
        stage: 'DETECTED',
        actor: 'Cảm biến giám sát giao thông đường bộ',
        description: 'Phát hiện sụt trượt taluy dương Quốc lộ 34.'
      }
    ]
  },
  {
    id: 'INC-SL-0831-QNAM',
    incidentCode: 'SL-0831-QNAM',
    name: 'Sạt lở sườn núi dãy Trường Sơn & Nguy cơ lũ bùn đá Nam Trà My',
    type: 'landslide',
    level: 5,
    riskScorePercent: 95,
    confidencePercent: 93,
    riskTrend: 'RISING_FAST',
    zoneId: 'commune_tra_leng_qnam',
    zoneName: 'Xã Trà Leng & Xã Trà Vân',
    districtName: 'Huyện Nam Trà My',
    provinceName: 'Tỉnh Quảng Nam',
    specificLocation: 'Thôn 1 Xã Trà Leng & Tuyến Quốc lộ 40B',
    coordinates: [15.195, 108.068],
    status: 'RESPONDING',
    detectedAt: '2026-08-23 18:00:00',
    timeToCriticalThresholdMinutes: 40,
    leadTimeStatus: 'KHẨN CẤP: Dải hội tụ nhiệt đới gây mưa cực đoan 310mm',
    impact: {
      exposedPopulation: 920,
      exposedHouseholds: 240,
      elderlyAndChildrenCount: 210,
      schoolsCount: 2,
      medicalClinicsCount: 1,
      vulnerableRoadsCount: 4,
      blockedRoadNames: ['Quốc lộ 40B đoạn qua ngầm Sông Trường và Đèo Trà My', 'Đường ĐH1 lên vùng cao Trà Leng'],
      bridgesAtRiskCount: 3,
      criticalFacilities: ['Trường Phổ thông DTBT Tiểu học Trà Leng', 'Trạm Y tế xã Trà Leng'],
      affectedAreaKm2: 15.0,
      estimatedEconomicExposureBillionVND: 44.0
    },
    explainableFactors: [
      {
        key: 'intense_rainfall',
        name: 'Mưa cực đoan dải hội tụ',
        value: 310,
        unit: 'mm',
        scorePercent: 98,
        weight: 0.45,
        contribution: 'VERY_HIGH',
        explanation: 'Lượng mưa liên tục trong 12h vượt ngưỡng 300mm tại vùng núi cao Nam Trà My.'
      }
    ],
    aiRecommendation:
      'KHUYẾN NGHỊ AI: Di dời dân cư vùng trũng ven sông Leng lên các nóc nhà kiên cố trên đồi thoải; Trực 100% quân số tại các vị trí xung yếu 40B.',
    decisionRequired:
      'LÃNH ĐẠO CẦN QUYẾT ĐỊNH: Phê duyệt phương án ứng phó sạt lở cấp tỉnh và tiếp tế lương thực dự trữ.',
    tasks: [],
    tacticalOrders: [],
    shelters: [],
    safeRoutes: [],
    timeline: [
      {
        time: '18:00',
        stage: 'DETECTED',
        actor: 'Mạng lưới trạm đo mưa VRAIN & Radar Tam Kỳ',
        description: 'Ghi nhận mưa vượt ngưỡng 300mm/12h.'
      }
    ]
  },
  {
    id: 'INC-SL-0832-LD',
    incidentCode: 'SL-0832-LD',
    name: 'Sạt trượt taluy vách đá Đèo Bảo Lộc & Nguy cơ trượt sườn đồi Đà Lạt',
    type: 'landslide',
    level: 4,
    riskScorePercent: 88,
    confidencePercent: 92,
    riskTrend: 'RISING',
    zoneId: 'commune_bao_loc_ld',
    zoneName: 'Thị trấn Đạ M\'ri & Đèo Bảo Lộc',
    districtName: 'Huyện Đạ Huoai & TP. Bảo Lộc',
    provinceName: 'Tỉnh Lâm Đồng',
    specificLocation: 'Km 103+300 Quốc lộ 20 & Đèo Prenn Đà Lạt',
    coordinates: [11.472, 107.726],
    status: 'RESPONDING',
    detectedAt: '2026-08-23 15:30:00',
    timeToCriticalThresholdMinutes: 60,
    leadTimeStatus: 'CẢNH BÁO CAO: Đất đỏ bazan bão hòa nước gây nứt taluy',
    impact: {
      exposedPopulation: 650,
      exposedHouseholds: 170,
      elderlyAndChildrenCount: 120,
      schoolsCount: 1,
      medicalClinicsCount: 1,
      vulnerableRoadsCount: 3,
      blockedRoadNames: ['Quốc lộ 20 đoạn qua Đèo Bảo Lộc', 'Tuyến đèo Mimosa vào Đà Lạt'],
      bridgesAtRiskCount: 2,
      criticalFacilities: ['Trạm CSGT Madagui', 'Hạ tầng cáp quang truyền dẫn xuyên đèo'],
      affectedAreaKm2: 9.5,
      estimatedEconomicExposureBillionVND: 28.5
    },
    explainableFactors: [
      {
        key: 'soil_type_basalt',
        name: 'Đất đỏ bazan phong hóa sâu',
        value: 'Tầng phong hóa 15m',
        scorePercent: 90,
        weight: 0.35,
        contribution: 'HIGH',
        explanation: 'Đặc thù đất đỏ bazan cao nguyên khi ngậm nước giảm mạnh góc ma sát trong và lực dính.'
      }
    ],
    aiRecommendation:
      'KHUYẾN NGHỊ AI: Điều tiết giao thông 1 chiều qua đèo Bảo Lộc; Kiểm tra liên tục các vết nứt đầu cơ taluy đỉnh đèo.',
    decisionRequired:
      'LÃNH ĐẠO CẦN QUYẾT ĐỊNH: Bố trí lực lượng cứu hộ thường trực tại 2 chân đèo Bảo Lộc và Prenn.',
    tasks: [],
    tacticalOrders: [],
    shelters: [],
    safeRoutes: [],
    timeline: [
      {
        time: '15:30',
        stage: 'DETECTED',
        actor: 'Cảm biến đo nghiêng Inclinometer & VRAIN',
        description: 'Ghi nhận chuyển dịch đầu cơ sườn taluy đèo.'
      }
    ]
  },
  {
    id: 'INC-SL-0834-AG',
    incidentCode: 'SL-0834-AG',
    name: 'Sạt lở bờ sông Tiền & Sông Hậu đe dọa khu dân cư và tuyến đê bao',
    type: 'landslide',
    level: 4,
    riskScorePercent: 85,
    confidencePercent: 91,
    riskTrend: 'RISING',
    zoneId: 'commune_chau_phu_ag',
    zoneName: 'Xã Bình Mỹ & TT Cái Dầu',
    districtName: 'Huyện Châu Phú',
    provinceName: 'Tỉnh An Giang',
    specificLocation: 'Đoạn bờ sông Hậu Quốc lộ 91 (Km 89)',
    coordinates: [10.582, 105.234],
    status: 'RESPONDING',
    detectedAt: '2026-08-23 14:00:00',
    timeToCriticalThresholdMinutes: 75,
    leadTimeStatus: 'CẢNH BÁO: Dòng chảy xoáy tạo hố xói sâu dưới lòng sông',
    impact: {
      exposedPopulation: 780,
      exposedHouseholds: 195,
      elderlyAndChildrenCount: 150,
      schoolsCount: 2,
      medicalClinicsCount: 1,
      vulnerableRoadsCount: 2,
      blockedRoadNames: ['Quốc lộ 91 đoạn tránh sạt lở Bình Mỹ'],
      bridgesAtRiskCount: 2,
      criticalFacilities: ['Tuyến đê bao kiểm soát lũ vụ Thu Đông', 'Chợ nổi và bến đò dân sinh'],
      affectedAreaKm2: 4.8,
      estimatedEconomicExposureBillionVND: 38.0
    },
    explainableFactors: [
      {
        key: 'river_hydrodynamics',
        name: 'Dòng chảy xoáy và hạ thấp mực nước triều rút',
        value: 'Hố xói sâu -22m',
        scorePercent: 92,
        weight: 0.40,
        contribution: 'HIGH',
        explanation: 'Chênh lệch áp lực nước lỗ rỗng khi triều rút kết hợp dòng xoáy chân bờ sông gây trượt trôi đột ngột.'
      }
    ],
    aiRecommendation:
      'KHUYẾN NGHỊ AI: Cắm biển cảnh báo và thả phao phân luồng giao thông thủy; Di dời các hộ dân sát mép bờ sông.',
    decisionRequired:
      'LÃNH ĐẠO CẦN QUYẾT ĐỊNH: Thả rọ đá gia cố chân kè khẩn cấp.',
    tasks: [],
    tacticalOrders: [],
    shelters: [],
    safeRoutes: [],
    timeline: [
      {
        time: '14:00',
        stage: 'DETECTED',
        actor: 'Thiết bị đo sâu hồi âm đa tia & Cảnh báo địa phương',
        description: 'Phát hiện xuất hiện vết nứt chạy dọc mép nhựa đường QL91.'
      }
    ]
  }
];

export const INITIAL_MULTI_TIER_KPIS: MultiTierKPIs = {
  commander: {
    criticalIncidentsCount: 5, // Cấp 5 (Lạng Sơn, Yên Bái, Lào Cai, Cao Bằng, Quảng Nam)
    highRiskZonesCount: 14,    // Cấp 4 (Lâm Đồng, An Giang, Nghệ An, Tuyên Quang, Thái Nguyên...)
    monitoringZonesCount: 48,  // Cấp 3 + 2
    totalExposedPopulation: 6850,
    totalExposedHouseholds: 1720,
    schoolsAtRisk: 18,
    clinicsAtRisk: 12,
    severedRoadsCount: 16,
    overdueTasksCount: 0,
    pendingDecisionsCount: 5
  },
  operation: {
    onlineStationsRatio: '2850/2920 (97.6%)',
    dataQualityPercent: 98.9,
    avgConfidenceScore: 94.2,
    activeRadarEchoes: 38,
    activeWarningsIssued: 18,
    activeTasksInProgress: 24
  },
  field: {
    assignedCommuneTasks: 42,
    completedCommuneTasks: 28,
    evacuatedHouseholdsProgress: '1.240/1.720 (72.1%)',
    activeSheltersReady: 36,
    supportRequestsPending: 4
  }
};

