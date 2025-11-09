//https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg

export default class postCollection {
  constructor(posts = []) {
    this.posts = posts;
  }

  findById(id) {
    this.posts.filter((post) => post.PetCode == id);
    for (let post of this.posts) {
      if (id == post.PetCode) {
        return post;
      }
    }
  }

  deleteById(id) {
    this.posts = this.posts.filter((post) => post.PetCode != id);
    console.log(this.posts);
  }

  getAllPosts() {
    return this.posts;
  }

  updatePost(updatedPost) {
    let postIndex;
    postIndex = this.posts.findIndex(
      (post) => post.PetCode == updatedPost.PetCode
    );
    if (postIndex < 0) {
      console.warn(`Esta mascota es impisoble de actualizar porque no existe`);
      return false;
    } else {
      this.posts[postIndex] = {
        PetName: updatedPost.PetName,
        Description: updatedPost.Description,
        Image: updatedPost.Image,
        Birthdate: updatedPost.Birthdate,
        Price: updatedPost.Price,
        Sold: updatedPost.Sold,
        PetCode: updatedPost.PetCode,
      };
      console.log("mascota actualizado");
      return true;
    }
  }

  addNewPost(Post) {
    let postIndex = this.posts.findIndex(
      (post) => post.PetCode == Post.PetCode
    );
    if (postIndex >= 1) {
      console.warn(`Esta mascota ya existe`);
      return 0;
    } else {
      this.posts.push(Post);
      console.log("Mascota añadida");

      return Post.PetCode;
    }
  }
}
