document.addEventListener('DOMContentLoaded', function() {
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

    document.getElementById('login-btn').addEventListener('click', function() {
        document.getElementById('login-modal').style.display = 'flex';
    });

    document.getElementById('close-modal').addEventListener('click', function() {
        document.getElementById('login-modal').style.display = 'none';
    });

    document.getElementById('login-submit').addEventListener('click', function() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        console.log(`Email: ${email}, Password: ${password}`);
        // Implement actual login logic here
        document.getElementById('login-modal').style.display = 'none';
    });

    document.getElementById('chatbot-icon').addEventListener('click', function() {
        // Implement chatbot functionality here
        alert('Chatbot clicked!');
    });
});
