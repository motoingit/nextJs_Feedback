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
