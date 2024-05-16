// const data = [
//     {
//         "id": "bitcoin",
//         "symbol": "btc",
//         "name": "Bitcoin"
//     },
//     {
//         "id": "ethereum-2",
//         "symbol": "eth2",
//         "name": "ethereum 2"
//     },
//     {
//         "id": "gold",
//         "symbol": "btca",
//         "name": "Gold Asia"
//     }
// ];

// function filterByName() {
//     const filterValue = document.getElementById('filterInput').value.toLowerCase();
//     const filteredData = data.filter(item => item.name.toLowerCase().includes(filterValue));
//     displayResults(filteredData);
// }

// function displayResults(results) {
//     const resultList = document.getElementById('resultList');
//     resultList.innerHTML = '';
//     results.forEach(item => {
//         const li = document.createElement('li');
//         li.textContent = `${item.id} - ${item.symbol} - ${item.name}`;
//         resultList.appendChild(li);
//     });
// }

// function showAll() {
//     // const filterInput = document.getElementById("filterInput");
//     // filterInput.value = "";
//     displayResults(data); // only this important!
// }

// displayResults(data);  // at the beginning (can be onload as well)