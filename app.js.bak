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

    const askForm = document.getElementById('ask-form');
    if(askForm) {
        askForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const subject = document.getElementById('qa-subject').value;
            const content = document.getElementById('qa-content').value.trim();
            if(subject && content) {
                qaList.push({ id: Date.now(), subject: subject, question: content, answer: null, timestamp: new Date().toLocaleString('vi-VN') });
                localStorage.setItem('school_qa', JSON.stringify(qaList));
                this.reset(); renderQA(); alert("Đã gửi câu hỏi ẩn danh thành công!");
            }
        });
    }

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

// 3. Quản lý danh tính cá nhân & Lập kế hoạch học tập
function loadProfileUI() {
    const classSelect = document.getElementById('profile-class-select');
    if(classSelect) {
        classSelect.innerHTML = '<option value="">-- Chọn lớp --</option>';
        classes.forEach(c => classSelect.innerHTML += `<option value="${c}">Lớp ${c}</option>`);
        
        if(myProfile.className) {
            classSelect.value = myProfile.className;
            updateProfileStudentSelect();
            setTimeout(() => {
                const stdSelect = document.getElementById('profile-student-select');
                if(stdSelect) stdSelect.value = myProfile.studentName;
            }, 50);
        }
    }
    renderProfileDisplay();

    const scheduleForm = document.getElementById('schedule-form');
    if(scheduleForm && !scheduleForm.dataset.bound) {
        scheduleForm.dataset.bound = "true";
        scheduleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const time = document.getElementById('schedule-time').value;
            const task = document.getElementById('schedule-task').value.trim();
            if(time && task) {
                mySchedules.push({ id: Date.now(), time, task });
                localStorage.setItem('my_schedules', JSON.stringify(mySchedules));
                this.reset();
                renderSchedules();
            }
        });
    }

    const studyPlanForm = document.getElementById('study-plan-form');
    if(studyPlanForm && !studyPlanForm.dataset.bound) {
        studyPlanForm.dataset.bound = "true";
        studyPlanForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const subject = document.getElementById('study-subject').value;
            const topic = document.getElementById('study-topic').value.trim();
            const date = document.getElementById('study-date').value;
            if(subject && topic && date) {
                myStudyPlans.push({ id: Date.now(), subject, topic, date });
                localStorage.setItem('my_study_plans', JSON.stringify(myStudyPlans));
                this.reset();
                renderStudyPlans();
            }
        });
    }
    
    const toggle = document.getElementById('reminder-toggle');
    if(toggle) toggle.checked = isReminderOn;

    renderSchedules();
    renderStudyPlans();
}

function updateProfileStudentSelect() {
    const classSelect = document.getElementById('profile-class-select');
    const classVal = classSelect ? classSelect.value : '';
    const select = document.getElementById('profile-student-select');
    if(!select) return;
    select.innerHTML = '<option value="">-- Chọn tên --</option>';
    if(classVal && students[classVal]) {
        students[classVal].sort().forEach(s => select.innerHTML += `<option value="${s}">${s}</option>`);
    }
}

function saveProfile() {
    const classSelect = document.getElementById('profile-class-select');
    const className = classSelect ? classSelect.value : '';
    const studentSelect = document.getElementById('profile-student-select');
    const studentName = studentSelect ? studentSelect.value : '';
    if(!className || !studentName) return alert("Vui lòng chọn đầy đủ Lớp và Tên của bạn!");
    myProfile = { className, studentName };
    localStorage.setItem('my_profile', JSON.stringify(myProfile));
    renderProfileDisplay();
    alert("Đã lưu danh tính cá nhân thành công!");
}

function renderProfileDisplay() {
    const nameDisplay = document.getElementById('profile-name-display');
    const classDisplay = document.getElementById('profile-class-display');
    if(!nameDisplay) return;
    if(myProfile.studentName) {
        nameDisplay.innerText = myProfile.studentName;
        classDisplay.innerText = `Học sinh lớp ${myProfile.className}`;
    } else {
        nameDisplay.innerText = "Chưa cài đặt";
        classDisplay.innerText = "Vui lòng cập nhật thông tin";
    }
}

function renderSchedules() {
    const list = document.getElementById('schedule-list');
    if(!list) return;
    list.innerHTML = '';
    if(mySchedules.length === 0) return list.innerHTML = '<p class="text-xs text-gray-400 text-center italic py-2">Chưa có lịch trình.</p>';
    mySchedules.sort((a, b) => a.time.localeCompare(b.time));
    mySchedules.forEach(item => {
        list.innerHTML += `<div class="flex items-center justify-between p-2 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 transition"><div class="flex items-center gap-3"><span class="font-bold text-blue-600 text-sm bg-blue-100 px-2 py-0.5 rounded">${item.time}</span><span class="text-sm text-gray-700 font-medium">${item.task}</span></div><button onclick="deleteSchedule(${item.id})" class="text-gray-400 hover:text-red-500 px-2"><i class="fa-solid fa-trash-can"></i></button></div>`;
    });
}

function renderStudyPlans() {
    const list = document.getElementById('study-plan-list');
    if(!list) return;
    list.innerHTML = '';
    if(myStudyPlans.length === 0) return list.innerHTML = '<p class="text-xs text-gray-400 text-center italic py-2">Chưa có kế hoạch ôn tập.</p>';
    myStudyPlans.sort((a, b) => a.date.localeCompare(b.date));
    myStudyPlans.forEach(item => {
        const [y, m, d] = item.date.split('-');
        const formattedDate = `${d}/${m}/${y}`;
        list.innerHTML += `<div class="flex flex-col p-3 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 transition"><div class="flex justify-between items-start mb-1"><span class="font-bold text-emerald-600 text-xs bg-emerald-100 px-2 py-0.5 rounded">Môn ${item.subject}</span><span class="text-xs text-gray-500 font-bold"><i class="fa-regular fa-calendar text-emerald-500"></i> ${formattedDate}</span></div><div class="flex justify-between items-center"><span class="text-sm text-gray-700 font-medium">${item.topic}</span><button onclick="deleteStudyPlan(${item.id})" class="text-gray-400 hover:text-red-500 px-2"><i class="fa-solid fa-trash-can"></i></button></div></div>`;
    });
}

function deleteSchedule(id) {
    if(confirm("Xóa lịch trình này?")) {
        mySchedules = mySchedules.filter(s => s.id !== id);
        localStorage.setItem('my_schedules', JSON.stringify(mySchedules));
        renderSchedules();
    }
}

function deleteStudyPlan(id) {
    if(confirm("Xóa kế hoạch ôn tập này?")) {
        myStudyPlans = myStudyPlans.filter(p => p.id !== id);
        localStorage.setItem('my_study_plans', JSON.stringify(myStudyPlans));
        renderStudyPlans();
    }
}

function toggleReminder() {
    const toggle = document.getElementById('reminder-toggle');
    isReminderOn = toggle ? toggle.checked : true;
    localStorage.setItem('my_reminder_status', JSON.stringify(isReminderOn));
}

let lastAlertTime = '';
setInterval(() => {
    if(!isReminderOn) return;
    const now = new Date();
    const currentHour = now.getHours().toString().padStart(2, '0');
    const currentMin = now.getMinutes().toString().padStart(2, '0');
    const timeStr = `${currentHour}:${currentMin}`;
    
    if(lastAlertTime === timeStr) return;
    
    const dueSchedules = mySchedules.filter(s => s.time === timeStr);
    if(dueSchedules.length > 0) {
        lastAlertTime = timeStr;
        let tasks = dueSchedules.map(s => s.task).join('\n- ');
        alert(`⏰ ĐẾN GIỜ RỒI BẠN ƠI!\n\nBạn có lịch trình cần làm ngay bây giờ:\n- ${tasks}`);
    }
}, 10000);

// 4. Hỏi đáp Ẩn danh
function renderQA() {
    const container = document.getElementById('qa-list');
    if(!container) return;
    container.innerHTML = '';
    
    if(qaList.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center text-sm mt-5">Chưa có câu hỏi nào trên tường.</p>';
        return;
    }

    const sortedQA = [...qaList].sort((a, b) => b.id - a.id);

    sortedQA.forEach(qa => {
        const hasAnswer = !!qa.answer;
        const statusBadge = hasAnswer 
            ? `<span class="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-bold">Đã giải đáp</span>`
            : `<span class="bg-yellow-100 text-yellow-700 text-[10px] px-2 py-1 rounded-full font-bold">Đang chờ</span>`;

        const answerSection = hasAnswer
            ? `<div class="mt-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <p class="text-xs font-bold text-blue-800 mb-1"><i class="fa-solid fa-graduation-cap"></i> Giáo viên trả lời:</p>
                  <p class="text-sm text-gray-800 leading-relaxed">${qa.answer}</p>
               </div>`
            : `<div class="mt-3 flex gap-2">
                  <input type="text" id="reply-input-${qa.id}" placeholder="Giáo viên nhập câu trả lời..." class="flex-1 text-sm border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400">
                  <button onclick="submitAnswer(${qa.id})" class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1 rounded-lg text-sm font-bold transition"><i class="fa-solid fa-reply"></i></button>
               </div>`;

        container.innerHTML += `
            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div class="flex justify-between items-start mb-2">
                    <span class="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded"><i class="fa-solid fa-book mr-1"></i> Môn ${qa.subject}</span>
                    ${statusBadge}
                </div>
                <p class="text-gray-800 text-sm font-medium mb-1">"${qa.question}"</p>
                <p class="text-[10px] text-gray-400 mb-2">${qa.timestamp}</p>
                ${answerSection}
            </div>
        `;
    });
}

function submitAnswer(id) {
    const input = document.getElementById(`reply-input-${id}`);
    if(!input) return;
    const answer = input.value.trim();
    if(answer) {
        const qIndex = qaList.findIndex(q => q.id === id);
        if(qIndex !== -1) {
            qaList[qIndex].answer = answer;
            localStorage.setItem('school_qa', JSON.stringify(qaList));
            renderQA();
        }
    }
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

function initApp() {
    populateClassSelect(); 
    loadProfileUI(); 
    renderQA();
    renderSettings(); 
    if(typeof initSubjectSelection === 'function') initSubjectSelection();
    if(typeof initExamModule === 'function') initExamModule();
    switchTab('home');
}

function switchTab(tabName) {
    const tabs = ['home', 'timetable', 'profile', 'grade', 'qa', 'settings', 'career', 'exam'];
    const backBtn = document.getElementById('btn-back'); 
    const spacer = document.getElementById('header-spacer');
    
    if(backBtn) {
        if(tabName === 'home') backBtn.classList.add('hidden'); 
        else backBtn.classList.remove('hidden'); 
    }
    if(spacer) {
        if(tabName === 'home') spacer.classList.add('hidden'); 
        else spacer.classList.remove('hidden'); 
    }
    
    tabs.forEach(tab => { 
        const view = document.getElementById(`view-${tab}`); 
        if(view) {
            if(tab === tabName) view.classList.remove('hidden'); 
            else view.classList.add('hidden'); 
        }
    });
    
    if(tabName === 'timetable') { setTkbTab(currentTkbTab); }
    if(tabName === 'exam' && typeof initExamModule === 'function') { initExamModule(); }
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
            for(let className in sangParsed) {
                timetables.main[className] = sangParsed[className];
                if(!classes.includes(className)) {
                    classes.push(className);
                    students[className] = [];
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

// 1. Khởi động bài đố Thần Đèn 17 câu hỏi
function startDecisionTree() {
    window.userSubjects = typeof getSelectedSubjects === 'function' ? getSelectedSubjects() : ['Toán', 'Văn', 'Tiếng Anh'];
    localStorage.setItem('school_user_subjects', JSON.stringify(window.userSubjects));

    akinatorIndex = 0;
    akinatorAnswers = [];

    document.getElementById('career-intro-screen').classList.add('hidden');
    document.getElementById('career-result-screen').classList.add('hidden');
    document.getElementById('career-tree-screen').classList.remove('hidden');

    renderAkinatorQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 2. Hiển thị câu hỏi hiện tại cho Thần Đèn
function renderAkinatorQuestion() {
    if (akinatorIndex >= AKINATOR_17_QUESTIONS.length) {
        finishAkinatorGame();
        return;
    }

    const q = AKINATOR_17_QUESTIONS[akinatorIndex];
    const total = AKINATOR_17_QUESTIONS.length;
    const curNum = akinatorIndex + 1;
    const pct = Math.round((curNum / total) * 100);

    const depthLabel = document.getElementById('tree-depth-label');
    const percentLabel = document.getElementById('tree-percent-label');
    const progressBar = document.getElementById('tree-progress-bar');
    const questionText = document.getElementById('tree-question-text');
    const questionDesc = document.getElementById('tree-question-desc');
    const moodText = document.getElementById('genie-mood-text');
    const backBtn = document.getElementById('btn-tree-back');

    if (depthLabel) depthLabel.innerText = `Câu hỏi ${curNum} / ${total}`;
    if (percentLabel) percentLabel.innerText = `Độ đọc vị: ${pct}%`;
    if (progressBar) progressBar.style.width = `${pct}%`;
    if (questionText) questionText.innerText = q.q;
    if (questionDesc) questionDesc.innerText = q.desc || '';

    // Cập nhật câu thoại tâm trạng của Thần Đèn
    if (moodText) {
        if (curNum <= 3) moodText.innerText = "Thần Đèn đang tập trung lắng nghe tần số tư duy của ngươi...";
        else if (curNum <= 7) moodText.innerText = "Sóng tư duy Holland đang truyền tín hiệu vào chiếc đèn thần!";
        else if (curNum <= 12) moodText.innerText = "Các chiều không gian tâm lý MBTI của ngươi đang dần hội tụ!";
        else if (curNum <= 16) moodText.innerText = "Thần lực đang sôi sục! Sắp giải mã trọn vẹn số mệnh tương lai!";
        else moodText.innerText = "Câu hỏi thứ 17 quyết định! Ta sắp hé lộ bức tranh nghề nghiệp hoàn hảo!";
    }

    if (backBtn) {
        if (akinatorIndex > 0) backBtn.classList.remove('hidden');
        else backBtn.classList.add('hidden');
    }
}

// 3. Xử lý khi bấm nút CÓ, KHÔNG hoặc BỎ QUA
function chooseDecision(choice) {
    if (akinatorIndex >= AKINATOR_17_QUESTIONS.length) return;

    akinatorAnswers.push({
        index: akinatorIndex,
        choice: choice,
        q: AKINATOR_17_QUESTIONS[akinatorIndex]
    });

    akinatorIndex++;

    if (akinatorIndex < AKINATOR_17_QUESTIONS.length) {
        renderAkinatorQuestion();
    } else {
        finishAkinatorGame();
    }
}

// 4. Quay lại câu trước
function backDecision() {
    if (akinatorIndex > 0) {
        akinatorAnswers.pop();
        akinatorIndex--;
        renderAkinatorQuestion();
    }
}

// 5. Kết thúc 17 câu và Thần Đèn đọc vị kết quả (Holland + MBTI)
function finishAkinatorGame() {
    // --- A. TÍNH ĐIỂM HOLLAND RIASEC ---
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    
    // --- B. TÍNH ĐIỂM 4 TRỤC MBTI (E-I, S-N, T-F, J-P) ---
    const mbtiScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

    akinatorAnswers.forEach(ans => {
        const q = ans.q;
        if (ans.choice === 'YES') {
            // Holland
            scores[q.group] += 20;
            scores[q.subGroup] += 6;
            // MBTI Plus
            if (q.mbtiPlus) {
                for (let k in q.mbtiPlus) mbtiScores[k] += q.mbtiPlus[k];
            }
        } else if (ans.choice === 'NO') {
            // MBTI Minus
            if (q.mbtiMinus) {
                for (let k in q.mbtiMinus) mbtiScores[k] += q.mbtiMinus[k];
            }
        } else if (ans.choice === 'SKIP') {
            // Trung lập
            scores[q.group] += 8;
            scores[q.subGroup] += 3;
            if (q.mbtiPlus) {
                for (let k in q.mbtiPlus) mbtiScores[k] += Math.round(q.mbtiPlus[k] * 0.4);
            }
            if (q.mbtiMinus) {
                for (let k in q.mbtiMinus) mbtiScores[k] += Math.round(q.mbtiMinus[k] * 0.4);
            }
        }
    });

    // 1. Phân định mã MBTI 4 ký tự
    const typeEI = (mbtiScores.I >= mbtiScores.E) ? "I" : "E";
    const typeSN = (mbtiScores.N >= mbtiScores.S) ? "N" : "S";
    const typeTF = (mbtiScores.T >= mbtiScores.F) ? "T" : "F";
    const typeJP = (mbtiScores.J >= mbtiScores.P) ? "J" : "P";
    const mbtiKey = `${typeEI}${typeSN}${typeTF}${typeJP}`;
    const mbtiInfo = MBTI_MASTER_DATA[mbtiKey] || MBTI_MASTER_DATA["INTJ"];

    // Tính phần trăm từng trục MBTI
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
        groupPct[k] = Math.min(100, Math.max(15, Math.round((scores[k] / 45) * 100)));
    }
    const sortedGroups = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
    const top1 = sortedGroups[0];
    const top2 = sortedGroups[1];
    const top3 = sortedGroups[2];
    const hollandCode = `${top1}${top2}${top3}`;
    const masterInfo = HOLLAND_MASTER_DATA[top1] || HOLLAND_MASTER_DATA["R"];

    // 3. Chuyển sang màn hình kết quả
    document.getElementById('career-tree-screen').classList.add('hidden');
    document.getElementById('career-result-screen').classList.remove('hidden');
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

    // B. Phổ điểm 6 nhóm Holland RIASEC
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

    // C. Cập nhật chi tiết kết quả
    const badgeEl = document.getElementById('res-holland-badge');
    if (badgeEl) badgeEl.innerText = `Mã Holland: ${hollandCode} • MBTI: ${mbtiKey} (${masterInfo.name.split('(')[0].trim()})`;

    const descEl = document.getElementById('res-desc');
    if (descEl) descEl.innerText = `${masterInfo.desc} Với phong cách ${mbtiInfo.name}, bạn có tiềm năng vượt trội khi đặt vào môi trường làm việc đề cao tư duy chủ động và đổi mới.`;

    const majorsEl = document.getElementById('res-majors');
    if (majorsEl) majorsEl.innerText = `${masterInfo.majors} — (Gợi ý thêm theo MBTI: ${mbtiInfo.careers})`;

    const jobsEl = document.getElementById('res-jobs');
    if (jobsEl) jobsEl.innerText = masterInfo.jobs;

    const adviceEl = document.getElementById('res-advice');
    if (adviceEl) adviceEl.innerText = `Lời khuyên cho ${mbtiKey} & ${hollandCode}: ${masterInfo.advice} Hãy luôn phát huy thế mạnh độc bản của bạn!`;

    // D. Lọc khối thi thực tế GDPT 2018 theo môn đã chọn
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
            blocksEl.innerHTML = `<span class="text-orange-700 font-bold">${masterInfo.blocks}</span>`;
            if (noteEl) noteEl.innerText = `💡 Khối thi đề xuất chuẩn là trên. Bạn có thể tự ôn thêm môn còn thiếu nhé!`;
        }
    }

    // E. Gợi ý mở rộng nhiều ngành nghề cùng khối thi
    if (typeof EXPANDED_MAJORS_DICTIONARY !== 'undefined') {
        const expandedList = EXPANDED_MAJORS_DICTIONARY[top1] || EXPANDED_MAJORS_DICTIONARY["R"];
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
    document.getElementById('career-intro-screen').classList.remove('hidden');
    document.getElementById('career-tree-screen').classList.add('hidden');
    document.getElementById('career-result-screen').classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Gán các hàm lên window để gọi từ HTML
window.startDecisionTree = startDecisionTree;
window.chooseDecision = chooseDecision;
window.backDecision = backDecision;
window.resetDecisionTree = resetDecisionTree;
window.renderAkinatorQuestion = renderAkinatorQuestion;
window.finishAkinatorGame = finishAkinatorGame;

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

// NGÂN HÀNG ĐỀ THI MẪU CHUẨN GDPT 2018 (OFFLINE-FIRST) - LỚP 12
const BUILTIN_EXAM_BANK_12 = {
    "Toán": [
        {
            id: "m12_1",
            subject: "Toán",
            grade: "12",
            period: "mid1",
            topic: "Ứng dụng đạo hàm khảo sát hàm số",
            content: "Cho hàm số y = f(x) có đạo hàm f'(x) = x(x - 1)(x + 2)² với mọi x ∈ ℝ. Số điểm cực trị của hàm số đã cho là:",
            options: ["A. 2", "B. 1", "C. 3", "D. 4"],
            correct: "A",
            explanation: "f'(x) = 0 có nghiệm bội chẵn x = -2 (không đổi dấu) và hai nghiệm đơn x = 0, x = 1 (đổi dấu). Vậy hàm số có đúng 2 điểm cực trị."
        },
        {
            id: "m12_2",
            subject: "Toán",
            grade: "12",
            period: "mid1",
            topic: "Ứng dụng đạo hàm khảo sát hàm số",
            content: "Đồ thị hàm số y = (2x + 1)/(x - 1) có đường tiệm cận đứng là đường thẳng:",
            options: ["A. x = 1", "B. x = 2", "C. y = 2", "D. y = 1"],
            correct: "A",
            explanation: "Mẫu số x - 1 = 0 ⇔ x = 1, khi x → 1 thì tử số bằng 3 ≠ 0 nên y → ±∞. Do đó x = 1 là tiệm cận đứng."
        },
        {
            id: "m12_3",
            subject: "Toán",
            grade: "12",
            period: "mid1",
            topic: "Ứng dụng đạo hàm khảo sát hàm số",
            content: "Đồ thị hàm số y = (3x - 1)/(x + 2) có đường tiệm cận ngang là đường thẳng:",
            options: ["A. y = 3", "B. y = -2", "C. x = -2", "D. y = 1/2"],
            correct: "A",
            explanation: "Tiệm cận ngang y = lim_{x → ±∞} (3x - 1)/(x + 2) = 3."
        },
        {
            id: "m12_4",
            subject: "Toán",
            grade: "12",
            period: "final1",
            topic: "Phương trình mũ & Lôgarit",
            content: "Tập xác định của hàm số y = log₂(x - 3) là:",
            options: ["A. (3; +∞)", "B. [3; +∞)", "C. (-∞; 3)", "D. ℝ \\ {3}"],
            correct: "A",
            explanation: "Biểu thức dưới dấu logarit phải dương: x - 3 > 0 ⇔ x > 3."
        },
        {
            id: "m12_5",
            subject: "Toán",
            grade: "12",
            period: "final1",
            topic: "Phương trình mũ & Lôgarit",
            content: "Nghiệm của phương trình 2^(x + 1) = 16 là:",
            options: ["A. x = 3", "B. x = 4", "C. x = 2", "D. x = 5"],
            correct: "A",
            explanation: "2^(x + 1) = 2⁴ ⇔ x + 1 = 4 ⇔ x = 3."
        },
        {
            id: "m12_6",
            subject: "Toán",
            grade: "12",
            period: "final1",
            topic: "Tọa độ không gian Oxyz",
            content: "Trong không gian Oxyz, cho mặt cầu (S): (x - 1)² + (y + 2)² + (z - 3)² = 16. Tọa độ tâm I và bán kính R của (S) là:",
            options: ["A. I(1; -2; 3), R = 4", "B. I(-1; 2; -3), R = 4", "C. I(1; -2; 3), R = 16", "D. I(-1; 2; -3), R = 16"],
            correct: "A",
            explanation: "Tâm I(1; -2; 3), bán kính R = √16 = 4."
        },
        {
            id: "m12_7",
            subject: "Toán",
            grade: "12",
            period: "final1",
            topic: "Tọa độ không gian Oxyz",
            content: "Trong không gian Oxyz, véc tơ pháp tuyến của mặt phẳng (P): 2x - 3y + z - 5 = 0 là:",
            options: ["A. n = (2; -3; 1)", "B. n = (2; 3; 1)", "C. n = (2; -3; -5)", "D. n = (-3; 1; -5)"],
            correct: "A",
            explanation: "Véc tơ pháp tuyến n = (A; B; C) = (2; -3; 1)."
        },
        {
            id: "m12_8",
            subject: "Toán",
            grade: "12",
            period: "mid2",
            topic: "Nguyên hàm & Tích phân",
            content: "Họ nguyên hàm của hàm số f(x) = e^(2x) là:",
            options: ["A. (1/2)e^(2x) + C", "B. 2e^(2x) + C", "C. e^(2x) + C", "D. (1/2)e^x + C"],
            correct: "A",
            explanation: "∫ e^(ax+b) dx = (1/a) e^(ax+b) + C. Với a = 2: (1/2) e^(2x) + C."
        },
        {
            id: "m12_9",
            subject: "Toán",
            grade: "12",
            period: "mid2",
            topic: "Nguyên hàm & Tích phân",
            content: "Giá trị của tích phân I = ∫₀¹ (2x + 1) dx bằng:",
            options: ["A. 2", "B. 1", "C. 3", "D. 4"],
            correct: "A",
            explanation: "I = [x² + x] từ 0 đến 1 = (1 + 1) - 0 = 2."
        },
        {
            id: "m12_10",
            subject: "Toán",
            grade: "12",
            period: "final2",
            topic: "Xác suất có điều kiện",
            content: "Cho hai biến cố A và B có P(B) = 0,5 và P(A ∩ B) = 0,2. Xác suất có điều kiện P(A|B) bằng:",
            options: ["A. 0,4", "B. 0,1", "C. 0,7", "D. 0,25"],
            correct: "A",
            explanation: "Công thức xác suất có điều kiện: P(A|B) = P(A ∩ B) / P(B) = 0,2 / 0,5 = 0,4."
        },
        {
            id: "m12_extra_1",
            subject: "Toán",
            grade: "12",
            period: "mid1",
            topic: "Ứng dụng đạo hàm khảo sát hàm số",
            content: "Đường tiệm cận ngang của đồ thị hàm số y = (2x + 1) / (x - 1) là:",
            options: ["A. y = 2", "B. x = 1", "C. y = 1", "D. y = -1"],
            correct: "A",
            explanation: "lim_{x → ±∞} (2x + 1)/(x - 1) = 2. Vậy đường thẳng y = 2 là tiệm cận ngang của đồ thị."
        },
        {
            id: "m12_extra_2",
            subject: "Toán",
            grade: "12",
            period: "final1",
            topic: "Tọa độ không gian Oxyz",
            content: "Trong không gian Oxyz, cho mặt phẳng (P): 2x - y + 2z - 5 = 0. Một véctơ pháp tuyến của (P) là:",
            options: ["A. n = (2; -1; 2)", "B. n = (2; 1; 2)", "C. n = (2; -1; -5)", "D. n = (-2; 1; 5)"],
            correct: "A",
            explanation: "Hệ số của x, y, z trong phương trình tổng quát mặt phẳng chính là tọa độ véctơ pháp tuyến n = (2; -1; 2)."
        },
        {
            id: "m12_extra_4",
            subject: "Toán",
            grade: "12",
            period: "final2",
            topic: "Phương trình mũ & Lôgarit",
            content: "Nghiệm của phương trình log₂ (x - 3) = 4 là:",
            options: ["A. x = 19", "B. x = 11", "C. x = 16", "D. x = 7"],
            correct: "A",
            explanation: "Điều kiện x > 3. Phương trình tương đương x - 3 = 2⁴ = 16 ⇔ x = 19 (thỏa mãn điều kiện)."
        },
        {
            id: "m12_extra_5",
            subject: "Toán",
            grade: "12",
            period: "final2",
            topic: "Xác suất có điều kiện",
            content: "Cho hai biến cố A và B độc lập với P(A) = 0.4 và P(B) = 0.5. Xác suất P(A ∩ B) bằng:",
            options: ["A. 0.2", "B. 0.9", "C. 0.1", "D. 0.45"],
            correct: "A",
            explanation: "Khi hai biến cố A và B độc lập: P(A ∩ B) = P(A) . P(B) = 0.4 . 0.5 = 0.2."
        },
        {
            id: "m12_mid1_b1",
            subject: "Toán",
            grade: "12",
            period: "mid1",
            topic: "Ứng dụng đạo hàm khảo sát hàm số",
            content: "Hàm số y = f(x) có đạo hàm f'(x) = x² + 1 trên ℝ. Khẳng định nào sau đây là ĐÚNG?",
            options: ["A. Hàm số đồng biến trên ℝ", "B. Hàm số nghịch biến trên ℝ", "C. Hàm số có 2 cực trị", "D. Hàm số đạt cực tiểu tại x = 0"],
            correct: "A",
            explanation: "Do f'(x) = x² + 1 > 0 với mọi x ∈ ℝ nên hàm số luôn đồng biến trên toàn bộ tập số thực ℝ."
        },
        {
            id: "m12_fin1_b1",
            subject: "Toán",
            grade: "12",
            period: "final1",
            topic: "Tọa độ không gian Oxyz",
            content: "Trong không gian Oxyz, phương trình mặt cầu tâm I(1; -2; 3) bán kính R = 4 là:",
            options: ["A. (x - 1)² + (y + 2)² + (z - 3)² = 16", "B. (x + 1)² + (y - 2)² + (z + 3)² = 16", "C. (x - 1)² + (y + 2)² + (z - 3)² = 4", "D. x² + y² + z² = 16"],
            correct: "A",
            explanation: "Phương trình mặt cầu: (x - a)² + (y - b)² + (z - c)² = R². Thay tọa độ tâm và R = 4 vào được phương trình (x - 1)² + (y + 2)² + (z - 3)² = 16."
        },
        {
            id: "m12_mid2_b1",
            subject: "Toán",
            grade: "12",
            period: "mid2",
            topic: "Nguyên hàm & Tích phân",
            content: "Tích phân ∫₀¹ (2x + 1) dx bằng:",
            options: ["A. 2", "B. 1", "C. 3", "D. 0"],
            correct: "A",
            explanation: "Nguyên hàm là [x² + x] thế cận từ 0 đến 1: (1² + 1) - (0) = 2."
        },
        {
            id: "m12_fin2_b1",
            subject: "Toán",
            grade: "12",
            period: "final2",
            topic: "Phương trình mũ & Lôgarit",
            content: "Tập nghiệm của bất phương trình 2^(x + 1) > 8 là:",
            options: ["A. (2; +∞)", "B. (3; +∞)", "C. (-∞; 2)", "D. [2; +∞)"],
            correct: "A",
            explanation: "2^(x + 1) > 2³ ⇔ x + 1 > 3 ⇔ x > 2. Tập nghiệm là (2; +∞)."
        },
        {
            id: "toan12_m1_extra1",
            subject: "Toán",
            grade: "12",
            period: "mid1",
            topic: "Ứng dụng đạo hàm khảo sát hàm số",
            content: "Đồ thị hàm số y = (2x - 1)/(x + 1) có đường tiệm cận đứng là:",
            options: ["A. x = -1", "B. x = 2", "C. y = 2", "D. y = -1"],
            correct: "A",
            explanation: "Mẫu số x + 1 = 0 <=> x = -1 là tiệm cận đứng của đồ thị hàm phân thức."
        },
        {
            id: "toan12_f1_extra1",
            subject: "Toán",
            grade: "12",
            period: "final1",
            topic: "Tọa độ không gian Oxyz",
            content: "Trong không gian Oxyz, phương trình mặt cầu có tâm I(1; -2; 3) và bán kính R = 4 là:",
            options: ["A. (x - 1)^2 + (y + 2)^2 + (z - 3)^2 = 16", "B. (x + 1)^2 + (y - 2)^2 + (z + 3)^2 = 16", "C. (x - 1)^2 + (y + 2)^2 + (z - 3)^2 = 4", "D. (x - 1)^2 + (y - 2)^2 + (z - 3)^2 = 16"],
            correct: "A",
            explanation: "Phương trình mặt cầu tâm I(a; b; c) bán kính R là: (x - a)^2 + (y - b)^2 + (z - c)^2 = R^2 = 16."
        },
        {
            id: "toan12_f2_extra1",
            subject: "Toán",
            grade: "12",
            period: "final2",
            topic: "Xác suất có điều kiện",
            content: "Công thức tính xác suất có điều kiện P(A|B) khi P(B) > 0 là:",
            options: ["A. P(A|B) = P(A ∩ B) / P(B)", "B. P(A|B) = P(A) / P(B)", "C. P(A|B) = P(A ∩ B) / P(A)", "D. P(A|B) = P(A) * P(B)"],
            correct: "A",
            explanation: "Định nghĩa xác suất của biến cố A khi biết biến cố B đã xảy ra: P(A|B) = P(AB)/P(B)."
        },
    ],
    "Vật Lí": [
        {
            id: "p12_1",
            subject: "Vật Lí",
            grade: "12",
            period: "mid1",
            topic: "Vật lí nhiệt & Khí lý tưởng",
            content: "Nhiệt lượng cần cung cấp để làm nóng một vật có khối lượng m từ nhiệt độ T₁ đến T₂ (nhiệt dung riêng c) là:",
            options: ["A. Q = mc(T₂ - T₁)", "B. Q = m/c(T₂ - T₁)", "C. Q = mc/(T₂ - T₁)", "D. Q = c(T₂ - T₁)/m"],
            correct: "A",
            explanation: "Công thức tính nhiệt lượng theo nhiệt dung riêng: Q = mcΔT = mc(T₂ - T₁)."
        },
        {
            id: "p12_2",
            subject: "Vật Lí",
            grade: "12",
            period: "mid1",
            topic: "Vật lí nhiệt & Khí lý tưởng",
            content: "Mối liên hệ giữa nhiệt độ tuyệt đối T (Kelvin) và nhiệt độ t (độ Celsius) là:",
            options: ["A. T(K) = t(°C) + 273", "B. T(K) = t(°C) - 273", "C. T(K) = 273 - t(°C)", "D. T(K) = 2t(°C) + 273"],
            correct: "A",
            explanation: "Thang đo Kelvin có mốc chuẩn: T(K) = t(°C) + 273,15 (làm tròn là + 273)."
        },
        {
            id: "p12_3",
            subject: "Vật Lí",
            grade: "12",
            period: "final1",
            topic: "Từ trường & Cảm ứng điện từ",
            content: "Từ thông Φ gửi qua một khung dây dẫn kín có diện tích S đặt trong từ trường đều B được tính bằng công thức:",
            options: ["A. Φ = B.S.cos(α)", "B. Φ = B.S.sin(α)", "C. Φ = B / (S.cos(α))", "D. Φ = B.S.tan(α)"],
            correct: "A",
            explanation: "Từ thông qua diện tích S: Φ = B.S.cos(α), với α là góc giữa pháp tuyến n và cảm ứng từ B."
        },
        {
            id: "p12_4",
            subject: "Vật Lí",
            grade: "12",
            period: "mid2",
            topic: "Vật lí hạt nhân & Phóng xạ",
            content: "Hạt nhân nguyên tử ²³⁵₉₂U có bao nhiêu nơtron?",
            options: ["A. 143", "B. 92", "C. 235", "D. 327"],
            correct: "A",
            explanation: "Số nơtron N = A - Z = 235 - 92 = 143."
        },
        {
            id: "p12_5",
            subject: "Vật Lí",
            grade: "12",
            period: "final2",
            topic: "Dòng điện xoay chiều",
            content: "Cảm kháng Z_L của cuộn cảm thuần có độ tự cảm L đối với dòng điện xoay chiều tần số góc ω là:",
            options: ["A. Z_L = ωL", "B. Z_L = 1/(ωL)", "C. Z_L = ω/L", "D. Z_L = L/ω"],
            correct: "A",
            explanation: "Cảm kháng của cuộn cảm: Z_L = ωL."
        },
        {
            id: "phy12_extra_1",
            subject: "Vật Lí",
            grade: "12",
            period: "mid1",
            topic: "Vật lí nhiệt & Khí lý tưởng",
            content: "Nhiệt độ không tuyệt đối (0 K) tương ứng với bao nhiêu độ Celsius?",
            options: ["A. -273.15 °C", "B. 0 °C", "C. 273.15 °C", "D. -100 °C"],
            correct: "A",
            explanation: "Mối liên hệ giữa thang Kelvin và Celsius: T(K) = t(°C) + 273.15. Khi T = 0 K thì t = -273.15 °C."
        },
        {
            id: "phy12_extra_2",
            subject: "Vật Lí",
            grade: "12",
            period: "final1",
            topic: "Từ trường & Cảm ứng điện từ",
            content: "Từ thông qua một khung dây kín biến thiên một lượng ΔΦ = 0.4 Wb trong khoảng thời gian Δt = 0.1 s. Độ lớn suất điện động cảm ứng xuất hiện trong khung là:",
            options: ["A. 4 V", "B. 0.04 V", "C. 40 V", "D. 0.4 V"],
            correct: "A",
            explanation: "Theo định luật Faraday: |e_c| = |ΔΦ / Δt| = 0.4 / 0.1 = 4 V."
        },
        {
            id: "phy12_extra_3",
            subject: "Vật Lí",
            grade: "12",
            period: "mid2",
            topic: "Vật lí hạt nhân & Phóng xạ",
            content: "Hạt nhân nguyên tử cấu tạo từ các hạt nào sau đây?",
            options: ["A. Proton và neutron", "B. Proton và electron", "C. Neutron và electron", "D. Chỉ có proton"],
            correct: "A",
            explanation: "Hạt nhân cấu tạo từ các nucleon gồm hai loại hạt là proton (mang điện dương) và neutron (không mang điện)."
        },
        {
            id: "phy12_extra_4",
            subject: "Vật Lí",
            grade: "12",
            period: "final2",
            topic: "Dòng điện xoay chiều",
            content: "Cường độ dòng điện xoay chiều có biểu thức i = 4√2 cos(100πt) (A). Giá trị hiệu dụng của cường độ dòng điện là:",
            options: ["A. 4 A", "B. 4√2 A", "C. 2 A", "D. 8 A"],
            correct: "A",
            explanation: "Giá trị hiệu dụng: I = I₀ / √2 = (4√2) / √2 = 4 A."
        },
        {
            id: "phy12_extra_5",
            subject: "Vật Lí",
            grade: "12",
            period: "final2",
            topic: "Sóng điện từ & Truyền thông tin",
            content: "Sóng điện từ nào sau đây có bước sóng ngắn nhất và khả năng đâm xuyên mạnh nhất?",
            options: ["A. Tia gamma (γ)", "B. Tia X (Röntgen)", "C. Tia tử ngoại", "D. Sóng vô tuyến"],
            correct: "A",
            explanation: "Trong thang sóng điện từ, tia gamma có tần số cao nhất, bước sóng ngắn nhất (λ < 10⁻¹¹ m) và năng lượng photon lớn nhất."
        },
        {
            id: "phy12_mid1_b1",
            subject: "Vật Lí",
            grade: "12",
            period: "mid1",
            topic: "Vật lí nhiệt & Khí lý tưởng",
            content: "Định luật Boyle cho quá trình đẳng nhiệt của một khối lượng khí lí tưởng xác định là:",
            options: ["A. p.V = hằng số", "B. p / T = hằng số", "C. V / T = hằng số", "D. p / V = hằng số"],
            correct: "A",
            explanation: "Trong quá trình đẳng nhiệt (T không đổi), áp suất tỉ lệ nghịch với thể tích: p₁V₁ = p₂V₂ = const."
        },
        {
            id: "phy12_fin1_b1",
            subject: "Vật Lí",
            grade: "12",
            period: "final1",
            topic: "Từ trường & Cảm ứng điện từ",
            content: "Đơn vị đo của từ thông (Magnetic flux) trong hệ SI là:",
            options: ["A. Weber (Wb)", "B. Tesla (T)", "C. Henry (H)", "D. Volt (V)"],
            correct: "A",
            explanation: "Từ thông Φ = B.S.cosα có đơn vị là Weber (Wb); cảm ứng từ B có đơn vị là Tesla (T)."
        },
        {
            id: "phy12_mid2_b1",
            subject: "Vật Lí",
            grade: "12",
            period: "mid2",
            topic: "Vật lí hạt nhân & Phóng xạ",
            content: "Phóng xạ hạt nhân là quá trình biến đổi hạt nhân có tính chất nào sau đây?",
            options: ["A. Diễn ra hoàn toàn tự phát, không phụ thuộc vào các điều kiện nhiệt độ hay áp suất bên ngoài", "B. Cần nung nóng đến triệu độ", "C. Bị kích thích bởi ánh sáng nhìn thấy", "D. Chỉ xảy ra khi có từ trường cực mạnh"],
            correct: "A",
            explanation: "Hiện tượng phóng xạ là quá trình hạt nhân không bền tự phân rã, mang tính ngẫu nhiên và hoàn toàn tự phát."
        },
        {
            id: "phy12_fin2_b1",
            subject: "Vật Lí",
            grade: "12",
            period: "final2",
            topic: "Dòng điện xoay chiều",
            content: "Hiện tượng cộng hưởng điện xảy ra trong mạch RLC nối tiếp khi:",
            options: ["A. Cảm kháng bằng dung kháng (ZL = ZC)", "B. ZL = R", "C. ZC = R", "D. ZL = 2 ZC"],
            correct: "A",
            explanation: "Khi ωL = 1/(ωC) => ZL = ZC, trở kháng của mạch nhỏ nhất Z = R, cường độ dòng điện đạt cực đại (cộng hưởng)."
        },
        {
            id: "ly12_m1_extra1",
            subject: "Vật Lí",
            grade: "12",
            period: "mid1",
            topic: "Vật lí nhiệt & Khí lý tưởng",
            content: "Theo thang nhiệt độ Kelvin, độ không tuyệt đối (0 K) tương ứng với giá trị nhiệt độ Celsius là:",
            options: ["A. -273.15 °C", "B. 0 °C", "C. -100 °C", "D. 273.15 °C"],
            correct: "A",
            explanation: "T(K) = t(°C) + 273.15 nên 0 K ứng với -273.15 °C, là mức nhiệt năng thấp nhất về lý thuyết."
        },
        {
            id: "ly12_f1_extra1",
            subject: "Vật Lí",
            grade: "12",
            period: "final1",
            topic: "Từ trường & Cảm ứng điện từ",
            content: "Hiện tượng cảm ứng điện từ xuất hiện trong một khung dây dẫn kín khi:",
            options: ["A. Từ thông qua diện tích mặt phẳng khung dây biến thiên theo thời gian", "B. Khung dây đứng yên trong từ trường đều", "C. Khung dây được nung nóng", "D. Khung dây chuyển động tịnh tiến dọc đường sức từ trường đều"],
            correct: "A",
            explanation: "Định luật Faraday: Suất điện động cảm ứng tỉ lệ với tốc độ biến thiên từ thông gửi qua mạch kín."
        },
        {
            id: "ly12_m2_extra1",
            subject: "Vật Lí",
            grade: "12",
            period: "mid2",
            topic: "Vật lí hạt nhân & Phóng xạ",
            content: "Tia phóng xạ nào sau đây có bản chất là dòng các hạt nhân Helium-4 (^4_2He)?",
            options: ["A. Tia alpha (α)", "B. Tia beta trừ (β-)", "C. Tia beta cộng (β+)", "D. Tia gamma (γ)"],
            correct: "A",
            explanation: "Hạt alpha chính là hạt nhân nguyên tử Helium gồm 2 proton và 2 neutron."
        },
        {
            id: "ly12_f2_extra1",
            subject: "Vật Lí",
            grade: "12",
            period: "final2",
            topic: "Dòng điện xoay chiều",
            content: "Trong đoạn mạch điện xoay chiều chỉ có tụ điện C, cường độ dòng điện tức thời i so với điện áp u giữa hai đầu tụ:",
            options: ["A. Sớm pha góc π/2", "B. Trễ pha góc π/2", "C. Cùng pha", "D. Ngược pha"],
            correct: "A",
            explanation: "Mạch chỉ có tụ điện: dòng điện i sớm pha hơn điện áp u một góc π/2 (u trễ pha π/2 so với i)."
        },
    ],
    "Hóa Học": [
        {
            id: "c12_1",
            subject: "Hóa Học",
            grade: "12",
            period: "mid1",
            topic: "Ester - Lipid & Xà phòng",
            content: "Thủy phân este etyl axetat (CH₃COOC₂H₅) trong dung dịch NaOH đun nóng thu được muối và ancol nào sau đây?",
            options: ["A. CH₃COONa và C₂H₅OH", "B. C₂H₅COONa và CH₃OH", "C. HCOONa và C₂H₅OH", "D. CH₃COONa và CH₃OH"],
            correct: "A",
            explanation: "Phản ứng xà phòng hóa: CH₃COOC₂H₅ + NaOH → CH₃COONa + C₂H₅OH."
        },
        {
            id: "c12_2",
            subject: "Hóa Học",
            grade: "12",
            period: "final1",
            topic: "Carbohydrate (Glucose, Saccarozo, Tinh bột)",
            content: "Chất nào sau đây thuộc loại monosaccarit, có nhiều trong quả nho chín và tham gia phản ứng tráng bạc?",
            options: ["A. Glucozơ (Glucose)", "B. Saccarozơ", "C. Tinh bột", "D. Xenlulozơ"],
            correct: "A",
            explanation: "Glucozơ là monosaccarit có nhóm -CHO nên tham gia phản ứng tráng bạc với thuốc thử Tollens."
        },
        {
            id: "c12_3",
            subject: "Hóa Học",
            grade: "12",
            period: "mid2",
            topic: "Amine, Amino Acid & Protein",
            content: "Chất nào sau đây là amin bậc 1 dạng khí ở điều kiện thường, có mùi khai khó chịu?",
            options: ["A. Metylamin (CH₃NH₂)", "B. Đimetylamin", "C. Trimetylamin", "D. Anilin"],
            correct: "A",
            explanation: "CH₃NH₂ là amin bậc 1 (nguyên tử N liên kết với 1 gốc hiđrocacbon), thể khí, mùi khai độc."
        },
        {
            id: "c12_4",
            subject: "Hóa Học",
            grade: "12",
            period: "mid2",
            topic: "Polymer & Vật liệu mới",
            content: "Polietilen (PE) được điều chế bằng phản ứng trùng hợp monome nào sau đây?",
            options: ["A. Etilen (CH₂=CH₂)", "B. Propilen", "C. Vinyl clorua", "D. Butađien"],
            correct: "A",
            explanation: "Trùng hợp etilen nCH₂=CH₂ → (-CH₂-CH₂-)_n (PE)."
        },
        {
            id: "c12_5",
            subject: "Hóa Học",
            grade: "12",
            period: "final2",
            topic: "Pin điện hóa & Kim loại",
            content: "Kim loại nào sau đây có tính dẫn điện và dẫn nhiệt tốt nhất trong tất cả các kim loại?",
            options: ["A. Bạc (Ag)", "B. Đồng (Cu)", "C. Vàng (Au)", "D. Nhôm (Al)"],
            correct: "A",
            explanation: "Thứ tự dẫn điện giảm dần: Ag > Cu > Au > Al > Fe."
        },
        {
            id: "chem12_extra_1",
            subject: "Hóa Học",
            grade: "12",
            period: "mid1",
            topic: "Ester - Lipid & Xà phòng",
            content: "Thủy phân hoàn toàn ethyl acetate (CH₃COOC₂H₅) trong dung dịch NaOH đun nóng thu được sản phẩm là:",
            options: ["A. CH₃COONa và C₂H₅OH", "B. C₂H₅COONa và CH₃OH", "C. CH₃COOH và C₂H₅ONa", "D. CH₃COONa và H₂O"],
            correct: "A",
            explanation: "Phản ứng xà phòng hóa: CH₃COOC₂H₅ + NaOH → CH₃COONa (sodium acetate) + C₂H₅OH (ethanol)."
        },
        {
            id: "chem12_extra_2",
            subject: "Hóa Học",
            grade: "12",
            period: "final1",
            topic: "Carbohydrate (Glucose, Saccarozo, Tinh bột)",
            content: "Carbohydrate nào sau đây thuộc loại disaccharide?",
            options: ["A. Saccharose", "B. Glucose", "C. Fructose", "D. Cellulose"],
            correct: "A",
            explanation: "Saccharose có công thức C₁₂H₂₂O₁₁, cấu tạo từ 1 gốc α-glucose và 1 gốc β-fructose liên kết qua cầu oxygen, là disaccharide."
        },
        {
            id: "chem12_extra_3",
            subject: "Hóa Học",
            grade: "12",
            period: "mid2",
            topic: "Amine, Amino Acid & Protein",
            content: "Dung dịch amine nào sau đây làm quỳ tím chuyển sang màu xanh?",
            options: ["A. Methylamine (CH₃NH₂)", "B. Aniline (C₆H₅NH₂)", "C. Benzene", "D. Phenol"],
            correct: "A",
            explanation: "Methylamine có tính base mạnh hơn amoniac nên làm quỳ tím hóa xanh; còn aniline tính base rất yếu không làm đổi màu quỳ tím."
        },
        {
            id: "chem12_extra_4",
            subject: "Hóa Học",
            grade: "12",
            period: "final2",
            topic: "Polymer & Vật liệu mới",
            content: "Poly(vinyl chloride) (PVC) được điều chế trực tiếp từ monomer nào?",
            options: ["A. Vinyl chloride (CH₂=CH-Cl)", "B. Ethylene (CH₂=CH₂)", "C. Propylene (CH₂=CH-CH₃)", "D. Styrene"],
            correct: "A",
            explanation: "Phản ứng trùng hợp vinyl chloride: n CH₂=CH-Cl → (-CH₂-CH(Cl)-)ₙ (PVC)."
        },
        {
            id: "chem12_extra_5",
            subject: "Hóa Học",
            grade: "12",
            period: "final2",
            topic: "Pin điện hóa & Kim loại",
            content: "Kim loại nào sau đây có tính khử mạnh nhất trong dãy hoạt động hóa học?",
            options: ["A. K (Potassium)", "B. Fe (Iron)", "C. Cu (Copper)", "D. Ag (Silver)"],
            correct: "A",
            explanation: "Theo dãy điện hóa kim loại: K đứng đầu dãy nên có thế điện cực chuẩn âm nhất và tính khử mạnh nhất."
        },
        {
            id: "chem12_mid1_b1",
            subject: "Hóa Học",
            grade: "12",
            period: "mid1",
            topic: "Ester - Lipid & Xà phòng",
            content: "Chất béo (triglyceride) là triester của acid béo với:",
            options: ["A. Glycerol (propan-1,2,3-triol)", "B. Ethylene glycol", "C. Ethanol", "D. Methanol"],
            correct: "A",
            explanation: "Chất béo là triester của glycerol với các acid béo mạch dài không phân nhánh."
        },
        {
            id: "chem12_fin1_b1",
            subject: "Hóa Học",
            grade: "12",
            period: "final1",
            topic: "Carbohydrate (Glucose, Saccarozo, Tinh bột)",
            content: "Thuốc thử dùng để nhận biết hồ tinh bột là:",
            options: ["A. Dung dịch Iodine (I₂)", "B. Nước brom", "C. Quỳ tím", "D. Dung dịch AgNO₃ trong NH₃"],
            correct: "A",
            explanation: "Iodine len lỏi vào các cuộn xoắn của tinh bột tạo hợp chất bọc có màu xanh tím đặc trưng."
        },
        {
            id: "chem12_mid2_b1",
            subject: "Hóa Học",
            grade: "12",
            period: "mid2",
            topic: "Amine, Amino Acid & Protein",
            content: "Amino acid là hợp chất hữu cơ tạp chức chứa đồng thời hai nhóm chức nào?",
            options: ["A. Nhóm amino (-NH₂) và nhóm carboxyl (-COOH)", "B. Nhóm hydroxyl (-OH) và carbonyl (-CHO)", "C. Nhóm ester và ether", "D. Nhóm nitro (-NO₂) và halide"],
            correct: "A",
            explanation: "Amino acid chứa nhóm -NH₂ có tính base và nhóm -COOH có tính acid nên có tính chất lưỡng tính."
        },
        {
            id: "chem12_fin2_b1",
            subject: "Hóa Học",
            grade: "12",
            period: "final2",
            topic: "Pin điện hóa & Kim loại",
            content: "Quá trình khử ion kim loại thành nguyên tử kim loại xảy ra ở điện cực nào trong bình điện phân?",
            options: ["A. Ở Cathode (cực âm)", "B. Ở Anode (cực dương)", "C. Trong không khí", "D. Ở màng ngăn xốp"],
            correct: "A",
            explanation: "Trong điện phân, Cathode là cực âm hút các cation kim loại (Mⁿ⁺) đến để nhận electron (bị khử): Mⁿ⁺ + ne -> M."
        },
        {
            id: "hoa12_m1_extra1",
            subject: "Hóa Học",
            grade: "12",
            period: "mid1",
            topic: "Ester - Lipid & Xà phòng",
            content: "Ester Ethyl acetate có công thức phân tử và mùi thơm đặc trưng nào?",
            options: ["A. CH3COOC2H5, mùi thơm của quả chuối chín hoặc táo", "B. HCOOCH3, mùi hắc khó chịu", "C. CH3COOH, mùi chua của giấm", "D. C2H5OH, mùi cồn"],
            correct: "A",
            explanation: "Ethyl acetate là CH3COOC2H5, được dùng làm dung môi và tạo hương liệu thực phẩm."
        },
        {
            id: "hoa12_f1_extra1",
            subject: "Hóa Học",
            grade: "12",
            period: "final1",
            topic: "Carbohydrate (Glucose, Saccarozo, Tinh bột)",
            content: "Chất nào sau đây tham gia phản ứng tráng bạc tạo lớp bạc sáng bóng bám vào thành ống nghiệm?",
            options: ["A. Glucose", "B. Tinh bột", "C. Cellulose", "D. Saccarozo tinh khiết"],
            correct: "A",
            explanation: "Glucose chứa nhóm chức aldehyde (-CHO) nên tác dụng với thuốc thử Tollens cho kết tủa bạc kim loại."
        },
        {
            id: "hoa12_f2_extra1",
            subject: "Hóa Học",
            grade: "12",
            period: "final2",
            topic: "Pin điện hóa & Kim loại",
            content: "Trong pin điện hóa Daniel (Zn - Cu), tại cực âm (anode) xảy ra quá trình nào?",
            options: ["A. Quá trình oxi hóa kẽm: Zn -> Zn^2+ + 2e", "B. Quá trình khử ion đồng: Cu^2+ + 2e -> Cu", "C. Quá trình giải phóng khí H2", "D. Quá trình bay hơi nước"],
            correct: "A",
            explanation: "Tại cực âm (anode) kim loại hoạt động mạnh hơn bị oxi hóa nhường electron: Zn -> Zn^2+ + 2e."
        },
    ],
    "Sinh Học": [
        {
            id: "b12_1",
            subject: "Sinh Học",
            grade: "12",
            period: "mid1",
            topic: "Cơ chế di truyền và biến dị (ADN, Đột biến)",
            content: "Trong cấu trúc của mARN, bộ ba mở đầu (start codon) mã hóa axit amin mở đầu ở sinh vật nhân thực là:",
            options: ["A. 5'-AUG-3' (mã hóa Metionin)", "B. 5'-UAA-3'", "C. 5'-UAG-3'", "D. 5'-UGA-3'"],
            correct: "A",
            explanation: "Codon 5'-AUG-3' là bộ ba mở đầu dịch mã, mã hóa Methionine ở sinh vật nhân thực (hoặc Formyl-methionine ở nhân sơ)."
        },
        {
            id: "b12_2",
            subject: "Sinh Học",
            grade: "12",
            period: "final1",
            topic: "Quy luật di truyền Mendel & Mở rộng",
            content: "Theo quy luật phân li độc lập của Menđen, phép lai AaBb × AaBb cho tỉ lệ phân li kiểu hình ở đời con là:",
            options: ["A. 9 : 3 : 3 : 1", "B. 3 : 1", "C. 1 : 2 : 1", "D. 9 : 7"],
            correct: "A",
            explanation: "Lai hai cặp tính trạng phân li độc lập: (3:1)(3:1) = 9 : 3 : 3 : 1."
        },
        {
            id: "b12_3",
            subject: "Sinh Học",
            grade: "12",
            period: "mid2",
            topic: "Di truyền học quần thể & Người",
            content: "Trong quần thể ngẫu phối đạt trạng thái cân bằng Hardy - Weinberg có tần số alen A là p = 0,6; a là q = 0,4. Tỉ lệ kiểu gen dị hợp Aa là:",
            options: ["A. 0,48 (48%)", "B. 0,36 (36%)", "C. 0,16 (16%)", "D. 0,24 (24%)"],
            correct: "A",
            explanation: "Cấu trúc quần thể cân bằng: p² AA + 2pq Aa + q² aa = 1. Tỉ lệ Aa = 2pq = 2 × 0,6 × 0,4 = 0,48."
        },
        {
            id: "b12_4",
            subject: "Sinh Học",
            grade: "12",
            period: "final2",
            topic: "Tiến hóa sinh học & Thuyết tiến hóa",
            content: "Theo thuyết tiến hóa tổng hợp hiện đại, nhân tố nào sau đây là nhân tố tiến hóa định hướng cho quá trình tiến hóa?",
            options: ["A. Chọn lọc tự nhiên", "B. Đột biến gen", "C. Giao phối không ngẫu nhiên", "D. Di - nhập gen"],
            correct: "A",
            explanation: "Chỉ có chọn lọc tự nhiên là nhân tố quy định chiều hướng và nhịp điệu biến đổi tần số alen của quần thể."
        },
        {
            id: "b12_5",
            subject: "Sinh Học",
            grade: "12",
            period: "final2",
            topic: "Sinh thái học & Môi trường",
            content: "Trong một hệ sinh thái, sinh vật nào sau đây đóng vai trò là sinh vật sản xuất?",
            options: ["A. Cây xanh quang hợp", "B. Động vật ăn cỏ", "C. Nấm hoại sinh", "D. Vi khuẩn phân giải"],
            correct: "A",
            explanation: "Cây xanh có khả năng tự dưỡng quang hợp, biến đổi năng lượng mặt trời thành chất hữu cơ."
        },
        {
            id: "bio12_extra_1",
            subject: "Sinh Học",
            grade: "12",
            period: "mid1",
            topic: "Di truyền học phân tử & Đột biến gen",
            content: "Mã di truyền có tính thoái hóa nghĩa là:",
            options: ["A. Nhiều bộ ba khác nhau cùng quy định tổng hợp một loại amino acid", "B. Một bộ ba mã hóa cho nhiều loại amino acid", "C. Mã di truyền được đọc liên tục gối lên nhau", "D. Mã di truyền đặc trưng riêng cho từng loài"],
            correct: "A",
            explanation: "Tính thoái hóa (dư thừa) của mã di truyền: Có 61 bộ ba mã hóa 20 loại amino acid, nên phần lớn amino acid do 2 hoặc nhiều codon cùng mã hóa."
        },
        {
            id: "bio12_extra_2",
            subject: "Sinh Học",
            grade: "12",
            period: "final1",
            topic: "Quy luật di truyền Mendel & Nhiễm sắc thể",
            content: "Phép lai nào sau đây được gọi là phép lai phân tích?",
            options: ["A. Lai giữa cá thể mang tính trạng trội chưa biết kiểu gen với cá thể mang tính trạng lặn", "B. Lai giữa hai cá thể có kiểu hình trội", "C. Lai giữa hai cá thể có kiểu hình lặn", "D. Tự thụ phấn bắt buộc"],
            correct: "A",
            explanation: "Lai phân tích là phép lai giữa cá thể mang tính trạng trội cần xác định kiểu gen với cá thể mang kiểu hình lặn (đồng hợp lặn)."
        },
        {
            id: "bio12_extra_3",
            subject: "Sinh Học",
            grade: "12",
            period: "mid2",
            topic: "Di truyền quần thể & Chọn giống",
            content: "Một quần thể đạt trạng thái cân bằng di truyền Hardy-Weinberg có tần số alen A = 0.7 và a = 0.3. Tỉ lệ kiểu gen dị hợp Aa là:",
            options: ["A. 0.42", "B. 0.49", "C. 0.09", "D. 0.21"],
            correct: "A",
            explanation: "Cấu trúc cân bằng di truyền: p²AA + 2pqAa + q²aa = 1. Với p = 0.7 và q = 0.3, tỉ lệ dị hợp 2pq = 2 . 0.7 . 0.3 = 0.42 (42%)."
        },
        {
            id: "bio12_extra_4",
            subject: "Sinh Học",
            grade: "12",
            period: "final2",
            topic: "Tiến hóa & Học thuyết tiến hóa",
            content: "Theo thuyết tiến hóa hiện đại, nhân tố tiến hóa nào sau đây làm thay đổi tần số alen của quần thể theo một hướng xác định?",
            options: ["A. Chọn lọc tự nhiên", "B. Đột biến", "C. Các yếu tố ngẫu nhiên", "D. Giao phối không ngẫu nhiên"],
            correct: "A",
            explanation: "Chọn lọc tự nhiên tác động trực tiếp lên kiểu hình, gián tiếp đào thải các kiểu gen kém thích nghi nên quy định chiều hướng và nhịp điệu tiến hóa."
        },
        {
            id: "bio12_extra_5",
            subject: "Sinh Học",
            grade: "12",
            period: "final2",
            topic: "Sinh thái học & Môi trường",
            content: "Trong một chuỗi thức ăn, sinh vật nào sau đây đóng vai trò là sinh vật sản xuất?",
            options: ["A. Cây xanh quang dưỡng", "B. Động vật ăn cỏ", "C. Động vật ăn thịt", "D. Nấm hoại sinh"],
            correct: "A",
            explanation: "Sinh vật sản xuất chủ yếu là thực vật quang hợp, có khả năng chuyển hóa năng lượng ánh sáng mặt trời thành hợp chất hữu cơ."
        },
        {
            id: "bio12_t1_q3",
            subject: "Sinh Học",
            grade: "12",
            period: "mid1",
            topic: "Cơ chế di truyền và biến dị (ADN, Đột biến)",
            content: "Enzyme nào đóng vai trò chính xúc tác kéo dài mạch mới trong quá trình nhân đôi ADN ở sinh vật nhân sơ?",
            options: ["A. DNA polymerase III", "B. RNA polymerase", "C. Ligase (enzyme nối)", "D. Helicase (enzyme tháo xoắn)"],
            correct: "A",
            explanation: "DNA polymerase III tổng hợp mạch mới theo chiều 5' -> 3' theo nguyên tắc bổ sung với mạch khuôn."
        },
        {
            id: "bio12_t2_q3",
            subject: "Sinh Học",
            grade: "12",
            period: "final1",
            topic: "Quy luật di truyền Mendel & Mở rộng",
            content: "Quy luật phân li độc lập của Mendel áp dụng đúng khi các cặp gen quy định các cặp tính trạng nằm trên:",
            options: ["A. Các cặp nhiễm sắc thể tương đồng khác nhau", "B. Cùng một cặp nhiễm sắc thể", "C. Nhiễm sắc thể giới tính Y không có alen trên X", "D. Tế bào chất bên ngoài nhân"],
            correct: "A",
            explanation: "Khi các gen nằm trên các cặp NST tương đồng khác nhau, sự phân li và tổ hợp ngẫu nhiên của các NST dẫn tới phân li độc lập."
        },
        {
            id: "bio12_t3_q3",
            subject: "Sinh Học",
            grade: "12",
            period: "mid2",
            topic: "Di truyền học quần thể & Người",
            content: "Quần thể tự phối (tự thụ phấn hoặc giao phối cận huyết) qua nhiều thế hệ có xu hướng biến đổi cấu trúc di truyền như thế nào?",
            options: ["A. Tỉ lệ kiểu gen dị hợp giảm dần, tỉ lệ kiểu gen đồng hợp tăng dần", "B. Tỉ lệ dị hợp tăng dần", "C. Tần số alen bị biến đổi liên tục", "D. Không có bất kì sự thay đổi nào"],
            correct: "A",
            explanation: "Tự phối làm giảm độ dị hợp tử, tăng đồng hợp tử (kể cả đồng hợp lặn gây hại), dẫn tới hiện tượng thoái hóa giống."
        },
        {
            id: "bio12_t4_q3",
            subject: "Sinh Học",
            grade: "12",
            period: "final2",
            topic: "Tiến hóa sinh học & Thuyết tiến hóa",
            content: "Bằng chứng tiến hóa trực tiếp cho biết chính xác thời đại xuất hiện và lịch sử hình thành của các loài cổ sinh là:",
            options: ["A. Bằng chứng hóa thạch", "B. Cơ quan thoái hóa", "C. Giải phẫu so sánh", "D. Bằng chứng tế bào học"],
            correct: "A",
            explanation: "Hóa thạch (di tích sinh vật cổ lưu trong các tầng địa chất) là bằng chứng trực tiếp xác thực nhất về tiến hóa."
        },
        {
            id: "bio12_t5_q3",
            subject: "Sinh Học",
            grade: "12",
            period: "final2",
            topic: "Sinh thái học & Môi trường",
            content: "Mối quan hệ giữa hai loài sinh vật cùng tranh giành một nguồn sống khan hiếm (thức ăn, nơi ở, ánh sáng) là quan hệ:",
            options: ["A. Cạnh tranh khác loài", "B. Cộng sinh", "C. Hợp tác", "D. Kí sinh - vật chủ"],
            correct: "A",
            explanation: "Quan hệ cạnh tranh xuất hiện khi các loài có cùng ổ sinh thái tranh chấp nguồn sống, có thể dẫn tới sự phân li ổ sinh thái."
        },
        {
            id: "sinh12_m1_extra1",
            subject: "Sinh Học",
            grade: "12",
            period: "mid1",
            topic: "Cơ chế di truyền và biến dị (ADN, Đột biến)",
            content: "Nguyên tắc bổ sung trong cấu trúc phân tử ADN được thể hiện bằng sự liên kết giữa các base nào?",
            options: ["A. Adenine liên kết với Thymine (A - T); Guanine liên kết với Cytosine (G - C)", "B. A - U; G - C", "C. A - G; T - C", "D. A - C; T - G"],
            correct: "A",
            explanation: "Trong phân tử ADN mạch kép: A liên kết với T bằng 2 liên kết hydro, G liên kết với C bằng 3 liên kết hydro."
        },
        {
            id: "sinh12_f1_extra1",
            subject: "Sinh Học",
            grade: "12",
            period: "final1",
            topic: "Quy luật di truyền Mendel & Mở rộng",
            content: "Phép lai phân tích là phép lai giữa cá thể mang kiểu hình trội với cá thể:",
            options: ["A. Đồng hợp lặn để xác định kiểu gen của cá thể trội", "B. Đồng hợp trội", "C. Dị hợp tử", "D. Bất kì cá thể nào"],
            correct: "A",
            explanation: "Lai phân tích nhằm kiểm tra cá thể trội là đồng hợp tử hay dị hợp tử bằng cách lai với cá thể đồng hợp lặn."
        },
        {
            id: "sinh12_m2_extra1",
            subject: "Sinh Học",
            grade: "12",
            period: "mid2",
            topic: "Tiến hóa sinh học & Thuyết tiến hóa",
            content: "Theo thuyết tiến hóa hiện đại, nhân tố tiến hóa nào là nhân tố quy định chiều hướng và nhịp điệu của quá trình tiến hóa?",
            options: ["A. Chọn lọc tự nhiên", "B. Đột biến gen", "C. Giao phối không ngẫu nhiên", "D. Di - nhập gen"],
            correct: "A",
            explanation: "Chọn lọc tự nhiên sàng lọc các biến dị thích nghi, định hướng sự tiến hóa của sinh giới."
        },
        {
            id: "sinh12_f2_extra1",
            subject: "Sinh Học",
            grade: "12",
            period: "final2",
            topic: "Sinh thái học & Môi trường",
            content: "Quan hệ giữa hai loài cùng sống chung và cả hai loài đều có lợi, đồng thời sự gắn bó là bắt buộc đối với sự tồn tại của chúng là:",
            options: ["A. Quan hệ cộng sinh", "B. Quan hệ hợp tác", "C. Quan hệ hội sinh", "D. Quan hệ ký sinh"],
            correct: "A",
            explanation: "Quan hệ cộng sinh đem lại lợi ích cho cả 2 bên và bắt buộc (ví dụ: địa y gồm nấm và tảo)."
        },
    ],
    "Lịch Sử": [
        {
            id: "h12_1",
            subject: "Lịch Sử",
            grade: "12",
            period: "mid1",
            topic: "Trật tự thế giới sau Chiến tranh thế giới thứ hai",
            content: "Trật tự hai cực Ianta được xác lập sau Chiến tranh thế giới thứ hai do hai siêu cường nào đứng đầu?",
            options: ["A. Liên Xô và Mĩ", "B. Mĩ và Anh", "C. Liên Xô và Trung Quốc", "D. Mĩ và Pháp"],
            correct: "A",
            explanation: "Hội nghị Ianta (2/1945) phân chia phạm vi ảnh hưởng giữa hai cực: cực Mĩ (tư bản) và cực Liên Xô (xã hội chủ nghĩa)."
        },
        {
            id: "h12_2",
            subject: "Lịch Sử",
            grade: "12",
            period: "final1",
            topic: "Cách mạng tháng Tám 1945 & Kháng chiến chống Pháp",
            content: "Phương châm tác chiến được Đại tướng Võ Nguyên Giáp chuyển đổi mang tính quyết định trong Chiến dịch Điện Biên Phủ (1954) là:",
            options: ["A. Chuyển từ 'Đánh nhanh, thắng nhanh' sang 'Đánh chắc, tiến chắc'", "B. Chuyển từ phòng ngự sang tổng phản công", "C. Bao vây kinh tế", "D. Đàm phán hòa hoãn"],
            correct: "A",
            explanation: "Quyết định chuyển phương châm tác chiến sang 'Đánh chắc, tiến chắc' là quyết định lịch sử bảo đảm thắng lợi Điện Biên Phủ."
        },
        {
            id: "h12_3",
            subject: "Lịch Sử",
            grade: "12",
            period: "mid2",
            topic: "Kháng chiến chống Mỹ cứu nước (1954-1975)",
            content: "Chiến dịch mang tên Bác toàn thắng kết thúc thắng lợi trọn vẹn cuộc kháng chiến chống Mĩ cứu nước, giải phóng miền Nam ngày 30/4/1975 là:",
            options: ["A. Chiến dịch Hồ Chí Minh", "B. Chiến dịch Tây Nguyên", "C. Chiến dịch Huế - Đà Nẵng", "D. Chiến dịch Đường 9 - Nam Lào"],
            correct: "A",
            explanation: "Chiến dịch Hồ Chí Minh lịch sử (từ 26/4 đến 30/4/1975) đã giải phóng hoàn toàn miền Nam, thống nhất non sông."
        },
        {
            id: "h12_4",
            subject: "Lịch Sử",
            grade: "12",
            period: "final2",
            topic: "Công cuộc Đổi mới đất nước từ năm 1986",
            content: "Đại hội đại biểu toàn quốc lần thứ VI của Đảng Cộng sản Việt Nam (12/1986) đã đề ra đường lối mang tính bước ngoặt nào?",
            options: ["A. Đường lối Đổi mới toàn diện đất nước, trọng tâm là đổi mới kinh tế", "B. Công nghiệp hóa tập trung vào công nghiệp nặng", "C. Tiếp tục duy trì cơ chế bao cấp", "D. Khép kín quan hệ đối ngoại"],
            correct: "A",
            explanation: "Đại hội VI (1986) khởi xướng công cuộc Đổi mới, chuyển đổi nền kinh tế bao cấp sang kinh tế thị trường định hướng XHCN."
        },
        {
            id: "h12_5",
            subject: "Lịch Sử",
            grade: "12",
            period: "final2",
            topic: "Lịch sử đối ngoại & ASEAN",
            content: "Việt Nam chính thức bình thường hóa quan hệ ngoại giao với Hợp chủng quốc Hoa Kỳ vào năm nào?",
            options: ["A. Năm 1995", "B. Năm 1986", "C. Năm 2000", "D. Năm 1991"],
            correct: "A",
            explanation: "Tháng 7/1995, Việt Nam và Hoa Kỳ chính thức bình thường hóa quan hệ ngoại giao, cũng là năm Việt Nam gia nhập ASEAN."
        },
        {
            id: "his12_extra_1",
            subject: "Lịch Sử",
            grade: "12",
            period: "mid1",
            topic: "Trật tự thế giới mới sau CTTG II",
            content: "Hội nghị Ianta (tháng 2/1945) có sự tham gia của nguyên thủ ba cường quốc nào?",
            options: ["A. Liên Xô, Mỹ, Anh", "B. Liên Xô, Mỹ, Pháp", "C. Mỹ, Anh, Pháp", "D. Liên Xô, Trung Quốc, Mỹ"],
            correct: "A",
            explanation: "Hội nghị Ianta quy tụ ba nguyên thủ: Stalin (Liên Xô), Roosevelt (Mỹ) và Churchill (Anh) để thỏa thuận phân chia khu vực ảnh hưởng sau thế chiến."
        },
        {
            id: "his12_extra_2",
            subject: "Lịch Sử",
            grade: "12",
            period: "final1",
            topic: "Cách mạng tháng Tám 1945",
            content: "Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập khai sinh nước Việt Nam Dân chủ Cộng hòa vào ngày nào?",
            options: ["A. 02/09/1945", "B. 19/08/1945", "C. 30/08/1945", "D. 23/08/1945"],
            correct: "A",
            explanation: "Ngày 02/09/1945, tại Quảng trường Ba Đình Hà Nội, Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập lịch sử."
        },
        {
            id: "his12_extra_3",
            subject: "Lịch Sử",
            grade: "12",
            period: "mid2",
            topic: "Chiến thắng Điện Biên Phủ 1954",
            content: "Chiến thắng Điện Biên Phủ 'lừng lẫy năm châu, chấn động địa cầu' diễn ra vào năm nào?",
            options: ["A. 1954", "B. 1950", "C. 1953", "D. 1975"],
            correct: "A",
            explanation: "Ngày 07/05/1954, lá cờ Quyết chiến Quyết thắng tung bay trên nóc hầm De Castries, kết thúc thắng lợi cuộc kháng chiến chống thực dân Pháp."
        },
        {
            id: "his12_extra_4",
            subject: "Lịch Sử",
            grade: "12",
            period: "final2",
            topic: "Đại thắng mùa Xuân 1975",
            content: "Chiến dịch mang tên Chủ tịch Hồ Chí Minh toàn thắng vào thời khắc nào?",
            options: ["A. 11 giờ 30 phút ngày 30/04/1975", "B. 01/05/1975", "C. 26/03/1975", "D. 09/04/1975"],
            correct: "A",
            explanation: "Lúc 11 giờ 30 phút ngày 30/04/1975, xe tăng quân giải phóng húc đổ cổng Dinh Độc Lập, giải phóng hoàn toàn miền Nam, thống nhất đất nước."
        },
        {
            id: "his12_extra_5",
            subject: "Lịch Sử",
            grade: "12",
            period: "final2",
            topic: "Công cuộc Đổi mới từ năm 1986",
            content: "Đường lối Đổi mới toàn diện đất nước được Đảng Cộng sản Việt Nam đề ra tại Đại hội đại biểu toàn quốc lần thứ mấy?",
            options: ["A. Đại hội VI (tháng 12/1986)", "B. Đại hội V (1982)", "C. Đại hội VII (1991)", "D. Đại hội VIII (1996)"],
            correct: "A",
            explanation: "Đại hội VI (12/1986) mở ra bước ngoặt lịch sử quan trọng, chuyển nền kinh tế từ quan liêu bao cấp sang kinh tế thị trường định hướng XHCN."
        },
        {
            id: "his12_t1_q3",
            subject: "Lịch Sử",
            grade: "12",
            period: "mid1",
            topic: "Trật tự thế giới sau Chiến tranh thế giới thứ hai",
            content: "Tổ chức Liên Hợp Quốc (UN) chính thức thành lập vào ngày 24/10/1945 với tôn chỉ mục đích cao nhất là:",
            options: ["A. Duy trì hòa bình và an ninh quốc tế, phát triển quan hệ hữu nghị giữa các quốc gia", "B. Liên minh quân sự chống Liên Xô", "C. Thống nhất tiền tệ toàn cầu", "D. Xóa bỏ biên giới các nước"],
            correct: "A",
            explanation: "Mục tiêu hàng đầu của Hiến chương Liên Hợp Quốc là ngăn chặn chiến tranh thế giới, giữ gìn hòa bình và an ninh quốc tế."
        },
        {
            id: "his12_t2_q3",
            subject: "Lịch Sử",
            grade: "12",
            period: "final1",
            topic: "Cách mạng tháng Tám 1945 & Kháng chiến chống Pháp",
            content: "Lời kêu gọi Toàn quốc kháng chiến của Chủ tịch Hồ Chí Minh được phát đi vào đêm ngày nào?",
            options: ["A. Đêm 19/12/1946", "B. Đêm 02/09/1945", "C. Đêm 19/08/1945", "D. Đêm 22/12/1944"],
            correct: "A",
            explanation: "Tối ngày 19/12/1946 tại Vạn Phúc (Hà Đông), Chủ tịch Hồ Chí Minh ra Lời kêu gọi Toàn quốc kháng chiến: 'Thà hi sinh tất cả chứ nhất định không chịu mất nước'."
        },
        {
            id: "his12_t3_q3",
            subject: "Lịch Sử",
            grade: "12",
            period: "mid2",
            topic: "Kháng chiến chống Mỹ cứu nước (1954-1975)",
            content: "Thắng lợi nào của quân và dân miền Bắc đã làm nên trận 'Điện Biên Phủ trên không' vào tháng 12/1972?",
            options: ["A. Đánh bại cuộc tập kích chiến lược đường không bằng máy bay B-52 của đế quốc Mỹ vào Hà Nội, Hải Phòng", "B. Chiến thắng Vạn Tường", "C. Trận Ấp Bắc", "D. Cuộc Tổng tiến công Mậu Thân 1968"],
            correct: "A",
            explanation: "Trong 12 ngày đêm cuối năm 1972, quân dân miền Bắc bắn rơi 81 máy bay Mỹ (trong đó có 34 chiếc B-52), buộc Mỹ phải kí Hiệp định Paris."
        },
        {
            id: "his12_t4_q3",
            subject: "Lịch Sử",
            grade: "12",
            period: "final2",
            topic: "Công cuộc Đổi mới đất nước từ năm 1986",
            content: "Nội dung trọng tâm then chốt trong đường lối Đổi mới của Đảng ta đề ra từ năm 1986 là đổi mới trên lĩnh vực nào?",
            options: ["A. Đổi mới kinh tế là trọng tâm, xây dựng Đảng là then chốt", "B. Đổi mới chính trị trước tiên", "C. Duy trì bao cấp toàn diện", "D. Ngừng quan hệ đối ngoại"],
            correct: "A",
            explanation: "Đảng chủ trương tập trung đổi mới kinh tế, từng bước đổi mới chính trị vững chắc, lấy kinh tế làm cơ sở nâng cao đời sống nhân dân."
        },
        {
            id: "his12_t5_q3",
            subject: "Lịch Sử",
            grade: "12",
            period: "final2",
            topic: "Lịch sử đối ngoại & ASEAN",
            content: "Việt Nam thực hiện đường lối đối ngoại độc lập, tự chủ, đa phương hóa, đa dạng hóa với phương châm:",
            options: ["A. Việt Nam là bạn, là đối tác tin cậy và là thành viên có trách nhiệm của cộng đồng quốc tế", "B. Đóng cửa khép kín tự cung tự cấp", "C. Chỉ hợp tác với các nước láng giềng", "D. Tham gia liên minh quân sự đối đầu"],
            correct: "A",
            explanation: "Chính sách đối ngoại thời kì đổi mới: Việt Nam sẵn sàng là bạn, đối tác tin cậy của mọi quốc gia trên cơ sở bình đẳng, tôn trọng chủ quyền."
        },
        {
            id: "su12_f1_extra1",
            subject: "Lịch Sử",
            grade: "12",
            period: "final1",
            topic: "Cách mạng tháng Tám 1945 & Kháng chiến chống Pháp",
            content: "Ngày 2/9/1945 tại Quảng trường Ba Đình (Hà Nội), Chủ tịch Hồ Chí Minh đã đọc văn kiện lịch sử nào?",
            options: ["A. Tuyên ngôn Độc lập khai sinh nước Việt Nam Dân chủ Cộng hòa", "B. Lời kêu gọi Toàn quốc kháng chiến", "C. Cương lĩnh chính trị đầu tiên", "D. Báo cáo chính trị Đại hội II"],
            correct: "A",
            explanation: "Bản Tuyên ngôn Độc lập ngày 2/9/1945 khai sinh ra nước Việt Nam Dân chủ Cộng hòa."
        },
        {
            id: "su12_m2_extra1",
            subject: "Lịch Sử",
            grade: "12",
            period: "mid2",
            topic: "Kháng chiến chống Mỹ cứu nước (1954-1975)",
            content: "Chiến dịch quân sự quyết định mang tên Chủ tịch Hồ Chí Minh đã toàn thắng vào ngày nào, giải phóng hoàn toàn miền Nam?",
            options: ["A. Ngày 30/4/1975", "B. Ngày 26/3/1975", "C. Ngày 1/5/1975", "D. Ngày 19/5/1975"],
            correct: "A",
            explanation: "11 giờ 30 phút ngày 30/4/1975, lá cờ cách mạng tung bay trên nóc Dinh Độc Lập, giải phóng hoàn toàn miền Nam."
        },
        {
            id: "su12_f2_extra1",
            subject: "Lịch Sử",
            grade: "12",
            period: "final2",
            topic: "Công cuộc Đổi mới đất nước từ năm 1986",
            content: "Đại hội lần thứ mấy của Đảng Cộng sản Việt Nam (tháng 12/1986) đã đề ra đường lối Đổi mới toàn diện đất nước?",
            options: ["A. Đại hội đại biểu toàn quốc lần thứ VI", "B. Đại hội lần thứ V", "C. Đại hội lần thứ VII", "D. Đại hội lần thứ IV"],
            correct: "A",
            explanation: "Đại hội VI (12/1986) là mốc lịch sử mở ra công cuộc Đổi mới, phát triển kinh tế thị trường định hướng XHCN."
        },
    ],
    "Địa Lí": [
        {
            id: "g12_1",
            subject: "Địa Lí",
            grade: "12",
            period: "mid1",
            topic: "Vị trí địa lí & Thiên nhiên nhiệt đới ẩm gió mùa",
            content: "Nước ta có vị trí nằm hoàn toàn trong vùng nội chí tuyến bán cầu Bắc, điều này làm cho thiên nhiên nước ta mang tính chất cơ bản là:",
            options: ["A. Nhiệt đới ẩm gió mùa", "B. Khô hạn hoang mạc", "C. Ôn đới lục địa", "D. Cận xích đạo khô"],
            correct: "A",
            explanation: "Vị trí nội chí tuyến và tiếp giáp Biển Đông giúp nước ta có nền nhiệt cao, mưa nhiều và chịu ảnh hưởng của các khối khí gió mùa."
        },
        {
            id: "g12_2",
            subject: "Địa Lí",
            grade: "12",
            period: "final1",
            topic: "Địa hình & Tài nguyên khoáng sản",
            content: "Đặc điểm cơ bản nhất của địa hình nước ta là:",
            options: ["A. Đồi núi chiếm 3/4 diện tích lãnh thổ, nhưng chủ yếu là đồi núi thấp dưới 1000m", "B. Đồng bằng chiếm đại bộ phận lãnh thổ", "C. Đồi núi cao hiểm trở chiếm hơn 80%", "D. Toàn bộ lãnh thổ là cao nguyên bazan"],
            correct: "A",
            explanation: "Địa hình đồi núi chiếm 3/4 diện tích nhưng đồi núi thấp (dưới 1000m) chiếm tới 85% diện tích cả nước."
        },
        {
            id: "g12_3",
            subject: "Địa Lí",
            grade: "12",
            period: "mid2",
            topic: "Vấn đề sử dụng tài nguyên & Môi trường",
            content: "Hiện tượng ngập lụt vào mùa mưa và xâm nhập mặn sâu vào mùa khô diễn ra nặng nề nhất ở vùng đồng bằng nào của nước ta?",
            options: ["A. Đồng bằng sông Cửu Long", "B. Đồng bằng sông Hồng", "C. Đồng bằng duyên hải miền Trung", "D. Thung lũng sông Đà"],
            correct: "A",
            explanation: "ĐBSCL có địa hình thấp trũng, mạng lưới kênh rạch chằng chịt và mùa khô kéo dài nên xâm nhập mặn ăn sâu vào đất liền."
        },
        {
            id: "g12_4",
            subject: "Địa Lí",
            grade: "12",
            period: "final2",
            topic: "Địa lí dân cư & Đô thị hóa",
            content: "Đô thị hóa ở nước ta hiện nay có đặc điểm nổi bật là:",
            options: ["A. Diễn ra nhanh chóng, tỉ lệ dân thành thị tăng nhưng chất lượng đô thị vẫn cần tiếp tục nâng cao", "B. Tỉ lệ dân nông thôn ngày càng tăng", "C. Không hình thành các đô thị vệ tinh", "D. Dân cư phân bố đều khắp các vùng"],
            correct: "A",
            explanation: "Quá trình công nghiệp hóa thúc đẩy đô thị hóa phát triển, thu hút lao động về các thành phố lớn."
        },
        {
            id: "g12_5",
            subject: "Địa Lí",
            grade: "12",
            period: "final2",
            topic: "Chuyển dịch cơ cấu kinh tế ngành & Vùng biển đảo",
            content: "Xu hướng chuyển dịch cơ cấu ngành kinh tế tích cực ở nước ta hiện nay là:",
            options: ["A. Giảm tỉ trọng ngành nông - lâm - thủy sản, tăng tỉ trọng công nghiệp - xây dựng và dịch vụ", "B. Tăng mạnh tỉ trọng nông nghiệp thô", "C. Giảm phát triển dịch vụ và du lịch", "D. Chỉ tập trung vào khai thác dầu thô"],
            correct: "A",
            explanation: "Chuyển dịch theo hướng công nghiệp hóa, hiện đại hóa: khu vực I giảm, khu vực II và III tăng dần."
        },
        {
            id: "geo12_extra_1",
            subject: "Địa Lí",
            grade: "12",
            period: "mid1",
            topic: "Vị trí địa lí & Thiên nhiên nhiệt đới gió mùa",
            content: "Nước ta nằm hoàn toàn trong vùng nội chí tuyến bán cầu Bắc nên có:",
            options: ["A. Nền nhiệt độ cao, chan hòa ánh nắng và giàu bức xạ mặt trời", "B. Khí hậu ôn đới mát mẻ quanh năm", "C. Hiện tượng tuyết rơi bao phủ diện rộng", "D. Cảnh quan hoang mạc xích đạo"],
            correct: "A",
            explanation: "Vị trí nội chí tuyến quy định tính chất nhiệt đới ẩm gió mùa: Tổng bức xạ lớn, cân bằng bức xạ dương và nhiệt độ trung bình năm > 20°C."
        },
        {
            id: "geo12_extra_2",
            subject: "Địa Lí",
            grade: "12",
            period: "final1",
            topic: "Địa lí dân cư & Đô thị hóa",
            content: "Đặc điểm cơ bản nổi bật của dân số nước ta hiện nay là:",
            options: ["A. Quy mô dân số đông, cơ cấu dân số trẻ và đang trong giai đoạn cơ cấu dân số vàng", "B. Dân số giảm nhanh chóng", "C. Dân cư phân bố rất đồng đều giữa các vùng", "D. Tỉ lệ dân thành thị cao hơn nông thôn"],
            correct: "A",
            explanation: "Dân số Việt Nam trên 100 triệu dân (đứng thứ 15 thế giới), cơ cấu dân số vàng tạo nguồn lực lao động dồi dào cho phát triển kinh tế."
        },
        {
            id: "geo12_extra_3",
            subject: "Địa Lí",
            grade: "12",
            period: "mid2",
            topic: "Địa lí các ngành kinh tế",
            content: "Hai vùng chuyên canh cây lúa lớn nhất ở nước ta hiện nay là:",
            options: ["A. Đồng bằng sông Cửu Long và Đồng bằng sông Hồng", "B. Duyên hải Nam Trung Bộ và Bắc Trung Bộ", "C. Tây Nguyên và Đông Nam Bộ", "D. Trung du và miền núi Bắc Bộ"],
            correct: "A",
            explanation: "Đồng bằng sông Cửu Long (vựa lúa số 1) và Đồng bằng sông Hồng là hai vùng trọng điểm sản xuất lúa gạo lớn nhất cả nước."
        },
        {
            id: "geo12_extra_4",
            subject: "Địa Lí",
            grade: "12",
            period: "final2",
            topic: "Địa lí các vùng kinh tế",
            content: "Vùng dẫn đầu cả nước về giá trị sản xuất công nghiệp và thu hút vốn đầu tư FDI là:",
            options: ["A. Đông Nam Bộ", "B. Tây Bắc Bộ", "C. Tây Nguyên", "D. Bắc Trung Bộ"],
            correct: "A",
            explanation: "Đông Nam Bộ với hạt nhân TP. Hồ Chí Minh là trung tâm kinh tế năng động nhất, đóng góp ngân sách và giá trị công nghiệp cao nhất cả nước."
        },
        {
            id: "geo12_extra_5",
            subject: "Địa Lí",
            grade: "12",
            period: "final2",
            topic: "Kinh tế biển đảo",
            content: "Hai quần đảo xa bờ có ý nghĩa chiến lược to lớn về quốc phòng và kinh tế biển của nước ta là:",
            options: ["A. Hoàng Sa và Trường Sa", "B. Cát Bà và Côn Đảo", "C. Phú Quốc và Lý Sơn", "D. Thổ Chu và Phú Quý"],
            correct: "A",
            explanation: "Hoàng Sa (thuộc TP Đà Nẵng) và Trường Sa (thuộc tỉnh Khánh Hòa) là hai quần đảo tiền tiêu khẳng định chủ quyền biển đảo thiêng liêng của Tổ quốc."
        },
        {
            id: "geo12_t1_q3",
            subject: "Địa Lí",
            grade: "12",
            period: "mid1",
            topic: "Vị trí địa lí & Thiên nhiên nhiệt đới ẩm gió mùa",
            content: "Gió mùa Đông Bắc hoạt động ở miền Bắc nước ta trong thời gian từ tháng mấy đến tháng mấy?",
            options: ["A. Từ tháng 11 đến tháng 4 năm sau", "B. Từ tháng 5 đến tháng 10", "C. Quanh năm không dứt", "D. Chỉ trong tháng 12"],
            correct: "A",
            explanation: "Gió mùa Đông Bắc xuất phát từ cao áp Siberia thổi vào nước ta từ tháng 11 đến tháng 4, tạo nên mùa đông lạnh ở miền Bắc."
        },
        {
            id: "geo12_t2_q3",
            subject: "Địa Lí",
            grade: "12",
            period: "final1",
            topic: "Địa hình & Tài nguyên khoáng sản",
            content: "Địa hình nước ta có đặc điểm cơ bản nào sau đây?",
            options: ["A. Đồi núi chiếm 3/4 diện tích lãnh thổ, nhưng chủ yếu là đồi núi thấp dưới 1000m", "B. Đồng bằng chiếm phần lớn diện tích", "C. Toàn bộ là núi cao hiểm trở trên 3000m", "D. Hoang mạc cát bao phủ"],
            correct: "A",
            explanation: "Đồi núi chiếm 3/4 diện tích đất liền, đồng bằng chỉ chiếm 1/4; trong đó đồi núi thấp dưới 1000m chiếm tới 85%."
        },
        {
            id: "geo12_t3_q3",
            subject: "Địa Lí",
            grade: "12",
            period: "mid2",
            topic: "Vấn đề sử dụng tài nguyên & Môi trường",
            content: "Nguyên nhân chủ yếu dẫn đến sự suy giảm tài nguyên rừng ở nước ta trong những thập kỉ qua là:",
            options: ["A. Khai thác quá mức, cháy rừng và chuyển đổi mục đích sử dụng đất trái phép", "B. Rừng tự thoái hóa già cỗi", "C. Không có lượng mưa", "D. Mùa đông quá lạnh"],
            correct: "A",
            explanation: "Chặt phá rừng bừa bãi, du canh du cư và cháy rừng là những nguyên nhân chính làm thu hẹp diện tích rừng tự nhiên."
        },
        {
            id: "geo12_t4_q3",
            subject: "Địa Lí",
            grade: "12",
            period: "final2",
            topic: "Địa lí dân cư & Đô thị hóa",
            content: "Đặc điểm cơ cấu dân số theo độ tuổi của nước ta trong giai đoạn hiện nay là:",
            options: ["A. Đang trong giai đoạn 'cơ cấu dân số vàng' và bước vào quá trình già hóa dân số", "B. Dân số trẻ vĩnh viễn", "C. Dân số già như Tây Âu", "D. Tỉ lệ trẻ sơ sinh tăng vọt"],
            correct: "A",
            explanation: "Việt Nam có lực lượng lao động dồi dào (dân số vàng) đồng thời tốc độ già hóa dân số đang diễn ra rất nhanh."
        },
        {
            id: "geo12_t5_q3",
            subject: "Địa Lí",
            grade: "12",
            period: "final2",
            topic: "Chuyển dịch cơ cấu kinh tế ngành & Vùng biển đảo",
            content: "Vùng kinh tế trọng điểm nào dẫn đầu cả nước về GDP, giá trị xuất khẩu và thu hút đầu tư nước ngoài (FDI)?",
            options: ["A. Vùng kinh tế trọng điểm phía Nam (Đông Nam Bộ)", "B. Vùng kinh tế trọng điểm miền Trung", "C. Vùng Tây Nguyên", "D. Vùng Trung du miền núi phía Bắc"],
            correct: "A",
            explanation: "Vùng kinh tế trọng điểm phía Nam với TP.HCM, Bình Dương, Đồng Nai, Bà Rịa - Vũng Tàu là đầu tàu kinh tế số 1 cả nước."
        },
        {
            id: "dia12_m1_extra1",
            subject: "Địa Lí",
            grade: "12",
            period: "mid1",
            topic: "Vị trí địa lí & Thiên nhiên nhiệt đới ẩm gió mùa",
            content: "Tính chất nhiệt đới ẩm gió mùa của khí hậu Việt Nam được quy định bởi nhân tố chủ yếu nào?",
            options: ["A. Nằm hoàn toàn trong vùng nội chí tuyến Bắc bán cầu và tiếp giáp Biển Đông giàu ẩm", "B. Nằm gần tâm bão Thái Bình Dương", "C. Có nhiều dãy núi cao trên 3000m", "D. Diện tích rừng nguyên sinh rộng lớn"],
            correct: "A",
            explanation: "Vị trí nội chí tuyến quy định nhiệt độ cao và Biển Đông mang lại nguồn ẩm dồi dào tạo nên tính chất nhiệt đới ẩm gió mùa."
        },
        {
            id: "dia12_f1_extra1",
            subject: "Địa Lí",
            grade: "12",
            period: "final1",
            topic: "Địa lí dân cư & Đô thị hóa",
            content: "Đặc điểm nổi bật của dân số nước ta hiện nay là:",
            options: ["A. Dân số đông, nhiều thành phần dân tộc và đang trong thời kì cơ cấu dân số vàng", "B. Dân số giảm nhanh chóng", "C. Tỉ lệ dân số thành thị cao nhất thế giới", "D. Phân bố dân cư hoàn toàn đồng đều"],
            correct: "A",
            explanation: "Việt Nam có quy mô dân số gần 100 triệu người, 54 dân tộc và lực lượng lao động dồi dào."
        },
        {
            id: "dia12_m2_extra1",
            subject: "Địa Lí",
            grade: "12",
            period: "mid2",
            topic: "Chuyển dịch cơ cấu kinh tế ngành & Vùng biển đảo",
            content: "Vùng kinh tế trọng điểm nào có giá trị sản xuất công nghiệp và quy mô GRDP lớn nhất cả nước?",
            options: ["A. Vùng kinh tế trọng điểm phía Nam", "B. Vùng kinh tế trọng điểm Bắc Bộ", "C. Vùng kinh tế trọng điểm miền Trung", "D. Vùng Đồng bằng sông Cửu Long"],
            correct: "A",
            explanation: "Vùng kinh tế trọng điểm phía Nam (TP.HCM, Bình Dương, Đồng Nai, Bà Rịa - Vũng Tàu...) dẫn đầu về công nghiệp và thu hút vốn đầu tư."
        },
        {
            id: "dia12_f2_extra1",
            subject: "Địa Lí",
            grade: "12",
            period: "final2",
            topic: "Chuyển dịch cơ cấu kinh tế ngành & Vùng biển đảo",
            content: "Hai quần đảo xa bờ có ý nghĩa chiến lược to lớn về chủ quyền biển đảo của nước ta là:",
            options: ["A. Quần đảo Hoàng Sa và quần đảo Trường Sa", "B. Quần đảo Cát Bà và Côn Đảo", "C. Đảo Phú Quốc và đảo Lý Sơn", "D. Quần đảo Thổ Chu và Phú Quý"],
            correct: "A",
            explanation: "Hoàng Sa (thuộc TP Đà Nẵng) và Trường Sa (thuộc tỉnh Khánh Hòa) là hai quần đảo tiền tiêu khẳng định chủ quyền thiêng liêng."
        },
    ],
    "GDKT&PL": [
        {
            id: "l12_1",
            subject: "GDKT&PL",
            grade: "12",
            period: "mid1",
            topic: "Tăng trưởng & Phát triển kinh tế",
            content: "Sự gia tăng về quy mô sản lượng của nền kinh tế (thường đo bằng chỉ tiêu GDP hoặc GNI) trong một thời kì gọi là:",
            options: ["A. Tăng trưởng kinh tế", "B. Phát triển bền vững", "C. Chuyển dịch cơ cấu", "D. Khủng hoảng kinh tế"],
            correct: "A",
            explanation: "Tăng trưởng kinh tế phản ánh sự gia tăng thuần túy về số lượng hàng hóa và dịch vụ được tạo ra trong nền kinh tế."
        },
        {
            id: "l12_2",
            subject: "GDKT&PL",
            grade: "12",
            period: "final1",
            topic: "Hội nhập kinh tế quốc tế",
            content: "Việt Nam chính thức gia nhập Tổ chức Thương mại Thế giới (WTO) vào năm nào?",
            options: ["A. Năm 2007 (thành viên thứ 150)", "B. Năm 1995", "C. Năm 2000", "D. Năm 2015"],
            correct: "A",
            explanation: "Ngày 11/1/2007, Việt Nam chính thức trở thành thành viên thứ 150 của WTO, mở rộng hội nhập quốc tế sâu rộng."
        },
        {
            id: "l12_3",
            subject: "GDKT&PL",
            grade: "12",
            period: "mid2",
            topic: "Bảo hiểm và an sinh xã hội",
            content: "Loại hình bảo hiểm do Nhà nước tổ chức, bắt buộc người sử dụng lao động và người lao động tham gia nhằm bảo đảm bù đắp thu nhập khi ốm đau, thai sản, hưu trí là:",
            options: ["A. Bảo hiểm xã hội bắt buộc", "B. Bảo hiểm thương mại", "C. Bảo hiểm nhân thọ tự nguyện", "D. Bảo hiểm tài sản"],
            correct: "A",
            explanation: "Bảo hiểm xã hội là trụ cột chính sách an sinh xã hội cốt lõi bảo vệ người lao động trước các rủi ro việc làm và sức khỏe."
        },
        {
            id: "l12_4",
            subject: "GDKT&PL",
            grade: "12",
            period: "final2",
            topic: "Quyền và nghĩa vụ trong hôn nhân & gia đình",
            content: "Theo Luật Hôn nhân và Gia đình, tài sản chung của vợ chồng gồm:",
            options: ["A. Tài sản do vợ, chồng tạo ra, thu nhập do lao động, hoạt động sản xuất kinh doanh trong thời kì hôn nhân", "B. Toàn bộ tài sản bố mẹ vợ cho riêng trước khi kết hôn", "C. Tài sản được thừa kế riêng của người chồng", "D. Quần áo cá nhân của từng người"],
            correct: "A",
            explanation: "Tài sản chung hợp pháp là tài sản do vợ chồng tạo ra hoặc thu nhập từ sản xuất trong thời kỳ hôn nhân."
        },
        {
            id: "l12_5",
            subject: "GDKT&PL",
            grade: "12",
            period: "final2",
            topic: "Pháp luật về bảo vệ môi trường & Quốc phòng an ninh",
            content: "Hành vi xả nước thải công nghiệp chưa qua xử lý vượt quy chuẩn ra sông ngòi gây ô nhiễm môi trường là hành vi vi phạm:",
            options: ["A. Pháp luật về bảo vệ môi trường, bị xử phạt hành chính hoặc truy cứu trách nhiệm hình sự", "B. Chỉ bị nhắc nhở nội bộ", "C. Không vi phạm vì phục vụ sản xuất", "D. Quy chế đạo đức thôn xóm"],
            correct: "A",
            explanation: "Luật Bảo vệ môi trường nghiêm cấm xả thải chưa xử lý; vi phạm nghiêm trọng sẽ bị xử lý hình sự tội gây ô nhiễm môi trường."
        },
        {
            id: "law12_extra_1",
            subject: "GDKT&PL",
            grade: "12",
            period: "mid1",
            topic: "Tăng trưởng và phát triển kinh tế",
            content: "Tăng trưởng kinh tế là sự gia tăng về:",
            options: ["A. Quy mô sản lượng hàng hóa và dịch vụ được tạo ra trong nền kinh tế qua một thời kì nhất định (GDP, GNI)", "B. Tỉ lệ thất nghiệp", "C. Nợ công quốc gia", "D. Mức độ ô nhiễm môi trường"],
            correct: "A",
            explanation: "Tăng trưởng kinh tế biểu thị sự gia tăng tổng sản phẩm quốc nội (GDP) hoặc tổng thu nhập quốc dân (GNI) qua các năm."
        },
        {
            id: "law12_extra_2",
            subject: "GDKT&PL",
            grade: "12",
            period: "final1",
            topic: "Hội nhập kinh tế quốc tế",
            content: "Việt Nam chính thức trở thành thành viên thứ 150 của Tổ chức Thương mại Thế giới (WTO) vào năm nào?",
            options: ["A. 2007", "B. 1995", "C. 2000", "D. 2015"],
            correct: "A",
            explanation: "Ngày 11/01/2007, Việt Nam chính thức trở thành thành viên thứ 150 của WTO, đánh dấu bước hội nhập sâu rộng vào thương mại toàn cầu."
        },
        {
            id: "law12_extra_3",
            subject: "GDKT&PL",
            grade: "12",
            period: "mid2",
            topic: "Bảo hiểm và an sinh xã hội",
            content: "Mục đích cơ bản của chính sách Bảo hiểm xã hội ở nước ta là:",
            options: ["A. Bảo đảm thay thế hoặc bù đắp một phần thu nhập của người lao động khi bị giảm hoặc mất thu nhập do ốm đau, thai sản, tai nạn lao động, hết tuổi lao động", "B. Thu lợi nhuận thương mại tối đa", "C. Giảm nguồn quỹ phúc lợi", "D. Bắt buộc người dân vay nợ"],
            correct: "A",
            explanation: "Bảo hiểm xã hội là trụ cột cốt lõi của hệ thống an sinh xã hội, chia sẻ rủi ro và bảo vệ quyền lợi người lao động."
        },
        {
            id: "law12_extra_4",
            subject: "GDKT&PL",
            grade: "12",
            period: "final2",
            topic: "Quyền và nghĩa vụ của công dân",
            content: "Công dân có quyền tự do kinh doanh trong các ngành nghề mà:",
            options: ["A. Pháp luật không cấm", "B. Chưa ai từng làm", "C. Không cần xin giấy phép bất kì lĩnh vực nào", "D. Có tỉ suất lợi nhuận trên 100%"],
            correct: "A",
            explanation: "Hiến pháp năm 2013 quy định rõ: Mọi người có quyền tự do kinh doanh trong những ngành nghề mà pháp luật không nghiêm cấm."
        },
        {
            id: "law12_extra_5",
            subject: "GDKT&PL",
            grade: "12",
            period: "final2",
            topic: "Pháp luật về bảo vệ môi trường",
            content: "Hành vi nào sau đây vi phạm pháp luật về bảo vệ môi trường?",
            options: ["A. Xả chất thải độc hại chưa qua xử lí ra nguồn nước tự nhiên", "B. Trồng cây gây rừng", "C. Phân loại rác tại nguồn", "D. Sử dụng năng lượng mặt trời"],
            correct: "A",
            explanation: "Xả chất thải độc hại trực tiếp ra môi trường là hành vi bị nghiêm cấm theo Luật Bảo vệ Môi trường, có thể bị xử lí hình sự."
        },
        {
            id: "law12_t1_q3",
            subject: "GDKT&PL",
            grade: "12",
            period: "mid1",
            topic: "Tăng trưởng & Phát triển kinh tế",
            content: "Phát triển kinh tế bền vững đòi hỏi phải kết hợp hài hòa giữa tăng trưởng kinh tế với:",
            options: ["A. Tiến bộ, công bằng xã hội và bảo vệ môi trường sinh thái", "B. Tiêu diệt rừng để xây nhà máy", "C. Gia tăng tối đa khoảng cách giàu nghèo", "D. Ngừng đầu tư giáo dục y tế"],
            correct: "A",
            explanation: "Phát triển bền vững là sự phát triển đáp ứng nhu cầu hiện tại mà không làm tổn hại đến khả năng đáp ứng của thế hệ tương lai."
        },
        {
            id: "law12_t2_q3",
            subject: "GDKT&PL",
            grade: "12",
            period: "final1",
            topic: "Hội nhập kinh tế quốc tế",
            content: "Hiệp định thương mại tự do thế hệ mới mà Việt Nam tham gia có mức độ cam kết sâu rộng và toàn diện là:",
            options: ["A. CPTPP và EVFTA", "B. Hiệp ước Warsaw", "C. Khối SEV bao cấp", "D. Hiệp ước phòng thủ ANZUS"],
            correct: "A",
            explanation: "CPTPP (Hiệp định Đối tác Toàn diện và Tiến bộ xuyên Thái Bình Dương) và EVFTA (Việt Nam - EU) mở rộng thị trường xuất khẩu chiến lược."
        },
        {
            id: "law12_t3_q3",
            subject: "GDKT&PL",
            grade: "12",
            period: "mid2",
            topic: "Bảo hiểm và an sinh xã hội",
            content: "Chính sách trợ cấp xã hội của Nhà nước hướng tới đối tượng nào sau đây?",
            options: ["A. Người cao tuổi cô đơn không nơi nương tựa, người khuyết tật nặng và trẻ mồ côi", "B. Các doanh nhân thành đạt", "C. Người có thu nhập tiền tỷ mỗi tháng", "D. Các công ty đa quốc gia"],
            correct: "A",
            explanation: "Trợ cấp xã hội là lưới an sinh dành cho những người yếu thế, khó khăn nhằm đảm bảo mức sống tối thiểu của con người."
        },
        {
            id: "law12_t4_q3",
            subject: "GDKT&PL",
            grade: "12",
            period: "final2",
            topic: "Quyền và nghĩa vụ trong hôn nhân & gia đình",
            content: "Nguyên tắc cơ bản của chế độ hôn nhân và gia đình theo Luật Hôn nhân và Gia đình Việt Nam là:",
            options: ["A. Hôn nhân tự nguyện, tiến bộ, một vợ một chồng, vợ chồng bình đẳng", "B. Cha mẹ đặt đâu con ngồi đấy", "C. Đa thê hợp pháp", "D. Phân biệt đối xử giữa các con"],
            correct: "A",
            explanation: "Điều 2 Luật HNGĐ 2014 khẳng định: Hôn nhân tự nguyện, một vợ một chồng, vợ chồng bình đẳng, tôn trọng lẫn nhau."
        },
        {
            id: "law12_t5_q3",
            subject: "GDKT&PL",
            grade: "12",
            period: "final2",
            topic: "Pháp luật về bảo vệ môi trường & Quốc phòng an ninh",
            content: "Cơ quan, tổ chức, hộ gia đình và cá nhân gây ô nhiễm môi trường thì phải có trách nhiệm gì?",
            options: ["A. Khắc phục hậu quả, bồi thường thiệt hại và chịu trách nhiệm pháp lí theo quy định", "B. Không phải chịu trách nhiệm nếu nộp phạt tượng trưng", "C. Đổ lỗi cho thiên tai", "D. Rời bỏ hiện trường"],
            correct: "A",
            explanation: "Nguyên tắc 'Người gây ô nhiễm phải trả tiền' (Polluter Pays Principle) quy định người gây ô nhiễm phải bồi thường thiệt hại và phục hồi môi trường."
        },
        {
            id: "ktpl12_m1_extra1",
            subject: "GDKT&PL",
            grade: "12",
            period: "mid1",
            topic: "Tăng trưởng & Phát triển kinh tế",
            content: "Chỉ tiêu kinh tế tổng hợp phản ánh tổng giá trị sản phẩm vật chất và dịch vụ cuối cùng do nền kinh tế tạo ra trong một năm là:",
            options: ["A. GDP (Tổng sản phẩm quốc nội)", "B. CPI (Chỉ số giá tiêu dùng)", "C. FDI (Vốn đầu tư trực tiếp)", "D. ODA (Viện trợ phát triển)"],
            correct: "A",
            explanation: "GDP là chỉ số cơ bản đo lường quy mô và tốc độ tăng trưởng kinh tế của một quốc gia."
        },
        {
            id: "ktpl12_f1_extra1",
            subject: "GDKT&PL",
            grade: "12",
            period: "final1",
            topic: "Hội nhập kinh tế quốc tế",
            content: "Việt Nam tham gia các hiệp định thương mại tự do thế hệ mới (như CPTPP, EVFTA) đem lại cơ hội lớn nhất nào?",
            options: ["A. Mở rộng thị trường xuất khẩu và thu hút dòng vốn đầu tư công nghệ cao", "B. Xóa bỏ hoàn toàn doanh nghiệp trong nước", "C. Được viện trợ tài chính vô điều kiện", "D. Không cần đóng thuế hải quan quốc tế"],
            correct: "A",
            explanation: "FTA thế hệ mới cắt giảm thuế quan sâu rộng, tạo cơ hội bứt phá cho hàng hóa xuất khẩu Việt Nam."
        },
        {
            id: "ktpl12_m2_extra1",
            subject: "GDKT&PL",
            grade: "12",
            period: "mid2",
            topic: "Quyền và nghĩa vụ trong hôn nhân & gia đình",
            content: "Độ tuổi kết hôn hợp pháp theo Luật Hôn nhân và gia đình Việt Nam hiện hành là:",
            options: ["A. Nam từ đủ 20 tuổi trở lên, nữ từ đủ 18 tuổi trở lên", "B. Nam từ 18 tuổi, nữ từ 16 tuổi", "C. Cả nam và nữ đều đủ 20 tuổi", "D. Không quy định độ tuổi"],
            correct: "A",
            explanation: "Điều 8 Luật Hôn nhân và gia đình quy định: nam từ đủ 20 tuổi, nữ từ đủ 18 tuổi trở lên."
        },
        {
            id: "ktpl12_f2_extra1",
            subject: "GDKT&PL",
            grade: "12",
            period: "final2",
            topic: "Pháp luật về bảo vệ môi trường & Quốc phòng an ninh",
            content: "Hành vi xả nước thải công nghiệp chưa qua xử lý vượt quy chuẩn ra sông ngòi sẽ bị:",
            options: ["A. Xử phạt hành chính rất nặng hoặc bị truy cứu trách nhiệm hình sự", "B. Chỉ nhắc nhở nhẹ nhàng", "C. Được khen thưởng vì tiết kiệm chi phí", "D. Không bị xử lý"],
            correct: "A",
            explanation: "Xả thải hủy hoại môi trường là hành vi vi phạm pháp luật nghiêm trọng, bị phạt tiền rất nặng hoặc phạt tù."
        },
    ],
    "Tiếng Anh": [
        {
            id: "e12_1",
            subject: "Tiếng Anh",
            grade: "12",
            period: "mid1",
            topic: "Life Stories & Inspirational Figures",
            content: "Uncle Ho devoted his entire life ________ fighting for national liberation and independence.",
            options: ["A. to", "B. for", "C. in", "D. with"],
            correct: "A",
            explanation: "Cấu trúc cố định: 'devote one's life to V-ing/something' (cống hiến cả cuộc đời cho điều gì)."
        },
        {
            id: "e12_2",
            subject: "Tiếng Anh",
            grade: "12",
            period: "final1",
            topic: "A Diversity of Cultures",
            content: "In many Asian countries, taking off shoes before entering a house is a traditional ________.",
            options: ["A. custom", "B. rule", "C. costume", "D. law"],
            correct: "A",
            explanation: "'custom' là phong tục tập quán văn hóa truyền thống."
        },
        {
            id: "e12_3",
            subject: "Tiếng Anh",
            grade: "12",
            period: "mid2",
            topic: "The Green Movement & Artificial Intelligence",
            content: "Artificial Intelligence (AI) algorithms can help optimize energy consumption and reduce carbon ________.",
            options: ["A. emissions", "B. erasures", "C. absorptions", "D. expansions"],
            correct: "A",
            explanation: "Cụm danh từ phổ biến: 'carbon emissions' (lượng khí thải carbon)."
        },
        {
            id: "e12_4",
            subject: "Tiếng Anh",
            grade: "12",
            period: "final2",
            topic: "Urbanisation & Mega Cities",
            content: "Rapid urbanisation often leads to severe traffic congestion and housing ________ in mega cities.",
            options: ["A. shortages", "B. excess", "C. richness", "D. surplus"],
            correct: "A",
            explanation: "'housing shortages' nghĩa là tình trạng thiếu hụt nhà ở tại các siêu đô thị."
        },
        {
            id: "e12_5",
            subject: "Tiếng Anh",
            grade: "12",
            period: "final2",
            topic: "The World of Work & Lifelong Learning",
            content: "In the modern digital era, employees must constantly adapt and embrace lifelong ________ to stay competitive.",
            options: ["A. learning", "B. sleeping", "C. teaching", "D. resting"],
            correct: "A",
            explanation: "'lifelong learning' nghĩa là việc học tập suốt đời để thích ứng với thế giới công việc thay đổi."
        },
        {
            id: "eng12_extra_1",
            subject: "Tiếng Anh",
            grade: "12",
            period: "mid1",
            topic: "Life Stories & Inspiring People",
            content: "He was awarded a medal for his ______ contribution to the country's scientific development.",
            options: ["A. outstanding", "B. useless", "C. negligible", "D. superficial"],
            correct: "A",
            explanation: "'outstanding contribution' là cụm từ mang nghĩa 'đóng góp kiệt xuất, xuất sắc'."
        },
        {
            id: "eng12_extra_2",
            subject: "Tiếng Anh",
            grade: "12",
            period: "final1",
            topic: "A Multicultural World",
            content: "Living in a diverse society requires us to respect cultural ______ and avoid stereotypes.",
            options: ["A. differences", "B. fights", "C. barriers", "D. disagreements"],
            correct: "A",
            explanation: "Cultural differences (sự khác biệt văn hóa) là cụm từ thông dụng; chúng ta cần tôn trọng sự khác biệt văn hóa giữa các cộng đồng."
        },
        {
            id: "eng12_extra_3",
            subject: "Tiếng Anh",
            grade: "12",
            period: "mid2",
            topic: "Green Living & Urbanisation",
            content: "If we ______ renewable energy instead of fossil fuels, greenhouse gas emissions would decrease significantly.",
            options: ["A. used", "B. will use", "C. use", "D. had been used"],
            correct: "A",
            explanation: "Câu điều kiện loại 2 (Conditional sentence type 2) giả định hành động không có thật ở hiện tại: If + S + V-ed / V2, S + would + V-inf."
        },
        {
            id: "eng12_extra_4",
            subject: "Tiếng Anh",
            grade: "12",
            period: "final2",
            topic: "Artificial Intelligence & Technology",
            content: "Artificial Intelligence is playing an increasingly ______ role in medical diagnosis and automated manufacturing.",
            options: ["A. vital", "B. trivial", "C. helpless", "D. minor"],
            correct: "A",
            explanation: "Play a vital role in something: Đóng vai trò thiết yếu, cực kì quan trọng trong việc gì."
        },
        {
            id: "eng12_extra_5",
            subject: "Tiếng Anh",
            grade: "12",
            period: "final2",
            topic: "Lifelong Learning & Work",
            content: "Young graduates need to develop both hard technical skills and soft skills ______ succeed in today's competitive job market.",
            options: ["A. in order to", "B. so that", "C. because", "D. although"],
            correct: "A",
            explanation: "In order to + V-inf chỉ mục đích: 'để thành công trong thị trường lao động cạnh tranh'."
        },
        {
            id: "eng12_t1_q3",
            subject: "Tiếng Anh",
            grade: "12",
            period: "mid1",
            topic: "Life Stories & Inspirational Figures",
            content: "Uncle Ho devoted his entire life ______ the struggle for national liberation and independence.",
            options: ["A. to", "B. for", "C. with", "D. in"],
            correct: "A",
            explanation: "Cấu trúc devote something to something/doing something: Cống hiến cả cuộc đời cho điều gì."
        },
        {
            id: "eng12_t2_q3",
            subject: "Tiếng Anh",
            grade: "12",
            period: "final1",
            topic: "A Diversity of Cultures",
            content: "In many Asian countries, taking off shoes before entering a house is a common cultural ______.",
            options: ["A. practice", "B. barrier", "C. conflict", "D. disaster"],
            correct: "A",
            explanation: "Cultural practice: Tập quán văn hóa truyền thống quen thuộc."
        },
        {
            id: "eng12_t3_q3",
            subject: "Tiếng Anh",
            grade: "12",
            period: "mid2",
            topic: "The Green Movement & Artificial Intelligence",
            content: "Energy-efficient appliances help households save electricity and reduce their carbon ______.",
            options: ["A. footprint", "B. fingerprint", "C. step", "D. stamp"],
            correct: "A",
            explanation: "Carbon footprint (dấu chân carbon): Thiết bị tiết kiệm điện giúp giảm lượng khí thải nhà kính của hộ gia đình."
        },
        {
            id: "eng12_t4_q3",
            subject: "Tiếng Anh",
            grade: "12",
            period: "final2",
            topic: "Urbanisation & Mega Cities",
            content: "Rapid urbanisation in developing countries has put immense pressure on local public ______ such as schools and hospitals.",
            options: ["A. services", "B. hobbies", "C. games", "D. entertainments"],
            correct: "A",
            explanation: "Public services: Các dịch vụ công ích hạ tầng (trường học, bệnh viện, giao thông công cộng)."
        },
        {
            id: "eng12_t5_q3",
            subject: "Tiếng Anh",
            grade: "12",
            period: "final2",
            topic: "The World of Work & Lifelong Learning",
            content: "In the modern digital era, workers must engage in lifelong learning to ______ pace with technological advancements.",
            options: ["A. keep", "B. catch", "C. make", "D. hold"],
            correct: "A",
            explanation: "Collocation: Keep pace with something (bắt kịp tốc độ phát triển của công nghệ)."
        },
        {
            id: "eng12_m1_extra1",
            subject: "Tiếng Anh",
            grade: "12",
            period: "mid1",
            topic: "Life Stories & Inspirational Figures",
            content: "His inspiring biography has motivated thousands of young people to ________ their dreams.",
            options: ["A. pursue", "B. abandon", "C. delay", "D. ignore"],
            correct: "A",
            explanation: "'Pursue one's dreams' nghĩa là theo đuổi ước mơ, hoài bão."
        },
        {
            id: "eng12_f1_extra1",
            subject: "Tiếng Anh",
            grade: "12",
            period: "final1",
            topic: "The Green Movement & Artificial Intelligence",
            content: "Renewable energy sources like solar and wind power do not ________ carbon emissions.",
            options: ["A. produce", "B. protect", "C. consume", "D. absorb"],
            correct: "A",
            explanation: "Năng lượng tái tạo không tạo ra phát thải carbon (produce carbon emissions)."
        },
        {
            id: "eng12_m2_extra1",
            subject: "Tiếng Anh",
            grade: "12",
            period: "mid2",
            topic: "Urbanisation & Mega Cities",
            content: "Rapid urbanisation often leads to severe traffic ________ during rush hours.",
            options: ["A. congestion", "B. convenience", "C. conversation", "D. condition"],
            correct: "A",
            explanation: "'Traffic congestion' nghĩa là ùn tắc giao thông."
        },
        {
            id: "eng12_f2_extra1",
            subject: "Tiếng Anh",
            grade: "12",
            period: "final2",
            topic: "The World of Work & Lifelong Learning",
            content: "In the modern digital era, ________ learning is vital to adapt to rapidly changing job requirements.",
            options: ["A. lifelong", "B. temporary", "C. superficial", "D. passive"],
            correct: "A",
            explanation: "'Lifelong learning' nghĩa là học tập suốt đời."
        },
    ],
    "Tin Học": [
        {
            id: "t12_1",
            subject: "Tin Học",
            grade: "12",
            period: "mid1",
            topic: "Hệ thống mạng máy tính & TCP/IP",
            content: "Giao thức nào sau đây đóng vai trò nền tảng trong việc định tuyến và truyền gói tin trên mạng Internet toàn cầu?",
            options: ["A. Giao thức TCP/IP", "B. Giao thức Bluetooth", "C. Giao thức HDMI", "D. Giao thức USB 3.0"],
            correct: "A",
            explanation: "TCP/IP là bộ giao thức truyền thông chuẩn quốc tế kết nối các mạng máy tính trên toàn cầu."
        },
        {
            id: "t12_2",
            subject: "Tin Học",
            grade: "12",
            period: "final1",
            topic: "Bảo mật mạng & Tường lửa",
            content: "Thiết bị hoặc phần mềm tường lửa (Firewall) có chức năng chính là gì trong hệ thống mạng?",
            options: ["A. Kiểm soát và lọc lưu lượng mạng vào/ra dựa trên các quy tắc bảo mật nhằm ngăn chặn truy cập trái phép", "B. Làm mát máy tính", "C. Tăng tốc độ in ấn tài liệu", "D. Tự động sao lưu dữ liệu ổ cứng"],
            correct: "A",
            explanation: "Firewall là hàng rào phòng thủ mạng kiểm tra gói tin, ngăn ngừa tấn công mạng và phần mềm độc hại."
        },
        {
            id: "t12_3",
            subject: "Tin Học",
            grade: "12",
            period: "mid2",
            topic: "Trí tuệ nhân tạo (AI) ứng dụng",
            content: "Trí tuệ nhân tạo (AI) trong xử lý ngôn ngữ tự nhiên (NLP) cho phép máy tính làm được điều gì?",
            options: ["A. Hiểu, phân tích và phản hồi ngôn ngữ của con người (như trợ lý ảo, dịch máy)", "B. Chỉ tính toán phép cộng trừ số học", "C. Điều khiển bóng đèn bật tắt cơ học", "D. Vẽ hình bằng bút chì"],
            correct: "A",
            explanation: "NLP (Natural Language Processing) là nhánh của AI giúp máy tính hiểu và tạo văn bản ngôn ngữ tự nhiên."
        },
        {
            id: "t12_4",
            subject: "Tin Học",
            grade: "12",
            period: "final2",
            topic: "Khoa học dữ liệu & Big Data",
            content: "Đặc trưng '3V' kinh điển của Dữ liệu lớn (Big Data) gồm các yếu tố nào?",
            options: ["A. Volume (Quy mô), Velocity (Tốc độ), Variety (Sự đa dạng)", "B. Video, Voice, Vision", "C. Voltage, Value, Vector", "D. Virus, Vulnerability, View"],
            correct: "A",
            explanation: "Mô hình 3V của Big Data: Dung lượng cực lớn (Volume), tốc độ sinh dữ liệu cực nhanh (Velocity) và đa dạng thể loại (Variety)."
        },
        {
            id: "t12_5",
            subject: "Tin Học",
            grade: "12",
            period: "final2",
            topic: "Lập trình ứng dụng số",
            content: "Kiến trúc mô hình Client - Server (Máy khách - Máy chủ) là nền tảng hoạt động của dịch vụ nào sau đây?",
            options: ["A. Các website và ứng dụng điện toán đám mây", "B. Máy tính bỏ túi cầm tay", "C. Đồng hồ bấm giờ", "D. Máy nghe nhạc đĩa mềm"],
            correct: "A",
            explanation: "Trang web hoạt động theo mô hình Client (trình duyệt gửi yêu cầu) và Server (máy chủ xử lý và trả về dữ liệu HTML/JSON)."
        },
        {
            id: "cs12_extra_1",
            subject: "Tin Học",
            grade: "12",
            period: "mid1",
            topic: "Cơ sở dữ liệu quan hệ (RDBMS)",
            content: "Trong cơ sở dữ liệu quan hệ, thuộc tính (hoặc tập thuộc tính) dùng để phân biệt duy nhất mỗi bản ghi trong một bảng được gọi là:",
            options: ["A. Khóa chính (Primary Key)", "B. Khóa ngoại (Foreign Key)", "C. Trường chỉ mục", "D. Kiểu dữ liệu"],
            correct: "A",
            explanation: "Khóa chính (Primary Key) là trường có giá trị duy nhất và không được để trống (NOT NULL), dùng để định danh từng hàng trong bảng."
        },
        {
            id: "cs12_extra_2",
            subject: "Tin Học",
            grade: "12",
            period: "final1",
            topic: "Ngôn ngữ truy vấn SQL",
            content: "Để truy vấn dữ liệu từ bảng HOC_SINH với điều kiện điểm trung bình >= 8.0, câu lệnh SQL nào sau đây là đúng?",
            options: ["A. SELECT * FROM HOC_SINH WHERE DIEM_TB >= 8.0;", "B. GET * FROM HOC_SINH IF DIEM_TB >= 8.0;", "C. FIND * IN HOC_SINH WHERE DIEM_TB >= 8.0;", "D. SHOW HOC_SINH WHEN DIEM_TB >= 8.0;"],
            correct: "A",
            explanation: "Cú pháp chuẩn SQL: SELECT [cột] FROM [bảng] WHERE [điều kiện lọc]."
        },
        {
            id: "cs12_extra_3",
            subject: "Tin Học",
            grade: "12",
            period: "mid2",
            topic: "Mạng máy tính và Internet nâng cao",
            content: "Hệ thống phân giải tên miền từ dạng kí tự dễ nhớ (ví dụ: google.com) sang địa chỉ IP dạng số được gọi là:",
            options: ["A. DNS (Domain Name System)", "B. DHCP", "C. FTP", "D. SMTP"],
            correct: "A",
            explanation: "DNS là dịch vụ mạng chịu trách nhiệm chuyển đổi tên miền dạng chữ sang địa chỉ IP máy chủ để định tuyến gói tin."
        },
        {
            id: "cs12_extra_4",
            subject: "Tin Học",
            grade: "12",
            period: "final2",
            topic: "Trí tuệ nhân tạo (AI) & Đạo đức công nghệ",
            content: "Mô hình ngôn ngữ lớn (Large Language Model - LLM) như ChatGPT hay Gemini thuộc lĩnh vực nào của Trí tuệ nhân tạo?",
            options: ["A. Xử lý ngôn ngữ tự nhiên (NLP) và Học sâu (Deep Learning)", "B. Đồ họa máy tính 3D", "C. Phần cứng cơ điện tử", "D. Thiết kế mạch tích hợp"],
            correct: "A",
            explanation: "LLM được huấn luyện trên lượng dữ liệu văn bản khổng lồ bằng mạng nơ-ron sâu (Transformer), thuộc lĩnh vực NLP."
        },
        {
            id: "cs12_extra_5",
            subject: "Tin Học",
            grade: "12",
            period: "final2",
            topic: "An toàn thông tin & Mã hóa",
            content: "Giao thức truyền siêu văn bản an toàn có mã hóa SSL/TLS trên trình duyệt web được kí hiệu là:",
            options: ["A. HTTPS", "B. HTTP", "C. HTML", "D. URL"],
            correct: "A",
            explanation: "HTTPS (Hypertext Transfer Protocol Secure) sử dụng chứng chỉ SSL/TLS để mã hóa đường truyền dữ liệu giữa client và web server."
        },
        {
            id: "cs12_t1_q3",
            subject: "Tin Học",
            grade: "12",
            period: "mid1",
            topic: "Hệ thống mạng máy tính & TCP/IP",
            content: "Tầng nào trong mô hình giao thức mạng TCP/IP chịu trách nhiệm đánh địa chỉ IP và định tuyến gói tin qua các mạng?",
            options: ["A. Tầng Internet (Network layer)", "B. Tầng Giao vận (Transport layer)", "C. Tầng Ứng dụng (Application layer)", "D. Tầng Liên kết dữ liệu (Data link layer)"],
            correct: "A",
            explanation: "Giao thức IP (Internet Protocol) hoạt động ở tầng Internet để định tuyến các gói tin dựa trên địa chỉ IP đích."
        },
        {
            id: "cs12_t2_q3",
            subject: "Tin Học",
            grade: "12",
            period: "final1",
            topic: "Bảo mật mạng & Tường lửa",
            content: "Tường lửa (Firewall) trong hệ thống mạng máy tính có nhiệm vụ cốt lõi là:",
            options: ["A. Kiểm soát và lọc lưu lượng mạng ra/vào dựa trên các quy tắc bảo mật xác định trước", "B. Tăng tốc độ đường truyền internet lên gấp 10 lần", "C. Dọn dẹp ổ cứng", "D. Nâng cấp bộ nhớ RAM"],
            correct: "A",
            explanation: "Firewall là bức rào chắn phân tích gói tin, ngăn chặn các kết nối độc hại hoặc truy cập trái phép từ bên ngoài."
        },
        {
            id: "cs12_t3_q3",
            subject: "Tin Học",
            grade: "12",
            period: "mid2",
            topic: "Trí tuệ nhân tạo (AI) ứng dụng",
            content: "Kĩ thuật Học có giám sát (Supervised Learning) trong Machine Learning huấn luyện mô hình dựa trên:",
            options: ["A. Dữ liệu đầu vào đã được gán nhãn (Labeled data) kèm kết quả mong đợi", "B. Dữ liệu ngẫu nhiên không có nhãn", "C. Phần thưởng và hình phạt tương tác môi trường", "D. Không cần dữ liệu huấn luyện"],
            correct: "A",
            explanation: "Supervised Learning sử dụng tập dữ liệu có cặp (đầu vào, nhãn đúng) để mô hình học ánh xạ quy luật."
        },
        {
            id: "cs12_t4_q3",
            subject: "Tin Học",
            grade: "12",
            period: "final2",
            topic: "Khoa học dữ liệu & Big Data",
            content: "Bốn đặc trưng tiêu biểu '4V' của Dữ liệu lớn (Big Data) bao gồm:",
            options: ["A. Volume (Quy mô), Velocity (Tốc độ), Variety (Đa dạng), Veracity (Độ tin cậy)", "B. Value, Video, Vision, Voice", "C. Virus, Virtual, Vector, Volume", "D. Variable, Version, Value, Velocity"],
            correct: "A",
            explanation: "4 chữ V kinh điển của Big Data: Khối lượng khổng lồ, tốc độ sinh dữ liệu cực nhanh, định dạng đa dạng và độ chính xác dữ liệu."
        },
        {
            id: "cs12_t5_q3",
            subject: "Tin Học",
            grade: "12",
            period: "final2",
            topic: "Lập trình ứng dụng số",
            content: "Kiến trúc client-server (máy khách - máy chủ) hoạt động theo mô hình nào?",
            options: ["A. Client gửi yêu cầu (Request) và Server xử lý trả về phản hồi (Response)", "B. Server chỉ gửi dữ liệu một chiều không cần yêu cầu", "C. Các máy độc lập hoàn toàn không giao tiếp", "D. Client làm mọi tác vụ lưu trữ dữ liệu"],
            correct: "A",
            explanation: "Mô hình Web chuẩn: Client (trình duyệt) gửi HTTP Request và Server phản hồi HTTP Response chứa HTML/JSON."
        },
        {
            id: "tin12_m1_extra1",
            subject: "Tin Học",
            grade: "12",
            period: "mid1",
            topic: "Trí tuệ nhân tạo (AI) ứng dụng",
            content: "Học máy (Machine Learning) là phân ngành của Trí tuệ nhân tạo cho phép hệ thống:",
            options: ["A. Tự học hỏi và cải thiện hiệu suất từ dữ liệu mà không cần lập trình chi tiết từng quy tắc", "B. Thay thế hoàn toàn phần cứng CPU", "C. Tự động tắt máy tính khi trời tối", "D. Chỉ in ra các văn bản mẫu"],
            correct: "A",
            explanation: "Machine Learning sử dụng thuật toán phân tích tập dữ liệu lớn để tìm quy luật và đưa ra dự đoán chính xác."
        },
        {
            id: "tin12_f1_extra1",
            subject: "Tin Học",
            grade: "12",
            period: "final1",
            topic: "Khoa học dữ liệu & Big Data",
            content: "Đặc trưng '4V' của Dữ liệu lớn (Big Data) bao gồm:",
            options: ["A. Volume (Dung lượng), Velocity (Tốc độ), Variety (Đa dạng), Veracity (Độ tin cậy)", "B. Video, Voice, Virtual, Value", "C. View, Variable, Vector, Version", "D. Virus, Vulnerability, Valid, Vault"],
            correct: "A",
            explanation: "Mô hình 4V của Big Data: Khối lượng dữ liệu khổng lồ, tốc độ xử lý nhanh, tính đa dạng định dạng và độ tin cậy của dữ liệu."
        },
        {
            id: "tin12_m2_extra1",
            subject: "Tin Học",
            grade: "12",
            period: "mid2",
            topic: "Hệ thống mạng máy tính & TCP/IP",
            content: "Giao thức truyền thông nào là nền tảng cốt lõi của mạng Internet toàn cầu?",
            options: ["A. Bộ giao thức TCP/IP", "B. Giao thức Bluetooth", "C. Giao thức hồng ngoại IrDA", "D. Giao thức MIDI"],
            correct: "A",
            explanation: "TCP/IP (Transmission Control Protocol / Internet Protocol) là bộ giao thức nền tảng kết nối mạng Internet."
        },
        {
            id: "tin12_f2_extra1",
            subject: "Tin Học",
            grade: "12",
            period: "final2",
            topic: "Bảo mật mạng & Tường lửa",
            content: "Tường lửa (Firewall) trong hệ thống mạng máy tính đóng vai trò là:",
            options: ["A. Rào chắn kiểm soát lưu lượng mạng vào/ra dựa trên các quy tắc bảo mật được thiết lập", "B. Phần mềm vẽ đồ họa 3D", "C. Thiết bị tăng tốc độ quay quạt nguồn", "D. Bộ phát sóng Wi-Fi tầm xa"],
            correct: "A",
            explanation: "Firewall giám sát và lọc các gói tin mạng để ngăn chặn các truy cập trái phép và mã độc từ bên ngoài."
        },
    ],
    "Công Nghệ": [
        {
            id: "cn12_1",
            subject: "Công Nghệ",
            grade: "12",
            period: "mid1",
            topic: "Kỹ thuật điện tử & Bán dẫn",
            content: "Linh kiện bán dẫn Điốt (Diode) có chức năng cơ bản là gì trong mạch điện tử?",
            options: ["A. Chỉ cho dòng điện đi qua theo một chiều duy nhất (dùng để chỉnh lưu)", "B. Khuếch đại tín hiệu điện", "C. Tích trữ điện trường", "D. Biến đổi điện áp xoay chiều"],
            correct: "A",
            explanation: "Điốt bán dẫn có tính dẫn điện một chiều từ Anot sang Katot, dùng phổ biến trong mạch chỉnh lưu biến đổi AC thành DC."
        },
        {
            id: "cn12_2",
            subject: "Công Nghệ",
            grade: "12",
            period: "mid1",
            topic: "Kỹ thuật điện tử & Bán dẫn",
            content: "Linh kiện Transistor lưỡng cực (BJT) có 3 cực lần lượt là:",
            options: ["A. Bazơ (B), Emitơ (E), Collectơ (C)", "B. Anot, Katot, Lưới", "C. Cực dương, Cực âm, Trung tính", "D. Vào, Ra, Đất"],
            correct: "A",
            explanation: "Transistor lưỡng cực gồm cực gốc B (Base), cực phát E (Emitter) và cực góp C (Collector)."
        },
        {
            id: "cn12_3",
            subject: "Công Nghệ",
            grade: "12",
            period: "final1",
            topic: "Mạch điện ba pha & Máy biến áp",
            content: "Trong mạch điện xoay chiều ba pha đối xứng mắc hình sao (Y), mối liên hệ giữa điện áp dây U_d và điện áp pha U_p là:",
            options: ["A. U_d = √3.U_p", "B. U_d = U_p", "C. U_d = U_p / √3", "D. U_d = 3.U_p"],
            correct: "A",
            explanation: "Khi nối hình sao đối xứng: I_d = I_p và U_d = √3 U_p."
        },
        {
            id: "cn12_4",
            subject: "Công Nghệ",
            grade: "12",
            period: "mid2",
            topic: "Động cơ điện & Mạng lưới điện",
            content: "Động cơ không đồng bộ ba pha hoạt động dựa trên nguyên lí nào sau đây?",
            options: ["A. Tác dụng của từ trường quay làm quay roto với tốc độ n < n₁", "B. Hiện tượng cảm ứng tĩnh điện", "C. Nhiệt lượng tỏa ra trên dây quấn", "D. Lực hút của nam châm vĩnh cửu đứng yên"],
            correct: "A",
            explanation: "Dòng ba pha tạo ra từ trường quay tốc độ n₁, roto quay cùng chiều nhưng với tốc độ trượt n < n₁."
        },
        {
            id: "cn12_5",
            subject: "Công Nghệ",
            grade: "12",
            period: "final2",
            topic: "Kỹ thuật điện & An toàn điện",
            content: "Biện pháp an toàn điện quan trọng nhất để phòng ngừa điện giật khi vỏ kim loại của thiết bị bị rò điện là:",
            options: ["A. Nối đất bảo vệ (tiếp địa) cho vỏ thiết bị", "B. Sơn cách điện lên tường nhà", "C. Đi chân đất khi cắm điện", "D. Rút cầu chì khi đang sử dụng"],
            correct: "A",
            explanation: "Dây tiếp địa dẫn dòng điện rò thẳng xuống đất, giữ điện áp tiếp xúc ở mức an toàn không gây hại cho con người."
        },
        {
            id: "tech12_extra_1",
            subject: "Công Nghệ",
            grade: "12",
            period: "mid1",
            topic: "Hệ thống điện quốc gia",
            content: "Lưới điện truyền tải của hệ thống điện quốc gia Việt Nam có cấp điện áp cao nhất là:",
            options: ["A. 500 kV", "B. 220 kV", "C. 110 kV", "D. 35 kV"],
            correct: "A",
            explanation: "Đường dây 500 kV Bắc - Nam là xương sống huyết mạch của hệ thống truyền tải điện năng quốc gia Việt Nam."
        },
        {
            id: "tech12_extra_2",
            subject: "Công Nghệ",
            grade: "12",
            period: "final1",
            topic: "Máy biến áp & Động cơ ba pha",
            content: "Máy biến áp là thiết bị điện từ tĩnh hoạt động dựa trên hiện tượng:",
            options: ["A. Cảm ứng điện từ", "B. Tự cảm", "C. Hưởng ứng tĩnh điện", "D. Tác dụng nhiệt của dòng điện"],
            correct: "A",
            explanation: "Máy biến áp hoạt động dựa trên định luật cảm ứng điện từ Faraday để biến đổi điện áp dòng điện xoay chiều mà giữ nguyên tần số."
        },
        {
            id: "tech12_extra_3",
            subject: "Công Nghệ",
            grade: "12",
            period: "mid2",
            topic: "Linh kiện điện tử bán dẫn",
            content: "Linh kiện bán dẫn có 2 lớp tiếp giáp P-N và 3 cực (B, C, E) dùng để khuếch đại tín hiệu điện là:",
            options: ["A. Transistor (BJT)", "B. Diode", "C. Điện trở", "D. Tụ điện"],
            correct: "A",
            explanation: "Transistor có 3 cực: Base (B), Collector (C), Emitter (E), có chức năng khuếch đại dòng điện hoặc làm khóa điện tử (switch)."
        },
        {
            id: "tech12_extra_4",
            subject: "Công Nghệ",
            grade: "12",
            period: "final2",
            topic: "Lâm nghiệp & Bảo vệ rừng",
            content: "Rừng phòng hộ có chức năng chính nào sau đây?",
            options: ["A. Chắn gió, chắn cát bay, bảo vệ nguồn nước và chống xói mòn đất lũ quét", "B. Khai thác lấy gỗ công nghiệp", "C. Bảo tồn nguồn gen động thực vật quý hiếm", "D. Xây dựng khu công nghiệp nặng"],
            correct: "A",
            explanation: "Rừng phòng hộ (đầu nguồn, ven biển) đóng vai trò phòng hộ môi trường sinh thái, giảm nhẹ thiên tai bão lũ."
        },
        {
            id: "tech12_extra_5",
            subject: "Công Nghệ",
            grade: "12",
            period: "final2",
            topic: "Thủy sản công nghệ cao",
            content: "Ưu điểm nổi bật của mô hình nuôi thủy sản tuần hoàn khép kín (RAS) là:",
            options: ["A. Tiết kiệm nước, kiểm soát dịch bệnh và giảm thiểu xả thải ô nhiễm ra môi trường", "B. Chi phí đầu tư ban đầu bằng 0", "C. Phụ thuộc hoàn toàn vào nguồn nước sông tự nhiên", "D. Không cần kiểm soát thức ăn"],
            correct: "A",
            explanation: "Hệ thống nuôi thủy sản tuần hoàn (RAS) xử lí và tái sử dụng 90-99% nước, kiểm soát môi trường nuôi sinh học an toàn cao."
        },
        {
            id: "tech12_t1_q3",
            subject: "Công Nghệ",
            grade: "12",
            period: "mid1",
            topic: "Kỹ thuật điện & An toàn điện",
            content: "Nguyên tắc vàng đầu tiên khi sửa chữa hoặc kiểm tra thiết bị điện dân dụng là:",
            options: ["A. Ngắt nguồn điện (cắt cầu dao/aptomat) và dùng bút thử điện kiểm tra lại", "B. Đeo găng tay ướt để thao tác", "C. Dùng tay trần chạm vào dây pha", "D. Đổ nước vào thiết bị"],
            correct: "A",
            explanation: "Cắt nguồn điện và thử điện kiểm tra điện áp bằng 0 là nguyên tắc an toàn bắt buộc để tránh tai nạn điện giật."
        },
        {
            id: "tech12_t2_q3",
            subject: "Công Nghệ",
            grade: "12",
            period: "final1",
            topic: "Mạch điện ba pha & Máy biến áp",
            content: "Trong mạch điện ba pha hình sao đối xứng (Y), mối liên hệ giữa điện áp dây (Ud) và điện áp pha (Up) là:",
            options: ["A. Ud = √3 Up", "B. Ud = Up", "C. Ud = Up / √3", "D. Ud = 3 Up"],
            correct: "A",
            explanation: "Trong mạch nối sao (Y): Id = Ip và Ud = √3 Up (Ví dụ: điện áp pha 220V thì điện áp dây là 220√3 ≈ 380V)."
        },
        {
            id: "tech12_t3_q3",
            subject: "Công Nghệ",
            grade: "12",
            period: "mid2",
            topic: "Động cơ điện & Mạng lưới điện",
            content: "Động cơ không đồng bộ ba pha biến đổi đại lượng nào thành đại lượng nào?",
            options: ["A. Biến đổi điện năng thành cơ năng", "B. Biến đổi cơ năng thành điện năng", "C. Biến đổi nhiệt năng thành điện năng", "D. Biến đổi hóa năng thành cơ năng"],
            correct: "A",
            explanation: "Động cơ điện tiêu thụ điện năng từ lưới điện và tạo ra mô-men quay cơ năng để kéo tải máy công tác."
        },
        {
            id: "tech12_t4_q3",
            subject: "Công Nghệ",
            grade: "12",
            period: "final2",
            topic: "Kỹ thuật điện tử & Bán dẫn",
            content: "Linh kiện điện tử bán dẫn Diode có tính chất dẫn điện cơ bản nào?",
            options: ["A. Dẫn điện theo một chiều duy nhất từ Anode sang Cathode", "B. Dẫn điện hai chiều đối xứng như điện trở", "C. Cách điện hoàn toàn mọi trường hợp", "D. Khuếch đại tần số vô hạn"],
            correct: "A",
            explanation: "Diode có lớp tiếp giáp P-N chỉ cho dòng điện chạy qua khi phân cực thuận (từ cực dương Anode sang cực âm Cathode)."
        },
        {
            id: "tech12_t5_q3",
            subject: "Công Nghệ",
            grade: "12",
            period: "final2",
            topic: "Lâm nghiệp & Thủy sản công nghệ cao",
            content: "Kỹ thuật trồng rừng thâm canh gỗ lớn có chu kì kinh doanh như thế nào?",
            options: ["A. Kéo dài trên 10-15 năm nhằm tạo nguồn gỗ có đường kính lớn và giá trị kinh tế cao", "B. Chỉ thu hoạch sau 1-2 năm", "C. Chặt hạ cây con ngay khi trồng", "D. Không cần chăm sóc bảo vệ"],
            correct: "A",
            explanation: "Rừng gỗ lớn (keo, xà cừ, thông) nuôi dưỡng trên 10 năm cho thân gỗ to làm đồ mộc nội thất xuất khẩu, giá trị gấp 3-4 lần gỗ dăm."
        },
        {
            id: "cn12_m1_extra1",
            subject: "Công Nghệ",
            grade: "12",
            period: "mid1",
            topic: "Kỹ thuật điện & An toàn điện",
            content: "Quy tắc an toàn điện hàng đầu khi sửa chữa thiết bị điện gia đình là:",
            options: ["A. Cắt hoàn toàn nguồn điện (ngắt cầu dao/aptomat) và dùng bút thử điện kiểm tra", "B. Đi chân đất khi thao tác", "C. Dùng tay ướt cầm phích cắm", "D. Không cần ngắt điện nếu thao tác nhanh"],
            correct: "A",
            explanation: "Cắt nguồn điện và dùng bút thử điện kiểm tra là nguyên tắc bắt buộc để phòng tránh điện giật nguy hiểm tính mạng."
        },
        {
            id: "cn12_f1_extra1",
            subject: "Công Nghệ",
            grade: "12",
            period: "final1",
            topic: "Mạch điện ba pha & Máy biến áp",
            content: "Máy biến áp là thiết bị điện tĩnh hoạt động theo hiện tượng nào?",
            options: ["A. Hiện tượng cảm ứng điện từ", "B. Hiện tượng quang điện", "C. Hiện tượng ma sát tĩnh điện", "D. Hiện tượng nhiệt điện"],
            correct: "A",
            explanation: "Máy biến áp biến đổi điện áp xoay chiều dựa trên hiện tượng cảm ứng điện từ giữa hai cuộn dây sơ cấp và thứ cấp."
        },
        {
            id: "cn12_m2_extra1",
            subject: "Công Nghệ",
            grade: "12",
            period: "mid2",
            topic: "Kỹ thuật điện tử & Bán dẫn",
            content: "Linh kiện bán dẫn Diode (đi-ốt) có tính chất dẫn điện đặc trưng nào?",
            options: ["A. Chỉ cho dòng điện đi qua theo một chiều từ Anode sang Cathode", "B. Cho dòng điện đi qua tự do cả hai chiều", "C. Ngăn hoàn toàn dòng điện mọi lúc", "D. Tích trữ điện trường như tụ điện"],
            correct: "A",
            explanation: "Diode bán dẫn có tính dẫn điện một chiều, được sử dụng phổ biến trong mạch chỉnh lưu biến đổi dòng xoay chiều thành một chiều."
        },
        {
            id: "cn12_f2_extra1",
            subject: "Công Nghệ",
            grade: "12",
            period: "final2",
            topic: "Lâm nghiệp & Thủy sản công nghệ cao",
            content: "Mô hình nuôi tôm thẻ chân trắng siêu thâm canh trong nhà màng ứng dụng công nghệ:",
            options: ["A. Công nghệ vi sinh Biofloc và tuần hoàn nước khép kín RAS", "B. Xả trực tiếp nước thải ra kênh rạch tự nhiên", "C. Nuôi thả tự nhiên không cho ăn", "D. Dùng thuốc kháng sinh bừa bãi"],
            correct: "A",
            explanation: "Biofloc và hệ thống tuần hoàn RAS giúp kiểm soát môi trường nước, phòng dịch bệnh và nâng cao năng suất thủy sản."
        },
    ],
    "GDQP&AN": [
        {
            id: "qp12_1",
            subject: "GDQP&AN",
            grade: "12",
            period: "mid1",
            topic: "Đường lối quốc phòng & An ninh của Đảng",
            content: "Tư tưởng chỉ đạo xuyên suốt trong đường lối quốc phòng, an ninh của Đảng ta là:",
            options: ["A. Chủ động phòng ngừa, bảo vệ Tổ quốc 'từ sớm, từ xa', giữ nước từ khi nước chưa nguy", "B. Chờ giặc đến bờ cõi mới tổ chức đánh trả", "C. Chỉ trông cậy vào vũ khí hiện đại nhập khẩu", "D. Không cần xây dựng lực lượng dự bị"],
            correct: "A",
            explanation: "Đại hội Đảng khẳng định bảo vệ Tổ quốc từ sớm, từ xa, chủ động ngăn ngừa nguy cơ xung đột, chiến tranh."
        },
        {
            id: "qp12_2",
            subject: "GDQP&AN",
            grade: "12",
            period: "final1",
            topic: "Nền quốc phòng toàn dân vững mạnh",
            content: "Xây dựng 'thế trận lòng dân' vững chắc trong nền quốc phòng toàn dân nhằm mục đích cốt lõi là:",
            options: ["A. Củng cố niềm tin của nhân dân vào Đảng, Nhà nước và phát huy sức mạnh khối đại đoàn kết toàn dân", "B. Thu thuế quốc phòng thật nhiều", "C. Bắt buộc mọi người dân phải nhập ngũ", "D. Giới nghiêm các thành phố"],
            correct: "A",
            explanation: "'Thế trận lòng dân' là nền tảng gốc rễ tạo nên sức mạnh bất khả chiến bại của nền quốc phòng toàn dân."
        },
        {
            id: "qp12_3",
            subject: "GDQP&AN",
            grade: "12",
            period: "mid2",
            topic: "Chiến tranh nhân dân bảo vệ Tổ quốc",
            content: "Tính chất của cuộc chiến tranh nhân dân bảo vệ Tổ quốc Việt Nam Xã hội Chủ nghĩa là:",
            options: ["A. Chiến tranh chính nghĩa, tự vệ cách mạng nhằm bảo vệ độc lập tự do và toàn vẹn lãnh thổ", "B. Chiến tranh tranh giành thuộc địa", "C. Chiến tranh xâm lược phi nghĩa", "D. Chiến tranh cục bộ vì lợi ích tư bản"],
            correct: "A",
            explanation: "Chiến tranh của ta là chiến tranh chính nghĩa, tự vệ chính đáng để bảo vệ nền độc lập, chủ quyền dân tộc."
        },
        {
            id: "qp12_4",
            subject: "GDQP&AN",
            grade: "12",
            period: "final2",
            topic: "Phòng chống vũ khí công nghệ cao",
            content: "Đặc điểm nổi bật của vũ khí công nghệ cao mà đối phương có thể sử dụng là:",
            options: ["A. Tầm bắn xa, độ chính xác rất cao và uy lực hủy diệt lớn", "B. Chỉ sử dụng ban ngày", "C. Hoàn toàn không thể gây nhiễu điện tử", "D. Giá thành rất rẻ"],
            correct: "A",
            explanation: "Vũ khí công nghệ cao có hệ thống điều khiển tự động tinh vi, độ chính xác trúng đích cực cao từ cự ly xa."
        },
        {
            id: "qp12_5",
            subject: "GDQP&AN",
            grade: "12",
            period: "final2",
            topic: "Chủ quyền biển đảo & Vùng trời quốc gia",
            content: "Vùng biển thuộc chủ quyền hoàn toàn và tuyệt đối của quốc gia ven biển như trên đất liền là:",
            options: ["A. Vùng nội thủy", "B. Vùng đặc quyền kinh tế", "C. Thềm lục địa", "D. Vùng biển quốc tế"],
            correct: "A",
            explanation: "Vùng nội thủy là vùng nước nằm phía trong đường cơ sở, quốc gia có chủ quyền tuyệt đối như lãnh thổ đất liền."
        },
        {
            id: "mil12_extra_1",
            subject: "GDQP&AN",
            grade: "12",
            period: "mid1",
            topic: "Đội ngũ từng người có súng",
            content: "Khi mang súng tiểu liên AK ở tư thế đi nghiêm, nòng súng hướng về phía nào?",
            options: ["A. Hướng lên trên và chếch sang trái", "B. Hướng thẳng xuống đất", "C. Hướng nằm ngang", "D. Chĩa về phía sau"],
            correct: "A",
            explanation: "Theo điều lệnh đội ngũ có súng, tư thế mang súng chuẩn: Nòng súng hướng lên trên, chếch sang vai trái khoảng 45 độ, an toàn tuyệt đối."
        },
        {
            id: "mil12_extra_2",
            subject: "GDQP&AN",
            grade: "12",
            period: "final1",
            topic: "Kỹ thuật bắn súng AK",
            content: "Cỡ đạn tiêu chuẩn sử dụng cho súng tiểu liên AK cỡ 7.62 mm là:",
            options: ["A. 7.62 x 39 mm", "B. 5.56 x 45 mm", "C. 9 x 19 mm", "D. 12.7 x 108 mm"],
            correct: "A",
            explanation: "Súng tiểu liên AK-47 sử dụng đạn cỡ 7.62 x 39 mm kiểu 1943 (K56)."
        },
        {
            id: "mil12_extra_3",
            subject: "GDQP&AN",
            grade: "12",
            period: "mid2",
            topic: "Bản đồ quân sự & Địa hình",
            content: "Góc tạo bởi hướng bắc của đường kinh tuyến từ phương bắc kim nam châm và hướng mục tiêu được gọi là:",
            options: ["A. Góc phương vị từ", "B. Góc phương vị thực", "C. Tọa độ ô vuông", "D. Độ dốc địa hình"],
            correct: "A",
            explanation: "Góc phương vị từ (Magnetic azimuth) là góc hợp bởi hướng bắc từ và hướng ngắm đến mục tiêu đo theo chiều kim đồng hồ."
        },
        {
            id: "mil12_extra_4",
            subject: "GDQP&AN",
            grade: "12",
            period: "final2",
            topic: "Phòng chống Diễn biến hòa bình",
            content: "Mục tiêu then chốt của chiến lược 'Diễn biến hòa bình' của các thế lực thù địch nhằm vào nước ta là:",
            options: ["A. Xóa bỏ vai trò lãnh đạo của Đảng Cộng sản Việt Nam và lật đổ chế độ XHCN", "B. Hỗ trợ kinh tế không hoàn lại", "C. Phát triển khoa học công nghệ", "D. Giúp nâng cao đời sống nhân dân"],
            correct: "A",
            explanation: "'Diễn biến hòa bình' là chiến lược phi quân sự thâm độc nhằm chuyển hóa chính trị tư tưởng, phủ nhận vai trò lãnh đạo của Đảng."
        },
        {
            id: "mil12_extra_5",
            subject: "GDQP&AN",
            grade: "12",
            period: "final2",
            topic: "Nghĩa vụ quân sự của thanh niên",
            content: "Độ tuổi gọi công dân nhập ngũ trong thời bình tại Việt Nam (theo Luật Nghĩa vụ Quân sự năm 2015) đối với công dân nói chung là từ:",
            options: ["A. Đủ 18 tuổi đến hết 25 tuổi (đến hết 27 tuổi nếu học ĐH, CĐ)", "B. Đủ 16 tuổi đến 22 tuổi", "C. Đủ 20 tuổi đến 30 tuổi", "D. Đủ 18 tuổi đến 35 tuổi"],
            correct: "A",
            explanation: "Điều 30 Luật NVQS 2015 quy định: Gọi nhập ngũ từ đủ 18 đến hết 25 tuổi; trường hợp được tạm hoãn vì học ĐH/CĐ thì đến hết 27 tuổi."
        },
        {
            id: "mil12_t1_q3",
            subject: "GDQP&AN",
            grade: "12",
            period: "mid1",
            topic: "Đường lối quốc phòng & An ninh của Đảng",
            content: "Chính sách quốc phòng 'Bốn không' của Việt Nam được khẳng định trong Sách trắng Quốc phòng gồm nội dung nào?",
            options: ["A. Không tham gia liên minh quân sự; không liên kết với nước này chống nước kia; không cho nước ngoài đặt căn cứ quân sự; không sử dụng vũ lực hoặc đe dọa sử dụng vũ lực", "B. Không có quân đội thường trực", "C. Không hợp tác kinh tế quốc tế", "D. Không tham gia cứu hộ cứu nạn"],
            correct: "A",
            explanation: "Chính sách 'Bốn không' thể hiện đường lối quốc phòng hòa bình, tự vệ chính đáng của Nhà nước Việt Nam."
        },
        {
            id: "mil12_t2_q3",
            subject: "GDQP&AN",
            grade: "12",
            period: "final1",
            topic: "Nền quốc phòng toàn dân vững mạnh",
            content: "Hai nhiệm vụ trọng yếu kết hợp chặt chẽ trong chiến lược phát triển đất nước là:",
            options: ["A. Phát triển kinh tế - xã hội gắn liền với củng cố quốc phòng - an ninh", "B. Chỉ tập trung kinh tế bỏ ngỏ quốc phòng", "C. Quân sự hóa toàn bộ xã hội", "D. Đóng cửa không giao thương"],
            correct: "A",
            explanation: "Mỗi bước phát triển kinh tế là một bước tăng cường tiềm lực quốc phòng; ngược lại quốc phòng vững chắc bảo vệ công cuộc xây dựng đất nước."
        },
        {
            id: "mil12_t3_q3",
            subject: "GDQP&AN",
            grade: "12",
            period: "mid2",
            topic: "Chiến tranh nhân dân bảo vệ Tổ quốc",
            content: "Đặc điểm cơ bản của cuộc chiến tranh nhân dân bảo vệ Tổ quốc Việt Nam là:",
            options: ["A. Chiến tranh chính nghĩa, tự vệ, toàn dân, toàn diện, lấy lực lượng vũ trang làm nòng cốt", "B. Chiến tranh xâm lược phi nghĩa", "C. Chỉ dựa vào vũ khí tối tân nhập khẩu", "D. Chỉ quân đội tham gia tác chiến"],
            correct: "A",
            explanation: "Toàn dân đánh giặc với sức mạnh tổng hợp của cả hệ thống chính trị và khối đại đoàn kết toàn dân tộc."
        },
        {
            id: "mil12_t4_q3",
            subject: "GDQP&AN",
            grade: "12",
            period: "final2",
            topic: "Phòng chống vũ khí công nghệ cao",
            content: "Vũ khí công nghệ cao có ưu thế nổi trội nào sau đây?",
            options: ["A. Tầm bắn xa, độ chính xác rất cao và uy lực sát thương lớn", "B. Hoàn toàn không phụ thuộc hệ thống định vị GPS", "C. Rất rẻ tiền và dễ chế tạo", "D. Không có nhược điểm nào"],
            correct: "A",
            explanation: "Vũ khí công nghệ cao dẫn đường chính xác (tên lửa hành trình, bom thông minh, UAV) đánh trúng mục tiêu trọng yếu."
        },
        {
            id: "mil12_t5_q3",
            subject: "GDQP&AN",
            grade: "12",
            period: "final2",
            topic: "Chủ quyền biển đảo & Vùng trời quốc gia",
            content: "Theo Công ước Liên Hợp Quốc về Luật Biển (UNCLOS 1982), vùng đặc quyền kinh tế (EEZ) của một quốc gia ven biển có chiều rộng tối đa là:",
            options: ["A. 200 hải lý tính từ đường cơ sở", "B. 12 hải lý", "C. 24 hải lý", "D. 350 hải lý"],
            correct: "A",
            explanation: "Vùng đặc quyền kinh tế (EEZ) rộng 200 hải lý (khoảng 370.4 km) tính từ đường cơ sở; quốc gia có quyền chủ quyền về thăm dò, khai thác tài nguyên."
        },
        {
            id: "qp12_m1_extra1",
            subject: "GDQP&AN",
            grade: "12",
            period: "mid1",
            topic: "Đường lối quốc phòng & An ninh của Đảng",
            content: "Chính sách quốc phòng '4 không' của Việt Nam bao gồm nội dung nào sau đây?",
            options: ["A. Không tham gia liên minh quân sự; Không liên kết với nước này để chống nước kia; Không cho nước ngoài đặt căn cứ quân sự; Không sử dụng vũ lực hoặc đe dọa sử dụng vũ lực", "B. Không mua sắm vũ khí mới", "C. Không cử quân nhân đi học tập", "D. Không hợp tác kinh tế quốc tế"],
            correct: "A",
            explanation: "Chính sách quốc phòng '4 không' thể hiện đường lối đối ngoại hòa bình, độc lập, tự chủ và bảo vệ Tổ quốc từ sớm, từ xa."
        },
        {
            id: "qp12_f1_extra1",
            subject: "GDQP&AN",
            grade: "12",
            period: "final1",
            topic: "Nền quốc phòng toàn dân vững mạnh",
            content: "Đặc trưng cơ bản của nền quốc phòng toàn dân ở nước ta là:",
            options: ["A. Nền quốc phòng mang tính chất hòa bình, tự vệ, vì dân, của dân và do toàn thể nhân dân tiến hành", "B. Nền quốc phòng chỉ do quân đội đảm nhiệm", "C. Nền quốc phòng hiếu chiến", "D. Hoàn toàn phụ thuộc viện trợ quân sự nước ngoài"],
            correct: "A",
            explanation: "Nền quốc phòng toàn dân phát huy sức mạnh khối đại đoàn kết toàn dân tộc dưới sự lãnh đạo của Đảng."
        },
        {
            id: "qp12_m2_extra1",
            subject: "GDQP&AN",
            grade: "12",
            period: "mid2",
            topic: "Chiến tranh nhân dân bảo vệ Tổ quốc",
            content: "Mục đích của chiến tranh nhân dân bảo vệ Tổ quốc Việt Nam XHCN là:",
            options: ["A. Đánh bại mọi âm mưu và hành động xâm lược của kẻ thù, bảo vệ vững chắc độc lập, chủ quyền, toàn vẹn lãnh thổ", "B. Tranh giành tài nguyên thiên nhiên của nước khác", "C. Mở rộng địa giới quốc gia", "D. Phô trương vũ lực"],
            correct: "A",
            explanation: "Chiến tranh nhân dân bảo vệ Tổ quốc là cuộc chiến tranh chính nghĩa tự vệ nhằm bảo vệ Tổ quốc XHCN."
        },
        {
            id: "qp12_f2_extra1",
            subject: "GDQP&AN",
            grade: "12",
            period: "final2",
            topic: "Chủ quyền biển đảo & Vùng trời quốc gia",
            content: "Vùng đặc quyền kinh tế của Việt Nam có phạm vi tính từ đường cơ sở là:",
            options: ["A. Rộng 200 hải lý", "B. Rộng 12 hải lý", "C. Rộng 24 hải lý", "D. Rộng 350 hải lý"],
            correct: "A",
            explanation: "Theo Công ước LHQ về Luật Biển 1982 (UNCLOS 1982), vùng đặc quyền kinh tế (EEZ) rộng 200 hải lý tính từ đường cơ sở."
        },
    ],
};

const BUILTIN_EXAM_BANK_10 = {
    "Toán": [
        {
            id: "m10_1",
            subject: "Toán",
            grade: "10",
            period: "mid1",
            topic: "Mệnh đề & Tập hợp",
            content: "Phủ định của mệnh đề '∀x ∈ ℝ, x² - x + 7 > 0' là mệnh đề nào sau đây?",
            options: ["A. ∃x ∈ ℝ, x² - x + 7 ≤ 0", "B. ∀x ∈ ℝ, x² - x + 7 ≤ 0", "C. ∃x ∈ ℝ, x² - x + 7 < 0", "D. Không tồn tại x ∈ ℝ để x² - x + 7 ≤ 0"],
            correct: "A",
            explanation: "Phủ định của lượng từ 'với mọi (∀)' là 'tồn tại (∃)', phủ định của dấu '>' là dấu '≤'."
        },
        {
            id: "m10_2",
            subject: "Toán",
            grade: "10",
            period: "mid1",
            topic: "Mệnh đề & Tập hợp",
            content: "Cho hai tập hợp A = [1; 5] và B = (3; 7). Tập hợp giao A ∩ B là khoảng, đoạn nào?",
            options: ["A. (3; 5]", "B. [1; 7)", "C. [3; 5]", "D. (1; 7)"],
            correct: "A",
            explanation: "A ∩ B lấy các phần tử thuộc cả hai tập: 3 < x ≤ 5, tức là nửa khoảng (3; 5]."
        },
        {
            id: "m10_ineq1",
            subject: "Toán",
            grade: "10",
            period: "mid1",
            topic: "Bất phương trình bậc nhất hai ẩn",
            content: "Điểm nào sau đây thuộc miền nghiệm của bất phương trình 2x + y - 4 ≤ 0?",
            options: ["A. M(1; 1)", "B. N(2; 3)", "C. P(3; 0)", "D. Q(1; 5)"],
            correct: "A",
            explanation: "Thay tọa độ M(1; 1): 2(1) + 1 - 4 = -1 ≤ 0 (thỏa mãn)."
        },
        {
            id: "m10_ineq2",
            subject: "Toán",
            grade: "10",
            period: "mid1",
            topic: "Bất phương trình bậc nhất hai ẩn",
            content: "Miền nghiệm của hệ bất phương trình bậc nhất hai ẩn trên mặt phẳng tọa độ thường là:",
            options: ["A. Một đa giác (hoặc miền đa giác không bị chặn)", "B. Một đường tròn", "C. Một parabol", "D. Một đường thẳng duy nhất"],
            correct: "A",
            explanation: "Miền nghiệm của hệ bất phương trình bậc nhất hai ẩn là phần giao của các nửa mặt phẳng, tạo thành một miền đa giác lồi."
        },
        {
            id: "m10_trig_triangle",
            subject: "Toán",
            grade: "10",
            period: "final1",
            topic: "Hệ thức lượng trong tam giác",
            content: "Cho tam giác ABC có a = 6, b = 8 và góc C = 60°. Độ dài cạnh c bằng:",
            options: ["A. c = 2√13", "B. c = 10", "C. c = 2√37", "D. c = 14"],
            correct: "A",
            explanation: "Theo định lí cosin: c² = a² + b² - 2ab.cos(C) = 36 + 64 - 2(6)(8)(1/2) = 100 - 48 = 52 ⇒ c = √52 = 2√13."
        },
        {
            id: "m10_trig_s",
            subject: "Toán",
            grade: "10",
            period: "final1",
            topic: "Hệ thức lượng trong tam giác",
            content: "Diện tích S của tam giác ABC có độ dài hai cạnh a, b và góc xen giữa C được tính bằng công thức:",
            options: ["A. S = (1/2)ab.sin(C)", "B. S = ab.sin(C)", "C. S = (1/2)ab.cos(C)", "D. S = (1/2)ab.tan(C)"],
            correct: "A",
            explanation: "Công thức tính diện tích tam giác theo hai cạnh và góc xen giữa: S = 1/2 ab.sin(C)."
        },
        {
            id: "m10_5",
            subject: "Toán",
            grade: "10",
            period: "final1",
            topic: "Véctơ & Hệ trục tọa độ Oxy",
            content: "Cho hình vuông ABCD cạnh a. Độ dài của véctơ tổng u = AB + AD là:",
            options: ["A. |u| = a√2", "B. |u| = 2a", "C. |u| = a", "D. |u| = 0"],
            correct: "A",
            explanation: "Theo quy tắc hình bình hành: AB + AD = AC (đường chéo hình vuông). Độ dài đường chéo hình vuông cạnh a là a√2."
        },
        {
            id: "m10_6",
            subject: "Toán",
            grade: "10",
            period: "final1",
            topic: "Véctơ & Hệ trục tọa độ Oxy",
            content: "Trong mặt phẳng Oxy, cho hai véctơ a = (1; 2) và b = (3; -1). Tích vô hướng a.b bằng:",
            options: ["A. 1", "B. 5", "C. -1", "D. 7"],
            correct: "A",
            explanation: "Tích vô hướng trong tọa độ: a.b = a₁b₁ + a₂b₂ = 1×3 + 2×(-1) = 3 - 2 = 1."
        },
        {
            id: "m10_9",
            subject: "Toán",
            grade: "10",
            period: "mid2",
            topic: "Thống kê & Xác suất cơ bản",
            content: "Có bao nhiêu cách chọn 3 học sinh từ một tổ gồm 10 học sinh đi trực nhật?",
            options: ["A. C(10, 3) = 120 cách", "B. A(10, 3) = 720 cách", "C. 30 cách", "D. 1000 cách"],
            correct: "A",
            explanation: "Chọn 3 bạn không phân biệt thứ tự nhiệm vụ là tổ hợp chập 3 của 10 phần tử: C(10, 3) = 10! / (3! × 7!) = 120."
        },
        {
            id: "m10_10",
            subject: "Toán",
            grade: "10",
            period: "final2",
            topic: "Thống kê & Xác suất cơ bản",
            content: "Gieo một con xúc xắc cân đối đồng chất một lần. Xác suất để xuất hiện mặt có số chấm là số chẵn bằng:",
            options: ["A. 1/2", "B. 1/3", "C. 1/6", "D. 2/3"],
            correct: "A",
            explanation: "Không gian mẫu n(Ω) = 6. Biến cố mặt chẵn gồm {2, 4, 6} có 3 kết quả thuận lợi. Xác suất P = 3/6 = 1/2."
        },
        {
            id: "m10_extra_1",
            subject: "Toán",
            grade: "10",
            period: "mid1",
            topic: "Mệnh đề & Tập hợp",
            content: "Cho tập hợp A = {x ∈ ℝ | 1 ≤ x < 5} và B = (2; 7]. Tập hợp A ∩ B là:",
            options: ["A. (2; 5)", "B. [1; 7]", "C. [2; 5)", "D. (1; 7]"],
            correct: "A",
            explanation: "A = [1; 5) và B = (2; 7]. Giao của hai tập hợp là phần tử thuộc cả A và B: A ∩ B = (2; 5)."
        },
        {
            id: "m10_extra_2",
            subject: "Toán",
            grade: "10",
            period: "mid1",
            topic: "Bất phương trình bậc nhất hai ẩn",
            content: "Điểm nào sau đây thuộc miền nghiệm của bất phương trình 2x - 3y + 6 > 0?",
            options: ["A. (0; 3)", "B. (-4; 0)", "C. (1; 1)", "D. (-3; 1)"],
            correct: "C",
            explanation: "Thay tọa độ (1; 1) vào: 2(1) - 3(1) + 6 = 5 > 0 (thỏa mãn). Vậy (1; 1) thuộc miền nghiệm."
        },
        {
            id: "m10_extra_3",
            subject: "Toán",
            grade: "10",
            period: "final1",
            topic: "Hệ thức lượng trong tam giác",
            content: "Cho tam giác ABC có a = 8, b = 10 và góc C = 60°. Độ dài cạnh c bằng:",
            options: ["A. 2√21", "B. 2√19", "C. 12", "D. 6√3"],
            correct: "A",
            explanation: "Theo định lí cosin: c² = a² + b² - 2ab.cosC = 64 + 100 - 2.8.10.cos60° = 164 - 80 = 84. Suy ra c = √84 = 2√21."
        },
        {
            id: "m10_extra_4",
            subject: "Toán",
            grade: "10",
            period: "mid2",
            topic: "Véctơ & Hệ trục tọa độ Oxy",
            content: "Trong mặt phẳng Oxy, cho véctơ u = (2; -3) và v = (-1; 4). Tọa độ của véctơ 2u + 3v là:",
            options: ["A. (1; 6)", "B. (7; -6)", "C. (1; -6)", "D. (7; 6)"],
            correct: "A",
            explanation: "2u = (4; -6), 3v = (-3; 12). Tổng 2u + 3v = (4 + (-3); -6 + 12) = (1; 6)."
        },
        {
            id: "m10_extra_5",
            subject: "Toán",
            grade: "10",
            period: "final2",
            topic: "Thống kê & Xác suất cơ bản",
            content: "Một hộp chứa 5 quả cầu đỏ và 7 quả cầu xanh có kích thước giống nhau. Chọn ngẫu nhiên 1 quả. Xác suất chọn được quả màu đỏ là:",
            options: ["A. 5/12", "B. 7/12", "C. 5/7", "D. 1/12"],
            correct: "A",
            explanation: "Tổng số quả cầu là 5 + 7 = 12. Xác suất chọn được quả cầu màu đỏ là P = 5/12."
        },
        {
            id: "m10_t1_q3",
            subject: "Toán",
            grade: "10",
            period: "mid1",
            topic: "Mệnh đề & Tập hợp",
            content: "Cho mệnh đề P: '∀x ∈ ℝ, x² - 2x + 3 > 0'. Phủ định của mệnh đề P là:",
            options: ["A. ∃x ∈ ℝ, x² - 2x + 3 ≤ 0", "B. ∃x ∈ ℝ, x² - 2x + 3 < 0", "C. ∀x ∈ ℝ, x² - 2x + 3 ≤ 0", "D. ∃x ∉ ℝ, x² - 2x + 3 ≤ 0"],
            correct: "A",
            explanation: "Phủ định của mệnh đề '∀x ∈ X, P(x)' là '∃x ∈ X, ¬P(x)'. Phủ định của '>' là '≤'."
        },
        {
            id: "m10_t2_q3",
            subject: "Toán",
            grade: "10",
            period: "mid1",
            topic: "Bất phương trình bậc nhất hai ẩn",
            content: "Miền nghiệm của hệ bất phương trình { x + y ≤ 2; x ≥ 0; y ≥ 0 } là miền đa giác có hình gì?",
            options: ["A. Tam giác vuông cân", "B. Hình vuông", "C. Hình chữ nhật", "D. Tứ giác bất kì"],
            correct: "A",
            explanation: "Các đỉnh của miền nghiệm là (0;0), (2;0), (0;2) tạo thành tam giác vuông cân tại gốc tọa độ O."
        },
        {
            id: "m10_t3_q3",
            subject: "Toán",
            grade: "10",
            period: "final1",
            topic: "Hệ thức lượng trong tam giác",
            content: "Bán kính đường tròn ngoại tiếp R của tam giác đều cạnh a có công thức là:",
            options: ["A. R = a√3 / 3", "B. R = a√3 / 2", "C. R = a√3 / 6", "D. R = 2a√3 / 3"],
            correct: "A",
            explanation: "Theo định lí sin: a / sin(60°) = 2R => R = a / (2 sin 60°) = a / (2 . √3/2) = a / √3 = a√3 / 3."
        },
        {
            id: "m10_t4_q3",
            subject: "Toán",
            grade: "10",
            period: "mid2",
            topic: "Véctơ & Hệ trục tọa độ Oxy",
            content: "Tích vô hướng của hai véctơ u = (1; 2) và v = (3; -1) bằng:",
            options: ["A. 1", "B. 5", "C. -1", "D. 7"],
            correct: "A",
            explanation: "u . v = x₁x₂ + y₁y₂ = 1(3) + 2(-1) = 3 - 2 = 1."
        },
        {
            id: "m10_t5_q3",
            subject: "Toán",
            grade: "10",
            period: "final2",
            topic: "Thống kê & Xác suất cơ bản",
            content: "Số đặc trưng nào sau đây đo độ phân tán của mẫu số liệu ghép nhóm?",
            options: ["A. Phương sai và độ lệch chuẩn", "B. Số trung bình", "C. Trung vị", "D. Mốt"],
            correct: "A",
            explanation: "Phương sai và độ lệch chuẩn là các số đặc trưng đo độ biến thiên hay phân tán của mẫu số liệu quanh giá trị trung bình."
        },
        {
            id: "m10_mid1_b1",
            subject: "Toán",
            grade: "10",
            period: "mid1",
            topic: "Mệnh đề & Tập hợp",
            content: "Cho tập hợp X = {1, 2, 3}. Số lượng tập hợp con của X là:",
            options: ["A. 8", "B. 6", "C. 3", "D. 9"],
            correct: "A",
            explanation: "Tập hợp có n phần tử thì số tập con là 2ⁿ. Với n = 3 => 2³ = 8 tập con."
        },
        {
            id: "m10_fin1_b1",
            subject: "Toán",
            grade: "10",
            period: "final1",
            topic: "Hệ thức lượng trong tam giác",
            content: "Công thức tính diện tích tam giác theo công thức Heron với nửa chu vi p là:",
            options: ["A. S = √(p(p - a)(p - b)(p - c))", "B. S = p(p - a)(p - b)(p - c)", "C. S = 1/2 a b sin C", "D. S = a b c / 4R"],
            correct: "A",
            explanation: "Công thức Heron: S = √(p(p - a)(p - b)(p - c)) với p = (a + b + c)/2."
        },
        {
            id: "m10_mid2_b1",
            subject: "Toán",
            grade: "10",
            period: "mid2",
            topic: "Véctơ & Hệ trục tọa độ Oxy",
            content: "Cho điểm A(1; 2) và B(5; 6). Tọa độ trung điểm I của đoạn thẳng AB là:",
            options: ["A. I(3; 4)", "B. I(4; 4)", "C. I(6; 8)", "D. I(2; 2)"],
            correct: "A",
            explanation: "x_I = (1 + 5)/2 = 3; y_I = (2 + 6)/2 = 4 => I(3; 4)."
        },
        {
            id: "m10_fin2_b1",
            subject: "Toán",
            grade: "10",
            period: "final2",
            topic: "Thống kê & Xác suất cơ bản",
            content: "Gieo một con xúc xắc cân đối đồng chất một lần. Xác suất để xuất hiện mặt có số chấm là số chẵn là:",
            options: ["A. 1/2", "B. 1/3", "C. 1/6", "D. 2/3"],
            correct: "A",
            explanation: "Các mặt chẵn là {2, 4, 6} (3 khả năng). Không gian mẫu có 6 khả năng. Xác suất P = 3/6 = 1/2."
        },
        {
            id: "toan10_m1_extra1",
            subject: "Toán",
            grade: "10",
            period: "mid1",
            topic: "Mệnh đề & Tập hợp",
            content: "Cho tập hợp A = {1, 2, 3, 4} và B = {3, 4, 5, 6}. Giao của hai tập hợp A ∩ B là:",
            options: ["A. {3, 4}", "B. {1, 2, 5, 6}", "C. {1, 2, 3, 4, 5, 6}", "D. ∅"],
            correct: "A",
            explanation: "Giao của hai tập hợp A ∩ B gồm các phần tử chung của cả hai tập: {3, 4}."
        },
        {
            id: "toan10_f1_extra1",
            subject: "Toán",
            grade: "10",
            period: "final1",
            topic: "Bất phương trình bậc nhất hai ẩn",
            content: "Điểm nào sau đây thuộc miền nghiệm của bất phương trình 2x - y + 3 > 0?",
            options: ["A. (0; 0)", "B. (0; 5)", "C. (-2; 0)", "D. (-3; -1)"],
            correct: "A",
            explanation: "Thay tọa độ (0; 0) vào bất phương trình: 2(0) - 0 + 3 = 3 > 0 (đúng)."
        },
        {
            id: "toan10_m2_extra1",
            subject: "Toán",
            grade: "10",
            period: "mid2",
            topic: "Hệ thức lượng trong tam giác",
            content: "Trong tam giác ABC, định lí côsin phát biểu hệ thức tính cạnh a^2 là:",
            options: ["A. a^2 = b^2 + c^2 - 2bc.cos(A)", "B. a^2 = b^2 + c^2 + 2bc.cos(A)", "C. a^2 = b^2 + c^2 - 2bc.sin(A)", "D. a^2 = b^2 + c^2"],
            correct: "A",
            explanation: "Định lí côsin: a^2 = b^2 + c^2 - 2bc*cos(A)."
        },
        {
            id: "toan10_f2_extra1",
            subject: "Toán",
            grade: "10",
            period: "final2",
            topic: "Véctơ & Hệ trục tọa độ Oxy",
            content: "Cho hai véctơ u = (2; -3) và v = (4; 1). Tích vô hướng u . v bằng:",
            options: ["A. 5", "B. 11", "C. -5", "D. 8"],
            correct: "A",
            explanation: "u . v = 2*4 + (-3)*1 = 8 - 3 = 5."
        },
    ],
    "Vật Lí": [
        {
            id: "p10_1",
            subject: "Vật Lí",
            grade: "10",
            period: "mid1",
            topic: "Mô tả chuyển động & Vận tốc",
            content: "Công thức liên hệ giữa vận tốc v, vận tốc đầu v₀, gia tốc a và quãng đường s trong chuyển động thẳng biến đổi đều là:",
            options: ["A. v² - v₀² = 2as", "B. v² + v₀² = 2as", "C. v - v₀ = 2as", "D. v² - v₀² = as"],
            correct: "A",
            explanation: "Công thức độc lập với thời gian: v² - v₀² = 2as."
        },
        {
            id: "p10_2",
            subject: "Vật Lí",
            grade: "10",
            period: "mid1",
            topic: "Mô tả chuyển động & Vận tốc",
            content: "Một vật rơi tự do không vận tốc đầu từ độ cao h. Thời gian rơi t của vật được tính bởi công thức:",
            options: ["A. t = √(2h/g)", "B. t = 2h/g", "C. t = √(h/2g)", "D. t = √(gh)"],
            correct: "A",
            explanation: "Quãng đường rơi tự do: h = (1/2)gt² ⇒ t = √(2h/g)."
        },
        {
            id: "p10_3",
            subject: "Vật Lí",
            grade: "10",
            period: "final1",
            topic: "Động lực học Newton",
            content: "Theo định luật II Newton, biểu thức gia tốc a của vật có khối lượng m chịu tác dụng của hợp lực F là:",
            options: ["A. a = F / m", "B. a = m / F", "C. a = F.m", "D. a = F² / m"],
            correct: "A",
            explanation: "Định luật II Newton: F = ma ⇒ a = F / m (gia tốc cùng hướng với lực tác dụng)."
        },
        {
            id: "p10_4",
            subject: "Vật Lí",
            grade: "10",
            period: "mid2",
            topic: "Công, Năng lượng & Công suất",
            content: "Công cơ học A do lực không đổi F thực hiện khi vật dịch chuyển quãng đường s theo hướng hợp với lực một góc α là:",
            options: ["A. A = F.s.cos(α)", "B. A = F.s.sin(α)", "C. A = F.s.tan(α)", "D. A = F.s"],
            correct: "A",
            explanation: "Định nghĩa công cơ học của lực không đổi: A = F.s.cos(α)."
        },
        {
            id: "p10_5",
            subject: "Vật Lí",
            grade: "10",
            period: "final2",
            topic: "Động lượng & Va chạm",
            content: "Động lượng p của một vật khối lượng m chuyển động với vận tốc v được tính bằng:",
            options: ["A. p = m.v", "B. p = (1/2)m.v²", "C. p = m.v²", "D. p = m / v"],
            correct: "A",
            explanation: "Động lượng của một vật là đại lượng véctơ p = m.v."
        },
        {
            id: "p10_6",
            subject: "Vật Lí",
            grade: "10",
            period: "final2",
            topic: "Chuyển động tròn đều",
            content: "Gia tốc hướng tâm của chất điểm chuyển động tròn đều bán kính r với tốc độ dài v là:",
            options: ["A. a_ht = v² / r", "B. a_ht = v / r", "C. a_ht = v.r", "D. a_ht = v² / r²"],
            correct: "A",
            explanation: "Gia tốc hướng tâm: a_ht = v² / r = ω²r."
        },
        {
            id: "phy10_extra_1",
            subject: "Vật Lí",
            grade: "10",
            period: "mid1",
            topic: "Mô tả chuyển động & Vận tốc",
            content: "Một ô tô chuyển động thẳng biến đổi đều với phương trình vận tốc v = 10 + 2t (m/s). Gia tốc của xe là:",
            options: ["A. 2 m/s²", "B. 10 m/s²", "C. 5 m/s²", "D. 1 m/s²"],
            correct: "A",
            explanation: "Phương trình vận tốc có dạng v = v₀ + at. So sánh với v = 10 + 2t suy ra a = 2 m/s² và v₀ = 10 m/s."
        },
        {
            id: "phy10_extra_2",
            subject: "Vật Lí",
            grade: "10",
            period: "mid1",
            topic: "Động lực học Newton",
            content: "Một vật khối lượng 2 kg chuyển động dưới tác dụng của lực F = 6 N theo phương ngang. Bỏ qua ma sát. Gia tốc của vật là:",
            options: ["A. 3 m/s²", "B. 12 m/s²", "C. 4 m/s²", "D. 0.33 m/s²"],
            correct: "A",
            explanation: "Theo định luật II Newton: a = F / m = 6 / 2 = 3 m/s²."
        },
        {
            id: "phy10_extra_3",
            subject: "Vật Lí",
            grade: "10",
            period: "final1",
            topic: "Công, Năng lượng & Công suất",
            content: "Một cần cẩu nâng vật có khối lượng 500 kg lên cao 10 m trong thời gian 20 s với vận tốc không đổi. Lấy g = 10 m/s². Công suất của cần cẩu là:",
            options: ["A. 2500 W", "B. 5000 W", "C. 1000 W", "D. 50000 W"],
            correct: "A",
            explanation: "Công nâng vật: A = P.h = mgh = 500.10.10 = 50000 J. Công suất P_cs = A / t = 50000 / 20 = 2500 W."
        },
        {
            id: "phy10_extra_4",
            subject: "Vật Lí",
            grade: "10",
            period: "mid2",
            topic: "Động lượng & Va chạm",
            content: "Một vật khối lượng 0.5 kg đang bay với vận tốc 4 m/s. Động lượng của vật có độ lớn là:",
            options: ["A. 2 kg.m/s", "B. 1 kg.m/s", "C. 4 kg.m/s", "D. 8 kg.m/s"],
            correct: "A",
            explanation: "Độ lớn động lượng p = mv = 0.5 . 4 = 2 kg.m/s."
        },
        {
            id: "phy10_extra_5",
            subject: "Vật Lí",
            grade: "10",
            period: "final2",
            topic: "Chuyển động tròn đều",
            content: "Một chất điểm quay đều trên quỹ đạo tròn bán kính R = 0.2 m với tốc độ góc ω = 10 rad/s. Gia tốc hướng tâm có độ lớn là:",
            options: ["A. 20 m/s²", "B. 2 m/s²", "C. 40 m/s²", "D. 50 m/s²"],
            correct: "A",
            explanation: "Gia tốc hướng tâm a_ht = ω²R = (10)² . 0.2 = 100 . 0.2 = 20 m/s²."
        },
        {
            id: "phy10_t1_q3",
            subject: "Vật Lí",
            grade: "10",
            period: "mid1",
            topic: "Mô tả chuyển động & Vận tốc",
            content: "Một vật rơi tự do không vận tốc ban đầu từ độ cao h = 20 m. Lấy g = 10 m/s². Thời gian vật chạm đất là:",
            options: ["A. 2 s", "B. 4 s", "C. 1 s", "D. √2 s"],
            correct: "A",
            explanation: "Công thức rơi tự do: h = 1/2 gt² => t = √(2h/g) = √(2.20/10) = √4 = 2 s."
        },
        {
            id: "phy10_t2_q3",
            subject: "Vật Lí",
            grade: "10",
            period: "mid1",
            topic: "Động lực học Newton",
            content: "Cặp lực và phản lực trong định luật III Newton có đặc điểm nào sau đây?",
            options: ["A. Luôn cùng phương, ngược chiều, cùng độ lớn và đặt vào hai vật khác nhau", "B. Đặt vào cùng một vật nên triệt tiêu nhau", "C. Xuất hiện đơn lẻ không theo cặp", "D. Luôn có độ lớn khác nhau"],
            correct: "A",
            explanation: "Lực và phản lực là cặp lực tương hỗ trực đối, xuất hiện đồng thời và đặt vào 2 vật tương tác khác nhau."
        },
        {
            id: "phy10_t3_q3",
            subject: "Vật Lí",
            grade: "10",
            period: "final1",
            topic: "Công, Năng lượng & Công suất",
            content: "Động năng của một vật khối lượng m chuyển động với vận tốc v được tính theo công thức:",
            options: ["A. Wđ = 1/2 m v²", "B. Wđ = m v²", "C. Wđ = m g h", "D. Wđ = 1/2 m v"],
            correct: "A",
            explanation: "Động năng là năng lượng do chuyển động mà có: Wđ = 1/2 mv²."
        },
        {
            id: "phy10_t4_q3",
            subject: "Vật Lí",
            grade: "10",
            period: "mid2",
            topic: "Động lượng & Va chạm",
            content: "Định luật bảo toàn động lượng áp dụng chính xác cho hệ nào sau đây?",
            options: ["A. Hệ kín (hệ cô lập)", "B. Hệ mở chịu ngoại lực bất kì", "C. Mọi hệ chuyển động có ma sát lớn", "D. Chỉ hệ đứng yên"],
            correct: "A",
            explanation: "Động lượng của một hệ kín (không chịu ngoại lực hoặc tổng ngoại lực triệt tiêu) là một đại lượng bảo toàn."
        },
        {
            id: "phy10_t5_q3",
            subject: "Vật Lí",
            grade: "10",
            period: "final2",
            topic: "Chuyển động tròn đều",
            content: "Chu kì T của chuyển động tròn đều là:",
            options: ["A. Thời gian vật đi được một vòng quỹ đạo", "B. Số vòng vật quay được trong 1 giây", "C. Tốc độ góc của chuyển động", "D. Góc quét được trong 1 giây"],
            correct: "A",
            explanation: "Chu kì T là khoảng thời gian để chất điểm chuyển động tròn đi hết trọn vẹn một vòng quỹ đạo: T = 2π / ω."
        },
        {
            id: "phy10_mid1_b1",
            subject: "Vật Lí",
            grade: "10",
            period: "mid1",
            topic: "Mô tả chuyển động & Vận tốc",
            content: "Độ dịch chuyển là đại lượng véctơ nối từ:",
            options: ["A. Vị trí đầu đến vị trí cuối của chuyển động", "B. Điểm xuất phát đến gốc tọa độ", "C. Chiều dài toàn bộ quãng đường đi được", "D. Trung điểm quỹ đạo"],
            correct: "A",
            explanation: "Độ dịch chuyển d là véctơ nối từ vị trí đầu đến vị trí cuối, có thể mang giá trị âm, dương hoặc bằng 0."
        },
        {
            id: "phy10_fin1_b1",
            subject: "Vật Lí",
            grade: "10",
            period: "final1",
            topic: "Công, Năng lượng & Công suất",
            content: "Cơ năng của một vật chuyển động chỉ dưới tác dụng của trọng lực là tổng của:",
            options: ["A. Động năng và thế năng trọng trường", "B. Động năng và nhiệt năng", "C. Thế năng và công ma sát", "D. Nội năng và cơ năng"],
            correct: "A",
            explanation: "Cơ năng W = Wđ + Wt = 1/2 mv² + mgh và được bảo toàn khi không có ma sát."
        },
        {
            id: "ly10_m1_extra1",
            subject: "Vật Lí",
            grade: "10",
            period: "mid1",
            topic: "Mô tả chuyển động & Vận tốc",
            content: "Đơn vị đo chuẩn của gia tốc trong hệ đo lường quốc tế SI là:",
            options: ["A. m/s^2", "B. m/s", "C. km/h", "D. cm/s"],
            correct: "A",
            explanation: "Gia tốc đo bằng mét trên giây bình phương (m/s^2)."
        },
        {
            id: "ly10_f1_extra1",
            subject: "Vật Lí",
            grade: "10",
            period: "final1",
            topic: "Động lực học Newton",
            content: "Định luật II Newton được biểu diễn bằng công thức nào sau đây?",
            options: ["A. F = m * a", "B. a = m / F", "C. F = m * v", "D. P = m * g^2"],
            correct: "A",
            explanation: "Định luật II Newton: Gia tốc tỉ lệ thuận với lực tác dụng và tỉ lệ nghịch với khối lượng: F = m*a."
        },
        {
            id: "ly10_m2_extra1",
            subject: "Vật Lí",
            grade: "10",
            period: "mid2",
            topic: "Công, Năng lượng & Công suất",
            content: "Công cơ học được tính bằng công thức A = F * s * cos(α). Công cản xuất hiện khi góc α thỏa mãn:",
            options: ["A. 90° < α <= 180°", "B. 0° <= α < 90°", "C. α = 0°", "D. α = 90°"],
            correct: "A",
            explanation: "Khi 90° < α <= 180°, cos(α) < 0 nên công mang giá trị âm, gọi là công cản."
        },
        {
            id: "ly10_f2_extra1",
            subject: "Vật Lí",
            grade: "10",
            period: "final2",
            topic: "Động lượng & Va chạm",
            content: "Động lượng của một vật có khối lượng m chuyển động với vận tốc v được tính bằng:",
            options: ["A. p = m * v", "B. p = m * v^2 / 2", "C. p = m / v", "D. p = m * a"],
            correct: "A",
            explanation: "Véctơ động lượng p = m * v, cùng hướng với véctơ vận tốc."
        },
    ],
    "Hóa Học": [
        {
            id: "c10_1",
            subject: "Hóa Học",
            grade: "10",
            period: "mid1",
            topic: "Cấu tạo nguyên tử & Bảng tuần hoàn",
            content: "Hạt mang điện tích dương nằm trong hạt nhân nguyên tử là:",
            options: ["A. Proton", "B. Electron", "C. Nơtron", "D. Photon"],
            correct: "A",
            explanation: "Hạt nhân nguyên tử gồm proton (mang điện tích dương +1) và nơtron (không mang điện)."
        },
        {
            id: "c10_2",
            subject: "Hóa Học",
            grade: "10",
            period: "final1",
            topic: "Liên kết hóa học & Phân tử",
            content: "Liên kết hóa học trong phân tử natri clorua (NaCl) thuộc loại liên kết nào?",
            options: ["A. Liên kết ion", "B. Liên kết cộng hóa trị có cực", "C. Liên kết cộng hóa trị không cực", "D. Liên kết hiđro"],
            correct: "A",
            explanation: "NaCl được hình thành do lực hút tĩnh điện giữa cation Na⁺ và anion Cl⁻ nên là liên kết ion."
        },
        {
            id: "c10_3",
            subject: "Hóa Học",
            grade: "10",
            period: "final1",
            topic: "Phản ứng oxi hóa - khử",
            content: "Trong một phản ứng oxi hóa - khử, chất khử là chất:",
            options: ["A. Nhường electron (số oxi hóa tăng sau phản ứng)", "B. Nhận electron (số oxi hóa giảm)", "C. Nhận proton", "D. Tạo kết tủa"],
            correct: "A",
            explanation: "Quy tắc: 'Khử cho - O nhận' (chất khử nhường electron, số oxi hóa tăng)."
        },
        {
            id: "c10_4",
            subject: "Hóa Học",
            grade: "10",
            period: "mid2",
            topic: "Năng lượng hóa học (Enthalpy)",
            content: "Phản ứng tỏa nhiệt là phản ứng hóa học có biến thiên enthalpy chuẩn (Δ_r H°₂₉₈) thỏa mãn:",
            options: ["A. Δ_r H°₂₉₈ < 0", "B. Δ_r H°₂₉₈ > 0", "C. Δ_r H°₂₉₈ = 0", "D. Δ_r H°₂₉₈ > 100 kJ"],
            correct: "A",
            explanation: "Phản ứng tỏa nhiệt giải phóng năng lượng ra môi trường nên Δ_r H°₂₉₈ < 0."
        },
        {
            id: "c10_5",
            subject: "Hóa Học",
            grade: "10",
            period: "final2",
            topic: "Tốc độ phản ứng hóa học & Halogen",
            content: "Đơn chất halogen nào sau đây có tính oxi hóa mạnh nhất ở nhiệt độ thường?",
            options: ["A. Flo (F₂)", "B. Clo (Cl₂)", "C. Brom (Br₂)", "D. Iot (I₂)"],
            correct: "A",
            explanation: "Flo có độ âm điện lớn nhất trong tất cả các nguyên tố hóa học nên F₂ có tính oxi hóa mạnh nhất nhóm halogen."
        },
        {
            id: "chem10_extra_1",
            subject: "Hóa Học",
            grade: "10",
            period: "mid1",
            topic: "Cấu tạo nguyên tử & Bảng tuần hoàn",
            content: "Nguyên tử của nguyên tố X có cấu hình electron là 1s² 2s² 2p⁶ 3s² 3p⁴. Vị trí của X trong bảng tuần hoàn là:",
            options: ["A. Chu kì 3, nhóm VIA", "B. Chu kì 3, nhóm IVA", "C. Chu kì 2, nhóm VIA", "D. Chu kì 3, nhóm VIIA"],
            correct: "A",
            explanation: "Có 3 lớp electron nên thuộc chu kì 3; lớp ngoài cùng có 6 electron (3s² 3p⁴) thuộc nguyên tố p nên nằm ở nhóm VIA (nguyên tố Lưu huỳnh S)."
        },
        {
            id: "chem10_extra_2",
            subject: "Hóa Học",
            grade: "10",
            period: "final1",
            topic: "Liên kết hóa học & Phân tử",
            content: "Liên kết trong phân tử NaCl thuộc loại liên kết nào sau đây?",
            options: ["A. Liên kết ion", "B. Liên kết cộng hóa trị không phân cực", "C. Liên kết cộng hóa trị phân cực", "D. Liên kết kim loại"],
            correct: "A",
            explanation: "NaCl được tạo bởi kim loại điển hình Na và phi kim điển hình Cl, hiệu độ âm điện lớn hơn 1.7 nên là liên kết ion giữa Na⁺ và Cl⁻."
        },
        {
            id: "chem10_extra_3",
            subject: "Hóa Học",
            grade: "10",
            period: "mid2",
            topic: "Phản ứng oxi hóa - khử",
            content: "Trong phản ứng: 2Fe + 3Cl₂ → 2FeCl₃, chất oxi hóa là:",
            options: ["A. Cl₂", "B. Fe", "C. FeCl₃", "D. Fe³⁺"],
            correct: "A",
            explanation: "Cl₂ nhận electron, số oxi hóa giảm từ 0 xuống -1 nên Cl₂ là chất oxi hóa. Fe nhường electron, số oxi hóa tăng từ 0 lên +3 là chất khử."
        },
        {
            id: "chem10_extra_4",
            subject: "Hóa Học",
            grade: "10",
            period: "final2",
            topic: "Năng lượng hóa học (Enthalpy)",
            content: "Phản ứng tỏa nhiệt là phản ứng có biến thiên enthalpy chuẩn:",
            options: ["A. ΔᵣH°₂₉₈ < 0", "B. ΔᵣH°₂₉₈ > 0", "C. ΔᵣH°₂₉₈ = 0", "D. ΔᵣH°₂₉₈ ≥ 0"],
            correct: "A",
            explanation: "Theo quy ước nhiệt động học: Phản ứng tỏa nhiệt giải phóng năng lượng ra môi trường xung quanh, có ΔᵣH°₂₉₈ < 0."
        },
        {
            id: "chem10_extra_5",
            subject: "Hóa Học",
            grade: "10",
            period: "final2",
            topic: "Tốc độ phản ứng hóa học & Halogen",
            content: "Dung dịch AgNO₃ tác dụng với dung dịch NaCl tạo kết tủa màu gì?",
            options: ["A. Trắng", "B. Vàng nhạt", "C. Vàng đậm", "D. Đen"],
            correct: "A",
            explanation: "Phương trình: NaCl + AgNO₃ → AgCl↓ (kết tủa màu trắng) + NaNO₃."
        },
        {
            id: "chem10_t1_q3",
            subject: "Hóa Học",
            grade: "10",
            period: "mid1",
            topic: "Cấu tạo nguyên tử & Bảng tuần hoàn",
            content: "Trong bảng tuần hoàn, các nguyên tố trong cùng một nhóm A có đặc điểm chung là:",
            options: ["A. Có cùng số electron lớp ngoài cùng", "B. Có cùng số lớp electron", "C. Có cùng bán kính nguyên tử", "D. Có cùng khối lượng nguyên tử"],
            correct: "A",
            explanation: "Các nguyên tố nhóm A có cấu hình electron lớp ngoài cùng tương tự nhau, số electron hóa trị bằng số thứ tự nhóm."
        },
        {
            id: "chem10_t2_q3",
            subject: "Hóa Học",
            grade: "10",
            period: "final1",
            topic: "Liên kết hóa học & Phân tử",
            content: "Liên kết hydrogen có vai trò quan trọng làm cho nhiệt độ sôi của nước (H₂O):",
            options: ["A. Cao bất thường so với các hydride cùng nhóm", "B. Thấp hơn 0 °C", "C. Bằng với H₂S", "D. Giảm mạnh khi ở thể lỏng"],
            correct: "A",
            explanation: "Liên kết hydrogen liên phân tử mạnh giữa các phân tử H₂O làm tăng đáng kể nhiệt độ sôi (100 °C) so với H₂S, H₂Se."
        },
        {
            id: "chem10_t3_q3",
            subject: "Hóa Học",
            grade: "10",
            period: "mid2",
            topic: "Phản ứng oxi hóa - khử",
            content: "Số oxi hóa của Lưu huỳnh (S) trong ion SO₄²⁻ là:",
            options: ["A. +6", "B. +4", "C. -2", "D. 0"],
            correct: "A",
            explanation: "Gọi số oxi hóa của S là x: x + 4(-2) = -2 => x - 8 = -2 => x = +6."
        },
        {
            id: "chem10_t4_q3",
            subject: "Hóa Học",
            grade: "10",
            period: "final2",
            topic: "Năng lượng hóa học (Enthalpy)",
            content: "Nhiệt tạo thành chuẩn của đơn chất bền ở điều kiện chuẩn bằng:",
            options: ["A. 0 kJ/mol", "B. 100 kJ/mol", "C. -298 kJ/mol", "D. Giá trị dương bất kì"],
            correct: "A",
            explanation: "Theo quy ước nhiệt động học chuẩn, enthalpy tạo thành chuẩn ΔfH°₂₉₈ của các đơn chất ở dạng bền vững nhất bằng 0."
        },
        {
            id: "chem10_t5_q3",
            subject: "Hóa Học",
            grade: "10",
            period: "final2",
            topic: "Tốc độ phản ứng hóa học & Halogen",
            content: "Trong nhóm Halogen (nhóm VIIA), tính oxi hóa giảm dần theo thứ tự nào?",
            options: ["A. F₂ > Cl₂ > Br₂ > I₂", "B. I₂ > Br₂ > Cl₂ > F₂", "C. Cl₂ > F₂ > Br₂ > I₂", "D. F₂ > I₂ > Br₂ > Cl₂"],
            correct: "A",
            explanation: "Đi từ trên xuống dưới trong nhóm VIIA, bán kính nguyên tử tăng, độ âm điện giảm nên tính oxi hóa giảm dần: F₂ > Cl₂ > Br₂ > I₂."
        },
        {
            id: "hoa10_m1_extra1",
            subject: "Hóa Học",
            grade: "10",
            period: "mid1",
            topic: "Cấu tạo nguyên tử & Bảng tuần hoàn",
            content: "Nguyên tử của nguyên tố X có 11 proton. Số electron ở lớp ngoài cùng của nguyên tử X là:",
            options: ["A. 1", "B. 2", "C. 7", "D. 8"],
            correct: "A",
            explanation: "Cấu hình e của X (Z=11) là 1s^2 2s^2 2p^6 3s^1, có 1 electron ở lớp ngoài cùng (phân lớp 3s)."
        },
        {
            id: "hoa10_f1_extra1",
            subject: "Hóa Học",
            grade: "10",
            period: "final1",
            topic: "Liên kết hóa học & Phân tử",
            content: "Liên kết ion được hình thành do lực hút tĩnh điện giữa:",
            options: ["A. Các ion mang điện tích trái dấu", "B. Hai nguyên tử phi kim", "C. Cặp electron dùng chung", "D. Các proton trong hạt nhân"],
            correct: "A",
            explanation: "Liên kết ion hình thành do lực hút tĩnh điện giữa cation kim loại và anion phi kim."
        },
        {
            id: "hoa10_m2_extra1",
            subject: "Hóa Học",
            grade: "10",
            period: "mid2",
            topic: "Phản ứng oxi hóa - khử",
            content: "Chất khử là chất:",
            options: ["A. Nhường electron (số oxi hóa tăng sau phản ứng)", "B. Nhận electron (số oxi hóa giảm)", "C. Chứa nguyên tố hydrogen", "D. Không thay đổi số oxi hóa"],
            correct: "A",
            explanation: "Quy tắc: Khử cho - O nhận. Chất khử là chất cho (nhường) electron."
        },
        {
            id: "hoa10_f2_extra1",
            subject: "Hóa Học",
            grade: "10",
            period: "final2",
            topic: "Tốc độ phản ứng hóa học & Halogen",
            content: "Yếu tố nào sau đây KHÔNG làm tăng tốc độ phản ứng giữa hạt kẽm và dung dịch acid HCl?",
            options: ["A. Giảm nhiệt độ phản ứng", "B. Nghiền nhỏ hạt kẽm thành bột mịn", "C. Tăng nồng độ acid HCl", "D. Khuấy đều dung dịch"],
            correct: "A",
            explanation: "Giảm nhiệt độ làm giảm tốc độ chuyển động nhiệt của phân tử, làm giảm tốc độ phản ứng."
        },
    ],
    "Sinh Học": [
        {
            id: "b10_1",
            subject: "Sinh Học",
            grade: "10",
            period: "mid1",
            topic: "Sinh học tế bào & Thành phần hóa học",
            content: "Đơn vị cơ bản cấu tạo nên mọi cơ thể sinh vật sống là:",
            options: ["A. Tế bào", "B. Mô", "C. Bào quan", "D. Phân tử"],
            correct: "A",
            explanation: "Học thuyết tế bào khẳng định: Tế bào là đơn vị cơ bản cấu tạo nên mọi cơ thể sống."
        },
        {
            id: "b10_2",
            subject: "Sinh Học",
            grade: "10",
            period: "final1",
            topic: "Cấu trúc tế bào nhân sơ & nhân thực",
            content: "Đặc điểm nổi bật nhất phân biệt tế bào nhân sơ với tế bào nhân thực là:",
            options: ["A. Tế bào nhân sơ chưa có màng nhân bao bọc vật chất di truyền", "B. Tế bào nhân sơ có kích thước lớn hơn", "C. Tế bào nhân sơ có ti thể và lục lạp", "D. Tế bào nhân sơ có nhiều nhiễm sắc thể"],
            correct: "A",
            explanation: "Tế bào nhân sơ (vi khuẩn) chỉ có vùng nhân chứa một phân tử ADN trần dạng vòng, chưa có màng nhân."
        },
        {
            id: "b10_3",
            subject: "Sinh Học",
            grade: "10",
            period: "mid2",
            topic: "Chuyển hóa vật chất & Năng lượng",
            content: "Bào quan nào được ví như 'nhà máy năng lượng' của tế bào nhân thực?",
            options: ["A. Ti thể (Mitochondria)", "B. Lưới nội chất", "C. Không bào", "D. Ribôxôm"],
            correct: "A",
            explanation: "Ti thể là nơi diễn ra hô hấp tế bào, phân giải chất hữu cơ tạo phần lớn năng lượng ATP cho tế bào."
        },
        {
            id: "b10_4",
            subject: "Sinh Học",
            grade: "10",
            period: "final2",
            topic: "Phân chia tế bào (Nguyên phân, Giảm phân)",
            content: "Kết quả của một lần phân bào nguyên phân từ một tế bào mẹ (2n) là tạo ra:",
            options: ["A. 2 tế bào con có bộ NST lưỡng bội (2n) giống hệt tế bào mẹ", "B. 4 tế bào con có bộ NST đơn bội (n)", "C. 2 tế bào con có bộ NST đơn bội (n)", "D. 1 tế bào con 4n"],
            correct: "A",
            explanation: "Nguyên phân tạo ra 2 tế bào con mang bộ NST 2n giống hệt nhau và giống tế bào mẹ ban đầu."
        },
        {
            id: "b10_5",
            subject: "Sinh Học",
            grade: "10",
            period: "final2",
            topic: "Vi sinh vật & Virus",
            content: "Virus là dạng sống đặc biệt chưa có cấu tạo tế bào, hạt virus cơ bản gồm 2 thành phần chính là:",
            options: ["A. Lõi axit nucleic (ADN hoặc ARN) và vỏ protein (capsid)", "B. Màng sinh chất và ti thể", "C. Thành tế bào xenlulozơ và lục lạp", "D. Nhân tế bào và ribosome"],
            correct: "A",
            explanation: "Cấu tạo virus đơn giản gồm lõi bộ gen (ADN hoặc ARN) và vỏ bọc protein bảo vệ gọi là capsid."
        },
        {
            id: "bio10_extra_1",
            subject: "Sinh Học",
            grade: "10",
            period: "mid1",
            topic: "Sinh học tế bào & Thành phần hóa học",
            content: "Các đơn phân cấu tạo nên đại phân tử Protein là:",
            options: ["A. Amino acid", "B. Nucleotide", "C. Glucose", "D. Acid béo"],
            correct: "A",
            explanation: "Protein là đại phân tử sinh học cấu tạo theo nguyên tắc đa phân, trong đó các đơn phân là hơn 20 loại amino acid."
        },
        {
            id: "bio10_extra_2",
            subject: "Sinh Học",
            grade: "10",
            period: "final1",
            topic: "Cấu trúc tế bào nhân sơ & nhân thực",
            content: "Bào quan nào sau đây được ví là 'nhà máy năng lượng' của tế bào nhân thực?",
            options: ["A. Ti thể", "B. Ribosome", "C. Bộ máy Golgi", "D. Không bào"],
            correct: "A",
            explanation: "Ti thể là nơi diễn ra hô hấp tế bào, phân giải chất hữu cơ tạo phần lớn năng lượng ATP cung cấp cho mọi hoạt động sống của tế bào."
        },
        {
            id: "bio10_extra_3",
            subject: "Sinh Học",
            grade: "10",
            period: "mid2",
            topic: "Chuyển hóa vật chất & Năng lượng",
            content: "Enzyme có vai trò gì trong các phản ứng hóa sinh?",
            options: ["A. Làm chất xúc tác sinh học làm tăng tốc độ phản ứng mà không bị biến đổi sau phản ứng", "B. Cung cấp năng lượng trực tiếp cho phản ứng", "C. Là chất phản ứng bị tiêu hao hoàn toàn", "D. Làm giảm tốc độ phản ứng hóa sinh"],
            correct: "A",
            explanation: "Enzyme là chất xúc tác sinh học đặc hiệu, làm giảm năng lượng hoạt hóa giúp tăng tốc độ phản ứng mà không bị biến đổi sau phản ứng."
        },
        {
            id: "bio10_extra_4",
            subject: "Sinh Học",
            grade: "10",
            period: "final2",
            topic: "Phân chia tế bào (Nguyên phân, Giảm phân)",
            content: "Kết quả của quá trình nguyên phân từ 1 tế bào mẹ (2n) ban đầu là tạo ra:",
            options: ["A. 2 tế bào con có bộ NST 2n giống hệt tế bào mẹ", "B. 4 tế bào con có bộ NST n", "C. 2 tế bào con có bộ NST n", "D. 4 tế bào con có bộ NST 2n"],
            correct: "A",
            explanation: "Nguyên phân gồm 1 lần nhân đôi NST và 1 lần phân chia, tạo 2 tế bào con có bộ NST (2n) giống hệt nhau và giống tế bào mẹ."
        },
        {
            id: "bio10_extra_5",
            subject: "Sinh Học",
            grade: "10",
            period: "final2",
            topic: "Vi sinh vật & Virus",
            content: "Virus chưa được coi là một sinh vật hoàn chỉnh vì lí do nào sau đây?",
            options: ["A. Chưa có cấu tạo tế bào và chỉ nhân lên trong tế bào chủ", "B. Kích thước quá nhỏ bé", "C. Không có vật chất di truyền", "D. Không có vỏ protein"],
            correct: "A",
            explanation: "Virus là dạng sống chưa có cấu tạo tế bào, gồm lõi acid nucleic và vỏ protein, ký sinh nội bào bắt buộc."
        },
        {
            id: "bio10_t1_q3",
            subject: "Sinh Học",
            grade: "10",
            period: "mid1",
            topic: "Sinh học tế bào & Thành phần hóa học",
            content: "Liên kết hóa học nối giữa hai nucleotide kế tiếp trên một mạch đơn ADN là:",
            options: ["A. Liên kết phosphodiester", "B. Liên kết hydrogen", "C. Liên kết peptide", "D. Liên kết glycosidic"],
            correct: "A",
            explanation: "Liên kết phosphodiester liên kết giữa nhóm 3'-OH của đường nucleotide này với nhóm 5'-phosphate của nucleotide kế tiếp."
        },
        {
            id: "bio10_t2_q3",
            subject: "Sinh Học",
            grade: "10",
            period: "final1",
            topic: "Cấu trúc tế bào nhân sơ & nhân thực",
            content: "Thành tế bào của vi khuẩn cấu tạo chủ yếu từ hợp chất nào?",
            options: ["A. Peptidoglycan", "B. Cellulose", "C. Chitin", "D. Phospholipid"],
            correct: "A",
            explanation: "Thành tế bào vi khuẩn cấu tạo từ peptidoglycan, quy định hình dạng và bảo vệ tế bào khỏi áp suất thẩm thấu."
        },
        {
            id: "bio10_t3_q3",
            subject: "Sinh Học",
            grade: "10",
            period: "mid2",
            topic: "Chuyển hóa vật chất & Năng lượng",
            content: "Nơi diễn ra pha sáng của quá trình quang hợp ở thực vật là:",
            options: ["A. Thylakoid của lục lạp", "B. Chất nền stroma của lục lạp", "C. Ti thể", "D. Màng sinh chất"],
            correct: "A",
            explanation: "Pha sáng diễn ra trên màng thylakoid chứa hệ sắc tố diệp lục, chuyển hóa năng lượng ánh sáng thành ATP và NADPH."
        },
        {
            id: "bio10_t4_q3",
            subject: "Sinh Học",
            grade: "10",
            period: "final2",
            topic: "Phân chia tế bào (Nguyên phân, Giảm phân)",
            content: "Sự tiếp hợp và trao đổi chéo giữa các chromatid khác nguồn trong cặp NST tương đồng diễn ra ở kì nào?",
            options: ["A. Kì đầu I của giảm phân", "B. Kì giữa I của giảm phân", "C. Kì đầu của nguyên phân", "D. Kì sau II của giảm phân"],
            correct: "A",
            explanation: "Tiếp hợp và trao đổi chéo diễn ra ở kì đầu I (Prophase I) giảm phân, tạo ra các biến dị tổ hợp phong phú."
        },
        {
            id: "bio10_t5_q3",
            subject: "Sinh Học",
            grade: "10",
            period: "final2",
            topic: "Vi sinh vật & Virus",
            content: "Bacteriophage (Phage) là tên gọi của loại virus nào?",
            options: ["A. Virus kí sinh ở vi khuẩn", "B. Virus kí sinh ở người", "C. Virus kí sinh ở thực vật", "D. Vi khuẩn ăn nấm"],
            correct: "A",
            explanation: "Phage (thể thực khuẩn) là các loại virus chuyên lây nhiễm và nhân lên bên trong cơ thể vi khuẩn."
        },
        {
            id: "sinh10_m1_extra1",
            subject: "Sinh Học",
            grade: "10",
            period: "mid1",
            topic: "Sinh học tế bào & Thành phần hóa học",
            content: "Bốn nguyên tố hóa học chính chiếm hơn 96% khối lượng cơ thể sống là:",
            options: ["A. C, H, O, N", "B. C, H, O, P", "C. C, H, Fe, Ca", "D. N, P, K, Na"],
            correct: "A",
            explanation: "Carbon, Hydrogen, Oxygen và Nitrogen (C, H, O, N) là 4 nguyên tố đại lượng chủ yếu cấu tạo chất sống."
        },
        {
            id: "sinh10_f1_extra1",
            subject: "Sinh Học",
            grade: "10",
            period: "final1",
            topic: "Cấu trúc tế bào nhân sơ & nhân thực",
            content: "Cấu trúc nào sau đây có mặt ở cả tế bào nhân sơ (vi khuẩn) và tế bào nhân thực?",
            options: ["A. Ribosome", "B. Nhân có màng bao bọc", "C. Ti thể", "D. Lưới nội chất"],
            correct: "A",
            explanation: "Tế bào nhân sơ chưa có màng nhân và các bào quan có màng, nhưng có bào quan ribosome để tổng hợp protein."
        },
        {
            id: "sinh10_m2_extra1",
            subject: "Sinh Học",
            grade: "10",
            period: "mid2",
            topic: "Chuyển hóa vật chất & Năng lượng",
            content: "Đồng tiền năng lượng vạn năng được tế bào sử dụng trực tiếp cho mọi hoạt động sống là:",
            options: ["A. Phân tử ATP", "B. Phân tử Glucose", "C. Lipid", "D. Vitamin C"],
            correct: "A",
            explanation: "ATP (Adenosine Triphosphate) là hợp chất giàu năng lượng cung cấp trực tiếp cho mọi phản ứng trong tế bào."
        },
        {
            id: "sinh10_f2_extra1",
            subject: "Sinh Học",
            grade: "10",
            period: "final2",
            topic: "Phân chia tế bào (Nguyên phân, Giảm phân)",
            content: "Kết quả của quá trình nguyên phân từ 1 tế bào mẹ (2n) tạo ra:",
            options: ["A. 2 tế bào con có bộ NST lưỡng bội (2n) giống hệt nhau và giống mẹ", "B. 4 tế bào con đơn bội (n)", "C. 2 tế bào con đơn bội (n)", "D. 1 tế bào con tam bội (3n)"],
            correct: "A",
            explanation: "Nguyên phân tạo 2 tế bào con mang bộ NST 2n giữ nguyên đặc tính di truyền của loài."
        },
    ],
    "Lịch Sử": [
        {
            id: "h10_1",
            subject: "Lịch Sử",
            grade: "10",
            period: "mid1",
            topic: "Hiện thực lịch sử và nhận thức lịch sử",
            content: "Khái niệm 'hiện thực lịch sử' dùng để chỉ:",
            options: ["A. Tất cả những gì đã diễn ra trong quá khứ, tồn tại khách quan không phụ thuộc vào ý muốn con người", "B. Những ghi chép chủ quan của người viết sử", "C. Phim tài liệu lịch sử hiện đại", "D. Các câu chuyện truyền thuyết dân gian"],
            correct: "A",
            explanation: "Hiện thực lịch sử là quá khứ khách quan đã diễn ra, trong khi nhận thức lịch sử là hiểu biết của con người về hiện thực đó."
        },
        {
            id: "h10_2",
            subject: "Lịch Sử",
            grade: "10",
            period: "final1",
            topic: "Các nền văn minh cổ - trung đại",
            content: "Kim tự tháp và chữ tượng hình là thành tựu văn minh tiêu biểu của quốc gia cổ đại nào?",
            options: ["A. Ai Cập cổ đại", "B. Lưỡng Hà", "C. Hy Lạp cổ đại", "D. La Mã cổ đại"],
            correct: "A",
            explanation: "Ai Cập cổ đại nổi tiếng thế giới với công trình kỳ quan Kim tự tháp và hệ thống chữ viết tượng hình khắc trên giấy cói."
        },
        {
            id: "h10_3",
            subject: "Lịch Sử",
            grade: "10",
            period: "final1",
            topic: "Văn minh Đông Nam Á",
            content: "Cơ sở kinh tế chung và cốt lõi nhất của các quốc gia Đông Nam Á thời cổ - trung đại là:",
            options: ["A. Nông nghiệp trồng lúa nước", "B. Chăn nuôi du mục", "C. Công nghiệp cơ khí", "D. Đánh bắt cá voi"],
            correct: "A",
            explanation: "Khí hậu nhiệt đới gió mùa thuận lợi cho sự hình thành và phát triển của nền văn minh nông nghiệp lúa nước Đông Nam Á."
        },
        {
            id: "h10_4",
            subject: "Lịch Sử",
            grade: "10",
            period: "mid2",
            topic: "Văn minh Đại Việt",
            content: "Trường đại học đầu tiên của nước ta được thành lập dưới triều đại nhà Lý là:",
            options: ["A. Quốc Tử Giám", "B. Văn Miếu", "C. Hàn Lâm Viện", "D. Đông Kinh Nghĩa Thục"],
            correct: "A",
            explanation: "Năm 1076, vua Lý Nhân Tông cho lập Quốc Tử Giám bên cạnh Văn Miếu, được coi là trường đại học đầu tiên của Việt Nam."
        },
        {
            id: "h10_5",
            subject: "Lịch Sử",
            grade: "10",
            period: "final2",
            topic: "Cách mạng công nghiệp",
            content: "Phát minh máy hơi nước của James Watt (năm 1784) đã tạo ra bước ngoặt to lớn nào cho cuộc Cách mạng công nghiệp lần thứ nhất?",
            options: ["A. Khởi đầu quá trình cơ giới hóa sản xuất, thay thế sức lao động thủ công bằng máy móc", "B. Phát minh ra mạng internet", "C. Chế tạo thành công máy bay siêu thanh", "D. Mở ra kỉ nguyên điện hạt nhân"],
            correct: "A",
            explanation: "Máy hơi nước của James Watt là động lực vạn năng mở đầu cho quá trình cơ giới hóa sản xuất trong cuộc Cách mạng công nghiệp lần thứ nhất."
        },
        {
            id: "his10_extra_1",
            subject: "Lịch Sử",
            grade: "10",
            period: "mid1",
            topic: "Hiện thực lịch sử và nhận thức lịch sử",
            content: "Hiện thực lịch sử là gì?",
            options: ["A. Toàn bộ những gì đã diễn ra trong quá khứ, tồn tại khách quan độc lập với ý thức con người", "B. Những ghi chép của các nhà sử học", "C. Những truyền thuyết dân gian lưu truyền miệng", "D. Ý kiến chủ quan của con người về quá khứ"],
            correct: "A",
            explanation: "Hiện thực lịch sử là toàn bộ những gì đã diễn ra trong quá khứ, tồn tại một cách khách quan, độc lập với ý muốn chủ quan của con người."
        },
        {
            id: "his10_extra_2",
            subject: "Lịch Sử",
            grade: "10",
            period: "final1",
            topic: "Văn minh Ai Cập cổ đại & Lưỡng Hà",
            content: "Chữ viết cổ nhất của người Ai Cập cổ đại là:",
            options: ["A. Chữ tượng hình", "B. Chữ hình nêm (tiết diện)", "C. Chữ Phạn", "D. Chữ La-tinh"],
            correct: "A",
            explanation: "Người Ai Cập cổ đại sáng tạo ra chữ tượng hình (hieroglyph) từ khoảng hơn 3000 năm TCN, thường được viết trên giấy papyrus."
        },
        {
            id: "his10_extra_3",
            subject: "Lịch Sử",
            grade: "10",
            period: "mid2",
            topic: "Văn minh Văn Lang - Âu Lạc",
            content: "Trống đồng Đông Sơn là hiện vật tiêu biểu gắn liền với nền văn minh nào trên đất nước Việt Nam?",
            options: ["A. Văn minh Văn Lang - Âu Lạc", "B. Văn minh Chăm-pa", "C. Văn minh Phù Nam", "D. Văn minh Đại Việt"],
            correct: "A",
            explanation: "Trống đồng Đông Sơn thể hiện đỉnh cao nghệ thuật đúc đồng và đời sống tinh thần phong phú của cư dân Văn Lang - Âu Lạc thời cổ đại."
        },
        {
            id: "his10_extra_4",
            subject: "Lịch Sử",
            grade: "10",
            period: "final2",
            topic: "Khối đại đoàn kết dân tộc",
            content: "Khối đại đoàn kết toàn dân tộc Việt Nam có vai trò quyết định như thế nào trong lịch sử dựng nước và giữ nước?",
            options: ["A. Là nhân tố quyết định mọi thắng lợi trong các cuộc kháng chiến bảo vệ Tổ quốc", "B. Chỉ quan trọng trong thời kì bình yên", "C. Phụ thuộc hoàn toàn vào viện trợ quốc tế", "D. Chỉ phát huy tác dụng ở vùng đồng bằng"],
            correct: "A",
            explanation: "Đoàn kết là truyền thống quý báu và sức mạnh nội sinh to lớn, quyết định mọi thắng lợi trong lịch sử chống ngoại xâm và kiến thiết đất nước."
        },
        {
            id: "his10_extra_5",
            subject: "Lịch Sử",
            grade: "10",
            period: "final2",
            topic: "Văn minh Phù Nam",
            content: "Thương cảng quốc tế nổi tiếng bậc nhất của vương quốc cổ Phù Nam là:",
            options: ["A. Óc Eo", "B. Đại Chiêm", "C. Vân Đồn", "D. Hội An"],
            correct: "A",
            explanation: "Óc Eo (An Giang ngày nay) là cảng thị sầm uất bậc nhất của vương quốc Phù Nam, trung tâm giao thương trên con đường tơ lụa trên biển."
        },
        {
            id: "his10_t1_q3",
            subject: "Lịch Sử",
            grade: "10",
            period: "mid1",
            topic: "Hiện thực lịch sử và nhận thức lịch sử",
            content: "Nguồn sử liệu nào sau đây được coi là chứng cứ quan trọng, đáng tin cậy nhất khi nghiên cứu lịch sử?",
            options: ["A. Sử liệu hiện vật và tư liệu gốc", "B. Phim ảnh lịch sử chuyển thể", "C. Tranh vẽ minh họa hiện đại", "D. Truyền thuyết hư cấu"],
            correct: "A",
            explanation: "Sử liệu hiện vật và tư liệu gốc ra đời cùng thời điểm diễn ra sự kiện là căn cứ khoa học xác thực nhất phản ánh hiện thực."
        },
        {
            id: "his10_t2_q3",
            subject: "Lịch Sử",
            grade: "10",
            period: "final1",
            topic: "Các nền văn minh cổ - trung đại",
            content: "Nền văn minh Hy Lạp và La Mã cổ đại có đóng góp kiệt xuất nào cho nền dân chủ thế giới?",
            options: ["A. Nhà nước dân chủ chủ nô và hệ thống luật pháp La Mã", "B. Chế độ phong kiến tập quyền tuyệt đối", "C. Kinh Veda và chế độ đẳng cấp Varna", "D. Kim tự tháp"],
            correct: "A",
            explanation: "Nhà nước dân chủ Athens và hệ thống Luật La Mã là nền tảng đặt nền móng cho nền dân chủ và pháp luật hiện đại phương Tây."
        },
        {
            id: "his10_t3_q3",
            subject: "Lịch Sử",
            grade: "10",
            period: "mid2",
            topic: "Văn minh Đông Nam Á",
            content: "Đặc trưng nổi bật của nền nông nghiệp truyền thống ở khu vực Đông Nam Á là:",
            options: ["A. Nông nghiệp trồng lúa nước phụ thuộc vào khí hậu nhiệt đới gió mùa", "B. Trồng lúa mì ôn đới", "C. Du mục trên thảo nguyên", "D. Thuần dưỡng lạc đà sa mạc"],
            correct: "A",
            explanation: "Đông Nam Á là cái nôi của nền văn minh lúa nước nhiệt đới gió mùa gắn liền với các đồng bằng phù sa màu mỡ."
        },
        {
            id: "his10_t4_q3",
            subject: "Lịch Sử",
            grade: "10",
            period: "final2",
            topic: "Văn minh Đại Việt",
            content: "Trường đại học đầu tiên của Việt Nam được thành lập năm 1076 dưới thời vua Lí Nhân Tông là:",
            options: ["A. Quốc Tử Giám", "B. Quốc Tử Viện", "C. Hàn Lâm Viện", "D. Chiêu Văn Quán"],
            correct: "A",
            explanation: "Năm 1076, nhà Lý cho xây dựng Quốc Tử Giám bên cạnh Văn Miếu, mở đầu nền giáo dục đại học khoa bảng Đại Việt."
        },
        {
            id: "his10_t5_q3",
            subject: "Lịch Sử",
            grade: "10",
            period: "final2",
            topic: "Cách mạng công nghiệp",
            content: "Phát minh máy hơi nước của James Watt (năm 1784) đã mở đầu cho cuộc cách mạng công nghiệp lần thứ mấy?",
            options: ["A. Cách mạng công nghiệp lần thứ nhất (1.0)", "B. Cách mạng công nghiệp lần thứ hai (2.0)", "C. Cách mạng công nghiệp lần thứ ba (3.0)", "D. Cách mạng 4.0"],
            correct: "A",
            explanation: "Máy hơi nước của James Watt cơ giới hóa sản xuất, khởi xướng cuộc Cách mạng công nghiệp lần thứ nhất tại nước Anh."
        },
        {
            id: "su10_f1_extra1",
            subject: "Lịch Sử",
            grade: "10",
            period: "final1",
            topic: "Các nền văn minh cổ - trung đại",
            content: "Kim tự tháp Kê-ốp là công trình kiến trúc kỳ vĩ tiêu biểu của nền văn minh cổ đại nào?",
            options: ["A. Văn minh Ai Cập cổ đại", "B. Văn minh Lưỡng Hà", "C. Văn minh Ấn Độ cổ đại", "D. Văn minh Trung Hoa"],
            correct: "A",
            explanation: "Kim tự tháp Kê-ốp bên dòng sông Nin là biểu tượng vĩ đại của nền văn minh Ai Cập cổ đại."
        },
        {
            id: "su10_m2_extra1",
            subject: "Lịch Sử",
            grade: "10",
            period: "mid2",
            topic: "Văn minh Đại Việt",
            content: "Trường đại học đầu tiên của Việt Nam được thành lập dưới triều đại nhà Lý là:",
            options: ["A. Quốc Tử Giám", "B. Đông Kinh Nghĩa Thục", "C. Quốc Học Huế", "D. Hàn Lâm Viện"],
            correct: "A",
            explanation: "Năm 1076, vua Lý Nhân Tông cho lập Quốc Tử Giám, được coi là trường đại học đầu tiên của nước ta."
        },
        {
            id: "su10_f2_extra1",
            subject: "Lịch Sử",
            grade: "10",
            period: "final2",
            topic: "Cách mạng công nghiệp",
            content: "Phát minh máy hơi nước của James Watt năm 1784 đã mở đầu cho cuộc cách mạng nào?",
            options: ["A. Cách mạng công nghiệp lần thứ nhất", "B. Cách mạng công nghiệp lần thứ hai", "C. Cách mạng số 4.0", "D. Cách mạng công nghệ thông tin"],
            correct: "A",
            explanation: "Máy hơi nước của James Watt tạo ra động lực cơ khí thay thế sức cơ bắp, mở đầu Cách mạng công nghiệp lần thứ nhất."
        },
    ],
    "Địa Lí": [
        {
            id: "g10_1",
            subject: "Địa Lí",
            grade: "10",
            period: "mid1",
            topic: "Bản đồ & Hệ thống thông tin địa lí (GIS)",
            content: "Kinh tuyến gốc (kinh độ 0°) theo quy ước quốc tế đi qua đài thiên văn Greenwich thuộc quốc gia nào?",
            options: ["A. Vương quốc Anh", "B. Pháp", "C. Hoa Kỳ", "D. Đức"],
            correct: "A",
            explanation: "Kinh tuyến gốc 0° đi qua đài thiên văn Greenwich ở ngoại ô London (Vương quốc Anh)."
        },
        {
            id: "g10_2",
            subject: "Địa Lí",
            grade: "10",
            period: "final1",
            topic: "Thạch quyển & Nội lực, Ngoại lực",
            content: "Nội lực sinh ra các hiện tượng nào sau đây trên bề mặt Trái Đất?",
            options: ["A. Động đất, núi lửa phun trào và uốn nếp tạo núi", "B. Quá trình phong hóa bóc mòn do gió", "C. Hiện tượng bồi tụ phù sa cửa sông", "D. Nước chảy xói mòn đất đai"],
            correct: "A",
            explanation: "Nội lực là lực sinh ra từ trong lòng Trái Đất, gây ra các vận động kiến tạo, động đất, núi lửa và tạo núi."
        },
        {
            id: "g10_3",
            subject: "Địa Lí",
            grade: "10",
            period: "mid2",
            topic: "Khí quyển & Khí hậu",
            content: "Tầng đối lưu của khí quyển là nơi diễn ra các hiện tượng thời tiết chủ yếu như mây, mưa, sương mù vì:",
            options: ["A. Chứa gần 80% khối lượng không khí và hầu hết hơi nước", "B. Không khí loãng nhất trong các tầng", "C. Nhiệt độ tăng dần theo độ cao", "D. Chứa tầng ozon hấp thụ tia cực tím"],
            correct: "A",
            explanation: "Tầng đối lưu chứa gần như toàn bộ hơi nước và các hạt nhân ngưng tụ nên sinh ra mây, mưa, sương mù, bão."
        },
        {
            id: "g10_4",
            subject: "Địa Lí",
            grade: "10",
            period: "mid2",
            topic: "Thủy quyển & Thổ nhưỡng, Sinh quyển",
            content: "Nhân tố nào đóng vai trò cung cấp chất khoáng vô cơ chủ yếu trong quá trình hình thành đất?",
            options: ["A. Đá mẹ", "B. Khí hậu", "C. Sinh vật", "D. Thời gian"],
            correct: "A",
            explanation: "Đá mẹ bị phong hóa sinh ra các hạt khoáng, quyết định thành phần khoáng vật và cơ giới của đất."
        },
        {
            id: "g10_5",
            subject: "Địa Lí",
            grade: "10",
            period: "final2",
            topic: "Địa lí dân cư & Kinh tế ngành",
            content: "Gia tăng dân số tự nhiên của một quốc gia được xác định bằng hiệu số giữa:",
            options: ["A. Tỉ suất sinh thô và tỉ suất tử thô", "B. Tỉ suất xuất cư và nhập cư", "C. Dân số thành thị và nông thôn", "D. Số người trong độ tuổi lao động và người già"],
            correct: "A",
            explanation: "Gia tăng tự nhiên (%) = Tỉ suất sinh thô (‰) - Tỉ suất tử thô (‰)."
        },
        {
            id: "geo10_extra_1",
            subject: "Địa Lí",
            grade: "10",
            period: "mid1",
            topic: "Bản đồ & Phương pháp sử dụng bản đồ",
            content: "Hệ thống định vị toàn cầu GPS có ứng dụng chủ yếu nào sau đây?",
            options: ["A. Xác định vị trí tọa độ, phương hướng và độ cao của các điểm trên Trái Đất", "B. Dự báo lượng mưa tương lai 100 năm", "C. Thăm dò khoáng sản dưới đáy biển sâu", "D. Chụp ảnh cấu trúc nhân Trái Đất"],
            correct: "A",
            explanation: "GPS (Global Positioning System) là hệ thống định vị sử dụng vệ tinh để xác định chính xác tọa độ, độ cao và phương hướng di chuyển."
        },
        {
            id: "geo10_extra_2",
            subject: "Địa Lí",
            grade: "10",
            period: "final1",
            topic: "Trái Đất & Hệ quả chuyển động",
            content: "Hiện tượng ngày đêm luân phiên nhau trên Trái Đất là do:",
            options: ["A. Trái Đất có dạng hình cầu và tự quay quanh trục từ Tây sang Đông", "B. Trái Đất chuyển động tịnh tiến quanh Mặt Trời", "C. Trục Trái Đất nghiêng không đổi góc", "D. Mặt Trăng che khuất Mặt Trời"],
            correct: "A",
            explanation: "Do Trái Đất hình cầu nên luôn được chiếu sáng một nửa (ngày) và một nửa bóng tối (đêm), cùng chuyển động tự quay sinh ra luân phiên ngày đêm."
        },
        {
            id: "geo10_extra_3",
            subject: "Địa Lí",
            grade: "10",
            period: "mid2",
            topic: "Khí quyển & Khí hậu",
            content: "Tầng khí quyển nào tiếp giáp với mặt đất, chứa tới 80% khối lượng không khí và là nơi diễn ra hầu hết các hiện tượng thời tiết?",
            options: ["A. Tầng đối lưu", "B. Tầng bình lưu", "C. Tầng giữa", "D. Tầng nhiệt"],
            correct: "A",
            explanation: "Tầng đối lưu (troposphere) sát mặt đất, chứa đại bộ phận không khí, hơi nước và phát sinh mây, mưa, bão, sấm chớp..."
        },
        {
            id: "geo10_extra_4",
            subject: "Địa Lí",
            grade: "10",
            period: "final2",
            topic: "Thủy quyển & Nước trên Trái Đất",
            content: "Thủy triều đạt dao động lớn nhất (triều cường) vào những ngày nào trong tháng âm lịch?",
            options: ["A. Không trăng (mồng 1) và trăng tròn (ngày rằm 15)", "B. Trăng bán nguyệt đầu tháng (mồng 7, 8)", "C. Trăng khuyết cuối tháng (22, 23)", "D. Mọi ngày như nhau"],
            correct: "A",
            explanation: "Khi Mặt Trời, Mặt Trăng và Trái Đất thẳng hàng (vào ngày mồng 1 và rằm 15), lực hút trọng trường cộng hưởng làm triều cường đạt biên độ cực đại."
        },
        {
            id: "geo10_t1_q3",
            subject: "Địa Lí",
            grade: "10",
            period: "mid1",
            topic: "Bản đồ & Hệ thống thông tin địa lí (GIS)",
            content: "Hệ thống thông tin địa lí (GIS) là hệ thống máy tính dùng để:",
            options: ["A. Thu thập, lưu trữ, phân tích và hiển thị dữ liệu địa lí không gian", "B. Dự báo tỷ giá tiền tệ ngân hàng", "C. Soạn thảo văn bản hành chính", "D. Thiết kế đồ họa game thuần túy"],
            correct: "A",
            explanation: "GIS (Geographic Information System) quản lý, phân tích dữ liệu gắn với tọa độ không gian phục vụ quy hoạch, cứu hộ, môi trường."
        },
        {
            id: "geo10_t2_q3",
            subject: "Địa Lí",
            grade: "10",
            period: "final1",
            topic: "Thạch quyển & Nội lực, Ngoại lực",
            content: "Nội lực là lực phát sinh từ đâu và có tác động chính như thế nào đến địa hình?",
            options: ["A. Từ bên trong Trái Đất, làm bề mặt Trái Đất gồ ghề hơn", "B. Từ bức xạ mặt trời, san bằng địa hình", "C. Từ sức hút mặt trăng", "D. Từ dòng chảy nước mưa"],
            correct: "A",
            explanation: "Nội lực sinh ra do nguồn năng lượng trong lòng Trái Đất (uốn nếp, đứt gãy, núi lửa) có xu hướng làm bề mặt gồ ghề, tạo núi non."
        },
        {
            id: "geo10_t3_q3",
            subject: "Địa Lí",
            grade: "10",
            period: "mid2",
            topic: "Khí quyển & Khí hậu",
            content: "Gió Mậu dịch (Tín phong) là loại gió thổi quanh năm từ:",
            options: ["A. Áp cao cận chí tuyến về áp thấp xích đạo", "B. Áp cao cực về áp thấp ôn đới", "C. Xích đạo về hai cực", "D. Biển vào đất liền ban ngày"],
            correct: "A",
            explanation: "Gió Tín phong thổi đều đặn quanh năm từ các đai áp cao cận nhiệt đới (chí tuyến) về đai áp thấp xích đạo."
        },
        {
            id: "geo10_t4_q3",
            subject: "Địa Lí",
            grade: "10",
            period: "final2",
            topic: "Thủy quyển & Thổ nhưỡng, Sinh quyển",
            content: "Nhân tố nào đóng vai trò chủ đạo cung cấp chất hữu cơ và làm giàu mùn cho đất?",
            options: ["A. Sinh vật", "B. Đá mẹ", "C. Địa hình", "D. Thời gian"],
            correct: "A",
            explanation: "Sinh vật (thực vật, vi sinh vật) phân hủy xác hữu cơ cung cấp chất dinh dưỡng và hình thành tầng mùn phì nhiêu của đất."
        },
        {
            id: "geo10_t5_q3",
            subject: "Địa Lí",
            grade: "10",
            period: "final2",
            topic: "Địa lí dân cư & Kinh tế ngành",
            content: "Quá trình đô thị hóa trên thế giới hiện nay thể hiện qua đặc điểm nào?",
            options: ["A. Tỉ lệ dân cư thành thị tăng nhanh và lối sống đô thị lan tỏa rộng rãi", "B. Dân số nông thôn tăng mạnh", "C. Thu hẹp quy mô các thành phố", "D. Giảm số lượng siêu đô thị"],
            correct: "A",
            explanation: "Đô thị hóa là xu hướng tăng tỉ trọng dân số thành thị, mở rộng không gian thành phố và phổ biến lối sống hiện đại."
        },
        {
            id: "dia10_m1_extra1",
            subject: "Địa Lí",
            grade: "10",
            period: "mid1",
            topic: "Bản đồ & Hệ thống thông tin địa lí (GIS)",
            content: "Hệ thống định vị toàn cầu GPS có ứng dụng phổ biến nào sau đây?",
            options: ["A. Xác định vị trí địa lí và điều hướng lộ trình di chuyển", "B. Đo nhiệt độ đại dương ở đáy sâu", "C. Dự báo động đất", "D. Đào hầm mỏ"],
            correct: "A",
            explanation: "GPS thu nhận tín hiệu vệ tinh để xác định chính xác tọa độ, phương hướng và lộ trình chuyển động."
        },
        {
            id: "dia10_m2_extra1",
            subject: "Địa Lí",
            grade: "10",
            period: "mid2",
            topic: "Khí quyển & Khí hậu",
            content: "Tầng đối lưu của khí quyển có đặc điểm nổi bật nào?",
            options: ["A. Tập trung khoảng 80% khối lượng không khí và là nơi diễn ra mọi hiện tượng thời tiết (mây, mưa, bão)", "B. Có tầng ozon bảo vệ", "C. Nhiệt độ tăng theo độ cao", "D. Không có không khí"],
            correct: "A",
            explanation: "Tầng đối lưu là tầng thấp nhất, tập trung phần lớn khí quyển và sinh ra mây, mưa, sấm sét."
        },
        {
            id: "dia10_f2_extra1",
            subject: "Địa Lí",
            grade: "10",
            period: "final2",
            topic: "Địa lí dân cư & Kinh tế ngành",
            content: "Cơ cấu dân số theo độ tuổi gồm 3 nhóm tuổi chính là:",
            options: ["A. 0 - 14 tuổi, 15 - 64 tuổi và từ 65 tuổi trở lên", "B. 0 - 18 tuổi, 19 - 50 tuổi và trên 50 tuổi", "C. Dưới 20 tuổi và trên 20 tuổi", "D. Nhóm trẻ em và nhóm người già"],
            correct: "A",
            explanation: "Phân chia chuẩn quốc tế: Dưới tuổi lao động (0-14), độ tuổi lao động (15-64) và quá tuổi lao động (65+)."
        },
    ],
    "GDKT&PL": [
        {
            id: "l10_1",
            subject: "GDKT&PL",
            grade: "10",
            period: "mid1",
            topic: "Nền kinh tế và các chủ thể kinh tế",
            content: "Chủ thể nào trong nền kinh tế trực tiếp sử dụng các yếu tố sản xuất để tạo ra sản phẩm hàng hóa, dịch vụ?",
            options: ["A. Chủ thể sản xuất", "B. Chủ thể tiêu dùng", "C. Chủ thể trung gian", "D. Chủ thể nhà nước"],
            correct: "A",
            explanation: "Chủ thể sản xuất là những người trực tiếp sản xuất, cung cấp của cải vật chất và dịch vụ đáp ứng nhu cầu xã hội."
        },
        {
            id: "l10_2",
            subject: "GDKT&PL",
            grade: "10",
            period: "final1",
            topic: "Thị trường và cơ chế thị trường",
            content: "Quy luật kinh tế nào điều tiết tỉ lệ tương quan giữa người bán và người mua, tác động trực tiếp đến giá cả thị trường?",
            options: ["A. Quy luật cung - cầu", "B. Quy luật lưu thông tiền tệ", "C. Quy luật cạnh tranh", "D. Quy luật giá trị thặng dư"],
            correct: "A",
            explanation: "Cung - cầu là mối quan hệ tác động qua lại giữa người bán và người mua, quyết định mức giá cân bằng trên thị trường."
        },
        {
            id: "l10_3",
            subject: "GDKT&PL",
            grade: "10",
            period: "final1",
            topic: "Thuế và ngân sách nhà nước",
            content: "Khoản thu bắt buộc, không hoàn trả trực tiếp mà các tổ chức, cá nhân phải nộp vào ngân sách nhà nước là:",
            options: ["A. Thuế", "B. Phí dịch vụ", "C. Lệ phí", "D. Tiền phạt vi phạm"],
            correct: "A",
            explanation: "Thuế là nguồn thu cốt lõi của ngân sách nhà nước, có tính cưỡng chế và không mang tính hoàn trả trực tiếp."
        },
        {
            id: "l10_4",
            subject: "GDKT&PL",
            grade: "10",
            period: "mid2",
            topic: "Pháp luật và đời sống",
            content: "Văn bản quy phạm pháp luật có hiệu lực pháp lí cao nhất trong hệ thống pháp luật Việt Nam là:",
            options: ["A. Hiến pháp", "B. Bộ luật Dân sự", "C. Luật Giáo dục", "D. Nghị định của Chính phủ"],
            correct: "A",
            explanation: "Hiến pháp là đạo luật cơ bản của Nhà nước, mọi văn bản pháp luật khác đều phải phù hợp với Hiến pháp."
        },
        {
            id: "l10_5",
            subject: "GDKT&PL",
            grade: "10",
            period: "final2",
            topic: "Bộ máy nhà nước CHXHCN Việt Nam",
            content: "Cơ quan duy nhất có quyền lập hiến và lập pháp ở nước Cộng hòa Xã hội Chủ nghĩa Việt Nam là:",
            options: ["A. Quốc hội", "B. Chính phủ", "C. Viện kiểm sát nhân dân tối cao", "D. Mặt trận Tổ quốc"],
            correct: "A",
            explanation: "Điều 69 Hiến pháp quy định Quốc hội là cơ quan đại biểu cao nhất của Nhân dân, thực hiện quyền lập hiến và lập pháp."
        },
        {
            id: "law10_extra_1",
            subject: "GDKT&PL",
            grade: "10",
            period: "mid1",
            topic: "Nền kinh tế và các chủ thể kinh tế",
            content: "Chủ thể nào đóng vai trò cầu nối, phân phối hàng hóa từ người sản xuất đến người tiêu dùng?",
            options: ["A. Chủ thể trung gian", "B. Chủ thể sản xuất", "C. Chủ thể tiêu dùng", "D. Chủ thể nhà nước"],
            correct: "A",
            explanation: "Chủ thể trung gian (thương nhân, đại lí phân phối...) kết nối cung - cầu hàng hóa, dịch vụ trong nền kinh tế thị trường."
        },
        {
            id: "law10_extra_2",
            subject: "GDKT&PL",
            grade: "10",
            period: "final1",
            topic: "Thị trường và cơ chế thị trường",
            content: "Khi cung nhỏ hơn cầu (cung < cầu) trên thị trường, giá cả hàng hóa thường có xu hướng biến động như thế nào?",
            options: ["A. Tăng lên cao hơn giá trị", "B. Giảm xuống thấp hơn giá trị", "C. Giữ nguyên không đổi", "D. Bằng 0"],
            correct: "A",
            explanation: "Quy luật cung cầu chỉ rõ: Khi nhu cầu mua lớn hơn khả năng cung ứng (khan hiếm), người mua cạnh tranh đẩy giá cả tăng lên."
        },
        {
            id: "law10_extra_3",
            subject: "GDKT&PL",
            grade: "10",
            period: "mid2",
            topic: "Ngân sách nhà nước và thuế",
            content: "Nguồn thu chủ yếu và mang tính bắt buộc của Ngân sách nhà nước là:",
            options: ["A. Thuế", "B. Viện trợ không hoàn lại", "C. Vay nợ nước ngoài", "D. Lợi nhuận xổ số"],
            correct: "A",
            explanation: "Thuế là khoản thu bắt buộc nộp vào ngân sách nhà nước, chiếm tỉ trọng lớn nhất và có tính pháp lí cao nhất."
        },
        {
            id: "law10_extra_5",
            subject: "GDKT&PL",
            grade: "10",
            period: "final2",
            topic: "Sản xuất kinh doanh",
            content: "Mục tiêu hàng đầu của các doanh nghiệp khi tham gia sản xuất kinh doanh là:",
            options: ["A. Thu được lợi nhuận hợp pháp", "B. Phục vụ miễn phí xã hội", "C. Giảm quy mô tài sản", "D. Tiêu diệt mọi đối thủ bằng mọi giá"],
            correct: "A",
            explanation: "Mục đích cơ bản và lâu dài của hoạt động kinh doanh là tối đa hóa lợi nhuận hợp pháp gắn với trách nhiệm xã hội."
        },
        {
            id: "law10_t1_q3",
            subject: "GDKT&PL",
            grade: "10",
            period: "mid1",
            topic: "Nền kinh tế và các chủ thể kinh tế",
            content: "Chủ thể tiêu dùng trong nền kinh tế thị trường có vai trò:",
            options: ["A. Định hướng và thúc đẩy sản xuất thông qua nhu cầu sử dụng hàng hóa, dịch vụ", "B. Trực tiếp ban hành luật thuế", "C. Trung gian vận chuyển", "D. Độc quyền ấn định giá sàn"],
            correct: "A",
            explanation: "Nhu cầu và thị hiếu của người tiêu dùng là mục tiêu và động lực quyết định các doanh nghiệp sản xuất cái gì, như thế nào."
        },
        {
            id: "law10_t2_q3",
            subject: "GDKT&PL",
            grade: "10",
            period: "final1",
            topic: "Thị trường và cơ chế thị trường",
            content: "Cơ chế thị trường tự điều tiết các quan hệ kinh tế thông qua 'bàn tay vô hình' của:",
            options: ["A. Giá cả, cung cầu và cạnh tranh", "B. Mệnh lệnh hành chính tuyệt đối", "C. Viện trợ nước ngoài", "D. Bốc thăm may rủi"],
            correct: "A",
            explanation: "Cơ chế thị trường vận hành dựa trên các quy luật khách quan: quy luật giá trị, cung cầu, cạnh tranh để phân bổ nguồn lực."
        },
        {
            id: "law10_t3_q3",
            subject: "GDKT&PL",
            grade: "10",
            period: "mid2",
            topic: "Thuế và ngân sách nhà nước",
            content: "Loại thuế gián thu đánh vào các hàng hóa, dịch vụ đặc biệt cần hạn chế tiêu dùng (thuốc lá, rượu bia, xe sang) là:",
            options: ["A. Thuế tiêu thụ đặc biệt", "B. Thuế thu nhập cá nhân", "C. Thuế thu nhập doanh nghiệp", "D. Thuế sử dụng đất phi nông nghiệp"],
            correct: "A",
            explanation: "Thuế tiêu thụ đặc biệt nhằm điều tiết hành vi tiêu dùng và tăng thu ngân sách với mặt hàng xa xỉ hoặc có hại sức khỏe."
        },
        {
            id: "law10_t4_q3",
            subject: "GDKT&PL",
            grade: "10",
            period: "final2",
            topic: "Pháp luật và đời sống",
            content: "Pháp luật mang bản chất giai cấp và bản chất gì sâu sắc?",
            options: ["A. Bản chất xã hội", "B. Bản chất cá nhân", "C. Bản chất địa phương", "D. Bản chất tôn giáo"],
            correct: "A",
            explanation: "Pháp luật bắt nguồn từ thực tiễn đời sống xã hội, thể hiện ý chí của nhân dân và phục vụ lợi ích chung của toàn xã hội."
        },
        {
            id: "law10_t5_q3",
            subject: "GDKT&PL",
            grade: "10",
            period: "final2",
            topic: "Bộ máy nhà nước CHXHCN Việt Nam",
            content: "Cơ quan quyền lực nhà nước cao nhất của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam là:",
            options: ["A. Quốc hội", "B. Chính phủ", "C. Tòa án nhân dân tối cao", "D. Hội đồng nhân dân tỉnh"],
            correct: "A",
            explanation: "Quốc hội là cơ quan đại biểu cao nhất của nhân dân, cơ quan quyền lực nhà nước cao nhất, có quyền lập hiến và lập pháp."
        },
        {
            id: "ktpl10_m1_extra1",
            subject: "GDKT&PL",
            grade: "10",
            period: "mid1",
            topic: "Nền kinh tế và các chủ thể kinh tế",
            content: "Chủ thể tiêu dùng trong nền kinh tế đóng vai trò định hướng sản xuất thông qua hành vi:",
            options: ["A. Lựa chọn mua sắm và sử dụng hàng hóa, dịch vụ theo nhu cầu", "B. Ban hành luật pháp kinh tế", "C. Trực tiếp vận hành dây chuyền nhà máy", "D. In tiền tệ quốc gia"],
            correct: "A",
            explanation: "Người tiêu dùng quyết định mua gì, mua bao nhiêu, từ đó định hướng doanh nghiệp sản xuất mặt hàng phù hợp."
        },
        {
            id: "ktpl10_f1_extra1",
            subject: "GDKT&PL",
            grade: "10",
            period: "final1",
            topic: "Thị trường và cơ chế thị trường",
            content: "Giá cả thị trường được quyết định bởi quan hệ nào?",
            options: ["A. Quan hệ cung - cầu và cạnh tranh trên thị trường", "B. Ý muốn chủ quan của một cá nhân duy nhất", "C. Thời tiết và mùa vụ", "D. Số lượng nhân viên bán hàng"],
            correct: "A",
            explanation: "Cơ chế thị trường tự điều tiết giá cả qua sự tương tác giữa cung, cầu và cạnh tranh."
        },
        {
            id: "ktpl10_m2_extra1",
            subject: "GDKT&PL",
            grade: "10",
            period: "mid2",
            topic: "Thuế và ngân sách nhà nước",
            content: "Thuế có vai trò quan trọng hàng đầu nào đối với Nhà nước?",
            options: ["A. Là nguồn thu chủ yếu của ngân sách nhà nước để duy trì bộ máy và đầu tư công", "B. Để phạt các doanh nghiệp làm ăn có lãi", "C. Làm giảm tổng sản phẩm quốc nội", "D. Thay thế tiền lương cho người dân"],
            correct: "A",
            explanation: "Thuế tạo nguồn thu bền vững cho ngân sách nhà nước để xây dựng đường xá, trường học, bệnh viện và quốc phòng."
        },
        {
            id: "ktpl10_f2_extra1",
            subject: "GDKT&PL",
            grade: "10",
            period: "final2",
            topic: "Bộ máy nhà nước CHXHCN Việt Nam",
            content: "Quốc hội nước Cộng hòa xã hội chủ nghĩa Việt Nam là cơ quan có quyền hạn cao nhất nào?",
            options: ["A. Cơ quan đại biểu cao nhất của nhân dân, cơ quan quyền lực nhà nước cao nhất, thực hiện quyền lập hiến và lập pháp", "B. Cơ quan xét xử tư pháp", "C. Cơ quan chấp hành hành chính", "D. Cơ quan kiểm toán độc lập"],
            correct: "A",
            explanation: "Quốc hội là cơ quan quyền lực nhà nước cao nhất, làm Hiến pháp, luật và quyết định các vấn đề quan trọng của đất nước."
        },
    ],
    "Tiếng Anh": [
        {
            id: "e10_1",
            subject: "Tiếng Anh",
            grade: "10",
            period: "mid1",
            topic: "Family Life & Daily Routines",
            content: "My father usually ________ the newspaper while having morning coffee.",
            options: ["A. reads", "B. is reading", "C. read", "D. has read"],
            correct: "A",
            explanation: "Thói quen hàng ngày dùng thì hiện tại đơn: 'My father' ngôi thứ ba số ít thêm -s 'reads'."
        },
        {
            id: "e10_2",
            subject: "Tiếng Anh",
            grade: "10",
            period: "final1",
            topic: "Humans and the Environment",
            content: "Switching off unnecessary electrical appliances is an easy way to save energy and protect the ________.",
            options: ["A. environment", "B. environmental", "C. environmentally", "D. environmentalist"],
            correct: "A",
            explanation: "Cần danh từ sau động từ 'protect': 'protect the environment' (bảo vệ môi trường)."
        },
        {
            id: "e10_3",
            subject: "Tiếng Anh",
            grade: "10",
            period: "mid2",
            topic: "Music and Arts",
            content: "Quan Ho singing has been recognized by UNESCO as an intangible cultural ________ of humanity.",
            options: ["A. heritage", "B. tradition", "C. custom", "D. history"],
            correct: "A",
            explanation: "Cụm danh từ: 'intangible cultural heritage' (di sản văn hóa phi vật thể)."
        },
        {
            id: "e10_4",
            subject: "Tiếng Anh",
            grade: "10",
            period: "mid2",
            topic: "Community Service & Volunteering",
            content: "Last summer, hundreds of students ________ in a clean-up campaign in our neighborhood.",
            options: ["A. participated", "B. participate", "C. were participating", "D. have participated"],
            correct: "A",
            explanation: "Dấu hiệu quá khứ 'Last summer' -> chia quá khứ đơn 'participated'."
        },
        {
            id: "e10_5",
            subject: "Tiếng Anh",
            grade: "10",
            period: "final2",
            topic: "Inventions & Modern Tech",
            content: "The modern smartphone is considered one of the greatest ________ of the 21st century.",
            options: ["A. inventions", "B. inventors", "C. inventing", "D. inventories"],
            correct: "A",
            explanation: "'one of the greatest inventions' (một trong những phát minh vĩ đại nhất)."
        },
        {
            id: "eng10_extra_1",
            subject: "Tiếng Anh",
            grade: "10",
            period: "mid1",
            topic: "Family Life & Relationships",
            content: "Choose the word with the underlined part pronounced differently: A. bake  B. take  C. make  D. hat",
            options: ["A. bake", "B. take", "C. make", "D. hat"],
            correct: "D",
            explanation: "'hat' phát âm là /æ/, các từ còn lại phát âm là /eɪ/."
        },
        {
            id: "eng10_extra_2",
            subject: "Tiếng Anh",
            grade: "10",
            period: "final1",
            topic: "Humans and the Environment",
            content: "We should reduce our carbon ______ to protect the environment and combat climate change.",
            options: ["A. footprint", "B. fingerprint", "C. step", "D. trace"],
            correct: "A",
            explanation: "Cụm từ cố định 'carbon footprint' nghĩa là 'dấu chân carbon' (lượng khí thải carbon của mỗi cá nhân hoặc tổ chức)."
        },
        {
            id: "eng10_extra_3",
            subject: "Tiếng Anh",
            grade: "10",
            period: "mid2",
            topic: "Music & Entertainment",
            content: "She ______ playing the piano when she was only 5 years old.",
            options: ["A. started", "B. has started", "C. starts", "D. had been started"],
            correct: "A",
            explanation: "Hành động đã xảy ra và chấm dứt tại thời điểm xác định trong quá khứ ('when she was only 5 years old') dùng thì Quá khứ đơn (Past Simple): started."
        },
        {
            id: "eng10_extra_4",
            subject: "Tiếng Anh",
            grade: "10",
            period: "final2",
            topic: "Inventions & Modern Technology",
            content: "Smartphones allow people ______ with each other instantly regardless of geographical distance.",
            options: ["A. to communicate", "B. communicating", "C. communicate", "D. communicated"],
            correct: "A",
            explanation: "Cấu trúc: allow somebody + to V (cho phép ai làm việc gì) -> to communicate."
        },
        {
            id: "eng10_extra_5",
            subject: "Tiếng Anh",
            grade: "10",
            period: "final2",
            topic: "Gender Equality",
            content: "Both men and women should have equal ______ to education and employment opportunities.",
            options: ["A. access", "B. excess", "C. entrance", "D. permission"],
            correct: "A",
            explanation: "Collocation: have equal access to something (có cơ hội tiếp cận bình đẳng với điều gì)."
        },
        {
            id: "eng10_t1_q3",
            subject: "Tiếng Anh",
            grade: "10",
            period: "mid1",
            topic: "Family Life & Daily Routines",
            content: "In my family, everyone is expected to split household ______ such as cooking and doing the laundry.",
            options: ["A. chores", "B. homework", "C. jobs", "D. missions"],
            correct: "A",
            explanation: "Household chores là cụm từ cố định chỉ các công việc nhà hàng ngày."
        },
        {
            id: "eng10_t2_q3",
            subject: "Tiếng Anh",
            grade: "10",
            period: "final1",
            topic: "Humans and the Environment",
            content: "Single-use plastics should be ______ to protect marine life and reduce land pollution.",
            options: ["A. banned", "B. supported", "C. recycled poorly", "D. increased"],
            correct: "A",
            explanation: "Banned (bị cấm hoàn toàn): Nhựa dùng một lần cần phải bị cấm để bảo vệ sinh vật biển."
        },
        {
            id: "eng10_t3_q3",
            subject: "Tiếng Anh",
            grade: "10",
            period: "mid2",
            topic: "Music and Arts",
            content: "The famous singer gave a magnificent ______ that impressed all the audience in the concert hall.",
            options: ["A. performance", "B. performer", "C. perform", "D. performative"],
            correct: "A",
            explanation: "Sau tính từ 'magnificent' cần một danh từ: performance (buổi biểu diễn xuất sắc)."
        },
        {
            id: "eng10_t4_q3",
            subject: "Tiếng Anh",
            grade: "10",
            period: "final2",
            topic: "Community Service & Volunteering",
            content: "Volunteers helped ______ funds to build a new playground for disadvantaged children.",
            options: ["A. raise", "B. rise", "C. lift", "D. grow"],
            correct: "A",
            explanation: "Raise funds (gây quỹ): Các tình nguyện viên đã giúp gây quỹ để xây dựng sân chơi cho trẻ em khó khăn."
        },
        {
            id: "eng10_t5_q3",
            subject: "Tiếng Anh",
            grade: "10",
            period: "final2",
            topic: "Inventions & Modern Tech",
            content: "Artificial intelligence allows self-driving cars ______ obstacles and navigate safely.",
            options: ["A. to detect", "B. detect", "C. detecting", "D. detected"],
            correct: "A",
            explanation: "Cấu trúc allow somebody/something + to V: Cho phép ai/cái gì làm gì -> to detect."
        },
        {
            id: "eng10_m1_extra1",
            subject: "Tiếng Anh",
            grade: "10",
            period: "mid1",
            topic: "Family Life & Daily Routines",
            content: "Doing household chores helps children learn to take ________ and become more independent.",
            options: ["A. responsibility", "B. advantage", "C. place", "D. care"],
            correct: "A",
            explanation: "'take responsibility' nghĩa là chịu trách nhiệm, có tinh thần trách nhiệm."
        },
        {
            id: "eng10_f1_extra1",
            subject: "Tiếng Anh",
            grade: "10",
            period: "final1",
            topic: "Humans and the Environment",
            content: "We should use eco-friendly products to protect the ________ from pollution.",
            options: ["A. environment", "B. economy", "C. equipment", "D. entertainment"],
            correct: "A",
            explanation: "'Protect the environment' nghĩa là bảo vệ môi trường."
        },
        {
            id: "eng10_m2_extra1",
            subject: "Tiếng Anh",
            grade: "10",
            period: "mid2",
            topic: "Inventions & Modern Tech",
            content: "Smartphones are among the most useful ________ of the twenty-first century.",
            options: ["A. inventions", "B. discoveries", "C. creations", "D. intentions"],
            correct: "A",
            explanation: "'Inventions' là những phát minh, sáng chế của con người."
        },
        {
            id: "eng10_f2_extra1",
            subject: "Tiếng Anh",
            grade: "10",
            period: "final2",
            topic: "Community Service & Volunteering",
            content: "Many teenagers take part in volunteering activities to ________ hands to help disadvantaged people.",
            options: ["A. join", "B. give", "C. shake", "D. hold"],
            correct: "A",
            explanation: "'Join hands' có nghĩa là chung tay góp sức."
        },
    ],
    "Tin Học": [
        {
            id: "t10_1",
            subject: "Tin Học",
            grade: "10",
            period: "mid1",
            topic: "Máy tính và xã hội tri thức",
            content: "Đơn vị cơ bản nhỏ nhất dùng để đo lường lượng thông tin trong máy tính là:",
            options: ["A. Bit (Binary digit)", "B. Byte", "C. Kilobyte", "D. Megabyte"],
            correct: "A",
            explanation: "Bit là đơn vị nhỏ nhất chỉ nhận một trong hai trạng thái 0 hoặc 1."
        },
        {
            id: "t10_2",
            subject: "Tin Học",
            grade: "10",
            period: "final1",
            topic: "Mạng máy tính & Internet an toàn",
            content: "Mạng máy tính được kết nối trong phạm vi địa lý hẹp như một phòng học, một tòa nhà gọi là:",
            options: ["A. Mạng cục bộ (LAN)", "B. Mạng diện rộng (WAN)", "C. Mạng toàn cầu (Internet)", "D. Mạng đô thị (MAN)"],
            correct: "A",
            explanation: "LAN (Local Area Network) là mạng cục bộ kết nối các máy tính trong phạm vi bán kính nhỏ."
        },
        {
            id: "t10_3",
            subject: "Tin Học",
            grade: "10",
            period: "final1",
            topic: "Đạo đức, pháp luật số",
            content: "Hành vi nào sau đây vi phạm bản quyền và đạo đức khi sử dụng công nghệ thông tin?",
            options: ["A. Sao chép và phân phối phần mềm có bản quyền mà không được phép của tác giả", "B. Sử dụng phần mềm nguồn mở", "C. Tự viết phần mềm phục vụ học tập", "D. Chia sẻ tài liệu học tập miễn phí có trích nguồn"],
            correct: "A",
            explanation: "Bẻ khóa hoặc sao chép thương mại phần mềm có bản quyền là vi phạm Luật Sở hữu trí tuệ."
        },
        {
            id: "t10_4",
            subject: "Tin Học",
            grade: "10",
            period: "mid2",
            topic: "Lập trình Python cơ bản",
            content: "Trong ngôn ngữ lập trình Python, cú pháp nào sau đây dùng để nhập dữ liệu dạng chuỗi từ bàn phím?",
            options: ["A. input()", "B. print()", "C. scan()", "D. read()"],
            correct: "A",
            explanation: "Hàm input() trong Python dùng để nhận dữ liệu nhập vào từ bàn phím dưới dạng xâu ký tự (str)."
        },
        {
            id: "t10_5",
            subject: "Tin Học",
            grade: "10",
            period: "final2",
            topic: "Thuật toán tìm kiếm & sắp xếp",
            content: "Thuật toán tìm kiếm nhị phân (Binary Search) chỉ áp dụng được trên danh sách thỏa mãn điều kiện nào?",
            options: ["A. Danh sách đã được sắp xếp theo thứ tự (tăng dần hoặc giảm dần)", "B. Danh sách có các phần tử hoàn toàn ngẫu nhiên", "C. Danh sách chỉ chứa số nguyên âm", "D. Danh sách có ít hơn 10 phần tử"],
            correct: "A",
            explanation: "Tìm kiếm nhị phân đòi hỏi dãy đã được sắp xếp để mỗi bước so sánh có thể loại bỏ được một nửa số phần tử."
        },
        {
            id: "cs10_extra_1",
            subject: "Tin Học",
            grade: "10",
            period: "mid1",
            topic: "Tin học và xử lý thông tin",
            content: "Đơn vị đo lượng thông tin cơ bản nhỏ nhất trong máy tính là:",
            options: ["A. Bit", "B. Byte", "C. Kilobyte", "D. Gigabyte"],
            correct: "A",
            explanation: "Bit (Binary digit) mang 1 trong 2 giá trị 0 hoặc 1 là đơn vị thông tin nhỏ nhất trong hệ thống máy tính."
        },
        {
            id: "cs10_extra_2",
            subject: "Tin Học",
            grade: "10",
            period: "final1",
            topic: "Mạng máy tính và an toàn mạng",
            content: "Thiết bị nào sau đây dùng để định tuyến và chuyển tiếp các gói tin giữa các mạng máy tính khác nhau?",
            options: ["A. Router", "B. Chuột máy tính", "C. Màn hình", "D. Bàn phím"],
            correct: "A",
            explanation: "Router (Bộ định tuyến) có chức năng nhận và điều phối gói tin theo các tuyến đường tối ưu giữa các mạng khác nhau."
        },
        {
            id: "cs10_extra_3",
            subject: "Tin Học",
            grade: "10",
            period: "mid2",
            topic: "Lập trình Python cơ bản",
            content: "Trong Python, kết quả của biểu thức: 17 // 5 là:",
            options: ["A. 3", "B. 3.4", "C. 2", "D. 3.0"],
            correct: "A",
            explanation: "Toán tử // trong Python là phép chia lấy phần nguyên: 17 // 5 = 3."
        },
        {
            id: "cs10_extra_4",
            subject: "Tin Học",
            grade: "10",
            period: "final2",
            topic: "Cấu trúc rẽ nhánh & Vòng lặp",
            content: "Đoạn mã Python sau in ra kết quả gì?\nfor i in range(1, 4):\n    print(i, end=' ')",
            options: ["A. 1 2 3", "B. 1 2 3 4", "C. 0 1 2 3", "D. 1 4"],
            correct: "A",
            explanation: "range(1, 4) sinh dãy số nguyên từ 1 đến 3 (không bao gồm cận trên 4), do đó in ra 1 2 3."
        },
        {
            id: "cs10_extra_5",
            subject: "Tin Học",
            grade: "10",
            period: "final2",
            topic: "Danh sách và chuỗi trong Python",
            content: "Cho danh sách a = [10, 20, 30, 40]. Lệnh a.append(50) sẽ làm gì?",
            options: ["A. Thêm phần tử 50 vào cuối danh sách", "B. Xóa phần tử 50", "C. Chèn 50 vào đầu danh sách", "D. Đếm số lần xuất hiện của 50"],
            correct: "A",
            explanation: "Phương thức append(x) trong Python bổ sung phần tử x vào vị trí cuối cùng của danh sách."
        },
        {
            id: "cs10_t1_q3",
            subject: "Tin Học",
            grade: "10",
            period: "mid1",
            topic: "Máy tính và xã hội tri thức",
            content: "Thiết bị nào sau đây vừa là thiết bị vào (input) vừa là thiết bị ra (output) của máy tính?",
            options: ["A. Màn hình cảm ứng (Touchscreen)", "B. Bàn phím cơ", "C. Máy quét (Scanner)", "D. Chuột quang"],
            correct: "A",
            explanation: "Màn hình cảm ứng vừa nhận tương tác chạm từ ngón tay (Input) vừa hiển thị hình ảnh đồ họa (Output)."
        },
        {
            id: "cs10_t2_q3",
            subject: "Tin Học",
            grade: "10",
            period: "final1",
            topic: "Mạng máy tính & Internet an toàn",
            content: "Hành động nào sau đây giúp bảo vệ tài khoản cá nhân an toàn trên không gian mạng?",
            options: ["A. Kích hoạt xác thực 2 yếu tố (2FA) và dùng mật khẩu mạnh", "B. Dùng chung một mật khẩu 123456 cho mọi website", "C. Nhấp vào đường link lạ gửi qua email rác", "D. Đăng nhập tài khoản ngân hàng trên Wi-Fi công cộng không có mật khẩu"],
            correct: "A",
            explanation: "Xác thực 2 bước (2FA) và mật khẩu phức tạp giúp chống lại các cuộc tấn công đánh cắp mật khẩu."
        },
        {
            id: "cs10_t3_q3",
            subject: "Tin Học",
            grade: "10",
            period: "mid2",
            topic: "Đạo đức, pháp luật số",
            content: "Hành vi tải phần mềm crack (bẻ khóa bản quyền) và phát tán trái phép vi phạm quyền gì?",
            options: ["A. Quyền tác giả và sở hữu trí tuệ", "B. Quyền tự do ngôn luận", "C. Quyền bầu cử", "D. Quyền bảo vệ sức khỏe"],
            correct: "A",
            explanation: "Phần mềm được bảo hộ theo Luật Sở hữu trí tuệ; bẻ khóa và chia sẻ lậu là hành vi xâm phạm bản quyền tác giả."
        },
        {
            id: "cs10_t4_q3",
            subject: "Tin Học",
            grade: "10",
            period: "final2",
            topic: "Lập trình Python cơ bản",
            content: "Đoạn mã Python sau: s = 'Python'; print(s[1:4]) sẽ in ra gì?",
            options: ["A. yth", "B. Pyt", "C. ytho", "D. thon"],
            correct: "A",
            explanation: "Cắt chuỗi trong Python lấy từ chỉ số 1 ('y') đến chỉ số 3 ('h', bỏ qua vị trí cận trên 4): 'yth'."
        },
        {
            id: "cs10_t5_q3",
            subject: "Tin Học",
            grade: "10",
            period: "final2",
            topic: "Thuật toán tìm kiếm & sắp xếp",
            content: "Để áp dụng thuật toán tìm kiếm nhị phân (Binary Search), danh sách đầu vào bắt buộc phải thỏa mãn điều kiện gì?",
            options: ["A. Đã được sắp xếp theo một thứ tự xác định (tăng dần hoặc giảm dần)", "B. Các phần tử phải có giá trị là số nguyên tố", "C. Chiều dài danh sách phải là số chẵn", "D. Không có phần tử trùng nhau"],
            correct: "A",
            explanation: "Tìm kiếm nhị phân chia đôi không gian tìm kiếm ở mỗi bước nên bắt buộc dãy số phải được sắp xếp trước."
        },
        {
            id: "cs10_mid1_b1",
            subject: "Tin Học",
            grade: "10",
            period: "mid1",
            topic: "Máy tính và xã hội tri thức",
            content: "Bộ xử lý trung tâm (CPU - Central Processing Unit) gồm các khối chức năng chính nào?",
            options: ["A. Khối điều khiển (CU) và Khối số học / logic (ALU)", "B. Màn hình và bàn phím", "C. Ổ cứng và quạt tản nhiệt", "D. Nguồn điện và dây cáp"],
            correct: "A",
            explanation: "CPU gồm CU (Control Unit) điều khiển các hoạt động và ALU (Arithmetic Logic Unit) thực hiện các phép toán số học và logic."
        },
        {
            id: "cs10_mid1_b2",
            subject: "Tin Học",
            grade: "10",
            period: "mid1",
            topic: "Máy tính và xã hội tri thức",
            content: "Bộ nhớ trong của máy tính bao gồm hai loại chính là:",
            options: ["A. RAM (Bộ nhớ truy cập ngẫu nhiên) và ROM (Bộ nhớ chỉ đọc)", "B. Ổ cứng SSD và ổ HDD", "C. Thẻ nhớ SD và USB", "D. Đĩa CD và DVD"],
            correct: "A",
            explanation: "Bộ nhớ trong gồm RAM (lưu trữ tạm thời, mất khi tắt máy) và ROM (lưu chương trình khởi động BIOS cố định)."
        },
        {
            id: "cs10_fin1_b1",
            subject: "Tin Học",
            grade: "10",
            period: "final1",
            topic: "Mạng máy tính & Internet an toàn",
            content: "Địa chỉ IP (IPv4) gồm bao nhiêu bit và được biểu diễn dưới dạng nào?",
            options: ["A. 32 bit, chia thành 4 nhóm số thập phân cách nhau bởi dấu chấm", "B. 16 bit, 2 nhóm", "C. 64 bit, 8 nhóm", "D. 128 bit"],
            correct: "A",
            explanation: "IPv4 có độ dài 32 bit chia làm 4 byte (ví dụ: 192.168.1.1), mỗi byte từ 0 đến 255."
        },
        {
            id: "cs10_mid2_b1",
            subject: "Tin Học",
            grade: "10",
            period: "mid2",
            topic: "Lập trình Python cơ bản",
            content: "Trong Python, để nhập dữ liệu từ bàn phím dưới dạng số nguyên, ta dùng lệnh:",
            options: ["A. x = int(input())", "B. x = input()", "C. x = float(input())", "D. x = str(input())"],
            correct: "A",
            explanation: "Hàm input() trả về xâu kí tự, cần bọc hàm int() để ép kiểu sang số nguyên."
        },
        {
            id: "cs10_fin2_b1",
            subject: "Tin Học",
            grade: "10",
            period: "final2",
            topic: "Thuật toán tìm kiếm & sắp xếp",
            content: "Độ phức tạp thời gian trong trường hợp xấu nhất của thuật toán sắp xếp nổi bọt (Bubble Sort) là:",
            options: ["A. O(n²)", "B. O(n)", "C. O(log n)", "D. O(1)"],
            correct: "A",
            explanation: "Bubble Sort so sánh từng cặp phần tử liền kề qua hai vòng lặp lồng nhau nên độ phức tạp là O(n²)."
        },
        {
            id: "tin10_m1_extra1",
            subject: "Tin Học",
            grade: "10",
            period: "mid1",
            topic: "Máy tính và xã hội tri thức",
            content: "Thiết bị nào sau đây là thiết bị vào (Input device) của máy tính?",
            options: ["A. Bàn phím và chuột", "B. Màn hình máy tính", "C. Máy in laser", "D. Loa âm thanh"],
            correct: "A",
            explanation: "Bàn phím và chuột thu nhận dữ liệu từ người dùng đưa vào máy tính xử lý."
        },
        {
            id: "tin10_m1_extra2",
            subject: "Tin Học",
            grade: "10",
            period: "mid1",
            topic: "Mạng máy tính & Internet an toàn",
            content: "Để bảo vệ thông tin cá nhân trên mạng xã hội, người dùng NÊN làm gì?",
            options: ["A. Đặt mật khẩu mạnh và bật tính năng xác thực hai lớp (2FA)", "B. Chia sẻ công khai số CCCD và mật khẩu", "C. Bấm vào mọi đường link lạ nhận được", "D. Dùng chung một mật khẩu đơn giản cho tất cả tài khoản"],
            correct: "A",
            explanation: "Mật khẩu mạnh và xác thực hai lớp là lá chắn cơ bản ngăn ngừa bị đánh cắp tài khoản mạng."
        },
        {
            id: "tin10_f1_extra1",
            subject: "Tin Học",
            grade: "10",
            period: "final1",
            topic: "Lập trình Python cơ bản",
            content: "Trong Python, cú pháp nào sau đây dùng để in dòng chữ 'Xin chào' ra màn hình?",
            options: ["A. print('Xin chào')", "B. echo 'Xin chào'", "C. cout << 'Xin chào'", "D. System.out.println('Xin chào')"],
            correct: "A",
            explanation: "Hàm print() trong Python dùng để xuất dữ liệu ra màn hình console."
        },
        {
            id: "tin10_m2_extra1",
            subject: "Tin Học",
            grade: "10",
            period: "mid2",
            topic: "Lập trình Python cơ bản",
            content: "Trong Python, kết quả của phép toán 17 // 5 là:",
            options: ["A. 3", "B. 3.4", "C. 2", "D. 3.0"],
            correct: "A",
            explanation: "Toán tử // là phép chia lấy phần nguyên trong Python: 17 // 5 = 3."
        },
        {
            id: "tin10_f2_extra1",
            subject: "Tin Học",
            grade: "10",
            period: "final2",
            topic: "Thuật toán tìm kiếm & sắp xếp",
            content: "Thuật toán tìm kiếm nhị phân (Binary Search) yêu cầu dãy số đầu vào phải thỏa mãn điều kiện gì?",
            options: ["A. Dãy số đã được sắp xếp theo thứ tự tăng dần hoặc giảm dần", "B. Dãy số chỉ chứa các số chẵn", "C. Dãy số phải có số lượng phần tử là lũy thừa của 2", "D. Không cần điều kiện gì"],
            correct: "A",
            explanation: "Tìm kiếm nhị phân chia đôi phạm vi tìm kiếm ở mỗi bước nên bắt buộc mảng phải được sắp xếp trước."
        },
    ],
    "Công Nghệ": [
        {
            id: "cn10_1",
            subject: "Công Nghệ",
            grade: "10",
            period: "mid1",
            topic: "Bản vẽ kỹ thuật & Hình chiếu",
            content: "Trong phương pháp chiếu góc thứ nhất, hướng chiếu từ trước tới vật thể cho ta hình chiếu nào?",
            options: ["A. Hình chiếu đứng", "B. Hình chiếu bằng", "C. Hình chiếu cạnh", "D. Hình chiếu trục đo"],
            correct: "A",
            explanation: "Hướng chiếu từ trước tới cho hình chiếu đứng; từ trên xuống cho hình chiếu bằng; từ trái sang cho hình chiếu cạnh."
        },
        {
            id: "cn10_2",
            subject: "Công Nghệ",
            grade: "10",
            period: "final1",
            topic: "Công nghệ & Đời sống kĩ thuật",
            content: "Kích thước tiêu chuẩn của khổ giấy vẽ A4 quy định trong tiêu chuẩn TCVN là:",
            options: ["A. 210 mm × 297 mm", "B. 297 mm × 420 mm", "C. 148 mm × 210 mm", "D. 420 mm × 594 mm"],
            correct: "A",
            explanation: "Khổ giấy A4 có kích thước tiêu chuẩn là 210 mm × 297 mm."
        },
        {
            id: "cn10_3",
            subject: "Công Nghệ",
            grade: "10",
            period: "final1",
            topic: "Vật liệu kỹ thuật & Gia công",
            content: "Kim loại đen được sử dụng rộng rãi nhất trong kĩ thuật và cơ khí là:",
            options: ["A. Thép và gang (hợp kim của sắt và cacbon)", "B. Nhôm và hợp kim nhôm", "C. Đồng thau", "D. Titan"],
            correct: "A",
            explanation: "Kim loại đen gồm gang và thép, chiếm phần lớn khối lượng vật liệu kim loại dùng trong đời sống và công nghiệp."
        },
        {
            id: "cn10_4",
            subject: "Công Nghệ",
            grade: "10",
            period: "mid2",
            topic: "Công nghệ trồng trọt & Bảo vệ thực vật",
            content: "Khả năng của đất cung cấp đủ nước, oxy và chất dinh dưỡng cho cây trồng sinh trưởng, phát triển tốt được gọi là:",
            options: ["A. Độ phì nhiêu của đất", "B. Độ chua của đất", "C. Thành phần cơ giới của đất", "D. Khối lượng riêng của đất"],
            correct: "A",
            explanation: "Độ phì nhiêu là đặc tính cơ bản nhất của đất trồng, quyết định năng suất cây trồng."
        },
        {
            id: "cn10_5",
            subject: "Công Nghệ",
            grade: "10",
            period: "final2",
            topic: "Nông nghiệp công nghệ cao",
            content: "Ưu điểm nổi bật nhất của phương pháp tưới nhỏ giọt trong nông nghiệp công nghệ cao là:",
            options: ["A. Tiết kiệm nước tối đa và đưa dinh dưỡng hòa tan trực tiếp tới vùng rễ cây", "B. Làm ẩm ướt toàn bộ không gian mặt lá cây", "C. Thay thế hoàn toàn phân bón hữu cơ", "D. Giúp cây phát triển không cần ánh sáng"],
            correct: "A",
            explanation: "Tưới nhỏ giọt cấp nước chính xác từng giọt vào gốc rễ, giảm bốc hơi, tiết kiệm tới 50-70% nước tưới."
        },
        {
            id: "tech10_extra_1",
            subject: "Công Nghệ",
            grade: "10",
            period: "mid1",
            topic: "Công nghệ trồng trọt",
            content: "Độ phì nhiêu của đất trồng trọt là khả năng của đất:",
            options: ["A. Cung cấp nước, chất dinh dưỡng và oxi cho cây trồng sinh trưởng và cho năng suất", "B. Giữ lại nước mưa vĩnh viễn", "C. Chống lại mọi loại sâu bệnh", "D. Làm tăng nhiệt độ môi trường"],
            correct: "A",
            explanation: "Độ phì nhiêu là đặc tính quan trọng nhất của đất, đảm bảo điều kiện sống tối ưu cho bộ rễ cây hấp thụ dưỡng chất."
        },
        {
            id: "tech10_extra_2",
            subject: "Công Nghệ",
            grade: "10",
            period: "final1",
            topic: "Phân bón & Giống cây trồng",
            content: "Nhóm phân bón nào sau đây thuộc nhóm phân bón hữu cơ?",
            options: ["A. Phân chuồng, phân xanh, phân compost", "B. Phân đạm Urê", "C. Phân lân nung chảy", "D. Phân kali clorua"],
            correct: "A",
            explanation: "Phân hữu cơ có nguồn gốc từ chất thải động thực vật (phân chuồng, than bùn, lá ủ mục...), an toàn và cải tạo đất tốt."
        },
        {
            id: "tech10_extra_3",
            subject: "Công Nghệ",
            grade: "10",
            period: "mid2",
            topic: "Thiết kế kỹ thuật",
            content: "Bản vẽ kĩ thuật được xây dựng chủ yếu dựa trên phép chiếu nào sau đây?",
            options: ["A. Phép chiếu vuông góc", "B. Phép chiếu xiên góc", "C. Phép chiếu tâm", "D. Phép chiếu song song bất kì"],
            correct: "A",
            explanation: "Phép chiếu vuông góc là phương pháp biểu diễn cơ bản nhất trong vẽ kĩ thuật để thể hiện chính xác kích thước và hình dạng vật thể."
        },
        {
            id: "tech10_extra_4",
            subject: "Công Nghệ",
            grade: "10",
            period: "final2",
            topic: "Hình chiếu vuông góc",
            content: "Hình chiếu đứng của một vật thể được nhìn từ hướng nào?",
            options: ["A. Từ trước tới", "B. Từ trên xuống", "C. Từ trái sang", "D. Từ sau lại"],
            correct: "A",
            explanation: "Hình chiếu đứng (Front view) là hình chiếu vuông góc lên mặt phẳng đứng theo hướng nhìn từ trước tới."
        },
        {
            id: "tech10_extra_5",
            subject: "Công Nghệ",
            grade: "10",
            period: "final2",
            topic: "Quy trình thiết kế kĩ thuật",
            content: "Bước đầu tiên trong quy trình thiết kế kĩ thuật là gì?",
            options: ["A. Xác định vấn đề và nhu cầu cần giải quyết", "B. Chế tạo mẫu thử", "C. Đánh giá sản phẩm", "D. Sản xuất hàng loạt"],
            correct: "A",
            explanation: "Bất kì quy trình sáng chế thiết kế nào cũng phải xuất phát từ việc phát hiện nhu cầu thực tế và xác định tiêu chí giải pháp."
        },
        {
            id: "tech10_t1_q3",
            subject: "Công Nghệ",
            grade: "10",
            period: "mid1",
            topic: "Công nghệ & Đời sống kĩ thuật",
            content: "Công nghệ mang lại lợi ích chủ yếu nào cho sự phát triển của xã hội loài người?",
            options: ["A. Nâng cao năng suất lao động, cải thiện chất lượng cuộc sống và giải phóng sức lao động", "B. Làm cạn kiệt tài nguyên vĩnh viễn", "C. Ngừng sản xuất hàng hóa", "D. Tăng thời gian lao động chân tay"],
            correct: "A",
            explanation: "Đổi mới công nghệ thúc đẩy tiến bộ văn minh, tạo ra của cải dồi dào và giải phóng con người khỏi công việc nặng nhọc."
        },
        {
            id: "tech10_t2_q3",
            subject: "Công Nghệ",
            grade: "10",
            period: "final1",
            topic: "Bản vẽ kỹ thuật & Hình chiếu",
            content: "Nét liền đậm trong bản vẽ kĩ thuật dùng để vẽ:",
            options: ["A. Đường bao thấy, cạnh thấy của vật thể", "B. Đường bao khuất", "C. Đường gióng kích thước", "D. Đường tâm trục đối xứng"],
            correct: "A",
            explanation: "Theo Tiêu chuẩn Việt Nam (TCVN), nét liền đậm biểu diễn các đường bao nhìn thấy và cạnh thấy của chi tiết."
        },
        {
            id: "tech10_t3_q3",
            subject: "Công Nghệ",
            grade: "10",
            period: "mid2",
            topic: "Vật liệu kỹ thuật & Gia công",
            content: "Kim loại đen trong cơ khí chế tạo bao gồm hai nhóm chính là:",
            options: ["A. Gang và thép", "B. Đồng và nhôm", "C. Vàng và bạc", "D. Titan và niken"],
            correct: "A",
            explanation: "Kim loại đen là hợp kim của sắt (Fe) với cacbon (C), chia thành thép (C < 2.14%) và gang (C ≥ 2.14%)."
        },
        {
            id: "tech10_t4_q3",
            subject: "Công Nghệ",
            grade: "10",
            period: "final2",
            topic: "Công nghệ trồng trọt & Bảo vệ thực vật",
            content: "Biện pháp phòng trừ sâu bệnh sinh học có ưu điểm vượt trội nào so với hóa học?",
            options: ["A. An toàn cho con người, không gây ô nhiễm môi trường và duy trì cân bằng sinh thái", "B. Tiêu diệt tức thì trong 1 phút", "C. Làm biến đổi gen cây trồng", "D. Chi phí luôn bằng 0"],
            correct: "A",
            explanation: "Dùng thiên địch hoặc chế phẩm vi sinh vật diệt sâu bệnh an toàn thực phẩm, không để lại dư lượng độc hại."
        },
        {
            id: "tech10_t5_q3",
            subject: "Công Nghệ",
            grade: "10",
            period: "final2",
            topic: "Nông nghiệp công nghệ cao",
            content: "Phương pháp trồng cây trong dung dịch dinh dưỡng không dùng đất được gọi là:",
            options: ["A. Thủy canh (Hydroponics)", "B. Khí canh", "C. Thâm canh truyền thống", "D. Luân canh"],
            correct: "A",
            explanation: "Thủy canh là kỹ thuật trồng cây trong môi trường nước chứa đầy đủ khoáng chất hòa tan, kiểm soát chính xác dinh dưỡng."
        },
        {
            id: "cn10_m1_extra1",
            subject: "Công Nghệ",
            grade: "10",
            period: "mid1",
            topic: "Công nghệ & Đời sống kĩ thuật",
            content: "Bản vẽ kĩ thuật được xem là ngôn ngữ chung của ngành nào?",
            options: ["A. Kĩ thuật và công nghệ", "B. Ngoại giao quốc tế", "C. Nghệ thuật hội họa", "D. Y học lâm sàng"],
            correct: "A",
            explanation: "Bản vẽ kĩ thuật truyền tải chính xác hình dạng, kích thước của chi tiết trong chế tạo và xây dựng."
        },
        {
            id: "cn10_f1_extra1",
            subject: "Công Nghệ",
            grade: "10",
            period: "final1",
            topic: "Bản vẽ kỹ thuật & Hình chiếu",
            content: "Phương pháp chiếu vuông góc sử dụng các tia chiếu như thế nào đối với mặt phẳng hình chiếu?",
            options: ["A. Vuông góc với mặt phẳng hình chiếu", "B. Song song với nhau nhưng xiên góc", "C. Hội tụ tại một điểm", "D. Cắt nhau bất kì"],
            correct: "A",
            explanation: "Hình chiếu vuông góc có các tia chiếu song song và vuông góc với mặt phẳng hình chiếu."
        },
        {
            id: "cn10_m2_extra1",
            subject: "Công Nghệ",
            grade: "10",
            period: "mid2",
            topic: "Công nghệ trồng trọt & Bảo vệ thực vật",
            content: "Trồng trọt trong nhà màng, nhà kính áp dụng công nghệ tưới nhỏ giọt là biểu hiện của:",
            options: ["A. Nông nghiệp công nghệ cao", "B. Canh tác quảng canh truyền thống", "C. Trồng cây hoang dã", "D. Lâm nghiệp tự nhiên"],
            correct: "A",
            explanation: "Nhà màng, hệ thống tưới tự động là ứng dụng tiêu biểu của nông nghiệp công nghệ cao."
        },
        {
            id: "cn10_f2_extra1",
            subject: "Công Nghệ",
            grade: "10",
            period: "final2",
            topic: "Vật liệu kỹ thuật & Gia công",
            content: "Kim loại đen trong cơ khí chế tạo máy là hợp kim của sắt với nguyên tố nào?",
            options: ["A. Carbon (C)", "B. Nhôm (Al)", "C. Đồng (Cu)", "D. Kẽm (Zn)"],
            correct: "A",
            explanation: "Kim loại đen là gang và thép, thành phần chính là sắt (Fe) kết hợp với carbon (C)."
        },
    ],
    "GDQP&AN": [
        {
            id: "qp10_1",
            subject: "GDQP&AN",
            grade: "10",
            period: "mid1",
            topic: "Truyền thống đánh giặc giữ nước của dân tộc",
            content: "Chiến thắng lịch sử nào vào năm 938 đã đập tan quân Nam Hán xâm lược, chấm dứt hơn 1000 năm Bắc thuộc của dân tộc ta?",
            options: ["A. Chiến thắng Bạch Đằng do Ngô Quyền lãnh đạo", "B. Khởi nghĩa Hai Bà Trưng", "C. Chiến thắng Chi Lăng - Xương Giang", "D. Chiến thắng Ngọc Hồi - Đống Đa"],
            correct: "A",
            explanation: "Trận thủy chiến Bạch Đằng năm 938 do Ngô Quyền chỉ huy đã mở ra kỉ nguyên độc lập, tự chủ lâu dài cho dân tộc ta."
        },
        {
            id: "qp10_2",
            subject: "GDQP&AN",
            grade: "10",
            period: "final1",
            topic: "Lịch sử & Nghệ thuật quân sự",
            content: "Nét đặc sắc nổi bật nhất trong nghệ thuật quân sự của cha ông ta là:",
            options: ["A. Toàn dân đánh giặc, 'lấy ít địch nhiều', 'lấy chí nhân thay cường bạo'", "B. Chỉ dựa vào thành lũy kiên cố cố thủ", "C. Nhờ quân đội nước ngoài đánh giúp", "D. Đầu hàng nhượng đất để cầu hòa"],
            correct: "A",
            explanation: "Tổ tiên ta luôn phát huy sức mạnh khối đại đoàn kết toàn dân, thế trận chiến tranh nhân dân 'cả nước chung sức đánh giặc'."
        },
        {
            id: "qp10_3",
            subject: "GDQP&AN",
            grade: "10",
            period: "final1",
            topic: "Xây dựng lực lượng vũ trang nhân dân",
            content: "Lực lượng nòng cốt của lực lượng vũ trang nhân dân Việt Nam là:",
            options: ["A. Quân đội nhân dân và Công an nhân dân", "B. Lực lượng hải quan", "C. Đội tự quản thôn xóm", "D. Ban chỉ huy quân sự xã"],
            correct: "A",
            explanation: "Quân đội nhân dân và Công an nhân dân là hai lực lượng nòng cốt trong sự nghiệp bảo vệ vững chắc Tổ quốc."
        },
        {
            id: "qp10_4",
            subject: "GDQP&AN",
            grade: "10",
            period: "mid2",
            topic: "Bảo vệ chủ quyền lãnh thổ & Biên giới",
            content: "Đường biên giới quốc gia trên biển của nước ta được xác định bằng:",
            options: ["A. Ranh giới ngoài của lãnh hải (cách đường cơ sở 12 hải lí)", "B. Đường bờ biển mép nước", "C. Ranh giới vùng nội thủy", "D. Ranh giới vùng đặc quyền kinh tế (200 hải lí)"],
            correct: "A",
            explanation: "Biên giới quốc gia trên biển là ranh giới ngoài của lãnh hải, có chiều rộng 12 hải lý tính từ đường cơ sở."
        },
        {
            id: "qp10_5",
            subject: "GDQP&AN",
            grade: "10",
            period: "final2",
            topic: "Kỹ thuật cấp cứu & Băng bó vết thương",
            content: "Biện pháp sơ cứu khẩn cấp đầu tiên và quan trọng nhất khi gặp người bị say nắng, say nóng là:",
            options: ["A. Đưa nạn nhân ngay vào chỗ râm mát, thoáng khí, nới rộng trang phục và chườm mát hạ nhiệt", "B. Bắt nạn nhân tiếp tục vận động mạnh", "C. Đắp thêm chăn ấm kín người", "D. Cho uống rượu mạnh kích thích"],
            correct: "A",
            explanation: "Cần lập tức đưa nạn nhân vào nơi râm mát, nới lỏng áo quần và chườm mát trán, nách, bẹn để hạ thân nhiệt kịp thời."
        },
        {
            id: "mil10_extra_1",
            subject: "GDQP&AN",
            grade: "10",
            period: "mid1",
            topic: "Truyền thống đánh giặc giữ nước",
            content: "Chiến thắng Bạch Đằng lịch sử năm 938 gắn liền với vị anh hùng dân tộc nào?",
            options: ["A. Ngô Quyền", "B. Trần Hưng Đạo", "C. Lê Hoàn", "D. Quang Trung"],
            correct: "A",
            explanation: "Ngô Quyền đánh tan quân Nam Hán trên sông Bạch Đằng năm 938, chấm dứt hơn 1000 năm Bắc thuộc, mở ra kỉ nguyên độc lập tự chủ lâu dài."
        },
        {
            id: "mil10_extra_2",
            subject: "GDQP&AN",
            grade: "10",
            period: "final1",
            topic: "Quân đội nhân dân Việt Nam",
            content: "Ngày truyền thống của Quân đội nhân dân Việt Nam là ngày:",
            options: ["A. 22/12/1944", "B. 19/08/1945", "C. 30/04/1975", "D. 02/09/1945"],
            correct: "A",
            explanation: "Ngày 22/12/1944 thành lập Đội Việt Nam Tuyên truyền Giải phóng quân, tiền thân của Quân đội nhân dân Việt Nam anh hùng."
        },
        {
            id: "mil10_extra_3",
            subject: "GDQP&AN",
            grade: "10",
            period: "mid2",
            topic: "Bảo vệ chủ quyền biên giới",
            content: "Chủ quyền lãnh thổ quốc gia là quyền lực tối cao, hoàn toàn và tuyệt đối của quốc gia đối với:",
            options: ["A. Lãnh thổ và mọi cá nhân, tổ chức trên lãnh thổ đó", "B. Chỉ vùng biển quốc tế", "C. Chỉ vùng đất liền nội địa", "D. Các quốc gia láng giềng"],
            correct: "A",
            explanation: "Chủ quyền quốc gia gồm vùng đất, vùng nước, vùng trời và lòng đất, mang tính thiêng liêng bất khả xâm phạm."
        },
        {
            id: "mil10_extra_4",
            subject: "GDQP&AN",
            grade: "10",
            period: "final2",
            topic: "Kỹ thuật cấp cứu và chuyển thương",
            content: "Nguyên tắc xử lí ban đầu khi gặp nạn nhân bị gãy xương kín là:",
            options: ["A. Cố định tạm thời ổ gãy trước khi vận chuyển, không được nắn bóp", "B. Nắn thẳng xương tại chỗ", "C. Kéo mạnh chi bị gãy", "D. Cho nạn nhân đi lại ngay"],
            correct: "A",
            explanation: "Cần bất động tạm thời ổ gãy bằng nẹp chuyên dụng qua 2 khớp lân cận để tránh tổn thương thêm mạch máu, thần kinh."
        },
        {
            id: "mil10_extra_5",
            subject: "GDQP&AN",
            grade: "10",
            period: "final2",
            topic: "Đội ngũ từng người",
            content: "Khi thực hiện động tác 'Nghiêm', hai gót chân đặt như thế nào?",
            options: ["A. Hai gót chân sát nhau, hai mũi chân mở rộng một góc khoảng 45 độ", "B. Hai chân dang rộng bằng vai", "C. Hai bàn chân song song nhau", "D. Chân trước chân sau"],
            correct: "A",
            explanation: "Tư thế nghiêm chuẩn theo Điều lệnh: Hai gót chân sát nhau trên một đường thẳng, hai bàn chân mở hình chữ V một góc khoảng 45 độ."
        },
        {
            id: "mil10_t1_q3",
            subject: "GDQP&AN",
            grade: "10",
            period: "mid1",
            topic: "Truyền thống đánh giặc giữ nước của dân tộc",
            content: "Cuộc kháng chiến chống quân xâm lược Tống lần thứ hai (1075 - 1077) gắn liền với danh tướng nào?",
            options: ["A. Lý Thường Kiệt", "B. Trần Hưng Đạo", "C. Quang Trung", "D. Lê Lợi"],
            correct: "A",
            explanation: "Lý Thường Kiệt lãnh đạo cuộc kháng chiến chống Tống oanh liệt bên phòng tuyến sông Như Nguyệt cùng bài thơ thần Nam quốc sơn hà."
        },
        {
            id: "mil10_t2_q3",
            subject: "GDQP&AN",
            grade: "10",
            period: "final1",
            topic: "Lịch sử & Nghệ thuật quân sự",
            content: "Phương châm tác chiến nổi tiếng 'Lấy đoản binh chế trường trận, dĩ nhu thắng cương' là của ai?",
            options: ["A. Trần Hưng Đạo", "B. Ngô Quyền", "C. Đinh Bộ Lĩnh", "D. Nguyễn Trãi"],
            correct: "A",
            explanation: "Quốc công Tiết chế Trần Hưng Đạo đúc kết nghệ thuật đánh giặc: Dùng thế nhỏ đánh thế lớn, lấy binh ngắn chế trận dài."
        },
        {
            id: "mil10_t3_q3",
            subject: "GDQP&AN",
            grade: "10",
            period: "mid2",
            topic: "Xây dựng lực lượng vũ trang nhân dân",
            content: "Lực lượng vũ trang nhân dân Việt Nam gồm những thành phần nào?",
            options: ["A. Quân đội nhân dân, Công an nhân dân và Dân quân tự vệ", "B. Chỉ quân đội chính quy", "C. Chỉ lực lượng cảnh sát", "D. Lực lượng dân phòng tự phát"],
            correct: "A",
            explanation: "Luật Quốc phòng quy định ba thứ quân nòng cốt: Quân đội nhân dân, Công an nhân dân và Dân quân tự vệ."
        },
        {
            id: "mil10_t4_q3",
            subject: "GDQP&AN",
            grade: "10",
            period: "final2",
            topic: "Bảo vệ chủ quyền lãnh thổ & Biên giới",
            content: "Đường biên giới quốc gia trên biển của nước ta là ranh giới ngoài của vùng biển nào?",
            options: ["A. Lãnh hải (rộng 12 hải lý tính từ đường cơ sở)", "B. Nội thủy", "C. Vùng tiếp giáp lãnh hải", "D. Vùng đặc quyền kinh tế"],
            correct: "A",
            explanation: "Ranh giới ngoài của lãnh hải (cách đường cơ sở 12 hải lí) chính là đường biên giới quốc gia trên biển của Việt Nam."
        },
        {
            id: "mil10_t5_q3",
            subject: "GDQP&AN",
            grade: "10",
            period: "final2",
            topic: "Kỹ thuật cấp cứu & Băng bó vết thương",
            content: "Khi garo cầm máu động mạch ở chi, cứ sau khoảng thời gian bao lâu bắt buộc phải nới garo một lần?",
            options: ["A. 45 đến 60 phút", "B. 3 đến 4 tiếng", "C. 10 phút", "D. Không được phép nới garo"],
            correct: "A",
            explanation: "Phải nới garo từ 1-2 phút sau mỗi 45 - 60 phút để máu lưu thông nuôi dưỡng đoạn chi phía dưới, tránh hoại tử mô."
        },
        {
            id: "qp10_m1_extra1",
            subject: "GDQP&AN",
            grade: "10",
            period: "mid1",
            topic: "Truyền thống đánh giặc giữ nước của dân tộc",
            content: "Nghệ thuật quân sự đánh giặc lấy ít địch nhiều của tổ tiên ta thể hiện sâu sắc qua tư tưởng:",
            options: ["A. Lấy đoản binh thắng trường trận, dĩ nhu khắc cương", "B. Dựa hoàn toàn vào viện trợ bên ngoài", "C. Xây thành lũy phòng thủ thụ động", "D. Chỉ chiến đấu vào ban ngày"],
            correct: "A",
            explanation: "Tổ tiên ta luôn mưu trí, phát huy sở trường đoản binh đánh trường trận, đoàn kết toàn dân để chiến thắng giặc mạnh."
        },
        {
            id: "qp10_f1_extra1",
            subject: "GDQP&AN",
            grade: "10",
            period: "final1",
            topic: "Lịch sử & Nghệ thuật quân sự",
            content: "Ba lần chiến thắng quân xâm lược Mông - Nguyên vào thế kỷ XIII diễn ra dưới triều đại nào?",
            options: ["A. Triều nhà Trần", "B. Triều nhà Lý", "C. Triều nhà Lê", "D. Triều nhà Nguyễn"],
            correct: "A",
            explanation: "Triều đại nhà Trần với hào khí Đông A đã ba lần lãnh đạo toàn dân đập tan giặc Mông - Nguyên xâm lược."
        },
        {
            id: "qp10_f2_extra1",
            subject: "GDQP&AN",
            grade: "10",
            period: "final2",
            topic: "Kỹ thuật cấp cứu & Băng bó vết thương",
            content: "Khi băng bó vết thương hở đang chảy máu mao mạch hoặc tĩnh mạch nhỏ, biện pháp sơ cứu đầu tiên là:",
            options: ["A. Băng ép cầm máu và đặt nạn nhân nằm nghỉ ngơi", "B. Rửa vết thương bằng nước sôi", "C. Garô chặt mạch máu lớn", "D. Đắp bùn đất lên miệng vết thương"],
            correct: "A",
            explanation: "Băng ép là biện pháp nhanh chóng và hiệu quả nhất cầm máu mao mạch và tĩnh mạch nhỏ."
        },
    ],
};

const BUILTIN_EXAM_BANK_11 = {
    "Toán": [
        {
            id: "m11_trig_1",
            subject: "Toán",
            grade: "11",
            period: "mid1",
            topic: "Hàm số lượng giác & Phương trình lượng giác",
            content: "Tập xác định D của hàm số y = tan(x) là:",
            options: ["A. D = ℝ \\ {π/2 + kπ, k ∈ ℤ}", "B. D = ℝ \\ {kπ, k ∈ ℤ}", "C. D = ℝ", "D. D = ℝ \\ {π/2 + k2π, k ∈ ℤ}"],
            correct: "A",
            explanation: "Hàm số y = tan(x) = sin(x)/cos(x) xác định khi cos(x) ≠ 0 ⇔ x ≠ π/2 + kπ (k ∈ ℤ)."
        },
        {
            id: "m11_trig_2",
            subject: "Toán",
            grade: "11",
            period: "mid1",
            topic: "Hàm số lượng giác & Phương trình lượng giác",
            content: "Trong các hàm số sau, hàm số nào là hàm số chẵn trên tập xác định của nó?",
            options: ["A. y = cos(x)", "B. y = sin(x)", "C. y = tan(x)", "D. y = cot(x)"],
            correct: "A",
            explanation: "Với mọi x ∈ ℝ, ta có cos(-x) = cos(x) nên y = cos(x) là hàm số chẵn. Các hàm số sin(x), tan(x), cot(x) đều là hàm số lẻ."
        },
        {
            id: "m11_trig_3",
            subject: "Toán",
            grade: "11",
            period: "mid1",
            topic: "Hàm số lượng giác & Phương trình lượng giác",
            content: "Tập giá trị của hàm số y = 3sin(x) - 2 là đoạn nào sau đây?",
            options: ["A. [-5; 1]", "B. [-1; 5]", "C. [-3; 3]", "D. [-2; 3]"],
            correct: "A",
            explanation: "Vì -1 ≤ sin(x) ≤ 1 nên -3 ≤ 3sin(x) ≤ 3 ⇒ -5 ≤ 3sin(x) - 2 ≤ 1. Vậy tập giá trị là đoạn [-5; 1]."
        },
        {
            id: "m11_trig_4",
            subject: "Toán",
            grade: "11",
            period: "mid1",
            topic: "Hàm số lượng giác & Phương trình lượng giác",
            content: "Nghiệm của phương trình lượng giác cơ bản sin(x) = 1 là:",
            options: ["A. x = π/2 + k2π (k ∈ ℤ)", "B. x = π/2 + kπ (k ∈ ℤ)", "C. x = k2π (k ∈ ℤ)", "D. x = π + k2π (k ∈ ℤ)"],
            correct: "A",
            explanation: "Điểm có tung độ bằng 1 trên đường tròn lượng giác là điểm cực bắc (0; 1), tương ứng họ góc x = π/2 + k2π (k ∈ ℤ)."
        },
        {
            id: "m11_trig_5",
            subject: "Toán",
            grade: "11",
            period: "mid1",
            topic: "Hàm số lượng giác & Phương trình lượng giác",
            content: "Chu kỳ tuần hoàn của hàm số y = cos(2x) là:",
            options: ["A. T = π", "B. T = 2π", "C. T = π/2", "D. T = 4π"],
            correct: "A",
            explanation: "Hàm số y = cos(ωx) có chu kỳ tuần hoàn T = 2π / |ω|. Ở đây ω = 2 nên T = 2π / 2 = π."
        },
        {
            id: "m11_trig_6",
            subject: "Toán",
            grade: "11",
            period: "mid1",
            topic: "Hàm số lượng giác & Phương trình lượng giác",
            content: "Nghiệm của phương trình cos(x) = 0 là:",
            options: ["A. x = π/2 + kπ (k ∈ ℤ)", "B. x = kπ (k ∈ ℤ)", "C. x = π + k2π (k ∈ ℤ)", "D. x = k2π (k ∈ ℤ)"],
            correct: "A",
            explanation: "cos(x) = 0 tại hai điểm giao với trục tung trên đường tròn lượng giác: x = π/2 + kπ (k ∈ ℤ)."
        },
        {
            id: "m11_trig_7",
            subject: "Toán",
            grade: "11",
            period: "mid1",
            topic: "Hàm số lượng giác & Phương trình lượng giác",
            content: "Tập xác định D của hàm số y = cot(x) là:",
            options: ["A. D = ℝ \\ {kπ, k ∈ ℤ}", "B. D = ℝ \\ {π/2 + kπ, k ∈ ℤ}", "C. D = ℝ", "D. D = ℝ \\ {k2π, k ∈ ℤ}"],
            correct: "A",
            explanation: "Hàm số y = cot(x) = cos(x)/sin(x) xác định khi sin(x) ≠ 0 ⇔ x ≠ kπ (k ∈ ℤ)."
        },
        {
            id: "m11_trig_8",
            subject: "Toán",
            grade: "11",
            period: "mid1",
            topic: "Hàm số lượng giác & Phương trình lượng giác",
            content: "Nghiệm của phương trình tan(x) = √3 là:",
            options: ["A. x = π/3 + kπ (k ∈ ℤ)", "B. x = π/6 + kπ (k ∈ ℤ)", "C. x = π/3 + k2π (k ∈ ℤ)", "D. x = -π/3 + kπ (k ∈ ℤ)"],
            correct: "A",
            explanation: "tan(x) = √3 = tan(π/3) ⇔ x = π/3 + kπ (k ∈ ℤ)."
        },
        {
            id: "m11_seq_1",
            subject: "Toán",
            grade: "11",
            period: "final1",
            topic: "Dãy số, Cấp số cộng & Cấp số nhân",
            content: "Cho cấp số cộng (u_n) có số hạng đầu u₁ = 3 và công sai d = 4. Số hạng thứ 5 của cấp số cộng là:",
            options: ["A. u₅ = 19", "B. u₅ = 23", "C. u₅ = 15", "D. u₅ = 27"],
            correct: "A",
            explanation: "Công thức số hạng tổng quát cấp số cộng: u_n = u₁ + (n - 1)d. Thay n = 5: u₅ = 3 + 4 × 4 = 19."
        },
        {
            id: "m11_seq_2",
            subject: "Toán",
            grade: "11",
            period: "final1",
            topic: "Dãy số, Cấp số cộng & Cấp số nhân",
            content: "Cho cấp số nhân (u_n) có u₁ = 2 và công bội q = 3. Số hạng thứ 4 của cấp số nhân là:",
            options: ["A. u₄ = 54", "B. u₄ = 162", "C. u₄ = 18", "D. u₄ = 48"],
            correct: "A",
            explanation: "Công thức số hạng tổng quát cấp số nhân: u_n = u₁ × q^(n - 1). Với n = 4: u₄ = 2 × 3³ = 2 × 27 = 54."
        },
        {
            id: "m11_seq_3",
            subject: "Toán",
            grade: "11",
            period: "final1",
            topic: "Dãy số, Cấp số cộng & Cấp số nhân",
            content: "Cho cấp số cộng (u_n) có u₁ = 1 và u₂ = 4. Tổng của 10 số hạng đầu tiên S₁₀ bằng:",
            options: ["A. 145", "B. 150", "C. 135", "D. 290"],
            correct: "A",
            explanation: "Công sai d = u₂ - u₁ = 4 - 1 = 3. Tổng n số hạng đầu: S_n = n/2 × [2u₁ + (n - 1)d]. Với n = 10: S₁₀ = 5 × [2(1) + 9(3)] = 5 × 29 = 145."
        },
        {
            id: "m11_seq_4",
            subject: "Toán",
            grade: "11",
            period: "final1",
            topic: "Dãy số, Cấp số cộng & Cấp số nhân",
            content: "Tổng của cấp số nhân lùi vô hạn có u₁ = 1 và công bội q = 1/2 là:",
            options: ["A. S = 2", "B. S = 3/2", "C. S = 1", "D. S = 4"],
            correct: "A",
            explanation: "Tổng cấp số nhân lùi vô hạn (|q| < 1): S = u₁ / (1 - q) = 1 / (1 - 1/2) = 2."
        },
        {
            id: "m11_seq_5",
            subject: "Toán",
            grade: "11",
            period: "final1",
            topic: "Dãy số, Cấp số cộng & Cấp số nhân",
            content: "Ba số a, b, c theo thứ tự lập thành một cấp số cộng khi và chỉ khi:",
            options: ["A. a + c = 2b", "B. a × c = b²", "C. a + b = 2c", "D. a - c = 2b"],
            correct: "A",
            explanation: "Tính chất cấp số cộng: b - a = c - b ⇔ a + c = 2b."
        },
        {
            id: "m11_seq_6",
            subject: "Toán",
            grade: "11",
            period: "final1",
            topic: "Dãy số, Cấp số cộng & Cấp số nhân",
            content: "Dãy số (u_n) cho bởi u_n = 2n + 1 là một cấp số cộng với công sai d bằng:",
            options: ["A. d = 2", "B. d = 1", "C. d = 3", "D. d = 4"],
            correct: "A",
            explanation: "u_{n+1} - u_n = [2(n + 1) + 1] - [2n + 1] = 2. Vậy dãy số là cấp số cộng có công sai d = 2."
        },
        {
            id: "m11_lim_1",
            subject: "Toán",
            grade: "11",
            period: "mid2",
            topic: "Giới hạn & Hàm số liên tục",
            content: "Giới hạn lim (2n + 3)/(n - 1) bằng:",
            options: ["A. 2", "B. 3", "C. -3", "D. +∞"],
            correct: "A",
            explanation: "Chia cả tử và mẫu cho n bậc cao nhất: lim (2 + 3/n)/(1 - 1/n) = 2/1 = 2."
        },
        {
            id: "m11_lim_2",
            subject: "Toán",
            grade: "11",
            period: "mid2",
            topic: "Giới hạn & Hàm số liên tục",
            content: "Giới hạn lim_{x → 2} (x² - 4)/(x - 2) bằng:",
            options: ["A. 4", "B. 2", "C. 0", "D. 1"],
            correct: "A",
            explanation: "Khử dạng vô định 0/0: lim_{x → 2} [(x - 2)(x + 2)] / (x - 2) = lim_{x → 2} (x + 2) = 4."
        },
        {
            id: "m11_lim_3",
            subject: "Toán",
            grade: "11",
            period: "mid2",
            topic: "Giới hạn & Hàm số liên tục",
            content: "Hàm số y = f(x) được gọi là liên tục tại điểm x₀ nếu thỏa mãn điều kiện nào sau đây?",
            options: ["A. lim_{x → x₀} f(x) = f(x₀)", "B. lim_{x → x₀} f(x) tồn tại nhưng khác f(x₀)", "C. f(x₀) không xác định", "D. lim_{x → x₀⁺} f(x) ≠ lim_{x → x₀⁻} f(x)"],
            correct: "A",
            explanation: "Theo định nghĩa, hàm số y = f(x) liên tục tại x₀ khi và chỉ khi lim_{x → x₀} f(x) = f(x₀)."
        },
        {
            id: "m11_lim_4",
            subject: "Toán",
            grade: "11",
            period: "mid2",
            topic: "Giới hạn & Hàm số liên tục",
            content: "Giới hạn lim (1/3)^n khi n tiến tới +∞ bằng:",
            options: ["A. 0", "B. 1", "C. +∞", "D. 1/3"],
            correct: "A",
            explanation: "Vì |q| = 1/3 < 1 nên theo tính chất giới hạn dãy số: lim q^n = 0."
        },
        {
            id: "m11_lim_5",
            subject: "Toán",
            grade: "11",
            period: "mid2",
            topic: "Giới hạn & Hàm số liên tục",
            content: "Giới hạn lim_{x → +∞} (3x² - x + 1)/(2x² + 5) bằng:",
            options: ["A. 3/2", "B. 3", "C. 0", "D. +∞"],
            correct: "A",
            explanation: "Tử và mẫu cùng bậc 2, chia cả tử và mẫu cho x²: kết quả là tỉ số hệ số bậc cao nhất 3/2."
        },
        {
            id: "m11_geo_1",
            subject: "Toán",
            grade: "11",
            period: "mid1",
            topic: "Đường thẳng & Mặt phẳng trong không gian",
            content: "Trong không gian, qua ba điểm phân biệt không thẳng hàng ta xác định được bao nhiêu mặt phẳng?",
            options: ["A. Duy nhất 1 mặt phẳng", "B. 2 mặt phẳng", "C. Vô số mặt phẳng", "D. 3 mặt phẳng"],
            correct: "A",
            explanation: "Tính chất thừa nhận cơ bản của hình học không gian: Có một và chỉ một mặt phẳng đi qua ba điểm không thẳng hàng."
        },
        {
            id: "m11_geo_2",
            subject: "Toán",
            grade: "11",
            period: "final1",
            topic: "Đường thẳng & Mặt phẳng trong không gian",
            content: "Hai đường thẳng không có điểm chung và không cùng nằm trên bất kỳ một mặt phẳng nào được gọi là hai đường thẳng:",
            options: ["A. Chéo nhau", "B. Song song", "C. Trùng nhau", "D. Cắt nhau"],
            correct: "A",
            explanation: "Định nghĩa: Hai đường thẳng chéo nhau là hai đường thẳng không đồng phẳng và không có điểm chung."
        },
        {
            id: "m11_geo_3",
            subject: "Toán",
            grade: "11",
            period: "final1",
            topic: "Đường thẳng & Mặt phẳng trong không gian",
            content: "Cho đường thẳng d không nằm trong mặt phẳng (α) và d song song với một đường thẳng a nằm trong (α). Khi đó:",
            options: ["A. d song song với (α)", "B. d cắt (α)", "C. d vuông góc với (α)", "D. d nằm trong (α)"],
            correct: "A",
            explanation: "Dấu hiệu nhận biết đường thẳng song song với mặt phẳng: Nếu d ⊄ (α) và d // a (với a ⊂ (α)) thì d // (α)."
        },
        {
            id: "m11_geo_4",
            subject: "Toán",
            grade: "11",
            period: "final1",
            topic: "Đường thẳng & Mặt phẳng trong không gian",
            content: "Cho hình chóp S.ABCD có đáy ABCD là hình bình hành. Giao tuyến của hai mặt phẳng (SAB) và (SCD) là đường thẳng:",
            options: ["A. Đi qua S và song song với AB và CD", "B. Đường thẳng SO (với O là tâm ABCD)", "C. Đi qua S và vuông góc với mặt đáy", "D. Trùng với đường thẳng AB"],
            correct: "A",
            explanation: "Hai mặt phẳng (SAB) và (SCD) có điểm chung S và lần lượt chứa hai đường thẳng song song AB // CD, nên giao tuyến của chúng là đường thẳng d qua S và song song với AB, CD."
        },
        {
            id: "m11_geo_5",
            subject: "Toán",
            grade: "11",
            period: "mid1",
            topic: "Đường thẳng & Mặt phẳng trong không gian",
            content: "Hình chóp tứ giác S.ABCD có đáy là tứ giác lồi. Số mặt của hình chóp tứ giác là:",
            options: ["A. 5 mặt", "B. 4 mặt", "C. 6 mặt", "D. 8 mặt"],
            correct: "A",
            explanation: "Hình chóp tứ giác gồm 1 mặt đáy tứ giác và 4 mặt bên tam giác, tổng cộng có 5 mặt (và 5 đỉnh, 8 cạnh)."
        },
        {
            id: "m11_der_1",
            subject: "Toán",
            grade: "11",
            period: "final2",
            topic: "Đạo hàm & Tiếp tuyến",
            content: "Đạo hàm của hàm số y = x³ - 3x + 2 là:",
            options: ["A. y' = 3x² - 3", "B. y' = 3x² + 3", "C. y' = 3x² - 3x", "D. y' = x² - 3"],
            correct: "A",
            explanation: "Quy tắc tính đạo hàm cơ bản: (x³)' = 3x², (-3x)' = -3, (2)' = 0 ⇒ y' = 3x² - 3."
        },
        {
            id: "m11_der_2",
            subject: "Toán",
            grade: "11",
            period: "final2",
            topic: "Đạo hàm & Tiếp tuyến",
            content: "Hệ số góc k của tiếp tuyến của đồ thị hàm số y = f(x) tại điểm M(x₀; y₀) là:",
            options: ["A. k = f'(x₀)", "B. k = f(x₀)", "C. k = -f'(x₀)", "D. k = 1 / f'(x₀)"],
            correct: "A",
            explanation: "Ý nghĩa hình học của đạo hàm: Hệ số góc của tiếp tuyến của đồ thị hàm số y = f(x) tại điểm có hoành độ x₀ chính là đạo hàm f'(x₀)."
        },
        {
            id: "m11_der_3",
            subject: "Toán",
            grade: "11",
            period: "final2",
            topic: "Đạo hàm & Tiếp tuyến",
            content: "Đạo hàm của hàm số lượng giác y = sin(2x) là:",
            options: ["A. y' = 2cos(2x)", "B. y' = cos(2x)", "C. y' = -2cos(2x)", "D. y' = -cos(2x)"],
            correct: "A",
            explanation: "Đạo hàm hàm hợp: [sin(u)]' = u' × cos(u). Ở đây u = 2x ⇒ u' = 2 ⇒ y' = 2cos(2x)."
        },
        {
            id: "m11_der_4",
            subject: "Toán",
            grade: "11",
            period: "final2",
            topic: "Đạo hàm & Tiếp tuyến",
            content: "Phương trình tiếp tuyến của đồ thị hàm số y = x² tại điểm M(1; 1) là:",
            options: ["A. y = 2x - 1", "B. y = 2x + 1", "C. y = x", "D. y = 2x - 2"],
            correct: "A",
            explanation: "Ta có y' = 2x ⇒ y'(1) = 2. Phương trình tiếp tuyến: y - y₀ = f'(x₀)(x - x₀) ⇔ y - 1 = 2(x - 1) ⇔ y = 2x - 1."
        },
        {
            id: "m11_der_5",
            subject: "Toán",
            grade: "11",
            period: "final2",
            topic: "Đạo hàm & Tiếp tuyến",
            content: "Đạo hàm của tích hai hàm số (u × v)' được tính theo công thức:",
            options: ["A. u'v + uv'", "B. u'v - uv'", "C. u'v'", "D. u' + v'"],
            correct: "A",
            explanation: "Quy tắc tính đạo hàm của một tích: (u × v)' = u'v + uv'."
        },
        {
            id: "m11_trig_extra1",
            subject: "Toán",
            grade: "11",
            period: "mid1",
            topic: "Hàm số lượng giác & Phương trình lượng giác",
            content: "Giá trị nhỏ nhất của hàm số y = 2 - 3cos(x) trên ℝ bằng:",
            options: ["A. -1", "B. 5", "C. 2", "D. -5"],
            correct: "A",
            explanation: "Vì -1 ≤ cos(x) ≤ 1 nên -3 ≤ -3cos(x) ≤ 3 ⇒ -1 ≤ 2 - 3cos(x) ≤ 5. Vậy GTNN là -1 khi cos(x) = 1."
        },
        {
            id: "m11_trig_extra2",
            subject: "Toán",
            grade: "11",
            period: "mid1",
            topic: "Hàm số lượng giác & Phương trình lượng giác",
            content: "Phương trình lượng giác sin(x) = sin(α) có công thức nghiệm là:",
            options: ["A. x = α + k2π hoặc x = π - α + k2π (k ∈ ℤ)", "B. x = α + kπ hoặc x = -α + kπ (k ∈ ℤ)", "C. x = α + k2π hoặc x = -α + k2π (k ∈ ℤ)", "D. x = ±α + k2π (k ∈ ℤ)"],
            correct: "A",
            explanation: "Hai góc có cùng sin khi chúng bằng nhau hoặc bù nhau: x = α + k2π hoặc x = π - α + k2π."
        },
        {
            id: "m11_seq_extra1",
            subject: "Toán",
            grade: "11",
            period: "final1",
            topic: "Dãy số, Cấp số cộng & Cấp số nhân",
            content: "Cho cấp số nhân (u_n) có u₁ = -3 và công bội q = -2. Số hạng u₅ bằng:",
            options: ["A. -48", "B. 48", "C. -96", "D. 96"],
            correct: "A",
            explanation: "u₅ = u₁ × q⁴ = (-3) × (-2)⁴ = (-3) × 16 = -48."
        },
        {
            id: "m11_seq_extra2",
            subject: "Toán",
            grade: "11",
            period: "final1",
            topic: "Dãy số, Cấp số cộng & Cấp số nhân",
            content: "Một người gửi tiết kiệm 100 triệu đồng theo hình thức lãi kép với lãi suất 6%/năm. Số tiền cả gốc lẫn lãi sau 3 năm nhận được là (công thức cấp số nhân):",
            options: ["A. 100 × (1 + 0,06)³ triệu đồng", "B. 100 × (1 + 0,06 × 3) triệu đồng", "C. 100 × (0,06)³ triệu đồng", "D. 118 triệu đồng"],
            correct: "A",
            explanation: "Công thức lãi kép số tiền sau n năm: S_n = A × (1 + r)^n = 100 × (1 + 0,06)³ triệu đồng."
        },
        {
            id: "m11_lim_extra1",
            subject: "Toán",
            grade: "11",
            period: "mid2",
            topic: "Giới hạn & Hàm số liên tục",
            content: "Giới hạn lim_{x → 0} (√(1 + 2x) - 1) / x bằng:",
            options: ["A. 1", "B. 2", "C. 1/2", "D. 0"],
            correct: "A",
            explanation: "Nhân lượng liên hợp: lim_{x → 0} [ (1 + 2x) - 1 ] / [ x(√(1 + 2x) + 1) ] = lim 2 / (√(1 + 2x) + 1) = 2/2 = 1."
        },
        {
            id: "m11_geo_extra1",
            subject: "Toán",
            grade: "11",
            period: "final1",
            topic: "Đường thẳng & Mặt phẳng trong không gian",
            content: "Cho hình lăng trụ tam giác ABC.A'B'C'. Mặt phẳng (ABC) và mặt phẳng (A'B'C') là hai mặt phẳng:",
            options: ["A. Song song với nhau", "B. Vuông góc với nhau", "C. Cắt nhau", "D. Trùng nhau"],
            correct: "A",
            explanation: "Theo định nghĩa hình lăng trụ, hai đáy (ABC) và (A'B'C') là hai đa giác bằng nhau nằm trên hai mặt phẳng song song."
        },
        {
            id: "m11_der_extra1",
            subject: "Toán",
            grade: "11",
            period: "final2",
            topic: "Đạo hàm & Tiếp tuyến",
            content: "Đạo hàm của hàm số y = 1 / x (với x ≠ 0) là:",
            options: ["A. y' = -1 / x²", "B. y' = 1 / x²", "C. y' = ln|x|", "D. y' = -1 / x"],
            correct: "A",
            explanation: "Công thức đạo hàm cơ bản: (1/x)' = -1 / x²."
        },
        {
            id: "m11_der_extra2",
            subject: "Toán",
            grade: "11",
            period: "final2",
            topic: "Đạo hàm & Tiếp tuyến",
            content: "Một vật chuyển động thẳng có phương trình quãng đường s(t) = 2t³ - 3t² + 5 (s tính bằng mét, t tính bằng giây). Vận tốc tức thời của vật tại thời điểm t = 2 giây là:",
            options: ["A. v(2) = 12 m/s", "B. v(2) = 18 m/s", "C. v(2) = 24 m/s", "D. v(2) = 6 m/s"],
            correct: "A",
            explanation: "Ý nghĩa cơ học của đạo hàm: v(t) = s'(t) = 6t² - 6t. Tại t = 2: v(2) = 6(2)² - 6(2) = 24 - 12 = 12 m/s."
        },
        {
            id: "toan11_m1_13",
            subject: "Toán",
            grade: "11",
            period: "mid1",
            topic: "Hàm số lượng giác & Phương trình lượng giác",
            content: "Giá trị lớn nhất của hàm số y = 3sin(2x) - 1 là:",
            options: ["A. 2", "B. 3", "C. 4", "D. 1"],
            correct: "A",
            explanation: "Vì -1 <= sin(2x) <= 1 nên max(y) = 3(1) - 1 = 2."
        },
        {
            id: "toan11_f1_13",
            subject: "Toán",
            grade: "11",
            period: "final1",
            topic: "Dãy số, Cấp số cộng & Cấp số nhân",
            content: "Cho cấp số cộng (u_n) có u_1 = 3 và công sai d = 4. Số hạng u_5 bằng:",
            options: ["A. 19", "B. 15", "C. 23", "D. 20"],
            correct: "A",
            explanation: "u_5 = u_1 + 4d = 3 + 4*4 = 19."
        },
        {
            id: "toan11_f1_14",
            subject: "Toán",
            grade: "11",
            period: "final1",
            topic: "Giới hạn & Hàm số liên tục",
            content: "Giới hạn lim(x -> 2) của biểu thức (x^2 - 4)/(x - 2) bằng:",
            options: ["A. 4", "B. 2", "C. 0", "D. Vô cùng"],
            correct: "A",
            explanation: "(x^2 - 4)/(x - 2) = x + 2. Khi x tiến đến 2 thì giới hạn là 2 + 2 = 4."
        },
        {
            id: "toan11_m2_7",
            subject: "Toán",
            grade: "11",
            period: "mid2",
            topic: "Đường thẳng & Mặt phẳng trong không gian",
            content: "Hai đường thẳng phân biệt không có điểm chung và cùng nằm trong một mặt phẳng thì:",
            options: ["A. Song song với nhau", "B. Cắt nhau", "C. Chéo nhau", "D. Trùng nhau"],
            correct: "A",
            explanation: "Theo định nghĩa hình học không gian, hai đường thẳng đồng phẳng không có điểm chung là hai đường thẳng song song."
        },
        {
            id: "toan11_f2_8",
            subject: "Toán",
            grade: "11",
            period: "final2",
            topic: "Đạo hàm & Tiếp tuyến",
            content: "Đạo hàm của hàm số y = x^4 - 2x^2 + 1 tại điểm x = 1 bằng:",
            options: ["A. 0", "B. 2", "C. 4", "D. -2"],
            correct: "A",
            explanation: "y' = 4x^3 - 4x. Tại x = 1: y'(1) = 4(1)^3 - 4(1) = 0."
        },
    ],
    "Vật Lí": [
        {
            id: "p11_1",
            subject: "Vật Lí",
            grade: "11",
            period: "mid1",
            topic: "Dao động điều hòa",
            content: "Một vật dao động điều hòa có phương trình li độ x = A.cos(ωt + φ). Vận tốc v của vật có phương trình là:",
            options: ["A. v = -ωA.sin(ωt + φ)", "B. v = ωA.cos(ωt + φ)", "C. v = -ω²A.cos(ωt + φ)", "D. v = ωA.sin(ωt + φ)"],
            correct: "A",
            explanation: "Vận tốc là đạo hàm của li độ theo thời gian: v = x' = -ωA.sin(ωt + φ)."
        },
        {
            id: "p11_2",
            subject: "Vật Lí",
            grade: "11",
            period: "mid1",
            topic: "Dao động điều hòa",
            content: "Gia tốc a của chất điểm dao động điều hòa liên hệ với li độ x theo hệ thức nào sau đây?",
            options: ["A. a = -ω²x", "B. a = ω²x", "C. a = -ωx", "D. a = -ω²x²"],
            correct: "A",
            explanation: "Gia tốc là đạo hàm bậc hai của li độ: a = v' = -ω²A.cos(ωt + φ) = -ω²x."
        },
        {
            id: "p11_3",
            subject: "Vật Lí",
            grade: "11",
            period: "mid1",
            topic: "Dao động điều hòa",
            content: "Một con lắc lò xo có khối lượng m và độ cứng k. Chu kì dao động điều hòa T của con lắc là:",
            options: ["A. T = 2π√(m/k)", "B. T = 2π√(k/m)", "C. T = (1/2π)√(m/k)", "D. T = 2π√(g/l)"],
            correct: "A",
            explanation: "Tần số góc ω = √(k/m) ⇒ Chu kì T = 2π/ω = 2π√(m/k)."
        },
        {
            id: "p11_4",
            subject: "Vật Lí",
            grade: "11",
            period: "mid1",
            topic: "Dao động điều hòa",
            content: "Khi một chất điểm dao động điều hòa đi qua vị trí cân bằng thì:",
            options: ["A. Vận tốc có độ lớn cực đại, gia tốc bằng 0", "B. Vận tốc bằng 0, gia tốc có độ lớn cực đại", "C. Cả vận tốc và gia tốc đều đạt cực đại", "D. Cả vận tốc và gia tốc đều bằng 0"],
            correct: "A",
            explanation: "Tại VTCB x = 0: li độ bằng 0 nên gia tốc a = -ω²x = 0; tốc độ đạt giá trị cực đại v_max = ωA."
        },
        {
            id: "p11_5",
            subject: "Vật Lí",
            grade: "11",
            period: "final1",
            topic: "Sóng cơ & Giao thoa sóng",
            content: "Trong sóng dừng trên một sợi dây đàn hồi, khoảng cách giữa hai nút sóng liên tiếp bằng:",
            options: ["A. Một nửa bước sóng (λ/2)", "B. Một bước sóng (λ)", "C. Một phần tư bước sóng (λ/4)", "D. Hai bước sóng (2λ)"],
            correct: "A",
            explanation: "Trong sóng dừng, khoảng cách giữa hai nút sóng liên tiếp hoặc hai bụng sóng liên tiếp luôn bằng nửa bước sóng (λ/2)."
        },
        {
            id: "p11_6",
            subject: "Vật Lí",
            grade: "11",
            period: "final1",
            topic: "Sóng cơ & Giao thoa sóng",
            content: "Bước sóng λ là quãng đường mà sóng truyền đi được trong thời gian:",
            options: ["A. Đúng một chu kì dao động T", "B. Một nửa chu kì dao động", "C. Hai chu kì dao động", "D. Một giây"],
            correct: "A",
            explanation: "Định nghĩa bước sóng: λ = v.T = v/f là quãng đường sóng truyền đi trong 1 chu kì."
        },
        {
            id: "p11_7",
            subject: "Vật Lí",
            grade: "11",
            period: "final1",
            topic: "Sóng cơ & Giao thoa sóng",
            content: "Trong hiện tượng giao thoa sóng cơ của hai nguồn kết hợp cùng pha, những điểm dao động với biên độ cực đại có hiệu đường đi thỏa mãn:",
            options: ["A. d₂ - d₁ = kλ (với k ∈ ℤ)", "B. d₂ - d₁ = (k + 0,5)λ (với k ∈ ℤ)", "C. d₂ - d₁ = kλ/2", "D. d₂ - d₁ = (2k + 1)λ"],
            correct: "A",
            explanation: "Điều kiện cực đại giao thoa hai nguồn đồng pha: d₂ - d₁ = kλ (hiệu đường đi bằng số nguyên lần bước sóng)."
        },
        {
            id: "p11_8",
            subject: "Vật Lí",
            grade: "11",
            period: "mid2",
            topic: "Điện trường & Điện thế",
            content: "Cường độ điện trường E do một điện tích điểm Q đặt trong chân không gây ra tại điểm cách nó khoảng r được tính bằng:",
            options: ["A. E = k.|Q| / r²", "B. E = k.|Q| / r", "C. E = k.Q² / r²", "D. E = k.|Q| / (2r)"],
            correct: "A",
            explanation: "Công thức cường độ điện trường của điện tích điểm: E = k.|Q| / r² (với k = 9.10⁹ N.m²/C²)."
        },
        {
            id: "p11_9",
            subject: "Vật Lí",
            grade: "11",
            period: "mid2",
            topic: "Điện trường & Điện thế",
            content: "Công của lực điện trường tác dụng lên điện tích q khi dịch chuyển giữa hai điểm có hiệu điện thế U là:",
            options: ["A. A = q.U", "B. A = q / U", "C. A = U / q", "D. A = q.U²"],
            correct: "A",
            explanation: "Công của lực điện: A = q.U = q.E.d."
        },
        {
            id: "p11_10",
            subject: "Vật Lí",
            grade: "11",
            period: "final2",
            topic: "Dòng điện không đổi & Mạch điện",
            content: "Định luật Ohm cho toàn mạch kín chứa nguồn điện có suất điện động E và điện trở trong r là:",
            options: ["A. I = E / (R_N + r)", "B. I = E / R_N", "C. I = (E + r) / R_N", "D. I = E.R_N / r"],
            correct: "A",
            explanation: "Cường độ dòng điện trong mạch kín: I = E / (R_N + r)."
        },
        {
            id: "p11_11",
            subject: "Vật Lí",
            grade: "11",
            period: "final2",
            topic: "Khúc xạ ánh sáng",
            content: "Theo định luật khúc xạ ánh sáng, hệ thức liên hệ giữa góc tới i và góc khúc xạ r là:",
            options: ["A. n₁sin(i) = n₂sin(r)", "B. n₁cos(i) = n₂cos(r)", "C. n₁/sin(i) = n₂/sin(r)", "D. sin(i) = n.sin(r) luôn luôn"],
            correct: "A",
            explanation: "Định luật khúc xạ ánh sáng: n₁sin(i) = n₂sin(r)."
        },
        {
            id: "p11_osc_extra1",
            subject: "Vật Lí",
            grade: "11",
            period: "mid1",
            topic: "Dao động điều hòa",
            content: "Một con lắc đơn có chiều dài l dao động điều hòa tại nơi có gia tốc trọng trường g. Chu kì dao động T là:",
            options: ["A. T = 2π√(l/g)", "B. T = 2π√(g/l)", "C. T = (1/2π)√(l/g)", "D. T = 2π√(m/k)"],
            correct: "A",
            explanation: "Chu kì của con lắc đơn phụ thuộc chiều dài l và gia tốc trọng trường g: T = 2π√(l/g)."
        },
        {
            id: "p11_osc_extra2",
            subject: "Vật Lí",
            grade: "11",
            period: "mid1",
            topic: "Dao động điều hòa",
            content: "Lực kéo về (lực hồi phục) tác dụng lên vật dao động điều hòa luôn hướng về:",
            options: ["A. Vị trí cân bằng của vật", "B. Vị trí biên dương", "C. Vị trí biên âm", "D. Luôn cùng chiều với vận tốc"],
            correct: "A",
            explanation: "Lực kéo về F = -kx luôn hướng về vị trí cân bằng và có độ lớn tỉ lệ thuận với li độ."
        },
        {
            id: "p11_wav_extra1",
            subject: "Vật Lí",
            grade: "11",
            period: "final1",
            topic: "Sóng cơ & Giao thoa sóng",
            content: "Một sóng cơ truyền với tần số f = 50 Hz và bước sóng λ = 0,4 m. Vận tốc truyền sóng v bằng:",
            options: ["A. v = 20 m/s", "B. v = 125 m/s", "C. v = 50,4 m/s", "D. v = 2 m/s"],
            correct: "A",
            explanation: "Vận tốc truyền sóng: v = λ.f = 0,4 × 50 = 20 m/s."
        },
        {
            id: "p11_elec_extra1",
            subject: "Vật Lí",
            grade: "11",
            period: "mid2",
            topic: "Điện trường & Điện thế",
            content: "Đặc điểm cơ bản của điện trường đều là:",
            options: ["A. Véctơ cường độ điện trường tại mọi điểm có cùng hướng và cùng độ lớn, đường sức là các đường thẳng song song cách đều", "B. Cường độ điện trường giảm dần theo khoảng cách", "C. Đường sức điện là các đường tròn đồng tâm", "D. Chỉ tồn tại xung quanh điện tích điểm hình cầu"],
            correct: "A",
            explanation: "Điện trường đều (như giữa 2 bản kim loại phẳng song song tích điện trái dấu) có E không đổi về hướng và độ lớn tại mọi điểm."
        },
        {
            id: "p11_cir_extra1",
            subject: "Vật Lí",
            grade: "11",
            period: "final2",
            topic: "Dòng điện không đổi & Mạch điện",
            content: "Điện năng tiêu thụ của đoạn mạch trong thời gian t được tính bằng công thức:",
            options: ["A. A = U.I.t", "B. A = U.I / t", "C. A = U².I.t", "D. A = R.I.t"],
            correct: "A",
            explanation: "Điện năng tiêu thụ của đoạn mạch: A = P.t = U.I.t (Jun hoặc kWh)."
        },
        {
            id: "p11_opt_extra1",
            subject: "Vật Lí",
            grade: "11",
            period: "final2",
            topic: "Khúc xạ ánh sáng",
            content: "Hiện tượng cầu vồng xuất hiện sau cơn mưa là ứng dụng tự nhiên của hiện tượng:",
            options: ["A. Tán sắc và phản xạ ánh sáng qua các giọt nước mưa", "B. Nhiễu xạ ánh sáng", "C. Phóng xạ hạt nhân", "D. Giao thoa sóng âm"],
            correct: "A",
            explanation: "Các giọt nước mưa li ti đóng vai trò như các lăng kính làm tán sắc ánh sáng mặt trời thành dải 7 sắc cầu vồng."
        },
        {
            id: "phy11_mid1_bulk1",
            subject: "Vật Lí",
            grade: "11",
            period: "mid1",
            topic: "Dao động điều hòa",
            content: "Vận tốc trong dao động điều hòa biến thiên như thế nào so với li độ?",
            options: ["A. Sớm pha π/2 so với li độ", "B. Cùng pha với li độ", "C. Ngược pha với li độ", "D. Trễ pha π/2 so với li độ"],
            correct: "A",
            explanation: "Phương trình vận tốc v = -ωA sin(ωt + φ) = ωA cos(ωt + φ + π/2), sớm pha π/2 so với x."
        },
        {
            id: "phy11_mid1_bulk2",
            subject: "Vật Lí",
            grade: "11",
            period: "mid1",
            topic: "Dao động điều hòa",
            content: "Gia tốc trong dao động điều hòa biến thiên như thế nào so với li độ?",
            options: ["A. Ngược pha (lệch pha π) so với li độ", "B. Cùng pha với li độ", "C. Sớm pha π/2", "D. Trễ pha π/4"],
            correct: "A",
            explanation: "Phương trình gia tốc a = -ω²x, luôn hướng về vị trí cân bằng và ngược pha với li độ."
        },
        {
            id: "phy11_fin1_bulk1",
            subject: "Vật Lí",
            grade: "11",
            period: "final1",
            topic: "Sóng cơ & Giao thoa sóng",
            content: "Bước sóng λ là quãng đường sóng truyền được trong thời gian:",
            options: ["A. Một chu kì dao động T", "B. Nửa chu kì T/2", "C. Một giây", "D. Bốn chu kì"],
            correct: "A",
            explanation: "Định nghĩa bước sóng: λ = v.T = v / f là khoảng cách giữa 2 điểm gần nhất trên cùng phương truyền sóng dao động cùng pha."
        },
        {
            id: "phy11_mid2_bulk1",
            subject: "Vật Lí",
            grade: "11",
            period: "mid2",
            topic: "Điện trường & Điện thế",
            content: "Cường độ điện trường E do điện tích điểm Q gây ra tại khoảng cách r trong chân không tỉ lệ nghịch với:",
            options: ["A. Bình phương khoảng cách r²", "B. Khoảng cách r", "C. Căn bậc hai của r", "D. Độ lớn điện tích Q"],
            correct: "A",
            explanation: "Công thức độ lớn cường độ điện trường: E = k.|Q| / r²."
        },
        {
            id: "phy11_fin2_bulk1",
            subject: "Vật Lí",
            grade: "11",
            period: "final2",
            topic: "Dòng điện không đổi & Mạch điện",
            content: "Định luật Ohm cho toàn mạch kín chứa nguồn điện (E, r) và điện trở ngoài R có biểu thức là:",
            options: ["A. I = E / (R + r)", "B. I = E / R", "C. I = E . (R + r)", "D. I = (R + r) / E"],
            correct: "A",
            explanation: "Cường độ dòng điện chạy trong mạch kín tỉ lệ thuận với suất điện động của nguồn và tỉ lệ nghịch với điện trở toàn phần: I = E / (R + r)."
        },
        {
            id: "ly11_m1_9",
            subject: "Vật Lí",
            grade: "11",
            period: "mid1",
            topic: "Dao động điều hòa",
            content: "Một vật dao động điều hòa với phương trình x = 6cos(4πt + π/3) (cm). Biên độ dao động của vật là:",
            options: ["A. 6 cm", "B. 4π cm", "C. 3 cm", "D. 12 cm"],
            correct: "A",
            explanation: "Biên độ dao động là A = 6 cm."
        },
        {
            id: "ly11_m1_10",
            subject: "Vật Lí",
            grade: "11",
            period: "mid1",
            topic: "Dao động điều hòa",
            content: "Gia tốc trong dao động điều hòa biến thiên:",
            options: ["A. Ngược pha với li độ", "B. Cùng pha với li độ", "C. Sớm pha π/2 so với li độ", "D. Vuông pha với vận tốc"],
            correct: "A",
            explanation: "Công thức a = -ω^2 x cho thấy gia tốc luôn ngược pha với li độ x."
        },
        {
            id: "ly11_f1_6",
            subject: "Vật Lí",
            grade: "11",
            period: "final1",
            topic: "Sóng cơ & Giao thoa sóng",
            content: "Bước sóng λ là quãng đường sóng truyền đi được trong:",
            options: ["A. Một chu kì dao động T", "B. Một nửa chu kì", "C. Một giây", "D. Hai chu kì"],
            correct: "A",
            explanation: "Định nghĩa bước sóng: λ = v * T, là quãng đường sóng lan truyền trong một chu kì dao động."
        },
        {
            id: "ly11_f1_7",
            subject: "Vật Lí",
            grade: "11",
            period: "final1",
            topic: "Sóng cơ & Giao thoa sóng",
            content: "Điều kiện để hai sóng kết hợp giao thoa được với nhau là hai nguồn sóng phải có:",
            options: ["A. Cùng tần số và hiệu số pha không đổi theo thời gian", "B. Cùng biên độ nhưng khác tần số", "C. Cùng hướng chuyển động bất kì", "D. Cùng tốc độ truyền sóng"],
            correct: "A",
            explanation: "Hai nguồn kết hợp là hai nguồn dao động cùng tần số và có độ lệch pha không đổi theo thời gian."
        },
        {
            id: "ly11_m2_5",
            subject: "Vật Lí",
            grade: "11",
            period: "mid2",
            topic: "Điện trường & Điện thế",
            content: "Cường độ điện trường gây ra bởi điện tích điểm Q tại khoảng cách r trong chân không tỉ lệ:",
            options: ["A. Nghịch với bình phương khoảng cách r^2", "B. Thuận với khoảng cách r", "C. Nghịch với khoảng cách r", "D. Thuận với r^2"],
            correct: "A",
            explanation: "E = k * |Q| / r^2, tỉ lệ nghịch với bình phương khoảng cách r^2."
        },
        {
            id: "ly11_f2_6",
            subject: "Vật Lí",
            grade: "11",
            period: "final2",
            topic: "Dòng điện không đổi & Mạch điện",
            content: "Công thức định luật Ôm cho toàn mạch kín gồm nguồn (E, r) và điện trở mạch ngoài R là:",
            options: ["A. I = E / (R + r)", "B. I = E / R", "C. I = (R + r) / E", "D. I = E * (R + r)"],
            correct: "A",
            explanation: "Cường độ dòng điện toàn mạch I = E / (R + r)."
        },
        {
            id: "ly11_f2_7",
            subject: "Vật Lí",
            grade: "11",
            period: "final2",
            topic: "Khúc xạ ánh sáng",
            content: "Hiện tượng phản xạ toàn phần xảy ra khi ánh sáng truyền:",
            options: ["A. Từ môi trường chiết quang hơn sang môi trường chiết quang kém và góc tới i >= i_gh", "B. Từ môi trường chiết quang kém sang môi trường chiết quang hơn", "C. Ở bất kì góc tới nào trong nước", "D. Qua lăng kính trong suốt"],
            correct: "A",
            explanation: "Điều kiện có phản xạ toàn phần: n1 > n2 và góc tới i >= i_gh (với sin(i_gh) = n2/n1)."
        },
    ],
    "Hóa Học": [
        {
            id: "c11_1",
            subject: "Hóa Học",
            grade: "11",
            period: "mid1",
            topic: "Cân bằng hóa học & pH dung dịch",
            content: "Theo nguyên lí chuyển dịch cân bằng Le Chatelier, khi tăng nhiệt độ của hệ phản ứng thuận nghịch, cân bằng sẽ chuyển dịch theo chiều:",
            options: ["A. Chiều phản ứng thu nhiệt", "B. Chiều phản ứng tỏa nhiệt", "C. Không chuyển dịch", "D. Chiều tạo ra ít phân tử khí hơn"],
            correct: "A",
            explanation: "Nguyên lí Le Chatelier: Khi tăng nhiệt độ, hệ chuyển dịch theo chiều thu nhiệt (ΔH > 0) để hạ nhiệt độ."
        },
        {
            id: "c11_2",
            subject: "Hóa Học",
            grade: "11",
            period: "mid1",
            topic: "Cân bằng hóa học & pH dung dịch",
            content: "Ở 25°C, một dung dịch có nồng độ ion [H⁺] = 10⁻³ M. Độ pH của dung dịch này bằng bao nhiêu và môi trường là gì?",
            options: ["A. pH = 3, môi trường axit", "B. pH = 11, môi trường bazơ", "C. pH = 3, môi trường bazơ", "D. pH = 7, môi trường trung tính"],
            correct: "A",
            explanation: "pH = -log[H⁺] = -log(10⁻³) = 3. Vì pH < 7 nên dung dịch có môi trường axit."
        },
        {
            id: "c11_3",
            subject: "Hóa Học",
            grade: "11",
            period: "final1",
            topic: "Nitrogen & Sulfur",
            content: "Đơn chất nitrogen (N₂) tương đối trơ về mặt hóa học ở nhiệt độ thường là do:",
            options: ["A. Phân tử có liên kết ba N≡N rất bền vững với năng lượng liên kết lớn", "B. Nitrogen có độ âm điện nhỏ nhất trong nhóm", "C. Phân tử có bán kính quá lớn", "D. Nitrogen là chất khí không màu"],
            correct: "A",
            explanation: "Liên kết ba N≡N có năng lượng liên kết rất lớn (945 kJ/mol) nên phân tử N₂ khó bị phá vỡ ở điều kiện thường."
        },
        {
            id: "c11_4",
            subject: "Hóa Học",
            grade: "11",
            period: "final1",
            topic: "Nitrogen & Sulfur",
            content: "Dung dịch axit sunfuric đặc (H₂SO₄ đặc) có đặc tính nổi bật nào sau đây?",
            options: ["A. Tính háo nước mạnh và tính oxi hóa rất mạnh", "B. Tính khử mạnh và làm mất màu quỳ tím", "C. Tính dễ bay hơi ở nhiệt độ phòng", "D. Không tác dụng được với đồng kim loại (Cu)"],
            correct: "A",
            explanation: "H₂SO₄ đặc có tính háo nước mãnh liệt và S(+6) có tính oxi hóa mạnh oxi hóa được hầu hết kim loại."
        },
        {
            id: "c11_5",
            subject: "Hóa Học",
            grade: "11",
            period: "mid2",
            topic: "Đại cương hóa học hữu cơ",
            content: "Hiện tượng các chất có cùng công thức phân tử nhưng có cấu tạo hóa học khác nhau dẫn đến tính chất khác nhau gọi là:",
            options: ["A. Hiện tượng đồng phân", "B. Hiện tượng đồng đẳng", "C. Hiện tượng thù hình", "D. Hiện tượng cộng hóa trị"],
            correct: "A",
            explanation: "Đồng phân là các chất có cùng công thức phân tử nhưng khác nhau về trật tự liên kết hoặc cấu trúc không gian."
        },
        {
            id: "c11_6",
            subject: "Hóa Học",
            grade: "11",
            period: "final2",
            topic: "Hydrocarbon (Alkane, Alkene, Arene)",
            content: "Khí etilen (C₂H₄, alkene) làm mất màu dung dịch nào sau đây ở điều kiện thường nhờ phản ứng cộng vào liên kết đôi?",
            options: ["A. Dung dịch nước brom (Br₂)", "B. Dung dịch NaCl", "C. Dung dịch NaOH", "D. Nước vôi trong (Ca(OH)₂)"],
            correct: "A",
            explanation: "Etilen chứa liên kết đôi C=C kém bền dễ tham gia phản ứng cộng làm mất màu nâu đỏ của dung dịch brom."
        },
        {
            id: "c11_7",
            subject: "Hóa Học",
            grade: "11",
            period: "final2",
            topic: "Dẫn xuất Halogen, Alcohol & Phenol",
            content: "Phenol (C₆H₅OH) có phản ứng tạo kết tủa trắng đặc trưng với thuốc thử nào sau đây?",
            options: ["A. Nước brom (Br₂)", "B. Dung dịch HCl", "C. Dung dịch NaCl", "D. Quỳ tím ẩm"],
            correct: "A",
            explanation: "Phenol phản ứng thế với nước brom tạo kết tủa trắng 2,4,6-tribromophenol."
        },
        {
            id: "c11_equi_extra1",
            subject: "Hóa Học",
            grade: "11",
            period: "mid1",
            topic: "Cân bằng hóa học & pH dung dịch",
            content: "Biểu thức hằng số cân bằng nồng độ K_c của phản ứng: N₂(k) + 3H₂(k) ⇌ 2NH₃(k) là:",
            options: ["A. K_c = [NH₃]² / ([N₂].[H₂]³)", "B. K_c = ([N₂].[H₂]³) / [NH₃]²", "C. K_c = 2[NH₃] / ([N₂] + 3[H₂])", "D. K_c = [NH₃] / ([N₂].[H₂])"],
            correct: "A",
            explanation: "Theo định luật tác dụng khối lượng: K_c = [Sản phẩm]^(hệ số) / [Chất phản ứng]^(hệ số) = [NH₃]² / ([N₂].[H₂]³)."
        },
        {
            id: "c11_equi_extra2",
            subject: "Hóa Học",
            grade: "11",
            period: "mid1",
            topic: "Cân bằng hóa học & pH dung dịch",
            content: "Dung dịch nào sau đây có pH > 7 và làm quỳ tím chuyển sang màu xanh?",
            options: ["A. Dung dịch NaOH (natri hiđroxit)", "B. Dung dịch HCl", "C. Dung dịch NaCl", "D. Nước mưa thông thường"],
            correct: "A",
            explanation: "NaOH là bazơ mạnh phân li ra OH⁻ làm môi trường kiềm (pH > 7) và hóa xanh quỳ tím."
        },
        {
            id: "c11_ns_extra1",
            subject: "Hóa Học",
            grade: "11",
            period: "final1",
            topic: "Nitrogen & Sulfur",
            content: "Axit nitric (HNO₃) đặc, nóng tác dụng với kim loại đồng (Cu) sinh ra khí có màu nâu đỏ là:",
            options: ["A. Khí nitơ đioxit (NO₂)", "B. Khí nitơ oxit (NO, không màu)", "C. Khí amoniac (NH₃)", "D. Khí hiđro (H₂)"],
            correct: "A",
            explanation: "Cu + 4HNO₃(đặc) → Cu(NO₃)₂ + 2NO₂↑(nâu đỏ) + 2H₂O."
        },
        {
            id: "c11_hc_extra1",
            subject: "Hóa Học",
            grade: "11",
            period: "final2",
            topic: "Hydrocarbon (Alkane, Alkene, Arene)",
            content: "Khi chiếu sáng, khí metan (CH₄) phản ứng thế với khí clo (Cl₂) theo tỉ lệ mol 1:1 thu được sản phẩm hữu cơ là:",
            options: ["A. Metyl clorua (CH₃Cl)", "B. Điclometan (CH₂Cl₂)", "C. Clorofom (CHCl₃)", "D. Cacbon tetraclorua (CCl₄)"],
            correct: "A",
            explanation: "CH₄ + Cl₂ (ánh sáng) → CH₃Cl + HCl."
        },
        {
            id: "c11_alc_extra1",
            subject: "Hóa Học",
            grade: "11",
            period: "final2",
            topic: "Dẫn xuất Halogen, Alcohol & Phenol",
            content: "Chất nào sau đây phản ứng được với cả kim loại Na và dung dịch kiềm NaOH?",
            options: ["A. Phenol (C₆H₅OH)", "B. Ancol etylic (C₂H₅OH)", "C. Metan (CH₄)", "D. Benzen (C₆H₆)"],
            correct: "A",
            explanation: "Phenol có tính axit yếu phản ứng được với cả Na và dung dịch NaOH tạo muối phenolat: C₆H₅OH + NaOH → C₆H₅ONa + H₂O."
        },
        {
            id: "chem11_t1_q3",
            subject: "Hóa Học",
            grade: "11",
            period: "mid1",
            topic: "Cân bằng hóa học & pH dung dịch",
            content: "Dung dịch có nồng độ [H⁺] = 10⁻⁴ M có độ pH bằng bao nhiêu và môi trường gì?",
            options: ["A. pH = 4, môi trường acid", "B. pH = 4, môi trường base", "C. pH = 10, môi trường acid", "D. pH = 7, môi trường trung tính"],
            correct: "A",
            explanation: "pH = -log[H⁺] = -log(10⁻⁴) = 4 < 7 nên là môi trường acid."
        },
        {
            id: "chem11_t2_q3",
            subject: "Hóa Học",
            grade: "11",
            period: "final1",
            topic: "Nitrogen & Sulfur",
            content: "Khí nào sau đây có mùi khai đặc trưng, tan rất nhiều trong nước tạo dung dịch có tính base yếu?",
            options: ["A. Ammonia (NH₃)", "B. Sulfur dioxide (SO₂)", "C. Nitrogen monoxide (NO)", "D. Methane (CH₄)"],
            correct: "A",
            explanation: "NH₃ tan nhiều trong nước: NH₃ + H₂O ⇌ NH₄⁺ + OH⁻ làm quỳ tím hóa xanh."
        },
        {
            id: "chem11_t3_q3",
            subject: "Hóa Học",
            grade: "11",
            period: "mid2",
            topic: "Đại cương hóa học hữu cơ",
            content: "Hiện tượng các chất có cùng công thức phân tử nhưng có cấu tạo hóa học khác nhau dẫn đến tính chất khác nhau được gọi là:",
            options: ["A. Đồng phân", "B. Đồng đẳng", "C. Đồng vị", "D. Dị thể"],
            correct: "A",
            explanation: "Đồng phân (isomerism) là hiện tượng các hợp chất có cùng CTPT nhưng công thức cấu tạo khác nhau."
        },
        {
            id: "chem11_t4_q3",
            subject: "Hóa Học",
            grade: "11",
            period: "final2",
            topic: "Hydrocarbon (Alkane, Alkene, Arene)",
            content: "Khí ethylene (C₂H₄) làm mất màu dung dịch nào sau đây ở điều kiện thường?",
            options: ["A. Dung dịch nước Bromine (Br₂)", "B. Dung dịch NaCl", "C. Dung dịch NaOH", "D. Nước vôi trong Ca(OH)₂"],
            correct: "A",
            explanation: "Ethylene có liên kết đôi C=C kém bền nên dễ tham gia phản ứng cộng làm mất màu nước bromine."
        },
        {
            id: "chem11_t5_q3",
            subject: "Hóa Học",
            grade: "11",
            period: "final2",
            topic: "Dẫn xuất Halogen, Alcohol & Phenol",
            content: "Chất nào sau đây tác dụng được với cả kim loại Na và dung dịch NaOH?",
            options: ["A. Phenol (C₆H₅OH)", "B. Ethanol (C₂H₅OH)", "C. Glycerol", "D. Benzene"],
            correct: "A",
            explanation: "Phenol có vòng benzene hút e làm nguyên tử H trong nhóm -OH linh động hơn alcohol, có tính acid yếu tác dụng được với dung dịch NaOH."
        },
        {
            id: "hoa11_m1_6",
            subject: "Hóa Học",
            grade: "11",
            period: "mid1",
            topic: "Cân bằng hóa học & pH dung dịch",
            content: "Dung dịch có pH = 3 có môi trường gì và nồng độ [H+] bằng bao nhiêu?",
            options: ["A. Môi trường acid, [H+] = 10^-3 M", "B. Môi trường base, [H+] = 10^-11 M", "C. Môi trường trung tính, [H+] = 10^-7 M", "D. Môi trường acid, [H+] = 3 M"],
            correct: "A",
            explanation: "pH = -log[H+] = 3 < 7 nên dung dịch có tính acid và [H+] = 10^-3 mol/L."
        },
        {
            id: "hoa11_m1_7",
            subject: "Hóa Học",
            grade: "11",
            period: "mid1",
            topic: "Nitrogen & Sulfur",
            content: "Khí Ammonia (NH3) có tính chất hóa học đặc trưng nào?",
            options: ["A. Tính base yếu và tính khử", "B. Tính acid mạnh và tính oxi hóa", "C. Tính base mạnh và tính trơ", "D. Chỉ có tính oxi hóa mạnh"],
            correct: "A",
            explanation: "NH3 tan trong nước tạo dung dịch base yếu (nhận H+) và nguyên tử N có số oxi hóa -3 thể hiện tính khử."
        },
        {
            id: "hoa11_f1_5",
            subject: "Hóa Học",
            grade: "11",
            period: "final1",
            topic: "Nitrogen & Sulfur",
            content: "Dung dịch Acid Sulfuric (H2SO4) đặc, nóng có tính chất nổi bật nào sau đây?",
            options: ["A. Tính oxi hóa rất mạnh và tính háo nước mạnh", "B. Tính khử mạnh", "C. Không tác dụng với kim loại Cu", "D. Là acid yếu dễ bay hơi"],
            correct: "A",
            explanation: "H2SO4 đặc nóng là chất oxi hóa mạnh (oxi hóa được Cu, S, C...) và có tính háo nước mãnh liệt."
        },
        {
            id: "hoa11_f1_6",
            subject: "Hóa Học",
            grade: "11",
            period: "final1",
            topic: "Đại cương hóa học hữu cơ",
            content: "Các chất có cùng công thức phân tử nhưng khác nhau về công thức cấu tạo được gọi là:",
            options: ["A. Đồng phân của nhau", "B. Đồng đẳng của nhau", "C. Đồng vị của nhau", "D. Dẫn xuất của nhau"],
            correct: "A",
            explanation: "Đồng phân là hiện tượng các chất có cùng CTPT nhưng trật tự liên kết nguyên tử khác nhau."
        },
        {
            id: "hoa11_m2_3",
            subject: "Hóa Học",
            grade: "11",
            period: "mid2",
            topic: "Hydrocarbon (Alkane, Alkene, Arene)",
            content: "Phản ứng đặc trưng của Alkane (như Methane CH4) là loại phản ứng nào?",
            options: ["A. Phản ứng thế halogen (chiếu sáng)", "B. Phản ứng cộng brom", "C. Phản ứng trùng hợp", "D. Phản ứng tráng bạc"],
            correct: "A",
            explanation: "Alkane chỉ chứa liên kết đơn C-C và C-H bền vững nên tham gia phản ứng thế đặc trưng."
        },
        {
            id: "hoa11_f2_7",
            subject: "Hóa Học",
            grade: "11",
            period: "final2",
            topic: "Dẫn xuất Halogen, Alcohol & Phenol",
            content: "Chất nào sau đây tác dụng được với dung dịch NaOH tạo thành muối và nước?",
            options: ["A. Phenol (C6H5OH)", "B. Ethanol (C2H5OH)", "C. Methane (CH4)", "D. Benzene (C6H6)"],
            correct: "A",
            explanation: "Phenol có vòng benzene hút electron làm tăng tính acid của nhóm -OH, tác dụng được với kiềm NaOH tạo C6H5ONa."
        },
    ],
    "Sinh Học": [
        {
            id: "b11_1",
            subject: "Sinh Học",
            grade: "11",
            period: "mid1",
            topic: "Trao đổi nước & Khoáng ở thực vật",
            content: "Cơ quan và bộ phận đóng vai trò chủ yếu trong việc hút nước và ion khoáng ở thực vật trên cạn là:",
            options: ["A. Rễ với hệ thống các tế bào lông hút", "B. Khí khổng ở lá", "C. Thân và vỏ cây", "D. Hoa và quả"],
            correct: "A",
            explanation: "Rễ cây với hàng triệu tế bào lông hút tạo nên diện tích bề mặt tiếp xúc khổng lồ giúp hấp thu nước và khoáng."
        },
        {
            id: "b11_2",
            subject: "Sinh Học",
            grade: "11",
            period: "mid1",
            topic: "Quang hợp & Hô hấp ở thực vật",
            content: "Bào quan thực hiện chức năng quang hợp ở tế bào thực vật là:",
            options: ["A. Lục lạp", "B. Ti thể", "C. Ribôxôm", "D. Bộ máy Golgi"],
            correct: "A",
            explanation: "Lục lạp chứa hệ sắc tố diệp lục hấp thu năng lượng ánh sáng mặt trời để tổng hợp chất hữu cơ."
        },
        {
            id: "b11_3",
            subject: "Sinh Học",
            grade: "11",
            period: "final1",
            topic: "Dinh dưỡng, Hô hấp & Tuần hoàn ở động vật",
            content: "Hệ tuần hoàn kín có đặc điểm nổi bật nào so với hệ tuần hoàn hở?",
            options: ["A. Máu lưu thông liên tục trong mạch kín dưới áp lực cao hoặc trung bình", "B. Máu chảy tràn vào khoang cơ thể trộn lẫn dịch mô", "C. Không có tim bơm máu", "D. Vận tốc máu chảy rất chậm"],
            correct: "A",
            explanation: "Hệ tuần hoàn kín có mao mạch nối giữa động mạch và tĩnh mạch, máu chảy nhanh dưới áp lực cao."
        },
        {
            id: "b11_4",
            subject: "Sinh Học",
            grade: "11",
            period: "mid2",
            topic: "Cảm ứng & Tập tính sinh vật",
            content: "Tập tính bẩm sinh ở động vật có đặc điểm là:",
            options: ["A. Sinh ra đã có, mang tính bản năng, di truyền từ bố mẹ", "B. Được hình thành qua quá trình học tập và rút kinh nghiệm", "C. Dễ dàng thay đổi khi điều kiện môi trường thay đổi", "D. Chỉ có ở động vật có hệ thần kinh phát triển cao"],
            correct: "A",
            explanation: "Tập tính bẩm sinh là chuỗi phản xạ không điều kiện được quy định trong gen di truyền."
        },
        {
            id: "b11_5",
            subject: "Sinh Học",
            grade: "11",
            period: "final2",
            topic: "Sinh trưởng & Sinh sản",
            content: "Sinh sản vô tính ở thực vật là hình thức sinh sản:",
            options: ["A. Không có sự hợp nhất của giao tử đực và giao tử cái, con sinh ra giống hệt mẹ", "B. Luôn có sự thụ phấn và thụ tinh", "C. Tạo ra nhiều biến dị tổ hợp phong phú", "D. Cần sự tham gia của hai cá thể bố và mẹ"],
            correct: "A",
            explanation: "Sinh sản vô tính dựa trên cơ chế nguyên phân, không qua giảm phân và thụ tinh."
        },
        {
            id: "b11_extra1",
            subject: "Sinh Học",
            grade: "11",
            period: "mid1",
            topic: "Trao đổi nước & Khoáng ở thực vật",
            content: "Đai Caspary ở nội bì rễ cây có chức năng chính là gì?",
            options: ["A. Chặn con đường gian bào, buộc dòng nước và khoáng phải đi qua tế bào chất để kiểm soát lượng chất hấp thụ", "B. Hút nước trực tiếp từ đất", "C. Vận chuyển chất hữu cơ xuống rễ", "D. Thoát hơi nước ra ngoài"],
            correct: "A",
            explanation: "Đai Caspary thấm suberin không thấm nước ngăn chặn dòng gian bào, bắt buộc nước và ion khoáng đi qua màng sinh chất để chọn lọc."
        },
        {
            id: "b11_extra2",
            subject: "Sinh Học",
            grade: "11",
            period: "mid1",
            topic: "Quang hợp & Hô hấp ở thực vật",
            content: "Pha tối của quang hợp ở thực vật C3 sử dụng ATP và NADPH từ pha sáng để cố định CO₂ tạo đường qua chu trình nào?",
            options: ["A. Chu trình Calvin", "B. Chu trình Crebs", "C. Chu trình Axit Citric", "D. Quá trình đường phân"],
            correct: "A",
            explanation: "Chu trình Calvin (chu trình C3) diễn ra trong chất nền stroma của lục lạp để biến đổi CO₂ thành carbohydrate."
        },
        {
            id: "b11_extra3",
            subject: "Sinh Học",
            grade: "11",
            period: "final1",
            topic: "Dinh dưỡng, Hô hấp & Tuần hoàn ở động vật",
            content: "Côn trùng (như cào cào, châu chấu) trao đổi khí với môi trường ngoài thông qua cơ quan nào?",
            options: ["A. Hệ thống ống khí", "B. Mang", "C. Phổi có phế nang", "D. Bề mặt da ẩm ướt"],
            correct: "A",
            explanation: "Hệ thống ống khí phân nhánh chằng chịt dẫn khí trực tiếp đến từng tế bào của cơ thể côn trùng."
        },
        {
            id: "b11_extra4",
            subject: "Sinh Học",
            grade: "11",
            period: "mid2",
            topic: "Cảm ứng & Tập tính sinh vật",
            content: "Hiện tượng ngọn cây luôn uốn cong về phía có nguồn ánh sáng chiếu đến được gọi là:",
            options: ["A. Tính hướng sáng dương", "B. Tính hướng trọng lực âm", "C. Tính hướng nước", "D. Tính ứng động nở hoa"],
            correct: "A",
            explanation: "Do hoocmôn auxin phân bố nhiều ở phía khuất sáng kích thích tế bào dãn dài nhanh hơn phía chiếu sáng làm ngọn uốn về nguồn sáng."
        },
        {
            id: "b11_extra5",
            subject: "Sinh Học",
            grade: "11",
            period: "final2",
            topic: "Sinh trưởng & Sinh sản",
            content: "Thụ tinh kép là đặc trưng sinh sản hữu tính chỉ có ở nhóm thực vật nào?",
            options: ["A. Thực vật hạt kín (thực vật có hoa)", "B. Thực vật hạt trần (cây thông)", "C. Rêu", "D. Dương xỉ"],
            correct: "A",
            explanation: "Thụ tinh kép: Một giao tử đực thụ tinh noãn cầu thành hợp tử (2n), một giao tử đực kết hợp nhân cực thành nội nhũ (3n)."
        },
        {
            id: "bio11_t1_q3",
            subject: "Sinh Học",
            grade: "11",
            period: "mid1",
            topic: "Trao đổi nước & Khoáng ở thực vật",
            content: "Động lực chính đóng vai trò đầu trên kéo dòng nước và ion khoáng từ rễ lên lá cây là:",
            options: ["A. Lực thoát hơi nước qua khí khổng ở lá", "B. Áp suất rễ (lực đẩy)", "C. Lực liên kết giữa các phân tử nước", "D. Sự đóng mở của lông hút"],
            correct: "A",
            explanation: "Thoát hơi nước tạo sức hút chân không kéo toàn bộ cột nước liên tục từ rễ qua thân lên tận đỉnh ngọn lá."
        },
        {
            id: "bio11_t2_q3",
            subject: "Sinh Học",
            grade: "11",
            period: "final1",
            topic: "Quang hợp & Hô hấp ở thực vật",
            content: "Sản phẩm đầu tiên của chu trình Calvin (pha tối) ở nhóm thực vật C3 là hợp chất có mấy nguyên tử carbon?",
            options: ["A. 3 carbon (3-PGA)", "B. 4 carbon (AOA)", "C. 6 carbon (Glucose)", "D. 5 carbon (RuBP)"],
            correct: "A",
            explanation: "Thực vật C3 cố định CO₂ tạo sản phẩm đầu tiên là hợp chất 3C axit phosphoglyceric (3-PGA)."
        },
        {
            id: "bio11_t3_q3",
            subject: "Sinh Học",
            grade: "11",
            period: "mid2",
            topic: "Dinh dưỡng, Hô hấp & Tuần hoàn ở động vật",
            content: "Hệ tuần hoàn hở có đặc điểm nào phân biệt với hệ tuần hoàn kín?",
            options: ["A. Máu có đoạn chảy trong xoang cơ thể trộn lẫn dịch mô dưới áp lực thấp", "B. Máu luôn chảy trong mạch kín áp lực cao", "C. Có mạng lưới mao mạch dày đặc", "D. Tim luôn có 4 ngăn hoàn chỉnh"],
            correct: "A",
            explanation: "Ở hệ tuần hoàn hở (thân mềm, chân khớp), máu rời động mạch tràn vào xoang cơ thể tiếp xúc trực tiếp tế bào."
        },
        {
            id: "bio11_t4_q3",
            subject: "Sinh Học",
            grade: "11",
            period: "final2",
            topic: "Cảm ứng & Tập tính sinh vật",
            content: "Tập tính bẩm sinh ở động vật là những tập tính:",
            options: ["A. Sinh ra đã có, mang tính bản năng, do gen di truyền quy định", "B. Hình thành trong đời sống qua học tập và rèn luyện", "C. Dễ biến đổi theo môi trường", "D. Chỉ có ở người"],
            correct: "A",
            explanation: "Tập tính bẩm sinh là chuỗi phản xạ không điều kiện được mã hóa di truyền cố định trong hệ thần kinh loài."
        },
        {
            id: "bio11_t5_q3",
            subject: "Sinh Học",
            grade: "11",
            period: "final2",
            topic: "Sinh trưởng & Sinh sản",
            content: "Hormone thực vật nào sau đây kích thích sự chín nhanh của quả?",
            options: ["A. Ethylene", "B. Auxin", "C. Gibberellin", "D. Cytokinin"],
            correct: "A",
            explanation: "Ethylene dạng khí kích thích phân giải diệp lục, làm mềm mô quả và đẩy nhanh quá trình chín của trái cây."
        },
        {
            id: "sinh11_m1_6",
            subject: "Sinh Học",
            grade: "11",
            period: "mid1",
            topic: "Trao đổi nước & Khoáng ở thực vật",
            content: "Động lực chính vận chuyển dòng nước và ion khoáng từ rễ lên lá cây qua mạch gỗ là:",
            options: ["A. Lực hút do sự thoát hơi nước ở lá", "B. Áp suất rễ (lực đẩy)", "C. Lực liên kết giữa các phân tử nước", "D. Sự đóng mở của khí khổng"],
            correct: "A",
            explanation: "Lực hút do thoát hơi nước ở lá cây là động lực quan trọng và mạnh nhất kéo dòng nước từ rễ lên ngọn."
        },
        {
            id: "sinh11_m1_7",
            subject: "Sinh Học",
            grade: "11",
            period: "mid1",
            topic: "Quang hợp & Hô hấp ở thực vật",
            content: "Pha sáng của quá trình quang hợp ở thực vật diễn ra tại cấu trúc nào trong lục lạp?",
            options: ["A. Màng thylakoid", "B. Chất nền stroma", "C. Màng ngoài lục lạp", "D. Không bào"],
            correct: "A",
            explanation: "Pha sáng quang hợp chứa hệ thống sắc tố quang hợp trên màng thylakoid để hấp thụ ánh sáng và tạo ATP, NADPH."
        },
        {
            id: "sinh11_f1_4",
            subject: "Sinh Học",
            grade: "11",
            period: "final1",
            topic: "Dinh dưỡng, Hô hấp & Tuần hoàn ở động vật",
            content: "Hệ tuần hoàn kép có ở nhóm động vật nào sau đây?",
            options: ["A. Lưỡng cư, Bò sát, Chim và Thú", "B. Cá xương", "C. Côn trùng", "D. Giun đất"],
            correct: "A",
            explanation: "Động vật có phổi (Lưỡng cư, Bò sát, Chim, Thú) có hệ tuần hoàn kép gồm vòng tuần hoàn phổi và vòng tuần hoàn lớn."
        },
        {
            id: "sinh11_m2_4",
            subject: "Sinh Học",
            grade: "11",
            period: "mid2",
            topic: "Cảm ứng & Tập tính sinh vật",
            content: "Hiện tượng thân cây luôn uốn cong về phía có nguồn ánh sáng được gọi là:",
            options: ["A. Hướng sáng dương", "B. Hướng sáng âm", "C. Hướng trọng lực dương", "D. Hướng tiếp xúc"],
            correct: "A",
            explanation: "Thân cây sinh trưởng hướng về phía có ánh sáng gọi là tính hướng sáng dương do sự phân bố bất đối xứng của Auxin."
        },
        {
            id: "sinh11_f2_5",
            subject: "Sinh Học",
            grade: "11",
            period: "final2",
            topic: "Sinh trưởng & Sinh sản",
            content: "Ở thực vật hạt kín, sự thụ tinh kép là quá trình kết hợp giữa:",
            options: ["A. Hai tinh tử với noãn cầu và nhân cực để tạo hợp tử (2n) và nội nhũ (3n)", "B. Một hạt phấn với hai noãn", "C. Tinh tử với bao phấn", "D. Tế bào rễ với củ"],
            correct: "A",
            explanation: "Thụ tinh kép: tinh tử 1 + noãn cầu -> hợp tử (2n); tinh tử 2 + nhân cực (2n) -> nội nhũ (3n) cung cấp dinh dưỡng."
        },
    ],
    "Lịch Sử": [
        {
            id: "h11_1",
            subject: "Lịch Sử",
            grade: "11",
            period: "mid1",
            topic: "Cách mạng tư sản & Chủ nghĩa tư bản",
            content: "Khẩu hiệu nổi tiếng 'Tự do - Bình đẳng - Bác ái' xuất hiện trong cuộc cách mạng tư sản nào?",
            options: ["A. Cách mạng tư sản Pháp cuối thế kỉ XVIII", "B. Cách mạng tư sản Anh thế kỉ XVII", "C. Chiến tranh giành độc lập 13 thuộc địa Anh ở Bắc Mỹ", "D. Cuộc Duy tân Minh Trị ở Nhật Bản"],
            correct: "A",
            explanation: "Khẩu hiệu 'Tự do - Bình đẳng - Bác ái' là biểu tượng của Cách mạng tư sản Pháp năm 1789."
        },
        {
            id: "h11_2",
            subject: "Lịch Sử",
            grade: "11",
            period: "final1",
            topic: "Chủ nghĩa xã hội & Liên Xô",
            content: "Cách mạng tháng Mười Nga năm 1917 thắng lợi đã dẫn tới sự ra đời của nhà nước nào?",
            options: ["A. Nhà nước xã hội chủ nghĩa đầu tiên trên thế giới", "B. Nhà nước tư bản chủ nghĩa kiểu mới", "C. Chế độ phong kiến tập quyền", "D. Khối liên minh quân sự NATO"],
            correct: "A",
            explanation: "Cách mạng tháng Mười Nga 1917 do Lê-nin lãnh đạo đã lật đổ chính phủ tư sản lâm thời, lập nên nhà nước Xô viết công - nông đầu tiên."
        },
        {
            id: "h11_3",
            subject: "Lịch Sử",
            grade: "11",
            period: "final1",
            topic: "Chiến tranh thế giới thứ nhất & thứ hai",
            content: "Chiến tranh thế giới thứ nhất (1914 - 1918) mang tính chất thực sự là:",
            options: ["A. Chiến tranh đế quốc phi nghĩa đối với cả hai phe tham chiến", "B. Chiến tranh chính nghĩa bảo vệ hòa bình thế giới", "C. Cuộc chiến tranh giải phóng dân tộc", "D. Cuộc nội chiến châu Âu"],
            correct: "A",
            explanation: "Chiến tranh thế giới thứ nhất là cuộc chiến tranh đế quốc phi nghĩa nhằm tranh giành thuộc địa và thị trường."
        },
        {
            id: "h11_4",
            subject: "Lịch Sử",
            grade: "11",
            period: "mid2",
            topic: "Lịch sử bảo vệ chủ quyền Biển Đảo",
            content: "Hai quần đảo Hoàng Sa và Trường Sa thuộc chủ quyền thiêng liêng không thể tranh cãi của Việt Nam được các triều đại phong kiến nước ta thực thi chủ quyền liên tục từ ít nhất:",
            options: ["A. Từ thế kỉ XVII dưới thời các Chúa Nguyễn", "B. Đầu thế kỉ XX", "C. Sau năm 1975", "D. Thế kỉ XIX thời Pháp thuộc"],
            correct: "A",
            explanation: "Chúa Nguyễn đã lập ra Hải đội Hoàng Sa và Đội Bắc Hải để khai thác, tuần tra và cắm mốc chủ quyền liên tục từ thế kỉ XVII."
        },
        {
            id: "h11_5",
            subject: "Lịch Sử",
            grade: "11",
            period: "final2",
            topic: "Kháng chiến chống ngoại xâm",
            content: "Cuộc kháng chiến chống thực dân Pháp xâm lược của nhân dân Việt Nam nửa cuối thế kỉ XIX nổ ra mở đầu tại đâu vào năm 1858?",
            options: ["A. Bán đảo Sơn Trà (Đà Nẵng)", "B. Cửa biển Gia Định", "C. Cửa ngõ kinh thành Huế", "D. Cảng Hải Phòng"],
            correct: "A",
            explanation: "Ngày 1/9/1858, liên quân Pháp - Tây Ban Nha nổ súng tấn công bán đảo Sơn Trà (Đà Nẵng), mở đầu cuộc chiến tranh xâm lược nước ta."
        },
        {
            id: "h11_extra1",
            subject: "Lịch Sử",
            grade: "11",
            period: "mid1",
            topic: "Cách mạng tư sản & Chủ nghĩa tư bản",
            content: "Bản 'Tuyên ngôn Độc lập' năm 1776 của Hợp chúng quốc Mĩ khẳng định quyền thiêng liêng nào của con người?",
            options: ["A. Quyền sống, quyền tự do và quyền mưu cầu hạnh phúc", "B. Quyền sở hữu vũ khí tuyệt đối", "C. Quyền xâm lược thuộc địa", "D. Quyền không đóng thuế cho chính phủ"],
            correct: "A",
            explanation: "Tuyên ngôn Độc lập năm 1776 do Thomas Jefferson soạn thảo khẳng định các quyền con người bất khả xâm phạm."
        },
        {
            id: "h11_extra2",
            subject: "Lịch Sử",
            grade: "11",
            period: "final1",
            topic: "Chiến tranh thế giới thứ nhất & thứ hai",
            content: "Sự kiện nào đánh dấu Chiến tranh thế giới thứ hai (1939 - 1945) bùng nổ ở châu Âu?",
            options: ["A. Phát xít Đức bất ngờ tấn công xâm lược Ba Lan (1/9/1939)", "B. Nhật Bản tấn công Trân Châu Cảng", "C. Đức tấn công Liên Xô", "D. Phe Đồng minh đổ bộ Normandy"],
            correct: "A",
            explanation: "Ngày 1/9/1939, phát xít Đức tấn công Ba Lan, ngay sau đó Anh và Pháp tuyên chiến với Đức, chiến tranh thế giới thứ hai bùng nổ."
        },
        {
            id: "h11_extra3",
            subject: "Lịch Sử",
            grade: "11",
            period: "final2",
            topic: "Kháng chiến chống ngoại xâm",
            content: "Phong trào Cần Vương (1885 - 1896) bùng nổ sau khi bản Chiếu Cần Vương được ban bố nhân danh vị vua yêu nước nào?",
            options: ["A. Vua Hàm Nghi", "B. Vua Duy Tân", "C. Vua Thành Thái", "D. Vua Bảo Đại"],
            correct: "A",
            explanation: "Tôn Thất Thuyết nhân danh vua trẻ Hàm Nghi hạ chiếu Cần Vương kêu gọi văn thân, sĩ phu và nhân dân phò vua cứu nước."
        },
        {
            id: "his11_t1_q3",
            subject: "Lịch Sử",
            grade: "11",
            period: "mid1",
            topic: "Cách mạng tư sản & Chủ nghĩa tư bản",
            content: "Mục tiêu chung của các cuộc cách mạng tư sản thời cận đại ở châu Âu và Bắc Mỹ là gì?",
            options: ["A. Lật đổ chế độ phong kiến (hoặc ách thực dân), mở đường cho chủ nghĩa tư bản phát triển", "B. Thiết lập nhà nước vô sản", "C. Duy trì quan hệ nô dịch phường hội", "D. Xóa bỏ hoàn toàn quyền sở hữu tư nhân"],
            correct: "A",
            explanation: "Các cuộc cách mạng tư sản (Anh, Mỹ, Pháp) xóa bỏ rào cản phong kiến để xác lập nền kinh tế thị trường tư bản."
        },
        {
            id: "his11_t2_q3",
            subject: "Lịch Sử",
            grade: "11",
            period: "final1",
            topic: "Chủ nghĩa xã hội & Liên Xô",
            content: "Nhà nước xã hội chủ nghĩa đầu tiên trên thế giới ra đời sau sự kiện lịch sử nào?",
            options: ["A. Cách mạng tháng Mười Nga năm 1917", "B. Công xã Paris năm 1871", "C. Cách mạng tháng Hai năm 1917", "D. Thành lập Quốc tế thứ ba năm 1919"],
            correct: "A",
            explanation: "Cách mạng tháng Mười Nga (1917) do Lenin lãnh đạo lật đổ chính phủ lâm thời tư sản, khai sinh nhà nước Xô viết."
        },
        {
            id: "his11_t3_q3",
            subject: "Lịch Sử",
            grade: "11",
            period: "mid2",
            topic: "Chiến tranh thế giới thứ nhất & thứ hai",
            content: "Sự kiện nào đánh dấu Chiến tranh thế giới thứ hai (1939 - 1945) chính thức bùng nổ?",
            options: ["A. Phát xít Đức bất ngờ tấn công Ba Lan ngày 01/09/1939", "B. Nhật Bản tập kích Trân Châu Cảng", "C. Đức tấn công Liên Xô", "D. Khủng hoảng kinh tế 1929"],
            correct: "A",
            explanation: "Ngày 01/09/1939, Đức tấn công Ba Lan, ngay sau đó Anh và Pháp tuyên chiến với Đức, mở màn đại chiến thế giới."
        },
        {
            id: "his11_t4_q3",
            subject: "Lịch Sử",
            grade: "11",
            period: "final2",
            topic: "Lịch sử bảo vệ chủ quyền Biển Đảo",
            content: "Dưới triều Nguyễn, vua Gia Long và Minh Mạng đã có hành động kiên quyết nào để xác lập chủ quyền Hoàng Sa, Trường Sa?",
            options: ["A. Cử hải đội Hoàng Sa cắm mốc tiêu, đo đạc hải trình và dựng bia miếu chủ quyền", "B. Bán đảo cho tư nhân nước ngoài", "C. Rút toàn bộ dân về đất liền", "D. Không quan tâm biên cương biển đảo"],
            correct: "A",
            explanation: "Các triều đại phong kiến Việt Nam tổ chức thực thi chủ quyền liên tục và hòa bình qua Hải đội Hoàng Sa - Bắc Hải."
        },
        {
            id: "his11_t5_q3",
            subject: "Lịch Sử",
            grade: "11",
            period: "final2",
            topic: "Kháng chiến chống ngoại xâm",
            content: "Phong trào Cần Vương (1885 - 1896) bùng nổ sau khi ai hạ chiếu kêu gọi toàn dân phò vua cứu nước?",
            options: ["A. Vua Hàm Nghi", "B. Vua Duy Tân", "C. Vua Thành Thái", "D. Vua Bảo Đại"],
            correct: "A",
            explanation: "Tháng 7/1885 tại căn cứ Tân Sở, Tôn Thất Thuyết thay mặt vua yêu nước trẻ tuổi Hàm Nghi ban chiếu Cần Vương."
        },
        {
            id: "su11_m1_4",
            subject: "Lịch Sử",
            grade: "11",
            period: "mid1",
            topic: "Cách mạng tư sản & Chủ nghĩa tư bản",
            content: "Bản 'Tuyên ngôn Độc lập' năm 1776 của nước Mỹ đã khẳng định quyền cơ bản nào của con người?",
            options: ["A. Quyền sống, quyền tự do và quyền mưu cầu hạnh phúc", "B. Quyền sở hữu vũ khí hạt nhân", "C. Quyền độc quyền thương mại toàn cầu", "D. Quyền phong kiến thế tập"],
            correct: "A",
            explanation: "Tuyên ngôn Độc lập Mỹ 1776 do Thomas Jefferson soạn thảo khẳng định quyền sống, quyền tự do và quyền mưu cầu hạnh phúc."
        },
        {
            id: "su11_m1_5",
            subject: "Lịch Sử",
            grade: "11",
            period: "mid1",
            topic: "Chủ nghĩa xã hội & Liên Xô",
            content: "Thắng lợi của Cách mạng tháng Mười Nga năm 1917 có ý nghĩa quốc tế to lớn vì:",
            options: ["A. Mở ra con đường giải phóng cho các dân tộc bị áp bức và thời đại quá độ lên CNXH", "B. Chấm dứt hoàn toàn chế độ phong kiến Châu Á", "C. Thành lập tổ chức Liên Hợp Quốc", "D. Xóa bỏ đồng tiền giấy"],
            correct: "A",
            explanation: "Cách mạng tháng Mười Nga 1917 lật đổ giai cấp tư sản, lập nên nhà nước công nông đầu tiên trên thế giới."
        },
        {
            id: "su11_f1_5",
            subject: "Lịch Sử",
            grade: "11",
            period: "final1",
            topic: "Chiến tranh thế giới thứ nhất & thứ hai",
            content: "Sự kiện nào đánh dấu Chiến tranh thế giới thứ hai (1939 - 1945) bùng nổ?",
            options: ["A. Phát xít Đức bất ngờ tấn công Ba Lan vào ngày 1/9/1939", "B. Nhật Bản tấn công Trân Châu Cảng", "C. Mỹ ném bom nguyên tử xuống Hiroshima", "D. Liên Xô giải phóng Berlin"],
            correct: "A",
            explanation: "Ngày 1/9/1939, phát xít Đức tấn công Ba Lan, Anh và Pháp tuyên chiến với Đức, chiến tranh thế giới thứ hai bùng nổ."
        },
        {
            id: "su11_m2_3",
            subject: "Lịch Sử",
            grade: "11",
            period: "mid2",
            topic: "Lịch sử bảo vệ chủ quyền Biển Đảo",
            content: "Dưới triều nhà Nguyễn, hai đội dân binh nào được thành lập để thực thi chủ quyền liên tục tại Hoàng Sa và Trường Sa?",
            options: ["A. Đội Hoàng Sa và Đội Bắc Hải", "B. Đội Cần Vương và Đội Nghĩa quân", "C. Đội Thủy binh Thăng Long", "D. Đội dân quân tự vệ"],
            correct: "A",
            explanation: "Chúa Nguyễn và triều Nguyễn đã thành lập Đội Hoàng Sa và Đội Bắc Hải hằng năm ra cắm mốc, đo đạc hải trình và khai thác sản vật."
        },
        {
            id: "su11_f2_5",
            subject: "Lịch Sử",
            grade: "11",
            period: "final2",
            topic: "Kháng chiến chống ngoại xâm",
            content: "Chiến thắng trên sông Bạch Đằng năm 938 của Ngô Quyền đã mở ra kỷ nguyên nào cho dân tộc Việt Nam?",
            options: ["A. Chấm dứt hơn 1000 năm Bắc thuộc, mở ra kỷ nguyên độc lập tự chủ lâu dài", "B. Bắt đầu thời kỳ Bắc thuộc lần thứ nhất", "C. Khởi đầu triều đại nhà Đinh", "D. Thống nhất đất nước thời Nguyễn"],
            correct: "A",
            explanation: "Chiến thắng Bạch Đằng 938 đập tan quân Nam Hán, mở ra kỷ nguyên độc lập, tự chủ hoàn toàn cho dân tộc ta."
        },
    ],
    "Địa Lí": [
        {
            id: "g11_1",
            subject: "Địa Lí",
            grade: "11",
            period: "mid1",
            topic: "Toàn cầu hóa & Khu vực hóa kinh tế",
            content: "Toàn cầu hóa kinh tế là quá trình liên kết giữa các quốc gia trên thế giới về nhiều mặt, biểu hiện rõ nét nhất qua sự gia tăng nhanh chóng của:",
            options: ["A. Thương mại quốc tế, dòng vốn đầu tư và thị trường tài chính toàn cầu", "B. Xung đột quân sự khu vực", "C. Các hàng rào thuế quan bảo hộ mậu dịch", "D. Ngăn cấm di cư lao động"],
            correct: "A",
            explanation: "Toàn cầu hóa kinh tế biểu hiện ở thương mại quốc tế phát triển mạnh, dòng vốn đầu tư xuyên quốc gia và thị trường tài chính quốc tế mở rộng."
        },
        {
            id: "g11_2",
            subject: "Địa Lí",
            grade: "11",
            period: "mid1",
            topic: "Địa lí khu vực Đông Nam Á (ASEAN)",
            content: "Hiệp hội các quốc gia Đông Nam Á (ASEAN) được thành lập vào năm nào và tại đâu?",
            options: ["A. Năm 1967 tại Băng Cốc (Thái Lan)", "B. Năm 1995 tại Hà Nội (Việt Nam)", "C. Năm 1975 tại Jakarta (Indonesia)", "D. Năm 1986 tại Manila (Philippines)"],
            correct: "A",
            explanation: "ASEAN được thành lập ngày 8/8/1967 tại Bangkok với 5 nước sáng lập đầu tiên."
        },
        {
            id: "g11_3",
            subject: "Địa Lí",
            grade: "11",
            period: "final1",
            topic: "Địa lí Hoa Kỳ & EU",
            content: "Hợp chủng quốc Hoa Kỳ có quy mô nền kinh tế đứng thứ mấy trên thế giới?",
            options: ["A. Số 1 thế giới", "B. Số 2 thế giới", "C. Số 3 thế giới", "D. Số 4 thế giới"],
            correct: "A",
            explanation: "Hoa Kỳ là siêu cường kinh tế số 1 thế giới với GDP vượt trội, chiếm tỉ trọng lớn trong kinh tế toàn cầu."
        },
        {
            id: "g11_4",
            subject: "Địa Lí",
            grade: "11",
            period: "mid2",
            topic: "Địa lí Liên Bang Nga & Nhật Bản",
            content: "Nhật Bản là quốc gia quần đảo nghèo nàn về tài nguyên khoáng sản, sự phát triển kinh tế thần kỳ của Nhật Bản chủ yếu dựa vào nhân tố:",
            options: ["A. Con người được đào tạo chất lượng cao, có tính kỷ luật và áp dụng khoa học công nghệ", "B. Nguồn khoáng sản than đá dồi dào", "C. Đất đai canh tác nông nghiệp rộng lớn", "D. Vị trí nằm sâu trong lục địa"],
            correct: "A",
            explanation: "Nhân tố con người và đầu tư cho giáo dục, khoa học công nghệ là chìa khóa phát triển thần kỳ của Nhật Bản."
        },
        {
            id: "g11_5",
            subject: "Địa Lí",
            grade: "11",
            period: "final2",
            topic: "Địa lí Trung Quốc & Ấn Độ",
            content: "Trung Quốc thực hiện công cuộc cải cách mở cửa từ năm 1978, đạt được thành tựu nổi bật nhất là:",
            options: ["A. Tốc độ tăng trưởng kinh tế cao liên tục và vươn lên thành nền kinh tế lớn thứ hai thế giới", "B. Đóng cửa hoàn toàn thị trường nội địa", "C. Giảm xuất khẩu hàng hóa công nghiệp", "D. Từ bỏ hoàn toàn các ngành công nghệ cao"],
            correct: "A",
            explanation: "Công cuộc hiện đại hóa của Trung Quốc từ 1978 đã đưa nước này trở thành 'công xưởng của thế giới' và nền kinh tế lớn thứ hai toàn cầu."
        },
        {
            id: "g11_extra1",
            subject: "Địa Lí",
            grade: "11",
            period: "mid1",
            topic: "Địa lí khu vực Đông Nam Á (ASEAN)",
            content: "Khu vực Đông Nam Á có vị trí địa - chính trị và kinh tế đặc biệt quan trọng vì nằm ở:",
            options: ["A. Cầu nối giữa lục địa Á - Âu với lục địa Ô-xtrây-li-a và giữa Thái Bình Dương với Ấn Độ Dương", "B. Trung tâm của Bắc Băng Dương", "C. Nằm cô lập giữa sa mạc Sahara", "D. Nối liền Đại Tây Dương với Nam Cực"],
            correct: "A",
            explanation: "Đông Nam Á là ngã tư đường hàng hải và hàng không quốc tế huyết mạch kết nối hai đại dương lớn."
        },
        {
            id: "g11_extra2",
            subject: "Địa Lí",
            grade: "11",
            period: "final1",
            topic: "Địa lí Hoa Kỳ & EU",
            content: "Liên minh châu Âu (EU) là tổ chức liên kết khu vực thành công hàng đầu thế giới với đặc trưng nổi bật:",
            options: ["A. Tự do lưu thông hàng hóa, dịch vụ, con người, tiền tệ và sử dụng đồng tiền chung Euro", "B. Cấm tự do đi lại giữa các nước thành viên", "C. Đánh thuế nặng lên hàng hóa nội khối", "D. Giải thể quân đội quốc gia"],
            correct: "A",
            explanation: "EU thiết lập 4 quyền tự do lưu thông cơ bản và có thị trường chung thống nhất cùng đồng tiền Euro."
        },
        {
            id: "g11_extra3",
            subject: "Địa Lí",
            grade: "11",
            period: "mid2",
            topic: "Địa lí Liên Bang Nga & Nhật Bản",
            content: "Liên bang Nga là quốc gia có đặc điểm địa lí nổi bật nào sau đây?",
            options: ["A. Diện tích lãnh thổ rộng lớn nhất thế giới, giàu có tài nguyên khoáng sản và rừng Taiga", "B. Quốc gia có diện tích nhỏ nhất châu Âu", "C. Hoàn toàn không có tài nguyên dầu mỏ và khí đốt", "D. Dân số đông nhất thế giới"],
            correct: "A",
            explanation: "Nga có diện tích hơn 17 triệu km² trải dài trên 2 châu lục Á - Âu, sở hữu trữ lượng khí đốt và rừng số 1 thế giới."
        },
        {
            id: "geo11_t1_q3",
            subject: "Địa Lí",
            grade: "11",
            period: "mid1",
            topic: "Toàn cầu hóa & Khu vực hóa kinh tế",
            content: "Biểu hiện rõ nét nhất của xu hướng toàn cầu hóa kinh tế thế giới là:",
            options: ["A. Thương mại quốc tế, dòng vốn đầu tư và các công ty xuyên quốc gia phát triển mạnh mẽ", "B. Đóng cửa biên giới quốc gia", "C. Mỗi nước chỉ dùng tiền tệ tự cung tự cấp", "D. Giảm hợp tác thương mại đa phương"],
            correct: "A",
            explanation: "Toàn cầu hóa mở rộng liên kết thương mại, lưu chuyển vốn đầu tư FDI và vai trò khổng lồ của các tập đoàn đa quốc gia."
        },
        {
            id: "geo11_t2_q3",
            subject: "Địa Lí",
            grade: "11",
            period: "final1",
            topic: "Địa lí Hoa Kỳ & EU",
            content: "Đặc điểm nổi bật của nền kinh tế Hoa Kỳ là:",
            options: ["A. Quy mô GDP lớn nhất thế giới với cơ cấu ngành dịch vụ chiếm tỉ trọng áp đảo", "B. Nông nghiệp lạc hậu tự cung tự cấp", "C. Phụ thuộc hoàn toàn vào viện trợ", "D. Không có ngành công nghệ cao"],
            correct: "A",
            explanation: "Hoa Kỳ là nền kinh tế số một toàn cầu, trung tâm tài chính và đổi mới công nghệ cao (Silicon Valley, Wall Street)."
        },
        {
            id: "geo11_t3_q3",
            subject: "Địa Lí",
            grade: "11",
            period: "mid2",
            topic: "Địa lí Liên Bang Nga & Nhật Bản",
            content: "Nhật Bản phát triển kinh tế thần kì chủ yếu dựa vào nhân tố then chốt nào?",
            options: ["A. Con người được đào tạo trình độ cao, cần cù, kỷ luật và ứng dụng khoa học kỹ thuật hiện đại", "B. Nguồn tài nguyên khoáng sản dầu khí dồi dào", "C. Diện tích đất canh tác phì nhiêu rộng lớn", "D. Khí hậu nhiệt đới nắng ấm quanh năm"],
            correct: "A",
            explanation: "Nhật Bản nghèo nàn tài nguyên, tài nguyên quý giá nhất của họ là con người sáng tạo, kỷ luật và công nghệ tiên tiến."
        },
        {
            id: "geo11_t4_q3",
            subject: "Địa Lí",
            grade: "11",
            period: "final2",
            topic: "Địa lí Trung Quốc & Ấn Độ",
            content: "Chính sách kinh tế mang lại sự trỗi dậy mạnh mẽ cho nền kinh tế Trung Quốc từ năm 1978 là:",
            options: ["A. Công cuộc Cải cách và mở cửa", "B. Kinh tế bao cấp quan liêu khép kín", "C. Cấm đoán đầu tư nước ngoài", "D. Độc canh nông nghiệp lúa nước"],
            correct: "A",
            explanation: "Công cuộc Cải cách mở cửa (12/1978) đã đưa Trung Quốc trở thành công xưởng của thế giới và nền kinh tế lớn thứ hai."
        },
        {
            id: "geo11_t5_q3",
            subject: "Địa Lí",
            grade: "11",
            period: "final2",
            topic: "Địa lí khu vực Đông Nam Á (ASEAN)",
            content: "Hiệp hội các quốc gia Đông Nam Á (ASEAN) được thành lập vào năm nào tại Bangkok?",
            options: ["A. 1967", "B. 1975", "C. 1995", "D. 2000"],
            correct: "A",
            explanation: "ASEAN được thành lập ngày 08/08/1967 tại Bangkok (Thái Lan) với 5 nước sáng lập viên ban đầu."
        },
        {
            id: "dia11_m1_5",
            subject: "Địa Lí",
            grade: "11",
            period: "mid1",
            topic: "Toàn cầu hóa & Khu vực hóa kinh tế",
            content: "Tổ chức Thương mại Thế giới (WTO) có tôn chỉ hoạt động cơ bản là:",
            options: ["A. Tự do hóa thương mại và giải quyết các tranh chấp thương mại quốc tế", "B. Viện trợ quân sự đa phương", "C. Phát hành tiền tệ chung duy nhất cho thế giới", "D. Quản lý vệ tinh viễn thông"],
            correct: "A",
            explanation: "WTO thúc đẩy thương mại toàn cầu tự do, công bằng và đóng vai trò trọng tài xử lý tranh chấp giữa các thành viên."
        },
        {
            id: "dia11_m1_6",
            subject: "Địa Lí",
            grade: "11",
            period: "mid1",
            topic: "Địa lí Hoa Kỳ & EU",
            content: "Liên minh Châu Âu (EU) là tổ chức liên kết khu vực đạt mức độ hội nhập sâu sắc nhất thế giới thể hiện ở đặc điểm nào?",
            options: ["A. Có đồng tiền chung Euro và thị trường nội địa tự do lưu thông hàng hóa, dịch vụ, con người, tiền tệ", "B. Có quân đội chung tham chiến toàn cầu", "C. Tất cả các nước dùng chung một ngôn ngữ", "D. Không có biên giới hải quan với Châu Á"],
            correct: "A",
            explanation: "EU có 4 quyền tự do lưu thông và đồng tiền chung Euro, trở thành thực thể liên kết khu vực thành công nhất."
        },
        {
            id: "dia11_f1_4",
            subject: "Địa Lí",
            grade: "11",
            period: "final1",
            topic: "Địa lí Liên Bang Nga & Nhật Bản",
            content: "Nhật Bản phát triển nền kinh tế trở thành cường quốc thế giới chủ yếu dựa vào nhân tố then chốt nào?",
            options: ["A. Nguồn lực con người có trình độ cao, cần cù, sáng tạo và kỷ luật", "B. Nguồn tài nguyên khoáng sản giàu có", "C. Diện tích đất canh tác phì nhiêu rộng lớn", "D. Vị trí nằm ở trung tâm lục địa"],
            correct: "A",
            explanation: "Nhật Bản nghèo nàn tài nguyên thiên nhiên nhưng phát triển thần kỳ nhờ chú trọng con người và khoa học công nghệ."
        },
        {
            id: "dia11_m2_4",
            subject: "Địa Lí",
            grade: "11",
            period: "mid2",
            topic: "Địa lí Trung Quốc & Ấn Độ",
            content: "Chính sách công nghiệp hóa của Trung Quốc sau cải cách mở cửa năm 1978 tập trung ưu tiên phát triển:",
            options: ["A. Các đặc khu kinh tế ven biển thu hút vốn đầu tư nước ngoài (FDI)", "B. Khai thác than đá ở vùng cao nguyên Tây Tạng", "C. Độc quyền kinh tế nhà nước khép kín", "D. Chỉ phát triển công nghiệp quốc phòng"],
            correct: "A",
            explanation: "Các đặc khu kinh tế như Thâm Quyến, Chu Hải ven biển đã mở cửa đón dòng vốn FDI và công nghệ hiện đại."
        },
        {
            id: "dia11_f2_4",
            subject: "Địa Lí",
            grade: "11",
            period: "final2",
            topic: "Địa lí khu vực Đông Nam Á (ASEAN)",
            content: "Cộng đồng ASEAN được chính thức thành lập vào năm nào với ba trụ cột hợp tác?",
            options: ["A. Năm 2015", "B. Năm 1967", "C. Năm 1995", "D. Năm 2000"],
            correct: "A",
            explanation: "Ngày 31/12/2015, Cộng đồng ASEAN chính thức thành lập với 3 trụ cột: Chính trị - An ninh, Kinh tế, Văn hóa - Xã hội."
        },
    ],
    "GDKT&PL": [
        {
            id: "l11_1",
            subject: "GDKT&PL",
            grade: "11",
            period: "mid1",
            topic: "Cạnh tranh, cung cầu trong kinh tế thị trường",
            content: "Tác động tích cực hàng đầu của cạnh tranh lành mạnh trong sản xuất kinh doanh là:",
            options: ["A. Thúc đẩy cải tiến kĩ thuật, nâng cao năng suất và chất lượng sản phẩm", "B. Triệt hạ đối thủ bằng hàng giả", "C. Làm cạn kiệt tài nguyên thiên nhiên nhanh hơn", "D. Gây mất ổn định giá cả thị trường"],
            correct: "A",
            explanation: "Cạnh tranh lành mạnh buộc các chủ thể kinh doanh phải đổi mới công nghệ, nâng cao chất lượng để đáp ứng người tiêu dùng."
        },
        {
            id: "l11_2",
            subject: "GDKT&PL",
            grade: "11",
            period: "final1",
            topic: "Lạm phát & Thất nghiệp",
            content: "Hiện tượng nào sau đây phản ánh trạng thái 'lạm phát' trong nền kinh tế?",
            options: ["A. Mức giá chung của hầu hết các hàng hóa và dịch vụ tăng lên liên tục trong một thời gian", "B. Đồng tiền ngày càng có giá trị hơn", "C. Giá cả mọi hàng hóa đều giảm mạnh", "D. Lãi suất ngân hàng về mức 0%"],
            correct: "A",
            explanation: "Lạm phát là sự tăng mức giá chung một cách liên tục của hàng hóa và dịch vụ theo thời gian, làm giảm sức mua của đồng tiền."
        },
        {
            id: "l11_3",
            subject: "GDKT&PL",
            grade: "11",
            period: "final1",
            topic: "Thị trường lao động & Việc làm",
            content: "Nơi diễn ra các hoạt động trao đổi, thỏa thuận về tiền lương, điều kiện làm việc giữa người lao động và người sử dụng lao động gọi là:",
            options: ["A. Thị trường lao động", "B. Thị trường chứng khoán", "C. Thị trường hàng hóa", "D. Thị trường ngoại hối"],
            correct: "A",
            explanation: "Thị trường lao động là nơi kết nối giữa cung lao động (người tìm việc) và cầu lao động (doanh nghiệp tuyển dụng)."
        },
        {
            id: "l11_4",
            subject: "GDKT&PL",
            grade: "11",
            period: "mid2",
            topic: "Quyền bình đẳng của công dân",
            content: "Mọi công dân đều bình đẳng trước pháp luật có nghĩa là:",
            options: ["A. Bình đẳng về quyền, nghĩa vụ và trách nhiệm pháp lí mà không bị phân biệt đối xử", "B. Ai cũng phải có mức thu nhập bằng nhau", "C. Người có chức vụ cao thì được miễn trừ trách nhiệm pháp lí", "D. Không ai phải chịu hình phạt khi vi phạm"],
            correct: "A",
            explanation: "Bình đẳng trước pháp luật là nguyên tắc hiến định: mọi công dân đều bình đẳng về quyền, nghĩa vụ và trách nhiệm trước pháp luật."
        },
        {
            id: "l11_5",
            subject: "GDKT&PL",
            grade: "11",
            period: "final2",
            topic: "Quyền tự do cơ bản của công dân",
            content: "Hành vi tự ý vào chỗ ở của người khác mà không được người đó đồng ý hoặc không có lệnh của cơ quan có thẩm quyền là xâm phạm quyền:",
            options: ["A. Quyền bất khả xâm phạm về chỗ ở của công dân", "B. Quyền tự do cư trú", "C. Quyền tự do ngôn luận", "D. Quyền sở hữu trí tuệ"],
            correct: "A",
            explanation: "Chỗ ở của công dân được pháp luật bảo hộ, không ai được tự ý vào chỗ ở của người khác nếu không được sự đồng ý hoặc lệnh khám xét hợp pháp."
        },
        {
            id: "law11_t1_q3",
            subject: "GDKT&PL",
            grade: "11",
            period: "mid1",
            topic: "Cạnh tranh, cung cầu trong kinh tế thị trường",
            content: "Mặt tích cực của cạnh tranh lành mạnh trong kinh tế thị trường là:",
            options: ["A. Kích thích đổi mới công nghệ, nâng cao chất lượng sản phẩm và hạ giá thành", "B. Dùng thủ đoạn bôi nhọ đối thủ", "C. Buôn lậu trốn thuế", "D. Làm suy kiệt tài nguyên thiên nhiên"],
            correct: "A",
            explanation: "Cạnh tranh lành mạnh là động lực thúc đẩy doanh nghiệp cải tiến kĩ thuật, giảm chi phí sản xuất để phục vụ người tiêu dùng tốt hơn."
        },
        {
            id: "law11_t2_q3",
            subject: "GDKT&PL",
            grade: "11",
            period: "final1",
            topic: "Lạm phát & Thất nghiệp",
            content: "Hiện tượng giá cả hàng hóa, dịch vụ tăng liên tục trong một thời gian dài dẫn đến đồng tiền mất giá được gọi là:",
            options: ["A. Lạm phát", "B. Giảm phát", "C. Khủng hoảng thừa", "D. Thiếu hụt vốn"],
            correct: "A",
            explanation: "Lạm phát (Inflation) là sự gia tăng mức giá chung liên tục của hàng hóa và dịch vụ trong nền kinh tế."
        },
        {
            id: "law11_t3_q3",
            subject: "GDKT&PL",
            grade: "11",
            period: "mid2",
            topic: "Thị trường lao động & Việc làm",
            content: "Người lao động tham gia thị trường lao động cung cấp yếu tố nào cho doanh nghiệp?",
            options: ["A. Sức lao động (thể lực và trí lực)", "B. Mặt bằng kinh doanh", "C. Máy móc nhà xưởng", "D. Giấy phép kinh doanh"],
            correct: "A",
            explanation: "Người lao động bán sức lao động để nhận tiền lương từ người sử dụng lao động theo hợp đồng thỏa thuận."
        },
        {
            id: "law11_t4_q3",
            subject: "GDKT&PL",
            grade: "11",
            period: "final2",
            topic: "Quyền bình đẳng của công dân",
            content: "Bình đẳng trước pháp luật có nghĩa là mọi công dân:",
            options: ["A. Đều bình đẳng về quyền, nghĩa vụ và trách nhiệm pháp lí không phân biệt đối xử", "B. Đều có thu nhập tài chính bằng nhau tuyệt đối", "C. Đều giữ chức vụ lãnh đạo nhà nước", "D. Không ai phải chịu hình phạt nào"],
            correct: "A",
            explanation: "Mọi công dân không phân biệt giới tính, dân tộc, tôn giáo đều bình đẳng trong việc hưởng quyền và chấp hành nghĩa vụ."
        },
        {
            id: "law11_t5_q3",
            subject: "GDKT&PL",
            grade: "11",
            period: "final2",
            topic: "Quyền tự do cơ bản của công dân",
            content: "Hành vi nào sau đây xâm phạm quyền bất khả xâm phạm về thân thể của công dân?",
            options: ["A. Tự ý bắt giam giữ người trái pháp luật", "B. Khám xét nhà có lệnh của Viện kiểm sát", "C. Bắt người phạm tội quả tang", "D. Tạm giữ đối tượng truy nã đặc biệt nguy hiểm"],
            correct: "A",
            explanation: "Không ai bị bắt nếu không có quyết định của Tòa án, quyết định hoặc phê chuẩn của Viện kiểm sát, trừ trường hợp phạm tội quả tang."
        },
        {
            id: "ktpl11_m1_3",
            subject: "GDKT&PL",
            grade: "11",
            period: "mid1",
            topic: "Cạnh tranh, cung cầu trong kinh tế thị trường",
            content: "Khi cung nhỏ hơn cầu (hàng hóa khan hiếm trong khi nhu cầu người mua cao) thì giá cả thị trường có xu hướng:",
            options: ["A. Tăng lên cao hơn giá trị hàng hóa", "B. Giảm mạnh xuống dưới giá trị", "C. Giữ nguyên không đổi", "D. Bằng 0"],
            correct: "A",
            explanation: "Quy luật cung cầu chỉ rõ: khi Cung < Cầu, người mua cạnh tranh nhau đẩy giá cả tăng lên."
        },
        {
            id: "ktpl11_m1_4",
            subject: "GDKT&PL",
            grade: "11",
            period: "mid1",
            topic: "Lạm phát & Thất nghiệp",
            content: "Lạm phát vừa phải (mức tăng giá dưới 10% mỗi năm) có tác động như thế nào đến nền kinh tế?",
            options: ["A. Kích thích sản xuất kinh doanh và tiêu dùng phát triển", "B. Phá hủy hoàn toàn hệ thống tiền tệ", "C. Làm đóng cửa mọi doanh nghiệp", "D. Khiến mọi người không thể mua hàng hóa"],
            correct: "A",
            explanation: "Lạm phát nhẹ tạo động lực cho các doanh nghiệp mở rộng quy mô đầu tư và người dân chi tiêu, kích thích kinh tế."
        },
        {
            id: "ktpl11_f1_4",
            subject: "GDKT&PL",
            grade: "11",
            period: "final1",
            topic: "Thị trường lao động & Việc làm",
            content: "Hợp đồng lao động bằng văn bản giữa người lao động và người sử dụng lao động có ý nghĩa pháp lý gì?",
            options: ["A. Xác lập quyền và nghĩa vụ của hai bên, bảo vệ quyền lợi hợp pháp của người lao động", "B. Bắt buộc người lao động không bao giờ được nghỉ việc", "C. Chuyển quyền công dân cho công ty", "D. Miễn thuế thu nhập vĩnh viễn"],
            correct: "A",
            explanation: "Hợp đồng lao động là căn cứ pháp lý bảo vệ tiền lương, thời giờ làm việc, bảo hiểm và an toàn lao động."
        },
        {
            id: "ktpl11_m2_3",
            subject: "GDKT&PL",
            grade: "11",
            period: "mid2",
            topic: "Quyền bình đẳng của công dân",
            content: "Quyền bình đẳng của công dân trước pháp luật có nghĩa là:",
            options: ["A. Mọi công dân đều bình đẳng về quyền, nghĩa vụ và trách nhiệm pháp lý không phân biệt đối xử", "B. Mọi người đều có mức thu nhập bằng nhau", "C. Mọi người đều làm cùng một nghề", "D. Ai cũng được giữ chức vụ lãnh đạo"],
            correct: "A",
            explanation: "Bình đẳng trước pháp luật bảo đảm không ai đứng trên pháp luật và không bị phân biệt đối xử vì giới tính, dân tộc, tôn giáo."
        },
        {
            id: "ktpl11_f2_4",
            subject: "GDKT&PL",
            grade: "11",
            period: "final2",
            topic: "Quyền tự do cơ bản của công dân",
            content: "Hành vi tự ý vào chỗ ở của người khác mà không được người đó đồng ý hoặc không có lệnh khám xét của cơ quan có thẩm quyền đã xâm phạm đến:",
            options: ["A. Quyền bất khả xâm phạm về chỗ ở của công dân", "B. Quyền tự do kinh doanh", "C. Quyền học tập", "D. Quyền bầu cử"],
            correct: "A",
            explanation: "Chỗ ở của công dân là bất khả xâm phạm, không ai được tự ý vào nếu pháp luật không cho phép."
        },
    ],
    "Tiếng Anh": [
        {
            id: "e11_1",
            subject: "Tiếng Anh",
            grade: "11",
            period: "mid1",
            topic: "A Long and Healthy Life",
            content: "Eating a balanced diet and doing regular exercise are key habits to maintain a ________ lifestyle.",
            options: ["A. healthy", "B. healthily", "C. health", "D. healthier"],
            correct: "A",
            explanation: "Cần một tính từ trước danh từ 'lifestyle': 'healthy lifestyle' (lối sống lành mạnh)."
        },
        {
            id: "e11_2",
            subject: "Tiếng Anh",
            grade: "11",
            period: "mid1",
            topic: "The Generation Gap",
            content: "Differences in musical tastes and viewpoints between teenagers and their parents often cause a generation ________.",
            options: ["A. gap", "B. hole", "C. space", "D. break"],
            correct: "A",
            explanation: "Cụm danh từ cố định: 'generation gap' nghĩa là khoảng cách thế hệ."
        },
        {
            id: "e11_3",
            subject: "Tiếng Anh",
            grade: "11",
            period: "final1",
            topic: "Cities of the Future",
            content: "In smart cities of the future, most public transport will be powered by ________ energy.",
            options: ["A. renewable", "B. exhaustible", "C. dangerous", "D. polluting"],
            correct: "A",
            explanation: "'Renewable energy' nghĩa là năng lượng tái tạo (như điện mặt trời, điện gió), phù hợp với đô thị tương lai xanh sạch."
        },
        {
            id: "e11_4",
            subject: "Tiếng Anh",
            grade: "11",
            period: "mid2",
            topic: "ASEAN and Viet Nam",
            content: "Viet Nam officially became the seventh member of ASEAN ________ July 28th, 1995.",
            options: ["A. on", "B. in", "C. at", "D. since"],
            correct: "A",
            explanation: "Đi với ngày tháng cụ thể (July 28th, 1995) dùng giới từ 'on'."
        },
        {
            id: "e11_5",
            subject: "Tiếng Anh",
            grade: "11",
            period: "final2",
            topic: "Global Warming & Climate Change",
            content: "Rising sea levels and severe droughts are direct consequences of global ________.",
            options: ["A. warming", "B. heating", "C. cooling", "D. freezing"],
            correct: "A",
            explanation: "Cụm từ quen thuộc: 'global warming' là hiện tượng nóng lên toàn cầu."
        },
        {
            id: "e11_extra1",
            subject: "Tiếng Anh",
            grade: "11",
            period: "mid1",
            topic: "A Long and Healthy Life",
            content: "Regular meditation and mindfulness practices help reduce stress and improve mental ________.",
            options: ["A. health", "B. illness", "C. weakness", "D. fatigue"],
            correct: "A",
            explanation: "'mental health' nghĩa là sức khỏe tinh thần."
        },
        {
            id: "e11_extra2",
            subject: "Tiếng Anh",
            grade: "11",
            period: "mid1",
            topic: "The Generation Gap",
            content: "Parents should listen with an open mind to understand their children's point of ________.",
            options: ["A. view", "B. sight", "C. eye", "D. look"],
            correct: "A",
            explanation: "'point of view' nghĩa là quan điểm, góc nhìn."
        },
        {
            id: "e11_extra3",
            subject: "Tiếng Anh",
            grade: "11",
            period: "final1",
            topic: "Cities of the Future",
            content: "Smart sensors installed across the city will monitor traffic flow to prevent traffic ________.",
            options: ["A. jams", "B. stops", "C. lights", "D. cars"],
            correct: "A",
            explanation: "'traffic jams' nghĩa là ùn tắc giao thông."
        },
        {
            id: "e11_extra4",
            subject: "Tiếng Anh",
            grade: "11",
            period: "final2",
            topic: "Global Warming & Climate Change",
            content: "Deforestation releases huge amounts of carbon dioxide into the ________.",
            options: ["A. atmosphere", "B. hydrosphere", "C. lithosphere", "D. core"],
            correct: "A",
            explanation: "'atmosphere' nghĩa là bầu khí quyển."
        },
        {
            id: "eng11_t1_q3",
            subject: "Tiếng Anh",
            grade: "11",
            period: "mid1",
            topic: "A Long and Healthy Life",
            content: "Eating a balanced diet and exercising regularly can boost your ______ system to fight off diseases.",
            options: ["A. immune", "B. nervous", "C. digestive", "D. skeletal"],
            correct: "A",
            explanation: "Immune system: Hệ miễn dịch của cơ thể giúp chống lại virus, vi khuẩn gây bệnh."
        },
        {
            id: "eng11_t2_q3",
            subject: "Tiếng Anh",
            grade: "11",
            period: "final1",
            topic: "The Generation Gap",
            content: "Different opinions on fashion and lifestyle often lead to conflicts between parents and their ______ children.",
            options: ["A. teenage", "B. elderly", "C. infant", "D. middle-aged"],
            correct: "A",
            explanation: "Teenage children: Con cái ở độ tuổi thanh thiếu niên thường có bất đồng quan điểm sống với cha mẹ (khoảng cách thế hệ)."
        },
        {
            id: "eng11_t3_q3",
            subject: "Tiếng Anh",
            grade: "11",
            period: "mid2",
            topic: "Cities of the Future",
            content: "Smart cities of the future will rely heavily on ______ sources like solar and wind power.",
            options: ["A. renewable", "B. non-renewable", "C. fossil", "D. harmful"],
            correct: "A",
            explanation: "Renewable energy sources: Các nguồn năng lượng tái tạo (mặt trời, gió, thủy triều) thân thiện môi trường."
        },
        {
            id: "eng11_t4_q3",
            subject: "Tiếng Anh",
            grade: "11",
            period: "final2",
            topic: "ASEAN and Viet Nam",
            content: "Viet Nam officially became a full member of ASEAN in ______.",
            options: ["A. 1995", "B. 1986", "C. 2000", "D. 2007"],
            correct: "A",
            explanation: "Việt Nam chính thức gia nhập ASEAN vào ngày 28/07/1995 tại Hội nghị Ngoại trưởng lần thứ 28 ở Brunei."
        },
        {
            id: "eng11_t5_q3",
            subject: "Tiếng Anh",
            grade: "11",
            period: "final2",
            topic: "Global Warming & Climate Change",
            content: "Global warming causes extreme weather events and rising sea ______ worldwide.",
            options: ["A. levels", "B. heights", "C. depths", "D. lengths"],
            correct: "A",
            explanation: "Sea levels (mực nước biển): Sự nóng lên toàn cầu làm băng tan ở hai cực và dâng cao mực nước biển."
        },
        {
            id: "eng11_m1_6",
            subject: "Tiếng Anh",
            grade: "11",
            period: "mid1",
            topic: "A Long and Healthy Life",
            content: "Regular exercise and a balanced diet are essential to ________ a healthy lifestyle.",
            options: ["A. maintain", "B. destroy", "C. waste", "D. ignore"],
            correct: "A",
            explanation: "'maintain a healthy lifestyle' means duy trì lối sống lành mạnh."
        },
        {
            id: "eng11_m1_7",
            subject: "Tiếng Anh",
            grade: "11",
            period: "mid1",
            topic: "The Generation Gap",
            content: "The differences in attitudes and beliefs between young people and older generations are known as the ________.",
            options: ["A. generation gap", "B. digital divide", "C. communication failure", "D. peer pressure"],
            correct: "A",
            explanation: "'Generation gap' có nghĩa là khoảng cách thế hệ giữa các lứa tuổi."
        },
        {
            id: "eng11_f1_4",
            subject: "Tiếng Anh",
            grade: "11",
            period: "final1",
            topic: "Cities of the Future",
            content: "Smart cities use advanced technologies and renewable energy to reduce their ________ footprint.",
            options: ["A. carbon", "B. plastic", "C. water", "D. chemical"],
            correct: "A",
            explanation: "'Carbon footprint' nghĩa là dấu chân carbon / lượng khí thải carbon."
        },
        {
            id: "eng11_m2_3",
            subject: "Tiếng Anh",
            grade: "11",
            period: "mid2",
            topic: "ASEAN and Viet Nam",
            content: "Viet Nam officially became a full member of ASEAN in ________.",
            options: ["A. 1995", "B. 1986", "C. 2000", "D. 1975"],
            correct: "A",
            explanation: "Việt Nam gia nhập ASEAN vào ngày 28 tháng 7 năm 1995."
        },
        {
            id: "eng11_f2_5",
            subject: "Tiếng Anh",
            grade: "11",
            period: "final2",
            topic: "Global Warming & Climate Change",
            content: "Global warming is primarily driven by the excessive emission of ________ gases.",
            options: ["A. greenhouse", "B. oxygen", "C. nitrogen", "D. noble"],
            correct: "A",
            explanation: "'Greenhouse gases' nghĩa là các khí gây hiệu ứng nhà kính (CO2, CH4...)."
        },
    ],
    "Tin Học": [
        {
            id: "t11_1",
            subject: "Tin Học",
            grade: "11",
            period: "mid1",
            topic: "Hệ điều hành & Ứng dụng",
            content: "Hệ điều hành đóng vai trò là cầu nối trung gian giữa:",
            options: ["A. Người dùng, phần mềm ứng dụng và phần cứng máy tính", "B. Màn hình và bàn phím", "C. Máy in và chuột", "D. Nguồn điện và bo mạch chủ"],
            correct: "A",
            explanation: "Hệ điều hành quản lý tài nguyên phần cứng và cung cấp môi trường chạy cho các phần mềm ứng dụng."
        },
        {
            id: "t11_2",
            subject: "Tin Học",
            grade: "11",
            period: "final1",
            topic: "Cơ sở dữ liệu quan hệ (RDBMS)",
            content: "Trong một bảng dữ liệu quan hệ, mỗi hàng (row) biểu diễn một:",
            options: ["A. Bản ghi (Record / Tuple) chứa thông tin của một đối tượng", "B. Thuộc tính (Attribute)", "C. Khóa chính duy nhất", "D. Tên bảng"],
            correct: "A",
            explanation: "Trong mô hình quan hệ, mỗi hàng là một bản ghi biểu diễn dữ liệu của một thực thể cụ thể."
        },
        {
            id: "t11_3",
            subject: "Tin Học",
            grade: "11",
            period: "final1",
            topic: "Truy vấn CSDL với SQL",
            content: "Câu lệnh SQL nào sau đây dùng để lọc và lấy các bản ghi có điều kiện từ bảng dữ liệu?",
            options: ["A. SELECT * FROM Bảng WHERE Điều_kiện;", "B. INSERT INTO Bảng;", "C. DROP TABLE Bảng;", "D. CREATE TABLE Bảng;"],
            correct: "A",
            explanation: "Mệnh đề `SELECT ... WHERE ...` dùng để truy vấn và lọc dữ liệu thỏa mãn điều kiện chỉ định."
        },
        {
            id: "t11_4",
            subject: "Tin Học",
            grade: "11",
            period: "mid2",
            topic: "Thiết kế trang web (HTML/CSS)",
            content: "Ngôn ngữ HTML sử dụng các thẻ (tag) để làm gì khi xây dựng trang web?",
            options: ["A. Định nghĩa cấu trúc và nội dung của trang web", "B. Tính toán thuật toán phức tạp", "C. Quản lý hệ điều hành máy chủ", "D. Nén dữ liệu tệp tin"],
            correct: "A",
            explanation: "HTML (HyperText Markup Language) là ngôn ngữ đánh dấu siêu văn bản định hình bố cục, văn bản và liên kết web."
        },
        {
            id: "t11_5",
            subject: "Tin Học",
            grade: "11",
            period: "final2",
            topic: "An toàn thông tin mạng",
            content: "Biện pháp nào sau đây giúp phòng tránh nguy cơ bị đánh cắp thông tin cá nhân qua mạng xã hội?",
            options: ["A. Kích hoạt xác thực 2 yếu tố (2FA) và không bấm vào link lạ", "B. Đặt mật khẩu đơn giản '123456' để dễ nhớ", "C. Đăng công khai số CCCD và tài khoản ngân hàng lên mạng", "D. Chia sẻ mã OTP cho người tự xưng là công an qua điện thoại"],
            correct: "A",
            explanation: "Xác thực hai yếu tố (2FA) và cảnh giác với các đường link lừa đảo (phishing) là nguyên tắc an toàn mạng cơ bản."
        },
        {
            id: "t11_extra1",
            subject: "Tin Học",
            grade: "11",
            period: "final1",
            topic: "Cơ sở dữ liệu quan hệ (RDBMS)",
            content: "Khóa chính (Primary Key) trong một bảng cơ sở dữ liệu quan hệ có vai trò gì?",
            options: ["A. Xác định duy nhất mỗi bản ghi trong bảng và không được chứa giá trị rỗng (NULL) hay trùng lặp", "B. Lưu trữ mật khẩu người dùng", "C. Đổi tên của bảng", "D. Tự động tính toán tổng số tiền"],
            correct: "A",
            explanation: "Khóa chính đảm bảo tính toàn vẹn thực thể, giúp định danh chính xác từng hàng dữ liệu."
        },
        {
            id: "t11_extra2",
            subject: "Tin Học",
            grade: "11",
            period: "final1",
            topic: "Truy vấn CSDL với SQL",
            content: "Mệnh đề SQL nào dùng để sắp xếp kết quả trả về theo thứ tự tăng dần hoặc giảm dần?",
            options: ["A. ORDER BY", "B. GROUP BY", "C. HAVING", "D. WHERE"],
            correct: "A",
            explanation: "`ORDER BY cot [ASC|DESC]` dùng để sắp xếp kết quả truy vấn SQL."
        },
        {
            id: "t11_extra3",
            subject: "Tin Học",
            grade: "11",
            period: "mid2",
            topic: "Thiết kế trang web (HTML/CSS)",
            content: "Ngôn ngữ CSS (Cascading Style Sheets) được sử dụng nhằm mục đích chủ yếu nào?",
            options: ["A. Định kiểu dáng, màu sắc, font chữ và bố cục giao diện cho trang web", "B. Quản lý cơ sở dữ liệu máy chủ", "C. Tạo kết nối mạng internet", "D. Biên dịch mã nguồn nhị phân"],
            correct: "A",
            explanation: "CSS làm đẹp và quy định thẩm mỹ giao diện cho các phần tử HTML."
        },
        {
            id: "cs11_t1_q3",
            subject: "Tin Học",
            grade: "11",
            period: "mid1",
            topic: "Hệ điều hành & Ứng dụng",
            content: "Chức năng cốt lõi quan trọng nhất của Hệ điều hành (Operating System) là:",
            options: ["A. Quản lý tài nguyên phần cứng máy tính và cung cấp môi trường giao tiếp cho người dùng", "B. Quét mã độc virus", "C. Chỉnh sửa video 4K", "D. Đăng tải website lên mạng"],
            correct: "A",
            explanation: "Hệ điều hành (Windows, Linux, macOS) điều phối CPU, RAM, ổ cứng và cung cấp giao diện tương tác cho ứng dụng."
        },
        {
            id: "cs11_t2_q3",
            subject: "Tin Học",
            grade: "11",
            period: "final1",
            topic: "Cơ sở dữ liệu quan hệ (RDBMS)",
            content: "Khóa ngoại (Foreign Key) trong một bảng cơ sở dữ liệu dùng để làm gì?",
            options: ["A. Tạo liên kết và đảm bảo tính toàn vẹn tham chiếu với khóa chính của bảng khác", "B. Khóa bảo mật mật khẩu", "C. Đếm số bản ghi", "D. Xóa dữ liệu tự động"],
            correct: "A",
            explanation: "Khóa ngoại trỏ đến khóa chính ở bảng khác để thiết lập mối quan hệ 1-nhiều hoặc nhiều-nhiều giữa các thực thể."
        },
        {
            id: "cs11_t3_q3",
            subject: "Tin Học",
            grade: "11",
            period: "mid2",
            topic: "Truy vấn CSDL với SQL",
            content: "Mệnh đề nào trong câu lệnh SQL dùng để sắp xếp kết quả truy vấn theo thứ tự tăng dần hoặc giảm dần?",
            options: ["A. ORDER BY", "B. GROUP BY", "C. WHERE", "D. HAVING"],
            correct: "A",
            explanation: "ORDER BY [cột] ASC (tăng dần) hoặc DESC (giảm dần) dùng để sắp thứ tự các dòng kết quả."
        },
        {
            id: "cs11_t4_q3",
            subject: "Tin Học",
            grade: "11",
            period: "final2",
            topic: "Thiết kế trang web (HTML/CSS)",
            content: "Trong tài liệu HTML, thẻ nào sau đây dùng để chèn liên kết siêu văn bản (hyperlink)?",
            options: ["A. <a>", "B. <link>", "C. <href>", "D. <p>"],
            correct: "A",
            explanation: "Thẻ <a href='url'>Văn bản hiển thị</a> tạo liên kết chuyển hướng đến trang web khác."
        },
        {
            id: "cs11_t5_q3",
            subject: "Tin Học",
            grade: "11",
            period: "final2",
            topic: "An toàn thông tin mạng",
            content: "Phương thức tấn công lừa đảo người dùng cung cấp thông tin tài khoản qua email hoặc website giả mạo gọi là:",
            options: ["A. Phishing", "B. DDoS", "C. Ransomware", "D. Spyware"],
            correct: "A",
            explanation: "Phishing (tấn công mạo danh) giả mạo ngân hàng, mạng xã hội để lừa nạn nhân tự nhập mật khẩu, mã OTP."
        },
        {
            id: "cs11_mid1_extra1",
            subject: "Tin Học",
            grade: "11",
            period: "mid1",
            topic: "Hệ điều hành & Ứng dụng",
            content: "Phần mềm nguồn mở (Open Source Software) có đặc điểm nổi bật nào sau đây?",
            options: ["A. Người dùng được tự do xem, sửa đổi và phân phối lại mã nguồn", "B. Bắt buộc phải trả phí bản quyền hàng năm", "C. Mã nguồn được giữ bí mật tuyệt đối", "D. Chỉ chạy được trên một dòng máy tính duy nhất"],
            correct: "A",
            explanation: "Phần mềm nguồn mở (như Linux, LibreOffice) công khai mã nguồn cho cộng đồng nghiên cứu, cải tiến và chia sẻ."
        },
        {
            id: "cs11_mid1_extra2",
            subject: "Tin Học",
            grade: "11",
            period: "mid1",
            topic: "Hệ điều hành & Ứng dụng",
            content: "Hệ điều hành nào sau đây là hệ điều hành mã nguồn mở phổ biến nhất trên thế giới?",
            options: ["A. Linux", "B. Microsoft Windows 11", "C. macOS", "D. MS-DOS"],
            correct: "A",
            explanation: "Linux do Linus Torvalds phát triển là hệ điều hành mã nguồn mở tiêu biểu, làm nền tảng cho Android và hầu hết máy chủ web."
        },
        {
            id: "cs11_mid1_extra3",
            subject: "Tin Học",
            grade: "11",
            period: "mid1",
            topic: "Hệ điều hành & Ứng dụng",
            content: "Trong hệ điều hành, cơ chế quản lý đa nhiệm (Multitasking) cho phép máy tính:",
            options: ["A. Thực thi đồng thời nhiều chương trình cùng một lúc", "B. Chỉ chạy một ứng dụng duy nhất cho đến khi tắt máy", "C. Tự động xóa dữ liệu khi đầy bộ nhớ", "D. Tắt máy tính không cần lưu file"],
            correct: "A",
            explanation: "Đa nhiệm (Multitasking) phân chia thời gian xử lý của CPU để nhiều tiến trình cùng chạy đồng thời một cách mượt mà."
        },
        {
            id: "cs11_mid1_extra4",
            subject: "Tin Học",
            grade: "11",
            period: "mid1",
            topic: "Hệ điều hành & Ứng dụng",
            content: "Hệ thống tệp (File System) như NTFS hoặc FAT32 có chức năng gì trong hệ điều hành?",
            options: ["A. Tổ chức, quản lý và lưu trữ các tệp tin và thư mục trên ổ đĩa", "B. Kết nối mạng Wi-Fi", "C. Tăng tốc độ quay của quạt tản nhiệt", "D. Chống virus trực tiếp"],
            correct: "A",
            explanation: "Hệ thống tệp quy định cách thức đặt tên, phân bổ cluster và truy xuất dữ liệu lưu trữ trên các thiết bị nhớ."
        },
        {
            id: "cs11_mid1_extra5",
            subject: "Tin Học",
            grade: "11",
            period: "mid1",
            topic: "Hệ điều hành & Ứng dụng",
            content: "Giao diện đồ họa người dùng (GUI - Graphical User Interface) tương tác với người dùng chủ yếu thông qua:",
            options: ["A. Cửa sổ, biểu tượng (icon), chuột và bảng chọn (menu)", "B. Chỉ dòng lệnh văn bản màu trắng đen", "C. Băng từ đục lỗ", "D. Công tắc gạt cơ học"],
            correct: "A",
            explanation: "GUI sử dụng các thành phần trực quan (WIMP: Windows, Icons, Menus, Pointer) giúp người dùng sử dụng máy tính trực quan, dễ dàng."
        },
        {
            id: "cs11_mid1_extra6",
            subject: "Tin Học",
            grade: "11",
            period: "mid1",
            topic: "Hệ điều hành & Ứng dụng",
            content: "Phần mềm thương mại (Commercial Software) là loại phần mềm:",
            options: ["A. Được phát triển để bán thu lợi nhuận và người dùng phải mua bản quyền sử dụng", "B. Hoàn toàn miễn phí cho mọi mục đích", "C. Được tặng kèm tự do", "D. Luôn cung cấp mã nguồn gốc"],
            correct: "A",
            explanation: "Phần mềm thương mại (như Microsoft Office, Adobe Photoshop) được bảo vệ bản quyền nghiêm ngặt, người dùng phải trả phí giấy phép bản quyền."
        },
        {
            id: "cs11_mid1_extra7",
            subject: "Tin Học",
            grade: "11",
            period: "mid1",
            topic: "Hệ điều hành & Ứng dụng",
            content: "Bộ nhớ ảo (Virtual Memory) trong hệ điều hành được tạo ra bằng cách kết hợp giữa:",
            options: ["A. Bộ nhớ RAM và một phần dung lượng ổ đĩa cứng (Paging file)", "B. ROM và Flash USB", "C. Bộ nhớ Cache và bàn phím", "D. Card đồ họa và màn hình"],
            correct: "A",
            explanation: "Bộ nhớ ảo sử dụng một phần ổ cứng làm không gian hoán đổi trang (swap/pagefile) khi bộ nhớ RAM vật lý bị đầy."
        },
        {
            id: "cs11_fin1_extra1",
            subject: "Tin Học",
            grade: "11",
            period: "final1",
            topic: "Cơ sở dữ liệu quan hệ (RDBMS)",
            content: "Một hàng (row) trong một bảng của cơ sở dữ liệu quan hệ được gọi là:",
            options: ["A. Bản ghi (Record / Tuple)", "B. Thuộc tính (Field)", "C. Khóa chính", "D. Kiểu dữ liệu"],
            correct: "A",
            explanation: "Mỗi hàng trong bảng biểu diễn một đối tượng thực tế cụ thể, được gọi là một bản ghi (record hoặc tuple)."
        },
        {
            id: "cs11_fin1_extra2",
            subject: "Tin Học",
            grade: "11",
            period: "final1",
            topic: "Cơ sở dữ liệu quan hệ (RDBMS)",
            content: "Một cột (column) trong một bảng của cơ sở dữ liệu quan hệ biểu diễn:",
            options: ["A. Thuộc tính (Field / Attribute) của đối tượng", "B. Một bản ghi hoàn chỉnh", "C. Một bảng liên kết", "D. Toàn bộ cơ sở dữ liệu"],
            correct: "A",
            explanation: "Mỗi cột chứa một đặc tính hay thuộc tính của các đối tượng (ví dụ: HoTen, NgaySinh, DiemToan)."
        },
        {
            id: "cs11_fin1_extra3",
            subject: "Tin Học",
            grade: "11",
            period: "final1",
            topic: "Cơ sở dữ liệu quan hệ (RDBMS)",
            content: "Hệ quản trị cơ sở dữ liệu (DBMS - Database Management System) nào sau đây là hệ quản trị CSDL quan hệ?",
            options: ["A. MySQL, PostgreSQL, Microsoft SQL Server", "B. Windows, Linux, Android", "C. Word, Excel, PowerPoint", "D. Photoshop, Illustrator"],
            correct: "A",
            explanation: "MySQL, PostgreSQL, Oracle, MS SQL Server là các hệ quản trị CSDL quan hệ (RDBMS) phổ biến nhất hiện nay."
        },
        {
            id: "cs11_fin1_extra4",
            subject: "Tin Học",
            grade: "11",
            period: "final1",
            topic: "Cơ sở dữ liệu quan hệ (RDBMS)",
            content: "Tính toàn vẹn thực thể (Entity Integrity) trong cơ sở dữ liệu quan hệ đòi hỏi:",
            options: ["A. Giá trị của khóa chính không được phép mang giá trị rỗng (NULL) và không được trùng lặp", "B. Bảng nào cũng phải có 100 cột", "C. Dữ liệu chỉ được chứa chữ số", "D. Khóa chính phải tự động xóa sau 1 năm"],
            correct: "A",
            explanation: "Khóa chính phải định danh duy nhất từng bản ghi nên tuyệt đối không được nhận giá trị rỗng (NOT NULL)."
        },
        {
            id: "cs11_mid2_extra1",
            subject: "Tin Học",
            grade: "11",
            period: "mid2",
            topic: "Truy vấn CSDL với SQL",
            content: "Để thêm một bản ghi mới vào bảng HOC_SINH trong SQL, ta dùng lệnh nào?",
            options: ["A. INSERT INTO HOC_SINH VALUES (...);", "B. ADD TO HOC_SINH (...);", "C. UPDATE HOC_SINH SET (...);", "D. CREATE RECORD HOC_SINH (...);"],
            correct: "A",
            explanation: "Cú pháp thêm dữ liệu vào bảng trong SQL: INSERT INTO [TenBang] (cac_cot) VALUES (cac_gia_tri);"
        },
        {
            id: "cs11_mid2_extra2",
            subject: "Tin Học",
            grade: "11",
            period: "mid2",
            topic: "Truy vấn CSDL với SQL",
            content: "Để cập nhật điểm môn Tin của học sinh có MaHS = 'HS01' thành 9.5, câu lệnh SQL đúng là:",
            options: ["A. UPDATE HOC_SINH SET DiemTin = 9.5 WHERE MaHS = 'HS01';", "B. CHANGE HOC_SINH DiemTin = 9.5 IF MaHS = 'HS01';", "C. MODIFY HOC_SINH (DiemTin = 9.5);", "D. SET DiemTin = 9.5 IN HOC_SINH;"],
            correct: "A",
            explanation: "Cú pháp cập nhật dữ liệu: UPDATE [TenBang] SET [Cot] = [GiaTri] WHERE [DieuKien];"
        },
        {
            id: "cs11_mid2_extra3",
            subject: "Tin Học",
            grade: "11",
            period: "mid2",
            topic: "Truy vấn CSDL với SQL",
            content: "Để xóa hoàn toàn bản ghi của học sinh có MaHS = 'HS05' khỏi bảng HOC_SINH, lệnh SQL là:",
            options: ["A. DELETE FROM HOC_SINH WHERE MaHS = 'HS05';", "B. DROP HOC_SINH WHERE MaHS = 'HS05';", "C. REMOVE FROM HOC_SINH IF MaHS = 'HS05';", "D. CLEAR RECORD MaHS = 'HS05';"],
            correct: "A",
            explanation: "DELETE FROM [TenBang] WHERE [DieuKien]; dùng để xóa các dòng dữ liệu thỏa mãn điều kiện."
        },
        {
            id: "cs11_mid2_extra4",
            subject: "Tin Học",
            grade: "11",
            period: "mid2",
            topic: "Thiết kế trang web (HTML/CSS)",
            content: "Trong mã nguồn HTML, thẻ nào dùng để chèn hình ảnh vào trang web?",
            options: ["A. <img src='duong_dan_anh' alt='mo_ta'>", "B. <picture link='url'>", "C. <image href='url'>", "D. <photo src='url'>"],
            correct: "A",
            explanation: "Thẻ <img src='...'> là thẻ đơn dùng để nhúng hình ảnh vào tài liệu HTML."
        },
        {
            id: "cs11_mid2_extra5",
            subject: "Tin Học",
            grade: "11",
            period: "mid2",
            topic: "Thiết kế trang web (HTML/CSS)",
            content: "CSS (Cascading Style Sheets) có vai trò chính là gì trong thiết kế website?",
            options: ["A. Quy định cách trình bày, màu sắc, phông chữ và bố cục giao diện của trang web", "B. Lưu trữ cơ sở dữ liệu trên máy chủ", "C. Thực thi các phép toán logic phức tạp", "D. Mã hóa đường truyền mạng"],
            correct: "A",
            explanation: "HTML tạo bộ khung cấu trúc, còn CSS định dạng phong cách giao diện hiển thị cho website."
        },
        {
            id: "cs11_fin2_extra1",
            subject: "Tin Học",
            grade: "11",
            period: "final2",
            topic: "An toàn thông tin mạng",
            content: "Phần mềm độc hại mã hóa dữ liệu của nạn nhân và đòi tiền chuộc để giải mã được gọi là:",
            options: ["A. Ransomware (Mã độc tống tiền)", "B. Spyware (Phần mềm gián điệp)", "C. Adware (Phần mềm quảng cáo)", "D. Keylogger"],
            correct: "A",
            explanation: "Ransomware mã hóa tệp tin bằng thuật toán mạnh và hiển thị thông báo đòi tiền chuộc (thường bằng tiền mã hóa)."
        },
        {
            id: "cs11_fin2_extra2",
            subject: "Tin Học",
            grade: "11",
            period: "final2",
            topic: "An toàn thông tin mạng",
            content: "Để phòng chống mã độc xâm nhập máy tính, biện pháp nào sau đây là ĐÚNG?",
            options: ["A. Cài đặt và cập nhật phần mềm diệt virus định kỳ, quét các thiết bị USB trước khi mở", "B. Tắt hoàn toàn tường lửa Windows", "C. Tải phần mềm không rõ nguồn gốc", "D. Chia sẻ mật khẩu với người lạ"],
            correct: "A",
            explanation: "Cập nhật hệ điều hành và phần mềm diệt virus bản quyền giúp ngăn chặn các lỗ hổng bảo mật mới."
        },
        {
            id: "cs11_fin2_extra3",
            subject: "Tin Học",
            grade: "11",
            period: "final2",
            topic: "An toàn thông tin mạng",
            content: "Phương thức xác thực hai yếu tố (2FA) bảo vệ tài khoản bằng cách kết hợp:",
            options: ["A. Mật khẩu cá nhân và mã OTP gửi qua điện thoại hoặc ứng dụng xác thực", "B. Hai mật khẩu giống hệt nhau", "C. Tên đăng nhập và ngày sinh", "D. Chỉ một câu hỏi bí mật"],
            correct: "A",
            explanation: "2FA kết hợp 'điều bạn biết' (mật khẩu) và 'thứ bạn có' (điện thoại nhận mã OTP) để tăng cường bảo mật."
        },
        {
            id: "tin11_m1_10",
            subject: "Tin Học",
            grade: "11",
            period: "mid1",
            topic: "Hệ điều hành & Ứng dụng",
            content: "Giao diện dòng lệnh (CLI - Command Line Interface) có ưu điểm lớn nhất là gì so với giao diện đồ họa (GUI)?",
            options: ["A. Tiêu tốn rất ít tài nguyên phần cứng và hỗ trợ tự động hóa bằng kịch bản (script) rất mạnh", "B. Dễ dùng hơn cho trẻ em", "C. Có nhiều màu sắc và hình ảnh đẹp hơn", "D. Không cần bàn phím để nhập dữ liệu"],
            correct: "A",
            explanation: "CLI xử lý trực tiếp lệnh văn bản, không tốn tài nguyên dựng hình đồ họa và rất thuận lợi cho việc lập trình tự động hóa tác vụ hệ thống."
        },
        {
            id: "tin11_m1_11",
            subject: "Tin Học",
            grade: "11",
            period: "mid1",
            topic: "Hệ điều hành & Ứng dụng",
            content: "Thành phần cốt lõi (kernel) của hệ điều hành có nhiệm vụ chính nào?",
            options: ["A. Quản lý trực tiếp tài nguyên phần cứng (CPU, RAM, thiết bị I/O) và điều phối các tiến trình", "B. Thiết kế hình ảnh đồ họa cho trang web", "C. Soạn thảo văn bản và tính bảng tính", "D. Quét mã QR thanh toán"],
            correct: "A",
            explanation: "Kernel (nhân) là trái tim của hệ điều hành, đứng giữa phần cứng và các ứng dụng để cấp phát và điều phối tài nguyên."
        },
        {
            id: "tin11_m1_12",
            subject: "Tin Học",
            grade: "11",
            period: "mid1",
            topic: "Hệ điều hành & Ứng dụng",
            content: "Bộ nhớ ảo (Virtual Memory) trong hệ điều hành hoạt động theo nguyên lý nào?",
            options: ["A. Tạm thời sử dụng một phần dung lượng ổ đĩa cứng làm phần mở rộng cho RAM khi bộ nhớ RAM bị thiếu", "B. Gắn thêm thẻ nhớ ngoài vào máy tính", "C. Tăng xung nhịp CPU lên gấp đôi", "D. Xóa vĩnh viễn các ứng dụng không dùng"],
            correct: "A",
            explanation: "Bộ nhớ ảo sử dụng kỹ thuật phân trang (paging) trên ổ đĩa để hỗ trợ khi dung lượng RAM vật lý đầy."
        },
        {
            id: "tin11_f1_10",
            subject: "Tin Học",
            grade: "11",
            period: "final1",
            topic: "Cơ sở dữ liệu quan hệ (RDBMS)",
            content: "Khóa ngoại (Foreign Key) trong mô hình cơ sở dữ liệu quan hệ dùng để làm gì?",
            options: ["A. Liên kết dữ liệu giữa hai bảng và đảm bảo tính toàn vẹn tham chiếu", "B. Tăng tốc độ quạt làm mát của máy chủ", "C. Khóa cơ sở dữ liệu không cho người khác xem", "D. Định dạng màu sắc của các dòng dữ liệu"],
            correct: "A",
            explanation: "Khóa ngoại là trường trong một bảng tham chiếu đến khóa chính của bảng khác để ràng buộc toàn vẹn quan hệ giữa 2 bảng."
        },
        {
            id: "tin11_f1_11",
            subject: "Tin Học",
            grade: "11",
            period: "final1",
            topic: "Cơ sở dữ liệu quan hệ (RDBMS)",
            content: "Thuộc tính (Attribute) trong mô hình dữ liệu quan hệ tương ứng với khái niệm nào trong bảng biểu?",
            options: ["A. Cột (Field)", "B. Dòng (Record)", "C. Toàn bộ bảng (Table)", "D. File dữ liệu"],
            correct: "A",
            explanation: "Mỗi thuộc tính là một trường (cột) dữ liệu mô tả một đặc tính của thực thể trong bảng."
        },
        {
            id: "tin11_m2_9",
            subject: "Tin Học",
            grade: "11",
            period: "mid2",
            topic: "Truy vấn CSDL với SQL",
            content: "Để sắp xếp kết quả truy vấn SQL theo thứ tự giảm dần của điểm số, ta dùng mệnh đề nào?",
            options: ["A. ORDER BY Diem DESC", "B. ORDER BY Diem ASC", "C. GROUP BY Diem", "D. SORT BY Diem DOWN"],
            correct: "A",
            explanation: "ORDER BY <cột> DESC sắp xếp theo thứ tự giảm dần (Descending), còn ASC là tăng dần (Ascending)."
        },
        {
            id: "tin11_m2_10",
            subject: "Tin Học",
            grade: "11",
            period: "mid2",
            topic: "Truy vấn CSDL với SQL",
            content: "Hàm tổng hợp nào trong SQL dùng để tính giá trị trung bình của một cột số?",
            options: ["A. AVG()", "B. SUM()", "C. COUNT()", "D. MEAN()"],
            correct: "A",
            explanation: "AVG() trong SQL tính giá trị trung bình số học của cột dữ liệu chỉ định."
        },
        {
            id: "tin11_f2_7",
            subject: "Tin Học",
            grade: "11",
            period: "final2",
            topic: "Thiết kế trang web (HTML/CSS)",
            content: "Thẻ HTML nào sau đây dùng để chèn hình ảnh vào trang web?",
            options: ["A. <img src=\"url\" alt=\"text\">", "B. <picture href=\"url\">", "C. <image link=\"url\">", "D. <photo file=\"url\">"],
            correct: "A",
            explanation: "Thẻ <img src=\"...\" alt=\"...\"> là thẻ chuẩn của HTML để hiển thị hình ảnh."
        },
        {
            id: "tin11_f2_8",
            subject: "Tin Học",
            grade: "11",
            period: "final2",
            topic: "An toàn thông tin mạng",
            content: "Biện pháp xác thực hai yếu tố (2FA - Two-Factor Authentication) giúp tăng cường bảo mật tài khoản bằng cách:",
            options: ["A. Yêu cầu mật khẩu kết hợp thêm một mã xác thực gửi qua điện thoại hoặc ứng dụng xác thực", "B. Nhập mật khẩu hai lần liên tiếp", "C. Đặt mật khẩu dài trên 50 ký tự", "D. Chỉ đăng nhập vào ban đêm"],
            correct: "A",
            explanation: "2FA kết hợp điều bạn biết (mật khẩu) và điều bạn sở hữu (điện thoại/mã OTP) để ngăn chặn xâm nhập trái phép."
        },
    ],
    "Công Nghệ": [
        {
            id: "cn11_1",
            subject: "Công Nghệ",
            grade: "11",
            period: "mid1",
            topic: "Cơ khí chế tạo & Động cơ đốt trong",
            content: "Trong chu trình làm việc của động cơ 4 kì, kì nào sinh công cơ học làm quay trục khuỷu?",
            options: ["A. Kì cháy - giãn nở (kì nổ)", "B. Kì nạp", "C. Kì nén", "D. Kì thải"],
            correct: "A",
            explanation: "Chỉ có kì cháy - giãn nở (kì 3) là kì sinh công hữu ích đẩy piston đi xuống làm quay trục khuỷu."
        },
        {
            id: "cn11_2",
            subject: "Công Nghệ",
            grade: "11",
            period: "final1",
            topic: "Hệ thống truyền động cơ khí",
            content: "Hệ thống truyền lực bằng xích (như trên xe đạp, xe máy) có ưu điểm nào so với truyền động đai?",
            options: ["A. Không bị trượt, giữ đúng tỉ số truyền", "B. Hoạt động hoàn toàn không có tiếng ồn", "C. Không cần bảo dưỡng bôi trơn", "D. Giá thành rẻ nhất"],
            correct: "A",
            explanation: "Truyền động xích ăn khớp răng nên không có hiện tượng trượt trơn như đai, đảm bảo tỉ số truyền chính xác."
        },
        {
            id: "cn11_3",
            subject: "Công Nghệ",
            grade: "11",
            period: "mid2",
            topic: "Công nghệ chăn nuôi & Thú y",
            content: "Biện pháp phòng bệnh chủ động và hiệu quả nhất cho đàn vật nuôi trong chăn nuôi hiện đại là:",
            options: ["A. Tiêm vắc xin phòng bệnh đúng lịch và giữ vệ sinh an toàn sinh học", "B. Cho vật nuôi uống nhiều kháng sinh phòng ngừa", "C. Nuôi nhốt thật chật hẹp", "D. Để vật nuôi tự miễn dịch"],
            correct: "A",
            explanation: "Tiêm phòng vắc xin giúp cơ thể vật nuôi tạo kháng thể đặc hiệu chủ động chống lại mầm bệnh."
        },
        {
            id: "cn11_4",
            subject: "Công Nghệ",
            grade: "11",
            period: "final2",
            topic: "Thức ăn chăn nuôi & Chế biến",
            content: "Phương pháp ủ chua thức ăn thô xanh (cỏ voi, thân cây ngô) cho trâu bò nhằm mục đích chính là:",
            options: ["A. Bảo quản thức ăn lâu dài và tăng hàm lượng vi sinh vật có lợi, giúp trâu bò dễ tiêu hóa", "B. Làm cho thức ăn khô kiệt nước", "C. Tiêu diệt hoàn toàn chất dinh dưỡng", "D. Biến cỏ thành phân bón"],
            correct: "A",
            explanation: "Ủ chua yếm khí lên men lactic giúp bảo quản thức ăn xanh mùa đông, tạo vị chua thơm kích thích trâu bò ăn ngon miệng."
        },
        {
            id: "cn11_5",
            subject: "Công Nghệ",
            grade: "11",
            period: "final2",
            topic: "Bảo vệ môi trường nông nghiệp",
            content: "Hầm khí sinh học (Biogas) trong xử lý chất thải chăn nuôi mang lại lợi ích kép nào?",
            options: ["A. Xử lý triệt để chất thải giảm ô nhiễm và sinh ra khí gas phục vụ đun nấu, chạy máy", "B. Chỉ dùng để chứa nước thải", "C. Làm tăng mùi hôi thối trong trang trại", "D. Giúp trang trại không cần dọn chuồng"],
            correct: "A",
            explanation: "Hầm Biogas phân hủy kị khí chất thải chăn nuôi tạo khí metan (CH₄) làm năng lượng sạch, nước xả dùng tưới cây."
        },
        {
            id: "tech11_t1_q3",
            subject: "Công Nghệ",
            grade: "11",
            period: "mid1",
            topic: "Cơ khí chế tạo & Động cơ đốt trong",
            content: "Bốn kì hoạt động của động cơ đốt trong 4 kì lần lượt diễn ra theo thứ tự là:",
            options: ["A. Nạp - Nén - Cháy dãn nở (Sinh công) - Thải", "B. Nén - Nạp - Thải - Cháy", "C. Thải - Nạp - Nén - Cháy", "D. Nạp - Cháy - Nén - Thải"],
            correct: "A",
            explanation: "Chu trình 4 kì của động cơ piston: Kì 1 hút hòa khí (Nạp), Kì 2 nén ép (Nén), Kì 3 đánh lửa sinh công (Cháy), Kì 4 đẩy khí xả (Thải)."
        },
        {
            id: "tech11_t2_q3",
            subject: "Công Nghệ",
            grade: "11",
            period: "final1",
            topic: "Hệ thống truyền động cơ khí",
            content: "Bộ truyền động đai (dây curoa) truyền chuyển động quay giữa 2 trục nhờ hiện tượng gì?",
            options: ["A. Lực ma sát giữa dây đai và bề mặt bánh đai", "B. Ăn khớp bánh răng", "C. Lực hút từ trường", "D. Thủy lực chất lỏng"],
            correct: "A",
            explanation: "Truyền động đai hoạt động dựa vào ma sát giữa đai và bánh đai, có ưu điểm chạy êm, chống quá tải tốt."
        },
        {
            id: "tech11_t3_q3",
            subject: "Công Nghệ",
            grade: "11",
            period: "mid2",
            topic: "Công nghệ chăn nuôi & Thú y",
            content: "Biện pháp phòng bệnh chủ động và hiệu quả nhất cho đàn vật nuôi trong chăn nuôi công nghiệp là:",
            options: ["A. Tiêm vắc xin phòng bệnh đầy đủ và định kì", "B. Cho uống kháng sinh liều cao hàng ngày", "C. Giảm khẩu phần ăn", "D. Để vật nuôi tự sinh kháng thể"],
            correct: "A",
            explanation: "Tiêm vắc xin kích thích hệ miễn dịch chủ động của gia súc, gia cầm tạo kháng thể đặc hiệu phòng ngừa dịch bệnh."
        },
        {
            id: "tech11_t4_q3",
            subject: "Công Nghệ",
            grade: "11",
            period: "final2",
            topic: "Thức ăn chăn nuôi & Chế biến",
            content: "Phương pháp ủ chua thức ăn thô xanh (cỏ voi, thân ngô) ứng dụng quá trình lên men của vi khuẩn nào?",
            options: ["A. Vi khuẩn Lactic (lên men lactic)", "B. Nấm men rượu", "C. Vi khuẩn thối rữa", "D. Nấm mốc đen"],
            correct: "A",
            explanation: "Ủ chua yếm khí kích thích vi khuẩn lactic lên men đường tạo axit lactic, hạ pH bảo quản cỏ tươi lâu dài cho gia súc."
        },
        {
            id: "tech11_t5_q3",
            subject: "Công Nghệ",
            grade: "11",
            period: "final2",
            topic: "Bảo vệ môi trường nông nghiệp",
            content: "Công nghệ hầm Biogas trong xử lý chất thải chăn nuôi có lợi ích kép nào?",
            options: ["A. Xử lý ô nhiễm chất thải và thu hồi khí sinh học (CH₄) làm năng lượng đun nấu", "B. Tăng khí thải CO₂ ra khí quyển", "C. Thải trực tiếp phân chưa xử lí ra sông", "D. Tiêu diệt cây cỏ xung quanh"],
            correct: "A",
            explanation: "Hầm biogas phân hủy kị khí chất thải hữu cơ, vừa bảo vệ môi trường vừa tạo nguồn khí đốt sinh học miễn phí."
        },
        {
            id: "tech11_mid1_bulk1",
            subject: "Công Nghệ",
            grade: "11",
            period: "mid1",
            topic: "Cơ khí chế tạo & Động cơ đốt trong",
            content: "Piston của động cơ đốt trong chuyển động tịnh tiến trong bộ phận nào?",
            options: ["A. Xilanh", "B. Cacte", "C. Nắp máy", "D. Bánh đà"],
            correct: "A",
            explanation: "Piston chuyển động tịnh tiến qua lại bên trong lòng xilanh để nén và dãn nở khí cháy."
        },
        {
            id: "tech11_fin1_bulk1",
            subject: "Công Nghệ",
            grade: "11",
            period: "final1",
            topic: "Hệ thống truyền động cơ khí",
            content: "Bộ truyền động bánh răng có ưu điểm vượt trội nào sau đây?",
            options: ["A. Tỉ số truyền chính xác tuyệt đối, hiệu suất cao và khả năng chịu tải lớn", "B. Hoạt động hoàn toàn không có tiếng ồn", "C. Không cần bôi trơn", "D. Khoảng cách trục truyền xa hàng trăm mét"],
            correct: "A",
            explanation: "Truyền động bánh răng ăn khớp trực tiếp nên không có trượt, tỉ số truyền cố định và chịu lực lớn."
        },
        {
            id: "tech11_mid2_bulk1",
            subject: "Công Nghệ",
            grade: "11",
            period: "mid2",
            topic: "Công nghệ chăn nuôi & Thú y",
            content: "Phương pháp thụ tinh nhân tạo cho vật nuôi mang lại lợi ích nổi bật nào?",
            options: ["A. Nâng cao hiệu quả sử dụng con đực giống tốt, nhân giống nhanh và phòng ngừa lây lan dịch bệnh", "B. Tốn kém chi phí hơn tự nhiên", "C. Làm giảm chất lượng con giống", "D. Chỉ áp dụng cho gia cầm"],
            correct: "A",
            explanation: "Một liều tinh của con đực giống tốt có thể phối cho hàng chục con cái, nâng cao chất lượng đàn giống nhanh chóng."
        },
        {
            id: "tech11_fin2_bulk1",
            subject: "Công Nghệ",
            grade: "11",
            period: "final2",
            topic: "Thức ăn chăn nuôi & Chế biến",
            content: "Thức ăn hỗn hợp hoàn chỉnh cho gia súc, gia cầm được chế biến bằng cách nào?",
            options: ["A. Phối trộn các nguyên liệu theo công thức dinh dưỡng cân đối đáp ứng từng giai đoạn phát triển", "B. Cho ăn cỏ tươi duy nhất", "C. Nấu chín hoàn toàn bằng củi", "D. Trộn ngẫu nhiên"],
            correct: "A",
            explanation: "Thức ăn hỗn hợp hoàn chỉnh cung cấp cân đối protein, năng lượng, vitamin và khoáng chất cho vật nuôi phát triển tối ưu."
        },
        {
            id: "cn11_m1_4",
            subject: "Công Nghệ",
            grade: "11",
            period: "mid1",
            topic: "Cơ khí chế tạo & Động cơ đốt trong",
            content: "Trong chu trình hoạt động của động cơ 4 kì, thứ tự diễn ra của 4 kì là:",
            options: ["A. Nạp - Nén - Nổ (Cháy giãn nở) - Thải", "B. Nén - Nạp - Thải - Nổ", "C. Nạp - Nổ - Nén - Thải", "D. Nổ - Nạp - Thải - Nén"],
            correct: "A",
            explanation: "4 kì của động cơ nhiệt đốt trong gồm: Nạp -> Nén -> Cháy giãn nở (Nổ) -> Thải khí."
        },
        {
            id: "cn11_f1_4",
            subject: "Công Nghệ",
            grade: "11",
            period: "final1",
            topic: "Hệ thống truyền động cơ khí",
            content: "Cơ cấu truyền động bánh răng có ưu điểm vượt trội nào so với truyền động đai?",
            options: ["A. Tỉ số truyền chính xác, không bị trượt và khả năng chịu tải lớn", "B. Hoạt động êm tuyệt đối không cần dầu bôi trơn", "C. Khoảng cách giữa các trục rất xa", "D. Chi phí chế tạo rẻ nhất"],
            correct: "A",
            explanation: "Truyền động bánh răng khớp răng ăn khớp trực tiếp nên tỉ số truyền ổn định và chịu tải lớn."
        },
        {
            id: "cn11_m2_4",
            subject: "Công Nghệ",
            grade: "11",
            period: "mid2",
            topic: "Công nghệ chăn nuôi & Thú y",
            content: "Biện pháp an toàn sinh học quan trọng nhất trong trang trại chăn nuôi công nghệ cao là:",
            options: ["A. Tiêm phòng vaccine định kỳ và kiểm soát nghiêm ngặt người, phương tiện ra vào chuồng", "B. Cho vật nuôi tự do ra đồng cỏ tự nhiên", "C. Không bao giờ khử trùng chuồng trại", "D. Cho ăn nhiều chất kích thích tăng trọng"],
            correct: "A",
            explanation: "An toàn sinh học kiểm soát dịch bệnh từ mầm mống bên ngoài và tăng sức đề kháng đàn vật nuôi bằng vaccine."
        },
        {
            id: "cn11_f2_6",
            subject: "Công Nghệ",
            grade: "11",
            period: "final2",
            topic: "Bảo vệ môi trường nông nghiệp",
            content: "Xử lý chất thải chăn nuôi bằng hầm khí sinh học (Biogas) mang lại lợi ích kép nào?",
            options: ["A. Giảm thiểu ô nhiễm môi trường và tạo ra khí đốt sạch phục vụ sinh hoạt", "B. Làm tăng lượng khí CO2 thải ra khí quyển", "C. Tăng lượng nước thải chưa xử lý ra sông", "D. Làm giảm độ phì nhiêu của đất trồng trọt"],
            correct: "A",
            explanation: "Hầm Biogas phân hủy kị khí chất thải, ngăn mùi hôi và sinh khí metan sạch để nấu nướng, phát điện."
        },
    ],
    "GDQP&AN": [
        {
            id: "qp11_1",
            subject: "GDQP&AN",
            grade: "11",
            period: "mid1",
            topic: "Bảo vệ Tổ quốc trong tình hình mới",
            content: "Mục tiêu trọng yếu của quốc phòng, an ninh nước ta hiện nay là:",
            options: ["A. Bảo vệ vững chắc độc lập, chủ quyền, thống nhất, toàn vẹn lãnh thổ và giữ vững môi trường hòa bình", "B. Chạy đua vũ trang với các nước lớn", "C. Đóng cửa hợp tác quốc tế", "D. Mở rộng biên giới lãnh thổ ra bên ngoài"],
            correct: "A",
            explanation: "Đường lối quốc phòng của Đảng ta là bảo vệ độc lập chủ quyền, chế độ xã hội chủ nghĩa và giữ vững môi trường hòa bình để phát triển đất nước."
        },
        {
            id: "qp11_2",
            subject: "GDQP&AN",
            grade: "11",
            period: "mid1",
            topic: "Phòng chống chiến lược \"Diễn biến hòa bình\"",
            content: "Chiến lược 'Diễn biến hòa bình' của các thế lực thù địch nhằm chống phá nước ta chủ yếu sử dụng phương thức:",
            options: ["A. Biện pháp phi vũ trang kết hợp kích động bạo loạn lật đổ từ bên trong", "B. Tiến công quân sự quy mô lớn ngay từ đầu", "C. Đóng cửa biên giới trên bộ", "D. Cấm vận hoàn toàn internet"],
            correct: "A",
            explanation: "'Diễn biến hòa bình' dùng các thủ đoạn chính trị, tư tưởng, kinh tế, văn hóa để chuyển hóa nội bộ và kích động bạo loạn."
        },
        {
            id: "qp11_3",
            subject: "GDQP&AN",
            grade: "11",
            period: "final1",
            topic: "Tổ chức Quân đội & Công an nhân dân",
            content: "Quân đội nhân dân Việt Nam bao gồm lực lượng nào?",
            options: ["A. Lực lượng thường trực (bộ đội chủ lực, bộ đội địa phương) và lực lượng dự bị động viên", "B. Chỉ có hải quân và không quân", "C. Chỉ có cảnh sát giao thông", "D. Toàn bộ thanh niên trong độ tuổi 18 đến 45"],
            correct: "A",
            explanation: "Quân đội nhân dân Việt Nam gồm lực lượng thường trực và lực lượng dự bị động viên được xây dựng vững mạnh."
        },
        {
            id: "qp11_4",
            subject: "GDQP&AN",
            grade: "11",
            period: "mid2",
            topic: "Kỹ thuật bắn súng tiểu liên AK",
            content: "Khi bắn súng tiểu liên AK ở tư thế nằm bắn có bệ tì, điểm đặt ngắm cơ bản thường ngắm vào đâu của bia số 4?",
            options: ["A. Điểm chính giữa mép dưới của mục tiêu (bia số 4)", "B. Đỉnh đầu của bia", "C. Cạnh bên phải của bia", "D. Khoảng không phía trên bia"],
            correct: "A",
            explanation: "Quy tắc ngắm bắn súng AK vào bia số 4 cự ly 100m là lấy điểm ngắm chính giữa mép dưới bia để đạn ăn vào vùng ngực (điểm 10)."
        },
        {
            id: "qp11_5",
            subject: "GDQP&AN",
            grade: "11",
            period: "final2",
            topic: "Bảo vệ an ninh trật tự & Phòng chống tội phạm",
            content: "Trách nhiệm của học sinh THPT trong việc phòng chống tệ nạn xã hội và tội phạm học đường là:",
            options: ["A. Chấp hành nghiêm pháp luật, kiên quyết nói không với ma túy và kịp thời báo cáo các hành vi vi phạm", "B. Lôi kéo bạn bè tham gia tụ tập đua xe", "C. Tàng trữ vũ khí thô sơ trong cặp sách", "D. Cho người lạ mượn thẻ học sinh để vào trường"],
            correct: "A",
            explanation: "Học sinh có trách nhiệm tuân thủ pháp luật, giữ gìn trật tự an toàn trường học và tham gia phong trào Toàn dân bảo vệ an ninh Tổ quốc."
        },
        {
            id: "mil11_t1_q3",
            subject: "GDQP&AN",
            grade: "11",
            period: "mid1",
            topic: "Bảo vệ Tổ quốc trong tình hình mới",
            content: "Nhiệm vụ trọng yếu, thường xuyên của toàn Đảng, toàn dân và toàn quân ta hiện nay là:",
            options: ["A. Xây dựng và bảo vệ vững chắc Tổ quốc Việt Nam Xã hội Chủ nghĩa", "B. Chạy đua vũ trang hạt nhân", "C. Tấn công các nước láng giềng", "D. Đóng cửa hợp tác kinh tế"],
            correct: "A",
            explanation: "Hai nhiệm vụ chiến lược xuyên suốt của cách mạng Việt Nam: Xây dựng CNXH gắn liền với bảo vệ vững chắc Tổ quốc."
        },
        {
            id: "mil11_t2_q3",
            subject: "GDQP&AN",
            grade: "11",
            period: "final1",
            topic: "Phòng chống chiến lược 'Diễn biến hòa bình'",
            content: "Thủ đoạn nham hiểm của các thế lực thù địch trên lĩnh vực tư tưởng văn hóa là gì?",
            options: ["A. Tuyên truyền lối sống thực dụng, xuyên tạc lịch sử và phủ nhận chủ nghĩa Mác - Lênin", "B. Khuyến khích đọc sách truyền thống", "C. Tôn trọng bản sắc văn hóa dân tộc", "D. Hỗ trợ học bổng trung thực"],
            correct: "A",
            explanation: "'Diễn biến hòa bình' đánh phá nền tảng tư tưởng, kích động tâm lý hoài nghi để tự diễn biến, tự chuyển hóa từ bên trong."
        },
        {
            id: "mil11_t3_q3",
            subject: "GDQP&AN",
            grade: "11",
            period: "mid2",
            topic: "Tổ chức Quân đội & Công an nhân dân",
            content: "Quân đội nhân dân Việt Nam đặt dưới sự lãnh đạo như thế nào của Đảng Cộng sản Việt Nam?",
            options: ["A. Tuyệt đối, trực tiếp về mọi mặt", "B. Gián tiếp qua cơ quan dân sự", "C. Không chịu sự lãnh đạo của Đảng", "D. Luân phiên theo nhiệm kì"],
            correct: "A",
            explanation: "Nguyên tắc bất di bất dịch: Đảng Cộng sản Việt Nam lãnh đạo Quân đội nhân dân Việt Nam tuyệt đối, trực tiếp về mọi mặt."
        },
        {
            id: "mil11_t4_q3",
            subject: "GDQP&AN",
            grade: "11",
            period: "final2",
            topic: "Kỹ thuật bắn súng tiểu liên AK",
            content: "Đường ngắm cơ bản khi bắn súng tiểu liên AK là đường thẳng nối từ mắt người bắn qua:",
            options: ["A. Chính giữa mép trên khe ngắm đến chính giữa đỉnh đầu ngắm", "B. Mép dưới khe ngắm đến chân đầu ngắm", "C. Cạnh trái khe ngắm", "D. Thước ngắm đến mục tiêu trực tiếp"],
            correct: "A",
            explanation: "Đường ngắm cơ bản chuẩn: Đi từ mắt qua điểm chính giữa mép trên của khe ngắm đến đỉnh của đầu ngắm."
        },
        {
            id: "mil11_t5_q3",
            subject: "GDQP&AN",
            grade: "11",
            period: "final2",
            topic: "Bảo vệ an ninh trật tự & Phòng chống tội phạm",
            content: "Trách nhiệm của học sinh trong công tác phòng chống tệ nạn xã hội và ma túy học đường là:",
            options: ["A. Tuyệt đối không thử, không tàng trữ, sử dụng và tích cực tố giác tội phạm ma túy", "B. Che giấu bạn bè vi phạm", "C. Tò mò dùng thử 1 lần", "D. Tham gia vận chuyển thuê"],
            correct: "A",
            explanation: "Học sinh cần có bản lĩnh kiên quyết nói không với ma túy, xây dựng lối sống lành mạnh và môi trường học đường an toàn."
        },
        {
            id: "mil11_mid1_bulk1",
            subject: "GDQP&AN",
            grade: "11",
            period: "mid1",
            topic: "Bảo vệ Tổ quốc trong tình hình mới",
            content: "Mục tiêu cơ bản của chiến lược bảo vệ Tổ quốc trong tình hình mới là:",
            options: ["A. Bảo vệ vững chắc độc lập, chủ quyền, thống nhất, toàn vẹn lãnh thổ; bảo vệ Đảng, Nhà nước và nhân dân", "B. Phát động chiến tranh xâm lược", "C. Liên minh quân sự chống nước khác", "D. Chạy đua vũ trang"],
            correct: "A",
            explanation: "Chiến lược bảo vệ Tổ quốc kiên định mục tiêu giữ vững môi trường hòa bình, ổn định và bảo vệ trọn vẹn chủ quyền đất nước."
        },
        {
            id: "mil11_fin1_bulk1",
            subject: "GDQP&AN",
            grade: "11",
            period: "final1",
            topic: "Tổ chức Quân đội & Công an nhân dân",
            content: "Cơ quan chỉ huy tham mưu cao nhất của Quân đội nhân dân Việt Nam là:",
            options: ["A. Bộ Tổng Tham mưu", "B. Tổng cục Chính trị", "C. Tổng cục Hậu cần", "D. Tổng cục Kỹ thuật"],
            correct: "A",
            explanation: "Bộ Tổng Tham mưu là cơ quan chỉ huy tham mưu của toàn quân, chỉ đạo tác chiến và xây dựng lực lượng vũ trang."
        },
        {
            id: "mil11_mid2_bulk1",
            subject: "GDQP&AN",
            grade: "11",
            period: "mid2",
            topic: "Kỹ thuật bắn súng tiểu liên AK",
            content: "Tầm bắn thẳng của súng tiểu liên AK đối với mục tiêu người nằm (cao 0.5 m) là khoảng bao nhiêu mét?",
            options: ["A. 350 m", "B. 100 m", "C. 800 m", "D. 1000 m"],
            correct: "A",
            explanation: "Tầm bắn thẳng với mục tiêu người nằm (cao 0.5m) là 350m, với mục tiêu người chạy (cao 1.5m) là 525m."
        },
        {
            id: "mil11_fin2_bulk1",
            subject: "GDQP&AN",
            grade: "11",
            period: "final2",
            topic: "Bảo vệ an ninh trật tự & Phòng chống tội phạm",
            content: "Khi phát hiện các hành vi vi phạm an ninh trật tự hoặc bạo lực học đường, học sinh cần làm gì?",
            options: ["A. Kịp thời báo ngay cho thầy cô giáo, ban giám hiệu hoặc công an địa phương", "B. Đứng xem và quay video cổ vũ", "C. Tự ý đánh nhau trả thù", "D. Giấu kín không nói với ai"],
            correct: "A",
            explanation: "Học sinh cần có ý thức tố giác tội phạm và thông báo sớm cho người có trách nhiệm can thiệp kịp thời."
        },
        {
            id: "qp11_m1_5",
            subject: "GDQP&AN",
            grade: "11",
            period: "mid1",
            topic: "Bảo vệ Tổ quốc trong tình hình mới",
            content: "Quan điểm của Đảng ta về mục tiêu bảo vệ Tổ quốc Việt Nam XHCN là:",
            options: ["A. Bảo vệ vững chắc độc lập, chủ quyền, thống nhất, toàn vẹn lãnh thổ, Đảng, Nhà nước và nhân dân", "B. Mở rộng biên giới sang các nước lân cận", "C. Chạy đua vũ trang tốn kém", "D. Tham gia liên minh quân sự chống nước khác"],
            correct: "A",
            explanation: "Mục tiêu bảo vệ Tổ quốc là giữ vững độc lập, chủ quyền, toàn vẹn lãnh thổ và bảo vệ chế độ XHCN."
        },
        {
            id: "qp11_f1_4",
            subject: "GDQP&AN",
            grade: "11",
            period: "final1",
            topic: "Phòng chống chiến lược \"Diễn biến hòa bình\"",
            content: "Bản chất của chiến lược 'Diễn biến hòa bình' do các thế lực thù địch tiến hành là:",
            options: ["A. Sử dụng các biện pháp phi vũ trang để phá hoại từ bên trong, lật đổ chế độ chính trị", "B. Tấn công quân sự ồ ạt bằng xe tăng", "C. Cấm vận hoàn toàn thương mại hàng không", "D. Giúp đỡ kinh tế vô điều kiện"],
            correct: "A",
            explanation: "Diễn biến hòa bình dùng các thủ đoạn chính trị, tư tưởng, kinh tế, văn hóa để làm suy thoái, tự diễn biến từ bên trong."
        },
        {
            id: "qp11_m2_4",
            subject: "GDQP&AN",
            grade: "11",
            period: "mid2",
            topic: "Tổ chức Quân đội & Công an nhân dân",
            content: "Quân đội nhân dân Việt Nam đặt dưới sự lãnh đạo tuyệt đối, trực tiếp về mọi mặt của tổ chức nào?",
            options: ["A. Đảng Cộng sản Việt Nam", "B. Bộ Quốc phòng", "C. Hội Cựu chiến binh", "D. Đoàn Thanh niên"],
            correct: "A",
            explanation: "Đảng Cộng sản Việt Nam lãnh đạo tuyệt đối, trực tiếp về mọi mặt đối với Quân đội nhân dân Việt Nam."
        },
        {
            id: "qp11_f2_5",
            subject: "GDQP&AN",
            grade: "11",
            period: "final2",
            topic: "Kỹ thuật bắn súng tiểu liên AK",
            content: "Khi bắn súng tiểu liên AK ở tư thế nằm bắn có bệ tì, tay thuận dùng để:",
            options: ["A. Nắm tay cầm, ngón trỏ đặt vào vành cò và bóp cò êm đều", "B. Cầm đầu nòng súng kéo về sau", "C. Che mắt ngắm", "D. Vẫy tay ra hiệu"],
            correct: "A",
            explanation: "Tay thuận nắm chặt tay cầm, áp má vào báng súng, ngón trỏ bóp cò êm theo đường ngắm đúng."
        },
    ],
};

// ==============================================================================
// TỔNG HỢP NGÂN HÀNG ĐỀ THI THEO KHỐI LỚP 10, 11, 12
// ==============================================================================
const BUILTIN_EXAM_BANK = {
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
}

// 2. CHUYỂN SUB-TABS TRONG LOBBY
function setExamSubTab(subTab) {
    currentExamSubTab = subTab;
    const tabs = ['practice', 'mistakes', 'history'];

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

    // Helper: lấy câu hỏi của một môn từ một khối lớp cụ thể
    function getQuestionsFor(g, s) {
        const bank = BUILTIN_EXAM_BANK[g];
        if (bank && bank[s]) return bank[s];
        return [];
    }

    // Helper kiểm tra câu hỏi có khớp topic không
    function matchTopic(q, targetTop) {
        if (!targetTop || targetTop === 'all') return true;
        if (!q.topic) return false;
        const qTop = q.topic.toLowerCase();
        const tTop = targetTop.toLowerCase();
        if (qTop.includes(tTop) || tTop.includes(qTop)) return true;
        // Nhận diện từ khóa chuyên sâu từng chuyên đề môn học
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
        return false;
    }

    // Xác định khối chính và các khối dự phòng
    let primaryGrades = [];
    let fallbackGrades = [];
    if (grade === 'all') {
        primaryGrades = ['12', '11', '10'];
        fallbackGrades = [];
    } else {
        primaryGrades = [grade];
        if (grade === '11') fallbackGrades = ['12', '10'];
        else if (grade === '10') fallbackGrades = ['11', '12'];
        else fallbackGrades = ['11', '10'];
    }

    let primaryList = [];
    primaryGrades.forEach(g => {
        primaryList.push(...getQuestionsFor(g, subj));
    });

    let fallbackList = [];
    fallbackGrades.forEach(g => {
        fallbackList.push(...getQuestionsFor(g, subj));
    });

    if (primaryList.length === 0 && fallbackList.length === 0) {
        primaryList = (BUILTIN_EXAM_BANK['12'] && BUILTIN_EXAM_BANK['12']['Toán']) || [];
    }

    // Phân tầng ưu tiên (Priority Tiers)
    const tier1 = []; // Khớp chính xác cả Topic & Period trong khối đã chọn
    const tier2 = []; // Khớp Period (nếu chọn) hoặc Topic trong cùng khối đã chọn
    const tier3 = []; // Các câu còn lại của môn trong cùng khối đã chọn
    const tier4 = []; // Các câu cùng môn từ các khối khác (ưu tiên khớp Period)
    const tier5 = []; // Các câu còn lại của môn từ các khối khác

    primaryList.forEach(q => {
        const isTopicMatch = matchTopic(q, topic);
        const isPeriodMatch = (period === 'all' || q.period === period || q.period === 'all');

        if (topic !== 'all' && period !== 'all') {
            if (isTopicMatch && isPeriodMatch) {
                tier1.push(q);
            } else if (isTopicMatch || isPeriodMatch) {
                tier2.push(q);
            } else {
                tier3.push(q);
            }
        } else if (topic !== 'all') {
            if (isTopicMatch) {
                tier1.push(q);
            } else {
                tier3.push(q);
            }
        } else if (period !== 'all') {
            if (isPeriodMatch) {
                tier1.push(q);
            } else {
                tier3.push(q);
            }
        } else {
            tier1.push(q);
        }
    });

    fallbackList.forEach(q => {
        const isPeriodMatch = (period === 'all' || q.period === period || q.period === 'all');
        if (isPeriodMatch) {
            tier4.push(q);
        } else {
            tier5.push(q);
        }
    });

    // Xáo trộn ngẫu nhiên từng tầng (Fisher-Yates) để câu hỏi luôn phong phú
    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
    shuffleArray(tier1);
    shuffleArray(tier2);
    shuffleArray(tier3);
    shuffleArray(tier4);
    shuffleArray(tier5);

    // Ghép nối các tầng theo thứ tự ưu tiên và lọc trùng lặp tuyệt đối
    const candidateTiers = [tier1, tier2, tier3, tier4, tier5];
    let uniquePool = [];
    let seenContent = new Set();
    let seenIds = new Set();

    for (const t of candidateTiers) {
        for (const q of t) {
            if (!q || !q.content) continue;
            const normContent = q.content.trim().toLowerCase();
            const qId = q.id || '';
            if (!seenContent.has(normContent) && (!qId || !seenIds.has(qId))) {
                seenContent.add(normContent);
                if (qId) seenIds.add(qId);
                uniquePool.push(q);
            }
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

    // Xáo trộn & tạo câu hỏi KHÔNG TRÙNG LẶP (TUYỆT ĐỐI KHÔNG LẶP LẠI CÂU HỎI)
    const questions = generateExamQuestions(uniquePool, targetCount, selectedExamSubject, gradeLabel, selectedExamPeriod, selectedExamTopic);
    
    const actualQCount = questions.length;
    // Thời gian chuẩn theo chế độ đề thi (khớp ghi chú dưới mỗi mục: 10 câu = 15p, 25 câu = 40p, 40 câu = 50p)
    if (selectedExamMode === 'mini') {
        durationMins = 15;
    } else if (selectedExamMode === 'standard') {
        durationMins = 40;
    } else if (selectedExamMode === 'full') {
        durationMins = 50;
    } else {
        durationMins = Math.max(5, Math.round(actualQCount * 1.5));
    }

    setupAndStartExam(`Đề Thi ${gradeLabel} - ${periodLabel} - ${selectedExamSubject}${topicLabel} (${actualQCount} câu)`, selectedExamSubject, questions, durationMins, grade, selectedExamPeriod, selectedExamTopic);
}

// Thuật toán chọn câu hỏi DUY NHẤT (100% KHÔNG LẶP LẠI BẤT KỲ CÂU NÀO)
function generateExamQuestions(sourceBank, targetCount, subjectName, defaultGrade, defaultPeriod = 'all', defaultTopic = 'all') {
    if (!sourceBank || sourceBank.length === 0) return [];

    // 1. sourceBank đã được phân tầng ưu tiên (ưu tiên cao nhất ở đầu) và đã lọc trùng
    // Lấy đúng số câu hỏi yêu cầu (hoặc tối đa số câu có sẵn nếu tổng kho nhỏ hơn targetCount)
    const finalCount = Math.min(targetCount, sourceBank.length);
    const selected = sourceBank.slice(0, finalCount);

    // 2. Xáo trộn ngẫu nhiên thứ tự các câu hỏi đã chọn để đề thi tự nhiên (Fisher-Yates shuffle)
    for (let i = selected.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [selected[i], selected[j]] = [selected[j], selected[i]];
    }

    let result = [];
    for (let i = 0; i < selected.length; i++) {
        const original = selected[i];
        const qGrade = original.grade 
            ? (original.grade.toString().startsWith('Lớp') ? original.grade : `Lớp ${original.grade}`) 
            : (defaultGrade || 'Lớp 12');
        
        // Giữ đúng period và topic gốc của từng câu hỏi - TUYỆT ĐỐI KHÔNG GÁN NHÃN GIẢ
        const qPeriod = original.period || (defaultPeriod !== 'all' ? defaultPeriod : 'all');
        const qTopic = original.topic || 'Tổng hợp bài học';

        result.push({
            id: original.id || `q_${i + 1}`,
            num: i + 1,
            grade: qGrade,
            period: qPeriod,
            topic: qTopic,
            subject: subjectName,
            content: original.content,
            options: [...original.options],
            correct: original.correct,
            explanation: original.explanation
        });
    }

    return result;
}

// 5. THIẾT LẬP VÀ MỞ PHÒNG THI
function setupAndStartExam(title, subject, questionList, durationMinutes, grade = '12', period = 'all', topic = 'all') {
    if (!questionList || questionList.length === 0) {
        return alert("Chưa có câu hỏi cho bài thi này!");
    }

    // Xóa timer cũ nếu còn
    if (activeExam && activeExam.timerInterval) {
        clearInterval(activeExam.timerInterval);
    }

    activeExam = {
        title: title,
        grade: grade || '12',
        period: period || 'all',
        topic: topic || 'all',
        subject: subject,
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
    if (roomTitle) roomTitle.innerText = title;
    if (roomSub) {
        const pLabel = EXAM_PERIODS[period] ? EXAM_PERIODS[period].short : 'Tổng hợp';
        roomSub.innerText = `Môn: ${subject} • Kỳ: ${pLabel} • ${questionList.length} câu • ${durationMinutes} phút`;
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
                        ${opt.replace(/^[A-D][\s.:\)-]+/i, '').trim()}
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
function retryCurrentExam() {
    if (!activeExam) return backToExamLobby();
    const questions = [...activeExam.questions];
    setupAndStartExam(activeExam.title, activeExam.subject, questions, Math.round(activeExam.totalSeconds / 60), activeExam.grade, activeExam.period, activeExam.topic);
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
window.handleTeacherSearch = handleTeacherSearch;
window.removeVietnameseTones = removeVietnameseTones;

// GÁN CÁC HÀM QUẢN LÝ CÁ NHÂN, HỎI ĐÁP, HỌC SINH & CÀI ĐẶT
window.loadProfileUI = loadProfileUI;
window.updateProfileStudentSelect = updateProfileStudentSelect;
window.saveProfile = saveProfile;
window.renderProfileDisplay = renderProfileDisplay;
window.renderSchedules = renderSchedules;
window.deleteSchedule = deleteSchedule;
window.renderStudyPlans = renderStudyPlans;
window.deleteStudyPlan = deleteStudyPlan;
window.toggleReminder = toggleReminder;
window.renderQA = renderQA;
window.submitAnswer = submitAnswer;
window.renderSettings = renderSettings;
window.removeClass = removeClass;
window.renderStudents = renderStudents;
window.removeStudent = removeStudent;
window.updateStudentSelect = updateStudentSelect;
window.renderLeaderboard = renderLeaderboard;
window.renderStats = renderStats;
window.resetData = resetData;

