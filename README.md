![The Auction Room](./assets/logoreadme.png)

# The Auction Room

##  Features

-  **Authentication** – Register and log in with token-based authentication
-  **Profile Page** – View, edit, and manage your own auctions and bio
-  **Explore Listings** – See newest listings, most popular ones, and time-sensitive auctions
-  **Create & Edit Listings** – Post auctions with media, due date and descriptions
-  **Bid Functionality** – Place bids and track winning/losing status
-  **Fully Responsive** – Works seamlessly on both desktop and mobile
-  **Error Handling & Validation** – User feedback for failed submissions and validations

---

##  Pages

| Page | Description |
|------|-------------|
| `/index.html` | Landing page with hero, newest auctions and featured sections |
| `/listings/feed.html` | Feed page that displays paginated listings (12 per page) |
| `/listings/detail-listing.html?id={id}` | Detail page for individual auction with bid history and seller info |
| `/auth/login.html` | Login page |
| `/auth/register.html` | Register page |
| `/profile/index.html` | Profile dashboard with all personal listings, wins, and bids |
| `/profile/public-profile.html`| Other users profile with active listings and old listings |

---

##  Technologies

- HTML5
- Tailwind CSS
- JavaScript (ESModules)
- Noroff Auction API (v2)
- Git & GitHub

---

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/T0nj3/auction-room

2. Navigate to the folder:
   cd auction-room

3. Open index.html in your browser (live server recommended).

## Environment Setup

	•	API used: Noroff Auction API
	•	All requests use X-Noroff-API-Key as a required header.
	•	Tokens are stored in localStorage after login.

##  Customization
    
    To change colors, fonts or layout, edit tailwind.config.js and recompile the styles with:
    npx tailwindcss -i ./src/input.css -o ./css/output.css --watch


### Authors 

	•	Tonje Albertisen
	•	Andre Lier
