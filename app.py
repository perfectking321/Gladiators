from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

# Spoonacular API configuration
SPOONACULAR_API_URL_MEAL_PLAN = "https://api.spoonacular.com/mealplanner/generate"
SPOONACULAR_API_URL_RECIPE_INFO = "https://api.spoonacular.com/recipes/{id}/information"
API_KEY = "be51c1e437024525a7df77bcf7707c95"  # You should move this to environment variables

# Symptom database
symptom_database = {
    'Common Cold': {
        'symptoms': ['runny nose', 'cough', 'sore throat', 'congestion', 'sneezing', 'mild fever'],
        'severity': 'mild',
        'recommendations': [
            'Rest and stay hydrated',
            'Over-the-counter cold medications',
            'Warm salt water gargle',
            'Humidifier use'
        ]
    },
    'Flu': {
        'symptoms': ['high fever', 'body aches', 'fatigue', 'cough', 'headache', 'chills'],
        'severity': 'moderate',
        'recommendations': [
            'Rest and stay in bed',
            'Stay hydrated',
            'Take fever reducers',
            'Consult a doctor if symptoms worsen'
        ]
    },
    'Allergies': {
        'symptoms': ['sneezing', 'itchy eyes', 'runny nose', 'congestion', 'watery eyes'],
        'severity': 'mild',
        'recommendations': [
            'Avoid allergen triggers',
            'Take antihistamines',
            'Use air purifiers',
            'Keep windows closed during high pollen times'
        ]
    },
    'Food Poisoning': {
        'symptoms': ['nausea', 'vomiting', 'diarrhea', 'stomach cramps', 'fever'],
        'severity': 'moderate',
        'recommendations': [
            'Stay hydrated with clear fluids',
            'Rest your stomach',
            'Gradually return to normal diet',
            'Seek medical attention if severe'
        ]
    }
}

def calculate_calories(age, weight, height, gender, activity_level, goal):
    # Calculate BMR using Mifflin-St Jeor Equation
    if gender == 'male':
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    else:
        bmr = 10 * weight + 6.25 * height - 5 * age - 161

    # Activity level multipliers
    activity_multipliers = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'very': 1.725
    }

    # Calculate TDEE
    tdee = bmr * activity_multipliers[activity_level]

    # Adjust for goal
    goal_adjustments = {
        'lose': -500,
        'maintain': 0,
        'gain': 500
    }

    return round(tdee + goal_adjustments[goal])

def get_meal_plan(diet_preference, calories):
    params = {
        "apiKey": API_KEY,
        "timeFrame": "day",
        "targetCalories": calories,
        "diet": diet_preference,
    }
    response = requests.get(SPOONACULAR_API_URL_MEAL_PLAN, params=params)
    if response.status_code == 200:
        return response.json()
    return None

def get_recipe_details(recipe_id):
    url = SPOONACULAR_API_URL_RECIPE_INFO.format(id=recipe_id)
    params = {"apiKey": API_KEY}
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json()
    return None

def analyze_symptoms(symptoms):
    matches = []
    
    for condition, data in symptom_database.items():
        matching_symptoms = [s for s in symptoms if any(db_symptom in s.lower() or s.lower() in db_symptom for db_symptom in data['symptoms'])]
        
        if matching_symptoms:
            confidence = (len(matching_symptoms) / len(symptoms)) * 100
            matches.append({
                'condition': condition,
                'matchCount': len(matching_symptoms),
                'totalSymptoms': len(data['symptoms']),
                'confidence': confidence,
                'severity': data['severity'],
                'recommendations': data['recommendations']
            })
    
    return sorted(matches, key=lambda x: x['confidence'], reverse=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/check-symptoms', methods=['POST'])
def check_symptoms():
    data = request.json
    symptoms = data.get('symptoms', [])
    user_info = {
        'age': data.get('age'),
        'gender': data.get('gender'),
        'duration': data.get('duration')
    }
    
    diagnosis = analyze_symptoms(symptoms)
    return jsonify({
        'diagnosis': diagnosis,
        'userInfo': user_info
    })

@app.route('/api/nutrition-plan', methods=['POST'])
def nutrition_plan():
    data = request.json
    
    calories = calculate_calories(
        age=data['age'],
        weight=data['weight'],
        height=data['height'],
        gender=data['gender'],
        activity_level=data['activityLevel'],
        goal=data['goal']
    )
    
    # Calculate BMI
    height_m = data['height'] / 100
    bmi = data['weight'] / (height_m ** 2)
    
    # Get meal plan from Spoonacular
    diet_preference = 'vegetarian' if data.get('preferences', {}).get('vegetarian') else None
    meal_plan = get_meal_plan(diet_preference, calories) if diet_preference else None
    
    # Get detailed meal information if meal plan exists
    meals = []
    if meal_plan and 'meals' in meal_plan:
        for meal in meal_plan['meals']:
            recipe_details = get_recipe_details(meal['id'])
            if recipe_details:
                meals.append({
                    'title': recipe_details['title'],
                    'image': recipe_details['image'],
                    'sourceUrl': recipe_details['sourceUrl'],
                    'nutrients': recipe_details.get('nutrition', {}).get('nutrients', [])
                })
    
    return jsonify({
        'bmi': round(bmi, 1),
        'calories': calories,
        'meals': meals,
        'macros': {
            'protein': round(data['weight'] * 2.2),  # 1g per lb of body weight
            'fat': round(calories * 0.25 / 9),  # 25% of calories from fat
            'carbs': round((calories - (round(data['weight'] * 2.2) * 4 + round(calories * 0.25 / 9) * 9)) / 4)
        }
    })

if __name__ == '__main__':
    app.run(debug=True) 