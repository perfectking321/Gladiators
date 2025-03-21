// Symptom database with common conditions and their symptoms
const symptomDatabase = {
    'Common Cold': {
        symptoms: ['runny nose', 'cough', 'sore throat', 'congestion', 'sneezing', 'mild fever'],
        severity: 'mild',
        recommendations: [
            'Rest and stay hydrated',
            'Over-the-counter cold medications',
            'Warm salt water gargle',
            'Humidifier use'
        ]
    },
    'Flu': {
        symptoms: ['high fever', 'body aches', 'fatigue', 'cough', 'headache', 'chills'],
        severity: 'moderate',
        recommendations: [
            'Rest and stay in bed',
            'Stay hydrated',
            'Take fever reducers',
            'Consult a doctor if symptoms worsen'
        ]
    },
    'Allergies': {
        symptoms: ['sneezing', 'itchy eyes', 'runny nose', 'congestion', 'watery eyes'],
        severity: 'mild',
        recommendations: [
            'Avoid allergen triggers',
            'Take antihistamines',
            'Use air purifiers',
            'Keep windows closed during high pollen times'
        ]
    },
    'Food Poisoning': {
        symptoms: ['nausea', 'vomiting', 'diarrhea', 'stomach cramps', 'fever'],
        severity: 'moderate',
        recommendations: [
            'Stay hydrated with clear fluids',
            'Rest your stomach',
            'Gradually return to normal diet',
            'Seek medical attention if severe'
        ]
    }
};

// Nutrition calculator constants
const ACTIVITY_MULTIPLIERS = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'very': 1.725
};

const GOAL_ADJUSTMENTS = {
    'lose': -500,
    'maintain': 0,
    'gain': 500
};

document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const symptomsNav = document.getElementById('symptoms-nav');
    const nutritionNav = document.getElementById('nutrition-nav');
    const symptomsSection = document.getElementById('symptoms-section');
    const nutritionSection = document.getElementById('nutrition-section');
    const loginBtn = document.getElementById('login-btn');
    const loginModal = document.getElementById('login-modal');
    const closeModal = document.getElementById('close-modal');
    const loginSubmit = document.getElementById('login-submit');

    // Initialize sections
    symptomsSection.style.display = 'flex';
    nutritionSection.style.display = 'none';

    // Navigation event listeners
    symptomsNav.addEventListener('click', () => {
        symptomsSection.style.display = 'flex';
        nutritionSection.style.display = 'none';
        symptomsNav.classList.add('active');
        nutritionNav.classList.remove('active');
    });

    nutritionNav.addEventListener('click', () => {
        nutritionSection.style.display = 'flex';
        symptomsSection.style.display = 'none';
        nutritionNav.classList.add('active');
        symptomsNav.classList.remove('active');
    });

    // Login functionality
    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'flex';
    });

    closeModal.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });

    // Symptoms functionality
    const addSymptomBtn = document.querySelector('.add-symptom');
    const symptomsList = document.querySelector('.symptoms-list');
    const checkSymptomsBtn = document.getElementById('check-symptoms');
    const diagnosisResult = document.getElementById('diagnosis-result');

    // Add initial symptom entry event listener
    if (addSymptomBtn) {
        addSymptomBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addNewSymptomEntry();
        });
    }

    function addNewSymptomEntry() {
        const newSymptomEntry = document.createElement('div');
        newSymptomEntry.className = 'symptom-entry';
        newSymptomEntry.innerHTML = `
            <input type="text" class="symptom-input" placeholder="Enter a symptom">
            <button class="remove-symptom">-</button>
        `;
        symptomsList.appendChild(newSymptomEntry);

        const removeBtn = newSymptomEntry.querySelector('.remove-symptom');
        removeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            newSymptomEntry.remove();
        });
    }

    // Check symptoms functionality
    if (checkSymptomsBtn) {
        checkSymptomsBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const symptoms = Array.from(document.querySelectorAll('.symptom-input'))
                .map(input => input.value.toLowerCase().trim())
                .filter(symptom => symptom !== '');

            if (symptoms.length === 0) {
                alert('Please enter at least one symptom');
                return;
            }

            const age = document.getElementById('age').value;
            const gender = document.getElementById('gender').value;
            const duration = document.getElementById('duration').value;

            if (!age || !gender || !duration) {
                alert('Please fill in all fields (age, gender, and duration)');
                return;
            }

            try {
                const response = await fetch('/api/check-symptoms', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        symptoms,
                        age: parseInt(age),
                        gender,
                        duration: parseInt(duration)
                    })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                displayDiagnosis(data.diagnosis, data.userInfo);
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while checking symptoms. Please try again.');
            }
        });
    }

    function displayDiagnosis(conditions, userInfo) {
        if (!diagnosisResult) return;

        if (conditions.length === 0) {
            diagnosisResult.innerHTML = `
                <h3>No Matching Conditions Found</h3>
                <p>Based on the symptoms provided, we couldn't find any matching conditions in our database. 
                Please consult a healthcare professional for a proper diagnosis.</p>
            `;
        } else {
            let html = `
                <h3>Possible Conditions</h3>
                <p class="patient-info">
                    Patient Information:<br>
                    Age: ${userInfo.age}<br>
                    Gender: ${userInfo.gender}<br>
                    Duration: ${userInfo.duration} days
                </p>
            `;

            conditions.forEach(condition => {
                html += `
                    <div class="condition-card">
                        <h4>${condition.condition}</h4>
                        <div class="confidence-bar">
                            <div class="confidence-level" style="width: ${condition.confidence}%"></div>
                            <span>${Math.round(condition.confidence)}% match</span>
                        </div>
                        <p class="severity ${condition.severity}">Severity: ${condition.severity}</p>
                        <h5>Recommendations:</h5>
                        <ul>
                            ${condition.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>
                `;
            });

            html += `
                <div class="disclaimer">
                    <p><strong>Disclaimer:</strong> This is not a medical diagnosis. 
                    Please consult a healthcare professional for proper medical advice and treatment.</p>
                </div>
            `;

            diagnosisResult.innerHTML = html;
        }

        diagnosisResult.style.display = 'block';
    }

    // Nutrition functionality
    const generatePlanBtn = document.getElementById('generate-plan');
    const nutritionResult = document.getElementById('nutrition-result');

    if (generatePlanBtn) {
        generatePlanBtn.addEventListener('click', async () => {
            const height = parseFloat(document.getElementById('height').value);
            const weight = parseFloat(document.getElementById('weight').value);
            const activityLevel = document.getElementById('activity-level').value;
            const goal = document.getElementById('goal').value;
            const age = parseFloat(document.getElementById('age').value);
            const gender = document.getElementById('gender').value;

            if (!height || !weight || !activityLevel || !goal || !age || !gender) {
                alert('Please fill in all fields');
                return;
            }

            const preferences = {
                vegetarian: document.querySelector('input[value="vegetarian"]').checked,
                vegan: document.querySelector('input[value="vegan"]').checked,
                glutenFree: document.querySelector('input[value="gluten-free"]').checked,
                dairyFree: document.querySelector('input[value="dairy-free"]').checked
            };

            try {
                const response = await fetch('/api/nutrition-plan', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        height,
                        weight,
                        age,
                        gender,
                        activityLevel,
                        goal,
                        preferences
                    })
                });

                const data = await response.json();
                displayNutritionPlan(data);
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while generating the nutrition plan. Please try again.');
            }
        });
    }
});

function displayNutritionPlan(plan) {
    const nutritionResult = document.getElementById('nutrition-result');
    let bmiCategory;
    if (plan.bmi < 18.5) bmiCategory = 'Underweight';
    else if (plan.bmi < 25) bmiCategory = 'Normal weight';
    else if (plan.bmi < 30) bmiCategory = 'Overweight';
    else bmiCategory = 'Obese';

    let mealsHtml = '';
    if (plan.meals && plan.meals.length > 0) {
        mealsHtml = `
            <h4>Recommended Meals:</h4>
            <div class="meal-cards">
                ${plan.meals.map(meal => `
                    <div class="meal-card">
                        <img src="${meal.image}" alt="${meal.title}">
                        <h5>${meal.title}</h5>
                        <a href="${meal.sourceUrl}" target="_blank">View Recipe</a>
                    </div>
                `).join('')}
            </div>
        `;
    }

    nutritionResult.innerHTML = `
        <h3>Your Nutrition Plan</h3>
        <div class="nutrition-stats">
            <p><strong>BMI:</strong> ${plan.bmi.toFixed(1)} (${bmiCategory})</p>
            <p><strong>Daily Energy Expenditure:</strong> ${plan.calories} calories</p>
        </div>
        <h4>Recommended Daily Macronutrients:</h4>
        <ul>
            <li>Protein: ${plan.macros.protein}g (${Math.round(plan.macros.protein * 4)} calories)</li>
            <li>Fat: ${plan.macros.fat}g (${Math.round(plan.macros.fat * 9)} calories)</li>
            <li>Carbohydrates: ${plan.macros.carbs}g (${Math.round(plan.macros.carbs * 4)} calories)</li>
        </ul>
        ${mealsHtml}
        <div class="nutrition-tips">
            <h4>Tips for Success:</h4>
            <ul>
                <li>Eat plenty of fruits and vegetables</li>
                <li>Choose whole grains over refined grains</li>
                <li>Stay hydrated (aim for 8 glasses of water daily)</li>
                <li>Eat protein with every meal</li>
                <li>Monitor your portions</li>
            </ul>
        </div>
        <div class="disclaimer">
            <p><strong>Disclaimer:</strong> This plan is a general guideline. Please consult a healthcare professional or registered dietitian for personalized advice.</p>
        </div>
    `;
    nutritionResult.style.display = 'block';
}
