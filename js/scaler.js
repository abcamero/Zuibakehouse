// js/scaler.js

// 1. The Multi-Recipe Database
const recipeDatabase = {
    "chocolate_orange": {
        name: "Chocolate Orange Cake",
        base_containers: 9,
        base_total_batter: 929,
        grams_per_container: 100,
        ingredients: [
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
    },
    "banana_choc_chip": {
        name: "Banana Chocolate Chip Cake",
        base_containers: 7,
        base_total_batter: 761,
        grams_per_container: 100,
        ingredients: [
            { name: "Flour", qty: 200 },
            { name: "Sugar", qty: 60 },
            { name: "Condensed milk", qty: 200 },
            { name: "Baking Soda", qty: 3 },
            { name: "Curd", qty: 75 },
            { name: "Butter", qty: 60 },
            { name: "Vanilla essence", qty: 3 },
            { name: "Banana", qty: 140 },
            { name: "Chocolate chips", qty: 20 }
        ]
    }
};

function initScaler() {
    // DOM Elements
    const inputElement = document.getElementById('targetContainers');
    const recipeSelect = document.getElementById('recipeSelect');
    const recipeTitle = document.getElementById('recipeTitle');
    const minBatchHint = document.getElementById('minBatchHint');
    const baseRecipeBadge = document.getElementById('baseRecipeBadge');
    
    const tableBody = document.getElementById('recipeTableBody');
    const totalBatterEl = document.getElementById('totalBatterVal');
    const actualYieldEl = document.getElementById('actualYieldVal');
    const wasteEl = document.getElementById('wasteVal');

    if (!inputElement || !recipeSelect) return;

    // Track which recipe is currently selected
    let currentRecipeKey = recipeSelect.value;

    function calculateRecipe() {
        const activeRecipe = recipeDatabase[currentRecipeKey];
        
        // Ensure input doesn't drop below the recipe's specific minimum
        let target = parseInt(inputElement.value) || activeRecipe.base_containers;
        if (target < activeRecipe.base_containers) {
            target = activeRecipe.base_containers;
        }

        // Math Calculations
        const multiplier = target / activeRecipe.base_containers;
        const totalBatter = activeRecipe.base_total_batter * multiplier;
        const actualContainers = Math.floor(totalBatter / activeRecipe.grams_per_container);
        const waste = totalBatter % activeRecipe.grams_per_container;

        // Render Table
        tableBody.innerHTML = '';
        activeRecipe.ingredients.forEach(item => {
            const scaledQty = Math.round(item.qty * multiplier); // Rounding to whole grams
            
            const row = document.createElement('tr');
            row.className = "hover:bg-stone-50 transition-colors";
            row.innerHTML = `
                <td class="px-6 py-3 text-sm font-medium text-stone-700">${item.name}</td>
                <td class="px-6 py-3 text-sm font-bold text-stone-900 text-right">${scaledQty}</td>
            `;
            tableBody.appendChild(row);
        });

        // Update UI Text & Summaries
        recipeTitle.innerText = `${activeRecipe.name} Formula`;
        baseRecipeBadge.innerText = `Base: ${activeRecipe.base_containers} units`;
        minBatchHint.innerText = `Minimum batch size is ${activeRecipe.base_containers} containers.`;
        
        totalBatterEl.innerText = totalBatter.toFixed(1) + ' g';
        actualYieldEl.innerText = actualContainers;
        wasteEl.innerText = waste.toFixed(1) + ' g';
    }

    // Event Listeners
    inputElement.addEventListener('input', calculateRecipe);
    
    // When dropdown changes, reset the input to the new recipe's default and recalculate
    recipeSelect.addEventListener('change', (e) => {
        currentRecipeKey = e.target.value;
        const newActiveRecipe = recipeDatabase[currentRecipeKey];
        
        // Set the input box to the minimum required for the new recipe
        inputElement.min = newActiveRecipe.base_containers;
        inputElement.value = newActiveRecipe.base_containers;
        
        calculateRecipe();
    });

    // Initial load
    calculateRecipe();
}

// Boot the app
document.addEventListener('DOMContentLoaded', initScaler);