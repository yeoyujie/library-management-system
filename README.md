# Library Management System

Our Library Management System (LMS) is a web-based application designed to help libraries manage their collections and provide a user-friendly interface for searching and borrowing books. This project was developed as part of a software development course, with the goal of gaining practical experience in building a full-stack web application.

## Table of Contents

- [Motivation](#motivation)
- [Features](#features)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

This project was developed using React, Firebase, and the Lottie animation library, with the goal of creating a lightweight and easily customizable LMS that can be adopted and adapted by users.

![Screenshot of web app](/src/assets/webapp-example.png)

One of the key features of our LMS is the ability to automatically fetch book cover images using the Open Library API. This, combined with smooth transitions and animations powered by the Lottie library, allows us to provide a visually appealing and informative interface for users, making it easier for them to find and learn about books in our collection.

Our LMS is built using React, a popular JavaScript library for building user interfaces. This allows us to create modular and reusable components, making it easy to customize and extend the functionality of our application. We use Firebase for the backend and database storage which provides a scalable and reliable solution for us.

In addition to gaining technical experience, this project also provided an opportunity to learn more about project management and collaboration. By working on this project, I was able to practice planning, organizing, and executing a software development project from start to finish.

Overall, the motivation behind this project was to gain valuable experience and knowledge in software development, while also creating a useful and practical tool for managing libraries. I hope that this project can serve as a learning experience or guide for other beginners looking to improve their skills and take on similar projects.

## Features

- **Add Books**: Easily add new books to your library's collection.
- **Search Books**: Quickly search for books by title, author, or other criteria.
- **Edit Books**: Update book information as needed.
- **Borrow Books**: Allow users to borrow books from your library.
- **User Roles**: Admins have full access to all features, while users can only search and borrow books.
- **Customizable**: Our LMS is designed to be a general template that can be easily customized to fit your specific needs.
- **Book Cover Images**: Automatically fetch book cover images using the Open Library API.

## Getting Started

To access the hosted app on Netlify, click [here](https://master--dainty-jelly-1fe535.netlify.app/) (password: 123). Please note that this authentication method is not intended to be a standard protocol as we are not focused on authentication in this project. If you're interested in implementing standard web authentication methods, some popular options include:

- OAuth 2.0
- JSON Web Tokens (JWT)
- OpenID Connect (OIDC)

Or if you run it locally, you can get started by following these steps:

1. Clone or download the repository.
2. Install the required dependencies by running `npm install`.
3. Set up a Firebase project and configure the Firebase settings in the LMS.
4. Start the LMS by running `npm start`.

That's it! You can now start using our LMS to manage your library's books and users.

> **Note:** It is safe to share your Firebase API keys in general, as they are not meant to be private keys but just identifiers. However, if you want to link the LMS to your own Firebase project, you should change the Firebase configuration in the `src/firebase/firebase.js` file.
> If you encounter any issues or have questions regarding Firebase, please refer to the [Firebase documentation](https://firebase.google.com/docs) for guidance.

## Contributing

We welcome contributions from the community! If you would like to contribute to the development of our LMS, please feel free to fork the repository and submit a pull request with your changes. We also appreciate any feedback or suggestions you may have.

## License

Our Library Management System is released under the MIT license. This means that you are free to use, modify, and distribute it as you see fit.

## Contact

If you have any questions or feedback, please feel free to contact me:

- Yu Jie - [LinkedIn](https://www.linkedin.com/in/yeoyujie/)
- Email: [yeo.yujie@gmail.com](mailto:yeo.yujie@gmail.com)
