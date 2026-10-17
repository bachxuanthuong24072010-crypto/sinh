const STARTING_POINTS = 100;
const DEFAULT_CLASSES = ["10A1", "10A2", "10A3", "10A4", "10A5", "10A6", "10A7", "11A1", "11A2", "11A3", "11A4", "11A5", "11A6", "11A7", "12A1", "12A2", "12A3", "12A4", "12A5", "12A6", "12A7"];

let storedClasses = JSON.parse(localStorage.getItem('thiduaso_classes'));
if (storedClasses) {
    storedClasses = storedClasses.filter(c => !['11B1', '11B2', '12C1', '12C2'].includes(c) && !c.includes('/'));
    DEFAULT_CLASSES.forEach(c => {
        if (!storedClasses.includes(c)) storedClasses.push(c);
    });
    storedClasses.sort();
    localStorage.setItem('thiduaso_classes', JSON.stringify(storedClasses));
}
let classes = storedClasses || [...DEFAULT_CLASSES];
let violations = JSON.parse(localStorage.getItem('thiduaso_violations')) || [];
let students = JSON.parse(localStorage.getItem('thiduaso_students')) || {};
let qaList = JSON.parse(localStorage.getItem('school_qa')) || [];

// ==============================================================================
// CẤU HÌNH GOOGLE FIREBASE CLOUD (DỰ ÁN STEAM - ĐỒNG BỘ MỌI THIẾT BỊ)
// ==============================================================================
const firebaseConfig = {
  apiKey: "AIzaSyAQcin17IaYged6q8rN4rT-ic6bsbCr00A",
  authDomain: "steam-c4716.firebaseapp.com",
  projectId: "steam-c4716",
  storageBucket: "steam-c4716.firebasestorage.app",
  messagingSenderId: "870403527270",
  appId: "1:870403527270:web:027fe654c88de4a80f13a7",
  measurementId: "G-4FP3QK039C"
};

let firebaseApp = null;
let firestoreDb = null;

try {
    if (typeof firebase !== 'undefined' && firebase.initializeApp) {
        firebaseApp = firebase.initializeApp(firebaseConfig);
        firestoreDb = firebase.firestore();
        window.firebaseApp = firebaseApp;
        window.firestoreDb = firestoreDb;
        console.log("🔥 Đã kết nối Firebase Cloud thành công cho dự án STEAM!");
    }
} catch (e) {
    console.warn("Lưu ý Firebase:", e);
}

// Đồng bộ danh sách tài khoản từ Firestore Database theo thời gian thực (Realtime Sync)
function initFirebaseAccountsSync() {
    if (!firestoreDb) return;
    try {
        firestoreDb.collection('accounts').onSnapshot(snapshot => {
            snapshot.forEach(doc => {
                const data = doc.data();
                if (!data || !data.username) return;
                const idx = authAccounts.findIndex(a => a.username.toLowerCase() === data.username.toLowerCase());
                if (idx >= 0) {
                    authAccounts[idx] = Object.assign({}, authAccounts[idx], data);
                } else {
                    authAccounts.push(data);
                }
            });
            localStorage.setItem('school_auth_accounts', JSON.stringify(authAccounts));
        }, err => {
            console.warn("Firestore sync lưu ý (chưa bật Firestore hoặc offline):", err);
        });
    } catch (e) {
        console.warn("Lỗi đồng bộ Firebase:", e);
    }
}
setTimeout(initFirebaseAccountsSync, 600);

// ==============================================================================
// BIẾN XÁC THỰC, ĐĂNG NHẬP & PHÂN QUYỀN (AUTHENTICATION & RBAC)
// ==============================================================================
const DEFAULT_AUTH_ACCOUNTS = [
    {
        id: 'acc_admin_default',
        username: 'adim',
        password: '123',
        name: 'Quản trị viên (Admin)',
        role: 'admin',
        roleLabel: 'Quản trị viên (Admin)',
        avatar: '👑',
        className: '',
        subject: 'Toàn trường',
        detail: 'Ban Giám Hiệu / Quản trị viên hệ thống - Toàn quyền cấu hình & đồng bộ',
        createdAt: '13/10/2026'
    },
    {
        id: 'acc_admin_alias',
        username: 'admin',
        password: '123',
        name: 'Quản trị viên (Admin)',
        role: 'admin',
        roleLabel: 'Quản trị viên (Admin)',
        avatar: '👑',
        className: '',
        subject: 'Toàn trường',
        detail: 'Ban Giám Hiệu / Quản trị viên hệ thống - Toàn quyền cấu hình & đồng bộ',
        createdAt: '13/10/2026'
    },
    {
        id: 'acc_student_default',
        username: 'hocsinh',
        password: '123',
        name: 'Học sinh (Trần Bảo Long)',
        role: 'student',
        roleLabel: 'Học sinh',
        avatar: '🎒',
        className: '12A1',
        subject: '',
        detail: 'Học sinh Lớp 12A1 - Xem thời khóa biểu & làm bài thi trắc nghiệm',
        createdAt: '13/10/2026'
    },
    {
        id: 'acc_teacher_default',
        username: 'giaovien',
        password: '123',
        name: 'Thầy Nguyễn Văn An',
        role: 'teacher',
        roleLabel: 'Giáo viên',
        avatar: '👨‍🏫',
        className: '',
        subject: 'Toán',
        detail: 'Giáo viên bộ môn Toán',
        createdAt: '13/10/2026'
    }
];

let authAccounts = JSON.parse(localStorage.getItem('school_auth_accounts')) || [];
// Luôn đồng bộ tài khoản mẫu mặc định (adim, admin, hocsinh, giaovien)
DEFAULT_AUTH_ACCOUNTS.forEach(defAcc => {
    const existingIndex = authAccounts.findIndex(a => a.username.toLowerCase() === defAcc.username.toLowerCase());
    if (existingIndex === -1) {
        authAccounts.push(defAcc);
    } else {
        authAccounts[existingIndex].password = defAcc.password;
        authAccounts[existingIndex].role = defAcc.role;
        authAccounts[existingIndex].roleLabel = defAcc.roleLabel;
        authAccounts[existingIndex].name = defAcc.name;
    }
});
localStorage.setItem('school_auth_accounts', JSON.stringify(authAccounts));

let currentAuthUser = JSON.parse(localStorage.getItem('school_auth_current_user')) || null;
var currentUser = JSON.parse(localStorage.getItem('school_current_user')) || null;

// BIẾN QUẢN LÝ CÁ NHÂN
let myProfile = JSON.parse(localStorage.getItem('my_profile')) || { className: '', studentName: '' };
let mySchedules = JSON.parse(localStorage.getItem('my_schedules')) || [];
let myStudyPlans = JSON.parse(localStorage.getItem('my_study_plans')) || [];
let isReminderOn = JSON.parse(localStorage.getItem('my_reminder_status'));
if (isReminderOn === null) isReminderOn = true;

const DEFAULT_TIMETABLES = {
    main: {
        "10A1": {
                "t2": "Tiết 1: CHAOCO, Tiết 2: VAN - Tr.Hà, Tiết 3: GDDP - Thi, Tiết 4: SINH - Thủy",
                "t3": "Tiết 1: QP - Dự, Tiết 2: GD - Giang, Tiết 3: CD1 - Nhẫn, Tiết 4: DIA - Hằng, Tiết 5: HĐTN - Long",
                "t4": "Tiết 1: GDTC - Thành, Tiết 2: DIA - Hằng, Tiết 3: SU - Bình, Tiết 4: LY - V.Trang, Tiết 5: GD - Giang",
                "t5": "Tiết 1: TOAN - Hồng, Tiết 2: TOAN - Hồng, Tiết 3: LY - V.Trang, Tiết 4: SU - Bình, Tiết 5: SINH - Thủy",
                "t6": "Tiết 1: VAN - Tr.Hà, Tiết 2: VAN - Tr.Hà, Tiết 3: DIA - Hằng, Tiết 4: NN - Trường, Tiết 5: SH - V.Trang",
                "t7": "Tiết 1: NN - Trường, Tiết 2: NN - Trường, Tiết 3: GDTC - Thành, Tiết 4: TOAN - Hồng"
        },
        "10A2": {
                "t2": "Tiết 1: CHAOCO, Tiết 2: HOA - Thi, Tiết 3: NN - Trường, Tiết 4: NN - Trường",
                "t3": "Tiết 1: TOAN - Quyết, Tiết 2: TOAN - Quyết, Tiết 3: GD - Giang, Tiết 4: HOA - Thi, Tiết 5: SINH - Thủy",
                "t4": "Tiết 1: CN - V.Hà, Tiết 2: GDTC - Bích, Tiết 3: HĐTN - Lĩnh, Tiết 4: GD - Giang, Tiết 5: GDDP - Thi",
                "t5": "Tiết 1: SINH - Thủy, Tiết 2: QP - Dự, Tiết 3: VAN - V.Anh, Tiết 4: VAN - V.Anh, Tiết 5: SU - Bình",
                "t6": "Tiết 1: SINH - Thủy, Tiết 2: VAN - V.Anh, Tiết 3: VAN - V.Anh, Tiết 4: GDTC - Bích, Tiết 5: SH - V.Anh",
                "t7": "Tiết 1: CN - V.Hà, Tiết 2: TOAN - Quyết, Tiết 3: SU - Bình, Tiết 4: NN - Trường"
        },
        "10A3": {
                "t2": "Tiết 1: CHAOCO, Tiết 2: VAN - Nhẫn, Tiết 3: TOAN - Tâm, Tiết 4: TOAN - Tâm",
                "t3": "Tiết 1: GDTC - Thành, Tiết 2: SU - Bình, Tiết 3: HOA - Thi, Tiết 4: LY - V.Trang, Tiết 5: DIA - Loan",
                "t4": "Tiết 1: TOAN - Tâm, Tiết 2: GDTC - Thành, Tiết 3: LY - V.Trang, Tiết 4: GDDP - Tựa, Tiết 5: TIN - T.Anh",
                "t5": "Tiết 1: TIN - T.Anh, Tiết 2: HOA - Thi, Tiết 3: NN - Vinh, Tiết 4: DIA - Loan, Tiết 5: LY - V.Trang",
                "t6": "Tiết 1: VAN - Nhẫn, Tiết 2: VAN - Nhẫn, Tiết 3: NN - Vinh, Tiết 4: NN - Vinh, Tiết 5: SH - Tâm",
                "t7": "Tiết 1: HĐTN - Tâm, Tiết 2: TOAN - Tâm, Tiết 3: QP - Lĩnh, Tiết 4: HOA - Thi"
        },
        "10A4": {
                "t2": "Tiết 1: CHAOCO, Tiết 2: VAN - Ngân, Tiết 3: GD - Giang, Tiết 4: GD - Giang",
                "t3": "Tiết 1: TOAN - Trà, Tiết 2: TOAN - Trà, Tiết 3: SU - Bình, Tiết 4: TIN - Quỳnh, Tiết 5: CN - Điền",
                "t4": "Tiết 1: HĐTN - Long, Tiết 2: CN - Điền, Tiết 3: DIA - Loan, Tiết 4: DIA - Loan, Tiết 5: GDDP - Tựa",
                "t5": "Tiết 1: DIA - Loan, Tiết 2: TOAN - Trà, Tiết 3: GDTC - Thành, Tiết 4: TIN - Quỳnh, Tiết 5: CD1 - Hồng",
                "t6": "Tiết 1: NN - Thúy, Tiết 2: NN - Thúy, Tiết 3: CN - Điền, Tiết 4: QP - Dự, Tiết 5: SH - Điền",
                "t7": "Tiết 1: VAN - Ngân, Tiết 2: VAN - Ngân, Tiết 3: NN - Thúy, Tiết 4: GDTC - Thành"
        },
        "10A5": {
                "t2": "Tiết 1: CHAOCO, Tiết 2: GDDP - Tựa, Tiết 3: TOAN - Hồng, Tiết 4: TOAN - Hồng",
                "t3": "Tiết 1: VAN - Tr.Hà, Tiết 2: VAN - Tr.Hà, Tiết 3: CN - Điền, Tiết 4: NN - Hiệp, Tiết 5: TOAN - Hồng",
                "t4": "Tiết 1: QP - Lĩnh, Tiết 2: TIN - Quỳnh, Tiết 3: GDTC - Thành, Tiết 4: CN - Điền, Tiết 5: CN - Điền",
                "t5": "Tiết 1: DIA - Hằng, Tiết 2: NN - Hiệp, Tiết 3: NN - Hiệp, Tiết 4: SU - Mai, Tiết 5: GD - Giang",
                "t6": "Tiết 1: TIN - Quỳnh, Tiết 2: DIA - Hằng, Tiết 3: VAN - Tr.Hà, Tiết 4: HĐTN - Hiệp, Tiết 5: SH - Hiệp",
                "t7": "Tiết 1: GDTC - Thành, Tiết 2: GD - Giang, Tiết 3: TOAN - Hồng, Tiết 4: DIA - Hằng"
        },
        "10A6": {
                "t2": "Tiết 1: CHAOCO, Tiết 2: NN - Thúy, Tiết 3: NN - Thúy, Tiết 4: CN - V.Hà",
                "t3": "Tiết 1: VAN - Nhẫn, Tiết 2: VAN - Nhẫn, Tiết 3: GDTC - Thành, Tiết 4: DIA - Loan, Tiết 5: GD - Nhung",
                "t4": "Tiết 1: VAN - Nhẫn, Tiết 2: VAN - Nhẫn, Tiết 3: GDDP - Tựa, Tiết 4: TIN - Quỳnh, Tiết 5: QP - Lĩnh",
                "t5": "Tiết 1: GD - Nhung, Tiết 2: SU - Bình, Tiết 3: TOAN - Trà, Tiết 4: TOAN - Trà, Tiết 5: TIN - Quỳnh",
                "t6": "Tiết 1: GD - Nhung, Tiết 2: GDTC - Thành, Tiết 3: TOAN - Trà, Tiết 4: NN - Thúy, Tiết 5: SH - Lĩnh",
                "t7": "Tiết 1: DIA - Loan, Tiết 2: CN - V.Hà, Tiết 3: CN - V.Hà, Tiết 4: HĐTN - Lĩnh"
        },
        "10A7": {
                "t2": "Tiết 1: CHAOCO, Tiết 2: CN - V.Hà, Tiết 3: TOAN - Trà, Tiết 4: TOAN - Trà",
                "t3": "Tiết 1: DIA - Loan, Tiết 2: HĐTN - Dự, Tiết 3: SU - Mai, Tiết 4: VAN - Nhẫn, Tiết 5: TIN - T.Anh",
                "t4": "Tiết 1: NN - Tựa, Tiết 2: GD - Giang, Tiết 3: VAN - Nhẫn, Tiết 4: CN - V.Hà, Tiết 5: DIA - Loan",
                "t5": "Tiết 1: GDTC - Thành, Tiết 2: GDDP - Tựa, Tiết 3: GD - Giang, Tiết 4: QP - Dự, Tiết 5: TOAN - Trà",
                "t6": "Tiết 1: GDTC - Thành, Tiết 2: TIN - T.Anh, Tiết 3: VAN - Nhẫn, Tiết 4: VAN - Nhẫn, Tiết 5: SH - Dự",
                "t7": "Tiết 1: NN - Tựa, Tiết 2: NN - Tựa, Tiết 3: GD - Giang, Tiết 4: CN - V.Hà"
        },
        "11A1": {
                "t2": "Tiết 1: CHAOCO, Tiết 2: TOAN - P.Trang, Tiết 3: TOAN - P.Trang, Tiết 4: GDDP - Tựa",
                "t3": "Tiết 1: QP - Lĩnh, Tiết 2: GDTC - Thành, Tiết 3: DIA - Thạch, Tiết 4: NN - Trường, Tiết 5: NN - Trường",
                "t4": "Tiết 1: VAN - Ngân, Tiết 2: VAN - Ngân, Tiết 3: HOA - Thi, Tiết 4: GDTC - Thành, Tiết 5: GD - Nhung",
                "t5": "Tiết 1: CN - Cường, Tiết 2: GD - Nhung, Tiết 3: TOAN - P.Trang, Tiết 4: HĐTN - Chính, Tiết 5: HOA - Thi",
                "t6": "Tiết 1: CN - Cường, Tiết 2: DIA - Thạch, Tiết 3: VAN - Ngân, Tiết 4: SU - Mai, Tiết 5: SH - Ngân",
                "t7": "Tiết 1: DIA - Thạch, Tiết 2: SU - Mai, Tiết 3: NN - Trường, Tiết 4: VAN - Ngân"
        },
        "11A2": {
                "t2": "Tiết 1: CHAOCO, Tiết 2: HĐTN - Giang, Tiết 3: VAN - V.Anh, Tiết 4: VAN - V.Anh",
                "t3": "Tiết 1: CN - Cường, Tiết 2: HOA - Thi, Tiết 3: DIA - Loan, Tiết 4: GD - Nhung, Tiết 5: QP - Lĩnh",
                "t4": "Tiết 1: DIA - Loan, Tiết 2: DIA - Loan, Tiết 3: SU - Thảo, Tiết 4: GDTC - K.Anh, Tiết 5: CD1 - Ngân",
                "t5": "Tiết 1: SU - Thảo, Tiết 2: TOAN - Nhàn, Tiết 3: TOAN - Nhàn, Tiết 4: GDDP - Tựa, Tiết 5: GD - Nhung",
                "t6": "Tiết 1: VAN - V.Anh, Tiết 2: NN - Dũng, Tiết 3: NN - Dũng, Tiết 4: TOAN - Nhàn, Tiết 5: SH - Cường",
                "t7": "Tiết 1: NN - Dũng, Tiết 2: HOA - Thi, Tiết 3: CN - Cường, Tiết 4: GDTC - K.Anh"
        },
        "11A3": {
                "t2": "Tiết 1: CHAOCO, Tiết 2: LY - Thắng, Tiết 3: SINH - Thủy, Tiết 4: NN - Hiệp",
                "t3": "Tiết 1: SU - Thảo, Tiết 2: SINH - Thủy, Tiết 3: TOAN - Tráng, Tiết 4: TOAN - Tráng, Tiết 5: NN - Hiệp",
                "t4": "Tiết 1: VAN - Vân, Tiết 2: VAN - Vân, Tiết 3: GDTC - K.Anh, Tiết 4: TOAN - Tráng, Tiết 5: LY - Thắng",
                "t5": "Tiết 1: GDDP - Tựa, Tiết 2: HĐTN - Chính, Tiết 3: TIN - Việt, Tiết 4: GDTC - K.Anh, Tiết 5: HOA - Linh",
                "t6": "Tiết 1: NN - Hiệp, Tiết 2: TOAN - Tráng, Tiết 3: QP - Lĩnh, Tiết 4: HOA - Linh, Tiết 5: SH - Tráng",
                "t7": "Tiết 1: VAN - Vân, Tiết 2: HOA - Linh, Tiết 3: TIN - Việt, Tiết 4: TIN - Việt"
        },
        "11A4": {
                "t2": "Tiết 1: CHAOCO, Tiết 2: NN - Dũng, Tiết 3: NN - Dũng, Tiết 4: HOA - Thi",
                "t3": "Tiết 1: TIN - Quỳnh, Tiết 2: DIA - Hằng, Tiết 3: VAN - V.Anh, Tiết 4: CD1 - Quyết, Tiết 5: HOA - Thi",
                "t4": "Tiết 1: TOAN - P.Trang, Tiết 2: GDTC - K.Anh, Tiết 3: TIN - Quỳnh, Tiết 4: HOA - Thi, Tiết 5: SINH - V.Hà",
                "t5": "Tiết 1: VAN - V.Anh, Tiết 2: VAN - V.Anh, Tiết 3: GDTC - K.Anh, Tiết 4: HĐTN - Giang, Tiết 5: GDDP - Thành",
                "t6": "Tiết 1: TOAN - P.Trang, Tiết 2: TOAN - P.Trang, Tiết 3: TIN - Quỳnh, Tiết 4: SINH - V.Hà, Tiết 5: SH - Quỳnh",
                "t7": "Tiết 1: QP - Lĩnh, Tiết 2: DIA - Hằng, Tiết 3: NN - Dũng, Tiết 4: SU - Mai"
        },
        "11A5": {
                "t2": "Tiết 1: CHAOCO, Tiết 2: GDTC - K.Anh, Tiết 3: VAN - Ngân, Tiết 4: VAN - Ngân",
                "t3": "Tiết 1: TOAN - P.Trang, Tiết 2: TOAN - P.Trang, Tiết 3: DIA - Hằng, Tiết 4: QP - Lĩnh, Tiết 5: TIN - Quỳnh",
                "t4": "Tiết 1: DIA - Hằng, Tiết 2: HOA - Thi, Tiết 3: TOAN - P.Trang, Tiết 4: SINH - Thủy, Tiết 5: TIN - Quỳnh",
                "t5": "Tiết 1: TOAN - P.Trang, Tiết 2: GDDP - Thành, Tiết 3: SINH - Thủy, Tiết 4: HOA - Thi, Tiết 5: NN - Dũng",
                "t6": "Tiết 1: NN - Dũng, Tiết 2: TIN - Quỳnh, Tiết 3: SU - Thảo, Tiết 4: VAN - Ngân, Tiết 5: SH - Dũng",
                "t7": "Tiết 1: GDTC - K.Anh, Tiết 2: NN - Dũng, Tiết 3: HOA - Thi, Tiết 4: HĐTN - Giang"
        },
        "11A6": {
                "t2": "Tiết 1: CHAOCO, Tiết 2: SU - Thảo, Tiết 3: TOAN - Nhàn, Tiết 4: TOAN - Nhàn",
                "t3": "Tiết 1: NN - Trường, Tiết 2: NN - Trường, Tiết 3: CD1 - T.Anh, Tiết 4: DIA - Thạch, Tiết 5: HĐTN - Giang",
                "t4": "Tiết 1: DIA - Thạch, Tiết 2: LY - Thắng, Tiết 3: CD2 - Giang, Tiết 4: QP - Lĩnh, Tiết 5: TIN - Việt",
                "t5": "Tiết 1: GDTC - K.Anh, Tiết 2: TIN - Việt, Tiết 3: LY - Thắng, Tiết 4: GDDP - Thành, Tiết 5: TOAN - Nhàn",
                "t6": "Tiết 1: TOAN - Nhàn, Tiết 2: GD - Hạnh, Tiết 3: NN - Trường, Tiết 4: VAN - V.Lan, Tiết 5: SH - Trường",
                "t7": "Tiết 1: GD - Hạnh, Tiết 2: GDTC - K.Anh, Tiết 3: VAN - V.Lan, Tiết 4: VAN - V.Lan"
        },
        "11A7": {
                "t2": "Tiết 1: CHAOCO, Tiết 2: TOAN - Nhàn, Tiết 3: GD - Hạnh, Tiết 4: GDTC - K.Anh",
                "t3": "Tiết 1: VAN - V.Anh, Tiết 2: VAN - V.Anh, Tiết 3: LY - Thắng, Tiết 4: TIN - Việt, Tiết 5: TIN - Việt",
                "t4": "Tiết 1: TOAN - Nhàn, Tiết 2: TOAN - Nhàn, Tiết 3: GD - Hạnh, Tiết 4: GD - Hạnh, Tiết 5: GDDP - Bích",
                "t5": "Tiết 1: TOAN - Nhàn, Tiết 2: SU - Thảo, Tiết 3: NN - Dũng, Tiết 4: NN - Dũng, Tiết 5: VAN - V.Anh",
                "t6": "Tiết 1: DIA - Hằng, Tiết 2: LY - Thắng, Tiết 3: GDTC - K.Anh, Tiết 4: QP - Lĩnh, Tiết 5: SH - K.Anh",
                "t7": "Tiết 1: HĐTN - Giang, Tiết 2: TIN - Việt, Tiết 3: DIA - Hằng, Tiết 4: NN - Dũng"
        },
        "12A1": {
                "t2": "Tiết 1: CHAOCO, Tiết 2: HĐTN - Linh, Tiết 3: VAN - V.Lan, Tiết 4: VAN - V.Lan, Tiết 5: LY - Thắng",
                "t3": "Tiết 1: NN - Vinh, Tiết 2: NN - Vinh, Tiết 3: TOAN - P.Trang, Tiết 4: HOA - Linh, Tiết 5: QP - Dự",
                "t4": "Tiết 1: VAN - V.Lan, Tiết 2: SINH - Thủy, Tiết 3: TIN - Việt, Tiết 4: GDTC - Bích, Tiết 5: SU - Bình",
                "t5": "Tiết 1: LY - Thắng, Tiết 2: TOAN - P.Trang, Tiết 3: HOA - Linh, Tiết 4: SINH - Thủy, Tiết 5: NN - Vinh",
                "t6": "Tiết 1: LY - Thắng, Tiết 2: GDTC - Bích, Tiết 3: TOAN - P.Trang, Tiết 4: TOAN - P.Trang, Tiết 5: SH - Linh",
                "t7": "Tiết 1: TIN - Việt, Tiết 2: SU - Bình, Tiết 3: HOA - Linh, Tiết 4: GDDP - Bình"
        },
        "12A2": {
                "t2": "Tiết 1: CHAOCO, Tiết 2: TOAN - Tâm, Tiết 3: LY - Thắng, Tiết 4: HOA - Linh, Tiết 5: HOA - Linh",
                "t3": "Tiết 1: LY - Thắng, Tiết 2: TIN - Việt, Tiết 3: NN - Thúy, Tiết 4: GDDP - Bình, Tiết 5: HOA - Linh",
                "t4": "Tiết 1: LY - Thắng, Tiết 2: TOAN - Tâm, Tiết 3: HĐTN - Tâm, Tiết 4: SU - Bình, Tiết 5: SINH - Thủy",
                "t5": "Tiết 1: VAN - Vân, Tiết 2: VAN - Vân, Tiết 3: SU - Bình, Tiết 4: GDTC - Bích, Tiết 5: TIN - Việt",
                "t6": "Tiết 1: QP - Dự, Tiết 2: SINH - Thủy, Tiết 3: TOAN - Tâm, Tiết 4: TOAN - Tâm, Tiết 5: SH - Thúy",
                "t7": "Tiết 1: NN - Thúy, Tiết 2: NN - Thúy, Tiết 3: VAN - Vân, Tiết 4: GDTC - Bích"
        },
        "12A3": {
                "t2": "Tiết 1: CHAOCO, Tiết 2: TOAN - Trà, Tiết 3: CN - Điền, Tiết 4: VAN - Nhẫn, Tiết 5: VAN - Nhẫn",
                "t3": "Tiết 1: NN - Thúy, Tiết 2: NN - Thúy, Tiết 3: GDDP - Trà, Tiết 4: LY - Thắng, Tiết 5: VAN - Nhẫn",
                "t4": "Tiết 1: GDTC - Bích, Tiết 2: SU - Thảo, Tiết 3: CN - Điền, Tiết 4: DIA - Hằng, Tiết 5: GD - Hạnh",
                "t5": "Tiết 1: TOAN - Trà, Tiết 2: DIA - Hằng, Tiết 3: SU - Thảo, Tiết 4: LY - Thắng, Tiết 5: CN - Điền",
                "t6": "Tiết 1: TOAN - Trà, Tiết 2: TOAN - Trà, Tiết 3: LY - Thắng, Tiết 4: GD - Hạnh, Tiết 5: SH - Hạnh",
                "t7": "Tiết 1: QP - Dự, Tiết 2: HĐTN - Hạnh, Tiết 3: GDTC - Bích, Tiết 4: NN - Thúy"
        },
        "12A4": {
                "t2": "Tiết 1: CHAOCO, Tiết 2: TOAN - Quyết, Tiết 3: HĐTN - Quyết, Tiết 4: SU - Thảo, Tiết 5: GD - Hạnh",
                "t3": "Tiết 1: NN - Tựa, Tiết 2: NN - Tựa, Tiết 3: GDDP - Thảo, Tiết 4: GDTC - Bích, Tiết 5: LY - V.Trang",
                "t4": "Tiết 1: GD - Hạnh, Tiết 2: LY - V.Trang, Tiết 3: VAN - V.Lan, Tiết 4: VAN - V.Lan, Tiết 5: DIA - Hằng",
                "t5": "Tiết 1: TOAN - Quyết, Tiết 2: TOAN - Quyết, Tiết 3: NN - Tựa, Tiết 4: DIA - Hằng, Tiết 5: QP - Dự",
                "t6": "Tiết 1: SU - Thảo, Tiết 2: CN - Cường, Tiết 3: CN - Cường, Tiết 4: LY - V.Trang, Tiết 5: SH - V.Lan",
                "t7": "Tiết 1: VAN - V.Lan, Tiết 2: GDTC - Bích, Tiết 3: TOAN - Quyết, Tiết 4: CN - Cường"
        },
        "12A5": {
                "t2": "Tiết 1: CHAOCO, Tiết 2: CN - Điền, Tiết 3: VAN - Tr.Hà, Tiết 4: NN - Vinh, Tiết 5: SINH - Thủy",
                "t3": "Tiết 1: GD - Nhung, Tiết 2: DIA - Loan, Tiết 3: SINH - Thủy, Tiết 4: NN - Vinh, Tiết 5: NN - Vinh",
                "t4": "Tiết 1: SU - Thảo, Tiết 2: GD - Nhung, Tiết 3: TOAN - Nhàn, Tiết 4: TOAN - Nhàn, Tiết 5: GDDP - Thảo",
                "t5": "Tiết 1: GDTC - Bích, Tiết 2: DIA - Loan, Tiết 3: CN - Điền, Tiết 4: GD - Nhung, Tiết 5: HĐTN - Loan",
                "t6": "Tiết 1: GDTC - Bích, Tiết 2: TOAN - Nhàn, Tiết 3: TOAN - Nhàn, Tiết 4: SU - Thảo, Tiết 5: SH - Vinh",
                "t7": "Tiết 1: VAN - Tr.Hà, Tiết 2: VAN - Tr.Hà, Tiết 3: DIA - Loan, Tiết 4: QP - Dự"
        },
        "12A6": {
                "t2": "Tiết 1: CHAOCO, Tiết 2: CN - Cường, Tiết 3: VAN - Vân, Tiết 4: VAN - Vân, Tiết 5: SINH - V.Hà",
                "t3": "Tiết 1: DIA - Thạch, Tiết 2: GDTC - Bích, Tiết 3: GD - Nhung, Tiết 4: TOAN - Hồng, Tiết 5: SU - Mai",
                "t4": "Tiết 1: TOAN - Hồng, Tiết 2: TOAN - Hồng, Tiết 3: VAN - Vân, Tiết 4: GD - Nhung, Tiết 5: DIA - Thạch",
                "t5": "Tiết 1: QP - Dự, Tiết 2: GDTC - Bích, Tiết 3: HĐTN - Vân, Tiết 4: GDDP - Vinh, Tiết 5: NN - Tựa",
                "t6": "Tiết 1: SINH - V.Hà, Tiết 2: SU - Mai, Tiết 3: GD - Nhung, Tiết 4: CN - Cường, Tiết 5: SH - V.Hà",
                "t7": "Tiết 1: TOAN - Hồng, Tiết 2: DIA - Thạch, Tiết 3: NN - Tựa, Tiết 4: NN - Tựa"
        },
        "12A7": {
                "t2": "Tiết 1: CHAOCO, Tiết 2: NN - Hiệp, Tiết 3: NN - Hiệp, Tiết 4: VAN - Tr.Hà, Tiết 5: GDDP - Vinh",
                "t3": "Tiết 1: GDTC - Bích, Tiết 2: CN - Cường, Tiết 3: LY - V.Trang, Tiết 4: VAN - Tr.Hà, Tiết 5: VAN - Tr.Hà",
                "t4": "Tiết 1: GD - Nhung, Tiết 2: TOAN - Tráng, Tiết 3: TOAN - Tráng, Tiết 4: DIA - Thạch, Tiết 5: LY - V.Trang",
                "t5": "Tiết 1: NN - Hiệp, Tiết 2: CN - Cường, Tiết 3: GDTC - Bích, Tiết 4: LY - V.Trang, Tiết 5: SU - Mai",
                "t6": "Tiết 1: DIA - Thạch, Tiết 2: GD - Nhung, Tiết 3: TOAN - Tráng, Tiết 4: TOAN - Tráng, Tiết 5: SH - Mai",
                "t7": "Tiết 1: SU - Mai, Tiết 2: CN - Cường, Tiết 3: QP - Dự, Tiết 4: HĐTN - Tr.Hà"
        }
},
    prep: {
        "12A1": {
                "t2": "Tiết 1: VAN - V.Lan, Tiết 2: VAN - V.Lan",
                "t3": "Tiết 1: LY - Thắng, Tiết 2: LY - Thắng",
                "t4": "Tiết 1: TOAN - P.Trang, Tiết 2: TOAN - P.Trang",
                "t5": "Tiết 1: HOA - Linh, Tiết 2: HOA - Linh",
                "t6": "Tiết 1: NN - Hiệp, Tiết 2: NN - Hiệp",
                "t7": ""
        },
        "12A2": {
                "t2": "Tiết 1: TOAN - Tâm, Tiết 2: TOAN - Tâm",
                "t3": "Tiết 1: TIN - Việt, Tiết 2: TIN - Việt",
                "t4": "Tiết 1: VAN - Vân, Tiết 2: VAN - Vân",
                "t5": "Tiết 1: SU - Bình, Tiết 2: SU - Bình",
                "t6": "Tiết 1: LY - V.Trang, Tiết 2: LY - V.Trang",
                "t7": ""
        },
        "12A3": {
                "t2": "Tiết 1: TOAN - Trà, Tiết 2: TOAN - Trà",
                "t3": "Tiết 1: GD - Hạnh, Tiết 2: GD - Hạnh",
                "t4": "Tiết 1: VAN - Nhẫn, Tiết 2: VAN - Nhẫn",
                "t5": "Tiết 1: SU - Thảo, Tiết 2: SU - Thảo",
                "t6": "",
                "t7": ""
        },
        "12A4": {
                "t2": "Tiết 1: TOAN - Quyết, Tiết 2: TOAN - Quyết",
                "t3": "Tiết 1: DIA - Hằng, Tiết 2: DIA - Hằng",
                "t4": "Tiết 1: VAN - V.Lan, Tiết 2: VAN - V.Lan",
                "t5": "Tiết 1: GD - Hạnh, Tiết 2: GD - Hạnh",
                "t6": "",
                "t7": ""
        },
        "12A5": {
                "t2": "Tiết 1: TOAN - Nhàn, Tiết 2: TOAN - Nhàn",
                "t3": "Tiết 1: SU - Thảo, Tiết 2: SU - Thảo",
                "t4": "Tiết 1: VAN - Tr.Hà, Tiết 2: VAN - Tr.Hà",
                "t5": "Tiết 1: DIA - Loan, Tiết 2: DIA - Loan",
                "t6": "Tiết 1: GD - Nhung, Tiết 2: GD - Nhung",
                "t7": ""
        },
        "12A6": {
                "t2": "Tiết 1: VAN - Vân, Tiết 2: VAN - Vân",
                "t3": "Tiết 1: SU - Mai, Tiết 2: SU - Mai",
                "t4": "Tiết 1: DIA - Thạch, Tiết 2: DIA - Thạch",
                "t5": "Tiết 1: TOAN - Hồng, Tiết 2: TOAN - Hồng",
                "t6": "",
                "t7": ""
        },
        "12A7": {
                "t2": "Tiết 1: VAN - Tr.Hà, Tiết 2: VAN - Tr.Hà",
                "t3": "Tiết 1: DIA - Thạch, Tiết 2: DIA - Thạch",
                "t4": "Tiết 1: TOAN - Tráng, Tiết 2: TOAN - Tráng",
                "t5": "Tiết 1: SU - Mai, Tiết 2: SU - Mai",
                "t6": "",
                "t7": ""
        }
},
    teacher: {
        "Đặng Thị Kim Anh": {
                "t2": "Tiết 2: 11A5 - Giáo dục thể chất, Tiết 4: 11A7 - Giáo dục thể chất",
                "t3": "",
                "t4": "Tiết 2: 11A4 - Giáo dục thể chất, Tiết 3: 11A3 - Giáo dục thể chất, Tiết 4: 11A2 - Giáo dục thể chất",
                "t5": "Tiết 1: 11A6 - Giáo dục thể chất, Tiết 3: 11A4 - Giáo dục thể chất, Tiết 4: 11A3 - Giáo dục thể chất",
                "t6": "Tiết 3: 11A7 - Giáo dục thể chất, Tiết 5: 11A7 - Sinh hoạt",
                "t7": "Tiết 1: 11A5 - Giáo dục thể chất, Tiết 2: 11A6 - Giáo dục thể chất, Tiết 4: 11A2 - Giáo dục thể chất"
        },
        "Nguyễn Thị Vân Anh": {
                "t2": "Tiết 3: 11A2 - Ngữ văn, Tiết 4: 11A2 - Ngữ văn",
                "t3": "Tiết 1: 11A7 - Ngữ văn, Tiết 2: 11A7 - Ngữ văn, Tiết 3: 11A4 - Ngữ văn",
                "t4": "",
                "t5": "Tiết 1: 11A4 - Ngữ văn, Tiết 2: 11A4 - Ngữ văn, Tiết 3: 10A2 - Ngữ văn, Tiết 4: 10A2 - Ngữ văn, Tiết 5: 11A7 - Ngữ văn",
                "t6": "Tiết 1: 11A2 - Ngữ văn, Tiết 2: 10A2 - Ngữ văn, Tiết 3: 10A2 - Ngữ văn, Tiết 5: 10A2 - Sinh hoạt",
                "t7": ""
        },
        "Nguyễn Tuấn Anh": {
                "t2": "",
                "t3": "Tiết 3: 11A6 - Chuyên đề 1, Tiết 5: 10A7 - Tin học",
                "t4": "Tiết 5: 10A3 - Tin học",
                "t5": "Tiết 1: 10A3 - Tin học",
                "t6": "Tiết 2: 10A7 - Tin học",
                "t7": ""
        },
        "Bùi Thị Hòa Bình": {
                "t2": "",
                "t3": "Tiết 2: 10A3 - Lịch sử, Tiết 3: 10A4 - Lịch sử, Tiết 4: 12A2 - Giáo dục địa phương",
                "t4": "Tiết 3: 10A1 - Lịch sử, Tiết 4: 12A2 - Lịch sử, Tiết 5: 12A1 - Lịch sử",
                "t5": "Tiết 2: 10A6 - Lịch sử, Tiết 3: 12A2 - Lịch sử, Tiết 4: 10A1 - Lịch sử, Tiết 5: 10A2 - Lịch sử, T1 (Chiều): 12A2 - Lịch sử, T2 (Chiều): 12A2 - Lịch sử",
                "t6": "",
                "t7": "Tiết 2: 12A1 - Lịch sử, Tiết 3: 10A2 - Lịch sử, Tiết 4: 12A1 - Giáo dục địa phương"
        },
        "Nguyễn Thị Bích": {
                "t2": "",
                "t3": "Tiết 1: 12A7 - Giáo dục thể chất, Tiết 2: 12A6 - Giáo dục thể chất, Tiết 4: 12A4 - Giáo dục thể chất",
                "t4": "Tiết 1: 12A3 - Giáo dục thể chất, Tiết 2: 10A2 - Giáo dục thể chất, Tiết 4: 12A1 - Giáo dục thể chất, Tiết 5: 11A7 - Giáo dục địa phương",
                "t5": "Tiết 1: 12A5 - Giáo dục thể chất, Tiết 2: 12A6 - Giáo dục thể chất, Tiết 3: 12A7 - Giáo dục thể chất, Tiết 4: 12A2 - Giáo dục thể chất",
                "t6": "Tiết 1: 12A5 - Giáo dục thể chất, Tiết 2: 12A1 - Giáo dục thể chất, Tiết 4: 10A2 - Giáo dục thể chất",
                "t7": "Tiết 2: 12A4 - Giáo dục thể chất, Tiết 3: 12A3 - Giáo dục thể chất, Tiết 4: 12A2 - Giáo dục thể chất"
        },
        "Nguyễn Đăng Chính": {
                "t2": "Tiết 1: SHDC",
                "t3": "",
                "t4": "",
                "t5": "Tiết 2: 11A3 - Hoạt động trải nghiệm, Tiết 4: 11A1 - Hoạt động trải nghiệm",
                "t6": "",
                "t7": ""
        },
        "Bùi Quốc Cường": {
                "t2": "Tiết 2: 12A6 - Công nghệ",
                "t3": "Tiết 1: 11A2 - Công nghệ, Tiết 2: 12A7 - Công nghệ",
                "t4": "",
                "t5": "Tiết 1: 11A1 - Công nghệ, Tiết 2: 12A7 - Công nghệ",
                "t6": "Tiết 1: 11A1 - Công nghệ, Tiết 2: 12A4 - Công nghệ, Tiết 3: 12A4 - Công nghệ, Tiết 4: 12A6 - Công nghệ, Tiết 5: 11A2 - Sinh hoạt",
                "t7": "Tiết 2: 12A7 - Công nghệ, Tiết 3: 11A2 - Công nghệ, Tiết 4: 12A4 - Công nghệ"
        },
        "Nguyễn Thế Dũng": {
                "t2": "Tiết 2: 11A4 - Ngoại ngữ, Tiết 3: 11A4 - Ngoại ngữ",
                "t3": "",
                "t4": "",
                "t5": "Tiết 3: 11A7 - Ngoại ngữ, Tiết 4: 11A7 - Ngoại ngữ, Tiết 5: 11A5 - Ngoại ngữ",
                "t6": "Tiết 1: 11A5 - Ngoại ngữ, Tiết 2: 11A2 - Ngoại ngữ, Tiết 3: 11A2 - Ngoại ngữ, Tiết 5: 11A5 - Sinh hoạt",
                "t7": "Tiết 1: 11A2 - Ngoại ngữ, Tiết 2: 11A5 - Ngoại ngữ, Tiết 3: 11A4 - Ngoại ngữ, Tiết 4: 11A7 - Ngoại ngữ"
        },
        "Trần Thế Dự": {
                "t2": "",
                "t3": "Tiết 1: 10A1 - Quốc phòng và an ninh, Tiết 2: 10A7 - Hoạt động trải nghiệm, Tiết 5: 12A1 - Quốc phòng và an ninh",
                "t4": "",
                "t5": "Tiết 1: 12A6 - Quốc phòng và an ninh, Tiết 2: 10A2 - Quốc phòng và an ninh, Tiết 4: 10A7 - Quốc phòng và an ninh, Tiết 5: 12A4 - Quốc phòng và an ninh",
                "t6": "Tiết 1: 12A2 - Quốc phòng và an ninh, Tiết 4: 10A4 - Quốc phòng và an ninh, Tiết 5: 10A7 - Sinh hoạt",
                "t7": "Tiết 1: 12A3 - Quốc phòng và an ninh, Tiết 3: 12A7 - Quốc phòng và an ninh, Tiết 4: 12A5 - Quốc phòng và an ninh"
        },
        "Lê Thị Điền": {
                "t2": "Tiết 2: 12A5 - Công nghệ, Tiết 3: 12A3 - Công nghệ",
                "t3": "Tiết 3: 10A5 - Công nghệ, Tiết 5: 10A4 - Công nghệ",
                "t4": "Tiết 2: 10A4 - Công nghệ, Tiết 3: 12A3 - Công nghệ, Tiết 4: 10A5 - Công nghệ, Tiết 5: 10A5 - Công nghệ",
                "t5": "Tiết 3: 12A5 - Công nghệ, Tiết 5: 12A3 - Công nghệ",
                "t6": "Tiết 3: 10A4 - Công nghệ, Tiết 5: 10A4 - Sinh hoạt",
                "t7": ""
        },
        "Bùi Thị Thu Giang": {
                "t2": "Tiết 2: 11A2 - Hoạt động trải nghiệm, Tiết 3: 10A4 - Giáo dục kinh tế và pháp luật, Tiết 4: 10A4 - Giáo dục kinh tế và pháp luật",
                "t3": "Tiết 2: 10A1 - Giáo dục kinh tế và pháp luật, Tiết 3: 10A2 - Giáo dục kinh tế và pháp luật, Tiết 5: 11A6 - Hoạt động trải nghiệm",
                "t4": "Tiết 2: 10A7 - Giáo dục kinh tế và pháp luật, Tiết 3: 11A6 - Chuyên đề 2, Tiết 4: 10A2 - Giáo dục kinh tế và pháp luật, Tiết 5: 10A1 - Giáo dục kinh tế và pháp luật",
                "t5": "Tiết 3: 10A7 - Giáo dục kinh tế và pháp luật, Tiết 4: 11A4 - Hoạt động trải nghiệm, Tiết 5: 10A5 - Giáo dục kinh tế và pháp luật",
                "t6": "",
                "t7": "Tiết 1: 11A7 - Hoạt động trải nghiệm, Tiết 2: 10A5 - Giáo dục kinh tế và pháp luật, Tiết 3: 10A7 - Giáo dục kinh tế và pháp luật, Tiết 4: 11A5 - Hoạt động trải nghiệm"
        },
        "Trần Thị Thu Hà": {
                "t2": "Tiết 2: 10A1 - Ngữ văn, Tiết 3: 12A5 - Ngữ văn, Tiết 4: 12A7 - Ngữ văn, T1 (Chiều): 12A7 - Ngữ văn, T2 (Chiều): 12A7 - Ngữ văn",
                "t3": "Tiết 1: 10A5 - Ngữ văn, Tiết 2: 10A5 - Ngữ văn, Tiết 4: 12A7 - Ngữ văn, Tiết 5: 12A7 - Ngữ văn",
                "t4": "T1 (Chiều): 12A5 - Ngữ văn, T2 (Chiều): 12A5 - Ngữ văn",
                "t5": "",
                "t6": "Tiết 1: 10A1 - Ngữ văn, Tiết 2: 10A1 - Ngữ văn, Tiết 3: 10A5 - Ngữ văn",
                "t7": "Tiết 1: 12A5 - Ngữ văn, Tiết 2: 12A5 - Ngữ văn, Tiết 4: 12A7 - Hoạt động trải nghiệm"
        },
        "Nguyễn Vân Hà": {
                "t2": "Tiết 2: 10A7 - Công nghệ, Tiết 4: 10A6 - Công nghệ, Tiết 5: 12A6 - Sinh học",
                "t3": "",
                "t4": "Tiết 1: 10A2 - Công nghệ, Tiết 4: 10A7 - Công nghệ, Tiết 5: 11A4 - Sinh học",
                "t5": "",
                "t6": "Tiết 1: 12A6 - Sinh học, Tiết 4: 11A4 - Sinh học, Tiết 5: 12A6 - Sinh hoạt",
                "t7": "Tiết 1: 10A2 - Công nghệ, Tiết 2: 10A6 - Công nghệ, Tiết 3: 10A6 - Công nghệ, Tiết 4: 10A7 - Công nghệ"
        },
        "Đoàn Thị Hiền": {
                "t2": "",
                "t3": "",
                "t4": "",
                "t5": "",
                "t6": "",
                "t7": ""
        },
        "Nguyễn Phúc Hiệp": {
                "t2": "Tiết 2: 12A7 - Ngoại ngữ, Tiết 3: 12A7 - Ngoại ngữ, Tiết 4: 11A3 - Ngoại ngữ",
                "t3": "Tiết 4: 10A5 - Ngoại ngữ, Tiết 5: 11A3 - Ngoại ngữ",
                "t4": "",
                "t5": "Tiết 1: 12A7 - Ngoại ngữ, Tiết 2: 10A5 - Ngoại ngữ, Tiết 3: 10A5 - Ngoại ngữ",
                "t6": "Tiết 1: 11A3 - Ngoại ngữ, Tiết 4: 10A5 - Hoạt động trải nghiệm, Tiết 5: 10A5 - Sinh hoạt, T1 (Chiều): 12A1 - Ngoại ngữ, T2 (Chiều): 12A1 - Ngoại ngữ",
                "t7": ""
        },
        "Nguyễn Hồng Hạnh": {
                "t2": "Tiết 3: 11A7 - Giáo dục kinh tế và pháp luật, Tiết 5: 12A4 - Giáo dục kinh tế và pháp luật",
                "t3": "T1 (Chiều): 12A3 - Giáo dục kinh tế và pháp luật, T2 (Chiều): 12A3 - Giáo dục kinh tế và pháp luật",
                "t4": "Tiết 1: 12A4 - Giáo dục kinh tế và pháp luật, Tiết 3: 11A7 - Giáo dục kinh tế và pháp luật, Tiết 4: 11A7 - Giáo dục kinh tế và pháp luật, Tiết 5: 12A3 - Giáo dục kinh tế và pháp luật",
                "t5": "T1 (Chiều): 12A4 - Giáo dục kinh tế và pháp luật, T2 (Chiều): 12A4 - Giáo dục kinh tế và pháp luật",
                "t6": "Tiết 2: 11A6 - Giáo dục kinh tế và pháp luật, Tiết 4: 12A3 - Giáo dục kinh tế và pháp luật, Tiết 5: 12A3 - Sinh hoạt",
                "t7": "Tiết 1: 11A6 - Giáo dục kinh tế và pháp luật, Tiết 2: 12A3 - Hoạt động trải nghiệm"
        },
        "Nguyễn Thị Bích Hằng": {
                "t2": "",
                "t3": "Tiết 2: 11A4 - Địa lý, Tiết 3: 11A5 - Địa lý, Tiết 4: 10A1 - Địa lý, T1 (Chiều): 12A4 - Địa lý, T2 (Chiều): 12A4 - Địa lý",
                "t4": "Tiết 1: 11A5 - Địa lý, Tiết 2: 10A1 - Địa lý, Tiết 4: 12A3 - Địa lý, Tiết 5: 12A4 - Địa lý",
                "t5": "Tiết 1: 10A5 - Địa lý, Tiết 2: 12A3 - Địa lý, Tiết 4: 12A4 - Địa lý",
                "t6": "Tiết 1: 11A7 - Địa lý, Tiết 2: 10A5 - Địa lý, Tiết 3: 10A1 - Địa lý",
                "t7": "Tiết 2: 11A4 - Địa lý, Tiết 3: 11A7 - Địa lý, Tiết 4: 10A5 - Địa lý"
        },
        "Phạm Thị Bích Hồng": {
                "t2": "Tiết 3: 10A5 - Toán, Tiết 4: 10A5 - Toán",
                "t3": "Tiết 4: 12A6 - Toán, Tiết 5: 10A5 - Toán",
                "t4": "Tiết 1: 12A6 - Toán, Tiết 2: 12A6 - Toán",
                "t5": "Tiết 1: 10A1 - Toán, Tiết 2: 10A1 - Toán, Tiết 5: 10A4 - Chuyên đề 1, T1 (Chiều): 12A6 - Toán, T2 (Chiều): 12A6 - Toán",
                "t6": "",
                "t7": "Tiết 1: 12A6 - Toán, Tiết 3: 10A5 - Toán, Tiết 4: 10A1 - Toán"
        },
        "Vũ Thị Lan": {
                "t2": "Tiết 3: 12A1 - Ngữ văn, Tiết 4: 12A1 - Ngữ văn, T1 (Chiều): 12A1 - Ngữ văn, T2 (Chiều): 12A1 - Ngữ văn",
                "t3": "",
                "t4": "Tiết 1: 12A1 - Ngữ văn, Tiết 3: 12A4 - Ngữ văn, Tiết 4: 12A4 - Ngữ văn, T1 (Chiều): 12A4 - Ngữ văn, T2 (Chiều): 12A4 - Ngữ văn",
                "t5": "",
                "t6": "Tiết 4: 11A6 - Ngữ văn, Tiết 5: 12A4 - Sinh hoạt",
                "t7": "Tiết 1: 12A4 - Ngữ văn, Tiết 3: 11A6 - Ngữ văn, Tiết 4: 11A6 - Ngữ văn"
        },
        "Bùi Thị Linh": {
                "t2": "Tiết 2: 12A1 - Hoạt động trải nghiệm, Tiết 4: 12A2 - Hóa học, Tiết 5: 12A2 - Hóa học",
                "t3": "Tiết 4: 12A1 - Hóa học, Tiết 5: 12A2 - Hóa học",
                "t4": "",
                "t5": "Tiết 3: 12A1 - Hóa học, Tiết 5: 11A3 - Hóa học, T1 (Chiều): 12A1 - Hóa học, T2 (Chiều): 12A1 - Hóa học",
                "t6": "Tiết 4: 11A3 - Hóa học, Tiết 5: 12A1 - Sinh hoạt",
                "t7": "Tiết 2: 11A3 - Hóa học, Tiết 3: 12A1 - Hóa học"
        },
        "Bùi Thanh Loan": {
                "t2": "",
                "t3": "Tiết 1: 10A7 - Địa lý, Tiết 2: 12A5 - Địa lý, Tiết 3: 11A2 - Địa lý, Tiết 4: 10A6 - Địa lý, Tiết 5: 10A3 - Địa lý",
                "t4": "Tiết 1: 11A2 - Địa lý, Tiết 2: 11A2 - Địa lý, Tiết 3: 10A4 - Địa lý, Tiết 4: 10A4 - Địa lý, Tiết 5: 10A7 - Địa lý",
                "t5": "Tiết 1: 10A4 - Địa lý, Tiết 2: 12A5 - Địa lý, Tiết 4: 10A3 - Địa lý, Tiết 5: 12A5 - Hoạt động trải nghiệm, T1 (Chiều): 12A5 - Địa lý, T2 (Chiều): 12A5 - Địa lý",
                "t6": "",
                "t7": "Tiết 1: 10A6 - Địa lý, Tiết 3: 12A5 - Địa lý"
        },
        "Nguyễn Văn Long": {
                "t2": "Tiết 1: SHDC",
                "t3": "Tiết 5: 10A1 - Hoạt động trải nghiệm",
                "t4": "Tiết 1: 10A4 - Hoạt động trải nghiệm",
                "t5": "",
                "t6": "",
                "t7": ""
        },
        "Nguyễn Bá Lĩnh": {
                "t2": "",
                "t3": "Tiết 1: 11A1 - Quốc phòng và an ninh, Tiết 4: 11A5 - Quốc phòng và an ninh, Tiết 5: 11A2 - Quốc phòng và an ninh",
                "t4": "Tiết 1: 10A5 - Quốc phòng và an ninh, Tiết 3: 10A2 - Hoạt động trải nghiệm, Tiết 4: 11A6 - Quốc phòng và an ninh, Tiết 5: 10A6 - Quốc phòng và an ninh",
                "t5": "",
                "t6": "Tiết 3: 11A3 - Quốc phòng và an ninh, Tiết 4: 11A7 - Quốc phòng và an ninh, Tiết 5: 10A6 - Sinh hoạt",
                "t7": "Tiết 1: 11A4 - Quốc phòng và an ninh, Tiết 3: 10A3 - Quốc phòng và an ninh, Tiết 4: 10A6 - Hoạt động trải nghiệm"
        },
        "Nguyễn Thị Quỳnh Mai": {
                "t2": "",
                "t3": "Tiết 3: 10A7 - Lịch sử, Tiết 5: 12A6 - Lịch sử, T1 (Chiều): 12A6 - Lịch sử, T2 (Chiều): 12A6 - Lịch sử",
                "t4": "",
                "t5": "Tiết 4: 10A5 - Lịch sử, Tiết 5: 12A7 - Lịch sử, T1 (Chiều): 12A7 - Lịch sử, T2 (Chiều): 12A7 - Lịch sử",
                "t6": "Tiết 2: 12A6 - Lịch sử, Tiết 4: 11A1 - Lịch sử, Tiết 5: 12A7 - Sinh hoạt",
                "t7": "Tiết 1: 12A7 - Lịch sử, Tiết 2: 11A1 - Lịch sử, Tiết 4: 11A4 - Lịch sử"
        },
        "Nguyễn Thị Kim Ngân": {
                "t2": "Tiết 2: 10A4 - Ngữ văn, Tiết 3: 11A5 - Ngữ văn, Tiết 4: 11A5 - Ngữ văn",
                "t3": "",
                "t4": "Tiết 1: 11A1 - Ngữ văn, Tiết 2: 11A1 - Ngữ văn, Tiết 5: 11A2 - Chuyên đề 1",
                "t5": "",
                "t6": "Tiết 3: 11A1 - Ngữ văn, Tiết 4: 11A5 - Ngữ văn, Tiết 5: 11A1 - Sinh hoạt",
                "t7": "Tiết 1: 10A4 - Ngữ văn, Tiết 2: 10A4 - Ngữ văn, Tiết 4: 11A1 - Ngữ văn"
        },
        "Nguyễn Thị Nhung": {
                "t2": "",
                "t3": "Tiết 1: 12A5 - Giáo dục kinh tế và pháp luật, Tiết 3: 12A6 - Giáo dục kinh tế và pháp luật, Tiết 4: 11A2 - Giáo dục kinh tế và pháp luật, Tiết 5: 10A6 - Giáo dục kinh tế và pháp luật",
                "t4": "Tiết 1: 12A7 - Giáo dục kinh tế và pháp luật, Tiết 2: 12A5 - Giáo dục kinh tế và pháp luật, Tiết 4: 12A6 - Giáo dục kinh tế và pháp luật, Tiết 5: 11A1 - Giáo dục kinh tế và pháp luật",
                "t5": "Tiết 1: 10A6 - Giáo dục kinh tế và pháp luật, Tiết 2: 11A1 - Giáo dục kinh tế và pháp luật, Tiết 4: 12A5 - Giáo dục kinh tế và pháp luật, Tiết 5: 11A2 - Giáo dục kinh tế và pháp luật",
                "t6": "Tiết 1: 10A6 - Giáo dục kinh tế và pháp luật, Tiết 2: 12A7 - Giáo dục kinh tế và pháp luật, Tiết 3: 12A6 - Giáo dục kinh tế và pháp luật, T1 (Chiều): 12A5 - Giáo dục kinh tế và pháp luật, T2 (Chiều): 12A5 - Giáo dục kinh tế và pháp luật",
                "t7": ""
        },
        "Đinh Thị Thanh Nhàn": {
                "t2": "Tiết 2: 11A7 - Toán, Tiết 3: 11A6 - Toán, Tiết 4: 11A6 - Toán, T1 (Chiều): 12A5 - Toán, T2 (Chiều): 12A5 - Toán",
                "t3": "",
                "t4": "Tiết 1: 11A7 - Toán, Tiết 2: 11A7 - Toán, Tiết 3: 12A5 - Toán, Tiết 4: 12A5 - Toán",
                "t5": "Tiết 1: 11A7 - Toán, Tiết 2: 11A2 - Toán, Tiết 3: 11A2 - Toán, Tiết 5: 11A6 - Toán",
                "t6": "Tiết 1: 11A6 - Toán, Tiết 2: 12A5 - Toán, Tiết 3: 12A5 - Toán, Tiết 4: 11A2 - Toán",
                "t7": ""
        },
        "Nguyễn Hồng Nhẫn": {
                "t2": "Tiết 2: 10A3 - Ngữ văn, Tiết 4: 12A3 - Ngữ văn, Tiết 5: 12A3 - Ngữ văn",
                "t3": "Tiết 1: 10A6 - Ngữ văn, Tiết 2: 10A6 - Ngữ văn, Tiết 3: 10A1 - Chuyên đề 1, Tiết 4: 10A7 - Ngữ văn, Tiết 5: 12A3 - Ngữ văn",
                "t4": "Tiết 1: 10A6 - Ngữ văn, Tiết 2: 10A6 - Ngữ văn, Tiết 3: 10A7 - Ngữ văn, T1 (Chiều): 12A3 - Ngữ văn, T2 (Chiều): 12A3 - Ngữ văn",
                "t5": "",
                "t6": "Tiết 1: 10A3 - Ngữ văn, Tiết 2: 10A3 - Ngữ văn, Tiết 3: 10A7 - Ngữ văn, Tiết 4: 10A7 - Ngữ văn",
                "t7": ""
        },
        "Huỳnh Tiến Quyết": {
                "t2": "Tiết 2: 12A4 - Toán, Tiết 3: 12A4 - Hoạt động trải nghiệm, T1 (Chiều): 12A4 - Toán, T2 (Chiều): 12A4 - Toán",
                "t3": "Tiết 1: 10A2 - Toán, Tiết 2: 10A2 - Toán, Tiết 4: 11A4 - Chuyên đề 1",
                "t4": "",
                "t5": "Tiết 1: 12A4 - Toán, Tiết 2: 12A4 - Toán",
                "t6": "",
                "t7": "Tiết 2: 10A2 - Toán, Tiết 3: 12A4 - Toán"
        },
        "Nguyễn Thị Quỳnh": {
                "t2": "",
                "t3": "Tiết 1: 11A4 - Tin học, Tiết 4: 10A4 - Tin học, Tiết 5: 11A5 - Tin học",
                "t4": "Tiết 2: 10A5 - Tin học, Tiết 3: 11A4 - Tin học, Tiết 4: 10A6 - Tin học, Tiết 5: 11A5 - Tin học",
                "t5": "Tiết 4: 10A4 - Tin học, Tiết 5: 10A6 - Tin học",
                "t6": "Tiết 1: 10A5 - Tin học, Tiết 2: 11A5 - Tin học, Tiết 3: 11A4 - Tin học, Tiết 5: 11A4 - Sinh hoạt",
                "t7": ""
        },
        "Bùi Thị Thi": {
                "t2": "Tiết 2: 10A2 - Hóa học, Tiết 3: 10A1 - Giáo dục địa phương, Tiết 4: 11A4 - Hóa học",
                "t3": "Tiết 2: 11A2 - Hóa học, Tiết 3: 10A3 - Hóa học, Tiết 4: 10A2 - Hóa học, Tiết 5: 11A4 - Hóa học",
                "t4": "Tiết 2: 11A5 - Hóa học, Tiết 3: 11A1 - Hóa học, Tiết 4: 11A4 - Hóa học, Tiết 5: 10A2 - Giáo dục địa phương",
                "t5": "Tiết 2: 10A3 - Hóa học, Tiết 4: 11A5 - Hóa học, Tiết 5: 11A1 - Hóa học",
                "t6": "",
                "t7": "Tiết 2: 11A2 - Hóa học, Tiết 3: 11A5 - Hóa học, Tiết 4: 10A3 - Hóa học"
        },
        "Nguyễn Đức Thiện": {
                "t2": "Tiết 1: SHDC",
                "t3": "",
                "t4": "",
                "t5": "",
                "t6": "",
                "t7": ""
        },
        "Bùi Tuấn Thành": {
                "t2": "",
                "t3": "Tiết 1: 10A3 - Giáo dục thể chất, Tiết 2: 11A1 - Giáo dục thể chất, Tiết 3: 10A6 - Giáo dục thể chất",
                "t4": "Tiết 1: 10A1 - Giáo dục thể chất, Tiết 2: 10A3 - Giáo dục thể chất, Tiết 3: 10A5 - Giáo dục thể chất, Tiết 4: 11A1 - Giáo dục thể chất",
                "t5": "Tiết 1: 10A7 - Giáo dục thể chất, Tiết 2: 11A5 - Giáo dục địa phương, Tiết 3: 10A4 - Giáo dục thể chất, Tiết 4: 11A6 - Giáo dục địa phương, Tiết 5: 11A4 - Giáo dục địa phương",
                "t6": "Tiết 1: 10A7 - Giáo dục thể chất, Tiết 2: 10A6 - Giáo dục thể chất",
                "t7": "Tiết 1: 10A5 - Giáo dục thể chất, Tiết 3: 10A1 - Giáo dục thể chất, Tiết 4: 10A4 - Giáo dục thể chất"
        },
        "Hà Thị Hồng Thúy": {
                "t2": "Tiết 2: 10A6 - Ngoại ngữ, Tiết 3: 10A6 - Ngoại ngữ",
                "t3": "Tiết 1: 12A3 - Ngoại ngữ, Tiết 2: 12A3 - Ngoại ngữ, Tiết 3: 12A2 - Ngoại ngữ",
                "t4": "",
                "t5": "",
                "t6": "Tiết 1: 10A4 - Ngoại ngữ, Tiết 2: 10A4 - Ngoại ngữ, Tiết 4: 10A6 - Ngoại ngữ, Tiết 5: 12A2 - Sinh hoạt",
                "t7": "Tiết 1: 12A2 - Ngoại ngữ, Tiết 2: 12A2 - Ngoại ngữ, Tiết 3: 10A4 - Ngoại ngữ, Tiết 4: 12A3 - Ngoại ngữ"
        },
        "Bùi Minh Thạch": {
                "t2": "",
                "t3": "Tiết 1: 12A6 - Địa lý, Tiết 3: 11A1 - Địa lý, Tiết 4: 11A6 - Địa lý, T1 (Chiều): 12A7 - Địa lý, T2 (Chiều): 12A7 - Địa lý",
                "t4": "Tiết 1: 11A6 - Địa lý, Tiết 4: 12A7 - Địa lý, Tiết 5: 12A6 - Địa lý, T1 (Chiều): 12A6 - Địa lý, T2 (Chiều): 12A6 - Địa lý",
                "t5": "",
                "t6": "Tiết 1: 12A7 - Địa lý, Tiết 2: 11A1 - Địa lý",
                "t7": "Tiết 1: 11A1 - Địa lý, Tiết 2: 12A6 - Địa lý"
        },
        "Trương Thị Thảo": {
                "t2": "Tiết 2: 11A6 - Lịch sử, Tiết 4: 12A4 - Lịch sử",
                "t3": "Tiết 1: 11A3 - Lịch sử, Tiết 3: 12A4 - Giáo dục địa phương, T1 (Chiều): 12A5 - Lịch sử, T2 (Chiều): 12A5 - Lịch sử",
                "t4": "Tiết 1: 12A5 - Lịch sử, Tiết 2: 12A3 - Lịch sử, Tiết 3: 11A2 - Lịch sử, Tiết 5: 12A5 - Giáo dục địa phương",
                "t5": "Tiết 1: 11A2 - Lịch sử, Tiết 2: 11A7 - Lịch sử, Tiết 3: 12A3 - Lịch sử, T1 (Chiều): 12A3 - Lịch sử, T2 (Chiều): 12A3 - Lịch sử",
                "t6": "Tiết 1: 12A4 - Lịch sử, Tiết 3: 11A5 - Lịch sử, Tiết 4: 12A5 - Lịch sử",
                "t7": ""
        },
        "Nguyễn Văn Thắng": {
                "t2": "Tiết 2: 11A3 - Vật lí, Tiết 3: 12A2 - Vật lí, Tiết 5: 12A1 - Vật lí",
                "t3": "Tiết 1: 12A2 - Vật lí, Tiết 3: 11A7 - Vật lí, Tiết 4: 12A3 - Vật lí, T1 (Chiều): 12A1 - Vật lí, T2 (Chiều): 12A1 - Vật lí",
                "t4": "Tiết 1: 12A2 - Vật lí, Tiết 2: 11A6 - Vật lí, Tiết 5: 11A3 - Vật lí",
                "t5": "Tiết 1: 12A1 - Vật lí, Tiết 3: 11A6 - Vật lí, Tiết 4: 12A3 - Vật lí",
                "t6": "Tiết 1: 12A1 - Vật lí, Tiết 2: 11A7 - Vật lí, Tiết 3: 12A3 - Vật lí",
                "t7": ""
        },
        "Nguyễn Thanh Thủy": {
                "t2": "Tiết 3: 11A3 - Sinh học, Tiết 4: 10A1 - Sinh học, Tiết 5: 12A5 - Sinh học",
                "t3": "Tiết 2: 11A3 - Sinh học, Tiết 3: 12A5 - Sinh học, Tiết 5: 10A2 - Sinh học",
                "t4": "Tiết 2: 12A1 - Sinh học, Tiết 4: 11A5 - Sinh học, Tiết 5: 12A2 - Sinh học",
                "t5": "Tiết 1: 10A2 - Sinh học, Tiết 3: 11A5 - Sinh học, Tiết 4: 12A1 - Sinh học, Tiết 5: 10A1 - Sinh học",
                "t6": "Tiết 1: 10A2 - Sinh học, Tiết 2: 12A2 - Sinh học",
                "t7": ""
        },
        "Vũ Thị Thu Trà": {
                "t2": "Tiết 2: 12A3 - Toán, Tiết 3: 10A7 - Toán, Tiết 4: 10A7 - Toán, T1 (Chiều): 12A3 - Toán, T2 (Chiều): 12A3 - Toán",
                "t3": "Tiết 1: 10A4 - Toán, Tiết 2: 10A4 - Toán, Tiết 3: 12A3 - Giáo dục địa phương",
                "t4": "",
                "t5": "Tiết 1: 12A3 - Toán, Tiết 2: 10A4 - Toán, Tiết 3: 10A6 - Toán, Tiết 4: 10A6 - Toán, Tiết 5: 10A7 - Toán",
                "t6": "Tiết 1: 12A3 - Toán, Tiết 2: 12A3 - Toán, Tiết 3: 10A6 - Toán",
                "t7": ""
        },
        "Phạm Thị Minh Trang": {
                "t2": "Tiết 2: 11A1 - Toán, Tiết 3: 11A1 - Toán",
                "t3": "Tiết 1: 11A5 - Toán, Tiết 2: 11A5 - Toán, Tiết 3: 12A1 - Toán",
                "t4": "Tiết 1: 11A4 - Toán, Tiết 3: 11A5 - Toán, T1 (Chiều): 12A1 - Toán, T2 (Chiều): 12A1 - Toán",
                "t5": "Tiết 1: 11A5 - Toán, Tiết 2: 12A1 - Toán, Tiết 3: 11A1 - Toán",
                "t6": "Tiết 1: 11A4 - Toán, Tiết 2: 11A4 - Toán, Tiết 3: 12A1 - Toán, Tiết 4: 12A1 - Toán",
                "t7": ""
        },
        "Vũ Thùy Trang": {
                "t2": "",
                "t3": "Tiết 3: 12A7 - Vật lí, Tiết 4: 10A3 - Vật lí, Tiết 5: 12A4 - Vật lí",
                "t4": "Tiết 2: 12A4 - Vật lí, Tiết 3: 10A3 - Vật lí, Tiết 4: 10A1 - Vật lí, Tiết 5: 12A7 - Vật lí",
                "t5": "Tiết 3: 10A1 - Vật lí, Tiết 4: 12A7 - Vật lí, Tiết 5: 10A3 - Vật lí",
                "t6": "Tiết 4: 12A4 - Vật lí, Tiết 5: 10A1 - Sinh hoạt, T1 (Chiều): 12A2 - Vật lí, T2 (Chiều): 12A2 - Vật lí",
                "t7": ""
        },
        "Bùi Xuân Tráng": {
                "t2": "",
                "t3": "Tiết 3: 11A3 - Toán, Tiết 4: 11A3 - Toán",
                "t4": "Tiết 2: 12A7 - Toán, Tiết 3: 12A7 - Toán, Tiết 4: 11A3 - Toán, T1 (Chiều): 12A7 - Toán, T2 (Chiều): 12A7 - Toán",
                "t5": "",
                "t6": "Tiết 2: 11A3 - Toán, Tiết 3: 12A7 - Toán, Tiết 4: 12A7 - Toán, Tiết 5: 11A3 - Sinh hoạt",
                "t7": ""
        },
        "Lê Tuấn Trường": {
                "t2": "Tiết 3: 10A2 - Ngoại ngữ, Tiết 4: 10A2 - Ngoại ngữ",
                "t3": "Tiết 1: 11A6 - Ngoại ngữ, Tiết 2: 11A6 - Ngoại ngữ, Tiết 4: 11A1 - Ngoại ngữ, Tiết 5: 11A1 - Ngoại ngữ",
                "t4": "",
                "t5": "",
                "t6": "Tiết 3: 11A6 - Ngoại ngữ, Tiết 4: 10A1 - Ngoại ngữ, Tiết 5: 11A6 - Sinh hoạt",
                "t7": "Tiết 1: 10A1 - Ngoại ngữ, Tiết 2: 10A1 - Ngoại ngữ, Tiết 3: 11A1 - Ngoại ngữ, Tiết 4: 10A2 - Ngoại ngữ"
        },
        "Lê Thị Thanh Tâm": {
                "t2": "Tiết 2: 12A2 - Toán, Tiết 3: 10A3 - Toán, Tiết 4: 10A3 - Toán, T1 (Chiều): 12A2 - Toán, T2 (Chiều): 12A2 - Toán",
                "t3": "",
                "t4": "Tiết 1: 10A3 - Toán, Tiết 2: 12A2 - Toán, Tiết 3: 12A2 - Hoạt động trải nghiệm",
                "t5": "",
                "t6": "Tiết 3: 12A2 - Toán, Tiết 4: 12A2 - Toán, Tiết 5: 10A3 - Sinh hoạt",
                "t7": "Tiết 1: 10A3 - Hoạt động trải nghiệm, Tiết 2: 10A3 - Toán"
        },
        "Lại Văn Tựa": {
                "t2": "Tiết 2: 10A5 - Giáo dục địa phương, Tiết 4: 11A1 - Giáo dục địa phương",
                "t3": "Tiết 1: 12A4 - Ngoại ngữ, Tiết 2: 12A4 - Ngoại ngữ",
                "t4": "Tiết 1: 10A7 - Ngoại ngữ, Tiết 3: 10A6 - Giáo dục địa phương, Tiết 4: 10A3 - Giáo dục địa phương, Tiết 5: 10A4 - Giáo dục địa phương",
                "t5": "Tiết 1: 11A3 - Giáo dục địa phương, Tiết 2: 10A7 - Giáo dục địa phương, Tiết 3: 12A4 - Ngoại ngữ, Tiết 4: 11A2 - Giáo dục địa phương, Tiết 5: 12A6 - Ngoại ngữ",
                "t6": "",
                "t7": "Tiết 1: 10A7 - Ngoại ngữ, Tiết 2: 10A7 - Ngoại ngữ, Tiết 3: 12A6 - Ngoại ngữ, Tiết 4: 12A6 - Ngoại ngữ"
        },
        "Lê Thị Vinh": {
                "t2": "Tiết 4: 12A5 - Ngoại ngữ, Tiết 5: 12A7 - Giáo dục địa phương",
                "t3": "Tiết 1: 12A1 - Ngoại ngữ, Tiết 2: 12A1 - Ngoại ngữ, Tiết 4: 12A5 - Ngoại ngữ, Tiết 5: 12A5 - Ngoại ngữ",
                "t4": "",
                "t5": "Tiết 3: 10A3 - Ngoại ngữ, Tiết 4: 12A6 - Giáo dục địa phương, Tiết 5: 12A1 - Ngoại ngữ",
                "t6": "Tiết 3: 10A3 - Ngoại ngữ, Tiết 4: 10A3 - Ngoại ngữ, Tiết 5: 12A5 - Sinh hoạt",
                "t7": ""
        },
        "Đặng Văn Việt": {
                "t2": "",
                "t3": "Tiết 2: 12A2 - Tin học, Tiết 4: 11A7 - Tin học, Tiết 5: 11A7 - Tin học, T1 (Chiều): 12A2 - Tin học, T2 (Chiều): 12A2 - Tin học",
                "t4": "Tiết 3: 12A1 - Tin học, Tiết 5: 11A6 - Tin học",
                "t5": "Tiết 2: 11A6 - Tin học, Tiết 3: 11A3 - Tin học, Tiết 5: 12A2 - Tin học",
                "t6": "",
                "t7": "Tiết 1: 12A1 - Tin học, Tiết 2: 11A7 - Tin học, Tiết 3: 11A3 - Tin học, Tiết 4: 11A3 - Tin học"
        },
        "Phạm Thị Vân": {
                "t2": "Tiết 3: 12A6 - Ngữ văn, Tiết 4: 12A6 - Ngữ văn, T1 (Chiều): 12A6 - Ngữ văn, T2 (Chiều): 12A6 - Ngữ văn",
                "t3": "",
                "t4": "Tiết 1: 11A3 - Ngữ văn, Tiết 2: 11A3 - Ngữ văn, Tiết 3: 12A6 - Ngữ văn, T1 (Chiều): 12A2 - Ngữ văn, T2 (Chiều): 12A2 - Ngữ văn",
                "t5": "Tiết 1: 12A2 - Ngữ văn, Tiết 2: 12A2 - Ngữ văn, Tiết 3: 12A6 - Hoạt động trải nghiệm",
                "t6": "",
                "t7": "Tiết 1: 11A3 - Ngữ văn, Tiết 3: 12A2 - Ngữ văn"
        }
}
};

let storedMain = JSON.parse(localStorage.getItem('school_tkb_main'));
if (storedMain) {
    let changed = false;
    ['11B1', '11B2', '12C1', '12C2'].forEach(c => {
        if (storedMain[c]) { delete storedMain[c]; changed = true; }
    });
    if (changed) localStorage.setItem('school_tkb_main', JSON.stringify(storedMain));
}

let storedPrep = JSON.parse(localStorage.getItem('school_tkb_prep'));
if (storedPrep) {
    let changed = false;
    // TKB CHIỀU CHỈ DÀNH CHO LỚP 12: Xóa bỏ tất cả lớp không thuộc khối 12
    for (let c in storedPrep) {
        if (!c.startsWith('12')) {
            delete storedPrep[c];
            changed = true;
        }
    }
    // Tự động lùi 1 tiết cho các tiết buổi chiều (Tiết 2, Tiết 3 -> Tiết 1, Tiết 2)
    for (let c in storedPrep) {
        for (let d of ['t2', 't3', 't4', 't5', 't6', 't7']) {
            if (storedPrep[c][d]) {
                let oldVal = storedPrep[c][d];
                let newVal = oldVal.replace(/Tiết (\d+):/g, (match, p1) => {
                    let num = parseInt(p1);
                    return `Tiết ${num > 1 ? num - 1 : num}:`;
                });
                if (newVal !== oldVal) {
                    storedPrep[c][d] = newVal;
                    changed = true;
                }
            }
        }
    }
    if (changed) localStorage.setItem('school_tkb_prep', JSON.stringify(storedPrep));
}

let storedTeacher = JSON.parse(localStorage.getItem('school_tkb_teacher')) || {};

// TỰ ĐỘNG LÀM SẠCH GIÁO VIÊN:
// 1. Xóa bỏ tên GV có chứa (môn học) giả lập cũ
// 2. Tự động lùi 1 tiết cho các tiết chiều của GV (T2 (Chiều) -> T1 (Chiều))
let cleanedTeacher = {};
let hasModifiedTeacher = false;
for (let t in storedTeacher) {
    if (t.includes('(') || t.includes(')')) {
        hasModifiedTeacher = true;
    } else {
        cleanedTeacher[t] = storedTeacher[t];
    }
}
for (let t in cleanedTeacher) {
    for (let d of ['t2', 't3', 't4', 't5', 't6', 't7']) {
        if (cleanedTeacher[t][d]) {
            let oldVal = cleanedTeacher[t][d];
            let newVal = oldVal.replace(/T(\d+) \(Chiều\):/g, (match, p1) => {
                let num = parseInt(p1);
                return `T${num > 1 ? num - 1 : num} (Chiều):`;
            });
            if (newVal !== oldVal) {
                cleanedTeacher[t][d] = newVal;
                hasModifiedTeacher = true;
            }
        }
    }
}
if (hasModifiedTeacher) {
    localStorage.setItem('school_tkb_teacher', JSON.stringify(cleanedTeacher));
}

let timetables = {
    main: Object.assign({}, DEFAULT_TIMETABLES.main, storedMain || {}),
    prep: Object.assign({}, DEFAULT_TIMETABLES.prep, storedPrep || {}),
    teacher: Object.assign({}, DEFAULT_TIMETABLES.teacher, cleanedTeacher)
};

let oldTkb = localStorage.getItem('school_timetables');
if(oldTkb && Object.keys(timetables.main).length === 0) {
    timetables.main = JSON.parse(oldTkb);
    localStorage.setItem('school_tkb_main', JSON.stringify(timetables.main));
    localStorage.removeItem('school_timetables');
}

let currentTkbTab = 'main';

classes.forEach(c => { if(!students[c]) students[c] = []; });

document.addEventListener('DOMContentLoaded', () => {
    const originalLength = classes.length;
    classes = classes.filter(c => !c.includes('/'));
    if (classes.length !== originalLength) {
        localStorage.setItem('thiduaso_classes', JSON.stringify(classes));
    }

    initApp();

    const teacherSearch = document.getElementById('tkb-teacher-search');
    if(teacherSearch) {
        teacherSearch.addEventListener('input', function(e) {
            handleTeacherSearch(e.target.value);
        });
    }

    const editClassEl = document.getElementById('edit-tkb-class');
    const editTeacherEl = document.getElementById('edit-tkb-teacher-input');
    if(editClassEl) editClassEl.addEventListener('change', loadEditTkbData);
    if(editTeacherEl) editTeacherEl.addEventListener('blur', loadEditTkbData);

    const editForm = document.getElementById('edit-tkb-form');
    if(editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!checkPermission('admin')) return;
            const type = document.getElementById('edit-tkb-type').value;
            let target = (type === 'main' || type === 'prep') ? document.getElementById('edit-tkb-class').value : document.getElementById('edit-tkb-teacher-input').value.trim();
            if(!target) return alert("Vui lòng nhập/chọn đối tượng áp dụng!");

            timetables[type][target] = {
                't2': document.getElementById('tkb-t2').value, 't3': document.getElementById('tkb-t3').value,
                't4': document.getElementById('tkb-t4').value, 't5': document.getElementById('tkb-t5').value,
                't6': document.getElementById('tkb-t6').value, 't7': document.getElementById('tkb-t7').value,
            };
            localStorage.setItem(`school_tkb_${type}`, JSON.stringify(timetables[type]));
            document.getElementById('tkb-edit-section').classList.add('hidden');
            setTkbTab(currentTkbTab);
            if(currentTkbTab === type) { document.getElementById('tkb-target-select').value = target; renderTimetable(); }
            alert("Đã lưu Thời khóa biểu thành công!");
        });
    }

    // Ghi chú: Xử lý submit câu hỏi ẩn danh được thực hiện tại handleQaSubmit(event) bên dưới.

    const addClassForm = document.getElementById('add-class-form');
    if(addClassForm) {
        addClassForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const newClass = document.getElementById('new-class-input').value.trim().toUpperCase();
            if(newClass && !classes.includes(newClass)) { 
                classes.push(newClass); classes.sort(); localStorage.setItem('thiduaso_classes', JSON.stringify(classes)); 
                students[newClass] = []; localStorage.setItem('thiduaso_students', JSON.stringify(students)); 
                document.getElementById('new-class-input').value = ''; initApp(); 
            }
        });
    }

    const addStudentForm = document.getElementById('add-student-form');
    if(addStudentForm) {
        addStudentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const className = document.getElementById('manage-class-select').value;
            const rawText = document.getElementById('new-student-input').value;
            if(!className) return;
            const lines = rawText.split('\n'); let count = 0;
            lines.forEach(line => {
                if(!line.trim()) return;
                let parts = line.split('-'); let rawName = parts[0]; let rawDob = parts[1] ? parts[1].trim() : "";
                const formattedName = rawName.trim().split(/\s+/).map(word => { if(!word) return ""; return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); }).join(" ");
                let formattedDob = "";
                if(rawDob) {
                    let dateParts = rawDob.split('/');
                    if(dateParts.length === 3) { let d = dateParts[0].length === 1 ? "0" + dateParts[0] : dateParts[0]; let m = dateParts[1].length === 1 ? "0" + dateParts[1] : dateParts[1]; let y = dateParts[2]; formattedDob = ` (${d}/${m}/${y})`;
                    } else formattedDob = ` (${rawDob})`;
                }
                const finalStudentString = formattedName + formattedDob;
                if(formattedName && !students[className].includes(finalStudentString)) { students[className].push(finalStudentString); count++; }
            });
            localStorage.setItem('thiduaso_students', JSON.stringify(students));
            document.getElementById('new-student-input').value = ''; renderStudents(); updateStudentSelect();
            alert(`Đã chuẩn hóa và nạp ${count} học sinh!`);
        });
    }
});

// ==============================================================================
// CÁC HÀM TIỆN ÍCH, QUẢN LÝ CÁ NHÂN, HỎI ĐÁP, HỌC SINH VÀ CÀI ĐẶT
// ==============================================================================

// 1. Chuẩn hóa & loại bỏ dấu tiếng Việt (Hỗ trợ cả đ/Đ)
function removeVietnameseTones(str) {
    if (!str) return '';
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/[\u0300-\u036f]/g, "");
    return str.trim();
}

// 2. Tìm kiếm nhanh giáo viên theo tên hoặc môn học
function handleTeacherSearch(keyword) {
    if (currentTkbTab !== 'teacher') return;
    const cleanKeyword = removeVietnameseTones(keyword || '');
    const rawKeyword = (keyword || '').toLowerCase().trim();
    const select = document.getElementById('tkb-target-select');
    const display = document.getElementById('tkb-display');
    const teacherList = Object.keys(timetables.teacher).sort();
    
    if (!select) return;

    if (!cleanKeyword) {
        select.innerHTML = '';
        teacherList.forEach(t => {
            select.innerHTML += `<option value="${t}">Thầy/Cô ${t}</option>`;
        });
        if (teacherList.length > 0) {
            select.value = teacherList[0];
            renderTimetable();
        }
        return;
    }

    const matched = teacherList.filter(t => {
        const normName = removeVietnameseTones(t);
        const lowerName = t.toLowerCase();
        if (normName.includes(cleanKeyword) || lowerName.includes(rawKeyword)) return true;
        const tkbData = timetables.teacher[t];
        if (tkbData) {
            const tkbStr = Object.values(tkbData).join(' ');
            if (removeVietnameseTones(tkbStr).includes(cleanKeyword) || tkbStr.toLowerCase().includes(rawKeyword)) {
                return true;
            }
        }
        return false;
    });

    if (matched.length === 0) {
        select.innerHTML = `<option value="">❌ Không tìm thấy: "${keyword}"</option>`;
        if (display) {
            display.innerHTML = `
                <div class="text-center py-8 text-gray-400 space-y-2">
                    <i class="fa-solid fa-magnifying-glass text-3xl text-gray-300"></i>
                    <p class="font-bold text-sm text-gray-600">Không tìm thấy giáo viên nào với từ khóa "${keyword}".</p>
                    <p class="text-xs text-gray-400">Bạn có thể tìm theo họ tên giáo viên (VD: Việt, Vân, Kim Anh, Thạch...) hoặc môn dạy.</p>
                </div>
            `;
        }
    } else {
        select.innerHTML = '';
        matched.forEach(t => {
            select.innerHTML += `<option value="${t}">Thầy/Cô ${t}</option>`;
        });
        select.value = matched[0];
        renderTimetable();
    }
}

// ==============================================================================
// 3. QUẢN LÝ CÁ NHÂN: LỘ TRÌNH MỤC TIÊU, TO-DO, POMODORO, SỔ TAY & HUY HIỆU
// ==============================================================================

// Cấu hình danh mục Huy hiệu danh dự
const BADGES_CONFIG = [
    { id: 'busy_bee', name: 'Ong Chăm Chỉ', icon: '🐝', desc: 'Đăng nhập và hoàn thành mục tiêu 7 ngày liên tiếp', req: 'Streak 7 ngày' },
    { id: 'todo_runner', name: 'Tia Chớp Tri Thức', icon: '⚡', desc: 'Hoàn thành từ 10 việc trong Danh sách việc cần làm', req: '10 To-dos hoàn thành' },
    { id: 'focus_master', name: 'Bậc Thầy Tập Trung', icon: '⏳', desc: 'Hoàn thành từ 10 phiên đồng hồ học Pomodoro', req: '10 phiên Pomodoro' },
    { id: 'goal_crusher', name: 'Kẻ Chinh Phục Điểm Số', icon: '🎯', desc: 'Đạt hoặc vượt điểm mục tiêu ở ít nhất 3 môn học', req: 'Đạt 3 môn mục tiêu' },
    { id: 'vault_collector', name: 'Nhà Sưu Tầm Tri Thức', icon: '📖', desc: 'Lưu trữ từ 5 câu hỏi khó vào Sổ tay ôn lại', req: '5 câu hỏi trong sổ tay' },
    { id: 'wise_owl', name: 'Cú Đêm Uyên Bác', icon: '🦉', desc: 'Tích lũy từ 500 điểm chăm chỉ (EXP) học tập', req: '500 điểm EXP' },
    { id: 'grand_valedictorian', name: 'Thủ Khoa Toàn Năng', icon: '🏆', desc: 'Đạt cấp độ Học Bá trở lên (Lv.4+)', req: 'Cấp độ Lv.4 trở lên' }
];

// Dữ liệu mẫu ban đầu cho Mục tiêu điểm số từng môn
const DEFAULT_SUBJECT_GOALS = [
    { id: 'math', subject: 'Toán', icon: 'fa-calculator', color: 'from-blue-500 to-indigo-600', target: 8.5, actual: 7.5, note: 'Cần làm thêm bài tập Hình học không gian' },
    { id: 'lit', subject: 'Ngữ văn', icon: 'fa-book-open', color: 'from-rose-500 to-pink-600', target: 8.0, actual: 8.0, note: 'Luyện mở bài gián tiếp và liên hệ thực tế' },
    { id: 'eng', subject: 'Tiếng Anh', icon: 'fa-language', color: 'from-amber-500 to-orange-600', target: 8.0, actual: 8.5, note: 'Đã nắm chắc ngữ pháp thì & mệnh đề quan hệ' },
    { id: 'phys', subject: 'Vật lí', icon: 'fa-bolt', color: 'from-sky-500 to-cyan-600', target: 8.5, actual: 8.0, note: 'Ôn lại các dạng bài Dao động điều hòa' },
    { id: 'chem', subject: 'Hóa học', icon: 'fa-flask', color: 'from-emerald-500 to-teal-600', target: 8.0, actual: 7.0, note: 'Học lại phương pháp giải Este - Lipit' },
    { id: 'bio', subject: 'Sinh học', icon: 'fa-dna', color: 'from-green-500 to-emerald-600', target: 7.5, actual: 8.0, note: 'Nắm chắc quy luật di truyền Men-đen' }
];

// Dữ liệu mẫu việc cần làm
const DEFAULT_TODOS = [
    { id: 1728900000001, title: 'Nộp bài văn nghị luận phân tích bài thơ Sóng', subject: 'Ngữ văn', deadline: '2026-10-16T20:00', priority: 'high', completed: false, createdAt: '14/10/2026' },
    { id: 1728900000002, title: 'Làm đề kiểm tra 1 tiết Đại số chương 1', subject: 'Toán', deadline: '2026-10-17T17:00', priority: 'normal', completed: false, createdAt: '14/10/2026' },
    { id: 1728900000003, title: 'Học 30 từ vựng Unit 3 Tiếng Anh 12', subject: 'Tiếng Anh', deadline: '2026-10-15T21:30', priority: 'normal', completed: true, completedAt: '14/10/2026 20:15', createdAt: '13/10/2026' },
    { id: 1728900000004, title: 'Giải bài tập este - lipit trong SGK', subject: 'Hóa học', deadline: '2026-10-18T19:00', priority: 'low', completed: false, createdAt: '14/10/2026' }
];

// Dữ liệu mẫu thống kê Pomodoro
const DEFAULT_POMODORO_STATS = {
    todayMinutes: 50,
    todaySessions: 2,
    thisWeekMinutes: 600, // 10 giờ
    lastWeekMinutes: 480, // 8 giờ
    totalSessions: 18,
    dailyMinutes: {
        'T2': 90,
        'T3': 75,
        'T4': 100,
        'T5': 80,
        'T6': 120,
        'T7': 85,
        'CN': 50
    }
};

// Dữ liệu mẫu ghi chú nhanh
const DEFAULT_QUICK_NOTES = [
    { id: 1, title: 'Công thức Đạo hàm nhanh phân thức', subject: 'Toán', color: 'yellow', content: 'y = (ax+b)/(cx+d) => y\' = (ad - bc) / (cx+d)^2. Luôn nhớ điều kiện mẫu khác 0!', pinned: true, updatedAt: '14/10/2026' },
    { id: 2, title: 'Dàn ý mở bài gián tiếp môn Văn', subject: 'Ngữ văn', color: 'pink', content: 'Đi từ quy luật thời gian hoặc một danh ngôn nghệ thuật về cái đẹp/nỗi đau con người trước khi dẫn dắt vào tác phẩm.', pinned: false, updatedAt: '13/10/2026' },
    { id: 3, title: 'Bí kíp phân biệt thì Past Simple & Present Perfect', subject: 'Tiếng Anh', color: 'blue', content: 'Past Simple đi với mốc thời gian xác định trong quá khứ (yesterday, in 2020, ago). Present Perfect nhấn mạnh kết quả kéo dài tới hiện tại.', pinned: false, updatedAt: '12/10/2026' }
];

// Khởi tạo các biến từ LocalStorage
let mySubjectGoals = JSON.parse(localStorage.getItem('my_subject_goals')) || DEFAULT_SUBJECT_GOALS;
let myTodos = JSON.parse(localStorage.getItem('my_todos')) || DEFAULT_TODOS;
let myPomodoroStats = JSON.parse(localStorage.getItem('my_pomodoro_stats')) || DEFAULT_POMODORO_STATS;
let myQuickNotes = JSON.parse(localStorage.getItem('my_quick_notes')) || DEFAULT_QUICK_NOTES;

let myGamification = JSON.parse(localStorage.getItem('my_gamification')) || {
    exp: 350,
    streak: 7,
    lastActiveDate: new Date().toISOString().split('T')[0],
    maxStreak: 7,
    unlockedBadges: ['busy_bee', 'todo_runner', 'focus_master']
};

// Đảm bảo myProfile có đầy đủ trường thông tin
if (!myProfile.className) myProfile.className = '12A1';
if (!myProfile.studentName) myProfile.studentName = (currentAuthUser && currentAuthUser.name) ? currentAuthUser.name : 'Nguyễn Văn An';
if (!myProfile.motto) myProfile.motto = 'Chăm chỉ mỗi ngày, chạm tay ước mơ!';
if (!myProfile.targetUni) myProfile.targetUni = 'Đại học Bách Khoa Hà Nội';
if (!myProfile.activeBadge) myProfile.activeBadge = 'busy_bee';

// Trạng thái điều hướng và bộ lọc nội bộ
let profileCurrentSubTab = 'goals'; // 'goals', 'todos', 'pomodoro', 'vault', 'badges'
let currentTodoFilter = 'all'; // 'all', 'pending', 'urgent', 'completed'
let currentVaultSubTab = 'notes'; // 'notes', 'mistakes'
let vaultNoteSearchKeyword = '';

// Trạng thái Đồng hồ Pomodoro
let pomoMode = 'work'; // 'work' (25m), 'short' (5m), 'long' (15m)
let pomoTotalTime = 25 * 60;
let pomoTimeLeft = 25 * 60;
let pomoTimerId = null;
let pomoIsRunning = false;

// ==============================================================================
// KHỞI TẠO MODULE QUẢN LÝ CÁ NHÂN
// ==============================================================================
function initProfileModule() {
    checkDailyStreak();
    checkBadgeUnlocks();
    renderProfileHeaderBanner();
    setProfileSubTab(profileCurrentSubTab);
    updateProfileBadgesBadge();
}

// Giữ lại loadProfileUI để tương thích toàn hệ thống
function loadProfileUI() {
    initProfileModule();
}

// 1. Render Hero Banner (Avatar, Active Badge, Streak, Level, Motto)
function renderProfileHeaderBanner() {
    const nameEl = document.getElementById('profile-name-display');
    const classEl = document.getElementById('profile-class-display');
    const uniEl = document.getElementById('profile-target-uni');
    const mottoTextEl = document.getElementById('profile-motto-text');
    const badgePillEl = document.getElementById('profile-active-badge-pill');
    const badgeTitleEl = document.getElementById('profile-badge-title');
    const streakCountEl = document.getElementById('profile-streak-count');
    const levelBadgeEl = document.getElementById('profile-level-badge');
    const expCountEl = document.getElementById('profile-exp-count');
    const expBarEl = document.getElementById('profile-exp-bar');
    const avatarBox = document.getElementById('profile-avatar-box');

    // Đồng bộ nếu authUser có tên
    if (currentAuthUser && currentAuthUser.role === 'student' && currentAuthUser.name) {
        myProfile.studentName = currentAuthUser.name;
        if (currentAuthUser.className) myProfile.className = currentAuthUser.className;
    }

    if (nameEl) nameEl.textContent = myProfile.studentName || 'Học sinh';
    if (classEl) classEl.textContent = `Lớp ${myProfile.className || '12A1'}`;
    if (uniEl) {
        uniEl.innerHTML = `<i class="fa-solid fa-graduation-cap text-amber-300"></i> Mục tiêu: <span class="font-bold underline decoration-amber-300 underline-offset-2">${myProfile.targetUni || 'Đại học Bách Khoa'}</span>`;
    }
    if (mottoTextEl) mottoTextEl.textContent = myProfile.motto || 'Chăm chỉ mỗi ngày, chạm tay ước mơ!';

    // Huy hiệu đại diện
    const activeBadgeObj = BADGES_CONFIG.find(b => b.id === myProfile.activeBadge) || BADGES_CONFIG[0];
    if (badgePillEl) badgePillEl.textContent = activeBadgeObj.icon;
    if (badgeTitleEl) badgeTitleEl.textContent = activeBadgeObj.name;
    if (avatarBox) avatarBox.textContent = (currentAuthUser && currentAuthUser.avatar) ? currentAuthUser.avatar : '🎒';

    // Chuỗi ngày học
    if (streakCountEl) streakCountEl.textContent = myGamification.streak || 1;

    // Tính toán cấp độ EXP
    const rankInfo = getStudentRankInfo(myGamification.exp || 0);
    if (levelBadgeEl) levelBadgeEl.textContent = rankInfo.rankName;
    if (expCountEl) expCountEl.textContent = `${myGamification.exp || 0} / ${rankInfo.nextCap} EXP`;
    if (expBarEl) {
        const percent = Math.min(100, Math.round(((myGamification.exp - rankInfo.currentFloor) / (rankInfo.nextCap - rankInfo.currentFloor)) * 100));
        expBarEl.style.width = `${Math.max(5, percent)}%`;
    }

    // Cập nhật thẻ hiển thị cũ nếu có
    const legacyName = document.getElementById('profile-name-display-legacy');
    if (legacyName) legacyName.innerText = myProfile.studentName;
}

// Bảng cấp độ học sinh
function getStudentRankInfo(exp) {
    if (exp >= 1000) return { rankName: 'Lv.5 Huyền Thoại Thủ Khoa', currentFloor: 1000, nextCap: 1500, levelNum: 5 };
    if (exp >= 600) return { rankName: 'Lv.4 Học Bá Tiêu Biểu', currentFloor: 600, nextCap: 1000, levelNum: 4 };
    if (exp >= 300) return { rankName: 'Lv.3 Cú Đêm Chăm Học', currentFloor: 300, nextCap: 600, levelNum: 3 };
    if (exp >= 100) return { rankName: 'Lv.2 Học Sinh Tiên Tiến', currentFloor: 100, nextCap: 300, levelNum: 2 };
    return { rankName: 'Lv.1 Mầm Non Học Đường', currentFloor: 0, nextCap: 100, levelNum: 1 };
}

// Điều hướng Tab con trong Quản lý cá nhân
function setProfileSubTab(tabName) {
    profileCurrentSubTab = tabName;
    const tabs = ['goals', 'todos', 'pomodoro', 'vault', 'badges'];

    tabs.forEach(t => {
        const btn = document.getElementById(`profile-nav-${t}`);
        const panel = document.getElementById(`profile-panel-${t}`);

        if (btn) {
            if (t === tabName) {
                btn.className = "px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap shadow-sm transition flex items-center gap-1.5 bg-rose-600 text-white";
            } else {
                btn.className = "px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition flex items-center gap-1.5 bg-white text-slate-700 hover:bg-slate-100 border border-slate-200";
            }
        }

        if (panel) {
            panel.classList.toggle('hidden', t !== tabName);
        }
    });

    if (tabName === 'goals') renderProfileGoals();
    if (tabName === 'todos') renderProfileTodos();
    if (tabName === 'pomodoro') renderPomodoroStats();
    if (tabName === 'vault') {
        if (currentVaultSubTab === 'notes') renderVaultNotes();
        else renderVaultMistakes();
    }
    if (tabName === 'badges') renderBadgesPanel();
}

// ==============================================================================
// 2. LOGIC LỘ TRÌNH MỤC TIÊU & SO SÁNH ĐIỂM SỐ (GOALS)
// ==============================================================================
function renderProfileGoals() {
    const listEl = document.getElementById('profile-goals-list');
    const targetAvgEl = document.getElementById('goal-stat-target-avg');
    const actualAvgEl = document.getElementById('goal-stat-actual-avg');
    const achievedRateEl = document.getElementById('goal-stat-achieved-rate');

    if (!mySubjectGoals || mySubjectGoals.length === 0) {
        mySubjectGoals = DEFAULT_SUBJECT_GOALS;
        localStorage.setItem('my_subject_goals', JSON.stringify(mySubjectGoals));
    }

    // Tính toán chỉ số thống kê
    let sumTarget = 0;
    let sumActual = 0;
    let achievedCount = 0;

    mySubjectGoals.forEach(g => {
        sumTarget += (g.target || 0);
        sumActual += (g.actual || 0);
        if ((g.actual || 0) >= (g.target || 0)) achievedCount++;
    });

    const targetAvg = (sumTarget / mySubjectGoals.length).toFixed(1);
    const actualAvg = (sumActual / mySubjectGoals.length).toFixed(1);

    if (targetAvgEl) targetAvgEl.textContent = targetAvg;
    if (actualAvgEl) actualAvgEl.textContent = actualAvg;
    if (achievedRateEl) achievedRateEl.textContent = `${achievedCount} / ${mySubjectGoals.length} môn`;

    if (!listEl) return;

    let html = '';
    mySubjectGoals.forEach(item => {
        const diff = (item.actual - item.target);
        const actualWidth = Math.min(100, Math.max(0, (item.actual / 10) * 100));
        const targetPos = Math.min(100, Math.max(0, (item.target / 10) * 100));

        let statusNotice = '';
        let progressColor = 'from-blue-500 to-indigo-600';

        if (diff < 0) {
            // Chưa đạt mục tiêu
            const needMore = Math.abs(diff).toFixed(1);
            statusNotice = `
                <div class="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                    <i class="fa-solid fa-triangle-exclamation text-amber-500"></i>
                    <span>Cần cố gắng thêm <b class="text-rose-600 font-black">${needMore}</b> điểm nữa để đạt mục tiêu!</span>
                </div>
            `;
            progressColor = 'from-amber-400 to-orange-500';
        } else if (diff === 0) {
            // Vừa vặn đạt mục tiêu
            statusNotice = `
                <div class="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                    <i class="fa-solid fa-circle-check text-blue-500"></i>
                    <span>Tuyệt vời! Bạn đã vừa vặn đạt mục tiêu điểm số! 🎯</span>
                </div>
            `;
            progressColor = 'from-blue-500 to-indigo-600';
        } else {
            // Vượt mục tiêu
            const bonus = diff.toFixed(1);
            statusNotice = `
                <div class="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <i class="fa-solid fa-crown text-emerald-500"></i>
                    <span>Xuất sắc! Vượt mục tiêu <b class="text-emerald-800 font-black">+${bonus}</b> điểm! 🎉</span>
                </div>
            `;
            progressColor = 'from-emerald-500 to-teal-500';
        }

        html += `
            <div class="p-4 sm:p-5 rounded-2xl border border-slate-200/90 hover:border-slate-300 transition bg-white shadow-2xs space-y-3">
                <!-- Header môn: Tên môn, Icon, Điểm mục tiêu vs Điểm thực tế -->
                <div class="flex items-center justify-between gap-2 flex-wrap">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br ${item.color || 'from-slate-600 to-slate-800'} text-white flex items-center justify-center text-sm shadow-xs shrink-0">
                            <i class="fa-solid ${item.icon || 'fa-book'}"></i>
                        </div>
                        <div>
                            <h4 class="font-black text-sm sm:text-base text-slate-800">Môn ${item.subject}</h4>
                            <span class="text-[11px] text-slate-400 font-medium">${item.note || 'Chưa có ghi chú kế hoạch'}</span>
                        </div>
                    </div>

                    <div class="flex items-center gap-2">
                        <div class="text-right">
                            <span class="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Mục tiêu</span>
                            <span class="font-black text-xs sm:text-sm text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200">${item.target.toFixed(1)}</span>
                        </div>
                        <span class="text-slate-300 text-lg">/</span>
                        <div class="text-right">
                            <span class="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Thực tế</span>
                            <span class="font-black text-sm sm:text-base text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">${item.actual.toFixed(1)}</span>
                        </div>
                        <button type="button" onclick="openGoalModal('${item.id}')" class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition active:scale-95 ml-1" title="Sửa mục tiêu và điểm kiểm tra">
                            <i class="fa-solid fa-pen-to-square text-xs"></i>
                        </button>
                    </div>
                </div>

                <!-- Thang đo tiến độ so sánh kép trực quan (0 đến 10) -->
                <div class="space-y-1">
                    <div class="flex justify-between text-[10px] font-bold text-slate-400">
                        <span>0 điểm</span>
                        <span style="left: ${targetPos}%" class="text-purple-600 font-black">🎯 Mục tiêu: ${item.target.toFixed(1)}</span>
                        <span>10 điểm</span>
                    </div>

                    <div class="relative w-full h-3.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80">
                        <!-- Thanh điểm thực tế -->
                        <div class="h-full bg-gradient-to-r ${progressColor} rounded-full transition-all duration-700" style="width: ${actualWidth}%"></div>
                        
                        <!-- Vạch chỉ tiêu mục tiêu (Dotted Target Line) -->
                        <div class="absolute top-0 bottom-0 w-1 bg-purple-600 z-10 shadow-xs" style="left: ${targetPos}%; transform: translateX(-50%);"></div>
                    </div>
                </div>

                <!-- Thông báo chênh lệch điểm số -->
                <div class="flex items-center justify-between gap-2 flex-wrap">
                    ${statusNotice}
                    <button type="button" onclick="deleteGoal('${item.id}')" class="text-[11px] text-slate-400 hover:text-red-500 font-bold ml-auto transition">
                        <i class="fa-regular fa-trash-can mr-1"></i> Xóa môn
                    </button>
                </div>
            </div>
        `;
    });

    listEl.innerHTML = html;
}

// Modal Cập nhật Mục tiêu Điểm số
function openGoalModal(goalId) {
    const modal = document.getElementById('modal-goal-edit');
    if (!modal) return;
    const goal = mySubjectGoals.find(g => g.id === goalId);
    if (!goal) return;

    document.getElementById('goal-edit-id').value = goal.id;
    document.getElementById('goal-edit-subject').value = goal.subject;
    document.getElementById('goal-edit-target').value = goal.target;
    document.getElementById('goal-edit-actual').value = goal.actual;
    document.getElementById('goal-edit-note').value = goal.note || '';

    modal.classList.remove('hidden');
}

function closeGoalModal() {
    const modal = document.getElementById('modal-goal-edit');
    if (modal) modal.classList.add('hidden');
}

function handleSaveGoal(e) {
    if (e) e.preventDefault();
    const id = document.getElementById('goal-edit-id').value;
    const target = parseFloat(document.getElementById('goal-edit-target').value);
    const actual = parseFloat(document.getElementById('goal-edit-actual').value);
    const note = document.getElementById('goal-edit-note').value.trim();

    if (isNaN(target) || isNaN(actual)) return alert("Vui lòng nhập số điểm hợp lệ!");

    const goal = mySubjectGoals.find(g => g.id === id);
    if (goal) {
        const wasAchieved = goal.actual >= goal.target;
        goal.target = Math.min(10, Math.max(0, target));
        goal.actual = Math.min(10, Math.max(0, actual));
        goal.note = note;

        localStorage.setItem('my_subject_goals', JSON.stringify(mySubjectGoals));
        closeGoalModal();
        renderProfileGoals();

        // Nếu mới bứt phá đạt mục tiêu -> thưởng EXP
        if (!wasAchieved && goal.actual >= goal.target) {
            addGamificationExp(50, `Đạt mục tiêu môn ${goal.subject}!`);
        }

        showAuthToast(`Đã lưu mục tiêu môn ${goal.subject} thành công!`, 'fa-circle-check', 'success');
        checkBadgeUnlocks();
    }
}

function openAddGoalModal() {
    const subjName = prompt("Nhập tên môn học bạn muốn lập mục tiêu (VD: Tin học, Giáo dục kinh tế & pháp luật, v.v.):");
    if (!subjName || !subjName.trim()) return;

    const cleanName = subjName.trim();
    if (mySubjectGoals.some(g => g.subject.toLowerCase() === cleanName.toLowerCase())) {
        return alert(`Môn ${cleanName} đã có trong danh sách mục tiêu rồi!`);
    }

    const newGoal = {
        id: `goal_${Date.now()}`,
        subject: cleanName,
        icon: 'fa-book-bookmark',
        color: 'from-purple-500 to-indigo-600',
        target: 8.0,
        actual: 7.0,
        note: 'Kế hoạch ôn tập bứt phá'
    };

    mySubjectGoals.push(newGoal);
    localStorage.setItem('my_subject_goals', JSON.stringify(mySubjectGoals));
    renderProfileGoals();
    showAuthToast(`Đã thêm môn ${cleanName} vào lộ trình mục tiêu!`, 'fa-plus', 'success');
}

function deleteGoal(goalId) {
    if (!confirm("Bạn có chắc chắn muốn xóa môn này khỏi lộ trình mục tiêu?")) return;
    mySubjectGoals = mySubjectGoals.filter(g => g.id !== goalId);
    localStorage.setItem('my_subject_goals', JSON.stringify(mySubjectGoals));
    renderProfileGoals();
}

// ==============================================================================
// 3. LOGIC TO-DO LIST & NHẮC HẸN HỌC TẬP
// ==============================================================================
function renderProfileTodos() {
    const listEl = document.getElementById('profile-todo-list');
    const badgeCountEl = document.getElementById('profile-todo-pending-count');
    const countAllEl = document.getElementById('todo-count-all');
    const countPendingEl = document.getElementById('todo-count-pending');
    const countUrgentEl = document.getElementById('todo-count-urgent');
    const countCompletedEl = document.getElementById('todo-count-completed');

    if (!myTodos) myTodos = [];

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const pendingTodos = myTodos.filter(t => !t.completed);
    const completedTodos = myTodos.filter(t => t.completed);
    const urgentTodos = myTodos.filter(t => {
        if (t.completed) return false;
        if (!t.deadline) return false;
        return t.deadline.startsWith(todayStr) || new Date(t.deadline) < now || t.priority === 'high';
    });

    if (badgeCountEl) {
        badgeCountEl.textContent = pendingTodos.length;
        badgeCountEl.classList.toggle('hidden', pendingTodos.length === 0);
    }
    if (countAllEl) countAllEl.textContent = myTodos.length;
    if (countPendingEl) countPendingEl.textContent = pendingTodos.length;
    if (countUrgentEl) countUrgentEl.textContent = urgentTodos.length;
    if (countCompletedEl) countCompletedEl.textContent = completedTodos.length;

    if (!listEl) return;

    let filtered = myTodos;
    if (currentTodoFilter === 'pending') filtered = pendingTodos;
    else if (currentTodoFilter === 'urgent') filtered = urgentTodos;
    else if (currentTodoFilter === 'completed') filtered = completedTodos;

    if (filtered.length === 0) {
        listEl.innerHTML = `
            <div class="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 space-y-2">
                <div class="text-3xl">✨</div>
                <h4 class="font-bold text-sm text-slate-600">Không có việc nào trong mục này</h4>
                <p class="text-xs">Tuyệt vời! Hãy thêm bài tập mới hoặc nghỉ ngơi một chút nhé.</p>
            </div>
        `;
        return;
    }

    // Sắp xếp: việc chưa xong lên trước, việc gấp lên đầu
    filtered.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return new Date(a.deadline) - new Date(b.deadline);
    });

    let html = '';
    filtered.forEach(todo => {
        const isPast = todo.deadline && (new Date(todo.deadline) < now) && !todo.completed;
        const isToday = todo.deadline && todo.deadline.startsWith(todayStr) && !todo.completed;

        let deadlineBadge = '';
        if (todo.deadline) {
            const dateObj = new Date(todo.deadline);
            const timeStr = dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
            const dateStr = dateObj.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

            if (isPast) {
                deadlineBadge = `<span class="bg-red-100 text-red-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-red-200 flex items-center gap-1"><i class="fa-solid fa-triangle-exclamation"></i> Quá hạn (${timeStr} ${dateStr})</span>`;
            } else if (isToday) {
                deadlineBadge = `<span class="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1"><i class="fa-regular fa-clock"></i> Hôm nay lúc ${timeStr}</span>`;
            } else {
                deadlineBadge = `<span class="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full"><i class="fa-regular fa-calendar mr-1"></i> ${timeStr} ${dateStr}</span>`;
            }
        }

        let priorityBadge = '';
        if (todo.priority === 'high') priorityBadge = '<span class="bg-rose-50 text-rose-700 text-[10px] font-black px-2 py-0.5 rounded-md border border-rose-200">🔴 Gấp</span>';
        else if (todo.priority === 'normal') priorityBadge = '<span class="bg-slate-50 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200">🟡 Bình thường</span>';
        else priorityBadge = '<span class="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-200">🟢 Không vội</span>';

        html += `
            <div class="bg-white p-3.5 sm:p-4 rounded-2xl border ${todo.completed ? 'border-slate-100 bg-slate-50/60' : (isPast ? 'border-red-200 bg-red-50/20' : 'border-slate-200/90')} shadow-2xs hover:shadow-xs transition flex items-start justify-between gap-3 group">
                <!-- Checkbox + Nội dung -->
                <div class="flex items-start gap-3 flex-1 min-w-0">
                    <button type="button" onclick="toggleTodoComplete(${todo.id})" class="mt-0.5 w-6 h-6 rounded-lg border-2 ${todo.completed ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 hover:border-indigo-500 bg-white'} flex items-center justify-center text-xs transition transform active:scale-90 shrink-0">
                        ${todo.completed ? '<i class="fa-solid fa-check"></i>' : ''}
                    </button>

                    <div class="space-y-1 min-w-0 flex-1">
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="text-[10px] font-black px-2 py-0.2 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                                ${todo.subject || 'Chung'}
                            </span>
                            ${priorityBadge}
                            ${deadlineBadge}
                        </div>
                        <p class="text-xs sm:text-sm font-bold ${todo.completed ? 'line-through text-slate-400 opacity-60' : 'text-slate-800'} leading-relaxed break-words">
                            ${todo.title}
                        </p>
                        ${todo.completed ? `<span class="text-[10px] text-emerald-600 font-bold block">✓ Hoàn thành lúc ${todo.completedAt || ''} (+15 EXP)</span>` : ''}
                    </div>
                </div>

                <!-- Nút Xóa -->
                <button type="button" onclick="deleteProfileTodo(${todo.id})" class="text-slate-300 hover:text-red-500 p-1 rounded-lg transition shrink-0 opacity-80 group-hover:opacity-100" title="Xóa việc này">
                    <i class="fa-regular fa-trash-can text-xs"></i>
                </button>
            </div>
        `;
    });

    listEl.innerHTML = html;
}

function handleProfileTodoSubmit(e) {
    if (e) e.preventDefault();
    const titleInput = document.getElementById('todo-input-title');
    const subjectInput = document.getElementById('todo-input-subject');
    const deadlineInput = document.getElementById('todo-input-deadline');
    const priorityInput = document.getElementById('todo-input-priority');

    if (!titleInput || !titleInput.value.trim()) return alert("Vui lòng nhập tên công việc!");
    if (!deadlineInput || !deadlineInput.value) return alert("Vui lòng chọn thời hạn cho công việc!");

    const newTodo = {
        id: Date.now(),
        title: titleInput.value.trim(),
        subject: subjectInput ? subjectInput.value : 'Chung',
        deadline: deadlineInput.value,
        priority: priorityInput ? priorityInput.value : 'normal',
        completed: false,
        createdAt: new Date().toLocaleDateString('vi-VN')
    };

    myTodos.unshift(newTodo);
    localStorage.setItem('my_todos', JSON.stringify(myTodos));

    titleInput.value = '';
    renderProfileTodos();
    showAuthToast(`Đã thêm việc: "${newTodo.title}"`, 'fa-circle-check', 'success');
}

function toggleTodoComplete(todoId) {
    const todo = myTodos.find(t => t.id === todoId);
    if (!todo) return;

    todo.completed = !todo.completed;
    if (todo.completed) {
        todo.completedAt = new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
        addGamificationExp(15, `Hoàn thành việc: ${todo.title}`);
        showAuthToast(`🎉 Tuyệt vời! Bạn nhận được +15 EXP chăm chỉ!`, 'fa-coins', 'success');
        playChimeSound(660);
    }

    localStorage.setItem('my_todos', JSON.stringify(myTodos));
    renderProfileTodos();
    checkBadgeUnlocks();
}

function deleteProfileTodo(todoId) {
    if (!confirm("Bạn có chắc chắn muốn xóa việc này?")) return;
    myTodos = myTodos.filter(t => t.id !== todoId);
    localStorage.setItem('my_todos', JSON.stringify(myTodos));
    renderProfileTodos();
}

function filterProfileTodos(filter) {
    currentTodoFilter = filter;
    ['all', 'pending', 'urgent', 'completed'].forEach(f => {
        const btn = document.getElementById(`todo-filter-${f}`);
        if (btn) {
            if (f === filter) {
                btn.className = "px-3 py-1.5 rounded-xl text-xs font-black bg-indigo-600 text-white shadow-xs";
            } else {
                btn.className = "px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-600 hover:bg-slate-100 border border-slate-200";
            }
        }
    });
    renderProfileTodos();
}

// ==============================================================================
// 4. LOGIC ĐỒNG HỒ TỰ HỌC POMODORO & THỐNG KÊ TUẦN
// ==============================================================================
function setPomodoroMode(mode) {
    if (pomoIsRunning) {
        if (!confirm("Đồng hồ đang chạy. Bạn có muốn đổi chế độ và đặt lại thời gian không?")) return;
        clearInterval(pomoTimerId);
        pomoIsRunning = false;
    }

    pomoMode = mode;
    if (mode === 'work') pomoTotalTime = 25 * 60;
    else if (mode === 'short') pomoTotalTime = 5 * 60;
    else pomoTotalTime = 15 * 60;

    pomoTimeLeft = pomoTotalTime;

    // Cập nhật tab active
    ['work', 'short', 'long'].forEach(m => {
        const btn = document.getElementById(`pomo-mode-${m}`);
        if (btn) {
            if (m === mode) {
                btn.className = "px-3.5 py-1.5 rounded-xl text-xs font-black bg-rose-600 text-white shadow-xs transition";
            } else {
                btn.className = "px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 transition";
            }
        }
    });

    const statusLabel = document.getElementById('pomo-status-label');
    if (statusLabel) {
        if (mode === 'work') statusLabel.textContent = 'Học tập trung';
        else if (mode === 'short') statusLabel.textContent = 'Nghỉ giải lao ngắn';
        else statusLabel.textContent = 'Nghỉ dài hồi phục';
    }

    updatePomodoroDisplay();
}

function togglePomodoroTimer() {
    const btnText = document.getElementById('pomo-btn-text');
    const btnIcon = document.getElementById('pomo-btn-icon');

    if (pomoIsRunning) {
        // Tạm dừng
        clearInterval(pomoTimerId);
        pomoIsRunning = false;
        if (btnText) btnText.textContent = 'Tiếp tục';
        if (btnIcon) btnIcon.className = 'fa-solid fa-play';
    } else {
        // Bắt đầu chạy
        pomoIsRunning = true;
        if (btnText) btnText.textContent = 'Tạm dừng';
        if (btnIcon) btnIcon.className = 'fa-solid fa-pause';

        pomoTimerId = setInterval(() => {
            if (pomoTimeLeft > 0) {
                pomoTimeLeft--;
                updatePomodoroDisplay();
            } else {
                handlePomodoroComplete();
            }
        }, 1000);
    }
}

function resetPomodoroTimer() {
    clearInterval(pomoTimerId);
    pomoIsRunning = false;
    pomoTimeLeft = pomoTotalTime;

    const btnText = document.getElementById('pomo-btn-text');
    const btnIcon = document.getElementById('pomo-btn-icon');
    if (btnText) btnText.textContent = 'Bắt đầu học';
    if (btnIcon) btnIcon.className = 'fa-solid fa-play';

    updatePomodoroDisplay();
}

function skipPomodoroSession() {
    if (confirm("Bạn có muốn bỏ qua phiên này không?")) {
        resetPomodoroTimer();
        if (pomoMode === 'work') setPomodoroMode('short');
        else setPomodoroMode('work');
    }
}

function updatePomodoroDisplay() {
    const timerDisplay = document.getElementById('pomo-timer-display');
    const circleProgress = document.getElementById('pomo-circle-progress');

    const minutes = Math.floor(pomoTimeLeft / 60);
    const seconds = pomoTimeLeft % 60;
    const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if (timerDisplay) timerDisplay.textContent = timeStr;

    // Vòng tròn SVG: bán kính 44 => chu vi ~ 276.46
    if (circleProgress) {
        const circumference = 276.46;
        const offset = circumference * (1 - (pomoTimeLeft / pomoTotalTime));
        circleProgress.style.strokeDashoffset = offset;
    }
}

function handlePomodoroComplete() {
    clearInterval(pomoTimerId);
    pomoIsRunning = false;
    playChimeSound(880);

    const btnText = document.getElementById('pomo-btn-text');
    const btnIcon = document.getElementById('pomo-btn-icon');
    if (btnText) btnText.textContent = 'Bắt đầu học';
    if (btnIcon) btnIcon.className = 'fa-solid fa-play';

    if (pomoMode === 'work') {
        // Hoàn thành phiên học 25 phút
        myPomodoroStats.todayMinutes = (myPomodoroStats.todayMinutes || 0) + 25;
        myPomodoroStats.todaySessions = (myPomodoroStats.todaySessions || 0) + 1;
        myPomodoroStats.thisWeekMinutes = (myPomodoroStats.thisWeekMinutes || 0) + 25;
        myPomodoroStats.totalSessions = (myPomodoroStats.totalSessions || 0) + 1;

        // Cập nhật hôm nay trong biểu đồ
        const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        const todayKey = dayNames[new Date().getDay()];
        if (!myPomodoroStats.dailyMinutes) myPomodoroStats.dailyMinutes = {};
        myPomodoroStats.dailyMinutes[todayKey] = (myPomodoroStats.dailyMinutes[todayKey] || 0) + 25;

        localStorage.setItem('my_pomodoro_stats', JSON.stringify(myPomodoroStats));
        addGamificationExp(25, "Hoàn thành phiên Pomodoro 25 phút");
        showAuthToast("🍅 Xuất sắc! Bạn đã hoàn thành 25 phút học tập trung tuyệt đối (+25 EXP)! Hãy nghỉ 5 phút nhé.", 'fa-bell', 'success');

        checkBadgeUnlocks();
        setPomodoroMode('short');
        renderPomodoroStats();
    } else {
        showAuthToast("☕ Hết giờ nghỉ! Bạn đã sẵn sàng cho một phiên học mới chưa?", 'fa-fire', 'info');
        setPomodoroMode('work');
    }
}

function renderPomodoroStats() {
    const weekHoursEl = document.getElementById('pomo-stat-week-hours');
    const compEl = document.getElementById('pomo-stat-comparison');
    const todayTimeEl = document.getElementById('pomo-stat-today-time');
    const totalSessionsEl = document.getElementById('pomo-stat-total-sessions');
    const chartEl = document.getElementById('pomo-week-chart');

    if (!myPomodoroStats) myPomodoroStats = DEFAULT_POMODORO_STATS;

    const thisHours = ((myPomodoroStats.thisWeekMinutes || 0) / 60).toFixed(1);
    const lastHours = ((myPomodoroStats.lastWeekMinutes || 0) / 60).toFixed(1);
    const diffHours = (parseFloat(thisHours) - parseFloat(lastHours)).toFixed(1);

    if (weekHoursEl) weekHoursEl.textContent = `${thisHours} giờ`;
    if (compEl) {
        if (parseFloat(diffHours) >= 0) {
            compEl.innerHTML = `<i class="fa-solid fa-arrow-trend-up text-emerald-400 mr-1"></i> Tăng <b>${diffHours} giờ</b> so với tuần trước`;
        } else {
            compEl.innerHTML = `<i class="fa-solid fa-arrow-trend-down text-slate-300 mr-1"></i> Giảm <b>${Math.abs(diffHours)} giờ</b> so với tuần trước`;
        }
    }

    if (todayTimeEl) todayTimeEl.textContent = `${myPomodoroStats.todayMinutes || 0} phút`;
    if (totalSessionsEl) totalSessionsEl.textContent = `${myPomodoroStats.totalSessions || 0} phiên`;

    // Render Mini Bar Chart 7 ngày (T2 - CN)
    if (chartEl && myPomodoroStats.dailyMinutes) {
        const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
        const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        const currentToday = dayNames[new Date().getDay()];

        const maxMins = Math.max(120, ...Object.values(myPomodoroStats.dailyMinutes));

        let chartHtml = '';
        days.forEach(d => {
            const val = myPomodoroStats.dailyMinutes[d] || 0;
            const heightPercent = Math.min(100, Math.max(12, Math.round((val / maxMins) * 100)));
            const isToday = (d === currentToday);

            chartHtml += `
                <div class="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span class="text-[9px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition">${val}m</span>
                    <div class="w-full max-w-[24px] rounded-lg ${isToday ? 'bg-gradient-to-t from-rose-600 to-amber-500 shadow-xs' : 'bg-slate-200 group-hover:bg-slate-300'} transition-all duration-500" style="height: ${heightPercent}%"></div>
                    <span class="text-[10px] font-black ${isToday ? 'text-rose-600 font-black' : 'text-slate-500'}">${d}</span>
                </div>
            `;
        });

        chartEl.innerHTML = chartHtml;
    }
}

// Âm thanh chuông báo Web Audio API (100% Offline)
function playChimeSound(freq = 660) {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
        console.warn("AudioContext not supported or blocked");
    }
}

// ==============================================================================
// 5. LOGIC KHO LƯU TRỮ CÁ NHÂN (SỔ TAY GHI CHÚ & CÂU HỎI TỪ PHÒNG THI)
// ==============================================================================
function setVaultSubTab(subTab) {
    currentVaultSubTab = subTab;
    const notesTabBtn = document.getElementById('vault-tab-notes');
    const mistakesTabBtn = document.getElementById('vault-tab-mistakes');
    const notesPanel = document.getElementById('vault-panel-notes');
    const mistakesPanel = document.getElementById('vault-panel-mistakes');
    const actionBtns = document.getElementById('vault-action-buttons');

    if (subTab === 'notes') {
        if (notesTabBtn) notesTabBtn.className = "px-4 py-2 rounded-xl text-xs font-black bg-purple-600 text-white shadow-xs transition";
        if (mistakesTabBtn) mistakesTabBtn.className = "px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition";
        if (notesPanel) notesPanel.classList.remove('hidden');
        if (mistakesPanel) mistakesPanel.classList.add('hidden');
        if (actionBtns) actionBtns.innerHTML = '';
        renderVaultNotes();
    } else {
        if (mistakesTabBtn) mistakesTabBtn.className = "px-4 py-2 rounded-xl text-xs font-black bg-indigo-600 text-white shadow-xs transition";
        if (notesTabBtn) notesTabBtn.className = "px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition";
        if (mistakesPanel) mistakesPanel.classList.remove('hidden');
        if (notesPanel) notesPanel.classList.add('hidden');
        if (actionBtns) {
            actionBtns.innerHTML = `
                <button type="button" onclick="switchTab('exam')" class="px-3.5 py-1.5 rounded-xl text-xs font-black bg-rose-50 hover:bg-rose-100 text-rose-700 transition flex items-center gap-1.5 border border-rose-200">
                    <i class="fa-solid fa-graduation-cap"></i>
                    <span>Tới Phòng Luyện Thi</span>
                </button>
            `;
        }
        renderVaultMistakes();
    }
}

function renderVaultNotes() {
    const gridEl = document.getElementById('vault-notes-grid');
    const notesCountEl = document.getElementById('vault-notes-count');

    if (notesCountEl) notesCountEl.textContent = myQuickNotes.length;
    if (!gridEl) return;

    let filtered = myQuickNotes;
    if (vaultNoteSearchKeyword) {
        filtered = filtered.filter(n => 
            n.title.toLowerCase().includes(vaultNoteSearchKeyword) ||
            n.subject.toLowerCase().includes(vaultNoteSearchKeyword) ||
            n.content.toLowerCase().includes(vaultNoteSearchKeyword)
        );
    }

    if (filtered.length === 0) {
        gridEl.innerHTML = `
            <div class="col-span-full bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 space-y-2">
                <div class="text-3xl">📝</div>
                <h4 class="font-bold text-sm text-slate-600">Chưa có ghi chú nào</h4>
                <p class="text-xs">Bấm "Thêm ghi chú" để lưu công thức, mẹo giải nhanh hoặc kiến thức cần ghi nhớ.</p>
            </div>
        `;
        return;
    }

    // Ghim lên đầu
    filtered.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

    const colorClasses = {
        yellow: 'bg-amber-50 border-amber-200 text-amber-950',
        blue: 'bg-sky-50 border-sky-200 text-sky-950',
        emerald: 'bg-emerald-50 border-emerald-200 text-emerald-950',
        purple: 'bg-purple-50 border-purple-200 text-purple-950',
        pink: 'bg-pink-50 border-pink-200 text-pink-950'
    };

    let html = '';
    filtered.forEach(note => {
        const cls = colorClasses[note.color] || colorClasses.yellow;
        html += `
            <div class="p-4 rounded-2xl border ${cls} shadow-2xs hover:shadow-xs transition relative group flex flex-col justify-between space-y-2.5">
                <div>
                    <div class="flex items-center justify-between gap-1.5 mb-1.5">
                        <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/70 shadow-2xs">
                            ${note.subject}
                        </span>
                        <div class="flex items-center gap-1">
                            <button type="button" onclick="togglePinNote(${note.id})" class="text-xs ${note.pinned ? 'text-amber-500' : 'text-slate-400 hover:text-slate-600'} transition" title="${note.pinned ? 'Bỏ ghim' : 'Ghim ghi chú'}">
                                <i class="fa-solid fa-thumbtack"></i>
                            </button>
                            <button type="button" onclick="deleteQuickNote(${note.id})" class="text-xs text-slate-400 hover:text-red-500 transition ml-1" title="Xóa">
                                <i class="fa-regular fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                    <h4 class="font-black text-xs sm:text-sm text-slate-900 leading-snug">${note.title}</h4>
                    <p class="text-xs font-medium text-slate-700 leading-relaxed mt-1.5 whitespace-pre-wrap">${note.content}</p>
                </div>

                <div class="pt-2 border-t border-black/5 flex items-center justify-between text-[10px] text-slate-400">
                    <span>${note.updatedAt || 'Mới cập nhật'}</span>
                    ${note.pinned ? '<span class="text-amber-600 font-bold">📌 Đã ghim</span>' : ''}
                </div>
            </div>
        `;
    });

    gridEl.innerHTML = html;
}

function handleVaultNoteSearch(kw) {
    vaultNoteSearchKeyword = kw.trim().toLowerCase();
    renderVaultNotes();
}

function openAddNoteModal() {
    const modal = document.getElementById('modal-quick-note');
    if (modal) modal.classList.remove('hidden');
}

function closeQuickNoteModal() {
    const modal = document.getElementById('modal-quick-note');
    if (modal) modal.classList.add('hidden');
}

function handleSaveQuickNote(e) {
    if (e) e.preventDefault();
    const titleInput = document.getElementById('note-input-title');
    const subjInput = document.getElementById('note-input-subject');
    const colorInput = document.getElementById('note-input-color');
    const contentInput = document.getElementById('note-input-content');

    if (!titleInput || !contentInput) return;

    const newNote = {
        id: Date.now(),
        title: titleInput.value.trim(),
        subject: subjInput ? subjInput.value : 'Khác',
        color: colorInput ? colorInput.value : 'yellow',
        content: contentInput.value.trim(),
        pinned: false,
        updatedAt: new Date().toLocaleDateString('vi-VN')
    };

    myQuickNotes.unshift(newNote);
    localStorage.setItem('my_quick_notes', JSON.stringify(myQuickNotes));

    addGamificationExp(5, `Tạo ghi chú: ${newNote.title}`);
    closeQuickNoteModal();
    titleInput.value = '';
    contentInput.value = '';

    renderVaultNotes();
    showAuthToast("Đã lưu ghi chú vào sổ tay (+5 EXP)!", 'fa-circle-check', 'success');
}

function togglePinNote(noteId) {
    const note = myQuickNotes.find(n => n.id === noteId);
    if (!note) return;
    note.pinned = !note.pinned;
    localStorage.setItem('my_quick_notes', JSON.stringify(myQuickNotes));
    renderVaultNotes();
}

function deleteQuickNote(noteId) {
    if (!confirm("Bạn có chắc chắn muốn xóa ghi chú này?")) return;
    myQuickNotes = myQuickNotes.filter(n => n.id !== noteId);
    localStorage.setItem('my_quick_notes', JSON.stringify(myQuickNotes));
    renderVaultNotes();
}

// Render Câu hỏi cần ôn lại (Synced từ Phòng Luyện thi)
function renderVaultMistakes() {
    const listEl = document.getElementById('vault-mistakes-list');
    const badgeEl = document.getElementById('profile-vault-mistakes-badge');
    const countEl = document.getElementById('vault-mistakes-count');

    const mistakes = JSON.parse(localStorage.getItem('school_mistake_notebook')) || [];

    if (badgeEl) {
        badgeEl.textContent = mistakes.length;
        badgeEl.classList.toggle('hidden', mistakes.length === 0);
    }
    if (countEl) countEl.textContent = mistakes.length;

    if (!listEl) return;

    if (mistakes.length === 0) {
        listEl.innerHTML = `
            <div class="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 space-y-3">
                <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center text-xl mx-auto">
                    📖
                </div>
                <h4 class="font-bold text-sm text-slate-700">Chưa có câu hỏi nào cần ôn lại</h4>
                <p class="text-xs text-slate-500 max-w-md mx-auto">
                    Khi vào <b>Phòng Luyện thi</b> làm bài tập, gặp câu khó hoặc làm sai, bạn chỉ cần bấm nút <b>"Lưu vào sổ tay"</b> là câu hỏi kèm lời giải chi tiết sẽ tự động lưu vào đây!
                </p>
                <button type="button" onclick="switchTab('exam')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-4 py-2 rounded-xl transition shadow-xs">
                    <i class="fa-solid fa-graduation-cap mr-1"></i> Đến Phòng Luyện Thi Ngay
                </button>
            </div>
        `;
        return;
    }

    let html = '';
    mistakes.forEach(m => {
        html += `
            <div class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
                <div class="flex items-center justify-between gap-2 border-b border-gray-100 pb-2">
                    <div class="flex items-center gap-2">
                        <span class="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                            Môn ${m.subject}
                        </span>
                        <span class="text-[10px] font-bold text-slate-400">Khối ${m.grade || '12'} • ${m.date || ''}</span>
                    </div>
                    <button type="button" onclick="removeVaultMistake('${m.id}')" class="text-xs text-emerald-600 hover:text-emerald-800 font-bold flex items-center gap-1 transition" title="Đã thuộc câu này">
                        <i class="fa-solid fa-check"></i> <span>Đã hiểu</span>
                    </button>
                </div>

                <p class="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">${m.content}</p>

                <div class="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl font-bold border border-emerald-100">
                    ✓ Đáp án đúng: <span class="font-black text-emerald-900">${m.correct}</span>
                </div>

                <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1">
                    <b class="text-indigo-900 block font-bold">Hướng dẫn giải chi tiết:</b>
                    <p class="font-medium leading-relaxed">${m.explanation || 'Xem lại lý thuyết trọng tâm trong SGK.'}</p>
                </div>
            </div>
        `;
    });

    listEl.innerHTML = html;
}

function removeVaultMistake(mistakeId) {
    if (typeof removeMistake === 'function') {
        removeMistake(mistakeId);
    } else {
        let mistakes = JSON.parse(localStorage.getItem('school_mistake_notebook')) || [];
        mistakes = mistakes.filter(m => m.id !== mistakeId);
        localStorage.setItem('school_mistake_notebook', JSON.stringify(mistakes));
    }
    renderVaultMistakes();
    showAuthToast("Đã đánh dấu hiểu bài và bỏ câu hỏi khỏi sổ tay!", 'fa-circle-check', 'success');
    addGamificationExp(10, "Hiểu bài câu hỏi khó");
}

// ==============================================================================
// 6. LOGIC HUY HIỆU & CHUỖI NGÀY (STREAK)
// ==============================================================================
function checkDailyStreak() {
    const today = new Date().toISOString().split('T')[0];
    const lastActive = myGamification.lastActiveDate;

    if (!lastActive) {
        myGamification.streak = 1;
        myGamification.lastActiveDate = today;
    } else if (lastActive !== today) {
        const lastDate = new Date(lastActive);
        const currentDate = new Date(today);
        const diffDays = Math.round((currentDate - lastDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            // Ngày hôm qua có vào -> Tăng chuỗi
            myGamification.streak = (myGamification.streak || 0) + 1;
            myGamification.maxStreak = Math.max(myGamification.maxStreak || 1, myGamification.streak);
            addGamificationExp(10, `Điểm danh chuỗi ${myGamification.streak} ngày liên tiếp`);
            showAuthToast(`🔥 Bạn đã duy trì chuỗi học tập ${myGamification.streak} ngày liên tiếp (+10 EXP)!`, 'fa-fire', 'success');
        } else if (diffDays > 1) {
            // Đứt chuỗi
            myGamification.streak = 1;
        }
        myGamification.lastActiveDate = today;
    }

    localStorage.setItem('my_gamification', JSON.stringify(myGamification));
}

function addGamificationExp(amount, reason = '') {
    myGamification.exp = (myGamification.exp || 0) + amount;
    localStorage.setItem('my_gamification', JSON.stringify(myGamification));
    renderProfileHeaderBanner();
    checkBadgeUnlocks();
}

function checkBadgeUnlocks() {
    if (!myGamification.unlockedBadges) myGamification.unlockedBadges = ['busy_bee'];

    const completedTodosCount = myTodos.filter(t => t.completed).length;
    const pomoSessionsCount = (myPomodoroStats && myPomodoroStats.totalSessions) || 0;
    const achievedGoalsCount = mySubjectGoals.filter(g => g.actual >= g.target).length;
    const mistakesCount = (JSON.parse(localStorage.getItem('school_mistake_notebook')) || []).length;
    const rankInfo = getStudentRankInfo(myGamification.exp);

    let newlyUnlocked = [];

    // 1. Ong chăm chỉ: Streak >= 7
    if (myGamification.streak >= 7 && !myGamification.unlockedBadges.includes('busy_bee')) {
        myGamification.unlockedBadges.push('busy_bee');
        newlyUnlocked.push('Ong Chăm Chỉ');
    }

    // 2. Tia chớp tri thức: >= 10 todo hoàn thành
    if (completedTodosCount >= 10 && !myGamification.unlockedBadges.includes('todo_runner')) {
        myGamification.unlockedBadges.push('todo_runner');
        newlyUnlocked.push('Tia Chớp Tri Thức');
    }

    // 3. Bậc thầy tập trung: >= 10 phiên Pomodoro
    if (pomoSessionsCount >= 10 && !myGamification.unlockedBadges.includes('focus_master')) {
        myGamification.unlockedBadges.push('Bậc Thầy Tập Trung');
    }

    // 4. Kẻ chinh phục điểm số: >= 3 môn đạt mục tiêu
    if (achievedGoalsCount >= 3 && !myGamification.unlockedBadges.includes('goal_crusher')) {
        myGamification.unlockedBadges.push('goal_crusher');
        newlyUnlocked.push('Kẻ Chinh Phục Điểm Số');
    }

    // 5. Nhà sưu tầm tri thức: >= 5 câu hỏi khó trong sổ tay
    if (mistakesCount >= 5 && !myGamification.unlockedBadges.includes('vault_collector')) {
        myGamification.unlockedBadges.push('vault_collector');
        newlyUnlocked.push('Nhà Sưu Tầm Tri Thức');
    }

    // 6. Cú đêm uyên bác: EXP >= 500
    if (myGamification.exp >= 500 && !myGamification.unlockedBadges.includes('wise_owl')) {
        myGamification.unlockedBadges.push('wise_owl');
        newlyUnlocked.push('Cú Đêm Uyên Bác');
    }

    // 7. Thủ khoa toàn năng: Level >= 4
    if (rankInfo.levelNum >= 4 && !myGamification.unlockedBadges.includes('grand_valedictorian')) {
        myGamification.unlockedBadges.push('grand_valedictorian');
        newlyUnlocked.push('Thủ Khoa Toàn Năng');
    }

    if (newlyUnlocked.length > 0) {
        localStorage.setItem('my_gamification', JSON.stringify(myGamification));
        newlyUnlocked.forEach(name => {
            showAuthToast(`🏅 CHÚC MỪNG! Bạn vừa mở khóa huy hiệu "${name}"!`, 'fa-medal', 'success');
        });
        playChimeSound(784);
    }

    updateProfileBadgesBadge();
}

function updateProfileBadgesBadge() {
    const countEl = document.getElementById('unlocked-badges-count');
    if (countEl) countEl.textContent = (myGamification.unlockedBadges || []).length;
}

function renderBadgesPanel() {
    const streakEl = document.getElementById('badge-screen-streak');
    const rankEl = document.getElementById('badge-screen-rank');
    const totalExpEl = document.getElementById('badge-screen-total-exp');
    const gridEl = document.getElementById('profile-badges-grid');

    if (streakEl) streakEl.textContent = myGamification.streak || 1;
    const rankInfo = getStudentRankInfo(myGamification.exp);
    if (rankEl) rankEl.textContent = rankInfo.rankName;
    if (totalExpEl) totalExpEl.textContent = `${myGamification.exp || 0} EXP`;

    if (!gridEl) return;

    let html = '';
    BADGES_CONFIG.forEach(badge => {
        const isUnlocked = (myGamification.unlockedBadges || []).includes(badge.id);
        const isActive = (myProfile.activeBadge === badge.id);

        html += `
            <div class="p-4 rounded-2xl border ${isUnlocked ? 'border-amber-300 bg-amber-50/40' : 'border-slate-200 bg-slate-50/60 opacity-60'} transition flex flex-col justify-between space-y-3 relative overflow-hidden">
                ${isActive ? `
                    <div class="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-lg uppercase">
                        Đang đeo
                    </div>
                ` : ''}

                <div class="flex items-start gap-3">
                    <div class="w-12 h-12 rounded-2xl ${isUnlocked ? 'bg-amber-100 text-amber-950 border border-amber-300 shadow-xs' : 'bg-slate-200 text-slate-400 grayscale'} flex items-center justify-center text-2xl shrink-0">
                        ${badge.icon}
                    </div>
                    <div>
                        <h4 class="font-black text-xs sm:text-sm text-slate-800">${badge.name}</h4>
                        <p class="text-[11px] text-slate-500 mt-0.5 leading-relaxed">${badge.desc}</p>
                    </div>
                </div>

                <div class="pt-2 border-t border-black/5 flex items-center justify-between gap-2 text-xs">
                    <span class="text-[10px] font-bold text-slate-400">Yêu cầu: ${badge.req}</span>
                    ${isUnlocked ? `
                        <button type="button" onclick="setActiveProfileBadge('${badge.id}')" class="px-3 py-1 rounded-xl text-[11px] font-black transition ${isActive ? 'bg-amber-500 text-white shadow-xs' : 'bg-white hover:bg-amber-100 text-amber-800 border border-amber-300'}">
                            ${isActive ? '✓ Đang dùng' : 'Đeo huy hiệu'}
                        </button>
                    ` : `
                        <span class="text-[10px] text-slate-400 font-bold italic"><i class="fa-solid fa-lock mr-1"></i> Chưa mở</span>
                    `}
                </div>
            </div>
        `;
    });

    gridEl.innerHTML = html;
}

function setActiveProfileBadge(badgeId) {
    myProfile.activeBadge = badgeId;
    localStorage.setItem('my_profile', JSON.stringify(myProfile));
    renderProfileHeaderBanner();
    renderBadgesPanel();
    if (typeof renderAuthHeaderUI === 'function') renderAuthHeaderUI();
    const badgeObj = BADGES_CONFIG.find(b => b.id === badgeId);
    showAuthToast(`Đã gắn huy hiệu "${badgeObj ? badgeObj.name : ''}" cạnh tên của bạn!`, 'fa-circle-check', 'success');
}

// ==============================================================================
// 7. MODAL CÀI ĐẶT THÔNG TIN HỒ SƠ & MỤC TIÊU ĐẠI HỌC
// ==============================================================================
function openProfileSettingsModal() {
    const modal = document.getElementById('modal-profile-settings');
    const classSelect = document.getElementById('modal-profile-class');
    const nameInput = document.getElementById('modal-profile-name');
    const uniInput = document.getElementById('modal-profile-target-uni');
    const mottoInput = document.getElementById('modal-profile-motto');

    if (!modal) return;

    if (classSelect) {
        classSelect.innerHTML = '';
        classes.forEach(c => {
            classSelect.innerHTML += `<option value="${c}" ${c === myProfile.className ? 'selected' : ''}>Lớp ${c}</option>`;
        });
    }

    if (nameInput) nameInput.value = myProfile.studentName || '';
    if (uniInput) uniInput.value = myProfile.targetUni || '';
    if (mottoInput) mottoInput.value = myProfile.motto || '';

    modal.classList.remove('hidden');
}

function closeProfileSettingsModal() {
    const modal = document.getElementById('modal-profile-settings');
    if (modal) modal.classList.add('hidden');
}

function handleModalProfileClassChange() {
    // Có thể tự động gợi ý học sinh trong lớp nếu muốn
}

function handleSaveProfileSettings(e) {
    if (e) e.preventDefault();
    const classSelect = document.getElementById('modal-profile-class');
    const nameInput = document.getElementById('modal-profile-name');
    const uniInput = document.getElementById('modal-profile-target-uni');
    const mottoInput = document.getElementById('modal-profile-motto');

    const className = classSelect ? classSelect.value : '12A1';
    const studentName = nameInput ? nameInput.value.trim() : '';
    const targetUni = uniInput ? uniInput.value.trim() : 'Đại học Bách Khoa Hà Nội';
    const motto = mottoInput ? mottoInput.value.trim() : 'Chăm chỉ mỗi ngày, chạm tay ước mơ!';

    if (!studentName) return alert("Vui lòng nhập họ và tên của bạn!");

    myProfile.className = className;
    myProfile.studentName = studentName;
    myProfile.targetUni = targetUni;
    myProfile.motto = motto;

    localStorage.setItem('my_profile', JSON.stringify(myProfile));

    closeProfileSettingsModal();
    renderProfileHeaderBanner();
    showAuthToast("Đã lưu cài đặt hồ sơ cá nhân thành công!", 'fa-circle-check', 'success');
}

// Backward compatibility alias
function renderProfileDisplay() {
    renderProfileHeaderBanner();
}


// ==============================================================================
// 4. HỎI ĐÁP ẨN DANH & TƯ VẤN HỌC ĐƯỜNG (FULL LOGIC SYSTEM)
// ==============================================================================

const QA_TOPICS_CONFIG = {
    study: { name: '#HọcTập', label: 'Học tập & Tài liệu', badge: 'bg-blue-100 text-blue-700 border-blue-200', defaultRecipient: 'all' },
    psychology: { name: '#TâmLý', label: 'Tư vấn tâm lý & Áp lực', badge: 'bg-pink-100 text-pink-700 border-pink-200', defaultRecipient: 'psychology' },
    rules: { name: '#NộiQuy', label: 'Nội quy & Nề nếp', badge: 'bg-amber-100 text-amber-700 border-amber-200', defaultRecipient: 'admin' },
    activity: { name: '#HoạtĐộng', label: 'CLB & Ngoại khóa', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', defaultRecipient: 'all' },
    exam: { name: '#ThiCử', label: 'Lịch thi & Khảo thí', badge: 'bg-purple-100 text-purple-700 border-purple-200', defaultRecipient: 'teacher' },
    feedback: { name: '#GópÝ', label: 'Cơ sở vật chất & Căng tin', badge: 'bg-indigo-100 text-indigo-700 border-indigo-200', defaultRecipient: 'admin' }
};

const QA_RECIPIENT_LABELS = {
    all: '📢 Bảng tin chung',
    psychology: '🧠 Phòng Tư Vấn Tâm Lý',
    admin: '🏛️ Ban Giám Hiệu & Đoàn Trường',
    teacher: '📚 Thầy Cô Giáo Viên'
};

const RANDOM_PSEUDONYMS = [
    { name: "Cú Đêm Chăm Chỉ", avatar: "🦉" },
    { name: "Gấu Trúc Giấu Tên", avatar: "🐼" },
    { name: "Cáo Con Chăm Học", avatar: "🦊" },
    { name: "Mèo Mướp Tò Mò", avatar: "🐱" },
    { name: "Cánh Cụt Đáng Yêu", avatar: "🐧" },
    { name: "Thỏ Trắng Hay Hỏi", avatar: "🐰" },
    { name: "Cá Heo Thông Thái", avatar: "🐬" },
    { name: "Sư Tử Tự Tin", avatar: "🦁" },
    { name: "Koala Mơ Màng", avatar: "🐨" },
    { name: "Kỳ Lân Mộng Mơ", avatar: "🦄" },
    { name: "Nhím Nhỏ Rụt Rè", avatar: "🦔" },
    { name: "Sóc Nâu Nhanh Nhẹn", avatar: "🐿️" },
    { name: "Hải Cẩu Vui Vẻ", avatar: "🦭" },
    { name: "Hồng Hạc Điệu Đà", avatar: "🦩" },
    { name: "Ếch Cốm Tinh Nghịch", avatar: "🐸" },
    { name: "Bạch Tuộc Đa Năng", avatar: "🐙" },
    { name: "Chú Ong Chăm Chỉ", avatar: "🐝" },
    { name: "Rùa Con Kiên Trì", avatar: "🐢" }
];

// Danh sách từ cấm nghiêm trọng (chặn gửi) & từ cảnh báo (đẩy vào chờ duyệt)
const QA_BLOCKED_WORDS = [
    'đm', 'dcm', 'đmm', 'dmm', 'vcl', 'vcll', 'clgt', 'đụ', 'đéo', 'deo', 'lon', 'lồn', 'cac', 'cặc', 
    'buoi', 'buồi', 'chó chết', 'đĩ', 'mẹ mày', 'me may', 'bố mày', 'bo may', 'cút', 'cut', 'óc chó',
    'chửi', 'chửi thề', 'đánh nhau', 'chem', 'chém', 'bạo lực'
];

const QA_WARNING_WORDS = [
    'gian lận', 'bắt nạt', 'tố cáo', 'bôi nhọ', 'xích mích', 'đánh ghen', 'lừa đảo', 'tiêu cực'
];

// Dữ liệu mẫu khởi tạo phong phú
const DEFAULT_QA_SEED = [
    {
        id: 1712000000001,
        lookupCode: 'QA-5012',
        topic: 'activity',
        topicLabel: '#HoạtĐộng',
        recipient: 'all',
        recipientLabel: '📢 Bảng tin chung',
        isPrivate: false,
        authorName: 'Cánh Cụt Đáng Yêu',
        authorAvatar: '🐧',
        question: 'Dạ thầy cô cho em hỏi bao giờ trường mình mở đăng ký tham gia các câu lạc bộ (Âm nhạc, Bóng rổ, STEM) và sự kiện ngoại khóa đợt này vậy ạ?',
        answer: 'Chào em, Ban Chấp Hành Đoàn Trường đã lên kế hoạch mở đơn đăng ký CLB từ ngày 20/10 tới. Các câu lạc bộ sẽ có bàn giới thiệu tại sảnh A vào giờ ra chơi, các em chú ý theo dõi nhé!',
        answeredBy: 'Ban Chấp Hành Đoàn Trường',
        answeredAt: '12/10/2026, 09:30',
        upvotes: 52,
        status: 'approved',
        timestamp: '11/10/2026, 14:15'
    },
    {
        id: 1712000000002,
        lookupCode: 'QA-7821',
        topic: 'psychology',
        topicLabel: '#TâmLý',
        recipient: 'psychology',
        recipientLabel: '🧠 Phòng Tư Vấn Tâm Lý',
        isPrivate: false,
        authorName: 'Cú Đêm Chăm Chỉ',
        authorAvatar: '🦉',
        question: 'Thưa thầy cô, đợt này bước vào giai đoạn ôn thi học kỳ em cảm thấy rất áp lực và thường xuyên bị mất ngủ, em nên sắp xếp thời gian thế nào để giải tỏa căng thẳng ạ?',
        answer: 'Thầy cô rất thấu hiểu cảm giác này của em. Giai đoạn thi cử ai cũng có chút lo âu, nhưng em đừng học dồn vào ban đêm nhé. Hãy áp dụng phương pháp Pomodoro (học 25p - nghỉ 5p), đi ngủ trước 23h và dành 15 phút tập thể dục mỗi ngày. Nếu cần tâm sự riêng, em có thể đến Phòng Tư vấn Tâm lý (tầng 2 nhà B) vào các buổi chiều, thầy cô luôn sẵn sàng lắng nghe em!',
        answeredBy: 'Phòng Tư Vấn Tâm Lý Học Đường',
        answeredAt: '13/10/2026, 16:45',
        upvotes: 38,
        status: 'approved',
        timestamp: '12/10/2026, 20:05'
    },
    {
        id: 1712000000003,
        lookupCode: 'QA-3394',
        topic: 'rules',
        topicLabel: '#NộiQuy',
        recipient: 'admin',
        recipientLabel: '🏛️ Ban Giám Hiệu & Đoàn Trường',
        isPrivate: false,
        authorName: 'Gấu Trúc Giấu Tên',
        authorAvatar: '🐼',
        question: 'Thầy cô cho em hỏi sắp tới mùa đông, học sinh có được phép mặc áo khoác giữ ấm cá nhân bên ngoài áo đồng phục của trường không ạ?',
        answer: 'Theo quy định học đường, vào những ngày thời tiết dưới 17 độ C, học sinh được phép mặc thêm áo khoác ấm cá nhân (khuyến khích màu tối hoặc nhã nhặn) bên ngoài áo khoác đồng phục để đảm bảo sức khỏe.',
        answeredBy: 'Ban Giám Hiệu Nhà Trường',
        answeredAt: '14/10/2026, 08:20',
        upvotes: 24,
        status: 'approved',
        timestamp: '13/10/2026, 10:10'
    },
    {
        id: 1712000000004,
        lookupCode: 'QA-9142',
        topic: 'study',
        topicLabel: '#HọcTập',
        recipient: 'all',
        recipientLabel: '📢 Bảng tin chung',
        isPrivate: false,
        authorName: 'Cáo Con Chăm Học',
        authorAvatar: '🦊',
        question: 'Mọi người và thầy cô có mẹo nào để học thuộc nhanh công thức Lượng giác và phương pháp vẽ thiết diện Hình học không gian 11 không ạ, em học phần này hay bị rối quá!',
        answer: null,
        answeredBy: null,
        answeredAt: null,
        upvotes: 19,
        status: 'approved',
        timestamp: '14/10/2026, 15:40'
    },
    {
        id: 1712000000005,
        lookupCode: 'QA-2026',
        topic: 'psychology',
        topicLabel: '#TâmLý',
        recipient: 'psychology',
        recipientLabel: '🧠 Phòng Tư Vấn Tâm Lý',
        isPrivate: true,
        authorName: 'Thỏ Trắng Hay Hỏi',
        authorAvatar: '🐰',
        question: '[HỎI KÍN BẢO MẬT] Thưa thầy cô, em đang có một số băn khoăn về áp lực gia đình và định hướng chọn khối thi lớp 12, em muốn xin lịch gặp riêng cô tâm lý vào chiều Thứ 5 tuần này được không ạ?',
        answer: 'Chào em, cô đã nhận được câu hỏi kín của em nhé. Chiều Thứ 5 lúc 15h30 cô có mặt tại Phòng Tư vấn (Phòng 204 Nhà B), em cứ ghé gặp cô nhé, mọi câu chuyện cô trò mình trao đổi đều được bảo mật tuyệt đối 100%. Hẹn gặp em!',
        answeredBy: 'Cô Thảo - Phòng Tư Vấn Học Đường',
        answeredAt: '14/10/2026, 17:30',
        upvotes: 0,
        status: 'approved',
        timestamp: '14/10/2026, 11:20'
    }
];

// Khởi tạo danh sách nếu trống hoặc cần nâng cấp
if (!qaList || qaList.length === 0 || !qaList[0].lookupCode) {
    qaList = DEFAULT_QA_SEED;
    localStorage.setItem('school_qa', JSON.stringify(qaList));
}

// Trạng thái bộ lọc và phân trang hiện tại
let qaCurrentSubTab = 'feed'; // 'feed', 'ask', 'lookup', 'admin'
let qaFilterTopic = 'all';
let qaFilterStatus = 'all';
let qaSortOrder = 'upvotes'; // 'upvotes' hoặc 'newest'
let qaSearchKeyword = '';
let qaCurrentAdminTab = 'pending'; // 'pending' hoặc 'private'
let currentRandomPseudonym = RANDOM_PSEUDONYMS[0];

// Khởi tạo hoặc lấy lại danh sách upvote từ LocalStorage
function getQaMyUpvotes() {
    try {
        return JSON.parse(localStorage.getItem('qa_my_upvotes')) || [];
    } catch(e) {
        return [];
    }
}

function saveQaMyUpvotes(arr) {
    localStorage.setItem('qa_my_upvotes', JSON.stringify(arr));
}

// Khởi tạo hoặc lấy lại danh sách mã tra cứu kín trên máy
function getQaMySavedCodes() {
    try {
        return JSON.parse(localStorage.getItem('my_saved_qa_codes')) || ['QA-2026'];
    } catch(e) {
        return ['QA-2026'];
    }
}

function saveQaMySavedCodes(arr) {
    localStorage.setItem('my_saved_qa_codes', JSON.stringify(arr));
}

// Sinh mã tra cứu bí mật duy nhất QA-XXXX
function generateLookupCode() {
    const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    let duplicate = true;
    while (duplicate) {
        let rand = '';
        for (let i = 0; i < 4; i++) {
            rand += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        code = 'QA-' + rand;
        duplicate = qaList.some(q => q.lookupCode === code);
    }
    return code;
}

// Đổi biệt danh ngẫu nhiên
function randomizeCurrentPseudonym() {
    const idx = Math.floor(Math.random() * RANDOM_PSEUDONYMS.length);
    currentRandomPseudonym = RANDOM_PSEUDONYMS[idx];
    const avatarEl = document.getElementById('qa-current-avatar');
    const nameEl = document.getElementById('qa-current-pseudonym');
    if (avatarEl) avatarEl.textContent = currentRandomPseudonym.avatar;
    if (nameEl) nameEl.textContent = currentRandomPseudonym.name;
}

// Cập nhật bộ đếm ký tự
function updateQaCharCount(textarea) {
    const counter = document.getElementById('qa-char-count');
    if (counter && textarea) {
        counter.textContent = `${textarea.value.length}/600 ký tự`;
    }
}

// Tự động gợi ý người nhận khi đổi chủ đề
function handleTopicSelectChange() {
    const topicSelect = document.getElementById('qa-topic-select');
    const recipientSelect = document.getElementById('qa-recipient-select');
    if (!topicSelect || !recipientSelect) return;
    
    const topicVal = topicSelect.value;
    const config = QA_TOPICS_CONFIG[topicVal];
    if (config && config.defaultRecipient) {
        recipientSelect.value = config.defaultRecipient;
    }
}

// Kiểm tra ngôn từ chuẩn mực học đường (Kiểm duyệt)
function checkQaModeration(content) {
    if (!content) return { passed: true, level: 'approved' };
    
    // Chuẩn hóa văn bản: chữ thường, gỡ ký tự phân cách lách luật
    const lower = content.toLowerCase();
    const normalized = lower.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\.\,\-\_\s\*\#\@]/g, '');

    // 1. Kiểm tra từ cấm nghiêm trọng (Chặn gửi)
    for (const word of QA_BLOCKED_WORDS) {
        const normWord = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '');
        if (lower.includes(word) || normalized.includes(normWord)) {
            return {
                passed: false,
                level: 'block',
                word: word,
                reason: `Nội dung chứa từ ngữ chưa phù hợp với chuẩn mực học đường ("${word}"). Vui lòng diễn đạt lại bằng ngôn từ lịch sự, văn minh nhé!`
            };
        }
    }

    // 2. Kiểm tra từ cảnh báo (Đưa vào danh sách chờ Admin duyệt)
    for (const word of QA_WARNING_WORDS) {
        const normWord = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '');
        if (lower.includes(word) || normalized.includes(normWord)) {
            return {
                passed: true,
                level: 'pending',
                word: word,
                reason: `Nội dung có yếu tố nhạy cảm ("${word}"), cần Ban Quản Trị rà soát duyệt bài trước khi hiển thị công khai.`
            };
        }
    }

    return { passed: true, level: 'approved' };
}

// Chuyển đổi các Tab con trong Hỏi Đáp
function switchQaSubTab(tabName) {
    qaCurrentSubTab = tabName;
    const panels = ['feed', 'ask', 'lookup', 'admin'];
    
    panels.forEach(p => {
        const panelEl = document.getElementById(`qa-panel-${p}`);
        const btnEl = document.getElementById(`qa-nav-btn-${p}`);
        if (panelEl) {
            if (p === tabName) panelEl.classList.remove('hidden');
            else panelEl.classList.add('hidden');
        }
        if (btnEl) {
            if (p === tabName) {
                btnEl.classList.remove('text-slate-600', 'hover:bg-purple-50');
                if (p === 'admin') {
                    btnEl.classList.add('bg-amber-600', 'text-white', 'shadow-sm');
                } else {
                    btnEl.classList.add('bg-purple-600', 'text-white', 'shadow-sm');
                }
            } else {
                btnEl.classList.remove('bg-purple-600', 'bg-amber-600', 'text-white', 'shadow-sm');
                btnEl.classList.add('text-slate-600', 'hover:bg-purple-50');
            }
        }
    });

    if (tabName === 'ask') {
        randomizeCurrentPseudonym();
    }
    if (tabName === 'lookup') {
        renderQaDeviceHistory();
    }
    if (tabName === 'admin') {
        renderAdminQaPanel();
    }
    if (tabName === 'feed') {
        renderQA();
    }
    updateQaStats();
}

// Cập nhật số liệu thống kê ở Banner đầu trang
function updateQaStats() {
    const totalEl = document.getElementById('qa-stat-total');
    const answeredEl = document.getElementById('qa-stat-answered');
    const privateEl = document.getElementById('qa-stat-private');
    const myCodesCountEl = document.getElementById('qa-my-codes-count');

    if (totalEl) totalEl.textContent = qaList.filter(q => q.status === 'approved' || q.isPrivate).length;
    if (answeredEl) answeredEl.textContent = qaList.filter(q => q.answer).length;
    if (privateEl) privateEl.textContent = qaList.filter(q => q.isPrivate).length;

    const myCodes = getQaMySavedCodes();
    if (myCodesCountEl) {
        if (myCodes.length > 0) {
            myCodesCountEl.textContent = myCodes.length;
            myCodesCountEl.classList.remove('hidden');
        } else {
            myCodesCountEl.classList.add('hidden');
        }
    }

    updateQaAdminUI();
}

// Kiểm tra quyền Admin/Giáo viên cho mục Hỏi Đáp (hỗ trợ cả currentAuthUser và currentUser)
function isQaAdminUser() {
    const user = (typeof currentAuthUser !== 'undefined' && currentAuthUser) ? currentAuthUser : (window.currentUser || null);
    return !!(user && (user.role === 'admin' || user.role === 'teacher'));
}

// Cập nhật hiển thị quyền Admin cho mục Hỏi Đáp
function updateQaAdminUI() {
    const adminWrapper = document.getElementById('qa-nav-admin-wrapper');
    const adminBadge = document.getElementById('qa-admin-badge');
    const isAdmin = isQaAdminUser();

    if (adminWrapper) {
        adminWrapper.classList.toggle('hidden', !isAdmin);
    }

    if (isAdmin && adminBadge) {
        const pendingCount = qaList.filter(q => q.status === 'pending').length;
        if (pendingCount > 0) {
            adminBadge.textContent = pendingCount;
            adminBadge.classList.remove('hidden');
        } else {
            adminBadge.classList.add('hidden');
        }
    }
}

// Xử lý gửi câu hỏi ẩn danh
function handleQaSubmit(event) {
    if (event) event.preventDefault();

    const topicSelect = document.getElementById('qa-topic-select');
    const recipientSelect = document.getElementById('qa-recipient-select');
    const contentInput = document.getElementById('qa-content-input');
    const privateCheckbox = document.getElementById('qa-private-checkbox');

    if (!contentInput) return;
    const content = contentInput.value.trim();
    if (!content) {
        alert("Vui lòng nhập nội dung câu hỏi!");
        return;
    }

    // 1. Kiểm duyệt ngôn từ
    const modResult = checkQaModeration(content);
    if (!modResult.passed) {
        alert(modResult.reason);
        return;
    }

    const topicKey = topicSelect ? topicSelect.value : 'study';
    const topicConfig = QA_TOPICS_CONFIG[topicKey] || QA_TOPICS_CONFIG.study;
    const recipientKey = recipientSelect ? recipientSelect.value : 'all';
    const recipientLabel = QA_RECIPIENT_LABELS[recipientKey] || '📢 Bảng tin chung';
    const isPrivate = privateCheckbox ? privateCheckbox.checked : false;

    // Sinh mã tra cứu
    const lookupCode = generateLookupCode();

    const newQaItem = {
        id: Date.now(),
        lookupCode: lookupCode,
        topic: topicKey,
        topicLabel: topicConfig.name,
        recipient: recipientKey,
        recipientLabel: recipientLabel,
        isPrivate: isPrivate,
        authorName: currentRandomPseudonym.name,
        authorAvatar: currentRandomPseudonym.avatar,
        question: content,
        answer: null,
        answeredBy: null,
        answeredAt: null,
        upvotes: 0,
        status: modResult.level === 'pending' ? 'pending' : 'approved',
        flaggedReason: modResult.level === 'pending' ? modResult.reason : null,
        timestamp: new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })
    };

    qaList.unshift(newQaItem);
    localStorage.setItem('school_qa', JSON.stringify(qaList));

    // Reset form
    contentInput.value = '';
    updateQaCharCount(contentInput);
    if (privateCheckbox) privateCheckbox.checked = false;

    // 2. Xử lý trường hợp "Hỏi kín"
    if (isPrivate) {
        const myCodes = getQaMySavedCodes();
        if (!myCodes.includes(lookupCode)) {
            myCodes.unshift(lookupCode);
            saveQaMySavedCodes(myCodes);
        }

        // Hiện modal thông báo mã tra cứu bí mật
        const modal = document.getElementById('qa-secret-modal');
        const codeDisplay = document.getElementById('qa-modal-secret-code');
        if (codeDisplay) codeDisplay.textContent = lookupCode;
        if (modal) modal.classList.remove('hidden');
    } else {
        if (newQaItem.status === 'pending') {
            alert("📝 Câu hỏi của bạn đã được gửi thành công!\n\nDo nội dung có một số từ khóa đặc biệt, câu hỏi đang được Ban Quản Trị rà soát duyệt bài theo chuẩn mực học đường trước khi hiển thị lên bảng tin chung nhé.");
        } else {
            showAuthToast("Đã gửi câu hỏi lên bảng tin thành công!");
        }
        switchQaSubTab('feed');
    }

    updateQaStats();
    renderQA();
}

// Sao chép mã tra cứu bí mật
function copyQaSecretCode() {
    const codeDisplay = document.getElementById('qa-modal-secret-code');
    const copyBtn = document.getElementById('qa-modal-copy-btn');
    if (!codeDisplay) return;
    const code = codeDisplay.textContent.trim();

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(() => {
            if (copyBtn) copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Đã sao chép!</span>';
            setTimeout(() => {
                if (copyBtn) copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> <span>Sao chép mã</span>';
            }, 2000);
        });
    } else {
        alert(`Mã tra cứu của bạn là: ${code}`);
    }
}

function closeQaSecretModal() {
    const modal = document.getElementById('qa-secret-modal');
    if (modal) modal.classList.add('hidden');
    switchQaSubTab('lookup');
}

// Bấm "Cùng thắc mắc" (Upvote)
function toggleUpvote(qaId) {
    const myUpvotes = getQaMyUpvotes();
    const item = qaList.find(q => q.id === qaId);
    if (!item) return;

    const hasUpvoted = myUpvotes.includes(qaId);
    if (hasUpvoted) {
        // Hủy upvote
        const nextUpvotes = myUpvotes.filter(id => id !== qaId);
        saveQaMyUpvotes(nextUpvotes);
        item.upvotes = Math.max(0, (item.upvotes || 0) - 1);
    } else {
        // Thêm upvote
        myUpvotes.push(qaId);
        saveQaMyUpvotes(myUpvotes);
        item.upvotes = (item.upvotes || 0) + 1;
        showAuthToast("Đã ghi nhận bạn cùng thắc mắc vấn đề này!");
    }

    localStorage.setItem('school_qa', JSON.stringify(qaList));
    renderQA();
}

// Thiết lập bộ lọc chủ đề
function setQaFilterTopic(topicId) {
    qaFilterTopic = topicId;
    const buttons = document.querySelectorAll('.qa-topic-filter-btn');
    buttons.forEach(btn => {
        const t = btn.getAttribute('data-topic');
        if (t === topicId) {
            btn.className = "qa-topic-filter-btn px-3 py-1.5 rounded-xl whitespace-nowrap transition bg-purple-600 text-white font-black shadow-xs";
        } else {
            btn.className = "qa-topic-filter-btn px-3 py-1.5 rounded-xl whitespace-nowrap transition bg-slate-100 text-slate-600 hover:bg-purple-50 hover:text-purple-700 font-bold";
        }
    });
    renderQA();
}

// Thiết lập lọc trạng thái câu hỏi
function setQaFilterStatus(status) {
    qaFilterStatus = status;
    renderQA();
}

// Thiết lập sắp xếp câu hỏi (Upvotes / Newest)
function setQaSortOrder(order) {
    qaSortOrder = order;
    const upBtn = document.getElementById('qa-sort-upvotes-btn');
    const newBtn = document.getElementById('qa-sort-newest-btn');

    if (upBtn && newBtn) {
        if (order === 'upvotes') {
            upBtn.className = "px-2.5 py-1 rounded-lg bg-white text-purple-700 font-black shadow-2xs transition flex items-center gap-1";
            newBtn.className = "px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 transition flex items-center gap-1 font-bold";
        } else {
            newBtn.className = "px-2.5 py-1 rounded-lg bg-white text-purple-700 font-black shadow-2xs transition flex items-center gap-1";
            upBtn.className = "px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 transition flex items-center gap-1 font-bold";
        }
    }
    renderQA();
}

// Tìm kiếm câu hỏi
function handleQaSearch(keyword) {
    qaSearchKeyword = (keyword || '').trim().toLowerCase();
    renderQA();
}

// Hiển thị danh sách câu hỏi trên Bảng Tin Chung
function renderQA() {
    const container = document.getElementById('qa-list');
    if (!container) return;

    updateQaStats();

    // Chỉ lấy câu hỏi công khai và đã được duyệt (approved)
    let publicQuestions = qaList.filter(q => !q.isPrivate && q.status === 'approved');

    // 1. Lọc theo chủ đề
    if (qaFilterTopic !== 'all') {
        publicQuestions = publicQuestions.filter(q => q.topic === qaFilterTopic);
    }

    // 2. Lọc theo trạng thái đã trả lời
    if (qaFilterStatus === 'answered') {
        publicQuestions = publicQuestions.filter(q => !!q.answer);
    } else if (qaFilterStatus === 'unanswered') {
        publicQuestions = publicQuestions.filter(q => !q.answer);
    }

    // 3. Lọc theo từ khóa tìm kiếm
    if (qaSearchKeyword) {
        publicQuestions = publicQuestions.filter(q => 
            (q.question && q.question.toLowerCase().includes(qaSearchKeyword)) ||
            (q.topicLabel && q.topicLabel.toLowerCase().includes(qaSearchKeyword)) ||
            (q.answer && q.answer.toLowerCase().includes(qaSearchKeyword)) ||
            (q.authorName && q.authorName.toLowerCase().includes(qaSearchKeyword))
        );
    }

    if (publicQuestions.length === 0) {
        container.innerHTML = `
            <div class="bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center border border-purple-100 shadow-xs">
                <div class="w-12 h-12 rounded-2xl bg-purple-50 text-purple-400 flex items-center justify-center text-xl mx-auto mb-2">
                    💬
                </div>
                <h4 class="font-bold text-slate-700 text-sm">Chưa có câu hỏi nào phù hợp với bộ lọc</h4>
                <p class="text-xs text-slate-400 mt-1">Hãy là người đầu tiên đặt câu hỏi hoặc thay đổi điều kiện tìm kiếm nhé!</p>
                <button type="button" onclick="switchQaSubTab('ask')" class="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs">
                    <i class="fa-solid fa-plus mr-1"></i> Gửi câu hỏi ngay
                </button>
            </div>
        `;
        return;
    }

    // 4. Sắp xếp
    if (qaSortOrder === 'upvotes') {
        publicQuestions.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0) || b.id - a.id);
    } else {
        publicQuestions.sort((a, b) => b.id - a.id);
    }

    const myUpvotes = getQaMyUpvotes();
    const isAdmin = isQaAdminUser();
    const maxUpvotes = Math.max(...publicQuestions.map(q => q.upvotes || 0));

    let html = '';
    publicQuestions.forEach((qa, idx) => {
        const isUpvoted = myUpvotes.includes(qa.id);
        const hasAnswer = !!qa.answer;
        const topicConf = QA_TOPICS_CONFIG[qa.topic] || { name: qa.topicLabel || '#HọcTập', badge: 'bg-purple-100 text-purple-700 border-purple-200' };

        // Ghim câu hỏi nhiều quan tâm nhất
        const isHotPinned = (qaSortOrder === 'upvotes' && idx === 0 && (qa.upvotes || 0) >= 15);

        const statusBadge = hasAnswer 
            ? `<span class="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] px-2.5 py-0.5 rounded-full font-black flex items-center gap-1"><i class="fa-solid fa-check"></i> Đã giải đáp</span>`
            : `<span class="bg-amber-100 text-amber-800 border border-amber-200 text-[10px] px-2.5 py-0.5 rounded-full font-black flex items-center gap-1"><i class="fa-solid fa-hourglass-half"></i> Đang chờ giải đáp</span>`;

        // Phần phản hồi của thầy cô
        let answerBlock = '';
        if (hasAnswer) {
            answerBlock = `
                <div class="mt-3.5 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 p-3.5 rounded-2xl border border-blue-200/80 shadow-2xs">
                    <div class="flex items-center justify-between mb-1.5">
                        <div class="flex items-center gap-2">
                            <div class="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs shadow-xs">
                                🎓
                            </div>
                            <span class="text-xs font-black text-blue-900">${qa.answeredBy || 'Phản hồi chính thức từ Nhà trường'}</span>
                        </div>
                        <span class="text-[10px] text-blue-500 font-bold">${qa.answeredAt || ''}</span>
                    </div>
                    <p class="text-xs sm:text-sm text-slate-800 leading-relaxed pl-8 font-medium">${qa.answer}</p>
                </div>
            `;
        }

        // Bảng điều khiển dành riêng cho Admin/Giáo viên để trả lời hoặc xóa câu hỏi
        let adminActionBlock = '';
        if (isAdmin) {
            adminActionBlock = `
                <div class="mt-3 pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-xs">
                    <span class="text-[11px] font-black text-amber-700 flex items-center gap-1">
                        <i class="fa-solid fa-user-shield"></i> Quyền Quản trị viên
                    </span>
                    <div class="flex items-center gap-2 self-end sm:self-auto">
                        <button type="button" onclick="toggleAdminReplyBox(${qa.id})" class="px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold transition flex items-center gap-1">
                            <i class="fa-solid fa-reply"></i>
                            <span>${hasAnswer ? 'Sửa câu trả lời' : 'Trả lời học sinh'}</span>
                        </button>
                        <button type="button" onclick="deleteQaQuestion(${qa.id})" class="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-bold transition" title="Xóa câu hỏi này">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
                <!-- Box nhập câu trả lời của Admin (ẩn/hiện) -->
                <div id="qa-admin-reply-box-${qa.id}" class="hidden mt-2 p-3 bg-purple-50/80 rounded-xl border border-purple-200 space-y-2">
                    <div class="flex items-center gap-2">
                        <span class="text-[11px] font-bold text-slate-600 shrink-0">Tư cách phản hồi:</span>
                        <select id="qa-admin-role-${qa.id}" class="text-xs font-bold border rounded-lg p-1 bg-white text-purple-800">
                            <option value="Ban Giám Hiệu Nhà Trường">Ban Giám Hiệu</option>
                            <option value="Phòng Tư Vấn Tâm Lý Học Đường">Phòng Tư Vấn Tâm Lý</option>
                            <option value="Ban Chấp Hành Đoàn Trường">Ban Chấp Hành Đoàn Trường</option>
                            <option value="Thầy/Cô Giáo Viên Bộ Môn">Giáo Viên Bộ Môn</option>
                        </select>
                    </div>
                    <textarea id="qa-admin-text-${qa.id}" rows="3" class="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-purple-200 bg-white outline-none focus:ring-1 focus:ring-purple-400" placeholder="Nhập câu trả lời ân cần, chi tiết gửi tới học sinh...">${qa.answer || ''}</textarea>
                    <div class="flex justify-end gap-2">
                        <button type="button" onclick="toggleAdminReplyBox(${qa.id})" class="px-3 py-1 text-xs text-slate-500 font-bold hover:bg-slate-200 rounded-lg">Hủy</button>
                        <button type="button" onclick="submitAdvancedAnswer(${qa.id})" class="px-4 py-1.5 text-xs font-black bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-sm">
                            <i class="fa-solid fa-check mr-1"></i> Lưu & Xuất bản
                        </button>
                    </div>
                </div>
            `;
        }

        html += `
            <div class="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-xs border ${isHotPinned ? 'border-amber-300 ring-2 ring-amber-200/50' : 'border-purple-100'} transition hover:shadow-md relative overflow-hidden">
                ${isHotPinned ? `
                    <div class="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black px-3 py-0.5 rounded-bl-xl shadow-xs flex items-center gap-1 uppercase tracking-wider">
                        <span>🔥 Quan tâm nhất</span>
                    </div>
                ` : ''}

                <!-- Header card: Avatar + Nickname + Tags -->
                <div class="flex items-center justify-between gap-2 mb-2.5">
                    <div class="flex items-center gap-2.5">
                        <div class="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-lg shadow-2xs shrink-0">
                            ${qa.authorAvatar || '🦉'}
                        </div>
                        <div>
                            <div class="flex items-center gap-2 flex-wrap">
                                <h4 class="font-black text-xs sm:text-sm text-slate-800">${qa.authorName || 'Học sinh Ẩn danh'}</h4>
                                <span class="text-[10px] font-black px-2 py-0.5 rounded-full border ${topicConf.badge}">
                                    ${topicConf.name}
                                </span>
                            </div>
                            <span class="text-[10px] text-slate-400 font-medium">${qa.timestamp} • Gửi đến: <b>${qa.recipientLabel || 'Bảng tin chung'}</b></span>
                        </div>
                    </div>
                    ${statusBadge}
                </div>

                <!-- Nội dung câu hỏi -->
                <p class="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed my-2 pl-1">
                    "${qa.question}"
                </p>

                <!-- Câu trả lời của thầy cô (nếu có) -->
                ${answerBlock}

                <!-- Thanh hành động: Cùng thắc mắc (Upvote) -->
                <div class="mt-3.5 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                    <button type="button" onclick="toggleUpvote(${qa.id})" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition transform active:scale-95 ${isUpvoted ? 'bg-purple-600 text-white shadow-xs' : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200'}">
                        <i class="fa-solid fa-thumbs-up ${isUpvoted ? 'text-yellow-300' : 'text-purple-500'}"></i>
                        <span>Cùng thắc mắc</span>
                        <span class="px-1.5 py-0.2 rounded-full ${isUpvoted ? 'bg-white/20 text-white' : 'bg-purple-200 text-purple-800'} text-[11px] font-black">${qa.upvotes || 0}</span>
                    </button>
                    <span class="text-[11px] text-slate-400 font-bold">Mã tra cứu: <code class="text-purple-600 font-mono font-bold">${qa.lookupCode || 'QA-0000'}</code></span>
                </div>

                <!-- Admin Action Block -->
                ${adminActionBlock}
            </div>
        `;
    });

    container.innerHTML = html;
}

// Bật/tắt hộp trả lời của Admin
function toggleAdminReplyBox(qaId) {
    const box = document.getElementById(`qa-admin-reply-box-${qaId}`);
    if (box) box.classList.toggle('hidden');
}

// Admin lưu câu trả lời
function submitAdvancedAnswer(qaId) {
    const roleSelect = document.getElementById(`qa-admin-role-${qaId}`);
    const textInput = document.getElementById(`qa-admin-text-${qaId}`);
    if (!textInput) return;

    const answer = textInput.value.trim();
    if (!answer) {
        alert("Vui lòng nhập nội dung câu trả lời!");
        return;
    }

    const answeredBy = roleSelect ? roleSelect.value : 'Ban Giám Hiệu Nhà Trường';
    const item = qaList.find(q => q.id === qaId);
    if (item) {
        item.answer = answer;
        item.answeredBy = answeredBy;
        item.answeredAt = new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
        localStorage.setItem('school_qa', JSON.stringify(qaList));
        showAuthToast("Đã lưu và xuất bản câu trả lời thành công!");
        renderQA();
        renderAdminQaPanel();
    }
}

// Admin xóa câu hỏi
function deleteQaQuestion(qaId) {
    if (!confirm("Bạn có chắc chắn muốn xóa câu hỏi này khỏi hệ thống?")) return;
    qaList = qaList.filter(q => q.id !== qaId);
    localStorage.setItem('school_qa', JSON.stringify(qaList));
    showAuthToast("Đã xóa câu hỏi.");
    renderQA();
    renderAdminQaPanel();
}

// Nâng cấp hàm tra cứu: Cho phép Admin nhập câu trả lời trực tiếp ngay tại đây
function performQaLookup() {
    const input = document.getElementById('qa-lookup-code-input');
    const resultBox = document.getElementById('qa-lookup-result');
    if (!input || !resultBox) return;

    const rawCode = input.value.trim().toUpperCase();
    if (!rawCode) {
        alert("Vui lòng nhập mã tra cứu (VD: QA-DGSM)!");
        return;
    }

    const item = qaList.find(q => q.lookupCode && q.lookupCode.toUpperCase() === rawCode);
    const isAdmin = typeof isQaAdminUser === 'function' ? isQaAdminUser() : false;

    resultBox.classList.remove('hidden');
    if (!item) {
        resultBox.innerHTML = `
            <div class="bg-red-50 p-4 rounded-2xl border border-red-200 text-center space-y-1">
                <i class="fa-solid fa-circle-exclamation text-red-500 text-xl mb-1"></i>
                <h4 class="font-black text-red-800 text-xs sm:text-sm">Không tìm thấy câu hỏi với mã "${rawCode}"</h4>
                <p class="text-xs text-red-600">Vui lòng kiểm tra lại chính xác mã tra cứu được cấp khi gửi câu hỏi kín nhé.</p>
            </div>
        `;
        return;
    }

    const hasAnswer = !!item.answer;
    
    // Nếu là Admin, hiển thị thêm form nhập/sửa câu trả lời ngay bên dưới câu hỏi kín
    let adminReplySection = '';
    if (isAdmin) {
        adminReplySection = `
            <div class="mt-4 pt-4 border-t border-purple-200 space-y-2 bg-purple-100/60 p-3.5 rounded-2xl">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-black text-purple-900 flex items-center gap-1.5">
                        <i class="fa-solid fa-user-shield text-amber-600"></i> Khung Trả Lời Dành Cho Quản Trị Viên (Admin)
                    </span>
                    <select id="lookup-admin-role-${item.id}" class="text-xs font-bold border rounded-lg p-1 bg-white text-purple-800">
                        <option value="Ban Giám Hiệu Nhà Trường">Ban Giám Hiệu</option>
                        <option value="Phòng Tư Vấn Tâm Lý Học Đường">Phòng Tư Vấn Tâm Lý</option>
                        <option value="Ban Chấp Hành Đoàn Trường">Ban Chấp Hành Đoàn Trường</option>
                        <option value="Thầy/Cô Giáo Viên">Thầy/Cô Giáo Viên</option>
                    </select>
                </div>
                <textarea id="lookup-admin-text-${item.id}" rows="3" class="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-purple-200 bg-white outline-none focus:ring-1 focus:ring-purple-400 font-medium" placeholder="Nhập câu trả lời ân cần, chi tiết gửi tới học sinh...">${item.answer || ''}</textarea>
                <div class="flex justify-end">
                    <button type="button" onclick="submitLookupAdminAnswer(${item.id})" class="px-4 py-2 text-xs font-black bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-sm transition active:scale-95 flex items-center gap-1.5">
                        <i class="fa-solid fa-check"></i> <span>Lưu & Gửi Phản Hồi</span>
                    </button>
                </div>
            </div>
        `;
    }

    resultBox.innerHTML = `
        <div class="bg-gradient-to-r from-purple-50 via-white to-pink-50 p-4 sm:p-5 rounded-2xl border border-purple-200 shadow-sm space-y-3">
            <div class="flex items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                <div class="flex items-center gap-2">
                    <span class="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-sm">
                        ${item.authorAvatar || '🔑'}
                    </span>
                    <div>
                        <h4 class="font-black text-xs sm:text-sm text-slate-800">Mã tra cứu: <span class="text-purple-700 font-mono">${item.lookupCode}</span></h4>
                        <span class="text-[10px] text-slate-400">Gửi lúc: ${item.timestamp} • Người nhận: <b>${item.recipientLabel || 'Nhà trường'}</b></span>
                    </div>
                </div>
                ${hasAnswer 
                    ? '<span class="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-200">✅ Đã có câu trả lời</span>' 
                    : '<span class="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-200">⏳ Đang chờ thầy cô giải đáp</span>'}
            </div>

            <div>
                <span class="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-1">Nội dung câu hỏi của học sinh:</span>
                <p class="text-xs sm:text-sm text-slate-800 font-medium bg-white p-3 rounded-xl border border-purple-100 leading-relaxed">
                    "${item.question}"
                </p>
            </div>

            ${hasAnswer ? `
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-3.5 rounded-xl border border-blue-200">
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-xs font-black text-blue-900 flex items-center gap-1.5">
                            🎓 ${item.answeredBy || 'Phản hồi từ Thầy/Cô'}
                        </span>
                        <span class="text-[10px] text-blue-500 font-bold">${item.answeredAt || ''}</span>
                    </div>
                    <p class="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium pl-6">
                        ${item.answer}
                    </p>
                </div>
            ` : ''}

            ${adminReplySection}
        </div>
    `;
}

// Hàm lưu câu trả lời của Admin từ khung tra cứu
function submitLookupAdminAnswer(qaId) {
    const roleSelect = document.getElementById(`lookup-admin-role-${qaId}`);
    const textInput = document.getElementById(`lookup-admin-text-${qaId}`);
    if (!textInput) return;

    const answer = textInput.value.trim();
    if (!answer) {
        alert("Vui lòng nhập nội dung câu trả lời!");
        return;
    }

    const answeredBy = roleSelect ? roleSelect.value : 'Ban Giám Hiệu Nhà Trường';
    const item = qaList.find(q => q.id === qaId);
    if (item) {
        item.answer = answer;
        item.answeredBy = answeredBy;
        item.answeredAt = new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
        localStorage.setItem('school_qa', JSON.stringify(qaList));
        
        if (typeof showAuthToast === 'function') {
            showAuthToast("Đã gửi câu trả lời cho câu hỏi kín thành công!", 'fa-circle-check', 'success');
        } else {
            alert("Đã lưu câu trả lời thành công!");
        }
        
        performQaLookup();
        if (typeof renderQA === 'function') renderQA();
        if (typeof renderAdminQaPanel === 'function') renderAdminQaPanel();
    }
}

window.performQaLookup = performQaLookup;
window.submitLookupAdminAnswer = submitLookupAdminAnswer;

// Hiển thị lịch sử các mã tra cứu đã lưu trên máy
function renderQaDeviceHistory() {
    const listEl = document.getElementById('qa-my-history-list');
    if (!listEl) return;

    const myCodes = getQaMySavedCodes();
    if (myCodes.length === 0) {
        listEl.innerHTML = '<p class="text-xs text-slate-400 italic">Chưa có câu hỏi kín nào được gửi từ thiết bị này.</p>';
        return;
    }

    let html = '';
    myCodes.forEach(code => {
        const item = qaList.find(q => q.lookupCode === code);
        const hasAnswer = item && !!item.answer;
        const qSnippet = item ? (item.question.length > 50 ? item.question.substring(0, 50) + '...' : item.question) : 'Câu hỏi kín';

        html += `
            <div class="bg-slate-50 hover:bg-purple-50/60 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between gap-2 transition cursor-pointer" onclick="quickFillLookupCode('${code}')">
                <div class="flex items-center gap-2 overflow-hidden">
                    <code class="text-xs font-black text-purple-700 font-mono bg-white px-2 py-0.5 rounded border border-purple-200 shrink-0">${code}</code>
                    <span class="text-xs text-slate-600 truncate">${qSnippet}</span>
                </div>
                <div class="shrink-0 flex items-center gap-1.5">
                    ${hasAnswer 
                        ? '<span class="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Đã trả lời</span>' 
                        : '<span class="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">Đang chờ</span>'}
                    <i class="fa-solid fa-chevron-right text-slate-400 text-xs"></i>
                </div>
            </div>
        `;
    });

    listEl.innerHTML = html;
}

function quickFillLookupCode(code) {
    const input = document.getElementById('qa-lookup-code-input');
    if (input) {
        input.value = code;
        performQaLookup();
    }
}

// Điều khiển tab con trong giao diện Admin
function setAdminQaTab(tab) {
    qaCurrentAdminTab = tab;
    const pendingBtn = document.getElementById('qa-admin-tab-btn-pending');
    const privateBtn = document.getElementById('qa-admin-tab-btn-private');

    if (pendingBtn && privateBtn) {
        if (tab === 'pending') {
            pendingBtn.className = "px-3 py-1.5 rounded-lg bg-white text-slate-800 shadow-xs font-bold";
            privateBtn.className = "px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-800 font-bold";
        } else {
            privateBtn.className = "px-3 py-1.5 rounded-lg bg-white text-slate-800 shadow-xs font-bold";
            pendingBtn.className = "px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-800 font-bold";
        }
    }
    renderAdminQaPanel();
}

// Hiển thị danh sách kiểm duyệt cho Admin
function renderAdminQaPanel() {
    const listEl = document.getElementById('qa-admin-items-list');
    const pendingCountEl = document.getElementById('qa-admin-count-pending');
    const privateCountEl = document.getElementById('qa-admin-count-private');

    const pendingItems = qaList.filter(q => q.status === 'pending');
    const privateItems = qaList.filter(q => q.isPrivate);

    if (pendingCountEl) pendingCountEl.textContent = pendingItems.length;
    if (privateCountEl) privateCountEl.textContent = privateItems.length;

    if (!listEl) return;

    if (qaCurrentAdminTab === 'pending') {
        if (pendingItems.length === 0) {
            listEl.innerHTML = '<p class="text-xs text-slate-400 text-center py-6">Hiện không có câu hỏi nào cần kiểm duyệt 🎉</p>';
            return;
        }

        let html = '';
        pendingItems.forEach(q => {
            html += `
                <div class="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="text-base">${q.authorAvatar || '🦉'}</span>
                            <span class="font-black text-xs text-slate-800">${q.authorName}</span>
                            <span class="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">${q.flaggedReason || 'Cần duyệt bài'}</span>
                        </div>
                        <span class="text-[10px] text-slate-400 font-medium">${q.timestamp}</span>
                    </div>
                    <p class="text-xs sm:text-sm text-slate-800 bg-white p-3 rounded-xl border border-amber-200 font-medium leading-relaxed">
                        "${q.question}"
                    </p>
                    <div class="flex items-center justify-end gap-2 pt-1">
                        <button type="button" onclick="rejectQaQuestion(${q.id})" class="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-xs font-bold transition">
                            <i class="fa-solid fa-xmark mr-1"></i> Từ chối & Xóa
                        </button>
                        <button type="button" onclick="approveQaQuestion(${q.id})" class="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition">
                            <i class="fa-solid fa-check mr-1"></i> Duyệt cho phép hiển thị
                        </button>
                    </div>
                </div>
            `;
        });
        listEl.innerHTML = html;
    } else {
        // Tab câu hỏi kín
        if (privateItems.length === 0) {
            listEl.innerHTML = '<p class="text-xs text-slate-400 text-center py-6">Chưa có câu hỏi kín nào gửi đến Nhà trường.</p>';
            return;
        }

        let html = '';
        privateItems.forEach(q => {
            const hasAnswer = !!q.answer;
            html += `
                <div class="bg-purple-50/70 p-4 rounded-2xl border border-purple-200 space-y-2.5">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="text-base">${q.authorAvatar || '🔑'}</span>
                            <span class="font-black text-xs text-slate-800">${q.authorName}</span>
                            <code class="text-[11px] font-mono font-black text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-200">${q.lookupCode}</code>
                            <span class="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full">${q.recipientLabel}</span>
                        </div>
                        ${hasAnswer 
                            ? '<span class="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full">Đã trả lời</span>' 
                            : '<span class="text-[10px] bg-amber-100 text-amber-800 font-black px-2 py-0.5 rounded-full">Đang chờ giải đáp</span>'}
                    </div>
                    <p class="text-xs sm:text-sm text-slate-800 bg-white p-3 rounded-xl border border-purple-100 font-medium leading-relaxed">
                        "${q.question}"
                    </p>
                    ${hasAnswer ? `
                        <div class="bg-blue-50 p-3 rounded-xl border border-blue-200 text-xs">
                            <span class="font-black text-blue-900 block mb-0.5">Phản hồi của ${q.answeredBy}:</span>
                            <p class="text-slate-700">${q.answer}</p>
                        </div>
                    ` : ''}
                    <div class="flex items-center justify-end gap-2 pt-1">
                        <button type="button" onclick="toggleAdminReplyBox(${q.id})" class="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black shadow-xs transition">
                            <i class="fa-solid fa-reply mr-1"></i> ${hasAnswer ? 'Sửa phản hồi' : 'Nhập câu trả lời riêng'}
                        </button>
                    </div>
                    <!-- Box nhập câu trả lời của Admin (ẩn/hiện) -->
                    <div id="qa-admin-reply-box-${q.id}" class="hidden mt-2 p-3 bg-white rounded-xl border border-purple-200 space-y-2">
                        <div class="flex items-center gap-2">
                            <span class="text-[11px] font-bold text-slate-600 shrink-0">Tư cách phản hồi:</span>
                            <select id="qa-admin-role-${q.id}" class="text-xs font-bold border rounded-lg p-1 bg-white text-purple-800">
                                <option value="Phòng Tư Vấn Tâm Lý Học Đường">Phòng Tư Vấn Tâm Lý</option>
                                <option value="Ban Giám Hiệu Nhà Trường">Ban Giám Hiệu</option>
                                <option value="Ban Chấp Hành Đoàn Trường">Ban Chấp Hành Đoàn Trường</option>
                                <option value="Thầy/Cô Giáo Viên">Thầy/Cô Giáo Viên</option>
                            </select>
                        </div>
                        <textarea id="qa-admin-text-${q.id}" rows="3" class="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-purple-200 bg-slate-50 outline-none focus:ring-1 focus:ring-purple-400" placeholder="Nhập câu trả lời riêng gửi tới học sinh...">${q.answer || ''}</textarea>
                        <div class="flex justify-end gap-2">
                            <button type="button" onclick="toggleAdminReplyBox(${q.id})" class="px-3 py-1 text-xs text-slate-500 font-bold hover:bg-slate-200 rounded-lg">Hủy</button>
                            <button type="button" onclick="submitAdvancedAnswer(${q.id})" class="px-4 py-1.5 text-xs font-black bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-sm">
                                <i class="fa-solid fa-check mr-1"></i> Lưu phản hồi
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        listEl.innerHTML = html;
    }
}

// Duyệt câu hỏi chờ duyệt
function approveQaQuestion(qaId) {
    const item = qaList.find(q => q.id === qaId);
    if (item) {
        item.status = 'approved';
        localStorage.setItem('school_qa', JSON.stringify(qaList));
        showAuthToast("Đã duyệt câu hỏi lên bảng tin!");
        renderAdminQaPanel();
        renderQA();
    }
}

// Từ chối câu hỏi chờ duyệt
function rejectQaQuestion(qaId) {
    if (!confirm("Từ chối và xóa vĩnh viễn câu hỏi này?")) return;
    qaList = qaList.filter(q => q.id !== qaId);
    localStorage.setItem('school_qa', JSON.stringify(qaList));
    showAuthToast("Đã từ chối câu hỏi.");
    renderAdminQaPanel();
    renderQA();
}

// Khởi tạo Module Hỏi Đáp
function initQaModule() {
    randomizeCurrentPseudonym();
    renderQA();
    updateQaStats();
    updateQaAdminUI();
}

// 5. Quản lý lớp, học sinh & Cài đặt
function renderSettings() {
    const list = document.getElementById('classes-list');
    if(!list) return;
    list.innerHTML = '';
    classes.forEach(c => {
        list.innerHTML += `
            <div class="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2 text-sm border border-gray-200">
                <span class="font-bold text-gray-700">${c}</span>
                <button onclick="removeClass('${c}')" class="text-gray-400 hover:text-red-500 transition"><i class="fa-solid fa-xmark"></i></button>
            </div>
        `;
    });
}

function removeClass(className) {
    if(confirm(`Bạn có chắc muốn xóa lớp ${className}?`)) {
        classes = classes.filter(c => c !== className);
        localStorage.setItem('thiduaso_classes', JSON.stringify(classes));
        initApp();
    }
}

function renderStudents() {
    const manageSelect = document.getElementById('manage-class-select');
    const className = manageSelect ? manageSelect.value : '';
    const form = document.getElementById('add-student-form');
    const list = document.getElementById('students-list');
    
    if(!list) return;
    list.innerHTML = '';
    
    if(!className) {
        if(form) form.classList.add('hidden');
        return;
    }
    
    if(form) form.classList.remove('hidden');
    
    if(!students[className] || students[className].length === 0) {
        list.innerHTML = '<p class="text-gray-500 text-sm italic">Lớp này chưa có học sinh nào.</p>';
        return;
    }

    students[className].sort().forEach(s => {
        list.innerHTML += `
            <div class="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-100">
                <span class="text-sm font-medium text-gray-700"><i class="fa-solid fa-user text-gray-400 mr-2"></i> ${s}</span>
                <button onclick="removeStudent('${className}', '${s}')" class="text-gray-400 hover:text-red-500 px-2 transition"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `;
    });
}

function removeStudent(className, studentName) {
    if(confirm(`Xóa học sinh ${studentName} khỏi lớp ${className}?`)) {
        students[className] = students[className].filter(s => s !== studentName);
        localStorage.setItem('thiduaso_students', JSON.stringify(students));
        renderStudents();
        updateStudentSelect();
    }
}

function updateStudentSelect() {
    const classSelect = document.getElementById('class-select');
    const className = classSelect ? classSelect.value : '';
    const container = document.getElementById('student-select-container');
    const select = document.getElementById('student-select');
    
    if(!container || !select) return;

    if(!className || !students[className] || students[className].length === 0) {
        container.classList.add('hidden');
        select.innerHTML = '';
        return;
    }
    
    container.classList.remove('hidden');
    select.innerHTML = '<option value="">-- Cả lớp (Không chọn cá nhân) --</option>';
    
    students[className].sort().forEach(s => {
        select.innerHTML += `<option value="${s}">${s}</option>`;
    });
}

function renderLeaderboard() {
    const container = document.getElementById('leaderboard-container');
    if(!container) return;
    container.innerHTML = ''; 

    let leaderboard = classes.map(className => {
        let currentPoints = STARTING_POINTS;
        let classViolations = violations.filter(v => v.class === className);
        classViolations.forEach(v => { currentPoints += v.penalty; });
        return { name: className, points: currentPoints, count: classViolations.length };
    });

    leaderboard.sort((a, b) => b.points - a.points);

    leaderboard.forEach((cls, index) => {
        let rankIcon = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `<span class="text-gray-400 font-bold ml-1">${index + 1}</span>`;
        container.innerHTML += `
            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center transform transition hover:scale-[1.02]">
                <div class="flex items-center">
                    <div class="w-10 text-2xl text-center mr-3">${rankIcon}</div>
                    <div>
                        <h3 class="font-bold text-lg text-gray-800">Lớp ${cls.name}</h3>
                        <p class="text-xs text-gray-500">${cls.count} lượt đánh giá</p>
                    </div>
                </div>
                <div class="text-right">
                    <span class="text-xl font-black ${cls.points < 90 ? 'text-red-500' : 'text-green-500'}">${cls.points}</span>
                    <span class="text-xs text-gray-400 block">điểm</span>
                </div>
            </div>
        `;
    });
}

function renderStats() {
    const container = document.getElementById('stats-container');
    if(!container) return;
    const counts = {};
    let totalNegative = 0;
    violations.forEach(v => {
        if(v.penalty < 0) {
            counts[v.rule] = (counts[v.rule] || 0) + 1;
            totalNegative++;
        }
    });

    if (totalNegative === 0) {
        container.classList.add('hidden');
        return;
    }

    let maxRule = '';
    let maxCount = 0;
    for(let rule in counts) {
        if(counts[rule] > maxCount) {
            maxCount = counts[rule];
            maxRule = rule;
        }
    }

    const percent = Math.round((maxCount / totalNegative) * 100);
    container.classList.remove('hidden');
    container.innerHTML = `<strong>📈 Thống kê:</strong> Lỗi vi phạm nhiều nhất toàn trường tuần này là <strong>"${maxRule}"</strong> (chiếm ${percent}% tổng số lỗi).`;
}

function resetData() {
    if(confirm("⚠️ CẢNH BÁO: Xóa toàn bộ lịch sử điểm số để bắt đầu tuần mới?")) {
        violations = [];
        localStorage.removeItem('thiduaso_violations');
        initApp();
    }
}

// ==============================================================================
// CÁC HÀM XÁC THỰC, ĐĂNG NHẬP, ĐĂNG KÝ & PHÂN QUYỀN (AUTH & RBAC)
// ==============================================================================
function initAuthModule() {
    renderAuthHeaderUI();
    renderHomeWelcomeBanner();
    updateAdminPermissionsUI();
    populateRegisterClasses();

    // Tự động đóng dropdown người dùng khi bấm ra ngoài
    if (!window._authClickBound) {
        window._authClickBound = true;
        document.addEventListener('click', function(e) {
            const menu = document.getElementById('user-dropdown-menu');
            const btn = document.getElementById('user-profile-chip-btn');
            if (menu && !menu.classList.contains('hidden')) {
                if (!menu.contains(e.target) && (!btn || !btn.contains(e.target))) {
                    closeUserDropdown();
                }
            }
        });
    }
}

function renderAuthHeaderUI() {
    const container = document.getElementById('auth-header-container');
    if (!container) return;

    const user = (typeof currentAuthUser !== 'undefined' && currentAuthUser) || (typeof currentUser !== 'undefined' && currentUser);

    if (!user) {
        container.innerHTML = `
            <button type="button" onclick="openAuthModal('login')" class="bg-indigo-950/40 hover:bg-indigo-950/60 text-white font-bold text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-md shadow-xs transition transform active:scale-95 border border-white/20">
                <i class="fa-solid fa-right-to-bracket text-yellow-300"></i>
                <span>Đăng nhập</span>
            </button>
        `;
    } else {
        const shortName = (user.name || '').split(' ').pop() || user.username || 'User';
        let badgeBg = "bg-amber-400 text-amber-950";
        if (user.role === 'teacher') badgeBg = "bg-blue-300 text-blue-950";
        if (user.role === 'student') badgeBg = "bg-emerald-300 text-emerald-950";

        const activeBadgeIcon = (user.role === 'student' && typeof myProfile !== 'undefined' && myProfile.activeBadge && typeof BADGES_CONFIG !== 'undefined')
            ? (BADGES_CONFIG.find(b => b.id === myProfile.activeBadge)?.icon || '')
            : '';

        container.innerHTML = `
            <div class="relative">
                <button type="button" id="user-profile-chip-btn" onclick="toggleUserDropdown()" class="bg-indigo-950/40 hover:bg-indigo-950/60 text-white font-bold text-xs pl-1.5 pr-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-md shadow-xs transition border border-white/20 active:scale-95">
                    <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0">
                        ${user.avatar || (user.role === 'admin' ? '👑' : '🎒')}
                    </span>
                    <span class="max-w-[95px] sm:max-w-[130px] truncate text-left font-bold text-xs flex items-center gap-1">
                        <span>${shortName}</span>
                        ${activeBadgeIcon ? `<span class="text-xs" title="Huy hiệu đại diện">${activeBadgeIcon}</span>` : ''}
                    </span>
                    <span class="text-[9px] font-black px-1.5 py-0.5 rounded-full ${badgeBg} hidden sm:inline-block">
                        ${user.role === 'admin' ? 'Admin' : (user.role === 'teacher' ? 'GV' : (user.className || 'HS'))}
                    </span>
                    <i class="fa-solid fa-chevron-down text-[9px] opacity-75"></i>
                </button>
            </div>
        `;
    }

    updateUserDropdownContent();
}

function updateUserDropdownContent() {
    const nameEl = document.getElementById('user-dropdown-name');
    const badgeEl = document.getElementById('user-dropdown-badge');
    const avatarEl = document.getElementById('user-dropdown-avatar');
    const logoutBtn = document.getElementById('user-dropdown-logout-btn');

    const user = (typeof currentAuthUser !== 'undefined' && currentAuthUser) || (typeof currentUser !== 'undefined' && currentUser);

    if (user) {
        if (nameEl) nameEl.innerText = user.name;
        if (avatarEl) avatarEl.innerText = user.avatar || (user.role === 'admin' ? '👑' : '🎒');
        if (badgeEl) {
            badgeEl.innerText = user.roleLabel || (user.role === 'admin' ? 'Quản Trị Viên' : (user.role === 'teacher' ? 'Giáo Viên' : 'Học Sinh'));
            badgeEl.className = user.role === 'admin' 
                ? "bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-200"
                : (user.role === 'teacher' 
                    ? "bg-blue-100 text-blue-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-blue-200"
                    : "bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200");
        }
        if (logoutBtn) logoutBtn.classList.remove('hidden');
    } else {
        if (nameEl) nameEl.innerText = "Khách (Chưa đăng nhập)";
        if (avatarEl) avatarEl.innerText = "👤";
        if (badgeEl) {
            badgeEl.innerText = "Chế độ xem chung";
            badgeEl.className = "bg-gray-100 text-gray-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-gray-200";
        }
        if (logoutBtn) logoutBtn.classList.add('hidden');
    }
}

function toggleUserDropdown() {
    const menu = document.getElementById('user-dropdown-menu');
    if (!menu) return;
    updateUserDropdownContent();
    menu.classList.toggle('hidden');
}

function closeUserDropdown() {
    const menu = document.getElementById('user-dropdown-menu');
    if (menu) menu.classList.add('hidden');
}

function renderHomeWelcomeBanner() {
    const banner = document.getElementById('home-auth-banner');
    if (!banner) return;

    const user = (typeof currentAuthUser !== 'undefined' && currentAuthUser) || (typeof currentUser !== 'undefined' && currentUser);

    if (!user) {
        banner.className = "bg-white/80 backdrop-blur-xl rounded-3xl p-4 sm:p-5 border border-white/90 shadow-md shadow-indigo-100/40 flex items-center justify-between transition hover:shadow-lg";
        banner.innerHTML = `
            <div class="flex items-center gap-3 sm:gap-4">
                <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200/60 shadow-inner flex items-center justify-center text-3xl shrink-0 p-1">
                    🏫
                </div>
                <div>
                    <h3 class="font-black text-base sm:text-lg text-slate-800 leading-tight">Chào mừng đến Sổ Tay Học Đường!</h3>
                    <p class="text-xs text-slate-500 font-medium mt-0.5">Trường THPT Nam Lương Sơn • Đăng nhập để đồng bộ dữ liệu học tập & kết quả thi.</p>
                </div>
            </div>
            <button onclick="openAuthModal('login')" class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-2xl text-xs font-black transition active:scale-95 flex items-center gap-1.5 shrink-0 shadow-md">
                <i class="fa-solid fa-right-to-bracket text-xs"></i>
                <span>Đăng nhập</span>
            </button>
        `;
    } else {
        const isAdmin = user.role === 'admin';
        banner.className = "bg-white/80 backdrop-blur-xl rounded-3xl p-4 sm:p-5 border border-white/90 shadow-md shadow-indigo-100/40 flex items-center justify-between transition hover:shadow-lg";
        banner.innerHTML = `
            <div class="flex items-center gap-3 sm:gap-4">
                <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${isAdmin ? 'from-amber-50 to-orange-100 border-amber-200/60' : 'from-emerald-50 to-teal-100 border-emerald-200/60'} border shadow-inner flex items-center justify-center text-3xl shrink-0 p-1">
                    ${user.avatar || (isAdmin ? '👑' : '🎒')}
                </div>
                <div>
                    <h3 class="font-black text-base sm:text-lg text-slate-800 leading-tight">
                        ${isAdmin ? 'Chào mừng bạn trở lại! 👋' : `Xin chào, ${user.name}! 🌟`}
                    </h3>
                    <p class="text-xs text-slate-500 font-bold mt-0.5 flex items-center gap-1">
                        ${isAdmin ? 'Chúc bạn một ngày làm việc và quản lý học đường thật hiệu quả 🚀' : `Học sinh Lớp ${user.className || '12A1'} • Chúc bạn một ngày học tập hứng khởi!`}
                    </p>
                </div>
            </div>
        `;
    }
}

function updateAdminPermissionsUI() {
    const isAdmin = !!(currentAuthUser && currentAuthUser.role === 'admin');
    const isStudent = !!(currentAuthUser && currentAuthUser.role === 'student');

    // 0. Nút "Cài đặt Data" ở Trang chủ: Ẩn hoàn toàn khi là học sinh hoặc khách, chỉ hiển thị cho Admin
    const homeAdminSec = document.getElementById('home-admin-section');
    if (homeAdminSec) {
        if (isAdmin) {
            homeAdminSec.classList.remove('hidden');
        } else {
            homeAdminSec.classList.add('hidden');
        }
    }

    // 1. Phân quyền trong Thời khóa biểu: Học sinh không thể chỉnh sửa TKB
    const tkbAdminCard = document.getElementById('tkb-admin-manage-card');
    const tkbAllowed = document.getElementById('tkb-admin-allowed-box');
    const tkbLocked = document.getElementById('tkb-admin-locked-box');
    if (tkbAdminCard) {
        if (isStudent) {
            // Học sinh hoàn toàn không thấy khu vực chỉnh sửa/quản trị TKB
            tkbAdminCard.classList.add('hidden');
        } else {
            tkbAdminCard.classList.remove('hidden');
            if (isAdmin) {
                if (tkbAllowed) tkbAllowed.classList.remove('hidden');
                if (tkbLocked) tkbLocked.classList.add('hidden');
            } else {
                if (tkbAllowed) tkbAllowed.classList.add('hidden');
                if (tkbLocked) tkbLocked.classList.remove('hidden');
            }
        }
    }

    // 2. Phân quyền trong Cài đặt Data
    const settingsAllowed = document.getElementById('settings-admin-allowed-box');
    const settingsLocked = document.getElementById('settings-admin-locked-box');
    if (settingsAllowed && settingsLocked) {
        if (isAdmin) {
            settingsAllowed.classList.remove('hidden');
            settingsLocked.classList.add('hidden');
        } else {
            settingsAllowed.classList.add('hidden');
            settingsLocked.classList.remove('hidden');
        }
    }

    // 3. Cập nhật phân quyền cho module Hỏi đáp ẩn danh
    if (typeof updateQaAdminUI === 'function') updateQaAdminUI();
}

function openAuthModal(tab = 'login') {
    const modal = document.getElementById('modal-auth');
    if (!modal) return;
    modal.classList.remove('hidden');
    switchAuthTab(tab);
    populateRegisterClasses();
    clearAuthErrors();
}

function closeAuthModal() {
    const modal = document.getElementById('modal-auth');
    if (modal) modal.classList.add('hidden');
}

function switchAuthTab(tab) {
    const tabLoginBtn = document.getElementById('tab-auth-login-btn');
    const tabRegBtn = document.getElementById('tab-auth-register-btn');
    const viewLogin = document.getElementById('auth-view-login');
    const viewReg = document.getElementById('auth-view-register');
    const title = document.getElementById('auth-modal-title');

    clearAuthErrors();

    if (tab === 'login') {
        if (tabLoginBtn) tabLoginBtn.className = "flex-1 py-3 text-center border-b-2 border-indigo-600 text-indigo-600 transition flex items-center justify-center gap-1.5 font-black";
        if (tabRegBtn) tabRegBtn.className = "flex-1 py-3 text-center border-b-2 border-transparent text-gray-500 hover:text-gray-800 transition flex items-center justify-center gap-1.5 font-bold";
        if (viewLogin) viewLogin.classList.remove('hidden');
        if (viewReg) viewReg.classList.add('hidden');
        if (title) title.innerText = "Đăng Nhập Tài Khoản";
    } else {
        if (tabLoginBtn) tabLoginBtn.className = "flex-1 py-3 text-center border-b-2 border-transparent text-gray-500 hover:text-gray-800 transition flex items-center justify-center gap-1.5 font-bold";
        if (tabRegBtn) tabRegBtn.className = "flex-1 py-3 text-center border-b-2 border-emerald-600 text-emerald-600 transition flex items-center justify-center gap-1.5 font-black";
        if (viewLogin) viewLogin.classList.add('hidden');
        if (viewReg) viewReg.classList.remove('hidden');
        if (title) title.innerText = "Đăng Ký Tài Khoản Mới";
    }
}

function clearAuthErrors() {
    const errLogin = document.getElementById('auth-login-error');
    const errReg = document.getElementById('auth-reg-error');
    if (errLogin) { errLogin.innerText = ''; errLogin.classList.add('hidden'); }
    if (errReg) { errReg.innerText = ''; errReg.classList.add('hidden'); }
}

function quickLoginAs(role) {
    let target = null;
    if (role === 'admin' || role === 'adim') {
        target = authAccounts.find(a => a.username === 'adim') 
              || authAccounts.find(a => a.role === 'admin') 
              || DEFAULT_AUTH_ACCOUNTS.find(a => a.username === 'adim')
              || DEFAULT_AUTH_ACCOUNTS.find(a => a.role === 'admin');
    } else if (role === 'student' || role === 'hocsinh') {
        target = authAccounts.find(a => a.username === 'hocsinh')
              || authAccounts.find(a => a.role === 'student') 
              || DEFAULT_AUTH_ACCOUNTS.find(a => a.role === 'student');
    } else if (role === 'teacher' || role === 'giaovien') {
        target = authAccounts.find(a => a.username === 'giaovien')
              || authAccounts.find(a => a.role === 'teacher')
              || DEFAULT_AUTH_ACCOUNTS.find(a => a.role === 'teacher');
    } else {
        target = authAccounts.find(a => a.role === role) || DEFAULT_AUTH_ACCOUNTS.find(a => a.role === role);
    }
    if (!target) return alert("Không tìm thấy tài khoản mẫu cho vai trò này!");

    loginUser(target);
    closeAuthModal();
    showAuthToast(`Đăng nhập thành công với vai trò ${target.roleLabel}!`, 'fa-circle-check', 'success');
}

async function handleAuthLoginSubmit(e) {
    if (e) e.preventDefault();
    clearAuthErrors();

    const usernameInput = document.getElementById('auth-login-username');
    const passwordInput = document.getElementById('auth-login-password');
    const errBox = document.getElementById('auth-login-error');

    const u = usernameInput ? usernameInput.value.trim().toLowerCase() : '';
    const p = passwordInput ? passwordInput.value : '';

    if (!u || !p) {
        if (errBox) {
            errBox.innerText = "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!";
            errBox.classList.remove('hidden');
        }
        return;
    }

    let matched = authAccounts.find(a => a.username.toLowerCase() === u && a.password === p);
    // Hỗ trợ cả 2 tên gọi phổ biến adim hoặc admin, học sinh, giáo viên
    if (!matched && (u === 'adim' || u === 'admin') && p === '123') {
        matched = DEFAULT_AUTH_ACCOUNTS.find(a => a.username === 'adim') || DEFAULT_AUTH_ACCOUNTS.find(a => a.role === 'admin');
    }
    if (!matched && u === 'hocsinh' && p === '123') {
        matched = DEFAULT_AUTH_ACCOUNTS.find(a => a.role === 'student');
    }
    if (!matched && u === 'giaovien' && p === '123') {
        matched = DEFAULT_AUTH_ACCOUNTS.find(a => a.role === 'teacher');
    }

    // Nếu máy này chưa có tài khoản, tự động tra cứu trực tiếp trên Cloud Firestore
    if (!matched && firestoreDb) {
        try {
            const doc = await firestoreDb.collection('accounts').doc(u).get();
            if (doc.exists) {
                const cloudAcc = doc.data();
                if (cloudAcc.password === p) {
                    matched = cloudAcc;
                    const idx = authAccounts.findIndex(a => a.username.toLowerCase() === u);
                    if (idx >= 0) authAccounts[idx] = matched;
                    else authAccounts.push(matched);
                    localStorage.setItem('school_auth_accounts', JSON.stringify(authAccounts));
                }
            }
        } catch (err) {
            console.warn("Tra cứu tài khoản Cloud:", err);
        }
    }

    if (!matched) {
        if (errBox) {
            errBox.innerText = "Tên đăng nhập hoặc mật khẩu không chính xác! (TK: adim / 123 hoặc hocsinh / 123)";
            errBox.classList.remove('hidden');
        }
        return;
    }

    loginUser(matched);
    closeAuthModal();
    showAuthToast(`Xin chào ${matched.name}! Đăng nhập thành công.`, 'fa-circle-check', 'success');
}

function handleAuthRegisterSubmit(e) {
    if (e) e.preventDefault();
    clearAuthErrors();

    const roleRadio = document.querySelector('input[name="register-role"]:checked');
    const role = roleRadio ? roleRadio.value : 'student';

    const nameInput = document.getElementById('auth-reg-name');
    const usernameInput = document.getElementById('auth-reg-username');
    const passwordInput = document.getElementById('auth-reg-password');
    const classSelect = document.getElementById('auth-reg-class-select');
    const subjectSelect = document.getElementById('auth-reg-subject-select');
    const errBox = document.getElementById('auth-reg-error');

    const name = nameInput ? nameInput.value.trim() : '';
    const u = usernameInput ? usernameInput.value.trim().toLowerCase().replace(/\s+/g, '') : '';
    const p = passwordInput ? passwordInput.value : '';
    const className = (role === 'student' && classSelect) ? classSelect.value : '';
    const subject = (role === 'teacher' && subjectSelect) ? subjectSelect.value : '';

    if (!name || !u || !p) {
        if (errBox) {
            errBox.innerText = "Vui lòng điền đầy đủ các thông tin bắt buộc!";
            errBox.classList.remove('hidden');
        }
        return;
    }

    if (u.length < 3) {
        if (errBox) {
            errBox.innerText = "Tên đăng nhập phải có ít nhất 3 ký tự!";
            errBox.classList.remove('hidden');
        }
        return;
    }

    if (authAccounts.some(a => a.username.toLowerCase() === u)) {
        if (errBox) {
            errBox.innerText = `Tên đăng nhập "${u}" đã có người sử dụng. Vui lòng chọn tên khác!`;
            errBox.classList.remove('hidden');
        }
        return;
    }

    const newAcc = {
        id: `user_${Date.now()}`,
        username: u,
        password: p,
        name: name,
        role: role,
        roleLabel: role === 'student' ? 'Học sinh' : 'Giáo viên',
        avatar: role === 'student' ? '🎒' : '👨‍🏫',
        className: className,
        subject: subject,
        detail: role === 'student' ? `Học sinh Lớp ${className}` : `Giáo viên môn ${subject}`,
        createdAt: new Date().toLocaleDateString('vi-VN')
    };

    authAccounts.push(newAcc);
    localStorage.setItem('school_auth_accounts', JSON.stringify(authAccounts));

    // Đẩy tài khoản lên Cloud Firestore để máy nào cũng đăng nhập được ngay
    if (firestoreDb) {
        try {
            firestoreDb.collection('accounts').doc(newAcc.username.toLowerCase()).set(newAcc)
                .then(() => console.log("🔥 Đã đồng bộ tài khoản mới lên Cloud thành công!"))
                .catch(err => console.warn("Lưu ý khi lưu lên Cloud:", err));
        } catch (e) {
            console.warn("Lỗi lưu Cloud:", e);
        }
    }

    loginUser(newAcc);
    closeAuthModal();
    showAuthToast(`Đăng ký tài khoản thành công! Xin chào ${newAcc.name}.`, 'fa-circle-check', 'success');
}

function handleRegisterRoleChange(role) {
    const classField = document.getElementById('auth-reg-class-field');
    const subjField = document.getElementById('auth-reg-subject-field');
    if (role === 'student') {
        if (classField) classField.classList.remove('hidden');
        if (subjField) subjField.classList.add('hidden');
    } else {
        if (classField) classField.classList.add('hidden');
        if (subjField) subjField.classList.remove('hidden');
    }
}

function populateRegisterClasses() {
    const select = document.getElementById('auth-reg-class-select');
    if (!select) return;
    select.innerHTML = '';
    classes.forEach(c => {
        select.innerHTML += `<option value="${c}">Lớp ${c}</option>`;
    });
}

function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
        input.type = 'text';
        if (btn) btn.innerHTML = '<i class="fa-solid fa-eye-slash text-xs"></i>';
    } else {
        input.type = 'password';
        if (btn) btn.innerHTML = '<i class="fa-solid fa-eye text-xs"></i>';
    }
}

function loginUser(userObj) {
    currentUser = userObj;
    currentAuthUser = userObj;
    localStorage.setItem('school_current_user', JSON.stringify(userObj));
    localStorage.setItem('school_auth_current_user', JSON.stringify(userObj));

    // Nếu là Học sinh: đồng bộ hồ sơ cá nhân
    if (userObj.role === 'student') {
        myProfile = {
            className: userObj.className || '12A1',
            studentName: userObj.name
        };
        localStorage.setItem('my_profile', JSON.stringify(myProfile));
        if (typeof renderProfileDisplay === 'function') renderProfileDisplay();
    }

    renderAuthHeaderUI();
    renderHomeWelcomeBanner();
    updateAdminPermissionsUI();

    // Tự động điều hướng tối ưu theo vai trò
    if (userObj.role === 'student' && userObj.className) {
        const tkbSelect = document.getElementById('tkb-target-select');
        if (tkbSelect) {
            tkbSelect.value = userObj.className;
            if (typeof renderTimetable === 'function') renderTimetable();
        }
    } else if (userObj.role === 'teacher') {
        if (typeof setTkbTab === 'function') {
            setTkbTab('teacher');
        }
    }

    // Nếu không phải admin mà đang ở tab Cài đặt Data, tự động về Trang chủ
    if (userObj.role !== 'admin') {
        const viewSettings = document.getElementById('view-settings');
        if (viewSettings && !viewSettings.classList.contains('hidden')) {
            switchTab('home');
        }
    }
}

function logoutUser() {
    currentUser = null;
    currentAuthUser = null;
    localStorage.removeItem('school_current_user');
    localStorage.removeItem('school_auth_current_user');
    closeUserDropdown();

    renderAuthHeaderUI();
    renderHomeWelcomeBanner();
    updateAdminPermissionsUI();

    // Nếu đang ở màn hình Cài đặt Data thì quay về Trang chủ
    const viewSettings = document.getElementById('view-settings');
    if (viewSettings && !viewSettings.classList.contains('hidden')) {
        switchTab('home');
    }

    showAuthToast("Đã đăng xuất tài khoản an toàn.", 'fa-arrow-right-from-bracket', 'info');
}

function showAuthToast(msg, icon = 'fa-circle-check', type = 'success') {
    const toast = document.getElementById('auth-toast');
    const msgEl = document.getElementById('auth-toast-message');
    const iconEl = document.getElementById('auth-toast-icon');
    if (!toast || !msgEl) return;

    msgEl.innerText = msg;
    if (iconEl) {
        iconEl.className = `fa-solid ${icon} ${type === 'success' ? 'text-emerald-400' : (type === 'error' ? 'text-rose-400' : 'text-blue-400')} text-sm`;
    }

    toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-3');
    toast.classList.add('opacity-100', 'translate-y-0');

    setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-3');
    }, 3200);
}

function checkPermission(requiredRole = 'admin') {
    if (!currentAuthUser) {
        openAuthModal('login');
        showAuthToast("Vui lòng đăng nhập để sử dụng tính năng này!", 'fa-lock', 'error');
        return false;
    }
    if (requiredRole === 'admin' && currentAuthUser.role !== 'admin') {
        showAuthToast("Tính năng chỉ dành cho Quản trị viên (Admin)!", 'fa-shield-halved', 'error');
        return false;
    }
    return true;
}

// ==============================================================================
// CẤU HÌNH BẢNG MÀU CHUYÊN SÂU THEO TỪNG MỤC THẺ MÀN HÌNH CHÍNH (COLOR-CODED THEMES)
// ==============================================================================
const SIDEBAR_TAB_THEMES = {
    home: {
        name: 'Trang chủ',
        gradient: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
        shadow: '0 8px 18px -4px rgba(37, 99, 235, 0.45)',
        accentColor: '#2563eb',
        hoverBg: 'rgba(37, 99, 235, 0.08)',
        hoverText: '#1d4ed8',
        dotColor: '#3b82f6'
    },
    timetable: {
        name: 'Thời khóa biểu',
        gradient: 'linear-gradient(135deg, #0093E9 0%, #1677ff 50%, #0050d8 100%)',
        shadow: '0 8px 18px -4px rgba(0, 147, 233, 0.45)',
        accentColor: '#0093E9',
        hoverBg: 'rgba(0, 147, 233, 0.08)',
        hoverText: '#0070c0',
        dotColor: '#0093E9'
    },
    profile: {
        name: 'Quản lý cá nhân',
        gradient: 'linear-gradient(135deg, #ff7e40 0%, #ff5231 60%, #f73859 100%)',
        shadow: '0 8px 18px -4px rgba(255, 82, 49, 0.45)',
        accentColor: '#ff5231',
        hoverBg: 'rgba(255, 82, 49, 0.08)',
        hoverText: '#e03c1d',
        dotColor: '#ff5231'
    },
    career: {
        name: 'Thần Đèn Hướng nghiệp',
        gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 45%, #06b6d4 100%)',
        shadow: '0 8px 18px -4px rgba(99, 102, 241, 0.45)',
        accentColor: '#6366f1',
        hoverBg: 'rgba(99, 102, 241, 0.08)',
        hoverText: '#4f46e5',
        dotColor: '#8b5cf6'
    },
    exam: {
        name: 'Phòng Luyện thi',
        gradient: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 45%, #f97316 100%)',
        shadow: '0 8px 18px -4px rgba(244, 63, 94, 0.45)',
        accentColor: '#f43f5e',
        hoverBg: 'rgba(244, 63, 94, 0.08)',
        hoverText: '#e11d48',
        dotColor: '#f43f5e'
    },
    qa: {
        name: 'Hỏi đáp Ẩn danh',
        gradient: 'linear-gradient(135deg, #c026d3 0%, #9333ea 50%, #7e22ce 100%)',
        shadow: '0 8px 18px -4px rgba(147, 51, 234, 0.45)',
        accentColor: '#9333ea',
        hoverBg: 'rgba(147, 51, 234, 0.08)',
        hoverText: '#7e22ce',
        dotColor: '#c026d3'
    },
    settings: {
        name: 'Cài đặt Data',
        gradient: 'linear-gradient(135deg, #173bb8 0%, #1e52dd 100%)',
        shadow: '0 8px 18px -4px rgba(23, 59, 184, 0.45)',
        accentColor: '#173bb8',
        hoverBg: 'rgba(23, 59, 184, 0.08)',
        hoverText: '#173bb8',
        dotColor: '#173bb8'
    }
};

// Hàm Mở rộng / Thu gọn thanh điều khiển Sidebar (Expandable Sidebar 220px)
function toggleSidebar() {
    const sidebar = document.getElementById('app-sidebar');
    if (!sidebar) return;
    const isExpanded = sidebar.classList.toggle('sidebar-expanded');
    document.body.classList.toggle('has-sidebar-expanded', isExpanded);
    localStorage.setItem('school_sidebar_expanded', isExpanded ? 'true' : 'false');

    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    if (toggleBtn) {
        toggleBtn.title = isExpanded ? 'Thu gọn thanh điều khiển (64px)' : 'Mở rộng thanh điều khiển (220px)';
    }

    if (window.currentActiveTab) {
        updateSidebarUI(window.currentActiveTab);
    }
}

// Khôi phục trạng thái mở rộng của Sidebar khi F5 / mở lại web
function initSidebarState() {
    const saved = localStorage.getItem('school_sidebar_expanded');
    const sidebar = document.getElementById('app-sidebar');
    if (!sidebar) return;
    if (saved === 'true') {
        sidebar.classList.add('sidebar-expanded');
        document.body.classList.add('has-sidebar-expanded');
        const toggleBtn = document.getElementById('sidebar-toggle-btn');
        if (toggleBtn) toggleBtn.title = 'Thu gọn thanh điều khiển (64px)';
    } else {
        sidebar.classList.remove('sidebar-expanded');
        document.body.classList.remove('has-sidebar-expanded');
    }
}

// Cập nhật trạng thái đổi màu thông minh cho Sidebar Desktop và Mobile Nav
function updateSidebarUI(tabName) {
    window.currentActiveTab = tabName;

    // A. Desktop Sidebar (Đổi màu theo tông màu thẻ chức năng ở màn hình chính)
    document.querySelectorAll('[data-sidebar-tab]').forEach(btn => {
        const tabKey = btn.getAttribute('data-sidebar-tab');
        const theme = SIDEBAR_TAB_THEMES[tabKey] || SIDEBAR_TAB_THEMES.home;
        const isMatch = tabKey === tabName;
        const iconBox = btn.querySelector('.sidebar-icon-box');
        const labelEl = btn.querySelector('.sidebar-label');

        if (isMatch) {
            btn.style.background = theme.gradient;
            btn.style.boxShadow = theme.shadow;
            btn.style.color = '#ffffff';
            btn.classList.add('active-sidebar-pill');
            btn.classList.remove('text-slate-500', 'hover:bg-slate-100');
            if (iconBox) iconBox.style.color = '#ffffff';
            if (labelEl) {
                labelEl.style.color = '#ffffff';
                labelEl.classList.add('font-black');
            }
        } else {
            btn.style.background = 'transparent';
            btn.style.boxShadow = 'none';
            btn.style.color = '';
            btn.classList.remove('active-sidebar-pill');
            btn.classList.add('text-slate-500', 'hover:bg-slate-100');
            if (iconBox) iconBox.style.color = '';
            if (labelEl) {
                labelEl.style.color = '';
                labelEl.classList.remove('font-black');
            }
        }
    });

    // B. Mobile Bottom Navigation Bar (Đổi màu icon & indicator đồng bộ)
    document.querySelectorAll('[data-mobile-tab]').forEach(btn => {
        const tabKey = btn.getAttribute('data-mobile-tab');
        const theme = SIDEBAR_TAB_THEMES[tabKey] || SIDEBAR_TAB_THEMES.home;
        const isMatch = tabKey === tabName;
        let pill = btn.querySelector('.tab-active-indicator');

        if (isMatch) {
            btn.style.color = theme.accentColor;
            btn.className = "flex flex-col items-center transition active:scale-95";
            if (!pill) {
                pill = document.createElement('span');
                pill.className = "w-5 h-1 rounded-full mt-1 tab-active-indicator transition-all duration-300";
                btn.appendChild(pill);
            }
            pill.style.background = theme.gradient;
            pill.style.boxShadow = theme.shadow;
        } else {
            btn.style.color = '';
            btn.className = "flex flex-col items-center text-slate-400 hover:text-slate-600 transition active:scale-95";
            if (pill) pill.remove();
        }
    });
}

function initApp() {
    initSidebarState();
    initAuthModule(); 
    populateClassSelect(); 
    loadProfileUI(); 
    if (typeof initQaModule === 'function') initQaModule();
    else renderQA();
    renderSettings(); 
    if(typeof initSubjectSelection === 'function') initSubjectSelection();
    if(typeof initExamModule === 'function') initExamModule();
    const initialHash = (window.location.hash || '').replace('#', '');
    if (initialHash && ['home', 'timetable', 'profile', 'grade', 'qa', 'settings', 'career', 'exam'].includes(initialHash)) {
        switchTab(initialHash);
    } else {
        switchTab('home');
    }
}

function switchTab(tabName) {
    const user = (typeof currentAuthUser !== 'undefined' && currentAuthUser) || (typeof currentUser !== 'undefined' && currentUser);
    if (tabName === 'settings') {
        if (!user || user.role !== 'admin') {
            if (typeof showAuthToast === 'function') {
                showAuthToast("Chỉ Quản trị viên (Admin) mới có quyền truy cập Cài đặt Data!", 'fa-shield-halved', 'error');
            } else if (typeof showToast === 'function') {
                showToast("Chỉ Quản trị viên (Admin) mới có quyền truy cập Cài đặt Data!");
            }
            const viewSettings = document.getElementById('view-settings');
            if (viewSettings) viewSettings.classList.add('hidden');
            const viewHome = document.getElementById('view-home');
            if (viewHome) viewHome.classList.remove('hidden');
            return;
        }
    }
    const tabs = ['home', 'timetable', 'profile', 'grade', 'qa', 'settings', 'career', 'exam'];
    const backBtn = document.getElementById('btn-back'); 
    
    if(backBtn) {
        if(tabName === 'home') backBtn.classList.add('hidden'); 
        else backBtn.classList.remove('hidden'); 
    }
    
    tabs.forEach(tab => { 
        const view = document.getElementById(`view-${tab}`); 
        if(view) {
            if(tab === tabName) view.classList.remove('hidden'); 
            else view.classList.add('hidden'); 
        }
    });

    // Cập nhật trạng thái Active thông minh theo màu từng thẻ cho Sidebar & Mobile Nav
    updateSidebarUI(tabName);
    
    if(tabName === 'home') { renderHomeWelcomeBanner(); if (typeof renderAuthUI === 'function') renderAuthUI(); }
    if(tabName === 'timetable') { setTkbTab(currentTkbTab); updateAdminPermissionsUI(); if (typeof renderAuthUI === 'function') renderAuthUI(); }
    if(tabName === 'settings') { updateAdminPermissionsUI(); if (typeof renderAuthUI === 'function') renderAuthUI(); }
    if(tabName === 'exam' && typeof initExamModule === 'function') { initExamModule(); }
    if(tabName === 'qa') { if (typeof initQaModule === 'function') initQaModule(); }
    if(tabName === 'profile') { if (typeof initProfileModule === 'function') initProfileModule(); }
}

function populateClassSelect() {
    const selectForm = document.getElementById('class-select'); 
    const selectFilter = document.getElementById('filter-class');
    const selectManage = document.getElementById('manage-class-select'); 
    
    if(selectForm) selectForm.innerHTML = '<option value="">-- Chọn lớp --</option>'; 
    if(selectFilter) selectFilter.innerHTML = '<option value="">Tất cả các lớp</option>';
    if(selectManage) {
        const currentManage = selectManage.value; 
        selectManage.innerHTML = '<option value="">-- Chọn lớp quản lý --</option>';
        classes.forEach(c => {
            if(selectForm) selectForm.innerHTML += `<option value="${c}">Lớp ${c}</option>`; 
            if(selectFilter) selectFilter.innerHTML += `<option value="${c}">Lớp ${c}</option>`;
            selectManage.innerHTML += `<option value="${c}" ${c === currentManage ? 'selected' : ''}>Lớp ${c}</option>`;
        });
    }
    renderStudents();
}


// ==============================================================================
// MODULE QUẢN LÝ THỜI KHÓA BIỂU (TKB LỚP, ÔN THPT LỚP 12, TKB GIÁO VIÊN)
// ==============================================================================

function setTkbTab(tabType) {
    currentTkbTab = tabType;
    ['main', 'prep', 'teacher'].forEach(t => {
        const btn = document.getElementById(`tab-tkb-${t}`);
        if(btn) {
            if(t === tabType) {
                btn.className = "px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-bold whitespace-nowrap shadow-sm transition";
            } else {
                btn.className = "px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-bold whitespace-nowrap hover:bg-gray-300 transition";
            }
        }
    });

    const label = document.getElementById('tkb-select-label'); 
    const select = document.getElementById('tkb-target-select');
    const teacherSearch = document.getElementById('tkb-teacher-search');
    
    if(select) select.innerHTML = '<option value="">-- Chọn --</option>';

    if(tabType === 'main') { 
        if(label) label.innerText = 'Lớp chính (Sáng):'; 
        if(teacherSearch) teacherSearch.classList.add('hidden');
        classes.forEach(c => {
            if(select) select.innerHTML += `<option value="${c}">Lớp ${c}</option>`;
        }); 
        if(select) {
            if(myProfile && myProfile.className && classes.includes(myProfile.className)) {
                select.value = myProfile.className;
            } else if(classes.length > 0) {
                select.value = classes[0];
            }
        }
    } else if (tabType === 'prep') { 
        if(label) label.innerText = 'Lớp 12:'; 
        if(teacherSearch) teacherSearch.classList.add('hidden');
        
        // TKB CHIỀU CHỈ DÀNH CHO KHỐI 12 (12A1 -> 12A7)
        const class12 = classes.filter(c => c.startsWith('12'));
        if (class12.length === 0) {
            if(select) select.innerHTML = '<option value="">(Không có lớp 12 nào)</option>';
        } else {
            class12.forEach(c => {
                if(select) select.innerHTML += `<option value="${c}">Lớp ${c}</option>`;
            });
            if(select) {
                if(myProfile && myProfile.className && class12.includes(myProfile.className)) {
                    select.value = myProfile.className;
                } else if(class12.length > 0) {
                    select.value = class12[0];
                }
            }
        }
    } else if (tabType === 'teacher') { 
        if(label) label.innerText = 'Giáo viên:'; 
        if(teacherSearch) {
            teacherSearch.classList.remove('hidden');
            teacherSearch.value = '';
        }
        const teacherList = Object.keys(timetables.teacher).sort(); 
        teacherList.forEach(t => {
            if(select) select.innerHTML += `<option value="${t}">Thầy/Cô ${t}</option>`;
        }); 
        if(teacherList.length === 0 && select) {
            select.innerHTML = '<option value="">Chưa có dữ liệu GV</option>';
        } else if(select && teacherList.length > 0) {
            select.value = teacherList[0];
        }
    }

    renderTimetable();
}

function handleEditTkbTypeChange() {
    const typeSelect = document.getElementById('edit-tkb-type');
    if(!typeSelect) return;
    const type = typeSelect.value;
    const selectClass = document.getElementById('edit-tkb-class'); 
    const inputTeacher = document.getElementById('edit-tkb-teacher-input');
    
    if(type === 'main' || type === 'prep') {
        if(selectClass) {
            selectClass.classList.remove('hidden'); 
            selectClass.innerHTML = '';
            const targetClasses = type === 'main' ? classes : classes.filter(c => c.startsWith('12'));
            targetClasses.forEach(c => {
                selectClass.innerHTML += `<option value="${c}">Lớp ${c}</option>`;
            });
        }
        if(inputTeacher) {
            inputTeacher.classList.add('hidden'); 
            inputTeacher.removeAttribute('required');
        }
        setTimeout(loadEditTkbData, 50);
    } else { 
        if(selectClass) selectClass.classList.add('hidden'); 
        if(inputTeacher) {
            inputTeacher.classList.remove('hidden'); 
            inputTeacher.setAttribute('required', 'true');
        }
        setTimeout(loadEditTkbData, 50); 
    }
}

function loadEditTkbData() {
    const typeSelect = document.getElementById('edit-tkb-type');
    if(!typeSelect) return;
    const type = typeSelect.value;
    const teacherInput = document.getElementById('edit-tkb-teacher-input');
    const classSelect = document.getElementById('edit-tkb-class');

    const target = type === 'teacher' 
        ? (teacherInput ? teacherInput.value.trim() : '') 
        : (classSelect ? classSelect.value : '');

    const currentTkbObj = (timetables && timetables[type]) ? timetables[type] : {};

    if(target && currentTkbObj[target]) { 
        ['t2', 't3', 't4', 't5', 't6', 't7'].forEach(day => { 
            const inp = document.getElementById(`tkb-${day}`);
            if(inp) inp.value = currentTkbObj[target][day] || ''; 
        });
    } else { 
        ['t2', 't3', 't4', 't5', 't6', 't7'].forEach(day => { 
            const inp = document.getElementById(`tkb-${day}`);
            if(inp) inp.value = ''; 
        }); 
    }
}

function toggleEditTkb() {
    if (!checkPermission('admin')) return;
    const section = document.getElementById('tkb-edit-section'); 
    if(!section) return;
    section.classList.toggle('hidden');
    if(!section.classList.contains('hidden')) { 
        const editType = document.getElementById('edit-tkb-type');
        if(editType) editType.value = currentTkbTab; 
        handleEditTkbTypeChange(); 
    }
}

function renderTimetable() {
    const targetSelect = document.getElementById('tkb-target-select'); 
    const display = document.getElementById('tkb-display');
    if(!display) return;

    const target = targetSelect ? targetSelect.value : '';
    if(!target) {
        display.innerHTML = `<p class="text-center text-gray-500 text-sm py-8">Vui lòng chọn thông tin phía trên.</p>`;
        return;
    }

    const currentTkbGroup = (timetables && timetables[currentTkbTab]) ? timetables[currentTkbTab] : {};
    const tkb = currentTkbGroup[target];
    if(!tkb || Object.values(tkb).every(v => !v || v.trim() === '')) {
        let msg = "Chưa có dữ liệu Thời khóa biểu cho mục này.<br><span class=\"text-xs text-blue-600 font-bold mt-1 inline-block\">Hãy nhấn nút \"Chỉnh sửa thủ công\" bên dưới để nhập.</span>";
        if (currentTkbTab === 'prep') {
            msg = `<i class=\"fa-solid fa-circle-info text-blue-500 mb-1\"></i><br>Lớp <b>${target || ''}</b> không có lịch học buổi chiều trong Thời khóa biểu này.<br><span class=\"text-xs text-gray-400 mt-1 inline-block\">Nếu trường có lịch học chiều, hãy tải file Excel có sheet <b>TKB_Lop_Chieu</b> lên.</span>`;
        }
        display.innerHTML = `<p class=\"text-center text-gray-500 text-sm italic py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300\">${msg}</p>`;
        return;
    }

    const currentDayOfWeek = new Date().getDay(); 
    let html = '<div class="space-y-3">';
    const days = [ 
        { key: 't2', name: 'Thứ 2', idx: 1 }, 
        { key: 't3', name: 'Thứ 3', idx: 2 }, 
        { key: 't4', name: 'Thứ 4', idx: 3 }, 
        { key: 't5', name: 'Thứ 5', idx: 4 }, 
        { key: 't6', name: 'Thứ 6', idx: 5 }, 
        { key: 't7', name: 'Thứ 7', idx: 6 } 
    ];

    days.forEach(d => {
        const isToday = currentDayOfWeek === d.idx;
        const bgClass = isToday ? 'bg-blue-50/80 border-blue-400 border-2 shadow-sm' : 'bg-gray-50 border-gray-200 border';
        const titleColor = isToday ? 'text-blue-700 font-black' : 'text-gray-700 font-bold';
        
        let subjectsHtml = '';
        if(tkb[d.key] && tkb[d.key].trim() !== '') {
            const subjects = tkb[d.key].split(',').map(s => s.trim()).filter(s => s);
            subjects.forEach(subj => { 
                subjectsHtml += `<span class="bg-white px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 shadow-xs border border-gray-200">${subj}</span>`; 
            });
        } else {
            subjectsHtml = '<span class="text-xs text-gray-400 italic">Trống</span>';
        }

        html += `
            <div class="${bgClass} p-3 rounded-xl transition-all duration-300">
                <div class="${titleColor} text-sm mb-2 flex items-center justify-between">
                    <span>${d.name}</span>
                    ${isToday ? '<span class="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded font-black animate-pulse">HÔM NAY</span>' : ''}
                </div>
                <div class="flex flex-wrap gap-2">
                    ${subjectsHtml}
                </div>
            </div>
        `;
    });
    html += '</div>'; 
    display.innerHTML = html;
}

// ==========================================
// THUẬT TOÁN ĐỌC EXCEL CHUẨN (CÓ GỘP Ô)
// ==========================================
function importExcel() {
    if (!checkPermission('admin')) return;
    const fileInput = document.getElementById('excel-file-input');
    const file = fileInput ? fileInput.files[0] : null;
    
    if(!file) return alert("Vui lòng chọn file Excel (.xlsx, .xls) trước khi tải lên!");

    if(typeof XLSX === 'undefined') {
        return alert("Lỗi: Thư viện đọc Excel chưa sẵn sàng. Vui lòng kiểm tra lại kết nối mạng hoặc file xlsx.js!");
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            
            // Helper quét TKB theo cấu trúc cột Ngày / Tiết / [Các lớp]
            // Tham số isAfternoon: nếu là sheet chiều, tự động giảm 1 cho số tiết (Tiết 2, Tiết 3 -> Tiết 1, Tiết 2)
            function parseClassSheet(sheet, isAfternoon) {
                if(!sheet) return null;
                const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                let headerRowIndex = -1;
                for(let i=0; i<rows.length; i++) {
                    if(rows[i] && rows[i].length > 2 && rows[i][0] && rows[i][0].toString().toLowerCase().includes('ngày')) {
                        headerRowIndex = i; 
                        break;
                    }
                }
                if(headerRowIndex === -1) return null;

                const headers = rows[headerRowIndex];
                let rawTkb = {};
                for(let col = 2; col < headers.length; col++) {
                    let className = headers[col];
                    if(className && className.toString().trim() !== '') {
                        rawTkb[className.toString().trim()] = { t2:[], t3:[], t4:[], t5:[], t6:[], t7:[] };
                    }
                }

                let currentDayKey = '';
                for(let i = headerRowIndex + 1; i < rows.length; i++) {
                    let row = rows[i];
                    if(!row || row.length === 0) continue;
                    let dayCell = row[0];
                    if(dayCell && typeof dayCell === 'string') {
                        let d = dayCell.toLowerCase();
                        if(d.includes('2')) currentDayKey = 't2';
                        else if(d.includes('3')) currentDayKey = 't3';
                        else if(d.includes('4')) currentDayKey = 't4';
                        else if(d.includes('5')) currentDayKey = 't5';
                        else if(d.includes('6')) currentDayKey = 't6';
                        else if(d.includes('7')) currentDayKey = 't7';
                    }
                    if(!currentDayKey) continue;
                    
                    let rawTiet = row[1] ? parseInt(row[1].toString().trim()) : null;
                    let displayTiet = rawTiet;
                    if(isAfternoon && rawTiet && rawTiet > 1) {
                        displayTiet = rawTiet - 1; // Xóa 1 đi cho số tiết chiều
                    }

                    for(let col = 2; col < headers.length; col++) {
                        let className = headers[col];
                        if(!className || !className.toString().trim()) continue;
                        className = className.toString().trim();
                        if(rawTkb[className]) {
                            let subject = row[col];
                            if(subject && subject.toString().trim() !== '') {
                                subject = subject.toString().replace(/\r?\n|\r/g, " ").trim();
                                let tietLabel = displayTiet ? `Tiết ${displayTiet}: ` : '';
                                rawTkb[className][currentDayKey].push(tietLabel + subject);
                            }
                        }
                    }
                }

                let result = {};
                for (let className in rawTkb) {
                    result[className] = {
                        t2: rawTkb[className].t2.join(", "),
                        t3: rawTkb[className].t3.join(", "),
                        t4: rawTkb[className].t4.join(", "),
                        t5: rawTkb[className].t5.join(", "),
                        t6: rawTkb[className].t6.join(", "),
                        t7: rawTkb[className].t7.join(", ")
                    };
                }
                return result;
            }

            // 1. Nhận diện sheet Buổi Sáng
            let sangSheetName = workbook.SheetNames.find(s => s.toLowerCase().includes('sang') || s.toLowerCase().includes('sáng')) || workbook.SheetNames[0];
            let sangParsed = parseClassSheet(workbook.Sheets[sangSheetName], false);
            if(!sangParsed) {
                return alert("❌ Không tìm thấy cấu trúc TKB lớp sáng chuẩn trong file Excel.");
            }

            let count = 0;
            timetables.main = {};
            classes = [];
            for(let className in sangParsed) {
                timetables.main[className] = sangParsed[className];
                if(!classes.includes(className)) {
                    classes.push(className);
                    if(!students[className]) students[className] = [];
                }
                count++;
            }

            // 2. KIỂM TRA XEM TKB CÓ TKB LỚP CHIỀU HAY KHÔNG (TKB CHIỀU CHỈ DÀNH CHO KHỐI 12)
            let chieuSheetName = workbook.SheetNames.find(s => s.toLowerCase().includes('chieu') || s.toLowerCase().includes('chiều'));
            let hasChieu = false;
            timetables.prep = {};

            if(chieuSheetName) {
                let chieuParsed = parseClassSheet(workbook.Sheets[chieuSheetName], true);
                if(chieuParsed) {
                    for(let className in chieuParsed) {
                        // CHỈ LẤY CÁC LỚP KHỐI 12 CHO TKB CHIỀU
                        if(className.startsWith('12') && Object.values(chieuParsed[className]).some(v => v && v.trim() !== '')) {
                            timetables.prep[className] = chieuParsed[className];
                            hasChieu = true;
                        }
                    }
                }
            }

            // Lưu TKB Sáng và Chiều vào bộ nhớ
            localStorage.setItem('school_tkb_main', JSON.stringify(timetables.main));
            localStorage.setItem('school_tkb_prep', JSON.stringify(timetables.prep));

            // 3. Quét sheet TKB Giáo viên (nếu có)
            let teacherSheetName = workbook.SheetNames.find(s => s.toLowerCase().includes('giaovien') || s.toLowerCase().includes('giáo viên'));
            let teacherSheet = teacherSheetName ? workbook.Sheets[teacherSheetName] : workbook.Sheets['TKBGiaovien'];
            let teacherCount = 0;

            if (teacherSheet) {
                timetables.teacher = {};
                const teacherRows = XLSX.utils.sheet_to_json(teacherSheet, { header: 1 });
                let r = 0;
                while (r < teacherRows.length) {
                    let row = teacherRows[r];
                    if (!row) { r++; continue; }
                    let teacherName = null;
                    for (let c = 0; c < row.length; c++) {
                        let cell = (row[c] || '').toString().trim();
                        if (cell === 'Giáo viên') {
                            for (let c2 = c + 1; c2 < row.length; c2++) {
                                let v = (row[c2] || '').toString().trim();
                                if (v) { teacherName = v; break; }
                            }
                            break;
                        }
                    }
                    if (teacherName) {
                        let headerRow = -1;
                        for (let hr = r; hr < Math.min(r + 10, teacherRows.length); hr++) {
                            let hrVals = (teacherRows[hr] || []).map(v => (v || '').toString().trim());
                            if (hrVals.includes('Thứ 2') && hrVals.includes('Thứ 3')) {
                                headerRow = hr;
                                break;
                            }
                        }
                        if (headerRow !== -1) {
                            let colMap = {};
                            let hrRow = teacherRows[headerRow];
                            for (let c = 0; c < hrRow.length; c++) {
                                let val = (hrRow[c] || '').toString().trim();
                                if (val === 'Thứ 2') colMap['t2'] = c;
                                else if (val === 'Thứ 3') colMap['t3'] = c;
                                else if (val === 'Thứ 4') colMap['t4'] = c;
                                else if (val === 'Thứ 5') colMap['t5'] = c;
                                else if (val === 'Thứ 6') colMap['t6'] = c;
                                else if (val === 'Thứ 7') colMap['t7'] = c;
                            }
                            let daySchedule = { t2: [], t3: [], t4: [], t5: [], t6: [], t7: [] };
                            let currRow = headerRow + 1;
                            let buoi = 'Sáng';
                            while (currRow < Math.min(headerRow + 16, teacherRows.length)) {
                                let crRow = teacherRows[currRow] || [];
                                let rowStr = crRow.map(v => (v || '').toString().trim()).join(' ');
                                if (rowStr.includes('Giáo viên')) break;
                                if (rowStr.includes('Buổi chiều')) {
                                    // NẾU FILE KHÔNG CÓ TKB LỚP CHIỀU -> DỪNG NGAY, KHÔNG THÊM TIẾT CHIỀU!
                                    if (!hasChieu) break;
                                    buoi = 'Chiều';
                                    currRow++;
                                    continue;
                                }
                                if (rowStr.includes('Thứ 2') && rowStr.includes('Thứ 3')) { currRow++; continue; }
                                
                                let rawTiet = parseInt(crRow[0]);
                                let displayTiet = rawTiet;
                                if (buoi === 'Chiều' && rawTiet && rawTiet > 1) {
                                    displayTiet = rawTiet - 1; // Xóa 1 đi cho số tiết chiều của giáo viên
                                }

                                for (let dayK in colMap) {
                                    let subj = (crRow[colMap[dayK]] || '').toString().trim();
                                    if (subj && !subj.includes('Buổi') && !subj.includes('Thứ')) {
                                        let tietLabel = (buoi === 'Chiều' && displayTiet) ? `T${displayTiet} (Chiều): ` : (displayTiet ? `Tiết ${displayTiet}: ` : '');
                                        daySchedule[dayK].push(tietLabel + subj);
                                    }
                                }
                                currRow++;
                            }
                            timetables.teacher[teacherName] = {
                                t2: daySchedule.t2.join(', '),
                                t3: daySchedule.t3.join(', '),
                                t4: daySchedule.t4.join(', '),
                                t5: daySchedule.t5.join(', '),
                                t6: daySchedule.t6.join(', '),
                                t7: daySchedule.t7.join(', ')
                            };
                            teacherCount++;
                            r = currRow;
                            continue;
                        }
                    }
                    r++;
                }
                if (teacherCount > 0) {
                    localStorage.setItem('school_tkb_teacher', JSON.stringify(timetables.teacher));
                }
            }

            classes.sort();
            localStorage.setItem('thiduaso_classes', JSON.stringify(classes));
            localStorage.setItem('thiduaso_students', JSON.stringify(students));
            
            const chieuClassesCount = Object.keys(timetables.prep).length;
            const chieuStatusMsg = hasChieu ? ` (bao gồm TKB Chiều cho ${chieuClassesCount} lớp)` : ' (TKB không có học chiều)';
            const teacherMsg = teacherCount > 0 ? ` và ${teacherCount} giáo viên` : '';
            
            alert(`✅ Quá tuyệt vời! Đã quét thành công TKB của ${count} lớp${chieuStatusMsg}${teacherMsg} từ File Excel.`);
            
            fileInput.value = ''; 
            const editSection = document.getElementById('tkb-edit-section');
            if(editSection) editSection.classList.add('hidden');
            initApp();
            setTkbTab('main');
        } catch(err) {
            console.error("Lỗi khi đọc file Excel:", err);
            alert("Có lỗi xảy ra khi xử lý file Excel: " + err.message);
        }
    };
    
    reader.readAsArrayBuffer(file);
}

function handleExcelUpload() {
    importExcel();
}

// ==============================================================================
// THUẬT TOÁN CÂY QUYẾT ĐỊNH 6 TẦNG (6-LEVEL DECISION TREE) - THẦN ĐÈN HƯỚNG NGHIỆP
// ==============================================================================

const DECISION_TREE_ROOT = {
  "step": 1,
  "q": "Hỡi bạn học, bạn cảm thấy bị thu hút bởi lĩnh vực nào hơn khi học tập?",
  "desc": "Bước 1/6: Phân định trục kiến thức Tự nhiên hay Xã hội.",
  "optA": {
    "text": "🔬 Khoa học Tự nhiên, Công nghệ, Máy móc, Dữ liệu",
    "next": {
      "step": 2,
      "q": "Trong thế giới Tự nhiên, phong cách hành động nào đúng với bạn nhất?",
      "desc": "Bước 2/6: Phân định Thực tế (R) hay Nghiên cứu (I).",
      "optA": {
        "text": "⚙️ Thực hành thực tế: Thích tháo lắp máy móc, vận động, chế tạo",
        "next": {
          "step": 3,
          "q": "Bạn quan tâm đến đối tượng công việc nào dưới đây?",
          "desc": "Bước 3/6: Lựa chọn giữa Công nghiệp nặng hay Nông sinh tự nhiên.",
          "optA": {
            "text": "🚗 Động cơ, Ô tô, Máy móc cơ khí, Công trình xây dựng",
            "next": {
              "step": 4,
              "q": "Thế mạnh môn học nổi bật nhất của bạn ở trường THPT là gì?",
              "desc": "Bước 4/6: Đánh giá nền tảng tổ hợp môn thi Kỹ thuật.",
              "optA": {
                "text": "📐 Môn Toán và Vật lý truyền thống (Khối A00, A01)",
                "next": {
                  "step": 5,
                  "q": "Môi trường làm việc thực tế nào hấp dẫn bạn nhất?",
                  "desc": "Bước 5/6: Phân nhánh Nhà xưởng ô tô hay Công trình xây dựng.",
                  "optA": {
                    "text": "🏭 Nhà xưởng chế tạo ô tô, robot, dây chuyền thông minh",
                    "next": {
                      "step": 6,
                      "q": "Bạn có sẵn sàng học hỏi liên tục về công nghệ xe điện & robot thông minh?",
                      "desc": "Bước 6/6: Chốt ngành Ô tô hay Điện tử.",
                      "optA": {
                        "text": "🚗 Đúng vậy, tôi đam mê ô tô và robot tự hành",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "R - Kỹ thuật Ô tô & Cơ điện tử (Realistic)",
                          "desc": "Bạn có tư duy kỹ thuật xuất sắc, khéo léo và đam mê máy móc động cơ thực tế.",
                          "blocks": "A00 (Toán, Lý, Hóa), A01 (Toán, Lý, Anh)",
                          "majors": "Công nghệ Kỹ thuật Ô tô, Kỹ thuật Cơ điện tử, Robot & Tự động hóa.",
                          "jobs": "Kỹ sư ô tô, Kỹ sư Robot, Chuyên viên thiết kế cơ khí, Trưởng xưởng sản xuất công nghệ cao.",
                          "advice": "Cày thật sâu môn Toán - Lý, tích cực tham gia các dự án nghiên cứu STEM và sáng chế mô hình."
                        }
                      },
                      "optB": {
                        "text": "⚡ Tôi thiên về mạch điện tử và tự động hóa nhà máy",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "R - Kỹ thuật Điện - Điện tử & Tự động hóa",
                          "desc": "Bạn tỉ mỉ, thích mạch điện thông minh và hệ thống điều khiển tự động.",
                          "blocks": "A00 (Toán, Lý, Hóa), A01 (Toán, Lý, Anh)",
                          "majors": "Kỹ thuật Điện - Điện tử, Tự động hóa, Vi mạch Bán dẫn.",
                          "jobs": "Kỹ sư vi mạch bán dẫn, Chuyên viên điều khiển tự động, Kỹ sư điện tử.",
                          "advice": "Trau dồi thêm Tiếng Anh kỹ thuật để đón đầu làn sóng chip bán dẫn tại Việt Nam."
                        }
                      }
                    }
                  },
                  "optB": {
                    "text": "🏢 Công trường xây dựng, cầu đường, quy hoạch đô thị",
                    "next": {
                      "step": 6,
                      "q": "Bạn thích đi thực địa giám sát công trình hay ngồi văn phòng thiết kế bản đồ quy hoạch?",
                      "desc": "Bước 6/6: Chốt ngành Xây dựng hay Trắc địa đất đai.",
                      "optA": {
                        "text": "🏗️ Tôi thích chỉ huy trực tiếp ngoài công trình xây dựng",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "R - Kỹ thuật Xây dựng & Công trình",
                          "desc": "Bạn có sức bền, tư duy không gian tốt và thích biến bản vẽ thành các công trình đồ sộ.",
                          "blocks": "A00 (Toán, Lý, Hóa), A01 (Toán, Lý, Anh)",
                          "majors": "Kỹ thuật Xây dựng, Xây dựng Cầu đường, Quản lý Xây dựng.",
                          "jobs": "Chỉ huy trưởng công trình, Kỹ sư kết cấu, Giám sát thi công xây dựng.",
                          "advice": "Học giỏi môn Hình học không gian và rèn luyện thể lực bền bỉ."
                        }
                      },
                      "optB": {
                        "text": "🗺️ Tôi thích đo đạc bản đồ số và quy hoạch đất đai",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "R - Quản lý Đất đai & Trắc địa Bản đồ",
                          "desc": "Bạn cẩn thận, thích đo đạc địa lý và quy hoạch mặt bằng không gian.",
                          "blocks": "A00 (Toán, Lý, Hóa), A01 (Toán, Lý, Anh)",
                          "majors": "Quản lý Đất đai, Kỹ thuật Trắc địa - Bản đồ, Địa chất.",
                          "jobs": "Chuyên viên quản lý đất đai, Kỹ sư bản đồ vệ tinh, Chuyên viên tài nguyên.",
                          "advice": "Rèn luyện tính chính xác trong từng con số và học thêm phần mềm bản đồ GIS."
                        }
                      }
                    }
                  }
                }
              },
              "optB": {
                "text": "💻 Môn Tin học và Công nghệ ứng dụng (Thích mạch số)",
                "next": {
                  "step": 5,
                  "q": "Bạn quan tâm đến công nghệ vi mạch siêu vi hay thiết bị cơ điện tử thông minh?",
                  "desc": "Bước 5/6: Định hướng công nghệ cao.",
                  "optA": {
                    "text": "💻 Công nghệ vi mạch bán dẫn và thiết bị bay hiện đại",
                    "next": {
                      "step": 6,
                      "q": "Bạn muốn thiết kế những con chip siêu nhỏ hay chế tạo thiết bị bay không người lái?",
                      "desc": "Bước 6/6: Chốt ngành Bán dẫn hay Hàng không.",
                      "optA": {
                        "text": "🔬 Thiết kế vi mạch bán dẫn siêu nhỏ cho điện thoại/máy tính",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "R & I - Kỹ thuật Vi mạch & Bán dẫn",
                          "desc": "Bạn đón đầu xu thế công nghệ cao nhất hiện nay với tư duy kết hợp phần cứng và giải thuật.",
                          "blocks": "A00 (Toán, Lý, Hóa), A01 (Toán, Lý, Anh)",
                          "majors": "Công nghệ Bán dẫn, Kỹ thuật Vi điện tử, Vật lý Kỹ thuật.",
                          "jobs": "Kỹ sư thiết kế chip bán dẫn, Kỹ sư đóng gói IC, Chuyên viên kiểm thử vi mạch.",
                          "advice": "Tập trung tối đa cho Toán - Lý - Tiếng Anh, đây là ngành 'vàng' trong 10 năm tới."
                        }
                      },
                      "optB": {
                        "text": "✈️ Chế tạo máy bay, drone và thiết bị hàng không",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "R - Kỹ thuật Hàng không & Thiết bị bay",
                          "desc": "Bạn thích máy bay, thiết bị không người lái và cơ cấu truyền động trên không.",
                          "blocks": "A00 (Toán, Lý, Hóa), A01 (Toán, Lý, Anh)",
                          "majors": "Kỹ thuật Hàng không, Kỹ thuật Tàu bay, Thiết bị bay thông minh (Drone).",
                          "jobs": "Kỹ sư bảo dưỡng máy bay, Chuyên viên vận hành Drone công nghiệp, Kỹ sư khí động học.",
                          "advice": "Yêu cầu tiếng Anh rất cao và sự kỷ luật nghiêm ngặt."
                        }
                      }
                    }
                  },
                  "optB": {
                    "text": "🦾 Cơ điện tử, cánh tay robot và năng lượng tái tạo",
                    "next": {
                      "step": 6,
                      "q": "Bạn thích hệ thống cánh tay robot thông minh hay phát triển năng lượng xanh (điện gió/mặt trời)?",
                      "desc": "Bước 6/6: Chốt Cơ điện tử hay Năng lượng sạch.",
                      "optA": {
                        "text": "🤖 Cánh tay robot tự động hóa trong sản xuất",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "R - Kỹ thuật Cơ điện tử (Mechatronics)",
                          "desc": "Sự giao thoa hoàn hảo giữa Cơ khí chính xác, Điện tử thông minh và Lập trình điều khiển.",
                          "blocks": "A00 (Toán, Lý, Hóa), A01 (Toán, Lý, Anh)",
                          "majors": "Kỹ thuật Cơ điện tử, Robot công nghiệp.",
                          "jobs": "Kỹ sư Cơ điện tử, Kỹ sư vận hành dây chuyền tự động, Lập trình viên nhúng PLC.",
                          "advice": "Cân bằng giữa việc học toán lý thuyết và thực hành hàn mạch, lắp ráp linh kiện."
                        }
                      },
                      "optB": {
                        "text": "☀️ Năng lượng gió, pin mặt trời và xe điện xanh",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "R - Kỹ thuật Năng lượng Tái tạo",
                          "desc": "Bạn quan tâm đến điện gió, pin mặt trời và năng lượng xanh tương lai.",
                          "blocks": "A00 (Toán, Lý, Hóa), A01 (Toán, Lý, Anh)",
                          "majors": "Kỹ thuật Năng lượng, Năng lượng tái tạo.",
                          "jobs": "Kỹ sư điện gió, Kỹ sư hệ thống điện mặt trời, Chuyên viên tối ưu năng lượng.",
                          "advice": "Củng cố chắc môn Vật lý phần Điện học và Nhiệt học."
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "optB": {
            "text": "🌱 Cây trồng, Vật nuôi, Môi trường và Hệ sinh thái tự nhiên",
            "next": {
              "step": 4,
              "q": "Bạn học tốt môn Sinh học và Hóa học hơn môn Vật lý?",
              "desc": "Bước 4/6: Đánh giá định hướng Tự nhiên - Sinh thái.",
              "optA": {
                "text": "🧪 Đúng vậy, tôi học tốt Hóa - Sinh và thích chăm sóc sự sống",
                "next": {
                  "step": 5,
                  "q": "Bạn quan tâm đến lĩnh vực động vật hay thế giới thực vật và môi trường sống?",
                  "desc": "Bước 5/6: Phân nhánh Động vật hay Thực vật/Môi trường.",
                  "optA": {
                    "text": "🐾 Thế giới động vật: Thú cưng, gia súc, thủy hải sản",
                    "next": {
                      "step": 6,
                      "q": "Bạn thích mở phòng khám chữa bệnh cho thú cưng hay làm việc bảo tồn sinh vật biển/vườn quốc gia?",
                      "desc": "Bước 6/6: Chốt Bác sĩ thú y hay Thủy sản biển.",
                      "optA": {
                        "text": "🐶 Khám chữa bệnh cho thú cưng và động vật nông trại",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "R & I - Bác sĩ Thú y (Veterinary Medicine)",
                          "desc": "Bạn có lòng nhân hậu, kiên nhẫn và đam mê chữa bệnh, chăm sóc các loài động vật.",
                          "blocks": "B00 (Toán, Hóa, Sinh), A00 (Toán, Lý, Hóa), D07 (Toán, Hóa, Anh)",
                          "majors": "Bác sĩ Thú y, Chăn nuôi thú y, Dược thú y.",
                          "jobs": "Bác sĩ thú y tại bệnh viện thú cưng, Chuyên gia kiểm dịch động vật, Quản lý trang trại chăn nuôi quốc tế.",
                          "advice": "Môn Hóa và Sinh là chủ lực, hãy rèn luyện thêm tính dũng cảm và vệ sinh cẩn thận."
                        }
                      },
                      "optB": {
                        "text": "🌊 Nuôi trồng thủy sản công nghệ cao và bảo tồn động vật biển",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "R - Bảo tồn Động vật Hoang dã & Thủy sản",
                          "desc": "Bạn thích thiên nhiên hoang dã, biển cả và thế giới sinh vật dưới nước.",
                          "blocks": "B00 (Toán, Hóa, Sinh), D07 (Toán, Hóa, Anh)",
                          "majors": "Bảo tồn thiên nhiên, Nuôi trồng thủy sản, Sinh học biển.",
                          "jobs": "Chuyên viên vườn quốc gia, Kỹ sư nuôi trồng thủy sản công nghệ cao, Nhà bảo tồn.",
                          "advice": "Thường xuyên tham gia các hoạt động cắm trại và bảo vệ môi trường."
                        }
                      }
                    }
                  },
                  "optB": {
                    "text": "🌱 Cây trồng nông nghiệp sạch và tài nguyên môi trường",
                    "next": {
                      "step": 6,
                      "q": "Bạn thích làm chủ trang trại thông minh hay trở thành kỹ sư bảo vệ nguồn nước và môi trường?",
                      "desc": "Bước 6/6: Chốt Nông nghiệp sạch hay Môi trường xanh.",
                      "optA": {
                        "text": "🌿 Vận hành trang trại rau quả sạch tự động hóa",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "R - Nông nghiệp Công nghệ cao",
                          "desc": "Nông nghiệp hiện đại của kỷ nguyên số: không phải 'chân lấm tay bùn' mà là điều khiển bằng cảm biến.",
                          "blocks": "B00 (Toán, Hóa, Sinh), A00 (Toán, Lý, Hóa)",
                          "majors": "Nông nghiệp công nghệ cao, Khoa học cây trồng, Công nghệ sinh học nông nghiệp.",
                          "jobs": "Kỹ sư nông nghiệp thông minh, Giám đốc trang trại hydroponics, Chuyên gia giống cây trồng.",
                          "advice": "Học đều môn Sinh, Hóa và học thêm về cảm biến điện tử."
                        }
                      },
                      "optB": {
                        "text": "💧 Kỹ sư xử lý nước thải, chống ô nhiễm và biến đổi khí hậu",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "R - Quản lý Tài nguyên & Môi trường",
                          "desc": "Bạn mang sứ mệnh bảo vệ nguồn nước, không khí và xử lý rác thải cho hành tinh.",
                          "blocks": "B00 (Toán, Hóa, Sinh), A00 (Toán, Lý, Hóa)",
                          "majors": "Khoa học Môi trường, Quản lý tài nguyên nước, Kỹ thuật môi trường.",
                          "jobs": "Kỹ sư xử lý môi trường, Chuyên viên thanh tra môi trường, Tư vấn ESG cho tập đoàn.",
                          "advice": "Môn Hóa học là mấu chốt quan trọng nhất của ngành này."
                        }
                      }
                    }
                  }
                }
              },
              "optB": {
                "text": "🌾 Tôi thích ứng dụng kỹ thuật và chế biến sản phẩm từ thiên nhiên",
                "next": {
                  "step": 5,
                  "q": "Bạn muốn làm việc trong phòng lab chế biến thực phẩm hay thiết kế cảnh quan thiên nhiên?",
                  "desc": "Bước 5/6: Phân định Thực phẩm hay Cảnh quan rừng.",
                  "optA": {
                    "text": "🍽️ Công nghệ chế biến thực phẩm và chiết xuất sinh học",
                    "next": {
                      "step": 6,
                      "q": "Bạn thích chế biến công thức đồ ăn thức uống ngon hay nghiên cứu vi sinh phòng lab?",
                      "desc": "Bước 6/6: Chốt Thực phẩm hay Sinh học ứng dụng.",
                      "optA": {
                        "text": "🥫 Nghiên cứu công thức thực phẩm và nước giải khát mới",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "R & I - Công nghệ Thực phẩm",
                          "desc": "Ngành nghề thiết yếu không bao giờ lỗi thời: chế biến, bảo quản và phát triển đồ ăn, đồ uống mới.",
                          "blocks": "A00 (Toán, Lý, Hóa), B00 (Toán, Hóa, Sinh), D07 (Toán, Hóa, Anh)",
                          "majors": "Công nghệ Thực phẩm, Đảm bảo chất lượng & An toàn thực phẩm.",
                          "jobs": "Kỹ sư phát triển sản phẩm (R&D), Chuyên viên kiểm định chất lượng (QA/QC) tại các tập đoàn đồ uống/thực phẩm.",
                          "advice": "Cực kỳ chú trọng môn Hóa học và Vi sinh vật học."
                        }
                      },
                      "optB": {
                        "text": "🧪 Nghiên cứu men sinh học, nấm và dược liệu phòng lab",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "R - Công nghệ Sinh học Ứng dụng",
                          "desc": "Nghiên cứu men vi sinh, lên men và chiết xuất dược liệu tự nhiên.",
                          "blocks": "B00 (Toán, Hóa, Sinh), D07 (Toán, Hóa, Anh)",
                          "majors": "Công nghệ Sinh học, Kỹ thuật sinh học.",
                          "jobs": "Nhà nghiên cứu vi sinh, Kỹ sư lên men công nghiệp, Chuyên viên phòng lab sinh học.",
                          "advice": "Kiên nhẫn và tỉ mỉ trong từng thao tác thí nghiệm phòng lab."
                        }
                      }
                    }
                  },
                  "optB": {
                    "text": "🌳 Thiết kế hoa viên cảnh quan và bảo vệ rừng sinh thái",
                    "next": {
                      "step": 6,
                      "q": "Bạn thích thiết kế cảnh quan công viên xanh hay muốn gắn bó với núi rừng đại ngàn?",
                      "desc": "Bước 6/6: Chốt Cảnh quan đô thị hay Lâm nghiệp.",
                      "optA": {
                        "text": "🏡 Thiết kế cảnh quan sân vườn và công viên đô thị",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "R & A - Kiến trúc Cảnh quan & Hoa viên",
                          "desc": "Sự kết hợp giữa mắt nhìn thẩm mỹ nghệ thuật và kiến thức về các loài cây xanh.",
                          "blocks": "V (Toán, Lý, Vẽ), H (Văn, Vẽ), B00 (Toán, Hóa, Sinh)",
                          "majors": "Kiến trúc Cảnh quan, Lâm nghiệp đô thị.",
                          "jobs": "Kiến trúc sư cảnh quan, Thiết kế sân golf, Chuyên gia quy hoạch cây xanh đô thị.",
                          "advice": "Tập vẽ phác thảo tay và quan sát vẻ đẹp của các loài hoa lá."
                        }
                      },
                      "optB": {
                        "text": "🌲 Quản lý rừng nguyên sinh và phát triển du lịch sinh thái",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "R - Quản lý Rừng & Du lịch Sinh thái",
                          "desc": "Thích lang thang giữa những cánh rừng già và hướng dẫn du khách yêu thiên nhiên.",
                          "blocks": "B00 (Toán, Hóa, Sinh), C00 (Văn, Sử, Địa)",
                          "majors": "Quản lý Tài nguyên Rừng, Du lịch Sinh thái.",
                          "jobs": "Kiểm lâm, Quản lý khu bảo tồn thiên nhiên, Chuyên gia du lịch sinh thái.",
                          "advice": "Tập luyện sức dẻo dai và kỹ năng sinh tồn ngoài trời."
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "optB": {
        "text": "💡 Nghiên cứu phân tích: Thích tư duy giải bài khó, thuật toán, tìm hiểu quy luật",
        "next": {
          "step": 3,
          "q": "Hướng nghiên cứu nào kích thích trí tò mò của bạn nhất?",
          "desc": "Bước 3/6: Phân định Công nghệ Máy tính (IT) hay Y Sinh - Dược học.",
          "optA": {
            "text": "💻 Thuật toán máy tính, Trí tuệ nhân tạo (AI), Phần mềm",
            "next": {
              "step": 4,
              "q": "Bạn có niềm say mê đặc biệt với giải toán logic và viết code máy tính?",
              "desc": "Bước 4/6: Đánh giá tư duy Lập trình thuật toán.",
              "optA": {
                "text": "💻 Rất thích, tôi có thể ngồi cả ngày trước máy tính giải thuật",
                "next": {
                  "step": 5,
                  "q": "Bạn muốn đi sâu vào nghiên cứu thuật toán AI/Bảo mật hay phát triển sản phẩm phần mềm/Game?",
                  "desc": "Bước 5/6: Phân nhánh AI/Security hay Software/Game.",
                  "optA": {
                    "text": "🔬 Đi sâu vào Trí tuệ nhân tạo (AI) và An ninh mạng bảo mật",
                    "next": {
                      "step": 6,
                      "q": "Bạn thích huấn luyện mô hình AI thông minh hay bảo vệ hệ thống mạng chống lại hacker?",
                      "desc": "Bước 6/6: Chốt AI hay An ninh mạng.",
                      "optA": {
                        "text": "🧠 Phát triển thuật toán Trí tuệ nhân tạo (AI) và Big Data",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "I - Kỹ sư Trí tuệ Nhân tạo (AI) & Khoa học Dữ liệu",
                          "desc": "Bạn có bộ não tư duy trừu tượng tuyệt vời, thích 'dạy' cho máy tính tự học và giải các bài toán lớn của nhân loại.",
                          "blocks": "A00 (Toán, Lý, Hóa), A01 (Toán, Lý, Anh), D07 (Toán, Hóa, Anh)",
                          "majors": "Trí tuệ Nhân tạo (AI), Khoa học Dữ liệu (Data Science), Khoa học Máy tính.",
                          "jobs": "Kỹ sư AI/Machine Learning, Chuyên gia Data Scientist, Kỹ sư Xử lý Ngôn ngữ Tự nhiên.",
                          "advice": "Môn Toán (Đại số tuyến tính, Xác suất) và Tiếng Anh là đôi cánh của bạn. Hãy bắt đầu học Python ngay hôm nay!"
                        }
                      },
                      "optB": {
                        "text": "🛡️ Chuyên gia bảo mật an ninh mạng và chống tin tặc",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "I - Kỹ sư An toàn Thông tin & An ninh Mạng",
                          "desc": "Bạn có tư duy thám tử công nghệ, thích bảo vệ hệ thống trước các hacker và tìm kiếm lỗ hổng bảo mật.",
                          "blocks": "A00 (Toán, Lý, Hóa), A01 (Toán, Lý, Anh)",
                          "majors": "An toàn Thông tin, An ninh Mạng, Kỹ thuật Mạng máy tính.",
                          "jobs": "Chuyên gia bảo mật (Hacker mũ trắng), Kỹ sư an ninh mạng SOC, Phân tích mã độc.",
                          "advice": "Tìm hiểu về nguyên lý mạng máy tính và rèn luyện tính bảo mật, cẩn trọng."
                        }
                      }
                    }
                  },
                  "optB": {
                    "text": "💻 Phát triển ứng dụng thực tế (Web/App) và Lập trình Game",
                    "next": {
                      "step": 6,
                      "q": "Bạn thích viết ứng dụng/website phục vụ hàng triệu người hay tự tay làm ra tựa game 3D đỉnh cao?",
                      "desc": "Bước 6/6: Chốt Phần mềm hay Làm Game.",
                      "optA": {
                        "text": "📱 Lập trình ứng dụng di động, website và phần mềm",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "I - Kỹ thuật Phần mềm (Software Engineer)",
                          "desc": "Tạo ra các sản phẩm công nghệ thực tế: từ Shopee, Grab cho đến các siêu ứng dụng toàn cầu.",
                          "blocks": "A00 (Toán, Lý, Hóa), A01 (Toán, Lý, Anh)",
                          "majors": "Kỹ thuật Phần mềm, Hệ thống Thông tin, Công nghệ Thông tin.",
                          "jobs": "Lập trình viên Fullstack, Kỹ sư di động (Mobile App Developer), Kiến trúc sư phần mềm.",
                          "advice": "Học chắc thuật toán căn bản và thực hành làm các dự án web/app nhỏ cùng bạn bè."
                        }
                      },
                      "optB": {
                        "text": "🎮 Thiết kế và lập trình các tựa game đồ họa 3D hấp dẫn",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "I & A - Lập trình Game (Game Developer)",
                          "desc": "Sự kết hợp giữa tư duy lập trình logic và thế giới cốt truyện đồ họa giải trí hấp dẫn.",
                          "blocks": "A00 (Toán, Lý, Hóa), A01 (Toán, Lý, Anh)",
                          "majors": "Thiết kế & Lập trình Game, Đa phương tiện công nghệ.",
                          "jobs": "Game Developer (Unity/Unreal), Lập trình viên đồ họa, Thiết kế cơ chế Game.",
                          "advice": "Học giỏi môn Hình học không gian, Vật lý cơ học và làm quen với công cụ Unity."
                        }
                      }
                    }
                  }
                }
              },
              "optB": {
                "text": "📊 Tôi thích phân tích số liệu tài chính & thị trường hơn là code",
                "next": {
                  "step": 5,
                  "q": "Bạn thích ứng dụng số liệu vào Công nghệ tài chính (Fintech) hay Quản trị dữ liệu kinh doanh?",
                  "desc": "Bước 5/6: Phân nhánh Fintech/Kế toán.",
                  "optA": {
                    "text": "💳 Công nghệ tài chính ngân hàng số (Fintech)",
                    "next": {
                      "step": 6,
                      "q": "Bạn muốn làm thuật toán phân tích tài chính chứng khoán hay làm cầu nối quản trị dữ liệu doanh nghiệp?",
                      "desc": "Bước 6/6: Chốt Fintech hay Hệ thống thông tin.",
                      "optA": {
                        "text": "📈 Công nghệ tài chính (Fintech) và đầu tư tự động",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "I & C - Công nghệ Tài chính (Fintech)",
                          "desc": "Cầu nối giữa Ngân hàng và Công nghệ: thanh toán số, tiền mã hóa, đầu tư thuật toán tự động.",
                          "blocks": "A00 (Toán, Lý, Hóa), A01 (Toán, Lý, Anh), D01 (Toán, Văn, Anh)",
                          "majors": "Công nghệ Tài chính (Fintech), Toán Kinh tế, Phân tích Dữ liệu Kinh doanh.",
                          "jobs": "Chuyên viên phân tích định lượng (Quant), Kỹ sư Fintech tại ngân hàng, Phân tích dữ liệu tài chính.",
                          "advice": "Học xuất sắc môn Toán và nắm vững các kiến thức kinh tế vĩ mô."
                        }
                      },
                      "optB": {
                        "text": "🗄️ Cầu nối phân tích nghiệp vụ và dữ liệu kinh doanh (BA/MIS)",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "C & I - Hệ thống Thông tin Quản lý (MIS)",
                          "desc": "Quản trị cơ sở dữ liệu lớn và tối ưu hóa quy trình làm việc cho các tập đoàn lớn.",
                          "blocks": "A00 (Toán, Lý, Hóa), A01 (Toán, Lý, Anh), D01 (Toán, Văn, Anh)",
                          "majors": "Hệ thống Thông tin Quản lý (MIS), Quản trị Dữ liệu Doanh nghiệp.",
                          "jobs": "Chuyên viên phân tích nghiệp vụ (BA - Business Analyst), Quản trị cơ sở dữ liệu (DBA).",
                          "advice": "Rèn luyện khả năng giao tiếp để hiểu nhu cầu kinh doanh và dịch sang ngôn ngữ kỹ thuật."
                        }
                      }
                    }
                  },
                  "optB": {
                    "text": "📦 Thương mại điện tử và Kiểm toán dòng tiền doanh nghiệp",
                    "next": {
                      "step": 6,
                      "q": "Bạn thích vận hành sàn thương mại điện tử hay kiểm toán sổ sách tài chính chuẩn xác?",
                      "desc": "Bước 6/6: Chốt Thương mại điện tử hay Kiểm toán.",
                      "optA": {
                        "text": "📦 Vận hành sàn TMĐT và điều phối chuỗi cung ứng thông minh",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "I & E - Thương mại Điện tử & Logistics Số",
                          "desc": "Quản lý dòng chảy hàng hóa thông minh toàn cầu dựa trên công nghệ dữ liệu định vị.",
                          "blocks": "A01 (Toán, Lý, Anh), D01 (Toán, Văn, Anh), A00 (Toán, Lý, Hóa)",
                          "majors": "Thương mại Điện tử, Logistics & Quản lý Chuỗi Cung ứng.",
                          "jobs": "Chuyên viên vận hành sàn TMĐT, Quản lý chuỗi cung ứng quốc tế, Tối ưu hóa kho vận thông minh.",
                          "advice": "Trau dồi ngoại ngữ (Tiếng Anh, Tiếng Trung) và tư duy logic dòng tiền/hàng."
                        }
                      },
                      "optB": {
                        "text": "📊 Kiểm toán viên tại các tập đoàn kiểm toán tài chính hàng đầu",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "C - Kiểm toán & Phân tích Thuế",
                          "desc": "Bậc thầy về sự chuẩn xác, kiểm soát rủi ro tài chính cho các công ty lớn.",
                          "blocks": "A00 (Toán, Lý, Hóa), A01 (Toán, Lý, Anh), D01 (Toán, Văn, Anh)",
                          "majors": "Kiểm toán, Kế toán Doanh nghiệp, Thuế.",
                          "jobs": "Kiểm toán viên tại các hãng kiểm toán Big 4, Kế toán trưởng, Thanh tra tài chính.",
                          "advice": "Tính cẩn thận, không được cẩu thả dù chỉ 1 dấu chấm, dấu phẩy trong bảng tính."
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "optB": {
            "text": "🧬 Cơ thể con người, Y học, Khám phá vi khuẩn & thuốc",
            "next": {
              "step": 4,
              "q": "Bạn học giỏi môn Hóa học và Sinh học nhất trong tất cả các môn tự nhiên?",
              "desc": "Bước 4/6: Đánh giá tố chất ngành Y Dược.",
              "optA": {
                "text": "🩺 Đúng vậy, tôi muốn làm Bác sĩ hoặc Dược sĩ chữa bệnh",
                "next": {
                  "step": 5,
                  "q": "Bạn muốn trực tiếp khám chữa bệnh hay nghiên cứu bào chế thuốc trong phòng lab?",
                  "desc": "Bước 5/6: Phân định Bác sĩ hay Dược sĩ.",
                  "optA": {
                    "text": "🏥 Khám chữa bệnh tại bệnh viện (Bác sĩ / Xét nghiệm)",
                    "next": {
                      "step": 6,
                      "q": "Bạn muốn trực tiếp cầm dao mổ phẫu thuật cứu người hay làm chuyên gia xét nghiệm mầm bệnh?",
                      "desc": "Bước 6/6: Chốt Bác sĩ hay Kỹ thuật xét nghiệm.",
                      "optA": {
                        "text": "🩺 Trực tiếp khám bệnh, phẫu thuật cứu sống bệnh nhân",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "I & S - Bác sĩ Y Khoa (Medicine)",
                          "desc": "Bạn có trái tim nhân hậu, ý chí sắt đá và trí tuệ mẫn tiệp để cứu người, mang lại sự sống.",
                          "blocks": "B00 (Toán, Hóa, Sinh), B08 (Toán, Sinh, Anh)",
                          "majors": "Bác sĩ Đa khoa, Bác sĩ Răng Hàm Mặt, Bác sĩ Ngoại khoa.",
                          "jobs": "Bác sĩ điều trị tại bệnh viện tuyến trung ương/tỉnh, Bác sĩ phẫu thuật, Chuyên gia y tế.",
                          "advice": "Điểm chuẩn y khoa luôn ở top cao nhất cả nước. Hãy kỷ luật ôn thi môn Toán, Hóa, Sinh từ ngay lúc này!"
                        }
                      },
                      "optB": {
                        "text": "🔬 Phân tích mẫu bệnh phẩm, gen và chụp X-quang/MRI trong lab",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "I - Kỹ thuật Xét nghiệm Y học & Chẩn đoán hình ảnh",
                          "desc": "Những 'thám tử thầm lặng' trong y khoa: phát hiện mầm bệnh qua kính hiển vi và máy chụp cộng hưởng từ.",
                          "blocks": "B00 (Toán, Hóa, Sinh), D07 (Toán, Hóa, Anh)",
                          "majors": "Kỹ thuật Xét nghiệm Y học, Kỹ thuật Hình ảnh Y học.",
                          "jobs": "Kỹ thuật viên xét nghiệm máu/gen, Chuyên viên phòng lab bệnh viện, Phân tích tế bào học.",
                          "advice": "Đòi hỏi tính cực kỳ chuẩn xác và không được có sai sót phòng thí nghiệm."
                        }
                      }
                    }
                  },
                  "optB": {
                    "text": "💊 Nghiên cứu phát triển thuốc và tế bào gốc (Dược / Y sinh)",
                    "next": {
                      "step": 6,
                      "q": "Bạn muốn bào chế thuốc viên, dược phẩm chữa bệnh hay nghiên cứu gen và tế bào gốc tương lai?",
                      "desc": "Bước 6/6: Chốt Dược học hay Công nghệ sinh học Y sinh.",
                      "optA": {
                        "text": "💊 Bào chế thuốc tây y, kiểm nghiệm và phân phối dược phẩm",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "I - Dược Sĩ (Pharmacy)",
                          "desc": "Bậc thầy về tương tác thuốc, bào chế dược phẩm và quản lý chất lượng dược phẩm cho sức khỏe con người.",
                          "blocks": "A00 (Toán, Lý, Hóa), B00 (Toán, Hóa, Sinh), D07 (Toán, Hóa, Anh)",
                          "majors": "Dược học, Hóa Dược, Công nghệ Dược phẩm.",
                          "jobs": "Dược sĩ nghiên cứu tại tập đoàn dược, Dược sĩ lâm sàng bệnh viện, Quản lý nhà thuốc.",
                          "advice": "Môn Hóa học là linh hồn của Dược học. Hãy cày nát các phương trình phản ứng hữu cơ!"
                        }
                      },
                      "optB": {
                        "text": "🧬 Nghiên cứu giải mã bộ gen, tế bào gốc và chế tạo vaccine",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "I - Công nghệ Sinh học Y sinh (Biomedical)",
                          "desc": "Nghiên cứu tế bào gốc, công nghệ giải mã gen người và vaccine phòng bệnh hiện đại.",
                          "blocks": "B00 (Toán, Hóa, Sinh), D07 (Toán, Hóa, Anh)",
                          "majors": "Kỹ thuật Y sinh, Công nghệ Sinh học Y học, Di truyền học.",
                          "jobs": "Nhà nghiên cứu vaccine, Kỹ sư thiết bị y sinh thông minh, Chuyên gia di truyền.",
                          "advice": "Đọc thêm nhiều tài liệu y sinh quốc tế để nâng cao kiến thức sinh học phân tử."
                        }
                      }
                    }
                  }
                }
              },
              "optB": {
                "text": "❤️ Tôi thích chăm sóc phục hồi sức khỏe và tâm lý con người",
                "next": {
                  "step": 5,
                  "q": "Bạn quan tâm đến chăm sóc phục hồi thể chất hay trị liệu sức khỏe tinh thần?",
                  "desc": "Bước 5/6: Phân nhánh Thể chất hay Tinh thần.",
                  "optA": {
                    "text": "🩹 Chăm sóc điều dưỡng thể chất và tư vấn dinh dưỡng",
                    "next": {
                      "step": 6,
                      "q": "Bạn thích chăm sóc hồi phục cho người bệnh hay tư vấn chế độ dinh dưỡng lành mạnh?",
                      "desc": "Bước 6/6: Chốt Điều dưỡng hay Dinh dưỡng.",
                      "optA": {
                        "text": "❤️ Điều dưỡng chăm sóc bệnh nhân và vật lý trị liệu",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "S & I - Điều dưỡng & Phục hồi Chức năng",
                          "desc": "Ngành nghề giàu lòng nhân ái, có nhu cầu tuyển dụng khổng lồ tại Việt Nam và các nước như Đức, Nhật Bản.",
                          "blocks": "B00 (Toán, Hóa, Sinh), D07 (Toán, Hóa, Anh)",
                          "majors": "Điều dưỡng, Kỹ thuật Phục hồi Chức năng, Vật lý Trị liệu.",
                          "jobs": "Điều dưỡng viên trưởng, Chuyên gia vật lý trị liệu, Chăm sóc y tế quốc tế.",
                          "advice": "Học chắc sinh học và trau dồi thêm ngoại ngữ (Tiếng Đức hoặc Tiếng Nhật) để có cơ hội học bổng lớn."
                        }
                      },
                      "optB": {
                        "text": "🥗 Chuyên gia tư vấn chế độ ăn uống và dinh dưỡng thể thao",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "I & S - Dinh dưỡng & Y tế Công cộng",
                          "desc": "Chăm sóc sức khỏe thông qua chế độ ăn uống khoa học và kiểm soát dịch bệnh cộng đồng.",
                          "blocks": "B00 (Toán, Hóa, Sinh), D07 (Toán, Hóa, Anh)",
                          "majors": "Dinh dưỡng học, Y tế Công cộng.",
                          "jobs": "Chuyên gia tư vấn dinh dưỡng thể thao/bệnh viện, Cán bộ phòng chống dịch tễ.",
                          "advice": "Học giỏi Hóa Sinh và rèn luyện kỹ năng truyền thông giáo dục sức khỏe."
                        }
                      }
                    }
                  },
                  "optB": {
                    "text": "🧘 Tham vấn trị liệu tâm lý và quản lý cơ sở y tế",
                    "next": {
                      "step": 6,
                      "q": "Bạn muốn tư vấn trị liệu tâm lý hay tham gia điều hành quản lý bệnh viện?",
                      "desc": "Bước 6/6: Chốt Tâm lý hay Quản lý y tế.",
                      "optA": {
                        "text": "🧠 Chuyên gia tham vấn và trị liệu tâm lý cho mọi người",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "I & S - Tâm lý học Lâm sàng (Clinical Psychology)",
                          "desc": "Trở thành người chữa lành tâm hồn, lắng nghe và giải tỏa những tổn thương tâm lý cho người khác.",
                          "blocks": "C00 (Văn, Sử, Địa), D01 (Toán, Văn, Anh), B00 (Toán, Hóa, Sinh)",
                          "majors": "Tâm lý học, Tâm lý học Giáo dục, Trị liệu Tâm lý.",
                          "jobs": "Chuyên gia tham vấn tâm lý, Trị liệu tâm lý tại bệnh viện, Cố vấn tâm lý học đường.",
                          "advice": "Đọc nhiều sách tâm lý học, học cách lắng nghe không phán xét và bồi dưỡng vốn sống."
                        }
                      },
                      "optB": {
                        "text": "🏢 Quản lý vận hành bệnh viện và hệ thống bảo hiểm y tế",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "S - Quản trị Bệnh viện & Y tế",
                          "desc": "Tổ chức vận hành bệnh viện khoa học, nâng cao chất lượng phục vụ cho bệnh nhân.",
                          "blocks": "A00 (Toán, Lý, Hóa), D01 (Toán, Văn, Anh)",
                          "majors": "Quản lý Bệnh viện, Kinh tế Y tế.",
                          "jobs": "Nhà quản lý bệnh viện, Chuyên viên bảo hiểm y tế, Giám sát chất lượng dịch vụ y tế.",
                          "advice": "Kết hợp giữa hiểu biết y tế và kỹ năng quản trị kinh doanh."
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "optB": {
    "text": "📚 Khoa học Xã hội, Ngôn ngữ, Nghệ thuật, Kinh tế",
    "next": {
      "step": 2,
      "q": "Trong thế giới Xã hội & Con người, thiên hướng bẩm sinh nào đúng với bạn hơn?",
      "desc": "Bước 2/6: Phân định Nghệ thuật (A) hay Lãnh đạo/Giúp đỡ (E, S).",
      "optA": {
        "text": "🎨 Sáng tạo tự do, Nghệ thuật, Thẩm mỹ, Ngôn từ & Cảm xúc (A)",
        "next": {
          "step": 3,
          "q": "Kênh biểu đạt sáng tạo nào khiến bạn cảm thấy tự tin và hào hứng nhất?",
          "desc": "Bước 3/6: Phân định Nghệ thuật Thị giác hay Ngôn từ Báo chí.",
          "optA": {
            "text": "🖌️ Hình ảnh, Màu sắc, Không gian, Bản vẽ, Thời trang, Video đồ họa",
            "next": {
              "step": 4,
              "q": "Bạn có năng khiếu vẽ tay, thích phối màu và phần mềm đồ họa máy tính?",
              "desc": "Bước 4/6: Đánh giá thế mạnh mỹ thuật thị giác.",
              "optA": {
                "text": "🎨 Đúng vậy, tôi thích vẽ tranh, đồ họa và kiến trúc",
                "next": {
                  "step": 5,
                  "q": "Bạn thích sáng tạo hình ảnh 2D/thời trang hay thiết kế không gian kiến trúc 3D?",
                  "desc": "Bước 5/6: Phân nhánh Đồ họa/Thời trang hay Kiến trúc/Nội thất.",
                  "optA": {
                    "text": "🖌️ Thiết kế đồ họa quảng cáo và trang phục thời trang",
                    "next": {
                      "step": 6,
                      "q": "Bạn thích sáng tạo hình ảnh kỹ thuật số (poster, logo, web) hay thiết kế trang phục thời trang?",
                      "desc": "Bước 6/6: Chốt Đồ họa hay Thời trang.",
                      "optA": {
                        "text": "🎨 Thiết kế đồ họa, vẽ minh họa số và làm thương hiệu",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "A - Thiết kế Đồ họa & Mỹ thuật Đa phương tiện (Graphic Design)",
                          "desc": "Bạn có trực giác thẩm mỹ đỉnh cao, nhạy cảm với cái đẹp và có khả năng biến ý tưởng thành visual bắt mắt.",
                          "blocks": "H (Văn, Vẽ), V (Toán, Lý, Vẽ), A01 (Toán, Lý, Anh), D01 (Toán, Văn, Anh)",
                          "majors": "Thiết kế Đồ họa, Mỹ thuật Đa phương tiện, Kỹ xảo Điện ảnh (VFX).",
                          "jobs": "Graphic Designer, Art Director (Giám đốc nghệ thuật), Họa sĩ minh họa số, UI/UX Designer.",
                          "advice": "Luyện thi vẽ mỹ thuật từ sớm, tự học các phần mềm Photoshop, Illustrator và xây dựng Portfolio cá nhân."
                        }
                      },
                      "optB": {
                        "text": "👗 Thiết kế trang phục thời trang và stylist phong cách",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "A - Thiết kế Thời trang & Stylist",
                          "desc": "Bạn đam mê xu hướng ăn mặc, chất liệu vải và phong cách định hình cá tính con người.",
                          "blocks": "H (Văn, Vẽ), D01 (Toán, Văn, Anh)",
                          "majors": "Thiết kế Thời trang, Kinh doanh Thời trang.",
                          "jobs": "Nhà thiết kế thời trang, Fashion Stylist, Quản lý nhãn hàng may mặc cao cấp.",
                          "advice": "Theo dõi các tuần lễ thời trang quốc tế và trau dồi khiếu cắt may, phối đồ."
                        }
                      }
                    }
                  },
                  "optB": {
                    "text": "📐 Thiết kế kiến trúc tòa nhà và không gian nội thất",
                    "next": {
                      "step": 6,
                      "q": "Bạn thích vẽ nên những tòa nhà biểu tượng bên ngoài hay bài trí không gian nội thất ấm cúng bên trong?",
                      "desc": "Bước 6/6: Chốt Kiến trúc hay Nội thất.",
                      "optA": {
                        "text": "🏛️ Kiến trúc sư thiết kế công trình và tòa nhà biểu tượng",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "A & R - Kiến trúc Sư (Architecture)",
                          "desc": "Sự kết hợp hoàn hảo giữa tâm hồn nghệ sĩ lãng mạn và sự chuẩn xác của toán học kết cấu công trình.",
                          "blocks": "V (Toán, Lý, Vẽ), V01 (Toán, Văn, Vẽ), H (Văn, Vẽ)",
                          "majors": "Kiến trúc Công trình, Quy hoạch Đô thị, Thiết kế Nội thất.",
                          "jobs": "Kiến trúc sư chủ trì, Thiết kế không gian nội thất, Quy hoạch cảnh quan thành phố.",
                          "advice": "Luyện vẽ tĩnh vật, tượng thạch cao ngay từ lớp 10, học thật chắc môn Toán và Vật lý."
                        }
                      },
                      "optB": {
                        "text": "🛋️ Thiết kế nội thất không gian sống sang trọng, ấm cúng",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "A - Thiết kế Nội thất & Không gian Sống",
                          "desc": "Biến những căn phòng trống thành không gian ấm cúng, tinh tế và đầy tính nghệ thuật.",
                          "blocks": "H (Văn, Vẽ), V (Toán, Lý, Vẽ)",
                          "majors": "Thiết kế Nội thất, Trang trí không gian.",
                          "jobs": "Nhà thiết kế nội thất nhà ở/khách sạn, Chuyên viên thiết kế ánh sáng, Giám sát nội thất.",
                          "advice": "Rèn luyện khiếu thẩm mỹ về màu sắc và vật liệu gỗ, đá, kim loại."
                        }
                      }
                    }
                  }
                }
              },
              "optB": {
                "text": "🎬 Tôi thích nghệ thuật phim ảnh, âm nhạc và biểu diễn",
                "next": {
                  "step": 5,
                  "q": "Bạn hứng thú với nghệ thuật phim ảnh/nhiếp ảnh hay âm nhạc/sân khấu biểu diễn?",
                  "desc": "Bước 5/6: Phân nhánh Điện ảnh/Ảnh hay Âm nhạc/Sân khấu.",
                  "optA": {
                    "text": "🎥 Đạo diễn phim ảnh và nghệ thuật nhiếp ảnh",
                    "next": {
                      "step": 6,
                      "q": "Bạn thích đạo diễn cả bộ phim chuyển động hay bắt trọn khoảnh khắc qua một bức ảnh tĩnh?",
                      "desc": "Bước 6/6: Chốt Đạo diễn hay Nhiếp ảnh.",
                      "optA": {
                        "text": "🎬 Đạo diễn phim ảnh, MV ca nhạc và video quảng cáo",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "A - Đạo diễn Điện ảnh & Truyền hình",
                          "desc": "Thổi hồn vào từng khung hình, tạo ra những thước phim lay động hàng triệu trái tim khán giả.",
                          "blocks": "S (Năng khiếu Sân khấu Điện ảnh), D01 (Toán, Văn, Anh)",
                          "majors": "Đạo diễn Điện ảnh, Quay phim, Biên kịch Phim.",
                          "jobs": "Đạo diễn phim, Đạo diễn TVC quảng cáo/MV ca nhạc, Nhà sản xuất phim ảnh.",
                          "advice": "Xem nhiều phim kinh điển thế giới và tập quay video ngắn bằng điện thoại."
                        }
                      },
                      "optB": {
                        "text": "📷 Nhiếp ảnh gia chuyên nghiệp ghi lại khoảnh khắc đắt giá",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "A - Nhiếp ảnh Nghệ thuật & Chụp ảnh Quảng cáo",
                          "desc": "Ghi lại những khoảnh khắc đắt giá qua lăng kính máy ảnh chuyên nghiệp.",
                          "blocks": "D01 (Toán, Văn, Anh), C00 (Văn, Sử, Địa)",
                          "majors": "Nhiếp ảnh Báo chí, Nhiếp ảnh Nghệ thuật.",
                          "jobs": "Nhiếp ảnh gia chuyên nghiệp (Photographer), Giám đốc hình ảnh studio, Chụp ảnh sự kiện lớn.",
                          "advice": "Học cách làm chủ ánh sáng và bố cục khuôn hình."
                        }
                      }
                    }
                  },
                  "optB": {
                    "text": "🎤 Sản xuất âm nhạc và diễn xuất sân khấu",
                    "next": {
                      "step": 6,
                      "q": "Bạn có thiên hướng sáng tác/sản xuất âm nhạc hay trực tiếp diễn xuất tỏa sáng trước ống kính?",
                      "desc": "Bước 6/6: Chốt Âm nhạc hay Diễn xuất.",
                      "optA": {
                        "text": "🎵 Sản xuất âm nhạc, hòa âm phối khí và sáng tác bài hát",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "A - Sản xuất Âm nhạc & Nhạc sĩ (Music Producer)",
                          "desc": "Phù thủy âm thanh: tạo nên những bản hit đứng đầu bảng xếp hạng bằng công nghệ thu âm hiện đại.",
                          "blocks": "N (Thẩm âm, Tiết tấu), D01 (Toán, Văn, Anh)",
                          "majors": "Sản xuất Âm nhạc, Sáng tác, Kỹ thuật Âm thanh.",
                          "jobs": "Music Producer, Nhạc sĩ, Kỹ sư hòa âm phối khí, Giám đốc âm nhạc chương trình.",
                          "advice": "Trau dồi nhạc lý căn bản và làm quen với phần mềm phối khí như FL Studio, Ableton."
                        }
                      },
                      "optB": {
                        "text": "🎭 Diễn viên điện ảnh, kịch nghệ và MC truyền hình",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "A - Nghệ thuật Biểu diễn & Diễn viên",
                          "desc": "Tự tin tỏa sáng trên sân khấu, nhập vai vào số phận của các nhân vật đa dạng.",
                          "blocks": "Năng khiếu Sân khấu, Văn học",
                          "majors": "Diễn viên Kịch - Điện ảnh, Nghệ thuật Trình diễn.",
                          "jobs": "Diễn viên, Nghệ sĩ kịch nghệ, MC dẫn chương trình truyền hình.",
                          "advice": "Luyện phát âm chuẩn, khả năng biểu cảm khuôn mặt và vượt qua nỗi sợ đám đông."
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "optB": {
            "text": "✍️ Con chữ, Ngôn từ, Báo chí, Kịch bản, Sáng tạo câu chuyện truyền cảm hứng",
            "next": {
              "step": 4,
              "q": "Bạn học rất giỏi môn Ngữ văn và có khả năng viết lách lưu loát, truyền cảm?",
              "desc": "Bước 4/6: Đánh giá tư duy ngôn ngữ.",
              "optA": {
                "text": "✍️ Đúng vậy, tôi thích viết bài báo chí và truyền thông sáng tạo",
                "next": {
                  "step": 5,
                  "q": "Bạn thích phản ánh tin tức sự thật (Báo chí) hay làm truyền thông thương mại (PR / Ngoại ngữ)?",
                  "desc": "Bước 5/6: Phân nhánh Báo chí hay PR/Ngoại ngữ.",
                  "optA": {
                    "text": "📰 Báo chí, phóng viên và biên tập văn học",
                    "next": {
                      "step": 6,
                      "q": "Bạn muốn làm phóng viên điều tra thời sự hay biên tập các tác phẩm văn học sách báo?",
                      "desc": "Bước 6/6: Chốt Báo chí hay Biên tập viên sách.",
                      "optA": {
                        "text": "📰 Nhà báo, phóng viên điều tra tin tức thời sự nóng hổi",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "A & S - Báo chí & Truyền thông Đa phương tiện",
                          "desc": "Ngòi bút sắc bén phản ánh hơi thở cuộc sống, lên tiếng vì sự thật và định hướng dư luận xã hội.",
                          "blocks": "C00 (Văn, Sử, Địa), D01 (Toán, Văn, Anh), D14 (Văn, Sử, Anh)",
                          "majors": "Báo chí, Truyền thông Đa phương tiện, Xuất bản.",
                          "jobs": "Nhà báo, Phóng viên điều tra, Biên tập viên đài truyền hình, Thư ký tòa soạn.",
                          "advice": "Đọc báo hàng ngày, rèn luyện tư duy phản biện và khả năng viết bài nhanh dưới áp lực thời gian."
                        }
                      },
                      "optB": {
                        "text": "📚 Biên tập viên sách tại nhà xuất bản và sáng tác văn học",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "A - Biên tập Sách & Sáng tác Văn học",
                          "desc": "Thế giới của những trang sách sâu lắng, nuôi dưỡng tâm hồn và gìn giữ văn hóa đọc.",
                          "blocks": "C00 (Văn, Sử, Địa), D01 (Toán, Văn, Anh)",
                          "majors": "Văn học, Ngôn ngữ học, Hán Nôm, Xuất bản.",
                          "jobs": "Biên tập viên nhà xuất bản, Nhà văn, Tác giả sách, Chuyên gia hiệu đính ngôn ngữ.",
                          "advice": "Nuôi dưỡng vốn từ vựng phong phú và sự kiên nhẫn khi đọc các tác phẩm văn học lớn."
                        }
                      }
                    }
                  },
                  "optB": {
                    "text": "📢 Quan hệ công chúng (PR) và biên phiên dịch quốc tế",
                    "next": {
                      "step": 6,
                      "q": "Bạn muốn làm chuyên gia PR truyền thông thương hiệu hay phiên dịch viên quốc tế cao cấp?",
                      "desc": "Bước 6/6: Chốt PR hay Biên phiên dịch.",
                      "optA": {
                        "text": "📣 Sáng tạo nội dung truyền thông (PR / Content Creator)",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "A & E - Quan hệ Công chúng (PR) & Sáng tạo Nội dung",
                          "desc": "Bậc thầy kể chuyện cho thương hiệu: biến sản phẩm bình thường thành hiện tượng truyền thông được yêu thích.",
                          "blocks": "D01 (Toán, Văn, Anh), C00 (Văn, Sử, Địa), A01 (Toán, Lý, Anh)",
                          "majors": "Quan hệ Công chúng (PR), Truyền thông Quốc tế, Quản trị Truyền thông.",
                          "jobs": "Chuyên viên PR, Copywriter, Giám đốc truyền thông doanh nghiệp, Content Creator triệu view.",
                          "advice": "Nắm bắt nhanh các trend mạng xã hội và rèn luyện kỹ năng viết thông cáo báo chí chuyên nghiệp."
                        }
                      },
                      "optB": {
                        "text": "🌐 Biên dịch - Phiên dịch viên đa ngôn ngữ quốc tế",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "A - Dịch thuật & Biên - Phiên dịch Quốc tế",
                          "desc": "Cầu nối văn hóa giữa các quốc gia, chuyển tải chính xác tư tưởng qua rào cản ngôn ngữ.",
                          "blocks": "D01 (Toán, Văn, Anh), D04 (Toán, Văn, Trung), D06 (Toán, Văn, Nhật)",
                          "majors": "Biên - Phiên dịch, Ngôn ngữ Anh/Trung/Hàn/Nhật.",
                          "jobs": "Phiên dịch viên cabin cao cấp, Biên dịch viên sách/phim, Cán bộ ngoại giao văn hóa.",
                          "advice": "Học ngoại ngữ như tiếng mẹ đẻ và nắm chắc văn hóa bản địa của quốc gia đó."
                        }
                      }
                    }
                  }
                }
              },
              "optB": {
                "text": "📚 Tôi thích nghiên cứu văn hóa lịch sử và giảng dạy sư phạm",
                "next": {
                  "step": 5,
                  "q": "Bạn có hứng thú nghiên cứu lịch sử văn hóa hay thích con đường giảng dạy sư phạm?",
                  "desc": "Bước 5/6: Phân định Nghiên cứu văn hóa hay Sư phạm.",
                  "optA": {
                    "text": "📜 Nghiên cứu lịch sử, khảo cổ và văn hóa dân tộc",
                    "next": {
                      "step": 6,
                      "q": "Bạn thích khám phá hiện vật khảo cổ học hay nghiên cứu phong tục tập quán văn hóa?",
                      "desc": "Bước 6/6: Chốt Khảo cổ hay Văn hóa học.",
                      "optA": {
                        "text": "🏺 Khảo cổ học, lịch sử và bảo tồn di tích cổ",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "I & A - Lịch sử học & Khảo cổ học",
                          "desc": "Giải mã các bí ẩn của quá khứ, bảo tồn di sản văn hóa quý báu của dân tộc.",
                          "blocks": "C00 (Văn, Sử, Địa), D14 (Văn, Sử, Anh)",
                          "majors": "Lịch sử học, Khảo cổ học, Bảo tàng học, Di sản văn hóa.",
                          "jobs": "Nhà nghiên cứu lịch sử, Cán bộ bảo tàng, Chuyên gia giám định cổ vật, Tư vấn phim dã sử.",
                          "advice": "Môn Lịch sử là gốc rễ, rèn luyện sự cẩn trọng và niềm tự hào dân tộc."
                        }
                      },
                      "optB": {
                        "text": "🏮 Văn hóa học, lễ hội truyền thống và giao lưu quốc tế",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "A & S - Việt Nam học & Văn hóa học",
                          "desc": "Giới thiệu vẻ đẹp đất nước, con người và phong tục tập quán Việt Nam ra thế giới.",
                          "blocks": "C00 (Văn, Sử, Địa), D01 (Toán, Văn, Anh)",
                          "majors": "Việt Nam học, Văn hóa học, Nhân học.",
                          "jobs": "Cố vấn văn hóa, Nghiên cứu phong tục tập quán, Chuyên viên giao lưu quốc tế.",
                          "advice": "Đi nhiều nơi, tiếp xúc nhiều cộng đồng để hiểu sâu sắc văn hóa bản địa."
                        }
                      }
                    }
                  },
                  "optB": {
                    "text": "🎓 Sư phạm giảng dạy các môn khoa học xã hội",
                    "next": {
                      "step": 6,
                      "q": "Bạn muốn đứng trên bục giảng dạy Văn/Sử hay nghiên cứu lý luận chính trị xã hội?",
                      "desc": "Bước 6/6: Chốt Sư phạm hay Lý luận.",
                      "optA": {
                        "text": "👩‍🏫 Giáo viên dạy Văn, Lịch sử, Địa lý truyền cảm hứng",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "S - Sư phạm Ngữ văn / Lịch sử / Địa lý",
                          "desc": "Người truyền lửa tri thức nhân văn, khơi dậy tình yêu quê hương đất nước cho học trò.",
                          "blocks": "C00 (Văn, Sử, Địa), D01 (Toán, Văn, Anh)",
                          "majors": "Sư phạm Ngữ văn, Sư phạm Lịch sử, Sư phạm Lịch sử - Địa lý.",
                          "jobs": "Giáo viên THPT, Giảng viên đại học, Chuyên viên nghiên cứu giáo dục tại Sở/Bộ GD&ĐT.",
                          "advice": "Rèn luyện giọng nói truyền cảm, chuẩn mực và khả năng sư phạm truyền cảm hứng."
                        }
                      },
                      "optB": {
                        "text": "🏛️ Giảng viên triết học và chuyên viên lý luận chính sách",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "S - Triết học & Lý luận Chính trị",
                          "desc": "Tư duy biện chứng sâu sắc về sự phát triển của tư tưởng và xã hội loài người.",
                          "blocks": "C00 (Văn, Sử, Địa)",
                          "majors": "Triết học, Xây dựng Đảng & Chính quyền nhà nước, Lý luận chính trị.",
                          "jobs": "Giảng viên lý luận, Chuyên viên ban tuyên giáo, Nghiên cứu chính sách công.",
                          "advice": "Rèn luyện khả năng đọc sách hàn lâm và tư duy phân tích chính trị xã hội sắc bén."
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "optB": {
        "text": "💼 Lãnh đạo, Giao tiếp thuyết phục, Kinh doanh, Giúp đỡ cộng đồng (E, S)",
        "next": {
          "step": 3,
          "q": "Mục tiêu cuộc đời nào tạo động lực lớn nhất cho bạn?",
          "desc": "Bước 3/6: Phân định Nhóm Kinh doanh lãnh đạo hay Phụng sự xã hội.",
          "optA": {
            "text": "🏆 Khởi nghiệp, Làm giàu, Thăng tiến quản lý, Kinh doanh buôn bán (E)",
            "next": {
              "step": 4,
              "q": "Bạn tự tin nhất ở khả năng ăn nói, thuyết phục người khác hay khả năng tính toán chiến lược số liệu?",
              "desc": "Bước 4/6: Đánh giá tố chất Doanh nhân.",
              "optA": {
                "text": "🗣️ Khả năng ăn nói khéo léo, đàm phán và thuyết phục lòng người",
                "next": {
                  "step": 5,
                  "q": "Bạn thích chuyên sâu về Marketing bán hàng hay quản trị điều hành tổng thể doanh nghiệp/khách sạn?",
                  "desc": "Bước 5/6: Phân nhánh Marketing/Sales hay CEO/Khách sạn.",
                  "optA": {
                    "text": "📢 Marketing quảng bá và phát triển thị trường bán hàng",
                    "next": {
                      "step": 6,
                      "q": "Bạn thích lên chiến lược quảng cáo thương hiệu hay trực tiếp đàm phán chốt hợp đồng lớn?",
                      "desc": "Bước 6/6: Chốt Marketing hay Sales.",
                      "optA": {
                        "text": "💡 Sáng tạo chiến dịch Marketing và quảng bá thương hiệu",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "E - Chuyên gia Marketing & Truyền thông Thương hiệu",
                          "desc": "Bộ não chiến lược đằng sau sự thành công của sản phẩm: thu hút khách hàng và thống lĩnh thị trường.",
                          "blocks": "A01 (Toán, Lý, Anh), D01 (Toán, Văn, Anh), A00 (Toán, Lý, Hóa)",
                          "majors": "Marketing, Quản trị Thương hiệu, Digital Marketing.",
                          "jobs": "Giám đốc Marketing (CMO), Trưởng phòng truyền thông, Chuyên gia chạy quảng cáo số, Brand Manager.",
                          "advice": "Học giỏi tiếng Anh và rèn luyện kỹ năng quan sát hành vi mua sắm của người tiêu dùng."
                        }
                      },
                      "optB": {
                        "text": "🤝 Đàm phán kinh doanh, chốt hợp đồng lớn với đối tác",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "E - Quản trị Bán hàng & Phát triển Thị trường (Sales Director)",
                          "desc": "Chiến binh tiên phong của doanh nghiệp: mang doanh thu khổng lồ về cho công ty nhờ khả năng chốt sale bậc thầy.",
                          "blocks": "D01 (Toán, Văn, Anh), A01 (Toán, Lý, Anh)",
                          "majors": "Quản trị Kinh doanh, Thương mại Quốc tế.",
                          "jobs": "Giám đốc kinh doanh, Trưởng phòng phát triển đại lý, Chuyên viên đàm phán hợp đồng lớn.",
                          "advice": "Rèn luyện khả năng chịu áp lực doanh số và thái độ kiên trì, không bỏ cuộc khi bị từ chối."
                        }
                      }
                    }
                  },
                  "optB": {
                    "text": "👔 Quản trị kinh doanh khởi nghiệp và khách sạn nghỉ dưỡng",
                    "next": {
                      "step": 6,
                      "q": "Bạn muốn lập công ty riêng làm chủ doanh nghiệp hay quản lý khách sạn resort 5 sao đẳng cấp?",
                      "desc": "Bước 6/6: Chốt CEO Khởi nghiệp hay Quản trị Khách sạn.",
                      "optA": {
                        "text": "🚀 Khởi nghiệp mở công ty riêng và điều hành doanh nghiệp",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "E - Quản trị Kinh doanh & Khởi nghiệp (CEO/Founder)",
                          "desc": "Người thuyền trưởng chèo lái con thuyền doanh nghiệp: có tầm nhìn xa trông rộng, dám chấp nhận rủi ro để thành công.",
                          "blocks": "A01 (Toán, Lý, Anh), D01 (Toán, Văn, Anh), A00 (Toán, Lý, Hóa)",
                          "majors": "Quản trị Kinh doanh, Khởi nghiệp & Đổi mới sáng tạo.",
                          "jobs": "CEO / Tổng giám đốc, Nhà sáng lập doanh nghiệp (Founder), Giám đốc điều hành (COO).",
                          "advice": "Tham gia các hoạt động ngoại khóa, câu lạc bộ kinh doanh của trường để trau dồi bản lĩnh lãnh đạo."
                        }
                      },
                      "optB": {
                        "text": "🏨 Tổng quản lý khách sạn 5 sao, resort nghỉ dưỡng quốc tế",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "E - Quản trị Khách sạn & Nghỉ dưỡng Quốc tế",
                          "desc": "Quản lý các resort 5 sao sang trọng, mang lại dịch vụ đẳng cấp quốc tế cho du khách thượng lưu.",
                          "blocks": "D01 (Toán, Văn, Anh), A01 (Toán, Lý, Anh)",
                          "majors": "Quản trị Khách sạn, Quản trị Dịch vụ Du lịch & Lữ hành.",
                          "jobs": "Giám đốc khách sạn 5 sao, Quản lý khu nghỉ dưỡng cao cấp, Giám đốc sự kiện quốc tế.",
                          "advice": "Trau dồi ngoại ngữ lưu loát, thái độ lịch thiệp và kỹ năng chăm sóc khách hàng tinh tế."
                        }
                      }
                    }
                  }
                }
              },
              "optB": {
                "text": "📈 Khả năng phân tích luật lệ, số liệu và chiến lược dòng tiền",
                "next": {
                  "step": 5,
                  "q": "Bạn thích lĩnh vực Pháp lý/Nhân sự hay Tài chính đầu tư tiền tệ?",
                  "desc": "Bước 5/6: Phân định Luật/HR hay Tài chính/Địa ốc.",
                  "optA": {
                    "text": "⚖️ Luật sư kinh tế và Quản trị nhân sự doanh nghiệp",
                    "next": {
                      "step": 6,
                      "q": "Bạn thích bảo vệ pháp lý cho công ty (Luật sư) hay chiêu mộ và dùng người (Quản trị nhân sự)?",
                      "desc": "Bước 6/6: Chốt Luật kinh tế hay Nhân sự.",
                      "optA": {
                        "text": "⚖️ Luật sư doanh nghiệp tư vấn hợp đồng và bảo vệ pháp lý",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "E & S - Luật sư Doanh nghiệp & Luật Kinh tế",
                          "desc": "Lá chắn pháp lý bảo vệ các tập đoàn trong các thương vụ triệu đô và tranh chấp thương mại quốc tế.",
                          "blocks": "A01 (Toán, Lý, Anh), D01 (Toán, Văn, Anh), C00 (Văn, Sử, Địa)",
                          "majors": "Luật Kinh tế, Luật Thương mại Quốc tế, Luật Dân sự.",
                          "jobs": "Luật sư tranh tụng, Cố vấn pháp lý doanh nghiệp, Công chứng viên, Trọng tài viên thương mại.",
                          "advice": "Học xuất sắc môn Văn và Tiếng Anh, rèn luyện tư duy logic phản biện sắc sảo từng câu chữ."
                        }
                      },
                      "optB": {
                        "text": "👥 Giám đốc nhân sự chiêu mộ nhân tài và phát triển con người",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "E - Quản trị Nhân sự & Thu hút Nhân tài (HR Director)",
                          "desc": "Nghệ thuật thấu hiểu và dùng người: chiêu mộ những bộ óc xuất chúng nhất về cho doanh nghiệp.",
                          "blocks": "D01 (Toán, Văn, Anh), A01 (Toán, Lý, Anh)",
                          "majors": "Quản trị Nhân lực, Tâm lý học Tổ chức.",
                          "jobs": "Giám đốc nhân sự (CHRO), Chuyên gia săn đầu người (Headhunter), Trưởng ban tuyển dụng.",
                          "advice": "Rèn luyện khả năng nhìn người, thấu cảm và kỹ năng hòa giải mâu thuẫn khéo léo."
                        }
                      }
                    }
                  },
                  "optB": {
                    "text": "💰 Đầu tư tài chính ngân hàng và kinh doanh bất động sản",
                    "next": {
                      "step": 6,
                      "q": "Bạn đam mê đầu tư vào thị trường chứng khoán ngân hàng hay giao dịch bất động sản nhà đất?",
                      "desc": "Bước 6/6: Chốt Tài chính đầu tư hay Bất động sản.",
                      "optA": {
                        "text": "📊 Chuyên gia đầu tư tài chính chứng khoán và quản lý quỹ",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "E & C - Tài chính - Ngân hàng & Quản lý Quỹ Đầu tư",
                          "desc": "Làm chủ dòng tiền của nền kinh tế: ra quyết định đầu tư vào các công ty tiềm năng và quản lý danh mục tài sản lớn.",
                          "blocks": "A00 (Toán, Lý, Hóa), A01 (Toán, Lý, Anh), D01 (Toán, Văn, Anh)",
                          "majors": "Tài chính - Ngân hàng, Đầu tư Tài chính, Chứng khoán.",
                          "jobs": "Nhà quản lý quỹ đầu tư, Chuyên viên phân tích cổ phiếu, Giám đốc chi nhánh ngân hàng.",
                          "advice": "Học giỏi Toán và theo dõi bảng điện tử chứng khoán để nhạy cảm với tin tức kinh tế."
                        }
                      },
                      "optB": {
                        "text": "🏘️ Kinh doanh dự án bất động sản và thẩm định giá tài sản",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "E - Kinh doanh Bất động sản & Thẩm định Giá",
                          "desc": "Giao dịch các tài sản đất đai, nhà ở và dự án bất động sản giá trị cao.",
                          "blocks": "A01 (Toán, Lý, Anh), D01 (Toán, Văn, Anh)",
                          "majors": "Kinh doanh Bất động sản, Thẩm định giá.",
                          "jobs": "Chuyên gia môi giới bất động sản cao cấp, Giám đốc dự án địa ốc, Thẩm định viên giá tài sản.",
                          "advice": "Rèn luyện khả năng giao tiếp ngoại giao và tìm hiểu kỹ quy hoạch đô thị."
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "optB": {
            "text": "🤝 Giúp đỡ người yếu thế, Giảng dạy, Công lý xã hội, Ngoại giao (S)",
            "next": {
              "step": 4,
              "q": "Bạn có mong muốn làm việc trong các cơ quan nhà nước/ngoại giao hay tổ chức giáo dục/cộng đồng?",
              "desc": "Bước 4/6: Định hướng Môi trường công lập hay Xã hội.",
              "optA": {
                "text": "🏛️ Làm việc trong cơ quan nhà nước, ngoại giao và tòa án",
                "next": {
                  "step": 5,
                  "q": "Bạn muốn phục vụ đất nước trong lĩnh vực Ngoại giao/Chính sách hay An ninh/Tòa án?",
                  "desc": "Bước 5/6: Phân nhánh Ngoại giao hay Lực lượng vũ trang.",
                  "optA": {
                    "text": "🌐 Công tác ngoại giao quốc tế và quản lý chính sách công",
                    "next": {
                      "step": 6,
                      "q": "Bạn muốn đại diện đất nước làm việc tại các đại sứ quán quốc tế hay làm cán bộ hoạch định chính sách nhà nước?",
                      "desc": "Bước 6/6: Chốt Ngoại giao hay Quản lý nhà nước.",
                      "optA": {
                        "text": "🌐 Nhà ngoại giao làm việc tại các đại sứ quán nước ngoài",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "S & E - Ngoại giao & Quan hệ Quốc tế",
                          "desc": "Cầu nối gìn giữ hòa bình, bảo vệ lợi ích quốc gia và xây dựng quan hệ hữu nghị giữa các dân tộc.",
                          "blocks": "D01 (Toán, Văn, Anh), D14 (Văn, Sử, Anh), A01 (Toán, Lý, Anh)",
                          "majors": "Quan hệ Quốc tế, Luật Quốc tế, Kinh tế Đối ngoại.",
                          "jobs": "Nhà ngoại giao, Cán bộ ngoại vụ tại Bộ Ngoại giao, Đại sứ, Chuyên viên tại Liên Hợp Quốc.",
                          "advice": "Học thông thạo ít nhất 2 ngoại ngữ (Anh, Pháp, Trung...), am hiểu lịch sử thế giới và lễ tân ngoại giao."
                        }
                      },
                      "optB": {
                        "text": "🏛️ Cán bộ quản lý nhà nước tại các sở ban ngành cơ quan công",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "S - Cán bộ Quản lý Nhà nước & Chính sách Công",
                          "desc": "Xây dựng các chính sách an sinh xã hội, phát triển kinh tế vì đời sống ấm no của nhân dân.",
                          "blocks": "C00 (Văn, Sử, Địa), D01 (Toán, Văn, Anh)",
                          "majors": "Quản lý Nhà nước, Chính sách Công, Xã hội học.",
                          "jobs": "Công chức tại các cơ quan UBND, Sở, Bộ ngành; Chuyên viên nghiên cứu chiến lược công.",
                          "advice": "Học tập tác phong nghiêm túc, tinh thần trách nhiệm phụng sự tổ quốc."
                        }
                      }
                    }
                  },
                  "optB": {
                    "text": "🛡️ Lực lượng công an nhân dân và thẩm phán tư pháp",
                    "next": {
                      "step": 6,
                      "q": "Bạn muốn trở thành Sĩ quan lực lượng vũ trang bảo vệ trật tự hay Thẩm phán cầm cân nảy mực tại tòa án?",
                      "desc": "Bước 6/6: Chốt Công an hay Thẩm phán.",
                      "optA": {
                        "text": "👮 Sĩ quan công an, cảnh sát bảo vệ bình yên cho nhân dân",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "S & R - Sĩ quan Công an & Quân đội Nhân dân",
                          "desc": "Thanh bảo kiếm bảo vệ an ninh trật tự, kỷ luật thép và sự trung thành tuyệt đối với tổ quốc.",
                          "blocks": "A00 (Toán, Lý, Hóa), C00 (Văn, Sử, Địa), D01 (Toán, Văn, Anh)",
                          "majors": "An ninh Điều tra, Cảnh sát Hình sự, Sĩ quan Chỉ huy Tham mưu.",
                          "jobs": "Chiến sĩ công an, Cảnh sát điều tra tội phạm, Sĩ quan quân đội nhân dân.",
                          "advice": "Rèn luyện thể lực đạt chuẩn, giữ gìn lý lịch trong sạch và ôn luyện điểm số thật cao."
                        }
                      },
                      "optB": {
                        "text": "⚖️ Thẩm phán tòa án đem lại công lý và lẽ phải",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "S - Luật sư Công lý & Thẩm phán Tòa án",
                          "desc": "Người cầm cân nảy mực đem lại sự công bằng, bảo vệ lẽ phải cho những người bị oan sai.",
                          "blocks": "C00 (Văn, Sử, Địa), D01 (Toán, Văn, Anh)",
                          "majors": "Luật học, Luật Hình sự, Tư pháp.",
                          "jobs": "Thẩm phán tòa án, Kiểm sát viên tại Viện Kiểm sát, Luật sư nhân quyền.",
                          "advice": "Sự trung thực, lòng quả cảm và cái tâm trong sáng là phẩm chất quan trọng nhất."
                        }
                      }
                    }
                  }
                }
              },
              "optB": {
                "text": "🏫 Cống hiến trong ngành giáo dục trường học và thiện nguyện",
                "next": {
                  "step": 5,
                  "q": "Bạn thích con đường Bục giảng Sư phạm hay Công tác xã hội vì cộng đồng?",
                  "desc": "Bước 5/6: Phân nhánh Sư phạm hay Dự án cộng đồng.",
                  "optA": {
                    "text": "👩‍🏫 Nghề giáo đứng trên bục giảng truyền trao tri thức",
                    "next": {
                      "step": 6,
                      "q": "Bạn muốn dạy học sinh phổ thông hay làm chuyên gia can thiệp giáo dục đặc biệt cho trẻ em yếu thế?",
                      "desc": "Bước 6/6: Chốt Sư phạm phổ thông hay Giáo dục đặc biệt.",
                      "optA": {
                        "text": "📖 Đứng trên bục giảng dạy dỗ thế hệ học trò trưởng thành",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "S - Giáo viên Sư phạm (Teacher / Educator)",
                          "desc": "Nghề cao quý nhất trong các nghề cao quý: thắp sáng ước mơ và ươm mầm tương lai cho đất nước.",
                          "blocks": "C00 (Văn, Sử, Địa), D01 (Toán, Văn, Anh), A00 (Toán, Lý, Hóa)",
                          "majors": "Sư phạm Toán/Văn/Anh, Sư phạm Tiểu học, Sư phạm Mầm non.",
                          "jobs": "Giáo viên trường chuyên/công lập/quốc tế, Giảng viên đại học, Hiệu trưởng.",
                          "advice": "Rèn luyện chữ viết đẹp, tác phong mô phạm chuẩn mực và tình yêu thương con trẻ."
                        }
                      },
                      "optB": {
                        "text": "🤲 Hỗ trợ can thiệp giáo dục cho trẻ em khuyết tật, tự kỷ",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "S - Giáo dục Đặc biệt (Special Education)",
                          "desc": "Người hùng thầm lặng giúp đỡ các em nhỏ khuyết tật, tự kỷ hòa nhập với cuộc sống.",
                          "blocks": "C00 (Văn, Sử, Địa), D01 (Toán, Văn, Anh)",
                          "majors": "Giáo dục Đặc biệt, Giáo dục Hòa nhập.",
                          "jobs": "Chuyên gia can thiệp trẻ tự kỷ, Giáo viên dạy chữ nổi cho người khiếm thị, Trị liệu ngôn ngữ.",
                          "advice": "Đòi hỏi trái tim vô cùng bao dung và đức tính kiên trì không quản ngại khó khăn."
                        }
                      }
                    }
                  },
                  "optB": {
                    "text": "🤝 Công tác xã hội nhân đạo và đào tạo phát triển năng lực",
                    "next": {
                      "step": 6,
                      "q": "Bạn muốn cống hiến cho các dự án phi chính phủ cứu trợ cộng đồng hay chuyên gia đào tạo nhân sự cho công ty?",
                      "desc": "Bước 6/6: Chốt NGO hay Đào tạo doanh nghiệp.",
                      "optA": {
                        "text": "🤝 Điều phối viên dự án phi chính phủ (NGO) xóa đói giảm nghèo",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "S - Công tác Xã hội & Dự án Phi chính phủ (NGO)",
                          "desc": "Mang tình thương đến những vùng khó khăn: bảo vệ phụ nữ, trẻ em và người cơ nhỡ trong xã hội.",
                          "blocks": "C00 (Văn, Sử, Địa), D01 (Toán, Văn, Anh)",
                          "majors": "Công tác Xã hội, Phát triển Cộng đồng, Xã hội học.",
                          "jobs": "Điều phối viên dự án phi chính phủ (UNICEF, Oxfam), Chuyên viên bảo trợ xã hội, Quản lý trung tâm nhân đạo.",
                          "advice": "Học thật tốt Tiếng Anh để viết đề án xin tài trợ quốc tế và có kỹ năng kết nối cộng đồng."
                        }
                      },
                      "optB": {
                        "text": "📚 Chuyên gia phát triển năng lực và đào tạo nhân sự công ty",
                        "next": {
                          "isLeaf": true,
                          "hollandCode": "S - Quản lý Giáo dục & Đào tạo Doanh nghiệp",
                          "desc": "Thiết kế các chương trình học tập thông minh và phát triển năng lực cho cán bộ nhân viên.",
                          "blocks": "D01 (Toán, Văn, Anh), A01 (Toán, Lý, Anh)",
                          "majors": "Quản lý Giáo dục, Đào tạo & Phát triển (L&D).",
                          "jobs": "Chuyên viên đào tạo doanh nghiệp, Trưởng ban khảo thí, Quản lý trường học quốc tế.",
                          "advice": "Học cách thiết kế bài giảng tương tác và làm chủ các công nghệ giáo dục (EdTech)."
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};


// ==============================================================================
// BỘ LỌC TỔ HỢP MÔN HỌC GDPT 2018 & GỢI Ý MỞ RỘNG NHIỀU NGÀNH NGHỀ
// ==============================================================================

window.userSubjects = JSON.parse(localStorage.getItem('school_user_subjects')) || ['Toán', 'Văn', 'Tiếng Anh', 'Vật lí', 'Hóa học', 'Sinh học'];

function initSubjectSelection() {
    const saved = JSON.parse(localStorage.getItem('school_user_subjects'));
    if (saved && Array.isArray(saved)) {
        const checkInputs = document.querySelectorAll('input[name="elective-subject"]');
        checkInputs.forEach(i => {
            i.checked = saved.includes(i.value);
        });
        const langRadios = document.querySelectorAll('input[name="foreign-language"]');
        langRadios.forEach(r => {
            if (saved.includes(r.value)) r.checked = true;
        });
    } else {
        setSubjectPreset('khtn');
    }
}

function setSubjectPreset(preset) {
    const checkInputs = document.querySelectorAll('input[name="elective-subject"]');
    checkInputs.forEach(i => i.checked = false);
    
    if (preset === 'khtn') {
        ['Vật lí', 'Hóa học', 'Sinh học', 'Tin học'].forEach(sub => {
            const el = document.querySelector(`input[name="elective-subject"][value="${sub}"]`);
            if(el) el.checked = true;
        });
    } else if (preset === 'khxh') {
        ['Lịch sử', 'Địa lí', 'GDKT&PL', 'Tin học'].forEach(sub => {
            const el = document.querySelector(`input[name="elective-subject"][value="${sub}"]`);
            if(el) el.checked = true;
        });
    } else if (preset === 'tech') {
        ['Vật lí', 'Tin học', 'Công nghệ'].forEach(sub => {
            const el = document.querySelector(`input[name="elective-subject"][value="${sub}"]`);
            if(el) el.checked = true;
        });
    }
}

function getSelectedSubjects() {
    let subs = ['Toán', 'Văn'];
    const checkInputs = document.querySelectorAll('input[name="elective-subject"]:checked');
    checkInputs.forEach(i => subs.push(i.value));
    
    const langInput = document.querySelector('input[name="foreign-language"]:checked');
    if (langInput) subs.push(langInput.value);
    else subs.push('Tiếng Anh');
    
    return subs;
}

const ALL_VIETNAM_BLOCKS = [
    { code: "A00", name: "A00 (Toán, Vật lí, Hóa học)", subs: ["Toán", "Vật lí", "Hóa học"] },
    { code: "A01", name: "A01 (Toán, Vật lí, Tiếng Anh)", subs: ["Toán", "Vật lí", "Tiếng Anh"] },
    { code: "B00", name: "B00 (Toán, Hóa học, Sinh học)", subs: ["Toán", "Hóa học", "Sinh học"] },
    { code: "C00", name: "C00 (Ngữ văn, Lịch sử, Địa lí)", subs: ["Văn", "Lịch sử", "Địa lí"] },
    { code: "D01", name: "D01 (Toán, Ngữ văn, Tiếng Anh)", subs: ["Toán", "Văn", "Tiếng Anh"] },
    { code: "D07", name: "D07 (Toán, Hóa học, Tiếng Anh)", subs: ["Toán", "Hóa học", "Tiếng Anh"] },
    { code: "D14", name: "D14 (Ngữ văn, Lịch sử, Tiếng Anh)", subs: ["Văn", "Lịch sử", "Tiếng Anh"] },
    { code: "D15", name: "D15 (Ngữ văn, Địa lí, Tiếng Anh)", subs: ["Văn", "Địa lí", "Tiếng Anh"] },
    { code: "C19", name: "C19 (Ngữ văn, Lịch sử, GDKT&PL)", subs: ["Văn", "Lịch sử", "GDKT&PL"] },
    { code: "C14", name: "C14 (Toán, Ngữ văn, GDKT&PL)", subs: ["Toán", "Văn", "GDKT&PL"] },
    { code: "C01", name: "C01 (Ngữ văn, Toán, Vật lí)", subs: ["Văn", "Toán", "Vật lí"] },
    { code: "C02", name: "C02 (Ngữ văn, Toán, Hóa học)", subs: ["Văn", "Toán", "Hóa học"] },
    { code: "C03", name: "C03 (Ngữ văn, Toán, Lịch sử)", subs: ["Văn", "Toán", "Lịch sử"] },
    { code: "C04", name: "C04 (Ngữ văn, Toán, Địa lí)", subs: ["Văn", "Toán", "Địa lí"] },
    { code: "A02", name: "A02 (Toán, Vật lí, Sinh học)", subs: ["Toán", "Vật lí", "Sinh học"] },
    { code: "A07", name: "A07 (Toán, Lịch sử, Địa lí)", subs: ["Toán", "Lịch sử", "Địa lí"] },
    { code: "B08", name: "B08 (Toán, Sinh học, Tiếng Anh)", subs: ["Toán", "Sinh học", "Tiếng Anh"] }
];

const EXPANDED_MAJORS_DICTIONARY = {
    "R": [
        { name: "Kỹ thuật Ô tô & Xe điện thông minh", note: "Thiết kế, chế tạo & vận hành xe hơi thế hệ mới" },
        { name: "Cơ điện tử & Kỹ thuật Robot (Robotics)", note: "Lắp ráp cánh tay robot tự động hóa công nghiệp" },
        { name: "Kỹ thuật Vi mạch & Bán dẫn (Semiconductor)", note: "Thiết kế chip điện tử siêu nhỏ đón đầu làn sóng đầu tư" },
        { name: "Kỹ thuật Xây dựng & Công trình Giao thông", note: "Chỉ huy thi công các đại công trình cầu đường, đô thị" },
        { name: "Nông nghiệp Công nghệ cao (Smart Agri)", note: "Trang trại thông minh điều khiển bằng cảm biến IoT" },
        { name: "Logistics Kỹ thuật & Quản lý Kho bãi", note: "Vận hành hệ thống chuỗi cung ứng hàng hóa quốc tế" },
        { name: "Kỹ thuật Năng lượng Tái tạo & Năng lượng Xanh", note: "Điện gió, pin mặt trời và hệ thống lưu trữ pin" },
        { name: "Công nghệ Thực phẩm & Đảm bảo Chất lượng", note: "Chế biến và kiểm định đồ ăn thức uống sạch an toàn" }
    ],
    "I": [
        { name: "Trí tuệ Nhân tạo & Khoa học Dữ liệu (AI & Data)", note: "Dạy máy học thuật toán & khai phá dữ liệu lớn" },
        { name: "Kỹ thuật Phần mềm (Software Engineering)", note: "Lập trình ứng dụng di động, website và hệ thống cloud" },
        { name: "An toàn Thông tin & An ninh Mạng (Cybersecurity)", note: "Chuyên gia bảo mật chống lại tin tặc mạng" },
        { name: "Y Đa khoa & Bác sĩ Điều trị Ngoại khoa", note: "Khám chữa bệnh và phẫu thuật cứu người tại bệnh viện" },
        { name: "Dược học & Nghiên cứu Bào chế Thuốc", note: "Sản xuất thuốc, vắc-xin và kiểm nghiệm dược phẩm" },
        { name: "Công nghệ Sinh học Y sinh & Tế bào gốc", note: "Giải mã bản đồ gen người và y học tái tạo" },
        { name: "Công nghệ Tài chính (Fintech)", note: "Thanh toán số, ngân hàng số và đầu tư thuật toán tự động" },
        { name: "Thiết kế & Lập trình Game 3D (Game Dev)", note: "Sản xuất các tựa game đồ họa tương tác đỉnh cao" }
    ],
    "A": [
        { name: "Thiết kế Đồ họa & Trải nghiệm Người dùng (UI/UX)", note: "Thiết kế hình ảnh thương hiệu và giao diện phần mềm" },
        { name: "Kiến trúc Công trình & Quy hoạch Đô thị", note: "Kiến trúc sư kiến tạo các tòa nhà biểu tượng" },
        { name: "Truyền thông Đa phương tiện (Multimedia)", note: "Sản xuất video viral, podcast và ấn phẩm kỹ thuật số" },
        { name: "Thiết kế Nội thất & Trang trí Không gian", note: "Bài trí không gian sống sang trọng, ấm cúng" },
        { name: "Thiết kế Thời trang & Stylist Định hình Phong cách", note: "Thiết kế trang phục và xây dựng thương hiệu may mặc" },
        { name: "Đạo diễn Điện ảnh, MV & Phim Truyền hình", note: "Chỉ đạo diễn xuất, góc máy và sản xuất phim chuyên nghiệp" },
        { name: "Biên kịch & Sáng tạo Nội dung (Content Creator)", note: "Viết kịch bản phim ảnh, quảng cáo và sáng tác sách" },
        { name: "Sản xuất Âm nhạc (Music Producer)", note: "Hòa âm phối khí phòng thu và tạo các bài hát hit" }
    ],
    "S": [
        { name: "Sư phạm Toán / Ngữ văn / Tiếng Anh", note: "Giáo viên giảng dạy tại các trường THPT và trường quốc tế" },
        { name: "Tâm lý học Lâm sàng & Tham vấn Trị liệu", note: "Lắng nghe, tháo gỡ tổn thương tâm lý cho cộng đồng" },
        { name: "Ngoại giao & Quan hệ Quốc tế", note: "Làm việc tại Bộ Ngoại giao, đại sứ quán và các tổ chức quốc tế" },
        { name: "Luật & Kiểm sát viên Tòa án Nhân dân", note: "Cầm cân nảy mực bảo vệ công lý và quyền con người" },
        { name: "Điều dưỡng & Kỹ thuật Phục hồi Chức năng", note: "Chăm sóc y tế tận tâm, có cơ hội làm việc tại Đức/Nhật" },
        { name: "Công tác Xã hội & Điều phối Dự án Phi chính phủ (NGO)", note: "Tổ chức các chương trình cứu trợ và xóa đói giảm nghèo" },
        { name: "Quản lý Giáo dục & Đào tạo Doanh nghiệp (L&D)", note: "Phát triển năng lực cho cán bộ nhân viên công ty" },
        { name: "Du lịch Quốc tế & Quản lý Lữ hành", note: "Hướng dẫn viên du lịch và quảng bá danh lam thắng cảnh" }
    ],
    "E": [
        { name: "Quản trị Kinh doanh & Khởi nghiệp (CEO/Founder)", note: "Thành lập công ty riêng và điều hành doanh nghiệp" },
        { name: "Marketing & Quản trị Thương hiệu (Brand Manager)", note: "Nghiên cứu thị trường và bùng nổ chiến dịch quảng cáo" },
        { name: "Thương mại Điện tử (E-Commerce)", note: "Vận hành kinh doanh trên Shopee, TikTok Shop, Amazon" },
        { name: "Tài chính - Ngân hàng & Đầu tư Chứng khoán", note: "Quản lý dòng tiền, thẩm định dự án và đầu tư sinh lời" },
        { name: "Luật Kinh tế & Trọng tài Thương mại Quốc tế", note: "Tư vấn hợp đồng kinh doanh triệu đô cho tập đoàn" },
        { name: "Quản trị Khách sạn & Khu Nghỉ dưỡng 5 Sao", note: "Tổng quản lý khách sạn và tổ chức sự kiện quốc tế" },
        { name: "Quản trị Nhân lực & Săn đầu người (Headhunter)", note: "Chiêu mộ nhân tài cho các tập đoàn đa quốc gia" },
        { name: "Kinh doanh Bất động sản cao cấp", note: "Phân phối dự án địa ốc và thẩm định giá trị tài sản" }
    ],
    "C": [
        { name: "Kế toán Doanh nghiệp & Kiểm toán Độc lập", note: "Kiểm tra sổ sách, dòng tiền tại các công ty kiểm toán Big 4" },
        { name: "Hệ thống Thông tin Quản lý (MIS)", note: "Cầu nối giữa quy trình kinh doanh và cơ sở dữ liệu số" },
        { name: "Phân tích Dữ liệu Kinh doanh (Business Analyst)", note: "Tối ưu hóa hiệu quả hoạt động cho các tập đoàn" },
        { name: "Thẩm định Thuế & Hải quan Xuất nhập khẩu", note: "Kiểm soát chính sách thuế và thủ tục thông quan hàng hóa" },
        { name: "Thống kê Kinh tế & Dự báo Thị trường", note: "Dự báo xu hướng tài chính và thị trường tiêu dùng" },
        { name: "Tài chính Công & Quản lý Ngân sách Nhà nước", note: "Quản lý quỹ ngân sách và thanh toán kho bạc" }
    ]
};


// ==============================================================================
// ĐỐ THẦN ĐÈN HƯỚNG NGHIỆP AKINATOR - 12 CÂU HỎI TRẮC NGHIỆM TÂM LÝ & HOLLAND AI
// (TRẢ LỜI CÓ / KHÔNG / BỎ QUA CÂU HỎI)
// ==============================================================================
// ĐỐ THẦN ĐÈN HƯỚNG NGHIỆP AKINATOR - 17 CÂU HỎI KẾT HỢP HOLLAND & MBTI QUỐC TẾ
// ==============================================================================

const AKINATOR_17_QUESTIONS = [
    // --- 12 CÂU HỎI HOLLAND RIASEC & CƠ CHẾ ĐỊNH HƯỚNG NGHỀ NGHIỆP ---
    {
        id: 1,
        q: "Khi ở trong một tập thể hoặc gặp gỡ người mới, bạn luôn tự tin là người chủ động bắt chuyện trước?",
        desc: "Thể hiện tính cách cởi mở, hướng ngoại và khả năng giao tiếp tự nhiên.",
        group: "E", subGroup: "S",
        mbtiPlus: { E: 15 }, mbtiMinus: { I: 10 }
    },
    {
        id: 2,
        q: "Bạn có niềm đam mê kinh doanh, thích thuyết phục người khác và khao khát trở thành người lãnh đạo/quản lý?",
        desc: "Tố chất thủ lĩnh, khả năng đàm phán thương mại và tư duy chiến lược.",
        group: "E", subGroup: "C",
        mbtiPlus: { E: 10, T: 10, J: 8 }, mbtiMinus: {}
    },
    {
        id: 3,
        q: "Bạn có xu hướng ưu tiên chọn những sản phẩm, đồ vật có tính sáng tạo, độc đáo và thẩm mỹ cao?",
        desc: "Nhạy cảm với cái đẹp, gu thẩm mỹ tinh tế và đề cao tính nguyên bản.",
        group: "A", subGroup: "I",
        mbtiPlus: { N: 15, P: 8 }, mbtiMinus: { S: 8 }
    },
    {
        id: 4,
        q: "Bạn thích vẽ, chụp ảnh, viết lách, chơi nhạc hoặc tự do sáng tạo không gian theo phong cách riêng của mình?",
        desc: "Tâm hồn nghệ thuật, cảm xúc phong phú và ghét sự rập khuôn gò bó.",
        group: "A", subGroup: "S",
        mbtiPlus: { N: 12, P: 15, F: 8 }, mbtiMinus: { J: 10 }
    },
    {
        id: 5,
        q: "Bạn luôn kiên nhẫn lắng nghe, tiếp thu ý kiến của người khác ngay cả khi họ bất đồng quan điểm với bạn?",
        desc: "Trí tuệ cảm xúc (EQ) cao, sự hòa nhã, tôn trọng góc nhìn đa chiều.",
        group: "S", subGroup: "A",
        mbtiPlus: { F: 15 }, mbtiMinus: {}
    },
    {
        id: 6,
        q: "Bạn tìm thấy niềm vui và ý nghĩa khi được chia sẻ tâm sự, tư vấn và giúp đỡ mọi người vượt qua khó khăn?",
        desc: "Lòng trắc ẩn, sự thấu cảm sâu sắc và tinh thần cống hiến vì cộng đồng.",
        group: "S", subGroup: "E",
        mbtiPlus: { F: 15, E: 8 }, mbtiMinus: {}
    },
    {
        id: 7,
        q: "Bạn say mê tìm hiểu bản chất sâu xa của sự việc, thích giải các bài toán hóc búa hoặc nghiên cứu khoa học?",
        desc: "Bộ óc phân tích, đam mê nghiên cứu và giải quyết các bài toán phức tạp.",
        group: "I", subGroup: "R",
        mbtiPlus: { I: 10, N: 12, T: 12 }, mbtiMinus: {}
    },
    {
        id: 8,
        q: "Bạn thích đào sâu tư duy logic, phân tích dữ liệu và đam mê khám phá công nghệ mới, lập trình máy tính?",
        desc: "Tư duy trừu tượng sắc sảo, say mê công nghệ số và thuật toán thời đại 4.0.",
        group: "I", subGroup: "C",
        mbtiPlus: { T: 15, I: 8 }, mbtiMinus: { F: 8 }
    },
    {
        id: 9,
        q: "Bạn thích tự tay tháo lắp, sửa chữa máy móc thiết bị, đồ điện hoặc các dụng cụ kỹ thuật thực tế trong nhà?",
        desc: "Sự khéo léo cơ khí, tư duy không gian trực quan và tính thực hành cao.",
        group: "R", subGroup: "I",
        mbtiPlus: { S: 15, T: 8 }, mbtiMinus: { N: 10 }
    },
    {
        id: 10,
        q: "Bạn thích các hoạt động vận động thể chất ngoài trời, thực hành chế tạo hơn là ngồi yên một chỗ đọc lý thuyết?",
        desc: "Phong cách hành động thực chất, năng động và kiên trì với công việc thực tế.",
        group: "R", subGroup: "E",
        mbtiPlus: { S: 15, P: 8 }, mbtiMinus: { N: 10 }
    },
    {
        id: 11,
        q: "Bạn luôn làm việc có kế hoạch bài bản, thích sắp xếp dữ liệu ngăn nắp và cẩn thận với từng chi tiết?",
        desc: "Tinh thần kỷ luật thép, tổ chức khoa học và khả năng kiểm soát dữ liệu bài bản.",
        group: "C", subGroup: "I",
        mbtiPlus: { J: 15, S: 8 }, mbtiMinus: { P: 12 }
    },
    {
        id: 12,
        q: "Bạn rất chú trọng độ chính xác của các con số, giấy tờ và luôn nghiêm túc tuân thủ các quy tắc, kỷ luật?",
        desc: "Độ tin cậy tuyệt đối, sự chuẩn xác và tôn trọng nguyên tắc hệ thống.",
        group: "C", subGroup: "R",
        mbtiPlus: { J: 15, T: 8 }, mbtiMinus: { P: 12 }
    },

    // --- 5 CÂU HỎI CHUYÊN SÂU ĐỊNH HÌNH 4 TRỤC MBTI QUỐC TẾ ---
    {
        id: 13,
        q: "Sau một tuần học tập căng thẳng, bạn thích ở một mình yên tĩnh để sạc lại năng lượng hơn là tụ tập tiệc tùng đông đúc?",
        desc: "Đo lường trục Năng Lượng: Hướng nội (I) tìm lại bình yên một mình vs Hướng ngoại (E) nạp năng lượng từ đám đông.",
        group: "I", subGroup: "R",
        mbtiPlus: { I: 25 }, mbtiMinus: { E: 25 }
    },
    {
        id: 14,
        q: "Bạn thường bị cuốn hút bởi những ý tưởng đột phá, viễn cảnh tương lai và các giả thuyết mới mẻ hơn là những sự thật thực tế trước mắt?",
        desc: "Đo lường trục Nhận Thức: Trực giác (N) nhìn xa trông rộng vs Thực tế (S) bám sát dữ kiện hiện tại.",
        group: "I", subGroup: "A",
        mbtiPlus: { N: 25 }, mbtiMinus: { S: 25 }
    },
    {
        id: 15,
        q: "Khi giải quyết tranh chấp hoặc đưa ra quyết định hệ trọng, bạn luôn đặt lý trí logic và sự công bằng lên trên cảm xúc cá nhân?",
        desc: "Đo lường trục Ra Quyết Định: Lý trí (T) khách quan logic vs Cảm xúc (F) coi trọng sự hòa hợp và tình người.",
        group: "C", subGroup: "E",
        mbtiPlus: { T: 25 }, mbtiMinus: { F: 25 }
    },
    {
        id: 16,
        q: "Bạn thích một cuộc sống có lịch trình biểu định sẵn và luôn hoàn thành bài vở trước hạn chót, rất ghét sự ngẫu hứng nước đến chân mới nhảy?",
        desc: "Đo lường trục Lối Sống: Nguyên tắc (J) kế hoạch bài bản vs Linh hoạt (P) thích ứng ngẫu hứng.",
        group: "C", subGroup: "C",
        mbtiPlus: { J: 25 }, mbtiMinus: { P: 25 }
    },
    {
        id: 17,
        q: "Bạn luôn giữ được sự bình tĩnh, quyết đoán và tin tưởng vững chắc vào phán đoán của bản thân ngay cả khi chịu áp lực dư luận lớn?",
        desc: "Đo lường bản lĩnh tự tin, sự kiên định lập trường và phong cách ứng biến trước sóng gió.",
        group: "E", subGroup: "I",
        mbtiPlus: { T: 15, J: 10, E: 8 }, mbtiMinus: {}
    }
];

// CƠ SỞ DỮ LIỆU 16 NHÓM TÍNH CÁCH MBTI QUỐC TẾ
const MBTI_MASTER_DATA = {
    "INTJ": {
        name: "Nhà Kiến Tạo Chiến Lược (The Architect)",
        desc: "Tư duy chiến lược nhìn xa trông rộng, độc lập, tôn sùng logic và luôn khao khát tối ưu hóa mọi hệ thống. Bạn nhìn thấy quy luật ngầm của thế giới mà người khác bỏ qua.",
        strengths: "Tầm nhìn chiến lược, tư duy phản biện xuất sắc, ý chí độc lập kiên định.",
        careers: "Trí tuệ Nhân tạo (AI), Kỹ thuật Vi mạch Bán dẫn, Khoa học Dữ liệu, Tài chính Định lượng, Kiến trúc sư Hệ thống."
    },
    "INTP": {
        name: "Nhà Tư Duy Logic (The Logician)",
        desc: "Đam mê khám phá lý thuyết trừu tượng, say mê phân tích và giải mã những bí ẩn khoa học phức tạp nhất. Bạn là nguồn cội của những phát kiến đi trước thời đại.",
        strengths: "Tư duy logic thượng thừa, khả năng tự học sâu, giải quyết vấn đề khó khăn.",
        careers: "Khoa học Máy tính, Nghiên cứu Toán - Lý, Lập trình Thuật toán, An ninh Mạng, Nghiên cứu Công nghệ cao."
    },
    "ENTJ": {
        name: "Nhà Chỉ Huy Tiên Phong (The Commander)",
        desc: "Tố chất thủ lĩnh thiên bẩm, quyết đoán, tầm nhìn vĩ mô và khả năng biến các mục tiêu tham vọng thành hiện thực. Bạn sinh ra để dẫn dắt các đại dự án.",
        strengths: "Năng lực lãnh đạo mạnh mẽ, hoạch định chiến lược, truyền lửa hành động.",
        careers: "Quản trị Doanh nghiệp (CEO), Đầu tư Mạo hiểm, Quản lý Quỹ Tài chính, Luật sư Kinh tế, Tư vấn Chiến lược."
    },
    "ENTP": {
        name: "Người Tranh Biện Đột Phá (The Debater)",
        desc: "Nhanh nhạy, sắc sảo, thích thách thức giới hạn cũ và tạo ra những góc nhìn phá cách độc nhất vô nhị. Bạn thích thú trước các bài toán chưa ai giải được.",
        strengths: "Tư duy đột phá, đàm phán ứng biến tài tình, nhạy bén với cơ hội mới.",
        careers: "Khởi nghiệp Đổi mới Sáng tạo, Marketing Chiến lược, Phân tích Kinh doanh, Giám đốc Sản phẩm (Product Lead)."
    },
    "INFJ": {
        name: "Người Cố Vấn Khai Sáng (The Advocate)",
        desc: "Lý tưởng sống cao đẹp, thấu cảm sâu sắc với con người và luôn khao khát cống hiến cho một xã hội nhân văn hơn. Bạn là ngọn hải đăng soi sáng tâm hồn người khác.",
        strengths: "Trực giác thấu hiểu lòng người, giàu lòng trắc ẩn, ngòi bút truyền cảm hứng.",
        careers: "Tâm lý học Lâm sàng, Sư phạm Cao cấp, Ngoại giao, Biên kịch & Viết lách, Cố vấn Giáo dục Quốc tế."
    },
    "INFP": {
        name: "Người Hòa Giải Lý Tưởng (The Mediator)",
        desc: "Tâm hồn trong sáng, giàu cảm xúc, coi trọng giá trị đạo đức và không ngừng tìm kiếm ý nghĩa chân thực của bản thân. Bạn mang tâm hồn của một nghệ sĩ đích thực.",
        strengths: "Khả năng sáng tạo nghệ thuật, đồng cảm sâu xa, thế giới nội tâm phong phú.",
        careers: "Thiết kế Đồ họa & UI/UX, Sáng tác Nội dung Số, Dịch thuật Quốc tế, Tâm lý Trị liệu, Truyền thông Đa phương tiện."
    },
    "ENFJ": {
        name: "Người Truyền Cảm Hứng (The Protagonist)",
        desc: "Nhiệt huyết, lôi cuốn, giỏi gắn kết mọi người và luôn hết lòng giúp đỡ cộng đồng vươn tới tiềm năng cao nhất. Bạn là trái tim ấm áp kết nối tập thể.",
        strengths: "Kỹ năng truyền cảm hứng, xây dựng đội ngũ đoàn kết, thấu hiểu tâm lý số đông.",
        careers: "Quản lý Nhân sự & Đào tạo (L&D), Quan hệ Công chúng (PR), Quản lý Dự án Xã hội, Ngoại giao, Nhà giáo dục."
    },
    "ENFP": {
        name: "Người Khám Phá Nhiệt Huyết (The Campaigner)",
        desc: "Tràn đầy năng lượng tích cực, trí tưởng tượng bay bổng, yêu tự do và luôn say mê kết nối các ý tưởng sáng tạo với con người. Đi đến đâu bạn cũng mang lại luồng gió mới.",
        strengths: "Sáng tạo không biên giới, giao tiếp lôi cuốn, tinh thần tiên phong thử nghiệm.",
        careers: "Marketing Sáng tạo, Sản xuất Truyền hình & Phim ảnh, Quản trị Thương hiệu, Tổ chức Sự kiện, Du lịch Quốc tế."
    },
    "ISTJ": {
        name: "Nhà Tổ Chức Trách Nhiệm (The Logistician)",
        desc: "Trách nhiệm, kỷ luật thép, cẩn trọng tỉ mỉ và luôn tuân thủ nguyên tắc. Bạn là trụ cột vững chắc và đáng tin cậy nhất trong mọi tổ chức, cơ quan.",
        strengths: "Độ chính xác tuyệt đối, trung thực, quản trị hệ thống dữ liệu bài bản.",
        careers: "Kiểm toán Big 4, Kế toán Doanh nghiệp, Quản trị Cơ sở Dữ liệu (MIS), Pháp lý & Thuế, Ngân hàng."
    },
    "ISFJ": {
        name: "Người Bảo Vệ Tận Tâm (The Defender)",
        desc: "Chu đáo, ấm áp, kiên nhẫn và luôn âm thầm cống hiến để bảo vệ sự an toàn, hạnh phúc của mọi người xung quanh. Sự tận tâm của bạn tạo nên niềm tin bất diệt.",
        strengths: "Lòng trung thành, đức tính chu đáo, khả năng chăm sóc và quản lý chi tiết.",
        careers: "Y Đa khoa, Điều dưỡng Quốc tế, Dược học, Giáo dục Tiểu học, Quản trị Trải nghiệm Khách hàng."
    },
    "ESTJ": {
        name: "Người Giám Sát Thực Thi (The Executive)",
        desc: "Thực tế, quyết liệt, giỏi tổ chức trật tự và lãnh đạo bộ máy vận hành trơn tru, hiệu quả cao. Bạn đảm bảo mọi việc được hoàn thành đúng chuẩn mực và thời hạn.",
        strengths: "Kỹ năng quản lý vận hành, lập kế hoạch thực thi, tính kỷ luật gương mẫu.",
        careers: "Quản lý Chuỗi Cung ứng (Logistics), Chỉ huy Công trình Xây dựng, Quản trị Sản xuất, Giám đốc Điều hành Vận hành (COO)."
    },
    "ESFJ": {
        name: "Người Chăm Sóc Hòa Đồng (The Consul)",
        desc: "Hòa nhã, chu đáo, tinh tế trong giao tiếp xã hội và luôn mong muốn xây dựng một môi trường ấm cúng, đoàn kết. Bạn là chất keo gắn kết mọi mối quan hệ.",
        strengths: "Kỹ năng đối ngoại khéo léo, sự tận tình, nhạy bén với nhu cầu cộng đồng.",
        careers: "Quản trị Khách sạn 5 Sao, Quan hệ Khách hàng Cao cấp, Y tế Cộng đồng, Giáo dục Thể chất, Tổ chức Sự kiện."
    },
    "ISTP": {
        name: "Nhà Kỹ Thuật Khéo Léo (The Virtuoso)",
        desc: "Thực tế, trầm tĩnh, quan sát tinh tường và cực kỳ khéo léo với máy móc, công cụ cơ khí. Bạn học tốt nhất khi tự tay mày mò, tháo lắp và sửa chữa.",
        strengths: "Tư duy cơ khí nhạy bén, phản xạ ứng biến linh hoạt, giải quyết sự cố kỹ thuật.",
        careers: "Kỹ thuật Robot & Tự động hóa, Kỹ thuật Ô tô & Xe điện, Phi công, Kỹ sư Phần cứng, Cơ điện tử."
    },
    "ISFP": {
        name: "Người Nghệ Sĩ Phóng Khoáng (The Adventurer)",
        desc: "Nhạy cảm với cái đẹp, giàu cảm xúc, sống trọn vẹn từng khoảnh khắc và thích khám phá trải nghiệm thẩm mỹ mới. Bạn thể hiện cái tôi qua tác phẩm nghệ thuật độc bản.",
        strengths: "Cảm quan thẩm mỹ tinh tế, linh hoạt, khả năng biểu đạt cảm xúc qua nghệ thuật.",
        careers: "Thiết kế Thời trang, Nhiếp ảnh Nghệ thuật, Kiến trúc Cảnh quan, Ẩm thực Nghệ thuật, Thiết kế Nội thất."
    },
    "ESTP": {
        name: "Người Khởi Nghiệp Táo Bạo (The Entrepreneur)",
        desc: "Năng động, dũng cảm, phản xạ cực nhanh và không ngại đối mặt với rủi ro để giành lấy thành công. Bạn là chiến binh thực chiến trên thương trường.",
        strengths: "Kỹ năng hành động chớp nhoáng, thích ứng áp lực cao, tài đàm phán thuyết phục.",
        careers: "Kinh doanh Bất động sản, Môi giới Chứng khoán, Khởi nghiệp Thương mại Điện tử, Quản lý Thể thao."
    },
    "ESFP": {
        name: "Người Trình Diễn Hoạt Bát (The Entertainer)",
        desc: "Vui tươi, rạng rỡ, cuốn hút và luôn là tâm điểm thắp sáng mọi cuộc trò chuyện. Bạn có khả năng lan tỏa niềm vui và biến cuộc sống thành một sân khấu rực rỡ.",
        strengths: "Năng lượng sân khấu lôi cuốn, sự hoạt bát, truyền cảm hứng tích cực.",
        careers: "MC & Dẫn chương trình, Diễn xuất, Tổ chức Lễ hội & Giải trí, Hướng dẫn viên Quốc tế, Tiếp thị Trải nghiệm."
    }
};

const HOLLAND_MASTER_DATA = {
    "R": {
        name: "Người Thực Tế & Kỹ Thuật (Realistic)",
        desc: "Bạn là người thực tế, hành động dứt khoát, khéo léo với đôi bàn tay và thích làm việc với công cụ máy móc, kỹ thuật công nghệ hoặc hoạt động ngoài trời. Bạn tôn trọng kết quả thực chất hơn là những lý thuyết trừu tượng.",
        blocks: "A00, A01, A02, D07, C01",
        majors: "Kỹ thuật Ô tô & Xe điện, Cơ điện tử & Robot, Kỹ thuật Vi mạch Bán dẫn, Tự động hóa, Xây dựng",
        jobs: "Kỹ sư thiết kế bán dẫn, Kỹ sư Robot công nghiệp, Chỉ huy trưởng công trình, Giám sát hệ thống xe thông minh",
        advice: "Hãy đầu tư vững chắc vào Toán, Vật lí, Tin học và Ngoại ngữ chuyên ngành. Đừng ngại tham gia các câu lạc bộ chế tạo STEM để tôi luyện bản lĩnh thực chiến!"
    },
    "I": {
        name: "Nhà Nghiên Cứu & Tư Duy Logic (Investigative)",
        desc: "Bạn sở hữu bộ óc phân tích sắc sảo, luôn tò mò muốn hiểu đến tận cùng bản chất sự việc. Bạn xuất sắc trong việc tư duy trừu tượng, giải toán, đào sâu thuật toán hoặc nghiên cứu khoa học chuyên sâu.",
        blocks: "A00, A01, B00, D07, D01",
        majors: "Trí tuệ Nhân tạo (AI) & Khoa học Dữ liệu, Kỹ thuật Phần mềm, Y Đa khoa, Dược học, An toàn Thông tin",
        jobs: "Chuyên gia AI/Machine Learning, Bác sĩ điều trị, Lập trình viên Cloud, Chuyên gia Bảo mật & An ninh mạng",
        advice: "Duy trì thói quen đọc tài liệu khoa học quốc tế, rèn luyện tư duy phản biện và thuật toán. Bạn là nhân tài nòng cốt trong thời đại công nghệ số bùng nổ!"
    },
    "A": {
        name: "Nhà Sáng Tạo & Đột Phá Thẩm Mỹ (Artistic)",
        desc: "Bạn có tâm hồn tự do, giàu cảm xúc, trí tưởng tượng phong phú và nhạy bén đặc biệt với nghệ thuật, cái đẹp. Bạn thích tạo ra những ý tưởng độc bản và ghét sự rập khuôn, gò bó cứng nhắc.",
        blocks: "D01, C00, H00, V00, D14",
        majors: "Thiết kế Đồ họa & Trải nghiệm Người dùng (UI/UX), Kiến trúc, Truyền thông Đa phương tiện, Thiết kế Game 3D",
        jobs: "Giám đốc Sáng tạo (Art Director), Nhà thiết kế sản phẩm số UI/UX, Kiến trúc sư, Biên kịch & Sáng tạo nội dung",
        advice: "Hãy tự tin thể hiện cá tính riêng! Kết hợp năng khiếu thẩm mỹ với việc làm chủ các công cụ đồ họa số và công nghệ AI hiện đại để tạo nên lợi thế vượt trội."
    },
    "S": {
        name: "Người Đồng Hành & Lan Tỏa Xã Hội (Social)",
        desc: "Bạn ấm áp, biết lắng nghe, thấu cảm sâu sắc với cảm xúc của người khác và có năng khiếu truyền cảm hứng. Bạn tìm thấy niềm hạnh phúc và ý nghĩa cuộc đời khi được giúp đỡ, hỗ trợ mọi người phát triển.",
        blocks: "C00, D01, D14, D15, C19",
        majors: "Sư phạm, Tâm lý học Tham vấn Trị liệu, Ngoại giao & Quan hệ Quốc tế, Luật Nhân quyền, Điều dưỡng Quốc tế",
        jobs: "Chuyên viên Tham vấn Tâm lý, Giáo viên trường quốc tế, Nhà Ngoại giao, Luật sư, Quản lý Nhân sự & Đào tạo (L&D)",
        advice: "Hãy trau dồi vốn ngoại ngữ thật giỏi để mở rộng tầm ảnh hưởng ra môi trường quốc tế. Tiếp tục giữ vững trái tim nhiệt huyết và sự bao dung quý giá của bạn."
    },
    "E": {
        name: "Thủ Lĩnh Tiên Phong & Quản Trị Kinh Doanh (Enterprising)",
        desc: "Bạn tự tin, năng động, có tố chất lãnh đạo bẩm sinh và khả năng đàm phán thuyết phục người khác. Bạn thích thử thách, có đầu óc nhạy bén về thương mại và khát vọng tự mình làm chủ sự nghiệp.",
        blocks: "A01, D01, C14, D07, A00",
        majors: "Quản trị Kinh doanh & Khởi nghiệp, Marketing & Quản trị Thương hiệu, Thương mại Điện tử, Tài chính - Ngân hàng",
        jobs: "Giám đốc Doanh nghiệp (CEO/Founder), Trưởng phòng Marketing, Chuyên viên Đầu tư Tài chính, Quản lý sàn TMĐT xuyên biên giới",
        advice: "Tập trung rèn luyện tư duy tài chính, kỹ năng quản trị đội nhóm và khả năng thích ứng linh hoạt trước biến động của thị trường kinh tế số."
    },
    "C": {
        name: "Chuyên Gia Quy Củ & Quản Trị Hệ Thống (Conventional)",
        desc: "Bạn cực kỳ cẩn thận, tỉ mỉ, có tinh thần kỷ luật thép và làm việc theo kế hoạch bài bản. Bạn là bậc thầy trong việc quản trị dữ liệu, sắp xếp thông tin ngăn nắp và đảm bảo tính chính xác tuyệt đối.",
        blocks: "A00, A01, D01, C14, D07",
        majors: "Kiểm toán Độc lập & Kế toán Doanh nghiệp, Hệ thống Thông tin Quản lý (MIS), Phân tích Dữ liệu Kinh doanh (BA), Hải quan & Thuế",
        jobs: "Kiểm toán viên Big 4, Chuyên viên Phân tích Nghiệp vụ, Kế toán trưởng, Quản lý Cơ sở Dữ liệu Hệ thống",
        advice: "Hãy trang bị thêm các chứng chỉ số hóa (PowerBI, Python Data Analytics, SQL) kết hợp cùng đức tính cẩn trọng sẵn có để trở thành nhân sự không thể thay thế."
    }
};

let akinatorIndex = 0;
let akinatorAnswers = [];
let akinatorBranchState = {
    choice1: null,
    choice2: null,
    finalLeaf: null
};

// Hàm tiện ích: Tên hiển thị tiếng Việt của nhóm Holland
function getGroupNameVi(grp) {
    const map = {
        'R': 'Thực tế & Kỹ thuật (R)',
        'I': 'Nghiên cứu & Tư duy (I)',
        'A': 'Nghệ thuật & Sáng tạo (A)',
        'S': 'Xã hội & Thấu hiểu (S)',
        'E': 'Quản trị & Lãnh đạo (E)',
        'C': 'Nghiệp vụ & Quy củ (C)'
    };
    return map[grp] || grp;
}

// 2. Cập nhật hàm tính điểm hỗ trợ thêm nút "PROBABLY" (Có vẻ đúng = +50% điểm)
function getPreliminaryTopHollandGroup() {
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    akinatorAnswers.forEach(ans => {
        const q = ans.q;
        if (!q) return;
        if (ans.choice === 'YES') {
            scores[q.group] = (scores[q.group] || 0) + 20;
            if (q.subGroup) scores[q.subGroup] = (scores[q.subGroup] || 0) + 6;
        } else if (ans.choice === 'PROBABLY') {
            // Mức "Có vẻ Đúng": cộng một nửa số điểm (+10 điểm chính, +3 điểm phụ)
            scores[q.group] = (scores[q.group] || 0) + 10;
            if (q.subGroup) scores[q.subGroup] = (scores[q.subGroup] || 0) + 3;
        } else if (ans.choice === 'NO') {
            scores[q.group] = (scores[q.group] || 0) - 5;
            if (q.subGroup) scores[q.subGroup] = (scores[q.subGroup] || 0) - 2;
        }
    });
    const sorted = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
    return sorted[0] || 'I';
}

// YÊU CẦU 3: TẬN DỤNG CÂY QUYẾT ĐỊNH DECISION_TREE_ROOT ĐỂ HỎI XOÁY SÂU DẦN (2 CÂU RẼ NHÁNH 18 VÀ 19)
function getBranchingDataForGroup(groupKey, userSubjects) {
    const curSubs = userSubjects || [];
    const hasBio = curSubs.some(s => s.includes('Sinh'));
    const hasChem = curSubs.some(s => s.includes('Hóa'));
    const hasPhysics = curSubs.some(s => s.includes('Lý') || s.includes('Lí'));
    const hasIT = curSubs.some(s => s.includes('Tin'));
    const hasTech = curSubs.some(s => s.includes('Công nghệ'));

    if (groupKey === 'I') {
        if (!hasBio && !hasChem) {
            // YÊU CẦU 2: Nhóm I nhưng không học Sinh/Hóa -> Rẽ nhánh sang Công nghệ/AI hoặc Luật học/Dữ liệu kinh tế
            return {
                q1: {
                    q: "Trong thế giới Nghiên cứu & Dữ liệu, hướng đi nào lôi cuốn bạn nhất?",
                    desc: "Bước 1/2 rẽ nhánh: Thần Đèn nhận thấy bạn thuộc nhóm I và đang học tổ hợp Xã hội/Công nghệ.",
                    optA: { text: "💻 Lập trình thuật toán, Trí tuệ nhân tạo (AI), Dữ liệu lớn & An ninh mạng" },
                    optB: { text: "⚖️ Nghiên cứu Pháp lý (Luật học), Dữ liệu Kinh tế & Tâm lý học Hành vi" }
                },
                getQ2: (choice1) => {
                    if (choice1 === 'A') {
                        return {
                            q: "Bạn muốn phát triển mô hình Trí tuệ Nhân tạo (AI) hay bảo vệ an ninh mạng không gian số?",
                            desc: "Bước 2/2: Câu hỏi quyết định chốt hạ nghề nghiệp đích danh!",
                            optA: {
                                text: "🤖 Kỹ sư Trí tuệ Nhân tạo (AI) & Khoa học Dữ liệu (Machine Learning / Data Science)",
                                leaf: {
                                    hollandCode: "I - Kỹ sư Trí tuệ Nhân tạo (AI) & Khoa học Dữ liệu",
                                    title: "Kỹ sư Trí tuệ Nhân tạo (AI) & Khoa học Dữ liệu",
                                    majors: "Trí tuệ Nhân tạo (AI), Khoa học Dữ liệu, Khoa học Máy tính",
                                    jobs: "Kỹ sư AI/Machine Learning, Data Scientist, Kỹ sư Big Data",
                                    blocks: "A00, A01, D01, D07",
                                    desc: "Bạn có tư duy phân tích sắc bén, đam mê thuật toán và muốn dẫn đầu cuộc cách mạng công nghệ số.",
                                    advice: "Đầu tư sâu cho môn Toán và Tiếng Anh kỹ thuật, học sớm Python và các thư viện Machine Learning."
                                }
                            },
                            optB: {
                                text: "🛡️ Kỹ sư An toàn Thông tin & An ninh Mạng (Chuyên gia Bảo mật)",
                                leaf: {
                                    hollandCode: "I - Kỹ sư An toàn Thông tin & An ninh Mạng",
                                    title: "Kỹ sư An toàn Thông tin & An ninh Mạng",
                                    majors: "An toàn Thông tin, An ninh Mạng, Kỹ thuật Mạng",
                                    jobs: "Chuyên gia bảo mật (Hacker mũ trắng), Kỹ sư an ninh mạng SOC, Phân tích mã độc",
                                    blocks: "A00, A01, D01",
                                    desc: "Bạn nhạy bén, thích truy tìm lỗ hổng bảo mật và xây dựng hàng rào an ninh thông tin bất khả xâm phạm.",
                                    advice: "Tìm hiểu kiến trúc mạng máy tính, hệ điều hành Linux và tham gia các đấu trường bảo mật CTF."
                                }
                            }
                        };
                    } else {
                        return {
                            q: "Bạn muốn trở thành Luật sư tranh tụng bảo vệ công lý hay Chuyên gia phân tích dữ liệu kinh tế lượng?",
                            desc: "Bước 2/2: Câu hỏi quyết định chốt hạ nghề nghiệp đích danh!",
                            optA: {
                                text: "⚖️ Luật sư Doanh nghiệp & Nghiên cứu Pháp lý Quốc tế (Luật học)",
                                leaf: {
                                    hollandCode: "E & S - Luật sư Doanh nghiệp & Luật Kinh tế",
                                    title: "Luật sư Doanh nghiệp & Nghiên cứu Pháp lý",
                                    majors: "Luật Kinh tế, Luật Dân sự, Luật Thương mại Quốc tế",
                                    jobs: "Luật sư tranh tụng, Cố vấn pháp lý doanh nghiệp, Công chứng viên, Trọng tài viên",
                                    blocks: "D01, C00, C14, D14",
                                    desc: "Bạn có tư duy phản biện sắc sảo, năng lực lập luận chặt chẽ và niềm đam mê với công lý.",
                                    advice: "Rèn luyện kỹ năng hùng biện, tư duy logic và đọc hiểu các văn bản pháp luật thực tế."
                                }
                            },
                            optB: {
                                text: "📊 Chuyên viên Phân tích Dữ liệu Kinh tế & Nghiên cứu Tâm lý Xã hội",
                                leaf: {
                                    hollandCode: "I & S - Tâm lý học Lâm sàng (Clinical Psychology)",
                                    title: "Chuyên gia Phân tích Dữ liệu Kinh tế & Tâm lý Hành vi",
                                    majors: "Kinh tế lượng, Tâm lý học, Thống kê Kinh tế - Xã hội",
                                    jobs: "Chuyên viên phân tích dữ liệu kinh tế, Cố vấn tâm lý học đường, Nghiên cứu viên chính sách",
                                    blocks: "D01, C14, A01",
                                    desc: "Bạn sâu sắc, có khả năng kết nối dữ liệu toán học với quy luật tâm lý và hành vi con người.",
                                    advice: "Làm chủ các công cụ thống kê (R, SPSS, Python) và trau dồi khả năng thấu cảm con người."
                                }
                            }
                        };
                    }
                }
            };
        } else {
            // Có học Sinh hoặc Hóa
            return {
                q1: {
                    q: "Trong thế giới Khoa học & Nghiên cứu, bạn hứng thú với công nghệ máy tính hay y học sinh học?",
                    desc: "Bước 1/2: Thần Đèn đang xoáy sâu vào nhóm I (Nghiên cứu) của bạn.",
                    optA: { text: "💻 Lập trình Trí tuệ Nhân tạo (AI), Khoa học Dữ liệu & Công nghệ Thông tin" },
                    optB: { text: "🧪 Y Đa khoa cứu người, Bào chế thuốc (Dược học) & Khoa học Y sinh" }
                },
                getQ2: (choice1) => {
                    if (choice1 === 'A') {
                        return {
                            q: "Bạn muốn phát triển mô hình Trí tuệ Nhân tạo (AI) hay Kỹ thuật Phần mềm & An ninh mạng?",
                            desc: "Bước 2/2: Câu hỏi quyết định chốt hạ nghề nghiệp đích danh!",
                            optA: {
                                text: "🤖 Kỹ sư Trí tuệ Nhân tạo (AI) & Khoa học Dữ liệu (Machine Learning / Data Science)",
                                leaf: {
                                    hollandCode: "I - Kỹ sư Trí tuệ Nhân tạo (AI) & Khoa học Dữ liệu",
                                    title: "Kỹ sư Trí tuệ Nhân tạo (AI) & Khoa học Dữ liệu",
                                    majors: "Trí tuệ Nhân tạo (AI), Khoa học Dữ liệu, Khoa học Máy tính",
                                    jobs: "Kỹ sư AI/Machine Learning, Data Scientist, Kỹ sư Big Data",
                                    blocks: "A00, A01, D01, D07",
                                    desc: "Bạn có tư duy phân tích sắc bén, đam mê thuật toán và muốn dẫn đầu cuộc cách mạng công nghệ số.",
                                    advice: "Đầu tư sâu cho môn Toán và Tiếng Anh kỹ thuật, học sớm Python và các thư viện Machine Learning."
                                }
                            },
                            optB: {
                                text: "🛡️ Kỹ sư An toàn Thông tin & An ninh Mạng (Chuyên gia Bảo mật)",
                                leaf: {
                                    hollandCode: "I - Kỹ sư An toàn Thông tin & An ninh Mạng",
                                    title: "Kỹ sư An toàn Thông tin & An ninh Mạng",
                                    majors: "An toàn Thông tin, An ninh Mạng, Kỹ thuật Mạng",
                                    jobs: "Chuyên gia bảo mật (Hacker mũ trắng), Kỹ sư an ninh mạng SOC, Phân tích mã độc",
                                    blocks: "A00, A01, D01",
                                    desc: "Bạn nhạy bén, thích truy tìm lỗ hổng bảo mật và xây dựng hàng rào an ninh thông tin bất khả xâm phạm.",
                                    advice: "Tìm hiểu kiến trúc mạng máy tính, hệ điều hành Linux và tham gia các đấu trường bảo mật CTF."
                                }
                            }
                        };
                    } else {
                        return {
                            q: "Bạn muốn trực tiếp khám chữa bệnh, phẫu thuật cứu người hay đứng sau bào chế dược phẩm mới?",
                            desc: "Bước 2/2: Câu hỏi quyết định chốt hạ nghề nghiệp đích danh!",
                            optA: {
                                text: "🩺 Bác sĩ Y Khoa (Bác sĩ Đa khoa, Ngoại khoa, Răng Hàm Mặt)",
                                leaf: {
                                    hollandCode: "I & S - Bác sĩ Y Khoa (Medicine)",
                                    title: "Bác sĩ Y Khoa & Ngoại khoa Điều trị",
                                    majors: "Bác sĩ Đa khoa, Bác sĩ Ngoại khoa, Bác sĩ Răng Hàm Mặt",
                                    jobs: "Bác sĩ điều trị bệnh viện, Bác sĩ phẫu thuật, Chuyên gia y tế chuyên khoa",
                                    blocks: "B00 (Toán, Hóa, Sinh), A00, D07",
                                    desc: "Bạn có trái tim nhân ái, khả năng chịu áp lực cao và đam mê y học cứu chữa cho người bệnh.",
                                    advice: "Tập trung tối đa cho tổ hợp B00 (Toán, Hóa, Sinh), rèn luyện sức khỏe dẻo dai và tính kiên trì."
                                }
                            },
                            optB: {
                                text: "💊 Dược Sĩ Lâm Sàng & Nghiên cứu Bào chế Vắc-xin / Kỹ thuật Y sinh",
                                leaf: {
                                    hollandCode: "I - Dược Sĩ (Pharmacy)",
                                    title: "Dược Sĩ & Kỹ thuật Công nghệ Y Sinh",
                                    majors: "Dược học, Hóa Dược, Công nghệ Y sinh, Di truyền học",
                                    jobs: "Dược sĩ nghiên cứu thuốc, Kỹ sư thiết bị y tế thông minh, Chuyên gia kiểm nghiệm dược phẩm",
                                    blocks: "A00, B00, D07",
                                    desc: "Bạn cẩn thận, yêu thích phòng thí nghiệm và mong muốn tìm ra các công thức thuốc điều trị bệnh hiểm nghèo.",
                                    advice: "Đào sâu môn Hóa học và Sinh học, rèn luyện kỹ năng thao tác chuẩn xác trong phòng thí nghiệm."
                                }
                            }
                        };
                    }
                }
            };
        }
    }

    if (groupKey === 'R') {
        return {
            q1: {
                q: "Bạn hào hứng với các cỗ máy công nghiệp hiện đại hay hệ sinh thái nông sinh - môi trường?",
                desc: "Bước 1/2: Thần Đèn đang xoáy sâu vào nhóm R (Thực tế & Kỹ thuật) của bạn.",
                optA: { text: "🚗 Động cơ ô tô, robot tự động hóa, vi mạch bán dẫn và máy móc cơ khí" },
                optB: { text: "🌿 Nông nghiệp thông minh, công nghệ môi trường & chuỗi cung ứng thực tế" }
            },
            getQ2: (choice1) => {
                if (choice1 === 'A') {
                    return {
                        q: "Bạn muốn chế tạo thế hệ xe hơi thông minh hay thiết kế vi mạch bán dẫn siêu nhỏ?",
                        desc: "Bước 2/2: Câu hỏi quyết định chốt hạ nghề nghiệp đích danh!",
                        optA: {
                            text: "🚗 Kỹ sư Công nghệ Ô tô & Cơ điện tử (Robotics)",
                            leaf: {
                                hollandCode: "R - Kỹ thuật Ô tô & Cơ điện tử (Realistic)",
                                title: "Kỹ sư Kỹ thuật Ô tô & Cơ điện tử (Robotics)",
                                majors: "Công nghệ Kỹ thuật Ô tô, Kỹ thuật Cơ điện tử, Robot & Tự động hóa",
                                jobs: "Kỹ sư ô tô điện, Kỹ sư Robot, Trưởng xưởng sản xuất thông minh",
                                blocks: "A00, A01, D01, D07",
                                desc: "Bạn có tư duy kỹ thuật xuất sắc, đam mê máy móc động cơ và công nghệ xe điện tự hành.",
                                advice: "Cày thật sâu môn Toán - Lý, tích cực tham gia các dự án nghiên cứu STEM và sáng chế mô hình."
                            }
                        },
                        optB: {
                            text: "⚡ Kỹ sư Vi mạch Bán dẫn & Hệ thống Điện tử Tự động hóa",
                            leaf: {
                                hollandCode: "R & I - Kỹ thuật Vi mạch & Bán dẫn",
                                title: "Kỹ sư Vi mạch Bán dẫn & Hệ thống Tự động hóa",
                                majors: "Công nghệ Bán dẫn, Kỹ thuật Điện - Điện tử, Vi mạch",
                                jobs: "Kỹ sư thiết kế chip bán dẫn, Kỹ sư điều khiển tự động, Kỹ sư vi điện tử",
                                blocks: "A00, A01, D07",
                                desc: "Bạn tỉ mỉ, say mê cấu trúc mạch điện tử nano và công nghệ điều khiển tự động của kỷ nguyên 4.0.",
                                advice: "Nắm vững Vật lý chất rắn, mạch điện và trau dồi Tiếng Anh kỹ thuật để đón đầu làn sóng chip bán dẫn."
                            }
                        }
                    };
                } else {
                    return {
                        q: "Bạn muốn vận hành trang trại công nghệ cao hay quản lý đại công trình & chuỗi cung ứng?",
                        desc: "Bước 2/2: Câu hỏi quyết định chốt hạ nghề nghiệp đích danh!",
                        optA: {
                            text: "🌾 Kỹ sư Nông nghiệp Công nghệ cao & Nông nghiệp Thông minh (Smart Agri)",
                            leaf: {
                                hollandCode: "R - Nông nghiệp Công nghệ cao",
                                title: "Kỹ sư Nông nghiệp Công nghệ cao & Nông trại Thông minh",
                                majors: "Nông nghiệp công nghệ cao, Công nghệ sinh học nông nghiệp",
                                jobs: "Giám đốc trang trại Hydroponics thông minh, Kỹ sư giống cây trồng, Quản lý nông trại số",
                                blocks: "B00, A00, D07",
                                desc: "Bạn yêu thiên nhiên, đam mê nông nghiệp thông minh điều khiển tự động bằng cảm biến IoT.",
                                advice: "Kết hợp kiến thức Sinh học với công nghệ IoT tự động hóa để nâng cao giá trị nông sản."
                            }
                        },
                        optB: {
                            text: "🏗️ Kỹ sư Xây dựng Công trình & Quản lý Chuỗi Cung ứng (Logistics Kỹ thuật)",
                            leaf: {
                                hollandCode: "R - Kỹ thuật Xây dựng & Công trình",
                                title: "Kỹ sư Xây dựng Công trình & Chuỗi Cung ứng Kỹ thuật",
                                majors: "Kỹ thuật Xây dựng, Xây dựng Cầu đường, Logistics Kỹ thuật",
                                jobs: "Chỉ huy trưởng công trình, Kỹ sư kết cấu hạ tầng, Quản trị kho vận quốc tế",
                                blocks: "A00, A01, D01",
                                desc: "Bạn thực tế, có năng lực bao quát công trình lớn và quản lý vận hành chuỗi cung ứng hàng hóa.",
                                advice: "Rèn luyện sức bền, tư duy không gian và khả năng làm việc với bản vẽ kỹ thuật chi tiết."
                            }
                        }
                    };
                }
            }
        };
    }

    if (groupKey === 'A') {
        return {
            q1: {
                q: "Trong thế giới Sáng tạo, phương tiện biểu đạt nào kích thích bạn nhất?",
                desc: "Bước 1/2: Thần Đèn đang xoáy sâu vào nhóm A (Nghệ thuật & Sáng tạo) của bạn.",
                optA: { text: "🎨 Thiết kế đồ họa số, giao diện UI/UX, không gian kiến trúc & mỹ thuật 3D" },
                optB: { text: "🎬 Kịch bản phim ảnh, đạo diễn điện ảnh, truyền thông báo chí và sáng tạo nội dung" }
            },
            getQ2: (choice1) => {
                if (choice1 === 'A') {
                    return {
                        q: "Bạn muốn sáng tạo trải nghiệm đồ họa ứng dụng (UI/UX / Game) hay kiến trúc không gian sống?",
                        desc: "Bước 2/2: Câu hỏi quyết định chốt hạ nghề nghiệp đích danh!",
                        optA: {
                            text: "🖌️ Chuyên viên Thiết kế Đồ họa & Trải nghiệm Người dùng (UI/UX / Game Art)",
                            leaf: {
                                hollandCode: "A - Thiết kế Đồ họa & Mỹ thuật Đa phương tiện (Graphic Design)",
                                title: "Chuyên viên Thiết kế Đồ họa & Trải nghiệm Người dùng (UI/UX)",
                                majors: "Thiết kế Đồ họa, Mỹ thuật Đa phương tiện, UI/UX Design",
                                jobs: "UI/UX Designer, Art Director (Giám đốc nghệ thuật), Họa sĩ minh họa số",
                                blocks: "D01, A01, V00, H00",
                                desc: "Bạn có gu thẩm mỹ tinh tế, nhạy bén với màu sắc và đam mê tạo ra các trải nghiệm thị giác ấn tượng.",
                                advice: "Luyện tập sử dụng thành thạo Figma, Photoshop, Illustrator và liên tục cập nhật xu hướng thiết kế toàn cầu."
                            }
                        },
                        optB: {
                            text: "🏛️ Kiến Trúc Sư Công Trình & Thiết Kế Nội Thất Hiện Đại",
                            leaf: {
                                hollandCode: "A & R - Kiến trúc Sư (Architecture)",
                                title: "Kiến Trúc Sư Công Trình & Thiết Kế Không Gian Sống",
                                majors: "Kiến trúc Công trình, Quy hoạch Đô thị, Thiết kế Nội thất",
                                jobs: "Kiến trúc sư chủ trì, Thiết kế không gian nội thất, Quy hoạch cảnh quan",
                                blocks: "V00 (Toán, Lý, Vẽ), A00, A01",
                                desc: "Bạn kết hợp hoàn hảo giữa tâm hồn nghệ sĩ và tư duy cấu trúc kỹ thuật của một kiến trúc sư.",
                                advice: "Rèn luyện khả năng vẽ mỹ thuật, tư duy hình học không gian và các phần mềm AutoCAD/3dsMax."
                            }
                        }
                    };
                } else {
                    return {
                        q: "Bạn muốn làm Đạo diễn đứng sau các thước phim bom tấn hay Chuyên gia Sáng tạo Nội dung / Nhà báo?",
                        desc: "Bước 2/2: Câu hỏi quyết định chốt hạ nghề nghiệp đích danh!",
                        optA: {
                            text: "🎥 Đạo diễn Điện ảnh & Sản xuất Phim ảnh, MV Ca nhạc",
                            leaf: {
                                hollandCode: "A - Đạo diễn Điện ảnh & Truyền hình",
                                title: "Đạo diễn Điện ảnh & Nhà Sản Xuất Phim Truyền Hình",
                                majors: "Đạo diễn Điện ảnh, Quay phim, Sản xuất Truyền hình",
                                jobs: "Đạo diễn phim, Nhà sản xuất TVC quảng cáo, Giám đốc hình ảnh studio",
                                blocks: "D01, C00, S00",
                                desc: "Bạn giàu trí tưởng tượng, có ngôn ngữ thị giác sắc bén và khả năng truyền tải cảm xúc qua từng khung hình.",
                                advice: "Xem nhiều tác phẩm điện ảnh kinh điển, học cách viết kịch bản phân cảnh và thử sức với máy quay."
                            }
                        },
                        optB: {
                            text: "📢 Chuyên gia Quan hệ Công chúng (PR) & Sáng tạo Nội dung (Content Creator / Báo chí)",
                            leaf: {
                                hollandCode: "A & E - Quan hệ Công chúng (PR) & Sáng tạo Nội dung",
                                title: "Chuyên gia Quan hệ Công chúng (PR) & Sáng tạo Nội dung Số",
                                majors: "Quan hệ Công chúng (PR), Báo chí, Truyền thông Đa phương tiện",
                                jobs: "Giám đốc truyền thông, Copywriter, Content Creator triệu view, Nhà báo",
                                blocks: "D01, C00, D14, D15",
                                desc: "Bạn có tài diễn đạt ngôn từ cuốn hút, nắm bắt trào lưu mạng xã hội và khả năng lan tỏa thông điệp mạnh mẽ.",
                                advice: "Rèn luyện kỹ năng viết bài sắc bén, tư duy kể chuyện (storytelling) và quản trị truyền thông mạng xã hội."
                            }
                        }
                    };
                }
            }
        };
    }

    if (groupKey === 'S') {
        return {
            q1: {
                q: "Bạn muốn đóng góp cho cộng đồng thông qua con đường nào dưới đây?",
                desc: "Bước 1/2: Thần Đèn đang xoáy sâu vào nhóm S (Xã hội & Thấu hiểu) của bạn.",
                optA: { text: "🎓 Giảng dạy truyền cảm hứng (Sư phạm) hoặc Tham vấn trị liệu tâm lý" },
                optB: { text: "🌐 Ngoại giao quốc tế, cán bộ quản lý chính sách công hoặc an ninh trật tự" }
            },
            getQ2: (choice1) => {
                if (choice1 === 'A') {
                    return {
                        q: "Bạn muốn trở thành Nhà giáo dục khai phóng tư duy hay Chuyên gia Lắng nghe & Trị liệu Tâm lý?",
                        desc: "Bước 2/2: Câu hỏi quyết định chốt hạ nghề nghiệp đích danh!",
                        optA: {
                            text: "👩‍🏫 Giáo viên / Giảng viên Sư phạm Xuất Sắc",
                            leaf: {
                                hollandCode: "S - Sư phạm Ngữ văn / Lịch sử / Địa lý",
                                title: "Giáo viên / Giảng viên Sư phạm Môn Học",
                                majors: "Sư phạm Toán, Sư phạm Ngữ văn, Sư phạm Tiếng Anh, Sư phạm Lịch sử",
                                jobs: "Giáo viên trường THPT chuyên/quốc tế, Giảng viên đại học, Cố vấn giáo dục",
                                blocks: "C00, D01, A00, A01",
                                desc: "Bạn có tâm huyết gieo mầm tri thức, kiên nhẫn và khả năng truyền cảm hứng học tập mạnh mẽ cho thế hệ trẻ.",
                                advice: "Đào sâu kiến thức bộ môn chuyên ngành, rèn luyện giọng nói truyền cảm và phương pháp sư phạm hiện đại."
                            }
                        },
                        optB: {
                            text: "🧠 Chuyên gia Tâm lý học Lâm sàng & Trị liệu Cảm xúc",
                            leaf: {
                                hollandCode: "I & S - Tâm lý học Lâm sàng (Clinical Psychology)",
                                title: "Chuyên gia Tâm lý học Lâm sàng & Tham vấn Trị liệu",
                                majors: "Tâm lý học, Tham vấn Trị liệu Tâm lý, Tâm lý học Giáo dục",
                                jobs: "Chuyên gia tham vấn tâm lý, Trị liệu tâm lý bệnh viện, Cố vấn tâm lý học đường",
                                blocks: "B00, D01, C00, C14",
                                desc: "Bạn thấu hiểu, có năng lượng chữa lành và khả năng lắng nghe không phán xét để giúp đỡ người khác.",
                                advice: "Đọc sâu các tài liệu tâm lý học nhân văn, thực hành lắng nghe tích cực và giữ tâm thế bình an."
                            }
                        }
                    };
                } else {
                    return {
                        q: "Bạn muốn đại diện đất nước trên trường quốc tế hay phục vụ chính sách nhân dân trong nước?",
                        desc: "Bước 2/2: Câu hỏi quyết định chốt hạ nghề nghiệp đích danh!",
                        optA: {
                            text: "🕊️ Nhà Ngoại giao & Chuyên viên Quan hệ Quốc tế",
                            leaf: {
                                hollandCode: "S & E - Ngoại giao & Quan hệ Quốc tế",
                                title: "Nhà Ngoại Giao & Chuyên Viên Quan Hệ Quốc Tế",
                                majors: "Quan hệ Quốc tế, Luật Quốc tế, Ngoại giao",
                                jobs: "Cán bộ ngoại vụ Bộ Ngoại giao, Đại sứ, Chuyên viên tổ chức quốc tế (UN, ASEAN)",
                                blocks: "D01, D14, A01",
                                desc: "Bạn lịch thiệp, có tầm nhìn toàn cầu, bản lĩnh đàm phán và khả năng kết nối văn hóa đa quốc gia.",
                                advice: "Học giỏi ít nhất hai ngoại ngữ (Anh, Pháp, Trung...), cập nhật tin tức thời sự quốc tế hàng ngày."
                            }
                        },
                        optB: {
                            text: "🏛️ Cán bộ Quản lý Nhà nước, Luật Sư Nhân Quyền & Lực lượng An ninh",
                            leaf: {
                                hollandCode: "S - Cán bộ Quản lý Nhà nước & Chính sách Công",
                                title: "Cán bộ Quản lý Nhà nước & Chính sách Công",
                                majors: "Quản lý Nhà nước, Chính sách Công, Luật, An ninh",
                                jobs: "Công chức cơ quan hành chính nhà nước, Luật sư trợ giúp pháp lý, Sĩ quan chỉ huy",
                                blocks: "C00, C19, C14, D01",
                                desc: "Bạn có tinh thần trách nhiệm cao, tận tụy và mong muốn cống hiến cho sự phát triển của quê hương đất nước.",
                                advice: "Tìm hiểu thể chế chính trị, pháp luật hành chính và tham gia các hoạt động Đoàn thể thanh niên."
                            }
                        }
                    };
                }
            }
        };
    }

    if (groupKey === 'E') {
        return {
            q1: {
                q: "Bản lĩnh lãnh đạo của bạn thể hiện mạnh mẽ nhất trong bối cảnh nào?",
                desc: "Bước 1/2: Thần Đèn đang xoáy sâu vào nhóm E (Quản trị & Lãnh đạo) của bạn.",
                optA: { text: "🚀 Khởi nghiệp làm chủ (Startup CEO), sàn thương mại điện tử & dịch vụ quốc tế" },
                optB: { text: "🎯 Marketing truyền thông thương hiệu, đầu tư tài chính & luật kinh tế" }
            },
            getQ2: (choice1) => {
                if (choice1 === 'A') {
                    return {
                        q: "Bạn muốn sáng lập và điều hành công ty công nghệ / TMĐT hay làm Tổng quản lý Khách sạn & Du lịch 5 sao?",
                        desc: "Bước 2/2: Câu hỏi quyết định chốt hạ nghề nghiệp đích danh!",
                        optA: {
                            text: "👔 CEO / Tổng Giám Đốc Khởi Nghiệp & Quản Trị Kinh Doanh",
                            leaf: {
                                hollandCode: "E - Quản trị Kinh doanh & Khởi nghiệp (CEO/Founder)",
                                title: "CEO / Tổng Giám Đốc Khởi Nghiệp & Quản Trị Doanh Nghiệp",
                                majors: "Quản trị Kinh doanh, Khởi nghiệp & Đổi mới sáng tạo, Thương mại Điện tử",
                                jobs: "CEO / Tổng giám đốc điều hành, Nhà sáng lập doanh nghiệp, Giám đốc chiến lược",
                                blocks: "A00, A01, D01, C14",
                                desc: "Bạn có tầm nhìn chiến lược, khả năng dẫn dắt đội ngũ và tinh thần dám nghĩ dám làm để tạo dựng đế chế kinh doanh.",
                                advice: "Rèn luyện tư duy tài chính, kỹ năng thuyết trình gọi vốn và khả năng ứng biến linh hoạt trước thử thách."
                            }
                        },
                        optB: {
                            text: "🏨 Tổng Quản Lý Khách Sạn & Khu Nghỉ Dưỡng Quốc Tế 5 Sao",
                            leaf: {
                                hollandCode: "E - Quản trị Khách sạn & Nghỉ dưỡng Quốc tế",
                                title: "Tổng Quản Lý Khách Sạn & Khu Nghỉ Dưỡng 5 Sao",
                                majors: "Quản trị Khách sạn, Quản trị Dịch vụ Du lịch & Lữ hành",
                                jobs: "Tổng giám đốc khách sạn 5 sao, Quản lý resort cao cấp, Giám đốc chuỗi F&B",
                                blocks: "D01, A01, D14, D15",
                                desc: "Bạn hào phóng, chu đáo, có phong thái chuyên nghiệp và khả năng tổ chức vận hành dịch vụ đẳng cấp quốc tế.",
                                advice: "Học thật tốt Tiếng Anh giao tiếp, rèn luyện tác phong chuẩn mực và khả năng xử lý tình huống khéo léo."
                            }
                        }
                    };
                } else {
                    return {
                        q: "Bạn muốn thống trị thị trường bằng chiến dịch quảng cáo sáng tạo hay làm chủ dòng tiền đầu tư triệu đô?",
                        desc: "Bước 2/2: Câu hỏi quyết định chốt hạ nghề nghiệp đích danh!",
                        optA: {
                            text: "📢 Giám Đốc Marketing (CMO) & Quản Trị Thương Hiệu Toàn Cầu",
                            leaf: {
                                hollandCode: "E - Chuyên gia Marketing & Truyền thông Thương hiệu",
                                title: "Giám Đốc Marketing (CMO) & Quản Trị Thương Hiệu",
                                majors: "Marketing, Quản trị Thương hiệu, Digital Marketing",
                                jobs: "Giám đốc Marketing (CMO), Brand Manager, Chuyên gia tăng trưởng (Growth Hacker)",
                                blocks: "A01, D01, D07, C14",
                                desc: "Bạn nhạy bén với tâm lý khách hàng, sáng tạo và có khả năng bùng nổ doanh số bằng các chiến dịch marketing đột phá.",
                                advice: "Nghiên cứu hành vi người tiêu dùng, học phân tích dữ liệu quảng cáo số (Facebook/TikTok/Google Ads)."
                            }
                        },
                        optB: {
                            text: "💼 Nhà Quản Lý Quỹ Đầu Tư / Luật Sư Kinh Tế & Mua Bán Sáp Nhập (M&A)",
                            leaf: {
                                hollandCode: "E & C - Tài chính - Ngân hàng & Quản lý Quỹ Đầu tư",
                                title: "Nhà Quản Lý Quỹ Đầu Tư & Luật Sư Kinh Tế Doanh Nghiệp",
                                majors: "Tài chính - Ngân hàng, Đầu tư Tài chính, Luật Kinh tế",
                                jobs: "Quản lý quỹ đầu tư, Chuyên viên phân tích M&A, Luật sư thương mại quốc tế",
                                blocks: "A00, A01, D01, D07",
                                desc: "Bạn có cái đầu lạnh, tư duy nhạy bén với các con số và khả năng sinh lời từ các cơ hội đầu tư giá trị.",
                                advice: "Trau dồi phân tích báo cáo tài chính, theo dõi thị trường chứng khoán và nắm chắc các luật định thương mại."
                            }
                        }
                    };
                }
            }
        };
    }

    // Nhóm C
    return {
        q1: {
            q: "Bạn thích sự chuẩn xác tuyệt đối trong hệ thống dữ liệu số hay sổ sách tài chính - pháp lý?",
            desc: "Bước 1/2: Thần Đèn đang xoáy sâu vào nhóm C (Nghiệp vụ & Quy củ) của bạn.",
            optA: { text: "💻 Hệ thống thông tin quản lý (MIS), phân tích nghiệp vụ (BA) & dữ liệu số" },
            optB: { text: "📑 Kiểm toán Big 4, kế toán quản trị, thuế & thanh tra tài chính công" }
        },
        getQ2: (choice1) => {
            if (choice1 === 'A') {
                return {
                    q: "Bạn muốn làm cầu nối kinh doanh - công nghệ (Business Analyst) hay chuyên gia quản trị cơ sở dữ liệu (MIS)?",
                    desc: "Bước 2/2: Câu hỏi quyết định chốt hạ nghề nghiệp đích danh!",
                    optA: {
                        text: "📈 Chuyên Viên Phân Tích Nghiệp Vụ Doanh Nghiệp (Business Analyst - BA)",
                        leaf: {
                            hollandCode: "C & I - Hệ thống Thông tin Quản lý (MIS)",
                            title: "Chuyên Viên Phân Tích Nghiệp Vụ Doanh Nghiệp (Business Analyst - BA)",
                            majors: "Hệ thống Thông tin Quản lý (MIS), Phân tích Dữ liệu Kinh doanh",
                            jobs: "Business Analyst (BA), Chuyên gia tối ưu quy trình kinh doanh, Tư vấn ERP",
                            blocks: "A00, A01, D01, D07",
                            desc: "Bạn có khả năng kết nối giữa ngôn ngữ kinh doanh và giải pháp công nghệ, giúp doanh nghiệp vận hành tối ưu.",
                            advice: "Học các công cụ vẽ sơ đồ nghiệp vụ (BPMN, Jira, Confluence) và kỹ năng giao tiếp truyền tải yêu cầu."
                        }
                    },
                    optB: {
                        text: "🗄️ Quản Trị Cơ Sở Dữ Liệu & Kiến Trúc Hệ Thống Thông Tin Doanh Nghiệp",
                        leaf: {
                            hollandCode: "C & I - Hệ thống Thông tin Quản lý (MIS)",
                            title: "Quản Trị Cơ Sở Dữ Liệu & Hệ Thống Thông Tin Doanh Nghiệp",
                            majors: "Hệ thống Thông tin Quản lý, An toàn Dữ liệu Doanh nghiệp",
                            jobs: "Quản trị cơ sở dữ liệu (DBA), Chuyên viên bảo mật dữ liệu, Kỹ sư dữ liệu (Data Engineer)",
                            blocks: "A00, A01, D01",
                            desc: "Bạn ngăn nắp, cẩn trọng và là người bảo vệ an toàn cho kho dữ liệu cốt lõi của doanh nghiệp.",
                            advice: "Làm chủ ngôn ngữ truy vấn SQL, các hệ quản trị cơ sở dữ liệu (PostgreSQL, MySQL, Oracle)."
                        }
                    }
                };
            } else {
                return {
                    q: "Bạn muốn trở thành Kiểm toán viên uy tín tại Big 4 hay Kế toán trưởng / Chuyên gia Thuế Hải quan?",
                    desc: "Bước 2/2: Câu hỏi quyết định chốt hạ nghề nghiệp đích danh!",
                    optA: {
                        text: "🔍 Kiểm Toán Viên Độc Lập Tại Các Hãng Kiểm Toán Big 4 (PwC, EY, KPMG, Deloitte)",
                        leaf: {
                            hollandCode: "C - Kiểm toán & Phân tích Thuế",
                            title: "Kiểm Toán Viên Độc Lập Hàng Đầu (Big 4)",
                            majors: "Kiểm toán, Kế toán Doanh nghiệp, Tài chính",
                            jobs: "Kiểm toán viên Big 4, Trưởng ban kiểm soát nội bộ, Chuyên viên kiểm toán rủi ro",
                            blocks: "A00, A01, D01, C14",
                            desc: "Bạn có tính liêm chính, con mắt tinh tường phát hiện sai sót và phong thái làm việc chuyên nghiệp chuẩn quốc tế.",
                            advice: "Cày thật tốt môn Toán và Tiếng Anh, hướng đến thi lấy chứng chỉ kế kiểm toán quốc tế (ACCA, CPA)."
                        }
                    },
                    optB: {
                        text: "📋 Kế Toán Trưởng & Chuyên Gia Thẩm Định Thuế / Hải Quan Xuất Nhập Khẩu",
                        leaf: {
                            hollandCode: "C - Kiểm toán & Phân tích Thuế",
                            title: "Kế Toán Trưởng & Chuyên Gia Thuế - Hải Quan",
                            majors: "Kế toán, Thuế & Hải quan, Tài chính Công",
                            jobs: "Kế toán trưởng tập đoàn, Thanh tra thuế, Chuyên gia hải quan thông quan hàng hóa",
                            blocks: "A00, A01, D01, C14",
                            desc: "Bạn là cánh tay phải đắc lực của ban giám đốc trong việc quản trị dòng tiền, tuân thủ pháp luật thuế và tối ưu chi phí.",
                            advice: "Nắm vững luật thuế, các phần mềm kế toán MISA/SAP và rèn luyện tính trung thực, chuẩn xác tuyệt đối."
                        }
                    }
                };
            }
        }
    };
}

// 1. Khởi động bài đố Thần Đèn
function startDecisionTree() {
    window.userSubjects = typeof getSelectedSubjects === 'function' ? getSelectedSubjects() : ['Toán', 'Văn', 'Tiếng Anh'];
    localStorage.setItem('school_user_subjects', JSON.stringify(window.userSubjects));

    akinatorIndex = 0;
    akinatorAnswers = [];
    akinatorBranchState = {
        choice1: null,
        choice2: null,
        finalLeaf: null
    };

    document.getElementById('career-intro-screen').classList.add('hidden');
    document.getElementById('career-result-screen').classList.add('hidden');
    document.getElementById('career-tree-screen').classList.remove('hidden');

    renderAkinatorQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 1. Hàm tự động đổi Hào quang & Biểu cảm Thần Đèn theo % độ đọc vị
function updateGenieExpression(stepIndex, totalSteps = 19) {
    const percent = Math.min(98, Math.max(5, Math.round(((stepIndex + 1) / totalSteps) * 100)));
    
    const spriteEl = document.getElementById('genie-avatar-sprite');
    const auraEl = document.getElementById('genie-aura-glow');
    const moodTextEl = document.getElementById('genie-mood-text');
    const stageBoxEl = document.getElementById('genie-stage-box');
    const tagEl = document.getElementById('genie-stage-tag');
    const percentLabel = document.getElementById('tree-percent-label');
    const progressBar = document.getElementById('tree-progress-bar');

    if (percentLabel) percentLabel.innerText = `🔮 Độ đọc vị: ${percent}%`;
    if (progressBar) progressBar.style.width = `${percent}%`;

    if (percent < 30) {
        // Cấp 1 (Câu 1 - 5): Góc Trái-Trên (Chống cằm dấu hỏi ?)
        if (spriteEl) spriteEl.className = "genie-sprite genie-pos-1 relative z-10 animate-bounce";
        if (auraEl) auraEl.className = "absolute inset-0 rounded-full bg-cyan-400/35 blur-xl animate-pulse transition-all duration-500";
        if (moodTextEl) moodTextEl.innerText = "🔍 Đang dò tần số suy nghĩ của bạn...";
        if (stageBoxEl) stageBoxEl.className = "bg-gradient-to-r from-sky-50 via-indigo-50/50 to-purple-50 p-4 sm:p-5 rounded-2xl border border-sky-200 flex flex-col sm:flex-row items-center sm:items-start gap-4 transition-all duration-500";
        if (tagEl) tagEl.className = "bg-sky-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider";
    } else if (percent < 60) {
        // Cấp 2 (Câu 6 - 11): Góc Phải-Trên (Nheo mắt bóng đèn 💡)
        if (spriteEl) spriteEl.className = "genie-sprite genie-pos-2 relative z-10 animate-bounce";
        if (auraEl) auraEl.className = "absolute inset-0 rounded-full bg-purple-500/40 blur-xl animate-pulse transition-all duration-500 scale-110";
        if (moodTextEl) moodTextEl.innerText = "💡 Ồ! Thần Đèn bắt đầu thấy manh mối tính cách rồi...";
        if (stageBoxEl) stageBoxEl.className = "bg-gradient-to-r from-purple-50 via-fuchsia-50/50 to-indigo-50 p-4 sm:p-5 rounded-2xl border border-purple-200 flex flex-col sm:flex-row items-center sm:items-start gap-4 transition-all duration-500";
        if (tagEl) tagEl.className = "bg-purple-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider";
    } else if (percent < 85) {
        // Cấp 3 (Câu 12 - 16): Góc Trái-Dưới (Mở to mắt bất ngờ ✨)
        if (spriteEl) spriteEl.className = "genie-sprite genie-pos-3 relative z-10 animate-bounce";
        if (auraEl) auraEl.className = "absolute inset-0 rounded-full bg-rose-500/45 blur-2xl animate-pulse transition-all duration-500 scale-115";
        if (moodTextEl) moodTextEl.innerText = "✨ Rất rõ nét! Tổ hợp nghề nghiệp đang hiện lên...";
        if (stageBoxEl) stageBoxEl.className = "bg-gradient-to-r from-rose-50 via-amber-50/50 to-purple-50 p-4 sm:p-5 rounded-2xl border border-rose-200 flex flex-col sm:flex-row items-center sm:items-start gap-4 transition-all duration-500";
        if (tagEl) tagEl.className = "bg-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider";
    } else {
        // Cấp 4 (Câu 17 - 19): Góc Phải-Dưới (Cười lớn búng tay ⭐)
        if (spriteEl) spriteEl.className = "genie-sprite genie-pos-4 relative z-10 animate-bounce";
        if (auraEl) auraEl.className = "absolute inset-0 rounded-full bg-amber-400/60 blur-2xl animate-pulse transition-all duration-500 scale-125";
        if (moodTextEl) moodTextEl.innerText = "⭐ A ha! Thần Đèn đã nhìn thấu ngành nghề của bạn rồi!";
        if (stageBoxEl) stageBoxEl.className = "bg-gradient-to-r from-amber-50 via-yellow-50/70 to-orange-50 p-4 sm:p-5 rounded-2xl border-2 border-amber-300 shadow-md flex flex-col sm:flex-row items-center sm:items-start gap-4 transition-all duration-500";
        if (tagEl) tagEl.className = "bg-amber-500 text-amber-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider";
    }
}

// 2. Hiển thị câu hỏi hiện tại cho Thần Đèn (Gồm 17 câu cơ bản + 2 câu rẽ nhánh từ DECISION_TREE_ROOT)
function renderAkinatorQuestion() {
    const total = AKINATOR_17_QUESTIONS.length + 2; // 19 câu
    const curNum = akinatorIndex + 1;

    const depthLabel = document.getElementById('tree-depth-label');
    const questionText = document.getElementById('tree-question-text');
    const questionDesc = document.getElementById('tree-question-desc');
    const moodText = document.getElementById('genie-mood-text');
    const backBtn = document.getElementById('btn-tree-back');
    const standardBtns = document.getElementById('tree-standard-buttons');
    const branchBtns = document.getElementById('tree-branch-buttons');

    if (backBtn) {
        if (akinatorIndex > 0) backBtn.classList.remove('hidden');
        else backBtn.classList.add('hidden');
    }

    // Tự động đổi màu Hào quang, Biểu cảm & Tiến trình Thần Đèn
    updateGenieExpression(akinatorIndex, total);

    // GIAI ĐOẠN 1: 17 CÂU HỎI TIÊU CHUẨN HOLLAND & MBTI
    if (akinatorIndex < AKINATOR_17_QUESTIONS.length) {
        if (standardBtns) standardBtns.classList.remove('hidden');
        if (branchBtns) branchBtns.classList.add('hidden');

        const q = AKINATOR_17_QUESTIONS[akinatorIndex];

        if (depthLabel) depthLabel.innerText = `Câu hỏi ${curNum} / ${total}`;
        if (questionText) questionText.innerText = q.q;
        if (questionDesc) questionDesc.innerText = q.desc || '';
        return;
    }

    // GIAI ĐOẠN 2: 2 CÂU HỎI RẼ NHÁNH TỪ CÂY QUYẾT ĐỊNH (DECISION_TREE_ROOT)
    const preliminaryGroup = getPreliminaryTopHollandGroup();
    const branchData = getBranchingDataForGroup(preliminaryGroup, window.userSubjects || []);

    if (standardBtns) standardBtns.classList.add('hidden');
    if (branchBtns) branchBtns.classList.remove('hidden');

    if (akinatorIndex === AKINATOR_17_QUESTIONS.length) {
        // CÂU HỎI 18 (Rẽ nhánh tầng 1)
        const q1 = branchData.q1;

        if (depthLabel) depthLabel.innerText = `Câu hỏi 18 / ${total} • 🌟 Rẽ nhánh nhóm ${getGroupNameVi(preliminaryGroup)}`;
        if (questionText) questionText.innerText = q1.q;
        if (questionDesc) questionDesc.innerText = q1.desc || '';

        const textA = document.getElementById('btn-branch-text-a');
        const textB = document.getElementById('btn-branch-text-b');
        if (textA) textA.innerText = q1.optA.text;
        if (textB) textB.innerText = q1.optB.text;

        if (moodText) {
            moodText.innerText = `Thần Đèn phát hiện bạn nổi trội nhóm ${getGroupNameVi(preliminaryGroup)}! Hãy chọn ngã rẽ phù hợp nhất:`;
        }
    } else if (akinatorIndex === AKINATOR_17_QUESTIONS.length + 1) {
        // CÂU HỎI 19 (Chốt hạ nghề nghiệp đích danh)
        const choice1 = akinatorBranchState.choice1 || 'A';
        const q2 = branchData.getQ2(choice1);

        if (depthLabel) depthLabel.innerText = `Câu hỏi 19 / ${total} • 🎯 Quyết định chốt hạ nghề nghiệp!`;
        if (questionText) questionText.innerText = q2.q;
        if (questionDesc) questionDesc.innerText = q2.desc || '';

        const textA = document.getElementById('btn-branch-text-a');
        const textB = document.getElementById('btn-branch-text-b');
        if (textA) textA.innerText = q2.optA.text;
        if (textB) textB.innerText = q2.optB.text;

        if (moodText) {
            moodText.innerText = "Câu hỏi tối thượng! Thần Đèn sắp hé lộ đích danh số mệnh nghề nghiệp của bạn!";
        }
    } else {
        finishAkinatorGame(akinatorBranchState.finalLeaf);
    }
}

// 3. Xử lý khi bấm nút CÓ, KHÔNG hoặc BỎ QUA (Câu 1 đến Câu 17)
function chooseDecision(choice) {
    if (akinatorIndex >= AKINATOR_17_QUESTIONS.length) return;

    akinatorAnswers.push({
        index: akinatorIndex,
        choice: choice,
        q: AKINATOR_17_QUESTIONS[akinatorIndex]
    });

    akinatorIndex++;
    renderAkinatorQuestion();
}

// 3.1. Xử lý khi bấm lựa chọn A hoặc B ở 2 câu rẽ nhánh Cây quyết định (Câu 18 và Câu 19)
function chooseBranchOption(optKey) {
    if (akinatorIndex === AKINATOR_17_QUESTIONS.length) {
        akinatorBranchState.choice1 = optKey;
        akinatorIndex++;
        renderAkinatorQuestion();
    } else if (akinatorIndex === AKINATOR_17_QUESTIONS.length + 1) {
        akinatorBranchState.choice2 = optKey;
        const preliminaryGroup = getPreliminaryTopHollandGroup();
        const branchData = getBranchingDataForGroup(preliminaryGroup, window.userSubjects || []);
        const q2 = branchData.getQ2(akinatorBranchState.choice1 || 'A');
        const selectedLeaf = (optKey === 'A') ? q2.optA.leaf : q2.optB.leaf;
        akinatorBranchState.finalLeaf = selectedLeaf;
        akinatorIndex++;
        finishAkinatorGame(selectedLeaf);
    }
}

// 4. Quay lại câu trước
function backDecision() {
    if (akinatorIndex > 0) {
        if (akinatorIndex === AKINATOR_17_QUESTIONS.length + 1) {
            akinatorBranchState.choice2 = null;
            akinatorIndex--;
        } else if (akinatorIndex === AKINATOR_17_QUESTIONS.length) {
            akinatorBranchState.choice1 = null;
            akinatorIndex--;
        } else {
            akinatorAnswers.pop();
            akinatorIndex--;
        }
        renderAkinatorQuestion();
    }
}

// 4.1. Chuyển hướng sang Phòng Luyện Thi theo môn học (YÊU CẦU 4)
function goToExamWithSubject(subj) {
    if (!subj) subj = 'Toán';
    const subjMap = {
        'Vật lý': 'Vật Lí',
        'Vật lí': 'Vật Lí',
        'Hóa học': 'Hóa Học',
        'Sinh học': 'Sinh Học',
        'Lịch sử': 'Lịch Sử',
        'Địa lí': 'Địa Lí',
        'Địa lý': 'Địa Lí',
        'Tiếng Anh': 'Tiếng Anh',
        'Tin học': 'Tin Học',
        'Công nghệ': 'Công Nghệ',
        'GDKT&PL': 'GDKT&PL',
        'Toán': 'Toán'
    };
    const finalSubj = subjMap[subj] || subj;

    if (typeof switchTab === 'function') {
        switchTab('exam');
    }
    if (typeof selectExamSubject === 'function') {
        selectExamSubject(finalSubj);
    }
    if (typeof setExamSubTab === 'function') {
        setExamSubTab('practice');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (typeof showToast === 'function') {
        showToast(`Thần Đèn đã mở Phòng Luyện thi môn ${finalSubj} cho khối thi của bạn!`, 'success');
    }
}

// 5. Kết thúc bài đố và hiển thị màn hình kết quả hoàn chỉnh
function finishAkinatorGame(customLeaf = null) {
    // --- A. TÍNH ĐIỂM HOLLAND RIASEC (YÊU CẦU 1: SỬA LỖI CỘNG ĐIỂM BỎ QUA & KHÔNG) ---
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    const mbtiScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

    akinatorAnswers.forEach(ans => {
        const q = ans.q;
        if (!q) return;
        if (ans.choice === 'YES') {
            // Đúng sở thích: cộng mạnh nhóm chính và nhóm phụ
            scores[q.group] = (scores[q.group] || 0) + 20;
            if (q.subGroup) scores[q.subGroup] = (scores[q.subGroup] || 0) + 6;
            if (q.mbtiPlus) {
                for (let k in q.mbtiPlus) mbtiScores[k] += q.mbtiPlus[k];
            }
        } else if (ans.choice === 'PROBABLY') {
            // Mức "Có vẻ Đúng": cộng một nửa số điểm (+10 điểm chính, +3 điểm phụ)
            scores[q.group] = (scores[q.group] || 0) + 10;
            if (q.subGroup) scores[q.subGroup] = (scores[q.subGroup] || 0) + 3;
            if (q.mbtiPlus) {
                for (let k in q.mbtiPlus) mbtiScores[k] += Math.round(q.mbtiPlus[k] / 2);
            }
        } else if (ans.choice === 'NO') {
            // YÊU CẦU 1: Chọn NO trừ nhẹ 5 điểm nhóm chính để loại trừ chính xác ngành không thích
            scores[q.group] = (scores[q.group] || 0) - 5;
            if (q.subGroup) scores[q.subGroup] = (scores[q.subGroup] || 0) - 2;
            if (q.mbtiMinus) {
                for (let k in q.mbtiMinus) mbtiScores[k] += q.mbtiMinus[k];
            }
        } else if (ans.choice === 'SKIP') {
            // YÊU CẦU 1: Chọn SKIP cộng +0 điểm (giữ nguyên), không làm sai lệch điểm
            scores[q.group] = (scores[q.group] || 0) + 0;
        }
    });

    window.lastCalculatedHollandScores = scores;

    // 1. Phân định mã MBTI 4 ký tự
    const typeEI = (mbtiScores.I >= mbtiScores.E) ? "I" : "E";
    const typeSN = (mbtiScores.N >= mbtiScores.S) ? "N" : "S";
    const typeTF = (mbtiScores.T >= mbtiScores.F) ? "T" : "F";
    const typeJP = (mbtiScores.J >= mbtiScores.P) ? "J" : "P";
    const mbtiKey = `${typeEI}${typeSN}${typeTF}${typeJP}`;
    const mbtiInfo = MBTI_MASTER_DATA[mbtiKey] || MBTI_MASTER_DATA["INTJ"];

    const totalEI = (mbtiScores.E + mbtiScores.I) || 1;
    const pctI = Math.round((mbtiScores.I / totalEI) * 100);
    const pctE = 100 - pctI;

    const totalSN = (mbtiScores.S + mbtiScores.N) || 1;
    const pctN = Math.round((mbtiScores.N / totalSN) * 100);
    const pctS = 100 - pctN;

    const totalTF = (mbtiScores.T + mbtiScores.F) || 1;
    const pctT = Math.round((mbtiScores.T / totalTF) * 100);
    const pctF = 100 - pctT;

    const totalJP = (mbtiScores.J + mbtiScores.P) || 1;
    const pctJ = Math.round((mbtiScores.J / totalJP) * 100);
    const pctP = 100 - pctJ;

    // 2. Tính phần trăm Holland RIASEC
    const groupPct = {};
    for (let k in scores) {
        const raw = Math.max(0, scores[k]);
        groupPct[k] = Math.min(100, Math.max(10, Math.round((raw / 45) * 100)));
    }
    const sortedGroups = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
    const top1 = sortedGroups[0];
    const top2 = sortedGroups[1];
    const top3 = sortedGroups[2];
    const hollandCode = `${top1}${top2}${top3}`;
    const masterInfo = HOLLAND_MASTER_DATA[top1] || HOLLAND_MASTER_DATA["R"];

    const leaf = customLeaf || akinatorBranchState.finalLeaf;

    // 3. Chuyển sang màn hình kết quả (Kích hoạt màn chờ lật bài 1.5s)
    if (typeof window.triggerGrandReveal === 'function') {
        window.triggerGrandReveal(scores);
    } else {
        document.getElementById('career-tree-screen').classList.add('hidden');
        document.getElementById('career-result-screen').classList.remove('hidden');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // --- CẬP NHẬT GIAO DIỆN KẾT QUẢ ---
    
    // A. Thẻ MBTI
    const mbtiTypeEl = document.getElementById('res-mbti-type');
    const mbtiTitleEl = document.getElementById('res-mbti-title');
    const mbtiDescEl = document.getElementById('res-mbti-desc');
    const mbtiAxesEl = document.getElementById('res-mbti-axes');

    if (mbtiTypeEl) mbtiTypeEl.innerText = `${mbtiKey} - ${mbtiInfo.name.split('(')[0].trim()}`;
    if (mbtiTitleEl) mbtiTitleEl.innerText = mbtiInfo.name;
    if (mbtiDescEl) mbtiDescEl.innerText = `${mbtiInfo.desc} Đặc trưng: ${mbtiInfo.strengths}`;

    if (mbtiAxesEl) {
        mbtiAxesEl.innerHTML = `
            <div class="bg-black/20 p-2 rounded-lg border border-purple-600/30">
                <div class="flex justify-between text-[10px] mb-1">
                    <span class="${typeEI === 'E' ? 'text-amber-300 font-bold' : 'text-gray-300'}">Hướng ngoại (E) ${pctE}%</span>
                    <span class="${typeEI === 'I' ? 'text-amber-300 font-bold' : 'text-gray-300'}">Hướng nội (I) ${pctI}%</span>
                </div>
                <div class="w-full bg-white/10 h-1.5 rounded-full overflow-hidden flex">
                    <div class="bg-amber-400 h-full" style="width: ${pctE}%"></div>
                    <div class="bg-purple-400 h-full" style="width: ${pctI}%"></div>
                </div>
            </div>

            <div class="bg-black/20 p-2 rounded-lg border border-purple-600/30">
                <div class="flex justify-between text-[10px] mb-1">
                    <span class="${typeSN === 'S' ? 'text-amber-300 font-bold' : 'text-gray-300'}">Thực tế (S) ${pctS}%</span>
                    <span class="${typeSN === 'N' ? 'text-amber-300 font-bold' : 'text-gray-300'}">Trực giác (N) ${pctN}%</span>
                </div>
                <div class="w-full bg-white/10 h-1.5 rounded-full overflow-hidden flex">
                    <div class="bg-blue-400 h-full" style="width: ${pctS}%"></div>
                    <div class="bg-cyan-400 h-full" style="width: ${pctN}%"></div>
                </div>
            </div>

            <div class="bg-black/20 p-2 rounded-lg border border-purple-600/30">
                <div class="flex justify-between text-[10px] mb-1">
                    <span class="${typeTF === 'T' ? 'text-amber-300 font-bold' : 'text-gray-300'}">Lý trí (T) ${pctT}%</span>
                    <span class="${typeTF === 'F' ? 'text-amber-300 font-bold' : 'text-gray-300'}">Cảm xúc (F) ${pctF}%</span>
                </div>
                <div class="w-full bg-white/10 h-1.5 rounded-full overflow-hidden flex">
                    <div class="bg-emerald-400 h-full" style="width: ${pctT}%"></div>
                    <div class="bg-rose-400 h-full" style="width: ${pctF}%"></div>
                </div>
            </div>

            <div class="bg-black/20 p-2 rounded-lg border border-purple-600/30">
                <div class="flex justify-between text-[10px] mb-1">
                    <span class="${typeJP === 'J' ? 'text-amber-300 font-bold' : 'text-gray-300'}">Nguyên tắc (J) ${pctJ}%</span>
                    <span class="${typeJP === 'P' ? 'text-amber-300 font-bold' : 'text-gray-300'}">Linh hoạt (P) ${pctP}%</span>
                </div>
                <div class="w-full bg-white/10 h-1.5 rounded-full overflow-hidden flex">
                    <div class="bg-indigo-400 h-full" style="width: ${pctJ}%"></div>
                    <div class="bg-orange-400 h-full" style="width: ${pctP}%"></div>
                </div>
            </div>
        `;
    }

    // B. YÊU CẦU 3: HUY HIỆU NGHỀ NGHIỆP ĐÍCH DANH CHỐT HẠ TỪ CÂY QUYẾT ĐỊNH 6 TẦNG
    const leafCardEl = document.getElementById('res-leaf-card');
    const leafTitleEl = document.getElementById('res-leaf-title');
    const leafDescEl = document.getElementById('res-leaf-desc');
    if (leaf) {
        if (leafCardEl) leafCardEl.classList.remove('hidden');
        if (leafTitleEl) leafTitleEl.innerText = leaf.title || leaf.hollandCode;
        if (leafDescEl) leafDescEl.innerText = `${leaf.desc} Lộ trình chiến lược: ${leaf.advice}`;
    } else {
        if (leafCardEl) leafCardEl.classList.add('hidden');
        if (leafTitleEl) leafTitleEl.innerText = masterInfo.name;
        if (leafDescEl) leafDescEl.innerText = masterInfo.desc;
    }

    // C. Phổ điểm 6 nhóm Holland RIASEC
    const barsContainer = document.getElementById('res-holland-bars');
    if (barsContainer) {
        const groupMeta = {
            "R": { name: "Thực tế & Kỹ thuật (R)", color: "from-blue-500 to-cyan-500", icon: "fa-wrench" },
            "I": { name: "Nghiên cứu & Tư duy (I)", color: "from-indigo-600 to-purple-600", icon: "fa-microchip" },
            "A": { name: "Nghệ thuật & Sáng tạo (A)", color: "from-pink-500 to-rose-500", icon: "fa-palette" },
            "S": { name: "Xã hội & Thấu hiểu (S)", color: "from-emerald-500 to-teal-500", icon: "fa-heart" },
            "E": { name: "Quản trị & Lãnh đạo (E)", color: "from-amber-500 to-orange-500", icon: "fa-bullhorn" },
            "C": { name: "Nghiệp vụ & Quy củ (C)", color: "from-slate-600 to-gray-700", icon: "fa-clipboard-check" }
        };

        barsContainer.innerHTML = sortedGroups.map(grp => {
            const meta = groupMeta[grp];
            const pct = groupPct[grp];
            const isTop = grp === top1;
            return `
                <div class="space-y-1">
                    <div class="flex justify-between items-center text-xs">
                        <span class="font-bold text-gray-700 flex items-center gap-1.5">
                            <i class="fa-solid ${meta.icon} text-[11px] ${isTop ? 'text-purple-600' : 'text-gray-400'}"></i>
                            <span class="${isTop ? 'text-purple-800 font-black' : ''}">${meta.name}</span>
                            ${isTop ? '<span class="bg-purple-100 text-purple-700 text-[10px] px-1.5 py-0.2 rounded font-black">Nổi trội nhất</span>' : ''}
                        </span>
                        <span class="font-bold text-gray-600">${pct}%</span>
                    </div>
                    <div class="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                        <div class="bg-gradient-to-r ${meta.color} h-2.5 rounded-full transition-all duration-700" style="width: ${pct}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // D. Cập nhật chi tiết kết quả
    const badgeEl = document.getElementById('res-holland-badge');
    if (badgeEl) badgeEl.innerText = `Mã Holland: ${hollandCode} • MBTI: ${mbtiKey} (${masterInfo.name.split('(')[0].trim()})`;

    const descEl = document.getElementById('res-desc');
    if (descEl) descEl.innerText = `${masterInfo.desc} Với phong cách ${mbtiInfo.name}, bạn có tiềm năng vượt trội khi đặt vào môi trường làm việc đề cao tư duy chủ động và đổi mới.`;

    // E. Lọc khối thi thực tế GDPT 2018 theo môn đã chọn
    const curSubs = window.userSubjects || ['Toán', 'Văn', 'Tiếng Anh'];
    let matched = (typeof ALL_VIETNAM_BLOCKS !== 'undefined' ? ALL_VIETNAM_BLOCKS : []).filter(block => {
        return block.subs.every(s => curSubs.includes(s));
    });

    const blocksEl = document.getElementById('res-matched-blocks');
    const noteEl = document.getElementById('res-blocks-note');
    if (blocksEl) {
        if (matched.length > 0) {
            blocksEl.innerHTML = matched.map(b => `<span class="inline-block bg-white text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-md text-xs font-black mr-1 mb-1 shadow-2xs">${b.name}</span>`).join('');
            if (noteEl) noteEl.innerText = `✓ Tuyệt vời! Bạn đang học đầy đủ các môn để xét tuyển đại học bằng các khối trên.`;
        } else {
            blocksEl.innerHTML = `<span class="text-orange-700 font-bold">${leaf ? leaf.blocks : masterInfo.blocks}</span>`;
            if (noteEl) noteEl.innerText = `💡 Khối thi đề xuất chuẩn là trên. Bạn có thể tự ôn thêm môn còn thiếu nhé!`;
        }
    }

    // F. YÊU CẦU 4: NÚT LIÊN KẾT TRỰC TIẾP SANG PHÒNG LUYỆN THI (LUYỆN ĐỀ NGAY THEO KHỐI)
    const examActionsContainer = document.getElementById('res-exam-action-buttons');
    if (examActionsContainer) {
        let subsToOffer = [];
        if (matched.length > 0) {
            const topBlock = matched[0];
            subsToOffer = topBlock.subs.filter(s => s !== 'Văn' && s !== 'Ngữ văn');
        } else if (leaf && leaf.blocks) {
            if (leaf.blocks.includes('A00') || leaf.blocks.includes('A01')) subsToOffer = ['Toán', 'Vật lí', 'Tiếng Anh'];
            else if (leaf.blocks.includes('B00')) subsToOffer = ['Toán', 'Hóa học', 'Sinh học'];
            else if (leaf.blocks.includes('C00')) subsToOffer = ['Lịch sử', 'Địa lí', 'GDKT&PL'];
            else subsToOffer = ['Toán', 'Tiếng Anh'];
        }
        if (subsToOffer.length === 0) subsToOffer = ['Toán', 'Tiếng Anh'];

        examActionsContainer.innerHTML = subsToOffer.map(subjName => {
            const subjKey = (subjName === 'Vật lý' || subjName === 'Vật lí') ? 'Vật Lí' : subjName;
            return `
                <button type="button" onclick="goToExamWithSubject('${subjKey}')" class="px-3.5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-rose-500 via-pink-600 to-orange-500 text-white shadow-sm hover:opacity-95 transition transform active:scale-95 flex items-center gap-1.5 cursor-pointer">
                    <i class="fa-solid fa-fire text-yellow-300"></i>
                    <span>🔥 Luyện đề môn ${subjKey} ngay</span>
                    <i class="fa-solid fa-arrow-right text-[10px] text-white/80"></i>
                </button>
            `;
        }).join('');
    }

    // G. YÊU CẦU 2: LỌC "NGÀNH NGHỀ GỢI Ý" & "VIỆC LÀM" KHỚP VỚI "MÔN HỌC ĐÃ CHỌN" Ở BƯỚC 1
    const hasBio = curSubs.some(s => s.includes('Sinh'));
    const hasChem = curSubs.some(s => s.includes('Hóa'));
    const hasPhysics = curSubs.some(s => s.includes('Lý') || s.includes('Lí'));
    const hasIT = curSubs.some(s => s.includes('Tin'));
    const hasTech = curSubs.some(s => s.includes('Công nghệ'));

    let finalMajors = leaf ? leaf.majors : masterInfo.majors;
    let finalJobs = leaf ? leaf.jobs : masterInfo.jobs;

    // Kiểm tra và điều chỉnh theo môn học thực tế
    if (top1 === 'I') {
        if (!hasBio && !hasChem) {
            // Không học Sinh/Hóa: Đổi Y/Dược sang Luật, Phân tích dữ liệu kinh tế, Tâm lý hoặc AI/Phần mềm
            if (hasPhysics || hasIT) {
                finalMajors = "Trí tuệ Nhân tạo & Khoa học Dữ liệu (AI & Data Science), Kỹ thuật Phần mềm, An toàn Thông tin & An ninh Mạng, Khoa học Máy tính";
                finalJobs = "Kỹ sư AI/Machine Learning, Data Scientist, Lập trình viên Fullstack, Chuyên gia An ninh mạng";
            } else {
                finalMajors = "Luật học & Pháp luật Kinh tế, Phân tích Dữ liệu Kinh tế & Xã hội, Tâm lý học Nghiên cứu, Kinh tế lượng & Thống kê";
                finalJobs = "Luật sư tranh tụng, Chuyên viên phân tích dữ liệu kinh tế, Cố vấn tâm lý học đường, Nghiên cứu viên chính sách công";
            }
        }
    } else if (top1 === 'R') {
        if (!hasPhysics && !hasIT && !hasTech) {
            if (hasBio || hasChem) {
                finalMajors = "Nông nghiệp Công nghệ cao, Công nghệ Thực phẩm & Đảm bảo Chất lượng, Kỹ thuật Môi trường & Quản lý Tài nguyên";
                finalJobs = "Kỹ sư nông nghiệp thông minh, Quản lý trang trại Hydroponics, Chuyên viên QA/QC thực phẩm, Kỹ sư môi trường";
            } else {
                finalMajors = "Quản lý Chuỗi Cung ứng & Logistics Kỹ thuật, Quản lý Đất đai & Trắc địa Bản đồ, Địa lý Ứng dụng & GIS";
                finalJobs = "Chuyên viên quản lý kho bãi & vận tải quốc tế, Kỹ sư bản đồ vệ tinh GIS, Cán bộ địa chính & quản lý tài nguyên";
            }
        }
    } else if (top1 === 'S') {
        if (!hasBio) {
            finalMajors = "Sư phạm (Toán / Ngữ văn / Tiếng Anh / Lịch sử), Quan hệ Quốc tế & Ngoại giao, Tâm lý học Lâm sàng & Trị liệu, Luật & Tư pháp, Công tác Xã hội";
            finalJobs = "Giáo viên trường THPT/quốc tế, Nhà ngoại giao, Luật sư nhân quyền, Chuyên gia tham vấn tâm lý, Cán bộ hành chính nhà nước";
        }
    }

    const majorsEl = document.getElementById('res-majors');
    if (majorsEl) majorsEl.innerText = `${finalMajors} — (Gợi ý thêm theo MBTI: ${mbtiInfo.careers})`;

    const jobsEl = document.getElementById('res-jobs');
    if (jobsEl) jobsEl.innerText = finalJobs;

    const adviceEl = document.getElementById('res-advice');
    if (adviceEl) {
        const leafAdvice = leaf ? leaf.advice : masterInfo.advice;
        adviceEl.innerText = `Lời khuyên cho ${mbtiKey} & ${hollandCode}: ${leafAdvice} Hãy luôn tự tin phát huy thế mạnh độc bản của bạn!`;
    }

    // H. Gợi ý mở rộng nhiều ngành nghề cùng khối thi (Đã lọc theo môn học)
    if (typeof EXPANDED_MAJORS_DICTIONARY !== 'undefined') {
        let expandedList = [...(EXPANDED_MAJORS_DICTIONARY[top1] || EXPANDED_MAJORS_DICTIONARY["R"])];
        if (!hasBio && !hasChem) {
            expandedList = expandedList.filter(item => {
                const lower = item.name.toLowerCase();
                return !lower.includes('y đa khoa') && !lower.includes('dược') && !lower.includes('sinh học y sinh') && !lower.includes('thú y');
            });
            if (top1 === 'I') {
                expandedList.unshift(
                    { name: "Luật học & Pháp luật Kinh tế Quốc tế", note: "Nghiên cứu văn bản luật, bảo vệ công lý và tranh tụng thương mại" },
                    { name: "Phân tích Dữ liệu Kinh tế & Kinh tế lượng", note: "Xây dựng mô hình toán kinh tế và dự báo hành vi thị trường" },
                    { name: "Tâm lý học Hành vi & Nghiên cứu Xã hội", note: "Nghiên cứu động cơ, tư duy và tâm lý cộng đồng" }
                );
            }
        }

        const expandedContainer = document.getElementById('res-expanded-majors');
        if (expandedContainer && expandedList) {
            expandedContainer.innerHTML = '';
            expandedList.forEach(item => {
                expandedContainer.innerHTML += `
                <div class="p-2.5 bg-white border border-indigo-100 rounded-lg shadow-2xs hover:border-indigo-300 transition">
                    <div class="font-bold text-indigo-900 text-xs flex items-center gap-1.5">
                        <i class="fa-solid fa-circle-check text-emerald-500 text-[10px]"></i>
                        <span>${item.name}</span>
                    </div>
                    <p class="text-[11px] text-gray-500 mt-0.5 leading-tight">${item.note}</p>
                </div>
                `;
            });
        }
    }
}

// 6. Reset về màn hình chọn môn học
function resetDecisionTree() {
    akinatorIndex = 0;
    akinatorAnswers = [];
    akinatorBranchState = {
        choice1: null,
        choice2: null,
        finalLeaf: null
    };
    document.getElementById('career-intro-screen').classList.remove('hidden');
    document.getElementById('career-tree-screen').classList.add('hidden');
    document.getElementById('career-result-screen').classList.add('hidden');
    const careerRevealLoader = document.getElementById('career-reveal-loader');
    if (careerRevealLoader) careerRevealLoader.classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Gán các hàm lên window để gọi từ HTML
window.startDecisionTree = startDecisionTree;
window.chooseDecision = chooseDecision;
window.chooseBranchOption = chooseBranchOption;
window.backDecision = backDecision;
window.resetDecisionTree = resetDecisionTree;
window.renderAkinatorQuestion = renderAkinatorQuestion;
window.finishAkinatorGame = finishAkinatorGame;
window.updateGenieExpression = updateGenieExpression;
window.goToExamWithSubject = goToExamWithSubject;

// ==============================================================================
// MODULE 4: PHÒNG LUYỆN THI TRẮC NGHIỆM GDPT 2018 - SỔ TAY HỌC ĐƯỜNG
// ==============================================================================

const EXAM_SUBJECTS = [
    { id: 'Toán', name: 'Toán Học', icon: 'fa-calculator', color: 'from-blue-500 to-indigo-600', badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'Vật Lí', name: 'Vật Lí', icon: 'fa-atom', color: 'from-cyan-500 to-blue-600', badgeColor: 'bg-cyan-100 text-cyan-800' },
    { id: 'Hóa Học', name: 'Hóa Học', icon: 'fa-flask-vial', color: 'from-emerald-500 to-teal-600', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'Sinh Học', name: 'Sinh Học', icon: 'fa-dna', color: 'from-green-500 to-emerald-600', badgeColor: 'bg-green-100 text-green-800' },
    { id: 'Lịch Sử', name: 'Lịch Sử', icon: 'fa-landmark', color: 'from-amber-500 to-orange-600', badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'Địa Lí', name: 'Địa Lí', icon: 'fa-earth-americas', color: 'from-teal-500 to-emerald-600', badgeColor: 'bg-teal-100 text-teal-800' },
    { id: 'GDKT&PL', name: 'GDKT & PL', icon: 'fa-scale-balanced', color: 'from-purple-500 to-pink-600', badgeColor: 'bg-purple-100 text-purple-800' },
    { id: 'Tiếng Anh', name: 'Tiếng Anh', icon: 'fa-language', color: 'from-rose-500 to-pink-600', badgeColor: 'bg-rose-100 text-rose-800' },
    { id: 'Tin Học', name: 'Tin Học', icon: 'fa-laptop-code', color: 'from-indigo-500 to-purple-600', badgeColor: 'bg-indigo-100 text-indigo-800' },
    { id: 'Công Nghệ', name: 'Công Nghệ', icon: 'fa-gears', color: 'from-orange-500 to-amber-600', badgeColor: 'bg-orange-100 text-orange-800' },
    { id: 'GDQP&AN', name: 'GDQP & AN', icon: 'fa-shield-halved', color: 'from-emerald-700 to-teal-800', badgeColor: 'bg-teal-100 text-teal-800' }
];

// ==============================================================================
// NGÂN HÀNG ĐỀ THI TOÀN DIỆN CHUẨN GDPT 2018 (2400+ CÂU HỎI TỪ EXAM_DATA.JS)
// Đầy đủ 10 môn học chính khóa x 3 khối lớp (10, 11, 12)
// ==============================================================================
var BUILTIN_EXAM_BANK_10 = (typeof window !== 'undefined' && window.BUILTIN_EXAM_BANK_10) || {};
var BUILTIN_EXAM_BANK_11 = (typeof window !== 'undefined' && window.BUILTIN_EXAM_BANK_11) || {};
var BUILTIN_EXAM_BANK_12 = (typeof window !== 'undefined' && window.BUILTIN_EXAM_BANK_12) || {};
var BUILTIN_EXAM_BANK = (typeof window !== 'undefined' && window.BUILTIN_EXAM_BANK) || {
    "10": BUILTIN_EXAM_BANK_10,
    "11": BUILTIN_EXAM_BANK_11,
    "12": BUILTIN_EXAM_BANK_12
};

// CÁC HỌC KỲ / KỲ THI
const EXAM_PERIODS = {
    'all': { name: 'Tất Cả Kì (Tổng Hợp)', short: 'Tổng hợp', badgeCls: 'bg-purple-100 text-purple-800' },
    'mid1': { name: 'Giữa Kì 1', short: 'Giữa Kì 1', badgeCls: 'bg-blue-100 text-blue-800' },
    'final1': { name: 'Cuối Kì 1', short: 'Cuối Kì 1', badgeCls: 'bg-emerald-100 text-emerald-800' },
    'mid2': { name: 'Giữa Kì 2', short: 'Giữa Kì 2', badgeCls: 'bg-amber-100 text-amber-800' },
    'final2': { name: 'Cuối Kì 2', short: 'Cuối Kì 2', badgeCls: 'bg-rose-100 text-rose-800' }
};

// MA TRẬN CHỦ ĐỀ / BÀI HỌC TRỌNG TÂM THEO 11 MÔN VÀ KHỐI LỚP (GDPT 2018)
const SUBJECT_TOPICS_MAP = {
    'Toán': {
        '10': ['Mệnh đề & Tập hợp', 'Bất phương trình bậc nhất hai ẩn', 'Hệ thức lượng trong tam giác', 'Véctơ & Hệ trục tọa độ Oxy', 'Thống kê & Xác suất cơ bản'],
        '11': ['Hàm số lượng giác & Phương trình lượng giác', 'Dãy số, Cấp số cộng & Cấp số nhân', 'Giới hạn & Hàm số liên tục', 'Đường thẳng & Mặt phẳng trong không gian', 'Đạo hàm & Tiếp tuyến'],
        '12': ['Ứng dụng đạo hàm khảo sát hàm số', 'Tọa độ không gian Oxyz', 'Nguyên hàm & Tích phân', 'Xác suất có điều kiện', 'Phương trình mũ & Lôgarit']
    },
    'Vật Lí': {
        '10': ['Mô tả chuyển động & Vận tốc', 'Động lực học Newton', 'Công, Năng lượng & Công suất', 'Động lượng & Va chạm', 'Chuyển động tròn đều'],
        '11': ['Dao động điều hòa', 'Sóng cơ & Giao thoa sóng', 'Điện trường & Điện thế', 'Dòng điện không đổi & Mạch điện', 'Khúc xạ ánh sáng'],
        '12': ['Vật lí nhiệt & Khí lý tưởng', 'Từ trường & Cảm ứng điện từ', 'Vật lí hạt nhân & Phóng xạ', 'Sóng điện từ & Truyền thông tin', 'Dòng điện xoay chiều']
    },
    'Hóa Học': {
        '10': ['Cấu tạo nguyên tử & Bảng tuần hoàn', 'Liên kết hóa học & Phân tử', 'Phản ứng oxi hóa - khử', 'Năng lượng hóa học (Enthalpy)', 'Tốc độ phản ứng hóa học & Halogen'],
        '11': ['Cân bằng hóa học & pH dung dịch', 'Nitrogen & Sulfur', 'Đại cương hóa học hữu cơ', 'Hydrocarbon (Alkane, Alkene, Arene)', 'Dẫn xuất Halogen, Alcohol & Phenol'],
        '12': ['Ester - Lipid & Xà phòng', 'Carbohydrate (Glucose, Saccarozo, Tinh bột)', 'Amine, Amino Acid & Protein', 'Polymer & Vật liệu mới', 'Pin điện hóa & Kim loại']
    },
    'Sinh Học': {
        '10': ['Sinh học tế bào & Thành phần hóa học', 'Cấu trúc tế bào nhân sơ & nhân thực', 'Chuyển hóa vật chất & Năng lượng', 'Phân chia tế bào (Nguyên phân, Giảm phân)', 'Vi sinh vật & Virus'],
        '11': ['Trao đổi nước & Khoáng ở thực vật', 'Quang hợp & Hô hấp ở thực vật', 'Dinh dưỡng, Hô hấp & Tuần hoàn ở động vật', 'Cảm ứng & Tập tính sinh vật', 'Sinh trưởng & Sinh sản'],
        '12': ['Cơ chế di truyền và biến dị (ADN, Đột biến)', 'Quy luật di truyền Mendel & Mở rộng', 'Di truyền học quần thể & Người', 'Tiến hóa sinh học & Thuyết tiến hóa', 'Sinh thái học & Môi trường']
    },
    'Lịch Sử': {
        '10': ['Hiện thực lịch sử và nhận thức lịch sử', 'Các nền văn minh cổ - trung đại', 'Văn minh Đông Nam Á', 'Văn minh Đại Việt', 'Cách mạng công nghiệp'],
        '11': ['Cách mạng tư sản & Chủ nghĩa tư bản', 'Chủ nghĩa xã hội & Liên Xô', 'Chiến tranh thế giới thứ nhất & thứ hai', 'Lịch sử bảo vệ chủ quyền Biển Đảo', 'Kháng chiến chống ngoại xâm'],
        '12': ['Trật tự thế giới sau Chiến tranh thế giới thứ hai', 'Cách mạng tháng Tám 1945 & Kháng chiến chống Pháp', 'Kháng chiến chống Mỹ cứu nước (1954-1975)', 'Công cuộc Đổi mới đất nước từ năm 1986', 'Lịch sử đối ngoại & ASEAN']
    },
    'Địa Lí': {
        '10': ['Bản đồ & Hệ thống thông tin địa lí (GIS)', 'Thạch quyển & Nội lực, Ngoại lực', 'Khí quyển & Khí hậu', 'Thủy quyển & Thổ nhưỡng, Sinh quyển', 'Địa lí dân cư & Kinh tế ngành'],
        '11': ['Toàn cầu hóa & Khu vực hóa kinh tế', 'Địa lí Hoa Kỳ & EU', 'Địa lí Liên Bang Nga & Nhật Bản', 'Địa lí Trung Quốc & Ấn Độ', 'Địa lí khu vực Đông Nam Á (ASEAN)'],
        '12': ['Vị trí địa lí & Thiên nhiên nhiệt đới ẩm gió mùa', 'Địa hình & Tài nguyên khoáng sản', 'Vấn đề sử dụng tài nguyên & Môi trường', 'Địa lí dân cư & Đô thị hóa', 'Chuyển dịch cơ cấu kinh tế ngành & Vùng biển đảo']
    },
    'GDKT&PL': {
        '10': ['Nền kinh tế và các chủ thể kinh tế', 'Thị trường và cơ chế thị trường', 'Thuế và ngân sách nhà nước', 'Pháp luật và đời sống', 'Bộ máy nhà nước CHXHCN Việt Nam'],
        '11': ['Cạnh tranh, cung cầu trong kinh tế thị trường', 'Lạm phát & Thất nghiệp', 'Thị trường lao động & Việc làm', 'Quyền bình đẳng của công dân', 'Quyền tự do cơ bản của công dân'],
        '12': ['Tăng trưởng & Phát triển kinh tế', 'Hội nhập kinh tế quốc tế', 'Bảo hiểm và an sinh xã hội', 'Quyền và nghĩa vụ trong hôn nhân & gia đình', 'Pháp luật về bảo vệ môi trường & Quốc phòng an ninh']
    },
    'Tiếng Anh': {
        '10': ['Family Life & Daily Routines', 'Humans and the Environment', 'Music and Arts', 'Community Service & Volunteering', 'Inventions & Modern Tech'],
        '11': ['A Long and Healthy Life', 'The Generation Gap', 'Cities of the Future', 'ASEAN and Viet Nam', 'Global Warming & Climate Change'],
        '12': ['Life Stories & Inspirational Figures', 'A Diversity of Cultures', 'The Green Movement & Artificial Intelligence', 'Urbanisation & Mega Cities', 'The World of Work & Lifelong Learning']
    },
    'Tin Học': {
        '10': ['Máy tính và xã hội tri thức', 'Mạng máy tính & Internet an toàn', 'Đạo đức, pháp luật số', 'Lập trình Python cơ bản', 'Thuật toán tìm kiếm & sắp xếp'],
        '11': ['Hệ điều hành & Ứng dụng', 'Cơ sở dữ liệu quan hệ (RDBMS)', 'Truy vấn CSDL với SQL', 'Thiết kế trang web (HTML/CSS)', 'An toàn thông tin mạng'],
        '12': ['Hệ thống mạng máy tính & TCP/IP', 'Bảo mật mạng & Tường lửa', 'Trí tuệ nhân tạo (AI) ứng dụng', 'Khoa học dữ liệu & Big Data', 'Lập trình ứng dụng số']
    },
    'Công Nghệ': {
        '10': ['Công nghệ & Đời sống kĩ thuật', 'Bản vẽ kỹ thuật & Hình chiếu', 'Vật liệu kỹ thuật & Gia công', 'Công nghệ trồng trọt & Bảo vệ thực vật', 'Nông nghiệp công nghệ cao'],
        '11': ['Cơ khí chế tạo & Động cơ đốt trong', 'Hệ thống truyền động cơ khí', 'Công nghệ chăn nuôi & Thú y', 'Thức ăn chăn nuôi & Chế biến', 'Bảo vệ môi trường nông nghiệp'],
        '12': ['Kỹ thuật điện & An toàn điện', 'Mạch điện ba pha & Máy biến áp', 'Động cơ điện & Mạng lưới điện', 'Kỹ thuật điện tử & Bán dẫn', 'Lâm nghiệp & Thủy sản công nghệ cao']
    },
    'GDQP&AN': {
        '10': ['Truyền thống đánh giặc giữ nước của dân tộc', 'Lịch sử & Nghệ thuật quân sự', 'Xây dựng lực lượng vũ trang nhân dân', 'Bảo vệ chủ quyền lãnh thổ & Biên giới', 'Kỹ thuật cấp cứu & Băng bó vết thương'],
        '11': ['Bảo vệ Tổ quốc trong tình hình mới', 'Phòng chống chiến lược "Diễn biến hòa bình"', 'Tổ chức Quân đội & Công an nhân dân', 'Kỹ thuật bắn súng tiểu liên AK', 'Bảo vệ an ninh trật tự & Phòng chống tội phạm'],
        '12': ['Đường lối quốc phòng & An ninh của Đảng', 'Nền quốc phòng toàn dân vững mạnh', 'Chiến tranh nhân dân bảo vệ Tổ quốc', 'Phòng chống vũ khí công nghệ cao', 'Chủ quyền biển đảo & Vùng trời quốc gia']
    }
};

// BIẾN TRẠNG THÁI PHÒNG LUYỆN THI
let selectedExamGrade = '12'; // '10', '11', '12', 'all'
let selectedExamPeriod = 'all'; // 'all', 'mid1', 'final1', 'mid2', 'final2'
let selectedExamTopic = 'all'; // 'all' hoặc tên chủ đề
let selectedExamSubject = 'Toán';
let selectedExamMode = 'mini'; // 'mini' (10q, 15m), 'standard' (25q, 40m), 'full' (40q, 50m)
let currentExamSubTab = 'practice'; // 'practice', 'mistakes', 'history'

// Biến trạng thái hệ thống đảo đề & mã đề
let examShuffleQuestions = true; // Bật/tắt đảo thứ tự câu hỏi
let examShuffleOptions = true;   // Bật/tắt đảo phương án A, B, C, D
let examCurrentCode = '101';     // Mã đề hiện tại (3 chữ số)
let multiCodeBatchData = null;   // Bộ dữ liệu đa mã đề & ma trận đáp án đối chiếu
let currentBatchActiveTab = 'matrix'; // Tab đang xem: 'matrix' hoặc '101', '102', ...

let activeExam = null; // Quản lý bài thi đang diễn ra
let currentReviewQuestions = []; // Danh sách câu hỏi vừa thi để review
let currentReviewFilter = 'all'; // 'all', 'wrong', 'correct'
let currentMistakeGradeFilter = 'all'; // 'all', '10', '11', '12'
let currentMistakePeriodFilter = 'all'; // 'all', 'mid1', 'final1', 'mid2', 'final2'
let currentMistakeFilter = 'all'; // 'all' hoặc tên môn

// KHỞI ĐỘNG MODULE PHÒNG THI
function initExamModule() {
    renderExamSubjectGrid();
    updateExamLobbyStats();
    renderMistakesGradeFilterChips();
    renderMistakesPeriodFilterChips();
    renderMistakesFilterChips();
    renderMistakeNotebook();
    renderExamHistory();
    selectExamGrade(selectedExamGrade);
    selectExamPeriod(selectedExamPeriod);
    renderExamTopicChips();

    // Đồng bộ trạng thái đảo đề lên giao diện
    const qToggle = document.getElementById('shuffle-questions-toggle');
    const optToggle = document.getElementById('shuffle-options-toggle');
    const codeInput = document.getElementById('current-exam-code-input');
    if (qToggle) qToggle.checked = examShuffleQuestions;
    if (optToggle) optToggle.checked = examShuffleOptions;
    if (codeInput) codeInput.value = examCurrentCode;
}

// 1. CẬP NHẬT THỐNG KÊ LOBBY
function updateExamLobbyStats() {
    const history = JSON.parse(localStorage.getItem('school_exam_history')) || [];
    const mistakes = JSON.parse(localStorage.getItem('school_mistake_notebook')) || [];

    const examCountEl = document.getElementById('stat-exam-count');
    const examAvgEl = document.getElementById('stat-exam-avg');
    const mistakeCountEl = document.getElementById('stat-mistake-count');
    const mistakeBadgeEl = document.getElementById('mistake-badge-count');

    if (examCountEl) examCountEl.innerText = history.length;
    if (mistakeCountEl) mistakeCountEl.innerText = mistakes.length;
    if (mistakeBadgeEl) mistakeBadgeEl.innerText = mistakes.length;

    if (examAvgEl) {
        if (history.length === 0) {
            examAvgEl.innerText = '--';
        } else {
            const sum = history.reduce((acc, h) => acc + (parseFloat(h.score) || 0), 0);
            const avg = (sum / history.length).toFixed(1);
            examAvgEl.innerText = avg;
        }
    }

    if (typeof updateExamTakenCountBadge === 'function') {
        updateExamTakenCountBadge();
    }
}

// 2. CHUYỂN SUB-TABS TRONG LOBBY
function setExamSubTab(subTab) {
    currentExamSubTab = subTab;
    const tabs = ['practice', 'battle', 'mistakes', 'history'];

    tabs.forEach(t => {
        const subView = document.getElementById(`sub-view-${t}`);
        const tabBtn = document.getElementById(`tab-btn-${t}`);
        if (subView) {
            if (t === subTab) subView.classList.remove('hidden');
            else subView.classList.add('hidden');
        }
        if (tabBtn) {
            if (t === subTab) {
                tabBtn.className = "flex-1 py-2 px-3 rounded-lg bg-white text-rose-600 shadow-sm transition flex items-center justify-center gap-1.5 whitespace-nowrap";
            } else {
                tabBtn.className = "flex-1 py-2 px-3 rounded-lg text-gray-600 hover:text-rose-600 transition flex items-center justify-center gap-1.5 whitespace-nowrap";
            }
        }
    });

    if (subTab === 'battle' && typeof initBattleLobbyUI === 'function') {
        initBattleLobbyUI();
    }
    if (subTab === 'mistakes') {
        renderMistakesPeriodFilterChips();
        renderMistakeNotebook();
    }
    if (subTab === 'history') renderExamHistory();
}

// 3. RENDER LƯỚI CHỌN MÔN HỌC
function renderExamSubjectGrid() {
    const grid = document.getElementById('subject-exam-grid');
    if (!grid) return;

    grid.innerHTML = EXAM_SUBJECTS.map(s => {
        const isSelected = (s.id === selectedExamSubject);
        const activeClass = isSelected
            ? 'border-2 border-rose-500 bg-rose-50 text-rose-800 shadow-sm'
            : 'border border-gray-200 bg-white hover:border-rose-300 text-gray-700';

        return `
            <button type="button" onclick="selectExamSubject('${s.id}')" class="p-3 rounded-xl flex flex-col items-center gap-1.5 transition text-center ${activeClass}">
                <div class="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br ${s.color} text-white shadow-2xs">
                    <i class="fa-solid ${s.icon} text-base"></i>
                </div>
                <span class="leading-tight text-xs">${s.name}</span>
            </button>
        `;
    }).join('');

    updateStartButtonText();
}

function selectExamSubject(subj) {
    selectedExamSubject = subj;
    selectedExamTopic = 'all'; // Đặt lại chủ đề khi đổi môn
    renderExamSubjectGrid();
    renderExamTopicChips();
    updateStartButtonText();
    if (typeof updateExamTakenCountBadge === 'function') {
        updateExamTakenCountBadge();
    }
}

function selectExamMode(mode, element) {
    selectedExamMode = mode;
    const cards = document.querySelectorAll('.exam-mode-card');
    cards.forEach(c => {
        c.classList.remove('border-rose-500', 'bg-rose-50/50');
        c.classList.add('border-gray-200');
        const title = c.querySelector('span');
        if (title) {
            title.classList.remove('text-rose-700');
            title.classList.add('text-gray-800');
        }
    });

    if (element) {
        element.classList.remove('border-gray-200');
        element.classList.add('border-2', 'border-rose-500', 'bg-rose-50/50');
        const title = element.querySelector('span');
        if (title) {
            title.classList.remove('text-gray-800');
            title.classList.add('text-rose-700');
        }
    }

    updateStartButtonText();
}

// CHỌN KHỐI LỚP
function selectExamGrade(grade) {
    selectedExamGrade = grade;
    selectedExamTopic = 'all'; // Đặt lại chủ đề khi đổi khối lớp

    const gradeBtns = {
        '10': document.getElementById('btn-grade-10'),
        '11': document.getElementById('btn-grade-11'),
        '12': document.getElementById('btn-grade-12'),
        'all': document.getElementById('btn-grade-all')
    };

    const gradeClasses = {
        '10': 'border-2 border-emerald-500 bg-emerald-50 text-emerald-900',
        '11': 'border-2 border-blue-500 bg-blue-50 text-blue-900',
        '12': 'border-2 border-rose-500 bg-rose-50 text-rose-900',
        'all': 'border-2 border-purple-500 bg-purple-50 text-purple-900'
    };

    const gradeLabels = {
        '10': 'Lớp 10 (GDPT 2018)',
        '11': 'Lớp 11 (GDPT 2018)',
        '12': 'Lớp 12 (Trọng tâm)',
        'all': 'Ôn Tốt Nghiệp THPT'
    };

    Object.keys(gradeBtns).forEach(k => {
        const btn = gradeBtns[k];
        if (btn) {
            btn.className = "grade-btn py-3 px-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition flex items-center justify-center gap-2";
            if (k === grade) {
                btn.className = `grade-btn py-3 px-3 rounded-xl ${gradeClasses[k]} shadow-xs transition flex items-center justify-center gap-2`;
            }
        }
    });

    const badge = document.getElementById('selected-grade-badge');
    if (badge) {
        badge.innerText = gradeLabels[grade] || 'Lớp 12 (Trọng tâm)';
        if (grade === '10') badge.className = "text-xs bg-emerald-100 text-emerald-800 font-black px-2.5 py-0.5 rounded-full";
        else if (grade === '11') badge.className = "text-xs bg-blue-100 text-blue-800 font-black px-2.5 py-0.5 rounded-full";
        else if (grade === '12') badge.className = "text-xs bg-rose-100 text-rose-800 font-black px-2.5 py-0.5 rounded-full";
        else badge.className = "text-xs bg-purple-100 text-purple-800 font-black px-2.5 py-0.5 rounded-full";
    }

    renderExamTopicChips();
    updateStartButtonText();
}

// CHỌN KỲ THI / HỌC KỲ
function selectExamPeriod(period) {
    selectedExamPeriod = period;

    const periods = ['all', 'mid1', 'final1', 'mid2', 'final2'];
    const periodClasses = {
        'all': 'border-2 border-purple-500 bg-purple-50 text-purple-900 shadow-2xs',
        'mid1': 'border-2 border-blue-500 bg-blue-50 text-blue-900 shadow-2xs',
        'final1': 'border-2 border-emerald-500 bg-emerald-50 text-emerald-900 shadow-2xs',
        'mid2': 'border-2 border-amber-500 bg-amber-50 text-amber-900 shadow-2xs',
        'final2': 'border-2 border-rose-500 bg-rose-50 text-rose-900 shadow-2xs'
    };

    periods.forEach(p => {
        const btn = document.getElementById(`btn-period-${p}`);
        if (btn) {
            if (p === period) {
                btn.className = `period-btn py-2.5 px-2 rounded-xl ${periodClasses[p]} transition flex items-center justify-center gap-1.5`;
            } else {
                btn.className = `period-btn py-2.5 px-2 rounded-xl border border-gray-200 bg-white hover:border-gray-300 text-gray-700 transition flex items-center justify-center gap-1.5`;
            }
        }
    });

    const badge = document.getElementById('selected-period-badge');
    if (badge) {
        const pInfo = EXAM_PERIODS[period] || EXAM_PERIODS['all'];
        badge.innerText = pInfo.name;
        badge.className = `text-xs ${pInfo.badgeCls || 'bg-purple-100 text-purple-800'} font-black px-2.5 py-0.5 rounded-full`;
    }

    updateStartButtonText();
}

// LẤY DANH SÁCH CHỦ ĐỀ / BÀI HỌC CHO MÔN & KHỐI ĐÃ CHỌN
function getTopicsForCurrentSelection() {
    let list = [];
    const grade = selectedExamGrade;
    const subj = selectedExamSubject;

    if (SUBJECT_TOPICS_MAP[subj]) {
        if (grade === 'all') {
            ['12', '11', '10'].forEach(g => {
                if (SUBJECT_TOPICS_MAP[subj][g]) {
                    list.push(...SUBJECT_TOPICS_MAP[subj][g]);
                }
            });
        } else if (SUBJECT_TOPICS_MAP[subj][grade]) {
            list = [...SUBJECT_TOPICS_MAP[subj][grade]];
        }
    }

    // Thu thập thêm các topic có trong ngân hàng đề thực tế
    let pool = [];
    if (grade === 'all') {
        const b12 = (BUILTIN_EXAM_BANK['12'] && BUILTIN_EXAM_BANK['12'][subj]) || [];
        const b11 = (BUILTIN_EXAM_BANK['11'] && BUILTIN_EXAM_BANK['11'][subj]) || [];
        const b10 = (BUILTIN_EXAM_BANK['10'] && BUILTIN_EXAM_BANK['10'][subj]) || [];
        pool = [...b12, ...b11, ...b10];
    } else {
        const gBank = BUILTIN_EXAM_BANK[grade];
        pool = (gBank && gBank[subj]) ? gBank[subj] : [];
    }

    pool.forEach(q => {
        if (q.topic && !list.includes(q.topic)) {
            list.push(q.topic);
        }
    });

    return Array.from(new Set(list));
}

// RENDER CHIPS CHỌN CHỦ ĐỀ / BÀI HỌC
function renderExamTopicChips() {
    const container = document.getElementById('exam-topic-chips-container');
    if (!container) return;

    const topics = getTopicsForCurrentSelection();
    const isAllSelected = (selectedExamTopic === 'all');

    let html = `
        <button type="button" onclick="selectExamTopic('all')" class="px-3 py-1.5 rounded-xl whitespace-nowrap transition text-xs font-bold shrink-0 ${isAllSelected ? 'bg-indigo-600 text-white shadow-xs' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}">
            <i class="fa-solid fa-layer-group mr-1"></i> Tất cả bài học
        </button>
    `;

    topics.forEach((top, idx) => {
        const isSel = (selectedExamTopic === top);
        const cls = isSel 
            ? 'bg-indigo-600 text-white shadow-xs font-black' 
            : 'bg-indigo-50/80 hover:bg-indigo-100 text-indigo-900 font-medium border border-indigo-200';

        html += `
            <button type="button" onclick="selectExamTopicByIndex(${idx})" class="px-3 py-1.5 rounded-xl whitespace-nowrap transition text-xs shrink-0 ${cls}">
                ${top}
            </button>
        `;
    });

    container.innerHTML = html;

    const topicBadge = document.getElementById('selected-topic-badge');
    if (topicBadge) {
        topicBadge.innerText = (selectedExamTopic === 'all') ? 'Tất cả bài học' : selectedExamTopic;
        topicBadge.title = (selectedExamTopic === 'all') ? 'Tất cả bài học' : selectedExamTopic;
    }
}

function selectExamTopicByIndex(idx) {
    const topics = getTopicsForCurrentSelection();
    if (idx >= 0 && idx < topics.length) {
        selectExamTopic(topics[idx]);
    }
}

function selectExamTopic(topicId) {
    selectedExamTopic = topicId;
    renderExamTopicChips();
    updateStartButtonText();
}

// Lấy danh sách câu hỏi phù hợp với bộ lọc hiện tại (áp dụng thuật toán phân tầng ưu tiên để luôn đảm bảo đủ số lượng câu hỏi theo đúng chế độ thi)
function getFilteredExamPool(targetCount = 10) {
    const subj = selectedExamSubject;
    const grade = selectedExamGrade;
    const period = selectedExamPeriod;
    const topic = selectedExamTopic;

    // Helper: lấy câu hỏi của một môn từ một khối lớp cụ thể (không phân biệt hoa thường)
    function getQuestionsFor(g, s) {
        const bank = BUILTIN_EXAM_BANK[g];
        if (!bank) return [];
        if (bank[s]) return bank[s];
        const normS = (s || '').toLowerCase().trim();
        const foundKey = Object.keys(bank).find(k => k.toLowerCase().trim() === normS);
        if (foundKey && bank[foundKey]) return bank[foundKey];
        return [];
    }

    // Helper kiểm tra câu hỏi có khớp topic không
    function matchTopic(q, targetTop) {
        if (!targetTop || targetTop === 'all') return true;
        if (!q.topic) return false;
        const qTop = q.topic.toLowerCase().trim();
        const tTop = targetTop.toLowerCase().trim();
        if (qTop === tTop) return true;
        if (qTop.includes(tTop) || tTop.includes(qTop)) return true;

        // Từ khóa chuyên sâu Toán học
        if (tTop.includes('lượng giác') && qTop.includes('lượng giác')) return true;
        if (tTop.includes('đạo hàm') && qTop.includes('đạo hàm')) return true;
        if (tTop.includes('nguyên hàm') && (qTop.includes('nguyên hàm') || qTop.includes('tích phân'))) return true;
        if (tTop.includes('tích phân') && (qTop.includes('tích phân') || qTop.includes('nguyên hàm'))) return true;
        if (tTop.includes('cấp số') && qTop.includes('cấp số')) return true;
        if (tTop.includes('giới hạn') && qTop.includes('giới hạn')) return true;
        if (tTop.includes('mũ') && (qTop.includes('mũ') || qTop.includes('lôgarit'))) return true;
        if (tTop.includes('oxyz') && qTop.includes('oxyz')) return true;
        if (tTop.includes('không gian') && qTop.includes('không gian')) return true;
        if (tTop.includes('mệnh đề') && qTop.includes('mệnh đề')) return true;
        if (tTop.includes('tập hợp') && qTop.includes('tập hợp')) return true;
        if (tTop.includes('bất phương trình') && qTop.includes('bất phương trình')) return true;
        if (tTop.includes('thống kê') && qTop.includes('thống kê')) return true;
        if (tTop.includes('xác suất') && qTop.includes('xác suất')) return true;
        if (tTop.includes('vectơ') && (qTop.includes('vectơ') || qTop.includes('véctơ'))) return true;

        // Từ khóa chuyên sâu Vật Lí
        if (tTop.includes('dao động') && qTop.includes('dao động')) return true;
        if (tTop.includes('sóng') && (qTop.includes('sóng') || qTop.includes('giao thoa'))) return true;
        if (tTop.includes('điện trường') && (qTop.includes('điện trường') || qTop.includes('coulomb') || qTop.includes('điện thế'))) return true;
        if (tTop.includes('dòng điện') && qTop.includes('dòng điện')) return true;
        if (tTop.includes('khúc xạ') && (qTop.includes('khúc xạ') || qTop.includes('quang hình'))) return true;
        if (tTop.includes('nhiệt') && (qTop.includes('nhiệt') || qTop.includes('khí lý tưởng'))) return true;
        if (tTop.includes('từ trường') && (qTop.includes('từ trường') || qTop.includes('cảm ứng'))) return true;
        if (tTop.includes('hạt nhân') && (qTop.includes('hạt nhân') || qTop.includes('phóng xạ'))) return true;
        if (tTop.includes('chuyển động') && (qTop.includes('chuyển động') || qTop.includes('vận tốc'))) return true;
        if (tTop.includes('newton') && (qTop.includes('newton') || qTop.includes('động lực học'))) return true;
        if (tTop.includes('năng lượng') && (qTop.includes('công') || qTop.includes('năng lượng'))) return true;
        if (tTop.includes('động lượng') && (qTop.includes('động lượng') || qTop.includes('va chạm'))) return true;

        // Từ khóa chuyên sâu Hóa Học
        if (tTop.includes('nguyên tử') && (qTop.includes('nguyên tử') || qTop.includes('tuần hoàn'))) return true;
        if (tTop.includes('liên kết') && qTop.includes('liên kết')) return true;
        if (tTop.includes('oxi hóa') && (qTop.includes('oxi hóa') || qTop.includes('khử'))) return true;
        if (tTop.includes('enthalpy') && (qTop.includes('enthalpy') || qTop.includes('năng lượng'))) return true;
        if (tTop.includes('cân bằng') || tTop.includes('ph')) {
            if (qTop.includes('cân bằng') || qTop.includes('ph') || qTop.includes('le chatelier') || qTop.includes('điện li') || qTop.includes('brønsted')) return true;
        }
        if (tTop.includes('nitrogen') || tTop.includes('sulfur')) {
            if (qTop.includes('nitrogen') || qTop.includes('sulfur') || qTop.includes('ammonia') || qTop.includes('nitric') || qTop.includes('sulfuric') || qTop.includes('phú dưỡng')) return true;
        }
        if (tTop.includes('đại cương') || tTop.includes('hóa học hữu cơ')) {
            if (qTop.includes('đại cương') || qTop.includes('hữu cơ') || qTop.includes('nhóm chức') || qTop.includes('phổ ir') || qTop.includes('đồng phân') || qTop.includes('tinh chế')) return true;
        }
        if (tTop.includes('hydrocarbon') || tTop.includes('alkane') || tTop.includes('alkene') || tTop.includes('arene')) {
            if (qTop.includes('hydrocarbon') || qTop.includes('alkane') || qTop.includes('alkene') || qTop.includes('arene') || qTop.includes('alkyne') || qTop.includes('benzene') || qTop.includes('toluene')) return true;
        }
        if (tTop.includes('halogen') || tTop.includes('alcohol') || tTop.includes('phenol')) {
            if (qTop.includes('halogen') || qTop.includes('alcohol') || qTop.includes('phenol') || qTop.includes('rượu') || qTop.includes('ethanol') || qTop.includes('glycerol')) return true;
        }
        if (tTop.includes('ester') && (qTop.includes('ester') || qTop.includes('lipid') || qTop.includes('xà phòng'))) return true;
        if (tTop.includes('carbohydrate') && (qTop.includes('carbohydrate') || qTop.includes('glucose') || qTop.includes('tinh bột'))) return true;
        if (tTop.includes('amine') && (qTop.includes('amine') || qTop.includes('amino') || qTop.includes('protein'))) return true;
        if (tTop.includes('polymer') && qTop.includes('polymer')) return true;
        if (tTop.includes('pin') && (qTop.includes('pin') || qTop.includes('kim loại') || qTop.includes('điện phân'))) return true;

        // Từ khóa chuyên sâu Sinh Học
        if (tTop.includes('nước') || tTop.includes('khoáng') || tTop.includes('rễ') || tTop.includes('mạch gỗ') || tTop.includes('thoát hơi nước')) {
            if (qTop.includes('nước') || qTop.includes('khoáng') || qTop.includes('rễ') || qTop.includes('thoát hơi') || qTop.includes('thực vật')) return true;
        }
        if (tTop.includes('quang hợp') || tTop.includes('hô hấp ở thực vật')) {
            if (qTop.includes('quang hợp') || qTop.includes('hô hấp') || qTop.includes('thực vật') || qTop.includes('calvin')) return true;
        }
        if (tTop.includes('dinh dưỡng') || tTop.includes('tuần hoàn') || tTop.includes('tiêu hóa') || tTop.includes('hô hấp ở động vật')) {
            if (qTop.includes('dinh dưỡng') || qTop.includes('tuần hoàn') || qTop.includes('tiêu hóa') || qTop.includes('hô hấp') || qTop.includes('động vật') || qTop.includes('tim') || qTop.includes('máu')) return true;
        }
        if (tTop.includes('cảm ứng') || tTop.includes('tập tính')) {
            if (qTop.includes('cảm ứng') || qTop.includes('tập tính') || qTop.includes('hướng động') || qTop.includes('synap') || qTop.includes('phản xạ')) return true;
        }
        if (tTop.includes('sinh trưởng') || tTop.includes('sinh sản')) {
            if (qTop.includes('sinh trưởng') || qTop.includes('sinh sản') || qTop.includes('mô phân sinh') || qTop.includes('thụ tinh') || qTop.includes('biến thái')) return true;
        }

        return false;
    }

    // Helper xáo trộn mảng ngẫu nhiên (Fisher-Yates)
    function shuffleArray(arr) {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    // 1. Phân lập nguồn câu hỏi theo Khối lớp (TUYỆT ĐỐI KHÔNG trộn các khối lớp khác khi đã chọn lớp cụ thể)
    let primaryGrades = [];
    if (grade === 'all') {
        primaryGrades = ['12', '11', '10'];
    } else {
        primaryGrades = [grade];
    }

    let primaryList = [];
    primaryGrades.forEach(g => {
        primaryList.push(...getQuestionsFor(g, subj));
    });

    // Chỉ dự phòng sang khối khác khi khối lớp được chọn hoàn toàn không có câu hỏi môn này trong DB
    if (primaryList.length === 0) {
        const fallbackGrades = (grade === 'all') ? [] : ['12', '11', '10'].filter(g => g !== grade);
        fallbackGrades.forEach(g => {
            primaryList.push(...getQuestionsFor(g, subj));
        });
        if (primaryList.length === 0) {
            primaryList = (BUILTIN_EXAM_BANK['12'] && BUILTIN_EXAM_BANK['12']['Toán']) || [];
        }
    }

    // 2. Thuật toán phân bổ câu hỏi theo Chuyên đề (Topic) & Học kỳ (Period)
    let pool = [];

    if (topic && topic !== 'all') {
        // NGƯỜI DÙNG CHỌN CHUYÊN ĐỀ CỤ THỂ
        // Lọc toàn bộ câu hỏi thuộc đúng chuyên đề đã chọn
        const matchedTopic = primaryList.filter(q => matchTopic(q, topic));

        if (matchedTopic.length > 0) {
            if (period !== 'all') {
                const tier1 = matchedTopic.filter(q => q.period === period || q.period === 'all');
                const tier2 = matchedTopic.filter(q => q.period !== period && q.period !== 'all');

                pool.push(...shuffleArray(tier1));
                if (pool.length < targetCount) {
                    pool.push(...shuffleArray(tier2));
                }
            } else {
                // Tất cả các kỳ -> lấy toàn bộ câu hỏi của chuyên đề này
                pool.push(...shuffleArray(matchedTopic));
            }
            // TUYỆT ĐỐI KHÔNG thêm câu hỏi chuyên đề khác hoặc khối khác vào đề thi khi đã chọn chuyên đề cụ thể!
        } else {
            // Dự phòng: nếu từ khóa chuyên đề chưa khớp câu hỏi nào trong DB
            if (period !== 'all') {
                const t1 = primaryList.filter(q => q.period === period || q.period === 'all');
                const t2 = primaryList.filter(q => q.period !== period && q.period !== 'all');
                pool.push(...shuffleArray(t1));
                if (pool.length < targetCount) {
                    pool.push(...shuffleArray(t2));
                }
            } else {
                pool.push(...shuffleArray(primaryList));
            }
        }
    } else {
        // NGƯỜI DÙNG CHỌN "TẤT CẢ BÀI HỌC"
        if (period !== 'all') {
            const tier1 = primaryList.filter(q => q.period === period || q.period === 'all');
            const tier2 = primaryList.filter(q => q.period !== period && q.period !== 'all');

            pool.push(...shuffleArray(tier1));
            if (pool.length < targetCount) {
                pool.push(...shuffleArray(tier2));
            }
        } else {
            pool.push(...shuffleArray(primaryList));
        }
    }

    // 3. Khử trùng lặp câu hỏi theo nội dung và ID
    const uniquePool = [];
    const seenContent = new Set();
    const seenIds = new Set();

    for (const q of pool) {
        if (!q || !q.content) continue;
        const normContent = q.content.toString().trim().toLowerCase().replace(/\s+/g, ' ');
        const qId = q.id ? String(q.id) : '';
        if (!seenContent.has(normContent) && (!qId || !seenIds.has(qId))) {
            seenContent.add(normContent);
            if (qId) seenIds.add(qId);
            uniquePool.push(q);
        }
    }

    return uniquePool;
}

function updateStartButtonText() {
    const btnText = document.getElementById('btn-start-exam-text');
    if (!btnText) return;

    let targetCount = 10;
    if (selectedExamMode === 'standard') targetCount = 25;
    if (selectedExamMode === 'full') targetCount = 40;

    let gradeText = "LỚP 12";
    if (selectedExamGrade === '10') gradeText = "LỚP 10";
    else if (selectedExamGrade === '11') gradeText = "LỚP 11";
    else if (selectedExamGrade === 'all') gradeText = "TỐT NGHIỆP THPT";

    let periodText = "";
    if (selectedExamPeriod !== 'all' && EXAM_PERIODS[selectedExamPeriod]) {
        periodText = ` - ${EXAM_PERIODS[selectedExamPeriod].short.toUpperCase()}`;
    }

    let topicText = "";
    if (selectedExamTopic !== 'all') {
        topicText = ` • ${selectedExamTopic.length > 25 ? selectedExamTopic.substring(0, 22) + '...' : selectedExamTopic}`;
    }

    const availablePool = getFilteredExamPool(targetCount);
    const actualCount = Math.min(targetCount, availablePool.length > 0 ? availablePool.length : targetCount);

    btnText.innerText = `BẮT ĐẦU LÀM BÀI THI ${gradeText}${periodText} - ${selectedExamSubject.toUpperCase()}${topicText} (${actualCount} CÂU)`;
}

// HÀM QUẢN LÝ MÃ ĐỀ & CƠ CHẾ ĐẢO ĐỀ
function setExamCustomCode(val) {
    if (!val) val = '101';
    examCurrentCode = val.toString().trim().toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 6) || '101';
    const inputEl = document.getElementById('current-exam-code-input');
    if (inputEl) inputEl.value = examCurrentCode;
}

function randomizeExamCode() {
    // Tạo ngẫu nhiên 3 chữ số từ 101 đến 999
    const randomNum = Math.floor(Math.random() * 899) + 101;
    setExamCustomCode(randomNum.toString());
}

function toggleShuffleOption(type, checked) {
    if (type === 'questions') {
        examShuffleQuestions = !!checked;
    } else if (type === 'options') {
        examShuffleOptions = !!checked;
    }
}

// Thuật toán đảo phương án trắc nghiệm A, B, C, D & Ánh xạ lại đáp án đúng 100% chuẩn xác (có chống trùng đáp án liên tiếp)
function scrambleQuestionOptions(originalQuestion, shouldShuffle = true, forbiddenLetter = null) {
    const rawOptions = originalQuestion.options || [];
    const origCorrect = (originalQuestion.correct || 'A').toUpperCase().trim();

    if (!shouldShuffle || !Array.isArray(rawOptions) || rawOptions.length < 2) {
        return {
            options: [...rawOptions],
            correct: origCorrect
        };
    }

    const letters = ['A', 'B', 'C', 'D'];

    // 1. Phân tích từng phương án, giữ nguyên toàn bộ nội dung (bao gồm dấu âm, công thức, số)
    const parsed = rawOptions.map((opt, idx) => {
        const letterMatch = opt.match(/^\s*([A-D])[.:)]\s*|^\s*([A-D])\s+/i);
        const origLetter = letterMatch ? (letterMatch[1] || letterMatch[2]).toUpperCase() : letters[idx];
        const cleanText = opt.replace(/^\s*[A-D][.:)]\s*|^\s*[A-D]\s+/i, '').trim();
        return {
            origLetter: origLetter,
            text: cleanText,
            full: opt
        };
    });

    // 2. Định vị phương án đúng ban đầu
    let correctItem = parsed.find(p => p.origLetter === origCorrect);
    if (!correctItem && parsed.length > 0) {
        correctItem = parsed[0];
    }

    // 3. Đảo ngẫu nhiên mảng phương án (Fisher-Yates)
    const shuffled = [...parsed];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // 4. Áp dụng quy tắc chống trùng đáp án (nếu 2 câu trước đã cùng đáp án forbiddenLetter)
    let correctIdx = shuffled.indexOf(correctItem);
    let candidateLetter = letters[correctIdx] || 'A';

    if (forbiddenLetter && candidateLetter === forbiddenLetter && shuffled.length > 1) {
        const swapCandidates = [];
        for (let idx = 0; idx < shuffled.length; idx++) {
            if (idx !== correctIdx) swapCandidates.push(idx);
        }
        if (swapCandidates.length > 0) {
            const swapIdx = swapCandidates[Math.floor(Math.random() * swapCandidates.length)];
            const temp = shuffled[correctIdx];
            shuffled[correctIdx] = shuffled[swapIdx];
            shuffled[swapIdx] = temp;
            correctIdx = swapIdx;
            candidateLetter = letters[correctIdx] || 'A';
        }
    }

    // 5. Gán lại nhãn chữ cái A, B, C, D mới và cập nhật vị trí đáp án đúng
    const newOptions = shuffled.map((item, newIdx) => {
        const newLetter = letters[newIdx] || String.fromCharCode(65 + newIdx);
        return `${newLetter}. ${item.text}`;
    });

    return {
        options: newOptions,
        correct: candidateLetter
    };
}

// 4. BẮT ĐẦU BÀI THI ĐÃ CHỌN TỪ LOBBY
function startSelectedExam() {
    let targetCount = 10;
    let durationMins = 15;

    if (selectedExamMode === 'standard') {
        targetCount = 25;
        durationMins = 40;
    } else if (selectedExamMode === 'full') {
        targetCount = 40;
        durationMins = 50;
    }

    const uniquePool = getFilteredExamPool(targetCount);
    const grade = selectedExamGrade;

    const gradeLabelMap = {
        '10': 'Lớp 10',
        '11': 'Lớp 11',
        '12': 'Lớp 12',
        'all': 'Tốt Nghiệp THPT'
    };
    const gradeLabel = gradeLabelMap[grade] || 'Lớp 12';
    const periodLabel = EXAM_PERIODS[selectedExamPeriod] ? EXAM_PERIODS[selectedExamPeriod].name : 'Tổng hợp';
    const topicLabel = (selectedExamTopic === 'all') ? '' : ` • ${selectedExamTopic}`;

    // Xáo trộn & tạo câu hỏi với cơ chế Đảo đề & Quản lý Mã đề
    const questions = generateExamQuestions(uniquePool, targetCount, selectedExamSubject, gradeLabel, selectedExamPeriod, selectedExamTopic, {
        shuffleQuestions: examShuffleQuestions,
        shuffleOptions: examShuffleOptions,
        examCode: examCurrentCode || '101'
    });
    
    const actualQCount = questions.length;
    if (selectedExamMode === 'mini') {
        durationMins = 15;
    } else if (selectedExamMode === 'standard') {
        durationMins = 40;
    } else if (selectedExamMode === 'full') {
        durationMins = 50;
    } else {
        durationMins = Math.max(5, Math.round(actualQCount * 1.5));
    }

    setupAndStartExam(
        `Đề Thi ${gradeLabel} - ${periodLabel} - ${selectedExamSubject}${topicLabel} (${actualQCount} câu)`,
        selectedExamSubject,
        questions,
        durationMins,
        grade,
        selectedExamPeriod,
        selectedExamTopic,
        examCurrentCode || '101'
    );
}

// ==============================================================================
// CÁC HÀM XỬ LÝ LOGIC THI NÂNG CAO THEO 3 YÊU CẦU:
// 1. Trộn mảng trước khi cắt (Tránh trùng trong cùng 1 đề)
// 2. Lưu lịch sử ID vào localStorage (Tránh trùng giữa các lần làm đề)
// 3. Lọc bỏ câu bị trùng nội dung trong Data theo mặt chữ (Chuẩn hóa câu chữ)
// ==============================================================================

const EXAM_TAKEN_IDS_STORAGE_KEY = 'taken_exam_question_ids';

// 3. Lọc bỏ câu bị trùng nội dung trong Data theo mặt chữ
function filterDuplicateQuestionsByText(questions) {
    if (!Array.isArray(questions)) return [];
    const seenTexts = new Set();
    return questions.filter(q => {
        if (!q || !q.content) return false;
        // Chuẩn hóa mặt chữ: viết thường, thu gọn khoảng trắng thừa
        const norm = q.content.toString().trim().toLowerCase().replace(/\s+/g, ' ');
        if (!norm || seenTexts.has(norm)) return false;
        seenTexts.add(norm);
        return true;
    });
}

// 2. Quản lý lịch sử ID câu hỏi đã làm trong localStorage
function getTakenExamQuestionIds() {
    try {
        const stored = localStorage.getItem(EXAM_TAKEN_IDS_STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) return parsed.map(String);
        }
    } catch (e) {
        console.warn("Lỗi đọc taken_exam_question_ids:", e);
    }
    return [];
}

function saveTakenExamQuestionIds(newIds) {
    if (!newIds || !newIds.length) return;
    try {
        const current = getTakenExamQuestionIds();
        const updated = Array.from(new Set([...current, ...newIds.map(String)]));
        localStorage.setItem(EXAM_TAKEN_IDS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
        console.warn("Lỗi lưu taken_exam_question_ids:", e);
    }
}

function getTakenQuestionsCountForSubject(subj = null) {
    const takenIds = getTakenExamQuestionIds();
    if (!subj) return takenIds.length;
    let subjIds = new Set();
    if (typeof BUILTIN_EXAM_BANK !== 'undefined') {
        ['10', '11', '12'].forEach(g => {
            if (BUILTIN_EXAM_BANK[g] && BUILTIN_EXAM_BANK[g][subj]) {
                BUILTIN_EXAM_BANK[g][subj].forEach(q => {
                    if (q && q.id) subjIds.add(String(q.id));
                });
            }
        });
    }
    return takenIds.filter(id => subjIds.has(String(id))).length;
}

function resetTakenExamHistory(subject = null) {
    try {
        if (!subject) {
            localStorage.removeItem(EXAM_TAKEN_IDS_STORAGE_KEY);
        } else {
            let takenIds = getTakenExamQuestionIds();
            let subjIds = new Set();
            if (typeof BUILTIN_EXAM_BANK !== 'undefined') {
                ['10', '11', '12'].forEach(g => {
                    if (BUILTIN_EXAM_BANK[g] && BUILTIN_EXAM_BANK[g][subject]) {
                        BUILTIN_EXAM_BANK[g][subject].forEach(q => {
                            if (q && q.id) subjIds.add(String(q.id));
                        });
                    }
                });
            }
            takenIds = takenIds.filter(id => !subjIds.has(String(id)));
            localStorage.setItem(EXAM_TAKEN_IDS_STORAGE_KEY, JSON.stringify(takenIds));
        }
        updateExamTakenCountBadge();
        updateStartButtonText();
        const msg = `Đã làm mới ngân hàng câu hỏi${subject ? ' môn ' + subject : ''}! Bạn có thể bắt đầu làm lại từ đầu.`;
        if (typeof showToast === 'function') {
            showToast(msg, 'success');
        } else {
            alert(msg);
        }
    } catch (e) {
        console.warn("Lỗi reset lịch sử câu đã làm:", e);
    }
}

function updateExamTakenCountBadge() {
    const badgeEl = document.getElementById('exam-taken-count');
    if (!badgeEl) return;
    const count = getTakenQuestionsCountForSubject(selectedExamSubject);
    badgeEl.innerText = count;
}

// Thuật toán chọn câu hỏi DUY NHẤT & ĐẢO ĐỀ TOÀN DIỆN (Đã tối ưu theo 3 yêu cầu cốt lõi)
function generateExamQuestions(sourceBank, targetCount, subjectName, defaultGrade, defaultPeriod = 'all', defaultTopic = 'all', customOptions = {}) {
    if (!sourceBank || sourceBank.length === 0) return [];

    const shouldShuffleQuestions = (customOptions.shuffleQuestions !== undefined) 
        ? customOptions.shuffleQuestions 
        : examShuffleQuestions;
    const shouldShuffleOptions = (customOptions.shuffleOptions !== undefined) 
        ? customOptions.shuffleOptions 
        : examShuffleOptions;
    const examCode = customOptions.examCode || examCurrentCode || '101';

    // --------------------------------------------------------------------------
    // 3. LỌC BỎ CÂU BỊ TRÙNG NỘI DUNG TRONG DATA (Nếu file gốc bị lặp theo mặt chữ)
    // --------------------------------------------------------------------------
    const cleanBank = filterDuplicateQuestionsByText(sourceBank);

    // --------------------------------------------------------------------------
    // 2. LƯU LỊCH SỬ ID VÀO LOCALSTORAGE (Tránh trùng giữa các lần làm đề)
    // --------------------------------------------------------------------------
    let takenIds = getTakenExamQuestionIds();
    const takenSet = new Set(takenIds);

    // Né các câu hỏi đã làm ở các đề thi trước
    let availablePool = cleanBank.filter(q => q && q.id && !takenSet.has(String(q.id)));

    // Xử lý tự động làm mới chu kỳ khi số câu chưa làm không còn đủ để tạo đề:
    const neededCount = Math.min(targetCount, cleanBank.length);
    if (availablePool.length < neededCount) {
        console.log(`[Exam Generator] Đã luyện hết ngân hàng câu hỏi môn ${subjectName} (${availablePool.length}/${neededCount} câu mới còn lại). Tự động làm mới chu kỳ câu hỏi.`);
        
        // Loại bỏ các ID thuộc danh sách này khỏi danh sách đã làm để bắt đầu chu kỳ mới
        const currentSubjIds = new Set(cleanBank.map(q => String(q.id)));
        takenIds = takenIds.filter(id => !currentSubjIds.has(id));
        localStorage.setItem(EXAM_TAKEN_IDS_STORAGE_KEY, JSON.stringify(takenIds));
        
        // Sử dụng lại toàn bộ ngân hàng câu hỏi sạch
        availablePool = cleanBank;
    }

    // --------------------------------------------------------------------------
    // 1. TRỘN MẢNG TRƯỚC KHI CẮT (Tránh trùng trong cùng 1 đề)
    // Thay vì lấy ngẫu nhiên từng câu trong vòng lặp, ta xáo trộn toàn bộ danh sách
    // câu hỏi tìm được rồi mới cắt lấy số lượng cần dùng (Fisher-Yates)
    // --------------------------------------------------------------------------
    let candidatePool = [...availablePool];
    if (shouldShuffleQuestions) {
        for (let i = candidatePool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [candidatePool[i], candidatePool[j]] = [candidatePool[j], candidatePool[i]];
        }
    }

    const finalCount = Math.min(targetCount, candidatePool.length);
    const selected = candidatePool.slice(0, finalCount);

    // Lưu lại mã ID của các câu vừa chọn vào localStorage để né cho các lần thi tiếp theo
    try {
        const newlySelectedIds = selected.map(q => String(q.id || q.masterId)).filter(Boolean);
        saveTakenExamQuestionIds(newlySelectedIds);
        updateExamTakenCountBadge();
    } catch (e) {
        console.warn("Lỗi lưu ID câu hỏi đã chọn:", e);
    }

    // 2. Chuyển đổi và đảo phương án A, B, C, D (nếu bật toggle)
    let result = [];
    for (let i = 0; i < selected.length; i++) {
        const original = selected[i];
        const qGrade = original.grade 
            ? (original.grade.toString().startsWith('Lớp') ? original.grade : `Lớp ${original.grade}`) 
            : (defaultGrade || 'Lớp 12');
        
        const qPeriod = original.period || (defaultPeriod !== 'all' ? defaultPeriod : 'all');
        const qTopic = original.topic || 'Tổng hợp bài học';

        // Đảo phương án và ánh xạ lại đáp án đúng (chống trùng đáp án liên tiếp <= 2 câu)
        let forbiddenLetter = null;
        if (result.length >= 2) {
            const p1 = result[result.length - 1].correct;
            const p2 = result[result.length - 2].correct;
            if (p1 && p1 === p2) {
                forbiddenLetter = p1;
            }
        }
        const scrambled = scrambleQuestionOptions(original, shouldShuffleOptions, forbiddenLetter);

        result.push({
            id: original.id || `q_${i + 1}`,
            masterId: original.id || `q_orig_${i + 1}`,
            num: i + 1,
            examCode: examCode,
            grade: qGrade,
            period: qPeriod,
            topic: qTopic,
            subject: subjectName,
            content: original.content,
            options: scrambled.options,
            correct: scrambled.correct,
            explanation: original.explanation,
            originalOptions: original.options ? [...original.options] : [],
            originalCorrect: original.correct
        });
    }

    return result;
}

// 5. THIẾT LẬP VÀ MỞ PHÒNG THI
function setupAndStartExam(title, subject, questionList, durationMinutes, grade = '12', period = 'all', topic = 'all', examCode = '101') {
    if (!questionList || questionList.length === 0) {
        return alert("Chưa có câu hỏi cho bài thi này!");
    }

    // Xóa timer cũ nếu còn
    if (activeExam && activeExam.timerInterval) {
        clearInterval(activeExam.timerInterval);
    }

    const currentCode = examCode || examCurrentCode || '101';

    activeExam = {
        title: title,
        grade: grade || '12',
        period: period || 'all',
        topic: topic || 'all',
        subject: subject,
        examCode: currentCode,
        questions: questionList,
        userAnswers: {},
        flagged: {},
        currentIndex: 0,
        timeRemainingSeconds: durationMinutes * 60,
        totalSeconds: durationMinutes * 60,
        startTime: Date.now(),
        timerInterval: null
    };

    // Chuyển màn hình
    document.getElementById('exam-lobby-screen').classList.add('hidden');
    document.getElementById('exam-result-screen').classList.add('hidden');
    document.getElementById('exam-room-screen').classList.remove('hidden');

    // Cập nhật header phòng thi
    const roomTitle = document.getElementById('room-exam-title');
    const roomSub = document.getElementById('room-exam-subtitle');
    const roomCodeBadge = document.getElementById('room-exam-code-badge');

    if (roomTitle) roomTitle.innerText = title;
    if (roomSub) {
        const pLabel = EXAM_PERIODS[period] ? EXAM_PERIODS[period].short : 'Tổng hợp';
        roomSub.innerText = `Môn: ${subject} • Kỳ: ${pLabel} • ${questionList.length} câu • ${durationMinutes} phút`;
    }
    if (roomCodeBadge) {
        roomCodeBadge.innerText = `Mã đề: ${currentCode}`;
    }

    // Hiển thị tiến độ & câu đầu tiên
    renderQuestionPalette();
    renderActiveQuestion();
    startCountdownTimer();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 6. HIỂN THỊ CÂU HỎI ĐANG LÀM
function renderActiveQuestion() {
    if (!activeExam) return;
    const q = activeExam.questions[activeExam.currentIndex];
    if (!q) return;

    // Cập nhật badge & subject
    const qBadge = document.getElementById('q-index-badge');
    const qGradeBadge = document.getElementById('q-grade-badge');
    const qSubj = document.getElementById('q-subject-badge');
    const qContent = document.getElementById('q-content-text');

    if (qBadge) qBadge.innerText = `Câu ${activeExam.currentIndex + 1} / ${activeExam.questions.length}`;
    if (qSubj) qSubj.innerText = activeExam.subject;
    if (qContent) qContent.innerText = q.content;

    if (qGradeBadge) {
        const gradeText = q.grade || (activeExam.grade === 'all' ? 'Tốt Nghiệp THPT' : `Lớp ${activeExam.grade || '12'}`);
        qGradeBadge.innerText = gradeText;
        if (gradeText.includes('10')) {
            qGradeBadge.className = "bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-md";
        } else if (gradeText.includes('11')) {
            qGradeBadge.className = "bg-blue-50 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-md";
        } else if (gradeText.includes('12')) {
            qGradeBadge.className = "bg-rose-50 text-rose-700 text-xs font-bold px-2 py-0.5 rounded-md";
        } else {
            qGradeBadge.className = "bg-purple-50 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-md";
        }
    }

    // Cập nhật huy hiệu kỳ thi
    const qPeriodBadge = document.getElementById('q-period-badge');
    if (qPeriodBadge) {
        const pKey = q.period || activeExam.period || 'all';
        const pInfo = EXAM_PERIODS[pKey] || EXAM_PERIODS['all'];
        qPeriodBadge.innerText = pInfo.short || pInfo.name;
        qPeriodBadge.className = `${pInfo.badgeCls || 'bg-purple-100 text-purple-800'} text-xs font-bold px-2 py-0.5 rounded-md hidden sm:inline-block`;
    }

    // Cập nhật huy hiệu chủ đề / bài học
    const qTopicBadge = document.getElementById('q-topic-badge');
    if (qTopicBadge) {
        const topText = q.topic || (activeExam.topic !== 'all' ? activeExam.topic : 'Tổng hợp bài học');
        qTopicBadge.innerText = topText;
        qTopicBadge.title = topText;
    }

    // Cập nhật nút gắn cờ (Flag)
    const isFlagged = !!activeExam.flagged[activeExam.currentIndex];
    const btnFlag = document.getElementById('btn-flag-q');
    const iconFlag = document.getElementById('icon-flag-q');
    const textFlag = document.getElementById('text-flag-q');

    if (btnFlag && iconFlag && textFlag) {
        if (isFlagged) {
            btnFlag.className = "text-xs font-bold text-amber-600 flex items-center gap-1 px-2.5 py-1 rounded-lg border border-amber-400 bg-amber-50 transition";
            iconFlag.className = "fa-solid fa-flag text-amber-500";
            textFlag.innerText = "Đã đánh dấu xem lại";
        } else {
            btnFlag.className = "text-xs font-bold text-gray-400 hover:text-amber-500 flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gray-200 hover:border-amber-400 transition";
            iconFlag.className = "fa-regular fa-flag";
            textFlag.innerText = "Đánh dấu xem lại";
        }
    }

    // Render 4 phương án A, B, C, D
    const optionsContainer = document.getElementById('q-options-container');
    const currentAnswer = activeExam.userAnswers[activeExam.currentIndex];

    if (optionsContainer) {
        optionsContainer.innerHTML = q.options.map(opt => {
            // Tách chữ cái A, B, C, D
            const optLetterMatch = opt.match(/^\s*([A-D])/i);
            const letter = optLetterMatch ? optLetterMatch[1].toUpperCase() : '';
            const isSelected = (currentAnswer === letter);

            const activeClass = isSelected
                ? 'border-2 border-rose-500 bg-rose-50 text-rose-900 shadow-sm font-bold'
                : 'border border-gray-200 bg-white hover:border-gray-300 text-gray-700';

            const radioBadge = isSelected
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-gray-100 text-gray-600 border-gray-300';

            return `
                <div onclick="selectAnswer('${letter}')" class="p-3.5 sm:p-4 rounded-xl cursor-pointer flex items-center gap-3 transition transform active:scale-[0.99] ${activeClass}">
                    <div class="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 border ${radioBadge}">
                        ${letter}
                    </div>
                    <div class="text-sm sm:text-base leading-relaxed flex-1">
                        ${opt.replace(/^[A-D][.:)]\s*|^[A-D]\s+/i, '').trim()}
                    </div>
                </div>
            `;
        }).join('');
    }

    // Cập nhật nút điều hướng câu trước - câu sau
    const btnPrev = document.getElementById('btn-prev-q');
    const btnNext = document.getElementById('btn-next-q');
    const navIndicator = document.getElementById('q-nav-indicator');

    if (btnPrev) btnPrev.disabled = (activeExam.currentIndex === 0);
    if (navIndicator) navIndicator.innerText = `${activeExam.currentIndex + 1} / ${activeExam.questions.length}`;

    if (btnNext) {
        if (activeExam.currentIndex === activeExam.questions.length - 1) {
            btnNext.innerHTML = `Hoàn thành <i class="fa-solid fa-check"></i>`;
            btnNext.className = "px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1.5 shadow-sm";
        } else {
            btnNext.innerHTML = `Câu tiếp theo <i class="fa-solid fa-arrow-right"></i>`;
            btnNext.className = "px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition flex items-center gap-1.5 shadow-sm";
        }
    }

    updateProgressBar();
    renderQuestionPalette();
}

// 7. CHỌN ĐÁP ÁN
function selectAnswer(letter) {
    if (!activeExam) return;
    activeExam.userAnswers[activeExam.currentIndex] = letter;
    renderActiveQuestion();
}

// 8. GẮN CỜ (FLAG)
function toggleFlagCurrentQuestion() {
    if (!activeExam) return;
    const cur = activeExam.currentIndex;
    activeExam.flagged[cur] = !activeExam.flagged[cur];
    renderActiveQuestion();
}

// 9. ĐIỀU HƯỚNG CÂU
function prevQuestion() {
    if (!activeExam || activeExam.currentIndex <= 0) return;
    activeExam.currentIndex--;
    renderActiveQuestion();
}

function nextQuestion() {
    if (!activeExam) return;
    if (activeExam.currentIndex < activeExam.questions.length - 1) {
        activeExam.currentIndex++;
        renderActiveQuestion();
    } else {
        submitExamPrompt();
    }
}

function jumpToQuestion(index) {
    if (!activeExam || index < 0 || index >= activeExam.questions.length) return;
    activeExam.currentIndex = index;
    renderActiveQuestion();
}

// 10. BẢNG SỐ THỨ TỰ CÂU HỎI (PALETTE)
function renderQuestionPalette() {
    if (!activeExam) return;
    const palette = document.getElementById('q-palette-grid');
    if (!palette) return;

    palette.innerHTML = activeExam.questions.map((q, idx) => {
        const isCurrent = (idx === activeExam.currentIndex);
        const hasAnswer = (activeExam.userAnswers[idx] !== undefined);
        const isFlagged = (activeExam.flagged[idx] === true);

        let colorClass = "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200";
        if (hasAnswer) {
            colorClass = "bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600";
        }
        if (isFlagged) {
            colorClass = "bg-amber-400 text-amber-950 border-amber-500 hover:bg-amber-500";
        }

        const ringClass = isCurrent ? "ring-2 ring-rose-500 ring-offset-2 scale-105 z-10 shadow-sm" : "";

        return `
            <button type="button" onclick="jumpToQuestion(${idx})" class="w-full h-9 rounded-lg flex items-center justify-center font-bold text-xs border transition ${colorClass} ${ringClass}">
                ${idx + 1}
            </button>
        `;
    }).join('');
}

// 11. CẬP NHẬT THANH TIẾN ĐỘ
function updateProgressBar() {
    if (!activeExam) return;
    const total = activeExam.questions.length;
    const answeredCount = Object.keys(activeExam.userAnswers).length;
    const percent = Math.round((answeredCount / total) * 100);

    const answeredEl = document.getElementById('progress-answered-count');
    const totalEl = document.getElementById('progress-total-count');
    const percentEl = document.getElementById('progress-percent-text');
    const fillEl = document.getElementById('progress-bar-fill');

    if (answeredEl) answeredEl.innerText = answeredCount;
    if (totalEl) totalEl.innerText = total;
    if (percentEl) percentEl.innerText = `${percent}%`;
    if (fillEl) fillEl.style.width = `${percent}%`;
}

// 12. ĐỒNG HỒ ĐẾM NGƯỢC
function startCountdownTimer() {
    if (!activeExam) return;
    const timerText = document.getElementById('room-timer-text');
    const timerContainer = document.getElementById('room-timer-container');

    activeExam.timerInterval = setInterval(() => {
        if (!activeExam) return;
        activeExam.timeRemainingSeconds--;

        if (timerText) {
            timerText.innerText = formatTimeMMSS(activeExam.timeRemainingSeconds);
        }

        // Cảnh báo khi còn dưới 3 phút
        if (activeExam.timeRemainingSeconds <= 180 && timerContainer) {
            timerContainer.className = "bg-gradient-to-r from-red-600 to-rose-700 text-white font-mono font-black text-base sm:text-lg px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-2 animate-pulse";
        }

        // Hết giờ -> Nộp bài tự động
        if (activeExam.timeRemainingSeconds <= 0) {
            clearInterval(activeExam.timerInterval);
            alert("⏰ ĐÃ HẾT GIỜ LÀM BÀI! Hệ thống sẽ tự động chấm điểm bài làm của bạn.");
            submitExam();
        }
    }, 1000);
}

function formatTimeMMSS(totalSeconds) {
    if (totalSeconds < 0) totalSeconds = 0;
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// 13. NỘP BÀI THI
function submitExamPrompt() {
    if (!activeExam) return;
    const total = activeExam.questions.length;
    const answered = Object.keys(activeExam.userAnswers).length;
    const unanswered = total - answered;

    let confirmMsg = "Bạn có chắc chắn muốn nộp bài thi để chấm điểm không?";
    if (unanswered > 0) {
        confirmMsg = `⚠️ Chú ý: Bạn còn ${unanswered} câu chưa trả lời!\nBạn có chắc chắn muốn nộp bài sớm không?`;
    }

    if (confirm(confirmMsg)) {
        submitExam();
    }
}

function confirmExitExam() {
    if (confirm("Bạn có chắc chắn muốn thoát khỏi bài thi này? Kết quả làm bài hiện tại sẽ bị hủy.")) {
        if (activeExam && activeExam.timerInterval) {
            clearInterval(activeExam.timerInterval);
        }
        activeExam = null;
        backToExamLobby();
    }
}

function submitExam() {
    if (!activeExam) return;

    if (activeExam.timerInterval) {
        clearInterval(activeExam.timerInterval);
    }

    const total = activeExam.questions.length;
    let correctCount = 0;
    const mistakesToSave = [];
    const reviewData = [];

    activeExam.questions.forEach((q, idx) => {
        const userChoice = activeExam.userAnswers[idx] || null;
        const isCorrect = (userChoice === q.correct);
        if (isCorrect) correctCount++;

        const gradeText = q.grade || (activeExam.grade === 'all' ? 'Tốt Nghiệp THPT' : `Lớp ${activeExam.grade || '12'}`);
        const periodKey = q.period || activeExam.period || 'all';
        const topicText = q.topic || (activeExam.topic !== 'all' ? activeExam.topic : 'Tổng hợp bài học');

        const reviewItem = {
            num: idx + 1,
            grade: gradeText,
            period: periodKey,
            topic: topicText,
            subject: activeExam.subject,
            content: q.content,
            options: q.options,
            correct: q.correct,
            userChoice: userChoice,
            isCorrect: isCorrect,
            explanation: q.explanation
        };
        reviewData.push(reviewItem);

        if (!isCorrect) {
            mistakesToSave.push({
                id: `mis_${Date.now()}_${idx}`,
                grade: gradeText,
                period: periodKey,
                topic: topicText,
                subject: activeExam.subject,
                content: q.content,
                options: q.options,
                correct: q.correct,
                userChoice: userChoice,
                explanation: q.explanation,
                date: new Date().toLocaleDateString('vi-VN')
            });
        }
    });

    const score = Math.round((correctCount / total) * 10 * 10) / 10;
    const timeSpentSeconds = activeExam.totalSeconds - activeExam.timeRemainingSeconds;
    const timeSpentFormatted = formatTimeMMSS(timeSpentSeconds);

    // Lưu vào Lịch sử thi (school_exam_history)
    const history = JSON.parse(localStorage.getItem('school_exam_history')) || [];
    history.unshift({
        id: Date.now(),
        title: activeExam.title,
        examCode: activeExam.examCode || '101',
        grade: activeExam.grade || '12',
        period: activeExam.period || 'all',
        topic: activeExam.topic || 'all',
        subject: activeExam.subject,
        score: score,
        total: total,
        correctCount: correctCount,
        timeSpent: timeSpentFormatted,
        date: new Date().toLocaleString('vi-VN')
    });
    localStorage.setItem('school_exam_history', JSON.stringify(history.slice(0, 30))); // Giữ 30 lần thi gần nhất

    // Tự động gom câu sai vào Sổ Tay Lỗi Sai (loại bỏ trùng lặp nội dung)
    let mistakes = JSON.parse(localStorage.getItem('school_mistake_notebook')) || [];
    mistakesToSave.forEach(newItem => {
        const existed = mistakes.some(m => m.content.trim() === newItem.content.trim());
        if (!existed) mistakes.unshift(newItem);
    });
    localStorage.setItem('school_mistake_notebook', JSON.stringify(mistakes));

    currentReviewQuestions = reviewData;

    // Chuyển sang màn hình Kết quả
    document.getElementById('exam-room-screen').classList.add('hidden');
    document.getElementById('exam-result-screen').classList.remove('hidden');

    renderExamResultUI(score, correctCount, total, timeSpentFormatted);
    filterReviewQuestions('all');
    updateExamLobbyStats();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 14. HIỂN THỊ MÀN HÌNH KẾT QUẢ
function renderExamResultUI(score, correctCount, total, timeSpent) {
    const scoreNum = document.getElementById('result-score-number');
    const rankTitle = document.getElementById('result-rank-title');
    const feedbackText = document.getElementById('result-feedback-text');
    const correctEl = document.getElementById('result-correct-count');
    const wrongEl = document.getElementById('result-wrong-count');
    const timeEl = document.getElementById('result-time-taken');
    const codeBadgeEl = document.getElementById('result-exam-code-badge');

    if (codeBadgeEl) {
        codeBadgeEl.innerText = `Mã đề: ${activeExam ? activeExam.examCode : (examCurrentCode || '101')}`;
    }

    if (scoreNum) scoreNum.innerText = score.toFixed(1);
    if (correctEl) correctEl.innerText = `${correctCount} câu`;
    if (wrongEl) wrongEl.innerText = `${total - correctCount} câu`;
    if (timeEl) timeEl.innerText = timeSpent;

    let rank = "Khá";
    let fb = "Cần rèn luyện thêm để đạt điểm số cao hơn bạn nhé!";

    if (score >= 9.0) {
        rank = "Xuất Sắc! 🎉";
        fb = "Phong độ thi tuyệt đỉnh! Bạn đã làm chủ hoàn toàn khối kiến thức môn này.";
    } else if (score >= 8.0) {
        rank = "Giỏi! 👏";
        fb = "Kiến thức rất vững vàng! Chỉ cần chú ý thêm một vài chi tiết nhỏ để bứt phá điểm 10.";
    } else if (score >= 6.5) {
        rank = "Khá! 👍";
        fb = "Bạn đã nắm được kiến thức nền tảng. Hãy xem kỹ lời giải các câu sai phía dưới nhé.";
    } else if (score >= 5.0) {
        rank = "Trung Bình ⚡";
        fb = "Cần tăng tốc ôn tập lý thuyết và mở Sổ tay lỗi sai để luyện lại ngay.";
    } else {
        rank = "Cần Cố Gắng Nhiều 📚";
        fb = "Đừng nản lòng! Hãy đọc kỹ lời giải chi tiết và thử sức lại bài thi nhé.";
    }

    if (rankTitle) rankTitle.innerText = rank;
    if (feedbackText) feedbackText.innerText = fb;
}

// 15. BỘ LỌC XEM LẠI LỜI GIẢI CHI TIẾT
function filterReviewQuestions(type) {
    currentReviewFilter = type;
    const btnAll = document.getElementById('rev-filter-all');
    const btnWrong = document.getElementById('rev-filter-wrong');
    const btnCorrect = document.getElementById('rev-filter-correct');

    if (btnAll) btnAll.className = (type === 'all') ? "px-2.5 py-1 rounded bg-white text-gray-800 shadow-2xs font-bold" : "px-2.5 py-1 rounded text-gray-500 hover:bg-white font-bold";
    if (btnWrong) btnWrong.className = (type === 'wrong') ? "px-2.5 py-1 rounded bg-white text-rose-600 shadow-2xs font-bold" : "px-2.5 py-1 rounded text-rose-600 hover:bg-white font-bold";
    if (btnCorrect) btnCorrect.className = (type === 'correct') ? "px-2.5 py-1 rounded bg-white text-emerald-600 shadow-2xs font-bold" : "px-2.5 py-1 rounded text-emerald-600 hover:bg-white font-bold";

    const container = document.getElementById('review-questions-container');
    if (!container) return;

    let filtered = currentReviewQuestions;
    if (type === 'wrong') filtered = currentReviewQuestions.filter(q => !q.isCorrect);
    if (type === 'correct') filtered = currentReviewQuestions.filter(q => q.isCorrect);

    if (filtered.length === 0) {
        container.innerHTML = `<p class="text-center text-gray-400 py-6 text-xs italic">Không có câu hỏi nào thuộc bộ lọc này.</p>`;
        return;
    }

    container.innerHTML = filtered.map(item => {
        const statusBadge = item.isCorrect
            ? `<span class="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full"><i class="fa-solid fa-check mr-1"></i> Đúng</span>`
            : `<span class="bg-rose-100 text-rose-800 text-[10px] font-black px-2 py-0.5 rounded-full"><i class="fa-solid fa-xmark mr-1"></i> Sai / Chưa làm</span>`;

        return `
            <div class="p-4 rounded-xl border ${item.isCorrect ? 'border-gray-200 bg-white' : 'border-rose-200 bg-rose-50/30'} space-y-3">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-black text-gray-700">Câu ${item.num}:</span>
                    ${statusBadge}
                </div>

                <p class="text-sm font-bold text-gray-800 leading-relaxed">${item.content}</p>

                <!-- Lựa chọn -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    ${item.options.map(opt => {
                        const optLetter = (opt.match(/^\s*([A-D])/i) || [])[1];
                        let optStyle = "bg-gray-50 border-gray-200 text-gray-700";
                        if (optLetter === item.correct) {
                            optStyle = "bg-emerald-100 border-emerald-400 text-emerald-900 font-black";
                        } else if (optLetter === item.userChoice && !item.isCorrect) {
                            optStyle = "bg-rose-100 border-rose-400 text-rose-900 font-black line-through";
                        }
                        return `
                            <div class="p-2 rounded-lg border text-[11px] sm:text-xs flex items-center justify-between ${optStyle}">
                                <span>${opt}</span>
                                ${optLetter === item.correct ? '<i class="fa-solid fa-circle-check text-emerald-600"></i>' : ''}
                                ${optLetter === item.userChoice && !item.isCorrect ? '<i class="fa-solid fa-circle-xmark text-rose-600"></i>' : ''}
                            </div>
                        `;
                    }).join('')}
                </div>

                <!-- Lời giải chi tiết -->
                <div class="bg-blue-50/70 p-3 rounded-lg border border-blue-200 text-xs space-y-1">
                    <div class="font-bold text-blue-900 flex items-center gap-1.5">
                        <i class="fa-solid fa-lightbulb text-amber-500"></i> Lời giải chi tiết:
                    </div>
                    <p class="text-gray-700 leading-relaxed text-[11px] sm:text-xs">${item.explanation}</p>
                </div>
            </div>
        `;
    }).join('');
}

// 16. HÀNH ĐỘNG TỪ MÀN HÌNH KẾT QUẢ
function retryCurrentExam(scrambleNew = false) {
    if (!activeExam) return backToExamLobby();

    if (scrambleNew) {
        // Đảo đề mới: sinh mã đề ngẫu nhiên mới và bắt đầu bài thi mới hoàn toàn
        randomizeExamCode();
        startSelectedExam();
    } else {
        // Giữ nguyên câu hỏi và mã đề hiện tại, chỉ làm lại từ đầu
        const questions = activeExam.questions.map(q => ({
            ...q,
            options: [...q.options]
        }));
        setupAndStartExam(
            activeExam.title,
            activeExam.subject,
            questions,
            Math.round(activeExam.totalSeconds / 60),
            activeExam.grade,
            activeExam.period,
            activeExam.topic,
            activeExam.examCode
        );
    }
}

// 16.1. HỆ THỐNG XUẤT BỘ ĐỀ ĐA MÃ ĐỀ & MA TRẬN ĐÁP ÁN ĐỐI CHIẾU
function openMultiCodeModal() {
    const modal = document.getElementById('modal-multi-code-exam');
    if (!modal) return;
    modal.classList.remove('hidden');
    // Nếu chưa tạo bộ đề hoặc môn hiện tại đã đổi thì tự động tạo bộ mới
    if (!multiCodeBatchData || multiCodeBatchData.subject !== selectedExamSubject) {
        generateMultiCodeBatch();
    }
}

function closeMultiCodeModal() {
    const modal = document.getElementById('modal-multi-code-exam');
    if (modal) modal.classList.add('hidden');
}

function generateMultiCodeBatch() {
    const codeCountEl = document.getElementById('batch-code-count');
    const qCountEl = document.getElementById('batch-question-count');
    const tabsContainer = document.getElementById('batch-tabs-container');

    const numCodes = parseInt(codeCountEl?.value || '4', 10);
    const numQuestions = parseInt(qCountEl?.value || '40', 10);

    // 1. Lấy nguồn câu hỏi chuẩn từ ngân hàng theo môn, khối lớp và kỳ thi
    let pool = getFilteredExamPool(numQuestions);
    if (!pool || pool.length === 0) {
        let fallback = [];
        if (typeof BUILTIN_EXAM_BANK !== 'undefined') {
            const gradesToCheck = (selectedExamGrade === 'all') ? ['12', '11', '10'] : [selectedExamGrade];
            gradesToCheck.forEach(g => {
                if (BUILTIN_EXAM_BANK[g] && BUILTIN_EXAM_BANK[g][selectedExamSubject]) {
                    fallback.push(...BUILTIN_EXAM_BANK[g][selectedExamSubject]);
                }
            });
        }
        pool = fallback;
    }

    if (pool.length === 0) {
        if (typeof alert === 'function') {
            alert("Không tìm thấy câu hỏi trong ngân hàng dữ liệu để tạo bộ đa mã đề!");
        }
        return;
    }

    // 2. Lọc bỏ câu trùng nội dung theo mặt chữ và xáo trộn toàn bộ mảng trước khi cắt
    const cleanPool = (typeof filterDuplicateQuestionsByText === 'function') ? filterDuplicateQuestionsByText(pool) : pool;
    const shuffledPool = [...cleanPool];
    for (let i = shuffledPool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledPool[i], shuffledPool[j]] = [shuffledPool[j], shuffledPool[i]];
    }
    const finalCount = Math.min(numQuestions, shuffledPool.length);
    const masterQuestions = shuffledPool.slice(0, finalCount).map((q, idx) => ({
        masterId: idx + 1,
        content: q.content,
        options: [...q.options],
        correct: (q.correct || 'A').toUpperCase().trim(),
        explanation: q.explanation || 'Đang cập nhật lời giải chi tiết.',
        grade: q.grade || selectedExamGrade,
        period: q.period || selectedExamPeriod,
        topic: q.topic || selectedExamTopic
    }));

    // 3. Tạo danh sách các mã đề (101, 102, 103, 104, 105, 106)
    const codeList = [];
    const baseCodeNum = 101;
    for (let i = 0; i < numCodes; i++) {
        codeList.push((baseCodeNum + i).toString());
    }

    // 4. Sinh đề cho từng mã đề: đảo thứ tự câu hỏi và đảo phương án A, B, C, D
    const examsByCode = {};
    codeList.forEach((code, codeIdx) => {
        let codeQList = masterQuestions.map(mq => ({ ...mq }));

        // Mã đề từ thứ 2 trở đi đảo xáo trộn thứ tự câu hỏi (Fisher-Yates)
        if (codeIdx > 0) {
            for (let i = codeQList.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [codeQList[i], codeQList[j]] = [codeQList[j], codeQList[i]];
            }
        }

        // Đảo phương án và ánh xạ lại đáp án đúng
        const formattedCodeQuestions = codeQList.map((q, qIdx) => {
            const scrambled = scrambleQuestionOptions(q, true);
            return {
                num: qIdx + 1,
                masterId: q.masterId,
                examCode: code,
                content: q.content,
                options: scrambled.options,
                correct: scrambled.correct,
                explanation: q.explanation
            };
        });

        examsByCode[code] = formattedCodeQuestions;
    });

    // 5. Lưu vào biến toàn cục multiCodeBatchData
    multiCodeBatchData = {
        subject: selectedExamSubject,
        grade: selectedExamGrade === 'all' ? 'Tốt Nghiệp THPT' : `Lớp ${selectedExamGrade}`,
        period: EXAM_PERIODS[selectedExamPeriod] ? EXAM_PERIODS[selectedExamPeriod].short : 'Tổng hợp',
        topic: selectedExamTopic,
        codes: codeList,
        masterQuestions: masterQuestions,
        exams: examsByCode,
        createdAt: new Date().toLocaleString('vi-VN')
    };

    if (tabsContainer) tabsContainer.classList.remove('hidden');

    // Mở mặc định tab Ma trận đáp án
    currentBatchActiveTab = 'matrix';
    renderBatchTabs();
    renderBatchTabContent();
}

function renderBatchTabs() {
    const tabBtnsContainer = document.getElementById('batch-code-tab-buttons');
    if (!tabBtnsContainer || !multiCodeBatchData) return;

    let html = `
        <button type="button" onclick="switchBatchTab('matrix')" class="px-3 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 ${currentBatchActiveTab === 'matrix' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}">
            <i class="fa-solid fa-table-cells"></i>
            <span>Bảng Đáp Án Đối Chiếu</span>
        </button>
    `;

    multiCodeBatchData.codes.forEach(code => {
        const isActive = (currentBatchActiveTab === code);
        html += `
            <button type="button" onclick="switchBatchTab('${code}')" class="px-3 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 ${isActive ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}">
                <i class="fa-solid fa-file-lines"></i>
                <span>Mã Đề ${code}</span>
            </button>
        `;
    });

    tabBtnsContainer.innerHTML = html;
}

function switchBatchTab(tabId) {
    currentBatchActiveTab = tabId;
    renderBatchTabs();
    renderBatchTabContent();
}

function renderBatchTabContent() {
    const contentArea = document.getElementById('batch-tab-content-area');
    if (!contentArea || !multiCodeBatchData) return;

    if (currentBatchActiveTab === 'matrix') {
        // Render BẢNG MA TRẬN ĐÁP ÁN ĐỐI CHIẾU
        const codes = multiCodeBatchData.codes;
        const totalQ = multiCodeBatchData.masterQuestions.length;

        let tableHeaderCols = codes.map(c => `<th class="py-2.5 px-3 border border-indigo-200 bg-indigo-100/80 text-center font-black text-indigo-950">Mã ${c}</th>`).join('');

        let rowsHtml = '';
        for (let i = 0; i < totalQ; i++) {
            const qNum = i + 1;
            let cells = '';
            codes.forEach(c => {
                const qItem = multiCodeBatchData.exams[c][i];
                const ans = qItem ? qItem.correct : '-';
                cells += `<td class="py-2 px-3 border border-gray-200 text-center font-black font-mono text-sm text-indigo-700 bg-white hover:bg-indigo-50/50">${ans}</td>`;
            });

            rowsHtml += `
                <tr class="hover:bg-gray-50/80 transition">
                    <td class="py-2 px-3 border border-gray-200 text-center font-bold text-gray-700 bg-gray-50/80">Câu ${qNum}</td>
                    ${cells}
                </tr>
            `;
        }

        contentArea.innerHTML = `
            <div class="space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-3.5 rounded-xl border border-indigo-100 shadow-2xs">
                    <div>
                        <h4 class="font-black text-gray-800 text-sm flex items-center gap-2">
                            <i class="fa-solid fa-list-check text-indigo-600"></i>
                            MA TRẬN ĐÁP ÁN ĐỐI CHIẾU CÁC MÃ ĐỀ (${codes.join(', ')})
                        </h4>
                        <p class="text-[11px] text-gray-500 mt-0.5">Môn: <strong>${multiCodeBatchData.subject}</strong> • Khối: <strong>${multiCodeBatchData.grade}</strong> • Số câu: <strong>${totalQ}</strong></p>
                    </div>
                    <span class="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg">
                        <i class="fa-solid fa-circle-check mr-1"></i> Tự động đồng bộ chuẩn xác 100%
                    </span>
                </div>

                <div class="overflow-x-auto max-h-[480px] custom-scrollbar rounded-xl border border-gray-200 shadow-2xs">
                    <table class="w-full text-xs text-left border-collapse bg-white">
                        <thead class="sticky top-0 z-10 shadow-2xs">
                            <tr>
                                <th class="py-2.5 px-3 border border-indigo-200 bg-indigo-100/90 text-center font-black text-indigo-950 w-24">Số TT</th>
                                ${tableHeaderCols}
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHtml}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } else {
        // Render ĐỀ THI CHI TIẾT THEO MÃ ĐỀ (Ví dụ Mã 101, 102...)
        const code = currentBatchActiveTab;
        const questions = multiCodeBatchData.exams[code] || [];

        const qListHtml = questions.map(q => `
            <div class="p-3.5 rounded-xl border border-gray-200 bg-white space-y-2">
                <div class="flex items-center justify-between">
                    <span class="font-black text-indigo-900 text-xs">Câu ${q.num}:</span>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">Đáp án đúng: ${q.correct}</span>
                </div>
                <p class="font-bold text-gray-800 text-xs leading-relaxed">${q.content}</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    ${q.options.map(opt => `
                        <div class="p-2 rounded-lg border border-gray-200 ${opt.startsWith(q.correct) ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900' : 'bg-gray-50 text-gray-700'}">
                            ${opt}
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

        contentArea.innerHTML = `
            <div class="space-y-4">
                <div class="flex items-center justify-between bg-white p-3.5 rounded-xl border border-indigo-100 shadow-2xs">
                    <div>
                        <h4 class="font-black text-gray-800 text-sm flex items-center gap-2">
                            <i class="fa-solid fa-file-signature text-indigo-600"></i>
                            ĐỀ THI CHI TIẾT - MÃ ĐỀ ${code}
                        </h4>
                        <p class="text-[11px] text-gray-500 mt-0.5">Môn: <strong>${multiCodeBatchData.subject}</strong> • ${questions.length} câu hỏi trắc nghiệm</p>
                    </div>
                    <button type="button" onclick="startExamWithSpecificCode('${code}')" class="bg-gradient-to-r from-rose-500 to-orange-500 text-white font-black text-xs px-3.5 py-1.5 rounded-xl shadow-xs hover:opacity-90 active:scale-95 transition flex items-center gap-1.5">
                        <i class="fa-solid fa-play"></i>
                        <span>Làm Đề ${code} Ngay</span>
                    </button>
                </div>

                <div class="space-y-3 max-h-[480px] overflow-y-auto custom-scrollbar pr-1">
                    ${qListHtml}
                </div>
            </div>
        `;
    }
}

function startExamWithSpecificCode(code) {
    if (!multiCodeBatchData || !multiCodeBatchData.exams[code]) return;
    const questions = multiCodeBatchData.exams[code];
    closeMultiCodeModal();

    let durationMins = 15;
    if (questions.length >= 40) durationMins = 50;
    else if (questions.length >= 25) durationMins = 40;
    else if (questions.length >= 20) durationMins = 30;

    examCurrentCode = code;
    const inputEl = document.getElementById('current-exam-code-input');
    if (inputEl) inputEl.value = code;

    setupAndStartExam(
        `Đề Thi ${multiCodeBatchData.grade} - ${multiCodeBatchData.subject} (Mã đề: ${code})`,
        multiCodeBatchData.subject,
        questions,
        durationMins,
        selectedExamGrade,
        selectedExamPeriod,
        selectedExamTopic,
        code
    );
}

function printMultiCodeBatch() {
    if (!multiCodeBatchData) return;
    const codes = multiCodeBatchData.codes;
    const totalQ = multiCodeBatchData.masterQuestions.length;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert("Vui lòng cho phép trình duyệt mở cửa sổ mới để in / xuất PDF bộ đề!");
        return;
    }

    let tableHeader = codes.map(c => `<th style="border:1px solid #000; padding:6px; text-align:center;">Mã ${c}</th>`).join('');
    let tableRows = '';
    for (let i = 0; i < totalQ; i++) {
        let cells = codes.map(c => {
            const q = multiCodeBatchData.exams[c][i];
            return `<td style="border:1px solid #000; padding:4px; text-align:center; font-weight:bold;">${q ? q.correct : '-'}</td>`;
        }).join('');
        tableRows += `<tr><td style="border:1px solid #000; padding:4px; text-align:center; font-weight:bold;">Câu ${i + 1}</td>${cells}</tr>`;
    }

    let examsPagesHtml = codes.map(code => {
        const qList = multiCodeBatchData.exams[code] || [];
        const qHtml = qList.map(q => `
            <div style="margin-bottom: 12px; page-break-inside: avoid;">
                <div style="font-weight: bold; margin-bottom: 4px;">Câu ${q.num}: ${q.content}</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 13px; margin-left: 10px;">
                    ${q.options.map(o => `<div>${o}</div>`).join('')}
                </div>
            </div>
        `).join('');

        return `
            <div style="page-break-after: always; padding: 20px;">
                <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px;">
                    <div>
                        <div style="font-weight: bold; font-size: 14px;">SỞ GIÁO DỤC VÀ ĐÀO TẠO</div>
                        <div style="font-size: 13px;">TRƯỜNG THPT NAM LƯƠNG SƠN</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: bold; font-size: 14px;">ĐỀ THI MÔN: ${multiCodeBatchData.subject.toUpperCase()}</div>
                        <div style="font-size: 13px;">Khối: ${multiCodeBatchData.grade} • Thời gian: 50 phút</div>
                        <div style="font-weight: bold; font-size: 15px; color: #b91c1c;">MÃ ĐỀ THI: ${code}</div>
                    </div>
                </div>
                ${qHtml}
            </div>
        `;
    }).join('');

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Bộ Đề Đa Mã Đề - ${multiCodeBatchData.subject}</title>
            <style>
                body { font-family: "Times New Roman", Times, serif; font-size: 14px; line-height: 1.4; color: #000; margin: 0; padding: 0; }
                @media print {
                    body { padding: 0; }
                    .no-print { display: none !important; }
                }
            </style>
        </head>
        <body>
            <div class="no-print" style="background:#f3f4f6; padding:12px; text-align:center; border-bottom:1px solid #ccc;">
                <button onclick="window.print()" style="background:#4f46e5; color:#fff; border:none; padding:8px 16px; border-radius:6px; font-weight:bold; cursor:pointer;">
                    In Ngay / Xuất PDF
                </button>
            </div>

            <!-- BẢNG ĐÁP ÁN ĐỐI CHIẾU TRANG ĐẦU TIÊN -->
            <div style="page-break-after: always; padding: 20px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; font-size: 18px;">BẢNG MA TRẬN ĐÁP ÁN ĐỐI CHIẾU CÁC MÃ ĐỀ</h2>
                    <p style="margin: 5px 0; font-size: 14px;">Môn: <strong>${multiCodeBatchData.subject}</strong> • Khối: <strong>${multiCodeBatchData.grade}</strong> • Số câu: <strong>${totalQ}</strong></p>
                </div>
                <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 0 auto; max-width: 650px;">
                    <thead>
                        <tr style="background-color: #f3f4f6;">
                            <th style="border:1px solid #000; padding:6px; text-align:center;">Câu hỏi</th>
                            ${tableHeader}
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>

            <!-- CÁC TRANG ĐỀ THI TỪNG MÃ ĐỀ -->
            ${examsPagesHtml}
        </body>
        </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
}

function backToExamLobby() {
    document.getElementById('exam-room-screen').classList.add('hidden');
    document.getElementById('exam-result-screen').classList.add('hidden');
    document.getElementById('exam-lobby-screen').classList.remove('hidden');
    setExamSubTab('practice');
    updateExamLobbyStats();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function saveAllMistakesToNotebook() {
    alert("✓ Đã đồng bộ tất cả câu trả lời sai vào Sổ Tay Lỗi Sai của bạn!");
    updateExamLobbyStats();
}

// 17. SỔ TAY LỖI SAI (MISTAKE NOTEBOOK)
function renderMistakesGradeFilterChips() {
    const container = document.getElementById('mistakes-grade-filter-chips');
    if (!container) return;

    const grades = [
        { id: 'all', name: 'Tất cả khối lớp' },
        { id: '10', name: 'Lớp 10' },
        { id: '11', name: 'Lớp 11' },
        { id: '12', name: 'Lớp 12' }
    ];

    container.innerHTML = grades.map(g => {
        const isSelected = (currentMistakeGradeFilter === g.id);
        const cls = isSelected
            ? 'bg-rose-600 text-white shadow-2xs font-black'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold';

        return `
            <button type="button" onclick="filterMistakesByGrade('${g.id}')" class="px-3 py-1 rounded-full whitespace-nowrap transition text-xs ${cls}">
                ${g.name}
            </button>
        `;
    }).join('');
}

function filterMistakesByGrade(grade) {
    currentMistakeGradeFilter = grade;
    renderMistakesGradeFilterChips();
    renderMistakeNotebook();
}

function renderMistakesPeriodFilterChips() {
    const container = document.getElementById('mistakes-period-filter-chips');
    if (!container) return;

    const periods = [
        { id: 'all', name: 'Tất cả kỳ thi' },
        { id: 'mid1', name: 'Giữa Kì 1' },
        { id: 'final1', name: 'Cuối Kì 1' },
        { id: 'mid2', name: 'Giữa Kì 2' },
        { id: 'final2', name: 'Cuối Kì 2' }
    ];

    container.innerHTML = periods.map(p => {
        const isSelected = (currentMistakePeriodFilter === p.id);
        const cls = isSelected
            ? 'bg-blue-600 text-white shadow-2xs font-black'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold';

        return `
            <button type="button" onclick="filterMistakesByPeriod('${p.id}')" class="px-3 py-1 rounded-full whitespace-nowrap transition text-xs ${cls}">
                ${p.name}
            </button>
        `;
    }).join('');
}

function filterMistakesByPeriod(period) {
    currentMistakePeriodFilter = period;
    renderMistakesPeriodFilterChips();
    renderMistakeNotebook();
}

function renderMistakesFilterChips() {
    const container = document.getElementById('mistakes-filter-chips');
    if (!container) return;

    const subjects = ['all', 'Toán', 'Vật Lí', 'Hóa Học', 'Sinh Học', 'Lịch Sử', 'Địa Lí', 'GDKT&PL', 'Tiếng Anh', 'Tin Học', 'Công Nghệ', 'GDQP&AN'];

    container.innerHTML = subjects.map(s => {
        const isSelected = (currentMistakeFilter === s);
        const name = (s === 'all') ? 'Tất cả môn' : s;
        const cls = isSelected
            ? 'bg-amber-500 text-white shadow-2xs font-black'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold';

        return `
            <button type="button" onclick="filterMistakesBySubject('${s}')" class="px-3 py-1 rounded-full whitespace-nowrap transition text-xs ${cls}">
                ${name}
            </button>
        `;
    }).join('');
}

function filterMistakesBySubject(subj) {
    currentMistakeFilter = subj;
    renderMistakesFilterChips();
    renderMistakeNotebook();
}

function renderMistakeNotebook() {
    const list = document.getElementById('mistakes-list-container');
    if (!list) return;

    const mistakes = JSON.parse(localStorage.getItem('school_mistake_notebook')) || [];
    let filtered = mistakes;

    // Lọc theo khối lớp
    if (currentMistakeGradeFilter !== 'all') {
        filtered = filtered.filter(m => {
            const g = (m.grade || '12').toString();
            return g.includes(currentMistakeGradeFilter);
        });
    }

    // Lọc theo kỳ thi
    if (currentMistakePeriodFilter !== 'all') {
        filtered = filtered.filter(m => {
            return (m.period === currentMistakePeriodFilter);
        });
    }

    // Lọc theo môn học
    if (currentMistakeFilter !== 'all') {
        filtered = filtered.filter(m => m.subject === currentMistakeFilter);
    }

    if (filtered.length === 0) {
        list.innerHTML = `
            <div class="text-center py-10 space-y-2 text-gray-400">
                <i class="fa-solid fa-award text-4xl text-amber-300"></i>
                <p class="text-xs font-bold">Chưa có câu sai nào trong danh mục này!</p>
                <p class="text-[11px]">Khi làm bài thi, các câu bạn trả lời sai sẽ tự động được lưu vào đây để ôn tập lại.</p>
            </div>
        `;
        return;
    }

    list.innerHTML = filtered.map(item => {
        const itemGrade = item.grade || 'Lớp 12';
        let gradeBadgeCls = "bg-rose-100 text-rose-800";
        if (itemGrade.includes('10')) gradeBadgeCls = "bg-emerald-100 text-emerald-800";
        else if (itemGrade.includes('11')) gradeBadgeCls = "bg-blue-100 text-blue-800";
        else if (itemGrade.includes('all') || itemGrade.includes('Nghiệp')) gradeBadgeCls = "bg-purple-100 text-purple-800";

        const pInfo = EXAM_PERIODS[item.period] || (item.period && item.period !== 'all' ? { short: item.period, badgeCls: 'bg-blue-100 text-blue-800' } : null);
        const periodBadge = pInfo ? `<span class="${pInfo.badgeCls || 'bg-blue-100 text-blue-800'} text-[10px] font-black px-2 py-0.5 rounded-md">${pInfo.short || pInfo.name}</span>` : '';
        const topicBadge = (item.topic && item.topic !== 'all' && item.topic !== 'Tổng hợp bài học') ? `<span class="bg-indigo-50 text-indigo-800 text-[10px] font-medium px-2 py-0.5 rounded-md max-w-[180px] truncate">${item.topic}</span>` : '';

        return `
            <div class="p-4 rounded-xl border border-gray-200 bg-white hover:border-amber-300 transition space-y-2.5">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1.5 flex-wrap">
                        <span class="${gradeBadgeCls} text-[10px] font-black px-2 py-0.5 rounded-md">${itemGrade}</span>
                        ${periodBadge}
                        <span class="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-md">${item.subject}</span>
                        ${topicBadge}
                        <span class="text-[10px] text-gray-400 font-medium">${item.date || ''}</span>
                    </div>
                    <button type="button" onclick="removeMistake('${item.id}')" class="text-xs text-gray-400 hover:text-red-500 font-bold flex items-center gap-1" title="Đã thuộc / Xóa">
                        <i class="fa-solid fa-check"></i> Đã thuộc
                    </button>
                </div>

                <p class="text-sm font-bold text-gray-800 leading-relaxed">${item.content}</p>

                <div class="text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg font-bold">
                    ✓ Đáp án đúng: <span class="font-black">${item.correct}</span>
                </div>

                <div class="bg-gray-50 p-2.5 rounded-lg border border-gray-100 text-xs text-gray-600">
                    <b class="text-gray-800">Lời giải:</b> ${item.explanation}
                </div>
            </div>
        `;
    }).join('');
}

function removeMistake(id) {
    let mistakes = JSON.parse(localStorage.getItem('school_mistake_notebook')) || [];
    mistakes = mistakes.filter(m => m.id !== id);
    localStorage.setItem('school_mistake_notebook', JSON.stringify(mistakes));
    renderMistakeNotebook();
    updateExamLobbyStats();
}

function clearMistakeNotebook() {
    if (confirm("Bạn có chắc chắn muốn xóa tất cả câu trong Sổ Tay Lỗi Sai không?")) {
        localStorage.removeItem('school_mistake_notebook');
        renderMistakeNotebook();
        updateExamLobbyStats();
    }
}

// Luyện tập chỉ các câu sai trong sổ tay
function practiceMistakes() {
    const mistakes = JSON.parse(localStorage.getItem('school_mistake_notebook')) || [];
    let list = mistakes;

    if (currentMistakeGradeFilter !== 'all') {
        list = list.filter(m => {
            const g = (m.grade || '12').toString();
            return g.includes(currentMistakeGradeFilter);
        });
    }

    if (currentMistakePeriodFilter !== 'all') {
        list = list.filter(m => m.period === currentMistakePeriodFilter);
    }

    if (currentMistakeFilter !== 'all') {
        list = list.filter(m => m.subject === currentMistakeFilter);
    }

    if (list.length === 0) {
        return alert("Sổ tay lỗi sai hiện đang trống trong danh mục đã chọn! Hãy chọn danh mục khác hoặc làm đề thi chuẩn.");
    }

    const questionList = list.map((m, idx) => ({
        id: `mis_practice_${idx}`,
        num: idx + 1,
        grade: m.grade || 'Lớp 12',
        period: m.period || 'all',
        topic: m.topic || 'Tổng hợp',
        subject: m.subject,
        content: m.content,
        options: m.options,
        correct: m.correct,
        explanation: m.explanation
    }));

    const duration = Math.max(10, Math.ceil(questionList.length * 1.5));
    const gradeTitle = currentMistakeGradeFilter === 'all' ? 'Tổng Hợp' : `Lớp ${currentMistakeGradeFilter}`;
    const periodTitle = EXAM_PERIODS[currentMistakePeriodFilter] ? EXAM_PERIODS[currentMistakePeriodFilter].short : 'Tất cả kì';
    const subjTitle = currentMistakeFilter === 'all' ? 'Tất cả môn' : currentMistakeFilter;
    setupAndStartExam(`Luyện Lại Sổ Tay Lỗi Sai - ${gradeTitle} (${periodTitle}) (${questionList.length} câu)`, subjTitle, questionList, duration, currentMistakeGradeFilter, currentMistakePeriodFilter);
}

// 18. LỊCH SỬ THI
function renderExamHistory() {
    const container = document.getElementById('exam-history-container');
    if (!container) return;

    const history = JSON.parse(localStorage.getItem('school_exam_history')) || [];
    if (history.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-400 space-y-1">
                <i class="fa-solid fa-clock-rotate-left text-3xl text-gray-300"></i>
                <p class="text-xs font-bold">Chưa có lịch sử làm bài nào.</p>
                <p class="text-[11px]">Hãy chọn một đề thi và bắt đầu thử sức ngay nhé!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = history.map(item => {
        let scoreColor = "text-emerald-600 bg-emerald-50 border-emerald-200";
        if (item.score < 5.0) scoreColor = "text-red-600 bg-red-50 border-red-200";
        else if (item.score < 8.0) scoreColor = "text-blue-600 bg-blue-50 border-blue-200";

        const itemGrade = item.grade ? (item.grade === 'all' ? 'Tốt Nghiệp THPT' : (item.grade.toString().startsWith('Lớp') ? item.grade : `Lớp ${item.grade}`)) : 'Lớp 12';
        let gradeCls = "bg-rose-100 text-rose-800";
        if (itemGrade.includes('10')) gradeCls = "bg-emerald-100 text-emerald-800";
        else if (itemGrade.includes('11')) gradeCls = "bg-blue-100 text-blue-800";
        else if (itemGrade.includes('Nghiệp') || itemGrade.includes('all')) gradeCls = "bg-purple-100 text-purple-800";

        const pInfo = EXAM_PERIODS[item.period] || (item.period && item.period !== 'all' ? { short: item.period, badgeCls: 'bg-blue-100 text-blue-800' } : null);
        const periodBadge = pInfo ? `<span class="${pInfo.badgeCls || 'bg-blue-100 text-blue-800'} text-[10px] font-black px-2 py-0.5 rounded-md">${pInfo.short || pInfo.name}</span>` : '';

        return `
            <div class="p-3.5 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition flex items-center justify-between gap-3">
                <div class="space-y-1">
                    <div class="flex items-center gap-1.5 flex-wrap">
                        <span class="${gradeCls} text-[10px] font-black px-2 py-0.5 rounded-md">${itemGrade}</span>
                        ${periodBadge}
                        <h4 class="font-bold text-gray-800 text-sm leading-tight">${item.title}</h4>
                    </div>
                    <p class="text-[11px] text-gray-500">
                        Môn: <span class="font-bold text-gray-700">${item.subject}</span> • Đúng: <span class="text-emerald-600 font-bold">${item.correctCount}/${item.total}</span> câu • Làm trong: ${item.timeSpent}
                    </p>
                    <p class="text-[10px] text-gray-400">${item.date}</p>
                </div>
                <div class="px-3 py-1.5 rounded-xl border text-center font-black text-base shrink-0 ${scoreColor}">
                    ${parseFloat(item.score).toFixed(1)}
                    <span class="block text-[9px] font-bold uppercase tracking-wider text-gray-400">Điểm</span>
                </div>
            </div>
        `;
    }).join('');
}

function clearExamHistory() {
    if (confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử thi không?")) {
        localStorage.removeItem('school_exam_history');
        renderExamHistory();
        updateExamLobbyStats();
    }
}

// GÁN CÁC HÀM LÊN WINDOW ĐỂ GỌI TRỰC TIẾP TỪ GIAO DIỆN HTML
window.initExamModule = initExamModule;
window.setExamSubTab = setExamSubTab;
window.selectExamGrade = selectExamGrade;
window.selectExamPeriod = selectExamPeriod;
window.selectExamTopic = selectExamTopic;
window.selectExamTopicByIndex = selectExamTopicByIndex;
window.renderExamTopicChips = renderExamTopicChips;
window.selectExamSubject = selectExamSubject;
window.selectExamMode = selectExamMode;
window.startSelectedExam = startSelectedExam;
window.setExamCustomCode = setExamCustomCode;
window.randomizeExamCode = randomizeExamCode;
window.toggleShuffleOption = toggleShuffleOption;
window.scrambleQuestionOptions = scrambleQuestionOptions;
window.openMultiCodeModal = openMultiCodeModal;
window.closeMultiCodeModal = closeMultiCodeModal;
window.generateMultiCodeBatch = generateMultiCodeBatch;
window.renderBatchTabs = renderBatchTabs;
window.switchBatchTab = switchBatchTab;
window.renderBatchTabContent = renderBatchTabContent;
window.startExamWithSpecificCode = startExamWithSpecificCode;
window.printMultiCodeBatch = printMultiCodeBatch;
window.selectAnswer = selectAnswer;
window.toggleFlagCurrentQuestion = toggleFlagCurrentQuestion;
window.prevQuestion = prevQuestion;
window.nextQuestion = nextQuestion;
window.jumpToQuestion = jumpToQuestion;
window.submitExamPrompt = submitExamPrompt;
window.confirmExitExam = confirmExitExam;
window.filterReviewQuestions = filterReviewQuestions;
window.saveAllMistakesToNotebook = saveAllMistakesToNotebook;
window.retryCurrentExam = retryCurrentExam;
window.backToExamLobby = backToExamLobby;
window.practiceMistakes = practiceMistakes;
window.clearMistakeNotebook = clearMistakeNotebook;
window.removeMistake = removeMistake;
window.filterMistakesByGrade = filterMistakesByGrade;
window.filterMistakesByPeriod = filterMistakesByPeriod;
window.renderMistakesPeriodFilterChips = renderMistakesPeriodFilterChips;
window.filterMistakesBySubject = filterMistakesBySubject;
window.clearExamHistory = clearExamHistory;
window.filterDuplicateQuestionsByText = filterDuplicateQuestionsByText;
window.getTakenExamQuestionIds = getTakenExamQuestionIds;
window.saveTakenExamQuestionIds = saveTakenExamQuestionIds;
window.getTakenQuestionsCountForSubject = getTakenQuestionsCountForSubject;
window.resetTakenExamHistory = resetTakenExamHistory;
window.updateExamTakenCountBadge = updateExamTakenCountBadge;

// BINDING THUỘC TÍNH ĐẢO ĐỀ VÀ MÃ ĐỀ LÊN WINDOW
try {
    Object.defineProperty(window, 'activeExam', {
        get: function() { return activeExam; },
        set: function(val) { activeExam = val; },
        configurable: true
    });
    Object.defineProperty(window, 'examCurrentCode', {
        get: function() { return examCurrentCode; },
        set: function(val) { setExamCustomCode(val); },
        configurable: true
    });
    Object.defineProperty(window, 'multiCodeBatchData', {
        get: function() { return multiCodeBatchData; },
        set: function(val) { multiCodeBatchData = val; },
        configurable: true
    });
    Object.defineProperty(window, 'examShuffleQuestions', {
        get: function() { return examShuffleQuestions; },
        set: function(val) { examShuffleQuestions = !!val; },
        configurable: true
    });
    Object.defineProperty(window, 'examShuffleOptions', {
        get: function() { return examShuffleOptions; },
        set: function(val) { examShuffleOptions = !!val; },
        configurable: true
    });
} catch(e) {
    console.warn("Could not bind exam properties to window", e);
}

// GÁN CÁC HÀM THỜI KHÓA BIỂU & ĐIỀU HƯỚNG LÊN WINDOW
window.setTkbTab = setTkbTab;
window.renderTimetable = renderTimetable;
window.handleEditTkbTypeChange = handleEditTkbTypeChange;
window.loadEditTkbData = loadEditTkbData;
window.toggleEditTkb = toggleEditTkb;
window.importExcel = importExcel;
window.handleExcelUpload = handleExcelUpload;
window.switchTab = switchTab;
window.initApp = initApp;
window.toggleSidebar = toggleSidebar;
window.updateSidebarUI = updateSidebarUI;
window.initSidebarState = initSidebarState;
window.handleTeacherSearch = handleTeacherSearch;
window.removeVietnameseTones = removeVietnameseTones;

// GÁN CÁC HÀM QUẢN LÝ CÁ NHÂN, HỎI ĐÁP, HỌC SINH & CÀI ĐẶT
window.initProfileModule = initProfileModule;
window.loadProfileUI = loadProfileUI;
window.renderProfileHeaderBanner = renderProfileHeaderBanner;
window.renderProfileDisplay = renderProfileDisplay;
window.openProfileSettingsModal = openProfileSettingsModal;
window.closeProfileSettingsModal = closeProfileSettingsModal;
window.handleSaveProfileSettings = handleSaveProfileSettings;
window.setProfileSubTab = setProfileSubTab;
window.renderProfileGoals = renderProfileGoals;
window.openGoalModal = openGoalModal;
window.closeGoalModal = closeGoalModal;
window.handleSaveGoal = handleSaveGoal;
window.openAddGoalModal = openAddGoalModal;
window.deleteGoal = deleteGoal;
window.renderProfileTodos = renderProfileTodos;
window.handleProfileTodoSubmit = handleProfileTodoSubmit;
window.toggleTodoComplete = toggleTodoComplete;
window.deleteProfileTodo = deleteProfileTodo;
window.filterProfileTodos = filterProfileTodos;
window.setPomodoroMode = setPomodoroMode;
window.togglePomodoroTimer = togglePomodoroTimer;
window.resetPomodoroTimer = resetPomodoroTimer;
window.skipPomodoroSession = skipPomodoroSession;
window.setVaultSubTab = setVaultSubTab;
window.renderVaultNotes = renderVaultNotes;
window.handleVaultNoteSearch = handleVaultNoteSearch;
window.openAddNoteModal = openAddNoteModal;
window.closeQuickNoteModal = closeQuickNoteModal;
window.handleSaveQuickNote = handleSaveQuickNote;
window.togglePinNote = togglePinNote;
window.deleteQuickNote = deleteQuickNote;
window.renderVaultMistakes = renderVaultMistakes;
window.removeVaultMistake = removeVaultMistake;
window.setActiveProfileBadge = setActiveProfileBadge;

// Stubs tương thích ngược
window.updateProfileStudentSelect = function() {};
window.saveProfile = function() { if (typeof handleSaveProfileSettings === 'function') handleSaveProfileSettings(); };
window.renderSchedules = function() {};
window.deleteSchedule = function() {};
window.renderStudyPlans = function() {};
window.deleteStudyPlan = function() {};
window.toggleReminder = function() {};
window.renderQA = renderQA;
window.submitAnswer = function(id) { if (typeof submitAdvancedAnswer === 'function') submitAdvancedAnswer(id); };
window.renderSettings = renderSettings;
window.removeClass = removeClass;
window.renderStudents = renderStudents;
window.removeStudent = removeStudent;
window.updateStudentSelect = updateStudentSelect;
window.renderLeaderboard = renderLeaderboard;
window.renderStats = renderStats;
window.resetData = resetData;

// GÁN CÁC HÀM XÁC THỰC, ĐĂNG NHẬP & PHÂN QUYỀN LÊN WINDOW
window.initAuthModule = initAuthModule;
window.renderAuthHeaderUI = renderAuthHeaderUI;
window.renderHomeWelcomeBanner = renderHomeWelcomeBanner;
window.updateAdminPermissionsUI = updateAdminPermissionsUI;
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.switchAuthTab = switchAuthTab;
window.quickLoginAs = quickLoginAs;
window.handleAuthLoginSubmit = handleAuthLoginSubmit;
window.handleAuthRegisterSubmit = handleAuthRegisterSubmit;
window.handleRegisterRoleChange = handleRegisterRoleChange;
window.populateRegisterClasses = populateRegisterClasses;
window.togglePasswordVisibility = togglePasswordVisibility;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.toggleUserDropdown = toggleUserDropdown;
window.closeUserDropdown = closeUserDropdown;
window.showAuthToast = showAuthToast;
window.checkPermission = checkPermission;

try {
    Object.defineProperty(window, 'currentAuthUser', {
        get: function() { return currentAuthUser; },
        set: function(val) { currentAuthUser = val; },
        configurable: true
    });
    Object.defineProperty(window, 'authAccounts', {
        get: function() { return authAccounts; },
        set: function(val) { authAccounts = val; },
        configurable: true
    });
} catch(e) {
    console.warn("Could not bind auth properties to window", e);
}

// ==============================================================================
// MODULE ĐĂNG NHẬP, ĐĂNG KÝ VÀ PHÂN QUYỀN (AUTH)
// ==============================================================================

const DEFAULT_USERS = [
    { username: 'adim', password: '123', name: 'Quản Trị Viên', role: 'admin', avatar: '👑' },
    { username: 'admin', password: '123', name: 'Quản Trị Viên', role: 'admin', avatar: '👑' },
    { username: 'hocsinh', password: '123', name: 'Học Sinh Demo', role: 'student', className: '11A3', avatar: '🎒' }
];

var users = JSON.parse(localStorage.getItem('school_users')) || DEFAULT_USERS;
currentUser = JSON.parse(localStorage.getItem('school_current_user')) || null;

// Tự động chạy khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    renderAuthUI();
    populateRegClasses();
    initStunning3DEffects();
});

function populateRegClasses() {
    const sel = document.getElementById('auth-reg-class-select');
    if (sel && typeof classes !== 'undefined') {
        sel.innerHTML = classes.map(c => `<option value="${c}">Lớp ${c}</option>`).join('');
    }
}

function renderAuthUI() {
    const headerContainer = document.getElementById('auth-header-container');
    const banner = document.getElementById('home-auth-banner');
    const isAdmin = currentUser && currentUser.role === 'admin';

    // 1. Nút trên góc phải Header
    if (typeof renderAuthHeaderUI === 'function') {
        renderAuthHeaderUI();
    }

    // 2. Banner chào mừng ở Màn hình chính
    if (banner) {
        if (currentUser) {
            banner.className = "bg-white/80 backdrop-blur-xl rounded-3xl p-4 sm:p-5 border border-white/90 shadow-md shadow-indigo-100/40 flex items-center justify-between transition hover:shadow-lg";
            banner.innerHTML = `
                <div class="flex items-center gap-3 sm:gap-4">
                    <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${isAdmin ? 'from-amber-50 to-orange-100 border-amber-200/60' : 'from-emerald-50 to-teal-100 border-emerald-200/60'} border shadow-inner flex items-center justify-center text-3xl shrink-0 p-1">
                        ${currentUser.avatar || (isAdmin ? '👑' : '🎒')}
                    </div>
                    <div>
                        <h3 class="font-black text-base sm:text-lg text-slate-800 leading-tight">
                            ${isAdmin ? 'Chào mừng bạn trở lại! 👋' : `Xin chào, ${currentUser.name}! 🌟`}
                        </h3>
                        <p class="text-xs text-slate-500 font-bold mt-0.5 flex items-center gap-1">
                            ${isAdmin ? 'Chúc bạn một ngày làm việc và quản lý học đường thật hiệu quả 🚀' : `Học sinh Lớp ${currentUser.className || '12A1'} • Chúc bạn một ngày học tập hứng khởi!`}
                        </p>
                    </div>
                </div>`;
        } else {
            banner.className = "bg-white/80 backdrop-blur-xl rounded-3xl p-4 sm:p-5 border border-white/90 shadow-md shadow-indigo-100/40 flex items-center justify-between transition hover:shadow-lg";
            banner.innerHTML = `
                <div class="flex items-center gap-3 sm:gap-4">
                    <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200/60 shadow-inner flex items-center justify-center text-3xl shrink-0 p-1">
                        🏫
                    </div>
                    <div>
                        <h3 class="font-black text-base sm:text-lg text-slate-800 leading-tight">Chào mừng đến Sổ Tay Học Đường!</h3>
                        <p class="text-xs text-slate-500 font-medium mt-0.5">Trường THPT Nam Lương Sơn • Đăng nhập để xem thời khóa biểu và lưu lịch thi.</p>
                    </div>
                </div>
                <button onclick="openAuthModal('login')" class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-2xl text-xs font-black transition active:scale-95 flex items-center gap-1.5 shrink-0 shadow-md">
                    <i class="fa-solid fa-right-to-bracket text-xs"></i>
                    <span>Đăng nhập</span>
                </button>`;
        }
    }

    if (typeof updateUserDropdownContent === 'function') {
        updateUserDropdownContent();
    }

    // 3. Phân quyền: Ẩn/hiện khu vực Admin ở Trang chủ, TKB và Cài đặt
    const homeAdmin = document.getElementById('home-admin-section');
    if (homeAdmin) homeAdmin.classList.toggle('hidden', !isAdmin);

    const toggleLock = (allowId, lockId) => {
        const allowEl = document.getElementById(allowId);
        const lockEl = document.getElementById(lockId);
        if (allowEl) allowEl.classList.toggle('hidden', !isAdmin);
        if (lockEl) lockEl.classList.toggle('hidden', isAdmin);
    };
    toggleLock('tkb-admin-allowed-box', 'tkb-admin-locked-box');
    toggleLock('settings-admin-allowed-box', 'settings-admin-locked-box');
}

// Các hàm phụ trợ giao diện (Menu tài khoản, Ẩn/hiện mật khẩu, Thông báo)
function toggleUserDropdown() {
    const menu = document.getElementById('user-dropdown-menu');
    if (currentUser) {
        document.getElementById('user-dropdown-name').innerText = currentUser.name;
        document.getElementById('user-dropdown-avatar').innerText = currentUser.avatar || '👤';
        document.getElementById('user-dropdown-badge').innerText = currentUser.role === 'admin' ? '👑 Admin' : '🎒 Học sinh';
    }
    menu.classList.toggle('hidden');
}

function closeUserDropdown() {
    document.getElementById('user-dropdown-menu').classList.add('hidden');
}

function handleRegisterRoleChange(role) {
    document.getElementById('auth-reg-class-field').classList.toggle('hidden', role !== 'student');
    document.getElementById('auth-reg-subject-field').classList.toggle('hidden', role !== 'teacher');
}

function togglePasswordVisibility(inputId) {
    const inp = document.getElementById(inputId);
    inp.type = inp.type === 'password' ? 'text' : 'password';
}

function showToast(msg) {
    const toast = document.getElementById('auth-toast');
    const msgEl = document.getElementById('auth-toast-message');
    if (msgEl) msgEl.innerText = msg;
    if (toast) {
        toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-3');
        setTimeout(() => toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-3'), 2500);
    }
}

// ==========================================
// HIỆU ỨNG 3D & HẠT SÁNG MA THUẬT (STUNNING 3D EFFECTS)
// ==========================================
function initStunning3DEffects() {
    initMagicalCanvas();
    initCard3DTilt();
}

function initMagicalCanvas() {
    const canvas = document.getElementById('bg-particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const dpr = window.devicePixelRatio || 1;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', resize);

    const colors = [
        'rgba(56, 189, 248, ',  // Sky Blue
        'rgba(168, 85, 247, ',  // Purple
        'rgba(244, 114, 182, ', // Pink Rose
        'rgba(251, 191, 36, ',  // Amber Gold
        'rgba(52, 211, 153, ',  // Emerald
        'rgba(99, 102, 241, '   // Indigo
    ];

    // Giảm số lượng xuống 6 hạt phát quang thanh nhã, bay theo chu kỳ có khoảng nghỉ
    const particleCount = 6;
    const particles = [];

    function resetParticle(p, isInitial = false) {
        p.x = Math.random() * (width || window.innerWidth);
        p.y = Math.random() * (height || window.innerHeight);
        p.radius = Math.random() * 2 + 1.2;
        p.color = colors[Math.floor(Math.random() * colors.length)];
        p.vx = (Math.random() - 0.5) * 0.16;
        p.vy = -Math.random() * 0.2 - 0.05; // Hơi bay nhẹ lên trên
        p.maxAlpha = Math.random() * 0.28 + 0.16;
        p.alpha = 0;
        
        // Chu kỳ trạng thái: sleeping -> appearing -> floating -> fading -> sleeping
        // Khởi tạo so le để các hạt không xuất hiện cùng lúc
        p.state = isInitial && Math.random() > 0.5 ? 'floating' : 'sleeping';
        p.timer = isInitial 
            ? Math.floor(Math.random() * 200) 
            : Math.floor(Math.random() * 240 + 180); // Nghỉ 3s - 7s
        p.floatDuration = Math.floor(Math.random() * 300 + 300); // Bay 5s - 10s
        if (p.state === 'floating') p.alpha = p.maxAlpha;
    }

    for (let i = 0; i < particleCount; i++) {
        const p = {};
        resetParticle(p, true);
        particles.push(p);
    }

    const mouse = { x: -9999, y: -9999, active: false };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    });

    window.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
            mouse.active = true;
        }
    }, { passive: true });

    window.addEventListener('mouseleave', () => { mouse.active = false; });
    window.addEventListener('touchend', () => { mouse.active = false; });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Cập nhật và vẽ từng hạt theo chu kỳ
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            if (p.state === 'sleeping') {
                p.timer--;
                if (p.timer <= 0) {
                    p.state = 'appearing';
                    p.timer = 70; // ~1.1s để sáng dần
                }
                continue;
            }

            if (p.state === 'appearing') {
                p.timer--;
                p.alpha = Math.min(p.maxAlpha, p.alpha + p.maxAlpha / 70);
                if (p.timer <= 0) {
                    p.state = 'floating';
                    p.timer = p.floatDuration;
                }
            } else if (p.state === 'floating') {
                p.timer--;
                if (p.timer <= 0) {
                    p.state = 'fading';
                    p.timer = 70; // ~1.1s để mờ dần
                }
            } else if (p.state === 'fading') {
                p.timer--;
                p.alpha = Math.max(0, p.alpha - p.maxAlpha / 70);
                if (p.timer <= 0 || p.alpha <= 0) {
                    resetParticle(p, false); // Kết thúc chu kỳ, chuyển sang nghỉ
                    continue;
                }
            }

            // Tương tác vật lý với chuột nếu hạt đang hiển thị
            if (mouse.active && p.alpha > 0.05) {
                const mdx = p.x - mouse.x;
                const mdy = p.y - mouse.y;
                const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                if (mdist < 120 && mdist > 0) {
                    const force = (1 - mdist / 120) * 1.5;
                    p.x += (mdx / mdist) * force;
                    p.y += (mdy / mdist) * force;
                }
            }

            p.x += p.vx;
            p.y += p.vy;

            // Vầng hào quang ngoài (Aura) dịu nhẹ
            const auraGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3.5);
            auraGrad.addColorStop(0, p.color + p.alpha + ')');
            auraGrad.addColorStop(1, p.color + '0)');

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * 3.5, 0, Math.PI * 2);
            ctx.fillStyle = auraGrad;
            ctx.fill();

            // Lõi hạt sáng trung tâm
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 1.2})`;
            ctx.fill();
        }

        requestAnimationFrame(animate);
    }
    animate();
}

function initCard3DTilt() {
    const cards = document.querySelectorAll('.tilt-card-3d');
    if (!cards || cards.length === 0) return;

    cards.forEach(card => {
        const glare = card.querySelector('.tilt-glare');
        const graphic = card.querySelector('.tilt-graphic');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const nx = (e.clientX - rect.left) / rect.width;
            const ny = (e.clientY - rect.top) / rect.height;

            const cx = (nx - 0.5) * 2; // -1 đến 1
            const cy = (ny - 0.5) * 2; // -1 đến 1

            const rotX = -cy * 13;
            const rotY = cx * 13;

            card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.035, 1.035, 1.035)`;

            if (graphic) {
                graphic.style.transform = `translate3d(${cx * 16}px, ${cy * 16}px, 42px) rotateZ(${cx * 3}deg)`;
            }

            if (glare) {
                glare.style.opacity = '0.7';
                glare.style.background = `radial-gradient(circle at ${nx * 100}% ${ny * 100}%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 70%)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            if (graphic) {
                graphic.style.transform = 'translate3d(0, 0, 0) rotateZ(0deg)';
            }
            if (glare) {
                glare.style.opacity = '0';
            }
        });
    });
}

// Tự kích hoạt nếu tài liệu đã sẵn sàng
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initStunning3DEffects, 100);
}


// ==============================================================================
// NÂNG CẤP KẾT QUẢ THẦN ĐÈN: LẬT BÀI 1.5S + BIỂU ĐỒ MẠNG NHỆN + GHIM MỤC TIÊU
// ==============================================================================

// 1. Ý TƯỞNG 3: Hàm vẽ Biểu đồ Mạng Nhện 6 Cạnh (Hexagon Radar Chart SVG)
function renderHollandRadarSVG(scoresObj) {
    const container = document.getElementById('res-holland-bars');
    if (!container) return;

    const keys = ['R', 'I', 'A', 'S', 'E', 'C'];
    const labels = { R: 'Thực tế (R)', I: 'Nghiên cứu (I)', A: 'Nghệ thuật (A)', S: 'Xã hội (S)', E: 'Quản lý (E)', C: 'Nghiệp vụ (C)' };
    const maxVal = Math.max(40, ...keys.map(k => Math.max(5, (scoresObj && scoresObj[k]) || 10)));

    const cx = 110, cy = 110, maxR = 72;
    // Tính tọa độ 6 đỉnh lục giác
    const getPoint = (index, ratio) => {
        const angle = (Math.PI / 3) * index - Math.PI / 2;
        return `${(cx + maxR * ratio * Math.cos(angle)).toFixed(1)},${(cy + maxR * ratio * Math.sin(angle)).toFixed(1)}`;
    };

    const grid100 = keys.map((_, i) => getPoint(i, 1)).join(' ');
    const grid66  = keys.map((_, i) => getPoint(i, 0.66)).join(' ');
    const grid33  = keys.map((_, i) => getPoint(i, 0.33)).join(' ');
    const dataPoints = keys.map((k, i) => {
        const ratio = Math.min(1, Math.max(0.18, ((scoresObj && scoresObj[k]) || 5) / maxVal));
        return getPoint(i, ratio);
    }).join(' ');

    // Chữ ở 6 đỉnh
    const axisLabelsSvg = keys.map((k, i) => {
        const angle = (Math.PI / 3) * i - Math.PI / 2;
        const lx = cx + (maxR + 22) * Math.cos(angle);
        const ly = cy + (maxR + 18) * Math.sin(angle);
        return `<text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle" class="fill-indigo-950 font-black text-[11px]">${k}</text>`;
    }).join('');

    // Danh sách chú thích bên phải biểu đồ
    const listHtml = keys.map(k => {
        const val = Math.max(0, (scoresObj && scoresObj[k]) || 0);
        const pct = Math.min(100, Math.round((val / maxVal) * 100));
        return `
            <div class="flex items-center justify-between bg-white p-2 rounded-xl border border-indigo-100 shadow-2xs text-xs">
                <span class="font-bold text-slate-700">${labels[k]}</span>
                <span class="font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg">${pct}%</span>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="sm:col-span-5 flex justify-center">
            <svg viewBox="0 0 220 220" class="w-48 h-48 sm:w-52 sm:h-52 drop-shadow-sm">
                <!-- Lưới lục giác 3 tầng -->
                <polygon points="${grid100}" fill="#eef2ff" stroke="#c7d2fe" stroke-width="1.5"/>
                <polygon points="${grid66}" fill="none" stroke="#c7d2fe" stroke-width="1" stroke-dasharray="3,3"/>
                <polygon points="${grid33}" fill="none" stroke="#c7d2fe" stroke-width="1" stroke-dasharray="3,3"/>
                <!-- Trục nối tâm -->
                ${keys.map((_, i) => `<line x1="${cx}" y1="${cy}" x2="${getPoint(i, 1).split(',')[0]}" y2="${getPoint(i, 1).split(',')[1]}" stroke="#e0e7ff" stroke-width="1"/>`).join('')}
                <!-- Đa giác năng lực của học sinh -->
                <polygon points="${dataPoints}" fill="rgba(124, 58, 237, 0.35)" stroke="#7c3aed" stroke-width="2.5" />
                ${axisLabelsSvg}
            </svg>
        </div>
        <div class="sm:col-span-7 grid grid-cols-2 gap-2">
            ${listHtml}
        </div>
    `;
}

// 2. Ý TƯỞNG 5: Hàm Ghim nghề nghiệp làm mục tiêu vào trang Quản lý cá nhân
function pinCareerToProfile() {
    const careerTitleEl = document.getElementById('res-leaf-title');
    const majorsEl = document.getElementById('res-majors');
    const mbtiEl = document.getElementById('res-mbti-type');

    const careerTitle = careerTitleEl ? careerTitleEl.innerText.trim() : 'Kỹ sư Công nghệ';
    const majorsText = majorsEl ? majorsEl.innerText.split(',')[0].trim() : careerTitle;
    const mbtiText = mbtiEl ? mbtiEl.innerText.split('-')[0].trim() : '';

    // Cập nhật vào biến myProfile của trang Quản lý cá nhân
    if (typeof myProfile !== 'undefined') {
        myProfile.targetUni = `${careerTitle} (${majorsText})`;
        myProfile.motto = `Định hướng ${mbtiText}: Quyết tâm chinh phục ngành ${majorsText}!`;
        localStorage.setItem('my_profile', JSON.stringify(myProfile));
        if (typeof renderProfileHeaderBanner === 'function') renderProfileHeaderBanner();
    }

    // Thưởng +30 EXP chăm chỉ
    if (typeof addGamificationExp === 'function') {
        addGamificationExp(30, `Xác định mục tiêu nghề nghiệp: ${careerTitle}`);
    }

    // Đổi trạng thái nút bấm và thông báo
    const btn = document.getElementById('btn-pin-career');
    if (btn) {
        btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>Đã ghim vào Quản lý cá nhân (+30 EXP)!</span>`;
        btn.className = "bg-emerald-400 text-emerald-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2";
    }

    if (typeof showAuthToast === 'function') {
        showAuthToast(`🎯 Đã ghim "${careerTitle}" làm mục tiêu phấn đấu trong Quản lý cá nhân!`, 'fa-thumbtack', 'success');
    }
}

// 3. Ý TƯỞNG 4: Tự động kích hoạt Màn chờ 1.5s + Bắn pháo giấy + Vẽ Radar khi hiện kết quả
window.isGrandRevealing = false;
const _origFinishAkinator = window.finishAkinatorQuiz || window.showCareerResult;
window.triggerGrandReveal = function(scoresObj) {
    if (window.isGrandRevealing) return;
    window.isGrandRevealing = true;

    const treeScreen = document.getElementById('career-tree-screen');
    const loaderScreen = document.getElementById('career-reveal-loader');
    const resultScreen = document.getElementById('career-result-screen');

    if (treeScreen) treeScreen.classList.add('hidden');
    if (resultScreen) resultScreen.classList.add('hidden');
    if (loaderScreen) loaderScreen.classList.remove('hidden');

    // Khôi phục lại nút Ghim
    const pinBtn = document.getElementById('btn-pin-career');
    if (pinBtn) {
        pinBtn.innerHTML = `<i class="fa-solid fa-thumbtack"></i> <span>Ghim làm mục tiêu vào Quản lý cá nhân</span>`;
        pinBtn.className = "bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-purple-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-lg transition transform active:scale-95 flex items-center gap-2 cursor-pointer";
    }

    setTimeout(() => {
        if (loaderScreen) loaderScreen.classList.add('hidden');
        if (resultScreen) resultScreen.classList.remove('hidden');

        // Vẽ biểu đồ mạng nhện 6 cạnh
        if (scoresObj) renderHollandRadarSVG(scoresObj);

        // Bắn pháo giấy chúc mừng
        if (typeof confetti === 'function') {
            confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        }

        setTimeout(() => {
            window.isGrandRevealing = false;
        }, 800);
    }, 1500);
};

// Tự động bắt sự kiện khi khung #career-result-screen mở ra để vẽ biểu đồ Radar & bắn pháo giấy
function initCareerResultObserver() {
    const resScreen = document.getElementById('career-result-screen');
    if (!resScreen) return;

    const observer = new MutationObserver(() => {
        if (!resScreen.classList.contains('hidden') && !window.isGrandRevealing) {
            // Tính điểm 6 nhóm Holland hiện tại để vẽ biểu đồ lục giác
            const scores = (typeof window.lastCalculatedHollandScores !== 'undefined' && window.lastCalculatedHollandScores)
                ? window.lastCalculatedHollandScores
                : { R: 15, I: 20, A: 15, S: 15, E: 15, C: 15 };
            if (!window.lastCalculatedHollandScores && typeof akinatorAnswers !== 'undefined') {
                akinatorAnswers.forEach(ans => {
                    if (!ans.q) return;
                    if (ans.choice === 'YES') {
                        scores[ans.q.group] = (scores[ans.q.group] || 0) + 20;
                        if (ans.q.subGroup) scores[ans.q.subGroup] = (scores[ans.q.subGroup] || 0) + 8;
                    } else if (ans.choice === 'PROBABLY') {
                        scores[ans.q.group] = (scores[ans.q.group] || 0) + 10;
                    }
                });
            }
            window.triggerGrandReveal(scores);
        }
    });
    observer.observe(resScreen, { attributes: true, attributeFilter: ['class'] });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCareerResultObserver);
} else {
    initCareerResultObserver();
}

// Gán toàn cục
window.renderHollandRadarSVG = renderHollandRadarSVG;
window.pinCareerToProfile = pinCareerToProfile;