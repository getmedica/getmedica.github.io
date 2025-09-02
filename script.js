// Page navigation
function showPage(pageId) {
    document.querySelectorAll('.container').forEach(page => {
    page.style.display = 'none';
    });
    document.getElementById(pageId).style.display = 'block';
    window.scrollTo(0, 0);
}

// Modal functions
function showDisclaimer() {
    document.getElementById("disclaimerModal").style.display = "block";
}

function closeDisclaimer() {
    document.getElementById("disclaimerModal").style.display = "none";
}

async function acceptDisclaimer() {
    const form = document.getElementById("medicalForm");
    const formData = new FormData(form);

    try {
    let response = await fetch("https://www.formbackend.com/f/2090050a3bce2d75", {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" }
    });

    if (response.ok) {
        document.getElementById("disclaimerModal").style.display = "none";
        document.getElementById("confirmationModal").style.display = "block";
        form.reset();
    } else {
        alert("❌ Error submitting form. Please try again.");
    }
    } catch (error) {
    alert("⚠️ Network error. Please check your internet.");
    }
}

function closeConfirmation() {
    document.getElementById("confirmationModal").style.display = "none";
}

window.onclick = function(event) {
    const disclaimer = document.getElementById("disclaimerModal");
    const confirmation = document.getElementById("confirmationModal");
    if (event.target == disclaimer) disclaimer.style.display = "none";
    if (event.target == confirmation) confirmation.style.display = "none";
}