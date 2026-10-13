// to get current year
function getYear() {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    document.querySelector("#displayYear").innerHTML = currentYear;
}

getYear();


// client section owl carousel
$(".client_owl-carousel").owlCarousel({
    loop: true,
    margin: 0,
    dots: false,
    nav: true,
    navText: [],
    autoplay: true,
    autoplayHoverPause: true,
    navText: [
        '<i class="fa fa-angle-left" aria-hidden="true"></i>',
        '<i class="fa fa-angle-right" aria-hidden="true"></i>'
    ],
    responsive: {
        0: {
            items: 1
        },
        768: {
            items: 2
        },
        1000: {
            items: 2
        }
    }
});



/** google_map js **/
function myMap() {
    var mapProp = {
        center: new google.maps.LatLng(40.712775, -74.005973),
        zoom: 18,
    };
    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
}

// Counter animation
document.addEventListener("DOMContentLoaded", function() {
    const counters = document.querySelectorAll('.counter-number');
    const speed = 200; // The lower the slower

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const counterSection = document.querySelector('.trust-bar-section');
    if (counterSection) {
        observer.observe(counterSection);
    }
});

// ===================================
// GESTIÓN DE LA BARRA DE NOTIFICACIÓN SUPERIOR (TOP-BAR)
// ===================================
function cerrarTopBar() {
    const topBar = document.querySelector('.top-bar');
    if (topBar) {
        topBar.classList.add('top-bar-hidden');
        try {
            sessionStorage.setItem('cdc_topbar_dismissed', 'true');
        } catch (e) {}
    }
}

document.addEventListener("DOMContentLoaded", function() {
    try {
        if (sessionStorage.getItem('cdc_topbar_dismissed') === 'true') {
            const topBar = document.querySelector('.top-bar');
            if (topBar) {
                topBar.classList.add('top-bar-hidden');
            }
        }
    } catch (e) {}
});