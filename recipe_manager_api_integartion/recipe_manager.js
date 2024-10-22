const apiKey = '7021088f4e7044ba91c93800f240ac1e'; 
const apiUrl = `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=5`;
let recipes = [];
let currentEditIndex = -1;

// Fetch initial recipes from the API
async function fetchRecipes() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const fetchedRecipes = data.recipes.map(recipe => ({
            id: recipe.id,
            title: recipe.title,
            ingredients: recipe.extendedIngredients.map(ing => ing.original).join(', '),
            instructions: recipe.instructions,
            image: recipe.image
        }));
        recipes.push(...fetchedRecipes);
        saveToLocalStorage();
        displayRecipes();
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
}

// Save recipes to local storage
function saveToLocalStorage() {
    localStorage.setItem('recipes', JSON.stringify(recipes));
}

// Load recipes from local storage
function loadFromLocalStorage() {
    const storedRecipes = localStorage.getItem('recipes');
    if (storedRecipes) {
        recipes = JSON.parse(storedRecipes);
        displayRecipes();
    }
}

// Create or update recipe
function saveRecipe(newRecipe) {
    if (currentEditIndex >= 0) {
        recipes[currentEditIndex] = newRecipe;
        currentEditIndex = -1; // Reset edit index
    } else {
        recipes.push(newRecipe);
    }
    saveToLocalStorage();
    displayRecipes();
}

// Display recipes
function displayRecipes() {
    const recipesList = $('#recipesList');
    recipesList.empty();

    recipes.forEach((recipe, index) => {
        const recipeCard = `
            <div class="col-md-4 recipe-card">
                <img src="${recipe.image}" alt="Recipe Image">
                <h5>${recipe.title}</h5>
                <p><strong>Ingredients:</strong> ${recipe.ingredients || 'N/A'}</p>
                <p><strong>Instructions:</strong> ${recipe.instructions || 'No instructions available'}</p>
                <button class="btn btn-danger" onclick="deleteRecipe(${index})">Delete</button>
                <button class="btn btn-warning" onclick="editRecipe(${index})">Edit</button>
            </div>
        `;
        recipesList.append(recipeCard);
    });
}

// Delete a recipe
function deleteRecipe(index) {
    recipes.splice(index, 1);
    saveToLocalStorage();
    displayRecipes();
}

// Edit a recipe
function editRecipe(index) {
    const recipe = recipes[index];
    $('#recipeName').val(recipe.title);
    $('#ingredients').val(recipe.ingredients);
    $('#instructions').val(recipe.instructions);
    $('#recipeImage').val('');
    currentEditIndex = index;
    $('#editBtn').show();
}

// Handle form submission
$(document).ready(function() {
    loadFromLocalStorage();
    fetchRecipes();

    $('#recipeForm').submit(function(event) {
        event.preventDefault();

        const recipeName = $('#recipeName').val();
        const ingredients = $('#ingredients').val();
        const instructions = $('#instructions').val();
        const recipeImage = $('#recipeImage').prop('files')[0];

        const reader = new FileReader();
        reader.onload = function(e) {
            const newRecipe = {
                id: Date.now(),
                title: recipeName,
                ingredients: ingredients,
                instructions: instructions,
                image: e.target.result
            };
            saveRecipe(newRecipe);
            $('#recipeForm')[0].reset();
            $('#editBtn').hide();
        };
        reader.readAsDataURL(recipeImage);
    });

    $('#editBtn').click(function() {
        const recipeName = $('#recipeName').val();
        const ingredients = $('#ingredients').val();
        const instructions = $('#instructions').val();
        const recipeImage = $('#recipeImage').prop('files')[0];

        const reader = new FileReader();
        reader.onload = function(e) {
            const updatedRecipe = {
                id: Date.now(),
                title: recipeName,
                ingredients: ingredients,
                instructions: instructions,
                image: e.target.result
            };
            saveRecipe(updatedRecipe);
            $('#recipeForm')[0].reset();
            $('#editBtn').hide();
        };
        if (recipeImage) {
            reader.readAsDataURL(recipeImage);
        } else {
            const existingRecipe = recipes[currentEditIndex];
            const updatedRecipe = {
                ...existingRecipe,
                title: recipeName,
                ingredients: ingredients,
                instructions: instructions
            };
            saveRecipe(updatedRecipe);
            $('#recipeForm')[0].reset();
            $('#editBtn').hide();
        }
    });
});
