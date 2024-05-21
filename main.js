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

    $("#homeLink").on("click", async () => await handleHome());
    $("#reportsLink").on("click", () => { });
    $("#aboutLink").on("click", () => { });

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


// $(function() {
//     var progressbar = $("#progressbar"),
//       progressLabel = $(".progress-label");

//     progressbar.progressbar({
//       value: false,
//       change: function() {
//         progressLabel.text(progressbar.progressbar("value") + "%");
//       },
//       complete: function() {
//         progressLabel.text("Complete!");
//       }
//     });

//     // Function to fetch data from the API and update progress bar
//     function fetchDataAndCache() {
//       var val = 0;
//       progressbar.progressbar("value", val); // Set progress bar to initial value
//       progressLabel.text(val + "%");

//       // Simulating API call progress
//       var interval = setInterval(function() {
//         val += 10; // Simulating progress increment
//         progressbar.progressbar("value", val);
//         progressLabel.text(val + "%");

//         if (val >= 100) {
//           clearInterval(interval);
//           progressLabel.text("Complete!");
//           // call coins API
//           // fetch('api_endpoint')
//           //   .then(response => response.json())
//           //   .then(data => {
//           //     // Process the fetched data
//           //   })
//           //   .catch(error => console.error('Error fetching data:', error));
//         }
//       }, 500); // Adjust the interval as needed
//     }

//     // Trigger the data fetching function
//     fetchDataAndCache();
//   });

// favorite(){
//     con
// }


function fetchDataAndCache() {
    fetch('https://api.coingecko.com/api/v3/coins/list')
        .then(response => response.json())
        .then(jsonData => {
            sessionStorage.setItem('coinData', JSON.stringify(jsonData)); // Save fetched data to sessionStorage
            displayResults(jsonData); // Display fetched data
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Function to display results
// function displayResults(results) {
//     const resultList = document.getElementById('resultList');
//     resultList.innerHTML = '';
//     results.forEach(item => {
//         const li = document.createElement('li');
//         li.textContent = `${item.id} - ${item.symbol} - ${item.name}`;
//         resultList.appendChild(li);
//     });
// }

// // Function to check sessionStorage for cached data
// function checkCachedData() {
//     const cachedData = sessionStorage.getItem('coinData');

//     // If there's cached data, display it
//     if (cachedData) {
//         displayResults(JSON.parse(cachedData));
//     } else {
//         // If no cached data, fetch from API
//         fetchDataAndCache();
//     }
// }

// Check sessionStorage for cached data when the page loads
// window.onload = function() {
//     checkCachedData();
// };
