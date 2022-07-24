const tableBody = document.querySelector('.table__tbody');
const selectOne = document.querySelector('.converter__currencyOne');
const selectTwo = document.querySelector('.converter__currencyTwo');

const amountDiv = document.querySelector('.converter__amount');
const convertBtn = document.querySelector('.converter__button');
const resultDiv = document.querySelector('.converter__result');


function getAllCurrency () {
    const table = "A";
    const url = `http://api.nbp.pl/api/exchangerates/tables/${table}/?format=json`;
    return fetch(url)
    .then(response => response.json())
    .then(data => {
        const tableItems = data[0].rates;
        tableItems.forEach(item => {
            const tablerow = document.createElement('tr');
            tablerow.classList.add('table__row');
            tablerow.innerHTML = `<td>${item.currency}</td> <td>${item.code}</td> <td>${item.mid}</td>`;
            tableBody.appendChild(tablerow);

            const optionOne = document.createElement('option');
            optionOne.value = item.code;
            optionOne.innerHTML = `${item.code}`;
            selectOne.appendChild(optionOne);

            const optionTwo = document.createElement('option');
            optionTwo.value = item.code;
            optionTwo.innerHTML = `${item.code}`;
            if(item.code === "USD"){
                optionTwo.selected = "selected";
            }
            selectTwo.appendChild(optionTwo);
        }) 
    })
}


function getCurrency(code){
    const table = "A";
    const url = `http://api.nbp.pl/api/exchangerates/rates/${table}/${code}/`;
    return fetch(url)
    .then(response => response.json())
    .then(data => {
        return data.rates[0].mid;
    })
}

function assignResult (res) {
    resultDiv.textContent = "";
    resultDiv.textContent = Number(res).toFixed(2);
}

function calculate () {
    const optionOne = selectOne.options[selectOne.selectedIndex].value;
    const optionTwo = selectTwo.options[selectTwo.selectedIndex].value;
    const amount = amountDiv.value;

    let result;
    if(amount<1) {
        alert("błędne dane!")
        return;
    }
    else if(optionOne === optionTwo){
        result = amount;
        assignResult(result);
    }
    else if(optionOne === "PLN"){
        getCurrency(optionTwo)
        .then( (data) => {
            result = amount/data;
            assignResult(result);
        });
    }
    else if(optionTwo ==="PLN"){
        getCurrency(optionOne)
        .then( (data) => {
            result = amount*data;
            assignResult(result);
        })
    }
    else{
        let x;
        let y;

        getCurrency(optionOne)
        .then( (data) => {
            x= data;  
        })
        .then( () => {
            getCurrency(optionTwo)
            .then( (data) => {
                y= data;
                result = amount * (x/y);
                assignResult(result);
            })
        })
    } 
}


getAllCurrency();

convertBtn.addEventListener('click', calculate);
