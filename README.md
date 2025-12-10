# Shaped tutorials

<p>
  These sample apps demonstrate what you can build with Shaped, and showcase different use cases and features. As reference apps, they are not intended for production, but are a great way to learn how to implement engines and queries.
</p>

Built with ❤️‍🔥 by Shaped.

<table>
<tr>
  <!-- Document Search -->
  <td width="50%" valign="top">
    <h2><a href="apps/document-search">Document Search</a></h2>
      <p>
        Search for Recsys articles in the Shaped blog using hybrid search.
      </p>
    <b><a href="https://shaped-blog-search.vercel.app/">Live Demo</a></b>
    <br/>
    <details>
      <summary><b>📕 Description and Features</b></summary>
      <p>An example that shows how to do hybrid search using Shaped. Demonstrates how to implement a sentence transformer model combined with BM25 indexes to query using text content.</p>
      <img src="assets/search-screenshot.png" style="width: 100%; aspect-ratio: 4/3; object-fit: cover; object-position: top;">
      <b>Use Cases</b><br/>
      <p>
        Search bar on a website, RAG (Retrieval-Augmented Generation) applications
      </p>
      <b>Features</b><br/>
      <p>
        <code>Hybrid Search</code>, <code>Sentence Transformers</code>, <code>BM25</code>, <code>Text Search</code>
      </p>
    </details>
  </td>
  <!-- Elastic to Shaped -->
  <td valign="top">
    <h2><a href="apps/elastic-to-shaped">Elastic to Shaped</a></h2>
    <p>Convert Elasticsearch queries into simpler Shaped queries.</p>
    <b><a href="https://elastic-to-shaped.vercel.app">Live Demo</a></b>
    <br/>
    <details>
      <summary><b>📕 Description and Features</b></summary>
      <p>A migration assistant to convert Elastic queries to Shaped. Uses an LLM with context to convert Elastic DSL queries into ShapedQL, making it easy to migrate from Elasticsearch to Shaped.</p>
      <img src="assets/elastic-screenshot.png" style="width: 100%; aspect-ratio: 4/3; object-fit: cover; object-position: top;">
      <b>Features</b><br/>
      <p>
        <code>Query Conversion</code>, <code>LLM Integration</code>, <code>Migration Tool</code>, <code>Elastic DSL</code>
      </p>
    </details>
  </td>
</tr>
<tr>
  <!-- Fashion Catalog 
  <td width="50%" valign="top">
    <h2><a href="apps/fashion-catalog">Fashion Catalog</a></h2>
    <p>A fashion e-commerce site powered by Shaped.</p>
    <br/>
    <details>
      <summary><b>📕 Description and Features</b></summary>
      <p>A catalog of fashion items demonstrating personalization and complement item recommendations. Shows how to build an e-commerce experience with personalized product recommendations based on user interactions and cart contents.</p>
      <b>Features</b><br/>
      <p>
        <code>Product Catalog</code>, <code>Personalization</code>, <code>Complement Items</code>, <code>Similar Items</code>, <code>Cart-based Recommendations</code>
      </p>
    </details>
  </td>
  -->
  <!-- Movie Recommendations -->
  <td valign="top">
    <h2><a href="apps/movie-recommendations">Movie Recommendations</a></h2>
    <p>Netflix-style content carousels with recommendations powered by Shaped.</p>
    <b><a href="https://movies.shaped.ai">Live Demo</a></b>
    <br/>
    <details>
      <summary><b>📕 Description and Features</b></summary>
      <p>A complete movie recommendation system demonstrating personalized feeds, similar items, and personalization based on user interactions. Built with Next.js frontend and Shaped backend, showcasing how to retrieve personalized movie recommendations and track user interactions.</p>
      <img src="assets/movies-screenshot.png" style="width: 100%; aspect-ratio: 4/3; object-fit: cover; object-position: top;">
      <b>Features</b><br/>
      <p>
        <code>Personalized Recommendations</code>, <code>Similar Items</code>, <code>User Interactions</code>, <code>MovieLens Dataset</code>, <code>Next.js</code>
      </p>
    </details>
  </td>
</tr>
</table>


## Notebooks

We also have a few notebooks to show basic use cases of Shaped in action. 

| Dataset                                                | Connector                                                         | GitHub Link                                                          | Colab Link                                                                                                                                                                                                     |
| ------------------------------------------------------ | ----------------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Movielens](https://grouplens.org/datasets/movielens/) | [Shaped Dataset](https://docs.shaped.ai/docs/api#tag/Dataset/operation/datasets__create_dataset_post)                         | [Link](tutorials/Shaped%20Dataset%20Movielens%20Tutorial.ipynb)              | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/shaped-ai/Shaped/blob/main/tutorials/Shaped%20Dataset%20Movielens%20Tutorial.ipynb)              |
| [Amazon](https://jmcauley.ucsd.edu/data/amazon/)       | [PostgreSQL](https://docs.shaped.ai/docs/integrations/postgresql) | [Link](tutorials/Postgres%20Amazon%20Beauty%20Ratings%20Tutorial.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/shaped-ai/Shaped/blob/main/tutorials/Postgres%20Amazon%20Beauty%20Ratings%20Tutorial.ipynb) |
| [Goodbooks](https://fastml.com/goodbooks-10k-a-new-dataset-for-book-recommendations/) | [MongoDB](https://docs.shaped.ai/docs/integrations/mongodb/) | [Link](tutorials/MongoDB%20Goodbooks%20Tutorial.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/shaped-ai/shaped/blob/main/tutorials/MongoDB%20Goodbooks%20Tutorial.ipynb) |
| [RentTheRunway](https://cseweb.ucsd.edu/~jmcauley/datasets.html#clothing_fit:~:text=%2C%202019%0Apdf-,Clothing%20Fit%20Data,-Description) | [Shaped Dataset](https://docs.shaped.ai/docs/api#tag/Dataset/operation/datasets__create_dataset_post) | [Link](tutorials/Shaped_Dataset_RentTheRunway_Turorial.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/shaped-ai/shaped-tutorials/blob/main/tutorials/Shaped_Dataset_RentTheRunway_Turorial.ipynb) |
| [Steam](https://cseweb.ucsd.edu/~jmcauley/datasets.html#steam_data) | [Shaped Dataset](https://docs.shaped.ai/docs/api/#tag/Dataset/operation/datasets__create_dataset_post) | [Link](tutorials/Shaped_Steam_Review_Tutorial.ipynb) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/shaped-ai/Shaped/blob/main/tutorials/Shaped_Steam_Review_Tutorial.ipynb)       
