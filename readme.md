# Fullstack Todo List App

## Overview

This repository contains the code for a fullstack Todo List application. The backend is built using C#.NET, and the frontend is developed with React.js. The application allows users to create, read, update, and delete (CRUD) tasks.

## Features

- **Add Todo**: Users can add new tasks to the list.
- **View Todo**: Users can view all tasks.
- **Update Todo**: Users can edit the details of existing tasks.
- **Delete Todo**: Users can remove tasks from the list.
- **Mark as Complete**: Users can mark tasks as completed.
- **Todos with Priority & Importance**: Users can mark tasks with desired priority & imporance.
- **Generate a task with AI**: Users can make use of AI to auto-generate a task with description.
  

## Technologies Used

- **Backend**: C#.NET
- **Frontend**: React.js
- **Database**: [Specify the database used, e.g., SQL Server, MySQL, etc.]

## Prerequisites

- [.NET SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

## Getting Started

### Backend Setup

1. **Clone the repository**:
    ```bash
    git clone [repository-url]
    cd [repository-directory]/todo-backend/todo-backend
    ```

2. **Restore dependencies**:
    ```bash
    dotnet restore
    ```

3. **Setup Environment Variables**:
    Modify the values of environment variables in `.env`, including:
   - Database connection string
   - OAuth credentials
   - JWT secret
   - OpenAI API key
   

5. **Run database migrations** (if applicable):
    ```bash
    dotnet ef database update
    ```

6. **Run the backend server**:
    ```bash
    dotnet run
    ```

    The backend server should now be running at `https://localhost:5166` (or the specified port).

### Frontend Setup

1. **Navigate to the frontend directory**:
    ```bash
    cd [repository-directory]/todo-frontend
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Configure API endpoint**:
    Update the API endpoint in the `.env` file or wherever the API URL is configured to point to your backend server.

4. **Run the frontend development server**:
    ```bash
    npm start
    ```

    The frontend application should now be running at `http://localhost:3000`.

## Usage

- **Access the application**:
    Open your browser and navigate to `http://localhost:3000`.

- **Interacting with the app**:
    - **Add a new task**: Use the input field to add new tasks.
    - **Edit a task**: Click on the task to edit its details.
    - **Delete a task**: Click the delete button to remove a task.
    - **Filter by common conditions**: One-click to filter by common conditions, like due today and priority
    - **Generate a task with AI**: Input a description of the task and AI will generate a new one in our data format

### Hosting

- **Frontend**: The frontend application is hosted and built with [AWS Amplify](https://aws.amazon.com/amplify/)
- **Backend**: The backend service is dockerized. The image is stored in [Amazon Elastic Container Registry](https://aws.amazon.com/ecr/), and then hosted with [Amazon Elastic Container Service](https://aws.amazon.com/ecs/)
- **CICD**: The frontend application is handled by AWS Amplify, and the backend is by AWS CodePipeline & CodeBuild.

## Contributing

Feel free to open issues or submit pull requests if you have any improvements or bug fixes.
