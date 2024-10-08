let names = [];
let canvas = document.getElementById("wheelCanvas");
let ctx = canvas.getContext("2d");
let startAngle = 0;
let spinTimeout = null;
let spinAngleStart = 10;
let spinTime = 0;
let spinTimeTotal = 0;
let arc = 0;

function getNames() {
    const numNames = document.getElementById("numNames").value;
    const nameInputsDiv = document.getElementById("nameInputs");

    // إعادة تعيين القائمة والأسماء
    nameInputsDiv.innerHTML = "";
    names = [];
    document.getElementById("winner").innerText = "";

    // إنشاء حقول الإدخال للأسماء بناءً على العدد المطلوب
    for (let i = 0; i < numNames; i++) {
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = `أدخل الاسم ${i + 1}`;
        nameInputsDiv.appendChild(input);
        nameInputsDiv.appendChild(document.createElement("br"));
        names.push(input);
    }

    // تحديث قيمة الـ arc بناءً على عدد الأسماء
    arc = Math.PI * 2 / names.length;
}

function drawRouletteWheel() {
    let outsideRadius = 200;
    let textRadius = 160;
    let insideRadius = 125;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.font = 'bold 16px Helvetica, Arial';

    for (let i = 0; i < names.length; i++) {
        let angle = startAngle + i * arc;
        ctx.fillStyle = i % 2 === 0 ? "#FFDDCC" : "#FFFFFF";

        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, outsideRadius, angle, angle + arc, false);
        ctx.arc(canvas.width / 2, canvas.height / 2, insideRadius, angle + arc, angle, true);
        ctx.stroke();
        ctx.fill();

        ctx.save();
        ctx.fillStyle = "#000";
        ctx.translate(canvas.width / 2 + Math.cos(angle + arc / 2) * textRadius,
                      canvas.height / 2 + Math.sin(angle + arc / 2) * textRadius);
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        let text = names[i].value;
        ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
        ctx.restore();
    }

    // Arrow
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 4, canvas.height / 2 - (outsideRadius + 5));
    ctx.lineTo(canvas.width / 2 + 4, canvas.height / 2 - (outsideRadius + 5));
    ctx.lineTo(canvas.width / 2 + 4, canvas.height / 2 - (outsideRadius - 5));
    ctx.lineTo(canvas.width / 2 + 9, canvas.height / 2 - (outsideRadius - 5));
    ctx.lineTo(canvas.width / 2 + 0, canvas.height / 2 - (outsideRadius - 13));
    ctx.lineTo(canvas.width / 2 - 9, canvas.height / 2 - (outsideRadius - 5));
    ctx.lineTo(canvas.width / 2 - 4, canvas.height / 2 - (outsideRadius - 5));
    ctx.lineTo(canvas.width / 2 - 4, canvas.height / 2 - (outsideRadius + 5));
    ctx.fill();
}

function rotateWheel() {
    spinTime += 30;
    if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }
    let spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    startAngle += (spinAngle * Math.PI / 180);
    drawRouletteWheel();
    spinTimeout = setTimeout('rotateWheel()', 30);
}

function stopRotateWheel() {
    clearTimeout(spinTimeout);
    let degrees = startAngle * 180 / Math.PI + 90;
    let arcd = arc * 180 / Math.PI;
    let index = Math.floor((360 - degrees % 360) / arcd);
    ctx.save();
    ctx.font = 'bold 30px Helvetica, Arial';
    let text = names[index].value;

    // عرض الفائز
    document.getElementById("winner").innerText = `الفائز: ${text}`;

    // تحقق إذا كان يجب حذف الفائز
    if (document.getElementById("removeWinners").checked) {
        names.splice(index, 1); // إزالة الفائز من القائمة
        arc = Math.PI * 2 / names.length; // إعادة حساب الـ arc
    }

    ctx.restore();

    // عرض زر "إعادة التسجيل" عند انتهاء الدوران إذا كانت الأسماء قد انتهت
    document.getElementById("resetButton").style.display = names.length > 0 ? "none" : "block";
}

function easeOut(t, b, c, d) {
    let ts = (t /= d) * t;
    let tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
}

function spin() {
    if (names.length === 0) {
        alert("الرجاء إدخال الأسماء قبل تشغيل الدائرة.");
        return;
    }
    spinAngleStart = Math.random() * 10 + 10;
    spinTime = 0;
    spinTimeTotal = Math.random() * 3 + 4 * 1000;
    document.getElementById("winner").innerText = ""; // تفريغ النتائج السابقة
    document.getElementById("resetButton").style.display = "none";
    rotateWheel();
}

function resetForm() {
    document.getElementById("numNames").value = "";
    document.getElementById("nameInputs").innerHTML = "";
    document.getElementById("removeWinners").checked = false;
    document.getElementById("winner").innerText = "";
    names = [];
    document.getElementById("resetButton").style.display = "none";
}
