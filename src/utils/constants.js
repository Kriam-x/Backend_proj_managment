// These are basically templates we use them anywhere we want 

//this object can be passed onto wherever its required 
export const UserRoleEnum = {
    ADMIN: "admin",
    Project_Manager: "Projectmanager",
    member: "member"
}

// We can also pass it as an array , user role enum ki value esmai as an array form mai stored hai 
export const AvaliableUserRole = Object.values(UserRoleEnum)

// For our tasks 

export const TaskStatus = {
    TODO: "todo",
    Completed: "completed",
    In_Progress: "Inporgress"
}

export const AvaliableStatusTask = Object.values(TaskStatus)