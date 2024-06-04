/// <reference path="jquery-3.7.0.js" />

"use strict";
console.log($);

$(() => {

    handleHome();
    
    $("a.nav-link").on("click", function () {

        // Pill UI: 
        $("a.nav-link").removeClass("active");
        $(this).addClass("active");

        // Display correct section:
        const sectionId = $(this).attr("data-section");
        $("section").hide();
        $("#" + sectionId).show();

    });

    $("#coinsContainer").on("click", ".more-info", async function () {
        const coinId = $(this).attr("id").substring(7);
        await handleMoreInfo(coinId);
    });

    // $("#homeLink").on("click", async () => await handleHome());
    // $("#reportsLink").on("click", () => { });
    // $("#aboutLink").on("click", () => { });

    async function handleHome() {
        const coins = await getJson("https://api.coingecko.com/api/v3/coins/list");
        console.log(coins);        

        // const coins = await getJson("coins.json");
        displayCoins(coins);
    }

    function displayCoins(coins) {
        coins = coins.filter(c => c.symbol.length <= 3);
        let html = "";
        for (let i = 0; i < 100; i++) {
            html += `
            <div class="card" >
                <div class="card-body">
                    <h5 class="card-title">${coins[i].symbol} <span class= "form-check form-switch" >
                    <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onclick="favorite()">
                    <label class="form-check-label" for="flexSwitchCheckDefault"></label></span></h5>
                    <p class="card-text">${coins[i].name}</p>

                    <button id="button_${coins[i].id}" class="btn btn-primary more-info" data-bs-toggle="collapse" data-bs-target="#collapse_${coins[i].id}">
                        More Info
                    </button>
                    <div style="min-height: 120px;">
                        <div class="collapse collapse-horizontal" id="collapse_${coins[i].id}">
                            <div class="card card-body">
                                <div id="progressbar">
                                <div class="progress-label">Loading...
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            `;
        }
        $("#coinsContainer").html(html);
    }

    async function handleMoreInfo(coinId) {
        // const loading = await fetchDataAndCache();//error
        const coin = await getJson("https://api.coingecko.com/api/v3/coins/" + coinId);
        !coin &&  $(`#collapse_${coinId}`).children().html("In Progress");
        const imageSource = coin.image.thumb;
        const usd = coin.market_data.current_price.usd;
        const eur = coin.market_data.current_price.eur;
        const ils = coin.market_data.current_price.ils;
        const moreInfo = `
            <img src="${imageSource}"> <br>
            USD: $${usd} <br>
            EUR: Є${eur} <br>
            ILS: ₪${ils}
        `;
        $(`#collapse_${coinId}`).children().html(moreInfo);
    }

    async function getJson(url) {
        const response = await fetch(url);
        const json = await response.json();
        return json;
    }

});




function fetchDataAndCache() {
    fetch('https://api.coingecko.com/api/v3/coins/list')
        .then(response => response.json())
        .then(jsonData => {
            sessionStorage.setItem('coinData', JSON.stringify(jsonData)); // Save fetched data to sessionStorage
            displayResults(jsonData); // Display fetched data
        })
        .catch(error => console.error('Error fetching data:', error));
}

//top 100


const fetchTop100Prices = async () => {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=100&page=1');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
        throw error;
    }
};

fetchTop100Prices()
    .then(data => {
        // console.log(data);
        //store the data to sessionStorage
        sessionStorage.setItem('Top100', JSON.stringify(data));
        // console.log(data[0].name + " price is: $" + data[0].current_price);
    })
    .catch(error => {
        console.error('Error during fetch operation:', error);
    });


function fetchFromSessionStorage() {
    const top100 = JSON.parse(sessionStorage.getItem('Top100')); // Get data from session storage and parse it
    return top100;
}

function fetchCOINFromLocalStorage(coinId) {
    const top100 = JSON.parse(sessionStorage.getItem('Top100')); // Get data from session storage and parse it
    const coin = top100.find(coin => coin.id === coinId);
    return coin;
}



function displayTableCoins() {
    // Get data from session storage and parse it
    // const top100 = JSON.parse(sessionStorage.getItem('top100'));
    const coinsData = fetchFromSessionStorage();
    console.log(coinsData)


    const table = document.createElement('table');// Create table element

    // Create table header
    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    ['Rank', 'Name', 'Symbol', 'icon', 'Price (USD)', 'Market Cap (USD)'].forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    // Create table body
    const tbody = table.createTBody();
    coinsData.forEach((coin, index) => {
        const row = tbody.insertRow();
        row.insertCell().textContent = index + 1; // Rank
        row.insertCell().textContent = coin.name; // Name
        row.insertCell().textContent = coin.symbol.toUpperCase(); // Symbol
        row.insertCell().innerHTML = '<img src="' + coin.image + '" class="icon">'; // Image
        row.insertCell().textContent = '$' + coin.current_price.toFixed(2); // Price 
        row.insertCell().textContent = '$' + Number(coin.market_cap).toLocaleString('en', { maximumFractionDigits: 0 }); // Market Cap
    });

    // clear div "content" to make room for the table
    const contentDiv = document.getElementById("root");
    contentDiv.innerHTML = '';
    contentDiv.appendChild(table);// append table to body
}

//fin top 100 cela fonctionne
