// Deals Management
let currentDeals = [...dealsData];
let filteredDeals = [...dealsData];

// DOM Elemente
const searchInput = document.getElementById('searchInput');
const brandFilter = document.getElementById('brandFilter');
const sortSelect = document.getElementById('sortSelect');
const resetButton = document.getElementById('resetFilters');
const dealsContainer = document.getElementById('dealsContainer');
const noResults = document.getElementById('noResults');
const visibleDealsCount = document.getElementById('visibleDeals');
const totalDealsCount = document.getElementById('totalDeals');

// Event Listeners
searchInput.addEventListener('input', applyFilters);
brandFilter.addEventListener('change', applyFilters);
sortSelect.addEventListener('change', applyFilters);
resetButton.addEventListener('click', resetFilters);

sortSelect.value = 'discount-desc'; // Setze Default-Wert
applyFilters(); // Wende initiale Sortierung an

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedBrand = brandFilter.value;
    const sortMethod = sortSelect.value;

    // Filtern
    filteredDeals = currentDeals.filter(deal => {
        const matchesSearch = deal.title.toLowerCase().includes(searchTerm);
        const matchesBrand = !selectedBrand || deal.brand === selectedBrand;
        return matchesSearch && matchesBrand;
    });

    // Sortieren
    switch(sortMethod) {
        case 'price-asc':
            filteredDeals.sort((a, b) => (a.price_value || Infinity) - (b.price_value || Infinity));
            break;
        case 'price-desc':
            filteredDeals.sort((a, b) => (b.price_value || 0) - (a.price_value || 0));
            break;
        case 'discount-desc':
            // KORRIGIERT: Höchster Rabatt zuerst (b - a)
            filteredDeals.sort((a, b) => (b.discount_value || 0) - (a.discount_value || 0));
            break;
        case 'discount-asc':
            // KORRIGIERT: Niedrigster Rabatt zuerst (a - b)
            filteredDeals.sort((a, b) => (a.discount_value || Infinity) - (b.discount_value || Infinity));
            break;
        case 'default':
            // Keine Sortierung - Original-Reihenfolge
            break;
    }

    renderDeals(filteredDeals);
}

function resetFilters() {
    searchInput.value = '';
    brandFilter.value = '';
    sortSelect.value = 'discount-desc';
    filteredDeals = [...currentDeals];
    applyFilters();
}

function renderDeals(deals) {
    dealsContainer.innerHTML = '';
    visibleDealsCount.textContent = deals.length;

    if (deals.length === 0) {
        noResults.classList.remove('hidden');
        dealsContainer.classList.add('hidden');
        return;
    }

    noResults.classList.add('hidden');
    dealsContainer.classList.remove('hidden');

    deals.forEach(deal => {
        const card = createDealCard(deal);
        dealsContainer.appendChild(card);
    });
}

function createDealCard(deal) {
    const card = document.createElement('div');
    card.className = 'deal-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all';

    const imageHtml = deal.picture 
        ? `<img src="${deal.picture}" alt="${deal.title}" class="deal-image" onerror="this.src='https://via.placeholder.com/300x200?text=Kein+Bild'">`
        : `<div class="deal-image flex items-center justify-center bg-gray-100">
             <i class="fas fa-image text-gray-300 text-4xl"></i>
           </div>`;

    card.innerHTML = `
        ${imageHtml}
        <div class="p-6">
            <div class="mb-2">
                <span class="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full font-semibold">
                    ${deal.brand}
                </span>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-3 line-clamp-2 h-14">
                ${deal.title}
            </h3>
            
            <div class="mb-4">
                ${deal.current_price 
                    ? `<div class="text-2xl font-bold text-red-600">${deal.current_price}</div>` 
                    : ''}
                ${deal.original_price 
                    ? `<div class="text-sm text-gray-500 line-through">${deal.original_price}</div>` 
                    : ''}
                ${deal.discount 
                    ? `<span class="inline-block mt-2 bg-gradient-to-r from-green-400 to-green-600 text-white text-sm px-3 py-1 rounded-full font-bold">
                         ${deal.discount} Rabatt
                       </span>` 
                    : ''}
            </div>

            ${deal.link 
                ? `<a href="${deal.link}" target="_blank" rel="noopener noreferrer" 
                      class="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-center py-3 rounded-lg font-semibold transition-all">
                       <i class="fas fa-external-link-alt mr-2"></i>Zu Amazon
                   </a>` 
                : ''}
        </div>
    `;

    return card;
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
