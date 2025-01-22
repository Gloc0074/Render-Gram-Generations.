class Gallery {
    constructor() {
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.lightbox = document.querySelector('.lightbox');
        this.lightboxContent = document.querySelector('.lightbox-content');
        this.lightboxImg = document.querySelector('.lightbox-img');
        this.lightboxDescription = document.querySelector('.lightbox-description');
        this.currentIndex = 0;
        
        this.init();
    }

    init() {
        // Add event listeners to gallery items
        this.galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => this.openLightbox(index));
        });

        // Lightbox controls
        document.querySelector('.lightbox-close').addEventListener('click', () => this.closeLightbox());
        document.querySelector('.lightbox-prev').addEventListener('click', () => this.prevImage());
        document.querySelector('.lightbox-next').addEventListener('click', () => this.nextImage());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.lightbox.classList.contains('active')) {
                if (e.key === 'Escape') this.closeLightbox();
                if (e.key === 'ArrowLeft') this.prevImage();
                if (e.key === 'ArrowRight') this.nextImage();
            }
        });

        // Touch gestures for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });
    }

    openLightbox(index) {
        this.currentIndex = index;
        const item = this.galleryItems[index];
        const imgSrc = item.querySelector('img').src;
        const description = item.querySelector('.overlay').textContent;

        this.lightboxImg.src = imgSrc;
        this.lightboxDescription.textContent = description;
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    prevImage() {
        this.currentIndex = (this.currentIndex - 1 + this.galleryItems.length) % this.galleryItems.length;
        this.updateLightboxContent();
    }

    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.galleryItems.length;
        this.updateLightboxContent();
    }

    updateLightboxContent() {
        const item = this.galleryItems[this.currentIndex];
        const imgSrc = item.querySelector('img').src;
        const description = item.querySelector('.overlay').textContent;

        this.lightboxImg.src = imgSrc;
        this.lightboxDescription.textContent = description;
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;

        if (swipeDistance > swipeThreshold) {
            this.prevImage();
        } else if (swipeDistance < -swipeThreshold) {
            this.nextImage();
        }
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Gallery();
});
