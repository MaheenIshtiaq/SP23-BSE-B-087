function loadDescription(file, elementId) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById(elementId).innerHTML = this.responseText;
            document.getElementById(elementId).style.display = 'block';
        }
    };
    xhr.open("GET", file, true);
    xhr.send();
}
