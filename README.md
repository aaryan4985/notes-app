# Prisma Notes App

Prisma Notes is a responsive and feature-rich notes-taking web application built using React. The app allows users to create, edit, search, pin, and manage notes with a user-friendly interface and vibrant gradient themes.

## Features

- **Dark Mode Support:** Toggle between light and dark themes.
- **Responsive Design:** Works seamlessly across different devices.
- **Search Functionality:** Quickly find notes with a built-in search bar.
- **Drag and Drop:** Reorder notes using drag-and-drop functionality.
- **Gradient Themes:** Choose from various vibrant gradient themes for your notes.
- **Pin Notes:** Highlight important notes by pinning them.
- **Local Storage:** All notes and preferences are saved locally, ensuring persistence across sessions.

## Technologies Used

- **Frontend:** React, Tailwind CSS
- **Icons:** Lucide React
- **Drag-and-Drop:** React Beautiful DnD
- **State Management:** React Hooks
- **Storage:** Browser LocalStorage

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/aaryan4985/notes-app.git
   cd notes-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

1. Use the **search bar** at the top to search for notes.
2. Click the **Create Note** button to add a new note.
3. Assign a gradient theme to your note while creating or editing.
4. **Pin notes** to keep them at the top of the list.
5. Drag and drop notes to reorder them.
6. Toggle between **light** and **dark** themes using the theme switcher.

## Folder Structure

```
notes-app/
├── public/         # Static files
├── src/
│   ├── components/ # Reusable components
│   ├── assets/     # Static assets
│   ├── App.js      # Main application component
│   ├── index.js    # Entry point
│   ├── StrictModeDroppable.js # Custom wrapper for React DnD
├── package.json    # Project metadata and dependencies
└── README.md       # Project documentation
```

## Contributing

Contributions are welcome! If you have ideas for improvements or new features, feel free to fork the repository and submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [Lucide Icons](https://lucide.dev/) for the beautiful icons.
- [React Beautiful DnD](https://github.com/atlassian/react-beautiful-dnd) for the drag-and-drop feature.

---


