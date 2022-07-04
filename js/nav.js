"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putAllStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** Show form to submit a new story */
function submitNewStory(evt){
  console.debug("navAllStories", evt);
  hidePageComponents();
  $newStoryForm.show();
}

$navSubmit.on("click", submitNewStory);

/** Show list of favorited stories */
function navFavoriteStories(evt){
  console.debug("navFavoriteStoryClick", evt);
  hidePageComponents();
  putFavoriteStoriesOnPage();
}
$navFavorites.on("click", navFavoriteStories);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navSubmit.show();
  $navFavorites.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

