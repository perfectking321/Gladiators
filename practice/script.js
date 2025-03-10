document.addEventListener('DOMContentLoaded', function() {
  
    // Smooth Zoom Effect on Scroll
    const healthcareSymbol = document.getElementById('healthcareSymbol');
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY / window.innerHeight; // Calculate scroll ratio
        const scaleFactor = Math.min(1 + scrollPosition * 0.5, 2); // Limit zoom to scale factor of max.2
        healthcareSymbol.style.transform = `scale(${scaleFactor})`;
    });

    // Handle Form Submission
    const form = document.getElementById('healthcareForm');
    form.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent page reload

      const symptoms = document.getElementById('symptoms').value.trim();
      const age = document.getElementById('age').value.trim();
      const gender = document.getElementById('gender').value.trim();

      if (!symptoms || !age || !gender) {
        alert('Please fill out all fields!');
        return;
      }

      alert(`Submitted Details:\nSymptoms: ${symptoms}\nAge: ${age}\nGender: ${gender}`);
    });
});
