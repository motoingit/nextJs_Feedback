# Understanding Node.js Runtime vs Edge Runtime

## 📺 Resources

- **Detailed:** https://youtu.be/DhHE7NcZChQ
- **Short:** https://youtu.be/ORqN_j8iqqw?t=120

---

## My Understanding

When a request reaches a Next.js application, the framework decides **where the server-side code should execute**.

- In **Node.js Runtime**, the code runs in a full Node.js environment.
- In **Edge Runtime**, the code runs in a lightweight edge environment closer to the user.

The runtime is responsible for executing server-side logic and generating the response.

---

## Request Flow

```text
Client
   │
   ▼
Next.js
   │
   ├── Node Runtime
   │      └── Full backend capabilities
   │
   └── Edge Runtime
          └── Lightweight execution near the user
```

---

## Key Points

- Node Runtime supports Node.js APIs.
- Edge Runtime has faster startup times.
- Choose the runtime based on your application's requirements.

---

# Email Sender

## Node Mailer

---

## resend email

---

# Database connnection har ek route pe lagta hai kyuki nextjs edge pe chalta hai

# note1

``` txt
//* Void in cpp is diffrent from void here {yeha pe muje parva nahi hai ki kis tarha ka datatype ara hai}
async function dbConnect(): Promise<void> {

  //* Optimisation for doudging Choking and performence issue
  if(connection.isConnected){
    console.log("Already Connected To Database");
    return;
  }

```
# note1

``` txt
//* Optimisation for doudging Choking and performence issue
  if(connection.isConnected){
    console.log("Already Connected To Database");
    return;
  }

```
# note1

``` txt
all are same

// "I know this value is not null or undefined. Trust me."
await mongoose.connect(process.env.MONGO_DB_URI!);

await mongoose.connect(process.env.MONGO_DB_URI || "");

await mongoose.connect(process.env.MONGO_DB_URI || '', {});
```
# note1

``` txt
const db = await mongoose.connect(process.env.MONGO_DB_URI || '');
    
    connection.isConnected = db.connections[0].readyState;
    console.log(connection.isConnected);

    here readystate will return 
    | Value | Meaning       |
    | ----: | ------------- |
    |     0 | Disconnected  |
    |     1 | Connected     |
    |     2 | Connecting    |
    |     3 | Disconnecting |

```
# note1

``` txt
const db = await mongoose.connect(process.env.MONGO_DB_URI || '');

//This is the default connection
connection.isConnected = db.connections[0].readyState;
//This is an array of all connections managed by Mongoose.
connection.isConnected = db.connection.readyState; 
//BOTH ARE SAME

more info
https://chatgpt.com/s/t_6a4cc004631481918d53eae84e961f0b

```
# note1

``` txt
// this is what typescipt is making of Model for Message
export interface Message extends Document{
  content: string;
  createdAt: Date;
}

```
# note1

``` txt
// Impementing the MessageSchema
const MessageSchema: Schema<Message> = new mongoose.Schema({
  content: {
    //! in mongose String not string
    type: String, 
    required: true,
  },

  createdAt:{
    type: Date,
    required: true, //todo: do i need this if i have defualt
    default: Date.now,
  },
});

```
# note1

``` txt
//todo: Know More [https://youtu.be/g1iqZpXklnY?list=PLu71SKxNbfoBAaWGtn9GA2PTw0HO0tXzq&t=1192]
//* banahua hai to use use karo ?? nahi tho new banao
const UserModel = (mongoose.models.User as mongoose.Model<User>) 
                ?? mongoose.model<User>("User", UserSchema)
export default UserModel;


```

# note1

``` txt
const UserSchema: Schema<User> = new mongoose.Schema({
  username:{
    type: String,
    required: [true, "Username is Required"],
    trim:true,
    unique:true,
  },

  email: {
    type: String,
    required: [true, "Email is Required"],
    unique:true,
    match: [/.+\@.+\..+/, "Please use a Valid Email Address"], 
  },

  password: {
    type: String,
    required: [true, "Password is Required"], 
  },

  verifyCode: {
    type: String,
    required: [true, "Verify Code is Required"], 
  },

  verifyCodeExpiry: {
    type: Date,
    required: [true, "Expiry Date of VERIFYCODE is Required"],
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  isAcceptingMessage: {
    type: Boolean,
    default:true,
  },

  /////////////////////////// THIS MESSAGE SACHEMA IS GOOD
  messages: [MessageSchema],
})
```
# note1

``` txt
try {
    //todo: Some is hardcoded
    const { data, error } = await resend.emails.send({
      // from: 'Acme <onboarding@resend.dev>',
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Mystry message| Verification',
      //? this is function technically but in code its Component or page
      react: VerificationEmail({ username: username, otp: verifyCode }),
    });

    //* The API responded, but with an error
    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    //* conosling the sucess
    console.log(`Verification is Sended : Successcode: ${data}`)

    return {
      success: true,
      message: "Verification email sent successfully.",
    };

  } catch (emailError) {
    //* An exception was thrown - when somthing wrong in the path
    return {
      success: false,
      // THIS ENSURE THAT ERROR IS FROM WHICH
      message:
        emailError instanceof Error ? emailError.message : String(emailError),
    };
  }


MORE:
https://chatgpt.com/s/t_6a4cd02a529081918a3ae66239b9e0e9
```
# note1

``` txt
try {
    await dbConnect()

    /*
    ///todo: How we know somting like this is comming ?
      ///* It's coming from the HTTP request body sent by the frontend.
      ///?https://chatgpt.com/s/t_6a4cd323a2b4819180a1a0e05f369154
     */
    const {username, email, password} = await req.json();

    //* is this user is presentANDverifed
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true
    })
```
# note1

``` txt
// stantderd way to send response to frontend
return Response.json(
      {
        success: false,
        message: 'Errro regestering user'
      },
      {
        status:500
      }
    )
  }
```
# note1

``` txt
// stantderd way to send response to frontend
interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
      //what is ths &
    } & DefaultSession['user'];
  }
```
# note1

``` txt
https://nextjs.org/docs/app/guides/upgrading/version-16#middleware-to-proxy

The middleware filename is deprecated, and has been renamed to proxy to clarify network boundary and routing focus.

middleware.ts {
      import { NextRequest, NextResponse } from 'next/server';
      import { getToken } from 'next-auth/jwt';
      export { default } from 'next-auth/middleware';

      export const config = {
        matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'],
      };

      export async function middleware(request: NextRequest) {
        const token = await getToken({ req: request });
        const url = request.nextUrl;

        // Redirect to dashboard if the user is already authenticated
        // and trying to access sign-in, sign-up, or home page
        if (
          token &&
          (url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify') ||
            url.pathname === '/')
        ) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        if (!token && url.pathname.startsWith('/dashboard')) {
          return NextResponse.redirect(new URL('/sign-in', request.url));
        }

        return NextResponse.next();
      }
}

proxy.ts{
  
}
```
# note1

``` txt
                  // data extract when frontend sends data from url
//This will give whole URL - {http://localhost:3000/api/cuu?username?phone=android}
    const {searchParams} = new URL(req.url)
    const queryParam = {
      username: searchParams.get('username')
    }


                        //when frontend sends the json
  const {username, code} = await req.json()                    
```
# note1

``` txt
    //This will give whole URL - {http://localhost:3000/api/cuu?username?phone=android}
    const {searchParams} = new URL(req.url)
    const queryParam = {
      username: searchParams.get('username')
    }




    above we are just using   {new URL(req.url)}  but we should use the "decodeURIComponent(username)"  for this
    ans manytime '.' == '%20' in url             
```
# note1

``` txt
    Then:

const url = new URL(req.url);

const username = url.searchParams.get("username");

Although URLSearchParams already decodes values automatically in modern JavaScript, if you manually work with encoded URL parts, decodeURIComponent() is useful.


https://chatgpt.com/s/t_6a4df4d9612c8191bdc8226c02980145
```
# note1

``` txt
That format is the standard ISO 8601 UTC date-time format.

databse:
2026-07-07T23:08:21.188+00:00

here
2026-07-08T08:22:19.666Z

```
# note1

``` txt
In schemas/, Zod validations were using { error: '...' } instead of the correct syntax { message: '...' }. The custom messages were ignored by Zod. We will correct these.

```
# note1

``` txt
The important part is:

body?.username

It means:

"If body exists (is not null or undefined), then access username. Otherwise, return undefined instead of throwing an error."

```
# note1

``` txt
if (!user) {
      console.warn(`⚠️ Verification failed: User "${username}" not found.`);
      return Response.json(
        {
          success: false,
          message: "User not found"
        },
        { status: 404 } // Changed from 500 to 404 to represent Resource Not Found
      );
    }

//!!!!!!!!!!!!!!!!
if (!user)
  covers:
  user === null
  user === undefined

```
# note1

``` txt
A cleaner snippet


"Console Log - Stylish": {
  "prefix": "clog",
  "body": [
    "console.${1|log,info,warn,error|}(\"\\u001b[${2|31,32,33,34,35,36,91,92,93|}m[${3:INFO}]\\u001b[0m > ${4:Message}\");"
  ],
  "description": "Colored console log"
}

This lets you tab through:

log, info, warn, error
Color codes (31, 32, 33, etc.)
Label (INFO, ERROR, etc.)
Message text

```
# note1
```txt
If you want beautiful terminal logs

I recommend chalk.

Example:

import chalk from "chalk";

console.log(chalk.blue.bold("[REQUEST]"), "GET /api/users");
console.log(chalk.green("[SUCCESS]"), "User created");
console.log(chalk.yellow("[WARNING]"), "Email already exists");
console.log(chalk.red.bold("[ERROR]"), "Database connection failed");

```
# note1
'''txt
The $or is used because your login form allows the user to enter either an email or a username in the same input field (identifier).

identifier: {
  label: "Email or Username",
  type: "text",
}

```
# note1
'''txt
findOneAndUpdate takes 3 main arguments:

Filter — which document to find
Update — what to change
Options — extra behavior flags
For your case:


await UserModel.findOneAndUpdate(
  { _id: userId },                 // 1) filter
  { $set: { isAcceptingMessage: acceptMessage } }, // 2) update
  { new: true }                    // 3) options
);


What new: true means
new: true tells Mongoose to return the updated document
If omitted, it returns the old document by default

```
# note1
```txt
The $or is used because your login form allows the user to enter either an email or a username in the same input field (identifier).

identifier: {
  label: "Email or Username",
  type: "text",
}

```
# note1
'''txt
const newMessage = {content, createdAt: new Date()};

    //todo: This {as} is assertion and have to put in ts , as it says that i will insure u that this newMesage is comming in MEssagInterfaceFomat
    user.messages.push(newMessage as Message);
```
