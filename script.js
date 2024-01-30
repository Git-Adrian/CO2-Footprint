var currentSortOrder = "country"; // Standardmäßig nach Land sortieren
 
 document.addEventListener("DOMContentLoaded", function() {
    
    // Selektiere die Input-Felder und die Checkboxen
    var countryFilterInput = document.getElementById("countryFilter");
    var companyFilterInput = document.getElementById("companyFilter");
    var filterByCompanyCheckbox = document.getElementById("filterByCompanyCheckbox");
    var filterByCountryCheckbox = document.getElementById("filterByCountryCheckbox");

    // Füge Event-Listener hinzu, um auf Änderungen in den Input-Feldern und den Checkboxen zu reagieren
    countryFilterInput.addEventListener("input", filterTable);
    companyFilterInput.addEventListener("input", filterTable);
    filterByCompanyCheckbox.addEventListener("change", filterTable);
    filterByCountryCheckbox.addEventListener("change", filterTable);
  
    // Selektiere die sortierbaren Spalten
    var sortableColumns = document.querySelectorAll(".sortable");

    // Füge Event-Listener hinzu, um auf Klicks in den sortierbaren Spalten zu reagieren
    sortableColumns.forEach(function(column, index) {
        column.addEventListener("click", function() {
            sortTable(index);
        });
    });

    // Selektiere die Tabellenüberschriften für Country und Company
    var countrySortColumn = document.querySelector(".sortable"); 
    var companySortColumn = document.querySelector(".sortable"); 
 
    countrySortColumn.addEventListener("click", function() {
         sortTable("country");
     });
 
     companySortColumn.addEventListener("click", function() {
         sortTable("company");
     });  
 });

 function filterTable() {
    // Hole die Checkbox-Status und die Filterwerte
    var filterByCompanyCheckbox = document.getElementById("filterByCompanyCheckbox");
    var filterByCountryCheckbox = document.getElementById("filterByCountryCheckbox");
    var countryFilter = document.getElementById('countryFilter').value.trim().toLowerCase();
    var companyFilter = document.getElementById('companyFilter').value.trim().toLowerCase();

    // Aufteilen der eingegebenen Begriffe
    var countryFilterTerms = countryFilter.split(/\s+/);
    var companyFilterTerms = companyFilter.split(/\s+/);

    // Selektiere die Tabelle und die Zeilen
    var table = document.getElementById("emissionTable");
    var rows = table.getElementsByTagName("tr");

    // Iteriere durch die Zeilen und zeige/verstecke sie basierend auf den Checkboxen und den eingegebenen Begriffen
    for (var i = 1; i < rows.length; i++) {   
        var countryColumn = rows[i].querySelector(".country");
        var companyColumn = rows[i].querySelector(".company");

        if (countryColumn || companyColumn) {
            // Überprüfe, ob mindestens eine der Checkboxen aktiviert ist
            if (filterByCompanyCheckbox.checked || filterByCountryCheckbox.checked) {
                // Überprüfe, ob die Zeile den Filterbedingungen entspricht
                var companyFilterCondition = filterByCompanyCheckbox.checked && companyColumn && matchesFilter(companyColumn.textContent.trim().toLowerCase(), companyFilterTerms);
                var countryFilterCondition = filterByCountryCheckbox.checked && countryColumn && matchesFilter(countryColumn.textContent.trim().toLowerCase(), countryFilterTerms);

                if ((filterByCompanyCheckbox.checked && filterByCountryCheckbox.checked) && (companyFilterCondition || countryFilterCondition)) {
                    rows[i].style.display = "";
                } else if (filterByCompanyCheckbox.checked && companyFilterCondition) {
                    rows[i].style.display = "";
                } else if (filterByCountryCheckbox.checked && countryFilterCondition) {
                    rows[i].style.display = "";
                } else {
                    rows[i].style.display = "none";
                }
            } else {
                // Wenn keine Checkbox ausgewählt ist, zeige alle Zeilen
                rows[i].style.display = "";
            }
        }
    }
}

// Funktion zum Überprüfen, ob der Text mit einem der Filterbegriffe beginnt
function matchesFilter(text, filterTerms) {
    for (var j = 0; j < filterTerms.length; j++) {
        if (text.startsWith(filterTerms[j])) {
            return true;
        }
    }
    return false;
}
 
function sortTable(columnIndex) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("emissionTable");
    switching = true;

    while (switching) {
        switching = false;
        rows = table.getElementsByTagName("tr");

        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("td")[columnIndex];
            y = rows[i + 1].getElementsByTagName("td")[columnIndex];

            var xIsCountry = x.classList.contains("country");
            var yIsCountry = y.classList.contains("country");
            var xIsCompany = x.classList.contains("company");
            var yIsCompany = y.classList.contains("company");

            if (currentSortOrder === "country") {
                // Sortiere zuerst nach Land, dann nach Unternehmen
                if ((xIsCountry && yIsCountry) || (xIsCompany && yIsCompany)) {
                    var comparison = x.textContent.toLowerCase().localeCompare(y.textContent.toLowerCase());
                    if (comparison > 0) {
                        shouldSwitch = true;
                        break;
                    }
                } else if (xIsCountry && yIsCompany) {
                    shouldSwitch = true;
                    break;
                }
            } else {
                // Sortiere zuerst nach Unternehmen, dann nach Land
                if ((xIsCountry && yIsCountry) || (xIsCompany && yIsCompany)) {
                    var comparison = x.textContent.toLowerCase().localeCompare(y.textContent.toLowerCase());
                    if (comparison < 0) {
                        shouldSwitch = true;
                        break;
                    }
                } else if (xIsCompany && yIsCountry) {
                    shouldSwitch = true;
                    break;
                }
            }
        }

        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }

    // Ändere den aktuellen Sortierstatus für die nächste Klickaktion
    currentSortOrder = currentSortOrder === "country" ? "company" : "country";
}
