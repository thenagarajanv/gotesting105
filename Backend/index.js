const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
app.listen(3008)

app.get("/api/getusers", async (req, res) => {
  const users = await prisma.user.findMany()
  console.log(users);
  return res.status(200).json(users)
});

app.get('/api/users/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Fetch user data based on userId from Prisma
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        rollNumber: true,
        name: true,
        stage1Status: true,
        stage2Status: true,
        stage3Status: true,
        stage4Status: true,
        stage5Status: true,
        stage6Status: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send back user data as response
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'An error occurred while fetching user data' });
  }
});

app.delete('/api/deleteUser/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: `User with ID ${userId} not found` });
    }

    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });
    res.json(deletedUser);
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ error: 'Failed to delete user' });
  } finally {
    await prisma.$disconnect();
  }
});


app.get('/api/getUserStatus', async (req, res) => {
  const { email } = req.query;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


app.put('/api/updateUser', async (req, res) => {
  const { Useremail, stage1, stage2, stage3, stage4, stage5, stage6 } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { email: Useremail },
      data: {
        stage1: parseInt(stage1),
        stage2: parseInt(stage2),
        stage3: parseInt(stage3),
        stage4: parseInt(stage4),
        stage5: parseInt(stage5),
        stage6: parseInt(stage6),
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.post("/api/signup", async (req, res) => {
  console.log("Sigining..",req.body);
  try {
    const { rollnumber, email, password } = req.body;
    const existingUser = await prisma.user.findFirst({
      where: { email: email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await prisma.user.create({
      data: {
        name: rollnumber,
        email: email,
        password: password, 
        stage1: 0,  
        stage2: 3,  
        stage3: 3,
        stage4: 3,
        stage5: 3,
        stage6: 3,
      },
    });

    console.log("User created:", newUser);

    return res.status(201).json({ message: "User created successfully" });

  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/api/Login", async (req, res) => {
    // console.log(req);
    const { Useremail,Userpassword } = req.body;
    const val=await prisma.user.findFirst({where:{email:Useremail}})
    if(val){
      if(val.email===Useremail&&val.password===Userpassword){
        console.log("Logged in");
      return res.status(200).json({ message: "User Loggedin successfully" });
      }
      console.log("NOT logged in");
    }
    else{
      return res.status(404).json({ message: "User not loggedin successfully" });
    }
  });


  
// app.put("/api/updateUser", async (req, res) => {
//   const { Useremail, stage } = req.body;
//   try {
//     console.log(`Updating user with email: ${Useremail}`);
//     const existingUser = await prisma.user.findFirst({
//       where: { email: Useremail },
//     });
//     if (!existingUser) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     const updatedUser = await prisma.user.update({
//       where: { email: Useremail },
//       data: { stage },
//     });
//     console.log("User updated:", updatedUser);
//     return res.status(200).json(updatedUser);
//   } catch (error) {
//     console.error("Error updating user:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });
