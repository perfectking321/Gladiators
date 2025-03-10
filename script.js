document.addEventListener('DOMContentLoaded', function() {
    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('background-container').appendChild(renderer.domElement);
    // Load 3D model
    const loader = new THREE.GLTFLoader();
    let model;
    loader.load('alien_neuron_network_core.glb', function(gltf) {
        model = gltf.scene;
        scene.add(model);
    }, undefined, function(error) {
        console.error(error);
    });
    // Camera position
    camera.position.z = 5;
    // Animation variables
    let mouseX = 0;
    let mouseY = 0;
    let isInteracting = false;
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let autoRotateSpeed = 0.003; // Adjust for faster or slower rotation
    // Event listeners
    document.addEventListener('mousemove', function(event) {
        mouseX = event.clientX - window.innerWidth / 2;
        mouseY = event.clientY - window.innerHeight / 2;
    });
    document.addEventListener('mousedown', function(event) {
        // Check if the click is outside the bounding boxes of interactive elements
        const inputForm = document.getElementById('input-form');
        const loginModal = document.getElementById('login-modal');
        const resultDiv = document.getElementById('result');
        const isInsideInputForm = inputForm && isMouseInsideElement(event, inputForm);
        const isInsideLoginModal = loginModal && isMouseInsideElement(event, loginModal);
        const isInsideResultDiv = resultDiv && isMouseInsideElement(event, resultDiv);
        isInteracting = isInsideInputForm || isInsideLoginModal || isInsideResultDiv;
        if (!isInteracting) {
            isDragging = true;
            previousMouseX = event.clientX;
            previousMouseY = event.clientY;
            autoRotateSpeed = 0; // Stop auto-rotation while dragging
        }
    });
    document.addEventListener('mouseup', function() {
        isDragging = false;
        autoRotateSpeed = 0.003; // Resume auto-rotation after dragging
    });
    document.addEventListener('mousemove', function(event) {
        if (isDragging) {
            const deltaMouseX = event.clientX - previousMouseX;
            const deltaMouseY = event.clientY - previousMouseY;
            previousMouseX = event.clientX;
            previousMouseY = event.clientY;
            if (model) {
                model.rotation.x += deltaMouseY * 0.01;
                model.rotation.y += deltaMouseX * 0.01;
            }
        }
    });
    // Helper function to check if the mouse is inside an element's bounding box
    function isMouseInsideElement(event, element) {
        const rect = element.getBoundingClientRect();
        return (
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom
        );
    }
    // Login and main menu button event listeners
    document.getElementById('login-btn').addEventListener('click', function() {
        document.getElementById('login-modal').style.display = 'flex';
        document.getElementById('login-btn').style.display = 'none'; // Hide login button
    });
    document.getElementById('close-modal').addEventListener('click', function() {
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('login-btn').style.display = 'block'; // Show login button
    });
    document.getElementById('login-submit').addEventListener('click', function() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        console.log(`Email: ${email}, Password: ${password}`);
        // Implement actual login logic here
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('login-btn').style.display = 'block'; // Show login button
    });
    document.getElementById('start-btn').addEventListener('click', function() {
        document.getElementById('start-btn').style.display = 'none';
        document.getElementById('input-form').style.display = 'block';
    });
    document.getElementById('submit-form').addEventListener('click', function() {
        const age = document.getElementById('age').value;
        const gender = document.getElementById('gender').value;
        const height = document.getElementById('height').value;
        const weight = document.getElementById('weight').value;
        const bloodGroup = document.getElementById('blood-group').value;
        const resultDiv = document.getElementById('result');
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `You entered:<br>
        Age: ${age}<br>
        Gender: ${gender}<br>
        Height: ${height} cm<br>
        Weight: ${weight} kg<br>
        Blood Group: ${bloodGroup}<br><br>
        **Example Result:** Based on your inputs, a personalized dietary plan could be generated... (This part would require integration with a nutrition database or AI model).`;
    });
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        if (model) {
            if (!isDragging) {
                // Auto-rotate the model
                model.rotation.x += autoRotateSpeed;
                model.rotation.y += autoRotateSpeed;
            }
        }
        renderer.render(scene, camera);
    }
    animate();
});
