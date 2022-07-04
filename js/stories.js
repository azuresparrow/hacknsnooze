"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putAllStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  return $(`
      <li id="${story.storyId}">
        
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        
        ${isLoggedIn() ? generateFavoriteMarkup(story) : ''} ${isLoggedIn() ? '<span class="story-delete">delete</span>' : ''}
      </li>
    `);
}

function isLoggedIn(){
  return currentUser != null;
}

function generateFavoriteMarkup(story){
  const favString = currentUser.isFavorite(story) ? "★ remove favorite" : "☆ add favorite"
  return `<span class="story-favorite">${favString}</span>`;
}

function putAllStoriesOnPage() {
  putStoriesOnPage(storyList.stories);
}

function putFavoriteStoriesOnPage(){
  putStoriesOnPage(currentUser.favorites);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */
function putStoriesOnPage(list) {
  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of list) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  if(list.length == 0){
    $allStoriesList.append("<div class='story-empty'>No Stories Available</div>")
  }

  $allStoriesList.show();
}




/** Handles the form submission of a new story */
async function submitNewStory(e){
  e.preventDefault();

  const title = $("#story-title").val();
  const url = $("#story-url").val();
  const author = $("#story-author").val();

  const newStory = await StoryList.addStory(currentUser, {title, url, author});
  $allStoriesList.append(generateStoryMarkup(newStory));

  $allStoriesList.show();
  $newStoryForm.hide();
  $newStoryForm.trigger("reset");
}

$newStoryForm.on("submit", submitNewStory);


async function toggleFavoriteOnStory(e){
  const currStory = getClosestStory(e);

  currentUser.toggleFavorite(currStory);
  const favString = currentUser.isFavorite(currStory) ? "★ remove favorite" : "☆ add favorite";
  e.target.innerText = favString;
}

$allStoriesList.on("click", ".story-favorite", toggleFavoriteOnStory);

async function deleteStory(e){
  await StoryList.removeStory(currentUser, getClosestStory(e));
  $(e.target.closest("li")).remove();
}

$allStoriesList.on("click", ".story-delete", deleteStory);

function getClosestStory(e){
  const closestId = $(e.target.closest("li")).attr("id");
  return storyList.stories.find(story=> story.storyId === closestId);
}

async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // User.signup retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.signup(username, password, name);

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();

  $signupForm.trigger("reset");
}