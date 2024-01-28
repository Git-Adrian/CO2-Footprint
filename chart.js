// Erstellen des Balkendiagramms beim Laden der Seite
createChart();
createTable(); 

function createChart() {
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(entry => `${entry.country} - ${entry.company}`),
            datasets: [{
                label: 'CO₂-Emissionen (in Millionen Tonnen)',
                backgroundColor: data.map(entry => 'rgba(76, 175, 80, 0.5)'),
                borderColor: data.map(entry => 'rgba(76, 175, 80, 1)'),
                borderWidth: 1,
                data: data.map(entry => entry.emissions)
            }]
        },  
    });
}

// Canvas-Element für das Diagramm
var ctx = document.getElementById('emissionChart').getContext('2d');

// Konfiguration für das Balkendiagramm
var chartOptions = {
    scales: {
        y: {
            beginAtZero: true
        }
    },
    plugins: {
        tooltip: {
            callbacks: {
                title: (tooltipItem) => data[tooltipItem[0].dataIndex].company,
                label: (tooltipItem) => `Land: ${data[tooltipItem.dataIndex].country}, 
                Emissionen: ${tooltipItem.formattedValue} Millionen Tonnen`
            }
        }
    }  
};

// Erstellen des Balkendiagramms
var myBarChart = new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: chartOptions
});

function updateChart() {
    // Daten für das Diagramm direkt aus der sortierten Tabelle extrahieren
    var table = document.getElementById("emissionTable");
    var tableRows = table.querySelectorAll("tbody tr");

    var chartData = Array.from(tableRows).map(function (row, index) {
        var cells = row.querySelectorAll("td");
        var isSelected = row.classList.contains('selected-row');

        // Hervorhebung in der Tabelle beibehalten
        if (isSelected) {
            row.classList.add('selected-row');
        }

        return {
            country: cells[0].textContent.trim(), 
            emissions: parseFloat(cells[1].textContent.trim()),
            selected: isSelected
        };
    });

    // Hier wird die Filterung basierend auf den Eingabewerten der Filterfelder angewendet
    var countryFilter = document.getElementById('countryFilter').value.toUpperCase();
    var companyFilter = document.getElementById('companyFilter').value.toUpperCase();

    chartData = chartData.filter(function (entry) {
        return entry.country.toUpperCase().includes(countryFilter) && entry.company.toUpperCase().includes(companyFilter);
    });

     // Bestimme die aktuelle Sortierrichtung der Tabelle
     var currentSortColumn = Array.from(table.querySelectorAll('.sortable')).findIndex(column => {
        return column.querySelector('.sort-arrow').style.display !== 'none';
    });

   // Sortiere das chartData-Array entsprechend der Sortierrichtung
   chartData.sort(function (a, b) {
    // Anpassung der Sortierung nach "country" und "company"
    var valueA, valueB;

    if (currentSortColumn === 0) {
        // Sortiere nach "country"
        valueA = a.country.toLowerCase();
        valueB = b.country.toLowerCase();
    } else if (currentSortColumn === 1) {
        // Sortiere nach "company"
        valueA = a.company.toLowerCase();
        valueB = b.company.toLowerCase();
    } else {
        // Standard: Sortiere nach "emissions"
        valueA = a.emissions;
        valueB = b.emissions;
    }

    // Bestimme die Sortierrichtung (aufsteigend oder absteigend)
    var isAscending = sortDirection[currentSortColumn] === 1;

    return isAscending ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
});

    // Chart-Instanz löschen
    myChart.destroy();

    // Neues Diagramm erstellen
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.map(function (entry) {
                return entry.country + " - " + entry.company;
            }),
            datasets: [{
                label: 'CO₂-Emissionen (in Millionen Tonnen)',
                data: chartData.map(function (entry) {
                    return entry.emissions;
                }),
                backgroundColor: chartData.map(function (entry) {
                    return entry.selected ? 'rgba(255, 0, 0, 1)' : 'rgba(76, 175, 80, 0.5)';
                }),
                borderColor: chartData.map(function (entry) {
                    return entry.selected ? 'rgba(255, 0, 0, 1)' : 'rgba(76, 175, 80, 1)';
                }),
                borderWidth: 1
            }]
        },
         
    });
    console.log(data);
}