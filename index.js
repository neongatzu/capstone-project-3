import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(express.static(__dirname + '/public'));


let posts= [];
let username = [];
const maxPosts = 10;


app.get("/", (req, res) => {
    
    
    res.render("username.ejs");
    

});
app.get("/home", (req, res) => {
    
    res.render("index.ejs",{posts,username});
});
app.get("/aboutme", (req, res)=>{
    res.render("aboutme.ejs", {username});
})

app.post("/submit", (req, res) => {
  const titleSubmitted = req.body["title-post"];
  const postSubmitted = req.body["post1"];

  posts.unshift({titleSubmitted, postSubmitted});

   // Remove the oldest post if the limit is reached
   if (posts.length > maxPosts) {
    posts.pop(); // Remove the first (oldest) element
  }


  res.redirect("/home");
});

app.post("/saveName", (req,res)=>{
    username = req.body["user"];
    
    res.render("index.ejs", {username: username, posts});
    
})

// handle the GET request for the edit form
app.get("/edit/:index", (req, res) => {
    const index = req.params.index;
    const postToEdit = posts[index];

    postToEdit.isEditing = true;

    res.render("index.ejs", { posts, username });
});
// handle the GET request for canceling the edit
app.get("/cancel-edit/:index", (req, res) => {
    const index = req.params.index;
    const postToCancelEdit = posts[index];
    
    // Set isEditing back to false when canceling the edit
    postToCancelEdit.isEditing = false;

    res.render("index.ejs", { posts, username });
});

// handle the PATCH request for updating the post
app.patch("/update/:index", (req, res) => {
    const index = req.params.index;
    const updatedTitle = req.body.updatedTitle; 
    const updatedPost = req.body.updatedPost;

    // Update the post in the array
    posts[index] = {
        titleSubmitted: updatedTitle,
        postSubmitted: updatedPost,
    };

    // Redirect to the homepage ("/") after updating the post
    res.redirect("/home");
});

// handle the POST request for updating the post
app.post("/update/:index", (req, res) => {
    const index = req.params.index;
    const updatedTitle = req.body.updatedTitle;
    const updatedPost = req.body.updatedPost;

    // Update the post in the array
    posts[index] = {
        titleSubmitted: updatedTitle,
        postSubmitted: updatedPost,
    };

    // Redirect to the homepage ("/") after updating the post
    res.redirect("/home");
});
//  handle the POST request for deleting the post
app.post("/delete/:index", (req, res) => {
    const index = req.params.index;

    // Remove the post from the array
    posts.splice(index, 1);

    res.redirect("/home");
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});





