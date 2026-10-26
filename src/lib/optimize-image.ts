import { MAX_UPLOAD_BYTES, MAX_IMAGE_WIDTH } from "./cms-schema";
export async function optimizeImage(file:File){
  if(!["image/jpeg","image/png","image/webp"].includes(file.type)||file.size>20_000_000)throw new Error("Choose a JPEG, PNG or WebP smaller than 20 MB.");
  const bitmap=await createImageBitmap(file,{imageOrientation:"from-image"});
  const ratio=Math.min(1,MAX_IMAGE_WIDTH/bitmap.width,3840/bitmap.height);
  const canvas=document.createElement("canvas");canvas.width=Math.round(bitmap.width*ratio);canvas.height=Math.round(bitmap.height*ratio);
  const context=canvas.getContext("2d");if(!context){bitmap.close();throw new Error("Image preview unavailable.");}
  context.fillStyle="white";context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();
  // Server re-encodes at quality 85; reduce dimensions until that encoding fits.
  const jpeg=await import("jpeg-js");
  for(let i=0;i<12;i++){
    const pixels=context.getImageData(0,0,canvas.width,canvas.height);const encoded=jpeg.encode({data:pixels.data,width:canvas.width,height:canvas.height},85);
    if(encoded.data.length<MAX_UPLOAD_BYTES-2000)return new File([new Uint8Array(encoded.data)],"optimized.jpg",{type:"image/jpeg"});
    const temp=document.createElement("canvas");temp.width=Math.round(canvas.width*.85);temp.height=Math.round(canvas.height*.85);temp.getContext("2d")?.drawImage(canvas,0,0,temp.width,temp.height);canvas.width=temp.width;canvas.height=temp.height;context.drawImage(temp,0,0);
  }
  throw new Error("Could not reduce this photo below 200 KB.");
}