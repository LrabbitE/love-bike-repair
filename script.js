// ========================================
// Supabase 設定
// ========================================

const SUPABASE_URL =
    "https://lrqdbwrjnzxncmqcfqdn.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_vK-p3gPhpKtcAnsaKX_UDA__l1k-OK7";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


// ========================================
// 取得網址中的腳踏車 ID
// ========================================

const urlParams =
    new URLSearchParams(window.location.search);

const bikeId =
    urlParams.get("bike");


console.log("================================");
console.log("Supabase 初始化完成");
console.log("Supabase URL:", SUPABASE_URL);
console.log("Bike ID:", bikeId);
console.log("================================");

// ========================================
// 顯示腳踏車 ID
// ========================================

const bikeIdElement =
    document.getElementById("bike-id");


if (bikeId) {

    bikeIdElement.textContent = bikeId;

} else {

    bikeIdElement.textContent =
        "找不到腳踏車 ID";

}


// ========================================
// 「其他」輸入框
// ========================================

const otherCheckbox =
    document.getElementById("other-checkbox");

const otherInput =
    document.getElementById("other-input");


// 一開始先隱藏「其他」輸入框
otherInput.style.display = "none";


// 勾選 / 取消「其他」
otherCheckbox.addEventListener(
    "change",
    function () {

        if (otherCheckbox.checked) {

            // 顯示輸入框
            otherInput.style.display = "block";

            // 游標移到輸入框
            otherInput.focus();

        } else {

            // 隱藏輸入框
            otherInput.style.display = "none";

            // 清空輸入內容
            otherInput.value = "";

        }

    }
);


// ========================================
// 取得送出按鈕
// ========================================

const submitButton =
    document.getElementById("submit-button");

const errorMessage =
    document.getElementById("error-message");


// ========================================
// 報修項目編號
// ========================================

const issueCodeMap = {

    "輪胎": 1,

    "煞車線": 2,

    "鏈條": 3,

    "車架": 4,

    "座椅": 5,

    "踏板": 6,

    "車輪": 7,

    "車燈": 8,

    "其他": 9

};


// ========================================
// 按下「確認送出」
// ========================================

submitButton.addEventListener(
    "click",
    async function () {

        // ----------------------------
        // ① 檢查 Bike ID
        // ----------------------------

        if (!bikeId) {

            errorMessage.textContent =
                "⚠️ 找不到腳踏車 ID";

            return;

        }


        // ----------------------------
        // ② 找出所有勾選項目
        // ----------------------------

        const checkboxes =
            document.querySelectorAll(
                'input[type="checkbox"]:checked'
            );


        // ----------------------------
        // ③ 沒有勾選任何項目
        // ----------------------------

        if (checkboxes.length === 0) {

            errorMessage.textContent =
                "⚠️ 請至少選擇一項需要報修的零件";

            return;

        }


        // ----------------------------
        // ④ 如果勾選「其他」
        // ----------------------------

        if (otherCheckbox.checked) {

            const otherText =
                otherInput.value.trim();


            if (otherText === "") {

                errorMessage.textContent =
                    "⚠️ 請輸入「其他」需要報修的項目";

                otherInput.focus();

                return;

            }

        }


        // ----------------------------
        // ⑤ 清除錯誤訊息
        // ----------------------------

        errorMessage.textContent = "";


        // ----------------------------
        // ⑥ 建立問題編號陣列
        // ----------------------------

        const issueCodes = [];


        checkboxes.forEach(
            function (checkbox) {

                const partName =
                    checkbox.value;


                const code =
                    issueCodeMap[partName];


                if (code) {

                    issueCodes.push(code);

                }

            }
        );


        // ----------------------------
        // ⑦ 去除重複問題
        // ----------------------------

        const uniqueIssueCodes =
            [...new Set(issueCodes)];


        // ----------------------------
        // ⑧ 取得「其他」內容
        // ----------------------------

        let otherDescription = null;


        if (otherCheckbox.checked) {

            otherDescription =
                otherInput.value.trim();

        }


        // ----------------------------
        // ⑨ 按鈕變成「送出中」
        // ----------------------------

        submitButton.disabled = true;

        submitButton.textContent =
            "送出中...";


        // ----------------------------
        // ⑩ 傳送到 Supabase
        // ----------------------------

        const { data, error } =
            await supabaseClient.rpc(
                "submit_repair",
                {
                    p_bike_id: bikeId,

                    p_issue_codes:
                        uniqueIssueCodes,

                    p_other_description:
                        otherDescription
                }
            );


        // ----------------------------
        // ⑪ 判斷是否發生錯誤
        // ----------------------------

        if (error) {

            console.error(
                "Supabase 錯誤：",
                error
            );


            errorMessage.textContent =
                "⚠️ 報修送出失敗：" +
                error.message;


            submitButton.disabled = false;

            submitButton.textContent =
                "確認送出";

            return;

        }


        // ----------------------------
        // ⑫ 成功
        // ----------------------------

        console.log(
            "報修成功！",
            data
        );


        // 跳到成功頁面
        window.location.href =
            "success.html?bike=" +
            encodeURIComponent(bikeId) +
            "&parts=" +
            encodeURIComponent(
                checkboxesToText(checkboxes)
            );

    }
);


// ========================================
// 把勾選項目轉成文字
// ========================================

function checkboxesToText(checkboxes) {

    const selectedParts = [];


    checkboxes.forEach(
        function (checkbox) {

            if (checkbox.value === "其他") {

                selectedParts.push(
                    "其他：" +
                    otherInput.value.trim()
                );

            } else {

                selectedParts.push(
                    checkbox.value
                );

            }

        }
    );


    return selectedParts.join(",");

}