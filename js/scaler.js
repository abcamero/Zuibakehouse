// js/scaler.js

// We load the data directly here for local execution without a server
const recipeData = {
    "base_containers": 9,
    "base_total_batter": 929,
    "grams_per_container": 100,
    "ingredients": [
        { name: "Butter", qty: 75 },
        { name: "Sugar", qty: 125 },
        { name: "Eggs", qty: 250 },
        { name: "Cocoa powder", qty: 25 },
        { name: "Honey", qty: 75 },
        { name: "Fresh cream", qty: 120 },
        { name: "Flour", qty: 120 },
        { name: "Baking powder", qty: 8 },
        { name: "Dark chocolate 58.8%", qty: 50 },
        { name: "Vanilla essence", qty: 4 },
        { name: "Orange zest", qty: 2 },
        { name: "Ground almond", qty: 75 }
    ]
};

function initScaler() {
    const inputElement = document.getElementById('targetContainers');
    if (!inputElement) return; // Exit if we aren't on the scaler page

    const tableBody = document.getElementById('recipeTableBody');
    const totalBatterEl = document.getElementById('totalBatterVal');
    const actualYieldEl = document.getElementById('actualYieldVal');
    const wasteEl = document.getElementById('wasteVal');

    function calculateRecipe() {
        let target = parseInt(inputElement.value) || recipeData.base_containers;
        if (target < recipeData.base_containers) target = recipeData.base_containers;

        const multiplier = target / recipeData.base_containers;
        tableBody.innerHTML = '';

        recipeData.ingredients.forEach(item => {
            const scaledQty = (item.qty * multiplier).toFixed(1);
            const row = document.createElement('tr');
            row.className = "hover:bg-stone-50 transition-colors";
            row.innerHTML = `
                <td class="px-6 py-3 text-sm font-medium text-stone-700">${item.name}</td>
                <td class="px-6 py-3 text-sm font-bold text-stone-900 text-right">${scaledQty}</td>
            `;
            tableBody.appendChild(row);
        });

        const totalBatter = recipeData.base_total_batter * multiplier;
        const actualContainers = Math.floor(totalBatter / recipeData.grams_per_container);
        const waste = totalBatter % recipeData.grams_per_container;

        totalBatterEl.innerText = totalBatter.toFixed(1) + ' g';
        actualYieldEl.innerText = actualContainers;
        wasteEl.innerText = waste.toFixed(1) + ' g';
    }

    inputElement.addEventListener('input', calculateRecipe);
    calculateRecipe(); // Initial load
}

// Start the scaler when the page loads
document.addEventListener('DOMContentLoaded', initScaler);