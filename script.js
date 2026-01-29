const API_URL = 'http://localhost:5000/api/donors';

async function loadDonors() {
    const response = await fetch(API_URL);
    const data = await response.json();

    const list = document.getElementById('donorList');

    list.innerHTML = data.map(d => `
        <div class="donor-card">
            <strong>${d.name}</strong>
            - ${d.bloodGroup}
            - ${d.contact}
        </div>
    `).join('');
}

document.getElementById('donorForm').onsubmit = async (e) => {
    e.preventDefault();

    const donor = {
        name: name.value,
        bloodGroup: bloodGroup.value,
        contact: contact.value
    };

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donor)
    });

    alert("Donor Registered Successfully!");

    e.target.reset();
    loadDonors();
};

loadDonors();