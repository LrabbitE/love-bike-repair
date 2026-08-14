// ===============================
// 取得網址中的腳踏車 ID
// ===============================
// ===============================
// 「其他」輸入框控制
// ===============================

const otherCheckbox =
    document.getElementById("other-checkbox");

const otherInput =
    document.getElementById("other-input");


// 勾選 / 取消「其他」
otherCheckbox.addEventListener("change", function () {

    if (otherCheckbox.checked) {

        // 顯示輸入框
        otherInput.style.display = "block";

        // 自動把游標放到輸入框
        otherInput.focus();

    } else {

        // 隱藏輸入框
        otherInput.style.display = "none";

        // 清空輸入內容
        otherInput.value = "";
    }

});
const urlParams = new URLSearchParams(window.location.search);

const bikeId = urlParams.get("bike");


// 找到網頁上的 ID 顯示區域
const bikeIdElement = document.getElementById("bike-id");


// 如果網址有 bike ID
if (bikeId) {

    bikeIdElement.textContent = bikeId;

} else {

    bikeIdElement.textContent = "找不到腳踏車 ID";

}


// ===============================
// 取得送出按鈕
// ===============================

const submitButton = document.getElementById("submit-button");

const errorMessage = document.getElementById("error-message");


// ===============================
// 按下確認送出
// ===============================

submitButton.addEventListener("click", function () {

    // 找出所有被勾選的 checkbox
    const checkboxes = document.querySelectorAll(
        'input[type="checkbox"]:checked'
    );


    // 沒有選擇任何項目
    if (checkboxes.length === 0) {

        errorMessage.textContent =
            "⚠️ 請至少選擇一項需要報修的零件";

        return;
    }


    // 如果勾選「其他」
    if (otherCheckbox.checked) {

        // 去除前後空白
        const otherText =
            otherInput.value.trim();


        // 沒有輸入內容
        if (otherText === "") {

            errorMessage.textContent =
                "⚠️ 請輸入「其他」需要報修的項目";

            otherInput.focus();

            return;
        }
    }


    // 清除錯誤訊息
    errorMessage.textContent = "";


    // 儲存報修項目
    const selectedParts = [];


    checkboxes.forEach(function (checkbox) {

        // 如果是「其他」
        if (checkbox.value === "其他") {

            const otherText =
                otherInput.value.trim();

            selectedParts.push(
                "其他：" + otherText
            );

        } else {

            selectedParts.push(
                checkbox.value
            );

        }

    });


    // 把報修項目組合起來
    const parts =
        selectedParts.join(",");


    // 跳轉到成功頁面
    window.location.href =
        "success.html?bike=" +
        encodeURIComponent(bikeId) +
        "&parts=" +
        encodeURIComponent(parts);

});