function openTab(tabName) {
    // Alle Tab-Inhalte ausblenden
    var tabcontents = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontents.length; i++) {
        tabcontents[i].style.display = "none";
    }
    
    // Deaktiviere alle Tab-Buttons
    var tablinks = document.getElementsByClassName("tablink");
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    
    // Zeige den ausgewählten Tab-Inhalt
    document.getElementById(tabName).style.display = "block";
    
    // Aktiviere den ausgewählten Tab-Button
    event.currentTarget.classList.add("active");
}


