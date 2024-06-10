const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies"

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector(".submit");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const swapBtn = document.querySelector(".swap");
const msg = document.querySelector(".msg");

for (let select of dropdowns){
    for(currCode in countryList){
        let newOption = document.createElement("option");
        // newOption.value = currCode;
        // newOption.innerText = currCode;
        newOption.innerText = `${currCode} - ${currencyList[currCode]}`;
        if (select.name === "from" && currCode === "USD"){
            newOption.selected = "selected";
        } else if(select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }
    select.addEventListener("change", (evt)=>{
        updateFlag(evt.target);
    });
}

const updateFlag = (element)=>{
    let currValue = element.value;
    let currCode = currValue.split(" ")[0];
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
}

const updateExchangeRate =  async()=>{
    let input = document.querySelector(".amount input");
    let amtValue = input.value;
    if(amtValue === "" || amtValue < 1){
        amtValue = 1;
        input.value = "1";
    }

    let fromValue = fromCurr.value;
    let toValue = toCurr.value;
    let from = fromValue.split(" ")[0];
    let to = toValue.split(" ")[0];
    const URL = `${BASE_URL}/${from.toLowerCase()}.json`;
    let response = await fetch(URL);
    let data = await response.json();
    let rate = data[from.toLowerCase()][to.toLowerCase()];

    let finalAmount = amtValue * rate;
    msg.innerText = `${amtValue} ${from} = ${finalAmount} ${to}`;
};
const swapCurrency = ()=>{
     // Swap the selected currencies in the dropdowns
    let temp = fromCurr.value;
    fromCurr.value = toCurr.value;
    toCurr.value = temp; 

    // Update the flag images after swapping
    updateFlag(fromCurr);
    updateFlag(toCurr);

    // Update the exchange rate after swapping
    updateExchangeRate();
};

window.addEventListener("load", ()=>{
    updateExchangeRate();
});

btn.addEventListener("click", (evt)=>{
    evt.preventDefault();
    updateExchangeRate();
});

swapBtn.addEventListener("click", (evt)=>{
    evt.preventDefault();
    swapCurrency();
});
