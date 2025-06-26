# tasknest

**tasknest** is a personalized task management application designed to help you organize your tasks efficiently. Whether you're a student, professional, or religious user, tasknest adapts to your unique needs with tailored lists, themes, and an intuitive Kanban board.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **Kanban Board:** Visualize and manage your tasks with a drag-and-drop interface.
- **User Type Support:** Tailored experiences for **students**, **professionals**, and **religious users**:
  - **Students:** Lists like "To Do," "In Progress," "Done" with an indigo-gray theme.
  - **Professionals:** Lists like "Backlog," "Working On," "Completed" with a green-teal theme.
  - **Religious Users:** Lists like "Daily Practices," "Community Tasks," "Reflection" with a purple-blue theme.
- **Task Management:** Create tasks, assign them to lists, set priorities, due dates, add subtasks, leave comments, and log work time.
- **Customizable Dashboard:** Get an overview of your tasks and lists, with themes that match your user type.
- **Easy Registration and Login:** Choose your user type during registration to get started with pre-configured lists and a default task.
- **Responsive Design:** Use tasknest on any device, from desktops to smartphones.
- **Accessibility:** Built with semantic HTML and ARIA attributes for an inclusive experience.
- **Real-Time Updates:** Changes to task priority, status, and due date are saved instantly.

## Demo

Check out the live demo of tasknest: [Tasknest Demo](https://your-demo-link.com)  
_(Replace with the actual demo link if available.)_

## Installation

To run tasknest locally, follow these steps:

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4 or higher)

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Md-Dipu/tasknest.git
   cd tasknest
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   - Create a `.env` file in the root directory.
   - Add the following:
     ```plaintext
     MONGODB_URI=mongodb://localhost:27017/tasknest
     SESSION_SECRET=your-secret-key
     ```

4. **Start the MongoDB server:**

   ```bash
   mongod
   ```

5. **Run the application:**

   ```bash
   npm start
   ```

6. **Access the app:**
   - Open your browser and go to `http://localhost:3000`.

## Usage

1. **Register an Account:**

   - Click "Get Started" on the homepage.
   - Choose your user type (student, professional, or religious).
   - Complete the registration form.

2. **Explore Your Dashboard:**

   - View your pre-configured lists and default task.
   - Add new lists or tasks using the inline forms.

3. **Manage Tasks:**

   - Drag and drop tasks between lists on the Kanban board.
   - Click on a task to open the modal and add details, subtasks, comments, or work logs.

4. **Customize Your Experience:**
   - Rename lists and tasks directly in the interface.
   - Update task priority, status, or due date in real-time via the modal's sidebar.

## Contributing

We welcome and appreciate contributions to tasknest! Whether you're fixing bugs, adding features, improving documentation, or enhancing the user experience, your contributions help make this project better for everyone.

### Quick Start for Contributors

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. **Make your changes and test thoroughly**
4. **Follow our commit message conventions:**
   ```bash
   git commit -m "feat(component): add your feature description"
   ```
5. **Push to your fork:**
   ```bash
   git push origin feat/your-feature-name
   ```
6. **Open a pull request** with a clear description

### Detailed Guidelines

For comprehensive information about contributing, including:

- Development setup
- Coding standards
- Testing requirements
- Pull request process
- Bug reporting guidelines

Please read our **[Contributing Guidelines](CONTRIBUTING.md)**.

### Types of Contributions Welcome

- 🐛 Bug fixes and error handling improvements
- ✨ New features and enhancements
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- ⚡ Performance optimizations
- 🧪 Test coverage improvements
- ♿ Accessibility improvements

## License

This project is licensed under the [MIT License](LICENSE).

## Contributors

Thanks to all the contributors who have helped make tasknest better!

<!-- Contributors will be automatically added here -->

## Contact

For support or feedback, please reach out to us at **srdipu@hotmail.com**.

Thank you for using tasknest! We hope it helps you stay organized and productive.
