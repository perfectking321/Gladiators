# HealthGuide AI 🏥

A comprehensive health diagnosis and nutrition planning application that helps users check their symptoms and get personalized nutrition recommendations.

![Python](https://img.shields.io/badge/python-v3.8+-blue.svg)
![Flask](https://img.shields.io/badge/flask-v2.0.1-green.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

## 📝 Table of Contents
- [About](#about)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Integration](#api-integration)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [Authors](#authors)
- [License](#license)

## 🧐 About <a name = "about"></a>
HealthGuide AI is a web application that combines symptom checking and nutrition planning capabilities. It helps users understand potential health conditions based on their symptoms and provides personalized nutrition recommendations based on their physical characteristics and goals.

## ⭐ Features <a name = "features"></a>

### Symptom Checker
- Input multiple symptoms with an intuitive interface
- Age, gender, and symptom duration consideration
- Confidence-based diagnosis suggestions
- Severity indicators for potential conditions
- Detailed recommendations for each condition
- Medical disclaimers and professional consultation advice

### Nutrition Planner
- BMI calculation
- Daily caloric needs estimation
- Personalized meal planning
- Support for dietary preferences:
  - Vegetarian
  - Vegan
  - Gluten-free
  - Dairy-free
- Macronutrient recommendations
- Integration with Spoonacular API for recipe suggestions

## 📁 Project Structure <a name = "project-structure"></a>
```
healthguide-ai/
│
├── static/
│   ├── style.css        # Application styling
│   └── script.js        # Frontend JavaScript
│
├── templates/
│   └── index.html       # Main application template
│
├── app.py              # Flask application backend
├── requirements.txt    # Python dependencies
├── .env               # Environment variables
└── README.md          # Project documentation
```

## 🏁 Getting Started <a name = "getting-started"></a>

### Prerequisites
- Python 3.8+
- pip (Python package manager)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/healthguide-ai.git
cd healthguide-ai
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
Create a `.env` file with:
```
SPOONACULAR_API_KEY=your_api_key_here
```

5. Run the application:
```bash
python app.py
```

6. Access the application at:
```
http://localhost:5000
```

## 🔧 API Integration <a name = "api-integration"></a>
The application uses the Spoonacular API for nutrition and recipe data. To use this feature:
1. Sign up at [Spoonacular's website](https://spoonacular.com/food-api)
2. Get your API key
3. Add it to your `.env` file

## ⛏️ Technologies Used <a name = "technologies-used"></a>
- [Flask](https://flask.palletsprojects.com/) - Web Framework
- [Python](https://www.python.org/) - Backend
- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) - Frontend Logic
- [HTML/CSS](https://www.w3.org/standards/webdesign/htmlcss) - Frontend Structure/Styling
- [Spoonacular API](https://spoonacular.com/food-api) - Nutrition Data


## ✍️ Authors <a name = "authors"></a>
- [@perfectking321](https://github.com/perfectking321),[@r0han02](https://github.com/r0han02),[@Shresth8x](https://github.com/Shresth8x),[@Arihant8408](https://github.com/Arihant8408)

## 📝 License <a name = "license"></a>
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## ⚠️ Disclaimer
This application is for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
