import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export async function getTodos(userid:number){
    let result=await prisma.todo.findMany({
        where:{
            userid: userid,
        },
        include:{
            user:true
        }
    })
    console.log(result);
    return result;
}

export async function addTodo(taskname:string,userid:number){
    let result=await prisma.todo.create({
        data:{
            taskname:taskname,
            isComplete:false,
            userid:userid,
        }
    })
    console.log(result);
}

export async function addUser(username:string,password:string,email:string){
    let result=await prisma.user.create({
        data:{
            username:username,
            password:password,
            email:email,
        }
    })
    console.log(result);
}

export async function findUser(username:string,password:string){
    let result=await prisma.user.findUnique({
        where:{
            username:username,
            password:password,
        },
    })
    return result;
}

export async function deletetodo(id:number){
    let result=await prisma.todo.delete({
        where:{
            id:id,
        }
    })
    console.log(result);
}
export async function updatetodo(id:number,updatedTask:string){
    let result=await prisma.todo.update({
        where:{
            id:id,
        },
        data:{
            taskname:updatedTask,
        }
    })
    console.log(result);

}