<div align="center">
  <br />
  <h1>Totally Biased</h1>
  <p>✨ The definitive tool for ranking your favorites ✨</p>
  <br />
</div>

---

## About The Project

**Totally Biased** is a fun and simple web app that helps you create a ranked list of your favorite things. Whether it's movies, books, snacks, or anything else, this tool makes it easy to see how your preferences stack up. You provide the list, and through a series of one-on-one comparisons, we'll help you build your ultimate, totally biased ranking.

---

## Features

- **Simple Interface:** Just paste your list and start comparing.
- **Interactive Ranking:** Decide between two items at a time to build your ranking with smooth animations.
- **User Accounts & Persistence:** Save your completed rankings to your account and view all saved rankings on a dedicated page.
- **Enhanced Results Screen:**
  - Copy your ranked list to clipboard for easy sharing
  - Save rankings to your account
  - Generate shareable public links
- **Sharing & Social Features:** Share links that let others sort your list themselves, or share as plain text.

---

## 🛠️ Built With

![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Convex](https://img.shields.io/badge/Convex-000000?style=for-the-badge&logo=convex&logoColor=white)

---

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

1. Clone the repo

   ```sh
   git clone https://github.com/your_username_/totally-biased.git
   ```

2. Install NPM packages

   ```sh
   npm install
   ```

3. Run the development server

   ```sh
   npm run dev
   ```

## 📝 Example Lists

Get started with these sample lists, or use them as inspiration to create your own! Simply copy and paste any of these into the app to begin ranking.

### 🍎 Fruits

```
Apple, Banana, Orange, Strawberry, Grape, Watermelon, Lemon, Cherry, Peach, Pear, Blueberry, Pineapple, Mango, Kiwi, Plum, Avocado, Coconut
```

### 🎬 Classic Movies

```
The Shawshank Redemption, The Godfather, The Dark Knight, Pulp Fiction, Forrest Gump, Inception, The Matrix, Fight Club, The Lord of the Rings: The Return of the King, Interstellar, Gladiator, The Lion King, Titanic, Jurassic Park, Star Wars: Episode IV - A New Hope
```

### 🍕 Comfort Foods

```
Pizza, Burgers, Tacos, Pasta, Ice Cream, Chocolate, French Fries, Grilled Cheese, Mac and Cheese, Fried Chicken, Donuts, Brownies, Cookies, Pancakes, Ramen
```

### 🎵 Music Genres

```
Rock, Pop, Hip Hop, Jazz, Classical, Electronic, Country, R&B, Reggae, Blues, Folk, Punk, Metal, Indie, Alternative
```

### 🏖️ Vacation Destinations

```
Paris, Tokyo, New York City, Bali, London, Rome, Barcelona, Sydney, Santorini, Dubai, Iceland, Maldives, Hawaii, Amsterdam, Prague
```

---

## 🗺️ Roadmap

Here are some of the features planned for the future to make **Totally Biased** even better!

- [ ] **User Accounts & Database Integration**
  - [ ] Add a way to test the saving features without login for showcasing
  - [ ] Save unfinished comparisons to your account so you can continue them later on any device.
  - [x] Save completed rankings to your account.
  - [x] A dedicated page to view all your saved rankings.
- [x] **Enhanced Results Screen**
  - [x] A "Copy to Clipboard" button to easily share your text-based list.
  - [x] A "Save to Account" button to persist your masterpiece.
  - [x] A "Share" button to generate a public link.
    - [x] Share a link to sort your list.
    - [x] Share the list as plain text.
- [x] **Sharing & Social Features?**
  - [x] Generate a public, shareable link for your completed rankings. So people with the link can view and try to sort that list by themselves.
  - [x] Merge the share options to only share a ranked link, and add a button to "do this list by myself" or "Try to sort"
- [ ] **UI Improvements**
  - [ ] Enhance the ListCards layout using a bento grid approach to better handle cards with too much content.
  - [x] Tinder like animation for the cards in the ComparisonPanel.
  - [x] Fix the bug in the DrawerComponent where clicking multiple times quickly after the drawer disappears can save the list multiple times.
- [ ] add basic and advance list, advanced list can have dates and checklists for marking as completed can be shared between accounts (limited amount of basic/advanced lists and limited shared account).

Have an idea? Feel free to open an issue or contribute!
