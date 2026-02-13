const analysisButton = document.getElementById("analyzeButton");
const imageInput = document.getElementById("foodImage");
const imagePreview = document.getElementById("imagePreview");
const analysisResult = document.getElementById("analysisResult");
const analysisNote = document.getElementById("analysisNote");

const bmiForm = document.getElementById("bmiForm");
const planList = document.getElementById("planList");
const dietPlanOutput = document.getElementById("dietPlanOutput");

const exerciseForm = document.getElementById("exerciseForm");
const exercisePlan = document.getElementById("exercisePlan");

const addMealButton = document.getElementById("addMeal");
const mealLog = document.getElementById("mealLog");
const totalCalories = document.getElementById("totalCalories");
const goalProgress = document.getElementById("goalProgress");
const dailyGoalInput = document.getElementById("dailyGoal");

const loginForm = document.getElementById("loginForm");
const dashboardContainer = document.getElementById("dashboardContent");

const mealsStorageKey = "ct-meals";

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);

if (imageInput) {
  imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.innerHTML = `<img src="${e.target.result}" alt="Uploaded meal" />`;
    };
    reader.readAsDataURL(file);
  });
}

if (analysisButton) {
  analysisButton.addEventListener("click", () => {
    const calories = Math.floor(250 + Math.random() * 500);
    const protein = Math.floor(calories * 0.2 / 4);
    const carbs = Math.floor(calories * 0.5 / 4);
    const fat = Math.floor(calories * 0.3 / 9);

    if (analysisResult) {
      analysisResult.innerHTML = `
        <div><span>Calories</span><strong>${calories} kcal</strong></div>
        <div><span>Protein</span><strong>${protein} g</strong></div>
        <div><span>Carbs</span><strong>${carbs} g</strong></div>
        <div><span>Fat</span><strong>${fat} g</strong></div>
      `;
    }

    if (analysisNote) {
      analysisNote.textContent =
        "AI estimate based on portion size and ingredients. Adjust if the meal includes sauces or extra toppings.";
    }
  });
}

if (bmiForm) {
  bmiForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const weight = Number(document.getElementById("weight").value);
    const heightCm = Number(document.getElementById("height").value);
    const goal = document.getElementById("goal").value;
    const activity = document.getElementById("activity").value;

    const heightM = heightCm / 100;
    const bmi = weight / (heightM * heightM);

    const activityMultiplier =
      activity === "high" ? 1.65 : activity === "moderate" ? 1.5 : 1.3;
    const maintenanceCalories = weight * 24 * activityMultiplier;
    const targetCalories =
      goal === "loss"
        ? maintenanceCalories - 400
        : goal === "gain"
          ? maintenanceCalories + 300
          : maintenanceCalories;

    const planItems = [
      `BMI: ${bmi.toFixed(1)} (${bmi < 18.5 ? "Underweight" : bmi < 25 ? "Healthy" : bmi < 30 ? "Overweight" : "Obese"})`,
      `Suggested calories: ${formatNumber(targetCalories)} kcal/day`,
      `Macro split: ${goal === "gain" ? "35% protein, 45% carbs, 20% fats" : "30% protein, 40% carbs, 30% fats"}`,
      `Meal timing: 3 main meals + ${goal === "loss" ? "1" : "2"} protein-rich snacks`,
      "Include fiber-rich veggies at every meal for satiety",
    ];

    if (planList) {
      planList.innerHTML = planItems.map((item) => `<li>${item}</li>`).join("");
    }

    if (dietPlanOutput) {
      dietPlanOutput.querySelector(".muted")?.remove();
    }
  });
}

if (exerciseForm) {
  exerciseForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const goal = document.getElementById("fitnessGoal").value;
    const days = Number(document.getElementById("days").value);
    const equipment = document.getElementById("equipment").value;

    const plan = [];
    const focus =
      goal === "fat-loss"
        ? "cardio + strength circuits"
        : goal === "strength"
          ? "progressive overload lifts"
          : goal === "endurance"
            ? "interval runs + cycling"
            : "mobility flows + yoga";

    const equipmentNote =
      equipment === "gym"
        ? "Use full gym equipment for compound lifts"
        : equipment === "minimal"
          ? "Use resistance bands and dumbbells"
          : "Bodyweight only with tempo variations";

    for (let i = 1; i <= days; i += 1) {
      plan.push(
        `Day ${i}: ${focus} (${i % 2 === 0 ? "moderate" : "high"} intensity)`
      );
    }

    plan.push(equipmentNote);
    plan.push("Rest and recovery: 7-8 hours sleep + light stretching");

    if (exercisePlan) {
      exercisePlan.innerHTML = plan.map((item) => `<li>${item}</li>`).join("");
    }
  });
}

const getMeals = () => {
  if (typeof localStorage === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(mealsStorageKey)) || [];
  } catch (error) {
    return [];
  }
};

const setMeals = (meals) => {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(mealsStorageKey, JSON.stringify(meals));
};

const renderMeals = () => {
  if (!mealLog || !totalCalories || !goalProgress) return;

  const meals = getMeals();
  mealLog.innerHTML = meals
    .map(
      (meal) =>
        `<div class="log-item"><span>${meal.name} (${meal.time})</span><strong>${meal.calories} kcal</strong></div>`
    )
    .join("");

  const total = meals.reduce((sum, meal) => sum + meal.calories, 0);
  totalCalories.textContent = formatNumber(total);

  const goalValue = Number(dailyGoalInput?.value || 0);
  const progress = goalValue ? Math.min((total / goalValue) * 100, 100) : 0;
  goalProgress.style.width = `${progress}%`;
};

if (addMealButton) {
  addMealButton.addEventListener("click", () => {
    const mealName = document.getElementById("mealName").value.trim();
    const calories = Number(document.getElementById("mealCalories").value);
    const time = document.getElementById("mealTime").value || "--:--";

    if (!mealName || !calories) return;

    const meals = getMeals();
    meals.push({ name: mealName, calories, time });
    setMeals(meals);

    document.getElementById("mealName").value = "";
    document.getElementById("mealCalories").value = "";
    document.getElementById("mealTime").value = "";

    renderMeals();
  });
}

if (dailyGoalInput) {
  dailyGoalInput.addEventListener("input", renderMeals);
}

if (mealLog) {
  renderMeals();
}

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("loginName").value.trim();
    const email = document.getElementById("loginEmail").value.trim();

    if (!name || !email) return;

    localStorage.setItem(
      "ct-user",
      JSON.stringify({ name, email, joined: new Date().toISOString() })
    );
    window.location.href = "dashboard.html";
  });
}

const renderDashboard = () => {
  if (!dashboardContainer) return;
  const user = JSON.parse(localStorage.getItem("ct-user") || "null");

  if (!user) {
    dashboardContainer.innerHTML = `
      <div class="card">
        <h3>Welcome back!</h3>
        <p class="muted">Log in to start tracking your journey.</p>
        <a class="button" href="login.html">Go to Login</a>
      </div>
    `;
    return;
  }

  dashboardContainer.innerHTML = `
    <div class="card">
      <p class="pill">Active Member</p>
      <h2>Hello, ${user.name}</h2>
      <p class="muted">Member since ${new Date(user.joined).toLocaleDateString()}</p>
      <div class="grid two" style="margin-top: 20px;">
        <div class="card">
          <h4>Weekly Focus</h4>
          <p>Hit your protein target 5 days this week.</p>
        </div>
        <div class="card">
          <h4>Hydration</h4>
          <p>Track 2.5L of water daily for optimal recovery.</p>
        </div>
      </div>
    </div>
    <div class="card">
      <h3>Progress Check-in</h3>
      <p class="muted">Log your weight and energy levels weekly.</p>
      <div class="form">
        <div class="form-row">
          <label for="weightLog">Current Weight (kg)</label>
          <input type="number" id="weightLog" placeholder="68" />
        </div>
        <div class="form-row">
          <label for="energyLog">Energy Level</label>
          <select id="energyLog">
            <option>Low</option>
            <option selected>Balanced</option>
            <option>High</option>
          </select>
        </div>
        <button class="button" type="button" id="saveCheckin">Save Check-in</button>
        <p class="muted" id="checkinStatus"></p>
      </div>
    </div>
  `;

  const saveCheckin = document.getElementById("saveCheckin");
  const checkinStatus = document.getElementById("checkinStatus");
  saveCheckin?.addEventListener("click", () => {
    checkinStatus.textContent = "Check-in saved. Keep going!";
  });
};

renderDashboard();
