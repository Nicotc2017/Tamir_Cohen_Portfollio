document.addEventListener('DOMContentLoaded', () => {
   
    AOS.init();

    
    gsap.from('.header h1', { duration: 1, y: -50, opacity: 0, ease: 'bounce' });
    gsap.from('.header .display-4', { duration: 1, opacity: 0, delay: 0.3 });

   
    const productForm = document.getElementById('productForm');
    const productTable = document.getElementById('productTable');
    const totalPriceEl = document.getElementById('totalPrice');
    const dragArea = document.getElementById('dragArea');
    const gallerySection = document.getElementById('imageGallery');
    const actionToastEl = document.getElementById('actionToast');
    let toast;

    if (actionToastEl) {
        toast = new bootstrap.Toast(actionToastEl);
    }

   
    document.querySelector('.header').classList.add('mb-4');
    productTable.classList.add('mb-4', 'table', 'table-hover', 'align-middle');
    dragArea.classList.add('mb-4');
    gallerySection.classList.add('mb-5');

   
    const headerTitle = document.querySelector('.header h1');
    headerTitle.classList.add('display-3', 'fw-bold');
    const headerSubtitle = document.querySelector('.header .display-4');
    headerSubtitle.classList.add('text-muted');

    
    productForm.classList.add('row', 'g-3');

    
    productForm.innerHTML = `
        <div class="col-md-5">
            <label for="itemName" class="form-label fw-semibold">Item Name</label>
            <input type="text" class="form-control" id="itemName" placeholder="e.g., Apple" required>
            <div class="invalid-feedback">
                Please enter a valid item name.
            </div>
        </div>
        <div class="col-md-3">
            <label for="itemPrice" class="form-label fw-semibold">Price ($)</label>
            <input type="number" class="form-control" id="itemPrice" placeholder="0.00" min="0" step="0.01" required>
            <div class="invalid-feedback">
                Please enter a valid price.
            </div>
        </div>
        <div class="col-md-2 d-flex align-items-end">
            <button type="submit" class="btn btn-add w-100">Add</button>
        </div>
    `;

    let products = [];

   
    (() => {
        'use strict';
        const forms = document.querySelectorAll('.needs-validation');

        Array.from(forms).forEach(form => {
            form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    })();

   
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!productForm.checkValidity()) {
            e.stopPropagation();
            productForm.classList.add('was-validated');
            return;
        }

        const nameInput = document.getElementById('itemName');
        const priceInput = document.getElementById('itemPrice');

        const name = sanitizeHTML(nameInput.value.trim());
        const price = parseFloat(priceInput.value).toFixed(2);

        if (name && price >= 0) {
            const product = { id: crypto.randomUUID(), name, price };
            products.push(product);
            renderProducts();
            productForm.reset();
            productForm.classList.remove('was-validated');
            animateAddition();
            showToast(`Added "${name}" to the cart.`);
        }
    });

    
    function renderProducts() {
        if (products.length === 0) {
            productTable.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center">No products in the cart.</td>
                </tr>
            `;
            updateTotalPrice();
            return;
        }

        let tableHTML = `
            <thead>
                <tr>
                    <th>Icon</th>
                    <th>Name</th>
                    <th>Price ($)</th>
                    <th>Remove</th>
                </tr>
            </thead>
            <tbody>
        `;

        products.forEach(product => {
            const iconClass = getFruitIconClass(product.name);
            tableHTML += `
                <tr data-id="${product.id}" draggable="true">
                    <td class="text-center">
                        <i class="fas ${iconClass} fa-2x"></i>
                    </td>
                    <td>${sanitizeHTML(product.name)}</td>
                    <td>${product.price}</td>
                    <td class="text-center">
                        <button class="btn btn-danger remove-btn" aria-label="Remove ${sanitizeHTML(product.name)}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        tableHTML += `
            </tbody>
        `;

        productTable.innerHTML = tableHTML;
        updateTotalPrice();
    }

    
    function updateTotalPrice() {
        const total = products.reduce((sum, product) => sum + parseFloat(product.price), 0).toFixed(2);
        totalPriceEl.textContent = total;
    }

   
    function sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    
    function animateAddition() {
        gsap.from('.table tbody tr:last-child', {
            scale: 0.8,
            opacity: 0,
            duration: 0.5,
            ease: 'back.out(1.7)'
        });
    }

   
    function getFruitIconClass(fruitName) {
        const fruitIcons = {
            'APPLE': 'fa-apple-alt',
            'BANANA': 'fa-lemon',
            'CHERRY': 'fa-cherry',
            'GRAPES': 'fa-wine-bottle',
            'LEMON': 'fa-lemon',
            'ORANGE': 'fa-orange',
            'PEAR': 'fa-pepper-hot',
            'STRAWBERRY': 'fa-strawberry',
            'CARROT': 'fa-carrot',
            'BROCCOLI': 'fa-broccoli',
            'PEPPER': 'fa-pepper-hot',
            'TOMATO': 'fa-tomato',
            'CUCUMBER': 'fa-cucumber',
            'LETTUCE': 'fa-leaf',
        };

        const normalizedName = fruitName.trim().toUpperCase();

        const iconClass = fruitIcons[normalizedName] || 'fa-seedling';

        console.log(`Fruit Name: "${fruitName}", Normalized: "${normalizedName}", Icon Class: "${iconClass}"`);

        return iconClass;
    }

    
    productTable.addEventListener('click', (e) => {
        if (e.target.closest('.remove-btn')) {
            const tr = e.target.closest('tr');
            const id = tr.getAttribute('data-id');
            confirmRemoval(id);
        }
    });

   
    let draggedItem = null;

    productTable.addEventListener('dragstart', (e) => {
        const tr = e.target.closest('tr');
        if (tr) {
            draggedItem = tr;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', tr.getAttribute('data-id'));
            gsap.to(tr, { opacity: 0.5, scale: 0.95, duration: 0.2 });
        }
    });

    productTable.addEventListener('dragend', (e) => {
        if (draggedItem) {
            gsap.to(draggedItem, { opacity: 1, scale: 1, duration: 0.2 });
            draggedItem = null;
        }
    });

    dragArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dragArea.classList.add('drag-over');
    });

    dragArea.addEventListener('dragleave', () => {
        dragArea.classList.remove('drag-over');
    });

    dragArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dragArea.classList.remove('drag-over');
        const id = e.dataTransfer.getData('text/plain');
        if (id) {
            confirmRemoval(id);
        }
    });

    
    function confirmRemoval(id) {
        const product = products.find(p => p.id === id);
        if (!product) return;

        
        if (confirm(`Are you sure you want to remove "${product.name}" from the cart?`)) {
            removeProduct(id);
            gsap.to(`[data-id='${id}']`, {
                x: 0,
                y: 0,
                scale: 0,
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    renderProducts();
                    showToast(`Removed "${product.name}" from the cart.`);
                }
            });
        }
    }

   
    function removeProduct(id) {
        products = products.filter(product => product.id !== id);
    }

    
    function showToast(message) {
        if (toast) {
            actionToastEl.querySelector('.toast-body').textContent = message;
            toast.show();
        }
    }

  
    fetch('https://www.fruityvice.com/api/fruit/all')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(async fruits => {
            const carousel = document.createElement('div');
            carousel.classList.add('carousel', 'slide');
            carousel.setAttribute('data-bs-ride', 'carousel');
            carousel.setAttribute('id', 'fruitsVegCarousel');

            const carouselInner = document.createElement('div');
            carouselInner.classList.add('carousel-inner');

            for (const [index, fruit] of fruits.entries()) {
                const carouselItem = document.createElement('div');
                carouselItem.classList.add('carousel-item');
                if (index === 0) carouselItem.classList.add('active');

                const icon = document.createElement('i');
                icon.classList.add('fas', getFruitIconClass(fruit.name), 'fruit-icon');
                icon.setAttribute('aria-hidden', 'true');
                icon.setAttribute('title', fruit.name);

                const carouselCaption = document.createElement('div');
                carouselCaption.classList.add('carousel-caption', 'd-none', 'd-md-block');
                const caption = document.createElement('h5');
                caption.textContent = fruit.name;
                carouselCaption.appendChild(caption);

                carouselItem.appendChild(icon);
                carouselItem.appendChild(carouselCaption);
                carouselInner.appendChild(carouselItem);
            }

            carousel.appendChild(carouselInner);

         
            const prevControl = document.createElement('button');
            prevControl.classList.add('carousel-control-prev');
            prevControl.type = 'button';
            prevControl.setAttribute('data-bs-target', '#fruitsVegCarousel');
            prevControl.setAttribute('data-bs-slide', 'prev');
            prevControl.innerHTML = `
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            `;

            const nextControl = document.createElement('button');
            nextControl.classList.add('carousel-control-next');
            nextControl.type = 'button';
            nextControl.setAttribute('data-bs-target', '#fruitsVegCarousel');
            nextControl.setAttribute('data-bs-slide', 'next');
            nextControl.innerHTML = `
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            `;

            carousel.appendChild(prevControl);
            carousel.appendChild(nextControl);
            gallerySection.appendChild(carousel);
        })
        
});