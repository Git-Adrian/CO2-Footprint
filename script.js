// Objekt zur Speicherung der Sortierrichtung für jede Spalte
var sortDirection = {
    0: 1,
    1: 1,
    2: 1
};

// Funktion zum Sortieren der Tabelle
function sortTable(column) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("emissionTable");
    switching = true;

    // Ändern der Sortierrichtung für die aktuelle Spalte
    sortDirection[column] *= -1;

    // Entfernen aller Pfeile
    var arrows = document.querySelectorAll('.sort-arrow');
    arrows.forEach(arrow => {
        arrow.innerHTML = '';
        arrow.classList.remove('asc', 'desc');
    });

    // Setzen des Pfeils für die aktuelle Spalte
    if (column === 0 || column === 1) {
        var currentArrow = document.querySelector('.sortable:nth-child(' + (column + 1) + ') .sort-arrow');
        currentArrow.style.display = 'inline-block';

        if (sortDirection[column] === 1) {
            currentArrow.innerHTML = '↑';
            currentArrow.classList.add('asc');
        } else {
            currentArrow.innerHTML = '↓';
            currentArrow.classList.add('desc');
        }
    }

    // Durchlaufen der Tabelle und Sortieren der Zeilen
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < rows.length - 1; i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("td")[column];
            y = rows[i + 1].getElementsByTagName("td")[column];

            if (column === 0 || column === 1) {
                // Spalte "Land" oder "Unternehmen" basierend auf dem Anfangsbuchstaben sortieren
                shouldSwitch = sortDirection[column] === 1 ? x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase() : x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase();
            } else if (column === 2) {
                //Spalte "CO₂-Emissionen" bleibt unverändert
                continue
            } 
            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
            }
        } 
    }
    updateChart(); // Hier rufen wir die Funktion auf, um das Diagramm zu aktualisieren
}
  
// Funktion zum Filtern der Tabelle basierend auf Eingabewerten
function filterTable() {
    var countryFilter = document.getElementById('countryFilter');
    var companyFilter = document.getElementById('companyFilter');
    var table = document.getElementById('emissionTable');
    var rows = table.getElementsByTagName('tr');

    var countryValue = countryFilter.value.toUpperCase();
    var companyValue = companyFilter.value.toUpperCase();

    // Iteriere über die Zeilen der Tabelle
    for (var i = 1; i < rows.length; i++) {
        var row = rows[i];
        var countryCell = row.cells[0].textContent.toUpperCase();
        var companyCell = row.cells[1].textContent.toUpperCase();

        // Überprüfung, ob die Zeile den Filterkriterien entspricht
        row.style.display = (countryCell.indexOf(countryValue) > -1 && companyCell.indexOf(companyValue) > -1) ? '' : 'none';
    }
    // Aktualisiere das Diagramm nach der Filterung
    updateChart();
}

document.addEventListener('DOMContentLoaded', function () {
    // Referenz zur Tabelle erhalten
    var table = document.getElementById('emissionTable');

    // Referenzen zu den Textfeldern für die Filterung
    var countryFilter = document.getElementById('countryFilter');
    var companyFilter = document.getElementById('companyFilter');

    // Event Listener für Änderungen in den Filterfeldern
    countryFilter.addEventListener('input', filterTable);
    companyFilter.addEventListener('input', filterTable);
}); 
 
    // Initialisierung der CO₂-Emissionsdaten für das Diagramm
    var data = []; 
    // CO₂-Emissionsdaten für das Diagramm
    var ctx = document.getElementById('emissionChart').getContext('2d');
    var myChart;
    
    // Zugriff auf die Tabelle
    var table = document.getElementById("emissionTable");
    var tableRows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    // Durchlaufen der Tabellenzeilen und Extrahieren der Daten
    for (var i = 0; i < tableRows.length; i++) {
    var cells = tableRows[i].getElementsByTagName('td');
    
    // Extrahieren der Werte aus den Zellen und Hinzufügen zum data-Array
    var country = cells[0].textContent.trim();
    var company = cells[1].textContent.trim();
    var emissions = parseFloat(cells[2].textContent.trim());

    data.push({
        country: country,
        company: company,
        emissions: emissions
    });
}

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
                    label: (tooltipItem) => `Land: ${data[tooltipItem.dataIndex].country}, Emissionen: ${tooltipItem.formattedValue} Millionen Tonnen`
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
                company: cells[1].textContent.trim(),
                emissions: parseFloat(cells[2].textContent.trim()),
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
  