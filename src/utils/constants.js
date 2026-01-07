// These are basically templates we use them anywhere we want 

//this object can be passed onto wherever its required 
export const UserRoleEnum = {
    ADMIN: "admin",
    Project_Manager: "Projectmanager",
    member: "member"
}

// We can also pass it as an array 
export const UserRole = Object.values(UserRoleEnum)

// For our tasks 

export const TaskStatus = {
    TODO: "todo",
    Completed: "completed",
    In_Progress: "Inporgress"
}

export const StatusTask = Object.values(TaskStatus)