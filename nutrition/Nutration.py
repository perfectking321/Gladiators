from flask import Flask, render_template, request
import requests

app = Flask(__name__, template_folder="F:\\hackathon\\Gladiators\\nutrition\\templates", static_folder="F:\\hackathon\\Gladiators\\nutrition\\static")

SPOONACULAR_API_URL_MEAL_PLAN = "https://api.spoonacular.com/mealplanner/generate"
SPOONACULAR_API_URL_RECIPE_INFO = "https://api.spoonacular.com/recipes/{id}/information"
API_KEY = "be51c1e437024525a7df77bcf7707c95"

def calculate_calories(age, weight, height):
    return 10 * weight + 6.25 * height - 5 * age + 5

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
    else:
        print(f"Error: {response.status_code}, {response.text}")
        return None

def get_recipe_details(recipe_id):
    url = SPOONACULAR_API_URL_RECIPE_INFO.format(id=recipe_id)
    params = {"apiKey": API_KEY}
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error fetching recipe details for ID {recipe_id}: {response.status_code}, {response.text}")
        return None

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        age = int(request.form["age"])
        weight = float(request.form["weight"])
        height = float(request.form["height"])
        diet_choice = request.form["diet"]

        if diet_choice == "1":
            diet_preference = "vegetarian"
        elif diet_choice == "2":
            diet_preference = "non-vegetarian"
        elif diet_choice == "3":
            diet_preference = "vegan"
        else:
            return render_template("index.html", error="Invalid diet choice!")

        calories = calculate_calories(age, weight, height)
        meal_plan = get_meal_plan(diet_preference, calories)

        if meal_plan:
            meals = []
            for meal in meal_plan.get("meals", []):
                recipe_details = get_recipe_details(meal["id"])
                if recipe_details:
                    meals.append({
                        "title": recipe_details["title"],
                        "image": recipe_details["image"],
                        "sourceUrl": recipe_details["sourceUrl"]
                    })
            return render_template("result.html", meals=meals)
        else:
            return render_template("index.html", error="Error fetching meal plan.")
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
