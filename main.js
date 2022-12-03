function createElemWithText(elemType = "p", textContent = "", className) {
  const myElem = document.createElement(elemType);
  myElem.textContent = textContent;
  if (className) myElem.classList.add(className);
  return myElem;
}

function createSelectOptions(jsonData) {
  if (jsonData == null) {
    return jsonData;
  } else {
    const jsonArr1 = [];
    for (let j = 0; j < jsonData.length; j++) {
      const option = document.createElement("option");
      option.value = jsonData[j].id;
      option.textContent = jsonData[j].name;
      jsonArr1[j] = option;
    }
    return jsonArr1;
  }
}

function toggleCommentSection(postId) {
  if (postId == null) return postId;
  else {
    const test = document.querySelector(`section[data-post-id = "${postId}"]`);
    if (test == null) return test;
    else {
      test.classList.toggle("hide");
      return test;
    }
  }
}

function toggleCommentButton(postId) {
  if (postId == null) return postId;
  else {
    const test = document.querySelector(`button[data-post-id = "${postId}"]`);
    if (test == null) return test;
    else {
     if (test.textContent == "Hide Comments")
         test.textContent = "Show Comments";
      else
        test.textContent = "Hide Comments";
      return test;
    }
  }
}

const deleteChildElements = (parentElement) => {
  if (!(parentElement instanceof HTMLElement)) return undefined;
  let child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
  return parentElement;
};


const addButtonListeners = () => {
  const buttons = document.querySelectorAll('main button');
  for (let i = 0; i < buttons.length; i++) {
    const postId = buttons[i].dataset.postId;
    buttons[i].addEventListener('click', (event) => {
      toggleComments(event, postId);
    }, true);
  }
  return buttons;
};

const removeButtonListeners = () => {
  const buttons = document.querySelectorAll('main button');
  buttons.forEach(button => {
    const postId = button.dataset.postId;
    button.removeEventListener('click', (event) => {
      toggleComments(event, postId);
    }, false);
  })
  return buttons;
};

function createComments(jsonData) {
  if (jsonData == null)
    return jsonData;
  else {
    const fragElem = document.createDocumentFragment()
    for (let i = 0; i < jsonData.length; i++) {
      const comment = document.createElement("article");
      const h3 = createElemWithText('h3', jsonData[i].name );
      const body = createElemWithText('p', jsonData[i].body);
      const p = createElemWithText('p', `From: ${jsonData[i].email}`)
      comment.append(h3)
      comment.append(body)
      comment.append(p)
      fragElem.appendChild(comment);
    }
    return fragElem;
  }
}

function populateSelectMenu(jsonData) {
  if (jsonData == null)
    return jsonData;
  else {
    const selectMenu = document.getElementById("selectMenu");
    const array = createSelectOptions(jsonData);
    for (let i = 0; i < array.length; i++) {
      selectMenu.append(array[i]);
    }
    return selectMenu;
  }
}

const getUsers = async () => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    console.error(error.stack);
  }
};

const getUserPosts = async (userID) => {
  if (!userID) {
      return undefined;
    }
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userID}/posts`);
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    console.error(error.stack);
  }
};

const getUser = async (userID) => {
  if (!userID)
    return undefined;
  
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userID}`);
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    console.error(error.stack);
  }
};

const getPostComments = async (postID) => {
  if (!postID)
    return undefined;
  
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postID}/comments`);
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    console.error(error.stack);
  }
};

const displayComments = async(postId) => {
  if (postId == null) return
  const section = document.createElement("section");
  section.dataset.postId = postId
  section.classList.add("comments", "hide");
  
  const comments = await getPostComments(postId);
  const fragElem = createComments(comments);
  section.append(fragElem);
  return section;
}

const createPosts = async(jsonData) => {
  if (!jsonData) return
  else {
    const fragElem = document.createDocumentFragment();
    for (let i = 0; i < jsonData.length; i++) {
      const post = document.createElement("article");
      const h2 = createElemWithText('h2', jsonData[i].title );
      const p1 = createElemWithText('p', jsonData[i].body);
      
      const p2 = createElemWithText('p');
      p2.textContent = `Post ID: ${jsonData[i].id}`;
      
      const author = await getUser(jsonData[i].userId);
      const p3 = createElemWithText('p');
      p3.textContent = `Author: ${author.name} with ${author.company.name}`
      
      const p4 = createElemWithText('p', author.company.catchPhrase);
      
      const button = document.createElement("button");
      button.textContent = "Show Comments";
      button.dataset.postId = jsonData[i].id
      
      post.append(h2);
      post.append(p1);
      post.append(p2);
      post.append(p3);
      post.append(p4);
      post.append(button);
      
      const commSection = await displayComments(jsonData[i].id)
      
      post.append(commSection);
      fragElem.appendChild(post);
    }
    return fragElem;
  }
}

const displayPosts = async(posts) => {
const main = document.querySelector("main");
  const element = posts?.length 
  ? await createPosts(posts) : createElemWithText("p", "Select an Employee to display their posts.", "default-text");
  main.append(element);
  return element;
};

const toggleComments = (event, postId) => {
  if (!event || !postId) {
    return undefined;
  }
  event.target.listener = true;
  const section = toggleCommentSection(postId);
  const button = toggleCommentButton(postId);

  const arr = [section, button];
  return arr;
}


const refreshPosts = async (jsonData) => {
  if (!jsonData) return;
  let arr = [];
  arr.push(removeButtonListeners());
  const mainElem = document.querySelector('main')
  arr.push(deleteChildElements(mainElem));
  arr.push(await displayPosts(jsonData));
  arr.push(addButtonListeners());
  return arr
}

const selectMenuChangeEventHandler = async (event) => {
  if (!event)
    return
  const userId = event?.target?.value || 1;
  const jsonData = await getUserPosts(userId);
  const refreshPostsArray = await refreshPosts(jsonData);
  let arr = [];
  arr.push(userId)
  arr.push(jsonData)
  arr.push(refreshPostsArray)
  return arr;
}

const initPage = async () => {
  const jsonData = await getUsers;
  const select = await populateSelectMenu(jsonData);
  return [jsonData, select];
}

function initApp() {
  initPage();
  const menu = document.getElementById("selectMenu")
  menu.addEventListener("change", selectMenuChangeEventHandler());
}

document.addEventListener("DOMContentLoaded", initApp, false);