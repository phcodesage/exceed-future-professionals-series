"use strict";(()=>{var e={};e.id=832,e.ids=[832],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6326:e=>{e.exports=import("resend")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,r){return r in t?t[r]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,r)):"function"==typeof t&&"default"===r?t:void 0}}})},4992:(e,t,r)=>{r.a(e,async(e,i)=>{try{r.r(t),r.d(t,{config:()=>p,default:()=>l,routeModule:()=>c});var n=r(1802),o=r(7153),s=r(6249),a=r(7242),d=e([a]);a=(d.then?(await d)():d)[0];let l=(0,s.l)(a,"default"),p=(0,s.l)(a,"config"),c=new n.PagesAPIRouteModule({definition:{kind:o.x.PAGES_API,page:"/api/experience-registration",pathname:"/api/experience-registration",bundlePath:"",filename:""},userland:a});i()}catch(e){i(e)}})},9661:(e,t,r)=>{r.d(t,{l7:()=>c,XA:()=>u,h9:()=>l,uD:()=>a});let i=require("mongoose");var n=r.n(i);let o=process.env.MONGODB_URI||"";if(!o)throw Error("Please define the MONGODB_URI environment variable");let s=global.mongoose??(global.mongoose={conn:null,promise:null});async function a(){if(s.conn)return s.conn;s.promise||(s.promise=n().connect(o,{bufferCommands:!1}));try{s.conn=await s.promise}catch(e){throw s.promise=null,e}return s.conn}let d=new(n()).Schema({parentName:{type:String,required:!0},childName:{type:String,required:!0},email:{type:String,required:!0},phone:{type:String,required:!0},gradeLevel:{type:String,required:!0},programInterests:{type:[String],default:[]},interests:{type:String}},{timestamps:!0}),l=n().models.WaitlistEntry||n().model("WaitlistEntry",d),p=new(n()).Schema({fullName:{type:String,required:!0},emailOrContact:{type:String,required:!0},selectedDate:{type:String,required:!0},selectedTime:{type:String,required:!0}},{timestamps:!0}),c=n().models.ExperienceRegistration||n().model("ExperienceRegistration",p),g=new(n()).Schema({sessionId:{type:String,required:!0,index:!0},page:{type:String,required:!0},referrer:{type:String,default:""},userAgent:{type:String,default:""},lastActive:{type:Date,default:Date.now,index:!0}},{timestamps:!0}),u=n().models.PageVisit||n().model("PageVisit",g)},7242:(e,t,r)=>{r.a(e,async(e,i)=>{try{r.r(t),r.d(t,{default:()=>a});var n=r(6326),o=r(9661),s=e([n]);n=(s.then?(await s)():s)[0];let d=process.env.RESEND_API_KEY,l=d?new n.Resend(d):null,p=["info@exceedlearningcenterny.com","olganyc21@gmail.com","phcodesage@gmail.com"];async function a(e,t){if("POST"!==e.method)return t.status(405).json({message:"Method not allowed"});try{let{fullName:r,emailOrContact:i,selectedDate:n,selectedTime:s}=e.body;if(!r||!i||!n||!s)return t.status(400).json({message:"Missing required fields."});await (0,o.uD)();let a=new o.l7({fullName:r,emailOrContact:i,selectedDate:n,selectedTime:s});if(await a.save(),l)try{await l.emails.send({from:"Exceed Future Professionals <noreply@swe-rech.site>",to:p,subject:`🎉 New Experience Day Registration - ${n}`,html:`
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #ca3433, #e85653); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 24px;">✨ New Experience Day Registration</h1>
              </div>
              <div style="background: #fff; padding: 30px; border: 1px solid #eee; border-radius: 0 0 12px 12px;">
                <h2 style="color: #0e1f3e; margin-top: 0;">Registration Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;"><strong>Full Name:</strong></td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee; color: #0e1f3e;">${r}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;"><strong>Email/Contact:</strong></td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee; color: #0e1f3e;">${i}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;"><strong>Selected Date:</strong></td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee; color: #ca3433; font-weight: bold;">${n}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px; color: #666;"><strong>Selected Time:</strong></td>
                    <td style="padding: 12px; color: #ca3433; font-weight: bold;">${s}</td>
                  </tr>
                </table>
                <div style="margin-top: 20px; padding: 15px; background: #fff7e5; border-radius: 8px; border-left: 4px solid #ca3433;">
                  <p style="margin: 0; color: #0e1f3e;"><strong>60-Minute Experience Day</strong><br>This registration is for the FREE Future Professionals experience where kids can explore what it means to be a Future Doctor or Dentist!</p>
                </div>
              </div>
              <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
                <p>Exceed Learning Center NY - Future Professionals Series</p>
              </div>
            </div>
          `})}catch(e){console.error("Error sending experience registration email:",e)}return t.status(201).json({message:"Registration successful!"})}catch(e){return console.error("Error saving experience registration",e),t.status(500).json({message:"Something went wrong."})}}i()}catch(e){i(e)}})},7153:(e,t)=>{var r;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return r}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(r||(r={}))},1802:(e,t,r)=>{e.exports=r(145)}};var t=require("../../webpack-api-runtime.js");t.C(e);var r=t(t.s=4992);module.exports=r})();