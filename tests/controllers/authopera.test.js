// import request from 'supertest';

// import fastify from 'fastify';

// const app=fastify({
//     logger:true
// });

// //import app from '../../app.js';

// import Users from '../../models/Users.js';

// jest.mock('../../models/Users.js');


// beforeAll(async () => {
//     await app.listen(3021); // Ensure the server is started on port 3020 (or any available port)
// });

// afterAll(async () => {
//     await app.close(); // Close the app after all tests are done
// });

// // testing if the user already exists
// describe("testing the registartion of user",()=>{
//     test("should respond with 400 status code",async()=>{
//         Users.findOne.mockResolvedValue({username:'testname'});

//         const response=await request(app)
//         .post('/register')
//         .send({username:'testname',password:'testpassword',email:'testemail',role:'testrole'});

//         expect(response.statusCode).toBe(400);
//        // expect(responce.body).toBe('user  already exists.Try with another username');
//         expect(response.body).toBe('Username already exists. Try with another username');


//     })

//     })



// // testing the /register for all success cases

// describe("testing the  /registering the user",()=>{

//     test("should respond with a 201 status code", async ()=>{
//         const response =await request(app).post('/register').send({
//             username:"username",
//             password:"password",
//             email:"email",
//             role:"role"
//     })

//     expect(response.statusCode).toBe(201);

//     test("should specify json in the context type header", async()=>{

//         const response=await request(app).post('/register').send({
//             username:"username",
//             password:"password",
//             email:"email",    
//             role:"role"
//         })
//         expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
//     })

//     test("should return the user object",async()=>{

//         const response=(await request(app).post('/register')).send({
//             username:"username",
//             password:"password",
//             email:"email",
//             role:"role"
//         })
//         expect(response.body).toEqual({username:"username",password:"password",email:"email",role:"role"});
//     })

// })

// })


// // testing when username or password or email or role is missing

// describe("testing when username or password or email or role is missing",()=>{

//     test("should respond with a status code of 400 ",async()=>{

//         const bodydata=[
//             {username:"username",password:"password",email:"email"},
//             {username:"username",password:"password",role:"role"},
//             {username:"username",email:"email",role:"role"},
//             {password:"password",email:"email",role:"role"},
//             {username:"username",password:"password"},
//             {username:"username",email:"email"},
//             {username:"username",role:"role"},
//             {email:"email",role:"role"},
//             {password:"password",email:"email"},
//             {password:"password",role:"role"},
//             {username:"username",password:"password",email:"email",role:"role"},
//             {username:"username"},
//             {password:"password"},  
//             {email:"email"},
//             {role:"role"},
//             {},
//         ]

//         for(let i=0;i<bodydata.length;i++){

//             const response=await request(app).post('/register').send(bodydata[i]);
//             expect(response.statusCode).toBe(400);
//             expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
//             expect(response.body).toEqual({error:'error creating the user'})


//         }
//     })

// })

import app from '../../app.js'; // Your Fastify app
import Users from '../../models/Users.js'; // Users model

jest.mock('../../models/Users.js'); // Mock Users model

import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';

import mongoose from 'mongoose';



beforeAll(async () => {
    await app.listen(3021); // Ensure the Fastify app is running on port 3021
  });
  
  afterAll(async () => {
    await app.close(); // Close the app after tests
   
  });

// test-case-1:  Testing if the user already exists
describe("testing the registration of user", () => {
    test("should respond with 400 status code", async () => {
        // Mock findOne to return a user with the username 'testname'
        Users.findOne.mockResolvedValue({ username: 'testname' });

        const response = await app.inject({
            method: 'POST',
            url: '/auth/register',
            payload: { username: 'testname', password: 'testpassword', email: 'testemail', role: 'testrole' }
        });

        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.body)).toEqual({ error: 'Username already exists. Try with another username' });

        //expect(response.body).toBe('Username already exists. Try with another username');
    });
});

// test-case -2: Testing the /register for all success cases
describe("testing the /registering the user", () => {
    test("should respond with a 201 status code", async () => {
        Users.findOne.mockResolvedValue(null);

        const mockSave = jest.fn().mockResolvedValue({});
        Users.prototype.save = mockSave;

        const response = await app.inject({
            method: 'POST',
            url: '/auth/register',
            payload: {
                username: "username",
                password: "password",
                email: "email",
                role: "role"
            }
        });

        expect(response.statusCode).toBe(201);
        expect(mockSave).toHaveBeenCalledTimes(1);
    });

    test("should specify json in the content-type header", async () => {

       Users.findOne.mockResolvedValue(null);

        const mockSave = jest.fn().mockResolvedValue({});
        Users.prototype.save = mockSave;

        const response = await app.inject({
            method: 'POST',
            url: '/auth/register',
            payload: {
                username: "username",
                password: "password",
                email: "email",
                role: "role"
            }
        });

        expect(response.headers['content-type']).toEqual(expect.stringContaining('application/json'));
        expect(mockSave).toHaveBeenCalledTimes(1);
    });

    test("should return the user object", async () => {

       Users.findOne.mockResolvedValue(null);

        const mockSave = jest.fn().mockResolvedValue({});
        Users.prototype.save = mockSave;

        const response = await app.inject({
            method: 'POST',
            url: '/auth/register',
            payload: {
                username: "username",
                password: "password",
                email: "email",
                role: "role"
            }
        });

        expect(JSON.parse(response.body)).toEqual({message:'user created successfully'});
        
        expect(mockSave).toHaveBeenCalledTimes(1);
    });
});


// test-case -3 : testing the misssing any content :
describe("testing when username or password or email or role is missing", () => {
    test("should respond with a status code of 500 if any field is missing", async () => {
      // Mock the findOne method to return null (no existing user)
      Users.findOne.mockResolvedValue(null);
  
      // Mock the save method to simulate success (this won't be called if fields are missing)
    //   const mockSave = jest.fn().mockResolvedValue({});
    //   Users.prototype.save = mockSave;
  
      // Test data with various missing fields
      const bodydata = [
        { username: "username", password: "password", email: "email" },  // Missing role
        { username: "username", password: "password", role: "role" },     // Missing email
        { username: "username", email: "email", role: "role" },            // Missing password
        { password: "password", email: "email", role: "role" },            // Missing username
        { username: "username", password: "password" },                    // Missing email, role
        { username: "username", email: "email" },                          // Missing password, role
        { username: "username", role: "role" },                            // Missing password, email
        { email: "email", role: "role" },                                  // Missing username, password
        { password: "password", email: "email" },                          // Missing username, role
        { password: "password", role: "role" },                            // Missing username, email
        { username: "username", password: "password", email: "email", role: "role" },  // All fields present
        { username: "username" },                                          // Missing password, email, role
        { password: "password" },                                          // Missing username, email, role
        { email: "email" },                                                // Missing username, password, role
        { role: "role" },                                                  // Missing username, password, email
        {}                                                                 // Missing all fields
      ];
  
      for (let i = 0; i < bodydata.length; i++) {
        const mockSave = jest.fn().mockResolvedValue({});
        Users.prototype.save = mockSave;
        const response = await app.inject({
          method: 'POST',
          url: '/auth/register',
          payload: bodydata[i]
        });
  
     
          // When any field is missing, save should not be called
          expect(response.statusCode).toBe(400);  // Missing fields should return 400
          expect(response.headers['content-type']).toEqual(expect.stringContaining('application/json'));
        //   expect(JSON.parse(response.body)).toEqual({
        //     error: 'Missing required fields (username, password, email, role)'
        //   });
          expect(mockSave).toHaveBeenCalledTimes(0);  // Ensure save is not called when fields are missing
        
      }
    });
  });
  



  // Test Case 4: Internal server error  catch block 
describe ("testing when an error occurs during user creation catch block",()=>{

    test("should respond with a status code of 500",async()=>{

                Users.findOne.mockResolvedValue(null);

                const mockSave=jest.fn().mockRejectedValue(new Error('Database error'));

                Users.prototype.save=mockSave;
                const bodydata={
                    username:"username",
                    password:"password",
                    email:"email",
                    role:"role"
                }

                const response=await app.inject({
                    method:'POST',
                    url:'/auth/register',
                    payload:bodydata
                });

        expect(response.statusCode).toBe(500);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('application/json'));
        expect(JSON.parse(response.body)).toEqual({
            error:"error creating the user"
        })
        expect(mockSave).toHaveBeenCalledTimes(1);
        })
    })



// ++++++++++++++++++++++++++++++++++++++++++++ TEST CASES FOR THE LOGIN FUNCTIONALITY +++++++++++++++++++++++++++++++++++++++++++++++++++++++



// Test Case 1: User not found (Invalid username)
describe("testing the login functionality",()=>{

    test("testing when user name not found",async()=>{
        Users.findOne.mockResolvedValue(null);
        
        const response=await app.inject({
            method:'POST',
            url:'/auth/login',
            payload:{username:"username",password:"password"}
        });

        expect(response.statusCode).toBe(400);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('application/json'));
        expect(JSON.parse(response.body)).toEqual({
            error:"user not found"
        })
    })
})


 // Test Case 2: Invalid credentials (password doesn't match)

 describe("testing the login functionality",()=>{

    //import bcrypt from 'bcryptjs';
    test('should respond with a status code of 400 for invalid credentials', async () => {
 
        Users.findOne.mockResolvedValue({
            _id:'1',
            username:'username',
            password:'hashedpassword',
            role:'user'
        })

      //  bcrypt.compare=jest.fn().mockResolvedValue(false);
    //   jest.mock('bcrypt', () => ({
    //     compare: jest.fn().mockResolvedValue(false),
    //   }));
      
      bcrypt.compare = jest.fn().mockResolvedValue(false);

        const bodydata={username:"username",password:"password"};

        const response=await app.inject({
            method:'POST',
            url:'/auth/login',
            payload:bodydata
        })

        expect(response.statusCode).toBe(400);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('application/json'));
        expect(JSON.parse(response.body)).toEqual({
            error:'invalid credentials'
            
        })
 })
 })


 // // Test Case 3: Successful login (correct username and password)

 describe("testing the login functionality",()=>{
    test('should respond with a status code of 200 for successfully logged in user',async ()=>{

        Users.findOne.mockResolvedValue({
            _id:'1',
            username:'username',
            password:'hasedpassword',
            role:'user'
        });

        bcrypt.compare=jest.fn().mockResolvedValue(true);

        jest.mock('jsonwebtoken'); // Mocking the entire jsonwebtoken module

        jwt.sign = jest.fn().mockReturnValue('mockedToken');

        const bodydata={username:'username',password:'password'};

        const response=await app.inject({
            method:'POST',
            url:'/auth/login',
            payload:bodydata
        })

        expect(response.statusCode).toBe(200);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('application/json'))
        expect(JSON.parse(response.body)).toEqual({
            token:'mockedToken'
        })

    })
 })


 // Test Case 4: Internal server error (bcrypt.compare throws error) catch block 

describe("testing when an error occurs during login",()=>{

    test("should respond with a status code of 500",async()=>{
        Users.findOne.mockResolvedValue({
            _id: '1',
      username: 'username',
      password: 'hashedPassword',
      role: 'user',

        });

        bcrypt.compare=jest.fn().mockRejectedValue(new Error('Database error'));

        const bodydata={
            username:"username",
            password:"password"
        }

        const response=await app.inject({
            method:'POST',
            url:'/auth/login',
            payload:bodydata
        });
        expect(response.statusCode).toBe(500);
        //console.log('Expected:', expected);
//console.log('Received:', received);

        expect(response.headers['content-type']).toEqual(expect.stringContaining('application/json'));
        expect(JSON.parse(response.body)).toEqual({
            error:'error while login in the user'
        })
       // expect(mockSave).toHaveBeenCalledTimes(0);
        })

    })
    

    // ++++++++++++++++++++++++++++++++++++++++++++ TEST CASES FOR THE LOGOUT FUNCTIONALITY +++++++++++++++++++++++++++++++++++++++++++++++++++++++
