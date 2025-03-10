import requests

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

def main():
    age = int(input("Enter your age: "))
    weight = float(input("Enter your weight (kg): "))
    height = float(input("Enter your height (cm): "))
    medical_conditions = input("Enter any medical conditions (or leave blank): ")
    
    print("\nDiet Preferences:")
    print("1. Vegetarian")
    print("2. Non-Vegetarian")
    print("3. Vegan")
    
    diet_choice = int(input("Choose your diet preference (1/2/3): "))
    
    if diet_choice == 1:
        diet_preference = "vegetarian"
    elif diet_choice == 2:
        diet_preference = "non-vegetarian"
    elif diet_choice == 3:
        diet_preference = "vegan"
    else:
        print("Invalid choice!")
        return
    
    calories = calculate_calories(age, weight, height)
    
    print(f"\nYour estimated daily calorie needs are {calories} kcal.")
    
    meal_plan = get_meal_plan(diet_preference, calories)
    
    if meal_plan:
        print("\nYour Personalized Meal Plan:")
        for meal in meal_plan.get("meals", []):
            recipe_details = get_recipe_details(meal["id"])
            if recipe_details:
                print(f"\nMeal: {recipe_details['title']}")
                print(f"Image: {recipe_details['image']}")
                print(f"Source: {recipe_details['sourceUrl']}")
                print("-" * 40)

if __name__ == "__main__":
    main()
