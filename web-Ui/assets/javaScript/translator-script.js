isLocation();

const fromText = document.querySelector(".from-text");
const selectedWordElement = document.getElementById('selectedWord'),
    toText = document.querySelector(".to-text"),
    exchageIcon = document.querySelector(".exchange"),
    selectTag = document.querySelectorAll("select"),
    icons = document.querySelectorAll(".row i");
translateBtn = document.querySelector("button"),
    selectTag.forEach((tag, id) => {
        for (let country_code in countries) {
            let selected = id == 0 ? country_code == "en-GB" ? "selected" : "" : country_code == "hi-IN" ? "selected" : "";
            let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
            tag.insertAdjacentHTML("beforeend", option);
        }
    });
exchageIcon.addEventListener("click", () => {
    let tempText = fromText?.value,
        tempLang = selectTag[0]?.value;
    fromText.value = toText?.value;
    toText.value = tempText;
    selectTag[0].value = selectTag[1]?.value;
    selectTag[1].value = tempLang;
});
fromText.addEventListener("keyup", () => {
    if (!fromText.value) {
        toText.value = "";
    }
});
translateBtn.addEventListener("click", () => {
    saveHistory();
});
icons.forEach(icon => {
    icon.addEventListener("click", ({ target }) => {
        if (!fromText?.value || !toText?.value) return;
        if (target?.classList.contains("fa-copy")) {
            if (target.id == "from") {
                navigator?.clipboard.writeText(fromText?.value);
            } else {
                navigator?.clipboard.writeText(toText?.value);
            }
        } else {
            let utterance;
            if (target?.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromText?.value);
                utterance.lang = selectTag[0]?.value;
            } else {
                utterance = new SpeechSynthesisUtterance(toText?.value);
                utterance.lang = selectTag[1]?.value;
            }
            speechSynthesis.speak(utterance);
        }
    });
});


function saveHistory() {
    // console.log(word);
    let text = fromText?.value.trim(),
        translateFrom = selectTag[0]?.value,
        translateTo = selectTag[1]?.value;
    if (!text) return;
    toText.setAttribute("placeholder", "Translating...");
    const Url = `http://localhost:1107/user/transalate?text=${text}&fromL=${translateFrom}&toL=${translateTo}`;
    // http://localhost:3000/user/transalate?text=my name is prajwal&fromL=en&toL=hi
    methodGET(Url).then(res => {
        // Process the response res here 
        // Example: Logging the res to the console 
        if (res?.status === 'SUCCESS') {
            // console.log('user/transalate', res);
            toText.value = res?.data?.responseData?.translatedText;
            res?.data?.matches?.forEach(data => {
                if (data?.id === 0) {
                    toText.value = data?.translation;
                }
            });
            toText.setAttribute("placeholder", "Translation");
        }
    }).catch(error => {
        // Handle any errors here 
        console.error(error); // Example: Logging the error to the console 
        if (error?.status !== 'SUCCESS') {
            infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
        }
    });
}