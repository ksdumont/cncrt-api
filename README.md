# CNCRT

Welcome to CNCRT. A private intimate concert brought to your home. Book artists directly!

![](cncrt.png)

### Click [here](https://cncrt.now.sh/) to get started.

Search local artists in your city. Contact artist directly. Register as an artist to build your profile, set your rate, and land your first gig!

![](resultspage.png)

#### Technologies Used
* HTML
* CSS
* Javascript
* React
* Node
* Postgresql
* Knex


## URL
  
  https://quiet-eyrie-75922.herokuapp.com

## METHOD
  
   GET | POST | DELETE | PATCH

## Show all artists
  * GET /api/artists

## Add a new artist
  * POST /api/artists
  ```
  {
  name: "", 
  email: "", 
  username: "", 
  password: ""
  }
  ```
  ## Delete an artist
  * DELETE /api/artists/:artist_id
  
  ## Update an artists profile
  * PATCH /api/artists/:artist_id
  ```
  {
  image: "",
  bio: "",
  website: "",
  music: "",
  video: "",
  rate: "",
  location: "",
  travel: Boolean,
  contact: ""
  }
  ```

 ## Success Response
   
   * Code: 200
 
 ## Error Response
  
  * Code: 400
