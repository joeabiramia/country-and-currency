// Fetch all countries from the API
fetch('https://restcountries.com/v3.1/all')
  .then(response => response.json())
  .then(countries => {
    // Get the country select element and add all countries as options
    const countrySelect = document.getElementById('country-select');
    countries.forEach(country => {
      const option = document.createElement('option');
      option.value = country.name.common;
      option.text = country.name.common;
      countrySelect.add(option);
    });

    // Add an event listener to the country select to update the flag and currencies when a country is selected
    countrySelect.addEventListener('change', () => {
      const selectedCountry = countries.find(country => country.name.common === countrySelect.value);
      const flag = document.getElementById('flag');
      flag.src = selectedCountry.flags.png;
      flag.style.display = 'block';

      const currenciesList = document.getElementById('currencies-list');
      currenciesList.innerHTML = '';
      Object.keys(selectedCountry.currencies).forEach(currency => {
        const listItem = document.createElement('li');
        const button = document.createElement('button');
        button.innerHTML = currency;
        button.addEventListener('click', () => {
          const exchangeRatesTable = document.getElementById('exchange-rates-table');
          exchangeRatesTable.style.display = 'block';
          exchangeRatesTable.innerHTML = '<tr><th>Currency</th><th>Exchange Rate (USD)</th></tr>';

          // Fetch the exchange rate for the selected currency
          fetch(`https://api.exchangerate-api.com/v4/latest/USD`)
            .then(response => response.json())
            .then(data => {
              const exchangeRate = data.rates[currency];
              const row = document.createElement('tr');
              const currencyCell = document.createElement('td');
              const exchangeRateCell = document.createElement('td');
              currencyCell.innerHTML = currency;
              exchangeRateCell.innerHTML = exchangeRate;
              row.appendChild(currencyCell);
              row.appendChild(exchangeRateCell);
              exchangeRatesTable.appendChild(row);
            })
            .catch(error => {
              console.error('Error fetching exchange rate:', error);
            });
        });
        listItem.appendChild(button);
        currenciesList.appendChild(listItem);
      });
    });
  })
  .catch(error => {
    console.error('Error fetching countries:', error);
  });
