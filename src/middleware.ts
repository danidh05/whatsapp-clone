// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// const isPublicRoute = createRouteMatcher(['/sign-in', '/sign-up']);

// export default clerkMiddleware((auth, request) => {
//   console.log('Request URL:', request.url);
//   if (!isPublicRoute(request)) {
//     console.log('Protecting route:', request.url);
//     auth().protect();
//   }
// });

// export const config = {
//   matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
// };
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};