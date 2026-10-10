import React, { useMemo, useState } from "react";
import { useAppState } from "../context/AppStateContext";
import { useAuth } from "../context/AuthContext";
import RecipeCard from "../components/recipe/RecipeCard";
import RecipeDetailModal from "../components/recipe/RecipeDetailModal";
import { getRecipeRecommendations } from "../services/aiEngine";
const GOALS_LIST = [
  "Quick & Easy",
  "Fitness",
  "Weight Management",
  "Healthy Eating",
  "Balanced Diet",
  "High Protein",
  "Low Calorie"
];

const RecipeRecommendationPage = () => {
  const { recipes = [], ingredients = [] } = useAppState();
  const { user } = useAuth();

  // =========================
  // MAIN VIEW
  // =========================
  const [activeViewMode, setActiveViewMode] = useState("ai");

  // =========================
  // SEARCH
  // =========================
  const [searchTerm, setSearchTerm] = useState("");

  // =========================
  // BROWSE FILTERS
  // =========================
  const [browseCategory, setBrowseCategory] = useState("All");
  const [browseDiet, setBrowseDiet] = useState("All");
  const [browseTime, setBrowseTime] = useState("All");
  const [browseDifficulty, setBrowseDifficulty] = useState("All");

  // =========================
  // AI FILTERS
  // =========================
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("All");
  const [maxCookTime, setMaxCookTime] = useState("All");

  // =========================
  // MODAL
  // =========================
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // =========================
  // AI RECOMMENDATIONS
  // =========================
  const rankedRecipes = useMemo(() => {
    let result = [];

    try {
      result = getRecipeRecommendations(
        recipes || [],
        selectedIngredients || [],
        selectedGoal || "",
        user || null
      );
    } catch (error) {
      console.error("Recipe recommendation error:", error);
      result = recipes || [];
    }

    if (!Array.isArray(result)) {
      result = [];
    }

    // Meal type filter
    if (selectedMealType !== "All") {
      result = result.filter((recipe) => {
        const mealCategory =
          recipe.mealCategory ||
          recipe.mealType ||
          recipe.category ||
          "";

        return (
          String(mealCategory).toLowerCase() ===
          String(selectedMealType).toLowerCase()
        );
      });
    }

    // Cooking time filter
    if (maxCookTime !== "All") {
      const maxTime = parseInt(maxCookTime, 10);

      result = result.filter((recipe) => {
        const cookingTime = Number(recipe.cookingTime) || 0;
        return cookingTime <= maxTime;
      });
    }

    return result;
  }, [
    recipes,
    selectedIngredients,
    selectedGoal,
    selectedMealType,
    maxCookTime,
    user,
  ]);

  // =========================
  // BROWSE CATALOG
  // SEARCH + FILTER
  // =========================
  const filteredCatalogRecipes = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return (recipes || []).filter((recipe) => {
      // -------------------------
      // Recipe name
      // -------------------------
      const recipeName = String(recipe?.name || "").toLowerCase();

      // -------------------------
      // Ingredients
      // -------------------------
      let ingredientText = "";

      if (Array.isArray(recipe?.ingredients)) {
        ingredientText = recipe.ingredients
          .map((item) => {
            if (typeof item === "string") {
              return item;
            }

            return item?.name || "";
          })
          .join(" ")
          .toLowerCase();
      }

      // -------------------------
      // Search
      // -------------------------
      const matchesSearch =
        !search ||
        recipeName.includes(search) ||
        ingredientText.includes(search);

      // -------------------------
      // Category
      // -------------------------
      const matchesCategory =
        browseCategory === "All" ||
        recipe?.mealCategory === browseCategory ||
        recipe?.category === browseCategory ||
        recipe?.mealType === browseCategory;

      // -------------------------
      // Diet
      // -------------------------
      const dietValue =
        recipe?.dietCategory ||
        recipe?.dietType ||
        "";

      const matchesDiet =
        browseDiet === "All" ||
        dietValue === browseDiet;

      // -------------------------
      // Cooking time
      // -------------------------
      const cookingTime = Number(recipe?.cookingTime) || 0;

      const matchesTime =
        browseTime === "All" ||
        cookingTime <= parseInt(browseTime, 10);

      // -------------------------
      // Difficulty
      // -------------------------
      const difficulty = String(
        recipe?.difficulty || ""
      ).toLowerCase();

      const matchesDifficulty =
        browseDifficulty === "All" ||
        difficulty === browseDifficulty.toLowerCase();

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDiet &&
        matchesTime &&
        matchesDifficulty
      );
    });
  }, [
    recipes,
    searchTerm,
    browseCategory,
    browseDiet,
    browseTime,
    browseDifficulty,
  ]);

  // =========================
  // UNIQUE FILTER VALUES
  // =========================
  const categories = useMemo(() => {
    const values = (recipes || [])
      .map(
        (recipe) =>
          recipe?.mealCategory ||
          recipe?.category ||
          recipe?.mealType
      )
      .filter(Boolean);

    return ["All", ...new Set(values)];
  }, [recipes]);

  const diets = useMemo(() => {
    const values = (recipes || [])
      .map(
        (recipe) =>
          recipe?.dietCategory ||
          recipe?.dietType
      )
      .filter(Boolean);

    return ["All", ...new Set(values)];
  }, [recipes]);

  // =========================
  // INGREDIENT SELECT
  // =========================
  const toggleIngredient = (ingredient) => {
    setSelectedIngredients((current) => {
      const exists = current.includes(ingredient);

      if (exists) {
        return current.filter((item) => item !== ingredient);
      }

      return [...current, ingredient];
    });
  };

  // =========================
  // RESET BROWSE
  // =========================
  const resetBrowseFilters = () => {
    setSearchTerm("");
    setBrowseCategory("All");
    setBrowseDiet("All");
    setBrowseTime("All");
    setBrowseDifficulty("All");
  };

  // =========================
  // RESET AI
  // =========================
  const resetAIFilters = () => {
    setSelectedIngredients([]);
    setSelectedGoal("");
    setSelectedMealType("All");
    setMaxCookTime("All");
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================
          HEADER
      ====================================== */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Recipe Discovery
              </h1>

              <p className="text-slate-500 mt-1">
                Discover delicious recipes and plan your meals smarter.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                🍴 {recipes.length} Recipes
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* =====================================
          MAIN CONTENT
      ====================================== */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* =====================================
            VIEW TOGGLE
        ====================================== */}
        <div className="bg-white rounded-2xl border border-slate-200 p-2 flex flex-col sm:flex-row gap-2 mb-8 shadow-sm">

          <button
            onClick={() => setActiveViewMode("ai")}
            className={`flex-1 px-5 py-3 rounded-xl font-semibold transition ${activeViewMode === "ai"
              ? "bg-emerald-600 text-white shadow"
              : "text-slate-600 hover:bg-slate-100"
              }`}
          >
            🤖 AI Recommendations
          </button>

          <button
            onClick={() => setActiveViewMode("browse")}
            className={`flex-1 px-5 py-3 rounded-xl font-semibold transition ${activeViewMode === "browse"
              ? "bg-emerald-600 text-white shadow"
              : "text-slate-600 hover:bg-slate-100"
              }`}
          >
            📖 Browse All Recipes ({recipes.length})
          </button>

        </div>

        {/* =====================================
            AI MODE
        ====================================== */}
        {activeViewMode === "ai" && (
          <div>

            {/* AI FILTER CARD */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">

              <div className="flex items-center justify-between mb-5">

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    🤖 AI Recipe Recommendation
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Get recipe suggestions based on your ingredients,
                    goals and meal preferences.
                  </p>
                </div>

                <button
                  onClick={resetAIFilters}
                  className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Reset
                </button>

              </div>

              {/* Ingredients */}
              <div className="mb-6">

                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Available Ingredients
                </label>

                {ingredients.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No ingredients available.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">

                    {ingredients.slice(0, 20).map((ingredient, index) => {
                      const name =
                        typeof ingredient === "string"
                          ? ingredient
                          : ingredient?.name || "";

                      if (!name) return null;

                      const active =
                        selectedIngredients.includes(name);

                      return (
                        <button
                          key={`${name}-${index}`}
                          onClick={() =>
                            toggleIngredient(name)
                          }
                          className={`px-4 py-2 rounded-full text-sm font-medium border transition ${active
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white text-slate-600 border-slate-300 hover:border-emerald-400"
                            }`}
                        >
                          {name}
                        </button>
                      );
                    })}

                  </div>
                )}

              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Goal
                  </label>

                  <select
                    value={selectedGoal}
                    onChange={(e) =>
                      setSelectedGoal(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                  >
                    <option value="">Any Goal</option>

                    {(GOALS_LIST || []).map((goal, index) => {
                      const value =
                        typeof goal === "string"
                          ? goal
                          : goal?.value || goal?.name || "";

                      const label =
                        typeof goal === "string"
                          ? goal
                          : goal?.label || goal?.name || value;

                      return (
                        <option
                          key={`${value}-${index}`}
                          value={value}
                        >
                          {label}
                        </option>
                      );
                    })}

                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Meal Type
                  </label>

                  <select
                    value={selectedMealType}
                    onChange={(e) =>
                      setSelectedMealType(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                  >
                    <option value="All">All Meals</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Maximum Cooking Time
                  </label>

                  <select
                    value={maxCookTime}
                    onChange={(e) =>
                      setMaxCookTime(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                  >
                    <option value="All">Any Time</option>
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                  </select>
                </div>

              </div>

            </div>

            {/* AI RESULTS */}
            <div>

              <div className="flex items-center justify-between mb-5">

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Recommended Recipes
                  </h2>

                  <p className="text-sm text-slate-500">
                    {rankedRecipes.length} recipes found
                  </p>
                </div>

              </div>

              {rankedRecipes.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">

                  <div className="text-5xl mb-4">
                    🍽️
                  </div>

                  <h3 className="text-lg font-bold text-slate-800">
                    No recipes found
                  </h3>

                  <p className="text-slate-500 mt-2">
                    Try changing your ingredients or filters.
                  </p>

                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                  {rankedRecipes.map((recipe, index) => (
                    <RecipeCard
                      key={
                        recipe.id ||
                        recipe._id ||
                        `${recipe.name}-${index}`
                      }
                      recipe={recipe}
                      onClick={() =>
                        setSelectedRecipe(recipe)
                      }
                    />
                  ))}

                </div>
              )}

            </div>

          </div>
        )}

        {/* =====================================
            BROWSE MODE
        ====================================== */}
        {activeViewMode === "browse" && (
          <div>

            {/* SEARCH + FILTER CARD */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">

              <div className="flex flex-col lg:flex-row gap-4 mb-5">

                {/* SEARCH */}
                <div className="flex-1">

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                      🔍
                    </span>

                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) =>
                        setSearchTerm(e.target.value)
                      }
                      placeholder="Search recipes by name or ingredient (e.g. Sambar, Paneer, Poha)..."
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-300 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />

                  </div>

                </div>

                <button
                  onClick={resetBrowseFilters}
                  className="px-5 py-3 rounded-xl border border-slate-300 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Reset Filters
                </button>

              </div>

              {/* FILTERS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* CATEGORY */}
                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Category
                  </label>

                  <select
                    value={browseCategory}
                    onChange={(e) =>
                      setBrowseCategory(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                  >
                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}
                  </select>

                </div>

                {/* DIET */}
                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Diet
                  </label>

                  <select
                    value={browseDiet}
                    onChange={(e) =>
                      setBrowseDiet(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                  >
                    {diets.map((diet) => (
                      <option
                        key={diet}
                        value={diet}
                      >
                        {diet}
                      </option>
                    ))}
                  </select>

                </div>

                {/* TIME */}
                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Cooking Time
                  </label>

                  <select
                    value={browseTime}
                    onChange={(e) =>
                      setBrowseTime(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                  >
                    <option value="All">Any Time</option>
                    <option value="15">Under 15 min</option>
                    <option value="30">Under 30 min</option>
                    <option value="45">Under 45 min</option>
                    <option value="60">Under 60 min</option>
                  </select>

                </div>

                {/* DIFFICULTY */}
                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Difficulty
                  </label>

                  <select
                    value={browseDifficulty}
                    onChange={(e) =>
                      setBrowseDifficulty(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                  >
                    <option value="All">All Levels</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>

                </div>

              </div>

            </div>

            {/* =====================================
                RESULTS HEADER
            ====================================== */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Recipes Catalog
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Showing{" "}
                  <span className="font-semibold text-emerald-600">
                    {filteredCatalogRecipes.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold">
                    {recipes.length}
                  </span>{" "}
                  recipes
                </p>

              </div>

              {searchTerm && (
                <div className="text-sm text-slate-500">
                  Search:
                  <span className="font-semibold text-slate-800 ml-1">
                    "{searchTerm}"
                  </span>
                </div>
              )}

            </div>

            {/* =====================================
                NO RESULTS
            ====================================== */}
            {filteredCatalogRecipes.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">

                <div className="text-5xl mb-4">
                  🔎
                </div>

                <h3 className="text-xl font-bold text-slate-800">
                  No matching recipes
                </h3>

                <p className="text-slate-500 mt-2 mb-6">
                  Try another recipe name, ingredient or remove
                  some filters.
                </p>

                <button
                  onClick={resetBrowseFilters}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700"
                >
                  Clear Search & Filters
                </button>

              </div>
            ) : (
              /* =====================================
                  RECIPE GRID
              ====================================== */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {filteredCatalogRecipes.map(
                  (recipe, index) => (
                    <RecipeCard
                      key={
                        recipe.id ||
                        recipe._id ||
                        `${recipe.name}-${index}`
                      }
                      recipe={recipe}
                      onClick={() =>
                        setSelectedRecipe(recipe)
                      }
                    />
                  )
                )}

              </div>
            )}

          </div>
        )}

      </div>

      {/* =====================================
          RECIPE DETAIL MODAL
      ====================================== */}
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}

    </div>
  );
};

export default RecipeRecommendationPage;