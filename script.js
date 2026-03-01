--- f:\Abhishek bhaiya work\frontend\script.js
// Initialize Google Translate (Global Function) - Defined early to catch async loads
window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,es,fr,de,zh-CN,ja,ar,ru,hi,bn,te,mr,ta,ur,gu,kn,ml,pa',
        autoDisplay: false
    }, 'google_translate_element');
}

// Hide Loader Logic - Global Scope to ensure it runs regardless of DOM errors
function hideLoader() {
    const loader = document.getElementById('loader-wrapper');
    if (loader) {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        setTimeout(() => { loader.style.display = 'none'; }, 500);
        setTimeout(() => { loader.style.display = 'none'; }, 300);
    }
    if (document.body) document.body.classList.add('loaded');
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    hideLoader();
} else {
    window.addEventListener('DOMContentLoaded', hideLoader);
    window.addEventListener('load', hideLoader);
    // fallback in case load events fail; hide quickly to avoid long spinner
    setTimeout(hideLoader, 800);
    setTimeout(hideLoader, 500);
}

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');
    const header = document.querySelector('.header');

    // Navbar Scroll Effect
    if (header) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (window.scrollY > 50) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // Toggle Mobile Menu
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Animate Hamburger Icon (Optional swap from bars to times)
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Offset for fixed header
                const headerOffset = 90;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Product Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Toggle Product Details
    const toggleButtons = document.querySelectorAll('.toggle-details');
    
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const specs = btn.previousElementSibling; // The .product-specs div
            specs.classList.toggle('expanded');
            
            if (specs.classList.contains('expanded')) {
                btn.innerHTML = 'Hide Specifications <i class="fas fa-chevron-up"></i>';
            } else {
                btn.innerHTML = 'View Specifications <i class="fas fa-chevron-down"></i>';
            }
        });
    });

    // Handle Contact Form Submission via AJAX
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;

            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            fetch(this.action, {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(data => {
                alert(data);
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                if (data.includes('Thank you')) {
                    contactForm.reset();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    // Scroll to Top Button
    const scrollToTopBtn = document.getElementById('scrollToTop');

    if (scrollToTopBtn) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (window.scrollY > 300) {
                        scrollToTopBtn.classList.add('show');
                    } else {
                        scrollToTopBtn.classList.remove('show');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Hero Image Slider
    const slides = document.querySelectorAll('.hero-slider .slide');
    let currentSlide = 0;

    if (slides.length > 0) {
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 3000); // Change slide every 3 seconds
    }

    // Recently Viewed Products Logic
    const recentContainer = document.getElementById('recently-viewed-container');
    
    if (recentContainer) {
        // 1. Get current product info from the DOM
        const titleEl = document.querySelector('.product-info-col h1');
        // Use getAttribute to keep relative paths if used, though placeholder is absolute
        const imageEl = document.querySelector('.product-image-col img');
        
        if (titleEl && imageEl) {
            const productTitle = titleEl.innerText;
            const productImage = imageEl.src; 
            const productLink = window.location.pathname.split('/').pop(); // Get current filename
            // Try to find category in breadcrumb
            const categoryEl = document.querySelector('.breadcrumb a[href="#"]');
            const category = categoryEl ? categoryEl.innerText : 'Product';

            const currentProduct = {
                title: productTitle,
                image: productImage,
                link: productLink,
                category: category
            };

            // 2. Save to LocalStorage
            let viewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
            // Remove duplicates of current product to push it to the top
            viewed = viewed.filter(p => p.title !== currentProduct.title);
            // Add current to start
            viewed.unshift(currentProduct);
            // Limit to 5 items history
            if (viewed.length > 5) viewed.pop();
            localStorage.setItem('recentlyViewed', JSON.stringify(viewed));

            // 3. Render Recently Viewed (excluding current page)
            const others = viewed.filter(p => p.title !== currentProduct.title).slice(0, 4);
            
            if (others.length > 0) {
                document.getElementById('recently-viewed-section').style.display = 'block';
                others.forEach(p => {
                    let productUrl = p.link;
                    // Link is already correct for flat structure

                    const card = document.createElement('div');
                    card.className = 'product-card';
                    card.innerHTML = `
                        <div class="card-header">
                            <h3><a href="${productUrl}">${p.title}</a></h3>
                            <span class="category-tag">${p.category}</span>
                        </div>
                        <div class="card-body">
                            <img src="${p.image}" alt="${p.title}" loading="lazy" style="width:100%; height:150px; object-fit:cover; margin-bottom:15px; border-radius:4px;">
                            <div class="card-actions">
                                <a href="${productUrl}" class="btn btn-outline btn-sm" style="width:100%; text-align:center;">View Details</a>
                            </div>
                        </div>
                    `;
                    recentContainer.appendChild(card);
                });
            }
        }
    }

    // Search Functionality
    const productsList = [
        { name: "About Us", url: "#about" },
        { name: "Aluminium 3 Way Corner", url: "aluminium-3-way-corner.html" },
        { name: "Aluminium 3D Corner", url: "aluminium-3d-corner.html" },
        { name: "Aluminium Corner", url: "aluminium-corner.html" },
        { name: "Aluminium Coving Accessories", url: "aluminium-coving-accessories.html" },
        { name: "Aluminum Coving", url: "aluminum-coving.html" },
        { name: "Automatic Drop Down Door Seals", url: "automatic-drop-down-door-seals.html" },
        { name: "Automatic Drop Seal", url: "automatic-drop-seal.html" },
        { name: "Automatic Drop Seals", url: "automatic-drop-seals.html" },
        { name: "Brass Cylinders", url: "brass-cylinders.html" },
        { name: "Clean Room Door Hardware", url: "clean-room-door-hardware.html" },
        { name: "Concealed Floor Spring", url: "concealed-floor-spring.html" },
        { name: "Contact Us", url: "#contact" },
        { name: "D Type Handle", url: "d-type-handle.html" },
        { name: "Die Casted Aluminium 2 D Corner", url: "die-casted-aluminium-2-d-corner.html" },
        { name: "Die Casted Aluminium External 2 D Corner", url: "die-casted-aluminium-external-2-d-corner.html" },
        { name: "Dorma Door Closers", url: "dorma-door-closers.html" },
        { name: "Dormount Aluminium 3D Corner", url: "dormount-aluminium-3d-corner.html" },
        { name: "Dormount Automatic Drop Seal", url: "dormount-automatic-drop-seal.html" },
        { name: "Dormount Euro Profile Brass Cylinder One Side Keys", url: "dormount-euro-profile-brass-cylinder-one-side-keys.html" },
        { name: "Dormount Euro Profile Cylinder Both Side Keys", url: "dormount-euro-profile-cylinder-both-side-keys.html" },
        { name: "Dormount External Automatic Drop Seal", url: "dormount-external-automatic-drop-seal.html" },
        { name: "Dormount Flush Bolt", url: "dormount-flush-bolt.html" },
        { name: "Dormount Heavy Duty Door Closer", url: "dormount-heavy-duty-door-closer.html" },
        { name: "Dormount Perimeter Seal", url: "dormount-perimeter-seal.html" },
        { name: "Dormount Ss 304 Ball Bearing Hinge", url: "dormount-ss-304-ball-bearing-hinge.html" },
        { name: "Dormount Ss 304 Flush Bolt", url: "dormount-ss-304-flush-bolt.html" },
        { name: "Dormount Stainless Steel 304 Dead Cylinder Lock", url: "dormount-stainless-steel-304-dead-cylinder-lock.html" },
        { name: "Dormount Stainless Steel 304 Dead Lock With Cylinder", url: "dormount-stainless-steel-304-dead-lock-with-cylinder.html" },
        { name: "Dormount Stainless Steel D Type Back To Back Handle", url: "dormount-stainless-steel-d-type-back-to-back-handle.html" },
        { name: "Dormount Stainless Steel D Type Single Handle", url: "dormount-stainless-steel-d-type-single-handle.html" },
        { name: "Euro Profile Brass Cylinder One Side Keys", url: "euro-profile-brass-cylinder-one-side-keys.html" },
        { name: "Euro Profile Cylinder", url: "euro-profile-cylinder.html" },
        { name: "Flush Bolt", url: "flush-bolt.html" },
        { name: "Flush Bolts", url: "flush-bolts.html" },
        { name: "Heavy Duty Door Closers", url: "heavy-duty-door-closers.html" },
        { name: "Hydraulic Door Closer", url: "hydraulic-door-closer.html" },
        { name: "Perimeter Seal", url: "perimeter-seal.html" },
        { name: "Products", url: "#products" },
        { name: "Pure Grade Aluminium Coving With Backing", url: "pure-grade-aluminium-coving-with-backing.html" },
        { name: "Pure Grade Aluminium Coving", url: "pure-grade-aluminium-coving.html" },
        { name: "Pure Grade External Aluminium Coving", url: "pure-grade-external-aluminium-coving.html" },
        { name: "Pure Grade Pvc Coving With Backing", url: "pure-grade-pvc-coving-with-backing.html" },
        { name: "Pvc Coving", url: "pvc-coving.html" },
        { name: "Ss 304 Ball Bearing Hinge", url: "ss-304-ball-bearing-hinge.html" },
        { name: "Ss 304 Ball Bearing Hinges", url: "product-details.html" },
        { name: "Ss 304 D Type Handle", url: "ss-304-d-type-handle.html" },
        { name: "Ss 304 Dead Locks", url: "ss-304-dead-locks.html" },
        { name: "Ss 304 Tower Bolt", url: "ss-304-tower-bolt.html" },
        { name: "Ss Bearing Hinges", url: "ss-bearing-hinges.html" },
        { name: "Stainless Steel 304 Dead Cylinder Lock", url: "stainless-steel-304-dead-cylinder-lock.html" },
        { name: "Stainless Steel D Type Back To Back Handle", url: "stainless-steel-d-type-back-to-back-handle.html" },
        { name: "Stainless Steel D Type Single Handle", url: "stainless-steel-d-type-single-handle.html" },
        { name: "Testimonials", url: "testimonials.html" }
    ];

    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    if (searchInput && searchResults) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            searchResults.innerHTML = '';
            
            if (term.length > 0) {
                const filtered = productsList.filter(p => p.name.toLowerCase().includes(term));
                
                if (filtered.length > 0) {
                    searchResults.classList.add('active');
                    filtered.forEach(p => {
                        const a = document.createElement('a');
                        
                        a.href = p.url;
                        
                        a.className = 'search-result-item';
                        a.textContent = p.name;
                        searchResults.appendChild(a);
                    });
                } else {
                    searchResults.classList.remove('active');
                }
            } else {
                searchResults.classList.remove('active');
            }
        });

        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.remove('active');
            }
        });
    }

    // Language Switcher Logic
    const langToggle = document.getElementById('lang-toggle');
    const langMenu = document.querySelector('.lang-menu');

    if (langToggle && langMenu) {
        // Restore saved language from LocalStorage
        const savedLang = localStorage.getItem('selectedLang');
        if (savedLang) {
            langToggle.innerHTML = `<i class="fas fa-globe"></i> ${savedLang.toUpperCase()}`;
        }

        langToggle.addEventListener('click', (e) => {
            e.preventDefault();
            langMenu.classList.toggle('active');
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!langToggle.contains(e.target) && !langMenu.contains(e.target)) {
                langMenu.classList.remove('active');
            }
        });

        // Handle Selection
        langMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                langMenu.classList.remove('active');
                
                let selectedLang = link.getAttribute('data-lang');
                // Map 'zh' to 'zh-CN' for Google Translate if necessary
                if (selectedLang === 'zh') selectedLang = 'zh-CN';

                // Save to LocalStorage
                localStorage.setItem('selectedLang', selectedLang);

                langToggle.innerHTML = `<i class="fas fa-globe"></i> ${selectedLang.toUpperCase()}`;

                // Trigger Google Translate
                const googleSelect = document.querySelector('.goog-te-combo');
                if (googleSelect) {
                    googleSelect.value = selectedLang;
                    googleSelect.dispatchEvent(new Event('change'));
                }
            });
        });
    }

    // Dark Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');

        // Check LocalStorage
        if (localStorage.getItem('theme') === 'dark') {
            body.classList.add('dark-mode');
            icon.classList.replace('fa-moon', 'fa-sun');
        }

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            icon.classList.toggle('fa-moon', !isDark);
            icon.classList.toggle('fa-sun', isDark);
        });
    }

    // Scroll Animation for Cards
    const animateOnScrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Run animation only once
            }
        });
    }, { threshold: 0.1 });

    const cardsToAnimate = document.querySelectorAll('.product-card, .project-card');
    cardsToAnimate.forEach(card => {
        card.classList.add('fade-in-up');
        animateOnScrollObserver.observe(card);
    });
});
