// // import { useState } from "react";
// // import {
// //   Briefcase,
// //   Clock,
// //   CheckCircle,
// //   XCircle,
// //   FileText,
// //   Eye,
// //   Download,
// //   FileSignature,
// //   Calendar,
// //   User,
// //   Phone,
// //   Mail,
// //   MapPin,
// //   Hash,
// // } from "lucide-react";
// // import { useProposals } from "@/features/application/hooks/useApplication";
// // import {
// //   Card,
// //   CardContent,
// //   CardHeader,
// //   CardTitle,
// // } from "@/shared/components/ui/card";
// // import { Badge } from "@/shared/components/ui/badge";
// // import { Skeleton } from "@/shared/components/ui/skeleton";
// // import { Button } from "@/shared/components/ui/button";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// // } from "@/shared/components/ui/dialog";
// // import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";

// // interface Proposal {
// //   id: number;
// //   vacancy: {
// //     id: number;
// //     status: string;
// //     status_display_ru: string;
// //     comment: string;
// //     fee: string;
// //     created_at: string;
// //   };
// //   lawyer: number;
// //   application?: {
// //     id: string;
// //     document?: {
// //       id: number;
// //       template: number;
// //       file: string;
// //       template_name: string;
// //       signed: boolean;
// //       created_at: string;
// //     } | null;
// //     contract?: {
// //       id: number;
// //       number: string;
// //       date: string;
// //       file: string;
// //       created_at: string;
// //     } | null;
// //     creditor_response?: {
// //       file: string;
// //     } | null;
// //   };
// //   borrower: {
// //     id: number;
// //     full_name: string;
// //     email: string;
// //     phone: string;
// //     iin: string;
// //     address: string;
// //     preferred_lang: string;
// //     created_at: string;
// //   };
// //   fee: string;
// //   comment: string;
// //   status: string;
// //   created_at: string;
// // }

// // export default function Lawyer() {
// //   const [selectedDocument, setSelectedDocument] = useState<{
// //     url: string;
// //     title: string;
// //     type: "document" | "contract" | "response";
// //   } | null>(null);

// //   const [selectedBorrower, setSelectedBorrower] = useState<
// //     Proposal["borrower"] | null
// //   >(null);
// //   const [isBorrowerDialogOpen, setIsBorrowerDialogOpen] = useState(false);

// //   const { data: proposalsData, isLoading } = useProposals();

// //   // Получаем массив результатов из ответа
// //   const proposals = proposalsData?.results || [];

// //   const formatShortDate = (dateString: string) => {
// //     if (!dateString) return "Не указано";
// //     const date = new Date(dateString);
// //     return date.toLocaleDateString("ru-RU", {
// //       day: "2-digit",
// //       month: "2-digit",
// //       year: "numeric",
// //     });
// //   };

// //   const getStatusColor = (status: string) => {
// //     switch (status) {
// //       case "pending":
// //         return "bg-yellow-100 text-yellow-800 border-yellow-200";
// //       case "accepted":
// //         return "bg-green-100 text-green-800 border-green-200";
// //       case "rejected":
// //         return "bg-red-100 text-red-800 border-red-200";
// //       default:
// //         return "bg-gray-100 text-gray-800 border-gray-200";
// //     }
// //   };

// //   const getStatusIcon = (status: string) => {
// //     switch (status) {
// //       case "pending":
// //         return <Clock className="h-4 w-4 text-yellow-600" />;
// //       case "accepted":
// //         return <CheckCircle className="h-4 w-4 text-green-600" />;
// //       case "rejected":
// //         return <XCircle className="h-4 w-4 text-red-600" />;
// //       default:
// //         return null;
// //     }
// //   };

// //   const getStatusText = (status: string) => {
// //     switch (status) {
// //       case "pending":
// //         return "На рассмотрении";
// //       case "accepted":
// //         return "Принято";
// //       case "rejected":
// //         return "Отклонено";
// //       default:
// //         return status;
// //     }
// //   };

// //   const handleViewDocument = (
// //     url: string,
// //     title: string,
// //     type: "document" | "contract" | "response",
// //   ) => {
// //     setSelectedDocument({ url, title, type });
// //   };

// //   const handleCloseDocument = () => {
// //     setSelectedDocument(null);
// //   };

// //   const handleDownloadDocument = (url: string, filename: string) => {
// //     const link = document.createElement("a");
// //     link.href = url;
// //     link.download = filename;
// //     document.body.appendChild(link);
// //     link.click();
// //     document.body.removeChild(link);
// //   };

// //   const handleViewBorrower = (borrower: Proposal["borrower"]) => {
// //     setSelectedBorrower(borrower);
// //     setIsBorrowerDialogOpen(true);
// //   };

// //   const getFileNameFromUrl = (url: string) => {
// //     if (!url) return "document";
// //     const parts = url.split("/");
// //     return parts[parts.length - 1] || "document";
// //   };

// //   const getInitials = (name: string) => {
// //     if (!name) return "?";
// //     return name
// //       .split(" ")
// //       .map((word) => word[0])
// //       .join("")
// //       .toUpperCase()
// //       .slice(0, 2);
// //   };

// //   // Проверяем, есть ли документы для отображения
// //   const hasDocuments = (proposal: Proposal) => {
// //     return (
// //       proposal.application?.document ||
// //       proposal.application?.contract ||
// //       proposal.application?.creditor_response
// //     );
// //   };

// //   if (isLoading) {
// //     return (
// //       <div className="container mx-auto px-4 py-8 max-w-5xl">
// //         <h1 className="text-2xl font-bold text-gray-900 mb-6">
// //           Мои предложения
// //         </h1>
// //         <div className="space-y-4">
// //           {[1, 2, 3].map((i) => (
// //             <Skeleton key={i} className="h-48 w-full" />
// //           ))}
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <>
// //       <div className="container mx-auto px-4 py-8 max-w-5xl">
// //         <h1 className="text-2xl font-bold text-gray-900 mb-6">
// //           Мои предложения
// //         </h1>

// //         {proposals.length === 0 ? (
// //           <Card>
// //             <CardContent className="py-12">
// //               <div className="text-center">
// //                 <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
// //                 <h3 className="text-lg font-medium text-gray-700 mb-2">
// //                   Нет предложений
// //                 </h3>
// //                 <p className="text-gray-500">
// //                   У вас пока нет отправленных предложений
// //                 </p>
// //               </div>
// //             </CardContent>
// //           </Card>
// //         ) : (
// //           <div className="space-y-4">
// //             {proposals.map((proposal: Proposal) => (
// //               <Card
// //                 key={proposal.id}
// //                 className="overflow-hidden hover:shadow-lg transition-shadow"
// //               >
// //                 <CardHeader className="pb-3 bg-gray-50 border-b">
// //                   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
// //                     <div className="flex items-center gap-3">
// //                       <div className="p-2 bg-blue-100 rounded-lg">
// //                         <Briefcase className="h-5 w-5 text-blue-600" />
// //                       </div>
// //                       <div>
// //                         <CardTitle className="text-lg">
// //                           Предложение #{proposal.id}
// //                         </CardTitle>
// //                         <p className="text-sm text-gray-500">
// //                           от {formatShortDate(proposal.created_at)}
// //                         </p>
// //                       </div>
// //                     </div>
// //                     <Badge
// //                       className={`px-3 py-1 text-sm ${getStatusColor(proposal.status)}`}
// //                     >
// //                       <span className="flex items-center gap-1">
// //                         {getStatusIcon(proposal.status)}
// //                         {getStatusText(proposal.status)}
// //                       </span>
// //                     </Badge>
// //                   </div>
// //                 </CardHeader>

// //                 <CardContent className="pt-4">
// //                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //                     {/* Левая колонка - информация о заявке */}
// //                     <div className="lg:col-span-2 space-y-4">
// //                       {/* Информация о вакансии */}
// //                       <div>
// //                         <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
// //                           <FileText className="h-4 w-4 text-blue-600" />
// //                           Информация об обращении
// //                         </h3>
// //                         <div className="bg-gray-50 p-3 rounded-lg space-y-2">
// //                           <div className="flex justify-between items-center">
// //                             <span className="text-sm text-gray-600">
// //                               Статус обращения:
// //                             </span>
// //                             <Badge variant="outline" className="text-xs">
// //                               {proposal.vacancy?.status_display_ru ||
// //                                 "Не указан"}
// //                             </Badge>
// //                           </div>
// //                           <div className="flex justify-between items-center">
// //                             <span className="text-sm text-gray-600">
// //                               Гонорар клиента:
// //                             </span>
// //                             <span className="text-sm font-medium text-gray-900">
// //                               {proposal.vacancy?.fee
// //                                 ? parseFloat(
// //                                     proposal.vacancy.fee,
// //                                   ).toLocaleString()
// //                                 : "0"}{" "}
// //                               ₸
// //                             </span>
// //                           </div>
// //                           <div className="flex justify-between items-center">
// //                             <span className="text-sm text-gray-600">
// //                               Ваш гонорар:
// //                             </span>
// //                             <span className="text-sm font-medium text-green-600">
// //                               {proposal.fee
// //                                 ? parseFloat(proposal.fee).toLocaleString()
// //                                 : "0"}{" "}
// //                               ₸
// //                             </span>
// //                           </div>
// //                           {proposal.vacancy?.comment && (
// //                             <div className="pt-2 border-t border-gray-200">
// //                               <p className="text-sm text-gray-700">
// //                                 <span className="font-medium">
// //                                   Комментарий клиента:
// //                                 </span>{" "}
// //                                 {proposal.vacancy.comment}
// //                               </p>
// //                             </div>
// //                           )}
// //                           {proposal.comment && (
// //                             <div className="pt-2 border-t border-gray-200">
// //                               <p className="text-sm text-gray-700">
// //                                 <span className="font-medium">
// //                                   Ваш комментарий:
// //                                 </span>{" "}
// //                                 {proposal.comment}
// //                               </p>
// //                             </div>
// //                           )}
// //                         </div>
// //                       </div>

// //                       {/* Документы */}
// //                       {hasDocuments(proposal) && (
// //                         <div>
// //                           <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
// //                             <FileText className="h-4 w-4 text-orange-600" />
// //                             Документы
// //                           </h3>
// //                           <div className="space-y-2">
// //                             {/* Документ заявки */}
// //                             {proposal.application?.document && (
// //                               <button
// //                                 onClick={() =>
// //                                   proposal.application?.document &&
// //                                   handleViewDocument(
// //                                     proposal.application.document.file,
// //                                     proposal.application.document.template_name,
// //                                     "document",
// //                                   )
// //                                 }
// //                                 className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group"
// //                               >
// //                                 <div className="flex items-center gap-3 min-w-0">
// //                                   <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
// //                                     <FileSignature className="h-4 w-4 text-blue-600" />
// //                                   </div>
// //                                   <div className="text-left min-w-0">
// //                                     <p className="text-sm font-medium text-gray-900 truncate">
// //                                       {
// //                                         proposal.application.document
// //                                           .template_name
// //                                       }
// //                                     </p>
// //                                     <p className="text-xs text-gray-500">
// //                                       Загружен{" "}
// //                                       {formatShortDate(
// //                                         proposal.application.document
// //                                           .created_at,
// //                                       )}
// //                                       {proposal.application.document.signed &&
// //                                         " • Подписан"}
// //                                     </p>
// //                                   </div>
// //                                 </div>
// //                                 <Eye className="h-4 w-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0 ml-2" />
// //                               </button>
// //                             )}

// //                             {/* Договор */}
// //                             {proposal.application?.contract && (
// //                               <button
// //                                 onClick={() =>
// //                                   proposal.application?.contract &&
// //                                   handleViewDocument(
// //                                     proposal.application.contract.file,
// //                                     `Договор ${proposal.application.contract.number ? `№${proposal.application.contract.number}` : ""}`,
// //                                     "contract",
// //                                   )
// //                                 }
// //                                 className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all group"
// //                               >
// //                                 <div className="flex items-center gap-3 min-w-0">
// //                                   <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
// //                                     <FileText className="h-4 w-4 text-green-600" />
// //                                   </div>
// //                                   <div className="text-left min-w-0">
// //                                     <p className="text-sm font-medium text-gray-900 truncate">
// //                                       Договор{" "}
// //                                       {proposal.application.contract.number
// //                                         ? `№${proposal.application.contract.number}`
// //                                         : ""}
// //                                     </p>
// //                                     <p className="text-xs text-gray-500">
// //                                       от{" "}
// //                                       {formatShortDate(
// //                                         proposal.application.contract.date,
// //                                       )}
// //                                     </p>
// //                                   </div>
// //                                 </div>
// //                                 <Eye className="h-4 w-4 text-gray-400 group-hover:text-green-600 flex-shrink-0 ml-2" />
// //                               </button>
// //                             )}

// //                             {/* Ответ кредитора */}
// //                             {proposal.application?.creditor_response && (
// //                               <button
// //                                 onClick={() =>
// //                                   proposal.application?.creditor_response &&
// //                                   handleViewDocument(
// //                                     proposal.application.creditor_response.file,
// //                                     "Ответ кредитора",
// //                                     "response",
// //                                   )
// //                                 }
// //                                 className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all group"
// //                               >
// //                                 <div className="flex items-center gap-3 min-w-0">
// //                                   <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
// //                                     <FileText className="h-4 w-4 text-purple-600" />
// //                                   </div>
// //                                   <div className="text-left min-w-0">
// //                                     <p className="text-sm font-medium text-gray-900 truncate">
// //                                       Ответ кредитора
// //                                     </p>
// //                                     <p className="text-xs text-purple-600">
// //                                       Файл ответа
// //                                     </p>
// //                                   </div>
// //                                 </div>
// //                                 <Eye className="h-4 w-4 text-gray-400 group-hover:text-purple-600 flex-shrink-0 ml-2" />
// //                               </button>
// //                             )}
// //                           </div>
// //                         </div>
// //                       )}
// //                     </div>

// //                     {/* Правая колонка - информация о заемщике */}
// //                     <div className="lg:col-span-1">
// //                       <div className="bg-gray-50 p-4 rounded-lg">
// //                         <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
// //                           <User className="h-4 w-4 text-green-600" />
// //                           Заемщик
// //                         </h3>

// //                         <div className="space-y-3">
// //                           <button
// //                             onClick={() =>
// //                               handleViewBorrower(proposal.borrower)
// //                             }
// //                             className="w-full text-left hover:bg-white p-2 rounded-lg transition-colors group"
// //                           >
// //                             <div className="flex items-center gap-3">
// //                               <Avatar className="h-10 w-10 border-2 border-green-100">
// //                                 <AvatarFallback className="bg-green-100 text-green-600 font-medium text-sm">
// //                                   {getInitials(
// //                                     proposal.borrower?.full_name || "",
// //                                   )}
// //                                 </AvatarFallback>
// //                               </Avatar>
// //                               <div className="flex-1 min-w-0">
// //                                 <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
// //                                   {proposal.borrower?.full_name || "Не указано"}
// //                                 </p>
// //                                 <p className="text-xs text-gray-500 truncate">
// //                                   {proposal.borrower?.email || "Нет email"}
// //                                 </p>
// //                               </div>
// //                             </div>
// //                           </button>

// //                           <div className="space-y-2 text-sm">
// //                             {proposal.borrower?.phone && (
// //                               <div className="flex items-center gap-2 text-gray-600">
// //                                 <Phone className="h-3.5 w-3.5 flex-shrink-0" />
// //                                 <span className="text-xs truncate">
// //                                   {proposal.borrower.phone}
// //                                 </span>
// //                               </div>
// //                             )}
// //                             {proposal.borrower?.iin && (
// //                               <div className="flex items-center gap-2 text-gray-600">
// //                                 <Hash className="h-3.5 w-3.5 flex-shrink-0" />
// //                                 <span className="text-xs">
// //                                   {proposal.borrower.iin}
// //                                 </span>
// //                               </div>
// //                             )}
// //                             {proposal.borrower?.address && (
// //                               <div className="flex items-center gap-2 text-gray-600">
// //                                 <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
// //                                 <span className="text-xs truncate">
// //                                   {proposal.borrower.address}
// //                                 </span>
// //                               </div>
// //                             )}
// //                           </div>

// //                           <Button
// //                             variant="outline"
// //                             size="sm"
// //                             className="w-full mt-2"
// //                             onClick={() =>
// //                               proposal.borrower &&
// //                               handleViewBorrower(proposal.borrower)
// //                             }
// //                           >
// //                             <User className="h-4 w-4 mr-2" />
// //                             Подробнее
// //                           </Button>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </CardContent>
// //               </Card>
// //             ))}
// //           </div>
// //         )}
// //       </div>

// //       {/* Диалог просмотра документа */}
// //       <Dialog open={!!selectedDocument} onOpenChange={handleCloseDocument}>
// //         <DialogContent className="sm:max-w-[600px] max-w-[90vw] mx-auto max-h-[80vh] overflow-y-auto">
// //           <DialogHeader>
// //             <DialogTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
// //               {selectedDocument?.type === "document" && (
// //                 <FileSignature className="h-5 w-5 text-blue-600" />
// //               )}
// //               {selectedDocument?.type === "contract" && (
// //                 <FileText className="h-5 w-5 text-green-600" />
// //               )}
// //               {selectedDocument?.type === "response" && (
// //                 <FileText className="h-5 w-5 text-purple-600" />
// //               )}
// //               {selectedDocument?.title || "Документ"}
// //             </DialogTitle>
// //           </DialogHeader>

// //           <div className="space-y-4">
// //             {selectedDocument ? (
// //               <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
// //                 <div className="flex items-start gap-3">
// //                   {selectedDocument.type === "document" && (
// //                     <FileSignature
// //                       size={24}
// //                       className="text-blue-600 flex-shrink-0 mt-1"
// //                     />
// //                   )}
// //                   {selectedDocument.type === "contract" && (
// //                     <FileText
// //                       size={24}
// //                       className="text-green-600 flex-shrink-0 mt-1"
// //                     />
// //                   )}
// //                   {selectedDocument.type === "response" && (
// //                     <FileText
// //                       size={24}
// //                       className="text-purple-600 flex-shrink-0 mt-1"
// //                     />
// //                   )}

// //                   <div className="flex-1 min-w-0">
// //                     <h3 className="font-medium text-base mb-4">
// //                       {selectedDocument.title}
// //                     </h3>

// //                     <div className="flex gap-3">
// //                       <a
// //                         href={selectedDocument.url}
// //                         target="_blank"
// //                         rel="noopener noreferrer"
// //                         className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
// //                       >
// //                         <Eye size={16} />
// //                         Просмотреть
// //                       </a>
// //                       <Button
// //                         onClick={() =>
// //                           handleDownloadDocument(
// //                             selectedDocument.url,
// //                             getFileNameFromUrl(selectedDocument.url),
// //                           )
// //                         }
// //                         className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
// //                       >
// //                         <Download size={16} />
// //                         Скачать
// //                       </Button>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             ) : (
// //               <div className="text-center py-8 text-gray-500">
// //                 <FileText size={48} className="mx-auto mb-3 opacity-30" />
// //                 <p>Документ не найден</p>
// //               </div>
// //             )}
// //           </div>
// //         </DialogContent>
// //       </Dialog>

// //       {/* Диалог с информацией о заемщике */}
// //       <Dialog
// //         open={isBorrowerDialogOpen}
// //         onOpenChange={setIsBorrowerDialogOpen}
// //       >
// //         <DialogContent className="sm:max-w-[500px] max-w-[90vw] mx-auto">
// //           <DialogHeader>
// //             <DialogTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
// //               <User className="h-5 w-5 text-green-600" />
// //               Информация о заемщике
// //             </DialogTitle>
// //           </DialogHeader>

// //           {selectedBorrower && (
// //             <div className="space-y-4">
// //               <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
// //                 <Avatar className="h-16 w-16 border-2 border-green-100">
// //                   <AvatarFallback className="bg-green-100 text-green-600 font-medium text-xl">
// //                     {getInitials(selectedBorrower.full_name)}
// //                   </AvatarFallback>
// //                 </Avatar>
// //                 <div>
// //                   <h3 className="text-lg font-semibold text-gray-900">
// //                     {selectedBorrower.full_name}
// //                   </h3>
// //                   <p className="text-sm text-gray-500">
// //                     ID: {selectedBorrower.id}
// //                   </p>
// //                 </div>
// //               </div>

// //               <div className="grid grid-cols-1 gap-3">
// //                 {selectedBorrower.email && (
// //                   <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
// //                     <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
// //                     <div>
// //                       <p className="text-xs text-gray-500">Email</p>
// //                       <p className="text-sm font-medium text-gray-900">
// //                         {selectedBorrower.email}
// //                       </p>
// //                     </div>
// //                   </div>
// //                 )}

// //                 {selectedBorrower.phone && (
// //                   <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
// //                     <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
// //                     <div>
// //                       <p className="text-xs text-gray-500">Телефон</p>
// //                       <p className="text-sm font-medium text-gray-900">
// //                         {selectedBorrower.phone}
// //                       </p>
// //                     </div>
// //                   </div>
// //                 )}

// //                 {selectedBorrower.iin && (
// //                   <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
// //                     <Hash className="h-5 w-5 text-gray-400 mt-0.5" />
// //                     <div>
// //                       <p className="text-xs text-gray-500">ИИН</p>
// //                       <p className="text-sm font-medium text-gray-900">
// //                         {selectedBorrower.iin}
// //                       </p>
// //                     </div>
// //                   </div>
// //                 )}

// //                 {selectedBorrower.address && (
// //                   <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
// //                     <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
// //                     <div>
// //                       <p className="text-xs text-gray-500">Адрес</p>
// //                       <p className="text-sm font-medium text-gray-900">
// //                         {selectedBorrower.address}
// //                       </p>
// //                     </div>
// //                   </div>
// //                 )}

// //                 <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
// //                   <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
// //                   <div>
// //                     <p className="text-xs text-gray-500">Дата регистрации</p>
// //                     <p className="text-sm font-medium text-gray-900">
// //                       {formatShortDate(selectedBorrower.created_at)}
// //                     </p>
// //                   </div>
// //                 </div>

// //                 <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
// //                   <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
// //                   <div>
// //                     <p className="text-xs text-gray-500">Предпочитаемый язык</p>
// //                     <p className="text-sm font-medium text-gray-900">
// //                       {selectedBorrower.preferred_lang === "ru"
// //                         ? "Русский"
// //                         : selectedBorrower.preferred_lang === "kk"
// //                           ? "Қазақша"
// //                           : selectedBorrower.preferred_lang || "Не указан"}
// //                     </p>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           )}
// //         </DialogContent>
// //       </Dialog>
// //     </>
// //   );
// // }


import { useState, useEffect } from "react";
import {
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Eye,
  Download,
  FileSignature,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  Hash,
  Languages,
  X,
} from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useProposals } from "@/features/application/hooks/useApplication";

interface Proposal {
  id: number;
  vacancy: {
    id: number;
    status: string;
    status_display_ru: string;
    comment: string;
    fee: string;
    created_at: string;
  };
  lawyer: number;
  application?: {
    id: string;
    document?: {
      id: number;
      template: number;
      file: string;
      template_name: string;
      signed: boolean;
      created_at: string;
    } | null;
    contract?: {
      id: number;
      number: string;
      date: string;
      file: string;
      created_at: string;
    } | null;
    creditor_response?: {
      file: string;
    } | null;
  } | null;
  borrower: {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    iin: string;
    address: string;
    preferred_lang: string;
    created_at: string;
  };
  fee: string;
  comment: string;
  status: string;
  created_at: string;
}

/*
const MOCK_PROPOSALS: Proposal[] = [
  {
    id: 1,
    status: "accepted",
    created_at: "2026-03-31T10:00:00Z",
    fee: "1111",
    comment: "asdasd",
    vacancy: {
      id: 1,
      status: "completed",
      status_display_ru: "Завершена",
      comment: "qweqwe",
      fee: "1111",
      created_at: "2026-03-10T10:00:00Z",
    },
    lawyer: 1,
    application: {
      id: "app-1",
      document: {
        id: 1,
        template: 1,
        file: "https://example.com/doc.pdf",
        template_name: "Заявление о банкротстве",
        signed: true,
        created_at: "2026-03-16T10:00:00Z",
      },
      contract: {
        id: 1,
        number: "111",
        date: "2026-03-19T10:00:00Z",
        file: "https://example.com/contract.pdf",
        created_at: "2026-03-19T10:00:00Z",
      },
      creditor_response: null,
    },
    borrower: {
      id: 10,
      full_name: "ФИО",
      email: "test@gmail.com",
      phone: "77777777777",
      iin: "aaasd",
      address: "г. Алматы",
      preferred_lang: "ru",
      created_at: "2025-01-01T00:00:00Z",
    },
  },
  {
    id: 2,
    status: "pending",
    created_at: "2026-03-28T10:00:00Z",
    fee: "250000",
    comment: "Готов взяться за дело",
    vacancy: {
      id: 2,
      status: "open",
      status_display_ru: "Открыто",
      comment: "Нужна помощь по спору с банком",
      fee: "300000",
      created_at: "2026-03-25T10:00:00Z",
    },
    lawyer: 1,
    application: {
      id: "app-2",
      document: null,
      contract: null,
      creditor_response: { file: "https://example.com/response.pdf" },
    },
    borrower: {
      id: 11,
      full_name: "Сейткали Айгерим Маратовна",
      email: "aigerim@example.com",
      phone: "+7 702 987 65 43",
      iin: "950505401234",
      address: "г. Астана, пр. Республики 5",
      preferred_lang: "kk",
      created_at: "2025-06-15T00:00:00Z",
    },
  },
  {
    id: 3,
    status: "rejected",
    created_at: "2026-03-20T10:00:00Z",
    fee: "100000",
    comment: "",
    vacancy: {
      id: 3,
      status: "closed",
      status_display_ru: "Закрыто",
      comment: "",
      fee: "120000",
      created_at: "2026-03-18T10:00:00Z",
    },
    lawyer: 1,
    application: null,
    borrower: {
      id: 12,
      full_name: "Петров Сергей Александрович",
      email: "petrov@example.com",
      phone: "+7 705 555 11 22",
      iin: "880220300456",
      address: "г. Шымкент, ул. Байтурсынова 3",
      preferred_lang: "ru",
      created_at: "2024-12-01T00:00:00Z",
    },
  },
];
*/

// ─── Кастомная модалка ───────────────────────────────────────────────
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
}

function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{ background: "rgba(0,0,0,0.4)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col"
        style={{ maxHeight: "calc(100vh - 2.5rem)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5 text-base font-medium text-gray-900">
            {title}
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 pt-5 pb-6 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Основной компонент ──────────────────────────────────────────────
export default function Lawyer() {
  const [selectedDocument, setSelectedDocument] = useState<{
    url: string;
    title: string;
    type: "document" | "contract" | "response";
  } | null>(null);

  const [selectedBorrower, setSelectedBorrower] = useState<
    Proposal["borrower"] | null
  >(null);

  // Реальные данные с сервера
  const { data: proposalsData, isLoading } = useProposals();
  const proposals: Proposal[] = proposalsData?.results || [];

  // Мок (закомментирован):
  // const isLoading = false;
  // const proposals = MOCK_PROPOSALS;

  const formatShortDate = (dateString: string) => {
    if (!dateString) return "Не указано";
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          className: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <Clock className="h-3.5 w-3.5" />,
          label: "На рассмотрении",
        };
      case "accepted":
        return {
          className: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <CheckCircle className="h-3.5 w-3.5" />,
          label: "Принято",
        };
      case "rejected":
        return {
          className: "bg-red-50 text-red-700 border-red-200",
          icon: <XCircle className="h-3.5 w-3.5" />,
          label: "Отклонено",
        };
      default:
        return {
          className: "bg-gray-100 text-gray-600 border-gray-200",
          icon: null,
          label: status,
        };
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  };

  const getFileNameFromUrl = (url: string) => {
    const parts = url.split("/");
    return parts[parts.length - 1] || "document";
  };

  const handleDownload = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = getFileNameFromUrl(url);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasDocuments = (proposal: Proposal) =>
    proposal.application?.document ||
    proposal.application?.contract ||
    proposal.application?.creditor_response;

  const docTypeConfig = {
    document: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      hover: "hover:border-blue-200 hover:bg-blue-50/40",
      eyeHover: "group-hover:text-blue-500",
    },
    contract: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      hover: "hover:border-emerald-200 hover:bg-emerald-50/40",
      eyeHover: "group-hover:text-emerald-500",
    },
    response: {
      bg: "bg-violet-50",
      text: "text-violet-600",
      hover: "hover:border-violet-200 hover:bg-violet-50/40",
      eyeHover: "group-hover:text-violet-500",
    },
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-52 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900">Мои предложения</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {proposals.length} обращени{proposals.length === 1 ? "е" : "я"}
          </p>
        </div>

        {proposals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <Briefcase className="h-7 w-7 text-gray-400" />
            </div>
            <p className="text-base font-medium text-gray-700 mb-1">Нет предложений</p>
            <p className="text-sm text-gray-400">У вас пока нет отправленных предложений</p>
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal, index) => {
              const status = getStatusConfig(proposal.status);
              return (
                <div
                  key={proposal.id}
                  className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="flex items-center justify-between gap-3 px-5 py-4 bg-gray-50/70 border-b border-gray-100 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                        <Briefcase className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Предложение #{proposal.id}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          от {formatShortDate(proposal.created_at)}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${status.className}`}>
                      {status.icon}
                      {status.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                    <div className="lg:col-span-2 p-5 space-y-5">
                      <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5" />
                          Информация об обращении
                        </p>
                        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Статус обращения</span>
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                              {proposal.vacancy?.status_display_ru || "—"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Гонорар клиента</span>
                            <span className="text-sm font-medium text-gray-800">
                              {proposal.vacancy?.fee ? parseFloat(proposal.vacancy.fee).toLocaleString("ru-RU") : "0"} ₸
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Ваш гонорар</span>
                            <span className="text-sm font-medium text-emerald-600">
                              {proposal.fee ? parseFloat(proposal.fee).toLocaleString("ru-RU") : "0"} ₸
                            </span>
                          </div>
                          {(proposal.vacancy?.comment || proposal.comment) && (
                            <div className="pt-3 border-t border-gray-200 space-y-2">
                              {proposal.vacancy?.comment && (
                                <p className="text-xs text-gray-500 leading-relaxed">
                                  <span className="font-medium text-gray-600">Клиент: </span>
                                  {proposal.vacancy.comment}
                                </p>
                              )}
                              {proposal.comment && (
                                <p className="text-xs text-gray-500 leading-relaxed">
                                  <span className="font-medium text-gray-600">Вы: </span>
                                  {proposal.comment}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {hasDocuments(proposal) && (
                        <div>
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5" />
                            Документы
                          </p>
                          <div className="space-y-2">
                            {proposal.application?.document && (() => {
                              const d = proposal.application!.document!;
                              const cfg = docTypeConfig.document;
                              return (
                                <button
                                  onClick={() => setSelectedDocument({ url: d.file, title: d.template_name, type: "document" })}
                                  className={`w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white ${cfg.hover} transition-all group text-left`}
                                >
                                  <div className={`h-9 w-9 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>
                                    <FileSignature className={`h-4 w-4 ${cfg.text}`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">{d.template_name}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                      {formatShortDate(d.created_at)}{d.signed && " · Подписан"}
                                    </p>
                                  </div>
                                  <Eye className={`h-4 w-4 text-gray-300 ${cfg.eyeHover} shrink-0 transition-colors`} />
                                </button>
                              );
                            })()}

                            {proposal.application?.contract && (() => {
                              const c = proposal.application!.contract!;
                              const cfg = docTypeConfig.contract;
                              const title = `Договор${c.number ? ` №${c.number}` : ""}`;
                              return (
                                <button
                                  onClick={() => setSelectedDocument({ url: c.file, title, type: "contract" })}
                                  className={`w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white ${cfg.hover} transition-all group text-left`}
                                >
                                  <div className={`h-9 w-9 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>
                                    <FileText className={`h-4 w-4 ${cfg.text}`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">{title}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">от {formatShortDate(c.date)}</p>
                                  </div>
                                  <Eye className={`h-4 w-4 text-gray-300 ${cfg.eyeHover} shrink-0 transition-colors`} />
                                </button>
                              );
                            })()}

                            {proposal.application?.creditor_response && (() => {
                              const r = proposal.application!.creditor_response!;
                              const cfg = docTypeConfig.response;
                              return (
                                <button
                                  onClick={() => setSelectedDocument({ url: r.file, title: "Ответ кредитора", type: "response" })}
                                  className={`w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white ${cfg.hover} transition-all group text-left`}
                                >
                                  <div className={`h-9 w-9 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>
                                    <FileText className={`h-4 w-4 ${cfg.text}`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">Ответ кредитора</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Файл ответа</p>
                                  </div>
                                  <Eye className={`h-4 w-4 text-gray-300 ${cfg.eyeHover} shrink-0 transition-colors`} />
                                </button>
                              );
                            })()}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="lg:col-span-1 p-5">
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        Заёмщик
                      </p>
                      <div className="rounded-xl bg-blue-50/60 border border-blue-100 p-4">
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="h-10 w-10 shrink-0">
                            <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">
                              {getInitials(proposal.borrower?.full_name || "")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {proposal.borrower?.full_name || "Не указано"}
                            </p>
                            <p className="text-xs text-gray-400 truncate mt-0.5">
                              {proposal.borrower?.email || ""}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2 mb-4">
                          {proposal.borrower?.phone && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Phone className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                              <span className="truncate">{proposal.borrower.phone}</span>
                            </div>
                          )}
                          {proposal.borrower?.iin && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Hash className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                              <span>{proposal.borrower.iin}</span>
                            </div>
                          )}
                          {proposal.borrower?.address && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                              <span className="truncate">{proposal.borrower.address}</span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => proposal.borrower && setSelectedBorrower(proposal.borrower)}
                          className="w-full py-2 rounded-lg border border-blue-200 bg-white text-blue-600 text-xs font-medium hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all flex items-center justify-center gap-1.5"
                        >
                          <User className="h-3.5 w-3.5" />
                          Подробнее
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        open={!!selectedDocument}
        onClose={() => setSelectedDocument(null)}
        title={
          <>
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
              selectedDocument?.type === "document" ? "bg-blue-50" :
              selectedDocument?.type === "contract" ? "bg-emerald-50" : "bg-violet-50"
            }`}>
              {selectedDocument?.type === "document"
                ? <FileSignature className="h-4 w-4 text-blue-600" />
                : <FileText className={`h-4 w-4 ${selectedDocument?.type === "contract" ? "text-emerald-600" : "text-violet-600"}`} />
              }
            </div>
            <span>{selectedDocument?.title || "Документ"}</span>
          </>
        }
      >
        {selectedDocument && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{selectedDocument.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">PDF документ</p>
              </div>
            </div>
            <div className="flex gap-3">
              <a
                href={selectedDocument.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
              >
                <Eye className="h-4 w-4" />
                Просмотреть
              </a>
              <button
                onClick={() => handleDownload(selectedDocument.url)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
              >
                <Download className="h-4 w-4" />
                Скачать
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={!!selectedBorrower}
        onClose={() => setSelectedBorrower(null)}
        title={
          <>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
              <User className="h-4 w-4 text-emerald-600" />
            </div>
            <span>Информация о заёмщике</span>
          </>
        }
      >
        {selectedBorrower && (
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-blue-50/60 rounded-xl border border-blue-100">
              <Avatar className="h-12 w-12 shrink-0">
                <AvatarFallback className="bg-blue-100 text-blue-700 text-base font-medium">
                  {getInitials(selectedBorrower.full_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-900">{selectedBorrower.full_name}</p>
                <p className="text-xs text-gray-400 mt-0.5">ID: {selectedBorrower.id}</p>
              </div>
            </div>
            {selectedBorrower.email && (
              <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl">
                <Mail className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wide">Email</p>
                  <p className="text-sm font-medium text-gray-800 mt-0.5">{selectedBorrower.email}</p>
                </div>
              </div>
            )}
            {selectedBorrower.phone && (
              <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl">
                <Phone className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wide">Телефон</p>
                  <p className="text-sm font-medium text-gray-800 mt-0.5">{selectedBorrower.phone}</p>
                </div>
              </div>
            )}
            {selectedBorrower.iin && (
              <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl">
                <Hash className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wide">ИИН</p>
                  <p className="text-sm font-medium text-gray-800 mt-0.5">{selectedBorrower.iin}</p>
                </div>
              </div>
            )}
            {selectedBorrower.address && (
              <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wide">Адрес</p>
                  <p className="text-sm font-medium text-gray-800 mt-0.5">{selectedBorrower.address}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl">
              <Calendar className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] text-gray-400 uppercase tracking-wide">Дата регистрации</p>
                <p className="text-sm font-medium text-gray-800 mt-0.5">{formatShortDate(selectedBorrower.created_at)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl">
              <Languages className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] text-gray-400 uppercase tracking-wide">Язык</p>
                <p className="text-sm font-medium text-gray-800 mt-0.5">
                  {selectedBorrower.preferred_lang === "ru" ? "Русский" :
                   selectedBorrower.preferred_lang === "kk" ? "Қазақша" :
                   selectedBorrower.preferred_lang || "Не указан"}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}