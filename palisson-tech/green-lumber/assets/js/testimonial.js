let currentTestimonialSlide = 0;
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const testimonialSlider = document.querySelector('.testimonial-slider');

function changeTestimonialSlide(direction) {
  // Remove 'active' class from current slide
  testimonialSlides[currentTestimonialSlide].classList.remove('active');

  // Calculate the new slide index
  currentTestimonialSlide = (currentTestimonialSlide + direction + testimonialSlides.length) % testimonialSlides.length;

  // Add 'active' class to the new slide
  testimonialSlides[currentTestimonialSlide].classList.add('active');

  // Move the slider horizontally
  testimonialSlider.style.transform = `translateX(-${currentTestimonialSlide * 100}%)`;
}

// Optional auto-slide functionality
setInterval(() => changeTestimonialSlide(1), 10000);
