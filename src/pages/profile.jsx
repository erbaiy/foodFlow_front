// "use client"
// import { MapPin, Phone, Briefcase, Heart } from "lucide-react"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// // Import OrderList component - assuming it's been converted to work with Next.js
// import OrderList from "./OrderList"

// export default function Profile() {
//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Profile Header */}
//       <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
//         <div className="w-24 h-24 bg-white rounded-full border-4 border-orange-500 shadow-lg flex items-center justify-center">
//           <span className="text-2xl font-bold text-gray-700">AM</span>
//         </div>
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">Aman</h1>
//           <div className="flex items-center mt-2 text-gray-600">
//             <MapPin className="w-4 h-4 text-orange-500 mr-2" />
//             <span>London, United Kingdom</span>
//           </div>
//         </div>
//       </div>

//       <Tabs defaultValue="about" className="w-full">
//         <TabsList className="grid w-full grid-cols-2">
//           <TabsTrigger value="about">About</TabsTrigger>
//           <TabsTrigger value="orders">Orders</TabsTrigger>
//         </TabsList>

//         <TabsContent value="about">
//           <div className="bg-white shadow rounded-lg p-4">
//             <h2 className="text-lg font-semibold text-gray-800 bg-orange-50 p-2 rounded">About</h2>
//             <div className="space-y-4 mt-4">
//               {/* Work */}
//               <div className="flex items-center space-x-3">
//                 <Briefcase className="w-5 h-5 text-orange-500" />
//                 <span className="text-gray-700">Designer at Jeep Renegade</span>
//               </div>

//               {/* Relationship */}
//               <div className="flex items-center space-x-3">
//                 <Heart className="w-5 h-5 text-orange-500" />
//                 <span className="text-gray-700">In a relationship with Craig Reid</span>
//               </div>

//               {/* Location */}
//               <div className="flex items-center space-x-3">
//                 <MapPin className="w-5 h-5 text-orange-500" />
//                 <span className="text-gray-700">Lives in London, United Kingdom</span>
//               </div>

//               {/* Contact */}
//               <div className="flex items-center space-x-3">
//                 <Phone className="w-5 h-5 text-orange-500" />
//                 <span className="text-gray-700">+420 755 666 214</span>
//               </div>
//             </div>
//           </div>
//         </TabsContent>

//         <TabsContent value="orders">
//           <OrderList />
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

